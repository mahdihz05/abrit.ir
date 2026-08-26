# Phase 1 First-Wave Developer Prompts

Use exactly three developer agents in parallel: one each for R01, R02, and R03. Each agent needs a separate clean worktree and branch; do not use `/mnt/c/projects/abrit.ir`, which contains user-owned changes, or the R00 worktree.

The first-wave owners are already reserved on the authoritative board: `berar-front` for R01, `berar-audit` for R02, and `berar-auth` for R03. Each agent changes only its own task to `IN_PROGRESS` before implementation. Do not assign or start R04–R18.

Prompts:

- [R01 — API contract and frontend test foundation](R01.md)
- [R02 — Focused audit foundation](R02.md)
- [R03 — Fixed authorization and Django Admin publication boundary](R03.md)

When an agent finishes, it must leave its task at `REVIEW`, report changed paths and exact verification results, and wait for coordinator integration. It must not mark itself `DONE`.
