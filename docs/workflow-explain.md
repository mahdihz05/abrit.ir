# AbrIT Phase 1 Owner Workflow Guide

## Summary

You are the coordinator and final decision-maker. Developers implement only the task currently assigned to them; they do not decide which later task starts, mark a task `DONE`, change another agent's files, merge work, or touch `/mnt/c/projects/abrit.ir`.

The safe cycle is:

1. You assign an eligible `READY` task to one named agent in a clean, dedicated worktree.
2. The agent changes only that task to `IN_PROGRESS`, implements its bounded scope, runs the required verification, and changes it to `REVIEW`.
3. You review the diff, test evidence, migration safety, file ownership, and dependencies.
4. If acceptable, you integrate the work and mark the task `DONE`; if not, return it to `IN_PROGRESS` with a focused correction request.
5. Only then do you unlock tasks whose every predecessor is `DONE`.

Current position: R00 is `DONE`. R01 (`berar-front`), R02 (`berar-audit`), and R03 (`berar-auth`) are the only tasks currently `READY`. R04–R18 are not ready.

## Authoritative Records

Use these records in this order when there is a conflict:

1. `docs/agent-tasks/phase-1-tasks.md` — current task status, owner, dependencies, scope, and acceptance criteria.
2. `docs/agent-reports/R00-coordinator-decision.md` — owner approvals, R00 completion decision, and the approved narrow migration exception.
3. `docs/IMPLEMENTATION_PLAN.md` — current high-level topology: same-origin Django under `/cms`.
4. `docs/agent-reports/phase-1-plan-aprove.md` — detailed Phase 1 charter, contracts, verification scenarios, and intended waves.
5. `docs/IMPLEMENTATION_CHECKLIST.md` and `docs/MILESTONES.md` — product-wide progress and historical evidence.

Older plan/review documents remain useful historical context. They do not overrule the current task board or the recorded owner approvals.

## Rules That Always Apply

- Keep `/mnt/c/projects/abrit.ir` untouched. It contains user-owned changes.
- Give each active implementation task a separate, clean worktree and branch. Do not use the R00 or control worktree for feature implementation.
- One task has one owner. An agent edits only files in its task's scope and explicitly owned files.
- Set `Owner` before work; change `READY` to `IN_PROGRESS` before code changes; finish at `REVIEW`. Only you/the integration flow mark `DONE`.
- Do not edit existing initial migrations, dependency manifests, or lockfiles unless the assigned task explicitly owns them. R01 alone owns frontend package and lockfile changes.
- Run migrations, tests, schema generation, builds, and E2E only through the disposable verification approach. Never write repository SQLite/media/schema data.
- Do not merge an agent's branch merely because the agent says tests pass. Review the actual diff and evidence first.

## What You Do Now

### 1. Prepare the three developers

Current reservations:

| Task | Owner | Work | Must not touch |
|---|---|---|---|
| R01 | `berar-front` | frontend test/E2E foundation, Admin contract types, mocks, fixtures, scripts | backend, migrations, `content/services.py` |
| R02 | `berar-audit` | audit foundation, audit migration/service, redaction, `content/services.py` | accounts, content Admin/forms/helpers, frontend |
| R03 | `berar-auth` | fixed roles, accounts app, Group/User Admin restrictions, publication boundary, its migrations | `content/services.py`, audit service, frontend |

Create/provide one clean dedicated worktree and branch per agent. Give each the corresponding prompt in `docs/agent-prompts/phase-1-first-wave/`. The task board currently reserves the owners and leaves the tasks `READY`; each agent changes only its own task to `IN_PROGRESS` immediately before implementation.

### 2. Monitor while they work

Ask each agent to report, at meaningful milestones:

- current status and current branch/worktree;
- files changed;
- commands run and exact result;
- migration number, if one was created;
- any file ownership collision or scope expansion request;
- blockers rather than workarounds that weaken security or verification.

Do not start R04 or R05 early. R04 depends on the integrated R01 foundation. R05 depends on both R02 and R03 and crosses authentication, migration, settings, CSRF, proxy, and URL boundaries.

### 3. When an agent says it is done

Require this handoff before accepting it:

1. The agent changes only its task from `IN_PROGRESS` to `REVIEW`.
2. It supplies a concise report: changed paths, tests/checks run, pass/fail output, migrations, known limitations, and proposed integration commit(s).
3. It confirms no initial migration, user-owned worktree, unrelated manifest/lockfile, or another agent's owned file changed.

Then you perform the review:

1. Compare the branch/worktree diff against the task scope and named owned files.
2. Run the task's required verification in the disposable environment, or inspect reproducible evidence when a command cannot be rerun immediately.
3. For backend work, check clean migration and upgrade behavior, `makemigrations --check --dry-run`, tests, and OpenAPI where applicable.
4. For frontend work, check lint, typecheck, tests, build, accessibility expectations, and that package/lockfile changes belong only to R01.
5. Check that protected repository data and whole-worktree state have not changed unexpectedly.
6. Resolve ownership conflicts before merging. In particular, R02 owns `content/services.py`; R03 must request R02 integration rather than edit it.

If review passes: integrate the task into the controlled integration branch/worktree, record verification evidence, then mark it `DONE` on the authoritative board.

If review fails: keep it out of the integration branch, state the precise defect, and return only that task to `IN_PROGRESS`. Do not unlock dependents.

## Phase 1 Execution Order

### Wave 1 — current parallel work

| Completion needed | What you can do next |
|---|---|
| R01 `DONE` | Make R04 `READY` after its test/contract foundation is integrated. |
| R02 `DONE` only | No immediate dependent alone; preserve its audit API/service contract for R05. |
| R03 `DONE` only | No immediate dependent alone; preserve its role/Admin contract for R05. |
| R02 and R03 `DONE` | Review the frozen lockout/proxy and protected-URL conditions, then make R05 `READY`. |

R01, R02, and R03 can complete in any order. Do not integrate R03 changes that require R02-owned `content/services.py` until the R02 interface exists and the two branches are reconciled.

### Wave 2 — authentication boundary

R04 can proceed once R01 is integrated. R05 starts only after R02 and R03 are integrated and reviewed. Treat R05 as a high-risk focused task: it owns the protected admin/auth URL include, session/CSRF behavior, proxy/client-IP rules, lockout behavior, and its security migration.

Before marking R05 `DONE`, explicitly check non-enumerating login failure responses, trusted versus spoofed proxy behavior, session rotation, CSRF behavior, lockout persistence/recovery, audit redaction, and OpenAPI validation.

### Wave 3 — protected APIs and frontend login

After R05 is `DONE`, you may make R06, R08, R09, and R10 `READY` in parallel. After both R04 and R05 are `DONE`, make R11 `READY`.

| Task | Main result |
|---|---|
| R06 | read-only roles and permissions API |
| R08 | read-only audit query API |
| R09 | dashboard aggregation API |
| R10 | private submission-file authorization |
| R11 | frontend session and login integration |

R07 starts only after R06 is `DONE`; it implements superuser-only user management. Do not allow user/role mutation endpoints outside this frozen contract.

### Wave 4 — security review and integration contract

When R06–R10 and R07 are done, make R12 `READY` for an independent backend security matrix. This is a review/testing task, not feature expansion.

When R06–R12 and R11 are integrated, make R13 `READY`. R13 runs alone because it owns shared URL integration, authoritative OpenAPI generation, frontend types/fixtures synchronization, and navigation integration. Do not let earlier agents edit those shared integration surfaces opportunistically.

### Wave 5 — frontend screens

After R13:

| Required DONE tasks | Task you can make READY |
|---|---|
| R07, R11, R13 | R14 — users screen |
| R06, R11, R13 | R15 — roles/permissions screen |
| R09, R11, R13 | R16 — dashboard screen |
| R08, R11, R13 | R17 — audit screen |

These screens may run in parallel once their listed inputs are integrated. They must consume frozen API types and fixtures rather than changing backend contracts on their own.

### Wave 6 — final release evidence

When R12 and R14–R17 are `DONE`, make R18 `READY`. R18 runs alone against the integrated release candidate. It executes clean/upgrade disposable migrations, same-origin `/cms` proxy topology checks, end-to-end journeys, accessibility/viewports, public regression checks, and final OpenAPI generation.

Only consider Phase 1 complete after R18 is reviewed and its exit criteria evidence is recorded.

## Decision Points That Require You

Ask for a focused explanation and make a recorded decision if an agent requests:

- a file owned by another task;
- a new migration when another task already owns the next migration in that app;
- a package or lockfile edit outside R01;
- a change to an existing initial migration;
- a change to the same-origin `/cms` topology, fixed roles, superuser-only user/role management, or frozen API contract;
- access to production, user-owned worktrees, credentials, deployment, DNS, or real customer data;
- a scope expansion needed to make tests pass.

The default response to a scope collision is not “edit it anyway.” Keep the task at `IN_PROGRESS`, identify the owning task, integrate that owner first if necessary, then resume.

## Practical Owner Checklist

For every task transition, update the authoritative board and record why:

| Transition | Your required evidence |
|---|---|
| `BLOCKED` → `READY` | Every listed predecessor is `DONE`; required contract/architecture gate is recorded. |
| `READY` → `IN_PROGRESS` | Named owner, isolated worktree/branch, task prompt read. |
| `IN_PROGRESS` → `REVIEW` | Agent handoff report, scoped diff, exact verification results. |
| `REVIEW` → `DONE` | Your review passes; change is integrated; migration/verification/ownership checks pass. |
| `REVIEW` → `IN_PROGRESS` | You recorded a specific correction; no dependent task starts. |

## Project Outcome Beyond Phase 1

Phase 1 delivers the secure internal administration foundation: same-origin `/cms` deployment, fixed roles, Django Admin publication controls, React Admin workflow, protected APIs, auditability, private-file authorization, and release-grade verification. The wider product checklist still covers public content, pricing, forms, search/SEO, backup/restore, hosting, legal text, production routing, SSL/runtime validation, and explicit production deployment approval.

Do not treat a green Phase 1 implementation as production-deployment authorization. Before production, complete the remaining checklist gates, provide real external URLs/credentials where required, validate backups and restore, verify host capabilities, and give a separate explicit deployment authorization.
