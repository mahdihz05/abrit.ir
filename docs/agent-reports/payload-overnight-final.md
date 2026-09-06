# Payload Local Rebuild Final Report

Date: 2026-09-06

DATABASE_REBUILD: PASS. Verified and reset only Compose project `abrit-opencode`, service `postgres`, database `abrit_payload`, host port `5433`, volume `abrit-opencode_abrit_payload_postgres`. Current PostgreSQL 17 container is healthy. Final counts: 1 user, 30 Content documents, 5 packages, 2 forms, exactly 5 independent-service/listing documents. The canonical `npm run seed` now runs base + all four feature reconciliations serially and was proven from a newly empty volume.

T04: PASS. Dedicated deterministic reconciliation creates and verifies 5 canonical documents / 15 explicit locale projections with `fallbackLocale: false`, complete typed listing/service structures, CTA data, FAQs, deliverables, managed scope, comparisons, technologies, and required ordered relationships.

T05: PASS. Independent-service routes now use strict typed Payload adapters. Runtime static-catalog fallback and default component catalogs were removed. Missing or malformed CMS content follows explicit `notFound()` behavior.

T06: PASS. `artifacts/browser/t06/report.json` records 30/30 passing cases across listing + 4 details, fa/en/ar-ae, desktop/mobile, RTL/LTR, FAQs, CTAs, forms, overflow, console and page errors.

HOMEPAGE_HERO: PASS. Two localized v5-copy Hero blocks are CMS-managed per locale. Highlight `<em>`, individual point spans, dots, click selection, visibility-aware 7-second rotation, reduced-motion pause, CTA target/rel behavior and visual effects are preserved. Base seed reruns preserve typed Hero layout.

HOMEPAGE_SERVICES: PASS. Ten ordered Payload relationships render as escaped server-side v5 card markup with code-owned SVG icons. The duplicate-prone portal and non-v5 vertical rail were removed.

HOMEPAGE_SOLUTIONS: PASS. Six ordered Payload relationships render at the correct `#nodes` topology seam. The prior incorrect `#opsBento` mount was removed. Mobile anchors retain v5 node dimensions.

CMS_EDITABILITY: Independent-service listing/details, service CTA content, homepage Hero slides, and homepage Services/Solutions ordering and related titles/excerpts are Payload-managed. Geometry, icons, topology and animation remain code-owned.

VISUAL_PARITY: PASS for the currently migrated Hero, Services and Solutions scope. `artifacts/browser/homepage/report.json` records 6/6 passing locale/viewport cases plus a passing reduced-motion assertion, with correct counts, ownership, Hero interaction, RTL, no overflow, and no application console/page errors. Live/reference section screenshots are under `artifacts/browser/homepage/`.

COMMITS: None. HEAD remains `44816f102120324fc65d39cb63f1c460be96211a`. No push or merge occurred. A commit was intentionally not created because the worktree contains retained pre-existing changes from prior runs.

FILES_CHANGED: Current implementation work spans `frontend/package.json`, independent-service routes/components/CSS, homepage route/runtime/reference components/CSS, strict CMS adapters/types, Payload Content schema/generated types, base seed, and four deterministic reconciliation scripts. Durable status/final reports were updated. Existing validator and inventory work remains preserved.

TEST_RESULTS: PASS. `npm run lint`, `npm run typecheck`, `npm run test` (13/13), `npm run build` (93 routes), the final post-review `npm run check`, and `git diff --check` all passed. All four feature reconciliation `--check` commands passed. A final empty-volume `npm run seed` completed all five serialized stages successfully.

BROWSER_RESULTS: PASS. Independent services 30/30; homepage 6/6 plus reduced-motion; final smoke `/fa`, `/en`, `/ar-ae`, `/admin` all HTTP 200 with no page errors. Evidence: `artifacts/browser/t06/report.json`, `artifacts/browser/homepage/report.json`, `artifacts/browser/final-smoke.json`.

REMAINING_HARDCODED_CONTENT: `frontend/src/lib/independent-services.ts` remains only as deterministic seed/parity input and is no longer imported by public independent-service runtime. Generic presentation copy for the independent consultation-form shell remains in `frontend/src/components/independent-consultation-form.tsx`; form records, service selection/context, service CTA content and submission endpoint are CMS-backed.

BLOCKED_ITEMS: T01 legacy migration parity remains blocked by the previously documented private source submission count mismatch; no private data was inspected or imported. No completed T04-T10 task is blocked.

HUMAN_DECISIONS_REQUIRED: Privacy/consent publication, pricing authority, final navigation authority, disputed localized titles, authentication/access policy, SEO/canonical policy, official migration review and deployment remain human-controlled and unchanged.

NEXT_RECOMMENDED_PHASE: Review screenshots and current diff, then generate and review an official Payload migration for the approved schema. After human acceptance, continue homepage CMS migration section-by-section (stats/process/network/use cases/assurance/FAQ/resources/CTA) with the same per-section parity gate. Move generic consultation-form presentation copy into a typed CMS contract when that section is scheduled.

SAFETY_CONFIRMATION: No production/staging access, push, merge, deployment, immutable-v5 edit, secret output/commit, auth-policy change, SEO-policy change, pricing change, navigation-authority change, destructive Git reset/clean, production migration, or legacy-repository mutation occurred.
