---
doc_id: ABRIT-ADR-003
doc_type: adr
title: ADR-003 Generic localized Content model
status: accepted
owner: TBD-owner
audience: [engineering, seo]
confidentiality: internal
source_of_truth: repository
last_verified: '2026-09-12'
baseline: a129fb3
related: [ABRIT-PAYLOAD-MODEL, ABRIT-ARCH]
---

# ADR-003 — One generic localized `content` collection (EXISTING DECISION)

- **Status:** Accepted (implemented).
- **Context:** `localization {locales: en/fa/ar-ae, defaultLocale: en, fallback: false}` (`payload.config.ts:39-43`); `content.kind` ∈ page/service/solution/knowledge/news.
- **Problem:** Per-type collections duplicate slug/path/seo/workflow logic and complicate hreflang/sitemap.
- **Constraints:** Localized routing + single resolver + translation status per locale.
- **Decision:** One `content` collection with `kind` + `templateKey` + localized fields; `independent-service` as templateKey variant; `editorial` derived in resolver for knowledge/news.
- **Alternatives considered:** per-type collections (rejected — 5× schema drift, resolver branching); single-table with JSON blobs (rejected — loses Payload admin/validation).
- **Rationale:** One routing/SEO/versioning implementation; taxonomy via 31 verified keys; queries filter by `kind`+`isActive` index.
- **Consequences:** Admin relies on `kind` filters/defaultColumns; resolver maps kinds to schema types.
- **Risks:** Kind misuse (mitigate: `templateKey` + tests); H1 field still missing (contract Proposal).
- **Evidence:** `collections/Content.ts`, `lib/seo-contract.ts:76-80`, inventory 93 records, prod sitemap parity.
