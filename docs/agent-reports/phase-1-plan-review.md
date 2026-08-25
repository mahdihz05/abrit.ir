# AbrIT Phase 1 Plan Review

## Verdict

NOT READY

The architectural direction is plausible, and the plan correctly preserves Django’s user model, sessions, public APIs, existing content services, and Django Admin. However, several contracts and dependencies are unresolved or internally contradictory, so the tasks are not yet safe to assign independently.

## Blocking Issues

1. **Phase 1 scope and deployment topology are not authoritative.**  
   The existing implementation plan says Django is served from `cms.abrit.ir`, while `.env.example` describes same-origin `/cms` routing. Session-cookie, CSRF, CORS, React routing, and E2E design depend on this decision. The proposed React Admin also supersedes the repository’s earlier “customized Django Admin” direction without explicitly declaring that scope change.

2. **The permission and role matrix is incomplete and inconsistent.**  
   Before T02, specify every permission per role, including `accounts.view_dashboard`, the exact private-file permission, user/group operation permissions, and ownership/content-type of model-less permissions such as `access_admin`. T02 currently does not mention `view_dashboard`, although T07 requires it.

   The capability ceiling also creates a contradiction: a User Manager cannot assign Publisher unless it possesses Publisher’s publish permission, but possessing that permission makes the User Manager a publisher under ordinary `has_perm` authorization. Reserved/default-role mutability and deletion are also undefined.

3. **Editor/Publisher acceptance criteria cannot be implemented by the listed tasks.**  
   Phase 1 contains no React content UI or protected content mutation API, yet requires Editor editing and Publisher publishing through API-level tests. The React user API cannot set `is_staff`, so newly created Editors cannot use Django Admin either.

   More importantly, existing Django Admin publish/unpublish actions do not check the proposed custom publish permission. Introducing `publish_contenttranslation` without updating these actions would leave Editor/Publisher separation bypassable. Either:

   - explicitly enforce and test the permission in existing Django Admin and define how operators become staff; or
   - add a protected content workflow API task; or
   - remove Editor/Publisher operational acceptance from Phase 1.

4. **Wave 2 violates its own dependencies.**  
   T04 and T05 depend on the T03 permission class “when available,” while T06–T08 explicitly depend on T03, but all are placed parallel with T03. This directly conflicts with the architecture assessment’s warning not to parallelize authentication, users, roles, and permissions yet.

5. **API contracts are insufficient for independent frontend work.**  
   Freeze exact request/response schemas, pagination envelopes, stable error codes, 401-versus-403 behavior, session fields, permission identifiers, PATCH semantics, filter formats, and dashboard widget objects. Existing API conventions are not enough: DRF’s default pagination shape does not match the frontend’s simple `{data}` type, and existing endpoints use a mixture of `{data}` and `{data, meta}`.

6. **Default-role provisioning is not migration-safe as described.**  
   T02 adds permissions in `content` and `forms` while provisioning groups in `accounts`. On a clean database, standard Django permissions are created during `post_migrate`; a normal data migration cannot safely assume newly declared permissions already exist. Define an explicit strategy—such as an idempotent `post_migrate` provisioner plus management command—and test both clean and upgraded databases.

   Also, verification commands such as `manage.py migrate` must point to a temporary database. As written, they can modify the repository’s existing SQLite database.

7. **Frontend feature verification is ordered incorrectly.**  
   T12–T15 require `npm run test`, but the repository has no such script or test framework. T16 adds the harness only after those tasks. Establish the unit-test harness before T10–T15.

8. **The working baseline is not ready for worktrees.**  
   The worktree currently has numerous tracked line-ending modifications, modified initial migrations and central routing, plus untracked reports. The plan correctly recognizes this gate, but until the owner resolves or commits it, clean branches and reliable conflict detection are not possible. In addition, the documented `python` verification commands cannot run in the current environment: `python` is absent and `python3` has no Django installed.

## Non-Blocking Improvements

- State explicitly that public endpoints retain their current per-view anonymous authentication settings; do not introduce a global DRF permission default.
- Preserve the existing `auth.User`, `Group`, `Permission`, content workflow services, revision snapshots, `AuditLog`, private storage, and Django Admin fallback.
- Keep audit redaction in one core service, as proposed. Avoid signals and generic “audit every save” behavior.
- Define whether authentication audit events are “transactional” in the same sense as user/role mutations. Session persistence may complete outside the database transaction containing the audit write.
- The discovery report says there are 21 substantive backend tests; the repository currently contains 22 `test_*` functions. This does not affect architecture but should be corrected.

## Incorrect Assumptions

- Same-origin production routing is not established; repository documents disagree.
- T03–T08 are not safe in one parallel wave.
- Editor/Publisher behavior can be verified through the proposed APIs; no such content API exists.
- All required custom permissions are covered by T02; `view_dashboard` and the exact download permission are missing.
- T12–T15 can run their specified tests before T16 creates the test harness.
- The requested discovery filenames do not exist. The actual files are `discovery.md` and `architecture.md`; the Phase 1 plan correctly notes this rename.

## Missing Dependencies

- T03 depends on an approved origin/cookie/CSRF contract, not only T01/T02.
- T04 role assignment depends on the finalized T05 role lifecycle/catalog contract, or both tasks need a shared authorization foundation with no overlapping ownership.
- T06/T07 need a common protected Admin API permission/authentication base produced by T03.
- T09’s Editor/Publisher tests need an actual permission-protected publish surface.
- T10–T15 need a frontend test-foundation task.
- T11 needs stable API/error contracts and a production-like reverse-proxy test topology.
- T16 needs deterministic server startup, temporary database paths, role provisioning, browser installation, and base-URL configuration.
- The repository checklist calls for an Admin lockout policy, while T03 explicitly excludes persistent lockout. Either add it or record an approved Phase 1 deferral.

## Unsafe Parallelization

- T03, T04, and T05 all modify the accounts security boundary and likely `accounts/urls.py`.
- T04 and T05 share capability-ceiling, role-assignment, self-lockout, and reserved-role semantics.
- T06 and T07 will likely overlap a core Admin URL aggregator.
- T12–T15 may be feature-directory isolated, but each needs shared navigation definitions, API types, test configuration, and potentially shell error handling.
- Multiple tasks should not regenerate `backend/schema.yml`.
- Multiple frontend tasks should not modify `package.json` or `package-lock.json`.
- Worktrees are realistic only when each wave branches from the integrated result of its dependencies—not when all 16 branches originate from the current baseline.

## Over-Engineering

- React implementations of Users, Groups/Roles, and Audit substantially duplicate working Django Admin capabilities. This may be a valid product choice, but the repository does not yet provide a requirement strong enough to justify the extra API, frontend, auth, and E2E surface.
- Arbitrary mutable roles plus capability ceilings are considerably more complex than fixed Phase 1 roles managed only by superusers. A fixed-role first release would reduce escalation risk.
- Permission-dependent omission of individual dashboard widgets may be unnecessary complexity for four simple counters. A small fixed dashboard permission or clearly defined per-widget mapping would be easier to audit.
- Audit vocabulary and redaction are justified; generic model signals, CMS-wide auditing, agent identities, and RBAC packages are correctly excluded.

## Missing Verification

- T10 and T11 verify only lint/typecheck/build despite keyboard, focus, session, CSRF, 401, and 403 acceptance criteria.
- T04 and T05 do not validate their OpenAPI output.
- T02 lacks upgrade-from-existing-database and repeat-provisioning tests.
- T02 lacks Django Admin negative tests proving Editor cannot publish/unpublish.
- T01 needs rollback tests proving audit and domain mutations commit or roll back together, plus nested secret-redaction cases.
- T03 needs reverse-proxy/path-prefix cookie tests, not only DRF client tests.
- T08 must specify and verify response behavior: redirect versus JSON 401/403, as well as the exact permission codename.
- T16 needs migration tests using a temporary SQLite database, never `backend/data/abrit.sqlite3`.
- No task owns baseline verification in a supported Python environment before feature work starts.

## Recommended Changes

1. Add a short Phase 1 charter confirming whether React Admin replaces or supplements the planned customized Django Admin.
2. Freeze one supported production topology and one local-development topology, including cookie domain/path, SameSite policy, CSRF origin, CORS credentials, and external/internal API paths.
3. Publish a complete role-permission matrix and reserved-role lifecycle.
4. Resolve Editor/Publisher by choosing one of the three options in Blocking Issue 3; do not leave an unprotected Django Admin action.
5. Define field-level OpenAPI contracts before splitting backend and frontend implementation.
6. Specify idempotent role provisioning and cross-app migration dependencies.
7. Split the frontend test harness out of T16 and establish it before UI tasks.
8. Assign one URL-aggregator owner, one Admin-navigation owner, one package/lockfile owner, and one final schema-generation owner.
9. Make every migrate/check command use a documented virtual environment and temporary database.
10. Resolve and commit the current line-ending baseline before creating worktrees.

## Revised Execution Waves

Only the affected sequencing needs revision:

- **Wave 0 — readiness gates**
  - Resolve dirty baseline.
  - Approve Phase 1 scope and React/Django Admin relationship.
  - Freeze deployment/auth transport, API schemas, role matrix, permission codenames, migration/provisioning strategy, and file ownership.
  - Establish a runnable Python environment and prove the existing backend baseline.
  - Split a minimal frontend unit-test harness from T16.

- **Wave 1 — foundations**
  - T01 Audit foundation.
  - Revised T02 authorization foundation, including permission ownership, provisioning, Django Admin publish enforcement, and clean/upgrade migration tests.
  - T10 Admin shell may proceed against the frozen mocked contract and established test harness.

- **Wave 2 — authentication boundary**
  - T03 only.
  - Integrate and validate session/CSRF behavior before protected APIs or T11.
  - T11 can begin after T03 and T10 are integrated.

- **Wave 3 — protected backend features**
  - Implement T05 role API before, or tightly coordinated with, T04 user role assignment; do not run them as independent parallel security designs.
  - T06, T07, and T08 may run in parallel after T03 if they use separate URL modules and a single integrator owns aggregation.
  - Integrate T09 after all backend features and the Editor/Publisher verification surface exist.

- **Wave 4 — frontend features**
  - T12–T15 may run concurrently after their APIs, T11, shared types, navigation ownership, and test harness are integrated.
  - Each task must execute its own unit tests.

- **Wave 5 — final integration**
  - Reduced T16: E2E, production-like routing, clean temporary database, full regression, viewport checks, public-route smoke tests, and single final OpenAPI generation.

## Replanning Advice

The current plan scores **4/10**. The next plan should aim for at least **8/10** by resolving decisions before creating implementation tasks, reducing duplicated scope, and making every task independently verifiable.

### 1. Define the Phase 1 Product Boundary

Start the new plan with a short, authoritative Phase 1 charter that answers:

- Is React Admin approved for Phase 1, or should Django Admin remain the only administration UI?
- If React Admin is approved, which exact screens must Phase 1 deliver?
- Is content editing and publishing included, or are Users, Roles, Dashboard, and Audit the only React features?
- Does React Admin supplement Django Admin or eventually replace it?
- Is account lockout required now, or formally deferred?

Do not create Editor/Publisher acceptance criteria unless Phase 1 includes a surface where those roles can actually edit and publish content.

### 2. Choose the Simplest Viable Administration Strategy

Prefer one of these explicit options:

- **Smaller and safer:** retain Django Admin for content, users, groups, and audit; Phase 1 hardens permissions, authentication, auditing, and private downloads without building duplicate React CRUD screens.
- **React Admin:** formally approve the additional API/frontend scope and include every required protected workflow, contract, test foundation, and E2E path.

Avoid an unclear hybrid where React manages users and roles but content operators require manually assigned Django `is_staff` access.

### 3. Freeze Deployment and Authentication Contracts

Document both production and development behavior before T03 or frontend authentication work:

- Public and Django origins.
- External React Admin, Django Admin, and API URLs.
- Internal Django URL paths before `FORCE_SCRIPT_NAME` is applied.
- Session and CSRF cookie names, paths, domains, `Secure`, `HttpOnly`, and `SameSite` behavior.
- Trusted CSRF origins and credentialed CORS behavior.
- Login, logout, session-expiry, 401, 403, and throttling behavior.
- Reverse-proxy headers and HTTPS detection.

Add a production-like runtime test that exercises these decisions through the real frontend and Django server boundary.

### 4. Publish a Complete Permission Matrix

For every Phase 1 role, list every granted permission and every sensitive operation it may perform. At minimum, define:

- Admin admission.
- Dashboard and audit access.
- User viewing, creation, editing, activation, password setting, and role assignment.
- Role viewing, creation, editing, permission replacement, and deletion.
- Submission and private-file access.
- Content editing, publishing, and unpublishing if those operations remain in Phase 1.

Also define:

- Exact permission codenames and owning Django content types.
- Whether default roles are reserved, renameable, editable, or deletable.
- Whether direct user permissions are forbidden.
- How a User Manager can assign roles without inheriting all capabilities granted by those roles.
- Superuser and existing staff-user protection.
- Self-lockout and last-administrator rules.

If the capability-ceiling design remains contradictory, simplify Phase 1 to fixed roles managed only by superusers.

### 5. Define Contracts Before Splitting Tasks

Include field-level contracts for every endpoint consumed by another task:

- Method and internal/external path.
- Authentication and required permission.
- Request fields and validation rules.
- Success response, including exact envelope and pagination format.
- Stable error codes for 400, 401, 403, 404, 409, 429, and server errors where relevant.
- Sorting, filtering, searching, and PATCH semantics.
- Session user, role, and effective-permission fields.
- Dashboard widget identifiers and omission rules.
- Audit event fields and redaction guarantees.

Treat the frozen OpenAPI contract as a dependency artifact. Frontend feature tasks should not begin from prose-only endpoint descriptions.

### 6. Make Migrations and Provisioning Deterministic

The new plan should specify:

- One migration owner per Django app.
- Exact migration dependencies for `accounts`, `content`, and `forms` permissions.
- An idempotent role-provisioning mechanism that works after permissions exist.
- Clean-database, existing-database upgrade, and repeated-provisioning tests.
- A temporary database path for all planning and CI verification commands.
- A prohibition on modifying existing initial migrations.

Do not use a data migration that assumes Django permissions have already been created by `post_migrate`.

### 7. Establish Test Infrastructure Early

Create a small test-foundation task before frontend shell and feature tasks. It should own:

- Frontend unit/component test framework and scripts.
- Browser E2E framework and configuration.
- Shared mock/API fixtures.
- Accessibility assertions suitable for components.
- Deterministic Django test users and role provisioning.
- Production-like server startup and base URLs.

Feature tasks must be able to run their own tests in their worktrees. Final integration should extend the harness, not introduce it for the first time.

### 8. Redesign Task Dependencies and Worktree Ownership

Every task should branch from a commit containing all completed dependencies. Do not create all worktrees from the original baseline.

Assign exclusive ownership for shared files:

- `backend/config/settings/base.py`
- `backend/config/urls.py` and app URL aggregators
- Django model and migration files
- Admin permission enforcement
- Admin navigation and shared frontend API types
- `frontend/package.json` and `frontend/package-lock.json`
- `backend/schema.yml`

Use feature-specific URL modules and component directories so parallel tasks do not need to edit shared aggregators. Merge shared navigation and URL registrations through a designated integration task.

### 9. Give Every Task a Strong Definition

Each implementation task should contain:

- One concrete goal.
- In-scope behavior and explicit non-goals.
- Frozen dependencies and contracts.
- Exact files it owns and shared files it must not edit.
- Permission checks for every method or action.
- Migration ownership, if applicable.
- Positive, negative, authorization, and regression tests.
- Runnable verification commands in the supported environment.
- Evidence required for acceptance.
- A statement explaining why it is safe to run in parallel.

If a task depends on something “when available,” it is not ready for assignment.

### 10. Reuse Existing Working Code

The new plan should explicitly preserve and extend:

- Django `User`, `Group`, `Permission`, sessions, password validation, and Admin.
- Existing content publication, unpublication, revision, search, audit, and revalidation services.
- Existing read-only AuditLog Admin.
- Existing private storage and file validation.
- Existing public endpoint authentication declarations and response behavior.
- Existing public Next.js locale routes, homepage, headers, layouts, content sources, and configurators.

Do not rewrite these systems merely to fit a new React Admin architecture.

### 11. Keep Auditing Focused

Retain one central audit service with recursive secret redaction. Require identity and role mutation services to call it inside their database transactions. Preserve existing content and retention events through the same service.

Do not introduce generic model signals, full CMS edit auditing, log shipping, agent identity, or a general event framework in Phase 1.

Required audit tests should cover:

- Commit and rollback atomicity.
- Nested secret redaction.
- User activation, password reset, and role/permission changes.
- Successful and failed authentication without credential leakage.
- Read-only Admin/API behavior.
- Preservation of existing content and retention events.

### 12. Require a Green Baseline Before Worktrees

Before implementation begins:

- Resolve or commit the current line-ending changes.
- Preserve user-owned changes and confirm the intended baseline commit.
- Create a supported Python environment from `requirements.txt`.
- Run existing backend tests, Django checks, migration-drift checks, OpenAPI validation, frontend lint, typecheck, and build.
- Record any baseline failure before assigning it to a Phase 1 task.
- Use disposable databases and test media directories.

### New Plan Readiness Checklist

The replacement plan should be considered implementation-ready only when all of these are true:

- [ ] Phase 1 UI and backend scope is explicitly approved.
- [ ] React Admin versus Django Admin ownership is unambiguous.
- [ ] Production and development routing/authentication topology is frozen.
- [ ] Complete role-permission matrix and permission codenames are documented.
- [ ] Editor/Publisher acceptance has an actual protected implementation surface.
- [ ] User Manager capability assignment cannot cause privilege escalation.
- [ ] Default-role provisioning works on clean and upgraded databases.
- [ ] API request, response, pagination, and error contracts are field-level complete.
- [ ] Frontend test infrastructure exists before feature UI tasks.
- [ ] Every task has satisfied dependencies, exclusive file ownership, and runnable verification.
- [ ] Parallel tasks do not modify the same URL, migration, navigation, package, or schema files.
- [ ] Existing public APIs and public frontend routes remain explicit regression targets.
- [ ] Verification uses a supported environment and disposable database.
- [ ] The repository baseline is clean and all existing checks have recorded results.
