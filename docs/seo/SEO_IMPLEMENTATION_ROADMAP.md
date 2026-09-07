# SEO Implementation Roadmap

| Phase | Priority | Work | Depends On | Keep/Replace/New | Risk |
| --- | --- | --- | --- | --- | --- |
| 0 | P0 | Preserve runtime baseline; repeat production-safe HTTP checks and record results. Do not mutate production data. | Existing audit | Keep | Local verification uses development host and cannot prove deployed worker/cache behavior. |
| 1 | P0 | Define and approve normalized locale URL contract, deletion/archive semantics, `x-default`, indexability policy, and redirect behavior. | 0 | New contract | Incorrect contract creates permanent URL debt. |
| 2 | P0 | Inventory current localized URLs/SEO values and produce a dry-run collision/redirect mapping. | 1 | Keep data, new report | Current data has no duplicates, but future uniqueness migration can expose normalization collisions. |
| 3 | P0 | Prototype official SEO and redirects plugins in an isolated branch/worktree against Payload 3.88.0; decide adoption without forking. | 1 | New prototype | Plugin behavior may not support locale routes or resolver ownership. |
| 4 | P0 | Define the Page/Block renderer contract and map current `content` types to Page, editorial, commercial, and global models. | 1, 2 | Refactor current `content` | Do not migrate data until renderer/URL decisions are testable. |
| 5 | P0 | Implement URL validation/unique database contract and redirect lifecycle with audit/workflow rules. | 1, 2, 3 | New foundation | Requires carefully planned migration and release order. |
| 6 | P0 | Implement typed central SEO resolver and Page loader; include previews, site defaults, locale alternates, social, and indexability. | 4, 5 | Replace split metadata helpers | Parallel metadata sources would recreate current drift. |
| 7 | P0 | Connect the rebuilt Page routes to resolver-produced Next Metadata and preview behavior. Retire route-specific metadata as routes migrate. | 6 | Replace | Cutover must preserve every canonical URL. |
| 8 | P0 | Rebuild sitemap/robots from resolver eligibility and redirect rules; add structured data builders for Organization/Breadcrumb/Article/Service/FAQ/Product as validated. | 5, 6, 7 | Refactor | Accidentally indexing drafts, redirects, or unavailable locales. |
| 9 | P0 | Implement SEO role/field-level policy, redirect permissions, audit visibility, and publish workflow boundaries. | 4, 5 | Refactor access | Payload field access alone does not model workflow authority. |
| 10 | P0 | Add unit, integration, production-build E2E, schema, sitemap crawl, and redirect regression gates. | 5-9 | New tests | Tests must use production mode and controlled fixture data. |
| 11 | P1 | Migrate existing static services, solutions, home, and independent-service layouts to approved Page Blocks; then remove legacy routes/data sources. | 4, 6-10 | Replace/remove later | Visual rebuild must not delay URL and redirect foundations. |
| 12 | P1 | Add SEO Specialist P0/P1 admin UX: previews, validation warnings, schema modes, and redirect history. | 6, 9, 10 | New | Avoid exposing controls whose runtime semantics are not implemented. |
| 13 | P1 | Add monitoring jobs for broken links, orphan pages, invalid redirects, missing translations, and sitemap/schema reports. | 8, 10 | New | Reports need ownership and non-destructive remediation workflow. |
| 14 | P2 | Evaluate extraction of a reusable ABRIT SEO package after at least two stable consumers exist. | 6-13 | Possible new package | Premature package boundaries add maintenance cost. |
| 15 | P2 | Add human-reviewed AI suggestions and external SEO/GSC analytics integrations. | 12, 13 | New | Never allow autonomous publish, canonical, or redirect changes. |
