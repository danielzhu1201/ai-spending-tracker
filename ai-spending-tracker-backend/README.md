# AI Spending Tracker Backend

Minimal FastAPI backend for manual expense transactions.

## Setup

```bash
uv sync
```

Create a local `.env` file with the Firebase service account path:

```bash
FIREBASE_CREDENTIALS_PATH=path/to/serviceAccountKey.json
```

Relative paths are resolved from the backend directory. Keep service account JSON
files local and untracked.

## Run

```bash
uv run uvicorn main:app --reload
```

The API runs at `http://127.0.0.1:8000` by default.
Firebase Admin and Firestore are initialized during API startup.

## Sample Requests

### GET `/transactions`

```bash
curl http://127.0.0.1:8000/transactions
```

### POST `/transactions`

```bash
curl -X POST http://127.0.0.1:8000/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "amount": "42.50",
    "currency": "USD",
    "category": "food-dining",
    "transactionDate": "2026-05-19",
    "note": "Dinner with colleagues"
  }'
```

The request body matches the frontend `ManualExpenseDraft` model:

```ts
export interface ManualExpenseDraft {
  amount: string
  currency: CurrencyCode
  category: TransactionCategory
  transactionDate: string
  note: string
}
```

Interactive docs are available at `http://127.0.0.1:8000/docs`.
