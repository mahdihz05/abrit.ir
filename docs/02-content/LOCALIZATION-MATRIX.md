---
doc_id: ABRIT-LOCALE
doc_type: current-state
title: Localization Matrix
status: verified
owner: TBD-owner
audience: [engineering, seo]
confidentiality: internal
source_of_truth: repository
last_verified: '2026-09-12'
baseline: a129fb3
related: [ABRIT-PAGES, ABRIT-SEO-AUDIT]
---

# Localization Matrix — `VERIFIED` (code + production sitemap)

- Routing: `/{locale}`, `localeCodes=[en,fa,ar-ae]`, `defaultLocale=en`, root `/`→`/fa` (`site-config.ts`, `proxy.ts`). Fallback `false` — missing translations never silently fall back.
- Payload: locales en/fa/ar-ae, `localizeStatus`; slug/path/seo/brand/nav/menus localized; admin UI en+fa only.
- Production proof: sitemap serves all 31 keys × 3 locales (fa/en/ar-ae URL parity, 90 URLs) — routing + hreflang pipeline live.
- Typography: en ltr; fa rtl (Vazirmatn stack in v5); ar-ae rtl via `ar-AE` tag (glyph review = content task).

| Page/Field | fa | en | ar-ae | Localized? | Missing? |
|---|---|---|---|---|---|
| 31 keys slug/path/seo | live ✓ | live ✓ | live ✓ | yes | per-page copy QA needs CMS read |
| nav/footer/settings | seeded ✓ | seeded ✓ | seeded ✓ | yes | ar-ae label review |
| metadata/hreflang | code ✓ | code ✓ | code ✓ | yes | — |
| admin UI | — | ✓ | — | partial | ar-ae editor UI (accepted) |

Remaining: translation ownership + per-page copy audit (owner), not architecture.
