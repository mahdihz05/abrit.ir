# SEO Infrastructure Final Report

| Area | Implementation | Tests / Evidence | Remaining Risk | Status |
|---|---|---|---|---|
| Baseline safety | Dedicated branch; baseline tag preserved; local-only data operations | Git/tag checks; baseline HTTP statuses | Production deployment not performed | DONE |
| URL contract | Central NFC/ASCII-lowercase locale-relative path, slug, route, canonical builders | 23 URL tests; typecheck | Three legacy localized-field remediation candidates | DONE |
| Migration inventory | Read-only 93-row JSON and Markdown reports with collision/canonical/route analysis | `npm run seo:inventory`; zero collisions/rewrites | Editorial cleanup for test record `1234` | PARTIAL |
| Plugin decision | Both official 3.88.0 plugins rejected with source/config evidence; no fork | `SEO_PLUGIN_PROTOTYPE_DECISIONS.md` | Revisit only if upstream models materially change | DONE |
| Content contract | Existing `content` preserved; typed resolver/render/schema ownership | Contract unit test and typecheck | Legacy visual/static sources intentionally retained | DONE |
| URL uniqueness | Application validation plus partial unique `(path, locale)` DB index | Migration batch 3; integration duplicate tests | Production migration pending deployment | DONE |
| Redirects | Audited locale source model, internal target, 307/308, lifecycle hooks, Proxy execution, loop/chain/self guards | Unit, integration, and one-hop 308 E2E | Production migration/deploy pending | DONE |
| SEO resolver | One typed authority for fallback, canonical, robots, social, alternates, preview, schema input, sitemap eligibility | 7 unit tests and Payload integration | None identified | DONE |
| Route integration | All public metadata routes use resolver; old helpers and hard-coded home metadata removed | Production build; `fa/en/ar-ae` E2E | Static visual content remains until visual migration | DONE |
| Sitemap/robots | Resolver-filtered sitemap with lastModified; production/staging robots policy | 91 local URLs; full URL crawl 200; robots E2E | URL volume does not justify splitting | DONE |
| Structured data | Organization/WebSite plus resolver-driven Service/Breadcrumb/visible FAQ builders and safe serialization | Snapshot/unit tests; Service/Breadcrumb E2E | Article/Product omitted until reliable typed facts are available | PARTIAL |
| Cache/revalidation | Versioned page/locale/site/sitemap/redirect tags; preview bypass | Publish, SEO edit, path move, and sitemap freshness E2E | Bump `SEO_CACHE_VERSION` on incompatible result changes | DONE |
| Permissions/audit | SEO-only fields and disabled redirect drafts; field/API workflow guards; existing audit hooks retained | API role matrix and malformed canonical tests | Audit UI remains admin-only by design | DONE |
| Preview | Anonymous draft 404; authenticated draft body/metadata agreement; noindex,nofollow | Production-mode E2E | None identified | DONE |
| Scheduled publishing | Payload task verified; production Compose scheduler added | Real queued task integration; Compose config validation | Must be started/monitored after deployment | DONE |
| CI/test architecture | Unit, Payload integration, standalone E2E, sitemap crawl and GitHub workflow | 64 unit, 10 integration, 5 E2E tests; build/lint/typecheck | CI workflow requires normal repository runner availability | DONE |

## Migrations Applied Locally

- `20260907_133520_seo_routing_foundation` (batch 3)
- `20260907_135305_seo_canonical_override` (batch 4)

Both have explicit down migrations. Production must use the existing backup-first deployment flow before applying them.

## Legacy Code Intentionally Retained

- Static service/solution/public visual data and current visual components remain until the visual Page/Block migration proves equivalent output.
- `ContentJsonLd` remains only for an unused retained legacy component; migrated active routes use resolver-driven schema.
- Existing `content`, SEO fields, localized data, versions, audit history, and media relationships remain intact.

## External Blockers

None.

## Production Deployment

1. Back up PostgreSQL and media using the existing deployment flow.
2. Apply checked-in Payload migrations and verify both new migrations are recorded.
3. Rebuild/restart `web` and start the new `scheduler` service.
4. Verify scheduler logs, `/robots.txt`, `/sitemap.xml`, locale smoke pages, and one controlled redirect/revalidation flow.
5. Set `DEPLOYMENT_ENV=staging` on non-production deployments so robots blocks crawling.

## Next Phase

Visual Page/Block redesign. Infrastructure stabilization is complete and no visual redesign was started in this run.
