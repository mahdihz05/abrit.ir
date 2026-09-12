---
doc_id: ABRIT-PAGES
doc_type: current-state
title: Page and Route Inventory
status: verified
owner: Unassigned
audience: [engineering, seo]
confidentiality: internal
source_of_truth: repository
last_verified: '2026-09-12'
baseline: a129fb3
related: [ABRIT-CONTENT, ABRIT-MIGRATION-MAP, ABRIT-SEO-AUDIT]
---

# Page Inventory — `VERIFIED` (routes + seed + inventory + production sitemap 2026-09-12)

## Route patterns (`frontend/src/app`)

| Route | Locales | Renderer | SEO |
|---|---|---|---|
| `/{locale}` (home) | fa,en,ar-ae | `page.tsx` + blocks | `contentSeoMetadata` + structured data |
| `/{locale}/[...slug]` | fa,en,ar-ae | `[...slug]/page.tsx` + `BlockRenderer` | `contentSeoMetadata`, canonical/hreflang |
| `/{locale}/search` | fa,en,ar-ae | `search/page.tsx` | `systemRouteMetadata` noindex,follow |
| `/` | — | `(redirect)` → `/fa` | n/a (defaultLocale `en` vs root `/fa` — open product question, see OWNER-INPUT) |
| `/admin`, `/api/*` | — | Payload | disallowed in robots |
| 404/error | per locale | `not-found/error.tsx` | default metadata (polish = P2 gap) |

## Actual content keys (31/locale — seed + `docs/seo/SEO_MIGRATION_INVENTORY.json`, 93 records)

home, about, contact, services, solutions, independent-services, products, pricing, knowledge, news,
services/{managed-it, digital-workspace, network-security, identity-access, backup-recovery, monitoring, erp-automation, business-telephony, remote-management, it-automation} (10),
solutions/{integrated-it-management, it-outsourcing, security-continuity, branch-management, digital-workplace, process-automation} (6),
independent-services/{backup, cloud-storage, workspace, voice} (4).
Seed scripts create: `home`, `contact` (+`contact` form), `demo-about` (`seed-demo.ts`).

## Production sitemap (`https://abrit.ir/sitemap.xml`, read-only fetch) — 90 URLs
30 paths × fa/en/ar-ae, priorities home 1.0 / services/* 0.8 / rest 0.7, changefreq monthly.
Matches inventory taxonomy exactly; test key `1234` correctly EXCLUDED (resolver eligibility works in prod).
`robots.txt`: `Allow: /`, `Disallow: /api/ /admin/`, Host + Sitemap declared.
