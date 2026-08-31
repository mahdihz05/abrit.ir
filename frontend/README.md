# AbrIT application

Next.js 16, Payload CMS 3 and PostgreSQL are integrated in this directory.

```powershell
npm install
npm run seed
npm run dev
```

Useful commands:

- `npm run check`: lint, TypeScript, unit tests and production build.
- `npm run migrate:django`: idempotent read-only import from `DJANGO_SQLITE_PATH`.
- `npm run validate:migration`: compare imported records and pricing with SQLite.
- `npm run retention:purge`: delete expired submissions and private files; schedule daily.
- `npm run generate:types`: regenerate Payload types after schema changes.

Production needs `DATABASE_URI`, `PAYLOAD_SECRET`, `NEXT_PUBLIC_SITE_URL`, `IP_HASH_SECRET` and `REVALIDATION_SECRET`. Keep `private-media/` on persistent non-public storage.
