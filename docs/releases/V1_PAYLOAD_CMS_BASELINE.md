# AbrIT Version 1 - Payload CMS Baseline

## Purpose

This document defines the Version 1 checkpoint of the AbrIT public website and Payload CMS. The Git tag `v1.0.0-payload-baseline` identifies the exact source state. It is the approved rollback point before the planned Page/Block and SEO architecture work begins.

## Included

- One Next.js 16 + Payload 3 + PostgreSQL application for public pages, `/admin`, and same-origin APIs.
- Localized public content and administration for `fa`, `en`, and `ar-ae`.
- Payload Content, Media, pricing/packages, forms, submissions, private submission files, audit logs, and site/configuration globals.
- Block-based editable content support, drafts, versions, autosave, scheduled publishing configuration, preview URLs, image derivatives, and localized Media ALT.
- RBAC roles (`admin`, `editor`, `seo`, `viewer`), audit hooks, upload hardening, private submission-file delivery, retention utilities, and additive Payload migrations.
- SEO baseline documentation, runtime verification results, target architecture, implementation roadmap, migration decisions, and audit checklist under `docs/seo/`.
- Form, access, blocks, pricing, upload-validation, and search-normalization automated tests, plus an opt-in database-backed submission integration test.

## Database / Deployment Contract

- PostgreSQL is the runtime database. Configure `DATABASE_URI`, `PAYLOAD_SECRET`, `NEXT_PUBLIC_SITE_URL`, `IP_HASH_SECRET`, and `REVALIDATION_SECRET` for production.
- Apply checked-in forward migrations with `cd frontend; npm run migrate` before deploying a new build.
- For an existing legacy Payload schema, follow the guarded one-time baseline instructions in `docs/PAYLOAD_MIGRATION.md`; do not replay historical migrations blindly.
- Schedule `npm run retention:purge` daily. Scheduled publishing requires deployment scheduling for `npm run jobs:schedules` and `npm run jobs:run`.
- Back up PostgreSQL and `frontend/private-media/` together.

## Verification Performed

- `npm test` passed: 6 test files, 19 tests.
- Local HTTP checks passed for canonical output, `/robots.txt`, `/sitemap.xml`, root `307` redirect, and locale `404` status.
- Read-only PostgreSQL verification found zero duplicate non-empty localized paths or slugs in current data. The current schema does not enforce that uniqueness, so it remains a future foundation requirement.

## Known Limits Before Next Development Phase

- SEO is custom and route-dependent; official SEO/redirect plugins are not installed.
- Preview authorization with an unpublished fixture, scheduled publishing worker execution, and publish-to-render revalidation remain runtime checks requiring controlled test data.
- SEO URL uniqueness, redirect history, centralized resolver, sitemap/indexability policy, and specialist field permissions are planned foundation work.
- Static service/solution route content and split metadata renderers are legacy architecture and are expected to be replaced through the future Page/Block rebuild.

## Rollback

To return source code to this baseline, deploy the tag rather than relying on an untagged branch tip:

```powershell
git fetch --tags origin
git switch --detach v1.0.0-payload-baseline
```

Source rollback does not roll back database schema or content. Restore a PostgreSQL backup and matching `private-media/` backup from the same point if a full application/data rollback is required. Do not run destructive migration reset commands.

## Reference Documentation

- `README.md`
- `docs/PAYLOAD_MIGRATION.md`
- `docs/seo/SEO_CURRENT_STATE.md`
- `docs/seo/SEO_TARGET_ARCHITECTURE.md`
- `docs/seo/SEO_IMPLEMENTATION_ROADMAP.md`
- `docs/seo/SEO_MIGRATION_DECISIONS.md`
- `docs/seo/SEO_AUDIT_CHECKLIST.md`
