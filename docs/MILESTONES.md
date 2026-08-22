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

## 2026-08-22 — Private form-file hardening and retention

- Private form files now use a staff-only download route instead of a public media URL.
- Upload validation cross-checks extension, declared MIME, binary signature and safe OOXML container structure.
- Added an idempotent retention command that deletes expired submissions and their private files and writes a purge audit record.
- Public submission endpoints remain intentionally inactive until the Privacy Policy and consent gate receive human approval.
- Evidence: 19 backend tests pass; Django system check and validated OpenAPI generation are clean.

## 2026-08-22 — Localized SEO and resilient internal routes

- CMS detail responses now expose only published and reviewed language alternates for the same content item.
- Internal routes emit locale-aware canonical, hreflang, robots, OpenGraph and Twitter metadata without inventing missing translations.
- Added conditional Organization, Breadcrumb, Service and Article structured data where the required source data exists.
- Added v5-aligned loading, empty, localized 404 and recoverable runtime-error states for internal routes.
- Evidence: 20 backend tests pass; ESLint, generated Next route types, TypeScript and the 20-route production build pass; canonical, language alternate, OpenGraph and JSON-LD output were HTTP-smoke-tested locally.

## 2026-08-22 — Home header route integration

- The approved v5 Home header now navigates to the dedicated Services, Solutions, Pricing, Knowledge, News and About routes instead of scrolling to Home sections.
- Service and solution Mega Menu entries link directly to their matching detail pages in the active locale.
- Desktop and mobile assessment actions now open the localized Contact page, and mobile navigation mirrors desktop routing.

## 2026-08-22 — Global multilingual typography

- Persian, English and Arabic font families are now loaded and self-hosted through the shared locale layout rather than being merely named as unavailable CSS fallbacks.
- Locale-aware typography tokens apply Vazirmatn, Inter and IBM Plex Sans Arabic to every internal route and future component automatically.
- Buttons, inputs, selects, textareas, headings, placeholders and Latin operational labels now inherit the correct global font rules consistently.
