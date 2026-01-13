# GigFlow Backend

Node.js + Express backend using ES Modules, MongoDB (Mongoose), and JWT auth via HttpOnly cookies.

## Setup
1. Copy `.env.example` to `.env` and fill values.
2. Install deps: `npm install`
3. Run dev: `npm run dev`

## Notes
- CORS is configured with credentials enabled.
- Auth uses an HttpOnly cookie containing the JWT.
