---
doc_id: ABRIT-MIGRATION-MAP
doc_type: current-state
title: Content Migration Map
status: verified
owner: TBD-owner
audience: [engineering, seo]
confidentiality: internal
source_of_truth: repository
last_verified: '2026-09-12'
baseline: a129fb3
related: [ABRIT-CONTENT, ABRIT-PAGES, ABRIT-URLMAP]
---

# Content Migration Map

`Current Content -> Current URL -> Target Page -> Payload Model -> Action`

Sources: `src/scripts/seed-payload.ts`, `seed-demo.ts`, `docs/seo/SEO_MIGRATION_INVENTORY.json` (31 keys), production sitemap (90 URLs).

- Homepage v5 HTML -> `abrit-homepage-polished-v5.html` (file) -> `/{locale}` -> `content(home)` + hero/featureGrid/faq/testimonials/cta -> IMPROVE
- Services (10) -> `/fa|en|ar-ae/services/*` (live) -> same targets -> `content(kind=service)` -> KEEP
- Solutions (6) -> `/fa|en|ar-ae/solutions/*` (live) -> same targets -> `content(kind=solution)` -> KEEP
- Independent services (4) -> `/fa|en|ar-ae/independent-services/*` (live) -> same targets -> `content(templateKey=independent-service)` -> KEEP
- News/Knowledge indexes -> `/…/news`, `/…/knowledge` (live) -> same -> `content(kind=news|knowledge)` -> KEEP
- Pricing/Products -> `/…/pricing`, `/…/products` (live) -> same -> `content(page)` (+pricing block proposed) -> NEEDS REVIEW
- About/Contact -> `/…/about`, `/…/contact` (live) -> same -> `content(page)` + form block -> KEEP
- Techor template pages -> reference only (no content carried) -> targets above -> — -> MERGE (visual only)
- Legacy pre-Payload URLs -> UNKNOWN (no legacy sitemap/logs available) -> mapped targets -> `seo-redirects` 307/308 -> NEEDS OWNER INPUT (source access, not placeholders)
- Test key `1234` -> inventory only, not in prod sitemap -> remove from seed/inventory -> — -> REMOVE
