---
doc_id: ABRIT-CONTENT
doc_type: current-state
title: Content Inventory
status: verified
owner: Unassigned
audience: [engineering, seo]
confidentiality: internal
source_of_truth: repository
last_verified: '2026-09-12'
baseline: a129fb3
related: [ABRIT-PAGES, ABRIT-MIGRATION-MAP, ABRIT-LOCALE]
---

# Content Inventory — `VERIFIED` (seed + inventory JSON + production sitemap)

| Item | Keys/URLs | Verdict |
|---|---|---|
| Homepage | `home` → `/{locale}` (hero+featureGrid+cta seed) | IMPROVE (v5 RTL sections → blocks) |
| Services index + 10 details | `services`, `services/managed-it … it-automation` | KEEP |
| Solutions index + 6 details | `solutions`, `solutions/…` (6) | KEEP |
| Independent services + 4 details | `independent-services`, `independent-services/{backup,cloud-storage,workspace,voice}` (`templateKey: independent-service`) | KEEP |
| Products / Pricing | `products`, `pricing` | NEEDS REVIEW (no pricing block yet) |
| About / Contact | `about`, `contact` (form block → `contact` form) | KEEP |
| News / Knowledge | `news`, `knowledge` (kind→`editorial` in resolver) | KEEP |
| Search | `/{locale}/search` system page | KEEP (noindex) |
| Nav/footer | `navigation` global (header/footer/mobile, per locale) | IMPROVE (ar-ae labels) |
| Test key `1234` | inventory only (`testing` + 2 invalid), absent from prod sitemap | REMOVE (P2 cleanup) |
| Legal/static | none in inventory | NEW where required |

Per-item migration actions live ONLY in `CONTENT-MIGRATION-MAP.md` (no duplication).
Titles/H1/summaries per page: H1 ownership is a contract Proposal (`SEO_CONTENT_CONTRACT.md:6`, no `h1` field in schema) — per-page copy audit needs CMS read access (owner).
