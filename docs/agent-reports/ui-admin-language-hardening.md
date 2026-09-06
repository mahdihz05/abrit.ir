# UI, Admin, and Language Hardening

Date: 2026-09-06

## Outcome

- Header navigation is visible and populated in `fa`, `en`, and `ar-ae` on desktop and mobile.
- Header contrast, bounded mobile navigation scrolling, visible locale choices, and mega-menu keyboard state were hardened.
- Public language switching preserves document identity when localized paths differ by using metadata alternate links.
- Payload Admin supports native Persian and English UI translations. Persian renders with `lang=fa` and `dir=RTL`; English renders with `lang=en` and `dir=LTR`.
- Content Preview/View URLs resolve the current localized path, with localized slug fallback for non-home documents. Home remains at the locale root.
- Every non-home Content document requires a non-empty localized path through collection validation.
- Generic Content pages emit document-aware canonical and locale alternate metadata.

## Root Causes

- Navigation seed updates recreated localized array rows independently. Payload localization associates array translations by row ID, so only the final `ar-ae` update retained visible values. The seed now preserves header, footer, child, and mobile row IDs across locale updates.
- The Preview callback treated an empty localized `path` as the locale root for every template. It now distinguishes home documents and falls back to localized `slug` for non-home documents.
- The old language control replaced only the first URL segment. It could not preserve identity when translated documents had different paths.
- The reported Admin mismatch was not reproducible in clean Chrome. Payload's expected layer declaration remained intact and no hydration warning occurred, which classifies the original symptom as consistent with browser-extension DOM mutation rather than application markup.

## Browser Evidence

- Header diagnostic: `artifacts/header-diagnostic/report.json`.
- Admin hydration diagnostic: `artifacts/admin-diagnostic/report.json`.
- Final localized workflow: `artifacts/hardening-e2e/report.json`.
- Admin screenshots: `artifacts/hardening-e2e/admin-en.png` and `artifacts/hardening-e2e/admin-fa.png`.
- Persian public test page returned HTTP 200 at `/fa/azmoon-sakhtsazi`, rendered RTL, and displayed the Persian heading.
- English public test page returned HTTP 200 at `/en/hardening-test-page`, rendered LTR, and displayed the English heading.
- Persian-to-English language switching reached `/en/hardening-test-page` rather than mechanically preserving the Persian slug.
- Authenticated Admin returned Preview/View targets `/fa/azmoon-sakhtsazi?draft=1` and `/en/hardening-test-page?draft=1` for the same document.
- An authenticated English localized update returned HTTP 200, changed English, and left Persian unchanged.
- No browser console or page errors were recorded.
- The temporary Content document was deleted; the final matching document count is zero.

## Quality Gate

- `npm run check`: PASS after the application changes.
- ESLint: PASS.
- Next.js route generation and TypeScript: PASS.
- Vitest: 4 files and 13 tests PASS.
- Next.js 16.3.2 production build: PASS, 93 static pages generated.
- `git diff --check`: PASS.

## Migration Readiness

- Existing baseline migration: `20260831_121030`.
- Added incremental schema migration: `20260906_115746_hardening_i18n_preview`.
- The incremental migration captures schema drift introduced after the baseline; Preview and Admin i18n changes themselves do not require SQL changes.
- Both migrations were applied successfully, in order, to an isolated temporary PostgreSQL database. `payload migrate:status` reported both as applied in batch 1.
- The temporary migration-check database was dropped immediately after validation. The local development database was not migrated or replaced.
- No test-server, staging, or production deployment was performed.

## Known Limitation

- Payload's native Admin chrome is translated into Persian where supported. Project-defined collection, global, group, and many field labels remain the existing English/Persian mix because they are custom schema labels rather than Payload translation strings. This does not affect locale selection, RTL direction, content isolation, Preview URLs, or public rendering.
- The local development database was previously created through Payload's development schema push and has no migration ledger entries. The validated migration chain is ready for a fresh database; an already populated target with the same ledger-less history must be backed up and reconciled/baselined before running `payload migrate`.
