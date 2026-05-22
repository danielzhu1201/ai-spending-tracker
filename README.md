# AI Spending Tracker

Aura Finance is a responsive spending-tracker UI built with Vite, React, TypeScript, Material UI, Tailwind CSS, and React Router. The current branch replaces the starter app with a mock-data fintech experience for reviewing spending, entering expenses, browsing transactions, and reading AI-style spending insights.

## What Is Implemented

- `/dashboard` - monthly spending dashboard with summary metrics, comparison bars, recent transactions, and a scan-receipt action.
- `/manual-entry` - expense entry form with amount, category chips, MUI date picker, notes, and a contextual spending tip.
- `/transactions` - searchable and filterable transaction list grouped by date, with category and payment-method metadata.
- `/insights` - Smart Insights page with range tabs and observation cards.
- `/scan` and `/login` - placeholder screens for future receipt scanning and authentication flows.

The app currently runs entirely from mock API responses and selectors in `src/data`. There is no backend, authentication, persistence, or real receipt scanning yet.

## Tech Stack

- React 19 + TypeScript
- Vite 8
- React Router 7
- Material UI 9, MUI X Date Pickers, Emotion
- Tailwind CSS 4 through `@tailwindcss/vite`
- Day.js for date picker values
- ESLint for static checks

## Prerequisites

- Node.js `22.13+` or `24+`
- npm `10+`

## Getting Started

### Quick Start (Node Already Installed)

```bash
npm install
npm run dev
```

The Vite dev server starts at `http://localhost:5173` by default.

To run on an explicit host and port:

```bash
npm run dev -- --host 127.0.0.1 --port 5173
```

### Codex Prompt (Brand-New Machine)

```text
Set up and run this project on a brand-new local machine with nothing installed.
1) Detect the OS (macOS, Ubuntu/Debian Linux, or Windows).
2) Install Git and Node.js LTS (with npm) using the OS-native package manager.
3) Clone the repository, enter the project folder, and install dependencies.
4) Validate with lint and build.
5) Start the dev server on 127.0.0.1:5173.
Print each command before running it and stop on errors with a fix suggestion.
```

### Commands Codex Should Execute

```bash
# after Git + Node.js LTS are installed
git clone <your-repo-url>
cd ai-spending-tracker
npm install
npm run lint
npm run build
npm run dev -- --host 127.0.0.1 --port 5173
```

## Available Scripts

- `npm run dev` - start the local Vite dev server.
- `npm run build` - type-check and build the production bundle.
- `npm run preview` - preview the production build.
- `npm run lint` - run ESLint.

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
- Confirm the app boots at `http://127.0.0.1:5173/`.

## Project Structure

```text
src/
  app/              React Router route definitions
  components/       Shared layout, UI, form, icon, and transaction components
  config/           Navigation and layout configuration
  data/mock/        Mock API response data for each screen
  data/selectors/   View-model selectors that shape mock data for pages
  pages/            Route-level screen implementations
  theme/            Aura design tokens, MUI theme, and CSS variables
  types/            Shared domain types
  utils/            Formatting and class-name helpers
```

## UI Notes

The visual system is centralized in `src/theme/auraTokens.ts` and `src/theme/auraTheme.ts`. `AppThemeProvider` applies the MUI theme, CSS baseline, and Aura CSS variables globally. Shared layout components provide the top app bar, responsive page container, desktop side navigation, and mobile bottom navigation.

Most page data is shaped through selectors before rendering. This keeps the current mock implementation close to an API-backed flow and should make future integration work more straightforward.

## Current Limitations

- Transaction filters and manual expense entry update local component state only.
- Add Expense, Scan Receipt, Ask Aura, Load More, and View All actions are UI-only.
- `/scan` and `/login` are intentionally represented by coming-soon screens.
