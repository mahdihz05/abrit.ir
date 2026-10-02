# AbrIT corporate website and CMS

A multilingual corporate-site monorepo with a Django CMS/API and a Next.js frontend that also contains Payload CMS. It is an in-progress implementation and CMS cutover, not evidence of a finished production deployment.

## Current architecture and status

The original Django/Next.js description covers only part of this snapshot. [Payload cutover](docs/PAYLOAD_CUTOVER.md) describes consolidating the public site and CMS into `frontend/`, keeping Django as the rollback and data-export source until acceptance. The [implementation checklist](docs/IMPLEMENTATION_CHECKLIST.md) still leaves full CMS-backed Home rendering and frontend/API connection pending. The locale Home route currently renders `TechorHomepage`; CMS collections do not prove that every public page reads them.

- [backend/manage.py](backend/manage.py), `backend/config/` and `backend/apps/`: Django 5.2, REST API, SQLite settings and content, forms, media, navigation, pricing and search applications.
- [backend/apps/content/services.py](backend/apps/content/services.py): publication/revision operations with transaction locking, audit records and revalidation events.
- [frontend/src/payload.config.ts](frontend/src/payload.config.ts): PostgreSQL-backed Payload collections, site/navigation globals and `fa`, `en`, `ar-ae` localization.
- `frontend/src/app/`, `frontend/src/components/` and `frontend/src/payload/`: Next.js App Router pages, presentation and CMS definitions.
- `docs/` tracks delivery and cutover; `scripts/` contains local checks and packaging tasks. Hosting scripts are not required for a source review.

## Local prerequisites

Keep the database paths distinct. Legacy Django uses SQLite; Payload requires an empty disposable PostgreSQL database. The cutover guide specifies Node.js 22, npm 10 and PostgreSQL 17 or a compatible service, with writable media storage. Supply freshly generated local `PAYLOAD_SECRET`, `DATABASE_URI` and a local `NEXT_PUBLIC_SITE_URL` through environment configuration. Do not use production databases, content exports, submission records or operational endpoints.

For Django, create and activate an isolated Python environment at the repository root:

```sh
python -m pip install -r requirements.txt
python backend/manage.py check
python -m pytest -q
```

[pytest.ini](pytest.ini) selects `config.settings.test` and domain tests under `backend/apps`. Normal management commands use development settings; test results do not validate production settings. To explore Django locally, first confirm a disposable SQLite path, then run `python backend/manage.py migrate` and `python backend/manage.py runserver 127.0.0.1:8000`.

For the frontend, review [frontend/package.json](frontend/package.json) and cutover prerequisites first:

```sh
cd frontend
npm install
npm run generate:importmap
npm run generate:types
npm run dev
```

These are source-documented starting points, not a verified installation. A frontend lockfile exists, but the cutover guide still cautions against `npm ci` until its Payload dependency resolution is trusted; reproducibility needs reconciliation rather than a claim of completion. Review migrations separately before `npm run migrate`; run `npm run seed` only on an intentionally empty review database. Do not run migration/export or hosting scripts against existing data.

## Verification and open gates

Available check commands include backend pytest and frontend `npm run lint`, `npm run typecheck`, `npm run build` (or `npm run check`). [scripts/check.ps1](scripts/check.ps1) assumes a Windows backend virtual environment and starts a temporary Django server. No application tests/builds were executed for this README change. The observed hosted run was a dependency-graph update, not application CI or exact-HEAD test evidence.

CMS integration, migration parity, visual review, privacy/consent approval for public forms, production authentication, backup/restore and deployment acceptance remain gates in the public documents. Keep Django rollback material intact until acceptance. No production deployment, DNS change or production migration should occur without explicit approval. Existing frontend assets are preserved; third-party/client asset rights are separate from software licensing.
