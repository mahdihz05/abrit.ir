---
doc_id: ABRIT-SCOPE
doc_type: project-overview
title: Scope
status: verified
owner: TBD-owner
audience: [management, engineering]
confidentiality: internal
source_of_truth: repository
last_verified: '2026-09-12'
baseline: a129fb3
related: [ABRIT-README, ABRIT-STATUS]
---

# Scope

## In scope
- Repository/architecture audit, deep Payload model, blocks, Envato audit + detailed mapping, real page/content inventories (seed + inventory JSON + production sitemap), localization, implementation-level SEO + gaps + full URL map + schema, executed test evidence, deployment, security, expanded ADRs, risks/debt, roadmap.

## Out of scope (this pass)
- No production changes, no destructive DB ops, no secret exposure, no code rewrite (safe reads + lint/typecheck/unit only).
- No invented URLs (legacy rows explicitly marked).
- No external write integrations (Canvas/Nextcloud/Figma/task managers) — per owner instruction; no remote write occurred.

## Boundaries
- Application: `frontend/` (Next.js + Payload, `output: standalone`, `/admin`, `/api/*`).
- DB: PostgreSQL (`src/migrations/`, 5 files incl. baseline snapshot).
- Infra: `deploy/compose.yaml` (postgres, web, scheduler, backup profile) + dev `docker-compose.yml` (pg 5433).
