# Quran Web Application

A production-ready Quran web application with:
- A Node.js + Hono backend that serves Quran data from a local JSON file.
- A Next.js 14 + Tailwind CSS frontend with an elegant Islamic-inspired theme.
- Surah listing, Surah details, full verse reading, and translation search.
- Persistent settings (Arabic font + font sizes) stored in localStorage.

## Tech Stack

- Backend: Node.js, Hono
- Frontend: Next.js 14 (App Router), React, Tailwind CSS, TypeScript (strict)
- Data source: `backend/data/quran.json` (local JSON only)
- Deploy:
  - Backend on Vercel, Railway, or Render (no Docker required)
  - Frontend on Vercel (`frontend/vercel.json`)

## Project Structure

```text
.
|- backend/
|  |- api/
|  |  |- [[...route]].ts
|  |- data/
|  |  |- quran.json
|  |- src/
|  |  |- app.ts
|  |  |- index.ts
|  |  |- types.ts
|  |- package.json
|  |- tsconfig.json
|- frontend/
|  |- app/
|  |- components/
|  |- contexts/
|  |- lib/
|  |- types/
|  |- .env.local
|  |- .env.production
|  |- package.json
|  |- vercel.json
|- package.json
|- README.md
```

## Local Setup

1. Clone the repository.
2. Download the Quran database JSON first:

```bash
mkdir -p backend/data
curl -o backend/data/quran.json https://raw.githubusercontent.com/risan/quran-json/main/data/quran.json
```

3. Install dependencies:

```bash
npm install
npm install --prefix frontend
npm install --prefix backend
```

4. Run development servers (backend + frontend together):

```bash
npm run dev
```

Backend-only development:

```bash
cd backend
npm run dev
```

5. Open:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:3001`

## Backend API

Base URL: `http://localhost:3001`

### `GET /api/surahs`

Returns all 114 surahs without verse arrays.

Response example:

```json
[
  {
    "id": 1,
    "name": "الفاتحة",
    "transliteration": "Al-Fatihah",
    "translation": "The Opener",
    "type": "meccan",
    "total_verses": 7
  }
]
```

### `GET /api/surah/:id`

Returns a full surah object including all verses.

- Valid range: `1` to `114`
- Invalid range or non-integer: `400`
- Not found: `404`

### `GET /api/search?q=:query`

Searches all verse translations (case-insensitive).

- Returns: `[{ surahId, surahName, verseId, arabicText, translation }]`
- Max results: `50`
- If `q` is missing or fewer than 3 characters: returns `[]`

### `GET /`

Basic deploy check endpoint.

Response example:

```json
{
  "message": "Quran API is running."
}
```

### `GET /api/health`

Health check endpoint.

Response example:

```json
{
  "ok": true,
  "service": "quran-api"
}
```

## Environment Variables

### Frontend local

`frontend/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Frontend production

`frontend/.env.production`

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
```

## Deployment

### Vercel (Backend)

1. Import the repository in Vercel.
2. Set Root Directory to `backend`.
3. Framework Preset: `Other`.
4. Build command: `npm run build`
5. Output directory: leave empty.
6. Deploy. (`backend/vercel.json` is included to package `data/quran.json` with the function.)

Backend routes will be available at:
- `https://your-backend-domain.vercel.app/api` (deploy check)
- `https://your-backend-domain.vercel.app/api/health` (health check)
- `https://your-backend-domain.vercel.app/api/surahs`
- `https://your-backend-domain.vercel.app/api/surah/:id`
- `https://your-backend-domain.vercel.app/api/search?q=mercy`

### Railway/Render (Backend)

1. Create a new service/project from your GitHub repo.
2. Set Root Directory to `backend`.
3. Install command: `npm install`
4. Start command: `npm run start`
5. Add environment variable if needed:
   - `PORT=3001`
6. Deploy and copy the backend URL.

### Vercel (Frontend)

1. Import the repository in Vercel.
2. Set Root Directory to `frontend`.
3. Add env var:
   - `NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app`
4. Deploy.

## Notes

- The backend loads `backend/data/quran.json` into memory at startup.
- The frontend renders Home (`/`) and Surah detail (`/surah/[id]`) pages dynamically on request.
- This avoids requiring a live backend during `next build` on Vercel.
- Search page (`/search`) is client-side with a 400ms debounce.
- Settings persist in localStorage under key: `quran-settings`.
