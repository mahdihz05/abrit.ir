---
doc_id: ABRIT-SEO-SPEC
doc_type: architecture
title: SEO Specification
status: verified
owner: TBD-owner
audience: [seo, engineering]
confidentiality: internal
source_of_truth: repository
last_verified: '2026-09-12'
baseline: a129fb3
related: [ABRIT-SEO-AUDIT, ABRIT-SEO-GAPS, ABRIT-SCHEMA]
---

# SEO Specification (implementation-level; each rule cites its enforcement point)

1. **Title** (`seo-resolver.ts:32-36,64`): `{seo.title ?? content.title ?? site.title} | {brand}`. CMS caps: title ≤70, description ≤170, ogTitle ≤100, ogDescription ≤220 (`Content.ts:59-66`).
2. **Description** (`:65`): seo.description → excerpt → `site-settings.defaultSEODescription` (localized).
3. **Canonical** (`:66-74`, `public-url.ts:85-112`): self URL default; override requires flag + valid absolute http(s) URL; invalid → `SeoResolutionError` (build-time/metadata miss, never silent wrong canonical).
4. **Hreflang** (`:92-97`, `seo.ts:15-38`): one entry per eligible translation + `x-default` = default locale (`en`); hrefs are canonical self URLs.
5. **Robots** (`robots-policy.ts`, `seo-resolver.ts:76-90`): prod allow + disallow `/api/,/admin/`; staging/non-prod disallow all; preview/draft/inactive/archived/deleted/redirect-source/invalid → `index=false,follow=false`; search surface → `index=false,follow=true`.
6. **Sitemap** (`seo-sitemap.ts:11-55`): single flat file; published+active+`sitemapEligible` only; canonical dedupe; `changeFrequency: monthly`; priority home 1.0 / `services/*` 0.8 / rest 0.7; errors → `[]` (fail-closed, `app/sitemap.ts:19`).
7. **Redirects** (`redirect-policy.ts:30-66`, `redirect-service.ts`, `SeoRedirects.ts`): 307/308 only, enabled flag, locale-scoped `sourceKey`; no chains/loops/self; path changes auto-create 308 with audit.
8. **Schema** (`schema.ts:34-67`): Organization+WebSite globally; Service for services/independent-services; Article for `editorial` (knowledge/news); Product only with offers payload; FAQPage only from visible validated FAQs; BreadcrumbList when depth>1. `eligibleSchema()` drops unbacked types.
9. **Media** (`Media.ts:30-32`): `alt` required + localized; OG image via `seo.ogImage` → `social.image` ?? `site.logo`; sizes thumbnail/card/hero pre-generated.
10. **Caching** (`seo-cache.ts`, `seo.ts:47-58`): version `SEO_CACHE_VERSION=v1`; tags `seo:site/sitemap/redirects`, `seo:page:{locale}:{path}`, `seo:locale:{locale}`; mutations revalidate via hooks (`revalidate*`); preview bypasses cache.
