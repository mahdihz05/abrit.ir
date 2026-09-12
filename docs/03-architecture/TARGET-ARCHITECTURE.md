---
doc_id: ABRIT-ARCH-TARGET
doc_type: architecture
title: Target Architecture
status: verified
owner: Unassigned
audience: [engineering, management]
confidentiality: internal
source_of_truth: repository
last_verified: '2026-09-12'
baseline: a129fb3
related: [ABRIT-ARCH, ABRIT-ROADMAP]
---

# Target Architecture (RECOMMENDED DECISIONS — additive only)

1. Content fill + `translationStatus` gate before launch (owner: content team).
2. SEO deltas: optional per-locale sitemap split, image sitemap, 404 metadata polish, H1 field decision (contract Proposal). No new CMS.
3. Redirects: legacy import → `seo-redirects` (307/308); history via `createPathChangeRedirect`.
4. Blocks: keep 7; add `pricing`/`logoMarquee` only if v5 demands (React-native).
5. Ops: host reverse proxy + TLS, backup cron, `/readyz` gating (already in compose/update.sh); staging rollback drill (P1).
6. Quality: integration/build/DB runs green; Lighthouse/CWV budget later.

Non-goals: no second backend, no Django return, no k8s, no blind Techor port.
