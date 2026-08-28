# R18 final production-like verification

Date: 2026-08-28  
Branch: `feat/p1-r18-release-evidence`

## Scope and containment

R18 verification used only disposable roots below `/tmp`. The repository database
and checked-in `backend/schema.yml` were hash-compared before and after each
wrapper run; the git worktree status was also compared. No repository data was
changed. The reusable Python environment and lock-compatible frontend packages
were mounted read-only from the neighboring control worktree because this
worktree did not contain them.

## Commands and results

| Command | Result |
|---|---|
| `ABRIT_VERIFY_DIR=/tmp/abrit-r18-request.39TI5KtW scripts/check-phase1.sh --all` | Exit 64 before changes: the original wrapper did not accept `--all`. |
| `ABRIT_VERIFY_DIR=/tmp/abrit-r18-baseline3.8qhoD1Lr scripts/check-phase1.sh --baseline` | Backend: 87 passed; OpenAPI, checks, migrations, drift passed. Frontend dependency tree was unusable because the initial symlink copy produced unmet dependencies; exit 1. |
| `env ABRIT_VERIFY_DIR=/tmp/abrit-r18-final.HRd7jEGl ABRIT_FRONTEND_TIMEOUT=45 scripts/check-phase1.sh --all` | Exit 1. Backend and R18 disposable checks passed; frontend lint/typecheck/unit/E2E timed out; build failed on Next/Turbopack rejecting an out-of-root `node_modules` symlink. |
| disposable clean/upgrade migration commands | Both passed; upgrade reported `No migrations to apply`. |
| deterministic role/user setup | Passed: fixed roles synchronized and five deterministic verification users created idempotently. |
| same-origin topology shell check with `DJANGO_SCRIPT_NAME=/cms` | Passed: `/cms/health/` resolved through the script prefix and protected `/cms/api/v1/admin/roles` returned 401 anonymously. |
| public API regression shell check | Passed: health, navigation, content, pricing, and search returned 200 anonymously. |
| final schema generation through wrapper | Passed: `manage.py spectacular --file <disposable>/schema/schema.yml --validate`. |
| artifact containment checks | Passed for pytest temp/cache, cache, media/private-media, schema, migrations, E2E, and temp roots. |
| protected-data/worktree comparisons | Passed; no repository state change. |
| `cd frontend && npm run lint` | Environment timeout in this host; the wrapper also recorded timeout. |
| `cd frontend && npm run typecheck` | Environment timeout during `next typegen`/TypeScript execution; route types were generated in the disposable copy before timeout. |
| `cd frontend && npm run test -- --runInBand` | Tests rendered as passing in the output, but the process did not exit within the bounded environment window and was recorded as timeout. |
| `cd frontend && npm run test:e2e -- --list` | Environment timeout. Chromium execution was not established. |

The R18 E2E specs now enumerate mobile (390x844), tablet (768x1024), and
desktop (1440x900) admin checks, plus representative `fa`, `en`, and `ar-ae`
public-route checks. These assertions could not be browser-verified because
Playwright startup/listing timed out and no completed Chromium run was
available.

## Blockers and limitations

The supported `.runtime/phase1-venv` and frontend installation were absent in
the task worktree. A matching read-only environment from the control worktree
allowed backend verification to complete, but its external dependency path is
not acceptable to Next/Turbopack for a disposable production build. No package
installation, network download, production deployment, credentials, or real
data was attempted. The release gate therefore remains blocked on a local
lockfile-installed dependency tree inside the disposable root and a host where
Next typecheck, build, Vitest exit, and Chromium can complete.

No application feature defect was identified or changed. The only committed
implementation changes are R18 verification-wrapper support/containment and
R18-owned browser coverage.
