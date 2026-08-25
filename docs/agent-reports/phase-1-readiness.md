# AbrIT Phase 1 R00 Readiness Evidence

## Decision

R00 is ready for independent review, but Phase 1 implementation remains **BLOCKED**. The repository baseline is isolated and preserved, and a safe verification wrapper is available. Backend and frontend execution baselines could not run because the approved POSIX Python environment and frontend dependencies are absent, and dependency installation was not authorized. G01 owner approvals and the `docs/IMPLEMENTATION_PLAN.md` topology reconciliation also remain unresolved.

No R01–R18 work was performed. Those tasks remain `BLOCKED` and `UNASSIGNED`.

## Execution Context

- Recorded: `2026-08-25T12:48:20+03:30`
- Branch: `feat/p1-r00-readiness`
- Worktree: `/mnt/c/projects/abrit-r00`
- Baseline commit: `54b691852c07a302b98ccf52a7157a19fdbb03a6`
- Primary repository: `/mnt/c/projects/abrit.ir`, branch `master`, reference/integration context only
- Initial R00 worktree status: clean; no modified or untracked paths
- R00 owner: `phase1-readiness-agent`

The execution branch and worktree match the committed R00 contract. No branch or worktree was created or switched, and the primary repository was not modified.

## Referenced Documents

The following R00 planning/report sources were read in full and exist at the recorded commit:

- `docs/agent-reports/phase-1-plan-aprove.md`
- `docs/agent-reports/phase-1-plan-v2-review.md`
- `docs/agent-tasks/phase-1-tasks.md`
- `docs/agent-tasks/readiness-analysis.md`
- `docs/IMPLEMENTATION_PLAN.md`

The nonexistent `docs/agent-reports/phase-1-plan-v2.md` is not used. The owner-designated plan source is `docs/agent-reports/phase-1-plan-aprove.md`, which identifies itself internally as Version 2.

## Baseline Isolation and Line-Endings

The dedicated R00 worktree began clean at the baseline commit. The separate primary `master` worktree has 35 modified tracked files and no untracked files. It includes application files and existing initial migrations. Read-only comparison produced:

- `git diff --ignore-cr-at-eol --quiet`: success
- Result: all 35 primary-worktree deltas are CRLF-only at the recorded baseline
- `git diff --check`: reports the CR characters as trailing whitespace

Owner disposition G02 is isolation: preserve the primary worktree byte-for-byte and perform R00 only in the clean dedicated worktree. R00 did not stage, normalize, commit, revert, move, or delete any primary-worktree path.

## B01–B08 Dispositions

The committed shared task board incorporates the Version 2 review corrections as follows:

| ID | Disposition and evidence |
|---|---|
| B01 | Incorporated in R03 scope and acceptance criteria: forms, inlines, blocks, archive/deactivation, scheduling, published objects, direct workflow saves, and negative bypass tests. |
| B02 | Incorporated in R03: all supported Group management is read-only; fixed-role assignment replaces the complete Group set and removes direct permissions. |
| B03 | Incorporated in R05: wrong password, unknown username, inactive account, and locked account with an incorrect password are indistinguishable; trusted/spoofed proxy behavior is tested. |
| B04 | Incorporated in R06/R07: all user endpoints are superuser-only, conditional fields are removed, and session roles may be null. |
| B05 | Incorporated in task ownership: R02 owns the next core audit migration, R03 owns `accounts/0001` and the next content permission migration, and R05 owns the later lockout/security migration. The older plan prose still contains stale T-identifiers and must not override the task board. |
| B06 | Incorporated in the R00 contract and board: execute on `feat/p1-r00-readiness` at `/mnt/c/projects/abrit-r00`; do not modify `master`. |
| B07 | Incorporated in R05/R13: R05 owns the initial protected Admin/auth include; R13 extends it. |
| B08 | Incorporated in R02/R03/R12: R02 owns `content/services.py`; R03 owns publication Admin/forms/helpers; negative/security coverage is expanded. |

These are recorded dispositions in the committed task definitions. They do not authorize any implementation task while R00 or the owner gates remain incomplete.

## Owner and Architecture Gates

| Gate | Result | Evidence or blocker |
|---|---|---|
| G01: same-origin `/cms` | BLOCKED | The Version 2 plan recommends it, but no explicit owner approval is recorded. |
| G01: React Admin supplements Django Admin | BLOCKED | The proposed charter is explicit, but no explicit owner approval is recorded. |
| G01: fixed roles/superuser-only management | BLOCKED | The proposed role model is explicit, but no explicit owner approval is recorded. |
| G02: dirty/line-ending baseline | PASS | The owner-authorized dedicated worktree isolates the clean R00 baseline from the preserved CRLF-only primary-worktree changes. |
| G03: supported environment and untouched baseline | BLOCKED | The pinned POSIX environment and frontend dependencies are absent; installation was not authorized. |
| `docs/IMPLEMENTATION_PLAN.md` topology reconciliation | BLOCKED | It still says `cms.abrit.ir`; no approved reconciliation decision is recorded. |

## Environment Evidence

- Required interpreter `.runtime/phase1-venv/bin/python`: absent/not executable (`test` exit 1)
- `.venv/bin/python`: absent/not executable
- System interpreter: Python `3.14.4`, but importing Django/DRF fails with `ModuleNotFoundError`
- Node: `v22.22.1`
- npm: `9.2.0`
- `frontend/node_modules`: absent
- Existing backend test inventory: 22 `test_*` functions by static repository count; not executed
- Frontend `test` and `test:e2e` scripts: not defined; R01 owns that test foundation

No dependency installation was attempted. The repository Windows virtual environment was not used from WSL.

## Safe Verification Wrapper

R00 added `scripts/check-phase1.sh`. It:

- requires exactly `--baseline` and a nonempty `ABRIT_VERIFY_DIR`;
- resolves and accepts only a nonsymlink child below `/tmp`;
- creates a unique `run.XXXXXXXX` directory below the approved root;
- routes database, public/private media, caches, Python bytecode, pytest, generated schema, frontend build, migration, temporary, npm, and E2E artifacts below that run directory;
- runs backend checks only with `.runtime/phase1-venv/bin/python`;
- runs frontend checks from a disposable source copy only when existing dependencies are available;
- snapshots protected repository data before and after verification and fails if it changes;
- distinguishes pass, fail, blocked, and not-run outcomes.

Containment checks:

| Check | Result |
|---|---|
| `bash -n scripts/check-phase1.sh` | PASS |
| Unset `ABRIT_VERIFY_DIR` | PASS: refused, exit 64 |
| Repository path as `ABRIT_VERIFY_DIR` | PASS: refused, exit 64 |
| Approved root `/tmp/abrit-phase1-r00` | PASS: unique run `/tmp/abrit-phase1-r00/run.IXtRFWuu` created |
| Artifact manifest paths | PASS: every recorded artifact is below the unique run directory |
| `backend/data/abrit.sqlite3` | PASS: absent before and after |
| `backend/schema.yml` | PASS: SHA-256 unchanged (`1f49486ae92b96f92a3d5fa0212bdd0de61cdcec439eec3020baf5c815314ecd`) |

## Verification Results

The contract commands were run or explicitly stopped at their mandated prerequisite:

| Verification | Result |
|---|---|
| `git branch --show-current` | PASS: `feat/p1-r00-readiness` |
| `git rev-parse HEAD` | PASS: `54b691852c07a302b98ccf52a7157a19fdbb03a6` |
| Initial `git status --short` | PASS: clean |
| Initial `git diff --check` | PASS |
| Initial `git diff --name-only` | PASS: empty |
| Initial untracked-file inventory | PASS: empty |
| Supported Python executable check | BLOCKED: environment absent |
| Pinned Django/DRF import | BLOCKED: supported interpreter absent |
| `node --version`; `npm --version` | PASS |
| `ABRIT_VERIFY_DIR=/tmp/abrit-phase1-r00 scripts/check-phase1.sh --baseline` | BLOCKED, exit 2 |
| Django checks, migrations, drift check, backend tests, OpenAPI | NOT RUN: supported interpreter absent |
| Frontend lint, typecheck, build | NOT RUN: `frontend/node_modules` absent |
| Frontend unit/E2E | NOT RUN: scripts and dependencies absent; owned by R01 |
| Post-run protected-data diff | PASS: empty |

No unavailable check is represented as passed.

## Acceptance-Criteria Mapping

- PASS: exact branch, commit, initial clean status, and primary dirty/CRLF-only paths were recorded without alteration.
- PASS: user-owned changes were preserved under the owner-authorized dedicated-worktree isolation strategy.
- PASS: B01–B08 each have a disposition recorded in the committed task definitions.
- BLOCKED: G01 lacks explicit owner approval evidence.
- BLOCKED: the `docs/IMPLEMENTATION_PLAN.md` topology conflict lacks an approved reconciliation decision.
- BLOCKED: no supported pinned POSIX Python environment exists; dependency installation was not authorized.
- BLOCKED: backend execution baseline and Django checks could not run.
- BLOCKED: frontend lint/typecheck/build could not run because dependencies are absent.
- PASS: the verification wrapper requires and creates a unique disposable `/tmp` root and rejects unsafe roots.
- PASS: every prepared artifact class is rooted below the disposable run directory.
- PASS: repository SQLite data and checked-in schema were not changed.
- PASS: no application code, behavior, existing migration, dependency manifest, or lockfile was changed.
- PASS: evidence distinguishes pass, blocked, and not-run checks.
- PASS: R01–R18 remained `BLOCKED` and `UNASSIGNED` throughout R00.
- PASS: R00 is handed off at `REVIEW`, not `DONE`.

## Unresolved Risks

1. Explicit owner approval is still required for all three G01 architecture decisions.
2. The `cms.abrit.ir` statement in `docs/IMPLEMENTATION_PLAN.md` conflicts with the proposed same-origin `/cms` topology.
3. Dependency-installation authorization is required before creating `.runtime/phase1-venv` from `requirements.txt` and installing the locked frontend dependencies.
4. Backend tests/checks/migrations/OpenAPI and frontend lint/typecheck/build have no executed baseline yet.
5. The approved plan prose retains stale migration identifiers and the obsolete R00 worktree design; the committed task board/contract contain the corrected execution rules and ownership.
6. The primary `master` worktree retains 35 user-owned CRLF-only tracked modifications, including initial migrations. They remain isolated but unresolved.
