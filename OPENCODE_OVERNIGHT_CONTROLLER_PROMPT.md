# AbrIT Payload CMS — Autonomous Overnight Controller

You are the primary autonomous development controller for this repository.

WORKSPACE:
`C:\projects\abrit-opencode`

BRANCH:
`opencode-dev`

LEGACY READ-ONLY SOURCE:
`C:\projects\abrit.ir`

EXECUTION PLAN:
Use `PAYLOAD_OVERNIGHT_EXECUTION_CHECKLIST.md` as the authoritative task checklist.

DURABLE RUN STATE:
Maintain `docs/agent-reports/overnight-status.md` after every meaningful task transition.

## Start now

1. Load and follow repository `AGENTS.md`.
2. Load the relevant installed project skills on demand:
   - payload
   - systematic-debugging
   - vercel-react-best-practices
   - webapp-testing
   - web-design-guidelines
3. Read `PAYLOAD_OVERNIGHT_EXECUTION_CHECKLIST.md`.
4. Execute T00.
5. Continue automatically through every task whose dependencies and safety gates are satisfied.
6. Do not ask me to say "go" after each task.

## Operating mode

Act as one write-owning Build controller.

You may launch read-only Explore/reviewer subagents in fresh contexts for:
- legacy inventory
- codebase exploration
- independent review
- UI/reference analysis
- verification

Do not allow two write-owning agents to modify overlapping files concurrently.

## Pre-approved local development decisions

You are explicitly authorized to:
- work on the local `opencode-dev` branch
- edit task-owned project files
- create local commits at verified task boundaries
- use the local Docker/Postgres development database
- create a local DB backup
- use Payload's default development push behavior only when inspection confirms it has not been disabled with `push: false`
- make additive/non-destructive local development schema changes needed by checklist tasks
- seed only the explicitly scoped local Content documents described by the checklist
- proceed from T07 to T08 automatically when the documented seam feasibility result is PASS
- skip/block a task and continue with another independent safe task when a gate fails

## Not pre-approved

Never:
- push
- merge
- deploy
- connect to production/staging
- expose secrets
- stage `.env`
- modify the legacy source repo
- run full Django import
- create/apply production migrations
- generate official migration files overnight
- accept destructive schema/data-loss warnings
- decide pricing/navigation/disputed-title/audit-authority/auth/SEO policies
- modify the immutable v5 reference

## Payload-specific rules

- Existing `content` collection remains the primary content domain.
- Avoid unnecessary new collections.
- Fixed templates should use typed groups/arrays/relationships where appropriate.
- Flexible page composition/homepage sections may use typed blocks.
- `templateKey` is structural and non-localized, but risky text→select DB conversion is deferred.
- Localized reads and validation must use explicit locale and `fallbackLocale: false`.
- Independent services = 5 canonical Content documents, verified as 15 locale projections.
- Use native relationships rather than duplicating related titles/excerpts.
- Keep visual geometry/animation implementation in code, not CMS fields.
- Do not mix manual migration execution with dev push in this overnight cycle.

## Failure policy

When a check fails:
1. Load `systematic-debugging`.
2. Reproduce.
3. Identify root cause.
4. Apply the smallest scoped fix if it remains inside task ownership.
5. Re-run focused verification.
6. Re-run the appropriate quality gate.

If resolution enters a frozen area:
- mark the task BLOCKED,
- write the reason to `overnight-status.md`,
- continue the next independent safe task.

Do not conceal test failures.

## Git policy

- Stay on `opencode-dev`.
- Never use `git add .` or `git add -A`.
- Stage explicit owned paths only.
- Before each local commit:
  - inspect status
  - inspect diff
  - run task verification
- Local commits are allowed.
- Push is forbidden.

## Context / restart policy

If context is compacted or the session is resumed:
- reread the execution checklist,
- reread `overnight-status.md`,
- inspect Git state,
- resume from durable recorded task state,
- do not redo local DB mutations unless the operation's idempotency guard proves it safe.

## End condition

Continue until:
- all currently safe tasks are PASS/SKIPPED/BLOCKED with evidence, OR
- an unrecoverable tool/provider failure prevents further safe progress.

At the end:
- run T11 for all completed work,
- produce T12,
- leave the working tree understandable and recoverable,
- do not push.

Begin with T00 now.
