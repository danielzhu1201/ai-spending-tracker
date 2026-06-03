import os
from pathlib import Path
from typing import Literal

from dotenv import load_dotenv
import firebase_admin
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from firebase_admin import credentials, firestore
from pydantic import BaseModel


BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")


CurrencyCode = Literal["USD"]
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
    currency: CurrencyCode
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
    allow_headers=["Content-Type"],
)

transactions: list[Transaction] = [
]


@app.get("/transactions", response_model=list[Transaction])
def get_transactions() -> list[Transaction]:
    docs = app.state.firestore_db.collection("transactions").stream()
    return [Transaction(**doc.to_dict()) for doc in docs]


@app.post("/transactions", response_model=Transaction, status_code=201)
def create_transaction(transaction: Transaction) -> Transaction:
    app.state.firestore_db.collection("transactions").add(transaction.dict())
    return transaction
