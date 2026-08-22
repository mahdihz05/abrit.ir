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

## 2026-08-22 — Visual reset to the approved v5 reference

- The user rejected the simplified Home interpretation and designated `abrit-homepage-polished-v5.html` as the exact frontend reference.
- The Downloads attachment and repository reference were verified byte-for-byte with the same SHA-256 hash.
- Locale routes now render the complete approved v5 surface, including all sections, mega menu, search, mobile navigation, language content, embedded brand art and motion.
- The earlier four-block React interpretation is no longer served publicly.
- CMS models and APIs remain intact; CMS-to-v5 DOM integration is deliberately reopened in the checklist and must be completed after visual approval.
- Evidence: all three locale routes return 200 with the v5 reference header and complete page payload; ESLint, generated route types, TypeScript and production build pass.

## 2026-08-22 — CMS-backed internal content, pricing and search

- Added three-language service and solution listing/detail routes aligned with the approved v5 visual tokens.
- Added CMS-backed About, Contact, Knowledge and News landing pages without activating unapproved public forms.
- Added a server-backed pricing configurator through a same-origin frontend proxy; no internal checkout was introduced.
- Added a normalized public search index with automatic publication/unpublication updates and an idempotent rebuild command.
- Added three-language search UI, dynamic sitemap, robots rules and Home language alternates.
- Seed now contains 21 content items and 63 reviewed translations; the public search index contains 63 documents.
- Evidence: 16 backend tests pass; Django check, ESLint, generated route types, TypeScript and production build pass; representative pages, pricing calculations, 404 behavior, search, sitemap and robots were smoke-tested.
