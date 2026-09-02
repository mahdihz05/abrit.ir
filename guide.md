# AbrIT Payload CMS — Architecture & Agent-Workflow Guide

Status: living reference document. Last updated 2026-09-01 (branch `payload-cms`).
Owner: maintainer + AI-agent crew. Read this before any substantial change.

This guide explains (1) what the project is right now, (2) where it is going,
and (3) how a small crew of AI agents (OpenCode + tmux + worktrees) should work
on it safely. It is written to stay understandable to a junior developer.

---

## 1. Executive Summary

- **Keep the Payload foundation.** The `payload-cms` branch is a clean,
  single-process rewrite: Next.js 16 + Payload 3 + PostgreSQL serving the public
  site, `/admin`, and APIs in one Node app. The old Django backend is removed.
  This base is good; it does not need to be restarted.
- **The biggest gap is visual:** the homepage currently renders the approved
  static reference file `abrit-homepage-polished-v5.html` (uneditable), and
  service detail pages render from a hardcoded TypeScript catalog. Everything
  else (services/solutions listings, pricing, products, generic pages, search,
  forms, SEO) already reads from Payload. Converting the v5 homepage sections
  into real CMS blocks + React components is the central Phase 2 work.
- **Git hygiene is the #0 blocker for multi-agent work.** The worktree pointer
  uses Windows paths (git is broken from WSL), ~63 files show line-ending (CRLF)
  churn, ~23 files of real new work are untracked, and 20+ stale worktrees from
  the abandoned Django "phase 1" plan still exist. Fix this before parallel
  agents (Phase 0, task T01–T03).
- **The target is an "AI-operable website platform":** a non-technical admin
  edits content/forms/media/nav/pricing in the Payload admin; an AI agent
  (OpenCode) makes visual/code changes in a git worktree on a branch, with
  preview + automated checks + human review + merge. No agent ever touches
  production directly.
- **Agent setup:** 3 tmux windows (coordinator / builder / verifier). Start
  with one builder at a time. Defer FirstMate, No Mistakes, and MCP until the
  simple loop is proven (Phase 4–5).
- **Model reality:** Qwen 3.8 27B is sufficient for small, well-scoped tasks
  with mandatory verification (`npm run check` + screenshots). It is not to be
  trusted with large refactors or visual judgment without review.

---

## 2. Current Project Overview

### 2.1 What it is

`/mnt/c/projects/abrit-payload-cms` is a **git worktree** of the repository
`github.com/mahdihz05/abrit.ir`, checked out on branch **`payload-cms`**.
It contains one multilingual (fa / en / ar-ae) website:

- **Public site** at `/{locale}` (home, services, solutions,
  independent-services, products, pricing, knowledge, news, about, contact,
  search) — Next.js 16 App Router, React 19, TypeScript, plain CSS + CSS
  Modules, self-hosted fonts, RTL for fa/ar.
- **CMS admin** at `/admin` — Payload 3 admin UI.
- **APIs** — Payload REST/GraphQL under `/api/*` plus a few custom Next route
  handlers (form submissions, pricing calc, revalidate, private files).

All three run in **one Node process** (standalone build). Database:
**PostgreSQL** only (no more SQLite/Django).

### 2.2 Repository layout

```
abrit-payload-cms/
├── .env                     # local secrets (gitignored — never commit/read aloud)
├── .env.example             # DATABASE_URI, PAYLOAD_SECRET, NEXT_PUBLIC_SITE_URL,
│                            # IP_HASH_SECRET, REVALIDATION_SECRET, (seed-only admin creds)
├── docker-compose.yml       # postgres:17-alpine on host port 5433 (optional; this
│                            # machine already has system Postgres 18 on 5433)
├── abrit-homepage-polished-v5.html   # APPROVED visual reference (172 KB), NOT CMS data
├── artifacts/               # gitignored; parity + UI-audit screenshots
├── docs/                    # implementation plan/checklist/milestones + agent reports
├── frontend/                # THE application (Next.js 16 + Payload 3)
│   ├── src/
│   │   ├── app/             # routes: [locale]/*, (payload)/admin, (payload)/api,
│   │   │                    #   api/forms/[formKey]/submissions, api/pricing/calculate,
│   │   │                    #   api/private/submission-files, api/revalidate
│   │   ├── components/      # block-renderer, site-header/footer, lead-form,
│   │   │                    #   pricing/product configurators, content-detail,
│   │   │                    #   independent-services, reference-homepage (WIP)
│   │   ├── lib/             # payload-cms.ts (Local API client), public-content.ts
│   │   │                    #   (hardcoded catalog, WIP), independent-services.ts,
│   │   │                    #   pricing/forms/seo/search-normalization + tests
│   │   ├── payload/         # payload.config.ts, collections/, globals/, blocks.ts,
│   │   │                    #   access.ts, hooks/ (revalidate, search-text, summary)
│   │   ├── migrations/      # checked-in Payload migrations (apply before deploy)
│   │   └── scripts/         # seed, seed:demo, migrate:django, validate:migration,
│   │                        #   purge-expired-submissions
│   └── package.json         # npm run dev|build|seed|migrate|test|lint|typecheck|check
└── scripts/                 # parity audit (playwright, run on Windows),
                             # smoke-payload.py, packaging helpers
```

### 2.3 How Payload is used

**Collections** (`frontend/src/payload/collections/`):

| Collection | Role |
|---|---|
| `content` | All pages/services/solutions/knowledge/news. Block-based `layout`, tabs for Content / Routing & relations / SEO, `templateKey`, `path`, parent + related relations, `searchText`, localized `translationStatus` + `workflowStatus`, **drafts with autosave, versions (max 50), scheduled publishing, localized status** |
| `packages` | Managed-IT pricing: integer toman, basis-point discounts, `termPrices` per cycle, capacities, WHMCS product/option IDs |
| `forms` | Form definitions: `key`, retention, consent, success message, **field builder** (15 field types, localized labels/options) |
| `form-submissions` | Lead inbox: status (new/contacted/qualified/closed), priority, assignedTo, internal notes, consent text, salted IP hash, `expiresAt` retention. No anonymous create (only via the API route) |
| `submission-files` | Private uploaded files (authenticated read only) |
| `media` | Uploads with focal point, 3 image sizes, `isPublic`, required localized alt |
| `users` | Payload auth (admin login, max 5 attempts / 15 min lockout) |
| `audit-logs` | Append-only audit records (create/delete/update all denied) |

**Globals** (`frontend/src/payload/globals/`):

| Global | Role |
|---|---|
| `site-settings` | Brand, logo/favicon, phone/email, portal/checkout URLs, default SEO |
| `navigation` | header / footer / mobile menus, one level of children, per-item enabled |
| `design-settings` | 7 color tokens, radii, container width, section spacing, motion toggle (**exists but not yet wired to CSS**) |
| `product-catalog` | Product configurator data as **one raw JSON field** (tech debt — see §16) |

**Blocks** (`frontend/src/payload/blocks.ts`): `hero`, `richText`,
`featureGrid`, `faq`, `testimonials`, `cta`, plus `contentSection` (legacy
JSON section that preserves imported Django blocks). Each block has `enabled`
+ `variant` fields (variants: default/simple/centered/split/dashboard/network/
cards/bento/compact).

**Localization:** `fa` (default, RTL), `en`, `ar-ae` (RTL); `fallback: false`
(missing translations 404); experimental `localizeStatus` (per-locale publish).

**Access model** (`frontend/src/payload/access.ts`): `authenticated`,
`authenticatedGlobal`, `publishedOrAuthenticated`. The public frontend uses
the **Local API** (`src/lib/payload-cms.ts`) with `overrideAccess: true` plus
an explicit published+active `where` filter — correct for Server Components,
but see the rule in §5/§16: never use `overrideAccess` in a public API route.

**Automation:** `afterChange` revalidation hooks (tag/path revalidate of the
public site on save), `beforeChange` search-text population, submission
summary hook. Cron jobs: `retention:purge` (daily), `jobs:schedules` +
`jobs:run` (scheduled publishing).

**Forms security** (`app/api/forms/[formKey]/submissions/route.ts`): zod
validation, 25 KB body cap, honeypot field, 10 submissions/hour per IP hash,
consent capture, retention expiry computed from the form's `retentionMonths`.
A convenience proxy `app/api/forms/consultation/route.ts` (WIP) accepts
multipart from the homepage form and forwards to the generic route.

**Migration tooling:** `migrate:django` imports the old Django SQLite DB
**read-only**, idempotently (settings, media, content + blocks, navigation,
packages, forms, submissions, files, audit logs); `validate:migration`
verifies parity. Seed is idempotent; `seed:demo` adds demo content for
local evaluation only.

### 2.4 What is implemented vs. unfinished (as of this writing)

**Implemented and working:**
- Payload config, all collections/globals/blocks, checked-in migration.
- Public services & solutions **listings**, pricing page (configurator +
  overview from `packages`), products page (catalog from `product-catalog`),
  generic pages (about/contact/knowledge/news via `content` path lookup),
  search (normalized `searchText` contains), sitemap/robots/SEO metadata.
- Form submission pipeline (API + Payload storage + admin inbox).
- Admin: versions/drafts/scheduling, media focal point, form inbox columns.
- Local Postgres on port 5433 with database `abrit_payload` seeded.

**Unfinished / deliberately stopped (uncommitted WIP in this worktree):**
- **Homepage** renders the static `abrit-homepage-polished-v5.html` (extracted
  body + styles + runtime JS) — visually approved, but **not editable in the
  CMS at all**. (The committed version was CMS block-rendered; the WIP reverted
  it for visual parity — you confirmed this WIP is the accepted development
  direction.)
- **Service detail pages** render from the hardcoded `src/lib/public-content.ts`
  catalog + `public-detail.tsx` (the committed version used `content-detail.tsx`
  from Payload).
- **Independent services** (backup / cloud-storage / workspace / voice): new
  pages + a 2,100-line hardcoded catalog in `src/lib/independent-services.ts`,
  with CMS-backed fallback (`independentServicesFromContent` reads a seeded
  `content` document; falls back to the hardcoded data).
- **Site header** was heavily reworked (WIP, ~600 lines) to match v5: mega
  menu, language switcher, search, Chatwoot widget re-added to the layout.
- `design-settings` global is not consumed by any CSS yet.
- Knowledge/News have landing pages but no articles; media library is nearly
  empty; no redirect management; no roles beyond "authenticated".

**Git state (critical to know):**
- Branch `payload-cms`: 4 commits past merge-base `54b6918` (bootstrap Payload
  schemas → frontend reads Payload → Django removed → editor UX).
- `master` has 1 commit past the merge-base (Chatwoot widget) — the WIP already
  re-adds Chatwoot, so reconciliation is content-level, not a code gap.
- The worktree's `.git` file and the worktree admin `gitdir` file store
  **Windows-style paths** (`C:/projects/...`) → WSL git cannot see this
  directory as a repo. Workaround used during inspection:
  `git --git-dir=/mnt/c/projects/abrit.ir/.git/worktrees/abrit-payload-cms --work-tree=/mnt/c/projects/abrit-payload-cms …`.
  Proper fix: `git -C /mnt/c/projects/abrit.ir worktree repair
  /mnt/c/projects/abrit-payload-cms` (run from the OS you will develop on).
- ~63 "modified" files are mostly **CRLF line-ending churn** (real diff ≈
  10 files, ~700 insertions); ~23 untracked files are the real new work
  (listed in §2.4). No `.gitattributes` exists.
- 20+ stale worktrees from the abandoned Django phase-1 plan
  (`abrit-r00`…`abrit-r18`, `abrit-agent-control`) are registered in the main
  repo.

### 2.5 What is good about this architecture

1. **One process, one database, one deploy unit** — small, cheap to host
   (cPanel standalone Node), easy to reason about, no API/CMS split to babysit.
2. **Payload is doing its job**: blocks, drafts, versions, scheduling,
   localized status, media transforms, form builder, access control — all
   already configured, which is months of custom-CMS work for free.
3. **Revalidation hooks** make "save in admin → site updates" automatic.
4. **Integer toman + basis points** for money; server-side calculation
   available; WHMCS IDs carried in data.
5. **Form pipeline is genuinely secure**: throttling, honeypot, consent,
   salted IP hash, retention, private files, append-only audit collection.
6. **Migration is verifiable** (`validate:migration`) — the cutover was not a
   dark art.
7. **Docs discipline**: milestones, checklist, and migration guide are real
   and mostly current (the plan/checklist are the stale parts — Phase 0).

### 2.6 Concerns

1. **Uneditable homepage** (static HTML) — the single most visible page is
   outside the CMS. Blocks/components must be built (Phase 2).
2. **Two sources of truth for content** in flight: Payload DB (listed pages)
   and hardcoded TS catalogs (home sections, service details, independent
   services). Until Phase 2 completes, treat the TS catalog as the visual
   source of truth and Payload as the destination.
3. **Git/worktree fragility** (paths, CRLF, uncommitted work, stale trees).
4. **`product-catalog` raw JSON global** — editable by accident, not by design.
5. **No roles** — every logged-in user is a full admin.
6. **No visual regression** — parity screenshots are done manually on Windows;
   no browser is installed in WSL.
7. **Docs drift** — `docs/IMPLEMENTATION_PLAN.md` still describes the Django
   architecture; it predates the Payload cutover.
8. **Single-model agent stack** — see §7 for where extra checking is needed.

### 2.7 Running it locally (WSL, this machine)

```bash
# Postgres 18 is already running on 127.0.0.1:5433 with db abrit_payload.
cd /mnt/c/projects/abrit-payload-cms/frontend
npm install          # once
npm run seed         # idempotent; needs .env (already present)
npm run dev          # http://localhost:3000/fa, /admin
npm run check        # lint + typecheck + vitest + production build
```

NOTE for agents: this is Next.js **16** — read the docs in
`frontend/node_modules/next/dist/docs/` before writing app code (per
`frontend/AGENTS.md`). Do not assume training-era Next conventions.

---

## 3. Old Site vs Current Project

The old site lives on branch `master` (worktree `/mnt/c/projects/abrit.ir`):
Django 5.2 + DRF + SQLite backend, Next.js "frontend-first" presentation,
deployed on cPanel (Passenger for Django under `/cms`, standalone Node for the
site). Its public frontend was intentionally decoupled from the CMS
("frontend-first" phase); the Payload branch supersedes the whole stack.

| Area | Old site (master) | payload-cms branch | Decision |
|---|---|---|---|
| Backend | Django + DRF + SQLite | Payload 3 + Postgres (inside the Next app) | **Discard Django** (already done on the branch) |
| Content model | ContentItem + per-locale translations + JSON-schema blocks | `content` collection + blocks + localized drafts | **Keep Payload model** (superset: versions, scheduling, form builder) |
| Homepage | Static v5 HTML reference, user-approved | Same static v5 HTML (WIP) | **Keep as visual target; rebuild as CMS blocks (Phase 2)** |
| Services (10) / Solutions (6) | Hardcoded TS catalog + Django seed | `content` docs (listed) + hardcoded detail catalog (WIP) | **Migrate detail data into `content` docs (Phase 2)** |
| Independent services (4 products) | Did not exist as a section | New WIP pages + hardcoded catalog + CMS fallback | **Keep; move to proper content docs (Phase 2)** |
| Pricing | 5 packages, 3/6/12-mo terms, Django calc endpoint, WHMCS links | `packages` collection + `termPrices` + WHMCS IDs + calc route | **Keep Payload**; verify totals vs the approved Word document |
| Products (5 tiers) | Hardcoded `product-packages.ts` + WHMCS pids 7–11 | `product-catalog` JSON global | **Keep**, but structure the global later |
| Forms | `consultation`, `quote-request` (Django, hardened) | `forms` collection + secure API route | **Keep Payload**; re-seed from Django DB; enable after privacy consent approval |
| Media | `MediaAsset` + translations, empty DB | `media` collection (focal point, sizes) | **Keep Payload**; import any real assets from old storage |
| Search | Normalized LIKE over `SearchDocument` | Normalized `searchText` contains + hook | **Keep Payload** (adequate at this scale) |
| Audit / revisions | AuditLog + ContentRevision (source: admin/agent/mcp/system!) | `audit-logs` collection + Payload versions | **Keep Payload**; note the old schema already anticipated agents |
| Chatwoot widget | Global script in layout | Re-added in WIP layout | **Keep** (token is public; move to env later) |
| Deploy | Passenger + standalone tarballs (cPanel) | Standalone Node only, simpler | **Keep** (one unit to deploy now) |
| Phase-1 plan (r00–r18: roles/audit/dashboard) | Planned, all BLOCKED, unmerged | Not carried over | **Prune worktrees; carry only the roles idea into Phase 1** |

**Preserve from the old site (do not lose):**
- v5 homepage visual (the approved reference file at repo root),
- the commercial data in the approved package/Word document (source of truth
  for prices/capacities/SLAs),
- form hardening behaviors (throttle, honeypot, consent, retention, private
  file validation — the payload port keeps most of it),
- WHMCS checkout integration (`https://my.abrit.ir/cart.php` + product IDs),
- Chatwoot (`livechat.abrit.cloud`),
- locale/RTL/font behavior (Vazirmatn / Inter / IBM Plex Arabic, self-hosted),
- 301/redirect intent (not implemented anywhere yet — Phase 2+).

---

## 4. Target Product Vision

**In one sentence:** AbrIT becomes a website that a non-technical person can
operate day-to-day in the admin panel, and evolve visually/structurally by
asking an AI agent in plain language — with every change reviewable, testable,
and reversible — while the codebase stays a normal, maintainable project.

Refined into layers:

1. **Content layer (non-technical admin, today):** pages, services, solutions,
   articles, menus, SEO, forms + their fields, media, packages/pricing, site
   settings, navigation — all in `/admin`.
2. **Composition layer (non-technical admin, near-term):** assembling pages
   from reusable, labeled blocks with variants; reordering; per-block enable;
   choosing templates; per-locale publication (a page can be published in fa
   while en is still draft).
3. **Design layer (agent-assisted, mid-term):** "make this section modern",
   "add a pricing block", "change the accent color across service pages" —
   performed by an agent as either a CMS edit (colors via design tokens, new
   block instance) or a reviewed code change (new component/variant).
4. **Engineering layer (developer-only):** schema changes, auth, secrets,
   migrations, deployment.

Success criteria (measurable):
- The homepage, every service page, pricing, and the independent-services
  pages are 100% CMS-composed (no hardcoded content catalogs in `src/lib`).
- A non-technical person can: create a service page, add sections, edit SEO,
  publish per locale, update a form, change a menu — without opening code.
- Any agent-initiated visual change goes through: branch → preview → checks →
  human review → merge. Nothing ships to production without a human.
- The repo passes `npm run check` and the parity screenshot suite at all times.

---

## 5. CMS vs Agent Responsibility Model

Boundary principle: **if a non-technical person would plausibly change it
repeatedly, it is data (A/B). If changing it requires writing/maintaining
code, it is engineering (C/D).** When in doubt, make it data.

### A — CMS-managed (Payload admin, no code)

| Item | Where |
|---|---|
| Page/service/solution/article content, blocks, order, enable/disable | `content` collection |
| Titles, excerpts, slugs, paths, parent/related relations | `content` |
| SEO: title/description/canonical/robots/OG per page | `content.seo` |
| Menus (header/footer/mobile), item order, enable, external links | `navigation` global |
| Forms: add form, add/reorder fields, labels, options, required, retention | `forms` collection |
| Submissions: review, status, priority, assign, notes | `form-submissions` |
| Media: upload, crop (focal point), alt text, public/private | `media` |
| Pricing: package prices, capacities, term prices, features, featured | `packages` |
| Site settings: brand, phone/email, portal/checkout URLs, default SEO | `site-settings` |
| Design tokens: colors, radii, container, spacing, motion (once wired) | `design-settings` |
| Drafts / scheduling / per-locale publish / preview link | built-in |

### B — Schema/block-managed (code defines it once; instances are CMS data)

- Each **block type** (hero, featureGrid, faq, …) = a React component + Payload
  block schema. Adding a *new block type* is agent work (C); afterwards, adding
  *instances/variants* of it is admin work (A).
- **Variants** of existing blocks (e.g., `bento`, `centered`) — code once,
  chosen in admin afterwards.
- **Templates** via `templateKey`: which component renders a given content
  document (home / service / solution / independent / default). Choosing a
  template per page = admin; creating a template = code.
- **Component registry** (document, §11) so agents and admins know what
  blocks exist and what they need.

### C — Agent-managed (OpenCode, in a worktree branch, with review)

- New sections/components that don't exist as blocks yet (Phase 2 v5 rebuild).
- Visual redesign of an existing component/section.
- Cross-page design changes (e.g., restyle all service headers) — must be a
  **single** reviewed change to the shared component, never per-page edits.
- New content documents (e.g., "create a new service page") — do this via
  Local API/REST or a small seed script, **not** hand-edited DB.
- SEO improvements (metadata, JSON-LD, hreflang edge cases).
- Refactors, bug fixes, dependency updates (with review).
- New block types / new templates / new field types (schema code).

### D — Developer-only / protected (agent may suggest, never apply unreviewed)

- `frontend/src/payload/config` + **schema shape changes** (adding/renaming
  fields → migration → review mandatory), `payload.config.ts` itself.
- Access control (`access.ts`), auth settings, user management.
- Secrets: `.env`, `PAYLOAD_SECRET`, `IP_HASH_SECRET`, `REVALIDATION_SECRET`,
  WHMCS/Chatwoot tokens.
- Migrations, database structure, backup/restore, `docker-compose.yml`.
- Deployment: cPanel upload, DNS, SSL, cron. **Agents never deploy.**
- `package.json` dependencies (agent may propose; human approves install).
- The `master` branch and production data.

**The hard rule for public routes:** Server Components may use
`overrideAccess: true` only together with an explicit published+active filter
(as `src/lib/payload-cms.ts` does). **Never** in a public API route or client
component. Add a lint/test note to AGENTS.md (Phase 4).

---

## 6. AI / Agent Integration Architecture

Goal: incremental. The smallest setup that does **not** block the future.

### 6.1 Mechanism evaluation (what, why, when)

| Mechanism | Verdict | Why / When |
|---|---|---|
| **Direct repo access via OpenCode + git worktrees** | **Use now** | The site is a normal git project. Branch + worktree + review + merge is the safest, simplest loop. No new infrastructure. |
| **Payload Local API (from code)** | **Use now** | How the frontend already reads content. Agents can create/update *content* (docs, blocks, forms, media) with `getPayload({config})` in scripts — content changes without touching code. Revalidation hooks handle cache. |
| **Payload REST API + admin token** | **Later, optional** | Needed only if a non-OpenCode client (e.g., a future chat UI for the non-technical admin) should drive content changes. A scoped token + documented endpoints is a 1-day task when needed. |
| **MCP server** | **Defer** | MCP shines when *many* different clients/agents need the same tools, or when the client is not a coding agent. You have one client (OpenCode) and one kind of task. Adding an MCP layer now = maintenance without benefit. Revisit in Phase 5 if you want a natural-language web UI for the admin. |
| **Component registry + metadata** | **Use now (as docs)** | A maintained `docs/component-registry.md` mapping block type → component file → CSS area → screenshot. This is the highest-leverage "agent tooling" that costs nothing. |
| **Preview environments** | **Use now (lite)** | Local `npm run dev` + Payload **draft mode** (`?draft=1` with admin session) + parity screenshots. No separate staging server needed at this scale. (True staging on the host = Phase 5, only if desired.) |
| **Automated testing** | **Use now** | `npm run check` (lint+typecheck+vitest+build) is the gate. Add visual screenshot diff in Phase 4. |
| **Git-based change workflow (branch → review → merge)** | **Use now** | §10. |
| **Human approval gate** | **Use now** | The coordinator merges only after you say so. Non-negotiable. |
| **Rollback** | **Use now (free)** | Payload versions (content) + git revert (code). Document both in the runbook. |
| **FirstMate crew / No Mistakes pipeline** | **Later** | §8. |
| **CI on GitHub** | **Later, optional** | The repo's checks run locally via the verifier. A GitHub Actions job (npm check + build) is cheap insurance once the branch is pushed regularly; not needed for the loop to work. |

### 6.2 The loop (target steady state, Phase 4+)

```
 human request (chat, plain language, any language)
   → coordinator: interpret + clarify + decompose (content vs code)
     → content part:  Payload admin UI  OR  Local-API script  (draft)
     → code part:     builder agent in worktree, branch feat/…
        → verifier:   npm run check + screenshots (+ draft preview)
     → coordinator:   review diff, show preview/screenshots to human
   → human approves (or annotates → loop back)
   → coordinator:     merge branch to payload-cms, publish content
   → (later, human)   deploy standalone build to cPanel
```

What this buys: every AI change is a diff (reviewable), a preview (visible),
a test run (verifiable), a git commit (revertible), and a content version
(rollback-able). No agent ever has production write access.

### 6.3 What NOT to build now (explicitly)

- No MCP server, no internal "agent API" service, no agent RBAC beyond
  "no agent touches prod", no auto-merge, no multi-region staging, no
  microservices, no separate design-token service, no queue workers,
  no vector DB / RAG over the repo (repo search is enough at this size).

---

## 7. OpenCode + Qwen 3.8 27B Assessment

Your stack: OpenCode 1.18.25, single model `naraya/qwen3.8-27b` (text-only),
one ambient plugin (lavish). No custom agents configured — use the defaults
(build/plan/explore) and drive behavior through **task contracts** (goal,
files owned, verification, definition of done) written in each prompt.

| Task type | Qwen 27B adequacy | Notes / required safeguards |
|---|---|---|
| Architecture reasoning, planning | Partial | Good at structuring *given* constraints; keep plans small and verify against the codebase (explore subagent), not memory |
| Repository exploration | Good | Use the explore subagent with narrow questions; the repo is small enough that whole-repo guesses are cheap to correct |
| Bounded coding (1–3 files) | Good | The sweet spot: new component from a spec, block schema, CSS tweaks, tests |
| Large refactors (many files) | **Weak** | Split into ≤3-file sub-tasks with explicit file lists; never "rename X everywhere" as one task |
| Frontend/CSS visual work | Weak–medium | It will *write* plausible CSS but cannot judge it. Every visual task requires screenshot evidence (verifier) — never accept "looks fine" |
| Payload CMS work | Good (schemas, hooks, access) | Schema changes = mandatory human review (they create migrations); follow existing file patterns exactly |
| Debugging | Medium | Good with clear error output + one file; bad at long cross-cutting root-causing. Give it the exact failing command output |
| Review | Medium | Useful as a first-pass diff review, but the coordinator (you in the loop) is the real reviewer; do not let the same session that wrote code approve it |
| Visual/UI judgment | **Not reliable** | Human eyes (you) + Lavish annotation loop + screenshot diffs. Always. |
| Coordinating other agents | Medium | Keep coordination *your* job via tmux; the model is fine at writing clear task contracts and interpreting reports |

**Operating rules (put these in AGENTS.md, Phase 4):**
1. One concern per task; task lists the exact files it may touch.
2. Every code task ends with `npm run check` green (report the command output).
3. Visual tasks end with screenshots of affected routes (fa + en, desktop +
   mobile for layout work).
4. Never touch `.env`, `payload.config.ts`, `package.json`, `access.ts`,
   migrations without an explicit approval line in the task.
5. Small commits, conventional messages, on the task branch only.
6. Report format: what changed / files / verification output / risks / what
   was NOT done.

---

## 8. Tool Evaluation (verified on this machine, 2026-09-01)

All four tools are installed but only **smoke-tested** (one trial run each).
They form one ecosystem (author: kunchenguid) and integrate: FirstMate uses
Treehouse for worktrees and No Mistakes for shipping; Lavish is the shared
visual review surface. None use MCP.

### 8.1 Lavish (`lavish-axi` v0.1.63, npm global, skill installed)

- **What it actually does:** local CLI + server that opens an HTML artifact in
  a browser review UI: element/text annotations, Mermaid→Excalidraw
  whiteboards, a passive **layout-issue inbox** (overflow/clipping/occlusion),
  queued feedback the agent reads via `lavish-axi poll <file>` and answers via
  `--agent-reply`, live reload, image attachments, `export`/`share`
  (share is public-by-default — don't share client data), playbooks
  (diagram/table/comparison/plan/code/input/slides).
- **How it helps this project:** it is your *visual review surface*. The
  verifier can produce a review HTML (page screenshots side-by-side, or the
  rendered page HTML) and you annotate exactly what to fix; the agent polls
  and applies. Also great for architecture/comparison docs (this guide's
  diagrams, parity comparisons).
- **When:** on-demand, for any UI/visual task and for plan reviews. Not a
  daemon.
- **Risks/limits:** reviews static HTML artifacts, not a live server with
  drafts/auth; `share` publishes publicly; adds a step for non-visual tasks.
- **Overlap:** no overlap; it complements the verifier.
- **Verdict: USE NOW (on-demand).** Keep the ambient plugin (harmless).

### 8.2 Treehouse (v2.3.0, Go binary on PATH)

- **What it actually does:** maintains a **pool of reusable, pre-warmed git
  worktrees** for parallel agents: `init` (writes `treehouse.toml`), `get`
  (acquire + subshell), `enter`, `return`, `status`, `prune`, `destroy`.
  Operates inside git (or jj) repos; pool root `~/.treehouse`.
- **How it helps:** removes worktree boilerplate from agent tasks and keeps
  dependency caches warm (a worktree shares the repo but `node_modules` is
  per-directory — pre-warmed pools make the 2nd+ builder start faster).
- **When:** only when you regularly run ≥2 builders in parallel. With one
  builder, plain `git worktree add` is simpler and fully adequate.
- **Risks/limits:** another layer to understand; pool lives in `~/.treehouse`
  (home dir, not the repo) — fine on WSL; dual-OS (Windows/WSL) path issues
  would apply exactly as with plain worktrees; not yet exercised in any real
  project here.
- **Overlap:** overlaps `git worktree` (it is a pool wrapper around it).
- **Verdict: LATER (Phase 4+), only if parallel builders become routine.**
  Plain worktrees first.

### 8.3 No Mistakes (`no-mistakes` v1.60.2, `~/.no-mistakes`)

- **What it actually does:** a **local git push proxy / validation pipeline**:
  `git push no-mistakes <branch>` (or agent `no-mistakes axi run`) intercepts
  the push and runs intent→rebase→review→test→document→lint→push→PR→CI with
  the configured agent (yours: **opencode**), auto-fix retries, evidence
  artifacts, eval replay, and daemon supervision.
- **How it helps:** a second, independent set of eyes + automated gates on
  every shipped branch; catches what the coordinator misses; good record of
  intent/review history.
- **When:** when you push to GitHub regularly (after the branch workflow is
  stable, Phase 4–5). Running it now, on a repo whose main flow is local
  merges, adds friction without matching your release process (cPanel deploy).
- **Risks/limits:** heavy daemon; per-step agent time/cost (30-min timeouts,
  multi-agent runs); blocks direct pushes while active (nested-gate errors);
  PR step presumes GitHub flow you don't use for deploys yet.
- **Overlap:** partially overlaps the verifier + coordinator review (it is an
  *automated, independent* version of the same gates).
- **Verdict: LATER (Phase 5), optional.** Adopt as the push gate once
  `payload-cms` is pushed to GitHub on a regular cadence.

### 8.4 FirstMate (cloned at `~/agent-tools/firstmate`, not initialized)

- **What it actually does:** an **agent distro / crew orchestrator**: you talk
  to one "first mate" agent that dispatches and supervises a crew of agents,
  each in its own tmux window, each in a disposable **treehouse** worktree,
  shipping via **no-mistakes**/direct-PR/local-only; disk-persistent state,
  event-driven low-token supervision, backlog, secondmates, 20 internal
  skills, 5 OpenCode TUI plugins.
- **How it helps (in theory):** fully autonomous "assign a crew" workflow;
  you become pure approver.
- **When:** only if (a) you routinely have >2–3 independent workstreams, and
  (b) you accept a large system to learn/debug. Neither is true now.
- **Risks/limits:** unproven on this machine (never initialized); its own
  AGENTS.md is 72 KB of rules that will consume context in every session it
  controls; crewmates + treehouse + no-mistakes = three moving parts before
  your simpler loop is even stable; its "never write to a project / captain
  approves merges" model is sound but heavy.
- **Overlap:** overlaps your tmux+coordinator design at higher cost.
- **Verdict: NOT NOW. Revisit in Phase 5** as a scaling option, not a
  requirement.

---

## 9. Recommended tmux Workspace

**Size: 3 windows.** (Add a 4th only per the rule at the end.) All windows
run OpenCode with `naraya/qwen3.8-27b`.

Session: keep the existing `opencode` session; rename windows as needed.

### Window 1 — `control` (coordinator — you + main OpenCode session)

- **Purpose:** interpret requests, clarify, decompose into task cards, assign
  to the builder, review diffs, run/merge integration, own docs & guide.
- **Active:** always (this is your seat).
- **Model/tools:** default OpenCode; use `explore` subagents for research;
  git (the main repo + `--work-tree` form while T01 is open); Lavish for
  reviewing plans/artifacts; Bash for running verifier output.
- **Works in:** the `payload-cms` worktree (this directory) — **read-mostly**;
  writes only for: docs, merges, integration commits, task cards in `docs/`.
- **Owns:** `docs/**`, `guide.md`, root config (`.gitattributes`,
  `docker-compose.yml`), the merge action.
- **Avoids:** `frontend/src/**` app code (delegate), `.env`, anything in
  `frontend/src/payload/` (delegate + review).
- **Inputs:** your requests; builder reports; verifier reports.
- **Output:** task cards (goal/files-owned/DoD/verification), merge commits,
  updated docs, final summaries.
- **Reports to:** you, directly, in this window.
- **Hands off to:** builder (task card), verifier (check request).

### Window 2 — `builder` (implementation agent)

- **Purpose:** execute exactly one task card at a time.
- **Active:** while a task is assigned; idle (or closed) otherwise.
- **Model/tools:** default OpenCode build agent; repo search, git, vitest,
  eslint/tsc via `npm run check`; Next 16 docs in `node_modules/next/dist/docs/`
  (mandatory before app-code edits); Payload docs via web when unsure.
- **Works in:** a **task worktree** `../abrit-<slug>` on branch `feat|fix|chore/<slug>`
  (created per §10). Never edits the `payload-cms` worktree.
- **Owns:** only the files listed in its task card (e.g.,
  `frontend/src/components/service-section.tsx` + one CSS module).
- **Avoids:** other tasks' files, `payload.config.ts`, `access.ts`,
  `package.json`, `.env`, migrations, `src/payload/collections/*` unless the
  card explicitly says "schema change — human pre-approved".
- **Inputs:** one task card.
- **Output:** commits on its branch + a report (changed files, `npm run check`
  output, screenshots if visual, risks, not-done list).
- **Reports to:** coordinator (paste the report into `control`).
- **Hands off to:** verifier (ask for checks/screenshots) or coordinator
  (request needs clarification → back to coordinator).

### Window 3 — `verify` (verifier / evidence agent)

- **Purpose:** produce *evidence*, not opinions: build results, test results,
  screenshots, smoke results. Read-only on source code.
- **Active:** on demand, after each builder report (and for Phase 0 baselines).
- **Model/tools:** Bash (npm, playwright, curl), browser screenshots via
  Playwright (installed in T05); Lavish artifact assembly for visual reviews.
- **Works in:** the worktree under test (reads code, runs server/tests);
  writes only to `artifacts/**` and temp files.
- **Owns:** `artifacts/**` (screenshots, reports), the dev server it runs.
- **Avoids:** all source files (report problems instead of fixing them).
- **Inputs:** "verify branch X / commit Y, routes: …".
- **Output:** PASS/FAIL per gate + artifacts (paths), list of failing routes,
  before/after screenshot pairs for visual tasks.
- **Reports to:** coordinator.
- **Hands off to:** coordinator (failures become new task cards).

### Parallelism rules

- **Safe in parallel:** builder (code in its worktree) ∥ verifier (checks in
  another worktree) ∥ coordinator (review/docs).
- **Never parallel:** two builders touching overlapping files; any writer in
  the `payload-cms` worktree while the coordinator integrates.
- **When to add a 4th window:** only when two tasks have **disjoint file
  ownership** (e.g., builder-A on `src/payload/blocks.ts` + builder-B on
  `src/components/home/*`), and even then keep the coordinator serializing
  merges. Two builders is the ceiling for this project at this scale.

---

## 10. Git / Worktree Strategy

Keep it junior-readable: **one integration branch, short-lived task branches,
one worktree per active task, human merges.**

### 10.1 Branches

- `payload-cms` — **integration branch** (this worktree). The only branch
  agents merge into; later merged into `master` at cutover.
  - Only the coordinator commits here (merges, docs, integration fixes).
- `feat/<slug>`, `fix/<slug>`, `chore/<slug>` — task branches, created from
  the tip of `payload-cms`, deleted after merge.
- Naming slug = 2–4 lowercase words (`cloud-services-modern`,
  `design-tokens-wire`).
- No stacked branches, no long-lived feature branches, no force-push, no
  direct agent pushes to `payload-cms`.

### 10.2 Worktrees

- The `payload-cms` worktree (this directory) = **review/integration area**.
- One worktree per active task:
  ```bash
  git -C /mnt/c/projects/abrit.ir worktree add /mnt/c/projects/abrit-<slug> -b feat/<slug> payload-cms
  ```
  (run from the main repo; after T01 the plain commands work.)
- The builder works exclusively in `../abrit-<slug>`.
- `node_modules`: each worktree needs its own `npm install` (first task in
  each worktree) — or use `treehouse` pools later to pre-warm (§8.2).
- After merge: `git worktree remove ../abrit-<slug>` + `git branch -d feat/<slug>`.
- **Cap: max 2 task worktrees at a time.** Prune anything older than a week.

### 10.3 WSL/Windows dual-OS note (do this in T01)

Both OSes share this repo via `/mnt/c` ↔ `C:`. Worktree pointer files store
absolute paths in one OS's format, so git breaks from the other OS.
Current state: pointers are Windows-form → WSL git is broken here.

- **Fix for WSL (where OpenCode runs):** from the main repo,
  `git -C /mnt/c/projects/abrit.ir worktree repair /mnt/c/projects/abrit-payload-cms`
  (rewrites both pointer files to `/mnt/c/...`).
- If you later use the same worktree from Windows: run
  `git worktree repair C:\projects\abrit-payload-cms` there. (One side at a
  time; the other side needs a repair too — that's expected.)
- New worktrees created in WSL will be WSL-form; don't open them in Windows
  without a repair.
- Until T01 lands, use the explicit form for all git in WSL:
  `git --git-dir=/mnt/c/projects/abrit.ir/.git/worktrees/abrit-payload-cms --work-tree=/mnt/c/projects/abrit-payload-cms …`

### 10.4 Commits & review

- Agents commit their own work (small, conventional: `feat:`, `fix:`,
  `chore:`, `docs:`), one logical change per commit, on their task branch.
- Before handoff the builder rebases onto `payload-cms` (`git rebase
  payload-cms`) so merges are clean.
- Coordinator review = `git diff payload-cms...feat/<slug> --stat` + reading
  the diff of schema/access/secret-adjacent files in full + verifier evidence
  + your visual approval. Then `git merge --no-ff feat/<slug>` in the
  `payload-cms` worktree, delete branch + worktree.
- Push to GitHub: coordinator, after merge, when you ask (currently the
  branch is not pushed; set that up in T03).

### 10.5 Line endings (T02)

Add `.gitattributes` at repo root:
```
* text=auto eol=lf
*.ps1 text eol=crlf
*.bat text eol=crlf
*.png binary
*.jpg binary
*.jpeg binary
*.ico binary
*.sqlite3 binary
```
Then `git add --renormalize .` and commit — this collapses the ~63-file CRLF
churn into one understandable commit and prevents recurrence.
(Keep `core.autocrlf` unset; `.gitattributes` wins.)

---

## 11. Agent Skills and Tool Matrix

Per-role matrix (this machine's real tools; nothing to install for Phase 0):

| Capability | Coordinator | Builder | Verifier |
|---|---|---|---|
| OpenCode default agent | ✓ | ✓ | ✓ |
| `explore` subagent (research) | ✓ (primary) | as needed | as needed |
| Repo search (grep/glob) | ✓ | ✓ (bounded) | read-only |
| git (log/diff/branch/merge/worktree) | ✓ (incl. merges) | branch-only, no merge | read-only |
| Bash: npm scripts (dev/build/check) | runs reports | `npm run check` | ✓ (primary) |
| Playwright (screenshots/smoke) | — | — | ✓ (T05+) |
| Lavish (`lavish-axi`) | plan/decision artifacts | — | visual review artifacts |
| Payload Local API (content ops via tsx scripts) | ✓ (content tasks) | only if card says so | read checks |
| Payload admin UI (`/admin`) | **you** (the human) for publish decisions | — | smoke via browser |
| Treehouse | — (later, Phase 4+) | pool worktrees (later) | — |
| No Mistakes | push gate (later, Phase 5) | — | — |
| FirstMate | not now | — | — |
| MCP servers | none (Phase 5 revisit) | none | none |
| Web research (Payload/Next docs) | ✓ | ✓ (Next16 docs are local: `node_modules/next/dist/docs/`) | — |
| Writes allowed | docs, merges, root config | task-card files only | `artifacts/**` only |

---

## 12. Recommended Additional Tools

Small list; each earns its place:

1. **Playwright + Chromium in WSL** (needed by T05).
   `npm i -D playwright` in `frontend` (or a small `scripts/visual` package)
   + `npx playwright install chromium`. Justification: the parity audit
   currently only runs on Windows; visual evidence is the project's #1
   verification need and must be reproducible from any agent window.
2. **Screenshot diff step** (Phase 4): a ~50-line script comparing
   `artifacts/parity/baseline/<route>.png` vs current output (Playwright
   screenshot + pixelmatch, threshold ~0.1%). Justification: turns "did the
   visual change break something else?" into a PASS/FAIL.
3. **Worktree git alias** (T01, 3 lines in `~/.bashrc`) so pre-fix git calls
   don't repeat the long `--git-dir/--work-tree` form.
4. **Optional, Phase 4:** GitHub Actions running `npm run check` on
   `payload-cms` + task branches (cheap, ~3 min, catches what local runs miss
   after rebase). Not required for the loop to work.
5. **Optional, Phase 5:** `no-mistakes` (already installed) as the push gate;
   `treehouse` (installed) if ≥2 builders become routine.

Explicitly NOT recommended now: MCP servers, husky/lefthook (coordinator runs
checks), staging environments, CI matrix, design-token tooling, RAG/vector
indexing, auto-merge bots.

---

## 13. Implementation Roadmap

Phases are ordered by dependency, not calendar. "NOW" = start immediately.

### Phase 0 — Audit / stabilization  **NOW**

- **Objective:** make the repo a safe base for agents: git healthy, WIP
  committed as the accepted baseline, checks green, evidence tooling working
  on WSL, docs honest.
- **Tasks:** T01–T08 (§14).
- **Dependencies:** none (T01 unblocks everything).
- **Risks:** CRLF renormalize touching every file (mitigate: commit it
  separately, verify `git diff --ignore-cr-at-eol` is empty after); worktree
  repair switching the "active OS" to WSL (accepted — OpenCode runs here).
- **Definition of done:**
  - `git status` clean in the worktree; worktree visible to WSL git;
  - `npm run check` green;
  - parity screenshot baseline captured on WSL for all representative routes;
  - `docs/IMPLEMENTATION_PLAN.md` + README updated to Payload reality;
  - stale worktrees pruned (branches kept);
  - `payload-cms` pushed to GitHub with the baseline.
- **Who:** coordinator (git/docs), builder (code fixes if check fails),
  verifier (evidence).

### Phase 1 — CMS foundations  **NOW (after T01–T04)**

- **Objective:** the CMS holds *all* authoritative data; admin is usable by a
  non-technical person for daily operations.
- **Tasks:**
  1. Verify/complete the Django→Payload migration against the real SQLite DB
     (`migrate:django` + `validate:migration`); confirm content counts
     (21 items / 63 translations / 5 packages / 2 forms / 3 menus / audit
     rows) and import any missing media.
  2. Seed/confirm `forms` (consultation, quote-request) with all field
     translations; confirm the consultation form on the homepage writes
     through the Payload pipeline (end-to-end test with a throwaway
     submission, then delete it in admin).
  3. Wire `design-settings` → CSS custom properties in
     `app/[locale]/layout.tsx` (one small change; colors/radii/container/
     spacing/motion become live admin edits).
  4. Minimal roles: Payload `roles` (admin / editor / viewer) + restrict
     `users` management to admin; document the access rule
     (`overrideAccess` only in Server Components with published filters).
  5. **Decision gate (human):** approve Privacy Policy + consent → then
     activate public forms; otherwise keep the consent gate closed (as on
     master).
  6. Product catalog: document the exact JSON schema in the component
     registry (Phase 4 deliverable, needed now for agent safety); structure
     it into real fields only when editing pain is proven.
- **Dependencies:** Phase 0.
- **Risks:** migration import surprises (mitigate: validate script is the
  gate); role changes locking you out (mitigate: create a second admin user
  first).
- **Definition of done:** admin can do a full day of operations (edit a
  service, add a menu item, change a price, change the accent color and see
  it on the site, work a submission in the inbox); migration validated;
  `npm run check` green; parity baseline unchanged except intended color
  changes.
- **Who:** builder (tasks 1–4), coordinator (decisions, docs), verifier.

### Phase 2 — Page/content flexibility  **NEXT (the core of the vision)**

- **Objective:** eliminate hardcoded content. Every public page is composed of
  CMS blocks via templates; the v5 homepage is reproduced block-by-block.
- **Tasks (order matters — each section is one small task with a parity gate):**
  1. Template rendering: `templateKey` drives which component renders a
     content doc (default / home / service / solution / independent).
  2. Move service-detail data from `public-content.ts` into `content` docs
     (capabilities, technologies, FAQ, related already have fields) — 10
     services × 3 locales; verify each detail page against the old rendering.
  3. Move independent-services data into `content` docs (4 products).
  4. Rebuild v5 homepage sections as typed blocks + components, in visual
     order of importance: hero → services grid → solutions grid →
     stats/KPIs → process → network visual → usecases → assurance → faq →
     resources → CTA/logo cloud. For each: block schema → component → seed
     content (fa/en/ar) → parity screenshot diff vs the v5 reference.
  5. Switch the homepage route from static-HTML injection to block rendering;
     keep the v5 HTML file as the pixel reference (do not delete it).
  6. Delete the hardcoded catalogs from `src/lib` as each moves; keep
     `public-detail.tsx` etc. only while a section is mid-migration.
  7. Redirect management (301s for URL changes) — small collection or
     config file + route middleware.
- **Dependencies:** Phase 1 (design tokens wired, migration verified).
- **Risks:** visual drift from v5 (mitigate: per-section screenshot diff,
  pixel target = the reference file); scope creep (mitigate: one section per
  task card; DoD = parity pass, not "improvements"); block-schema churn
  (mitigate: design all block schemas for the homepage first, in one review).
- **Definition of done:** zero `Record<Locale,…>` content catalogs in
  `src/lib` (config/labels only remain); homepage 100% block-rendered and
  parity-passing in 3 locales × 2 viewports; every service/solution/
  independent detail page CMS-sourced; `npm run check` + full parity green.
- **Who:** builder (1–6, serialized), coordinator (block-schema review per
  section), verifier (parity), you (visual approval per section).

### Phase 3 — Forms & admin UX

- **Objective:** the admin is pleasant and forms are a real lead pipeline.
- **Tasks:** form-embed block (choose a form + placement, rendered as a block
  in any page layout); submission notifications (webhook/email on new
  submission — e.g., Telegram bot or SMTP via cron/payload job); inbox
  polish (quick actions: mark contacted, assign); privacy/consent copy in all
  3 locales; retention cron on the host; test coverage for the form pipeline.
- **Dependencies:** Phase 1 (forms active), Phase 2 (block system for embeds).
- **Risks:** notification channel choice (pick the one you actually read).
- **Definition of done:** a submission from any page form appears in the
  inbox within seconds + notification delivered; an admin can add a form to
  any page by adding a block; consent/retention behavior covered by tests.
- **Who:** builder, coordinator, verifier.

### Phase 4 — Agent-readiness

- **Objective:** the AI loop of §6.2 works end-to-end for a real request,
  repeatedly, with evidence.
- **Tasks:**
  1. Root `AGENTS.md` (repo-level): repo map, commands, the §5 A/B/C/D
     boundary, the overrideAccess rule, commit/branch rules, report format,
     Next-16-docs warning, "never deploy, never touch .env".
  2. `docs/component-registry.md`: every block/type → component file → CSS
     area → variant list → screenshot; the product-catalog JSON schema.
  3. Visual regression: baseline commit of `artifacts/parity/baseline/` +
     screenshot-diff script wired into the verifier's routine.
  4. Preview runbook: how to start the dev server, open draft preview
     (`?draft=1`), capture before/after, build a Lavish review artifact.
  5. Local-API content cookbook: 6–8 copy-paste scripts (create service page,
     add featureGrid block to page X, reorder blocks, create form + fields,
     update menu, change design token) with safety notes.
  6. Optional: GitHub Actions `npm run check`.
  7. Prove it: run 3 real requests through the full loop (one content-only,
     one visual, one mixed) and record the results in `docs/agent-reports/`.
- **Dependencies:** Phases 1–2 (registry needs stable blocks; parity needs
  the block-rendered pages).
- **Risks:** docs going stale (mitigate: registry updated as part of every
  block-adding task's DoD).
- **Definition of done:** a new agent session given only the repo + AGENTS.md
  can complete one mixed request end-to-end with green evidence and a merge
  you approve without re-doing it.
- **Who:** coordinator (docs), builder (scripts/tests), verifier (harness).

### Phase 5 — AI-assisted site modification (steady state)

- **Objective:** non-technical person asks in chat; changes arrive as
  reviewed diffs + CMS edits; optionally scale the crew.
- **Tasks:**
  1. Codify the end-to-end workflow of §15 as a repeatable runbook
     (`docs/agent-runbook.md`) with the clarification question patterns.
  2. Optional: scoped REST token + endpoint list for content ops (if you want
     a non-OpenCode client later, e.g., a Telegram/web chat that edits content
     — still no code changes).
  3. Optional: `no-mistakes` as the push gate on GitHub.
  4. Optional: MCP server wrapping (content ops, branch ops, run-checks,
     request-preview) **only** if a second client type appears.
  5. Optional: FirstMate if you routinely run >2 parallel workstreams.
  6. Optional: lightweight staging (a second Postgres + build on the host) if
     production changes become frequent.
- **Dependencies:** Phase 4 proven.
- **Risks:** scope inflation — every item here is optional and deferred until
  a concrete need exists.
- **Definition of done:** two weeks of real admin requests handled through
  the loop with <1 rework each and zero production incidents.
- **Who:** coordinator + you.

---

## 14. First Tasks to Start Now

All eight belong to Phase 0 (+ T07/T08 start Phase 1). Sized for single
agent sessions. Prerequisites are strict.

| ID | Goal | Owner | Files/area | Prereq | Expected result | Verification |
|---|---|---|---|---|---|---|
| **T01** | Repair git for WSL + baseline | Coordinator | main repo worktree metadata; `.git` pointer files | none | WSL git works on the worktree; explicit-pointer workaround no longer needed | `git -C /mnt/c/projects/abrit-payload-cms status` succeeds; `git worktree list` shows the tree not prunable |
| **T02** | Kill CRLF churn | Coordinator | `.gitattributes` (new, repo root) | T01 | One renormalize commit; future edits LF-stable | `git diff --ignore-cr-at-eol` empty; new test file written on WSL shows LF in `git diff` |
| **T03** | Commit the accepted WIP as baseline | Coordinator | the ~23 untracked + ~10 real-modified files | T01, T02 | 3–4 logical commits: (a) v5 static home + reference runtime, (b) independent services, (c) header rework + Chatwoot, (d) parity scripts; `payload-cms` pushed to GitHub | `git status` clean; `git log` tells the story; remote branch exists |
| **T04** | Green `npm run check` | Builder | `frontend/` (minimal fixes only) | T03 | lint+typecheck+vitest+build pass | verifier captures the full output in `artifacts/` |
| **T05** | Parity harness on WSL | Verifier | `scripts/site-parity-audit.py` + Playwright install | T04 | Audit runs in WSL against local dev server; baseline screenshots saved to `artifacts/parity/baseline/` for all representative routes (fa/en/ar-ae, desktop+mobile) | script exits 0; `routes.json` shows 0 non-200; PNGs present |
| **T06** | Docs to reality | Coordinator | `docs/IMPLEMENTATION_PLAN.md`, `docs/IMPLEMENTATION_CHECKLIST.md`, `README.md` | T03 | Plan/checklist rewritten for the Payload architecture; WIP state recorded in MILESTONES | no document claims Django is in production; README quickstart verified line-by-line |
| **T07** | Verify migration state | Builder+Verifier | `frontend/src/scripts/*`, Postgres `abrit_payload` | T04 | `migrate:django` (read-only, from the real SQLite path) + `validate:migration` run; gaps listed (counts vs expected: 21 items/63 translations/5 packages/2 forms/3 menus); any missing media identified | validation report in `artifacts/`; gap list or "no gaps" statement |
| **T08** | Prune stale worktrees | Coordinator | main repo worktree registry (`abrit-r00…r18`, `abrit-agent-control`) | T01 | Worktrees removed; branches `feat/p1-*` + `agent/phase-1-control` **kept** on GitHub for history | `git worktree list` shows only: main, `payload-cms`, active task trees |

Sequencing: T01 → T02 → T03 → T04 → {T05, T06, T07 in any order, T08 any
time after T01}. T04 is the only one that may need real code fixes.

---

## 15. Example End-to-End AI Change Workflow

Request (non-technical admin, in chat, Persian):

> «صفحه خدمات ابری را کمی مدرنتر کن، یک سکشن مزایا اضافه کن و فرم درخواست
> مشاوره را پایین صفحه قرار بده.»
> ("Make the cloud services page a bit more modern, add a benefits section,
> and put the consultation-request form at the bottom of the page.")

**1 — Intake & interpretation (coordinator, `control`).**
"خدمات ابری" is not an exact page title, so the coordinator checks the
content model: services (`digital-workspace` = فضای کار ابری?), solutions
(`digital-workplace`?), products (workspace?). It asks **one** clarifying
question: "منظورتان کدام صفحه است: (1) سرویس فضای کار دیجیتال،
(2) راهکار محل کار دیجیتال، (3) صفحه محصول Workspace؟" — and waits.
(No guessing on the target page; ambiguity on *style* is fine to resolve by
taste.)

**2 — Decomposition.** Assuming (3) `/fa/independent-services/workspace`:
- (a) "کمی مدرنتر" → **code** change to the independent-services detail
  component/CSS (subtle: spacing, card treatment, accent use via design
  tokens).
- (b) "سکشن مزایا" → **content** change: add a `featureGrid` block (4–6
  items, 3 locales) to that page's `content` document.
- (c) "فرم مشاوره پایین صفحه" → check the template: if the independent
  template already renders the consultation form after the last block →
  **content** (ensure a form/CTA block is last); if not → **code** (template
  change, one file).

**3 — Assignment.** Coordinator writes two task cards and hands (a)+(c-code)
to the builder with the exact file list
(`frontend/src/components/independent-services.tsx`,
`independent-services.module.css`, maybe the template file) and DoD:
"visually modern but same information architecture; no new sections;
`npm run check` green; screenshots of /fa + /en, desktop + mobile".
Content part (b) is done by the coordinator via a Local-API script
(`tsx` one-off: find doc by path, append a `featureGrid` block to `layout`,
save as **draft**), or by you in `/admin` — your choice; the runbook offers
both.

**4 — Build (builder, `builder` window, worktree `abrit-workspace-modern`,
branch `feat/workspace-modern`).**
Edits the 2–3 owned files, commits small, rebases, runs `npm run check`,
reports changed files + output + "not done: nothing".

**5 — Verify (verifier, `verify` window).**
Runs `npm run check` on the branch (independent run), starts `npm run dev`,
screenshots `/fa/independent-services/workspace` + `/en/...` with the content
draft applied (`?draft=1` + admin session, or the script saves the draft and
the preview link is used), diffs against the T05 baseline (only this route
should differ), produces a before/after pair.

**6 — Review (coordinator + you).**
Coordinator shows: the diff stat, the before/after screenshots (optionally a
Lavish artifact with the two screenshots side-by-side and annotation
controls), and the content block that will be added. You annotate ("این
سکشن را کمی روشن‌تر کن", "عنوان مزایا این باشد: چرا ابری؟") → coordinator
turns annotations into a small follow-up task for the builder (loop 4–5,
usually ≤2 rounds).

**7 — Approval & merge.** You say "تأیید". Coordinator: merges
`feat/workspace-modern` → `payload-cms`, deletes branch + worktree, and
publishes the content document in the admin (draft → published) — the
revalidation hook pushes the change to the live local site. (Production
deploy remains a separate human act per the deploy docs.)

**8 — Record.** One line in `docs/MILESTONES.md` + the report kept in
`docs/agent-reports/`. Total new infrastructure: zero — one branch, one
worktree, one content edit, one merge.

This validates the architecture: content asks stay in the CMS (fast, safe,
reversible via versions); visual asks stay in git (diffable, testable,
revertible); the human only approves.

---

## 16. Risks and Anti-Patterns

| Risk / anti-pattern | Consequence | Mitigation (owner) |
|---|---|---|
| CRLF/line-ending chaos | unreviewable diffs, fake conflicts | T02 `.gitattributes`; never `git config core.autocrlf` differently per machine (all: coordinator) |
| Worktree rot (20 already) | confusion, stale state | 2-worktree cap, delete after merge, weekly `git worktree list` check (coordinator) |
| Dual-OS git path breakage | "not a git repository" surprises | T01 repair + documented rule: repair on the OS you're using (coordinator) |
| Static HTML homepage | the key page is uneditable — kills the vision | Phase 2, section-by-section parity-gated rebuild (builder, serialized) |
| Two sources of truth (TS catalog vs DB) | edits in the wrong place silently lost | task cards name the source of truth per page; T07 gap list; Phase 2 DoD = zero catalogs |
| `product-catalog` raw JSON global | non-technical user breaks structure by typing | schema documented in registry (Phase 4); editor warning text already set; structured fields only when pain proven (coordinator) |
| `overrideAccess` leaking to a public route | draft content exposed | AGENTS.md rule + a unit test asserting the public API routes never call it (Phase 1) |
| No roles — every login is full admin | accidental schema/secret damage by a junior admin | Phase 1 roles (admin/editor/viewer); second admin user created first (builder+coordinator) |
| Small model doing big refactors | half-applied renames, silent regressions | ≤3-file task cards, `npm run check` gate, coordinator diff review (all) |
| Trusting "it looks fine" from an agent | visual regressions ship | screenshots are the only accepted visual evidence; Lavish review for disputes (verifier) |
| Agents committing to `payload-cms` | unreviewed history | branch-only rule; merge is coordinator-only (coordinator) |
| Agent production access | irreversible damage | none exists by design; deploy = human runs the packaging steps (all) |
| Secrets in context/logs | leak | `.env` never read into output; AGENTS.md rule; opencode.json API key stays in `~/.config` (never commit `~/.config/opencode`) |
| Docs drift (plan still says Django) | agents follow stale instructions | T06 + registry/AGENTS.md are living files; every schema/block task updates the registry (coordinator) |
| Over-engineering (MCP, FirstMate, staging, CI matrix now) | maintenance tax before value | explicit deferrals in §6.3/§8/Phase 5 (coordinator) |
| Parallel writers on shared files | lost work, merge pain | file ownership in task cards; 2-builder cap; coordinator serializes merges (coordinator) |
| Uncommitted WIP as the "real" state | new agents rebuild it or clobber it | T03 commits it as the baseline (coordinator) |

---

## 17. Recommended Final Architecture

```
                    ┌────────────────────────────────────────────┐
  non-technical     │  HUMAN ADMIN (you) — /admin, plain chat    │
  admin + approver  └───────┬─────────────────────────┬──────────┘
                            │ edits                    │ approves
                            ▼                          ▼
                    ┌───────────────┐            ┌───────────────┐
                    │  PAYLOAD CMS  │◄──────────►│  COORDINATOR  │
                    │ content/blocks│  Local API │  (OpenCode,   │
                    │ forms/media/  │  content   │  control win) │
                    │ nav/pricing/  │  ops       └───────┬───────┘
                    │ settings      │                    │ task cards
                    └───────┬───────┘                    ▼
                            │ revalidate hooks      ┌───────────────┐
                            ▼                       │  BUILDER      │
              ┌──────────────────────────┐          │ (worktree +   │
              │   PUBLIC SITE (Next 16)  │          │  branch, 1    │
              │ templates + block        │          │  task at a    │
              │ components (git code)    │          │  time)        │
              └──────────────────────────┘          └───────┬───────┘
                            ▲                               │
                            │ screenshots/checks            ▼
                    ┌───────┴───────┐            ┌───────────────────┐
                    │    VERIFIER   │◄───────────│ git branch feat/… │
                    │ (checks,      │            │ → merge (coordinator)
                    │  screenshots, │            │ → payload-cms     │
                    │  parity)      │            │ → (human deploys  │
                    └───────────────┘            │    to cPanel)     │
                                                 └───────────────────┘
  One Node process: site + /admin + API · Postgres · standalone build
```

Stable properties (do not violate):

1. **One process, one database, one deploy unit.**
2. **Content = data in Payload; presentation = git versioned code.** The line
   between them is the block schema (A/B/C/D in §5).
3. **Agents work on branches in worktrees; humans merge; humans deploy.**
4. **Every change leaves evidence:** git diff, `npm run check` output,
   screenshots, content version.
5. **The repo stays small and boring:** no microservices, no queues, no
   extra daemons beyond the app itself.

---

## 18. Immediate Next Step

Execute **T01 → T02 → T03** (git repair, line-ending normalization, commit
the accepted WIP, push `payload-cms`). They are small, unblock everything,
and make multi-agent work safe. The coordinator can perform all three in one
session if you approve the commit plan (3–4 logical commits) and the
`git worktree repair` (which switches this worktree's git pointers to WSL
paths — Windows-side git would then need its own one-time repair if used).

After T01–T03: T04 (green checks) and then start Phase 1 in parallel with
T05–T07. The v5-homepage block rebuild (Phase 2) is where the project's value
lands — protect it from scope creep with the per-section parity gate.

---

### Appendix A — Verified environment facts (2026-09-01)

- Repo: `github.com/mahdihz05/abrit.ir`; worktree `abrit-payload-cms` on
  `payload-cms` (d42272c + uncommitted WIP); merge-base with master `54b6918`;
  master 1 commit ahead (Chatwoot — already re-created in WIP).
- Node v22.22.1, npm 9.2.0, Python 3.14.4, Docker 29.2.1 (optional), system
  PostgreSQL 18 on 127.0.0.1:5433, DB `abrit_payload` present (seeded).
- OpenCode 1.18.25, model `naraya/qwen3.8-27b` (text-only) via
  router.bynara.id; one ambient plugin (axi-lavish-axi); no custom agents.
- tmux: session `opencode`, windows `control`, `discovery-`.
- Installed agent tools (smoke-tested only): lavish-axi v0.1.63
  (`~/.local/bin/lavish-axi`), treehouse v2.3.0 (`~/.local/bin/treehouse`,
  pool `~/.treehouse`), no-mistakes v1.60.2 (`~/.no-mistakes`, agent=opencode),
  firstmate (cloned `~/agent-tools/firstmate`, not initialized).
- No MCP configs anywhere in the projects. No Playwright/Chromium in WSL
  (parity was run on Windows; `PLAYWRIGHT_BROWSER_PATH` unset).
- `.env` present in worktree (gitignored). Never read it into output.

### Appendix B — Key file map (for agents)

| Concern | File(s) |
|---|---|
| Payload config | `frontend/src/payload.config.ts` |
| Content model | `frontend/src/payload/collections/Content.ts` |
| Blocks | `frontend/src/payload/blocks.ts` |
| Globals | `frontend/src/payload/globals/{SiteSettings,Navigation,DesignSettings,ProductCatalog}.ts` |
| Access rules | `frontend/src/payload/access.ts` |
| Public data access | `frontend/src/lib/payload-cms.ts` |
| Block rendering | `frontend/src/components/block-renderer.tsx` |
| Homepage (WIP static) | `frontend/src/app/[locale]/page.tsx` + `components/reference-homepage.tsx` + `lib/reference-homepage.ts` + `components/homepage-runtime.tsx` |
| Service listing/detail | `frontend/src/app/[locale]/services/**` + `components/content-listing.tsx` / `public-detail.tsx` |
| Independent services (WIP) | `frontend/src/app/[locale]/independent-services/**` + `lib/independent-services.ts` + `components/independent-services.tsx` |
| Pricing/products | `frontend/src/app/[locale]/{pricing,products}/**` + configurators + `lib/managed-it-packages.ts` / `product-catalog.ts` |
| Forms pipeline | `frontend/src/app/api/forms/**` + `lib/forms.ts` + `payload/collections/Forms.ts` |
| Seeds/migration | `frontend/src/scripts/{seed-payload,seed-demo,migrate-django,validate-migration}.ts` |
| Tests | `frontend/src/lib/*.test.ts`, `frontend/src/payload/validation/uploads.test.ts` |
| Visual reference | `abrit-homepage-polished-v5.html` (repo root) |
| Parity audit | `scripts/site-parity-audit.py` (+ `artifacts/parity/`) |
| Next 16 agent docs | `frontend/node_modules/next/dist/docs/` |
