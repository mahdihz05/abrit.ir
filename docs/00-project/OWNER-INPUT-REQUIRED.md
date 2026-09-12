---
doc_id: ABRIT-OWNER-INPUT
doc_type: executive-status
title: Owner Input Required
status: verified
owner: Unassigned
audience: [management]
confidentiality: internal
source_of_truth: repository
last_verified: '2026-09-12'
baseline: a129fb3
related: [ABRIT-STATUS, ABRIT-ROADMAP]
---

# Owner Input Required

Only information genuinely unavailable to the agent (taxonomy question removed — 31-key taxonomy verified via seed + inventory + production sitemap).

| # | Question | Why needed | Blocking? | Affects | Source |
|---|---|---|---|---|---|
| 1 | Legacy pre-Payload URL export / access logs / WordPress post-ID export? | Public discovery found Persian legacy routes, but most page targets remain ambiguous; non-localized redirect runtime also needs a reviewed implementation change | blocking complete redirect migration | `LEGACY-URL-DISCOVERY.md`, `URL-MIGRATION-MAP.csv` | Hosting/old CMS |
| 2 | Search Console + Analytics access/data? | baseline traffic, 404s, keywords | non-blocking | `SEO-GAP-ANALYSIS` | SEO owner |
| 3 | Keyword strategy per locale + H1 decisions? | titles/descriptions (H1 field itself is a contract Proposal) | non-blocking | `SEO-SPECIFICATION` | SEO owner |
| 4 | Translation ownership + per-page ar-ae/fa/en copy QA? | `translationStatus` workflow | blocking launch | `LOCALIZATION-MATRIX` | Content team |
| 5 | Production secrets handover + rotation (DATABASE_URI, PAYLOAD_SECRET, IP_HASH_SECRET, admin creds)? | deploy only; local verification now works with documented development configuration | blocking deploy | `DEPLOYMENT-RUNBOOK` | DevOps, secure channel |
| 6 | Media licensing (FA-Pro fonts, Techor images) — keep/replace? | legal risk | non-blocking | `ENVATO-TEMPLATE-AUDIT` | Legal/design |
| 7 | Business KPIs + acceptance thresholds (leads, CWV)? | QA sign-off | non-blocking | `QA-ACCEPTANCE-PLAN` | Management |
| 9 | Confirm root `/`→`/fa` while `defaultLocale=en` is intended? | routing decision | non-blocking | `PAGE-INVENTORY`, ADR | Product owner |
