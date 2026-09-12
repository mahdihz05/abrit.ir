---
doc_id: ABRIT-SEO-GAPS
doc_type: technical-report
title: SEO Gap Analysis
status: verified
owner: TBD-owner
audience: [seo, engineering]
confidentiality: internal
source_of_truth: repository
last_verified: '2026-09-12'
baseline: a129fb3
related: [ABRIT-SEO-AUDIT, ABRIT-SEO-SPEC, ABRIT-ROADMAP]
---

# SEO Gap Analysis

`Requirement | Current State | Target State | Gap | Priority | Evidence`

- Draft/preview protection | gated + forced noindex | same | none | P3 | `seo-resolver.ts:76-90`, auth gate
- Canonical/hreflang | implemented, prod-verified | same | none | P3 | resolver + 90-URL sitemap parity
- Sitemap/robots/redirects core | implemented, prod-verified | same | none | P3 | live robots/sitemap fetch
- Legacy URL import | 0 rows (inventory `redirectsRequired: 0`) | 307/308 map | data (owner) | P0 | `URL-MIGRATION-MAP.csv` — NEEDS OWNER INPUT
- H1 field | absent (contract Proposal) | decided + implemented | schema | P2 | `Content.ts` vs contract
- Image/video sitemap | none | image extension | small | P2 | `seo-sitemap.ts` — NOT IMPLEMENTED
- Per-locale sitemap split | single flat file | optional split index | small | P2 | NOT IMPLEMENTED
- 404/error metadata | defaults | branded | small | P2 | `not-found/error.tsx`
- ar-ae copy QA | live but unreviewed | approved | content (owner) | P1 | NEEDS OWNER INPUT
- Keywords/titles tuning | seed defaults | strategy-driven | strategy (owner) | P1 | NEEDS OWNER INPUT
- CWV/RUM | headers only | budgets + monitoring | ops | P1 | NOT IMPLEMENTED
