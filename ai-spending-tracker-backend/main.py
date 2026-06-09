import os
from pathlib import Path
from typing import Literal

from dotenv import load_dotenv
import firebase_admin
from fastapi import FastAPI, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from firebase_admin import auth, credentials, firestore
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


app = FastAPI(title="AI Spending Tracker API")
app.state.firestore_db = initialize_firestore()

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


@app.post("/transactions", response_model=Transaction, status_code=201)
def create_transaction(request: Request, transaction: Transaction) -> Transaction:
    # print_request_headers("POST /transactions", request)
    uid = get_request_uid(request)
    app.state.firestore_db.collection("transactions").add({
        **transaction.dict(),
        "uid": uid,
    })
    return transaction
