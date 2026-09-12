---
doc_id: ABRIT-SCHEMA
doc_type: architecture
title: Schema Matrix
status: verified
owner: TBD-owner
audience: [seo, engineering]
confidentiality: internal
source_of_truth: repository
last_verified: '2026-09-12'
baseline: a129fb3
related: [ABRIT-SEO-AUDIT, ABRIT-SEO-SPEC]
---

# Schema Matrix — `VERIFIED` (`src/lib/schema.ts:9-67`, `content-structured-data.tsx:6-11`)

| Page type | Schema | Required props | Payload source | Generator | Validation |
|---|---|---|---|---|---|
| all | Organization `#organization` | name, url, logo | `site-settings` brandName/logo | `OrganizationJsonLd` | `schema.test.ts` PASS |
| all | WebSite `#website` | url, name | `site-settings` | `OrganizationJsonLd` | PASS |
| depth>1 | BreadcrumbList | itemList from route hierarchy | `content.parent/path` | `schemasForResolvedSeo` | PASS |
| service/independent-service | Service | name, description, provider | `content` | same (gated by `eligibleSchema`) | PASS |
| news/knowledge (`editorial`) | Article | headline, dates, author/publisher | `content` + timestamps | same (gated) | PASS |
| product/pricing | Product | name + offers | `content` | same (only with payload) | only where applicable |
| FAQ areas | FAQPage | acceptedAnswer per visible Q | visible `faq` block items | same (filtered) | PASS |

Serialization escapes `<` (`serializeJsonLd`). No arbitrary JSON/script accepted (contract rule).
