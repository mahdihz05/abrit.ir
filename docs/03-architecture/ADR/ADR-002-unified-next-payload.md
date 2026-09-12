---
doc_id: ABRIT-ADR-002
doc_type: adr
title: ADR-002 Unified Next.js and Payload application
status: accepted
owner: TBD-owner
audience: [engineering, operations]
confidentiality: internal
source_of_truth: repository
last_verified: '2026-09-12'
baseline: a129fb3
related: [ABRIT-ARCH, ABRIT-RUNBOOK]
---

# ADR-002 — Unified Next.js + Payload application (EXISTING DECISION)

- **Status:** Accepted (implemented).
- **Context:** `withPayload(nextConfig)` + `output: standalone` (`frontend/next.config.ts:1-26`); one process serves site, `/admin`, `/api/*`.
- **Problem:** Separate CMS hosting doubles ops, auth, and type-sync cost.
- **Constraints:** Single container expected by `deploy/`; shared TS types required.
- **Decision:** Keep unified; multi-stage `deploy/Dockerfile` (deps→builder→web→scheduler) + scheduler sidecar.
- **Alternatives considered:** split CMS/app services (rejected — premature; complicates preview/revalidation); Vercel-style serverless (rejected — needs persistent volumes for media).
- **Rationale:** Simpler deploy/rollback, local-API data access (no HTTP hop), one health model (`/healthz`, `/readyz`).
- **Consequences:** Cold-start couples site+admin; scale is vertical first; media on volumes.
- **Risks:** Noisy-neighbor admin load (mitigate: scheduler separation, future read replicas); standalone trace root pinned (`outputFileTracingRoot: ..`).
- **Evidence:** `frontend/next.config.ts`, `deploy/Dockerfile`, `deploy/compose.yaml`, `src/app/(payload)/`.
