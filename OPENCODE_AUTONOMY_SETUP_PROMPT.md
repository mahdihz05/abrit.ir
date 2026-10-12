# One-time OpenCode Autonomy Setup Prompt

Use the installed `customize-opencode` skill.

Configure this project for an unattended local-development session, using the configuration syntax supported by the currently installed OpenCode version. Do not guess between legacy and V2 permission syntax; inspect the installed version/current config schema first.

Repository:
`C:\projects\abrit-opencode`

Requirements:

## Allow without repeated approval
Allow routine work needed inside this repository:
- read / list / glob / grep / search
- edit/write/apply patch inside this repository
- project skills
- TypeScript/Next/Payload LSP operations
- subagents
- normal Git inspection: status, diff, log, show, branch
- explicit-file Git staging
- local Git commits
- npm/npx commands for existing project scripts
- lint/typecheck/test/build/check
- `npx tsx` project scripts
- starting/stopping local dev server
- Docker Compose inspection and local development service operations
- local Postgres backup and local Payload development DB work that is explicitly authorized by the overnight checklist
- read-only access to `C:\projects\abrit.ir` as legacy evidence

## Explicitly deny
Create explicit deny rules for:
- `git push`
- force push
- branch merge/rebase of other development branches
- destructive reset/clean/restore commands that discard work
- deployment commands
- production/staging DB access or mutations
- destructive Docker volume removal
- deletion of the legacy repo
- reading/printing secret values from `.env`
- staging/committing `.env`
- arbitrary package dependency upgrades
- `npm audit fix --force`
- full `migrate:django`
- production migration execution

## Important
- Do not weaken repository AGENTS.md safety rules.
- Do not modify application source code as part of permission setup.
- Prefer project-level configuration.
- Preserve existing NaraRouter/OpenAI provider/model configuration.
- Do not remove installed skills.
- If auto-approve mode is supported by this OpenCode version, explain the exact UI action needed to enable it after explicit deny rules are installed.
- Validate that explicit denies still apply under auto-approve.
- Report the exact config file changed and summarize effective permissions.
