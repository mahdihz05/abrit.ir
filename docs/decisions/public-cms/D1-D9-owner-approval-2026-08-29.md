# Public CMS milestone — owner approval

- **Date:** 2026-08-29
- **Authority:** AbrIT repository owner
- **Scope:** Public CMS/API Integration & Publishing Parity only
- **Production permission:** Not granted. No production deployment, DNS, data migration, or production cache/outbox action is authorized by this record.

## Approved decisions

| ID | Decision |
|---|---|
| D1 | Canonical public host is `abrit.ir`; Persian (`fa`) is `x-default`. |
| D2 | Django remains exposed under same-origin `/cms`; browser API base is `/cms/api/v1`. |
| D3 | CMS is the sole runtime content authority for approved cutover routes; static-content and cross-locale runtime fallback are prohibited. |
| D4 | Unknown or invalid critical blocks produce a controlled unavailable page. Non-critical blocks render an accessible, visible localized placeholder with telemetry. |
| D5 | Rich text must be rendered only through an explicit sanitizer allowlist; arbitrary CMS HTML is prohibited. |
| D6 | Public CMS contract version is `2`; incompatible changes require a new version and controlled migration. |
| D7 | Tagged ISR has a maximum freshness ceiling of five minutes. Delivery uses durable retry, recorded correlation IDs, bounded attempts, and a dead-letter state. Default retry schedule: 1, 5, 15, 60, and 240 minutes; after the fifth failed attempt, the event is terminal/DLQ pending operator replay. |
| D8 | Pricing is display-only in this milestone. Calculator and checkout behavior must be removed or made unavailable; no purchase, calculated-total, or checkout path may remain public. |
| D9 | Approved visual baseline is v5 at 1440px, 768px, and 390px for `fa`, `en`, and `ar-ae`; visual acceptance includes RTL/LTR, keyboard navigation, focus/skip link, and accessibility checks. |

## Constraints retained

- This decision does not authorize implementation until the plan review and coordinator gates pass.
- This decision does not authorize a production release.
- Out-of-scope areas remain public forms/consent, checkout, payment, Knowledge/News editorial migration, backup/restore, DNS, and hosting rollout.
