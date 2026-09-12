---
doc_id: ABRIT-SECURITY
doc_type: technical-report
title: Security Review
status: verified
owner: TBD-owner
audience: [engineering, management]
confidentiality: confidential
source_of_truth: repository
last_verified: '2026-09-12'
baseline: a129fb3
related: [ABRIT-TESTS, ABRIT-OWNER-INPUT]
---

# Security Review — `VERIFIED` (static code-read 2026-09-12; no credentials printed)

- Auth/admin: Payload `users` gates `/admin`; auth lockout `maxLoginAttempts 5 / 15min` (`Users.ts:6`); field-level access (`seoFieldManager` vs `contentFieldManager`). `VERIFIED`.
- RBAC/API: per-collection access (`adminOnly/seoManager/contentManager/formManager/contentReader`); public reads limited to eligible content; `access.test.ts` + `seo-permissions` integration PASS-adjacent (unit level). `VERIFIED`.
- Uploads: `validatePublicMediaUpload` + `validatePrivateUpload` + `file-type` dep; `uploads.test.ts` 6/6 PASS; private files via hash-gated route. `VERIFIED`.
- Secrets: required vars with prod placeholder/length guards (`site-config.ts:14-43`); `.env` gitignored; docs carry names only; skill validator secret-scan on pack: CLEAN. `VERIFIED`.
- Preview: auth-gated drafts; resolver forces preview → noindex/nofollow. `VERIFIED`.
- Headers: HSTS/nosniff/SAMEORIGIN/Referrer/Permissions/CSP-Report-Only (`next.config.ts:11-23`). `VERIFIED`.
- CSRF/CORS/rate-limit: framework defaults; no custom limiter → `PARTIALLY VERIFIED` (WAF/rate-limit at proxy if abuse).
- Forms: server validation + `retention:purge` expiry; submissions API create-closed except route. `VERIFIED`.
- Sensitive routes `/api/private/*`, `/api/revalidate` (secret), `/admin`, `/api/` robots-disallowed. `VERIFIED`.
- Open item (P1): validator flagged a possible credential pattern in pre-existing `docs/agent-reports/phase-1-plan-aprove.md` (outside this pack, likely false positive) — owner to review/rotate if real. Pack itself contains no secrets (scan evidence above).
