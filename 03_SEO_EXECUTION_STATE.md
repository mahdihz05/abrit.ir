# ABRIT SEO Infrastructure - Execution State

## Execution

Status: COMPLETE

Active branch: `seo-infrastructure-stabilization`

Baseline: `v1.0.0-payload-baseline` -> `a129fb3f77c04a31cdb49a8874b015b032f44a5e` (unchanged)

Safety: local Docker PostgreSQL only; no production access or mutation. Test fixtures were removed. Existing unrelated untracked files were untouched.

## Infrastructure Execution Status

This table tracks the infrastructure stabilization run. Roadmap phases 11-15 remain future visual/admin/monitoring work.

| Phase | Name | Status |
|---|---|---|
| 0 | Baseline / Audit Carryover | DONE |
| 1 | URL Contract / Normalization | DONE |
| 2 | Migration Inventory | DONE |
| 3 | Plugin Prototypes | DONE |
| 4 | Non-Visual Page/Content Contract | DONE |
| 5 | URL Uniqueness / Redirect Lifecycle | DONE |
| 6 | Central SEO Resolver | DONE |
| 7 | Existing Route Integration | DONE |
| 8 | Sitemap / Robots / Schema / Cache | DONE |
| 9 | SEO Role / Workflow / Audit | DONE |
| 10 | Runtime Correctness | DONE |
| 11 | Complete Tests / CI | DONE |
| 12 | Final Infrastructure Stabilization | DONE |

## Durable Decisions

- Existing `content` remains the Page source; locales remain `fa`, `en`, `ar-ae`; no visual migration occurred.
- URL policy is `frontend/src/lib/public-url.ts`: NFC Unicode, ASCII lowercase, locale-relative path, one-segment slug.
- Migration inventory: 93 locale rows; zero current/normalized collisions, URL rewrites, or canonical anomalies.
- Legacy remediation: `fa:1234` has a space-containing slug; `en/ar-ae:1234` have unavailable localized path/slug. They have no collision or future canonical.
- Both official plugins rejected after 3.88.0 prototype: SEO duplicates storage; redirects requires replacement of its substantive model. No fork.
- Redirects use application-owned `seo-redirects`, dynamic internal content targets, 308 default/307 deliberate, and reject duplicate/self/loop/chain/invalid rules.
- `resolveSeo()` is the sole metadata/indexability authority. Search is `noindex,follow`; preview is `noindex,nofollow`; unavailable translations are omitted.
- Sitemap, schema, robots, metadata, Proxy, and cache invalidation consume resolver/URL policy. Persistent cache keys are versioned (`SEO_CACHE_VERSION`).
- SEO role may update SEO fields and disabled redirect drafts only; API-level guards deny body, URL, publication, activation, deletion, users, and configuration.
- Production Compose includes a `NODE_ENV=production` scheduler running Payload schedule discovery/jobs every minute.

## Migrations

- `20260907_133520_seo_routing_foundation` - local batch 3; redirect tables/relations plus partial unique `(path, locale)` index. Reversible.
- `20260907_135305_seo_canonical_override` - local batch 4; localized explicit canonical override switch/version field. Reversible.
- Production migrations were not applied; deployment must back up first and run checked-in migrations.

## Main Changed Areas

- URL/inventory: `frontend/src/lib/public-url.ts`, `seo-migration-inventory.ts`, `docs/seo/SEO_MIGRATION_INVENTORY*`
- Resolver/loader/schema/cache: `frontend/src/lib/seo-*.ts`, `frontend/src/lib/schema.ts`, `frontend/src/lib/seo.ts`
- Redirects/routing: `SeoRedirects.ts`, `seo-routing.ts`, `redirect-policy.ts`, `redirect-service.ts`, `frontend/src/proxy.ts`
- Crawler output: `frontend/src/app/sitemap.ts`, `frontend/src/app/robots.ts`, `content-structured-data.tsx`
- Permissions/workflow: `frontend/src/payload/access.ts`, `seo-workflow.ts`, `Content.ts`
- Runtime/deploy/CI: `deploy/compose.yaml`, `deploy/update.sh`, `deploy/README.md`, `.github/workflows/seo-infrastructure.yml`
- Tests: URL/resolver/redirect/schema units, four Payload integration suites, standalone production SEO E2E.

## Final Gates

- `npm run seo:inventory` - PASS; 93 rows, 0 collisions/rewrites/canonical anomalies.
- `npm run migrate:status` - PASS; all migrations applied locally through batch 4.
- `npm run check` - PASS; lint, typecheck, 64 unit tests, production build.
- `npm run test:seo:integration` - PASS; 4 files / 10 tests.
- `npm run test:seo:e2e` - PASS; 5 production-mode tests, all locales, preview, publish/revalidation, redirects, robots, schema, sitemap, and full sitemap crawl.
- Final local DB cleanup - PASS; zero test users/content, redirects, or queued jobs.
- `docker compose -f deploy/compose.yaml config --quiet` - PASS.

## Active Blockers

None.

## Remaining Deployment Work

- Apply both migrations after the normal production backup.
- Deploy/start the scheduler service and monitor its logs/job completion.
- Remediate the three explicitly reported legacy localized-field issues through editorial review, without silent URL rewriting.

SEO infrastructure stabilization complete. Visual Page/Block redesign has NOT started.
