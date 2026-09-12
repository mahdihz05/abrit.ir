---
doc_id: ABRIT-ENVATO-MAP
doc_type: design-context
title: Envato to Payload Mapping
status: verified
owner: Unassigned
audience: [engineering, design]
confidentiality: internal
source_of_truth: repository
last_verified: '2026-09-12'
baseline: a129fb3
related: [ABRIT-ENVATO-AUDIT, ABRIT-BLOCKS]
---

# Envato → Payload Mapping

`Template Section -> Target React Component -> Payload Block/Global -> Target Pages -> Data Source -> Status`

- header/topbar/nav/search -> `SiteHeader` -> `navigation` global -> all -> CMS menus (seeded) -> IMPLEMENTED (global exists; visual port pending)
- hero slider -> `Hero` -> `hero` block -> home/services -> `content.layout` (seed home) -> IMPLEMENTED
- about -> `RichText`+`FeatureGrid` -> `richText`,`featureGrid` -> about/home -> `content.layout` -> IMPLEMENTED
- services grid -> `FeatureGrid` -> `featureGrid` -> services/home -> `content.layout` -> IMPLEMENTED
- projects/cards -> `FeatureGrid` (variant) -> `featureGrid` -> solutions/home -> `content.layout` -> IMPLEMENTED
- process/steps -> `FeatureGrid` (variant) -> `featureGrid` -> about/home -> `content.layout` -> IMPLEMENTED
- pricing (`priceing-area`) -> `Pricing` (to build) -> `pricing` (PROPOSED, not in `blocks.ts`) -> pricing/home -> CMS (future) -> PROPOSAL (needs v5 sign-off)
- testimonials -> `Testimonials` -> `testimonials` -> home -> `content.layout` -> IMPLEMENTED
- blog cards -> `ContentCards` -> `content` query (kind news/knowledge→`editorial`) -> hub/home -> CMS query -> IMPLEMENTED
- FAQ accordion -> `FAQ` -> `faq` -> faq/services/demo-about -> `content.layout` -> IMPLEMENTED
- CTA band -> `CTA` -> `cta` -> all -> `content.layout` -> IMPLEMENTED
- contact info/form -> `ContactSection` -> `form` block (→`contact` form) -> contact -> CMS + submissions API -> IMPLEMENTED
- footer/newsletter -> `SiteFooter` -> `navigation`+`site-settings` -> all -> CMS -> IMPLEMENTED (global exists)
- counter/animations -> CSS-only -> — -> home -> static -> STATIC (no JS libs)
- jQuery 7 plugins / `mail.php` / FA-Pro / GSAP-split -> — -> — -> — -> DISCARD (ADR-004)
