# AbrIT verified milestones

## 2026-08-22 — Foundation, CMS contracts and Home vertical slice

- Django 5.2/DRF and Next.js 16/TypeScript applications scaffolded.
- SQLite migrations applied and approved three-language seed completed.
- CMS models, workflow, revisions, audit, scheduled publishing and revalidation outbox implemented.
- Public Home rendered from CMS data for `fa`, `en` and `ar-ae` with correct directions.
- Pricing engine and private-upload validation covered by automated tests.
- Evidence: Django system check clean; 14 backend tests passed; OpenAPI generated cleanly; ESLint, TypeScript and Next production build passed.
- HTTP smoke evidence: `/` resolves to `/fa`; the three locale routes return 200; unsupported `/de` returns 404.
- Open gate: no browser runtime was connected, so viewport visual comparison remains unchecked.
