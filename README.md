# AbrIT Website + Payload CMS

This `payload-cms` branch contains one multilingual Next.js 16 application with Payload 3 and PostgreSQL. The public website, Payload Admin (`/admin`) and compatibility APIs run on the same Node process. Django is not part of this branch.

## Local development

1. Copy `.env.example` to `.env` and change the secrets.
2. Start PostgreSQL with `docker compose up -d` (host port `5433`).
3. Run `cd frontend`, `npm install`, `npm run seed`, then `npm run dev`.
4. Open `http://localhost:3000/fa` and `http://localhost:3000/admin`.

The seed is idempotent. To import old SQLite data, set `DJANGO_SQLITE_PATH` only for the migration command and run `npm run migrate:django`, followed by `npm run validate:migration`.

See `docs/PAYLOAD_MIGRATION.md` for deployment, migration and verification details.
