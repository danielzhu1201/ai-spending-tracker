# AI Spending Tracker

Aura Finance is a responsive spending tracker built with Vite, React, TypeScript, Material UI, Tailwind CSS, React Router, Firebase Authentication, FastAPI, and Firestore. The current branch adds real Firebase sign-in, user-scoped transaction persistence, a protected receipt-scan upload flow, and Gemini-generated spending insights.

## What Is Implemented

- `/login` - Firebase email/password and Google authentication, account creation, password reset, signed-in account details, and sign out.
- Protected app routes - `/dashboard`, `/manual-entry`, `/transactions`, `/insights`, and `/scan` require an authenticated Firebase user.
- `/manual-entry` - expense entry form with amount, category chips, MUI date picker, notes, and a Firebase-authenticated POST to the backend.
- `/transactions` - Firebase-authenticated transaction loading from the backend, with search, category filters, time filters, loading state, and error state.
- `/insights` - Firebase-authenticated AI insights generated from the signed-in user's current weekly, monthly, or yearly transactions.
- `/scan` - protected receipt-image workflow with camera/file selection, image-only validation, preview, selected-file metadata, remove/reselect controls, authenticated upload, and review handoff to manual entry.
- Backend API - FastAPI endpoints verify Firebase ID tokens, write transactions to Firestore, return only rows for the signed-in user's `uid`, and extract transaction drafts from receipt images.
- `/dashboard` - polished mock-data experience for monthly spending.

The frontend builds backend endpoints from `VITE_API_BASE_URL` and sends Firebase ID tokens with API requests through `authenticatedFetch`. The backend validates those tokens with Firebase Admin and stores transactions in the Firestore `transactions` collection with a `uid` field.

## Tech Stack

- React 19 + TypeScript
- Vite 8
- React Router 7
- Material UI 9, MUI X Date Pickers, Emotion
- Tailwind CSS 4 through `@tailwindcss/vite`
- Firebase JS SDK for frontend authentication
- FastAPI backend with Firebase Admin, Firestore, and `uv`
- Day.js for date picker values
- ESLint for static checks

## Prerequisites

- Node.js `22.13+` or `24+`
- npm `10+`
- Python `3.11+`
- `uv`
- A Firebase project with Authentication and Firestore enabled
- A Firebase service account JSON file for the backend
- A Google GenAI API key for receipt extraction and spending insights

## Getting Started

### Frontend Environment

Copy the frontend example environment file and fill in the backend base URL and Firebase web app values:

```bash
cp .env.example .env
```

Required values:

```bash
VITE_API_BASE_URL=http://127.0.0.1:8000
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

### Backend Environment

Create the backend environment file and add your Firebase service account values
and Google GenAI API key:

```bash
cp ai-spending-tracker-backend/.env.example ai-spending-tracker-backend/.env
```

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

These Firebase values map directly to the fields in the service account JSON.
`FIREBASE_PRIVATE_KEY` may contain real line breaks or escaped `\n` sequences,
which works well for Render environment variables. For local development only,
you can still use `FIREBASE_CREDENTIALS_PATH=path/to/serviceAccountKey.json`
instead of the individual Firebase service account variables. Relative paths are
resolved from `ai-spending-tracker-backend`. Keep service account JSON files
local and untracked.

### Run the Backend

```bash
cd ai-spending-tracker-backend
uv sync
uv run uvicorn main:app --reload
```

The API starts at `http://127.0.0.1:8000`. Interactive docs are available at `http://127.0.0.1:8000/docs`.

### Run the Frontend

```bash
npm install
npm run dev
```

The Vite dev server starts at `http://localhost:5173` by default. Use the `localhost` URL when talking to the backend because the current backend CORS allow-list is configured for `http://localhost:5173` and `http://localhost:5174`.

To run on an explicit host and port that matches backend CORS:

```bash
npm run dev -- --host localhost --port 5173
```

### Codex Prompt (Brand-New Machine)

```text
Set up and run this project on a brand-new local machine with nothing installed.
1) Detect the OS (macOS, Ubuntu/Debian Linux, or Windows).
2) Install Git, Node.js LTS with npm, Python 3.11+, and uv using OS-native package managers where possible.
3) Clone the repository and enter the project folder.
4) Create .env from .env.example and ai-spending-tracker-backend/.env from its example.
5) Prompt me for the frontend API base URL, Firebase web app config values, the backend service account JSON path, and the Google GenAI API key.
6) Install frontend and backend dependencies.
7) Validate with frontend lint/build and a backend import/startup check.
8) Start the backend on 127.0.0.1:8000 and the frontend on localhost:5173.
Print each command before running it and stop on errors with a fix suggestion.
```

### Commands Codex Should Execute

```bash
# after Git + Node.js LTS are installed
git clone <your-repo-url>
cd ai-spending-tracker
cp .env.example .env
cp ai-spending-tracker-backend/.env.example ai-spending-tracker-backend/.env
# fill in VITE_API_BASE_URL and Firebase web app values in .env,
# then Firebase service account values and GEMINI_API_KEY in the backend .env
npm install
npm run lint
npm run build

# terminal 1: backend
cd ai-spending-tracker-backend
uv sync
uv run uvicorn main:app --reload

# terminal 2: frontend, from the repository root
cd ..
npm run dev -- --host localhost --port 5173
```

## Available Scripts

- `npm run dev` - start the local Vite dev server.
- `npm run build` - type-check and build the production bundle.
- `npm run preview` - preview the production build.
- `npm run lint` - run ESLint.

## Backend API

The backend lives in `ai-spending-tracker-backend/`.

- `GET /transactions` - requires `Authorization: Bearer <Firebase ID token>` and returns transactions for the signed-in user.
- `GET /insights?range=weekly|monthly|yearly` - requires the same bearer token and returns Gemini-generated insights for the signed-in user's current calendar period.
- `POST /transactions` - requires the same bearer token and creates a Firestore transaction for the signed-in user.
- `POST /receipts/upload` - requires the same bearer token, accepts a multipart `receipt` image, and returns an extracted transaction draft without saving it.

Example authenticated request:

```bash
curl http://127.0.0.1:8000/transactions \
  -H "Authorization: Bearer $FIREBASE_ID_TOKEN"
```

Transaction request bodies match the frontend manual expense draft:

```ts
export interface ManualExpenseDraft {
  amount: string
  category: TransactionCategory
  transactionDate: string
  note: string
}
```

See `ai-spending-tracker-backend/README.md` for backend-specific setup and curl examples.

## Codex + Vite Initialization

Use this when you want Codex to scaffold the same stack in a repo that already has `.git` initialized.

### Prompt to Codex

```text
Initialize a Vite React TS project. Install Material UI and Tailwind CSS.
After this, make sure the app starts up and add a proper .gitignore and README file.
```

### Commands Codex Should Run

```bash
# 1) Scaffold in a temporary folder (safe for non-empty repo roots)
npm create vite@latest tmp-vite -- --template react-ts
rsync -a tmp-vite/ ./
rm -rf tmp-vite

# 2) Install dependencies
npm install
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material tailwindcss postcss autoprefixer
npm install -D @tailwindcss/vite

# 3) Verify project health
npm run build
npm run lint
npm run dev -- --host 127.0.0.1 --port 5173
```

### What to Configure

- Enable Tailwind via `@tailwindcss/vite` in `vite.config.ts`.
- Import Tailwind in `src/index.css` using `@import "tailwindcss";`.
- Wrap the app with `AppThemeProvider` in `src/main.tsx` to apply the Aura MUI theme and CSS variables.
- Confirm the app boots at `http://localhost:5173/`.

## Project Structure

```text
src/
  app/              React Router route definitions
  auth/             Firebase auth context and protected route wrapper
  components/       Shared layout, UI, form, icon, and transaction components
  config/           Navigation and layout configuration
  data/mock/        Mock API response data for each screen
  data/selectors/   View-model selectors that shape mock data for pages
  lib/              Firebase initialization and authenticated fetch helper
  pages/            Route-level screen implementations
  theme/            Aura design tokens, MUI theme, and CSS variables
  types/            Shared domain types
  utils/            Formatting and class-name helpers

ai-spending-tracker-backend/
  main.py           FastAPI app, Firebase token verification, Firestore access
  pyproject.toml    Backend dependencies managed by uv
```

## UI Notes

The visual system is centralized in `src/theme/auraTokens.ts` and `src/theme/auraTheme.ts`. `AppThemeProvider` applies the MUI theme, CSS baseline, and Aura CSS variables globally. Shared layout components provide the top app bar, responsive page container, desktop side navigation, and mobile bottom navigation.

Most page data is still shaped through selectors before rendering. Transactions now enter the app through the backend, then flow through the same selector layer used by the earlier mock implementation.

## Current Limitations

- Dashboard still uses mock data.
- Manual expense submission posts to the backend, but success/error UI and form reset behavior are still minimal.
- The frontend expects `VITE_API_BASE_URL` to point at the backend domain, for example `http://127.0.0.1:8000` locally.
- The backend supports transaction create/list, current-period AI insights, and receipt extraction; there is no update/delete endpoint yet.
- Insights return an empty array when the selected current period has fewer than three valid `YYYY-MM-DD` transactions, regenerate when the valid transaction count changes, and return `502` for Gemini failures.
- Receipt upload extracts transaction drafts with Google GenAI, but there is no receipt image storage integration yet.
- Ask Aura, Load More, and View All actions are UI-only.
