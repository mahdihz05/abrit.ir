---
doc_id: ABRIT-ADR-004
doc_type: adr
title: ADR-004 Envato as visual reference only
status: accepted
owner: TBD-owner
audience: [engineering, design]
confidentiality: internal
source_of_truth: repository
last_verified: '2026-09-12'
baseline: a129fb3
related: [ABRIT-ENVATO-AUDIT, ABRIT-BLOCKS]
---

# ADR-004 — Envato Techor as reference, React-native rebuild (EXISTING DECISION)

- **Status:** Accepted (implemented).
- **Context:** Placeholder package `techor-html-package/techor-placeholder/` (17 pages, Bootstrap 5.2-beta1, jQuery 3.6.0 + 7 plugins, FA-Pro fonts, `mail.php`); approved RTL reference `abrit-homepage-polished-v5.html`.
- **Problem:** Verbatim port drags jQuery/old-Bootstrap/license risk into Next.js 16.
- **Constraints:** RTL fa/ar-ae; no jQuery in React tree; licensed assets only.
- **Decision:** Visual reference only; rebuild as 7 generic Payload blocks + globals; new `pricing`/`logoMarquee` blocks only on demand.
- **Alternatives considered:** full HTML port (rejected — breaks hydration, a11y, CSP); wholesale Tailwind theme buy (rejected — same licensing question).
- **Rationale:** Keeps design velocity without tech debt; blocks stay reusable and testable (`block-renderer.test.tsx`).
- **Consequences:** v5 HTML stays a static reference file, never shipped; FA-Pro/Techor images need license decision (owner item #6).
- **Risks:** Design drift between v5 and blocks (mitigate: mapping doc + design sign-off gate in QA plan).
- **Evidence:** `02-design/ENVATO-TEMPLATE-AUDIT.md`, `ENVATO-TO-PAYLOAD-MAPPING.md`, `payload/blocks.ts`.
