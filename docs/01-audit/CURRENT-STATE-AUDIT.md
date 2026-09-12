---
doc_id: ABRIT-STATE
doc_type: current-state
title: Current State Audit
status: verified
owner: TBD-owner
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
- `migrate:status` BLOCKED (`auth_failed` vs local pg — no mutation attempted).
- Integration/e2e/build suites NOT RUN (need DB/runtime); skill `validate_docs.py` RUN (pack frontmatter fixed; findings recorded).
