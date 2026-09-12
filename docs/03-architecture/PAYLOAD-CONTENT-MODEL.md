---
doc_id: ABRIT-PAYLOAD-MODEL
doc_type: architecture
title: Payload Content Model
status: verified
owner: TBD-owner
audience: [engineering, seo]
confidentiality: internal
source_of_truth: repository
last_verified: '2026-09-12'
baseline: a129fb3
related: [ABRIT-BLOCKS, ABRIT-ARCH, ABRIT-SEO-AUDIT]
---

# Payload Content Model — `VERIFIED` (`frontend/src/payload/`, field-level read 2026-09-12)

## Collections

### `content` — localized pages (`collections/Content.ts`)
Core page model. Tabs: Content / Routing / SEO. Admin group `Content`, `useAsTitle: title`, preview `/{locale}/{path}?draft=1`, list search `[title,key,path,excerpt]`.
Versions: drafts autosave 1500ms, `localizeStatus`, `schedulePublish`, max 50/doc.
Access: create/delete `contentManager`, read `publishedOrAuthenticated`, update `seoManager`, readVersions `contentReader`. Field-level: `seo*` → `seoFieldManager`, rest → `contentFieldManager`.

| Field | Type | Req | Loc | Default | Note |
|---|---|---|---|---|---|
| key | text | Y | N | — | unique, indexed, stable id |
| kind | select | Y | N | `page` | page/service/solution/knowledge/news, indexed |
| templateKey | text | Y | N | `default` | presentation key; `independent-service` mapped by resolver |
| isActive | checkbox | N | N | true | indexed |
| title | text | Y | Y | — | max 180 |
| excerpt | textarea | N | Y | — | max 500 |
| layout | blocks | N | Y | — | `contentBlocks`, collapsed |
| slug | text | Y | Y | — | max 180 |
| path | text | Y* | Y | — | *unless key=home; max 500, indexed |
| parent | relationship→content | N | N | — | excludes self |
| relatedContent | relationship→content hasMany | N | N | — | — |
| seo.title | text | N | Y | — | max 70 |
| seo.description | textarea | N | Y | — | max 170 |
| seo.canonicalURL | text | N | Y | — | via `validateCanonicalOverride` |
| seo.canonicalOverrideEnabled | checkbox | N | Y | false | only with valid canonicalURL |
| seo.robotsIndex / robotsFollow | checkbox | N | N | true | — |
| seo.ogTitle | text | N | Y | — | max 100 |
| seo.ogDescription | textarea | N | Y | — | max 220 |
| seo.ogImage | relationship→media | N | N | — | — |
| searchText | text | N | Y | — | auto-populated, indexed, admin-hidden |
| translationStatus | select | N | Y | draft | missing/draft/translated/reviewed/outdated |
| workflowStatus | select | N | Y | draft | draft/review/scheduled/published/archived |
| legacyPublishedAt | date | N | Y | — | sidebar |

Hooks: `validateContentRoute` (beforeValidate), `enforceSeoContentUpdate` + `populateSearchText` (beforeChange), `createPathChangeRedirect` + `revalidateContent` + `auditCollectionChange` (afterChange), `revalidateDeletedContent` + `auditCollectionDelete` (afterDelete). Hook bodies in `payload/hooks/*` — names verified, implementations PARTIALLY VERIFIED.
Note: `docs/seo/SEO_CONTENT_CONTRACT.md` assigns document H1 to page identity (`content.h1`) — field does NOT exist in current schema; treat as Proposal, not Current State.

### `users` — admin auth (`collections/Users.ts`)
Fields: `name` text req max120; `role` select req default `viewer` (admin/editor/seo/viewer, `saveToJWT`); auth email/password with `maxLoginAttempts: 5, lockTime: 15min`. Access: all operations `adminOnly`. Hooks: audit afterChange/afterDelete. Admin group `Administration`, `useAsTitle: email`. No versions, no SEO fields.

### `media` — public library (`collections/Media.ts`)
`staticDir: media`, mime jpeg/png/webp/pdf, focalPoint, sizes thumbnail400×300 / card960×640 / hero1920×1080. Fields: `legacyID` unique/hidden; `isPublic` default true indexed (anon read gate: guests see only `isPublic=true`); `alt` req loc max180; `title` loc (`useAsTitle`); `caption` loc max500. Access: mutate `contentManager`. Hooks: `validatePublicMediaUpload`, audit. Consumed by `content.seo.ogImage`, `site-settings.logo/favicon`.

### `seo-redirects` — locale redirects, 307/308 only (`collections/SeoRedirects.ts`)
`sourceLocale` req (localeConfig options, indexed) + `sourcePath` normalized indexed + `sourceKey` unique hidden (`useAsTitle`); `to.type` radio content/url default content; `to.content`→content; `to.locale`; `to.url`; `status` select 308/307 default 308; `enabled` default true indexed; `reason`. NO 301 anywhere in runtime (grep-verified). Access: mutate `seoManager`, delete `adminOnly`, read `contentReader`. Hooks: `validateSeoRedirect`, `enforceSeoRedirectDraft`, revalidate + audit. Runtime: `lib/redirect-service.ts` + `proxy.ts`.

### `forms` + `form-submissions` (`collections/Forms.ts`)
`forms`: `key` unique indexed; `isActive` (FormBlock filter); `requiresPrivacyConsent` default true; `retentionMonths` req 1–24 default 12; `successRedirect`; loc `title` req, `description`, `successMessage` req, `consentLabel`; `fields[]` with key/fieldType req (14 types: text…hidden), label req loc, placeholder/helpText/optionLabels loc, min/max/pattern/options validation. Access: all `formManager`.
`form-submissions`: `form`→forms indexed; `files` join→submission-files; `locale`; readOnly contact fields + `data` json req; `status` new/contacted/qualified/closed indexed; `priority`; `assignedTo`→users; `expiresAt` req (retention purge); `ipHash` hidden indexed; consent fields. Access: create false (API route only), else `formManager`. Seed: `contact` form (name/email/message, all 3 locales).

### `submission-files` — private uploads (`collections/SubmissionFiles.ts`)
`staticDir: private-media/form-submissions`; `submission`→form-submissions indexed; `originalName` (`useAsTitle`); `checksumSHA256` req. Access: create false, else `formManager`. Served via hash-gated `/api/private/submission-files/[id]`.

### `audit-logs` — append-only trail (`collections/AuditLogs.ts`)
`actor`→users, `actorType` default admin, `action/objectType/objectID` indexed (`useAsTitle: action`), `before/after` json, `occurredAt` indexed. Access: create/update/delete false, read `adminOnly`. No hooks.

## Globals
- `site-settings`: brandName req (default from `STARTER_SITE_NAME` or "Payload CMS Starter"), logo/favicon→media, phone/email/portal/checkout URLs, socialLinks json, address/locationLabel loc, defaultSEOTitle loc max70 / defaultSEODescription loc max170 (SEO fallbacks). Access read true / update `adminOnly`; versions max 25.
- `design-settings`: 7 hex-validated color tokens, radii 8/12/20, containerWidth 1180 (960–1600), sectionSpacing 96 (48–160), motionEnabled true. Same access/versions.
- `navigation`: header/footer/mobile menus; items `{title loc req, description loc, path loc, iconKey, openInNewTab, enabled, children[] one level}`. Same access/versions.

## Debt
No duplicate model; generic `content+kind` kept over per-type collections (ADR-003). Missing: dedicated H1 field (contract proposes), sitemap-settings global (defaults in code suffice).
