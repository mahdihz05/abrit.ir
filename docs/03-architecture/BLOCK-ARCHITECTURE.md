---
doc_id: ABRIT-BLOCKS
doc_type: architecture
title: Block Architecture
status: verified
owner: Unassigned
audience: [engineering, design]
confidentiality: internal
source_of_truth: repository
last_verified: '2026-09-12'
baseline: a129fb3
related: [ABRIT-PAYLOAD-MODEL, ABRIT-ENVATO-MAP]
---

# Block Architecture — `VERIFIED` (`frontend/src/payload/blocks.ts`, 7 blocks; renderer `src/components/block-renderer.tsx` + test)

Shared sidebar: `enabled` checkbox default true; `variant` select default (default/simple/centered/split/cards/compact); `cta {label loc, url loc, openInNewTab}` (`blocks.ts:3-9`). All blocks live only inside `content.layout` (no separate collection); user-facing strings localized.

| Block | Fields (`blocks.ts`) | Renderer | Usage |
|---|---|---|---|
| `hero` | eyebrow, title req, highlight, body req, primary/secondaryCTA, points[0-5]{text req} | BlockRenderer → hero | home seed (`seed-payload.ts:53-60`), demo-about |
| `richText` | eyebrow, heading req, body lexical req | rich-text renderer | body content |
| `featureGrid` | eyebrow, heading req, intro, items[1-12]{icon, title loc req, description loc req, url loc} | grid | home seed, services/solutions |
| `faq` | heading req, items[1-20]{question/answer loc req} | accordion + FAQPage JSON-LD | demo-about seed (2 Q&A/locale), FAQ pages |
| `testimonials` | heading req, items[1-8]{quote/name loc req, role/company loc} | CSS carousel (no slick) | home |
| `cta` | eyebrow, title loc req, body, primaryCTA | CTA band | home seed, page footers |
| `form` | form→`forms` req (filter isActive) + eyebrow/heading/intro/context loc | form client component → `/api/forms/[formKey]/submissions` | contact seed page bound to `contact` form |

- Export `contentBlocks` consumed by `Content.layout` (`blocks.ts:81`, `Content.ts:49`).
- Debt: none duplicated, none overly specific. Missing candidates only on demand: `pricing`, `logoMarquee`. Never port Techor jQuery blocks (slick/isotope/wow) — rebuild React-native.
