# EdVyro Task 3 — Secure Application Integration

**Prepared as a distinct Abhiraj implementation** for the EdVyro Full Stack Development Task 3.

A full-stack internship portal that connects a React frontend to a secure Express API. It demonstrates API data loading, loading/error/empty states, client and server form validation, persistent SQLite storage, API security controls, and automated integration tests.

## Features mapped to the assessment

| Assessment requirement | Implementation |
|---|---|
| Load and render API data | `GET /api/internships`; React fetches records and renders cards |
| Visible loading and failure states | Loading spinner, retryable error state, and empty state |
| Application form | Modal form with client-side validation |
| Server-side validation | Zod schema validates every submitted field |
| Rate limits | `express-rate-limit`, 100 requests per 15 minutes |
| Secure headers | Helmet; Express `X-Powered-By` header disabled |
| Parameterized queries | SQLite prepared statements with bound parameters |
| Automated tests | Vitest + Supertest: success, validation rejection, missing record, filtering, headers |

## Tech stack
- React + Vite
- Node.js + Express
- SQLite (`better-sqlite3`)
- Zod
- Helmet, CORS, express-rate-limit
- Vitest + Supertest

## Requirements
- Node.js 20 or later (recommended)
- npm

## Setup

```bash
npm install
```

Copy `.env.example` to `.env` (PowerShell):

```powershell
Copy-Item .env.example .env
```

Start frontend and backend together:

```bash
npm run dev
```

Open:
- Frontend: http://localhost:5173
- API health: http://localhost:4000/api/health
- API internships: http://localhost:4000/api/internships

Run automated tests:

```bash
npm test
```

Create a production frontend build:

```bash
npm run build
```

Run backend only:

```bash
npm start
```

## Test records
Five predictable internship records are seeded automatically on first database startup. The records support list rendering, category filtering, searching, and application submission. The database is created at `server/data/applications.db` by default.

## API documentation
See [`docs/API.md`](docs/API.md). Security controls and production notes are in [`docs/SECURITY.md`](docs/SECURITY.md).

## Suggested proof link contents
Push this complete repository to a public GitHub repository. Include:
1. This README and setup steps.
2. Screenshots of internship listing, loading/error state, and application form.
3. Terminal screenshot showing `npm test` passing.
4. A short demo video or deployed frontend/API links if available.

## Scope and demo-data note
This project uses seeded demonstration internship records and a local SQLite database. Do not enter real personal information in a public demo. For public deployment, configure a persistent database volume, HTTPS, environment variables, production CORS origin, and an appropriate rate-limit strategy.

## Author
Abhiraj — EdVyro Full Stack Development, Task 3.
