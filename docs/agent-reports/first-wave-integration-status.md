# First-Wave Integration Status — 2026-08-26

## R00 integration

The approved R00 change set is committed as `b079058` and merged into the control integration branch as `a738c9a`.

Integrated paths:

- `.gitignore`
- `backend/apps/forms/storage.py`
- `backend/apps/forms/migrations/0003_alter_submissionfile_file.py`
- `docs/agent-reports/phase-1-readiness.md`
- `scripts/check-phase1.sh`

The topology documentation was already changed identically by the coordinator, so the merge preserved that change without a duplicate conflict. The integration contains the deconstructible `PrivateSubmissionStorage` at the same configured private-media location and leaves `forms/0001_initial.py` unchanged.

Coordinator verification on the integrated control branch used a disposable `/tmp/abrit-r00-integration.XwG4eyO0` root and the approved R00 environment:

- clean migration database: `forms.0001`, `forms.0002`, and `forms.0003` applied;
- migration drift: `makemigrations --check --dry-run` returned `No changes detected`;
- upgrade migration database: `forms.0002` then `forms.0003` applied successfully.

## Reconciled first-wave state

| Task | Owner | Current state | Coordinator decision |
|---|---|---|---|
| R01 | `berar-front` | `IN_PROGRESS` | Remediate test tooling/package-lock evidence; do not enter `REVIEW` yet. |
| R02 | `berar-audit` | `REVIEW` | Hold new implementation. Recheck only after R00 integration and the R03/R02 service plan are applied. |
| R03 | `berar-auth` | `IN_PROGRESS` | Remediate and supply workflow/audit-compatible evidence; do not enter `REVIEW` yet. |
| R04 | `UNASSIGNED` | `BLOCKED` | Do not start. R01 is not integrated. |
| R05 | `UNASSIGNED` | `BLOCKED` | Do not start. R02 and R03 are not integrated. |

The task-board copies inside R01–R03 are stale because those dedicated worktrees began before control's R00 integration. Their code must not be interpreted as integrated state. Their owners must rebase/reconcile with control before a review handoff.

## Remediation and ownership decisions

### R01

R01 added Vitest and Playwright configuration/scripts but its `package.json` has no Vitest, Playwright, jsdom, or Testing Library dependencies and `frontend/package-lock.json` is unchanged. `berar-front` must add only the R01-owned test dependencies, synchronize the lockfile, and provide exact passing `lint`, `typecheck`, `test`, `build`, and `test:e2e -- --list` evidence from the integrated base. No backend work is authorized.

### R02 and R03

R02 owns the centralized audit implementation in `backend/apps/content/services.py`: the `write_audit_log` call, controlled audit actions, recursive redaction, audit metadata, and atomic rollback behavior must remain intact.

R03 is authorized to contribute only the narrow `workflow_transition()` context around the existing model-save paths in `publish_translation`, `unpublish_translation`, and `restore_revision`. It must not replace R02's audit/revalidation ordering or transaction boundaries. Scheduled publication must continue through `publish_translation`.

Both branches also modify `backend/apps/content/tests.py`. The final integrated test file must retain R02's audit rollback test and R03's crafted workflow/publication-boundary tests. The coordinator must resolve this hunk deliberately; neither agent may overwrite the other's version.

The retained coordination note is `docs/agent-reports/R03-R02-service-coordination.md`.

## Required integrated verification before any R01–R03 task can be DONE

1. Clean migration test.
2. Upgrade migration test.
3. `makemigrations --check --dry-run` migration-drift test.
4. Combined backend verification, including Django checks and OpenAPI validation.
5. Combined frontend lint, typecheck, unit tests, production build, and E2E test listing.
6. Focused R01, R02, and R03 tests, including audit rollback/redaction and publication/Group/Admin bypass coverage.
7. Whole-worktree/protected-data comparison showing disposable verification did not alter repository state.

Until that evidence is recorded against the integrated branch, all first-wave tasks remain short of `DONE`.
