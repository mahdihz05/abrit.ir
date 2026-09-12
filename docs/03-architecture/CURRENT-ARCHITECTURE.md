---
doc_id: ABRIT-ARCH
doc_type: architecture
title: Current Architecture
status: verified
owner: TBD-owner
audience: [engineering, operations]
confidentiality: internal
source_of_truth: repository
last_verified: '2026-09-12'
baseline: a129fb3
related: [ABRIT-PAYLOAD-MODEL, ABRIT-ARCH-TARGET, ABRIT-RUNBOOK]
---

# Current Architecture — `VERIFIED`

- Boundaries: one Node process serves public site + `/admin` + compat APIs; Postgres 17; volumes `media`, `private_media`; scheduler sidecar (`npm run jobs:scheduler`).
- App Router (`frontend/src/app`): `(payload)/{layout,admin/[[...segments]],api/[...slug]}`; `(redirect)/` root→`/fa`; `[locale]/{layout,page,[...slug],search}`; `api/{forms/[formKey]/submissions,private/submission-files/[id],revalidate}`; `healthz` (no DB), `readyz` (`payload.count(content)`); `sitemap.ts`, `robots.ts`.
- Rendering: Server Components by default; `generateMetadata` per route (`contentSeoMetadata`, `systemRouteMetadata`); `BlockRenderer` for content blocks; `unstable_cache` + tags (`seo-sitemap`, `seoPageTag`, `seoLocaleTag`, `SEO_CACHE_VERSION=v1`).
- Data: `cms.content()`, `cms.search()`, `cms.settings()` via Payload local API; `loadPublicRedirect/findPublicRedirect` cached; revalidation via `/api/revalidate` + hooks (`revalidate*`).
- Payload: 8 collections, 3 globals, lexical editor, `localization {en/fa/ar-ae, default en, fallback false}`, drafts (autosave 1500ms, max 50) + `schedulePublish`, field-level access, audit hooks. Hook/access implementation bodies PARTIALLY VERIFIED (signatures + tests verified).
- Media/forms: public `media` (isPublic gate) + private `submission-files` (hash-gated); `forms` 14 field types + retention purge.
- i18n/routing: `proxy.ts` locale + public-redirect check; dirs ltr/rtl/rtl; admin UI en+fa.
- Caching/infra: versioned SEO caches; standalone image; no CDN/reverse-proxy in repo (host level).
