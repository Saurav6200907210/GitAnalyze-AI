# GitAnalyze AI

A React + Vite + TypeScript frontend with a Node.js + Express backend to securely fetch GitHub API data.

## Setup

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Add GITHUB_TOKEN in backend/.env
npm run dev
```

### Frontend

```bash
npm install
npm run dev
```

## Architecture Changes
- Created `backend/` directory containing an Express server that proxies and transforms GitHub API calls.
- Copied frontend `types.ts` and `scoring.ts` to `backend/src/utils/` so the backend computes all portfolio scores securely.
- Modified `frontend/src/lib/github.functions.ts` to replace complex direct-to-GitHub parallel API calls with a single `fetch` to the backend.
- Updated the `Refresh` button in `src/pages/Audit.tsx` to issue a POST request to `http://localhost:5000/api/github/refresh/:username` to bust the backend cache before reloading.
- Token is now safely stored in `backend/.env` and never reaches the frontend.
