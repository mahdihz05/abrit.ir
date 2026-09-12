---
doc_id: ABRIT-README
doc_type: project-index
title: ABRIT Documentation Portal
status: verified
owner: Unassigned
audience: [management, engineering, seo, operations, qa]
confidentiality: internal
source_of_truth: repository
last_verified: '2026-09-12'
baseline: a129fb3
related: [ABRIT-STATUS, ABRIT-OVERVIEW]
---

# ABRIT Website Documentation — Source of Truth

> Baseline `opencode-dev @ a129fb3` (tag `v1.0.0-payload-baseline`), verified 2026-09-12.
> Workflow: installed **Project Documentation Orchestrator** skill (`.opencode/skills/project-documentation-orchestrator/`), modes REVIEW + UPDATE.
> External write integrations (Canvas, Nextcloud, Figma, task managers) intentionally NOT used — no remote write occurred.

## Reading paths

### Management
- `00-project/PROJECT-OVERVIEW.md`
- `00-project/PROJECT-STATUS.md`
- `07-management/RISK-REGISTER.md`
- `07-management/IMPLEMENTATION-ROADMAP.md`
- `00-project/OWNER-INPUT-REQUIRED.md`

### Developer
- `01-audit/REPOSITORY-AUDIT.md`
- `03-architecture/CURRENT-ARCHITECTURE.md`
- `03-architecture/TARGET-ARCHITECTURE.md`
- `03-architecture/PAYLOAD-CONTENT-MODEL.md`
- `03-architecture/BLOCK-ARCHITECTURE.md`
- `03-architecture/ADR/`
- `05-quality/TEST-MATRIX.md`

### SEO / Content
- `04-seo/SEO-AUDIT.md`
- `04-seo/SEO-SPECIFICATION.md`
- `04-seo/SEO-GAP-ANALYSIS.md`
- `04-seo/URL-MIGRATION-MAP.csv`
- `04-seo/LEGACY-URL-DISCOVERY.md`
- `04-seo/REDIRECT-IMPORT-READY.csv`
- `04-seo/SCHEMA-MATRIX.md`
- `02-content/PAGE-INVENTORY.md`
- `02-content/CONTENT-INVENTORY.md`
- `02-content/LOCALIZATION-MATRIX.md`

### DevOps
- `06-operations/DEPLOYMENT-RUNBOOK.md`
- `06-operations/ROLLBACK-PLAN.md`

### QA
- `05-quality/QA-ACCEPTANCE-PLAN.md`
- `05-quality/TEST-MATRIX.md`

## Current architecture (one line)
Unified Next.js 16 + Payload 3 + PostgreSQL 17 in one container; `/admin`, `/api/*`, `/{fa,en,ar-ae}`; custom SEO resolver + 307/308 redirects; no official Payload SEO/redirect plugins (rejected, see ADR-005).

## Verification state
See `00-project/PROJECT-STATUS.md` for six separate metrics. Headline: lint/typecheck/build PASS, unit 64/64 PASS, core integration 2/2 PASS, SEO integration 10/10 PASS, forms integration 1/1 PASS, migrations clean. HTTP SEO E2E is 2/5 because its fixture hard-codes a starter brand/origin.

## Blockers
Production secrets, Search Console/Analytics access, translation approval, and legacy source export — all in `00-project/OWNER-INPUT-REQUIRED.md`. Current `abrit.ir` is the temporary live site until the owner-approved end-of-Mehr migration window; no production write occurred.

## Legacy docs
Pre-existing `docs/*.md` roots (`ARCHITECTURE.md`, `SEO.md`, `DEPLOYMENT.md`, …) and `docs/seo/`, `docs/agent-reports/` are historical references, not part of this pack. Django-era files (`IMPLEMENTATION_PLAN.md`, `IMPLEMENTATION_CHECKLIST.md`, `MILESTONES.md`) are superseded by ADR-001 and this pack.

## Update policy
Docs are the source of truth; update the touched doc (`last_verified` + `baseline`) and `00-project/PROJECT-STATUS.md` with every change. Never mix Current State, Decisions, Proposals, Roadmap intent.

## Verification legend
`VERIFIED` | `PARTIALLY VERIFIED` | `NOT VERIFIED` | `NOT IMPLEMENTED` | `UNKNOWN` | `NEEDS OWNER INPUT`
