---
doc_id: ABRIT-DEBT
doc_type: technical-report
title: Technical Debt Register
status: verified
owner: Unassigned
audience: [engineering]
confidentiality: internal
source_of_truth: repository
last_verified: '2026-09-12'
baseline: a129fb3
related: [ABRIT-RISKS, ABRIT-ROADMAP]
---

# Technical Debt (evidence-backed only)

- `/`→`/fa` vs `defaultLocale=en`: confirm intent (else align). Evidence: `(redirect)/page.tsx`, `site-config.ts:11`. Owner item #9.
- Admin UI i18n en+fa only (accepted for ar-ae editors). Evidence: `payload.config.ts:25-28`.
- Missing H1 field (contract proposes `content.h1`; schema has none). P2. Evidence: `Content.ts` vs `SEO_CONTENT_CONTRACT.md:6`.
- No per-locale/image sitemap; 404 metadata defaults. P2. Evidence: `seo-sitemap.ts:46-55`, `not-found/error.tsx`.
- No custom rate-limit (framework defaults). Partial. Evidence: `next.config.ts` headers only.
- Rollback undrilled; DB rollback lossy by design. P1. Evidence: `ROLLBACK-PLAN.md:7`.
- Local `migrate:status` auth_failed (credential drift). P2. Evidence: `TEST-MATRIX.md`.
- WSL-registered worktrees (`abrit-rXX`) unreadable from Win PowerShell — use WSL git or prune. Evidence: `git worktree list` in `abrit.ir`.
