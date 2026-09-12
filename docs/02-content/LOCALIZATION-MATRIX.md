---
doc_id: ABRIT-LOCALE
doc_type: current-state
title: Localization Matrix
status: verified
owner: Unassigned
audience: [engineering, seo]
confidentiality: internal
source_of_truth: repository
last_verified: '2026-09-12'
baseline: a129fb3
related: [ABRIT-PAGES, ABRIT-SEO-AUDIT]
---

# Localization Matrix — `VERIFIED` (code + production sitemap + generated inventory)

- Routing: `/{locale}`, `localeCodes=[en,fa,ar-ae]`, `defaultLocale=en`, root `/`→`/fa` (`site-config.ts`, `proxy.ts`). Fallback `false` — missing translations never silently fall back.
- Payload: locales en/fa/ar-ae, `localizeStatus`; slug/path/seo/brand/nav/menus localized; admin UI en+fa only.
- Production proof: sitemap serves all 31 keys × 3 locales (fa/en/ar-ae URL parity, 90 URLs) — routing + hreflang pipeline live.
- Typography: en ltr; fa rtl (Vazirmatn stack in v5); ar-ae rtl via `ar-AE` tag (glyph review = content task).

| Coverage group | fa | en | ar-ae | Status | Evidence |
|---|---|---|---|---|---|
| 25 normal content keys | slug/path/SEO title+description complete | complete | complete | COMPLETE (technical fields) | `SEO_MIGRATION_INVENTORY.json` |
| `home` | blank path intentional | blank path intentional | blank path intentional | COMPLETE | home exemption in `Content.path` |
| 5 independent-service/index keys | SEO title/description absent; resolver fallback | same | same | FALLBACK (not missing routing) | inventory; resolver title/excerpt/site fallback |
| test key `1234` | SEO missing | slug/path/SEO missing | slug/path/SEO missing | MISSING / REMOVE | inventory; excluded from live sitemap |
| navigation/settings seed | seeded | seeded | seeded | COMPLETE (seed) | `seed-payload.ts` |
| metadata/hreflang | code + live | code + live | code + live | COMPLETE | resolver + live HTML/sitemap |
| admin UI | — | yes | — | PARTIAL (accepted) | Payload `i18n.supportedLanguages` en/fa |

All 31 production content keys have localized route values for all 3 locales. `COMPLETE` means required technical fields are present; it does **not** replace human linguistic/copy approval. Every locale remains `NEEDS HUMAN QA` for final wording, terminology, RTL layout, and media-alt quality.

## Default-locale analysis

`defaultLocale=en` and `/ -> /fa` are intentionally separable. Current public reads are explicit-locale with `fallbackLocale:false`; changing default to fa would change x-default, implicit Payload admin/API defaults, tests, and seeds but not migrate localized records. Recommendation: retain `en` until an owner-approved x-default policy says otherwise. See ADR-006.

Remaining: translation ownership + per-page copy audit (owner), not architecture.
