# AbrIT Payload CMS — Overnight Autonomous Execution Checklist

> **Repository:** `C:\projects\abrit-opencode`  
> **Branch:** `opencode-dev`  
> **Primary environment:** local Windows development only  
> **Primary model:** Terra / Medium (recommended for the controller/build agent)  
> **Legacy source (read-only):** `C:\projects\abrit.ir`  
> **Permanent visual reference:** `abrit-homepage-polished-v5.html`

---

## 0. Operating Contract

### Hard boundaries — NEVER cross unattended
- [ ] Never push.
- [ ] Never merge another branch.
- [ ] Never deploy.
- [ ] Never connect to or mutate a production/staging database.
- [ ] Never print, expose, stage, or commit `.env` values.
- [ ] Never use `git add .` or `git add -A`.
- [ ] Never use destructive Git cleanup/reset commands.
- [ ] Never modify `C:\projects\abrit.ir`; legacy repo is read-only evidence.
- [ ] Never modify the immutable `abrit-homepage-polished-v5.html`.
- [ ] Never decide or change these frozen domains:
  - pricing/package commercial authority
  - final navigation/menu authority
  - disputed localized titles
  - audit-history source authority
  - authentication/access-control policy
  - SEO/canonical policy
  - production/deployment policy
- [ ] Never run `migrate:django` unattended.
- [ ] Never run production migrations unattended.
- [ ] Never install/update dependencies merely to solve a convenience problem.
- [ ] Never run `npm audit fix --force`.

### Autonomous permissions granted for this cycle
The agent **is pre-authorized** to:
- [ ] Read/search all files inside `C:\projects\abrit-opencode`.
- [ ] Read/search `C:\projects\abrit.ir` strictly as a legacy reference.
- [ ] Edit owned source/docs/scripts inside `abrit-opencode` when the current task allows it.
- [ ] Run `npm`, `npx tsx`, lint, typecheck, tests and builds.
- [ ] Run read-only Git commands.
- [ ] Create local commits at clean task boundaries using explicit file staging.
- [ ] Start/stop the local dev server and local Docker Compose services.
- [ ] Read/write the **local** Payload/Postgres development database only for explicitly allowed seed tasks.
- [ ] Use Payload development `push` behavior **only if** inspection confirms the Postgres adapter has not disabled it with `push: false`.
- [ ] Create a local DB backup before any schema-affecting development work.
- [ ] Invoke project skills and read-only Explore/reviewer subagents.

### Explicitly deferred until human review tomorrow
- [ ] Converting `templateKey` from free text to a DB-backed select if that requires destructive/schema migration.
- [ ] Creating official migration files for overnight schema work.
- [ ] Applying migration files.
- [ ] Any destructive schema operation.
- [ ] Any change in frozen domains.

---

# T00 — Baseline & Recovery State

## Goal
Create a recoverable baseline before unattended work.

- [ ] Confirm workspace root = `C:\projects\abrit-opencode`.
- [ ] Confirm branch = `opencode-dev`.
- [ ] Capture `git status --short --branch`.
- [ ] Capture staged and unstaged file lists.
- [ ] Record pre-existing changes separately.
- [ ] Mark `.agents/`, `skills-lock.json`, `.env`, `frontend/.env` as never-stage for this cycle.
- [ ] Confirm Docker Postgres is local and healthy.
- [ ] Confirm current `npm run check` baseline is green before new implementation.
- [ ] Create/update durable run-state file:
  `docs/agent-reports/overnight-status.md`
- [ ] Store task state as:
  `PENDING | RUNNING | PASS | BLOCKED | SKIPPED`.
- [ ] Record current HEAD SHA.

### DB backup
Before the first schema-affecting change:
- [ ] Verify the Compose DB is local.
- [ ] Create a timestamped local Postgres dump under an ignored artifacts/backup location.
- [ ] Verify backup command exits successfully.
- [ ] Record backup path in `overnight-status.md`.
- [ ] Do not include credentials or row contents in the report.

### Gate
- [ ] No unexpected staged files.
- [ ] Baseline checks documented.
- [ ] Backup exists before schema-affecting work.

---

# T01 — Migration Validator Safe Fixes

## Goal
Improve validation only; do not import legacy data.

### Skills
- `payload`
- `systematic-debugging`

### Scope
- `frontend/src/scripts/validate-migration.ts`

### Checklist
- [ ] Inspect existing validator diff before editing.
- [ ] Fix locale translation counting so source legacy keys are compared against target legacy-scope documents.
- [ ] Use explicit locale on localized reads.
- [ ] Use `fallbackLocale: false`.
- [ ] Add legacy ↔ Payload audit `legacyID` parity validation.
- [ ] Zero legacy audit rows ↔ zero target audit rows must pass.
- [ ] Keep pricing differences as evidence only.
- [ ] Keep navigation differences as evidence only.
- [ ] Keep disputed title differences as evidence only.
- [ ] Do not call seed/import/write APIs.

### Verify
- [ ] `git diff --check -- frontend/src/scripts/validate-migration.ts`
- [ ] Read-only migration validation.
- [ ] `npm run typecheck`
- [ ] Update `overnight-status.md`.

### Commit
- [ ] Stage only validator/report files owned by this task.
- [ ] Local commit allowed if green.
- [ ] Never push.

---

# T02 — Legacy Asset Inventory

## Goal
Inventory legacy filesystem assets not represented in the old media DB.

### Skills
- `payload`

### Checklist
- [ ] Treat `C:\projects\abrit.ir` as read-only.
- [ ] Resolve only known project asset roots.
- [ ] Inventory relative path, extension, size, SHA-256.
- [ ] Compare filesystem assets against legacy media/submission references.
- [ ] Categorize:
  - represented
  - filesystem-only
  - DB-reference-missing-file
  - duplicate-content
  - unsupported-type
- [ ] Exclude private form content and PII from outputs.
- [ ] Write generated inventory only to ignored `artifacts/`.
- [ ] If a reusable script is needed, keep it narrowly scoped.

### Verify
- [ ] Two runs produce identical normalized inventory.
- [ ] No legacy source file changed.
- [ ] No Payload storage changed.
- [ ] Update `overnight-status.md`.

---

# T03 — Additive Payload Content Contract

## Goal
Prepare independent-service CMS fields using additive, non-destructive local development schema work.

### Skills
- `payload`
- `vercel-react-best-practices`

### Important Payload rule
**Do not create or apply migration files overnight.**

For local Postgres development:
- [ ] Inspect adapter config.
- [ ] If `push: false` is explicitly configured: do **not** mutate schema automatically; mark schema-dependent tasks BLOCKED.
- [ ] If push is not disabled: Payload development push may be used against the backed-up local DB.
- [ ] Never mix manual migration execution with development push in this cycle.

### Data model rules
- [ ] Keep the existing `content` collection.
- [ ] Do not create a new page-builder collection.
- [ ] Do not create a separate independent-service collection.
- [ ] Keep current `templateKey` persisted values compatible.
- [ ] Do **not** perform a risky text→select DB conversion overnight.
- [ ] If safe, improve `templateKey` validation/admin guidance without destructive DB conversion.
- [ ] Model fixed independent-service template data with typed fields:
  groups / arrays / relationships.
- [ ] Use blocks only where composition/order flexibility is genuinely editor-owned.
- [ ] Preserve drafts, versions, localization, preview, access and base SEO behavior.
- [ ] Add only optional/additive schema fields required for the feature.

### Independent-service identities
Exactly **5 canonical Content documents**:
- [ ] listing
- [ ] backup
- [ ] cloud-storage
- [ ] workspace
- [ ] voice

Each canonical document has localized projections:
- [ ] `fa`
- [ ] `en`
- [ ] `ar-ae`

That means **5 documents / 15 localized projections**, not 15 separate documents.

### Relationships
For ordered related Content:
- [ ] `hasMany: true` when multiple relationships are required.
- [ ] Apply `filterOptions` to restrict eligible Content kinds/template types.
- [ ] Bound `maxDepth`.
- [ ] Preserve editor-controlled order using native supported ordering.
- [ ] Do not duplicate related page titles/excerpts unnecessarily.

### Verify
- [ ] `npm run generate:types`
- [ ] `npm run typecheck`
- [ ] `npm run lint`
- [ ] Review generated types; never hand-edit `payload-types.ts`.
- [ ] Start local dev only when needed to allow additive dev push.
- [ ] Verify local schema succeeds without destructive warning.
- [ ] If Payload presents a data-loss/destructive-schema warning: STOP T03 and mark BLOCKED.
- [ ] Update `overnight-status.md`.

### Deferred tomorrow
- [ ] Generate official migration after human review.
- [ ] Review generated SQL/up/down.
- [ ] Commit approved migration separately.

---

# T04 — Independent Services Seed & Parity

## Goal
Move the hardcoded independent-service datasets into Payload-managed localized data.

### Skills
- `payload`

### Checklist
- [ ] Keep existing hardcoded catalog read-only as migration/parity source.
- [ ] Create a dedicated idempotent seed script if needed.
- [ ] Do not edit `package.json` merely to add a convenience script.
- [ ] Execute scripts directly via `npx tsx`.
- [ ] Seed only the 5 known canonical documents.
- [ ] Every localized write specifies the locale explicitly.
- [ ] Every validation read specifies:
  - explicit `locale`
  - `fallbackLocale: false`
- [ ] Use the repository's trusted Local API pattern.
- [ ] Do not change access-control policy.
- [ ] Abort rather than overwrite editor-managed data that differs from deterministic expected seed state.
- [ ] Preserve listing order and related managed-service references.

### Verify
- [ ] 5 canonical identities.
- [ ] 15 locale projections.
- [ ] No missing localized required field.
- [ ] No fallback-locale masking.
- [ ] Listing relation order matches expected source.
- [ ] Normalized parity/checksum passes.
- [ ] `npm run typecheck`
- [ ] Update `overnight-status.md`.

---

# T05 — Runtime Switch: Independent Services

## Goal
Render independent services from Payload only after T04 parity passes.

### Skills
- `payload`
- `vercel-react-best-practices`

### Checklist
- [ ] Fetch canonical Content docs with explicit locale.
- [ ] Use `fallbackLocale: false`.
- [ ] Validate complete fixed-template shape.
- [ ] Remove silent runtime fallback to static catalog.
- [ ] Preserve static source only as temporary parity/seed input until human review.
- [ ] Missing CMS content must fail explicitly / produce intended not-found behavior.
- [ ] Do not alter header/footer/navigation authority.
- [ ] Do not alter disputed titles.

### Verify
- [ ] Listing in all 3 locales.
- [ ] 4 details × 3 locales.
- [ ] Hero/FAQ/CTA/form data matches CMS source.
- [ ] No fallback path invoked.
- [ ] `npm run check`
- [ ] Update `overnight-status.md`.

---

# T06 — Independent Services Browser Verification

## Goal
Verify UI without changing tooling.

### Skills
- `webapp-testing`
- `vercel-react-best-practices`
- `web-design-guidelines`

### Checklist
- [ ] Use existing browser capability only.
- [ ] Do not install Playwright/Chromium unattended if installation changes protected package/tool files.
- [ ] If unavailable: mark browser checks BLOCKED and continue non-browser checks.
- [ ] Verify listing + 4 details × 3 locales.
- [ ] Desktop representative width: 1440.
- [ ] Mobile representative width: 390.
- [ ] RTL for `fa` and `ar-ae`.
- [ ] No unintended horizontal overflow.
- [ ] CTA destinations correct.
- [ ] FAQ interaction works.
- [ ] Consultation form visible/usable.
- [ ] No new browser-console errors.

### Verify
- [ ] Screenshots/evidence written only to ignored artifacts.
- [ ] `npm run check`
- [ ] Update `overnight-status.md`.

---

# T07 — Homepage Seam Feasibility

## Goal
Prove the v5 Homepage can be incrementally replaced without breaking remaining static sections.

### Skills
- `payload`
- `vercel-react-best-practices`
- `webapp-testing`

### Immutable source
- [ ] Never modify `abrit-homepage-polished-v5.html`.

### Analyze Hero / Services / Solutions
- [ ] DOM IDs/classes
- [ ] CSS dependencies
- [ ] runtime JS dependencies
- [ ] shared state
- [ ] event handlers
- [ ] animation/reveal logic
- [ ] SVG/network dependencies
- [ ] locale content boundaries
- [ ] dependencies shared with later static sections

### Contract rules
- [ ] Editor owns copy, CTAs, ordered relationships and data.
- [ ] Code owns visual geometry, topology coordinates, effects and animations.
- [ ] Homepage service/solution relationships reference existing Content docs.
- [ ] Do not duplicate service/solution titles/excerpts where relationships can supply them.
- [ ] Define exact replacement seam and rollback.

### Outcome
Set exactly one:
- [ ] `PASS`
- [ ] `BLOCKED`

If `BLOCKED`:
- [ ] Do not implement T08–T10.
- [ ] Record why.
- [ ] Continue other independent safe tasks.

If `PASS`:
- [ ] T08–T10 are pre-authorized to proceed under additive-only schema rules.

### Verify
- [ ] v5 reference has zero diff.
- [ ] Update `overnight-status.md`.

---

# T08 — Homepage Hero

## Precondition
- [ ] T07 = PASS.
- [ ] Additive-only Payload schema change is safe on backed-up local DB.

### Skills
- `payload`
- `vercel-react-best-practices`
- `webapp-testing`

### Checklist
- [ ] Implement only Hero typed data contract.
- [ ] Keep decorative markup/geometry/effects code-owned.
- [ ] Replace only Hero at the proven seam.
- [ ] Keep remaining v5 sections static and functional.
- [ ] Seed Hero content per locale explicitly.
- [ ] Validation reads use `fallbackLocale: false`.
- [ ] Abort on non-seed editor-content conflict.
- [ ] Do not alter metadata/SEO policy.
- [ ] Do not alter v5 reference.

### Verify
- [ ] `fa`, `en`, `ar-ae`.
- [ ] Desktop/mobile representative screenshots if tooling exists.
- [ ] CTA/focus behavior.
- [ ] Remaining static sections still work.
- [ ] `npm run check`
- [ ] v5 zero diff.
- [ ] Update `overnight-status.md`.

---

# T09 — Homepage Services Section

## Precondition
- [ ] T08 PASS.

### Checklist
- [ ] Use ordered `hasMany` relationships to Content service docs.
- [ ] Filter options to service records.
- [ ] Bound relationship depth.
- [ ] Do not duplicate titles/excerpts.
- [ ] Resolve localized related docs explicitly with no fallback.
- [ ] Preserve v5 rail/card behavior.
- [ ] Replace only the intended Services seam.

### Verify
- [ ] Required services/order.
- [ ] All locale URLs resolve.
- [ ] 390px no unintended overflow.
- [ ] `npm run check`
- [ ] v5 zero diff.
- [ ] Update `overnight-status.md`.

---

# T10 — Homepage Solutions Section

## Precondition
- [ ] T09 PASS.

### Checklist
- [ ] Use ordered `hasMany` relationships to Content solution docs.
- [ ] Filter options to solution records.
- [ ] Keep six-node visual topology coordinates in code.
- [ ] Keep animation/effects in code.
- [ ] Localized relationship data: explicit locale, no fallback.
- [ ] Replace only Solutions seam.
- [ ] Preserve all remaining static v5 sections.

### Verify
- [ ] Expected count/order.
- [ ] RTL behavior.
- [ ] Mobile topology behavior.
- [ ] Reduced-motion behavior.
- [ ] `npm run check`
- [ ] v5 zero diff.
- [ ] Update `overnight-status.md`.

---

# T11 — Final Quality Gate

### Skills
- `systematic-debugging`
- `payload`
- `webapp-testing`
- `web-design-guidelines`

### Checklist
- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm run test`
- [ ] `npm run build`
- [ ] `npm run check`
- [ ] `git diff --check`
- [ ] Review `git diff --name-only`.
- [ ] Review complete diff for scope violations.
- [ ] Confirm v5 reference zero diff.
- [ ] Confirm no frozen-area file changed unexpectedly.
- [ ] Confirm no `.env`/skills files staged.
- [ ] Browser evidence or explicit BLOCKED reason.
- [ ] On failure: use `systematic-debugging`; do not hide/skips tests.

---

# T12 — Durable Final Report

Write:
`docs/agent-reports/payload-overnight-<date>.md`

Include:
- [ ] Starting HEAD.
- [ ] Ending HEAD.
- [ ] DB backup reference.
- [ ] Completed tasks.
- [ ] Blocked/skipped tasks.
- [ ] Local commits.
- [ ] Exact changed files.
- [ ] Local DB mutations by document key/locale only.
- [ ] Test results.
- [ ] Browser evidence paths.
- [ ] Known issues.
- [ ] Frozen decisions still requiring human input.
- [ ] Official migrations that should be generated/reviewed tomorrow.
- [ ] Confirmation: no push, merge, deploy, production mutation, auth-policy change or full legacy import.

---

# Resume Protocol

If context compacts, the application restarts, or a provider call fails:

1. Read this checklist.
2. Read `docs/agent-reports/overnight-status.md`.
3. Run `git status --short --branch`.
4. Compare current HEAD to recorded HEAD.
5. Resume the first task marked `RUNNING`, otherwise first `PENDING` task whose dependencies are PASS.
6. Never repeat a data mutation unless its idempotency/precondition check proves it is safe.
7. Never reinterpret a frozen decision.
8. If provider overload is transient, retry conservatively.
9. If tooling/provider remains unavailable, save durable state and mark the affected task BLOCKED rather than making speculative changes.

---

# Success Definition for Tomorrow

Minimum acceptable:
- [ ] T00–T03 completed safely.
- [ ] T07 feasibility completed.
- [ ] No destructive/frozen changes.
- [ ] Final report exists.

Strong result:
- [ ] Independent-services fully CMS-backed and verified.
- [ ] Hero migrated with parity.
- [ ] Services/Solutions homepage sections migrated if feasibility and additive-schema gates passed.
- [ ] Full `npm run check` green.
- [ ] Clear migration-generation list ready for human review.
