---
doc_id: ABRIT-ROADMAP
doc_type: roadmap
title: Implementation Roadmap
status: verified
owner: Unassigned
audience: [management, engineering]
confidentiality: internal
source_of_truth: repository
last_verified: '2026-09-12'
baseline: a129fb3
related: [ABRIT-STATUS, ABRIT-OWNER-INPUT, ABRIT-QA]
---

# Implementation Roadmap (no fabricated dates; sequencing + acceptance only)

## Operating context

`abrit.ir` is the temporary live site. The owner intends migration to the new presentation by the end of Mehr; treat this as a target window, not a production authorization. Existing production must remain unchanged until the NOW gates pass.

## NOW (P0/P1 — before cutover)
- [ ] Implement and test an approved non-localized redirect boundary, then import only HIGH/VERIFIED mappings. Accept: `/تماس-با-ما/` → `/fa/contact` one-hop 308; 0 loops/chains. Evidence: `LEGACY-URL-DISCOVERY.md`. Owner: engineering + hosting access.
- [ ] Secrets handover (vault) + fix local DB creds. Accept: prod boot, `/readyz` 200, `migrate:status` clean. Owner: DevOps.
- [ ] Rollback staging drill. Accept: drill log attached to runbook. Owner: DevOps.
- [ ] Repair SEO HTTP E2E fixture isolation (brand/origin expectation). Accept: 5/5 `test:seo:e2e` pass against dedicated/reset local DB. Owner: engineering.

## NEXT (P1)
- [ ] ar-ae copy approval + keyword-driven titles/descriptions + H1 decision. Accept: QA plan green. Owner: content/SEO.
- [ ] Pricing block (if needed), image sitemap, 404 metadata. Accept: tests + sitemap checks.
- [ ] Integration/e2e/build runs recorded. Accept: TEST-MATRIX all-PASS row.

## LATER (P2/P3)
- [ ] Per-locale sitemap split, a11y (axe), Lighthouse budgets, RUM, CDN review, `1234` removal.
