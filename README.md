# AI Spending Tracker

Vite + React + TypeScript starter configured with:

- Material UI (`@mui/material`, `@mui/icons-material`, Emotion)
- Tailwind CSS (`tailwindcss` + `@tailwindcss/vite`)

## Prerequisites

- Node.js `22.13+` (or `24+`) recommended
- npm `10+`

## Getting Started

### Quick Start (Node Already Installed)

```bash
npm install
npm run dev
```

App runs by default at `http://localhost:5173`.

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
- Keep or restore the default Vite page in `src/App.tsx` if desired.
- Confirm the app boots at `http://127.0.0.1:5173/`.

## Available Scripts

- `npm run dev` - start Vite dev server
- `npm run build` - type-check and build production bundle
- `npm run preview` - preview production build
- `npm run lint` - run ESLint

## Tailwind + MUI Notes

- Tailwind is enabled through the Vite plugin in `vite.config.ts`.
- Global Tailwind import is in `src/index.css`.
- Material UI theme and baseline are configured in `src/main.tsx`.
