# Payload CMS Starter V1 — Authoritative Execution Checklist

Legend:
- `[ ]` not started
- `[~]` in progress
- `[x]` done with evidence
- `[!]` genuinely externally blocked

An item is DONE only after implementation and relevant verification pass.
Update `03_STARTER_V1_EXECUTION_STATE.md` after every major phase and before compaction.

---

# Phase 0 — Source Safety / Baseline

- [x] Inspect current branch, HEAD, remotes, tags and working tree.
- [x] Preserve historical ABRIT tags unchanged.
- [x] Create/use isolated `feature/payload-starter-v1` branch/worktree.
- [x] Inventory/preserve SEO migrations and completed SEO implementation.
- [x] Resolve stale report/tag statements without rewriting Git history.
- [x] Verify destination `mahdihz05/payload-CMS` immediately before publication work.
- [x] Confirm no production data mutation.
- [x] Record state.

Gate:
- [x] Safe isolated development state exists.

---

# Phase 1 — Starter Boundary / Public Hygiene

Identify and act on:

- [x] ABRIT brand/name/logo
- [x] ABRIT domains/contact/address/social defaults
- [x] WHMCS
- [x] Chatwoot
- [x] IRT/Toman assumptions
- [x] managed-IT catalogs
- [x] static ABRIT homepage/reference renderer
- [x] ABRIT assets
- [x] ABRIT deployment paths/project names
- [x] legacy Django/reconciliation tooling
- [x] internal prompts/reports/worktree instructions
- [x] local agent configs
- [x] private hostnames/IPs
- [x] secrets/tokens/passwords
- [x] dumps/private media

Classify each as:
- generic core
- move to config
- optional integration
- demo seed
- remove from public starter

Then:
- [x] generic core retained
- [x] identity moved to config/CMS globals
- [x] optional integrations disabled by default
- [x] internal-only files removed from publishable tree
- [x] `.gitignore` protects env/dumps/media/runtime artifacts
- [x] secret/private-file scan passes

Gate:
- [x] Publishable tree no longer exposes private/ABRIT operational material.

---

# Phase 2 — Generic Site Configuration

- [x] generic Site Settings identity
- [x] generic title/description defaults
- [x] no `abrit.ir` production fallback
- [x] no hard-coded `AbrIT` title template/runtime identity
- [x] generic Organization structured-data source
- [x] generic logo/brand behavior
- [x] optional integrations safely off when unset
- [x] required secrets validated
- [x] tests for config resolution/failure

Gate:
- [x] Unrelated company can use runtime without editing SEO/core identity code.

---

# Phase 3 — Localization Productization

- [x] locale list centralized
- [x] default locale centralized
- [x] language code mapping centralized
- [x] RTL/LTR mapping centralized
- [x] font policy decoupled from business identity
- [x] adding/removing locale documented
- [x] resolver/hreflang remains correct
- [x] routing remains correct
- [x] tests cover configured locales

Gate:
- [x] Locale policy is centralized and documented rather than scattered.

---

# Phase 4 — Generic Page / Block Runtime

## Page runtime
- [x] CMS-rendered Home is default
- [x] generic Page route works
- [x] Navigation global drives generic navigation
- [x] Page Blocks drive body rendering
- [x] document SEO remains resolver/Page-owned
- [x] generic path does not require ABRIT static content
- [x] no numeric DB IDs hard-coded

## Blocks
Review actual generic blocks, including where present:
- [x] hero
- [x] richText
- [x] featureGrid
- [x] faq
- [x] testimonials
- [x] cta
- [x] form

For each retained block:
- [x] generic schema
- [x] minimum accessible output
- [x] no ABRIT identity
- [x] no hidden business dependency

Legacy:
- [x] legacy imported blocks isolated/deprecated or intentionally genericized
- [x] ABRIT-only variants removed/generalized/demo-only
- [x] specialized ABRIT route dependencies isolated

Gate:
- [x] A generic site can be built through Page + Blocks only.

---

# Phase 5 — Optional Commercial / Third-party Integrations

WHMCS:
- [x] not required for core startup
- [x] mappings removed/configurable
- [x] no ABRIT checkout fallback

Chatwoot:
- [x] disabled by default
- [x] host/token/config externalized
- [x] absent integration does not break runtime

Pricing/products:
- [x] no mandatory IRT/Toman assumption
- [x] currency generic/configurable OR commercial module optional
- [x] managed-IT catalog removed from mandatory bootstrap

Gate:
- [x] Starter runs with all optional integrations absent.

---

# Phase 6 — Generic Bootstrap / Demo Seed

Bootstrap:
- [x] generic command exists
- [x] idempotent/resumable
- [x] generic Site Settings
- [x] minimal Navigation
- [x] generic localized Home
- [x] required globals
- [x] optional secure admin creation
- [x] no ABRIT records

Demo seed if useful:
- [x] generic About/Contact
- [x] generic Form
- [x] example Blocks
- [x] explicitly disposable

Empty DB verification:
- [x] migrate empty PostgreSQL
- [x] bootstrap succeeds
- [x] rerun bootstrap safely
- [x] app starts

Gate:
- [x] New developer can initialize useful generic CMS without ABRIT knowledge.

---

# Phase 7 — Environment Contract

- [!] complete `.env.example`
- [x] no real secrets
- [x] required variables documented
- [x] optional variables documented
- [x] CI variables documented
- [x] production-only variables documented
- [x] optional integration variables separated
- [x] legacy variables removed/separated
- [x] production requires secure secrets
- [x] DB/revalidation/IP-hash/site URL variables documented as applicable
- [x] env validation tested

Gate:
- [!] Fresh clone needs no undocumented env knowledge.

---

# Phase 8 — SEO Starter Product Gate

Regression-test:
- [x] central resolver
- [x] URL uniqueness
- [x] canonical
- [x] robots
- [x] OG/Twitter
- [x] hreflang
- [x] redirects
- [x] sitemap/robots.txt
- [x] schema
- [x] preview
- [x] SEO RBAC
- [x] revalidation
- [x] scheduler integration

Editor V1:
- [x] generic SEO labels/help
- [x] practical warnings
- [x] canonical behavior explained
- [x] robots consequences explained
- [x] redirect management documented
- [x] SEO role workflow documented

Optional, non-blocking unless already cheap/stable:
- [x] SERP preview — reviewed and intentionally omitted from V1 as optional UI
- [x] social preview — reviewed and intentionally omitted from V1 as optional UI

Forbidden scope:
- [x] no SEO score requirement
- [x] no AI SEO requirement
- [x] no GSC dashboard requirement

Gate:
- [x] Accurate to call Starter V1 technically SEO-ready.

---

# Phase 9 — Core CMS Subsystems

RBAC:
- [x] generic roles/no ABRIT assumptions
- [x] role bootstrap/docs
- [x] API/data-level permission tests

Forms:
- [x] works without ABRIT seed
- [x] file/private upload behavior tested
- [x] no branded form required

Media:
- [x] localized ALT retained
- [x] storage/persistence documented
- [x] fresh media path works

Audit:
- [x] generic audit behavior
- [x] permissions tested

Preview:
- [x] draft preview
- [x] noindex
- [x] no published-cache poisoning

Gate:
- [x] Core CMS subsystems work from generic bootstrap.

---

# Phase 10 — Migrations / Database Reliability

- [x] review existing migrations
- [x] include/register SEO migrations
- [x] empty DB migration test
- [x] representative current-schema upgrade test if safe
- [x] no core migration depends on ABRIT data unless isolated
- [x] destructive migrations documented
- [x] released migrations treated immutable
- [x] rollback limitations documented
- [x] backup-before-upgrade policy documented
- [x] down-migration test OR restore-based recovery explicitly tested/documented

Gate:
- [x] Database lifecycle is predictable for fresh install and upgrade.

---

# Phase 11 — Scheduler / Jobs

- [x] generic scheduler process
- [x] no ABRIT Compose/path naming
- [x] documented command
- [x] failure behavior observable/documented
- [x] controlled scheduled-publish test
- [x] no interactive shell requirement
- [x] production execution model documented

Gate:
- [x] Scheduling is reproducible runtime behavior, not config-only.

---

# Phase 12 — Docker / Deployment Baseline

- [x] generic Dockerfile
- [x] deterministic `npm ci`
- [x] generic Compose services/project naming
- [x] PostgreSQL
- [x] web
- [x] scheduler
- [x] persistent media strategy
- [x] no secrets baked in image
- [x] health/readiness behavior
- [x] migration/deploy policy
- [x] bootstrap policy
- [x] restart behavior where appropriate
- [x] production env guide
- [x] Docker config validation
- [!] Docker build
- [!] Docker startup smoke

Gate:
- [!] Generic production-like stack starts without ABRIT infrastructure.

---

# Phase 13 — Backup / Restore

Database:
- [x] documented backup
- [x] documented restore
- [x] safe generic scripts if useful
- [x] disposable restore test where feasible

Media:
- [x] public/private media backup guidance
- [x] restore/sync guidance
- [x] validation where feasible

Operations:
- [x] backups excluded from Git
- [x] secret handling guidance
- [x] pre-migration backup guidance

Gate:
- [x] Recovery path is documented and DB restore exercised where feasible.

---

# Phase 14 — Long-term Dependency / Security Maintenance

- [x] Node version declared
- [x] package manager/lockfile policy
- [x] no opportunistic major upgrades
- [x] Dependabot config
- [x] sensible update grouping
- [x] no dependency auto-merge policy
- [x] security audit/advisory process
- [x] CodeQL/static analysis if compatible
- [x] Payload/Next upgrade procedure
- [x] SemVer/release policy
- [x] breaking migration policy

Gate:
- [x] Maintainability strategy exists beyond initial release.

---

# Phase 15 — Tests / CI Product Gate

Committed CI proves where supported:
- [x] clean install
- [x] PostgreSQL
- [x] empty migrations
- [x] generic bootstrap
- [x] lint
- [x] typecheck
- [x] unit tests
- [x] integration tests
- [x] forms integration
- [x] production build
- [x] SEO E2E
- [x] configured locale smoke
- [x] redirects
- [x] preview
- [x] sitemap crawl/status
- [x] schema checks
- [x] scheduler test where feasible
- [!] Docker build/smoke
- [x] no ABRIT seed dependency

Gate:
- [~] CI is reproducibly green before publication.

---

# Phase 16 — Documentation

Create/update:
- [x] root `README.md` per `05_README_REQUIREMENTS.md`
- [x] `docs/ARCHITECTURE.md`
- [x] `docs/SEO.md`
- [x] `docs/LOCALIZATION.md`
- [x] `docs/CREATING_A_SITE.md`
- [x] `docs/DEPLOYMENT.md`
- [x] `docs/BACKUP_RESTORE.md`
- [x] `docs/UPGRADING.md`
- [x] `docs/SECURITY.md`

README/docs:
- [x] no ABRIT runtime identity
- [x] no private paths/secrets
- [x] no untested feature claims
- [x] commands match actual scripts

Gate:
- [x] Unfamiliar developer can operate starter from docs.

---

# Phase 17 — Fresh Clone Acceptance

From a new temporary path:
- [x] clean repo copy/clone
- [x] no inherited node_modules
- [x] no inherited env
- [x] no inherited DB/media
- [x] create env from docs
- [x] install dependencies
- [x] start PostgreSQL
- [x] migrate
- [x] bootstrap
- [x] rerun bootstrap safely
- [x] tests
- [x] production build
- [x] app start
- [x] health/smoke
- [x] generic Home 200
- [x] admin behavior as documented
- [x] robots 200
- [x] sitemap 200
- [x] sitemap URLs 200
- [x] no ABRIT runtime identity
- [x] optional integrations absent do not break app

If FAIL:
- [ ] fix
- [ ] discard temp state
- [ ] repeat from clean state

Gate:
- [x] FRESH CLONE PASS.

---

# Phase 18 — Public Tree Audit

Before public commit:
- [x] file inventory
- [x] secret scan
- [x] ABRIT/AbrIT/abrit scan and review every match
- [x] hostname/domain scan
- [x] private IP scan
- [x] local absolute path scan
- [x] dump/database scan
- [x] internal prompt/report scan
- [x] env file scan
- [x] credential/token pattern scan
- [x] large/unneeded binary review
- [x] `git diff --check`
- [x] lockfile exists
- [x] generated/runtime artifacts excluded

Gate:
- [x] Public tree safe.

---

# Phase 19 — Prepare Public Repository

Destination:
`https://github.com/mahdihz05/payload-CMS.git`

- [x] confirm destination still safe/expected
- [x] prepare clean tree/history
- [x] default branch `main`
- [x] origin points to destination
- [x] logical initial commit(s)
- [x] README renders/links correctly
- [x] workflows committed
- [x] no unintended source tags/history/private artifacts
- [x] no force push

Gate:
- [x] Local public repository ready.

---

# Phase 20 — Publish / Release

If authenticated:
- [ ] push `main`
- [ ] verify remote HEAD
- [ ] verify GitHub Actions start
- [ ] fix CI failure and repush if needed
- [ ] verify required workflows pass if tooling allows
- [ ] create annotated `v1.0.0`
- [ ] push tag
- [ ] create GitHub Release if tooling allows
- [ ] release notes
- [ ] repository description/topics if permitted
- [ ] enable Template Repository if permitted

If settings unavailable to tooling:
- [ ] document exact one-time owner UI action

Do not mark published if push failed.

Gate:
- [ ] Public main + `v1.0.0` exist, OR only publication is externally blocked with evidence.

---

# Phase 21 — Final Verification

Prefer verifying from the published repo if publication succeeded:
- [ ] clone again to another clean temp directory
- [ ] verify commit/tag
- [ ] verify README commands/links
- [ ] minimal fresh-clone smoke or equivalent CI
- [ ] no exposed secret/private artifact
- [ ] GitHub Actions state checked
- [ ] `v1.0.0` verified

Create:
- [ ] `STARTER_V1_FINAL_REPORT.md`
- [ ] finalize `03_STARTER_V1_EXECUTION_STATE.md`
- [ ] create `.payload-starter-v1-complete` only now

Final:
- [ ] DO NOT start site-specific visual design.

# Mandatory Progress / Compaction Rule

For EVERY phase:

- update checkbox state during execution;
- never mark `[x]` before tests/evidence required by that item pass;
- after meaningful checklist changes run `node 10_update_progress.mjs`;
- at phase completion update `03_STARTER_V1_EXECUTION_STATE.md`;
- run `node 10_update_progress.mjs`;
- verify `09_PROJECT_PROGRESS.md`;
- compact context according to `02_CONTEXT_COMPACTION_AND_RESUME_PROTOCOL.md`;
- continue automatically to the next incomplete phase.

Phase-boundary compaction is mandatory even if the context still appears large enough.
