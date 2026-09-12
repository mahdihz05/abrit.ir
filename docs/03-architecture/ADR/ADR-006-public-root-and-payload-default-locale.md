---
doc_id: ABRIT-ADR-006
doc_type: adr
title: ADR-006 Public root and Payload default locale
status: proposed
owner: Unassigned
audience: [engineering, seo, management]
confidentiality: internal
source_of_truth: repository
last_verified: '2026-09-12'
baseline: f17b7d5
related: [ABRIT-LOCALE, ABRIT-SEO-SPEC]
---

# ADR-006 — Keep `defaultLocale=en` while root redirects to `/fa` (RECOMMENDED DECISION)

- **Status:** Proposed; no configuration change made.
- **Context:** `site-config.ts` sets `defaultLocale: "en"`; `(redirect)/page.tsx` redirects root to `/fa`; owner states Persian is the primary public market and root must remain `/fa`.
- **Problem:** The two values look inconsistent but govern different boundaries: Payload authoring/default locale and public entry routing.
- **Evidence:** Every public data read passes an explicit locale with `fallbackLocale:false` (`payload-cms.ts`, `seo-loader.ts`, `seo-sitemap.ts`, form route). The root redirect is independent of Payload's default. Hreflang x-default is derived from `defaultLocale` (`seo-resolver.ts:92-97`), and tests explicitly expect `en` (`site-config.test.ts`, `seo-resolver.test.ts`). Seeds write all three locales.
- **Decision:** Keep `defaultLocale=en` for now; retain `/ -> /fa`. This has no public content fallback conflict because fallback is disabled and localized routing is explicit. Treat x-default=en as an SEO decision requiring owner approval, not an accidental side effect.
- **Alternative:** Change defaultLocale to `fa`. This would change x-default, Payload's implicit locale for admin/API calls that omit locale, default localized record values, seed logging, tests, and any future code that relies on default instead of explicit locale. Existing localized data is not automatically migrated, but admin UX and metadata behavior change.
- **Rationale:** No technical defect requires the change; it would be cosmetic consistency with non-trivial SEO/admin consequences. A Persian x-default can be adopted later only with an approved SEO decision and regression suite update.
- **Consequences:** Public market behavior stays Persian; English remains implicit authoring/SEO fallback baseline only where code chooses default. Add tests for x-default if business policy is approved.
- **Risks:** Search engines may treat x-default=en while root sends fa; mitigate by recording and approving the intended x-default policy before migration cutover.
