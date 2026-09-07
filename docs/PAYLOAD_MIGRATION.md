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

Apply checked-in Payload migrations before starting a new production release:

```powershell
cd frontend
npm run migrate
```

### Existing schema baseline

The three historical migrations are registered with Payload. A database created before this registration must not replay them, because its tables already exist. Restore and validate a PostgreSQL backup first, then run this one-time guarded command only when the schema contains the legacy Payload tables:

```powershell
$env:PAYLOAD_MIGRATION_BASELINE_CONFIRM = "I_HAVE_VERIFIED_SCHEMA"
npm run migrate:baseline
npm run migrate
npm run migrate:status
```

`migrate:baseline` records only the three checked-in historical migrations after verifying representative tables and rejecting unrecognized history. It also removes Payload's `dev` schema-push marker only after that verification, allowing forward-only migrations to run non-interactively. Normal deployments run only `npm run migrate`; never run `migrate:fresh` or `migrate:reset` against production.

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

For a local evaluation environment, add the optional editable examples after the base seed:

```powershell
npm run seed:demo
```

This command is idempotent and adds one published block-based page at `/fa/it-readiness`, one draft article for testing autosave/version history, two media items and eight sample form submissions. Do not run it in production.

## Enabled editor features

- localized content for Persian, English and Arabic (UAE), including localized draft status;
- typed Hero, rich text, feature grid, FAQ, testimonial and CTA blocks, while imported legacy blocks remain editable;
- autosave, draft/version history, scheduled publishing and public preview links;
- focal-point image editing and thumbnail/card/hero image sizes;
- searchable form inbox columns with status, priority, assignment and internal notes;
- SEO title, description, canonical, robots and Open Graph controls per page;
- cache revalidation hooks, private submission files, retention purge and audit-log collections.

## Verification

```powershell
npm run lint
npm run typecheck
npm test
npm run build
```

Run the database-backed private-upload regression only against an isolated local database with `npm start` already listening on port `3000`; it creates and removes `TEST-AUDIT-` fixtures:

```powershell
$env:RUN_PAYLOAD_INTEGRATION = "1"
npm run test:integration
```

The repository smoke script expects a production server on port `3100`; `scripts/check.ps1` runs static, unit and build checks. Before production cutover, run `validate:migration` against a fresh PostgreSQL backup restore and verify `/admin`, form submission, pricing and all three locales.
