---
doc_id: ABRIT-RUNBOOK
doc_type: runbook
title: Deployment Runbook
status: verified
owner: TBD-owner
audience: [operations, engineering]
confidentiality: internal
source_of_truth: repository
last_verified: '2026-09-12'
baseline: a129fb3
related: [ABRIT-ROLLBACK, ABRIT-STATUS]
---

# Deployment Runbook — `VERIFIED` (`deploy/`)

## Envs
- Dev: `docker compose up -d` (pg 5433) → `cd frontend && npm install && npm run seed && npm run dev` → `http://localhost:3000/fa`, `/admin`. NOTE: local `migrate:status` currently `auth_failed` — fix `DATABASE_URI` creds before use (owner DevOps).
- Prod: `deploy/compose.yaml` (postgres 17, web standalone :3000 ← `127.0.0.1:${WEB_PORT:-3001}`, scheduler, backup profile). No secrets in repo (names only in `env.production.example`).

## Sequence (`deploy/update.sh`)
1. `deploy/.env.production` present; `pg_dump` → `backups/`.
2. `git fetch/checkout/pull --ff-only $DEPLOY_BRANCH`.
3. Build `web` + `scheduler`; `run --rm scheduler npm run migrate`.
4. `up -d web scheduler`; 30× `curl /readyz` gate; `ps`.

## Health/backups/media
- `/healthz` (no DB); `/readyz` (DB count). Compose healthchecks on postgres + web.
- Media in `media` + `private_media` volumes; backup service (profile `operations`).
- Env names: `DATABASE_URI, PAYLOAD_SECRET, IP_HASH_SECRET, NEXT_PUBLIC_SITE_URL, REVALIDATION_SECRET, DEPLOYMENT_ENV, POSTGRES_*, PAYLOAD_ADMIN_*, STARTER_SITE_NAME, PORT/WEB_PORT, DEPLOY_BRANCH, SCHEDULER_INTERVAL_MS`.

## Monitoring/recovery
- `docker compose ps/logs`; failed `/readyz` → Rollback Plan. Proxy/TLS/CDN at host (outside repo).
