# AbrIT Phase 1 Plan V2 Review

## Verdict

READY WITH CHANGES

**Overall score: 7.5/10**

Version 2 is a major improvement over the original 4/10 plan. It defines a credible Phase 1 charter, adopts fixed roles, resolves the User Manager escalation problem, freezes most API contracts, moves frontend testing before feature work, sequences authentication correctly, assigns shared-file owners, and requires disposable verification data.

The plan is close to implementation-ready, but the changes below must be incorporated before feature worktrees are assigned. The most important remaining issue is that checking only the Django Admin publish/unpublish actions does not actually prevent an Editor from changing live publication state or live published content through other existing Admin paths.

## Blocking Issues

### 1. Editor/Publisher enforcement does not cover all existing Django Admin mutation paths

R03 checks the publish and unpublish actions, but the current Admin also exposes `workflow_status`, `published_at`, and `publish_at` in the normal translation change form and exposes `workflow_status` through the `ContentItem` translation inline. An Editor with `change_contenttranslation` can therefore submit `workflow_status=published` directly if the other model validation conditions are satisfied, bypassing the actions and the publication service.

The boundary is wider than the translation actions:

- `ContentItemAdmin.archive_items` can set `is_active=False` through `queryset.update()`, effectively removing published content without the publish permission.
- An Editor can edit a translation that is already published, immediately changing public API output without a new publication transition.
- An Editor can edit or delete blocks belonging to an already-published translation, also changing live API output.
- A Publisher can manually change workflow fields through the change form and bypass revision, search indexing, audit, and revalidation behavior.

Before implementation, R03 must define and own the complete publication boundary. At minimum:

- Direct saves may never transition a translation into or out of `published`.
- Publish/unpublish must go through the existing services.
- Editor must be denied changes to already-published translations and their blocks, unless the plan explicitly accepts live editing without publication control.
- Content deactivation/archive of published items must require the publish permission and use an audited/revalidated service boundary.
- Scheduling transitions and `publish_at` ownership must be explicitly assigned to Editor or Publisher.
- Tests must cover crafted change-form POSTs, ContentItem inline POSTs, block edits/deletes, archive actions, and direct workflow-field manipulation—not only Admin actions.

Because the existing schema stores one translation row rather than separate draft and live versions, the smallest safe Phase 1 rule is: Editors may edit non-published translations; Publishers control publication transitions and changes to currently published translations.

### 2. Fixed roles do not yet exclude arbitrary Groups

The plan forbids direct user permissions and makes the four fixed Groups immutable, but it does not clearly disable creation and use of ordinary Django Groups. If a superuser can create another Group with arbitrary permissions and attach it through Django Admin, a non-superuser can have one fixed Phase 1 role plus additional effective permissions, bypassing the declared matrix.

The supported-interface rule must be explicit:

- Either disable all Group add/change/delete operations in Django Admin during Phase 1; or
- permit unrelated legacy Groups but prohibit their assignment to Phase 1 users and exclude their permissions from Admin admission and protected operations.

The simpler and safer choice is to make all Group management read-only in supported Phase 1 interfaces and have the role-assignment service replace the user's complete Group set with exactly one fixed Group. Add upgrade tests for users who already have extra Groups or direct permissions.

### 3. Lockout responses can disclose account existence

The plan says unknown usernames must not be disclosed, but it also says a locked account returns `account_locked` and that lock state is checked before password authentication succeeds. If any password submitted for a locked known username returns `account_locked`, an attacker can distinguish that username from an unknown username.

Freeze one non-enumerating rule before R05:

- Wrong password, unknown username, inactive account, and locked account with an incorrect password return the same `authentication_failed` response.
- `account_locked` may be returned only after the submitted password is correct, or it must be replaced by the generic response for all unauthenticated attempts.

Also define the trusted client-IP source used for the unknown-user throttle. Behind a reverse proxy, blindly using `X-Forwarded-For` is spoofable, while using only `REMOTE_ADDR` may throttle every visitor under the proxy address. This must be part of the approved proxy contract and covered by tests.

### 4. The frozen User and Session contracts remain ambiguous

The plan states only that user mutations are superuser-only. It does not say who may call `GET /users` and `GET /users/{id}`. No fixed role receives `auth.view_user`, and R14 expects a non-superuser denied state. Declare all user endpoints superuser-only, or introduce and map a separate view permission.

Remove conditional contract language such as `updated_at if a profile timestamp is introduced`. A frozen response must either always contain `updated_at` with a defined source or omit it. Also specify that `SessionUser.role` is nullable for superusers and any preserved legacy account without a fixed role.

### 5. Migration ownership uses obsolete task identifiers

Section 5 assigns migrations to T03, T04, and T06, but Version 2 tasks are R02, R03, and R05. This contradicts the later shared-file ownership table and can cause the wrong agent to create an accounts migration.

Correct the mapping to:

- R02: next core audit migration.
- R03: `accounts/0001` and next content permission migration.
- R05: later accounts lockout/security migration.
- No forms migration when using existing `forms.view_submissionfile`.

The AD2-01 trade-off also refers to approval “before T06”; it should refer to R05 or Wave 0.

### 6. R00 cannot be performed in the proposed R00 worktree

The plan says no worktree may be created before R00 completes, while the worktree table assigns R00 its own worktree. More importantly, a new worktree starts from committed `HEAD` and does not contain the current worktree's user-owned line-ending changes. It cannot safely resolve or commit those changes on the owner's behalf.

R00 must run in the current primary worktree with the repository owner, or be treated as an owner-operated readiness procedure rather than an implementation-agent worktree. Create feature worktrees only after R00 produces a clean approved baseline commit.

### 7. Auth URL integration creates a dependency ambiguity

R05 must expose working authentication endpoints for its proxy tests and for R11's live authentication E2E. However, R13 is described as the exclusive owner of protected Admin URL aggregation and runs only after R11.

Define the split explicitly:

- R05 owns creation of the initial `/api/v1/admin/` include and authentication URL registration in `config/urls.py`.
- R13 later adds the feature URL modules to that established aggregator.

Without this clarification, R11 depends on routes that are not integrated until after R11.

### 8. R02 and R03 still have a likely shared-file conflict

R02 explicitly changes `backend/apps/content/services.py` to move existing audit callers to the centralized service. R03 lists content services as relevant while implementing publication authorization. If R03 also edits that file, the supposedly parallel branches overlap.

Assign `backend/apps/content/services.py` exclusively to R02 during Wave 1. R03 should enforce HTTP/Admin authorization in `content/admin.py` and its forms/helpers without modifying the workflow service. If R03 needs a service change, integrate R02 first and run R03 afterward.

## Non-Blocking Improvements

- Rename the source file from `phase-1-plna-v2.md` to `phase-1-plan-v2.md` to remove the filename typo.
- Give `AdminCapability` `default_permissions = ()` and test that it creates only the three declared custom permissions and no database table.
- Consider narrowing the session cookie path to `/cms/`. The current `/` path sends the session cookie to public and React routes even though only Django needs it. The CSRF cookie can remain `/` if the frontend reads it directly.
- State whether fixed Group human names are localization-neutral and whether stable role keys are stored separately or mapped from immutable Group names.
- Clarify whether lockout counters reset when the 15-minute interval expires or only after a successful login/unlock operation.
- Document cache-failure behavior for unknown-user throttling. Authentication should not become unavailable solely because the throttle cache is temporarily inaccessible, but failures should be observable.
- The complete dashboard intentionally exposes all four aggregate areas to every role. This is now explicit and acceptable, but should receive owner sign-off because Submission Reviewer and Auditor see content/user operational counts.

## Incorrect Assumptions

- Protecting only `publish_selected` and `unpublish_selected` is sufficient to enforce Editor/Publisher separation. Existing change forms, inlines, block edits, and archive actions provide alternate live-mutation paths.
- Fixed reserved Groups alone prevent permission expansion. Arbitrary additional Groups remain a possible supported-interface bypass unless Group management and assignment are restricted.
- Returning `account_locked` before validating the password is compatible with username non-enumeration.
- R00 can resolve the current dirty worktree from a separate clean worktree.
- R11 can execute live auth E2E before any task owns central registration of R05's authentication URLs.
- The Section 5 T-task migration assignments refer to Version 2 tasks; they are stale Version 1 identifiers.
- Same-origin `/cms` is supported by environment values and packaging expectations, but the repository does not contain the actual production reverse-proxy configuration. The owner approval and production-like proxy test therefore remain necessary gates.

## Missing Dependencies

- R03 needs an approved policy for editing already-published translations, blocks, media references, and active content items.
- R05 needs a trusted client-address/proxy contract for lockout throttling.
- R11 needs R05's auth URLs integrated into the central URL tree, not merely implemented in an app URL module.
- R07 needs an explicit authorization rule for user read endpoints.
- R12 should explicitly depend on R07, not only use the shorthand `R06–R10`, so the dependency cannot be misread.
- R13 must depend on the corrected R12 security matrix and on the initial auth URL include from R05.
- The POSIX environment path `.runtime/phase1-venv` is not currently ignored. Use the already ignored `.venv/` directory, use `/tmp`, or add `.runtime/` to `.gitignore` as an R00-owned change.

## Unsafe Parallelization

- R02 and R03 are safe in parallel only if R03 is prohibited from editing `content/services.py` and R02 is prohibited from editing `content/admin.py`.
- R05 and R13 need sequential, explicit ownership of `config/urls.py`: R05 creates the protected/auth include; R13 extends it.
- R01 owns frontend contract types, while R04 consumes them. R04 correctly waits for R01 and must branch from the integrated R01 commit, not merely run at the same time.
- R06, R08, and R09 are parallel-safe only if each creates a self-contained URL module and does not edit an accounts/core aggregator.
- R14–R17 are appropriately isolated after R13, provided R13 creates all navigation entries and none of those feature branches edits the registry.

## Over-Engineering

- Nineteen tasks are a relatively high coordination cost for this Phase 1, but the ownership boundaries now mostly justify the split. R06 and R13 could potentially be combined if the team is small, but this is not required.
- The custom persistent lockout model is justified by the existing checklist, provided it remains a small one-to-one security record and does not become a general identity-profile abstraction.
- A React role-reference screen and dashboard still duplicate information available in Django Admin, but Version 2 now explicitly frames them as the approved future-facing shell rather than accidental duplication.
- The centralized audit service, fixed roles, test foundation, URL integrator, and final E2E task are proportionate and no longer premature.

## Missing Verification

- Crafted direct change-form POST that sets a draft translation to `published`.
- Crafted inline POST that changes workflow state through `ContentItemAdmin`.
- Editor edit/delete attempts against blocks of a published translation.
- Editor modification of an already-published translation.
- Editor and Publisher archive/deactivate attempts against a published `ContentItem`.
- Publisher direct workflow save proving service bypass is impossible.
- Arbitrary Group creation, extra Group assignment, and upgrade cleanup behavior.
- Locked known username with wrong password versus unknown username response equivalence.
- Concurrent failed-login updates proving no attempts are lost.
- Lock expiry, manual unlock, successful-login reset, inactive-user behavior, and cache failure.
- Trusted and spoofed proxy/client-IP header tests.
- Superuser and legacy no-role `SessionUser.role = null` serialization.
- Explicit authorization tests for both user GET endpoints.
- Post-migrate provisioning when required permission rows are temporarily absent.
- R11 live auth test through the centrally registered path before R13.
- Verification wrapper test proving pytest, cache, media, schema, and migration artifacts all stay below the disposable root.

## Recommended Changes

1. Expand R03 from “action permission checks” to a complete published-content mutation boundary covering forms, inlines, blocks, archive/deactivation, scheduling, and already-published objects.
2. Disable arbitrary Group management/assignment in supported Phase 1 interfaces and make role assignment replace the full Group set with one fixed role.
3. Make lockout responses non-enumerating and freeze trusted client-IP extraction.
4. Declare all user endpoints superuser-only, or add an explicit user-view permission; remove conditional response fields and make `role` nullable.
5. Replace stale T03/T04/T06 references with R02/R03/R05.
6. Remove R00 from the worktree table and run it in the current owner-controlled worktree.
7. Give R05 the initial central Admin/auth URL include; let R13 extend it later.
8. Assign `content/services.py` to R02 and `content/admin.py` plus Admin forms/helpers to R03.
9. Use an ignored POSIX virtual-environment location and export every disposable-path environment variable for the full verification process, including pytest.
10. Add the missing negative tests above to R03, R05, R12, and R18 acceptance criteria.

## Revised Execution Waves

The overall Version 2 wave design can remain. Only these corrections are needed:

### Wave 0 — owner-operated readiness

- Perform R00 in the current primary worktree, not a new worktree.
- Record approvals, clean baseline commit, supported environment, and baseline test evidence.
- Do not create any feature worktree until R00 is complete.

### Wave 1 — foundations

- R01 first; R04 branches only after R01 is integrated.
- R02 and R03 may run in parallel only with explicit file boundaries:
  - R02 owns `core` audit files, `content/services.py`, and the retention caller.
  - R03 owns accounts authorization, content model permission declaration, Django Admin/forms/helpers, and publication-boundary tests.
- If publication enforcement requires changing the workflow service, integrate R02 before R03 instead of parallelizing them.

### Wave 2 — authentication

- R05 owns the initial central `/api/v1/admin/` auth include, lockout, CSRF, proxy trust, and client-IP contract.
- R05 must close account-enumeration and concurrent-attempt cases before integration.

### Wave 3 — protected APIs and frontend auth

- R06, R08, R09, R10, and R11 may proceed as planned from integrated R05.
- Integrate R06 before R07.
- Run R12 only after R07, R08, R09, and R10 are all integrated.
- R13 extends the R05 URL aggregator and then freezes schema/types/navigation.

### Waves 4–5

- R14–R17 and R18 may proceed as written after the corrected R13 contract.
- R18 must include the full Django Admin alternate-path authorization tests and disposable-artifact containment check.

## Readiness Decision

Do not start feature implementation yet. After the eight blocking issues are incorporated and the five existing Wave 0 gates have evidence, the plan should be safe to assign and would likely score approximately **9/10** without requiring another full redesign.
