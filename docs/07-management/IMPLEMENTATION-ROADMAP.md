---
doc_id: ABRIT-ROADMAP
doc_type: roadmap
title: Implementation Roadmap
status: verified
owner: TBD-owner
audience: [management, engineering]
confidentiality: internal
source_of_truth: repository
last_verified: '2026-09-12'
baseline: a129fb3
related: [ABRIT-STATUS, ABRIT-OWNER-INPUT, ABRIT-QA]
---

# Implementation Roadmap (no fabricated dates; sequencing + acceptance only)

## NOW (P0 — owner-blocked)
- [ ] Legacy URL export → `seo-redirects` import. Accept: 0 chains/loops, curl 307/308. Owner: hosting access.
- [ ] Secrets handover (vault) + fix local DB creds. Accept: prod boot, `/readyz` 200, `migrate:status` clean. Owner: DevOps.
- [ ] Rollback staging drill. Accept: drill log attached to runbook. Owner: DevOps.

## NEXT (P1)
- [ ] ar-ae copy approval + keyword-driven titles/descriptions + H1 decision. Accept: QA plan green. Owner: content/SEO.
- [ ] Pricing block (if needed), image sitemap, 404 metadata. Accept: tests + sitemap checks.
- [ ] Integration/e2e/build runs recorded. Accept: TEST-MATRIX all-PASS row.

## LATER (P2/P3)
- [ ] Per-locale sitemap split, a11y (axe), Lighthouse budgets, RUM, CDN review, `1234` removal.
