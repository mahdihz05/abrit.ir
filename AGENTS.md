# Agent Workflow — AbrIT Payload CMS

Next.js 16 + Payload 3 + PostgreSQL, one Node process: public site, `/admin`, compatibility APIs.

## Repo state (read before any git work)
- This directory is a git **worktree of `/mnt/c/projects/abrit.ir`**, but its `.git` file holds a
  Windows-style path (`C:/projects/...`), so WSL git does NOT see this directory as a repository.
  Do not rely on git commands here from WSL. The main repo (master + other worktrees) is usable
  from WSL at `/mnt/c/projects/abrit.ir`. Fixing the pointer so both Windows and WSL git work
  needs the user's decision — ask first.
- Run dev: `docker compose up -d` (pg on 5433), `cd frontend && npm install && npm run seed && npm run dev` → http://localhost:3000/fa, /admin.
- `.env` contains secrets — never read it into output, never commit it.

## Tooling (global setup — see ~/.config/opencode/AGENTS.md for the full workflow)
Use the five-tool lifecycle for substantial changes in this repo:
DISCUSS → LAVISH plan → review → TREEHOUSE workspace (if parallel work) → implement →
test/build/lint → NO MISTAKES gate → fix → re-gate → human approval → integrate.

- Substantial feature or design question → Lavish artifact first, get review before implementing.
- Multiple independent tasks or parallel agents → one `treehouse get --lease` worktree each;
  never let two agents edit this working tree.
- Bounded long-running objectives (coverage, migration, repetitive cleanup) →
  `gnhf --agent opencode` with explicit iteration/stop bounds, in an isolated worktree.
- Before any integration: `git push no-mistakes <branch>` (pipeline agent: opencode).
- Multi-agent coordination → firstmate home at `~/agent-tools/firstmate` (interactive opencode).
