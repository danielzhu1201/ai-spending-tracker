import base64
import os
from pathlib import Path
from typing import Literal

from dotenv import load_dotenv
import firebase_admin
from fastapi import FastAPI, File, HTTPException, Request, UploadFile, status
from fastapi.middleware.cors import CORSMiddleware
from firebase_admin import auth, credentials, firestore
from google import genai
from pydantic import BaseModel, Field


BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")


TransactionCategory = Literal[
    "",
    "food-dining",
    "housing",
    "shopping",
    "transport",
    "salary",
    "utilities",
    "other",
]


class Transaction(BaseModel):
    amount: str = Field(
        description=(
            "The receipt total as a positive decimal string with no currency "
            "symbol, for example '63.47'. Return an empty string if the total "
            "is missing, illegible, or uncertain."
        )
    )
    category: TransactionCategory = Field(
        description=(
            "The best spending category for the receipt. Use food-dining for "
            "restaurants or groceries, shopping for retail purchases, transport "
            "for gas/rides/transit, utilities for bills, housing for rent or "
            "home expenses, and other when no category clearly fits. Return an "
            "empty string if there is not enough legible evidence to choose a "
            "category confidently."
        )
    )
    transactionDate: str = Field(
        description=(
            "The purchase date from the receipt in YYYY-MM-DD format. Return "
            "an empty string if the date is missing, illegible, incomplete, or "
            "uncertain."
        )
    )
    note: str = Field(
        description=(
            "A short human-readable note for the transaction, preferably the "
            "merchant name plus useful receipt context. Return an empty string "
            "if the merchant or context is missing, illegible, or uncertain."
        )
    )

def get_firebase_credentials_path() -> Path:
    credentials_path = os.getenv("FIREBASE_CREDENTIALS_PATH")

    if not credentials_path:
        raise RuntimeError(
            "FIREBASE_CREDENTIALS_PATH is not set. Add it to "
            "ai-spending-tracker-backend/.env."
        )

    path = Path(credentials_path).expanduser()
    if not path.is_absolute():
        path = BASE_DIR / path

    path = path.resolve()
    if not path.exists():
        raise RuntimeError(f"Firebase credentials file was not found at {path}.")

    return path


def initialize_firestore():
    if not firebase_admin._apps:
        cred = credentials.Certificate(str(get_firebase_credentials_path()))
        firebase_admin.initialize_app(cred)

    return firestore.client()


def initialize_genai_client():
    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key:
        raise RuntimeError(
            "GEMINI_API_KEY is not set. Add it to "
            "ai-spending-tracker-backend/.env."
        )

    return genai.Client(api_key=api_key)


app = FastAPI(title="AI Spending Tracker API")
app.state.firestore_db = initialize_firestore()
app.state.genai_client = initialize_genai_client()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type", "Authorization"],
)

transactions: list[Transaction] = [
]


def print_request_headers(endpoint: str, request: Request) -> None:
    headers = dict(request.headers)
    print(f"{endpoint} headers: {headers}")


def get_request_uid(request: Request) -> str:
    authorization = request.headers.get("authorization")

    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing Authorization header.",
        )

    scheme, _, id_token = authorization.partition(" ")

    if scheme.lower() != "bearer" or not id_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header must be a Bearer token.",
        )

    try:
        decoded_token = auth.verify_id_token(id_token)
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Firebase ID token.",
        ) from error

    uid = decoded_token["uid"]
    print(f"Decoded Firebase uid: {uid}")

    return uid


@app.get("/transactions", response_model=list[Transaction])
def get_transactions(request: Request) -> list[Transaction]:
    # print_request_headers("GET /transactions", request)
    uid = get_request_uid(request)
    docs = (
        app.state.firestore_db.collection("transactions")
        .where("uid", "==", uid)
        .stream()
    )
    return [Transaction(**doc.to_dict()) for doc in docs]


@app.post("/receipts/upload", response_model=Transaction)
async def upload_receipt(
    request: Request,
    receipt: UploadFile | None = File(default=None),
) -> Transaction:
    # print_request_headers("POST /receipts/upload", request)
    get_request_uid(request)

    if receipt is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Receipt image is required.",
        )

    if not (receipt.content_type or "").startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Receipt upload must be an image file.",
        )

    image_bytes = await receipt.read()
    if not image_bytes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Receipt image must not be empty.",
        )

    image_base64 = base64.b64encode(image_bytes).decode("utf-8")
    prompt = """
Parse this receipt image into one spending transaction.
Return only JSON that matches the Transaction schema.
Prioritize accuracy over completeness.
Do not guess, infer aggressively, or fill fields from weak evidence.
Use the final receipt total for amount only when it is clearly legible.
Use YYYY-MM-DD for transactionDate only when a complete date is clearly legible.
Use a concise note based on the merchant and receipt context only when clearly legible.
For any field that is missing, illegible, incomplete, ambiguous, or uncertain, return an empty string for that field.
""".strip()

    try:
        interaction = app.state.genai_client.interactions.create(
            model="gemini-3.1-flash-lite",
            input=[
                {"type": "text", "text": prompt},
                {
                    "type": "image",
                    "data": image_base64,
                    "mime_type": receipt.content_type,
                },
            ],
            response_format={
                "type": "text",
                "mime_type": "application/json",
                "schema": Transaction.model_json_schema(),
            }
        )
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Failed to extract transaction from receipt image.",
        ) from error

    try:
        return Transaction.model_validate_json(interaction.output_text or "")
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Receipt extraction returned invalid transaction data.",
        ) from error


@app.post("/transactions", response_model=Transaction, status_code=201)
def create_transaction(request: Request, transaction: Transaction) -> Transaction:
    # print_request_headers("POST /transactions", request)
    uid = get_request_uid(request)
    app.state.firestore_db.collection("transactions").add({
        **transaction.dict(),
        "uid": uid,
    })
    return transaction
