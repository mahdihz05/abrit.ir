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

No application feature defect was identified or changed. At the time of the
original evidence, the committed implementation changes were limited to R18
verification-wrapper support/containment and R18-owned browser coverage.

## Verification remediation reruns

The wrapper was remediated on this branch to accept an explicitly supplied,
executable `ABRIT_PYTHON` while retaining the documented
`.runtime/phase1-venv/bin/python` default. The frontend disposable copy now
creates `node_modules` below the run root: it attempts lockfile-driven offline
`npm ci` from the host npm cache and never mounts an out-of-root
`node_modules` symlink. The cache/install attempt is bounded by
`ABRIT_NPM_CACHE_MAX_MB` (default 2048 MiB) and available-run-space refusal by
`ABRIT_FRONTEND_MIN_FREE_MB` (default 2048 MiB).

The exact remediation command was:

```text
ABRIT_VERIFY_DIR=/tmp/abrit-r18-remediated-5 \
ABRIT_PYTHON=/mnt/c/projects/abrit-agent-control/.runtime/phase1-venv/bin/python \
ABRIT_FRONTEND_TIMEOUT=45 scripts/check-phase1.sh --all
```

Its captured output is preserved at
`/tmp/abrit-r18-remediated-5.log`. It reports Python 3.11.16, pinned backend
imports, pip check, Django checks, clean disposable migrations, migration drift,
and 32 backend tests passed (the full run was interrupted after the test
process stalled with the host `/tmp` filesystem at 95% usage). Frontend
installation was not attempted because the bounded run filesystem had only
222 MiB available, below the 2048 MiB minimum. Earlier remediation attempts
also recorded exact `ENOSPC` output at
`/tmp/abrit-r18-remediated-2.log`; no package install completed and no
Chromium execution was established.

The release gate was initially blocked by host disk capacity and unavailable
Linux Chromium. After removing only stale disposable AbrIT artifacts, a bounded
offline `npm ci` completed inside the disposable root. The full wrapper run
passed every backend, migration, schema, lint, typecheck, build, unit-test,
containment, topology, and public-regression check. Linux Playwright could not
install Chromium on Ubuntu 26.04, so the browser suite was then run from
Windows Node with user-scoped Google Chrome at
`C:\Program Files\Google\Chrome\Application\chrome.exe`, against the R18
Windows Next dev server on port 3101. All seven browser checks passed:
three `/admin` unauthenticated login/isolation/noindex/responsive checks at
390x844, 768x1024, and 1440x900; root locale redirect; and public `fa`, `en`,
and `ar-ae` route rendering/responsiveness checks.

The final R18 commands passed as follows:

```text
ABRIT_VERIFY_DIR=/tmp/abrit-r18-final.FgQqU4 \
ABRIT_PYTHON=/mnt/c/projects/abrit-agent-control/.runtime/phase1-venv/bin/python \
ABRIT_FRONTEND_TIMEOUT=180 scripts/check-phase1.sh --all
# All checks passed except Linux Chromium launch, which is unsupported on Ubuntu 26.04.

Windows Chrome E2E wrapper against http://127.0.0.1:3101
# 7 passed

Windows frontend: npm run test && npm run typecheck && npm run lint && npm run build
# 27 tests passed; all commands passed

/mnt/c/projects/abrit-agent-control/.runtime/phase1-venv/bin/python -m pytest -q backend
# 87 passed
```

No repository database/schema data was changed by verification. The only
remaining backend warning is Django's upstream `URLField` default-scheme
transition warning; it is non-failing and does not affect Phase 1 behavior.
The release gate is complete.
