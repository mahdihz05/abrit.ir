# SEO Execution Context

Read this file first for subsequent SEO infrastructure tasks. Consult the source audits in `docs/seo/` only when this context does not contain enough detail for the active task.

## Immutable Decisions

- Stabilize technical SEO and routing before any visual, UI, or Page/Block redesign.
- Do not redesign UI, modify CSS/design-system/layout styling, or rebuild visual Blocks during stabilization.
- Evolve the existing `content` collection; do not create a parallel `pages` collection.
- Preserve existing `content.id`/`key`, localized SEO values, media relationships, versions, workflows, and historical paths.
- Preserve supported locales and route prefixes: `fa`, `en`, and `ar-ae`; Payload localization fallback remains disabled.
- Preserve current public canonical URLs unless an approved migration explicitly changes them.
- Do not remove legacy routes or static data until replacement routes prove equivalent public URL, metadata, and rendering behavior.
- Do not mutate production data. URL/data migrations require dry runs, collision reports, staged verification, and an approved release order.
- Do not implement SEO scoring, focus-keyword/readability scoring, AI SEO generation, GSC dashboards, or other P2 features.
- Do not fork Payload plugins. Prototype official SEO and redirect plugins against Payload 3.88.0 before adoption; application code remains the sole frontend SEO authority.
- Keep Next.js metadata routes for `/sitemap.xml` and `/robots.txt`, but move their policy inputs to the central resolver.
- Use one application-owned typed SEO resolver; retire split route metadata paths only as replacement routes are proven.
- Public URL identity is `/{locale}/{path}`; home is `/{locale}`. `key` is immutable document identity, not a public URL.
- A locale URL exists only for a published, active, route-valid, uniquely addressed localized document; public fallback translations are forbidden.
- Emit hreflang only for verified available translations. `x-default` points to Persian only when the Persian translation exists.
- Preview output must be authorized and forced to `noindex,nofollow`; search is system-controlled noindex.
- Sitemap entries must be final self-canonical, indexable public URLs, never drafts, redirects, deleted pages, preview URLs, or unavailable translations.
- Published URL changes must create locale-aware redirect history transactionally; reject self-redirects, loops, and chains.
- Ordinary deletion yields 404. Use 410 only through an explicit editorial lifecycle decision.
- Preserve existing roles; make `seo` a narrow SEO/redirect editor without content, URL identity, publication, deletion, user, or configuration authority.

## Relevant Architecture

- Stack: Payload 3.88.0, Next.js 16.3.2, React 19.2.8, PostgreSQL.
- Payload `content` stores localized title, excerpt, slug, path, layout, status, and SEO title/description/canonical/robots/OG data.
- Current frontend data access uses Payload Local API through `frontend/src/lib/payload-cms.ts`.
- Public route metadata, robots, alternates, social output, schema inputs, and sitemap eligibility use the central resolver; legacy metadata helpers are removed.
- Target flow: shaped localized content + Site Settings + verified translation availability -> `resolveSeo()` -> Next metadata, JSON-LD, sitemap eligibility, preview/indexability, and route response.
- The resolver owns normalized canonical, fallbacks, robots, social values, alternates, schema inputs, sitemap eligibility, and preview policy.
- URL normalization uses NFC Unicode, preserves non-ASCII casing, folds ASCII `A-Z` to lowercase, and stores a locale-relative path without leading/trailing or duplicate slashes.
- Stored paths reject whitespace/control characters, percent encoding, URL-reserved separators, dot segments, invalid segments, and a supported locale as the first segment; `slug` is one non-empty segment.
- Application validation and migration `20260907_133520_seo_routing_foundation` enforce unique non-null `(path, locale)` values.
- Redirect lookup occurs before Page lookup and resolves in one hop to a current canonical destination.
- Preserve required localized Media ALT and image derivatives; schema may only describe reliable typed data or visibly rendered Blocks.
- Published resolver results may be cached with explicit tags; preview bypasses shared cache. Relevant URL, sitemap, and locale outputs must be invalidated on changes.

## Important File Locations

- Source audits: `docs/seo/SEO_CURRENT_STATE.md`, `docs/seo/SEO_INVENTORY.md`, `docs/seo/SEO_TARGET_ARCHITECTURE.md`
- Roadmap/decisions/checklist: `docs/seo/SEO_IMPLEMENTATION_ROADMAP.md`, `docs/seo/SEO_MIGRATION_DECISIONS.md`, `docs/seo/SEO_AUDIT_CHECKLIST.md`
- Payload config: `frontend/src/payload.config.ts`
- Content model: `frontend/src/payload/collections/Content.ts`
- Redirect model/hooks: `frontend/src/payload/collections/SeoRedirects.ts`, `frontend/src/payload/hooks/seo-routing.ts`
- Redirect execution: `frontend/src/lib/redirect-service.ts`, `frontend/src/proxy.ts`
- Media model: `frontend/src/payload/collections/Media.ts`
- Site defaults: `frontend/src/payload/globals/SiteSettings.ts`
- Access policy: `frontend/src/payload/access.ts`
- Audit/revalidation: `frontend/src/payload/hooks/audit.ts`, `frontend/src/payload/hooks/revalidate.ts`
- CMS loader: `frontend/src/lib/payload-cms.ts`
- Metadata helpers: `frontend/src/lib/seo.ts`
- Public URL policy/tests: `frontend/src/lib/public-url.ts`, `frontend/src/lib/public-url.test.ts`
- Migration inventory: `frontend/src/lib/seo-migration-inventory.ts`, `frontend/src/scripts/generate-seo-migration-inventory.ts`, `docs/seo/SEO_MIGRATION_INVENTORY.json`
- Generic route: `frontend/src/app/[locale]/[slug]/page.tsx`
- Locale layout/home: `frontend/src/app/[locale]/layout.tsx`, `frontend/src/app/[locale]/page.tsx`
- Sitemap/robots: `frontend/src/app/sitemap.ts`, `frontend/src/app/robots.ts`
- Structured data: `frontend/src/components/structured-data.tsx`

## Completed Infrastructure Tasks

- Current SEO architecture, routes, fields, plugins, permissions, localization, hooks, tests, sitemap, robots, redirects, and schema were audited and inventoried.
- Target architecture, phased implementation roadmap, and keep/refactor/replace decisions were documented.
- Non-destructive local baseline verified: generic canonical/head output, robots `200`, sitemap `200`, root `307` to `/fa`, and missing page `404`.
- Read-only database checks found no current duplicate non-empty localized paths or slugs; indexes remain non-unique.
- Baseline tests were expanded with focused URL, resolver, redirect, sitemap, schema, permission, preview, schedule, revalidation, and production E2E coverage.
- No production data was mutated during audit/runtime verification.
- Central public URL/indexability policy implemented with normalization, path/slug/route validation, localized URL and self-canonical construction, and explicit indexability invariants.
- Focused URL policy coverage passes 22 tests; full lint, typecheck, 41-test suite, and production build pass.
- Read-only migration inventory implemented: 93 locale rows, zero current/normalized collisions, zero URL rewrites, zero canonical anomalies; three records require localized-field remediation.
- Locale/path unique index and application-owned redirect lifecycle implemented in migration `20260907_133520_seo_routing_foundation`; local migration batch 3 applied and fixture cleanup restored 93 locale rows/zero redirects.
- Central resolver integrated across all public metadata routes; sitemap, robots, typed schema, preview, cache invalidation, and SEO role policy stabilized.
- Final gates pass: 64 unit tests, 10 Payload integration tests, 5 production E2E tests, lint, typecheck, build, all-locale smoke, and full sitemap crawl.

## Unresolved Blockers

- None. Three non-colliding legacy localized-field remediation candidates are recorded in `docs/seo/SEO_MIGRATION_INVENTORY_SUMMARY.md` for editorial cleanup.
