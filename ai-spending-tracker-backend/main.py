from typing import Literal

from fastapi import FastAPI
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


class ManualExpenseDraft(BaseModel):
    amount: str
    currency: CurrencyCode
    category: TransactionCategory
    transactionDate: str
    note: str


app = FastAPI(title="AI Spending Tracker API")

transactions: list[ManualExpenseDraft] = [
]


@app.get("/transactions", response_model=list[ManualExpenseDraft])
def get_transactions() -> list[ManualExpenseDraft]:
    return transactions


@app.post("/transactions", response_model=ManualExpenseDraft, status_code=201)
def create_transaction(transaction: ManualExpenseDraft) -> ManualExpenseDraft:
    print(f"Received transaction: {transaction}")
    transactions.append(transaction)
    return transaction
