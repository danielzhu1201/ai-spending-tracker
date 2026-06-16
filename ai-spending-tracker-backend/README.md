# AI Spending Tracker Backend

FastAPI backend for authenticated transactions, Firestore persistence, and
receipt-image transaction extraction and spending insights with Google GenAI.

## Setup

Install dependencies from the backend directory:

```bash
uv sync
```

Create a local `.env` file:

```bash
cp .env.example .env
```

Required values:

```bash
FIREBASE_TYPE=service_account
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_CLIENT_ID=your_service_account_client_id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=your_client_cert_url
GEMINI_API_KEY=your_google_genai_api_key
```

These Firebase values come from your service account JSON. `FIREBASE_PRIVATE_KEY`
may be pasted with real line breaks or with escaped `\n` sequences, which is
often easiest in hosted environment variable UIs like Render.

For local development only, you can still use `FIREBASE_CREDENTIALS_PATH` instead
of the individual Firebase service account variables. Relative
`FIREBASE_CREDENTIALS_PATH` values are resolved from this backend directory. Keep
service account JSON files local and untracked.

## Run

For local development with reload:

```bash
uv run uvicorn main:app --reload
```

The API runs at `http://127.0.0.1:8000` by default. Firebase Admin, Firestore,
and the Google GenAI client are initialized during API startup, so the Firebase
service account values and `GEMINI_API_KEY` must be valid before the server
starts.

Interactive docs are available at `http://127.0.0.1:8000/docs`.

## Render Deploy

Set the Render service's root directory to `ai-spending-tracker-backend`, then
use:

```bash
uv sync
```

as the build command and:

```bash
uv run python start.py
```

as the start command.

`start.py` binds Uvicorn to `0.0.0.0` and uses Render's `PORT` environment
variable, which lets Render detect the public HTTP port during deployment.

## Authentication

Every API endpoint requires a Firebase ID token from a signed-in frontend user:

```bash
export FIREBASE_ID_TOKEN=<token>
```

Send it as a bearer token:

```bash
-H "Authorization: Bearer $FIREBASE_ID_TOKEN"
```

Requests with a missing, malformed, or invalid token return `401`.

## CORS

Browsers enforce CORS before they let frontend JavaScript call this API. This is
separate from Firebase Auth. Firebase answers "is this website allowed to run
the login flow?" CORS answers "is this website allowed to call this backend from
a browser?"

Exact local frontend origins allowed by default:

- `http://localhost:5173`
- `http://localhost:5174`

The API also allows HTTPS Render subdomains by default with this regex:

```bash
https://.*\.onrender\.com
```

That means a deployed frontend such as:

```bash
https://your-frontend-name.onrender.com
```

can call the deployed backend such as:

```bash
https://your-backend-name.onrender.com
```

For a stricter production setup, set exact origins in Render:

```bash
CORS_ALLOWED_ORIGINS=https://your-frontend-name.onrender.com
```

You can also override the Render regex:

```bash
CORS_ALLOW_ORIGIN_REGEX=https://.*\.onrender\.com
```

Allowed methods are `GET` and `POST`. Allowed headers are `Content-Type` and
`Authorization`.

## Transaction Schema

All transaction endpoints use this shape:

```json
{
  "amount": "42.50",
  "category": "food-dining",
  "transactionDate": "2026-05-19",
  "note": "Dinner with colleagues"
}
```

Fields:

- `amount` - positive decimal string without a currency symbol.
- `category` - one of `""`, `food-dining`, `housing`, `shopping`, `transport`,
  `salary`, `utilities`, or `other`.
- `transactionDate` - purchase date in `YYYY-MM-DD` format.
- `note` - short human-readable transaction note.

Receipt extraction may return empty strings for fields that are missing,
illegible, incomplete, ambiguous, or uncertain.

## API Endpoints

### GET `/transactions`

Returns transactions from the Firestore `transactions` collection for the
authenticated user's Firebase `uid`.

```bash
curl http://127.0.0.1:8000/transactions \
  -H "Authorization: Bearer $FIREBASE_ID_TOKEN"
```

Response:

```json
[
  {
    "amount": "42.50",
    "category": "food-dining",
    "transactionDate": "2026-05-19",
    "note": "Dinner with colleagues"
  }
]
```

### GET `/insights`

Returns Gemini-generated insight cards for the authenticated user's current
calendar period. The `range` query parameter accepts `weekly`, `monthly`, or
`yearly`; the default is `monthly`.

Intervals are resolved on the server:

- `weekly` - Monday through today.
- `monthly` - the first day of the current month through today.
- `yearly` - January 1 through today.

Only transactions with a valid `YYYY-MM-DD` `transactionDate` inside the
selected interval are sent to Gemini. Successful insight responses are cached
for 24 hours per user, range, interval, and valid transaction count; if the
transaction count changes inside the same period, insights are regenerated. If
the selected interval has fewer than three valid transactions, the endpoint
returns an empty array without calling Gemini.

```bash
curl "http://127.0.0.1:8000/insights?range=monthly" \
  -H "Authorization: Bearer $FIREBASE_ID_TOKEN"
```

Response:

```json
[
  {
    "id": "monthly-dining",
    "title": "Dining Lift",
    "description": "Food and dining is your largest category this month, led by several restaurant transactions.",
    "icon": "restaurant"
  }
]
```

Gemini generation failures or invalid model responses return `502`.

### POST `/transactions`

Creates a transaction in Firestore for the authenticated user's Firebase `uid`.
The stored Firestore document includes the submitted transaction fields plus
`uid`; the API response returns the transaction fields only.

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

Success returns `201` with the created transaction.

### POST `/receipts/upload`

Uploads a receipt image and asks Google GenAI to extract a transaction draft.
This endpoint returns extracted transaction data only; it does not write to
Firestore. Save the returned transaction with `POST /transactions` after the
user reviews it.

The multipart file field must be named `receipt`, must have an `image/*`
content type, and must not be empty.

```bash
curl -X POST http://127.0.0.1:8000/receipts/upload \
  -H "Authorization: Bearer $FIREBASE_ID_TOKEN" \
  -F "receipt=@/path/to/receipt.jpg"
```

Success returns `200` with an extracted transaction:

```json
{
  "amount": "63.47",
  "category": "food-dining",
  "transactionDate": "2026-05-19",
  "note": "Lunch receipt"
}
```

Validation failures return `400` when the receipt file is missing, is not an
image, or is empty. GenAI extraction failures return `502`.
