# R00 Coordinator Decision — 2026-08-26

## Owner approvals recorded

The repository owner explicitly approved:

1. Same-origin Django under `/cms` as the Phase 1 topology.
2. React Admin supplementing Django Admin within the approved Phase 1 scope.
3. Fixed reserved roles with superuser-only user and role management.
4. Reconciling `docs/IMPLEMENTATION_PLAN.md` to the same-origin `/cms` topology.
5. A narrow R00 exception for `backend/apps/forms/storage.py` and `backend/apps/forms/migrations/0003_alter_submissionfile_file.py`.

The exception authorizes a deconstructible private-submission storage identity and its forward migration only. It preserves the configured runtime location, does not edit an initial migration, and does not authorize dependency-manifest or lockfile changes.

## R00 contract and implementation reconciliation

The control R00 contract now explicitly authorizes the two exception paths. Read-only review of `/mnt/c/projects/abrit-r00` found exactly these relevant application changes:

- `PrivateSubmissionStorage` is deconstructible and still configures `settings.PRIVATE_MEDIA_ROOT / "form-submissions"` with no base URL.
- `forms.0003_alter_submissionfile_file` alters the field state forward from `0002`; `0001_initial.py` is untouched.

The remaining R00 changes are the approved topology documentation, readiness evidence, verification-wrapper remediation, and the ignored local Python runtime path. No R01–R18 implementation change or task assignment was found.

## Evidence reviewed

The R00 readiness report records a final contained baseline exit of 0 and PASS results for Django checks, disposable migrations, migration drift, all 22 backend tests, OpenAPI validation, frontend lint, typecheck, production build, protected-data comparison, and whole-worktree comparison. Its wrapper also passed syntax validation and its disposable-root/parent-relative-input protections were reviewed.

Current read-only coordinator checks found the R00 diff clean under `git diff --check`, the wrapper valid under `bash -n`, R00 in `REVIEW`, and R01–R18 all `BLOCKED` and `UNASSIGNED` before this board update. No new blocking defect was found.

## Coordinator decision and task states

R00 is marked `DONE`. Its predecessor gate is therefore satisfied. B01, B02, B04, B05, B08, G01, G02, and G03 have recorded dispositions/evidence sufficient for the first wave. R01, R02, and R03 are each changed from `BLOCKED` to `READY`; their owners remain `UNASSIGNED`.

R04–R18 remain `BLOCKED` and `UNASSIGNED`, principally because they depend on R01, R02, R03, or later tasks. B03 and B07 remain implementation-contract inputs for R05 and do not block the eligible first wave.

## Remaining coordination risks

- The R00 worktree remains uncommitted; integration must preserve and review its approved diff before merging.
- `/mnt/c/projects/abrit.ir` has user-owned concurrent changes and was not modified. Its later substantive drift remains outside R00's isolated baseline.
- R01 must retain sole ownership of frontend package and lockfile edits. Future tasks must use the disposable verification flow and must not edit initial migrations.
