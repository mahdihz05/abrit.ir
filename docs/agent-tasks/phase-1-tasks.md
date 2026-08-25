# AbrIT Phase 1 Shared Task Board

Sources:

- `docs/agent-reports/phase-1-plan-aprove.md`
- `docs/agent-reports/phase-1-plan-v2-review.md`

## Readiness Verification

Overall Status: **BLOCKED**

The filename supplied by the owner identifies the intended approved plan, but implementation is not cleared by the documents themselves:

- The plan says it is “planning only” and does not authorize implementation.
- The plan lists five readiness gates without completion evidence.
- The review verdict is “READY WITH CHANGES” and says not to start feature implementation until eight blocking issues are incorporated.
- The approved plan file present in the repository is `docs/agent-reports/phase-1-plan-aprove.md`; it identifies itself internally as Version 2 and is used here as the plan source.

Accordingly, implementation tasks R01–R18 remain `BLOCKED` and `UNASSIGNED`. This board incorporates the review corrections into the affected task definitions, but it does not itself approve implementation or satisfy the Wave 0 gates. R00 alone has been explicitly claimed as a non-implementation readiness task so it can record the missing evidence; no implementation task may be claimed until R00 is reviewed and marked `DONE`.

## Blocking Conditions

- B01: Define the complete published-content mutation boundary, including change forms, inlines, blocks, archive/deactivation, scheduling, and already-published objects.
- B02: Make arbitrary Django Group creation, mutation, and assignment unavailable through supported Phase 1 interfaces; role assignment must replace the complete Group set.
- B03: Freeze a non-enumerating lockout response and a trusted client-IP/proxy rule.
- B04: Make every user endpoint explicitly superuser-only, remove conditional response fields, and define nullable session roles.
- B05: Correct migration ownership from stale T-identifiers to R02, R03, and R05.
- B06: Run R00 in the approved dedicated worktree `/mnt/c/projects/abrit-r00` on branch `feat/p1-r00-readiness`; use the primary repository `/mnt/c/projects/abrit.ir` only as reference and integration context, and do not modify `master` directly.
- B07: Assign the initial protected Admin/auth URL include to R05 and let R13 extend it.
- B08: Assign `content/services.py` to R02, publication Admin/forms/helpers to R03, and expand negative/security tests.
- G01: Record approval for same-origin `/cms`, the React/Django Admin split, and the fixed-role/superuser-only model.
- G02: Resolve or isolate the dirty/line-ending baseline without discarding user-owned changes.
- G03: Establish a supported Python environment and record the untouched baseline using fully disposable paths.

## Execution Rules

1. An agent may only claim tasks in its assigned scope.
2. An agent may only claim tasks with Status = READY.
3. An agent must write its agent name into Owner before starting.
4. An agent must change Status to IN_PROGRESS before modifying code.
5. An agent must not work on BLOCKED tasks.
6. An agent must not claim a task owned by another agent.
7. On completion, change Status to REVIEW, not DONE.
8. Only reviewer/integration flow may mark DONE.

## Tasks

### R00 — Repository baseline and verification environment

- **Primary scope:** other
- **Status:** CLAIMED
- **Owner:** phase1-readiness-agent
- **Blocked by:** None for non-implementation readiness work; R01–R18 remain blocked by the gates R00 must document.
- **Blocking reason:** None for R00. The coordinator explicitly authorized preparation and claiming of this readiness-only task; this does not authorize application implementation.
- **Unlock condition:** Satisfied for R00 by the coordinator's explicit claim instruction. R00 must record B01–B08/G01 disposition before it can pass review.
- **Required predecessor tasks:** None.
- **Blocker category:** planning; architecture (cleared for R00 execution only).
- **Dependencies:** None; owner decisions and B01–B08/G01 evidence are deliverables of R00, and B06 requires execution in the approved dedicated worktree.
- **Execution context:** Branch `feat/p1-r00-readiness`; worktree `/mnt/c/projects/abrit-r00`; primary repository `/mnt/c/projects/abrit.ir` for reference and integration context only. All R00 application changes must happen only in the dedicated worktree, and R00 must not modify `master` directly.
- **Scope:** In the approved dedicated worktree, preserve user changes, resolve or isolate the dirty baseline, record the baseline commit and approvals, establish a supported POSIX Python environment, and prove that all verification artifacts remain under a disposable root. Do not change application behavior.
- **Relevant files:** `.gitignore`, `requirements.txt`, `frontend/package.json`, `scripts/`, `docs/agent-reports/`, repository status.
- **Acceptance criteria:** Intended baseline is clean and recorded; all charter/topology/role approvals have evidence; existing backend and frontend checks are recorded; no current SQLite/media/cache/schema state is modified; verification wrapper rejects unset or unsafe paths and contains pytest, cache, media, schema, and migration artifacts.
- **Verification commands:** `git status --short`; `test -x .runtime/phase1-venv/bin/python`; `scripts/check-phase1.sh --baseline`.

### R01 — API contract and frontend test foundation

- **Primary scope:** tests
- **Status:** BLOCKED
- **Owner:** UNASSIGNED
- **Blocked by:** R00 and the unresolved frozen-contract correction in B04.
- **Blocking reason:** Test fixtures and shared types cannot be reliable until the baseline is reproducible and the user/session contracts are unambiguous.
- **Unlock condition:** R00 is DONE and the approved contract explicitly makes user endpoints superuser-only, removes conditional fields, and permits nullable session roles.
- **Required predecessor tasks:** R00.
- **Blocker category:** planning; API dependency; test/security dependency.
- **Dependencies:** R00; B04; approved frozen API contracts.
- **Scope:** Add the frontend unit/component/accessibility harness, E2E startup scaffolding, shared Admin API types, mocks, fixtures, and deterministic scripts. This task exclusively owns frontend package and lock files.
- **Relevant files:** `frontend/package.json`, `frontend/package-lock.json`, `frontend/next.config.ts`, new frontend test configuration, shared Admin contract types and fixtures.
- **Acceptance criteria:** `test` and `test:e2e` scripts exist; one component accessibility test and one route smoke test pass; fixtures cover success and stable error responses; later frontend tasks require no package edits; ports and base URLs are configurable.
- **Verification commands:** `cd frontend && npm run lint`; `cd frontend && npm run typecheck`; `cd frontend && npm run test`; `cd frontend && npm run build`; `cd frontend && npm run test:e2e -- --list`.

### R02 — Focused audit foundation

- **Primary scope:** audit
- **Status:** BLOCKED
- **Owner:** UNASSIGNED
- **Blocked by:** R00 and unresolved ownership/migration corrections B05 and B08.
- **Blocking reason:** Audit migration and `content/services.py` ownership must be exclusive, and migration verification needs the disposable baseline established by R00.
- **Unlock condition:** R00 is DONE and the approved plan assigns the next core migration and `content/services.py` to R02 using disposable clean/upgrade databases.
- **Required predecessor tasks:** R00.
- **Blocker category:** planning; repository state; migration/schema.
- **Dependencies:** R00; B05; B08.
- **Scope:** Centralize Phase 1 audit writes with controlled actions, metadata, recursive secret redaction, atomic behavior, and read-only supported interfaces. Migrate existing content and retention callers. Own the next core audit migration and `backend/apps/content/services.py`.
- **Relevant files:** `backend/apps/core/models.py`, `backend/apps/core/admin.py`, new core audit service/tests/migration, `backend/apps/content/services.py`, `backend/apps/forms/management/commands/purge_expired_submissions.py`.
- **Acceptance criteria:** Nested secrets are redacted; domain changes and required audit writes commit or roll back together; audit records are immutable in Admin; existing content/retention events are preserved; clean and upgrade migrations pass without editing initial migrations.
- **Verification commands:** `scripts/check-phase1.sh --backend`; `.runtime/phase1-venv/bin/python -m pytest -q backend/apps/core backend/apps/content backend/apps/forms`.

### R03 — Fixed authorization and Django Admin publication boundary

- **Primary scope:** backend
- **Status:** BLOCKED
- **Owner:** UNASSIGNED
- **Blocked by:** R00 and unresolved publication, Group, migration, and file-ownership decisions B01, B02, B05, and B08.
- **Blocking reason:** The current plan does not close all Django Admin publication bypasses or arbitrary Group escalation paths, and its migration ownership references are stale.
- **Unlock condition:** R00 is DONE and an approved plan freezes the full publication boundary, read-only Group policy, full-Group replacement rule, R03 migration ownership, and Admin/forms/helper ownership.
- **Required predecessor tasks:** R00.
- **Blocker category:** architecture; repository state; migration/schema; test/security dependency.
- **Dependencies:** R00; B01; B02; B05; B08; approved role matrix.
- **Scope:** Add the accounts capability app, exact fixed-role definitions, idempotent post-migrate provisioning, sync command, staff synchronization, and immutable Group/User Admin behavior. Own `accounts/0001`, the next content permission migration, and the full Django Admin publication boundary in content Admin/forms/helpers.
- **Relevant files:** `backend/config/settings/base.py`, new `backend/apps/accounts/`, `backend/apps/content/models.py`, `backend/apps/content/admin.py`, content Admin forms/helpers/tests and next content migration, Django auth Admin customization.
- **Acceptance criteria:** Exact role matrix provisions on clean, upgrade, repeat, and temporarily missing-permission paths; all Group management is read-only in supported interfaces; assigning a fixed role replaces all Groups and removes direct permissions; direct saves cannot enter/leave `published`; Editors cannot change published translations/blocks or deactivate published content; Publisher-only publication/archive/scheduling paths use audited/revalidated services; crafted form, inline, block, archive, workflow-field, extra-Group, and direct-permission bypass tests pass.
- **Verification commands:** `scripts/check-phase1.sh --backend`; `.runtime/phase1-venv/bin/python -m pytest -q backend/apps/accounts backend/apps/content`; `.runtime/phase1-venv/bin/python backend/manage.py makemigrations --check --dry-run` with the disposable database environment set by the wrapper.

### R04 — Tested React Admin shell

- **Primary scope:** frontend
- **Status:** BLOCKED
- **Owner:** UNASSIGNED
- **Blocked by:** R00 and R01.
- **Blocking reason:** The shell requires a clean baseline plus the shared contract types, mocks, accessibility harness, and package-owned test tooling from R01.
- **Unlock condition:** R00 and R01 are DONE and the R01 frontend test/contract foundation is integrated.
- **Required predecessor tasks:** R00; R01.
- **Blocker category:** repository state; frontend dependency; test/security dependency.
- **Dependencies:** R00; R01.
- **Scope:** Build an isolated `/admin` RTL shell with noindex metadata, sidebar/drawer/header/content frame, skip link, permission-filtered mock states, loading/denied states, and an extension-point navigation registry.
- **Relevant files:** `frontend/src/app/admin/`, new Admin shell components and scoped styles/tests, `frontend/src/app/fonts.ts`, `frontend/src/components/brand.tsx`, `frontend/AGENTS.md`.
- **Acceptance criteria:** Shell is keyboard operable, focus-safe, accessible, and responsive at 1440/768/390 widths; public header/footer do not render in Admin; public-route smoke tests pass; package, lock, public layout, and shared contract files are untouched.
- **Verification commands:** `cd frontend && npm run lint`; `cd frontend && npm run typecheck`; `cd frontend && npm run test`; `cd frontend && npm run build`.

### R05 — Session, CSRF, proxy, and persistent-lockout API

- **Primary scope:** backend
- **Status:** BLOCKED
- **Owner:** UNASSIGNED
- **Blocked by:** R02, R03, unresolved lockout/proxy rule B03, migration correction B05, URL ownership correction B07, and approved topology evidence.
- **Blocking reason:** Authentication depends on integrated audit and authorization foundations and cannot safely freeze lockout, proxy, migration, or routing behavior while those contracts remain open.
- **Unlock condition:** R02 and R03 are DONE; the approved plan defines non-enumerating lockout and trusted client-IP behavior; R05 owns the lockout migration and initial protected Admin/auth include; topology approval is recorded.
- **Required predecessor tasks:** R02; R03.
- **Blocker category:** architecture; migration/schema; API dependency; test/security dependency.
- **Dependencies:** R02; R03; B03; B05; B07; approved topology.
- **Scope:** Implement the initial `/api/v1/admin/` auth URL include, session/CSRF endpoints, proxy/cookie settings, persistent account lockout, unknown-user throttling, trusted client-IP extraction, unlock recovery, JSON CSRF failures, and focused auth audit events.
- **Relevant files:** new accounts security model/migration/services/auth API/tests/URLs, `backend/config/urls.py`, `backend/config/settings/base.py`, `backend/config/settings/production.py`, CSRF failure view, unlock command.
- **Acceptance criteria:** Wrong password, unknown username, inactive account, and locked account with an incorrect password are indistinguishable; `account_locked` is exposed only under the frozen non-enumerating rule; five concurrent-safe failures lock for 15 minutes; expiry/unlock/success-reset/cache-failure paths pass; trusted and spoofed proxy headers are tested; cookie/CSRF/session rotation and exact 401/403/429 contracts pass; public endpoints remain anonymous; audit data contains no secrets.
- **Verification commands:** `scripts/check-phase1.sh --backend`; `.runtime/phase1-venv/bin/python -m pytest -q backend/apps/accounts`; `.runtime/phase1-venv/bin/python backend/manage.py spectacular --file "$ABRIT_VERIFY_DIR/schema.yml" --validate` through the verification wrapper; production-like proxy integration command defined by R00.

### R06 — Read-only role and permission catalog API

- **Primary scope:** backend
- **Status:** BLOCKED
- **Owner:** UNASSIGNED
- **Blocked by:** R05.
- **Blocking reason:** The catalog must use the integrated protected API authentication, permission, error, and URL conventions established by R05.
- **Unlock condition:** R05 is DONE and its protected API base and session contract are integrated.
- **Required predecessor tasks:** R05.
- **Blocker category:** API dependency.
- **Dependencies:** R05.
- **Scope:** Add authorized, deterministic, schema-annotated `/roles`, `/roles/{key}`, and `/permissions` read endpoints in a feature-specific URL module.
- **Relevant files:** new accounts role catalog serializers/views/tests/URLs, R03 role definitions, R05 protected API base.
- **Acceptance criteria:** Responses match the frozen fields and provisioned matrix; `SessionUser.role` assumptions allow null for superusers/legacy accounts; unauthorized calls are denied; POST/PATCH/DELETE routes do not exist; OpenAPI validates.
- **Verification commands:** `.runtime/phase1-venv/bin/python -m pytest -q backend/apps/accounts`; `scripts/check-phase1.sh --schema`.

### R07 — Superuser-only user management API

- **Primary scope:** backend
- **Status:** BLOCKED
- **Owner:** UNASSIGNED
- **Blocked by:** R06 and the user/session contract correction B04.
- **Blocking reason:** User role assignment consumes the finalized role catalog, and all user endpoint authorization and response fields must be frozen before implementation.
- **Unlock condition:** R06 is DONE and the approved contract makes all user endpoints superuser-only, removes conditional fields, and defines nullable roles.
- **Required predecessor tasks:** R06.
- **Blocker category:** planning; API dependency; test/security dependency.
- **Dependencies:** R06; B04.
- **Scope:** Implement list/detail/create/patch/password/activation user operations, pagination/search/filter/order, one-role assignment, staff synchronization, self/superuser protection, and atomic audit.
- **Relevant files:** new accounts user services, serializers, views, tests, and feature URL module; R02 audit service; R03 role service; R06 catalog.
- **Acceptance criteria:** Every user endpoint, including both GET endpoints, is superuser-only; frozen responses omit conditional fields and define nullable roles; password validators and `set_password` are used; self and superuser protections hold; role assignment replaces all Groups and direct permissions; mutations and audit roll back together; DELETE and privileged-field writes are unavailable; schema validates.
- **Verification commands:** `.runtime/phase1-venv/bin/python -m pytest -q backend/apps/accounts`; `scripts/check-phase1.sh --backend --schema`.

### R08 — Read-only audit query API

- **Primary scope:** audit
- **Status:** BLOCKED
- **Owner:** UNASSIGNED
- **Blocked by:** R05.
- **Blocking reason:** Audit reads require R05's integrated protected-session behavior, common error envelopes, and Admin API base; the R02 audit foundation is already a transitive prerequisite through R05.
- **Unlock condition:** R05 is DONE and the protected audit permission/error contract is available.
- **Required predecessor tasks:** R05.
- **Blocker category:** API dependency.
- **Dependencies:** R05.
- **Scope:** Add permission-protected audit list/detail endpoints with pagination, filtering, date parsing, deterministic order, and schema annotations.
- **Relevant files:** new core audit API serializers/views/tests/URLs, R02 audit model/service.
- **Acceptance criteria:** Exact envelopes and combined filters pass; anonymous receives 401 and unauthorized authenticated users receive 403; only stored redacted/escaped data is returned; no mutation or export route exists; OpenAPI validates.
- **Verification commands:** `.runtime/phase1-venv/bin/python -m pytest -q backend/apps/core`; `scripts/check-phase1.sh --schema`.

### R09 — Dashboard aggregation API

- **Primary scope:** backend
- **Status:** BLOCKED
- **Owner:** UNASSIGNED
- **Blocked by:** R05.
- **Blocking reason:** Dashboard authorization and response semantics require the integrated protected API base and session handling from R05.
- **Unlock condition:** R05 is DONE and `accounts.view_dashboard` behavior is available through the protected API foundation.
- **Required predecessor tasks:** R05.
- **Blocker category:** API dependency.
- **Dependencies:** R05.
- **Scope:** Return the frozen users/content/submissions/revalidation aggregate object to callers with `accounts.view_dashboard`.
- **Relevant files:** new core dashboard service/API/tests/URL module, user/security, content, forms, and revalidation models.
- **Acceptance criteria:** Exact object and fixture counts pass; 401/403 behavior is explicit; aggregate queries are bounded; no widget omission, write, cache, trend, or audit behavior is added.
- **Verification commands:** `.runtime/phase1-venv/bin/python -m pytest -q backend/apps/core`; `scripts/check-phase1.sh --backend --schema`.

### R10 — Private submission-file authorization

- **Primary scope:** backend
- **Status:** BLOCKED
- **Owner:** UNASSIGNED
- **Blocked by:** R05.
- **Blocking reason:** The download hardening needs the integrated authentication/permission boundary; the fixed permission matrix is a transitive prerequisite through R03 and R05.
- **Unlock condition:** R05 is DONE and `forms.view_submissionfile` is present in the integrated fixed-role authorization model.
- **Required predecessor tasks:** R05.
- **Blocker category:** API dependency; test/security dependency.
- **Dependencies:** R05.
- **Scope:** Replace broad staff access to the existing download route with explicit `forms.view_submissionfile` authorization while preserving legacy download behavior.
- **Relevant files:** `backend/apps/forms/views.py`, `backend/apps/forms/tests.py`, existing forms URL configuration.
- **Acceptance criteria:** Anonymous access redirects to the legacy Admin login; authenticated callers without permission receive 403; permitted users and superusers can download; paths and storage details are not disclosed; no storage/upload redesign or forms migration is introduced.
- **Verification commands:** `.runtime/phase1-venv/bin/python -m pytest -q backend/apps/forms`; `.runtime/phase1-venv/bin/python backend/manage.py check` with disposable settings.

### R11 — Frontend session and login integration

- **Primary scope:** frontend
- **Status:** BLOCKED
- **Owner:** UNASSIGNED
- **Blocked by:** R04 and R05.
- **Blocking reason:** Frontend authentication requires both the tested Admin shell and a live centrally registered backend session/CSRF contract.
- **Unlock condition:** R04 and R05 are DONE and the R05 auth routes work through the central URL configuration.
- **Required predecessor tasks:** R04; R05.
- **Blocker category:** API dependency; frontend dependency.
- **Dependencies:** R04; R05.
- **Scope:** Connect the Admin shell to credentialed CSRF/session/login/logout flows and render loading, expiry, denied, locked, throttled, and permission-filtered states.
- **Relevant files:** new Admin auth client/provider/login routes/components/tests, R01 contract types, R04 shell.
- **Acceptance criteria:** Live auth works through R05's centrally registered path before R13; requests include credentials and correct CSRF headers; session refresh, 401 transition, 403 preservation, and logout pass; login is keyboard accessible; no token is stored in localStorage/sessionStorage/cookies managed by JavaScript; package/navigation files are untouched.
- **Verification commands:** `cd frontend && npm run lint`; `cd frontend && npm run typecheck`; `cd frontend && npm run test`; `cd frontend && npm run build`; `cd frontend && npm run test:e2e -- --grep auth`.

### R12 — Independent backend security matrix

- **Primary scope:** tests
- **Status:** BLOCKED
- **Owner:** UNASSIGNED
- **Blocked by:** R06, R07, R08, R09, and R10.
- **Blocking reason:** An independent cross-role matrix is meaningful only after every protected backend feature is integrated and stable.
- **Unlock condition:** R06–R10 are DONE and their feature tests and schemas pass in the disposable environment.
- **Required predecessor tasks:** R06; R07; R08; R09; R10.
- **Blocker category:** test/security dependency; integration dependency.
- **Dependencies:** R06; R07; R08; R09; R10.
- **Scope:** Add reviewer-authored cross-role and negative integration tests for anonymous, every fixed role, superuser, locked, inactive, and no-role users, plus public regressions and audit rollback/redaction.
- **Relevant files:** new backend integration/security tests and fixtures; outputs of R02–R10; existing public API tests.
- **Acceptance criteria:** Every sensitive operation has allow/deny evidence; crafted publication change-form, inline, block edit/delete, archive, scheduling, and workflow-field bypasses fail correctly; arbitrary/extra Groups and direct permissions cannot bypass policy; lockout equivalence/concurrency/proxy cases pass; user GET authorization and nullable session roles pass; missing-permission provisioning passes; public anonymous APIs remain unchanged.
- **Verification commands:** `scripts/check-phase1.sh --backend`; `.runtime/phase1-venv/bin/python -m pytest -q`; `.runtime/phase1-venv/bin/python backend/manage.py makemigrations --check --dry-run` through the wrapper.

### R13 — URL, OpenAPI, frontend-type, and navigation integration

- **Primary scope:** integration
- **Status:** BLOCKED
- **Owner:** UNASSIGNED
- **Blocked by:** R06, R07, R08, R09, R10, R11, and R12; URL ownership correction B07.
- **Blocking reason:** Shared URL, OpenAPI, frontend-type, fixture, and navigation files cannot be frozen until all backend contracts pass security review and frontend session shape is stable.
- **Unlock condition:** R06–R12 are DONE, R05's initial URL include is the approved base, and all feature schemas/routes are ready for one integration pass.
- **Required predecessor tasks:** R06; R07; R08; R09; R10; R11; R12.
- **Blocker category:** API dependency; frontend dependency; test/security dependency; integration dependency.
- **Dependencies:** R06; R07; R08; R09; R10; R11; R12; B07.
- **Scope:** Extend R05's protected URL aggregator with feature modules, validate route names/conflicts, generate the authoritative pre-UI schema, synchronize frontend types/fixtures, and add navigation entries through R04's extension interface.
- **Relevant files:** `backend/config/urls.py`, feature URL modules, `backend/schema.yml`, shared frontend Admin types/fixtures, Admin navigation registry.
- **Acceptance criteria:** All routes resolve once with no name/path conflicts; R05 auth remains live; schema validates; frontend fixtures/types exactly match it; navigation keys and permissions are frozen; no endpoint behavior or feature UI is added.
- **Verification commands:** `scripts/check-phase1.sh --backend --schema`; `cd frontend && npm run typecheck`; `cd frontend && npm run test`.

### R14 — Users screen

- **Primary scope:** frontend
- **Status:** BLOCKED
- **Owner:** UNASSIGNED
- **Blocked by:** R07, R11, and R13.
- **Blocking reason:** The screen requires the stable user API, authenticated frontend client/session, and synchronized schema/types/navigation contract.
- **Unlock condition:** R07, R11, and R13 are DONE and their integrated contract fixtures pass frontend tests.
- **Required predecessor tasks:** R07; R11; R13.
- **Blocker category:** API dependency; frontend dependency; integration dependency.
- **Dependencies:** R07; R11; R13.
- **Scope:** Build the superuser-only user list/search/filter/pagination, create/edit, password, activate/deactivate, one-role selection, confirmations, and error states.
- **Relevant files:** new `frontend/src/app/admin/` users route and feature components/tests/styles; R13 types; R11 client/session.
- **Acceptance criteria:** Forms and table are accessible; passwords are never retained; relevant 400/401/403/409 states render; role/staff results are read-only; non-superusers see the denied state; shared navigation/package/type files are untouched.
- **Verification commands:** `cd frontend && npm run lint`; `cd frontend && npm run typecheck`; `cd frontend && npm run test -- users`; `cd frontend && npm run build`.

### R15 — Read-only roles and permissions screen

- **Primary scope:** frontend
- **Status:** BLOCKED
- **Owner:** UNASSIGNED
- **Blocked by:** R06, R11, and R13.
- **Blocking reason:** The screen requires the stable role catalog, authenticated frontend client/session, and synchronized schema/types/navigation contract.
- **Unlock condition:** R06, R11, and R13 are DONE and the integrated read-only role fixtures pass frontend tests.
- **Required predecessor tasks:** R06; R11; R13.
- **Blocker category:** API dependency; frontend dependency; integration dependency.
- **Dependencies:** R06; R11; R13.
- **Scope:** Build role list/detail and categorized/searchable permissions with staff requirements, immutable/reserved messaging, and loading/denied/error states.
- **Relevant files:** new Admin roles route and feature components/tests/styles; R13 types; R11 client.
- **Acceptance criteria:** Matrix exactly matches the API; Editor/Publisher difference is visible; reserved/read-only status is unmistakable; search/sections are accessible; no mutation controls or shared-file edits are added.
- **Verification commands:** `cd frontend && npm run lint`; `cd frontend && npm run typecheck`; `cd frontend && npm run test -- roles`; `cd frontend && npm run build`.

### R16 — Dashboard screen

- **Primary scope:** frontend
- **Status:** BLOCKED
- **Owner:** UNASSIGNED
- **Blocked by:** R09, R11, and R13.
- **Blocking reason:** The screen requires the stable dashboard API, authenticated frontend client/session, and synchronized schema/types/navigation contract.
- **Unlock condition:** R09, R11, and R13 are DONE and dashboard fixtures/types match the integrated API.
- **Required predecessor tasks:** R09; R11; R13.
- **Blocker category:** API dependency; frontend dependency; integration dependency.
- **Dependencies:** R09; R11; R13.
- **Scope:** Render users/content/submissions/revalidation cards and all loading, denied, empty, and error states.
- **Relevant files:** new Admin dashboard route/components/tests/styles; R13 types; R11 client.
- **Acceptance criteria:** Exact fields render without client-side count calculation; status is not color-only; 1440/768/390 layouts are accessible and have no horizontal overflow; no charts, polling, or shared-file edits are added.
- **Verification commands:** `cd frontend && npm run lint`; `cd frontend && npm run typecheck`; `cd frontend && npm run test -- dashboard`; `cd frontend && npm run build`.

### R17 — Read-only audit screen

- **Primary scope:** frontend
- **Status:** BLOCKED
- **Owner:** UNASSIGNED
- **Blocked by:** R08, R11, and R13.
- **Blocking reason:** The screen requires the stable audit query API, authenticated frontend client/session, and synchronized schema/types/navigation contract.
- **Unlock condition:** R08, R11, and R13 are DONE and redacted audit fixtures/types match the integrated API.
- **Required predecessor tasks:** R08; R11; R13.
- **Blocker category:** API dependency; frontend dependency; integration dependency.
- **Dependencies:** R08; R11; R13.
- **Scope:** Build audit table/detail, URL-synchronized filters, pagination, safe JSON display, and loading/empty/denied/error states.
- **Relevant files:** new Admin audit route/components/tests/styles; R13 types; R11 client.
- **Acceptance criteria:** Filters and pagination are deterministic; actor/action/target/time are readable; metadata is escaped and never interpreted as HTML; detail is keyboard accessible; no write/export or shared-file edits are added.
- **Verification commands:** `cd frontend && npm run lint`; `cd frontend && npm run typecheck`; `cd frontend && npm run test -- audit`; `cd frontend && npm run build`.

### R18 — Final production-like E2E and release evidence

- **Primary scope:** integration
- **Status:** BLOCKED
- **Owner:** UNASSIGNED
- **Blocked by:** R12, R14, R15, R16, and R17.
- **Blocking reason:** Final production-like verification can only run against the security-reviewed backend and all integrated frontend feature screens.
- **Unlock condition:** R12 and R14–R17 are DONE, the release candidate is integrated, and the disposable/proxy verification environment is available.
- **Required predecessor tasks:** R12; R14; R15; R16; R17.
- **Blocker category:** test/security dependency; integration dependency.
- **Dependencies:** R12; R14; R15; R16; R17.
- **Scope:** Run clean/upgrade disposable databases, deterministic role/user setup, same-origin `/cms` proxy topology, complete journeys, viewport/accessibility checks, public regressions, and the single final OpenAPI generation.
- **Relevant files:** integrated Phase 1, `scripts/check-phase1.sh`, E2E specifications/fixtures, `backend/schema.yml`, release evidence under `docs/agent-reports/`.
- **Acceptance criteria:** Every plan verification scenario passes; all Django Admin alternate publication paths are covered; verification proves pytest/cache/media/schema/migration artifacts remain below the disposable root; three viewports and representative public routes pass; clean and upgrade paths never touch repository data; every exit criterion has evidence; defects return to their owning task and no new feature scope is introduced.
- **Verification commands:** `scripts/check-phase1.sh --all`; `cd frontend && npm run test:e2e`; final `.runtime/phase1-venv/bin/python backend/manage.py spectacular --file "$ABRIT_VERIFY_DIR/schema.yml" --validate` through the wrapper.

## Claiming Gate

R00 is explicitly `CLAIMED` for `phase1-readiness-agent` as a non-implementation readiness task. It must move to `IN_PROGRESS` before changing any permitted documentation or readiness-support files, and then to `REVIEW`, not `DONE`. R01–R18 remain `BLOCKED` and `UNASSIGNED` until R00 reaches `DONE` through reviewer/integration flow and their listed dependencies reach `DONE`.
