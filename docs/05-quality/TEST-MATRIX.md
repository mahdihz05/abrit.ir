---
doc_id: ABRIT-TESTS
doc_type: technical-report
title: Test Matrix
status: verified
owner: TBD-owner
audience: [engineering, qa]
confidentiality: internal
source_of_truth: repository
last_verified: '2026-09-12'
baseline: a129fb3
related: [ABRIT-QA, ABRIT-STATUS]
---

# Test Matrix (execution recorded 2026-09-12, `frontend/`, Node v22.22.0)

| Layer | Command | Result |
|---|---|---|
| lint | `npm run lint` | PASS (clean, no findings) |
| typecheck | `npm run typecheck` (typegen + `tsc --noEmit`) | PASS (`tsc` exit 0) |
| unit | `npm run test` (vitest run) | PASS — 14 files, 64/64 tests; 5 e2e skipped (need runtime) |
| integration (core/seo/forms) | `test:core:integration`, `test:seo:integration`, `test:integration` | NOT RUN (need working DB; dev pg auth_failed on `migrate:status`) |
| e2e http | `test:seo:e2e` | NOT RUN (need runtime) |
| build | `npm run build` | NOT RUN here (CI covers; run before release) |
| migrations | `migrate:status` | BLOCKED — `auth_failed` (credential mismatch vs local pg 5433; no mutation attempted) |
| docker | CI docker job | NOT RUN here (CI-defined curls `/readyz /en /admin /robots.txt /sitemap.xml`) |
| skill validator | `validate_docs.py docs` | RUN — pack files: frontmatter fixed this pass; 1 pre-existing secret-scan hit in `docs/agent-reports/` (out of pack, flagged to owner) |
| a11y / visual | — | NOT IMPLEMENTED (P2/P3 gaps) |

Distinction kept: code exists ≠ test exists ≠ executed ≠ passed. Integration/build/DB runs are the remaining Test Verification gap (30%).
