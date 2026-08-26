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
