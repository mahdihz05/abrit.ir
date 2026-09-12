---
doc_id: ABRIT-TESTS
doc_type: technical-report
title: Test Matrix
status: verified
owner: Unassigned
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
| integration core | `npm run test:core:integration` | PASS — 2/2 (temporary local-only env override) |
| integration SEO | `npm run test:seo:integration` | PASS — 10/10 (routing/resolver/permissions/schedulePublish) |
| integration forms | `npm run test:integration` | PASS — 1/1 (standalone server :3102) |
| e2e HTTP SEO | `npm run test:seo:e2e` | FAIL — 2/5 pass, 3 failures caused by environment/fixture assumptions; see P1 below |
| build | `npm run build` | PASS — production routes generated |
| migrations | `migrate:status` | PASS — all 3 migrations ran batch 1 (temporary local-only env override) |
| docker | CI docker job | NOT RUN here (CI-defined curls `/readyz /en /admin /robots.txt /sitemap.xml`) |
| skill validator | `validate_docs.py docs` | RUN — pack files: frontmatter fixed this pass; 1 pre-existing secret-scan hit in `docs/agent-reports/` (out of pack, flagged to owner) |
| a11y / visual | — | NOT IMPLEMENTED (P2/P3 gaps) |

## Local DB diagnosis

The Docker database is healthy and accepts the documented development role/database (`payload:payload_starter`); its volume is `abrit-opencode_payload_starter_postgres`, port host `5433`. `frontend/.env` exists but was not read or printed. The original `auth_failed` therefore comes from a stale/mismatched local `DATABASE_URI` in that file, not Docker/Postgres. Passing the exact `env.local.example` connection shape as process-only variables made `migrate:status` and all integration suites connect. No populated `.env` was changed or committed.

## P1: reproducible HTTP E2E fixture

`test:seo:e2e` starts and exercises the production standalone runtime, but its assertions hard-code `Payload CMS Starter` and `http://localhost:3000` (`src/seo/seo-http.e2e.test.ts:11,93,103`). The existing local DB has `site-settings.brandName=Abrit`; its loaded local environment supplies localhost:3000, so 3 of 5 assertions fail even though the response used the correct current brand. Make the test derive the expected brand/origin from its current `site-settings` fixture, or isolate/reset a dedicated test DB. This is test-fixture debt, not production SEO evidence.

Distinction kept: code exists ≠ test exists ≠ executed ≠ passed. The remaining Test Verification gap is the E2E fixture correction and a clean rerun.
