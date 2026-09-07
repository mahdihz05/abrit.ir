# Current SEO Architecture

## Executive Summary

The project has a custom SEO implementation: the `content` collection stores localized SEO values and `contentMetadata()` maps them to Next.js metadata for the generic `/{locale}/{slug}` route. It does not use `@payloadcms/plugin-seo`, `@payloadcms/plugin-redirects`, or another Payload SEO plugin. Dedicated public routes use a separate, reduced metadata helper, so CMS SEO controls do not consistently reach HTML. Sitemap, robots, organization JSON-LD, drafts, versions, scheduled publishing, and audit hooks exist, with material route-level gaps.

## Technology / Versions

Payload: `3.88.0` locked; declared as `^3.88.0`.
Next.js: `16.3.2`.
React: `19.2.8`.
Database: PostgreSQL via `@payloadcms/db-postgres` `3.88.0`.
SEO plugin: not installed and not configured.
Redirect plugin: not installed and not configured.
Relevant packages: `@payloadcms/next`, `@payloadcms/richtext-lexical`, `@payloadcms/translations`, `sharp`, `next`, `payload` in `frontend/package.json`.

## Architecture

Payload stores content, localized SEO fields, media, and globals in PostgreSQL. Server Components call Payload Local API through `frontend/src/lib/payload-cms.ts`; no public frontend REST/GraphQL SEO loader was found. `contentMetadata()` maps a `ContentDetail` to Next.js `Metadata`, but only the generic route calls it. Other routes call `routeMetadata()` or hard-code their metadata. Next.js metadata routes generate `/sitemap.xml` and `/robots.txt`.

Payload -> Local API (`cms`) -> route `generateMetadata()` -> Next.js metadata/JSON-LD -> HTML/HTTP -> crawler.

## Public Content Types

| Content Type | Payload Source | Public Route | Localized | SEO Fields | Metadata Renderer | Sitemap | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Home | `content`, `templateKey=home` | `/{locale}` | Yes | Stored but not read by route metadata | Hard-coded `generateMetadata` | Included only if its Content record is published/active | Partial |
| Generic CMS content | `content` | one-segment `/{locale}/{slug}`; `about`/`contact` use a specialized component and other records render Blocks | Yes | `content.seo` | `contentMetadata` | Published/active page records | Implemented for this route only |
| Services listing | `content` path `services` | `/{locale}/services` | Yes | `content.seo` read only for title/description | `routeMetadata` | CMS service and listing URLs | Partial |
| Service detail | `content`, kind `service` | `/{locale}/services/{slug}` | Content is localized, but detail route uses static `public-content` | Stored but not rendered | `routeMetadata` from static data | CMS service URLs | Partial/inconsistent |
| Solutions listing/detail | `content`, kind `solution` | `/{locale}/solutions` and `/{locale}/solutions/{slug}` | Content localized; detail route uses static data | Stored but not consistently rendered | `routeMetadata` | CMS solution URLs | Partial/inconsistent |
| Independent services | `content`, `templateKey=independent-service` | `/{locale}/independent-services[/slug]` | Yes | Stored but only basic fields reach metadata | `routeMetadata`; JSON-LD on detail | Included when represented by a published/active record | Partial |
| Products/pricing | `product-catalog` global / `packages` collection | `/{locale}/products`, `/{locale}/pricing` | Packages localized | No SEO fields | `routeMetadata` | Explicit entries | Partial |
| Search | Payload `content` query | `/{locale}/search?q=` | Yes | No SEO fields | `routeMetadata` | Not included | Partial; indexable |

`content` kinds `knowledge` and `news` are included in the sitemap with their stored `path`; static inspection only demonstrates the one-segment generic route, so nested stored paths may have no matching route.

## Current SEO Capabilities

| Capability | Status | Payload Side | Frontend Side | Evidence | Notes |
| --- | --- | --- | --- | --- | --- |
| Meta title | ✅ IMPLEMENTED | Localized `seo.title`; Site Settings defaults | Generic route emits title; other routes emit route titles | `Content.ts`, `payload-cms.ts`, `seo.ts` | Per-route implementation is inconsistent |
| Meta description | ✅ IMPLEMENTED | Localized `seo.description` | Generic and dedicated routes emit descriptions | same | Dedicated routes use only title/description |
| SEO image | 🟡 PARTIAL | `seo.ogImage` relationship | Generic route maps it to OG/Twitter only | `Content.ts:219`, `seo.ts:36-42` | Not used by most routes; no generated image routes |
| SERP preview | ❌ MISSING | No admin component/preview field found | None | global source search | Payload document preview is not a SERP preview |
| Canonical | 🟡 PARTIAL | Localized `canonicalURL` | Generic route uses override; dedicated routes generate route canonical | `Content.ts:214`, `seo.ts:12,50` | Override bypassed outside generic route |
| Robots | 🟡 PARTIAL | `robotsIndex`/`robotsFollow` | Generic route renders robots and Googlebot metadata | `Content.ts:215-216`, `seo.ts:24-28` | Dedicated routes omit it |
| Noindex | 🟡 PARTIAL | Checkbox can produce `noindex` on generic route | No route-level policy for search or dedicated pages | same; `search/page.tsx` | Sitemap does not exclude noindex records |
| Nofollow | 🟡 PARTIAL | Checkbox can produce `nofollow` on generic route | Generic route only | same | No dedicated-route handling |
| Open Graph | 🟡 PARTIAL | OG title, description, image fields | Complete generic renderer; basic route helper elsewhere | `Content.ts:217-219`, `seo.ts:29-37` | CMS OG overrides bypassed by dedicated routes |
| Twitter | 🟡 PARTIAL | Reuses OG fields | Generic renderer only | `seo.ts:38-43` | Dedicated routes emit no Twitter metadata |
| JSON-LD | 🟡 PARTIAL | No editable JSON-LD field | Organization globally; independent-service Service/Breadcrumb output | `structured-data.tsx`, `[locale]/layout.tsx` | ContentJsonLd component has no discovered use site |
| Schema | 🟡 PARTIAL | No schema configuration fields | Organization, independent Service, BreadcrumbList | same | Article/Service component exists but is unused; no FAQ/Product schema |
| Sitemap | 🟡 PARTIAL | Published and active `content` query | Dynamic metadata route | `app/sitemap.ts`, `payload-cms.ts:94-105` | No SEO exclusion, no alternates/lastModified; can list unmatched CMS paths |
| robots.txt | ✅ IMPLEMENTED | None | Allows all except `/api/`, `/admin/`; names sitemap | `app/robots.ts` | Static behavior still needs HTTP check |
| hreflang | 🟡 PARTIAL | Per-locale documents | Generic uses published alternates; route helper unconditionally emits all locales | `payload-cms.ts:30-37`, `seo.ts:13-17,48-49` | `x-default` is Persian; availability is inconsistent |
| Redirects | 🟡 PARTIAL | No redirect collection/plugin | Root calls `redirect('/fa')` | `app/(redirect)/page.tsx` | No CMS/custom redirects or mapping |
| Slug-change redirect | ❌ MISSING | No old-slug hook/history | None | `Content.ts`, hooks | No automatic redirect generation |
| 404 | ✅ IMPLEMENTED | Missing content calls `notFound()` | Locale `not-found.tsx` exists | public route files; `app/[locale]/not-found.tsx` | Actual response status requires runtime verification |
| 410 | ❌ MISSING | No tombstone/status field | No 410 route or response found | global source search | |
| Image ALT | 🟡 PARTIAL | Localized required Media `alt` | No demonstrated CMS image renderer/ALT propagation | `Media.ts:30`; renderers | Brand `next/image` has alt; CMS OG image alt uses OG title |
| Draft | ✅ IMPLEMENTED | Localized Payload drafts/autosave/status | Generic route can query authorized draft | `Content.ts:138`, `[slug]/page.tsx:26-31` | Dedicated routes do not consume `draft=1` |
| Preview | 🟡 PARTIAL | CMS preview URL ends in `?draft=1` | Only generic route authorizes/uses it; metadata remains published | `Content.ts:128-135`, `[slug]/page.tsx` | Preview URL cannot prove every route works |
| Live Preview | ❌ MISSING | No live-preview config/component found | None | config/global source search | |
| Versions | ✅ IMPLEMENTED | Content max 50; globals max 25 | Admin feature | `Content.ts:138`, globals | `seo` is part of Content version snapshots |
| Scheduled publishing | ✅ IMPLEMENTED | `versions.drafts.schedulePublish: true` | Published queries gate public rendering | `Content.ts:138`, `payload-cms.ts:94-115` | Runtime worker execution needs verification |
| SEO RBAC | 🟡 PARTIAL | `seo` role exists and can read/read versions | Cannot create/update Content or media | `access.ts`, `Content.ts:137` | `seoManager` is defined but unused |
| SEO field-level permissions | ❌ MISSING | No field `access` on SEO fields | None | `Content.ts:205-221` | No SEO-only edit restriction |
| SEO audit logs | ✅ IMPLEMENTED | Generic snapshots are recorded for collection/global changes | Admin-only audit log access | `hooks/audit.ts`, `AuditLogs.ts` | Not SEO-specific; snapshots include SEO changes |
| Revalidation | 🟡 PARTIAL | Content/global hooks call tag/path invalidation | No inspected public read uses `payload-content` cache tag | `hooks/revalidate.ts`, `payload-cms.ts` | Publish-to-HTML invalidation cannot be proven |

## Payload SEO Configuration

No official SEO, redirects, search, or nested-docs Payload plugin is installed or configured. `frontend/src/payload.config.ts` imports only PostgreSQL, Lexical, translations, and core Payload configuration.

Custom SEO resides in `Content.fields` (`frontend/src/payload/collections/Content.ts`): `seo.title`, `seo.description`, `seo.canonicalURL`, `seo.robotsIndex`, `seo.robotsFollow`, `seo.ogTitle`, `seo.ogDescription`, and `seo.ogImage`. The text fields and canonical are localized; robots and OG image are not. There are no focus keywords, SEO score, analysis, Twitter-specific CMS fields, schema fields, JSON-LD fields, sitemap exclusion field, or SERP-preview component.

`site-settings` has localized `defaultSEOTitle` and `defaultSEODescription` (`globals/SiteSettings.ts`), mapped by `cms.settings()`, but public page metadata does not use those defaults.

## Frontend SEO Rendering

`frontend/src/lib/payload-cms.ts` turns a Payload document into `ContentDetail`, including fallback title/description and default-true robots. It obtains published locale alternates by `findByID`. `contentMetadata()` in `frontend/src/lib/seo.ts` creates canonical, languages, robots, Open Graph, and Twitter metadata. Only `app/[locale]/[slug]/page.tsx` calls it.

`routeMetadata()` creates title, description, canonical, `hreflang`, `x-default`, and basic Open Graph. Dedicated listings, services, solutions, products, pricing, independent services, and search call this helper, so canonical overrides, robots, Twitter, and CMS OG overrides do not reach their HTML.

The locale layout sets `metadataBase` and the `"%s | AbrIT"` title template. The homepage uses an absolute hard-coded title and description instead of CMS/site settings.

## International SEO

CMS localization: Payload config declares `fa` default (RTL), `en`, `ar-ae` (RTL), `fallback: false`, and localized status. Content titles, excerpts, layout, slug, path, `seo.title`, `seo.description`, canonical, OG title/description, Media alt, and Site Settings defaults are localized.

Next.js routing: `frontend/src/lib/locales.ts` supports exactly `fa`, `en`, `ar-ae`; pages are under `/[locale]`; layout sets `lang` (`ar-AE` for `ar-ae`) and direction. Root redirects to `/fa`. No middleware, automatic locale detection, or configured rewrites were found.

SEO internationalization: generic metadata only emits alternates for published locale records and maps Persian to `x-default`. `routeMetadata()` emits all three locale URLs regardless of translation existence. Sitemap emits individual URLs per locale but no sitemap alternates. Payload fallback is disabled, so missing locale data does not fall back.

## Redirect Architecture

Payload: no redirect collection, plugin, redirect fields, slug history, or redirect hook exists.

Frontend: root page calls Next `redirect('/fa')`. No `next.config.ts` redirects, middleware, rewrites, or custom redirect response route was found. The HTTP status actually produced by the Next redirect requires runtime verification.

## Structured Data

`OrganizationJsonLd` is emitted in every locale layout and can include logo, telephone, email, and address from Site Settings. `IndependentServiceJsonLd` emits `Service` and `BreadcrumbList` on independent-service detail pages. `ContentJsonLd` can form Service, Article, and BreadcrumbList data, but the component has no discovered renderer use. No Product, FAQPage, WebSite/SearchAction, custom CMS JSON-LD, or schema configuration exists.

## Sitemap / Robots

`app/sitemap.ts` queries published, active `content` of `page`, `service`, `solution`, `knowledge`, and `news` for every locale, then adds products and pricing. It emits URL, monthly change frequency, and priority. It does not use `updatedAt`, canonical, robots, sitemap exclusion, alternates, splitting, or error handling.

`app/robots.ts` allows all paths except `/api/` and `/admin/`, sets the sitemap and host from `NEXT_PUBLIC_SITE_URL`, and contains no preview/query, noindex, or environment policy.

## SEO Permissions

Roles are `admin`, `editor`, `seo`, `viewer`. All authenticated content readers can read content and versions. Only admin/editor can create, update, or delete Content and Media. Therefore an SEO Specialist currently can read content and versions but cannot modify SEO fields, layout/content, media, redirects, publication state, or delete content. Redirect management does not exist. Audit Logs can be read only by admin. No Content SEO field declares field-level `access`, so there are no SEO-only field permissions.

## SEO Hooks & Automation

`populateSearchText` creates a hidden localized search value from title/excerpt. Content changes and deletes, plus Site Settings/Navigation/other selected global changes, call `revalidateTag('payload-content')` and `revalidatePath('/', 'layout')`; no inspected read attaches that tag. Audit hooks snapshot changes and classify Payload publish/unpublish transitions. No SEO validation, canonical normalization, duplicate URL validation, redirect creation, sitemap exclusion, structured-data generation, or SEO scoring hook exists.

## Existing Tests

`npm test` runs Vitest. On this audit it passed 6 files / 19 tests: pricing (4), forms (4), search normalization (2), Payload blocks (1), upload validation (6), and access roles (2). An opt-in form-submission integration test is excluded unless `RUN_PAYLOAD_INTEGRATION=1`.

No existing automated test validates metadata, title fallback, canonical, robots/noindex/nofollow, OG/Twitter, sitemap, robots.txt, redirects/statuses, hreflang, JSON-LD, SEO fields, image ALT propagation, preview, publication-to-indexing, revalidation, or SEO permissions.

## Current Data Model

```ts
content: {
  key: string // unique, non-localized
  kind: 'page' | 'service' | 'solution' | 'knowledge' | 'news'
  isActive: boolean
  title: Localized<string>
  excerpt: Localized<string | null>
  slug: Localized<string>
  path: Localized<string>
  seo: {
    title: Localized<string | null>
    description: Localized<string | null>
    canonicalURL: Localized<string | null>
    robotsIndex: boolean
    robotsFollow: boolean
    ogTitle: Localized<string | null>
    ogDescription: Localized<string | null>
    ogImage: Media | number | null
  }
  _status: 'draft' | 'published'
}
```

`slug` is required but neither unique nor indexed. `path` is indexed but not unique. `key` is the only unique routing-adjacent field.

## Current Request/Data Flow

```mermaid
flowchart TD
  D[Payload content document] --> F[content.seo and localized path]
  F --> L[Local API: cms.content/contentByPath]
  L --> G{Public route}
  G -->|/{locale}/{slug}| CM[contentMetadata]
  G -->|Dedicated routes| RM[routeMetadata or hard-coded metadata]
  CM --> H[Next metadata: head]
  RM --> H
  D --> S[app/sitemap.ts published active query]
  S --> SM[/sitemap.xml]
  SS[Site Settings] --> O[Organization JSON-LD in locale layout]
  O --> H
  H --> B[Browser or search crawler]
```

## Risks / Inconsistencies

1. CMS canonical, robots, OG override/image, and Twitter controls only render on the generic route; most public routes bypass them.
2. Sitemap can emit nested localized CMS paths, while the generic route accepts only one segment and service/solution details use static data. Runtime confirmed a one-segment CMS path (`/fa/testing`) renders successfully.
3. `slug` and `path` do not have unique protection, and no redirect history is created when paths change.
4. Sitemap ignores robots/noindex and has no content-level exclusion, creating a confirmed risk of indexing URLs selected as noindex on generic pages.
5. The SEO role exists but cannot update SEO fields; `seoManager` is unused and there is no field-level SEO permission model.
6. Preview is route-limited, and generic preview metadata reads published content while the body can read draft content.
7. Revalidation invalidates a tag that no inspected Local API read associates with a Next cache tag.

## Missing Capabilities

Official Payload SEO/redirect plugins; custom redirects and slug-change redirects; SERP preview; focus keywords; SEO analysis/score; SEO field-level permissions; live preview; 410 support; custom JSON-LD/schema fields; sitemap exclusion and noindex conflict handling; redirect-loop/chain safeguards; canonical conflict validation; duplicate localized path protection; OG/Twitter generated image routes; sitemap splitting; article/service schema output for ordinary content; FAQ/Product schema.

## Runtime Verification Needed

- Actual HTTP status/headers for root redirect, locale not-found pages, robots.txt, sitemap.xml, and auth-protected preview.
- Whether scheduled publishing jobs are deployed and execute.
- Whether revalidation visibly refreshes cached HTML after publication.
- Actual rendered head tags, JSON-LD, canonical/hreflang values, and image URLs against production data.
- Database-level uniqueness/index behavior for localized values and existing duplicate paths.
- Sitemap behavior when Payload is unavailable or documents have unsupported/nested paths.
