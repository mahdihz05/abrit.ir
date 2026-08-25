# AbrIT Phase 1 Engineering Plan — Version 2

Status: planning only. This document does not authorize implementation, dependency installation, migrations, branches, worktrees, or deployment.

This revision incorporates `docs/agent-reports/phase-1-plan-review.md` and rechecks its important claims against repository code. It replaces the execution design in `phase-1-plan.md` but does not modify that earlier record.

## 0. Authoritative Phase 1 Charter

### Product boundary

Phase 1 delivers only:

- Authentication and account lockout
- Users
- Fixed roles and visible permission definitions
- React Admin shell
- Dashboard
- Read-only audit viewer
- Focused audit coverage for authentication and identity operations
- Hardening of private submission-file authorization
- Editor/Publisher enforcement in the existing Django Admin content workflow

Phase 1 does not deliver a React content editor or React publishing UI. Existing content editing and publication remain in Django Admin.

React Admin is formally treated as a **supplement** to Django Admin in Phase 1:

- React Admin owns `/admin` and provides login, dashboard, users, role/permission reference, and audit screens.
- Django Admin remains the operational content/form/media fallback.
- React Admin does not replace Django Admin in Phase 1.
- A later phase may migrate further CMS workflows only after explicit approval.

This limited hybrid is intentional: React provides the future-facing shell without rewriting working content workflows.

### Phase 1 role-management boundary

Roles are fixed, reserved Django Groups in Phase 1. React displays their permission matrices but does not create, rename, mutate, or delete roles. Only superusers may create or modify ordinary users and assign one fixed role through the React API.

This removes the previous capability-ceiling contradiction and prevents a User Manager from needing permissions that would make that user a Publisher.

Direct user permissions are forbidden by Phase 1 services and removed from the customized Django User Admin form. Superuser remains a break-glass state, not a Group.

### Account lockout boundary

Persistent account lockout is included rather than deferred:

- Five consecutive failed password attempts lock an existing account for 15 minutes.
- A successful login resets the account counter.
- Unknown usernames are throttled by a non-identifying cache key so account existence is not disclosed.
- A superuser-only management command and Django Admin control can unlock an account.
- Lock, unlock, success, and failure events are audited without credentials.

These values are configuration defaults and must be covered by tests.

### Explicit non-goals

- AI Visual Editor, agents, MCP, API keys, service accounts
- Page builder, plugin system, translation/SEO agents
- WHMCS synchronization
- React content CRUD or publication
- Object-level or locale-scoped permissions
- Arbitrary role CRUD or direct user permissions
- MFA, OAuth, SSO, invitations, and email password reset
- General CMS edit auditing, event bus, SIEM export
- Public-site CMS migration or public frontend rewrite

## 1. Verified Current State

### Verified repository facts

- Django 5.2/DRF lives under `backend/`; Next.js 16/React 19 lives under `frontend/`.
- `backend/config/settings/base.py` uses standard Django authentication and does not configure `AUTH_USER_MODEL`.
- `backend/apps/core/models.py` and `backend/apps/content/models.py` already point actor foreign keys at `settings.AUTH_USER_MODEL`.
- Sessions, CSRF middleware, authentication middleware, password validators, and Django Admin are active.
- Public API views explicitly remain anonymous through per-view `authentication_classes = []` / `permission_classes = []` or `AllowAny`.
- No global DRF authentication or permission default currently converts those public endpoints into protected endpoints.
- `backend/config/urls.py` owns all current routes and mounts Django Admin at internal `/admin/`.
- `.env.example`, `scripts/package-frontend.ps1`, and `DJANGO_SCRIPT_NAME` support same-origin Django below `/cms`.
- `docs/IMPLEMENTATION_PLAN.md` instead says Django is served from `cms.abrit.ir`. This is a real documentation conflict.
- `CORS_ALLOW_CREDENTIALS` is currently false.
- `backend/config/settings/production.py` enables secure cookies and HTTPS redirect but does not explicitly configure trusted proxy HTTPS detection.
- `AuditLog` is a useful existing primitive but audit calls are ad hoc and coverage is narrow.
- Publish/unpublish/restore services already provide atomic content revision, search, audit, and revalidation behavior in `backend/apps/content/services.py`.
- Django Admin publish/unpublish actions currently do not check a custom publish permission.
- Private submission downloads use `staff_member_required`, not `forms.view_submissionfile`.
- Existing public frontend routes use static content and must remain untouched by Phase 1.
- There are 22 current `test_*` functions, not 21.
- The current database contains two staff superusers and no groups, role assignments, direct user permissions, custom audit records, or content revisions.
- The worktree contains tracked line-ending modifications, including initial migrations and central files, plus untracked planning reports.
- The current WSL Python cannot run the backend because Django is absent; the repository Windows virtualenv is not a supported WSL interpreter.

### Recommendation adopted by this plan

For Phase 1, same-origin `/cms` routing is the proposed authoritative topology because it matches executable configuration and packaging scripts. `docs/IMPLEMENTATION_PLAN.md` must be reconciled after owner approval; implementation must not silently assume that the older `cms.abrit.ir` statement is obsolete.

### Remaining readiness gates

The following are Wave 0 gates, not questions for feature agents:

1. Repository owner approves same-origin `/cms` as the Phase 1 topology.
2. Repository owner approves React Admin as a supplement to Django Admin with only the screens in this charter.
3. Repository owner accepts fixed reserved roles and superuser-only user/role assignment.
4. Existing dirty/line-ending changes are committed, reverted by their owner, or otherwise isolated.
5. A supported Python environment is created and the existing baseline is recorded.

No feature worktree may be created until all five gates have evidence.

## 2. Frozen Deployment and Authentication Contract

### Production topology

| Surface | External URL | Application/internal path |
|---|---|---|
| Public site | `https://abrit.ir/*` | Next.js `/*` |
| React Admin | `https://abrit.ir/admin/*` | Next.js `/admin/*` |
| Django API | `https://abrit.ir/cms/api/v1/*` | Django `/api/v1/*` with `FORCE_SCRIPT_NAME=/cms` |
| Protected Admin API | `https://abrit.ir/cms/api/v1/admin/*` | Django `/api/v1/admin/*` |
| Legacy Django Admin | `https://abrit.ir/cms/admin/*` | Django `/admin/*` |
| Health/schema/docs | `https://abrit.ir/cms/health/`, `/cms/api/schema/`, `/cms/api/docs/` | Existing Django paths |

The reverse proxy must strip `/cms` before passing the request to Django or otherwise follow the existing `FORCE_SCRIPT_NAME` deployment contract. It must set `Host` and `X-Forwarded-Proto=https`. Django must trust `X-Forwarded-Proto` only when the deployment is behind the approved proxy; this is controlled by an explicit environment setting rather than unconditionally trusting arbitrary clients.

### Local-development topology

| Surface | URL |
|---|---|
| Next public/Admin | `http://127.0.0.1:3000` |
| Django | `http://127.0.0.1:8000` |
| Protected Admin API | `http://127.0.0.1:8000/api/v1/admin/*` |

Development requirements:

- `CORS_ALLOW_CREDENTIALS=True`.
- Exact development origins, not wildcards, are listed in `CORS_ALLOWED_ORIGINS` and `CSRF_TRUSTED_ORIGINS`.
- Browser requests use `credentials: "include"`.
- Production does not require CORS for the same-origin route.

### Cookie contract

| Cookie | Name | Path | Domain | Secure | HttpOnly | SameSite |
|---|---|---|---|---|---|---|
| Session | `abrit_session` | `/` | unset/host-only | true in production | true | `Lax` |
| CSRF | `abrit_csrf` | `/` | unset/host-only | true in production | false | `Lax` |

The session cookie is never read by JavaScript. The CSRF token is returned by the bootstrap endpoint and may also be read from the CSRF cookie. Login and logout are explicitly protected with Django CSRF protection; DRF's authenticated-session-only CSRF behavior is not sufficient for anonymous login.

### Authentication semantics

- A valid session requires an active user who is a superuser or has `accounts.access_admin`.
- Existing account lock is checked before password authentication succeeds.
- Login failure uses one generic client message.
- Authentication events are focused, not claimed to be transactionally identical to domain mutations. The API returns login success only after the audit write succeeds; session persistence still completes through Django's session middleware.
- Identity/role mutations and their audit rows are in the same database transaction.
- Session expiry returns `401 session_expired`.
- An authenticated user lacking an operation permission receives `403 permission_denied`.
- CSRF failure returns JSON `403 csrf_failed` for Admin API requests.

## 3. Complete Permission and Reserved-Role Matrix

### Permission ownership

| Permission | Owning content type | Source |
|---|---|---|
| `accounts.access_admin` | `accounts.AdminCapability` (managed-false capability model) | custom |
| `accounts.view_dashboard` | `accounts.AdminCapability` | custom |
| `accounts.view_role_catalog` | `accounts.AdminCapability` | custom |
| `content.publish_contenttranslation` | `content.ContentTranslation` | custom Meta permission |
| `core.view_auditlog` | `core.AuditLog` | Django default |
| `forms.view_submissionfile` | `forms.SubmissionFile` | Django default |

`AdminCapability` exists only to own model-less permissions and creates no application table.

### Fixed roles

All fixed role Groups are reserved, cannot be renamed/edited/deleted through React or Django Admin, and are reconciled to the declared matrix whenever `sync_phase1_roles` runs.

#### Editor

- `accounts.access_admin`
- `accounts.view_dashboard`
- `accounts.view_role_catalog`
- `content.view_contentitem`, `content.add_contentitem`, `content.change_contentitem`
- `content.view_contenttranslation`, `content.add_contenttranslation`, `content.change_contenttranslation`
- `content.view_contentblock`, `content.add_contentblock`, `content.change_contentblock`, `content.delete_contentblock`
- `content.view_contentrelation`, `content.add_contentrelation`, `content.change_contentrelation`, `content.delete_contentrelation`
- `media.view_mediaasset`, `media.add_mediaasset`, `media.change_mediaasset`
- `media.view_mediaassettranslation`, `media.add_mediaassettranslation`, `media.change_mediaassettranslation`

Editor does not receive `content.publish_contenttranslation` and cannot publish or unpublish through Django Admin actions.

#### Publisher

- Every Editor permission
- `content.publish_contenttranslation`

Publisher uses the existing Django Admin and existing content workflow services for publish/unpublish. Assignment automatically sets `is_staff=True`.

#### Submission Reviewer

- `accounts.access_admin`
- `accounts.view_dashboard`
- `accounts.view_role_catalog`
- `forms.view_formsubmission`
- `forms.change_formsubmission`
- `forms.view_submissionfile`

Assignment automatically sets `is_staff=True` for existing form workflows.

#### Auditor

- `accounts.access_admin`
- `accounts.view_dashboard`
- `accounts.view_role_catalog`
- `core.view_auditlog`

Auditor does not require `is_staff`; it uses React Admin only.

#### Administrator

- Represented by active `is_superuser=True`.
- Not a Group and not assignable as a Phase 1 role.
- Only superusers may create users, change identity fields, set passwords, activate/deactivate users, or assign fixed roles through React Admin.
- React APIs cannot create, promote, demote, deactivate, or change the role/password of a superuser.

### Role lifecycle rules

- A non-superuser has exactly one Phase 1 fixed role.
- Direct `user_permissions` are forbidden through supported interfaces.
- Fixed Groups are immutable and non-deletable.
- The role provisioner replaces each fixed Group's permissions with the declared exact set.
- Role assignment synchronizes `is_staff`: Editor, Publisher, and Submission Reviewer set it true; Auditor sets it false. Superusers are unaffected.
- A user cannot deactivate themselves or change their own fixed role.
- The final active superuser cannot be deactivated or demoted through any Phase 1 surface; Phase 1 APIs never expose demotion.
- Existing staff/superusers are preserved during migration and are never automatically assigned a role.

### Dashboard visibility

`accounts.view_dashboard` grants the complete small dashboard response. Phase 1 does not implement per-widget omission. Every role has this permission and consciously receives the four aggregate areas defined below.

## 4. Frozen Admin API Contracts

The internal prefix is `/api/v1/admin`; production externally adds `/cms`.

### Common envelopes

Single result:

```json
{"data": {}}
```

Paginated result:

```json
{
  "data": [],
  "meta": {"page": 1, "page_size": 20, "total": 0, "total_pages": 0}
}
```

Error:

```json
{
  "error": {
    "status": 400,
    "code": "validation_error",
    "detail": "Request validation failed.",
    "fields": {"username": ["This field is required."]}
  }
}
```

`fields` is omitted for non-field errors. Stable codes include:

- `validation_error` (400)
- `authentication_failed`, `not_authenticated`, `session_expired` (401)
- `csrf_failed`, `admin_access_denied`, `permission_denied`, `account_locked` (403)
- `not_found` (404)
- `conflict`, `self_lockout`, `reserved_role`, `superuser_protected` (409)
- `login_throttled` (429)
- `server_error` (500)

### Session object

```json
{
  "id": 1,
  "username": "editor",
  "email": "editor@example.com",
  "first_name": "",
  "last_name": "",
  "is_superuser": false,
  "role": {"key": "editor", "name": "Editor"},
  "permissions": ["accounts.access_admin", "content.change_contenttranslation"]
}
```

Permission identifiers are sorted fully-qualified `app_label.codename` strings.

### Authentication endpoints

| Method/path | Auth | Request | Success |
|---|---|---|---|
| `GET /auth/csrf` | anonymous | none | `200 {data:{csrf_token:string}}`, sets CSRF cookie |
| `POST /auth/login` | anonymous + CSRF | `{username:string,password:string}` | `200 {data:{user:SessionUser}}` |
| `GET /auth/session` | session | none | `200 {data:{user:SessionUser}}` |
| `POST /auth/logout` | session + CSRF | `{}` | `200 {data:null}` |

Login returns generic `authentication_failed` for unknown username or bad password, `account_locked` for a locked account, `admin_access_denied` for a valid user lacking Admin admission, and `login_throttled` when the unknown-user/IP throttle is exceeded.

### User endpoints

All user mutations require `is_superuser=True`.

| Method/path | Request/query | Success/semantics |
|---|---|---|
| `GET /users` | `page`, `page_size` (1–100), `search`, `status=active|inactive`, `role`, `ordering=username|-username|date_joined|-date_joined` | paginated UserSummary |
| `POST /users` | create request below | `201 UserDetail` |
| `GET /users/{id}` | none | `200 UserDetail` |
| `PATCH /users/{id}` | patch request below | `200 UserDetail`; omitted fields unchanged; explicit null rejected unless stated |
| `POST /users/{id}/password` | `{password:string}` | `200 {data:{changed:true}}` |
| `POST /users/{id}/activate` | `{}` | `200 UserDetail` |
| `POST /users/{id}/deactivate` | `{}` | `200 UserDetail` |

Create request:

```json
{
  "username": "editor",
  "email": "editor@example.com",
  "first_name": "",
  "last_name": "",
  "password": "write-only",
  "role": "editor",
  "is_active": true
}
```

Patch permits only `username`, `email`, `first_name`, `last_name`, and `role`. Password and active state use dedicated actions. `email`, `first_name`, and `last_name` may be empty strings. The API never accepts or returns `is_staff`, direct permissions, password hash, lockout counters, or writable `is_superuser`.

User summary/detail includes `id`, identity fields, `is_active`, read-only `is_superuser`, fixed role or null, `is_locked`, `locked_until`, `last_login`, `date_joined`, and `updated_at` if a profile timestamp is introduced. There is no DELETE endpoint.

### Role and permission catalog endpoints

Both require `accounts.view_role_catalog`.

| Method/path | Success |
|---|---|
| `GET /roles` | `{data:[RoleDefinition...]}`; not paginated because the list is fixed |
| `GET /roles/{key}` | `{data:RoleDefinition}` |
| `GET /permissions` | `{data:[PermissionDefinition...]}` sorted by category/key |

RoleDefinition fields: `key`, `name`, `description`, `reserved=true`, `requires_django_staff`, and `permissions`.

PermissionDefinition fields: `key`, `label`, `category`, and `source=custom|django`.

No POST/PATCH/DELETE role or permission routes exist in Phase 1.

### Dashboard endpoint

`GET /dashboard` requires `accounts.view_dashboard` and returns:

```json
{
  "data": {
    "generated_at": "2026-08-25T00:00:00Z",
    "users": {"total": 0, "active": 0, "locked": 0},
    "content": {"draft": 0, "review": 0, "scheduled": 0, "published": 0, "archived": 0},
    "submissions": {"new": 0},
    "revalidation": {"pending": 0, "failed": 0}
  }
}
```

All dashboard holders receive the complete fixed aggregate. The endpoint performs no writes and does not audit reads.

### Audit endpoints

Require `core.view_auditlog`.

| Method/path | Request/query | Success |
|---|---|---|
| `GET /audit` | `page`, `page_size`, `actor_id`, `actor_type`, `action`, `object_type`, `object_id`, `from`, `to`, `ordering=timestamp|-timestamp` | paginated AuditSummary |
| `GET /audit/{uuid}` | none | AuditDetail |

AuditSummary includes `id`, `timestamp`, `actor` (`id`, `username`, or null), `actor_type`, `action`, `object_type`, and `object_id`. AuditDetail additionally includes redacted `before`, `after`, and `metadata` JSON. No mutation routes exist.

### Private submission file

The existing named route may remain under Django Admin for compatibility, but authorization changes to authenticated session plus `forms.view_submissionfile`.

- Anonymous browser request preserves the existing Django Admin login redirect behavior for the legacy route.
- Authenticated user without permission receives 403.
- Authorized user receives the existing attachment response.
- A future JSON Admin API download route is not required in Phase 1.

### OpenAPI ownership

- Each backend feature task annotates and locally validates its endpoints.
- One integration task owns final generation of `backend/schema.yml`.
- Frontend tasks consume frozen checked-in contract fixtures/types and must not invent fields.

## 5. Deterministic Migration and Provisioning Strategy

- Existing initial migrations must never be edited.
- T03 owns the next core audit migration.
- T04 owns `accounts/0001`, the next content migration for publish permission, and only the required forms migration if an explicit custom permission is added. The preferred private-file permission is existing `forms.view_submissionfile`, requiring no forms model change.
- T06 owns a later accounts migration for persistent lockout state if the selected lockout model requires one.
- `accounts` is ordered after `core`, `content`, `forms`, and `media` in `INSTALLED_APPS`.
- Role declarations live in one code module used by both a `post_migrate` receiver and `sync_phase1_roles` management command.
- The receiver attempts provisioning only after all required permission rows exist; otherwise it does nothing and the final accounts `post_migrate` event or explicit command completes provisioning.
- Provisioning is idempotent and replaces the exact permission set of reserved Groups.
- Clean-database, existing-database upgrade, missing-permission, and repeated-provisioning tests are mandatory.
- All migration/E2E verification uses a unique database below a disposable directory, never `backend/data/abrit.sqlite3`.
- Test media/private-media/cache paths also point below the disposable directory.

The supported verification wrapper must reject an unset disposable directory and reject paths outside `/tmp` or the CI runner's declared temporary root.

## 6. Architecture Decisions Required Before Implementation

### AD2-01 — Same-origin `/cms` is the proposed Phase 1 topology

- **Reason:** It matches `.env.example`, packaging scripts, and `FORCE_SCRIPT_NAME` code.
- **Integration:** Existing Django deployment and Next public origin.
- **Alternative:** `cms.abrit.ir` cross-origin deployment from `docs/IMPLEMENTATION_PLAN.md`.
- **Trade-off:** Requires owner approval and documentation reconciliation before T06; substantially simplifies secure browser sessions.

### AD2-02 — React Admin supplements Django Admin

- **Reason:** Admin Shell is a Phase 1 goal, while content workflows already work in Django Admin.
- **Integration:** New Next `/admin`; existing Django `/admin` externally `/cms/admin`.
- **Alternative:** Django Admin only, or complete React CMS duplication.
- **Trade-off:** Two surfaces remain, but their responsibilities are explicit.

### AD2-03 — Standard User, fixed Groups, no direct permissions

- **Reason:** Reuses Django and removes arbitrary-role escalation complexity.
- **Integration:** Auth tables and built-in permission resolution.
- **Alternative:** Custom user, mutable role CRUD, or direct grants.
- **Trade-off:** Phase 1 roles are less flexible but much easier to secure and audit.

### AD2-04 — Existing Django Admin is the content permission surface

- **Reason:** Phase 1 has no React content editor; the existing actions already call correct workflow services.
- **Integration:** `ContentTranslationAdmin.publish_selected` and `unpublish_selected`.
- **Alternative:** Add protected content APIs or remove Editor/Publisher roles.
- **Trade-off:** Editor/Publisher users require synchronized `is_staff`, and Admin actions must explicitly enforce publish permission.

### AD2-05 — Persistent lockout plus unknown-user throttle

- **Reason:** Satisfies the existing security checklist without a dependency.
- **Integration:** Standard authenticate/login flow and Django cache.
- **Alternative:** Rate limit only or third-party package.
- **Trade-off:** Adds a small account-security model and recovery path.

### AD2-06 — Focused centralized audit service

- **Reason:** Identity mutations require atomic audit and secret redaction.
- **Integration:** Existing AuditLog and existing content/retention events.
- **Alternative:** Signals, Django Admin log only, or general event framework.
- **Trade-off:** Ordinary CMS edits outside existing workflow events remain outside Phase 1 audit coverage.

### AD2-07 — API contract before frontend features

- **Reason:** Independent frontend tasks need exact fields, envelopes, errors, and permissions.
- **Integration:** DRF serializers/drf-spectacular and checked-in frontend types/fixtures.
- **Alternative:** Prose-only parallel implementation.
- **Trade-off:** Adds an early contract-freeze task but avoids incompatible branches.

### AD2-08 — Frontend tests before frontend features

- **Reason:** Feature tasks must be independently verifiable.
- **Integration:** Existing npm scripts and Next application.
- **Alternative:** Introduce tests during final E2E.
- **Trade-off:** Adds a foundation task and test dependencies before UI work.

## 7. Dependency Graph

```text
R00 Baseline/readiness ── R01 Contract & test foundation ────────┐
                                                                │
R02 Audit foundation ───────────────┐                            │
R03 Authorization/roles/Admin ──────┼── R05 Authentication API ──┼── R11 Frontend auth
R04 React Admin shell ──────────────┘                            │          │
                                                                │          ├── R14 Users UI
R05 Authentication API ──┬── R06 Role catalog API ── R07 Users API ────────┤
                         ├── R08 Audit API ──────────────────────────────────┤
                         ├── R09 Dashboard API ──────────────────────────────┼── R16 Dashboard UI
                         └── R10 Private-file hardening                      └── R17 Audit UI

R06 + R11 ──────────────────────────────────────────────────────── R15 Roles/permissions UI

R05–R10 ── R12 Backend security regression
R12 + R14–R17 ── R18 Final E2E/integration
```

R13 is the URL/schema integration task after R06–R10. It owns protected URL aggregation and the final pre-frontend OpenAPI snapshot. R14–R17 depend on R13's frozen schema/types.

## 8. Execution Waves and Parallel Safety

### Wave 0 — readiness gates

- R00 Repository baseline and supported verification environment
- Owner approval of the charter/topology/fixed-role decisions

No worktrees before R00 completes.

### Wave 1 — test, contract, and independent foundations

- R01 API/test foundation starts first.
- R02 Audit foundation and R03 authorization/role provisioning may start from the clean R00 commit while R01 runs because they do not consume frontend contracts or test packages.
- R04 React Admin shell starts only after R01 is integrated.

R01 owns package/lockfile and shared contract/test files. R02 owns the core migration. R03 owns accounts/content migrations and Django Admin authorization. R04 owns Admin shell components but not package files. R02 and R03 are mutually safe from the R00 commit; R04 must branch from the R01 result.

### Wave 2 — authentication boundary

- R05 Authentication and lockout API only

R05 integrates and passes reverse-proxy, CSRF, cookie, lockout, and audit checks before any protected backend API or frontend authentication work starts.

### Wave 3 — protected backend and frontend authentication

- R06 Role/permission catalog API
- R08 Audit query API
- R09 Dashboard API
- R10 Private-file hardening
- R11 Frontend authentication

R06/R08/R09 use feature-specific URL modules and do not edit a shared aggregator. R10 stays in forms. R11 stays in frontend auth. R07 is deliberately not parallel: it begins only after R06 is integrated so user role assignment consumes the finalized fixed-role service/contract.

Then:

- R07 User management API
- R12 Backend security regression
- R13 Protected URL, contract type, and OpenAPI integration

### Wave 4 — frontend features

- R14 Users UI
- R15 Roles/permissions UI
- R16 Dashboard UI
- R17 Audit UI

They branch from the commit containing R11 and R13. They use separate feature directories, may not edit Admin navigation directly, and run tests from R01.

### Wave 5 — final integration

- R18 E2E, production-like routing, disposable-database migration, viewport, and public regression verification

## 9. Exclusive Shared-File Ownership

| Shared surface | Exclusive owner |
|---|---|
| Dirty baseline/line endings | R00 |
| `frontend/package.json`, lockfile, unit/E2E config | R01 |
| Shared frontend contract types and mock fixtures | R01 initially, R13 final synchronization |
| `backend/apps/core/models.py` and next core migration | R02 |
| `backend/apps/content/models.py`, next content migration, content Admin permission checks | R03 |
| `backend/config/settings/base.py` installed-app/permission foundation | R03; later auth settings applied by R05 after rebase |
| Authentication URLs and CSRF failure configuration | R05 |
| User service/API files | R07 |
| Feature-specific backend URL modules | R06/R08/R09 |
| Protected Admin URL aggregation in `config/urls.py` | R13 |
| Admin shell layout/navigation registry | R04 initially; R13 provides frozen entries/extension interface; R18 integrates only |
| `backend/schema.yml` | R13 pre-frontend and R18 final generation only |

No task may regenerate another owner's migration, lockfile, URL aggregator, navigation registry, or schema.

## 10. Worktree Plan

Every worktree branches from a commit containing all listed dependencies, not from the original baseline.

| Task | Branch | Worktree | Agent |
|---|---|---|---|
| R00 | `chore/phase1-baseline-readiness` | `../abrit-p1-baseline` | Release/readiness agent |
| R01 | `test/phase1-contract-foundation` | `../abrit-p1-contract-tests` | Contract/test-infrastructure agent |
| R02 | `feat/phase1-audit-foundation-v2` | `../abrit-p1-audit-v2` | Backend audit/security agent |
| R03 | `feat/phase1-fixed-authorization` | `../abrit-p1-fixed-authz` | Django authorization agent |
| R04 | `feat/phase1-admin-shell-v2` | `../abrit-p1-shell-v2` | Frontend accessibility agent |
| R05 | `feat/phase1-session-lockout` | `../abrit-p1-session-lockout` | Authentication security agent |
| R06 | `feat/phase1-role-catalog-api` | `../abrit-p1-role-catalog` | Backend API agent |
| R07 | `feat/phase1-user-management-api` | `../abrit-p1-users-api-v2` | Backend identity agent |
| R08 | `feat/phase1-audit-query-api` | `../abrit-p1-audit-query` | Backend read-API agent |
| R09 | `feat/phase1-dashboard-api-v2` | `../abrit-p1-dashboard-api-v2` | Backend aggregation agent |
| R10 | `fix/phase1-file-authorization` | `../abrit-p1-file-authz` | Backend security agent |
| R11 | `feat/phase1-frontend-session` | `../abrit-p1-frontend-session` | Frontend authentication agent |
| R12 | `test/phase1-security-matrix` | `../abrit-p1-security-tests` | Independent backend test agent |
| R13 | `chore/phase1-contract-integration` | `../abrit-p1-contract-integration` | API integration agent |
| R14 | `feat/phase1-users-screen` | `../abrit-p1-users-screen` | Frontend users agent |
| R15 | `feat/phase1-role-reference-screen` | `../abrit-p1-role-screen` | Frontend roles agent |
| R16 | `feat/phase1-dashboard-screen` | `../abrit-p1-dashboard-screen` | Frontend dashboard agent |
| R17 | `feat/phase1-audit-screen` | `../abrit-p1-audit-screen` | Frontend audit agent |
| R18 | `test/phase1-final-e2e-v2` | `../abrit-p1-final-e2e` | Integration/E2E agent |

## 11. Integration Strategy

### Merge order

1. R00 and record the clean baseline commit/check results.
2. R01, R02, R03, R04 after independent review; resolve shared settings only through the designated owner.
3. R05 alone; security-review and validate the full authentication boundary.
4. R06, R08, R09, R10, and R11 after R05.
5. R07 after R06.
6. R12 after R06–R10.
7. R13 after protected APIs stabilize.
8. R14–R17 after R11 and R13.
9. R18 last.

### Review gates before backend merge

- No existing initial migration changed.
- Clean and upgrade migration tests pass using disposable databases.
- Every method has an explicit auth/permission test.
- Identity mutation and audit commit/rollback together.
- Credentials, cookies, CSRF, password hashes, and lockout lookup material are absent from audit/API output.
- Superusers and self-management rules cannot be bypassed.
- Existing public views retain their explicit anonymous declarations.
- Django Admin publish/unpublish rejects Editor and permits Publisher.

### Review gates before frontend merge

- Contract types match R13; no inferred fields.
- Unit/component tests run in the feature worktree.
- Loading, empty, 400, 401, 403, 409, 429, and server-error states are handled where relevant.
- Keyboard, focus, accessible names, RTL, and responsive behavior are tested.
- No public layout, homepage, static content source, configurator, or public API client behavior is changed.

## 12. Independent Review Strategy

Mandatory independent reviews:

- R00: confirm user-owned changes were preserved and baseline evidence is truthful.
- R02: nested redaction, mutation/audit rollback, preservation of existing content/retention events.
- R03: exact role matrix, clean/upgrade/repeat provisioning, fixed-role immutability, Django Admin publish bypass tests.
- R05: CSRF, cookie flags/path, proxy HTTPS detection, lockout/throttle, session rotation, login audit semantics.
- R07: superuser protection, role/staff synchronization, self-lockout, password handling.
- R10: redirect/403 compatibility and explicit `forms.view_submissionfile` enforcement.
- R11: no browser token storage, 401/403 behavior, keyboard-accessible login.
- R12: reviewer-authored negative cases rather than restating feature tests.
- R18: clean disposable environment and rendered journeys.

Reviewers must execute commands and attach evidence for every acceptance criterion; style comments alone do not constitute approval.

## 13. Safe Verification Environment

R00 creates or documents one supported POSIX Python environment, recommended at `.runtime/phase1-venv`, from `requirements.txt`. This is an implementation-time action and is not performed by this planning document.

All full verification runs through a checked script such as `scripts/check-phase1.sh` which:

1. Creates a unique temporary directory.
2. Sets `DJANGO_DATABASE_PATH`, media, private-media, cache, and generated-schema paths below it.
3. Refuses paths outside the approved temporary root.
4. Runs migrations and seed/provisioning only against that database.
5. Starts deterministic Django/Next servers on configurable ports.
6. Cleans temporary processes and data on exit.

Representative direct commands, with `$ABRIT_VERIFY_DIR` already validated by the wrapper:

```bash
DJANGO_DATABASE_PATH="$ABRIT_VERIFY_DIR/abrit.sqlite3" .runtime/phase1-venv/bin/python backend/manage.py migrate --noinput
DJANGO_DATABASE_PATH="$ABRIT_VERIFY_DIR/abrit.sqlite3" .runtime/phase1-venv/bin/python backend/manage.py sync_phase1_roles
DJANGO_DATABASE_PATH="$ABRIT_VERIFY_DIR/abrit.sqlite3" .runtime/phase1-venv/bin/python backend/manage.py check
DJANGO_DATABASE_PATH="$ABRIT_VERIFY_DIR/abrit.sqlite3" .runtime/phase1-venv/bin/python backend/manage.py makemigrations --check --dry-run
.runtime/phase1-venv/bin/python -m pytest -q
.runtime/phase1-venv/bin/python backend/manage.py spectacular --file "$ABRIT_VERIFY_DIR/schema.yml" --validate

cd frontend
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
```

`backend/data/abrit.sqlite3` must not be opened for writes by verification.

## 14. Phase 1 Verification Scenarios

### Backend baseline/regression

- Existing 22 tests pass before changes and continue to pass.
- Django check, migration drift check, and OpenAPI validation pass.
- Clean migration, upgrade migration, and repeated role sync pass.
- Public content, pricing, forms, navigation, search, settings, health, schema, and docs behavior remains unchanged.

### Authentication/security

- CSRF bootstrap returns token and correct cookie.
- Login without CSRF receives JSON `403 csrf_failed`.
- Wrong credentials return generic 401 and a redacted audit event.
- Five failures lock an existing account for 15 minutes.
- Unknown usernames cannot produce unbounded authentication work and do not disclose existence.
- Successful login resets counters, rotates the session, and returns the frozen SessionUser.
- Users lacking `access_admin` receive `403 admin_access_denied`.
- Logout requires CSRF and invalidates the session.
- Production-like proxy test observes Secure/Lax/path/domain behavior and HTTPS detection.

### Authorization and Django Admin

- Editor can access permitted content models in Django Admin.
- Editor cannot invoke publish or unpublish actions, including crafted POST requests.
- Publisher can publish/unpublish through existing services; revision/search/audit/revalidation behavior remains intact.
- Submission Reviewer can access permitted submissions/files but not content publication or audit.
- Auditor can read React dashboard/audit but cannot use Django Admin.
- Reserved Groups cannot be changed/deleted through supported Admin/API surfaces.
- Direct user permissions are not assignable.

### Users

- Anonymous/non-superuser mutation is denied.
- Superuser creates a user with one role; `is_staff` synchronizes correctly.
- Password validation and `set_password` are used.
- User cannot deactivate or change their own role.
- Superusers cannot be changed through the API.
- User activation, deactivation, password setting, and role change audit successfully and roll back with failed mutations.

### Audit/dashboard/file behavior

- Audit list/detail require `core.view_auditlog`, paginate deterministically, filter correctly, and expose redacted JSON only.
- Dashboard requires `accounts.view_dashboard` and returns the exact fixed object.
- Dashboard query behavior is aggregate/bounded.
- Private download anonymously redirects to legacy Admin login, denies authenticated no-permission user with 403, and serves authorized user.

### Rendered Admin UI

At 1440px, 768px, and 390px:

- Admin login/shell never render public header/footer.
- Persian Admin is RTL, keyboard-operable, focus-visible, and free of horizontal overflow.
- Session refresh, expiry, logout, lockout, 401, 403, 409, and 429 states render correctly.
- Users, role reference, dashboard, and audit screens cover loading, empty, error, and success.
- Role reference is visibly read-only.
- Representative `/fa`, `/en`, and `/ar-ae` public routes retain behavior and rendered smoke snapshots.

## 15. Phase 1 Exit Criteria

- [ ] All five Wave 0 readiness gates have recorded evidence.
- [ ] `docs/IMPLEMENTATION_PLAN.md` topology conflict is reconciled after owner approval.
- [ ] React Admin scope and Django Admin responsibility are documented exactly as this charter.
- [ ] Baseline is clean and existing checks have recorded results.
- [ ] Supported Python and frontend test environments exist.
- [ ] All verification writes use disposable database/media/cache paths.
- [ ] Standard Django User remains in use; existing initial migrations are unchanged.
- [ ] Fixed roles and exact permission sets provision cleanly, upgrade safely, and reconcile idempotently.
- [ ] Direct permissions and role mutation are unavailable through supported Phase 1 surfaces.
- [ ] Editor publish/unpublish denial and Publisher allowance are proven through Django Admin requests.
- [ ] Account lockout, unknown-user throttle, recovery, CSRF, session rotation, and logout are proven.
- [ ] React Admin is available at `/admin`; Django Admin remains at `/cms/admin/`.
- [ ] Protected API is available at `/cms/api/v1/admin/` in the production-like topology.
- [ ] Users, role/permission reference, dashboard, and audit React screens meet their contracts.
- [ ] User/sensitive auth mutations are audited with atomicity and redaction guarantees.
- [ ] Existing content/retention audit behavior remains intact.
- [ ] Private submission files require `forms.view_submissionfile`.
- [ ] OpenAPI, backend tests/checks, frontend lint/typecheck/unit tests/build/E2E all pass.
- [ ] Admin viewport/accessibility checks pass.
- [ ] Public APIs and representative public UI routes pass regression checks.
- [ ] No future-phase functionality is included.

## Recommended Execution Order

1. Obtain explicit approval for the charter, same-origin topology, and fixed-role model.
2. Resolve/commit the dirty line-ending baseline and record the commit.
3. Establish the supported environment and run/record the untouched baseline.
4. Integrate R01 contract/test foundation.
5. Run R02, R03, and R04 in parallel from that integrated baseline; independently review each.
6. Integrate R05 alone and complete its security review.
7. Run R06, R08, R09, R10, and R11 from the R05 commit.
8. Integrate R06, then run R07.
9. Integrate backend features, run R12, and fix all security matrix failures.
10. Run R13 once to aggregate URLs, sync contract types, and generate validated OpenAPI.
11. Run R14–R17 in parallel from the R11+R13 commit.
12. Integrate feature UIs through their extension points without concurrent navigation/package edits.
13. Run R18 against a clean disposable database and production-like proxy topology.
14. Complete independent acceptance review and the exit checklist.

## Agent Tasks Ready For Assignment

### R00 — Repository baseline and supported verification environment

**GOAL:** Produce a clean, reproducible, non-destructive baseline before worktrees.

**CONTEXT:** The current worktree contains user-owned line-ending changes and the available WSL Python cannot run Django.

**SCOPE:** Coordinate owner-approved resolution of dirty files; record the baseline commit; establish a supported Python environment from pinned requirements; run existing backend/frontend checks with disposable paths; record results and topology/charter approvals.

**CONSTRAINTS:** Do not discard user changes. Do not modify existing SQLite data. Do not change application behavior. Dependency installation requires the normal implementation authorization.

**RELEVANT FILES:** `git status`, `.gitignore`, `requirements.txt`, `frontend/package.json`, existing check scripts, planning documents.

**EXPECTED FILES TO CHANGE:** Readiness report and optional safe POSIX check wrapper only; line-ending changes only as explicitly directed by their owner.

**ACCEPTANCE CRITERIA:** Clean intended baseline; supported interpreter; existing 22 tests/checks recorded; frontend lint/typecheck/build recorded; disposable verification proven; five readiness gates signed off.

**VERIFICATION COMMANDS:** Run the Section 13 wrapper against the unchanged application.

**NON-GOALS:** Feature implementation or opportunistic baseline fixes.

**DEPENDENCIES:** Owner decisions and authorization.

**PARALLELIZATION SAFETY:** No other worktree starts until R00 completes.

### R01 — API contract and frontend test foundation

**GOAL:** Make backend/frontend feature tasks independently testable against frozen contracts.

**CONTEXT:** No frontend unit/E2E harness exists; v1 incorrectly introduced it last.

**SCOPE:** Establish unit/component tests, accessibility assertions, E2E config/startup scaffolding, shared API fixtures/types matching Section 4, and scripts. Own package/lockfile.

**CONSTRAINTS:** Test dependencies only; no app state library; no feature UI; no production data; deterministic configurable ports/base URLs.

**RELEVANT FILES:** `frontend/package.json`, lockfile, Next config, Section 4.

**EXPECTED FILES TO CHANGE:** Package/lockfile, test configs/setup, shared Admin contract types/mocks, smoke tests, safe server harness.

**ACCEPTANCE CRITERIA:** `npm run test` and `npm run test:e2e` exist; one component accessibility test and one route smoke test pass; fixtures cover success and stable errors; later tasks need no package edits.

**VERIFICATION COMMANDS:** `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build`, test-runner dry E2E startup.

**NON-GOALS:** Feature screens or live authentication behavior.

**DEPENDENCIES:** R00 and approved contracts.

**PARALLELIZATION SAFETY:** Owns every frontend package/test/shared-contract file.

### R02 — Focused audit foundation

**GOAL:** Centralize safe Phase 1 audit writes while preserving existing events.

**CONTEXT:** Audit writes are ad hoc and secret redaction/metadata are absent.

**SCOPE:** Controlled actor/action vocabulary, metadata, recursive redaction, central writer, read-only supported interfaces, and migration of the existing model without data loss. Move existing content/retention callers to the service where necessary.

**CONSTRAINTS:** No signals, generic save auditing, agent identity, export, or retention system. Never log credentials/tokens/cookies.

**RELEVANT FILES:** Core audit model/admin, content services, retention command/tests.

**EXPECTED FILES TO CHANGE:** Core audit model/service/tests and one new core migration; narrow existing caller changes.

**ACCEPTANCE CRITERIA:** Nested redaction; commit/rollback atomicity; immutable Admin behavior; existing content/retention events preserved; clean/upgrade migration pass.

**VERIFICATION COMMANDS:** Section 13 backend commands plus focused core/content/forms tests.

**NON-GOALS:** Comprehensive CMS auditing.

**DEPENDENCIES:** R00.

**PARALLELIZATION SAFETY:** Owns core model/migration; safe beside R03/R04.

### R03 — Fixed authorization, provisioning, and Django Admin enforcement

**GOAL:** Implement the exact role matrix and make Editor/Publisher separation real through Django Admin.

**CONTEXT:** Groups are empty, roles were previously underspecified, and publish actions currently bypass the proposed permission.

**SCOPE:** Accounts app/capability permissions, content publish permission, fixed role definitions, post-migrate provisioner, sync command, reserved Group Admin, direct-permission removal from User Admin, publish/unpublish checks, and role/staff synchronization service.

**CONSTRAINTS:** No mutable role API, direct grants, object scopes, custom user, or initial-migration edits.

**RELEVANT FILES:** Settings, content model/admin/services, forms/media permissions, Django auth Admin.

**EXPECTED FILES TO CHANGE:** New accounts app/0001/tests, next content migration, settings installed apps, content Admin, customized auth Admin, role sync command.

**ACCEPTANCE CRITERIA:** Exact matrix; clean/upgrade/repeat/missing-permission provisioning; reserved roles immutable; direct grants absent; Editor crafted publish/unpublish POST denied; Publisher allowed through existing service; staff sync correct.

**VERIFICATION COMMANDS:** Section 13 backend commands plus accounts/content Admin tests.

**NON-GOALS:** Role CRUD, React users API, account lockout.

**DEPENDENCIES:** R00 and owner-approved matrix.

**PARALLELIZATION SAFETY:** Owns accounts/content authorization migrations and Admin enforcement; safe beside R02/R04.

### R04 — Tested isolated React Admin shell

**GOAL:** Build the accessible, responsive, WordPress-familiar shell against frozen mocks.

**CONTEXT:** No Admin route exists; public routes must remain isolated.

**SCOPE:** `/admin` layout, noindex metadata, sidebar/drawer/header/content frame, extension-point navigation, skip link, permission-filtered mock rendering, RTL Persian, loading/denied shells.

**CONSTRAINTS:** Do not edit package/lockfile, public layout, homepage, public globals, or shared contract definitions. Follow local Next 16 documentation.

**RELEVANT FILES:** R01 types/tests, frontend fonts/brand, `frontend/AGENTS.md`.

**EXPECTED FILES TO CHANGE:** New Admin layout/shell components and scoped styles/tests; one owned navigation registry.

**ACCEPTANCE CRITERIA:** Unit/accessibility tests; keyboard drawer/focus; 1440/768/390 component tests or evidence; public-route smoke regression; no public header/footer.

**VERIFICATION COMMANDS:** Frontend lint/typecheck/test/build.

**NON-GOALS:** Live auth or feature screens.

**DEPENDENCIES:** R00, R01.

**PARALLELIZATION SAFETY:** Owns shell/navigation; feature tasks do not edit it.

### R05 — Session, CSRF, proxy, and persistent-lockout API

**GOAL:** Complete and prove the authentication boundary before protected features.

**CONTEXT:** Auth transport, proxy behavior, and lockout were previously unresolved.

**SCOPE:** Section 2 settings; AccountSecurity lock state/migration; CSRF/login/session/logout; unknown-user throttle; unlock recovery; focused auth audit; JSON CSRF failure; exact Section 4 errors; proxy/path-prefix tests.

**CONSTRAINTS:** Sessions only; no JWT/MFA/OAuth; public endpoints remain explicitly anonymous; no feature APIs.

**RELEVANT FILES:** R02 audit, R03 access permission, Django settings/middleware/URLs.

**EXPECTED FILES TO CHANGE:** Accounts security model/migration/services/auth API/tests, auth URLs, settings, CSRF failure view, unlock command.

**ACCEPTANCE CRITERIA:** Exact endpoint contracts; cookie flags/path; CSRF login/logout; session rotation; five-attempt lock; recovery; generic unknown/bad-password message; proxy HTTPS behavior; redacted audit; 401/403/429 semantics.

**VERIFICATION COMMANDS:** Full backend checks, auth-focused tests, OpenAPI validation, production-like proxy integration test.

**NON-GOALS:** Protected feature endpoints or frontend login.

**DEPENDENCIES:** R02, R03, approved topology.

**PARALLELIZATION SAFETY:** Runs alone and integrates before Wave 3.

### R06 — Read-only role and permission catalog API

**GOAL:** Expose the fixed matrix for React reference and user forms.

**CONTEXT:** Roles are fixed; Phase 1 requires visibility, not mutable role CRUD.

**SCOPE:** Exact `/roles`, `/roles/{key}`, and `/permissions` contracts with authorization, deterministic order, and schema annotations.

**CONSTRAINTS:** No mutation endpoints and no shared URL aggregator edits.

**RELEVANT FILES:** R03 role definitions, R05 protected API base.

**EXPECTED FILES TO CHANGE:** Feature-specific accounts role catalog API/serializers/tests/URL module.

**ACCEPTANCE CRITERIA:** Exact Section 4 fields; unauthorized denial; matrix matches provisioner; POST/PATCH/DELETE unavailable; OpenAPI validates.

**VERIFICATION COMMANDS:** Focused tests plus backend check/schema validation.

**NON-GOALS:** Role creation/edit/deletion.

**DEPENDENCIES:** R05.

**PARALLELIZATION SAFETY:** Separate module; safe with R08–R11.

### R07 — Superuser-only user management API

**GOAL:** Implement safe audited ordinary-user management using the finalized role catalog.

**CONTEXT:** V1 split user and role security design unsafely; R07 now follows integrated R06.

**SCOPE:** Section 4 user endpoints, pagination/search/filter/order, create/patch, password action, activation actions, one-role assignment, staff synchronization, superuser/self protection, atomic audit.

**CONSTRAINTS:** Superuser-only mutations; no DELETE, direct permissions, staff/superuser fields, invitations, or profile system.

**RELEVANT FILES:** R02 audit, R03 role assignment, R05 protected API base, R06 catalog.

**EXPECTED FILES TO CHANGE:** User services/serializers/API/tests and feature URL module.

**ACCEPTANCE CRITERIA:** Exact contracts/errors; password validation/set_password; self and superuser protection; role/staff sync; pagination; mutation/audit rollback; OpenAPI validates.

**VERIFICATION COMMANDS:** Focused accounts tests plus full backend check/schema validation.

**NON-GOALS:** Role definition mutations or superuser lifecycle.

**DEPENDENCIES:** R06 integrated.

**PARALLELIZATION SAFETY:** Not parallel with R06 security design; owns only user feature files.

### R08 — Read-only audit query API

**GOAL:** Expose filterable persisted redacted audit data.

**CONTEXT:** Audit exists only in Django Admin.

**SCOPE:** Exact Section 4 list/detail, pagination/filter/date parsing/order, permission checks, schema annotations.

**CONSTRAINTS:** No writes/export; no shared aggregator edits; render stored redacted data only.

**RELEVANT FILES:** R02 audit, R05 protected API base.

**EXPECTED FILES TO CHANGE:** Feature-specific core audit API/serializers/tests/URLs.

**ACCEPTANCE CRITERIA:** 401/403; exact envelopes; combined filters; deterministic order; escaped/redacted JSON; no mutation routes.

**VERIFICATION COMMANDS:** Focused tests and OpenAPI validation.

**NON-GOALS:** Export, retention, SIEM.

**DEPENDENCIES:** R05.

**PARALLELIZATION SAFETY:** Separate module; safe with R06/R09–R11.

### R09 — Fixed dashboard aggregation API

**GOAL:** Return the exact small dashboard object without per-widget policy complexity.

**CONTEXT:** V1's conditional widgets were unnecessary and underspecified.

**SCOPE:** Exact users/content/submissions/revalidation aggregates and permission tests.

**CONSTRAINTS:** Full response for `view_dashboard`; no writes, cache layer, trends, or shared aggregator edit.

**RELEVANT FILES:** User/security, content workflow, submissions, revalidation models.

**EXPECTED FILES TO CHANGE:** Core dashboard service/API/tests/feature URL module.

**ACCEPTANCE CRITERIA:** Exact contract; bounded aggregate queries; 401/403; correct fixture counts; no audit event.

**VERIFICATION COMMANDS:** Focused query/permission tests and OpenAPI validation.

**NON-GOALS:** Analytics/charts/customization.

**DEPENDENCIES:** R05.

**PARALLELIZATION SAFETY:** Separate module; safe with R06/R08/R10/R11.

### R10 — Private submission-file authorization

**GOAL:** Replace broad staff access with `forms.view_submissionfile`.

**CONTEXT:** Current `staff_member_required` is too broad.

**SCOPE:** Preserve legacy route/download behavior while applying explicit permission and testing redirect/403/authorized cases.

**CONSTRAINTS:** No storage/upload or JSON download redesign; no shared URL edit unless compatibility requires it and R13 owns final aggregation.

**RELEVANT FILES:** Forms API/tests and R03 matrix.

**EXPECTED FILES TO CHANGE:** Existing forms download view and focused tests.

**ACCEPTANCE CRITERIA:** Anonymous redirect, authenticated 403, permission success, superuser success, no path disclosure.

**VERIFICATION COMMANDS:** Forms tests and Django check.

**NON-GOALS:** Per-object permissions or upload changes.

**DEPENDENCIES:** R05.

**PARALLELIZATION SAFETY:** Forms-only; safe with R06/R08/R09/R11.

### R11 — Tested frontend session/login integration

**GOAL:** Connect the shell to the frozen session/CSRF contract.

**CONTEXT:** R05 is integrated and R01 provides tests.

**SCOPE:** Credentialed Admin client, CSRF bootstrap, login, session provider, logout, loading/expiry/denied/locked/throttled states, permission-filtered shell.

**CONSTRAINTS:** No token/localStorage; no package/lock/navigation edits; backend authorization remains authoritative.

**RELEVANT FILES:** R01 types/tests, R04 shell, R05 contract.

**EXPECTED FILES TO CHANGE:** Admin auth client/provider/login components/routes/tests.

**ACCEPTANCE CRITERIA:** Unit tests for headers/credentials/CSRF; component tests for keyboard login and errors; session refresh; 401 login transition; 403 preservation; logout; no stored token.

**VERIFICATION COMMANDS:** Frontend lint/typecheck/test/build plus auth E2E against R05.

**NON-GOALS:** User/role/dashboard/audit feature screens.

**DEPENDENCIES:** R04, R05.

**PARALLELIZATION SAFETY:** Frontend auth-only; safe with separate backend features.

### R12 — Independent backend security matrix

**GOAL:** Prove cross-feature authorization and regressions after all backend APIs exist.

**CONTEXT:** Feature tests do not prove cross-role behavior.

**SCOPE:** Anonymous, Editor, Publisher, Submission Reviewer, Auditor, superuser, locked, inactive, and ordinary-no-role matrices; crafted Django Admin actions; audit rollback/redaction; public regressions.

**CONSTRAINTS:** Test-first review task; behavior defects return to owning tasks.

**RELEVANT FILES:** R02–R10 outputs and existing public tests.

**EXPECTED FILES TO CHANGE:** Integration tests/fixtures only.

**ACCEPTANCE CRITERIA:** Every sensitive operation has allow and deny evidence; content publish bypass impossible; role immutability/direct-permission rules proven; public anonymous endpoints unchanged.

**VERIFICATION COMMANDS:** Full backend suite/check/migration drift with disposable paths.

**NON-GOALS:** Frontend tests.

**DEPENDENCIES:** R06–R10 integrated.

**PARALLELIZATION SAFETY:** Runs against integrated backend, not during behavior changes.

### R13 — URL, OpenAPI, frontend-type, and navigation integration

**GOAL:** Produce one authoritative integrated contract for frontend features.

**CONTEXT:** Parallel tasks must not edit shared aggregators/schema/navigation.

**SCOPE:** Include feature URL modules once, validate route names/conflicts, generate final pre-UI OpenAPI, synchronize R01 types/fixtures, and add navigation entries through R04's extension interface.

**CONSTRAINTS:** No endpoint behavior or feature UI; no schema generation by other tasks afterward until R18.

**RELEVANT FILES:** `config/urls.py`, feature URLs, `backend/schema.yml`, shared frontend types/fixtures, Admin navigation registry.

**EXPECTED FILES TO CHANGE:** Those shared integration files only.

**ACCEPTANCE CRITERIA:** All routes resolve; schema validates; frontend type fixtures exactly match; navigation keys/permissions fixed; no duplicate paths/names.

**VERIFICATION COMMANDS:** Full backend schema/check/tests and frontend typecheck/tests.

**NON-GOALS:** Feature behavior/UI.

**DEPENDENCIES:** R06–R12, R11 for navigation/session shape.

**PARALLELIZATION SAFETY:** Runs alone as shared-file integrator.

### R14 — Users screen

**GOAL:** Deliver the contracted superuser user-management UI.

**CONTEXT:** Backend/user types and test harness are integrated.

**SCOPE:** List/search/filter/pagination, create/edit, password, activate/deactivate, one-role selection, confirmations and all relevant error states.

**CONSTRAINTS:** No shared navigation/package/type edits; no superuser/staff/direct-permission controls.

**RELEVANT FILES:** R07/R13 contract, R11 client/session, R01 tests.

**EXPECTED FILES TO CHANGE:** Users route/feature components/scoped tests/styles.

**ACCEPTANCE CRITERIA:** Accessible forms/table; passwords never retained; 400/403/409 handled; role/staff read-only result shown; non-superuser denied state; feature tests pass.

**VERIFICATION COMMANDS:** Frontend lint/typecheck/test/build with users test selection.

**NON-GOALS:** Invitations, deletion, role mutation.

**DEPENDENCIES:** R07, R11, R13.

**PARALLELIZATION SAFETY:** Separate feature directory; safe with R15–R17.

### R15 — Read-only roles and permissions screen

**GOAL:** Make the fixed role matrix understandable and auditable.

**CONTEXT:** Phase 1 roles are intentionally immutable.

**SCOPE:** Role list/detail, permission categories/search, staff requirement, explicit read-only/reserved messaging, loading/denied/error states.

**CONSTRAINTS:** No mutation controls or arbitrary codenames; no shared navigation/package/type edits.

**RELEVANT FILES:** R06/R13 contracts and R11 client.

**EXPECTED FILES TO CHANGE:** Roles feature route/components/tests/styles.

**ACCEPTANCE CRITERIA:** Exact matrix display; Editor/Publisher difference visible; reserved/read-only state unmistakable; accessible search/sections; tests pass.

**VERIFICATION COMMANDS:** Frontend lint/typecheck/test/build with role tests.

**NON-GOALS:** Role CRUD.

**DEPENDENCIES:** R06, R11, R13.

**PARALLELIZATION SAFETY:** Separate feature directory.

### R16 — Dashboard screen

**GOAL:** Render the fixed Phase 1 aggregates accessibly and responsively.

**CONTEXT:** R09 supplies a complete fixed object.

**SCOPE:** Users/content/submissions/revalidation cards, statuses, loading/denied/empty/error states, destinations only where implemented.

**CONSTRAINTS:** No client count calculation, charts, polling, shared navigation/package/type edits.

**RELEVANT FILES:** R09/R13 contract, R11 client.

**EXPECTED FILES TO CHANGE:** Dashboard feature components/tests/styles.

**ACCEPTANCE CRITERIA:** Exact field rendering; status not color-only; responsive at three target widths; accessibility/unit tests pass.

**VERIFICATION COMMANDS:** Frontend lint/typecheck/test/build with dashboard tests.

**NON-GOALS:** Analytics/customization.

**DEPENDENCIES:** R09, R11, R13.

**PARALLELIZATION SAFETY:** Separate feature directory.

### R17 — Read-only audit screen

**GOAL:** Render filterable, safe, read-only audit history.

**CONTEXT:** R08 supplies the exact paginated contract.

**SCOPE:** Table, URL-synchronized filters, pagination, detail, escaped JSON, loading/empty/denied/error states.

**CONSTRAINTS:** No mutation/export; never interpret HTML; no shared navigation/package/type edits.

**RELEVANT FILES:** R08/R13 contract, R11 client.

**EXPECTED FILES TO CHANGE:** Audit feature route/components/tests/styles.

**ACCEPTANCE CRITERIA:** Deterministic filters/pagination; actor/action/target/time readable; JSON safely escaped; keyboard-accessible detail; tests pass.

**VERIFICATION COMMANDS:** Frontend lint/typecheck/test/build with audit tests.

**NON-GOALS:** Export/diff/retention.

**DEPENDENCIES:** R08, R11, R13.

**PARALLELIZATION SAFETY:** Separate feature directory.

### R18 — Final production-like E2E and release evidence

**GOAL:** Demonstrate the complete Phase 1 outcome without introducing new infrastructure late.

**CONTEXT:** Test infrastructure exists from R01; all features are integrated.

**SCOPE:** Disposable clean/upgrade databases, deterministic role sync/users, same-origin `/cms` proxy topology, full auth/user/role/dashboard/audit/file journeys, viewport/accessibility checks, public regressions, one final OpenAPI generation.

**CONSTRAINTS:** No production state/deployment; no new feature scope; R01 remains package owner unless an essential test dependency change is separately approved.

**RELEVANT FILES:** Integrated Phase 1, safe verification wrapper, E2E specs, final schema.

**EXPECTED FILES TO CHANGE:** Final E2E specs/fixtures, verification evidence, final `backend/schema.yml`; defect fixes return to owners.

**ACCEPTANCE CRITERIA:** Every Section 14 scenario passes; clean and upgrade paths use disposable data; three viewports pass; public routes pass; all Section 15 exit criteria have evidence.

**VERIFICATION COMMANDS:** Complete Section 13 wrapper and production-like E2E command.

**NON-GOALS:** Deployment, load tests, future phases.

**DEPENDENCIES:** R12 and R14–R17 integrated.

**PARALLELIZATION SAFETY:** Final task; runs alone against the release candidate.
