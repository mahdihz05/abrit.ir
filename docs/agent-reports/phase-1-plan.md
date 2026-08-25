# AbrIT Phase 1 — Implementation-Ready Engineering Plan

Planning only. This plan does not authorize implementation, dependency installation, migration creation, branch creation, or worktree creation.

The requested discovery reports are present under different names:

- Requested `docs/agent-reports/repository-discovery.md` → actual `docs/agent-reports/discovery.md`
- Requested `docs/agent-reports/architecture-assessment.md` → actual `docs/agent-reports/architecture.md`

Both reports were read and important claims were checked directly against repository code.

## 1. Verified Current State

### Verified repository facts

- The repository is a monorepo containing a Django 5.2/DRF backend under `backend/` and a Next.js 16/React 19 public frontend under `frontend/`.
- Django uses the standard `django.contrib.auth.User`. There is no `AUTH_USER_MODEL` override in `backend/config/settings/base.py`.
- Existing audit and revision foreign keys already reference `settings.AUTH_USER_MODEL` in `backend/apps/core/models.py` and `backend/apps/content/models.py`.
- Django sessions, authentication middleware, CSRF middleware, password validators, and Django Admin are enabled in `backend/config/settings/base.py`.
- Public DRF views explicitly disable authentication or use `AllowAny`, including `backend/apps/content/api.py`, `backend/apps/core/api.py`, `backend/apps/forms/api.py`, `backend/apps/pricing/api.py`, and `backend/apps/search/api.py`.
- `/admin/` is already owned by Django Admin inside the Django deployment. A private submission download also occupies that namespace in `backend/config/urls.py`.
- `.env.example` configures Django below `/cms` with `DJANGO_SCRIPT_NAME=/cms`. The expected externally visible legacy Django Admin is therefore `/cms/admin/`, leaving the Next.js public origin free to own `/admin`.
- `CORS_ALLOW_CREDENTIALS` is currently `False`, although local Next.js and Django development uses different origins.
- `AuditLog` currently stores actor, actor type, action, object identity, before/after JSON, and timestamp. It lacks a controlled event vocabulary, metadata, centralized redaction, and a shared mutation service. See `backend/apps/core/models.py`.
- Custom audit writes currently cover content publish/unpublish/restore and retention purge. Ordinary identity and model changes are not comprehensively audited. See `backend/apps/content/services.py` and `backend/apps/forms/management/commands/purge_expired_submissions.py`.
- Some Django Admin actions bypass service/audit boundaries through `queryset.update()`, notably content archive and submission status changes in `backend/apps/content/admin.py` and `backend/apps/forms/admin.py`.
- Content already has workflow and revision primitives. `ContentRevision.Source` includes `admin`, `agent`, `mcp`, and `system`, but these are provenance labels rather than authentication mechanisms.
- The frontend has no Admin routes, authentication state, authorization state, unit-test framework, or E2E framework. Its current scripts in `frontend/package.json` cover lint, typecheck, and build.
- Existing public routes primarily use static frontend content. Phase 1 does not require changing `frontend/src/lib/public-content.ts`, `frontend/src/components/reference-homepage.tsx`, or the public rendering path.
- Read-only database inspection found 2 users, 2 staff users, 2 superusers, 0 groups, 0 group-permission assignments, 0 direct user-permission assignments, 0 custom audit rows, and 0 content revisions.
- The worktree contains numerous pre-existing line-ending-only modifications, including central routing, migration, frontend layout, and package files.
- Backend tests could not be executed in the current WSL environment because the repository virtualenv is Windows-based and system Python does not have Django installed. This is not evidence that the tests fail.

### Recommendations

- Preserve `auth.User`; do not introduce a custom user model.
- Use Django `Group` for roles and `Permission` for capabilities.
- Use Django session authentication with CSRF rather than browser-stored JWTs.
- Expose React Admin at `/admin`, retain Django Admin at `/cms/admin/`, and place protected APIs under `/cms/api/v1/admin/`.
- Keep public API endpoints explicitly public and unchanged.
- Establish centralized audited service functions before identity mutation endpoints.
- Require an explicit `accounts.access_admin` permission for React Admin access. Do not use `is_staff` as the React Admin admission boundary.
- Keep `is_staff` and `is_superuser` management outside the Phase 1 React API. Existing superusers remain break-glass administrators.

### Unresolved questions

- Whether the `/cms` topology in `.env.example` exactly matches production.
- Whether the current SQLite data is development, staging, or copied production data.
- Final human-facing names for default roles.
- Required audit retention/export obligations.
- Whether Admin must be Persian-only or bilingual. The recommended minimum is Persian RTL with English operational identifiers where necessary.
- Whether MFA is immediately required. It is excluded from this smallest Phase 1 and should be a later security milestone.

## 2. Architecture Decisions

### AD-01 — Retain Django's standard user model

- **Decision:** Keep `django.contrib.auth.User`; do not set `AUTH_USER_MODEL`.
- **Reason:** Existing migrations, audit references, revisions, sessions, and Django Admin already depend on it.
- **Existing integration:** `AuditLog.actor`, `ContentRevision.actor`, sessions, Django Admin.
- **Alternative:** Introduce a custom user model now.
- **Trade-off:** Avoids high-risk schema replacement, but future additional identity fields require a one-to-one profile model.

### AD-02 — Django Groups are roles

- **Decision:** Use `Group` as the role entity and `Permission` as the capability entity.
- **Reason:** It is Django-native, already migrated, and integrates with `has_perm`.
- **Existing integration:** Built-in model permissions and Django Admin.
- **Alternative:** New Role and RolePermission tables.
- **Trade-off:** Group naming needs stable conventions, and unsafe/system permissions must be filtered from the API.

### AD-03 — Explicit permission-based Admin admission

- **Decision:** Require `accounts.access_admin`; reserve `is_staff` for legacy Django Admin.
- **Reason:** React Admin access should not automatically grant Django Admin access.
- **Existing integration:** Standard Django permission resolution.
- **Alternative:** Require `is_staff`.
- **Trade-off:** Adds one custom capability but creates a cleaner boundary.

### AD-04 — Session authentication with CSRF

- **Decision:** Use Django sessions and explicitly CSRF-protected login/logout endpoints.
- **Reason:** The same-origin production topology and Django middleware already support it.
- **Existing integration:** Current session/CSRF middleware and production cookie security.
- **Alternative:** JWT or opaque browser tokens.
- **Trade-off:** Cross-origin local development requires credentialed CORS and browser requests must send cookies and CSRF headers.

### AD-05 — Separate React and legacy Admin namespaces

- **Decision:** React owns `/admin`; Django Admin remains `/cms/admin/`; protected APIs use `/cms/api/v1/admin/`.
- **Reason:** Preserve the operational fallback and avoid route replacement.
- **Existing integration:** Next App Router and `DJANGO_SCRIPT_NAME=/cms`.
- **Alternative:** Replace Django Admin or mount React below Django `/admin/`.
- **Trade-off:** Two administration surfaces exist temporarily and must be clearly distinguished.

### AD-06 — Central audited mutation services

- **Decision:** User and role APIs mutate state only through service functions that write `AuditLog` in the same transaction.
- **Reason:** API views, future tools, and future agents need one authoritative behavior.
- **Existing integration:** The transaction-oriented pattern in `backend/apps/content/services.py`.
- **Alternative:** Signals or audit writes directly in serializers/views.
- **Trade-off:** Adds service code but makes transactional behavior explicit and testable.

### AD-07 — Controlled audit vocabulary and redaction

- **Decision:** Add event constants, metadata, immutable supported interfaces, and recursive secret redaction.
- **Reason:** Authentication and permission changes must not leak credentials or tokens.
- **Existing integration:** Existing `AuditLog` and its read-only Django Admin.
- **Alternative:** Depend only on `django_admin_log`.
- **Trade-off:** The custom log remains separate from Django Admin history.

### AD-08 — Small fixed role baseline

| Role | Purpose |
|---|---|
| Editor | Admin access and content editing; cannot publish |
| Publisher | Editor capabilities plus explicit publish/unpublish capability |
| User Manager | Manage non-superuser users and roles within its permission ceiling |
| Auditor | Read-only dashboard and audit access |
| Administrator | Represented by `is_superuser`, not a mutable Group |

- **Alternative:** No default roles and completely user-defined groups.
- **Trade-off:** Defaults make least privilege demonstrable while still allowing additional groups.

### AD-09 — Explicit workflow permissions

- **Decision:** Add `content.publish_contenttranslation`; do not equate `change_contenttranslation` with publication.
- **Reason:** Edit/publish separation is a project requirement.
- **Existing integration:** Existing publish and unpublish services.
- **Alternative:** Rely on generic `change`.
- **Trade-off:** Existing Django Admin publication actions must also check the custom permission.

### AD-10 — Capability-ceiling enforcement

- **Decision:** A non-superuser may grant only permissions they possess and assign only roles whose permissions are a subset of their own.
- **Reason:** `change_group` alone otherwise permits escalation.
- **Existing integration:** User/role service layer and standard effective permissions.
- **Alternative:** Make all role management superuser-only.
- **Trade-off:** Requires more authorization tests but permits a useful least-privilege User Manager.

### AD-11 — Client shell guards; backend authority

- **Decision:** React filters navigation and guards rendering from the session contract, while every backend endpoint independently enforces permissions.
- **Reason:** UI hiding is not a security boundary.
- **Existing integration:** Next App Router and Django session APIs.
- **Alternative:** Duplicate authorization in Next middleware/BFF routes.
- **Trade-off:** The Admin layout needs an authenticated loading state.

### AD-12 — No public-site migration in Phase 1

- **Decision:** Keep Admin routes/styles isolated from public layouts and static public content.
- **Reason:** The public site works and is outside Phase 1.
- **Existing integration:** A separate `frontend/src/app/admin` route tree.
- **Alternative:** Refactor the whole frontend around a shared application shell.
- **Trade-off:** Some branding/layout code may be temporarily duplicated.

## 3. Dependency Graph

```text
T01 Audit foundation ─────────┬── T03 Authentication API ─── T11 Frontend auth
                              ├── T04 User API ──────────────┐
                              ├── T05 Role/permission API ───┤
                              ├── T06 Audit query API ───────┤
                              └── T07 Dashboard API ─────────┤
                                                            │
T02 Authorization foundation ┬── T03 Authentication API ────┤
                             ├── T04 User API ───────────────┤
                             ├── T05 Role/permission API ────┤
                             ├── T06 Audit query API ────────┤
                             ├── T07 Dashboard API ──────────┤
                             └── T08 Private-file hardening ─┤
                                                            │
T10 Admin shell ───────────────── T11 Frontend auth ─────────┤
                                                            │
T04 + T11 ──────────────────────── T12 Users UI ─────────────┤
T05 + T11 ──────────────────────── T13 Roles UI ─────────────┤
T07 + T11 ──────────────────────── T14 Dashboard UI ─────────┤
T06 + T11 ──────────────────────── T15 Audit UI ─────────────┤
                                                            │
T08 + T12 + T13 + T14 + T15 ─────────────── T16 Integration/E2E
```

T09 is the backend authorization regression suite. It depends on T03–T08 and feeds T16.

## 4. Parallelization Plan

### Wave 1 — can start immediately in parallel

- T01 Audit foundation
- T02 Authorization and role foundation
- T10 Admin shell

T01 owns the core audit model/service, T02 owns the new accounts app and permission declarations, and T10 owns the new frontend Admin tree. T01 and T02 must use separate app migrations.

### Wave 2 — depends on Wave 1

- T03 Authentication API
- T04 User API
- T05 Role/permission API
- T06 Audit query API
- T07 Dashboard API
- T08 Private-file authorization hardening
- T11 Frontend authentication integration

Backend tasks use separate API/service/test modules. T06 and T07 use separate core modules. T08 is isolated to form file downloads. T11 is isolated to the Admin frontend/auth client.

### Wave 3 — integration/dependent work

- T09 Backend authorization regression suite
- T12 Users UI
- T13 Roles UI
- T14 Dashboard UI
- T15 Audit UI
- T16 Full integration and rendered E2E verification

T12–T15 are safe concurrently once API contracts and T11 are integrated because each owns a separate route and feature component tree.

### Likely merge-conflict files

- `backend/config/settings/base.py`
- `backend/config/urls.py`
- `backend/apps/core/models.py`
- `backend/apps/content/models.py`
- `backend/apps/forms/models.py`
- `frontend/package.json`
- `frontend/package-lock.json`
- `frontend/src/app/admin/layout.tsx`
- Admin navigation definitions
- `backend/schema.yml`

Mitigate conflicts by assigning central-file ownership, using app-owned URL modules, generating migrations after rebasing, generating `schema.yml` once during integration, and resolving the current line-ending baseline before worktrees are created.

## 5. Worktree Plan

| Task | Branch | Worktree | Responsible agent |
|---|---|---|---|
| T01 | `feat/phase1-audit-foundation` | `../abrit-p1-audit` | Backend audit/security agent |
| T02 | `feat/phase1-authorization-foundation` | `../abrit-p1-authorization` | Backend identity architect |
| T03 | `feat/phase1-session-auth-api` | `../abrit-p1-auth-api` | Backend authentication agent |
| T04 | `feat/phase1-user-api` | `../abrit-p1-user-api` | Backend users agent |
| T05 | `feat/phase1-role-permission-api` | `../abrit-p1-role-api` | Backend authorization agent |
| T06 | `feat/phase1-audit-api` | `../abrit-p1-audit-api` | Backend read-API agent |
| T07 | `feat/phase1-dashboard-api` | `../abrit-p1-dashboard-api` | Backend aggregation agent |
| T08 | `fix/phase1-private-file-permissions` | `../abrit-p1-private-files` | Backend security agent |
| T09 | `test/phase1-backend-authorization` | `../abrit-p1-backend-tests` | Backend test agent |
| T10 | `feat/phase1-admin-shell` | `../abrit-p1-admin-shell` | Frontend shell/accessibility agent |
| T11 | `feat/phase1-admin-auth` | `../abrit-p1-admin-auth` | Frontend authentication agent |
| T12 | `feat/phase1-users-ui` | `../abrit-p1-users-ui` | Frontend feature agent |
| T13 | `feat/phase1-roles-ui` | `../abrit-p1-roles-ui` | Frontend feature agent |
| T14 | `feat/phase1-dashboard-ui` | `../abrit-p1-dashboard-ui` | Frontend dashboard agent |
| T15 | `feat/phase1-audit-ui` | `../abrit-p1-audit-ui` | Frontend audit agent |
| T16 | `test/phase1-admin-e2e` | `../abrit-p1-e2e` | Integration/E2E agent |

Do not create branches or worktrees until the existing dirty-worktree/line-ending state has been resolved by its owner.

## 6. Integration Strategy

### Merge order

1. T01 audit foundation
2. T02 authorization foundation
3. T10 Admin shell
4. T03 authentication API
5. T04 user API
6. T05 role/permission API
7. T06 audit query API
8. T07 dashboard API
9. T08 private-file hardening
10. T11 frontend authentication
11. T12–T15 after rebasing, in any order
12. T09 backend regression suite
13. T16 E2E and final schema/contract integration

### Backend review gates

- Migration dependency correctness and clean-database behavior.
- Permission enforcement on every HTTP method.
- Transaction and audit atomicity.
- Password/secret redaction.
- Superuser, self-management, and escalation protections.
- Existing public endpoints remain unchanged and anonymous.
- Deterministic pagination and bounded query behavior.

### Frontend review gates

- No coupling to or changes in the public locale layout.
- Correct cookie and CSRF handling.
- Loading, empty, 401, 403, validation, and server-error states.
- Keyboard navigation, focus behavior, RTL, and responsive behavior.
- Backend authorization remains authoritative.

### Required integration checks

```bash
python backend/manage.py check
python backend/manage.py makemigrations --check --dry-run
python -m pytest -q
python backend/manage.py spectacular --file /tmp/abrit-schema.yml --validate

cd frontend
npm run lint
npm run typecheck
npm run build
```

After T16, run the added frontend unit and E2E test scripts as well.

### Likely schema/API conflict points

- Concurrent additions to `accounts/urls.py`.
- Permission codenames and role-seed migration dependencies.
- `AuditLog` migration versus its read serializer.
- Session response fields consumed by navigation.
- List pagination envelope consistency.
- Dashboard widget names and permission-driven omission rules.
- CSRF error shape and login throttling.

## 7. Independent Review Strategy

Independent acceptance review is mandatory for:

- T01: audit immutability, redaction, and atomicity.
- T02: permission matrix and Editor/Publisher separation.
- T03: CSRF enforcement, session fixation, throttling, and login auditing.
- T04/T05: horizontal authorization and escalation attempts.
- T08: explicit private-file permission behavior.
- T10/T11: route isolation, accessibility, and cookie/CSRF behavior.
- T12/T13: self-lockout and escalation behavior through the UI.
- T16: complete user journeys on a clean database.

The reviewer must execute verification commands, check every acceptance criterion, and add at least one negative test. Style-only review is insufficient.

## 8. Phase 1 Verification

### Backend commands

```bash
python backend/manage.py check
python backend/manage.py check --deploy --settings=config.settings.production
python backend/manage.py makemigrations --check --dry-run
python backend/manage.py migrate --noinput
python -m pytest -q
python backend/manage.py spectacular --file /tmp/abrit-phase1-schema.yml --validate
```

The production check must use safe temporary environment values and document expected host-specific warnings.

### Required API behavior

- CSRF bootstrap sets a CSRF cookie.
- Login without CSRF is denied.
- Invalid login is throttled and audited without credentials.
- Valid login establishes a session and returns effective permissions.
- Logout requires CSRF and invalidates the session.
- Inactive users and users without `access_admin` cannot enter React Admin.
- Anonymous access to all `/api/v1/admin/*` endpoints is denied.
- Editor can edit permitted content but cannot publish.
- Publisher can publish.
- Auditor can read dashboard/audit but cannot mutate.
- User Manager cannot grant permissions they do not possess.
- No API can set `is_superuser` or `is_staff`.
- A user cannot remove their own last viable Admin access.
- Assigned roles cannot be deleted.
- User activation changes, role changes, permission changes, login/logout, and failed login produce redacted audit events.
- Audit entries cannot be changed or deleted through supported interfaces.
- Submission files require explicit model permission rather than staff status alone.
- Existing public endpoints remain anonymously accessible.

### Frontend commands

```bash
cd frontend
npm run lint
npm run typecheck
npm run build
npm run test
npm run test:e2e
```

### Rendered UI checks

At 1440px, 768px, and 390px:

- `/admin/login` does not render the public header/footer.
- Unauthenticated `/admin` presents or redirects to login.
- Navigation shows only permitted sections.
- Sidebar/drawer is keyboard operable and focus-visible.
- Persian layout is RTL without horizontal overflow.
- Users, roles, dashboard, and audit render loading, empty, denied, validation-error, and success states.
- A 401 returns the user to login.
- A 403 preserves the valid session and renders an authorization state.
- Representative `/fa`, `/en`, and `/ar-ae` public routes remain unchanged.

## 9. Phase 1 Exit Criteria

- [ ] Standard Django user model remains in use.
- [ ] Session/CSRF authentication contract is documented and tested.
- [ ] React Admin is available at `/admin`.
- [ ] Django Admin remains available at `/cms/admin/`.
- [ ] Protected Admin APIs are under `/cms/api/v1/admin/`.
- [ ] Anonymous users cannot access protected Admin data.
- [ ] Editor, Publisher, User Manager, and Auditor roles exist.
- [ ] Administrator remains controlled by `is_superuser`.
- [ ] Editor/Publisher separation is demonstrated by allow/deny tests.
- [ ] User list, create, edit, activation/deactivation, password setting, and role assignment work.
- [ ] Roles can be listed, created, edited, assigned safe permissions, and deleted only while unassigned.
- [ ] Capability-ceiling tests prevent escalation.
- [ ] Dashboard returns permission-appropriate metrics.
- [ ] Audit records authentication and identity mutations transactionally.
- [ ] Audit secrets are redacted and audit rows are immutable through supported interfaces.
- [ ] Audit UI supports pagination and useful filters.
- [ ] Private submission downloads enforce explicit permission.
- [ ] All backend tests pass on a clean migrated database.
- [ ] Django checks and migration-drift checks pass.
- [ ] OpenAPI validation passes.
- [ ] Frontend lint, typecheck, unit tests, and build pass.
- [ ] Authenticated Admin E2E journeys pass.
- [ ] Admin UI is verified at desktop, tablet, and mobile widths.
- [ ] Representative public routes remain unchanged.
- [ ] No Phase 2 feature or speculative agent infrastructure is included.

## Recommended Execution Order

1. Resolve the current dirty-worktree and line-ending baseline.
2. Freeze API field names, role matrix, permission codenames, and `/admin` versus `/cms/admin` routing.
3. Run T01, T02, and T10 concurrently.
4. Integrate T01 and T02 before backend mutation APIs.
5. Integrate T10 before frontend authentication and feature screens.
6. Run and integrate T03–T08 with strict file ownership.
7. Integrate T11.
8. Run T12–T15 concurrently.
9. Run T09 against the integrated backend.
10. Run T16 against a clean database and production-like same-origin routing.
11. Perform independent security and acceptance review.
12. Declare completion only after every exit criterion has evidence.

## Agent Tasks Ready For Assignment

### T01 — Audit foundation

**GOAL:** Make `AuditLog` a safe centralized foundation for Phase 1 authentication and identity mutations.

**CONTEXT:** Existing writes are ad hoc and the model lacks controlled vocabulary, metadata, and centralized redaction.

**SCOPE:** Add controlled actor/event constants, metadata, recursive secret redaction, a `record_audit_event` service, and supported-interface immutability. Preserve existing callers/data.

**CONSTRAINTS:** No generic model signals or CMS-wide auditing. Never store passwords, cookies, session IDs, CSRF values, authorization headers, or reset secrets.

**RELEVANT FILES:** `backend/apps/core/models.py`, `backend/apps/content/services.py`, retention purge command, `backend/apps/core/admin.py`.

**EXPECTED FILES TO CHANGE:** Core audit model/service/tests, one core migration, existing audit call sites if necessary.

**ACCEPTANCE CRITERIA:** One audit service; transaction participation; recursive redaction; existing audit callers still work; supported Admin/API interfaces cannot add/edit/delete audit rows; migration preserves existing data.

**VERIFICATION COMMANDS:**

```bash
python backend/manage.py makemigrations --check --dry-run
python backend/manage.py check
python -m pytest backend/apps/core backend/apps/content backend/apps/forms -q
```

**NON-GOALS:** Log shipping, retention, agent identity, comprehensive CMS auditing.

**DEPENDENCIES:** None.

**PARALLELIZATION SAFETY:** Safe with T02/T10. Exclusively owns the core audit migration.

### T02 — Authorization and default-role foundation

**GOAL:** Establish Admin admission, edit/publish separation, safe permission catalog rules, and default roles.

**CONTEXT:** Groups and assignments are empty; only generic model permissions exist.

**SCOPE:** Add `apps.accounts`, `access_admin`, `publish_contenttranslation`, necessary private-file capability, safe role definitions, and idempotent role provisioning.

**CONSTRAINTS:** Keep `auth.User`; do not expose superuser as a role; no object-level or locale scopes; no RBAC package.

**RELEVANT FILES:** `backend/config/settings/base.py`, content/forms models and migrations.

**EXPECTED FILES TO CHANGE:** New accounts app/migrations/tests, installed-app setting, content/forms permission declarations and migrations.

**ACCEPTANCE CRITERIA:** Editor, Publisher, User Manager, and Auditor provision idempotently; all have `access_admin`; only Publisher has publish; unsafe permissions are excluded; clean and upgraded databases converge.

**VERIFICATION COMMANDS:**

```bash
python backend/manage.py migrate --noinput
python backend/manage.py makemigrations --check --dry-run
python -m pytest backend/apps/accounts -q
```

**NON-GOALS:** Object/locale scopes, API keys, agent accounts, MFA.

**DEPENDENCIES:** None.

**PARALLELIZATION SAFETY:** Safe with T01/T10; owns accounts and content/forms permission migrations.

### T03 — Session authentication API

**GOAL:** Provide secure CSRF, login, current-session, and logout APIs.

**CONTEXT:** Django session infrastructure exists but React auth endpoints do not.

**SCOPE:** Implement `/api/v1/admin/auth/csrf`, `/login`, `/session`, and `/logout`; credentialed development CORS; login throttling; authentication audit events.

**CONSTRAINTS:** Session cookies only. Login/logout explicitly CSRF-protected. Only active `access_admin` users or superusers may establish Admin sessions.

**RELEVANT FILES:** Auth/session settings, `config/urls.py`, `config/api.py`, T01/T02 services.

**EXPECTED FILES TO CHANGE:** Accounts auth API/serializers/throttles/tests/URLs, CORS setting, one central URL include.

**ACCEPTANCE CRITERIA:** Anonymous CSRF bootstrap; CSRF denial; session rotation; safe user/role/permission session response; CSRF logout; login throttling; redacted audit; public APIs remain anonymous.

**VERIFICATION COMMANDS:**

```bash
python -m pytest backend/apps/accounts -q
python backend/manage.py check
python backend/manage.py spectacular --file /tmp/auth-schema.yml --validate
```

**NON-GOALS:** JWT, OAuth, MFA, reset email, persistent lockout.

**DEPENDENCIES:** T01, T02.

**PARALLELIZATION SAFETY:** Safe beside T04–T08 after dependencies; owns auth modules and initial accounts URLs.

### T04 — User management API

**GOAL:** Add audited permission-protected management of ordinary CMS users.

**CONTEXT:** Only Django Admin currently manages users.

**SCOPE:** Paginated list/detail, create, patch, activate/deactivate, password setting, and group assignment.

**CONSTRAINTS:** No hard delete; no API changes to `is_staff` or `is_superuser`; no password hashes; enforce capability ceilings and self-lockout protection.

**RELEVANT FILES:** Django User/Group, T01 audit, T02 authorization helpers.

**EXPECTED FILES TO CHANGE:** Accounts user services/serializers/API/tests and narrow URL additions.

**ACCEPTANCE CRITERIA:** Operation-specific permissions; `set_password`; validated identities; atomic audited roles; superuser protection; permission ceiling; self-lockout denial; deterministic search/pagination.

**VERIFICATION COMMANDS:**

```bash
python -m pytest backend/apps/accounts -k user -q
python backend/manage.py check
```

**NON-GOALS:** Invitations, verification, avatars, profiles, MFA, hard deletion.

**DEPENDENCIES:** T01, T02, shared T03 session permission class when available.

**PARALLELIZATION SAFETY:** Safe beside T05–T08 with exclusive `user_*` ownership.

### T05 — Role and permission API

**GOAL:** Manage Groups as roles without privilege escalation.

**CONTEXT:** No role API or safe catalog exists.

**SCOPE:** Paginated role list/detail, create, rename, permission replacement, delete-unassigned, and grouped permission catalog.

**CONSTRAINTS:** Never expose/grant unsafe framework permissions. Non-superusers grant only permissions they possess. Administrator is not a Group.

**RELEVANT FILES:** T02 role definitions/catalog and Django Group/Permission.

**EXPECTED FILES TO CHANGE:** Accounts role services/serializers/API/tests and narrow URL additions.

**ACCEPTANCE CRITERIA:** Unique names; transactional audited changes; assigned roles cannot be deleted; default protections tested; stable catalog identifiers; escalation denied; next session reflects changes.

**VERIFICATION COMMANDS:**

```bash
python -m pytest backend/apps/accounts -k "role or permission" -q
python backend/manage.py check
```

**NON-GOALS:** Nested roles, denies, object/locale scopes.

**DEPENDENCIES:** T01, T02, T03 permission class when available.

**PARALLELIZATION SAFETY:** Safe beside T04/T06–T08 with exclusive `role_*` ownership.

### T06 — Audit query API

**GOAL:** Provide a read-only filterable Admin audit endpoint.

**CONTEXT:** Audit is currently visible only in Django Admin.

**SCOPE:** Paginated list/detail with actor, action, object, actor type, and date filters.

**CONSTRAINTS:** Require `core.view_auditlog`; no mutations; return persisted redacted data only.

**RELEVANT FILES:** Core audit model/service and API error conventions.

**EXPECTED FILES TO CHANGE:** Core Admin audit API/serializers/tests and URL registration.

**ACCEPTANCE CRITERIA:** Anonymous/unauthorized denial; combined filters; deterministic ordering; safe JSON; POST/PATCH/DELETE unavailable.

**VERIFICATION COMMANDS:**

```bash
python -m pytest backend/apps/core -k audit -q
python backend/manage.py spectacular --file /tmp/audit-schema.yml --validate
```

**NON-GOALS:** Export, SIEM, retention, cross-database search.

**DEPENDENCIES:** T01, T02, T03.

**PARALLELIZATION SAFETY:** Owns its core Admin audit modules.

### T07 — Dashboard aggregation API

**GOAL:** Provide small read-only Phase 1 operational metrics.

**CONTEXT:** Counts are available from users, content workflow, submissions, and revalidation events.

**SCOPE:** One `/api/v1/admin/dashboard` endpoint with stable widget objects.

**CONSTRAINTS:** Require `accounts.view_dashboard`; omit widgets whose underlying data the caller cannot view; avoid unbounded queries/caching complexity.

**RELEVANT FILES:** User, ContentTranslation, FormSubmission, RevalidationEvent models.

**EXPECTED FILES TO CHANGE:** Core dashboard aggregation/API/serializers/tests and URL registration.

**ACCEPTANCE CRITERIA:** Permission-appropriate user, workflow, new-submission, and revalidation counts; no leaked counts; aggregate-only queries; stable widget contract; no writes/audit.

**VERIFICATION COMMANDS:**

```bash
python -m pytest backend/apps/core -k dashboard -q
python backend/manage.py spectacular --file /tmp/dashboard-schema.yml --validate
```

**NON-GOALS:** Analytics, historical charts, customizable dashboards.

**DEPENDENCIES:** T02, T03.

**PARALLELIZATION SAFETY:** Owns dashboard modules.

### T08 — Private submission-file permission hardening

**GOAL:** Replace staff-only file access with explicit permission enforcement.

**CONTEXT:** `staff_member_required` currently permits any active staff user.

**SCOPE:** Require an authenticated session and explicit file/submission viewing permission while retaining attachment behavior.

**CONSTRAINTS:** Do not change storage or public form upload behavior.

**RELEVANT FILES:** `backend/apps/forms/api.py`, forms tests, T02 permissions.

**EXPECTED FILES TO CHANGE:** Forms API/tests and possibly protected URL placement.

**ACCEPTANCE CRITERIA:** Anonymous denial; no-permission denial; authorized download; superuser access; denial does not reveal storage paths.

**VERIFICATION COMMANDS:**

```bash
python -m pytest backend/apps/forms -k private_download -q
python backend/manage.py check
```

**NON-GOALS:** Uploads, object permissions, antivirus.

**DEPENDENCIES:** T02, T03.

**PARALLELIZATION SAFETY:** Isolated to forms download behavior.

### T09 — Backend authorization regression suite

**GOAL:** Prove integrated authentication, role, user, audit, dashboard, and file boundaries.

**CONTEXT:** Feature-local tests cannot cover all escalation paths.

**SCOPE:** Matrix tests for anonymous, Editor, Publisher, User Manager, Auditor, and superuser.

**CONSTRAINTS:** Exercise APIs rather than mocking implementation. Assign behavior defects back to owning tasks.

**RELEVANT FILES:** All Phase 1 backend APIs/services and public API tests.

**EXPECTED FILES TO CHANGE:** New integration test module and fixtures only unless an owned defect is reassigned.

**ACCEPTANCE CRITERIA:** Complete allow/deny matrix; Editor/Publisher test; escalation test; self-lockout test; superuser protection; redaction/rollback; anonymous public API regression; file-permission test.

**VERIFICATION COMMANDS:**

```bash
python -m pytest -q
python backend/manage.py check
python backend/manage.py makemigrations --check --dry-run
```

**NON-GOALS:** Frontend and load tests.

**DEPENDENCIES:** T03–T08.

**PARALLELIZATION SAFETY:** Run after backend features integrate.

### T10 — Isolated React Admin shell

**GOAL:** Create a responsive accessible WordPress-familiar Admin shell without backend integration.

**CONTEXT:** The Next.js application has only public routes/layouts.

**SCOPE:** `/admin` route tree, Admin-only root layout, sidebar/drawer, header, content frame, accessible navigation, placeholder states, noindex metadata, Persian RTL presentation.

**CONSTRAINTS:** Do not modify the public locale layout/homepage. Use Admin-scoped styles. No state library. Follow `frontend/AGENTS.md` and local Next 16 documentation.

**RELEVANT FILES:** Public locale layout, fonts, brand components, Next documentation.

**EXPECTED FILES TO CHANGE:** New `src/app/admin/**`, `src/components/admin/**`, CSS modules, small shared types if necessary.

**ACCEPTANCE CRITERIA:** Independent `/admin` build; no public header/footer; keyboard navigation/drawer; visible focus/skip link/landmarks; mobile behavior; permission-filterable mocked navigation; no public rendering change.

**VERIFICATION COMMANDS:**

```bash
cd frontend
npm run lint
npm run typecheck
npm run build
```

**NON-GOALS:** Authentication, live data, editor, public redesign.

**DEPENDENCIES:** None.

**PARALLELIZATION SAFETY:** Wave 1; exclusive Admin shell/layout ownership.

### T11 — Frontend session and login integration

**GOAL:** Connect the shell to Django session/CSRF authentication.

**CONTEXT:** T03 defines auth; T10 supplies the shell.

**SCOPE:** Admin fetch wrapper, CSRF bootstrap, login, session provider/hook, logout, loading, 401, and 403 handling.

**CONSTRAINTS:** Never store credentials/tokens in localStorage. Use `credentials: "include"`. Backend remains authoritative.

**RELEVANT FILES:** T03 API contract and T10 layout.

**EXPECTED FILES TO CHANGE:** Admin API client, auth provider/components, login route, protected layout integration.

**ACCEPTANCE CRITERIA:** CSRF before login; refresh-persistent session; valid logout; 401 login navigation; 403 denied state; non-enumerating errors; permission navigation; no browser token storage.

**VERIFICATION COMMANDS:**

```bash
cd frontend
npm run lint
npm run typecheck
npm run build
```

**NON-GOALS:** MFA, password reset, remember-me, Next-auth.

**DEPENDENCIES:** T03, T10.

**PARALLELIZATION SAFETY:** Integrate before T12–T15; owns shared Admin auth files.

### T12 — Users Admin UI

**GOAL:** Provide React screens for Phase 1 user management.

**CONTEXT:** T04 supplies APIs; T11 supplies authenticated requests.

**SCOPE:** User list/search/pagination, create/edit, activate/deactivate, password setting, role assignment, confirmation/error states.

**CONSTRAINTS:** Do not expose staff/superuser controls. Reflect backend authorization failures.

**RELEVANT FILES:** T04 contract and Admin shell patterns.

**EXPECTED FILES TO CHANGE:** Admin users routes/components/tests/styles.

**ACCEPTANCE CRITERIA:** Complete loading/empty/validation/denied/error states; no password logging/re-rendering; self-lockout message; accessible forms; permission-aware actions with safe backend denial handling.

**VERIFICATION COMMANDS:**

```bash
cd frontend
npm run lint
npm run typecheck
npm run build
npm run test -- users
```

**NON-GOALS:** Invitations, avatars, imports, deletion.

**DEPENDENCIES:** T04, T11.

**PARALLELIZATION SAFETY:** Safe with T13–T15; owns users surfaces.

### T13 — Roles and permissions Admin UI

**GOAL:** Provide role and permission management screens.

**CONTEXT:** T05 supplies the safe catalog and role APIs.

**SCOPE:** Role list, create/edit, categorized permission selection, warnings, delete-unassigned flow.

**CONSTRAINTS:** Render only the server-provided catalog; never synthesize arbitrary codenames.

**RELEVANT FILES:** T05 contract and Admin shell.

**EXPECTED FILES TO CHANGE:** Admin roles routes/components/tests/styles.

**ACCEPTANCE CRITERIA:** Grouped/searchable permissions; visible Editor/Publisher distinction; deletion conflict handling; escalation denial; explicit save and server-confirmed state.

**VERIFICATION COMMANDS:**

```bash
cd frontend
npm run lint
npm run typecheck
npm run build
npm run test -- roles
```

**NON-GOALS:** Nested roles, deny rules, object/locale scopes.

**DEPENDENCIES:** T05, T11.

**PARALLELIZATION SAFETY:** Safe with T12/T14/T15; owns roles surfaces.

### T14 — Dashboard UI

**GOAL:** Render the permission-aware Phase 1 dashboard.

**CONTEXT:** T07 supplies the widget contract.

**SCOPE:** Widget grid, status treatment, destinations, loading/empty/error/denied states, responsive behavior.

**CONSTRAINTS:** Render only returned widgets; do not calculate counts client-side.

**RELEVANT FILES:** T07 contract and Admin shell.

**EXPECTED FILES TO CHANGE:** Admin dashboard page/components/tests/styles.

**ACCEPTANCE CRITERIA:** Usable at 1440/768/390px; missing unauthorized widgets do not break layout; status not color-only; links target implemented/existing destinations.

**VERIFICATION COMMANDS:**

```bash
cd frontend
npm run lint
npm run typecheck
npm run build
npm run test -- dashboard
```

**NON-GOALS:** Analytics charts, customization, live polling.

**DEPENDENCIES:** T07, T11.

**PARALLELIZATION SAFETY:** Safe with other feature UIs.

### T15 — Audit viewer UI

**GOAL:** Provide a read-only audit trail screen.

**CONTEXT:** T06 supplies paginated/filtered audit data.

**SCOPE:** Audit table, filters, pagination, entry detail, before/after display, empty/error/denied states.

**CONSTRAINTS:** No edit/delete controls. Render JSON as escaped text; never interpret stored HTML.

**RELEVANT FILES:** T06 contract and Admin shell.

**EXPECTED FILES TO CHANGE:** Admin audit routes/components/tests/styles.

**ACCEPTANCE CRITERIA:** Readable actor/action/target/type/time; URL-synchronized filters; safe accessible JSON detail; stable pagination; no mutations.

**VERIFICATION COMMANDS:**

```bash
cd frontend
npm run lint
npm run typecheck
npm run build
npm run test -- audit
```

**NON-GOALS:** Export, visual diffs, retention controls, deletion.

**DEPENDENCIES:** T06, T11.

**PARALLELIZATION SAFETY:** Safe with T12–T14; owns audit surfaces.

### T16 — Phase 1 integration, frontend tests, and E2E

**GOAL:** Demonstrate complete Phase 1 behavior on a clean database and rendered browser.

**CONTEXT:** No frontend unit/E2E harness currently exists.

**SCOPE:** Add the smallest suitable frontend and browser test setup; deterministic test users/roles; test login, dashboard, users, roles, audit, denial, logout, and public-route regression.

**CONSTRAINTS:** Test dependencies only; no application state library; no production data; do not weaken CSRF/permissions.

**RELEVANT FILES:** Frontend package scripts/lockfile, integrated Admin routes/APIs, Django test settings.

**EXPECTED FILES TO CHANGE:** Test configuration/specs, lockfile, test-only fixtures/settings if needed, generated schema once.

**ACCEPTANCE CRITERIA:** Clean migration/provisioning; Editor denial/Publisher allowance; User Manager escalation denial; Auditor journey; login/refresh/logout/401/403; three viewport checks; FA/EN/AR-AE public smoke tests; all checks pass.

**VERIFICATION COMMANDS:**

```bash
python backend/manage.py migrate --noinput
python backend/manage.py check
python backend/manage.py makemigrations --check --dry-run
python -m pytest -q
python backend/manage.py spectacular --file /tmp/abrit-phase1-schema.yml --validate

cd frontend
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
```

**NON-GOALS:** Load testing, deployment, visual editor, AI/MCP testing.

**DEPENDENCIES:** T03–T15.

**PARALLELIZATION SAFETY:** Final integration task; run against the merged Phase 1 branch.
