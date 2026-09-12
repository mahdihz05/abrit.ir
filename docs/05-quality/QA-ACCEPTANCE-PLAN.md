---
doc_id: ABRIT-QA
doc_type: technical-report
title: QA Acceptance Plan
status: verified
owner: Unassigned
audience: [qa, management]
confidentiality: internal
source_of_truth: repository
last_verified: '2026-09-12'
baseline: a129fb3
related: [ABRIT-TESTS, ABRIT-STATUS, ABRIT-OWNER-INPUT]
---

# QA Acceptance Plan (measurable; ownership/dates need owner sign-off)

- [ ] `npm run check` green (lint PASS ✓ 2026-09-12; typecheck PASS ✓; test 64/64 ✓; build pending).
- [ ] `migrate:status` clean + `update.sh` 30× `/readyz` gate (currently BLOCKED — DB auth; owner: DevOps).
- [ ] Crawl `/{locale}` + sitemap: 0 unexpected 404 (baseline: prod sitemap 90 URLs).
- [ ] Canonical self + hreflang fa/en/ar-ae + x-default on every public page (unit-covered; spot-check on staging).
- [ ] `robots.txt` + `sitemap.xml` correct per env; sitemap published-only (prod verified ✓).
- [ ] No draft/archived/redirect-source indexed (resolver tests PASS ✓; staging spot-check).
- [ ] Locale switch + RTL/LTR + Persian/Arabic glyphs (manual, owner: design/content).
- [ ] Forms submit/validate/purge; private files unauthenticated → 403/404 (integration pending DB).
- [ ] Responsive breakpoints vs v5 reference (owner: design sign-off).
- [ ] Redirects 307/308, no chains; branded 404 (404 metadata = P2).
