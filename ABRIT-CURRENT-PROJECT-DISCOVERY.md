# ABRIT Website — Current Project Discovery

Status: current-state snapshot only  
Snapshot date: 2026-09-08 (Asia/Tehran)  
Workspace: `C:\projects\abrit-opencode`  
Branch: `opencode-dev`  
Commit: `a129fb3f77c04a31cdb49a8874b015b032f44a5e`  
Tag: `v1.0.0-payload-baseline`  

This document describes what is present in the repository and working tree at the snapshot date. It does not describe a roadmap, desired architecture, or unverified product capability.

## Evidence and status labels

The primary evidence sources are source code, package files, configuration, migrations, tests, and repository documentation. The `.env` file was not read or copied into this document.

- `IMPLEMENTED`: present in executable code or configuration.
- `PARTIAL`: some related code exists, but the complete capability or runtime path is not established.
- `NOT VERIFIED`: repository evidence is insufficient, or the live environment was not checked.
- `NOT IMPLEMENTED`: no executable implementation was found in the current application code.

The working tree is not clean. `git status --short` reports many tracked modifications/deletions and untracked files. Therefore this snapshot covers the checked-out working tree, while also recording the commit and tag that the branch points to. It must not be read as a clean release artifact.

## 1. Project identity

| Item | Current state | Evidence |
|---|---|---|
| Project name used in the request | `ABRIT Website` | User-provided project identity |
| Application package | `frontend` version `0.1.0`, private package | `frontend/package.json` |
| Repository shape | One web application under `frontend`, with root-level deployment, scripts, documentation, and reference assets; not a multi-package workspace | Root tree, `frontend/package.json` |
| Current branch | `opencode-dev` | Git branch state |
| Upstream branch | `upstream/opencode-dev` | Git branch state |
| Current commit | `a129fb3...` — `feat: checkpoint Payload CMS version 1` | Git log |
| Important tag | `v1.0.0-payload-baseline` | Git tag and `git describe` |
| Clean release state | `NOT VERIFIED`; working tree is dirty | `git status --short` |
| WHMCS | `NOT VERIFIED`; no executable WHMCS client/adapter was found in `frontend/src` | Source scan |
| Nextcloud | `NOT IMPLEMENTED` as an application integration; references exist in the static reference HTML, not as a verified runtime integration | Source scan, `abrit-homepage-polished-v5.html` |

## 2. Technology stack

Versions below come from `frontend/package.json`, `frontend/package-lock.json`, and the installed package tree where available.

| Area | Current version/state | Source |
|---|---|---|
| Next.js | `16.3.2` | `frontend/package.json` |
| React | `19.2.8` | `frontend/package.json` |
| React DOM | `19.2.8` | `frontend/package.json` |
| TypeScript | Installed `5.9.3`; package range `^5` | `frontend/package.json`, `npm ls` |
| Payload CMS | Installed `3.88.0`; package range `^3.88.0` | `frontend/package.json`, `npm ls` |
| Payload Next integration | `3.88.0` | `frontend/package.json` |
| Payload rich text | Lexical adapter `3.88.0` | `frontend/package.json` |
| Database | PostgreSQL | `@payloadcms/db-postgres`, `frontend/src/payload.config.ts`, `docker-compose.yml` |
| Database adapter | `@payloadcms/db-postgres` `3.88.0` | `frontend/package.json` |
| PostgreSQL client | `pg` `8.23.0` | `frontend/package.json` |
| ORM/data layer | Payload Local API and PostgreSQL adapter; no separate ORM was found | `frontend/src/lib/payload-cms.ts`, `frontend/src/payload.config.ts` |
| UI/CSS | Custom CSS; no Tailwind, MUI, or other UI framework dependency found | `frontend/src/app/globals.css`, package files |
| Rich text | `@payloadcms/richtext-lexical` | `frontend/src/payload.config.ts`, `frontend/src/components/block-renderer.tsx` |
| Validation | `zod` `4.5.4` for form request parsing; custom validation hooks for content, SEO, and uploads | `frontend/src/app/api/forms/[formKey]/submissions/route.ts`, `frontend/src/payload` |
| Image processing | `sharp` `0.35.4` | `frontend/package.json`, `frontend/src/payload.config.ts` |
| Archive/file utility | `jszip` `3.10.1`; file type detection via `file-type` `22.0.2` | `frontend/package.json` |
| Testing | Vitest `4.1.11`; integration and HTTP E2E test files are present | `frontend/vitest.config.ts`, `frontend/src/**/*.test.*` |
| Linting | ESLint `9.39.5` with Next Core Web Vitals and TypeScript configs | `frontend/eslint.config.mjs` |
| Formatting | `NOT VERIFIED`; no dedicated formatter configuration or package was found | Repository scan |
| Build | Next standalone output | `frontend/next.config.ts` |
| Local runtime observed | Node `v22.22.0`, npm `10.9.4` | Runtime check on snapshot date |

## 3. Application architecture

### Runtime shape

The application is a single Next.js process with Payload CMS mounted in the same application:

1. Next.js App Router serves localized public pages.
2. Payload CMS provides the admin panel, REST API, Local API, authentication, collections, globals, versions, and database access.
3. `frontend/src/payload.config.ts` wires Payload to PostgreSQL, Lexical, Sharp, localization, collections, globals, and the admin user collection.
4. Server components load public content through `frontend/src/lib/payload-cms.ts`, which uses the Payload Local API.
5. Payload changes invoke revalidation hooks in `frontend/src/payload/hooks/revalidate.ts`.

### Rendering and data flow

- App Router is used; no Pages Router files were found.
- Public pages are server-rendered from published Payload content.
- The home route loads the `home` content document for the current locale.
- Generic pages load a localized content document by path and render enabled blocks through `BlockRenderer`.
- `?draft=1` is only treated as a draft preview when the request is authenticated.
- Header, footer, site settings, design settings, and navigation are loaded from Payload globals.
- SEO metadata is resolved separately through the SEO loader/resolver and returned as Next.js metadata.
- Public form submission is a Next.js route handler that validates input and writes to Payload collections.

### Architecture summary

Next.js App Router and Payload CMS run together in one `frontend` application. PostgreSQL stores Payload data, while public pages and forms use server-side Local API access. Content is localized and block-based. CMS mutations invalidate page, locale, redirect, and sitemap cache tags. Admin authentication and role-based access protect editorial, SEO, form, file, and system operations.

## 4. URL and routing structure

### Public routes

| Route | Current behavior | Status |
|---|---|---|
| `/` | Redirects to `/fa` | `IMPLEMENTED` — `frontend/src/app/(redirect)/page.tsx` |
| `/<locale>` | Localized home page loaded from the `home` content document | `IMPLEMENTED` |
| `/<locale>/<path>` | Generic localized CMS page resolved by localized `path` | `IMPLEMENTED` |
| `/<locale>/<path>?draft=1` | Authorized draft preview for a CMS page | `IMPLEMENTED` in route code; live preview flow `NOT VERIFIED` |
| `/<locale>/search?q=...` | Published-content search using normalized `searchText` | `IMPLEMENTED` |
| `/<locale>/not-found` | Localized not-found handling | `IMPLEMENTED` |
| `/admin` and `/admin/*` | Payload admin panel | `IMPLEMENTED` in route/config; live access `NOT VERIFIED` |

### Locales and directionality

The configured locales are:

- `en` — `en`, LTR, default locale.
- `fa` — `fa`, RTL.
- `ar-ae` — `ar-AE`, RTL.

The locale is part of the public URL. Locale metadata, `lang`, `dir`, alternate links, localized content fields, and localized global values are implemented in `frontend/src/lib/site-config.ts`, `frontend/src/lib/locales.ts`, `frontend/src/app/[locale]/layout.tsx`, and the SEO modules.

### API routes

| Route | Methods/behavior | Status |
|---|---|---|
| `/api/*` | Payload REST handlers for GET/POST/PUT/PATCH/DELETE/OPTIONS | `IMPLEMENTED` — `frontend/src/app/(payload)/api/[...slug]/route.ts` |
| `/api/forms/:formKey/submissions` | JSON or multipart form submission, validation, rate limit, consent, retention, and optional private files | `IMPLEMENTED` |
| `/api/private/submission-files/:id` | Authenticated download for admin/editor users only | `IMPLEMENTED` |
| `/api/revalidate` | HMAC-signed cache revalidation endpoint with timestamp/skew checks | `IMPLEMENTED` in code; external caller `NOT VERIFIED` |
| `/healthz` | Returns `{ status: "ok" }` without checking the database | `IMPLEMENTED` |
| `/readyz` | Checks Payload/database access and returns `ready` or HTTP 503 | `IMPLEMENTED` in code; live database readiness `NOT VERIFIED` |
| `/robots.txt` | Disallows all crawlers outside production; allows public paths and excludes `/api/` and `/admin/` in production | `IMPLEMENTED` |
| `/sitemap.xml` | Built from the SEO sitemap loader and cached | `IMPLEMENTED` in code; generated live output `NOT VERIFIED` |

### Routes not found as dedicated App Router pages

No dedicated route files currently exist for `/products`, `/pricing`, `/services`, `/solutions`, `/news`, `/knowledge`, or `/contact`. These concepts can only be represented through the generic localized `content` route when a matching content document exists. A live document/database check was not performed.

## 5. Payload CMS structure

Payload is configured in `frontend/src/payload.config.ts` with localization, English/Farsi admin translations, PostgreSQL, Lexical, Sharp, draft/version support where configured, and `users` as the admin auth collection.

### Collections

#### `users`

- Purpose: Payload admin authentication and role assignment.
- Main fields: email/auth fields, required name, role.
- Roles: `admin`, `editor`, `seo`, `viewer`.
- Authentication controls: maximum 5 login attempts and a 15-minute lock time.
- Access: admin-only create/read/update/delete.
- Hooks: audit on create/update/delete.
- Draft/localization: not configured for this collection.

#### `media`

- Purpose: public media library.
- Main fields: file metadata, public flag, localized alt/title/caption, legacy ID.
- Accepted MIME types: JPEG, PNG, WebP, PDF.
- Image sizes: `thumbnail` 400×300, `card` 960×640, `hero` 1920×1080.
- Storage: Payload upload directory `media`.
- Access: admins/editors manage; unauthenticated reads are limited to `isPublic` media.
- Hooks: public-upload validation and audit.
- Localization: alt, title, and caption are localized.

#### `content`

- Purpose: localized pages and editorial content rendered from reusable blocks.
- Kinds: `page`, `service`, `solution`, `knowledge`, `news`.
- Main fields: stable `key`, `kind`, `templateKey`, active flag, localized title/excerpt/layout, localized slug/path, parent, related content, SEO group, search text, translation status, workflow status, legacy publication date.
- Routing: localized paths are validated, normalized, unique, and protected from active redirect collisions.
- Versions/drafts: autosave every 1500 ms, localized status, scheduled publish, maximum 50 versions per document.
- Access: admin/editor create/delete; admin/editor/SEO update; published or authenticated read; authenticated version reads.
- SEO restriction: SEO users can update existing SEO fields only and cannot modify content, routing, workflow, or publication fields.
- Hooks: route validation, SEO workflow enforcement, search-text population, path-change redirect creation, revalidation, and audit.

#### `seo-redirects`

- Purpose: localized redirect management.
- Main fields: source locale/path/key, content or URL destination, status `307`/`308`, enabled, reason.
- Access: admin/editor/SEO create/update; admin delete; authenticated content readers read.
- Validation: normalized source, duplicate-source, self-redirect, redirect-chain, and redirect-loop checks.
- Hooks: SEO draft enforcement, revalidation, and audit.

#### `forms`

- Purpose: CMS-managed form definitions.
- Main fields: key, active flag, privacy consent flag, retention months (1–24), success redirect/message, localized title/description/consent text, and dynamic fields.
- Supported field types: text, textarea, email, phone, number, select, multi-select, radio, checkbox, date, datetime, URL, file, hidden.
- Access: admin/editor create/read/update/delete.
- Localization: form copy, labels, placeholders, help text, and option labels can be localized.
- Hooks: audit on create/update/delete.

#### `form-submissions`

- Purpose: stored form-response inbox.
- Main fields: form relation, locale, normalized contact fields, raw JSON data, status, priority, assignment, source/referrer, consent, user agent, hashed IP, expiry date, internal notes, and joined private files.
- Status values: `new`, `contacted`, `qualified`, `closed`.
- Priority values: `low`, `normal`, `high`, `urgent`.
- Access: public creation is disabled in Payload; the submission route uses controlled server-side creation after validation. Admin/editor manage records.
- Retention: each submission receives an `expiresAt` based on the form retention period; a purge script exists.
- Hooks: submission summary population and audit.

#### `submission-files`

- Purpose: private files attached to form submissions.
- Storage: `private-media/form-submissions`.
- Main fields: submission relation, original filename, SHA-256 checksum.
- Access: public creation disabled; admin/editor read/update/delete.
- Route access: private download route permits admin/editor only.
- Hooks: private-upload validation and audit.

#### `audit-logs`

- Purpose: immutable system audit records.
- Main fields: actor, actor type, action, object type/ID, before/after JSON, occurrence time, legacy ID.
- Access: admin read-only; create/update/delete are blocked through collection access.
- Population: audit hooks on relevant collections and globals.

### Globals

#### `site-settings`

Brand name, logo, favicon, phone, email, customer portal URL, external checkout URL, social links, localized address/location, and localized default SEO title/description. Public read is allowed; updates are admin-only. Versions are kept up to 25. The URL fields exist in the model; executable WHMCS/customer-portal behavior is `NOT VERIFIED`.

#### `design-settings`

Global colors, small/medium/large radii, container width, section spacing, and motion-enabled flag. Public read is allowed; updates are admin-only. Values are read by the localized layout and mapped to CSS custom properties. Versions are kept up to 25.

#### `navigation`

Localized header, footer, and mobile arrays with title, description, path, icon key, new-tab flag, enabled flag, and nested children. Public read is allowed; updates are admin-only. Versions are kept up to 25.

### Blocks

The `content` collection currently registers these block types in `frontend/src/payload/blocks.ts`:

1. `hero` — eyebrow, title, highlight, body, primary/secondary CTA, points.
2. `richText` — eyebrow, heading, Lexical rich text body.
3. `featureGrid` — eyebrow, heading, intro, and 1–12 feature items.
4. `faq` — heading and 1–20 question/answer items.
5. `testimonials` — heading and 1–8 quote/name/role/company items.
6. `cta` — eyebrow, title, body, and primary CTA.
7. `form` — relation to an active form plus localized presentation copy and optional context.

All applicable editorial fields are localized. Enabled state and presentation variants are available where declared. The public renderer is `frontend/src/components/block-renderer.tsx`.

## 6. Content model status

| Content area | Current repository evidence | Status |
|---|---|---|
| Generic pages | `content` collection, localized paths, block layout, generic route, SEO fields | `IMPLEMENTED` |
| Home page | Home route calls `cms.home(locale)` and renders CMS blocks | `IMPLEMENTED` in code; live home record `NOT VERIFIED` |
| Services | Represented by `content.kind = service` and generic route | `PARTIAL`; dedicated listing/detail route not present |
| Solutions | Represented by `content.kind = solution` and generic route | `PARTIAL`; dedicated listing/detail route not present |
| Knowledge base | `content.kind = knowledge` is supported | `PARTIAL`; listing/article route and live records `NOT VERIFIED` |
| News/blog | `content.kind = news` is supported | `PARTIAL`; listing/article route and live records `NOT VERIFIED` |
| Products | No product kind, product collection, or dedicated product route found | `NOT IMPLEMENTED` as a dedicated current model |
| Pricing | No pricing collection or dedicated pricing route found in current App Router | `NOT IMPLEMENTED` as a dedicated current model |
| Media | Payload upload collection with public/private distinction and image processing | `IMPLEMENTED` |
| Forms | Dynamic form builder, localized copy, public submission endpoint, submission inbox | `IMPLEMENTED` in code; live database flow `NOT VERIFIED` |

The root file `abrit-homepage-polished-v5.html` is a static visual/content reference asset. The current localized home route reads Payload content; the reference file is not evidence of a live WHMCS, Nextcloud, analytics, or other third-party integration.

## 7. SEO status

| Capability | Status | Evidence / limitation |
|---|---|---|
| Meta title | `IMPLEMENTED` | `frontend/src/lib/seo.ts`, `seo-resolver.ts` |
| Meta description | `IMPLEMENTED` | SEO resolver and Next metadata mapping |
| Self-canonical URL | `IMPLEMENTED` | SEO resolver |
| Canonical override | `IMPLEMENTED` with validation and sitemap consequence | `content.seo.canonicalURL`, `canonicalOverrideEnabled` |
| Robots index/follow | `IMPLEMENTED` | `robotsIndex`, `robotsFollow`, metadata mapping |
| Open Graph | `IMPLEMENTED` | Title, description, locale, URL, optional image |
| Twitter/X metadata | `IMPLEMENTED` | Summary or summary-large-image card |
| `sitemap.xml` | `IMPLEMENTED` in code | `frontend/src/app/sitemap.ts`; live output `NOT VERIFIED` |
| `robots.txt` | `IMPLEMENTED` in code | Production/non-production policy in `robots-policy.ts` |
| Organization/WebSite JSON-LD | `IMPLEMENTED` | `structured-data.tsx`, `schema.ts` |
| Article schema | `IMPLEMENTED` when resolver has valid editorial data | No separate article collection |
| Service schema | `IMPLEMENTED` when content is resolved as a service | Depends on content classification/data |
| Product schema | `PARTIAL` | Schema code exists, but no dedicated product model/route was found |
| Breadcrumb schema | `IMPLEMENTED` when resolver has more than one breadcrumb | `schema.ts` |
| FAQ schema | `IMPLEMENTED` from visible FAQ blocks | `schema.ts`, `content-structured-data.tsx` |
| Redirect management | `IMPLEMENTED` | `seo-redirects` collection and redirect validation |
| Slug/path validation | `IMPLEMENTED` | Normalization, uniqueness, collision checks |
| Noindex/nofollow | `IMPLEMENTED` | Per-content robots fields |
| Image alt text | `IMPLEMENTED` as a required localized Media field | `Media.ts` |
| Localization/hreflang | `IMPLEMENTED` in SEO resolution and layout | Live alternate availability `NOT VERIFIED` |
| SEO preview UI | `NOT VERIFIED`; no separate SEO preview component was found | Content preview URL exists in Payload admin config |
| Production search-engine behavior | `NOT VERIFIED` | No production crawl or deployed-site check was performed |

## 8. User roles and access control

### Roles

| Role | Current permission boundary |
|---|---|
| `admin` | Full administrative access, including users, globals, audit records, and destructive operations where allowed |
| `editor` | Content and form management; can read/manage submissions and private submission files; cannot administer users/globals |
| `seo` | Read content and update SEO-managed fields; can create/update redirects but cannot activate redirects; cannot change editorial content/routing/workflow |
| `viewer` | Authenticated read access to protected content surfaces; no write access |

### Access implementation

- Role checks are centralized in `frontend/src/payload/access.ts`.
- Public content is read from published documents; authenticated users can access protected content according to collection access.
- Globals are publicly readable and admin-updatable.
- Audit logs are admin-readable and write-protected from normal collection operations.
- Public form submission does not rely on Payload public create access; the Next.js handler validates and creates with controlled server-side access.
- Field-level editing restrictions distinguish editorial fields from SEO fields in `Content.ts`.
- The admin auth collection is `users`; the admin panel is mounted under `/admin`.

## 9. Current integrations

| Integration | Current evidence | Status |
|---|---|---|
| PostgreSQL | Payload PostgreSQL adapter and Docker Compose PostgreSQL service | `IMPLEMENTED` in configuration; live DB `NOT VERIFIED` |
| Payload Local API | Used by public server components and server routes | `IMPLEMENTED` |
| Payload REST API | Mounted under `/api/*` | `IMPLEMENTED` |
| Next.js cache revalidation | Payload hooks call tag/path invalidation; signed external revalidation route exists | `IMPLEMENTED` in code; live invalidation `NOT VERIFIED` |
| Search | Internal Payload content search over normalized indexed `searchText` | `IMPLEMENTED` |
| Local media storage | Public media and private submission-file directories are configured | `IMPLEMENTED` in code; filesystem permissions/production volume `NOT VERIFIED` |
| Email delivery | No outbound email provider/client/SMTP implementation found | `NOT IMPLEMENTED` |
| Analytics | No analytics SDK or event integration found in executable source | `NOT IMPLEMENTED` |
| CDN | No CDN adapter or deployment binding found | `NOT VERIFIED` |
| WHMCS | `externalCheckoutURL` model field exists, but no executable client or redirect consumer was found in current source | `NOT VERIFIED` |
| Nextcloud | Appears in the static reference HTML only; no runtime integration found | `NOT IMPLEMENTED` |
| External APIs/webhooks | No general external API client or outbound webhook implementation found; `/api/revalidate` is an inbound signed endpoint | `NOT IMPLEMENTED` as a general integration layer |

## 10. Infrastructure and environments

### Development

- Local PostgreSQL is defined in `docker-compose.yml`.
- Container image: `postgres:17-alpine`.
- Local database port: host `5433` → container `5432`.
- Database name/user in the development compose file: `payload_starter` / `payload`.
- The frontend package runs the Next.js dev server on port `3000` by default.
- `frontend/src/scripts/seed-payload.ts` is exposed as `npm run bootstrap` and `npm run seed`.
- The repository contains `env.local.example`, `.env.example`, and `deploy/env.production.example`.
- Secret values are not documented here.

### Staging and production

- Standalone Next output is configured in `frontend/next.config.ts`.
- Deployment-related files exist under `deploy/`, including `compose.yaml`, `update.sh`, and environment examples.
- Deployment environment variable names include database, Payload secret, IP hash secret, public site URL, deployment environment, admin credentials, revalidation secret, port, and deploy branch.
- Actual staging/prod host, reverse proxy, DNS, TLS, domain binding, volumes, and deployed database state are `NOT VERIFIED` from this repository snapshot.

### Environment variables observed in examples

`DATABASE_URI`, `PAYLOAD_SECRET`, `IP_HASH_SECRET`, `NEXT_PUBLIC_SITE_URL`, `PAYLOAD_ADMIN_EMAIL`, `PAYLOAD_ADMIN_PASSWORD`, `REVALIDATION_SECRET`, `DEPLOYMENT_ENV`, `STARTER_SITE_NAME`, `PORT`, `RUN_PAYLOAD_INTEGRATION`, `RUN_SEO_E2E`, `SEO_E2E_BASE_URL`, `SEO_E2E_PORT`, and `SEO_INVENTORY_SITE_URL`.

## 11. Database and migrations

The Payload PostgreSQL adapter uses `frontend/src/migrations` as its migration directory. The repository currently contains:

- `20260907_120000_starter_v1_baseline.ts` and its JSON snapshot.
- `20260907_133520_seo_routing_foundation.ts`.
- `20260907_135305_seo_canonical_override.ts`.
- `index.ts` migration registry.

The baseline migration includes tables for Payload users, media, content, forms, form submissions, submission files, audit logs, SEO redirects, globals, versions, localization tables, relationships, indexes, and Payload support tables. A live migration-status check against PostgreSQL was not performed; database state is therefore `NOT VERIFIED`.

## 12. Quality and testing

### Test inventory

The repository contains unit/component tests, Payload access/block tests, form tests, upload validation tests, SEO contract/resolver/policy tests, integration test files, and an HTTP SEO E2E test.

### Snapshot verification performed

Commands run from `frontend` on 2026-09-08:

```text
npm test      -> 14 test files passed, 1 skipped; 64 tests passed, 5 skipped
npm run lint  -> passed with no reported errors
```

The default Vitest configuration excludes `*.integration.test.ts` unless `RUN_PAYLOAD_INTEGRATION=1`. SEO HTTP E2E execution also depends on a running application and the corresponding environment flags. Full build, typecheck, live database integration, and deployed-site E2E were not run for this documentation snapshot and are `NOT VERIFIED`.

### Available quality commands

```text
npm run lint
npm run typecheck
npm test
npm run test:integration
npm run test:seo:integration
npm run test:seo:e2e
npm run build
npm run check
```

`npm run check` chains lint, typecheck, tests, and build.

## 13. Current project status

### Completed / implemented in the current code

- Next.js App Router and Payload CMS are configured as one application.
- PostgreSQL adapter, migration directory, generated Payload types, and Payload admin integration are present.
- Localized public routing for `en`, `fa`, and `ar-ae` is implemented.
- Generic CMS pages are rendered from localized, block-based content.
- Seven reusable content block types are registered and rendered.
- Payload globals provide site settings, design tokens, and navigation.
- Dynamic form definitions, public submission validation, consent, rate limiting, retention metadata, and submission storage are implemented.
- Private submission files have restricted storage and authenticated download handling.
- Roles `admin`, `editor`, `seo`, and `viewer` plus field-level SEO/editorial restrictions are implemented.
- Audit logging hooks are attached to relevant collections and globals.
- SEO metadata, canonical/robots controls, localized alternates, sitemap/robots handlers, redirects, and multiple JSON-LD schema types are implemented in code.
- Health and readiness endpoints are present.
- Unit/component/lint checks passed in the snapshot environment.

### In progress / working-tree state

- The branch is checked out as `opencode-dev`, but the working tree contains a large mixed set of tracked edits, deletions, and untracked files. The repository does not expose a reliable intent label for each local change; therefore no individual dirty file is classified here as an approved feature.
- SEO routing and starter-baseline files are present in the working tree, but some are not part of the checked-out commit. Their release/integration status is `NOT VERIFIED`.

### Partial

- Services, solutions, knowledge, and news are representable through the generic content model, but dedicated listing/detail route files are not present.
- Product and pricing concepts are not represented by dedicated current Payload collections/routes.
- The home page route is CMS-backed in code, but the live `home` document and its localized published blocks were not queried.
- Production deployment configuration exists, but deployment state and external services were not verified.
- SEO schema code supports service/article/product distinctions, but product data has no dedicated current model.

### Known problems / limitations

- The working tree is dirty, so the current files do not describe only the tagged commit.
- Integration tests are skipped by default unless the required environment flag is enabled.
- No outbound email delivery implementation was found for form submissions.
- No analytics implementation was found.
- The configured customer portal and external checkout URL fields are not evidence of a functioning WHMCS/customer-portal flow.
- No dedicated `/products`, `/pricing`, `/services`, `/solutions`, `/news`, `/knowledge`, or `/contact` route files are present.
- No live database/content/admin/deployment verification was performed.

### Current technical risks

- Publishing or deploying from the dirty working tree could include unintended local changes.
- Production behavior depends on correctly supplied secrets, database connectivity, file storage, and revalidation configuration that were not checked here.
- Local file storage for public media and private submission files requires deployment volume and permission correctness; this was not verified.
- SEO correctness depends on published localized content, valid alternate paths, and live sitemap generation; repository code alone cannot confirm the final public output.
- Form data and private uploads contain potentially sensitive information; retention, access, filesystem protection, and production operations need live verification.
- The lack of outbound notifications means form submissions may be stored without an email or webhook alert path.

## 14. Current UI status

### Implemented UI foundations

- Shared localized layout with header, footer, organization JSON-LD, design settings, and ambient motion component.
- Sticky responsive header with CMS-driven navigation, nested children, mobile toggle, and locale switcher.
- Footer with brand, navigation, phone, email, location, and localized rights text.
- CMS block renderer for hero, rich text, feature grid, FAQ, testimonials, CTA, and form sections.
- Dynamic form UI with localized labels, field types, consent, honeypot, client submission state, and accessible live status.
- Custom CSS design system with CMS-controlled color, radius, container, spacing, and motion variables.
- Font setup for Latin and RTL/localized interfaces through `frontend/src/app/fonts.ts`.
- Responsive rules for the public layout, CMS blocks, forms, search, and mobile navigation.

### UI status boundaries

- RTL support is implemented for configured Persian and Arabic locales; full visual QA across all locales is `NOT VERIFIED`.
- Search UI is implemented at `/<locale>/search`; live result quality depends on seeded/published content and is `NOT VERIFIED`.
- Pricing, product, and service-specific UI styles exist in parts of the stylesheet/reference code, but no corresponding dedicated current App Router route was found; reachable production UI is `NOT VERIFIED`.
- A dedicated mega-menu component was not found. The current header supports nested navigation through `details` elements.
- No external checkout, customer portal, analytics, or outbound notification UI flow was verified.

## 15. Repository map

```text
root/
├── frontend/                 # Next.js + Payload application
│   ├── src/app/              # App Router pages, layouts, route handlers
│   ├── src/components/       # Shared public UI and block/form renderers
│   ├── src/lib/              # Payload client, locale, SEO, schema, policies
│   ├── src/payload/          # Payload config, collections, globals, hooks
│   ├── src/migrations/       # PostgreSQL migrations and registry
│   ├── src/scripts/          # Bootstrap, SEO, retention, and operational scripts
│   ├── package.json          # Frontend dependencies and commands
│   └── next.config.ts        # Standalone Next configuration and headers
├── deploy/                   # Deployment compose/update files and env example
├── docs/                     # Project, environment, SEO, and agent reports
├── scripts/                  # Root operational/support scripts
├── docker-compose.yml        # Local PostgreSQL service
├── abrit-homepage-polished-v5.html # Static reference asset, not runtime proof
├── .env.example              # Root environment variable names/example values
└── README.md / guide.md      # Existing repository documentation
```

## 16. Important files

| Path | Purpose | Why important |
|---|---|---|
| `frontend/package.json` | Dependencies and scripts | Defines runtime/tooling versions and verification commands |
| `frontend/next.config.ts` | Next standalone configuration and security headers | Controls build output and response headers |
| `frontend/src/payload.config.ts` | Payload root configuration | Connects database, admin, localization, collections, globals, editor, and migrations |
| `frontend/src/app/[locale]/page.tsx` | Localized home route | Proves home rendering is CMS-driven in current code |
| `frontend/src/app/[locale]/[...slug]/page.tsx` | Generic localized CMS route | Resolves published content and authorized draft preview |
| `frontend/src/app/[locale]/layout.tsx` | Shared localized layout | Loads settings/navigation/design and sets locale direction |
| `frontend/src/app/api/forms/[formKey]/submissions/route.ts` | Public form submission API | Contains request validation, throttling, retention, and file handling |
| `frontend/src/app/(payload)/api/[...slug]/route.ts` | Payload REST bridge | Mounts the CMS REST API under Next.js |
| `frontend/src/payload/collections/Content.ts` | Page/editorial data model | Defines localized blocks, routes, drafts, SEO, workflow, and access rules |
| `frontend/src/payload/collections/Forms.ts` | Form and submission models | Defines dynamic form fields and submission inbox |
| `frontend/src/payload/collections/Media.ts` | Public media upload model | Defines public media access, alt text, MIME types, and image sizes |
| `frontend/src/payload/collections/SeoRedirects.ts` | Redirect model | Defines redirect destinations, statuses, validation, and access |
| `frontend/src/payload/access.ts` | Central access helpers | Defines the four admin roles and permission boundaries |
| `frontend/src/payload/blocks.ts` | Registered CMS blocks | Defines the current page composition contract |
| `frontend/src/payload/globals/SiteSettings.ts` | Site identity/contact/SEO global | Supplies shared site metadata and contact values |
| `frontend/src/payload/globals/DesignSettings.ts` | Design-token global | Supplies CMS-controlled visual tokens to the layout |
| `frontend/src/payload/globals/Navigation.ts` | Navigation global | Supplies localized header/footer/mobile menus |
| `frontend/src/lib/payload-cms.ts` | Server-side CMS data access | Maps Payload documents/globals into public application data |
| `frontend/src/lib/seo.ts` and `frontend/src/lib/seo-resolver.ts` | SEO loading/resolution | Builds metadata, canonicals, alternates, robots, and cache tags |
| `frontend/src/payload/hooks/revalidate.ts` | Cache invalidation hooks | Revalidates content, globals, redirects, and sitemap paths/tags |
| `frontend/src/migrations/20260907_120000_starter_v1_baseline.ts` | Baseline database migration | Defines the current Payload/PostgreSQL schema baseline |

## 17. Documentation snapshot

### Project Summary

ABRIT Website is a single Next.js 16.3.2 application that embeds Payload CMS 3.88.0 and uses PostgreSQL through the Payload adapter. The current code supports localized English, Persian, and Arabic public routes, CMS-managed block pages, Payload administration, forms and submissions, private submission files, role-based access, audit logs, and a substantial SEO foundation. The public page model is generic and block-based rather than having dedicated current route modules for products, pricing, services, solutions, news, or knowledge. The repository is currently on `opencode-dev`, points to `v1.0.0-payload-baseline`, and has many uncommitted local changes; this is therefore a working-tree snapshot, not a clean release statement.

### Current Architecture

- Next.js App Router and Payload run in one `frontend` process.
- PostgreSQL is the Payload database through `@payloadcms/db-postgres`.
- Public server components use the Payload Local API.
- Payload REST is exposed under `/api/*`.
- Content is localized, path-based, versioned, draft-capable, and block-rendered.
- Header, footer, navigation, design tokens, and site settings are Payload globals.
- Forms are CMS-defined and submitted through a validated Next.js route handler.
- Cache invalidation is handled by Payload hooks and signed revalidation support.
- SEO metadata and structured data are resolved from content and site settings.

### Current Capabilities

- Localized `en`, `fa`, and `ar-ae` routes with RTL/LTR handling.
- CMS home and generic page rendering.
- Seven reusable content blocks.
- Lexical rich text rendering.
- Dynamic localized forms with consent and validation.
- Submission storage, status, priority, assignment, expiry, and private files.
- Admin/editor/SEO/viewer roles with field-level SEO restrictions.
- Audit logs for administrative changes.
- Media upload with public/private access rules and image sizes.
- Search over published content.
- Canonical, robots, Open Graph, Twitter/X, sitemap, robots.txt, and JSON-LD support.
- Redirect records with validation and path-change redirect creation.
- Health and readiness endpoints.
- Local PostgreSQL Docker configuration and Payload migration files.
- Unit/component tests and lint checks passing in the snapshot environment.

### Current Limitations

- The working tree is not clean.
- Dedicated product and pricing models/routes are absent.
- Dedicated service, solution, news, knowledge, and contact route modules are absent.
- Live CMS data and published localized records were not inspected.
- Full build, typecheck, live database integration, and deployed E2E were not verified.
- No outbound email or analytics implementation was found.
- WHMCS/customer-portal behavior is not verified from executable source.
- Nextcloud is not implemented as a current application integration.
- Production storage, reverse proxy, domain, TLS, and CDN behavior are not verified.

### Current Technical Risks

- Dirty working tree may contain unrelated or incomplete changes.
- Production secrets and database/storage configuration are operational prerequisites not verified here.
- Public/private file storage correctness depends on deployment volumes and permissions.
- Form submissions may be stored without outbound operator notification.
- SEO output depends on live content, translation availability, and deployment configuration.
- Sensitive form data and uploads require live retention and access-control verification.

### Important URLs / Routes

- `/` → redirect to `/fa`
- `/en`, `/fa`, `/ar-ae` → localized home route
- `/<locale>/<path>` → generic published CMS page
- `/<locale>/search?q=...` → content search
- `/admin` → Payload admin panel
- `/api/*` → Payload REST API
- `/api/forms/:formKey/submissions` → public form submission endpoint
- `/api/private/submission-files/:id` → authenticated private-file download
- `/healthz` → liveness endpoint
- `/readyz` → database/Payload readiness endpoint
- `/robots.txt` → robots policy
- `/sitemap.xml` → generated SEO sitemap

### Important Repositories / Branches / Tags

- Workspace: `C:\projects\abrit-opencode`
- Current branch: `opencode-dev`
- Upstream branch: `upstream/opencode-dev`
- Current commit: `a129fb3f77c04a31cdb49a8874b015b032f44a5e`
- Important tag: `v1.0.0-payload-baseline`
- Working tree: dirty; not a clean release snapshot

### Unknown / Not Verified Items

- Live PostgreSQL schema and migration status.
- Existing CMS records, published home document, localized translations, and live forms.
- Admin login and role behavior against a running application.
- Production deployment, reverse proxy, TLS, domain, CDN, volumes, and filesystem permissions.
- Actual WHMCS/customer-portal connection or checkout behavior.
- Actual Nextcloud connection.
- Email, analytics, outbound webhook, and monitoring services.
- Full typecheck/build and integration/E2E results in the target deployment environment.

