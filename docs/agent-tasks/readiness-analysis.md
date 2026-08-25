# AbrIT Phase 1 Readiness Analysis

Sources:

- `docs/agent-tasks/phase-1-tasks.md`
- `docs/agent-reports/phase-1-plan-aprove.md`
- `docs/agent-reports/phase-1-plan-v2-review.md`

## Current Decision

All R00–R18 tasks remain `BLOCKED` and `UNASSIGNED`. No implementation agent may claim a task yet.

The first blocker is outside the implementation dependency graph: B01–B08 must be incorporated into an explicitly approved plan revision, G01 architecture decisions must be recorded, and R00 must be authorized to run in the current owner-controlled worktree. This is a planning/owner action, not an implementation assignment.

## Initial Unlock Sequence

1. **Planning closure:** Incorporate B01–B08, record G01, and authorize R00. This does not change application code.
2. **Initial task:** Change only R00 from `BLOCKED` to `READY`; leave its owner `UNASSIGNED` until a correctly scoped readiness agent claims it.
3. **Readiness execution:** R00 establishes the clean baseline, supported environment, disposable verification containment, and evidence for G02/G03. It goes to `REVIEW`, and only the reviewer/integration flow may mark it `DONE`.
4. **First implementation-capable wave:** After R00 is `DONE`, R01, R02, and R03 may become `READY` together.

R04 does not become ready with them because it requires integrated R01 output. R05 does not become ready because it requires both R02 and R03. No later task bypasses these gates.

## First Executable Wave

| Task | Scope | Why it can start after R00 | Parallel boundary |
|---|---|---|---|
| R01 | tests | Frozen contracts and a reproducible baseline are available. | Exclusively owns frontend package/lockfile, test configuration, and initial shared frontend contract fixtures/types. |
| R02 | audit | Disposable migration verification and file ownership are established. | Exclusively owns core audit model/migration and `backend/apps/content/services.py`. |
| R03 | backend | Publication, Group, migration, and Admin ownership decisions are frozen. | Exclusively owns accounts/content authorization migrations and content Admin/forms/helpers; it must not edit `content/services.py`. |

Maximum safe parallelism is **3 agents**, one on each of R01, R02, and R03. If R03 discovers that publication enforcement requires a change to `backend/apps/content/services.py`, R02 must integrate first and R03 must rebase before continuing that part; the maximum temporarily drops to 2.

## Tasks Unlocked by Predecessors

| Completed predecessor set | Tasks that may become READY | Notes |
|---|---|---|
| Approved B01–B08/G01 planning closure | R00 | R00 runs in the current owner-controlled worktree, not a feature worktree. |
| R00 | R01, R02, R03 | First implementation-capable wave; maximum three parallel agents. |
| R01 | R04 | R04 consumes the integrated frontend test and contract foundation. |
| R02 and R03 | R05 | R05 runs alone across the authentication boundary. R04 may still proceed independently if file ownership remains separate. |
| R05 | R06, R08, R09, R10 | Protected backend feature modules may run in parallel. |
| R04 and R05 | R11 | Frontend session integration also joins the post-R05 parallel set. |
| R06 | R07 | R07 starts only after the role catalog/security contract is integrated. |
| R06–R10 | R12 | Includes R07; independent backend security review begins only after all protected backend features are integrated. |
| R06–R12 and R11 | R13 | R13 runs alone because it owns shared URLs, schema, types, fixtures, and navigation integration. |
| R07, R11, R13 | R14 | Users UI. |
| R06, R11, R13 | R15 | Roles/permissions UI. |
| R09, R11, R13 | R16 | Dashboard UI. |
| R08, R11, R13 | R17 | Audit UI. |
| R12 and R14–R17 | R18 | Final integration/E2E runs alone against the release candidate. |

## Safety Conclusions

- R00 is the only initial task, but it cannot be claimed until the planning/architecture closure is approved.
- R01, R02, and R03 are the first tasks that can execute concurrently after readiness is complete.
- R04 must wait for R01 even if its visual shell appears independent, because package/test/shared-contract ownership belongs to R01.
- R05 must run after R02 and R03 and should integrate alone due to authentication, migration, settings, proxy, CSRF, and central URL risk.
- R13 and R18 are single-agent integration gates.
- Status changes must follow the task-board Execution Rules; this analysis assigns no owners and changes no task status.

INITIAL_TASKS: R00
FIRST_EXECUTABLE_WAVE: R01, R02, R03
MAX_SAFE_PARALLEL_AGENTS: 3
