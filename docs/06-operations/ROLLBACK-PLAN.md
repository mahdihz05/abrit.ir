---
doc_id: ABRIT-ROLLBACK
doc_type: rollout-plan
title: Rollback Plan
status: verified
owner: TBD-owner
audience: [operations, engineering]
confidentiality: internal
source_of_truth: repository
last_verified: '2026-09-12'
baseline: a129fb3
related: [ABRIT-RUNBOOK, ABRIT-STATUS]
---

# Rollback Plan

1. Stop: `docker compose -f deploy/compose.yaml down` (or stop `web` only for fast rollback).
2. Restore code: `git checkout <prior-tag-or-sha>` — baseline pack tag `v1.0.0-payload-baseline`; resolve the exact prior SHA from `git log` at rollback time (SHAs in docs rot; tags don't).
3. DB: restore `backups/<timestamp>.dump` only if a migration caused loss (migrations forward-only; prefer code rollback first). DB rollback is lossy by nature — last-resort.
4. Media: volumes untouched by default; restore from host backup only on confirmed media regression.
5. Verify: `/readyz` 200, `/en`, `/admin`, `/robots.txt`, `/sitemap.xml` (same curls as CI docker job).
6. Redirects/SEO: no sitemap purge needed (published-only); confirm canonicals unchanged; never roll back `seo-redirects` rows independently of content.
7. Rollback has NOT been drill-tested in this task (P1 gap) — schedule a staging drill before first prod deploy.
