# Payload Overnight Status

Last updated: 2026-09-06

## Run Identity

- Workspace: `C:\projects\abrit-opencode`
- Git root: `C:/projects/abrit-opencode`
- Branch: `opencode-dev` (`upstream/opencode-dev`)
- Starting HEAD: `44816f102120324fc65d39cb63f1c460be96211a`
- Local database: Compose service `postgres`, project `abrit-opencode`, host port `5433`, health `healthy`.

## Safety Setup

- Project permission configuration: `.opencode/opencode.json`.
- Static rule-order validation passed: routine project commands are allowed while explicit denies for `.env`, immutable homepage reference edits, push/reset, destructive Docker operations, dependency upgrades, Django migration, and Payload migration application remain denied.
- Runtime configuration reload is pending an OpenCode restart. The OpenCode CLI is not available on `PATH` in this shell, so startup-level enforcement could not be exercised in this session.
- Auto-approve instruction after restart: open the TUI command palette and select `Enable auto-approve permissions`; explicit `deny` rules remain enforced by OpenCode.

## Authorized Local Rebuild - 2026-09-06

- Current task: reset and recreate the disposable local Payload/PostgreSQL development database from current `opencode-dev` code.
- Verified target: Compose project `abrit-opencode`, service/container `postgres` / `abrit-opencode-postgres-1`, image `postgres:17-alpine`, database `abrit_payload`, local host port `5433`, project volume `abrit-opencode_abrit_payload_postgres` mounted at `/var/lib/postgresql/data`.
- Compose labels identify `C:\projects\abrit-opencode\docker-compose.yml` as the source configuration. This is not a production or staging target.
- Existing backup preserved: `artifacts/backups/payload-local-20260905-162057.sql` (4,718,242 bytes).
- New pre-reset backup: `artifacts/backups/payload-local-prereset-20260906-090011.dump` (947,363 bytes). `pg_dump` completed and `pg_restore --list` validated its catalog.
- Recovery Git state: HEAD `44816f102120324fc65d39cb63f1c460be96211a`; branch `opencode-dev`; no staged files. Existing modified and untracked feature work is preserved.
- Application state: no listener on port `3000`; no Payload process from this workspace is running. All upcoming Payload initialization and seed commands will run serially.
- Next action: recreate only the confirmed Compose Postgres volume, initialize current Payload schema, then run the base and deterministic feature seeds serially.

## Baseline

- Clean local rebuild completed on 2026-09-06. Current database counts: 1 user, 30 Content documents, 5 packages, 2 forms, and exactly 5 independent-service/listing template documents.
- `npm run check`: PASS (lint, typecheck, 13 Vitest tests, production build with 93 generated routes).
- No staged files.
- Never stage this cycle: `.agents/`, `skills-lock.json`, `.env`, `frontend/.env`.
- Pre-existing changes retained without modification:
  - `frontend/src/scripts/validate-migration.ts`: safe validator work pending T01 verification.
  - `frontend/src/payload-types.ts`: working-tree generated-type line-ending churn only.
  - `.agents/`, `skills-lock.json`, and the three overnight instruction files: untracked user/project state.
- Controller-created, untracked files:
  - `.opencode/opencode.json`
  - `docs/agent-reports/overnight-status.md`
- DB backups: `artifacts/backups/payload-local-20260905-162057.sql` and validated pre-reset custom dump `artifacts/backups/payload-local-prereset-20260906-090011.dump`.

## Tasks

| Task | State | Evidence / next action |
| --- | --- | --- |
| T00 | PASS | Workspace, branch, HEAD, Git state, local DB health, and green quality baseline recorded. |
| T01 | BLOCKED | Validator fixes pass diff check, review, and typecheck. Read-only validation is blocked by a confirmed pre-existing private-data gap: source submission count 1; target submission count 0. Importing it is outside T01 and no PII was inspected or output. |
| T02 | PASS | `artifacts/legacy-asset-inventory.json` is deterministic across two runs (SHA-256 `CC72331AB774E786EC7F0C0DA2331A5FE46EA445AC7B289944F73903BEF684DD`): 16 public assets, 0 represented, 16 filesystem-only, 0 missing DB references, 0 duplicate-content, 1 unsupported type. No private media, PII, legacy mutation, or Payload storage mutation. |
| T03 | PASS | Local backup `artifacts/backups/payload-local-20260905-162057.sql` completed before schema work. Additive `content` schema push completed through local `next dev`; no destructive warning. Generated types, lint, typecheck, and `GET /fa` (200) passed. No migration files created or applied. |
| T04 | PASS | Fresh DB reconciliation and subsequent `--check` pass: exactly 5 canonical documents / 15 explicit no-fallback locale projections, complete typed structures, managed-service relationships, and ordered listing relationships. |
| T05 | PASS | Independent-service listing/detail routes now parse typed Payload groups only. Static fallback and component defaults were removed; missing, incomplete, wrong-key, or wrong-template CMS data produces `notFound()`. Full `npm run check` passed. |
| T06 | PASS | 30 browser cases passed: listing + 4 details, fa/en/ar-ae, 1440/390 widths, RTL/LTR, FAQ, CTA, forms, overflow, console and page errors. Evidence: `artifacts/browser/t06/report.json`. |
| T07 | PASS | Incremental seams are feasible. Preserve legacy wrappers, selectors, geometry, and runtime; guard legacy section writers with React ownership markers. Rollback is removal of the affected marker/component. |
| T08 | PASS | Two v5-parity typed Hero blocks per locale are seeded and checked. Highlight markup, point spans, dots, click behavior and 7-second rotation are preserved; CMS owns copy and links while visual geometry remains code-owned. |
| T09 | PASS | Ten ordered managed-service relationships are seeded/checked. Server-rendered escaped CMS cards use the v5 DOM/icon/grid contract; the mismatching vertical rail and portal race were removed. |
| T10 | PASS | Six ordered solution relationships are seeded/checked on the clean schema. CMS nodes now mount at the correct `#nodes` topology seam, not `#opsBento`; desktop/mobile and RTL browser checks pass. No index repair was needed. |
| T11 | PASS | Explicit `lint`, `typecheck`, `test`, `build`, aggregate `check`, and `git diff --check` all passed. Immutable v5 has zero diff; no staged files or env files exist. `/fa`, `/en`, `/ar-ae`, and `/admin` return 200 without page errors. |
| T12 | PASS | `docs/agent-reports/payload-overnight-final.md` records final database, source, tests, browser evidence, remaining hardcoded content, and safety confirmation. No commit, push, merge, deployment, production mutation, official migration, or full legacy import. |

## Frozen Decisions

No changes to pricing, navigation, disputed titles, audit-history authority, authentication/access control, SEO/canonical policy, or deployment policy.

## Final Evidence

- Homepage browser parity: `artifacts/browser/homepage/report.json` (6/6 locale/viewport cases PASS) plus section screenshots for live and immutable reference.
- Final route smoke: `artifacts/browser/final-smoke.json` (`/fa`, `/en`, `/ar-ae`, `/admin` all 200, no page errors).
- Independent services: `artifacts/browser/t06/report.json` (30/30 PASS).
- Database state: local Compose PostgreSQL healthy; no application listener remains on port 3000.
- Git state: HEAD remains `44816f102120324fc65d39cb63f1c460be96211a`; working changes are unstaged; no local commit was created because the worktree includes retained pre-existing work from prior runs.

## Resume Point - Reduced Context

- Completed: verified local-only recovery backups; recreated Compose PostgreSQL from zero; made `npm run seed` run base + four feature reconciliations serially; proved that command on a newly empty volume; T04/T05/T06 pass; homepage Hero/Services/Solutions data, DOM ownership and v5 parity fixes pass normal desktop/mobile browser suites; aggregate quality gate passes.
- Review fixes completed: strict homepage relationship filtering/cardinality, exact independent-service slug set, active/published relationship checks, comparison row shape validation, Hero `openInNewTab`, and reduced-motion/visibility-aware React timer.
- Completed review fix: reduced-motion diagnosis found that the extracted runtime guard targeted an obsolete Hero function signature. The guard now matches the current optional `anim` parameter, the asset version was bumped, and `artifacts/browser/homepage/report.json` records `hero_auto_rotation_stopped: true`.
- Final state: canonical `npm run seed` was proven from a newly empty volume, the post-review `npm run check` passed, browser suites passed, `git diff --check` passed, immutable-v5 has zero diff, and final DB counts/status are healthy.
- Do not redo: database reset or initial backup unless a new schema reset is genuinely required. Current fresh DB was created and fully seeded by the canonical `npm run seed` command.
