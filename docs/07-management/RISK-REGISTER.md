---
doc_id: ABRIT-RISKS
doc_type: technical-report
title: Risk Register
status: verified
owner: Unassigned
audience: [management, engineering]
confidentiality: internal
source_of_truth: repository
last_verified: '2026-09-12'
baseline: a129fb3
related: [ABRIT-DEBT, ABRIT-ROADMAP, ABRIT-STATUS]
---

# Risk Register

| Risk | Cat | Prob | Impact | Pri | Mitigation | Evidence | Status |
|---|---|---|---|---|---|---|---|
| Legacy pre-Payload URLs unknown → missed 308s | SEO | high | high | P0 | legacy sitemap/logs export; import to `seo-redirects` | `URL-MIGRATION-MAP.csv` last row | open/owner |
| ar-ae copy unapproved at launch | content | med | high | P1 | ownership + `translationStatus` gate | `LOCALIZATION-MATRIX` | open/owner |
| FA-Pro/Techor asset license | legal | low | high | P1 | replace with Lucide/owned media | `ENVATO-TEMPLATE-AUDIT` | open |
| Secret mishandling | sec | low | high | P0 | vault handover + rotation; never commit | `site-config.ts`, `SECURITY-REVIEW` | open/owner |
| Rollback never drilled | ops | med | med | P1 | staging drill before first prod deploy | `ROLLBACK-PLAN` | open |
| Scheduler/backup idle in prod | ops | med | med | P1 | enable + monitor `/readyz` | `compose.yaml`, `update.sh` | open |
| Dev DB auth drift (`migrate:status` auth_failed) | ops | med | low | P2 | fix `DATABASE_URI` creds | `TEST-MATRIX` | open |
| Test key `1234` ships | content | low | low | P2 | remove from seed/inventory | inventory + sitemap diff | open |
| jQuery reintroduced | tech | low | med | P2 | ADR-004 review gate | `BLOCK-ARCHITECTURE` | mitigated |
