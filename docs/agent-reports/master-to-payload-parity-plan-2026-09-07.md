# Master-to-Payload Visual and Functional Parity Plan

Status: planning and review only. This artifact does not authorize implementation,
migration, commit, push, or deployment.

## 1. Objective

Bring the Payload-backed application on `opencode-dev` to visual and functional
parity with the current `abrit.ir` public site and the latest `master` source,
while preserving the newer Payload architecture and correcting rather than copying
known regressions.

Authoritative references:

- Reference source: `C:\projects\abrit.ir`, `master`, commit `c0837d2`.
- Previous shared baseline: `819c157`.
- Payload target: `C:\projects\abrit-opencode`, `opencode-dev`, commit `a3f7fa0`.
- Rendered reference: `https://abrit.ir` in `fa`, `en`, and `ar-ae`.
- Payload comparison deployment: `https://hnet.ir`.

The latest master range contains one commit, `c0837d2`, changing 22 files with
867 insertions and 229 deletions. Its main surfaces are typography, full-bleed
layout, header behavior, homepage cards and pricing, localized currency,
product configuration, independent-service details, and production URL fixes.

## 2. Porting Rule

Do not merge, cherry-pick, or copy the complete master commit. The branches have
diverged architecturally: master uses Django plus static TypeScript and a parsed
homepage HTML runtime, while `opencode-dev` uses Payload, PostgreSQL, direct Local
API reads, drafts, preview, CMS forms, and CMS-owned package/content records.

For each parity change:

1. Preserve Payload as the source of truth where it already owns data.
2. Port visual intent and interaction behavior, not obsolete data access code.
3. Retain accessibility and responsive protections that are stronger on
   `opencode-dev`.
4. Do not import a known master regression merely to obtain screenshot parity.
5. Keep `master` unchanged and place all implementation commits on
   `opencode-dev` only.

## 3. Protected Baseline

The target worktree currently reports modifications to:

- `frontend/src/app/[locale]/layout.tsx`
- `frontend/src/app/(payload)/admin/importMap.js`

An ignore-end-of-line diff shows no semantic changes, so these appear to be line
ending state. They must not be overwritten, normalized, staged, or committed as
part of parity work. `importMap.js` remains generated infrastructure. Because the
current Chatwoot mount is in the protected layout, Chatwoot restructuring is not
part of this parity implementation. Its current presence and non-overlap are
regression-tested; localization/proxy hardening requires a separately approved
layout change after the owner resolves the line-ending state.

Other untracked agent/config/report files are unrelated and remain excluded.

## 4. Required Product Decisions

These decisions are frozen for implementation unless the owner changes them:

- The two five-tier catalogs represent different commercial surfaces and are not
  joined by key or order. `packages` owns Homepage and `/pricing` managed-IT tiers
  (`essential`, `standard`, `professional`, `business`, `enterprise`). The
  `product-catalog` global independently owns `/products` tiers (`basic`,
  `standard`, `advanced`, `professional`, `premium`), including product-page
  prices, capacity, presentation, and its five WHMCS mappings. The repeated keys
  `standard` and `professional` do not imply product identity.
- `/products` has an explicit URL-backed contract: `package`, `term`, and `users`.
  Terms are `monthly`, `quarterly`, and `semiannual`; invalid values normalize to
  the selected package's monthly minimum. The configurator updates the URL without
  navigation, uses the selected term for totals and direct checkout, and includes
  the same values in a consultation submission.
- Existing Payload WHMCS product IDs, billing cycle, and configurable option
  mappings remain authoritative; master's category-only checkout URLs are not
  ported because they discard selected options.
- Currency display matches master: toman for Persian, USD for English, and AED
  for Arabic. Conversion logic is centralized and never duplicated in renderers.
- A new versioned `pricing-settings` Payload global owns USD/AED toman rates,
  effective date, rounding mode, and localized indicative-price disclosure. Its
  initial values match `c0837d2`; renderers do not imply a live exchange quote.
- Price semantics are explicit by surface. Homepage 1/3/6-month marketing totals
  are `baseMonthlyToman * months * (1 - 0/3/5 percent)` and exclude onboarding and
  add-ons. `/pricing` keeps 3/6/12-month service estimates derived from canonical
  `baseMonthlyToman`, `discountBps`, and add-on rates; it does not trust historical
  `termPrices.totalToman`, whose old migration and seed semantics differ. Onboarding
  is shown separately and the existing `calculatePackage` contract calculation
  remains the final local estimate. `/products` keeps its own catalog's 1/3/6-month
  configured totals and extra-user rates. Every surface labels its source and total
  semantics; only currency conversion settings are shared across both catalogs.
- The current Payload alternate-locale URL behavior remains; master's segment-only
  locale replacement is not ported because translated slugs can differ.
- The existing Payload dynamic forms and same-origin submission API remain.
- The legacy homepage HTML is not expanded as a long-term content model. Changes
  may adapt it for parity, but new business data comes from Payload.

## 5. Work Packages

### P0 - Evidence baseline

Goal: establish deterministic before/after evidence.

Actions:

- Capture full-page and section screenshots for `abrit.ir` and `hnet.ir` at
  1440x1000, 768x1024, 390x844, and 320x800.
- Cover `/fa`, `/en`, `/ar-ae`, services, solutions, products, pricing, contact,
  search, and representative managed/independent detail pages.
- Record computed dimensions for header, containers, hero, cards, footer, sticky
  elements, and document overflow.
- Record interaction baselines for desktop mega menus, mobile navigation,
  homepage rails, pricing periods, product capacity, comparison tables, forms,
  Chatwoot, reduced motion, and keyboard focus.
- Separate reference-site defects from target parity gaps.
- Treat commit `c0837d2` as the immutable source authority. Timestamped live
  screenshots are supplemental evidence, not a moving source of truth.
- Capture against a fixed seeded test database and record its seed commit. Wait
  for `document.fonts.ready`, decoded images, network idle, and explicit homepage
  content readiness; disable motion and mask Chatwoot, timestamps, and caret.
- Maintain an approved-difference ledger. Measured geometry must be within 2 CSS
  pixels and section screenshot mismatch below 0.5 percent after approved masks.

Acceptance:

- Every later visual change has a named reference screenshot and route/viewport.
- Browser console and failed network requests are recorded for both sites.
- Harness version, fixture identity, masks, tolerance, and approved differences
  are recorded with the evidence.

### P1 - Global shell and assets

Goal: match global geometry and navigation without regressing CMS navigation.

Implementation boundary:

- `frontend/src/app/globals.css`
- `frontend/src/components/site-header.tsx`
- `frontend/src/components/site-footer.tsx` only if markup is required
- `frontend/src/lib/locales.ts`
- `frontend/src/lib/reference-homepage.ts`
- `frontend/public/media/homepage/*`

Changes:

- Port master page/section/panel typography tokens and RTL heading normalization.
- Port full-bleed internal surfaces and footer with constrained inner containers.
- Retain and regression-test the current controlled mega-menu state, one-open-menu
  behavior, Escape close, focus restoration, and expanded/control relationships;
  port only measured visual/interaction deltas from master.
- Preserve current URL-based menu role detection, Payload top-level navigation,
  mobile overflow containment, and CMS alternate locale links.
- Replace platform-dependent flag emoji with stable `FA`, `EN`, and `AR` labels,
  retaining localized accessible names.
- Copy and use the six local homepage images from master.
- Retain the current Chatwoot mount unchanged and verify that its bubble does not
  obscure navigation or form controls.

Acceptance:

- Header and footer match reference geometry at all four widths.
- All desktop menus support pointer and keyboard use with no stuck menu.
- Mobile navigation remains scroll-contained and exposes all required routes.
- Locale changes preserve the translated destination route where available.
- No external homepage image dependency remains for the six mapped assets.

### P1.5 - Non-destructive schema and backfill

Goal: establish data contracts before any pricing or detail UI consumes them.

Implementation boundary:

- New `pricing-settings` global, registration, generated types, and additive migration
- Optional structured independent-service accent fields and additive migration
- `frontend/src/scripts/seed-payload.ts`
- Focused new reconciliation/backfill code only

Rules:

- Add pricing settings with safe initial values matching `c0837d2`.
- Backfill only missing new values, including the canonical Backup accent if the
  structured fields are introduced.
- Existing package, catalog, navigation, form, settings, and content editor values
  are never overwritten by parity backfill.
- Product Catalog backfill parses and validates the JSON before any write. It is an
  atomic whole-global operation: an existing catalog must contain exactly the five
  known unique keys. Missing records may be created only when the catalog is empty;
  a partial, duplicate, or extra-key catalog aborts with a conflict report and no
  write. Existing known records preserve every editor-owned value, especially
  product IDs, option IDs, and prices; parity adds no Product Catalog values.
- Default seed behavior creates missing canonical records and preserves existing
  records. An explicit development-only `--force` mode may retain deterministic
  reset behavior and must refuse production environments.
- Preflight reports data conflicts and aborts without partial writes.

Acceptance:

- Clean and upgraded disposable databases converge to the required schema/defaults.
- Re-running default seed/backfill after editor changes produces no content writes.
- Forced development seed is guarded and independently tested.
- Empty, valid, partial, duplicate, and extra-key Product Catalog fixtures prove
  atomic create/preserve/abort behavior and preserve WHMCS mappings byte-for-byte.

### P2 - Homepage parity

Goal: match the current homepage presentation and interactions while sourcing
packages, services, solutions, and forms from Payload.

Implementation boundary:

- `abrit-homepage-polished-v5.html`
- `frontend/src/components/reference-homepage.tsx`
- `frontend/src/components/reference-homepage.module.css`
- `frontend/src/components/homepage-runtime.tsx`
- A focused client component for accessible homepage package selection if needed
- `frontend/src/lib/homepage-assets.ts`
- `frontend/src/app/[locale]/page.tsx`
- `frontend/src/lib/payload-cms.ts`

Changes:

- Port dark outcome rail, operational-card overlap fix, use-case tag flow, refined
  section heading scale, updated network copy, and coverage labels.
- Restore reference service-rail presentation and controls using CMS service cards.
  It must tolerate counts other than ten and must pause for focus/hover/manual
  control and reduced-motion preferences.
- Fetch canonical packages and pricing settings in the homepage server route and
  pass a minimal serialized pricing view into `ReferenceHomepage`.
- Mark the legacy package region as React-owned, replace it with a focused client
  renderer, and disable the legacy `renderPackages` mutation path for that region.
- Rebuild homepage pricing from canonical Payload packages, not static HTML prices.
- Add one/three/six-month controls, 0/3/5 percent period adjustments, localized
  number formatting, one selected card, and FA/EN/AR currency display.
- Implement period and package controls as semantic buttons/radios with localized
  accessible names and state.
- Preserve selected package and period in the assessment form through hidden
  structured context or the destination URL.
- Prevent period changes from replaying unnecessary reveal animation.
- Preserve current Payload hero slides, services, solutions, lead-form mount,
  pointer aura, and network-pattern components.
- If package data is empty or invalid, render a localized consultation CTA with no
  fabricated totals. A single invalid package disables checkout without crashing
  the rest of the homepage.
- Move homepage metadata to the same server-data boundary: published Payload SEO
  wins, then localized static defaults. Drafts never affect public metadata.

Acceptance:

- Section order, colors, spacing, cards, and responsive stacking match reference.
- Pricing totals derive from canonical Payload package and pricing settings data.
- The legacy runtime cannot replace or duplicate the React-owned package region.
- Empty/invalid package data produces the documented localized fallback.
- Controls work with keyboard, touch, pointer, and screen-reader semantics.
- `prefers-reduced-motion` disables rails and repeating/reveal motion.
- No operational card icon or use-case tag overlaps translated copy.

### P3 - Pricing and product configurators

Goal: match latest card/table surfaces and localized prices while retaining the
more complete Payload configurator and checkout contract.

Implementation boundary:

- `frontend/src/lib/pricing-currency.ts` (new centralized module)
- `frontend/src/payload/globals/PricingSettings.ts` (new)
- `frontend/src/payload/globals/ProductCatalog.ts`
- `frontend/src/payload/collections/Pricing.ts`
- `frontend/src/payload.config.ts`
- `frontend/src/components/block-renderer.tsx`
- `frontend/src/components/pricing-overview.tsx`
- `frontend/src/components/pricing-configurator.tsx`
- `frontend/src/components/product-configurator.tsx`
- `frontend/src/components/product-configurator.module.css`
- `frontend/src/app/[locale]/products/page.tsx`
- `frontend/src/app/[locale]/pricing/page.tsx`
- `frontend/src/app/[locale]/[slug]/page.tsx`
- `frontend/src/lib/payload-cms.ts`
- Focused tests for currency and checkout URL preservation
- Generated Payload types and one additive migration

Changes:

- Centralize localized currency conversion, labels, effective date, rounding, and
  disclosure through the versioned `pricing-settings` global.
- Keep both catalog schemas independent. Add strict runtime validation for each
  catalog's own five keys and reject duplicate/missing/extra keys within that
  catalog without cross-catalog joins.
- Derive managed 3/6/12-month service totals from base price, term discount, and
  add-on rates rather than historical `termPrices.totalToman`; expose onboarding
  as a separate line and use `calculatePackage` for the final local contract total.
- Fetch pricing settings in homepage, pricing, and generic CMS routes and pass only
  the required serialized values to client components.
- Add accessible product-term controls with URL-backed `package`, `term`, and
  `users` state. All term changes update price, summary, mobile bar, checkout URL,
  and consultation context; invalid query values normalize without rendering a
  broken product page.
- Apply it to CMS pricing blocks, pricing overview, managed configurator, product
  cards, summaries, mobile bars, and extra-user prices.
- Port pale full-width plan surface, selected-card stripe/gradient, shorter cards,
  concise capacity wording, and dark comparison surface with sticky logical first
  column, zebra rows, selected column, and responsive horizontal scrolling.
- Add the products consultation form beneath the product experience using the
  existing Payload submission route and `products-consultation` context.
- Pass selected package, period, and capacity into consultation context.
- Keep current direct WHMCS parameter mapping for all five Product Catalog tiers.
  Managed Pricing retains its current contact fallback when a package has no WHMCS
  product ID. Add contract tests proving configured product package, cycle, and
  capacity are not discarded.
- Ensure the fixed mobile summary cannot obscure the consultation form, Chatwoot,
  status announcements, or footer.
- Avoid array-position-dependent replacement of feature copy; use an explicit
  rendered row for extra-user pricing.

Acceptance:

- Managed Homepage/Pricing values agree with the `packages` collection; Product
  values agree with `product-catalog`; formulas have unit tests and correct labels.
- Both catalogs are tested independently for missing, duplicate, and extra keys.
- All five Product Catalog checkout mappings retain package/cycle/capacity params;
  null managed checkout mappings render consultation links rather than bad URLs.
- Every Product Catalog package is verified at monthly/quarterly/semiannual terms
  and minimum/maximum capacity, including direct URL initialization and checkout
  parameter preservation.
- Clean-seed and upgraded-database fixtures produce equivalent calculated managed
  totals even when stored historical `totalToman` values differ.
- Product selection, capacity changes, quick tabs, comparison expansion, sticky
  summaries, and consultation submission work in all locales.
- No horizontal document overflow at 320 or 390 pixels.

### P4 - Independent services and content details

Goal: port the latest detail-page refinements without weakening Payload ownership.

Implementation boundary:

- `frontend/src/payload/collections/Content.ts` only if structured accent fields
  are needed
- `frontend/src/lib/independent-services-cms.ts`
- `frontend/src/components/independent-services.tsx`
- `frontend/src/components/independent-services.module.css`
- Reconciliation/seed and migration only if schema changes are necessary

Changes:

- Add the localized Backup hero accent with a structured before/accent/after model
  or equivalent rich text; do not depend on fragile substring position.
- Port the four-item context grid and upgraded context-card surface.
- Port restrained listing-card title scale and mobile comparison-table gutters.
- Verify all four independent services with long Persian and Arabic copy.

Acceptance:

- Backup accent is editable and localized through Payload.
- Four-card content renders 4/2/1 columns at desktop/tablet/mobile.
- Missing optional accent data degrades to an unbroken normal title.
- Existing strict CMS adapter does not turn valid older records into 404 pages.

### P5 - Parity defect corrections

Goal: do not ship defects observed on the reference site.

Implementation boundary:

- `frontend/src/components/lead-form.tsx`
- `frontend/src/components/cms-form.tsx`
- Existing form CSS modules only where a regression is demonstrated
- `frontend/src/app/api/forms/[formKey]/submissions/route.ts`
- Focused unit/API/browser tests for JSON, FormData, redirect, and no-JS behavior

Required corrections:

- Retain and regression-test the existing hidden honeypot CSS; do not reproduce
  the reference deployment's visible honeypot defect.
- Give `LeadForm` and `CmsForm` explicit POST actions. Extend the existing dynamic
  submission route to accept JSON and URL-encoded/FormData payloads without files.
  No-JavaScript success uses a validated same-origin 303 redirect to a relative
  source path with a non-sensitive status marker. Validation failure returns safe
  HTML and never redirects to an arbitrary origin.
- Homepage FAQ uses real disclosure state and `aria-expanded`, or is presented as
  intentionally always-open content without misleading plus controls.
- Hero slide controls have localized accessible labels.
- Homepage service links target actual CMS detail pages where a detail exists.
- Mobile navigation exposes useful nested destinations rather than forcing only a
  top-level jump.
- Chatwoot bubble does not cover form controls. Label/loader work is deferred while
  its only mount file is protected.
- Locale prefetch does not request nonexistent alternate translated paths.

Acceptance:

- Axe/browser accessibility checks have no serious or critical issues on sampled
  routes.
- Keyboard-only journeys cover navigation, pricing, products, FAQ, and forms.
- JavaScript-disabled form rendering does not submit personal data through GET.

## 6. Known Master Changes That Must Not Be Ported Literally

- Category-only checkout URLs that drop billing cycle and capacity.
- The suspicious `professionall` slug without an explicit external contract test.
- Static duplicate package datasets with conflicting prices/capacities.
- Static exchange rates spread across UI components.
- Pointer-only clickable pricing `<article>` elements.
- Persian-only ARIA labels in English and Arabic views.
- Re-observing/reanimating pricing cards after every period selection.
- Index-based header role detection.
- Segment-only language switching that ignores translated slugs.
- The monolithic HTML extractor as the owner of new CMS business data.
- Direct Django API/client/backend code.
- Destructive seed/reconciliation updates to editor-owned production content.

## 7. Explicit Non-Goals

- Merging or restoring the Django backend into `opencode-dev`.
- Replacing Payload collections with master static arrays.
- Full normalization of Product Catalog JSON in this parity pass.
- Localized-path database uniqueness, managed-service detail migration, public file
  uploads, email notifications, or `/ar` compatibility redirects.
- Chatwoot loader/proxy/layout restructuring while locale layout is protected.

## 8. Verification Matrix

Automated checks:

```text
cd frontend
npm run lint
npm run typecheck
npm run test
npm run build
```

Migration checks must use a disposable PostgreSQL database and run the complete
migration chain before canonical seed/reconciliation. Production data and the
active `hnet.ir` database are never used for destructive verification.

Rendered routes in all three locales:

- Home
- Services list and one managed detail
- Solutions list and one solution detail
- Products
- Pricing
- Contact
- Search with a result
- Independent services list and Backup detail
- Admin login and one authenticated content edit/preview workflow

Viewport matrix:

- 1440x1000 desktop
- 1024x768 compact desktop/tablet landscape
- 768x1024 tablet portrait
- 390x844 common mobile
- 320x800 narrow mobile

Interaction matrix:

- Pointer, keyboard, and touch navigation
- LTR and RTL
- Default and reduced motion
- One/three/six-month prices
- Managed Pricing 3/6/12-month service estimate, add-ons, separate onboarding,
  final local contract estimate, and missing-WHMCS consultation fallback
- All product packages and min/max supported capacities
- Successful, invalid, throttled, and server-error form states
- Sticky and floating element collision checks
- Normal and authenticated draft-preview rendering

## 9. Execution and Review Order

1. Complete P0 evidence before code changes.
2. Implement P1 and verify shell regressions.
3. Complete P1.5 schema, migration, data-contract, and non-destructive seed gates.
4. Implement P2 only after P1.5 establishes package/pricing settings contracts.
5. Implement P3 against the same package join and currency contract as P2.
6. Implement P4 after any P1.5 accent schema/backfill is available.
7. Apply P5 continuously, with a final dedicated accessibility pass.
8. Run full checks, browser parity suite, and an independent code review.
9. Run the no-mistakes gate if its trusted-branch configuration supports this
   repository; record the tooling blocker otherwise.
10. Commit and push only after review. Do not merge into `master` and do not deploy
    until explicit human approval of the verified result.

## 10. Exit Criteria

- Latest intended `c0837d2` appearance is represented on the Payload site.
- Current Payload-only capabilities remain operational: Admin, drafts, preview,
  localized content, forms, search, package editing, migrations, and health checks.
- Known master checkout, accessibility, locale, and form regressions are absent.
- All tests/checks/build pass from a clean disposable runtime.
- Visual evidence covers every route and viewport in Section 8.
- No unrelated or line-ending-only worktree changes are staged.
- Implementation exists only on `opencode-dev` until explicit integration approval.
