---
doc_id: ABRIT-STATE
doc_type: current-state
title: Current State Audit
status: verified
owner: Unassigned
audience: [management, engineering]
confidentiality: internal
source_of_truth: repository
last_verified: '2026-09-12'
baseline: a129fb3
related: [ABRIT-REPO-AUDIT, ABRIT-ARCH, ABRIT-STATUS]
---

# Current State Audit

## Exists (`VERIFIED` 2026-09-12)
- Unified Next.js 16.3.2 + Payload 3.88 app (`output: standalone`, `withPayload`), `/admin`, `/api/*`, `/[locale]`, `/sitemap.xml`, `/robots.txt`, `/healthz`, `/readyz`.
- 8 collections, 3 globals, 7 blocks (field-level documented), 5 migration files, seed (home/contact/form) + demo seed + scheduler + retention.
- SEO pipeline beyond plugin level (resolver/canonical/hreflang/robots/sitemap/307-308 redirects/schema), 15 test files (14 unit + 1 e2e), security headers.
- Production live: robots + 90-URL sitemap match the specified policy exactly.

## Thin/missing
- ar-ae copy QA + translation ownership (owner); legacy URL list (owner); H1 field (contract Proposal, P2); per-locale/image sitemap (P2); 404 metadata polish (P2); custom rate-limit (partial); k8s/CDN/RUM (out of scope); rollback drill (P1).

## Executions this pass (evidence, not claims)
- `npm run lint` PASS; `npm run typecheck` PASS (`tsc` exit 0); `npm run test` 64/64 PASS (5 e2e skipped, need runtime).
- Docker Postgres validated healthy; `migrate:status` PASS with a process-only local development URI (all 3 migrations ran).
- `test:core:integration` PASS 2/2; `test:seo:integration` PASS 10/10; `test:integration` PASS 1/1; build PASS.
- `test:seo:e2e` started standalone runtime but FAIL 3/5 because hard-coded expected brand/origin diverge from the existing local fixture. This is P1 test debt, not treated as a production pass.
