# Payload cutover

The public site and CMS are being consolidated into `frontend/` as a Next.js and Payload application. Django remains untouched as the rollback and data-export source until the Payload deployment has passed acceptance.

## Server prerequisites

- Node.js 22 and npm 10.
- PostgreSQL 17 or a compatible managed PostgreSQL service.
- Persistent writable storage mounted for `frontend/media`.
- A long random `PAYLOAD_SECRET` and a PostgreSQL `DATABASE_URI`.
- A process manager for the Node web process and the scheduled Payload jobs process.

## First server deployment

Run these commands from `frontend/` after placing the production environment values in the host secret store:

```sh
npm install
npm run generate:importmap
npm run generate:types
npm run migrate
npm run seed
npm run check
npm run start
```

Do not use `npm ci` until a lockfile containing the new Payload dependencies has been generated and committed from a trusted network.

## Legacy content migration

Export data from the legacy Django deployment before changing DNS or disabling its API:

```sh
cd /path/to/abrit.ir/backend
python scripts/export_payload_data.py /secure-transfer/payload-legacy-export.json
```

Copy the JSON file to the Payload host outside the public web root, then run:

```sh
cd /path/to/abrit.ir/frontend
LEGACY_EXPORT_FILE=/secure-transfer/payload-legacy-export.json npm run migrate:django
```

The importer is idempotent. It preserves each Django item ID, path, SEO values and original block data in Payload before editorial block conversion. It does not migrate Django users, passwords, audit logs, form submissions or private user uploads.

## Required environment values

```sh
PAYLOAD_SECRET=<long-random-secret>
DATABASE_URI=postgres://<user>:<password>@<host>:5432/<database>
NEXT_PUBLIC_SITE_URL=https://abrit.ir
```

## Acceptance gates

- Create the first Payload administrator at `/admin` before allowing other staff access.
- Verify all three locales: `/fa`, `/en`, `/ar-ae`.
- Run the content seed only against the intended database.
- Compare migrated paths, canonical URLs, hreflang values, sitemap records, forms and pricing values against Django.
- Keep Django and its SQLite/media backup read-only until public, editorial and SEO acceptance is signed off.
