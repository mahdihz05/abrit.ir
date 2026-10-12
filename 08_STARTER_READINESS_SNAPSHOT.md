## 1. Git / Current State

- Branch: `seo-infrastructure-stabilization`
- HEAD: `a129fb3f77c04a31cdb49a8874b015b032f44a5e`
- Baseline tag: `v1.0.0-payload-baseline` is an annotated tag object at `9661e8eec6f66a8b599e16acc1a364ac6dec8fc6` that peels to source commit `a129fb3f77c04a31cdb49a8874b015b032f44a5e`.
- The former discrepancy was notation rather than tag movement: one report recorded the tag object and another recorded its peeled commit. The historical tag remains unchanged.
- Working tree: substantially dirty. No files are staged.
- Modified tracked files: deployment files, SEO routes/helpers, Payload config/types/access/content/revalidation, package scripts, and SEO audit checklist.
- Untracked implementation files include the SEO resolver/cache/redirect system, two migrations, integration/E2E tests, CI workflow, reports, and local agent configuration.
- New SEO migrations:
  - `frontend/src/migrations/20260907_133520_seo_routing_foundation.ts`
  - `frontend/src/migrations/20260907_135305_seo_canonical_override.ts`
- SEO migrations are registered in modified `frontend/src/migrations/index.ts`, but all related changes are uncommitted.
- Application build status: `npm run check` most recently passed: lint, typecheck, 64 unit tests, and production build. SEO integration and E2E suites also passed. This is not yet a clean publishable repository because the implementation is uncommitted.

## 2. Current Architecture

| Subsystem | Status | Notes |
|---|---|---|
| Payload configuration | DONE | Payload 3, PostgreSQL adapter, Lexical, admin, generated types in `frontend/src/payload.config.ts`. |
| Next.js frontend | DONE | Next 16 app, public routes, admin, API routes in one Node process. |
| Database | DONE | PostgreSQL with checked-in historical and uncommitted SEO migrations. |
| Localization | PARTIAL | Reusable localization mechanism; locale set/default is fixed to `fa`, `en`, `ar-ae`. |
| Content/Page architecture | PARTIAL | Generic `content` collection and block layout exist; several public pages remain static/catalog-driven. |
| Blocks | PARTIAL | Generic blocks exist, but legacy and ABRIT-specific template paths remain. |
| Media | DONE | Upload collection, localized ALT support, public/private media handling. |
| Forms | DONE | Configurable forms, submissions, private files, retention script. |
| RBAC | DONE | Admin/content/SEO roles and field-level controls. |
| Audit logs | DONE | Collection/global audit hooks and audit-log collection. |
| Drafts | DONE | Localized drafts with autosave. |
| Versions | DONE | Content/global versions configured. |
| Preview | DONE | Controlled draft preview and noindex policy tested. |
| Scheduled publishing | DONE | Payload scheduling and uncommitted production scheduler service. |
| SEO | DONE | Infrastructure completed, but editor product UX remains incomplete. |
| Redirects | DONE | Locale-aware redirects and lifecycle handling. |
| Sitemap | DONE | Resolver-driven sitemap. |
| Structured data | PARTIAL | Organization/WebSite, breadcrumb, service, visible FAQ; no reliable Article/Product builders. |
| Cache/revalidation | DONE | Versioned tags and targeted invalidation. |
| Tests | PARTIAL | Good SEO coverage; fresh starter/bootstrap coverage is absent. |
| Docker/deployment | PARTIAL | Good Compose topology, but ABRIT deployment assumptions and backup gaps remain. |

## 3. ABRIT-Specific Coupling

| Classification | Finding | Location |
|---|---|---|
| MOVE TO CONFIG | Site name, contact defaults, portal/checkout/social identity | `frontend/src/payload/globals/SiteSettings.ts:14-25` |
| MOVE TO CONFIG | Hard-coded title template and metadata origin fallback | `frontend/src/app/[locale]/layout.tsx`, `frontend/src/lib/seo.ts`, `frontend/src/lib/seo-loader.ts`, `frontend/src/app/robots.ts` |
| MOVE TO CONFIG | Hard-coded `AbrIT Infinite Cloud` and logo asset | `frontend/src/components/brand.tsx` |
| MOVE TO CONFIG | Chatwoot host/token and CSP allowlist | `frontend/src/app/[locale]/layout.tsx`, `frontend/next.config.ts:26` |
| MOVE TO CONFIG | WHMCS checkout host and product mapping | `frontend/src/lib/managed-it-packages.ts`, `product-packages.ts`, `product-catalog.ts` |
| MOVE TO CONFIG | `x-abrit-*` revalidation headers | `frontend/src/app/api/revalidate/route.ts` |
| MOVE TO SEED | All branded pages, services, solutions, navigation, forms, packages, home layout, admin display name | `frontend/src/scripts/seed-payload.ts` |
| MOVE TO SEED | Static company/service/product/navigation data | `frontend/src/lib/public-content.ts`, `independent-services.ts`, `internal-copy.ts`, `product-packages.ts`, `managed-it-packages.ts` |
| MOVE TO SEED | Toman/IRT product and pricing assumptions | `frontend/src/payload/collections/Pricing.ts`, `frontend/src/lib/pricing.ts`, `frontend/src/lib/types.ts` |
| REMOVE FROM STARTER | Static ABRIT homepage compatibility layer and branded assets | `abrit-homepage-polished-v5.html`, `frontend/src/lib/reference-homepage.ts`, `frontend/src/components/reference-homepage.tsx`, `frontend/src/app/[locale]/page.tsx`, `frontend/public/abrit-*` |
| REMOVE FROM STARTER | Django migration/reconciliation scripts and ABRIT operational prompts/reports | `frontend/src/scripts/migrate-django.ts`, `validate-migration.ts`, `reconcile-*`, root `SEO_*.md`, `OPENCODE_*`, `PAYLOAD_OVERNIGHT_*` |
| SITE-SPECIFIC EXAMPLE | Managed IT catalog, service topology, pricing configurators | `frontend/src/components/pricing-configurator.tsx`, `product-configurator.tsx`, `pricing-overview.tsx` |
| KEEP AS GENERIC CORE | Payload collections, forms, media, RBAC, audit, SEO/redirect/cache architecture | `frontend/src/payload`, `frontend/src/lib/seo-*`, `public-url.ts`, `redirect-*` |
| KEEP AS GENERIC CORE | Localized routing, disabled fallback, RTL support | `frontend/src/lib/locales.ts`, `payload.config.ts` |

Locale support is reusable. The fixed locale union, Persian default locale, Persian/Arabic fonts, Iran/Mashhad references, Jalali/Persian copy, and `IRT` currency are ABRIT-specific.

## 4. Content / Data Dependency

Required runtime schema:

- Collections: `users`, `media`, `content`, `seo-redirects`, `packages`, `forms`, `form-submissions`, `submission-files`, `audit-logs`.
- Globals: `site-settings`, `design-settings`, `navigation`, `product-catalog`.
- Generic routes require published localized `content` records with `path` and `slug`.
- The home route assumes a content record with key `home`, but currently renders an ABRIT static-reference homepage.
- Service, solution, product, pricing, and independent-service routes assume ABRIT records, static catalogs, template keys, and package/form data.
- Navigation is expected to exist in the `navigation` global.
- Form blocks require active `forms` records.
- No hard-coded numeric database IDs were found; stable string keys/slugs are used instead.

A completely empty database can technically start after migration and the current seed, as demonstrated by the SEO CI sequence. It does not start as a generic site: the supplied seed creates an ABRIT managed-IT website.

## 5. Seed / Bootstrap

Current command:

```bash
cd frontend
npm run migrate
npm run seed
```

`npm run seed` is idempotent and currently creates:

- ABRIT content pages, services, solutions, products, pricing pages, home, contact, knowledge, and news.
- ABRIT site settings and navigation.
- ABRIT package/pricing data and WHMCS references.
- Consultation and quote-request forms.
- An admin user only if both `PAYLOAD_ADMIN_EMAIL` and `PAYLOAD_ADMIN_PASSWORD` exist.
- Four ABRIT reconciliation passes for homepage and independent-service records.

A generic Starter seed must instead create:

- One administrator.
- Generic site settings.
- Empty or minimal navigation.
- A generic localized home page using typed blocks.
- Optional example pages/forms/media clearly marked as disposable demo content.
- No company identity, commerce integration, product IDs, service catalog, or production customer data.
- Idempotency and failure/rollback behavior, or at minimum explicit resumability.
- A documented fresh-Postgres bootstrap command.

## 6. Environment / Secrets

`.env.example` could not be inspected for values, and no secret values were read. Variable usage shows:

| Variable | Classification |
|---|---|
| `DATABASE_URI` | GENERIC REQUIRED, SECRET |
| `PAYLOAD_SECRET` | GENERIC REQUIRED, SECRET |
| `NEXT_PUBLIC_SITE_URL` | GENERIC REQUIRED for production; currently unsafe because ABRIT is the fallback |
| `PAYLOAD_ADMIN_EMAIL` | GENERIC OPTIONAL for runtime; required for first-admin bootstrap |
| `PAYLOAD_ADMIN_PASSWORD` | GENERIC OPTIONAL for runtime; required for first-admin bootstrap, SECRET |
| `IP_HASH_SECRET` | GENERIC REQUIRED in production, SECRET |
| `REVALIDATION_SECRET` | GENERIC OPTIONAL unless webhook revalidation is enabled, SECRET |
| `DEPLOYMENT_ENV` | PRODUCTION-ONLY |
| `NODE_ENV`, `PORT` | GENERIC deployment variables |
| `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD` | GENERIC Docker variables; current names/defaults are ABRIT-specific |
| `RUN_PAYLOAD_INTEGRATION`, `RUN_SEO_E2E`, `SEO_E2E_BASE_URL`, `SEO_E2E_PORT`, `SEO_INVENTORY_SITE_URL` | GENERIC OPTIONAL test/inspection variables |
| `PAYLOAD_MIGRATION_BASELINE_CONFIRM` | Migration-only safeguard |
| `DJANGO_SQLITE_PATH`, `DJANGO_PUBLIC_MEDIA_ROOT`, `DJANGO_PRIVATE_MEDIA_ROOT`, `PYTHON_COMMAND`, `LEGACY_REPOSITORY_ROOT` | ABRIT-specific legacy migration tooling |

`.env.example` is insufficient for a fresh generic clone because deployment Compose variables, `DEPLOYMENT_ENV`, test variables, and legacy-tool separation are undocumented. More importantly, production fallbacks point to `https://abrit.ir`.

## 7. Fresh Clone Readiness

**NO.**

A developer can likely make the current ABRIT application run with PostgreSQL, migrations, environment values, and `npm run seed`. They cannot reliably use it as a neutral starter without knowing ABRIT because:

- Root setup documentation omits `npm run migrate` before `npm run seed`.
- The required seed is ABRIT-specific and invokes ABRIT reconciliation scripts.
- The homepage, service/solution routes, product/pricing model, integrations, assets, domain fallbacks, and deployment docs are ABRIT-specific.
- SEO migrations and CI are uncommitted.
- No generic bootstrap contract exists.

## 8. Page / Block Foundation

Generic blocks:

- `hero`
- `richText`
- `featureGrid`
- `faq`
- `testimonials`
- `cta`
- `form`

Location: `frontend/src/payload/blocks.ts`.

ABRIT/legacy coupling:

- `contentSection` is explicitly a legacy imported JSON block.
- Variants such as `dashboard`, `network`, and `bento` encode the current visual system.
- `Content.serviceData` and `Content.serviceListing` are bespoke independent-service schemas.
- `homepageServices` and `homepageSolutions` relationships assume ABRIT information architecture.
- Dedicated service, solution, product, pricing, search, and independent-service routes bypass a generic page renderer in places.
- The home route renders the static reference homepage rather than a generic block page.

Suitable as a foundation, but not yet a reusable starter. Before Starter V1, separate generic pages/blocks from legacy/static ABRIT render paths, remove template-specific route requirements from the default install, and make the generic home page the actual default route.

## 9. SEO Product Completeness

| Capability | Status | Classification |
|---|---|---|
| SEO fields | Present: title, description, OG, canonical, robots | REQUIRED BEFORE STARTER V1: make labels/help generic and editor-oriented |
| SERP preview | Missing | OPTIONAL V1 |
| Social preview | Missing | OPTIONAL V1 |
| Validation warnings | Hard validation exists; editorial warnings/counters are limited | REQUIRED BEFORE STARTER V1 |
| Canonical controls | Functional, explicit enable switch and validation | REQUIRED BEFORE STARTER V1: document/editorize UX |
| Robots controls | Functional boolean controls | REQUIRED BEFORE STARTER V1: explain consequences in admin |
| Redirect management | Functional collection and lifecycle behavior | REQUIRED BEFORE STARTER V1: generic management UX/documentation |
| Redirect history | Missing as a dedicated editor feature | FUTURE |
| Localization completeness visibility | `translationStatus` exists; no completeness dashboard | OPTIONAL V1 |
| Schema controls | Resolver-driven automatic schema only | FUTURE; do not expose unsafe manual schema controls by default |
| SEO role usability | Permission model exists | REQUIRED BEFORE STARTER V1: generic labels, workflow guidance, role setup documentation |

## 10. Tests / CI

Current commands:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run check
npm run migrate
npm run seed
npm run test:integration
npm run test:seo:integration
npm run test:seo:e2e
```

Coverage:

- Unit: URL normalization, SEO resolver, redirects, robots policy, schema serialization, forms, pricing, blocks, uploads, access.
- Integration: SEO routing/uniqueness, resolver/sitemap, SEO permissions, preview/runtime scheduling, form submission route.
- E2E: production-mode locale metadata, draft preview, revalidation, redirects, robots, sitemap crawl.
- CI: untracked `.github/workflows/seo-infrastructure.yml`; it provisions PostgreSQL, migrates, seeds, runs inventory, `check`, SEO integration, and SEO E2E.
- Migrations: exercised by the untracked CI workflow, not by committed CI.
- Fresh clone/bootstrap: not tested as a generic starter.
- Docker: Compose configuration was validated locally, but no general Docker smoke test is in CI.

Minimum missing Starter V1 gates:

1. Commit a generic CI workflow.
2. Test fresh PostgreSQL migration plus generic bootstrap.
3. Run form-submission integration in CI.
4. Validate production Compose/image startup in CI or a release gate.
5. Test migration up/down or at least migration application from empty PostgreSQL.
6. Ensure `npm run check` excludes no critical test class unintentionally.

## 11. Deployment

Current assumptions:

- Docker Compose with PostgreSQL 17, Next standalone image, named media/private-media volumes.
- Builder runs `npm ci`, `npm run migrate`, and `npm run build`.
- Web serves on host `127.0.0.1:3001`.
- Scheduler loops every minute through Payload schedule discovery and job execution.
- Production expects `.env.production`, Node 22, Nginx, and an ABRIT server/workspace convention.
- Updates use `deploy/update.sh`.

ABRIT coupling:

- Compose project name: `abrit-payload`.
- Deployment path, branch assumptions, Nginx configuration, database names, and operational documentation.
- The update flow backs up PostgreSQL but does not back up media volumes, despite media being stateful.
- Scheduler implementation is uncommitted.
- No generic production environment template is tracked.

## 12. Repository Productization Gaps

**P0 — Must complete before Starter V1**
1. Commit or intentionally discard/restructure all current SEO work; publish from a clean, reviewed commit history.
2. Correct the baseline-tag/report discrepancy and define a new immutable starter release tag.
3. Replace ABRIT seed/reconciliation flow with a generic bootstrap.
4. Remove ABRIT domain fallbacks, branding, customer identity, and embedded integration credentials/tokens from default runtime paths.
5. Make the generic block-based home/page path the default; isolate/remove the static ABRIT homepage and specialized routes.
6. Commit a generic CI pipeline covering empty DB migration, bootstrap, check, integration, E2E, and Docker smoke validation.
7. Document a correct fresh-clone sequence including migration before seed.
8. Provide a complete environment contract and safe templates for local/CI/production.
9. Generalize or isolate pricing, IRT/Toman, WHMCS, managed-IT, and Chatwoot integrations.
10. Remove or relocate ABRIT internal reports, prompts, worktree instructions, legacy migration tooling, and branded assets from the publishable starter.

**P1 — Recommended soon after**
- Add editor-friendly SEO warnings, field guidance, and role onboarding.
- Add disposable demo seed content.
- Add media backup/restore to deployment operations.
- Add migration rollback testing.
- Separate optional integrations into clearly documented modules.
- Add localization-completeness reporting.

**P2 — Future**
- SERP and social previews.
- Redirect history UI.
- Schema mode/editor controls.
- Monitoring jobs for broken links, orphan content, redirects, translations, sitemap and schema health.
- Extract reusable packages only after multiple consumers exist.

## 13. Final Readiness Matrix

| Area | Current State | Reusable? | Work Required | Priority |
| ---- | ------------- | --------- | ------------- | -------- |
| Git baseline | Dirty source work preserved; tag object/peeled commit distinction resolved | No | Clean, review, commit, tag starter release | P0 |
| Payload core | Strong Payload 3 configuration | Yes | Remove brand admin metadata/defaults | P1 |
| Database/migrations | PostgreSQL and migrations exist; SEO migrations uncommitted | Partial | Commit/review; test empty DB and rollback | P0 |
| Localization | Localized model works | Partial | Make locale/default/font policy configurable | P0 |
| Content/Page | Generic collection plus static specialized routes | Partial | Default to generic CMS-rendered pages | P0 |
| Blocks | Seven generic blocks plus legacy block | Partial | Isolate legacy/template-specific blocks | P0 |
| Media | Reusable upload/media model | Yes | Document storage/bootstrap behavior | P1 |
| Forms | Reusable configurable forms | Yes | Replace ABRIT form seed with generic examples | P1 |
| RBAC | Roles and field controls exist | Yes | Document generic role provisioning | P1 |
| Audit | Hooks and collection exist | Yes | Retain as core | P2 |
| Draft/Preview | Tested localized draft preview | Yes | Document setup | P1 |
| Scheduler | Functional but uncommitted Compose support | Partial | Commit and production-test scheduler | P0 |
| SEO infrastructure | Complete and tested | Yes | Commit and remove ABRIT fallbacks | P0 |
| SEO admin UX | Controls exist, editor product UX limited | Partial | Add generic guidance/warnings | P0 |
| Redirects | Functional lifecycle and validation | Yes | Generic admin documentation | P0 |
| Seed/bootstrap | ABRIT seed only | No | Build generic idempotent bootstrap | P0 |
| Environment | Partial `.env.example`; ABRIT defaults | No | Complete documented generic templates | P0 |
| Tests | Strong SEO tests, limited starter tests | Partial | Add generic bootstrap/Docker/migration gates | P0 |
| CI | Untracked SEO-only workflow | No | Commit generic CI workflow | P0 |
| Docker/deployment | Solid base with ABRIT operations | Partial | Generalize, add media backup/template | P0 |
| Documentation | ABRIT-centric and setup order incomplete | No | Rewrite starter docs | P0 |
| Fresh-clone readiness | Works only as an ABRIT bootstrap | No | Complete P0 bootstrap/config/docs work | P0 |

## 14. Final Decision

CURRENT STARTER READINESS: 40%

TOP 10 REQUIRED ACTIONS FOR STARTER V1

1. Create a clean reviewed commit series containing the SEO work, migrations, tests, CI, and deployment changes.
2. Resolve the baseline tag discrepancy and create a new immutable starter release tag.
3. Replace `npm run seed` with a generic, idempotent starter bootstrap.
4. Remove ABRIT brand/domain/company defaults from runtime fallbacks and admin metadata.
5. Move ABRIT service, solution, pricing, product, navigation, and form content into an optional example seed.
6. Remove or isolate the ABRIT static homepage, reference assets, legacy renderer, and specialized route dependencies.
7. Make locales, default locale, fonts, and direction policy configurable.
8. Generalize or modularize WHMCS, Chatwoot, IRT/Toman pricing, and ABRIT webhook conventions.
9. Commit a CI workflow that proves empty-Postgres migration, generic seed, build, integration, E2E, and Docker startup.
10. Rewrite fresh-clone, environment, migration, backup, scheduler, and deployment documentation for a neutral public repository.
