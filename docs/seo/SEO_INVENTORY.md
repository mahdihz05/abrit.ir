# SEO Inventory

| Area | Feature | Source File | Symbol | Payload/Frontend | Used By | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Dependencies | Payload 3.88.0 / Next 16.3.2 | `frontend/package.json` | `dependencies` | Both | Application | IMPLEMENTED |
| Plugins | Official SEO plugin | `frontend/package.json`, `frontend/src/payload.config.ts` | N/A | Payload | None | MISSING |
| Plugins | Official redirects plugin | `frontend/package.json`, `frontend/src/payload.config.ts` | N/A | Payload | None | MISSING |
| Config | Payload localization | `frontend/src/payload.config.ts` | `localization` | Payload | Content/media/globals | IMPLEMENTED |
| Config | Payload fallback | `frontend/src/payload.config.ts` | `localization.fallback` | Payload | Localized reads | IMPLEMENTED (`false`) |
| Config | Payload i18n admin languages | `frontend/src/payload.config.ts` | `i18n` | Payload | Admin UI | IMPLEMENTED (fa/en only) |
| Content | Routable content collection | `frontend/src/payload/collections/Content.ts` | `Content` | Payload | CMS readers/routes | IMPLEMENTED |
| Content | Localized title/excerpt | `frontend/src/payload/collections/Content.ts` | `title`, `excerpt` | Payload | Metadata fallback/content | IMPLEMENTED |
| Content | Localized slug/path | `frontend/src/payload/collections/Content.ts` | `slug`, `path` | Payload | `cms.content`/sitemap | PARTIAL (not unique) |
| Content | SEO group | `frontend/src/payload/collections/Content.ts` | `seo` | Payload | `detail()` | IMPLEMENTED |
| Content | SEO title/description | `frontend/src/payload/collections/Content.ts` | `seo.title`, `seo.description` | Payload | Generic metadata | IMPLEMENTED |
| Content | Manual canonical | `frontend/src/payload/collections/Content.ts` | `seo.canonicalURL` | Payload | Generic metadata | PARTIAL |
| Content | Robots controls | `frontend/src/payload/collections/Content.ts` | `seo.robotsIndex`, `seo.robotsFollow` | Payload | Generic metadata | PARTIAL |
| Content | Open Graph controls | `frontend/src/payload/collections/Content.ts` | `seo.ogTitle`, `seo.ogDescription`, `seo.ogImage` | Payload | Generic metadata | PARTIAL |
| Content | SEO field-level access | `frontend/src/payload/collections/Content.ts` | `seo` fields | Payload | None | MISSING |
| Content | Drafts/autosave/schedule | `frontend/src/payload/collections/Content.ts` | `versions` | Payload | Admin/public filters | IMPLEMENTED |
| Content | CMS preview URL | `frontend/src/payload/collections/Content.ts` | `admin.preview` | Payload | Admin preview action | PARTIAL |
| Media | Required localized ALT | `frontend/src/payload/collections/Media.ts` | `alt` | Payload | Media documents | IMPLEMENTED |
| Media | Media image variants | `frontend/src/payload/collections/Media.ts` | `upload.imageSizes` | Payload | Upload delivery | IMPLEMENTED |
| Global | Default SEO settings | `frontend/src/payload/globals/SiteSettings.ts` | `defaultSEOTitle`, `defaultSEODescription` | Payload | `cms.settings` | PARTIAL (not metadata fallback) |
| Access | SEO role | `frontend/src/payload/access.ts` | `UserRole`, `seoManager` | Payload | Role utility only | PARTIAL |
| Access | Content write access | `frontend/src/payload/access.ts` | `contentManager` | Payload | Content/Media | IMPLEMENTED (admin/editor only) |
| Access | Version read access | `frontend/src/payload/access.ts` | `contentReader` | Payload | Content | IMPLEMENTED |
| Audit | Change audit | `frontend/src/payload/hooks/audit.ts` | `auditCollectionChange`, `auditGlobalChange` | Payload | Content/globals/media | IMPLEMENTED |
| Audit | Audit storage/access | `frontend/src/payload/collections/AuditLogs.ts` | `AuditLogs` | Payload | Admin only | IMPLEMENTED |
| Hooks | Search text | `frontend/src/payload/hooks/search-text.ts` | `populateSearchText` | Payload | Content search | IMPLEMENTED |
| Hooks | Revalidation | `frontend/src/payload/hooks/revalidate.ts` | `revalidateContent`, `revalidateGlobal` | Payload | Next cache | PARTIAL |
| Loader | Payload Local API client | `frontend/src/lib/payload-cms.ts` | `payloadClient`, `cms` | Frontend | Server Components/sitemap | IMPLEMENTED |
| Loader | Published/active filter | `frontend/src/lib/payload-cms.ts` | `publishedWhere` | Frontend | Lists/search/sitemap | IMPLEMENTED |
| Loader | Content SEO mapping | `frontend/src/lib/payload-cms.ts` | `detail` | Frontend | Generic metadata | IMPLEMENTED |
| Loader | Per-locale alternates | `frontend/src/lib/payload-cms.ts` | `detail` | Frontend | `contentMetadata` | IMPLEMENTED |
| Metadata | Site URL helper | `frontend/src/lib/seo.ts` | `SITE_URL`, `absoluteUrl` | Frontend | Metadata/schema | IMPLEMENTED |
| Metadata | Full CMS metadata | `frontend/src/lib/seo.ts` | `contentMetadata` | Frontend | Generic slug route | IMPLEMENTED (limited route scope) |
| Metadata | Basic route metadata | `frontend/src/lib/seo.ts` | `routeMetadata` | Frontend | Dedicated routes/search | PARTIAL |
| Layout | Metadata base/title template | `frontend/src/app/[locale]/layout.tsx` | `metadata` | Frontend | Locale routes | IMPLEMENTED |
| Layout | Locale lang/direction | `frontend/src/app/[locale]/layout.tsx` | `InternalLayout` | Frontend | Locale HTML | IMPLEMENTED |
| Route | Generic CMS metadata/preview | `frontend/src/app/[locale]/[slug]/page.tsx` | `generateMetadata`, `GenericCmsPage` | Frontend | One-segment CMS pages | PARTIAL |
| Route | Homepage metadata | `frontend/src/app/[locale]/page.tsx` | `generateMetadata` | Frontend | Home | IMPLEMENTED (hard-coded) |
| Route | Services metadata | `frontend/src/app/[locale]/services/page.tsx` | `generateMetadata` | Frontend | Services listing | PARTIAL |
| Route | Service detail metadata | `frontend/src/app/[locale]/services/[slug]/page.tsx` | `generateMetadata` | Frontend | Static service details | PARTIAL |
| Route | Solution detail metadata | `frontend/src/app/[locale]/solutions/[slug]/page.tsx` | `generateMetadata` | Frontend | Static solution details | PARTIAL |
| Route | Independent service schema | `frontend/src/app/[locale]/independent-services/[slug]/page.tsx` | `IndependentServicePage` | Frontend | Independent details | IMPLEMENTED |
| Route | Search metadata | `frontend/src/app/[locale]/search/page.tsx` | `generateMetadata` | Frontend | Search | PARTIAL (no noindex) |
| Route | Root redirect | `frontend/src/app/(redirect)/page.tsx` | default export | Frontend | `/` | PARTIAL |
| Route | Locale not found | `frontend/src/app/[locale]/not-found.tsx` | `NotFound` | Frontend | Locale misses | IMPLEMENTED |
| Route | 410 | repository-wide search | N/A | Frontend | None | MISSING |
| Metadata route | Sitemap | `frontend/src/app/sitemap.ts` | `sitemap` | Frontend | `/sitemap.xml` | PARTIAL |
| Metadata route | Robots | `frontend/src/app/robots.ts` | `robots` | Frontend | `/robots.txt` | IMPLEMENTED |
| Schema | JSON-LD serialization | `frontend/src/components/structured-data.tsx` | `JsonLd` | Frontend | Schema components | IMPLEMENTED |
| Schema | Organization | `frontend/src/components/structured-data.tsx` | `OrganizationJsonLd` | Frontend | Locale layout | IMPLEMENTED |
| Schema | Content Article/Service/Breadcrumb | `frontend/src/components/structured-data.tsx` | `ContentJsonLd` | Frontend | `ContentDetail` only; no discovered render | PARTIAL |
| Schema | Independent Service/Breadcrumb | `frontend/src/components/structured-data.tsx` | `IndependentServiceJsonLd` | Frontend | Independent detail route | IMPLEMENTED |
| Tests | Test configuration | `frontend/vitest.config.ts` | `test.exclude` | Both | Vitest | IMPLEMENTED |
| Tests | SEO tests | `frontend/src/**/*.{test,spec}.*` | N/A | Both | None | MISSING |
