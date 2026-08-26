# AbrIT Phase 1 R00 Readiness Evidence

## Decision

R00 remediation is **READY FOR REVIEW** and must not be marked `DONE` by the implementer.

The repository owner explicitly approved all three G01 decisions, the same-origin `/cms` topology reconciliation, installation of the pinned backend and locked frontend environments, and the narrow forward migration correction required by the executable baseline on 2026-08-26. The initial migration remains unchanged. Private submission storage now has a path-independent migration identity while retaining the configured runtime location, and the final complete baseline exits 0.

No R01–R18 work was performed. Those tasks remain `BLOCKED` and `UNASSIGNED`.

## Execution Context

- Branch: `feat/p1-r00-readiness`
- Worktree: `/mnt/c/projects/abrit-r00`
- R00 remediation base commit: `8ffd528` (`docs: complete R00 readiness workflow`)
- Application baseline commit shared with primary `master`: `54b691852c07a302b98ccf52a7157a19fdbb03a6`
- Primary repository: `/mnt/c/projects/abrit.ir`, reference/integration context only
- R00 owner: `phase1-readiness-agent`
- Lifecycle: `REVIEW` from the first submission, returned to `IN_PROGRESS` for remediation, and returned to `REVIEW` after the final exit-0 baseline

No branch/worktree was created or switched. The primary repository was not modified.

## Referenced Documents

The authoritative control review was read first from:

- `/mnt/c/projects/abrit-agent-control/docs/agent-reports/R00-readiness-review.md`

The following local contract/planning sources were then read:

- `docs/agent-tasks/R00.md`
- `docs/agent-tasks/phase-1-tasks.md`
- `docs/agent-reports/phase-1-readiness.md`
- `docs/agent-reports/phase-1-plan-aprove.md`
- `docs/agent-tasks/readiness-analysis.md`
- `docs/IMPLEMENTATION_PLAN.md`

## Existing Uncommitted-Change Review

Git metadata cannot attribute an uncommitted edit to a particular person. The current R00 deltas match the independent review remediation and the owner's subsequent approvals:

| File | Classification | Disposition |
|---|---|---|
| `.gitignore` | Post-review remediation; explicitly permitted by R00 and required before the documented runtime path may be used | Keep the narrow `.runtime/phase1-venv/` rule |
| `scripts/check-phase1.sh` | Post-review fixes for the missing frontend input and whole-worktree guard | Keep, correct, and verify |
| `docs/agent-reports/phase-1-readiness.md` | Post-review evidence update | Record exact resolution and verification status without claiming blocked checks passed |
| `docs/IMPLEMENTATION_PLAN.md` | Owner-approved topology reconciliation | Replace the conflicting subdomain statement with same-origin `/cms` |
| `backend/apps/forms/storage.py` | Owner-authorized baseline correction | Give private storage a path-independent deconstructible migration identity without changing its runtime location |
| `backend/apps/forms/migrations/0003_alter_submissionfile_file.py` | Owner-authorized forward migration | Correct migration state without editing `0001_initial.py` |

There is no evidence that any of these changes should be reverted as unrelated reviewer output.

R01–R18 remain `BLOCKED` and `UNASSIGNED`.
The task contract and shared board were transitioned through `IN_PROGRESS` and restored to their committed `REVIEW` text, so they have no final content delta.

## Baseline Isolation and Line Endings

The dedicated R00 worktree began clean at the application baseline commit. At independent review, the separate primary `master` worktree had 35 modified tracked files, no untracked files, and only CRLF differences.

G02 disposition remains isolation: preserve the primary worktree byte-for-byte and perform R00 only in the dedicated worktree. No primary path was staged, normalized, committed, reverted, moved, or deleted.

After the final contained run, a read-only recheck found concurrent primary-worktree drift: 40 modified tracked paths and 8 untracked files. Eight tracked paths now have substantive differences after ignoring CR-at-EOL (`frontend/src/app/[locale]/search/page.tsx`, `frontend/src/app/globals.css`, `frontend/src/app/sitemap.ts`, `frontend/src/components/homepage-runtime.tsx`, `frontend/src/components/reference-homepage.module.css`, `frontend/src/components/site-footer.tsx`, `frontend/src/components/site-header.tsx`, and `frontend/src/components/structured-data.tsx`). The untracked files are under `frontend/src/app/[locale]/independent-services/`, `frontend/src/app/api/forms/`, and related `frontend/src/components/` and `frontend/src/lib/` paths. R00 did not modify the primary worktree; the dedicated-worktree isolation prevented this concurrent activity from changing the R00 verification state.

## G01 Approval Evidence

G01 means explicit repository-owner disposition for all three decisions below. Proposed plan text and implementer inference are not approval evidence.

| Decision | Required evidence | Current state |
|---|---|---|
| Same-origin `/cms` topology | Owner records approve or reject | APPROVED by the repository owner on 2026-08-26 |
| React Admin supplements Django Admin within the frozen Phase 1 charter | Owner records approve or reject | APPROVED by the repository owner on 2026-08-26 |
| Fixed reserved roles with superuser-only user/role management | Owner records approve or reject | APPROVED by the repository owner on 2026-08-26 |

R00-IMPLEMENTER recorded the owner's explicit disposition and did not infer or self-approve it.

## Topology Reconciliation

Repository/runtime evidence consistently implements or packages same-origin Django below `/cms`:

- `.env.example` sets `DJANGO_SCRIPT_NAME=/cms`.
- `.env.example` sets frontend/backend API URLs below the same origin at `/cms/api/v1`.
- `backend/config/settings/base.py` maps `DJANGO_SCRIPT_NAME` to `FORCE_SCRIPT_NAME`.
- `scripts/package-frontend.ps1` packages API URLs below `/cms/api/v1`.
- The Version 2 plan proposes the same-origin `/cms` topology.

The sole conflicting architecture statement is `docs/IMPLEMENTATION_PLAN.md`, which says `cms.abrit.ir` serves Django Admin and `/api/v1`.

The owner approved the evidence-backed reconciliation on 2026-08-26. `docs/IMPLEMENTATION_PLAN.md` now states that `abrit.ir` serves Next.js and same-origin Django under `/cms`, including Django Admin and `/cms/api/v1`.

## Environment Investigation

The repository owner separately authorized the R00 dependency/bootstrap installation on 2026-08-26. No dependency manifest, lockfile, or pinned version was changed.

### Backend

- `.runtime/phase1-venv/bin/python` reports Python `3.14.4`.
- The exact `requirements.txt` pins were installed into the ignored environment with owner authorization.
- `pip check` passes and all pinned import names pass; Django reports `5.2.17`.
- The Windows environment under the primary repository was not used from WSL.

### Frontend

- `npm ci` completed from the unchanged `frontend/package-lock.json`; npm reported 351 packages added, 0 vulnerabilities.
- Linux-compatible Next SWC GNU and musl runtimes resolve from the ignored worktree dependency tree.
- The wrapper copies the dependency tree below `/tmp` before running frontend commands.
- Frontend lint, typecheck, and production build pass from the disposable copy when the build has outbound access to its declared Google Fonts.

## Verification Wrapper Corrections

`scripts/check-phase1.sh` now:

- rejects unset, symlinked, and out-of-policy roots;
- creates a unique run directory below an explicit `/tmp` root;
- routes database, media, private media, caches, pytest, schema, frontend build, npm, migration, temporary, and E2E artifacts below it;
- copies `abrit-homepage-polished-v5.html` to the required parent-relative disposable path and verifies it byte-for-byte;
- snapshots `git status --porcelain=v1 -z` before and after, preserving and comparing the initial dirty state;
- snapshots protected SQLite/schema state before and after;
- blocks backend commands when pinned imports are incomplete;
- validates lock/package compatibility before reusing primary frontend dependencies;
- copies frontend dependencies below `/tmp` so Next cannot write into the primary repository;
- blocks typecheck/build when an available tree lacks a Linux Next SWC runtime;
- distinguishes pass, fail, blocked, and not-run results.

## Verification Results

Final contained run with authorized outbound access for declared Google Fonts:

```text
ABRIT_VERIFY_DIR=/tmp/abrit-phase1-r00-final scripts/check-phase1.sh --baseline
RUN_DIR=/tmp/abrit-phase1-r00-final/run.m7wulROk
exit: 0
```

| Verification | Result |
|---|---|
| Branch/worktree/commit evidence | PASS |
| `bash -n scripts/check-phase1.sh` | PASS |
| Unset verification root | PASS: refused, exit 64 |
| Repository-owned verification root | PASS: refused, exit 64 |
| Unique disposable run root | PASS |
| Required parent-relative HTML input | PASS: present and byte-identical |
| Python executable/version | PASS: Python 3.14.4 |
| Pinned backend imports and `pip check` | PASS: Django 5.2.17; no broken requirements |
| Django checks | PASS: no issues |
| Disposable migrations | PASS: all migrations applied below `/tmp` |
| Forward storage migration | PASS: `forms.0003_alter_submissionfile_file` applies after `0002` |
| Migration drift | PASS: no changes detected across multiple disposable private-media roots |
| Backend tests | PASS: 22 passed |
| OpenAPI validation | PASS |
| Locked Linux frontend installation | PASS: `npm ci`; 0 vulnerabilities |
| Frontend dependency tree | PASS |
| Frontend lint | PASS |
| Frontend typecheck | PASS |
| Frontend production build | PASS: 76 static pages generated |
| Frontend unit/E2E | NOT RUN: scripts are not defined; R01 owns that foundation |
| Protected SQLite/schema comparison | PASS: unchanged |
| Whole-worktree before/after comparison | PASS: initial dirty state unchanged |
| Primary `master` isolation | PASS: R00 made no primary-worktree write; final read-only evidence detected concurrent drift to 40 tracked modifications and 8 untracked files |

The final wrapper run passes every defined R00 backend and frontend baseline command. Frontend unit/E2E remain explicitly not run because those scripts do not exist and R01 owns their foundation.

## Acceptance-Criteria Mapping

- PASS: exact execution context and baseline state are recorded without altering user changes.
- PASS: the dedicated-worktree isolation strategy insulated R00 from concurrent primary-worktree changes.
- PASS: B01–B08 dispositions remain recorded in the committed task board.
- PASS: all three G01 decisions have explicit owner approval.
- PASS: the owner-approved same-origin `/cms` reconciliation is recorded in `docs/IMPLEMENTATION_PLAN.md`.
- PASS: the pinned POSIX backend environment is complete and consistent.
- PASS: the owner-authorized forward storage migration applies and migration drift is clean without editing the initial migration.
- PASS: backend checks, disposable migrations, all 22 tests, and OpenAPI validation execute successfully.
- PASS: locked Linux frontend dependencies, lint, typecheck, and production build execute successfully.
- PASS: disposable-root validation and artifact routing are proven.
- PASS: protected data and the complete initial worktree state remain unchanged.
- PASS: no existing migration, dependency manifest, lockfile, or dependency version changed; the new storage class preserves the configured runtime path and a forward migration records its stable identity.
- PASS: R01–R18 remain `BLOCKED` and `UNASSIGNED`.
- PASS: R00 returns to `REVIEW`, not `DONE`.

## Remaining Blockers

None. Reviewer/integration flow still owns the decision to mark R00 `DONE`; R01–R18 remain blocked and unassigned until that occurs.
