# R03/R02 content service coordination

Date: 2026-08-26

R03 remediation inspected the active R02 worktree before editing
`backend/apps/content/services.py`. R02 owns the centralized audit behavior in
that file: `write_audit_log`, `AuditAction`, recursive redaction, and atomic
rollback semantics must be preserved during integration.

R03 is authorized by the remediation request to add the trusted
`workflow_transition()` boundary around the model saves performed by
`publish_translation`, `unpublish_translation`, and `restore_revision`.
Scheduled publication continues through `publish_translation` and therefore
uses the same trusted boundary. R03 will not alter audit/revalidation ordering
or transaction boundaries.

The coordinator must integrate the R03 workflow-context hunk with the R02
service audit hunk; neither branch's service behavior supersedes the other.

R02 subsequently committed its audit foundation as `00959e0`. A disposable
combined checkout based on that commit plus completed R00 commit `b079058`
was overlaid with the R03 model/Admin/accounts changes and the workflow-context
hunk. Global migration drift reported `No changes detected`; the combined
accounts/core/content/forms suite reported `42 passed, 1 warning`. This proves
the context wrappers retain R02's centralized audit and transaction rollback
behavior.

The control integration initially reproduced the overlap as nine publication,
restore, and admin failures: R02 services were not entering R03's workflow
transition context. The R02-owned `content/services.py` boundary now wraps
publish, unpublish, and restore mutations with `workflow_transition()`;
focused checks pass 47 tests and the full backend suite passes 52 tests.
