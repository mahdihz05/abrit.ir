---
doc_id: ABRIT-ADR-001
doc_type: adr
title: ADR-001 Payload replaces previous backend
status: accepted
owner: Unassigned
audience: [engineering, management]
confidentiality: internal
source_of_truth: repository
last_verified: '2026-09-12'
baseline: a129fb3
related: [ABRIT-ARCH, ABRIT-PAYLOAD-MODEL]
---

# ADR-001 — Payload CMS replaces previous backend (EXISTING DECISION)

- **Status:** Accepted (implemented).
- **Context:** Django/DRF + SQLite stack removed in `648c788 chore(cutover): remove Django`; Payload 3.88 foundation added in `3a142b2`, schema migration `89d3f3d`, baseline commit `a129fb3`.
- **Problem:** Legacy stack couldn't serve localized marketing content with drafts/versions/scheduling and a non-technical admin UI.
- **Constraints:** Single-team ops; PostgreSQL available; must keep one deployable.
- **Decision:** Payload 3 + `@payloadcms/db-postgres`, migrations in `src/migrations/`, admin at `/admin`.
- **Alternatives considered:** keep Django as headless API (rejected — two systems, no visual editing); adopt Payload plugins for SEO/redirects (rejected — see ADR-005).
- **Rationale:** Native localization, versions/drafts/schedulePublish, field-level access, lexical editor, co-located Next.js types.
- **Consequences:** One Node process; `users/media/content/seo-redirects/forms/submissions/files/audit` model; scheduler sidecar for jobs.
- **Risks:** Payload major upgrades (pin 3.88, CI build gate); Postgres ops (backup profile in compose).
- **Evidence:** `frontend/src/payload.config.ts`, `src/migrations/` (5 files), `git log` cutover commits.
