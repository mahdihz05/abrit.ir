---
doc_id: ABRIT-OVERVIEW
doc_type: project-overview
title: Project Overview ABRIT Website
status: verified
owner: Unassigned
audience: [management, engineering]
confidentiality: internal
source_of_truth: repository
last_verified: '2026-09-12'
baseline: a129fb3
related: [ABRIT-README, ABRIT-STATUS, ABRIT-STATE]
---

# Project Overview — ABRIT Website (abrit.ir)

## Direction (verified against implementation 2026-09-12)
- Next.js 16.3.2 + Payload 3.88 + PostgreSQL 17, single Node process. `VERIFIED` — `frontend/package.json:45-47`, `payload.config.ts:37`, `deploy/compose.yaml`.
- Multilingual `fa` / `en` / `ar-ae`, RTL/LTR. `VERIFIED` — `site-config.ts:1-11`; live sitemap serves 31 keys × 3 locales.
- Envato Techor as visual reference; approved RTL v5 reference. `VERIFIED` — `techor-html-package/`, `abrit-homepage-polished-v5.html`.
- Content preserved/migrated. `VERIFIED` — 31-key taxonomy in seed + inventory + production sitemap; ar-ae copy QA pending (owner).
- SEO beyond basic Payload. `VERIFIED` — owned resolver/sitemap/robots/307-308 redirects/schema; official plugins evaluated and rejected (ADR-005).
- Production untouched (read-only robots/sitemap fetch only). `VERIFIED` — no deploy/migrate/seed run.

## Migration operating state
- **Current live site:** `abrit.ir` remains the temporary public site.
- **Cutover intent:** migrate to the new Envato-derived/Payload presentation by the end of Mehr (owner direction; exact Gregorian cutover date and authorization are external decisions).
- **Constraint:** no production content, redirects, DNS, or deployment action was taken by this documentation/verification work. The migration gate is `07-management/IMPLEMENTATION-ROADMAP.md` plus URL/translation/QA completion.

## Evidence roots
- App: `frontend/src/app/`, Payload: `frontend/src/payload.config.ts`, `frontend/src/payload/`, config: `frontend/src/lib/site-config.ts`, deploy: `deploy/`, template: `techor-html-package/`, generated inventory: `docs/seo/`.
