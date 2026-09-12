---
doc_id: ABRIT-ADR-005
doc_type: adr
title: ADR-005 Application-owned SEO architecture
status: accepted
owner: TBD-owner
audience: [engineering, seo]
confidentiality: internal
source_of_truth: repository
last_verified: '2026-09-12'
baseline: a129fb3
related: [ABRIT-SEO-AUDIT, ABRIT-SEO-SPEC, ABRIT-PAYLOAD-MODEL]
---

# ADR-005 — Application-owned SEO, no official plugins (EXISTING DECISION)

- **Status:** Accepted (implemented).
- **Context:** Custom `seo-resolver/contract/loader/cache`, `seo-redirects` collection (307/308), sitemap/robots/schema in code; `docs/seo/SEO_PLUGIN_PROTOTYPE_DECISIONS.md` evaluated both official plugins against Payload 3.88.0 without enabling them.
- **Problem:** Plugin defaults don't cover localized canonical/robots/OG fields, workflow policy, locale-scoped redirects, or loop/chain prevention — adopting them would fork nearly every default.
- **Constraints:** Localized SEO in place; single SEO authority; testability (64 unit tests incl. seo suites).
- **Decision:** `@payloadcms/plugin-seo` REJECT (parallel `meta` storage, no localization/canonical/robots model); `@payloadcms/plugin-redirects` REJECT (no locale model, no chain/loop guards, public read default). Keep owned resolver + collection.
- **Alternatives considered:** plugin adoption with heavy overrides (rejected — second storage model risk); third-party SEO service (rejected — data residency/ops).
- **Rationale:** Richer localized source fields already exist; owned code is narrower and covered by tests.
- **Consequences:** Team owns resolver maintenance; individual admin components may be reconsidered later without storage adoption.
- **Risks:** Upstream feature drift (review per Payload minor); no image/video sitemap yet (P2).
- **Evidence:** `lib/seo*.ts`, `collections/SeoRedirects.ts`, `SEO_PLUGIN_PROTOTYPE_DECISIONS.md`, prod sitemap/robots match.
