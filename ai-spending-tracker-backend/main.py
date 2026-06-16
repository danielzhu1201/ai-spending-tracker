import base64
import json
import os
from datetime import date, datetime, timedelta
from pathlib import Path
from time import time
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
InsightRange = Literal["weekly", "monthly", "yearly"]


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


class InsightCard(BaseModel):
    id: str
    title: str
    description: str
    icon: str


class InsightAnalysisResponse(BaseModel):
    insights: list[InsightCard]


class DashboardResponse(BaseModel):
    currentMonthSpend: float
    recentTransactions: list[Transaction]


FIREBASE_SERVICE_ACCOUNT_ENV_FIELDS = {
    "type": "FIREBASE_TYPE",
    "project_id": "FIREBASE_PROJECT_ID",
    "private_key_id": "FIREBASE_PRIVATE_KEY_ID",
    "private_key": "FIREBASE_PRIVATE_KEY",
    "client_email": "FIREBASE_CLIENT_EMAIL",
    "client_id": "FIREBASE_CLIENT_ID",
    "auth_uri": "FIREBASE_AUTH_URI",
    "token_uri": "FIREBASE_TOKEN_URI",
    "auth_provider_x509_cert_url": "FIREBASE_AUTH_PROVIDER_X509_CERT_URL",
    "client_x509_cert_url": "FIREBASE_CLIENT_X509_CERT_URL",
}


def get_firebase_credentials_path() -> Path:
    credentials_path = os.getenv("FIREBASE_CREDENTIALS_PATH")

    if not credentials_path:
        raise RuntimeError(
            "Firebase credentials are not configured. Set the Firebase service "
            "account environment variables, or set FIREBASE_CREDENTIALS_PATH "
            "for local development."
        )

    path = Path(credentials_path).expanduser()
    if not path.is_absolute():
        path = BASE_DIR / path

    path = path.resolve()
    if not path.exists():
        raise RuntimeError(f"Firebase credentials file was not found at {path}.")

    return path


def get_firebase_credentials_config() -> dict[str, str]:
    service_account = {
        json_key: os.getenv(env_key)
        for json_key, env_key in FIREBASE_SERVICE_ACCOUNT_ENV_FIELDS.items()
    }

    missing_env_keys = [
        env_key
        for json_key, env_key in FIREBASE_SERVICE_ACCOUNT_ENV_FIELDS.items()
        if not service_account[json_key]
    ]

    if missing_env_keys:
        if os.getenv("FIREBASE_CREDENTIALS_PATH"):
            return {}

        if len(missing_env_keys) == len(FIREBASE_SERVICE_ACCOUNT_ENV_FIELDS):
            return {}

        raise RuntimeError(
            "Incomplete Firebase service account environment config. Missing: "
            f"{', '.join(missing_env_keys)}."
        )

    service_account["private_key"] = service_account["private_key"].replace(
        "\\n",
        "\n",
    )

    universe_domain = os.getenv("FIREBASE_UNIVERSE_DOMAIN")
    if universe_domain:
        service_account["universe_domain"] = universe_domain

    return service_account


def initialize_firestore():
    if not firebase_admin._apps:
        credentials_config = get_firebase_credentials_config()
        cred = credentials.Certificate(
            credentials_config or str(get_firebase_credentials_path())
        )
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
app.state.insights_cache = {}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type", "Authorization"],
)

transactions: list[Transaction] = [
]

INSIGHTS_CACHE_TTL_SECONDS = 24 * 60 * 60
MAX_INSIGHTS = 3
MIN_TRANSACTIONS_FOR_INSIGHTS = 3
GEMINI_MODEL = "gemini-3.1-flash-lite"
INSIGHT_ICON_NAMES = [
    "restaurant",
    "home",
    "payments",
    "shopping_bag",
    "local_cafe",
    "commute",
    "directions_car",
    "contactless",
    "credit_card",
    "account_balance",
    "autorenew",
    "more_horiz",
    "auto_awesome",
    "lightbulb",
    "pie_chart",
    "savings",
    "subscriptions",
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


def get_current_period_interval(range: InsightRange) -> tuple[date, date]:
    today = date.today()

    if range == "weekly":
        return today - timedelta(days=today.weekday()), today

    if range == "monthly":
        return today.replace(day=1), today

    return today.replace(month=1, day=1), today


def parse_transaction_date(transaction_date: str) -> date | None:
    try:
        return datetime.strptime(transaction_date, "%Y-%m-%d").date()
    except ValueError:
        return None


def get_user_transactions(uid: str) -> list[Transaction]:
    docs = (
        app.state.firestore_db.collection("transactions")
        .where("uid", "==", uid)
        .stream()
    )

    user_transactions: list[Transaction] = []

    for doc in docs:
        try:
            user_transactions.append(Transaction(**doc.to_dict()))
        except Exception:
            continue

    return user_transactions


def get_transactions_for_interval(
    uid: str,
    start_date: date,
    end_date: date,
) -> list[Transaction]:
    interval_transactions: list[Transaction] = []

    for transaction in get_user_transactions(uid):
        transaction_date = parse_transaction_date(transaction.transactionDate)

        if transaction_date is None:
            continue

        if start_date <= transaction_date <= end_date:
            interval_transactions.append(transaction)

    return interval_transactions


def parse_transaction_amount(amount: str) -> float:
    try:
        return abs(float(amount))
    except ValueError:
        return 0


def sort_transactions_by_date_desc(
    transactions: list[Transaction],
) -> list[Transaction]:
    return sorted(
        transactions,
        key=lambda transaction: (
            parse_transaction_date(transaction.transactionDate) or date.min,
            transaction.transactionDate,
        ),
        reverse=True,
    )


def build_insights_inputs(
    range: InsightRange,
    start_date: date,
    end_date: date,
    interval_transactions: list[Transaction],
) -> list[str]:
    transaction_payload = [
        {
            "amount": transaction.amount,
            "category": transaction.category,
            "transactionDate": transaction.transactionDate,
            "note": transaction.note,
        }
        for transaction in interval_transactions
    ]

    instructions = f"""
Analyze the user's spending transactions for the selected current calendar {range} period.
Return only JSON matching the provided InsightAnalysisResponse schema.

Interval:
- start_date: {start_date.isoformat()}
- end_date: {end_date.isoformat()}
- range: {range}

Rules:
- Generate up to {MAX_INSIGHTS} concise, useful spending insights.
- Use only the provided transactions. Do not invent merchants, dates, categories, or amounts.
- Prefer specific observations about category concentration, unusual spending, recurring costs, savings opportunities, or positive spending patterns.
- Keep each title under 5 words.
- Keep each description one sentence and under 28 words.
- Use one icon from this list: {", ".join(INSIGHT_ICON_NAMES)}.
- If there is not enough evidence for a useful insight, return an empty insights array.
""".strip()

    transactions = f"""
Transactions:
{json.dumps(transaction_payload, separators=(",", ":"))}
""".strip()

    return [instructions, transactions]


def generate_insights(
    range: InsightRange,
    start_date: date,
    end_date: date,
    interval_transactions: list[Transaction],
) -> list[InsightCard]:
    inputs = build_insights_inputs(
        range=range,
        start_date=start_date,
        end_date=end_date,
        interval_transactions=interval_transactions,
    )

    try:
        response = app.state.genai_client.models.generate_content(
            model=GEMINI_MODEL,
            contents=inputs,
            config={
                "response_mime_type": "application/json",
                "response_schema": InsightAnalysisResponse,
            },
        )
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Failed to generate spending insights.",
        ) from error

    try:
        if isinstance(response.parsed, InsightAnalysisResponse):
            analysis = response.parsed
        else:
            analysis = InsightAnalysisResponse.model_validate_json(response.text or "")
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Insights analysis returned invalid data.",
        ) from error

    return analysis.insights[:MAX_INSIGHTS]


@app.get("/transactions", response_model=list[Transaction])
def get_transactions(request: Request) -> list[Transaction]:
    # print_request_headers("GET /transactions", request)
    uid = get_request_uid(request)
    return get_user_transactions(uid)


@app.get("/dashboard", response_model=DashboardResponse)
def get_dashboard(request: Request) -> DashboardResponse:
    # print_request_headers("GET /dashboard", request)
    uid = get_request_uid(request)
    month_start, today = get_current_period_interval("monthly")
    user_transactions = get_user_transactions(uid)
    current_month_spend = sum(
        parse_transaction_amount(transaction.amount)
        for transaction in user_transactions
        if (
            (transaction_date := parse_transaction_date(transaction.transactionDate))
            is not None
            and month_start <= transaction_date <= today
            and transaction.category != "salary"
        )
    )

    return DashboardResponse(
        currentMonthSpend=round(current_month_spend, 2),
        recentTransactions=sort_transactions_by_date_desc(user_transactions)[:5],
    )


@app.get("/insights", response_model=list[InsightCard])
def get_insights(request: Request, range: InsightRange = "monthly") -> list[InsightCard]:
    # print_request_headers("GET /insights", request)
    uid = get_request_uid(request)
    start_date, end_date = get_current_period_interval(range)
    cache_key = (uid, range, start_date.isoformat(), end_date.isoformat())
    interval_transactions = get_transactions_for_interval(uid, start_date, end_date)

    cached_entry = app.state.insights_cache.get(cache_key)
    now = time()
    transaction_count = len(interval_transactions)

    if (
        cached_entry is not None
        and now - cached_entry["created_at"] < INSIGHTS_CACHE_TTL_SECONDS
        and cached_entry["transaction_count"] == transaction_count
    ):
        return cached_entry["insights"]

    if transaction_count < MIN_TRANSACTIONS_FOR_INSIGHTS:
        return []

    insights = generate_insights(
        range=range,
        start_date=start_date,
        end_date=end_date,
        interval_transactions=interval_transactions,
    )
    app.state.insights_cache[cache_key] = {
        "created_at": now,
        "insights": insights,
        "transaction_count": transaction_count,
    }

    return insights


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
            model=GEMINI_MODEL,
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
