import os
from pathlib import Path
from typing import Literal

from dotenv import load_dotenv
import firebase_admin
from fastapi import FastAPI, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from firebase_admin import auth, credentials, firestore
from google import genai
from pydantic import BaseModel


BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")


TransactionCategory = Literal[
    "food-dining",
    "housing",
    "shopping",
    "transport",
    "salary",
    "utilities",
    "other",
]


class Transaction(BaseModel):
    amount: str
    category: TransactionCategory
    transactionDate: str
    note: str


class PromptRequest(BaseModel):
    prompt: str
    model: str = "gemini-3.5-flash"


class PromptResponse(BaseModel):
    answer: str


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


@app.post("/ai/answer", response_model=PromptResponse)
def answer_prompt(prompt_request: PromptRequest) -> PromptResponse:
    prompt = prompt_request.prompt.strip()

    if not prompt:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Prompt must not be empty.",
        )

    try:
        interaction = app.state.genai_client.interactions.create(
            model=prompt_request.model,
            input=prompt,
        )
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Failed to generate AI response.",
        ) from error

    return PromptResponse(answer=interaction.output_text or "")


@app.post("/transactions", response_model=Transaction, status_code=201)
def create_transaction(request: Request, transaction: Transaction) -> Transaction:
    # print_request_headers("POST /transactions", request)
    uid = get_request_uid(request)
    app.state.firestore_db.collection("transactions").add({
        **transaction.dict(),
        "uid": uid,
    })
    return transaction
