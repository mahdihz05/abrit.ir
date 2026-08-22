# AbrIT implementation plan

## Architecture decisions

- Django/DRF owns content, workflow, forms, pricing, search, SEO data and the customized admin CMS.
- Next.js owns the public presentation layer and renders only published API content.
- Public routes are locale-prefixed (`fa`, `en`, `ar-ae`); missing translations return 404 without fallback.
- The first production database is SQLite on persistent local storage. Money is stored as integer toman values, not floating point.
- `abrit.ir` serves Next.js. `cms.abrit.ir` serves Django Admin and `/api/v1`.
- The approved v5 HTML is the visual reference, not production source code or production data.
- The approved package document is the commercial source of truth.

## Delivery sequence

1. Foundation and contracts.
2. CMS core and a complete Home vertical slice.
3. Content domains, navigation, media, search and SEO.
4. Pricing configurator and public forms.
5. Workflow, revision, audit, scheduling and revalidation.
6. Hardening, full validation and shared-hosting preparation.

Detailed progress and acceptance evidence are maintained in `IMPLEMENTATION_CHECKLIST.md`.
