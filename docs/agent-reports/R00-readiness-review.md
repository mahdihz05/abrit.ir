# R00 Readiness Independent Review

## Verdict

CHANGES REQUIRED

**R00 work quality: 8/10**

The R00 agent behaved safely, preserved the primary worktree, stayed within its documentation/readiness scope, and reported unavailable verification honestly. Its decision that Phase 1 remains blocked is correct.

R00 must not be marked `DONE` yet. Owner/architecture approvals and the executable baseline are still missing, and the verification wrapper has two material containment/accuracy defects that should be corrected before dependencies are installed and the baseline is run.

## What Was Verified

Independent read-only checks confirmed:

- Branch is `feat/p1-r00-readiness`.
- Worktree and primary repository share commit `54b691852c07a302b98ccf52a7157a19fdbb03a6`.
- R00 changed only its task status documents and added the readiness report and verification wrapper.
- No backend, frontend, initial migration, dependency manifest, lockfile, database, or checked-in schema change was introduced by R00.
- R01–R18 remain `BLOCKED` and `UNASSIGNED`.
- The primary worktree has 35 tracked changes, no untracked files, and `git diff --ignore-cr-at-eol --quiet` succeeds; the recorded CRLF-only conclusion is reproducible.
- `bash -n scripts/check-phase1.sh` succeeds.
- The wrapper refuses an unset verification root with exit 64.
- The wrapper refuses the repository as a verification root with exit 64.
- With `/tmp/abrit-r00-review`, the wrapper creates a unique run directory, reports the missing Python/frontend dependencies, preserves protected files, and exits 2 as documented.
- The readiness report does not represent blocked or unexecuted checks as passed.

## Blocking Findings

### 1. G01 approval evidence is still absent

The readiness report correctly records all three G01 decisions as blocked:

- same-origin `/cms` topology;
- React Admin supplementing Django Admin;
- fixed roles with superuser-only user management.

The R00 contract requires explicit owner disposition, and the task board says R00 cannot pass review without it. Incorporating B01–B08 into the task board is useful, but it is not a substitute for explicit owner approval of G01 or the topology reconciliation.

Required action: record an owner decision for G01 and for changing `docs/IMPLEMENTATION_PLAN.md` from `cms.abrit.ir` to the approved topology, or record rejection and revise the downstream plan.

### 2. G03 and the executable baseline are not complete

The supported POSIX Python environment is absent, Django/DRF cannot be imported, frontend dependencies are absent in this worktree, and backend/frontend baseline commands did not run. This is reported truthfully, but it means R00 has not yet established the executable baseline required to unlock R01–R03.

Required action: obtain dependency-installation authorization, create the approved ignored environment, make locked frontend dependencies available, and rerun the complete baseline wrapper. Record actual pass/fail output; do not mark R00 `DONE` merely because the missing environment was documented.

### 3. Disposable frontend build omits a required repository-root input

The wrapper copies only `frontend/` into:

```text
$run_dir/frontend-build/source
```

The application reads the homepage reference from `path.join(process.cwd(), "..", "abrit-homepage-polished-v5.html")`, and `next.config.ts` includes that same parent-relative file. The wrapper does not copy `abrit-homepage-polished-v5.html` into `$run_dir/frontend-build/`.

Once frontend dependencies exist, the disposable production build can fail because the required input is absent. That would be a wrapper-induced false baseline failure rather than a repository failure.

Required action: copy the root reference HTML read-only into `$run_dir/frontend-build/abrit-homepage-polished-v5.html` before running frontend checks, and add a wrapper self-test proving the disposable copy contains every parent-relative build input.

### 4. The wrapper protects only two repository paths

The before/after snapshot covers only:

- `backend/data/abrit.sqlite3`;
- `backend/schema.yml`.

This is valuable but does not prove that tests or tools leave the rest of the worktree unchanged. A backend test, formatter, type generator, or future command could alter another tracked or untracked repository file while the wrapper still reports protected data unchanged.

Required action: snapshot `git status --porcelain=v1 -z` before verification and compare it afterward. The wrapper should fail if verification adds, removes, or modifies any repository path relative to its initial state. Preserve the initial dirty state rather than requiring an absolutely clean worktree.

### 5. The approved runtime path is not ignored

R00 expects `.runtime/phase1-venv`, but `.runtime/` is not currently in `.gitignore`. Installing the environment there would create substantial untracked repository state and undermine the clean baseline.

Required action: either use the already ignored `.venv/` hierarchy, place the environment under `/tmp`, or add a narrowly scoped `.runtime/phase1-venv/` ignore entry as an explicitly approved R00 change before installation.

## Required Corrections Before R00 Can Be Done

1. Record explicit owner approval or rejection for all G01 decisions.
2. Record the approved `docs/IMPLEMENTATION_PLAN.md` topology reconciliation.
3. Fix the disposable frontend copy to include `abrit-homepage-polished-v5.html` at the required parent-relative path.
4. Add whole-worktree before/after status comparison to the wrapper.
5. Select an ignored location for the POSIX environment.
6. Obtain installation authorization and establish the pinned Python/frontend environment.
7. Run backend checks, migrations against the disposable database, migration drift, all 22 backend tests, and OpenAPI validation.
8. Run frontend lint, typecheck, and production build from the corrected disposable copy.
9. Recheck that all repository paths and protected data remain unchanged.
10. Update `phase-1-readiness.md` with actual outputs and final pass/fail evidence.

## Non-Blocking Cleanup

- `phase-1-tasks.md` ends with a stale sentence saying R00 is `CLAIMED`, while its task entry is `REVIEW`. Update the summary to match.
- R08 contains `Status: BLOCKED` twice in the shared task board.
- The R00 lifecycle requires a transient `IN_PROGRESS` state before modifications, but the final diff alone cannot prove that transition occurred. The readiness report should record the transition timestamp or task-board history if lifecycle evidence matters.
- `scripts/check-phase1.sh` currently supports only `--baseline`, while later task-board commands refer to `--backend`, `--schema`, and `--all`. This does not block R00, but ownership and timing for extending the wrapper should be assigned before R01–R18 rely on those commands.
- The wrapper creates an `e2e` directory but does not yet configure a future browser runner to use it. R01 should bind its selected runner's output, downloads, screenshots, traces, and browser cache to the disposable root.

## Final Decision

The R00 submission is safe and useful, but **not approved for `DONE`**. Leave R00 in `REVIEW` (or return it to `IN_PROGRESS` for corrections), keep R01–R18 blocked, and complete the five blocking findings above. After those corrections and a successful executable baseline, R00 should be suitable for approval without redesigning its overall approach.
