---
doc_id: ABRIT-LEGACY-URL-DISCOVERY
doc_type: technical-report
title: Legacy URL Discovery
status: verified
owner: Unassigned
audience: [seo, engineering]
confidentiality: internal
source_of_truth: public-web-and-repository
last_verified: '2026-09-12'
baseline: f17b7d5
related: [ABRIT-URLMAP, ABRIT-SEO-GAPS]
---

# Legacy URL Discovery (read-only)

## Method and scope

Read-only sources checked on 2026-09-12: live `robots.txt`, live sitemap and `/fa` HTML links; Internet Archive CDX URL listings; public search queries; repository history and route-string grep; archived project files. No production request modified data. The hypothesized English paths `/products-and-services/*` and `/company/*` had zero CDX captures. `/support/*` timed out and `/solutions/*` returned CDX 503, therefore those two absences are inconclusive.

## Evidence-backed legacy pages

| Legacy URL | Source | Current availability | Type | Target | Mapping confidence | Redirect state |
|---|---|---|---|---|---|---|
| `/تماس-با-ما/` | CDX capture `20250613174244` | not probed live | Contact | `/fa/contact` | HIGH | Ready after non-localized redirect support |
| `/درباره-ما/` | CDX collapsed URL list | not probed live | About | `/fa/about` | MEDIUM | Needs owner approval |
| `/بلاگ/` | CDX collapsed URL list | not probed live | Blog index | UNKNOWN (`news` vs `knowledge`) | MEDIUM (existence) | Not importable |
| `/استخدام/` | CDX collapsed URL list | not probed live | Careers | UNKNOWN (no current equivalent) | MEDIUM (existence) | Not importable |
| `/خدمت-ابری/` | CDX collapsed URL list | not probed live | Cloud service | UNKNOWN | MEDIUM (existence) | Not importable |
| `/نرم-افزاری-و-سخت-افزاری/` | CDX collapsed URL list | not probed live | Product/service | UNKNOWN | MEDIUM (existence) | Not importable |
| `/همکاری-در-فروش/` | CDX collapsed URL list | not probed live | Partnership | UNKNOWN (no current equivalent) | MEDIUM (existence) | Not importable |
| `/?p=15,17,19,21,23,583` | CDX collapsed URL list | not probed live | WordPress posts | UNKNOWN | LOW (mapping) | Needs WordPress export |
| `/feed/`, `/comments/feed/`, `/atom.xml` | CDX collapsed URL list | not probed live | WordPress feeds | None | MEDIUM | Do not redirect as pages |
| `www.abrit.ir/` | CDX (first capture 2024-07-29) | not probed live | host variant root | `/fa` | HIGH | Host-level canonical redirect, not Payload row |

## Implementation constraint (P1)

`src/proxy.ts` calls `findPublicRedirect()` only after its first path segment passes `isLocale()`. `seo-redirects` also requires `sourceLocale`. Therefore the current redirect system cannot serve non-localized Persian WordPress paths such as `/تماس-با-ما/`, even though the target mapping is HIGH. Do not import the row into the current collection until a reviewed non-localized redirect boundary exists; importing it now would not execute.

`REDIRECT-IMPORT-READY.csv` is a review dataset, not executable production input. Current live localized routes and target availability were verified: `/fa/contact`, `/fa/about`, `/fa/services/managed-it`, `/fa/solutions/it-outsourcing` return rendered content; live sitemap has 90 localized URLs and no non-localized entries.
