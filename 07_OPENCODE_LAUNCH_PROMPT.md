# OpenCode Launch Prompt

Execute the Payload CMS Starter V1 productization and public release from start to finish.

Destination GitHub repository:

`https://github.com/mahdihz05/payload-CMS.git`

Read and obey in this order:

1. `00_STARTER_V1_MASTER_EXECUTION.md`
2. `01_STARTER_V1_EXECUTION_CHECKLIST.md`
3. `02_CONTEXT_COMPACTION_AND_RESUME_PROTOCOL.md`
4. `03_STARTER_V1_EXECUTION_STATE.md`
5. `04_GITHUB_RELEASE_AND_MAINTENANCE.md`
6. `05_README_REQUIREMENTS.md`
7. `06_LONG_TERM_RELIABILITY_STANDARD.md`

Use the current source repository, completed SEO implementation/reports, and the supplied Starter Readiness Snapshot as evidence.

This is NOT a planning-only task.

Start executing immediately:

`inspect -> implement -> test -> fix -> retest -> record state -> compact when needed -> continue`

Do not ask for approval between phases.

Do not stop after a phase, partial implementation, report, commit, local build, or first test pass.

When context grows, update `03_STARTER_V1_EXECUTION_STATE.md`, compact according to the protocol, then immediately resume the next unchecked checklist item.

Do not repeat completed repository-wide SEO audits.

If one item is genuinely externally blocked, record evidence, mark only that item BLOCKED, and continue every independent executable task.

Do not mutate production data.
Do not publish ABRIT/private content or secrets.
Do not blindly push the source repository history to the public destination.
Do not force-push.

The public starter must be generic, fresh-clone tested, documented, CI-tested, Docker-tested, SEO-ready, maintainable, and suitable as the base for future websites.

Generate the final public `README.md` according to `05_README_REQUIREMENTS.md` and actual tested behavior.

Publish the completed clean starter to:

`https://github.com/mahdihz05/payload-CMS.git`

using `main`, then create/push `v1.0.0`, and create a GitHub Release if authenticated tooling permits.

If repository-setting API/tooling permits, configure repository description/topics and enable Template Repository. Otherwise record the exact one-time GitHub UI action required.

Only after all valid final gates are satisfied create:

`.payload-starter-v1-complete`

and:

`STARTER_V1_FINAL_REPORT.md`

Then stop.

Do NOT begin any site-specific visual redesign.

## Mandatory Destination Repository

The finished generic CMS MUST be published to exactly:

`https://github.com/mahdihz05/payload-CMS.git`

The current ABRIT/source repository is only the development input.
Do not publish the final generic starter to the ABRIT website repository.
Do not force-push.
Verify the destination repository state immediately before publication.

## Mandatory Live Progress

Use:

- `01_STARTER_V1_EXECUTION_CHECKLIST.md` as the authoritative checklist.
- `09_PROJECT_PROGRESS.md` as the user-visible progress dashboard.
- `10_update_progress.mjs` as the only progress calculator.

During execution:

- mark the active item `[~]` when practical;
- mark `[x]` only after acceptance/tests pass;
- use `[!]` only for a proven external blocker;
- run `node 10_update_progress.mjs` after meaningful checklist changes.

At the end of EVERY phase, without exception:

1. finalize that phase's checklist state;
2. update `03_STARTER_V1_EXECUTION_STATE.md`;
3. run `node 10_update_progress.mjs`;
4. verify `09_PROJECT_PROGRESS.md`;
5. COMPACT context according to `02_CONTEXT_COMPACTION_AND_RESUME_PROTOCOL.md`;
6. resume the next incomplete phase automatically.

Do not skip phase compaction. It is required to control context/token consumption during long execution.

Do not create `.payload-starter-v1-complete` unless:
- Project Progress is 100.0%;
- no checklist item is open/in-progress/blocked;
- GitHub `main` is published;
- remote `v1.0.0` is published;
- final verification from the published repository passes.
