# Payload CMS Starter V1 — Master Execution Directive

## Mission

Turn the current ABRIT Payload/Next.js codebase into a **generic, production-grade, reusable Payload CMS Starter V1** and publish the finished starter to:

`https://github.com/mahdihz05/payload-CMS.git`

The destination repository is the stable base for future websites:

```text
Use/clone payload-CMS
-> configure environment
-> migrate/bootstrap
-> build/test
-> replace demo content
-> implement site-specific Page/Blocks and visual design
-> deploy
```

This run finishes the **generic CMS/starter platform**, not the ABRIT website design.

---

## 1. Inputs / existing evidence

Before changing code, read:

- `SEO_INFRASTRUCTURE_FINAL_REPORT.md`
- the current SEO execution state/report files
- the supplied Starter Readiness Snapshot
- `01_STARTER_V1_EXECUTION_CHECKLIST.md`
- `02_CONTEXT_COMPACTION_AND_RESUME_PROTOCOL.md`
- `03_STARTER_V1_EXECUTION_STATE.md`
- `04_GITHUB_RELEASE_AND_MAINTENANCE.md`
- `05_README_REQUIREMENTS.md`
- `06_LONG_TERM_RELIABILITY_STANDARD.md`

Do not repeat completed SEO audits unless a concrete implementation ambiguity requires targeted inspection.

Known initial facts:

- Starter readiness was estimated at ~40%.
- SEO infrastructure is implemented/tested in the source but the source tree was reported dirty/uncommitted.
- ABRIT branding/content/integrations/deployment assumptions remain.
- Generic fresh-clone/bootstrap is not proven.
- Current seed is ABRIT-specific.
- Generic Page/Block foundation exists but legacy/static ABRIT paths remain.
- Two SEO migrations must be preserved/reviewed.
- The destination GitHub repository is a separate public repository expected to be empty.

---

## 2. Execution mode

This is an execution task, not a planning-only task.

Do not stop after analysis, one phase, one report, one commit, or one local build.

Use:

```text
INSPECT TARGETEDLY
-> IMPLEMENT
-> TEST
-> FIX
-> RETEST
-> RECORD STATE
-> COMPACT WHEN NEEDED
-> CONTINUE
```

Do not ask for approval between phases.

A normal technical failure is not a blocker. Diagnose, fix, retest, continue.

Only mark an item `BLOCKED` when a genuinely external dependency cannot be resolved safely from the environment. Continue every independent task.

---

## 3. Product boundary

Starter V1 is a **generic CMS platform**, not a generic visual theme and not an ABRIT clone.

Keep as reusable core when technically sound:

- Payload CMS
- Next.js integration
- PostgreSQL adapter/migrations
- localized Content/Page model
- generic Blocks
- Media
- Forms
- RBAC
- Audit logs
- Drafts/Versions
- Preview
- Scheduled publishing
- SEO resolver/infrastructure
- Redirects
- Sitemap/Robots
- Structured Data
- Cache/Revalidation
- tests
- Docker/deployment primitives

Remove, isolate, configure, or convert to disposable examples:

- ABRIT identity/domains/contact data
- ABRIT logos/assets
- managed-IT service/solution content
- ABRIT pricing/product assumptions
- IRT/Toman assumptions
- WHMCS mappings
- Chatwoot defaults
- ABRIT deployment paths/project names
- legacy Django/reconciliation tooling
- internal prompts/reports/worktree instructions
- static ABRIT homepage compatibility layers
- secrets/credentials/private hostnames or data

---

## 4. Visual scope

Do not build the final design for a future website.

A minimal generic frontend is allowed only to prove Page rendering, Blocks, localization, forms, navigation, SEO, accessibility fundamentals and responsive correctness.

Do not spend time on branding, visual polish, animation, or template-specific styling.

---

## 5. Git / repository strategy

The ABRIT source and public starter are different products.

Do **not** blindly push dirty ABRIT history to the public destination.

Use a dedicated source branch/worktree, recommended:

`feature/payload-starter-v1`

Before public publication:

1. finish genericization/tests in an isolated worktree/branch;
2. remove private/ABRIT-only material from the publishable tree;
3. run secret/private-file scans;
4. run fresh-clone validation;
5. prepare a clean Git history for the public starter where appropriate;
6. set destination remote explicitly to `https://github.com/mahdihz05/payload-CMS.git`;
7. never force-push unexpected remote work;
8. verify destination state again immediately before first push.

Do not move/rewrite historical ABRIT tags.

Public starter release lineage begins independently at `v1.0.0`.

---

## 6. Version target

Initially retain the already proven framework/toolchain versions unless a required security or compatibility fix requires change.

Do not perform opportunistic major framework upgrades during productization.

Document exact runtime/toolchain requirements.

---

## 7. Generic configuration contract

Site identity must come from configuration, globals, environment, or bootstrap—not hard-coded company constants.

At minimum centralize/configure:

- site name
- site URL
- site description
- organization identity
- logo/media
- contact information
- default SEO values
- locales/default locale
- language/direction mapping
- optional integrations
- currency/commercial behavior if retained

No unsafe production fallback domain or secret is allowed.

Production should fail clearly when required security-sensitive config is absent.

---

## 8. Localization

Preserve the proven multilingual architecture while making its policy centralized and documented.

Requirements:

- centralized supported locales;
- centralized default locale;
- centralized language-code/direction rules;
- documented add/remove locale process;
- SEO/hreflang uses actual configured published availability;
- fonts are not inseparably coupled to business identity.

The starter may ship with `fa`, `en`, `ar-ae` as examples/defaults if that is the safest first V1, but the policy must be intentionally configurable.

---

## 9. Content / Page / Block contract

Starter V1 defaults to CMS-rendered generic pages.

Requirements:

- Home is a CMS Page/content document.
- Generic public Page renderer consumes Blocks.
- Generic Blocks remain reusable.
- Legacy imported blocks are isolated/deprecated where appropriate.
- Blocks do not duplicate document-level SEO ownership.
- URL identity stays centralized.
- Navigation comes from CMS/global configuration.
- Demo content is disposable.
- No hard-coded numeric DB IDs.

Do not create a parallel Page collection unless evidence proves the existing `content` collection cannot be safely evolved.

---

## 10. SEO requirement

The completed SEO infrastructure is a core Starter V1 feature.

Preserve/regression-test:

- central resolver
- URL normalization/uniqueness
- canonical
- robots/indexability
- Open Graph/Twitter
- hreflang/x-default
- redirect lifecycle
- sitemap/robots.txt
- validated structured data
- draft preview policy
- SEO permissions
- cache/revalidation
- scheduled publishing integration

Before V1, complete only P0 editor-facing readiness:

- generic labels/help text;
- practical validation warnings;
- canonical/robots consequences explained;
- redirect management guidance;
- SEO role onboarding/documentation.

SERP/social preview is optional V1 if it threatens stability/scope.

Do not build SEO scoring, AI SEO, or GSC automation.

---

## 11. Bootstrap / seed contract

Replace ABRIT-specific bootstrap with a generic idempotent bootstrap.

Minimum bootstrap:

- administrator when credentials are securely supplied;
- generic Site Settings;
- minimal Navigation;
- generic localized Home;
- required globals.

Optionally separate:

- `bootstrap` = required minimum data;
- `seed:demo` = disposable example pages/forms/blocks.

Do not create ABRIT identity, production credentials, WHMCS IDs, managed-IT catalog or real customer data.

Rerunning bootstrap must be safe or explicitly detect already initialized state.

---

## 12. Environment contract

Create complete safe environment templates/documentation.

At minimum:

- `.env.example`
- production environment documentation/template without secrets

Classify each variable as required/optional/secret/local-only/CI-only/production-only/integration-specific.

No actual secret values may be committed.

Legacy migration variables must be removed from normal starter runtime or clearly isolated.

---

## 13. Public repository security hygiene

Before public push:

- scan tracked/untracked publishable content for secrets;
- verify `.env*` ignore rules;
- exclude DB dumps/private media/runtime artifacts;
- remove internal reports/prompts not useful to starter users;
- remove local absolute paths/private IPs/hostnames/tokens;
- verify preview/auth/revalidation endpoint access controls;
- run dependency/security checks available in toolchain.

Add where practical:

- Dependabot;
- CodeQL/static analysis.

Do not automatically merge dependency updates.

Do not invent a software license. If no owner-approved license exists, publish without adding one and record the legal decision as pending.

---

## 14. CI contract

Committed GitHub Actions must prove Starter V1 in a clean environment where technically practical:

1. lockfile install;
2. PostgreSQL service;
3. migrations from empty DB;
4. generic bootstrap;
5. lint;
6. typecheck;
7. unit tests;
8. integration tests;
9. production build;
10. SEO production-mode E2E;
11. forms integration;
12. sitemap status crawl;
13. Docker build/smoke;
14. no ABRIT seed dependency.

CI must not require production secrets; generate disposable CI-only secrets.

---

## 15. Docker / runtime contract

Provide a generic reproducible deployment baseline:

- web service/image;
- PostgreSQL;
- scheduler/jobs;
- persistent media strategy;
- health/readiness behavior;
- documented migration/bootstrap strategy;
- generic service/project naming;
- no ABRIT paths/hostnames;
- no secrets baked into images;
- deterministic install.

---

## 16. Backup / restore

Long-term reliability requires recovery.

Document/provide safe procedures for:

- PostgreSQL backup/restore;
- public/private media backup/restore or synchronization;
- secret/config recovery guidance without storing secrets in repo.

Where feasible, perform a disposable DB restore test.

Do not claim backups are proven without evidence.

---

## 17. Upgrade / maintenance policy

Implement/document:

- Node version policy;
- package manager/lockfile policy;
- Payload/Next major upgrade policy;
- Dependabot/update workflow;
- migration-first upgrade procedure;
- release/versioning policy;
- deprecation policy;
- security patch procedure.

Long-term reliability means controlled upgrades and recovery, not frozen dependencies forever.

---

## 18. Documentation

Generate a public root `README.md` following `05_README_REQUIREMENTS.md` and actual tested behavior.

Add concise docs as needed:

- `docs/ARCHITECTURE.md`
- `docs/SEO.md`
- `docs/LOCALIZATION.md`
- `docs/DEPLOYMENT.md`
- `docs/BACKUP_RESTORE.md`
- `docs/UPGRADING.md`
- `docs/CREATING_A_SITE.md`
- `docs/SECURITY.md`

Do not publish internal execution/audit noise as product docs.

---

## 19. Fresh-clone acceptance

This is a hard V1 gate.

From a completely new temporary directory with no inherited DB/media/node_modules/env:

```text
clean repository
-> install exact dependencies
-> create env
-> start empty PostgreSQL
-> migrate
-> bootstrap
-> test
-> production build
-> start app
-> health/smoke
-> generic Home
-> admin behavior
-> sitemap/robots
-> verify no ABRIT runtime identity
```

If it fails, fix and repeat from a clean state.

---

## 20. Publication

Only after all publication gates pass:

1. prepare clean public Git repository;
2. re-check destination repo state;
3. set `origin` to `https://github.com/mahdihz05/payload-CMS.git`;
4. use `main`;
5. create logical initial commit(s);
6. push `main`;
7. verify GitHub Actions;
8. fix CI failures if any;
9. create annotated tag `v1.0.0`;
10. push tag;
11. create GitHub Release if auth/tooling permits;
12. configure description/topics/template setting if permissions allow.

Never force-push.

If GitHub authentication is unavailable, complete everything else and mark publication alone `BLOCKED`, recording exact commands required.

Recommended repository description:

`Production-ready Payload CMS + Next.js starter with PostgreSQL, localization, SEO, redirects, RBAC, forms, previews, scheduled publishing, Docker, and automated tests.`

Recommended topics:

`payloadcms`, `nextjs`, `typescript`, `postgresql`, `cms`, `headless-cms`, `seo`, `starter-template`, `docker`

---

## 21. Context / long-run execution

Follow `02_CONTEXT_COMPACTION_AND_RESUME_PROTOCOL.md`.

Before every compaction update `03_STARTER_V1_EXECUTION_STATE.md`.

After compaction resume the next unchecked item immediately. Do not re-audit completed phases.

---

## 22. Completion marker

Only when all executable P0 checklist items and final release gates are satisfied, create:

`.payload-starter-v1-complete`

Also create:

`STARTER_V1_FINAL_REPORT.md`

Do not create the marker early.

---

## 23. Final stop condition

Stop only after the authoritative checklist reaches a valid final state.

Do not begin a future site's visual design.

Final report must include:

| Area | Result | Evidence | Remaining Risk | Status |
|---|---|---|---|---|

And report:

- public repository URL
- commit SHA
- release tag
- CI status
- fresh-clone result
- migrations
- bootstrap command
- local start command
- production baseline command
- owner-level pending actions

# 25. Live Progress Tracking

The user must be able to inspect objective progress at any time.

- Authoritative checklist: `01_STARTER_V1_EXECUTION_CHECKLIST.md`
- Live dashboard: `09_PROJECT_PROGRESS.md`
- Progress calculator: `10_update_progress.mjs`

Rules:

1. Mark a currently executing checklist item `[~]` when practical.
2. Mark `[x]` only after implementation and required tests/evidence pass.
3. Use `[!]` only for a genuine external blocker with evidence.
4. After meaningful checklist changes run:
   `node 10_update_progress.mjs`
5. At the end of EVERY phase, mandatory sequence:
   - finalize phase checkboxes;
   - update `03_STARTER_V1_EXECUTION_STATE.md`;
   - run `node 10_update_progress.mjs`;
   - inspect `09_PROJECT_PROGRESS.md`;
   - compact context using `02_CONTEXT_COMPACTION_AND_RESUME_PROTOCOL.md`;
   - immediately continue to the next incomplete phase.
6. Never manually invent or inflate the percentage.
7. Blocked items do not count as completed.
8. `.payload-starter-v1-complete` may only be created at 100.0% with successful GitHub publication and final published-repository verification.
