# Payload CMS migration

## Target architecture

- One Next.js 16 / Payload 3 Node application serves the public site, `/admin` and same-origin APIs.
- PostgreSQL is the only runtime database. `DATABASE_URI` is required.
- Public Server Components and route handlers use Payload Local API.
- Public URLs and locales remain `fa`, `en` and `ar-ae`; Django and `/cms` are removed.
- Submission uploads live in `frontend/private-media/form-submissions` and are downloaded only through the authenticated private route.

## Required production environment

Set `DATABASE_URI`, `PAYLOAD_SECRET`, `NEXT_PUBLIC_SITE_URL`, `IP_HASH_SECRET` and `REVALIDATION_SECRET`. `PAYLOAD_ADMIN_EMAIL` and `PAYLOAD_ADMIN_PASSWORD` are needed only when creating the first administrator with `npm run seed` and should be removed afterward.

Run the application as a persistent Node process from the standalone build. Back up PostgreSQL and `private-media/` together. Schedule `npm run retention:purge` daily. For scheduled publishing, run `npm run jobs:schedules` and `npm run jobs:run` from cron at the desired interval.

## Initial migration

The source SQLite database is opened with SQLite `mode=ro`; migration never writes to it.

```powershell
cd frontend
$env:DJANGO_SQLITE_PATH = "C:\path\to\abrit.sqlite3"
npm run seed
npm run migrate:django
npm run validate:migration
```

The importer is idempotent and may be rerun. It imports settings, media, localized content and blocks, relations, navigation, pricing, forms, submissions, private files and audit events. Public seed data remains canonical for visible package-card totals; Django formulas remain canonical for calculated quotes.

## Verification

```powershell
npm run lint
npm run typecheck
npm test
npm run build
```

The repository smoke script expects a production server on port `3100`; `scripts/check.ps1` runs static, unit and build checks. Before production cutover, run `validate:migration` against a fresh PostgreSQL backup restore and verify `/admin`, form submission, pricing and all three locales.
