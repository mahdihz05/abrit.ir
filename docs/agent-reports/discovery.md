# AbrIT Repository Discovery Report

Discovery completed read-only. No files, dependencies, migrations, or configuration were changed during the investigation.

## Repository Map

- `backend/`: Django 5.2 project, REST API, Django Admin, migrations, management commands, and SQLite data.
- `frontend/`: Next.js 16 / React 19 / TypeScript public website.
- `docs/`: implementation plan, milestones, and checklist. These contain intentions and occasionally lag executable code.
- `scripts/`: Windows packaging/check scripts and cPanel hosting helpers.
- `abrit-homepage-polished-v5.html`: current homepage presentation source/reference.
- `requirements.txt`: pinned Python dependencies.
- `backend/data/abrit.sqlite3`: populated current database.
- Root `.agents`, `.codex`, `artifacts`, and root Codex npm dependency appear to be development/tooling surfaces, not application runtime architecture.

The worktree was already dirty: 35 tracked files report modifications, mostly equal add/delete counts consistent with line-ending changes. The discovery did not alter them.

## Backend Architecture

The Django project is configured under `backend/config/`, with environment-specific settings in `backend/config/settings/`.

Installed first-party apps:

- `core`: site/design settings, audit log, frontend revalidation outbox.
- `content`: pages and editorial content, translations, blocks, relations, service/article profiles, workflow and revisions.
- `media`: public/private media metadata.
- `navigation`: multilingual hierarchical menus.
- `pricing`: packages, features, add-on rates, terms, and calculation service.
- `forms`: structured forms, submissions/leads, private attachments, retention.
- `search`: denormalized multilingual public search index.

Evidence: `backend/config/settings/base.py`.

Common model conventions include UUID primary keys plus timestamps through `UUIDTimestampedModel`, singleton settings through `SingletonModel`, model-level validation via `clean()`, and database uniqueness/index constraints. See `backend/apps/core/models.py` and `backend/apps/content/models.py`.

## Frontend Architecture

This is a Next.js App Router application, not a conventional React SPA:

- Locale root: `/[locale]`, statically generated for `fa`, `en`, and `ar-ae`.
- Dedicated services, solutions, products, pricing, and search routes.
- Generic single-segment pages through `/[locale]/[slug]`.
- Next route handlers provide pricing proxying and signed cache revalidation.
- Server components are the default; interactive header, forms, pricing, homepage runtime, and configurators are client components.

Routes are under `frontend/src/app/`. Locale validation and direction metadata are in `frontend/src/lib/locales.ts`.

There is no Redux, Zustand, Context store, or comparable global state layer. Interactive state is local React `useState`/`useMemo` state in components such as `frontend/src/components/pricing-configurator.tsx`, `frontend/src/components/product-configurator.tsx`, and `frontend/src/components/site-header.tsx`.

Important current boundary: most public routes use static repository content from `frontend/src/lib/public-content.ts`, `frontend/src/lib/product-packages.ts`, and `frontend/src/lib/managed-it-packages.ts`. Although a typed CMS client exists in `frontend/src/lib/api.ts`, no current route calls `cms.*`.

The homepage reads the root HTML reference and injects its body into React using `dangerouslySetInnerHTML`; additional React/runtime adapters layer forms, motion, and network patterns over it. See `frontend/src/components/reference-homepage.tsx` and `frontend/src/lib/reference-homepage.ts`.

## Existing Domain Features

- Page/content: `ContentItem` supports `page`, `service`, `solution`, `knowledge`, and `news`. There is no `product` content kind.
- Service: `ServiceProfile` relates a service item to capabilities and technologies.
- Product/pricing: represented by `Package`, package translations/features/rates, and `ContractTerm`, not a generic Product model.
- Media: `MediaAsset` with type, MIME, dimensions, checksum, visibility, and localized title/alt/caption.
- Forms/leads: structured `Form`, localized fields, `FormSubmission` with lead statuses `new/contacted/qualified/closed`, consent snapshot, source metadata, hashed IP, retention date, and internal notes. There is no separate `Lead` model.
- Attachments: `SubmissionFile` and validation/private storage exist, but the public submission serializer currently accepts only JSON data and does not create attachment records.
- SEO: localized content has title/description, canonical URL, robots flags, Open Graph fields/image, and published-language alternates.
- Translation: FA/EN/AR-AE use separate translation rows. Public content does not fall back to another locale.
- Navigation: header/footer/mobile menus, nested menu items, internal published targets, external links, translations, featured images, ordering, and columns.
- Search: normalized Persian/Arabic text stored in `SearchDocument`; publishing indexes content and unpublishing removes it.
- Current SQLite data contains 21 content items and 63 published/reviewed translations: 5 pages, 10 services, and 6 solutions, each in all three locales. It also contains five packages, two forms, three menus, 24 menu items, and 63 search documents. Media, taxonomy, article, capability, and technology records are currently empty.

Primary evidence: `backend/apps/content/models.py`, `backend/apps/forms/models.py`, `backend/apps/pricing/models.py`, and `backend/apps/core/management/commands/seed_abrit.py`.

## Authentication / Authorization

- No custom user model is configured; Django's standard `auth.User` is used.
- Django Admin uses normal Django session authentication and built-in model permissions.
- Public API views explicitly disable authentication/permissions or use `AllowAny`.
- Private submission-file download uses `staff_member_required`.
- Custom admin restrictions prevent deleting content/settings/audit records and prevent manually adding submissions/revisions.
- No custom roles, object-level permissions, JWT, API keys, OAuth, lockout system, or agent authorization were found.
- The current database has two active staff superusers and no groups.

Evidence: `backend/config/settings/base.py`, `backend/apps/forms/api.py`, and the app admin modules.

## API Architecture

Django REST Framework with drf-spectacular/OpenAPI is used. Routes are centralized in `backend/config/urls.py`.

Implemented public API areas:

- Site settings and design tokens.
- Localized header/footer/mobile navigation.
- Published content collections and detail/root content.
- Package listing and server-side pricing calculation.
- Public form submission.
- Localized search.
- `/health/`, OpenAPI schema, and Swagger UI.

Responses generally use `{ "data": ... }`; DRF exceptions are wrapped as `{ "error": { status, code, detail } }` by `backend/config/api.py`.

Only active items with both `workflow_status=published` and `translation_status=reviewed` are exposed by content APIs. The frontend fetch client supports tagged five-minute caching, but is currently not used by public pages.

## Tests

There are 21 substantive backend tests:

- Core: singleton and design validation.
- Content: publishing constraints, revisions, revalidation, block schema validation, locale isolation, alternates, restoration, scheduling.
- Forms: file safety, staff-only downloads, retention purge, submission validation.
- Pricing: approved arithmetic and tier boundaries.
- Search: Persian/Arabic normalization and publish/unpublish indexing.

Files: `backend/apps/core/tests.py`, `backend/apps/content/tests.py`, `backend/apps/forms/tests.py`, `backend/apps/pricing/tests.py`, and `backend/apps/search/tests.py`.

`media/tests.py` and `navigation/tests.py` are placeholders. No frontend unit, component, or E2E tests were found.

Pytest could not be executed during discovery: the repository contains only a Windows virtualenv, and invoking its Python from the WSL environment failed before Python started. Therefore current pass/fail status is unverified.

## Existing CMS/Admin Capabilities

Django Admin is the only administration UI currently present. It provides:

- Singleton site and design settings with localized settings inline.
- Content item, translation, ordered block, and relation editing.
- Publish/unpublish bulk actions.
- Workflow, translation-status, scheduling, and SEO fields.
- Read-only revision listing.
- Media library and localized metadata.
- Menu/menu-item editing.
- Package, package feature, rate, and contract-term editing.
- Form/field definition and localized labels.
- Submission workflow status, notes, filtering, and staff-only file links.
- Read-only audit log and revalidation event monitoring.

Evidence: `backend/apps/core/admin.py`, `backend/apps/content/admin.py`, and other app `admin.py` files.

Revision restoration exists as a service function but is not exposed as an admin action/view. Auditing is targeted rather than generic: publish, unpublish, restore, and retention purge create audit records; ordinary model edits do not automatically do so.

## Existing AI/Agent Infrastructure

No operational MCP server, agent API, agent authentication, tool registry, prompt system, or background agent execution was found.

The only application-level agent provisions are `agent` and `mcp` values in `ContentRevision.Source`, allowing future changes to be attributed by source. See `backend/apps/content/models.py`.

The root Codex npm dependency and `.agents`/`.codex` directories are repository-development tooling, not demonstrated CMS agent infrastructure.

## WHMCS Integration

WHMCS integration is frontend-only URL construction:

- Product packages build `https://my.abrit.ir/cart.php` links with product ID, billing cycle, and configured option values.
- One managed-IT package has a product ID; the remaining managed packages intentionally return no checkout URL.
- A separate product configurator has IDs for five packages.
- No WHMCS API client, webhook handler, synchronization, authentication, order/customer model, or backend integration was found.

Evidence: `frontend/src/lib/product-packages.ts` and `frontend/src/lib/managed-it-packages.ts`.

## Important Existing Conventions

- Domain objects and localized translations are separate models.
- Missing locales return 404; no fallback content is substituted.
- Only published and reviewed translations are public.
- Content blocks use a controlled type/variant registry and JSON Schema validation.
- Publishing, unpublishing, and restoring are atomic service-layer operations.
- Publication updates search, creates a revision/audit record, and enqueues frontend revalidation.
- Revalidation uses an outbox plus cron-safe dispatcher and HMAC-signed Next endpoint.
- Money is stored and calculated as integer toman; discounts/onboarding use basis points.
- Public and private uploads have separate filesystem roots.
- Forms reject unknown fields, require consent where configured, hash IPs, use a honeypot and rate throttling, and have retention cleanup.
- Frontend localization controls `lang`, direction, fonts, metadata, and locale-prefixed URLs.
- Styling is primarily a large global CSS system plus component CSS Modules. CMS design settings are serializable, but current public routes do not bind them into the rendered CSS.
- There is no separate design-system package, Storybook, or generic component-library workspace.

## Existing Functionality Not to Rewrite Casually

- The polished homepage/reference runtime and its React integration.
- Three-language service and solution listings/details.
- Responsive header, mega menus, language switching, typography, RTL/LTR handling, and motion behavior.
- Product and managed-IT configurators with current WHMCS URL rules.
- Public lead forms and backend submission validation/retention.
- Content workflow, revision snapshots/restoration, audit events, search indexing, and signed revalidation.
- Pricing calculation rules and integer arithmetic.
- Seeded CMS data and locale/path contracts.

## Unknowns / Things You Could Not Verify

- Current backend test pass/fail status.
- Production deployment state, cron configuration, backups, and restore procedures.
- Whether current WHMCS IDs/options and package totals match the live WHMCS catalog.
- Whether the existing database is development, staging, or copied production data.
- When the public frontend is intended to switch from static content to the existing CMS API.
- Whether the existing dirty worktree changes are intentional beyond their apparent line-ending character.
- Real upload workflow for submission files, because the model/admin/storage exist but public API creation is not wired.
- Strong-admin authentication, lockout, custom roles, and agent permissions are not implemented.
- Knowledge/news schemas exist, but no current records or complete frontend detail implementation were verified.
- No PostgreSQL configuration or compatibility verification exists yet.

## Files Most Relevant For Phase 1

- `backend/config/settings/base.py`
- `backend/config/urls.py`
- `backend/apps/core/models.py`
- `backend/apps/content/models.py`
- `backend/apps/content/services.py`
- `backend/apps/content/admin.py`
- `backend/apps/content/block_schemas.py`
- `backend/apps/forms/models.py`
- `backend/apps/navigation/models.py`
- `backend/apps/pricing/models.py`
- `backend/apps/core/management/commands/seed_abrit.py`
- `frontend/src/app/[locale]/layout.tsx`
- `frontend/src/lib/api.ts`
- `frontend/src/lib/public-content.ts`
- `frontend/src/components/block-renderer.tsx`
- `frontend/src/components/reference-homepage.tsx`
