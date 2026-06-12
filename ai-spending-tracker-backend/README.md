# AI Spending Tracker Backend

Minimal FastAPI backend for authenticated manual expense transactions backed by Firestore.

## Setup

```bash
uv sync
```

Create a local `.env` file with the Firebase service account path and Google
GenAI API key:

```bash
FIREBASE_CREDENTIALS_PATH=path/to/serviceAccountKey.json
GEMINI_API_KEY=your_google_genai_api_key
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

Both transaction endpoints require a Firebase ID token from a signed-in frontend user:

```bash
export FIREBASE_ID_TOKEN=<token>
```

### GET `/transactions`

```bash
curl http://127.0.0.1:8000/transactions \
  -H "Authorization: Bearer $FIREBASE_ID_TOKEN"
```

### POST `/transactions`

```bash
curl -X POST http://127.0.0.1:8000/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $FIREBASE_ID_TOKEN" \
  -d '{
    "amount": "42.50",
    "category": "food-dining",
    "transactionDate": "2026-05-19",
    "note": "Dinner with colleagues"
  }'
```

The request body matches the frontend `ManualExpenseDraft` model:

```ts
export interface ManualExpenseDraft {
  amount: string
  category: TransactionCategory
  transactionDate: string
  note: string
}
```

Interactive docs are available at `http://127.0.0.1:8000/docs`.

### POST `/ai/answer`

```bash
curl -X POST http://127.0.0.1:8000/ai/answer \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Give me one budgeting tip for this week."
  }'
```
