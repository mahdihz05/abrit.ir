# Payload CMS Starter V1 — Context Compaction / Resume Protocol

`03_STARTER_V1_EXECUTION_STATE.md` is the durable execution memory.

## Compact when

- a major phase ends;
- switching subsystem;
- after long debugging;
- after migration changes;
- before public repository preparation;
- before publication;
- after significant CI failure/fix loops;
- whenever context noise threatens quality.

Compaction is not completion.

## Before compaction record

### Git
- active source branch/worktree
- current HEAD
- uncommitted changes
- destination repo status
- public repo commit/tag/release status

### Execution
- phase
- exact next checkbox
- completed phases
- blockers

### Durable decisions
- site/config genericization
- locale policy
- bootstrap commands
- optional integration strategy
- Page/Block runtime
- migration decisions
- CI/Docker/backup decisions

### Tests
Store only compact summaries:

`<command> — PASS/FAIL — relevant result`

Do not retain full passing logs.

### Active failure
Preserve only:
- reproducible failure
- relevant file/symbol
- last meaningful error
- attempted fixes
- next action

## Discard from context

- huge command outputs
- full passing logs
- whole source files already understood
- obsolete hypotheses
- repeated SEO/ABRIT audits
- resolved debugging trails
- generic framework theory

## Resume

1. read `03_STARTER_V1_EXECUTION_STATE.md`;
2. read only the relevant checklist phase;
3. inspect only files needed for the next item;
4. continue immediately.

Do not restart at Phase 0 unless durable state is corrupted.

## Blockers

Use:

```md
### Blocker
Task:
Evidence:
Attempts:
External requirement:
Can independent work continue? YES/NO
```

Continue independent work.

## Before public push

Compact first. State must explicitly contain:

- public-tree safety scan result;
- fresh-clone result;
- local/CI gate result;
- destination URL/state;
- exact branch;
- intentionally excluded files/data.

## Final state

The state must end with something equivalent to:

```text
Starter V1 implementation: DONE
Fresh clone: PASS
Public safety scan: PASS
GitHub main: <commit or BLOCKED>
Release: v1.0.0 <published or BLOCKED>
CI: <status>
ABRIT runtime coupling: NONE / explicitly optional example only
Visual site design: NOT STARTED
```

# Mandatory Phase-Boundary Sequence

Every phase completion must end with:

1. checklist updated;
2. `03_STARTER_V1_EXECUTION_STATE.md` updated;
3. `node 10_update_progress.mjs` executed;
4. `09_PROJECT_PROGRESS.md` verified;
5. context compacted;
6. next incomplete phase resumed.

Do this even when context capacity is not yet low. The purpose is predictable long-run token/context usage and avoiding accumulation of stale debugging detail.
