---
doc_id: ABRIT-REPO-AUDIT
doc_type: current-state
title: Repository Audit
status: verified
owner: TBD-owner
audience: [engineering, operations]
confidentiality: internal
source_of_truth: repository
last_verified: '2026-09-12'
baseline: a129fb3
related: [ABRIT-STATE, ABRIT-ARCH]
---

# Repository Audit — `VERIFIED`

- Root: repo root; app root: `frontend/`; package manager `npm@10.9.4` (`frontend/package.json:6`); Node `>=22 <23` (`.nvmrc: 22`; runtime `v22.22.0` observed during checks).
- Next 16.3.2, Payload ^3.88.0, db-postgres ^3.88.0, lexical editor, React 19.2.8, sharp, zod (`frontend/package.json:37-52`).
- DB adapter: `postgresAdapter({migrationDir: src/migrations})` (`frontend/src/payload.config.ts:37`); pg 17-alpine (compose files); 5 migration files (baseline + seo_routing_foundation + seo_canonical_override + snapshot JSON).
- Structure: `frontend/src/{app,payload/{collections,globals,hooks,access},lib,components,scripts,migrations}`; `deploy/{Dockerfile,compose.yaml,update.sh,env.production.example,README.md}`; `techor-html-package/techor-placeholder/`; `docs/`.
- Scripts (`frontend/package.json:8-35`): dev/build/start, `payload`, `migrate*`, `bootstrap|seed|seed:demo`, `seo:inventory`, `retention:purge`, `jobs:*`, `test(+integration/core/seo/e2e)`, lint/typecheck/check.
- Docker: dev `docker-compose.yml` (5433:5432); prod `deploy/compose.yaml` (postgres, web 3001→3000, scheduler, backup profile); reverse proxy: none in repo (`NOT IMPLEMENTED` — host level).
- CI: `.github/workflows/starter-ci.yml` + `codeql.yml` + dependabot — `VERIFIED` (listed at repo root 2026-09-12; earlier miss was wrong cwd `frontend/`).
- Git: branch `opencode-dev @ a129fb3`; tag `v1.0.0-payload-baseline` (`VERIFIED` via `git tag`); remotes `upstream/*`, `no-mistakes/opencode-dev`.
- Env names only — `DATABASE_URI, PAYLOAD_SECRET, IP_HASH_SECRET, NEXT_PUBLIC_SITE_URL, REVALIDATION_SECRET, DEPLOYMENT_ENV, POSTGRES_*, PAYLOAD_ADMIN_*, STARTER_SITE_NAME, PORT/WEB_PORT, DEPLOY_BRANCH, SCHEDULER_INTERVAL_MS`. No secrets printed.
- Pre-existing generated inventory: `docs/seo/SEO_MIGRATION_INVENTORY.json` (93 records, 31 keys × 3 locales) + SUMMARY + `SEO_CONTENT_CONTRACT.md` + `SEO_PLUGIN_PROTOTYPE_DECISIONS.md` — used as evidence, not duplicated.
