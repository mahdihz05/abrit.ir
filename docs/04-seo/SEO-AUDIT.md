---
doc_id: ABRIT-SEO-AUDIT
doc_type: technical-report
title: SEO Audit
status: verified
owner: Unassigned
audience: [seo, engineering]
confidentiality: internal
source_of_truth: repository
last_verified: '2026-09-12'
baseline: a129fb3
related: [ABRIT-SEO-SPEC, ABRIT-SEO-GAPS, ABRIT-SCHEMA, ABRIT-URLMAP]
---

# SEO Audit — `VERIFIED` (code-read 2026-09-12 + unit tests PASS + production sitemap fetch)

## Metadata (`lib/seo.ts:15-63`, `lib/seo-resolver.ts:32-65`)
`title.absolute` from chain seo.title→content.title→site.title, template `{title} | {brand}`; description seo.description→excerpt→site.description; `alternates{canonical, languages+x-default}`; robots incl. googleBot; openGraph (website, url, locale, alternateLocale, images from social.image ?? site.logo); twitter summary/large-image. `contentSeoMetadata` returns `{}` on miss; `systemRouteMetadata` synthesizes system docs. Cached (`unstable_cache` + React cache, keys include `SEO_CACHE_VERSION`), preview bypasses. `VERIFIED`.

## URLs (`lib/public-url.ts:41-144`)
NFC + lowercase + slash-collapse normalization; rejects whitespace/control/`%`/`?#`/leading locale/`..`; `/{locale}/{path}` builder; route validator enforces exact match. `VERIFIED` (23 unit tests PASS `public-url.test.ts`).

## Canonical (`seo-resolver.ts:66-74`, `Content.ts:61-62`)
Self-canonical default; override only when `canonicalOverrideEnabled` + `validateCanonicalOverride` (absolute http(s), no credentials/fragment), else throws `SeoResolutionError`. Inventory: 0 suspicious overrides. `VERIFIED`.

## Hreflang (`seo-resolver.ts:92-97`)
Only published+active+routeValid+unique translations, keyed by `localeMeta.lang`; `xDefault` = default-locale entry. Production sitemap confirms 3-locale parity (90 URLs). `VERIFIED`.

## Robots (`lib/robots-policy.ts:3-11`, `app/robots.ts:5-9`)
Non-prod `disallow:/`; prod `allow:/` + `disallow:/api/,/admin/` + sitemap + host. Live `https://abrit.ir/robots.txt` matches prod policy exactly (fetched read-only 2026-09-12). Drafts/preview/search/redirect-sources forced noindex (`seo-resolver.ts:76-90`). `VERIFIED`.

## Sitemap (`lib/seo-sitemap.ts:11-55`, `app/sitemap.ts:7-19`)
Published+active per locale (1000, no fallback) + enabled redirects excluded via `redirectKey`; canonical dedupe; flat single file, monthly, priorities 1.0/0.8/0.7. Live sitemap = 90 URLs as specified. No per-locale split, no image/video extensions (`NOT IMPLEMENTED`, P2). `VERIFIED`.

## Redirects (`lib/redirect-policy.ts`, `lib/redirect-service.ts:10-51`, `proxy.ts:7-18`)
Statuses 307/308 ONLY — no 301 in runtime (grep-verified). Validation rejects duplicates/self/chains/loops. `proxy.ts` forwards stored status verbatim. Auto path-change redirect = 308 (`hooks/seo-routing.ts`). Seed creates zero redirects; inventory `redirectsRequired: 0`. `VERIFIED`.

## Structured data (`lib/schema.ts`, `components/structured-data.tsx`, `content-structured-data.tsx`)
Organization + WebSite (from site-settings); per-page Article/Service/Product + BreadcrumbList (>1) + FAQPage (visible only); `<` escaped. `VERIFIED` (`schema.test.ts` PASS).

## Content SEO
H1: contract assigns H1 to page identity but NO `h1` field exists in schema — Proposal, gap P2. Titles/meta/OG from CMS; alt required on media; internal links via relatedContent/navigation. `PARTIALLY VERIFIED` (copy audit needs CMS read).

## Technical SEO
App Router SSR + per-route metadata; search surface noindex; drafts never indexable; 404/error routes exist, custom metadata polish pending (P2). CWV field data: `NEEDS OWNER INPUT` (no RUM in repo).
