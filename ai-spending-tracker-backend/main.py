from typing import Literal

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


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


app = FastAPI(title="AI Spending Tracker API")

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
    return transactions


@app.post("/transactions", response_model=Transaction, status_code=201)
def create_transaction(transaction: Transaction) -> Transaction:
    transactions.append(transaction)
    return transaction
