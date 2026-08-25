# AbrIT Architecture Risk Assessment

Read-only investigation completed. No packages, migrations, or application state were changed. The working tree was already dirty, mostly with line-ending-only changes across backend and frontend files; this should be normalized or isolated before parallel implementation begins.

## Current Architecture Boundaries

- The repository is a monorepo with two independently deployed applications:
  - Django 5.2 + DRF backend under `backend/`.
  - Next.js 16 / React 19 public frontend under `frontend/`.
  - Deployment configuration expects Django beneath `/cms` and Next.js at the public origin; see `.env.example` and `backend/passenger_wsgi.py`.
- Authentication currently ends at Django:
  - Standard `django.contrib.auth`, sessions, CSRF middleware, and Django Admin are enabled in `backend/config/settings/base.py`.
  - No custom user model, authentication backend, login API, token/JWT mechanism, MFA, lockout, or React authentication code exists.
  - `/admin/` uses Django's session-based staff authentication. All DRF public endpoints explicitly disable authentication and permissions, for example `backend/apps/content/api.py`.
  - The only non-Admin protected custom view is the submission download endpoint, guarded by `staff_member_required` in `backend/apps/forms/api.py`.
- Django app responsibilities are recognizable but not fully isolated:
  - `core`: shared UUID/timestamp bases, locales, site/design settings, audit records, revalidation queue.
  - `content`: content hierarchy, translations, workflow, blocks, taxonomies, relations, revisions.
  - `media`: public media metadata and translations.
  - `navigation`: menus linked directly to content and media.
  - `pricing`: packages, rates, terms, and calculation service.
  - `forms`: form definitions, submissions, private files, retention.
  - `search`: a derived index coupled directly to `ContentTranslation`.
- Coupling crosses app boundaries:
  - `navigation` embeds content publication rules in its API rather than consuming a shared publication service: `backend/apps/navigation/api.py`.
  - Content publishing imports search indexing lazily and writes audit/revalidation state in the same service transaction: `backend/apps/content/services.py`.
  - `core.SiteSettings` references `media.MediaAsset`, while media models inherit bases from `core`, making `core` less independent than its name suggests: `backend/apps/core/models.py`, `backend/apps/media/models.py`.
  - All URL registration is centralized in `backend/config/urls.py`; apps do not own separate URL modules.
- The React application is currently a public-site application, not an administration application:
  - No admin route group, authenticated state, permission state, or admin component system exists.
  - A typed CMS client already exists in `frontend/src/lib/api.ts`, but current public routes generally do not use it.
  - Layout, navigation, settings, services, solutions, pricing, and search mainly consume hard-coded data from `frontend/src/lib/public-content.ts`.
  - The homepage reads and injects a large repository HTML file rather than CMS content: `frontend/src/app/[locale]/page.tsx`, `frontend/src/components/reference-homepage.tsx`.
- Current API conventions are usable and consistent:
  - Public versioned namespace: `/api/v1`.
  - Success envelopes use `{ "data": ... }`, sometimes with `meta`.
  - DRF errors are wrapped as `{ "error": { status, code, detail } }` by `backend/config/api.py`.
  - OpenAPI and Swagger endpoints exist, backed by drf-spectacular.
  - Endpoints intentionally omit trailing slashes.
  - There are no administration CRUD APIs yet.
  - The frontend sends `X-AbrIT-Contract-Version: 2`, but no backend code reads or enforces that header.

## Existing Assets We Should Reuse

- Django's existing user, group, permission, session, password-validation, and Admin infrastructure. The deployed schema already has foreign keys from audit and revision records to `AUTH_USER_MODEL`; replacing the user model would be materially riskier than extending existing identity data.
- Existing Django Admin registrations as an operational fallback. It already supports content, translations, blocks, workflow actions, navigation, pricing, forms, submissions, private downloads, media, site settings, revisions, audit records, and revalidation events. Relevant registrations are under each app's `admin.py`, especially `backend/apps/content/admin.py` and `backend/apps/forms/admin.py`.
- Multilingual content primitives:
  - Three explicit locales: `fa`, `en`, `ar-ae`.
  - One translation per object/locale constraints.
  - Locale-relative public paths and publication-state filtering.
  - Translation workflow and translation-quality state are already distinct in `backend/apps/content/models.py`.
- Revision and rollback primitives:
  - `ContentRevision` contains versioned snapshots, actor attribution, and `admin`, `agent`, `mcp`, and `system` source types: `backend/apps/content/models.py`.
  - Atomic publish, unpublish, and restore services already exist in `backend/apps/content/services.py`.
- Audit and cache invalidation primitives:
  - Append-oriented `AuditLog` with actor, action, object identity, and before/after JSON: `backend/apps/core/models.py`.
  - Persistent `RevalidationEvent` queue and HMAC-signed delivery command.
  - Next.js verifies signatures using constant-time comparison and limits tags/paths: `frontend/src/app/api/revalidate/route.ts`.
- Machine-friendly contracts:
  - DRF serializers and OpenAPI generation.
  - JSON Schema validation for content blocks in `backend/apps/content/block_schemas.py`.
  - UUID identifiers and timestamps across domain models.
  - Revision source values already anticipate agents and MCP.
- Existing security-sensitive form assets should be retained:
  - Private filesystem storage.
  - Extension, MIME, signature, OOXML structure, archive-entry, and expanded-size validation.
  - Consent capture, IP hashing, retention timestamps, throttling, and scheduled purge behavior.
  - See `backend/apps/forms/validators.py` and `backend/apps/forms/serializers.py`.

## Phase 1 Integration Points

- Django auth tables are the immediate identity boundary for Users, Roles, and Permissions. Django Groups naturally correspond to roles, and Django model permissions already exist in the database.
- The clean backend namespace boundary is the existing `/api/v1` router. Phase 1 admin APIs do not exist and can be introduced without modifying public serializers, provided their authentication and namespace are explicitly separated.
- The existing `/admin/` namespace is already occupied by Django Admin and a private file-download route: `backend/config/urls.py`. Ownership of paths for the React Admin Shell must be settled before frontend and backend routing work proceeds.
- `AuditLog` is an integration target for authentication, user, role, and permission mutations, but it is not currently a comprehensive audit mechanism.
- Dashboard work has clear read-only data sources—users, submissions, content workflow, revalidation failures—but no dashboard aggregation API exists.
- The existing React application provides build/deployment infrastructure, localization conventions, fonts, and shared branding. It does not provide an admin shell architecture or authentication client.
- Django Admin can remain available while a React administration application is introduced. Its existing workflows are valuable for comparison and operational recovery.

## Phase 1 Risks

- **High: identity-model changes after initial migration.** Existing initial migrations and multiple foreign keys use `settings.AUTH_USER_MODEL`. Swapping to a custom user model now would affect auth, audit, revisions, and deployed data.
- **High: authentication transport is unresolved.** Current production topology separates Next.js and Django paths, session/CSRF middleware is enabled, but `CORS_ALLOW_CREDENTIALS` is explicitly false in `backend/config/settings/base.py`. React login and protected API work cannot safely proceed independently until same-origin versus cross-origin behavior is fixed as a contract.
- **High: existing permissions are only generic Django model permissions.** There are no workflow permissions, locale scopes, object permissions, "publish" capability, or dedicated audit/dashboard permissions. The inspected local database has:
  - 2 users, both staff and superusers.
  - 0 groups.
  - 0 group-permission or user-permission assignments.
  - Consequently, least-privilege behavior has not been exercised by current data.
- **High: audit coverage is incomplete.**
  - Custom audit records are created only for content publish/unpublish/restore and expired-submission purge.
  - Ordinary model edits, user changes, role changes, permission changes, form status changes, navigation edits, pricing changes, and site settings changes do not write `AuditLog`.
  - Content archive and submission status actions use `queryset.update()`, bypassing revision/audit/revalidation services: `backend/apps/content/admin.py`, `backend/apps/forms/admin.py`.
  - Django's separate `django_admin_log` exists, but it is not unified with `AuditLog`, cron, future API writes, or agent activity.
- **High: revision support is narrower than its model name suggests.**
  - Revisions cover `ContentTranslation` plus its blocks only.
  - Revisions are generated on publish, unpublish, and restore—not on every edit.
  - Restore exists as a Python service but has no public/admin API and no Django Admin restore action.
  - The inspected database contains 63 translations but zero content revisions and zero custom audit records, demonstrating that seeded/existing content has no revision lineage.
- **High: public content currently has two sources of truth.**
  - Django contains seeded multilingual content, navigation, packages, and search.
  - Next.js renders hard-coded equivalents.
  - Concrete drift already exists: seeded package user capacities are 5/10/15/25/40, while the frontend values are 4/7/10/20/30 in `frontend/src/lib/public-content.ts`.
  - CMS publishing and revalidation therefore do not currently guarantee visible public-site changes.
- **Medium/high: SQLite is configured for production-style persistence with `transaction_mode="IMMEDIATE"`.** This serializes writers and increases lock/contention risk when several Phase 1 backend streams add authenticated mutations, audit writes, and dashboard reads. See `backend/config/settings/base.py`.
- **Medium: revalidation coverage is incomplete.** Only content workflow services create events; edits to navigation, pricing, settings, media, and ordinary content fields do not. The public pages using hard-coded data do not consume the tagged CMS fetches anyway.
- **Medium: preview fidelity is not established.** The backend defines ten block types, while `frontend/src/components/block-renderer.tsx` renders only `hero`, `service_grid`, `pricing`, and `cta`. Current public routes also bypass that renderer.
- **Medium: locale definitions are duplicated** across Django settings, core models, form serializers, frontend types, static content, and route metadata. Locale changes could silently diverge.
- **Medium: the worktree has pre-existing modifications across 35 files**, including initial migrations and central routing. The inspected diffs appear predominantly LF/CRLF conversions, but this will create merge noise and obscure genuine Phase 1 changes.

## Security Boundaries

- Positive existing controls:
  - Production requires a secret key and allowed hosts.
  - HTTPS redirect, secure session/CSRF cookies, HSTS, content-type protection, referrer policy, and frame denial are configured in `backend/config/settings/production.py`.
  - Django CSRF and session authentication middleware are active.
  - Public content APIs return only published, reviewed, active content.
  - Revalidation uses a separate HMAC secret.
  - Private submission files are outside public media storage.
- Gaps relevant to Phase 1:
  - No login throttling, account lockout, MFA, security-event audit, session-management UI, or forced password-change mechanism exists.
  - `staff_member_required` allows any active staff user to download any submission file; it does not check `view_formsubmission` or a dedicated sensitive-file permission.
  - Current local user state is entirely superuser-based, so accidental privilege expansion is a realistic migration risk.
  - Public DRF endpoints deliberately use no authentication. Admin APIs must not inherit those empty authentication/permission declarations.
  - `AuditLog.actor` is nullable and `actor_type` is an unconstrained string. Marking a write as `agent` or `mcp` is provenance labeling, not authentication or authorization.
  - Public media privacy depends partly on URL exposure and web-server configuration. `is_public=False` prevents serializer URLs but does not itself enforce storage-level access control.
  - The homepage injects raw local HTML with `dangerouslySetInnerHTML`: `frontend/src/components/reference-homepage.tsx`. It is currently repository-controlled, but it must not become a direct CMS/agent-input path without a trusted-content boundary.
  - The block schema permits `rich_text.html` and string URLs; it validates structure and length, not sanitization or URL schemes. This becomes important for preview and agent-authored content.
  - The local database and containing directories are mode `0777`. The database is gitignored, so this is an environment/deployment-permissions concern rather than a tracked-secret leak.
  - Revalidation signatures expire after five minutes but have no nonce/replay ledger. Replays are mostly limited to cache invalidation, but the endpoint is not strictly single-use.

## Potential Task Dependencies

1. Identity model decision must precede user-schema migrations and user API work.
2. Deployment origin and authentication transport must precede login UI, session handling, CSRF handling, and authenticated API clients.
3. Role vocabulary and permission matrix must precede role-management APIs, permission-aware navigation, dashboard visibility, protected actions, and agent/service-account scoping.
4. Admin URL ownership must precede React shell routing and Django route changes because `/admin/` already belongs to Django Admin.
5. Audit event vocabulary and the authoritative mutation/service boundary must precede instrumenting users, roles, permissions, and authentication events. Otherwise each implementation stream will emit incompatible or incomplete events.
6. Migration baseline and line-ending cleanup must precede multiple concurrent backend branches, particularly changes touching auth, `core`, or central URLs.
7. Dashboard response contracts must precede independently implemented dashboard widgets and aggregate endpoints.
8. Preview/rollback UI depends on resolving the current public content source of truth and renderer coverage; it should not be inferred from the existence of `ContentRevision` alone.

## Areas Safe To Parallelize

After the authentication and permission contracts are fixed:

- React Admin Shell visual structure, accessibility, RTL/LTR behavior, and responsive layout can proceed against mocked identity/navigation contracts.
- Read-only dashboard widget UI can proceed in parallel with dashboard aggregation APIs if field-level contracts are frozen.
- Audit viewer UI can proceed in parallel with audit query APIs once the audit event schema and redaction rules are fixed.
- Authentication security testing, permission-matrix tests, and frontend route-guard tests can be separate workstreams with clear ownership.
- Documentation of existing Django model permissions and proposed role mappings can proceed independently of UI work.
- Public-site maintenance can remain isolated from Phase 1, provided shared files such as `frontend/package.json`, global styles, and top-level routing are not edited concurrently.

## Areas That Should NOT Be Parallelized Yet

- Authentication, Users, Roles, and Permissions schema/API implementation. These share the same identity model, authorization semantics, migrations, and security boundary.
- Competing changes to `core` migrations, auth migrations, or `backend/config/urls.py`.
- Login/session API and React authentication client until origin, cookie, CORS, and CSRF behavior is agreed.
- Audit instrumentation by individual feature teams before a single mutation/audit contract exists.
- Django `/admin/` routing and React Admin Shell routing until namespace ownership is decided.
- Content editing, preview, rollback UI, and public-site CMS migration. They currently span two content sources, incomplete renderer support, revalidation, and revision semantics.
- User-model replacement alongside other Phase 1 development. It is a repository-wide migration concern, not an isolated user-management task.

## Evidence

Primary evidence reviewed:

- Application and security settings: `backend/config/settings/base.py`, `backend/config/settings/production.py`
- URL/API boundary: `backend/config/urls.py`, `backend/config/api.py`
- Core/audit/revalidation models: `backend/apps/core/models.py`
- Content workflow/revisions: `backend/apps/content/models.py`, `backend/apps/content/services.py`
- Existing Admin behavior: `backend/apps/content/admin.py`, `backend/apps/core/admin.py`, `backend/apps/forms/admin.py`
- Public API access rules: `backend/apps/content/api.py`, `backend/apps/forms/api.py`
- Frontend CMS client versus actual route sources: `frontend/src/lib/api.ts`, `frontend/src/app/[locale]/layout.tsx`, `frontend/src/app/[locale]/services/page.tsx`
- Legacy homepage boundary: `frontend/src/lib/reference-homepage.ts`, `frontend/src/components/reference-homepage.tsx`
- Revalidation integration: `backend/apps/core/management/commands/dispatch_revalidation.py`, `frontend/src/app/api/revalidate/route.ts`
- Migration history and current data were inspected directly from `backend/data/abrit.sqlite3` using SQLite read-only mode. The database is gitignored and was not modified.
