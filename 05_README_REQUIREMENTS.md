# Public README Requirements — `mahdihz05/payload-CMS`

The implementing agent must generate the final root `README.md` from **actual tested Starter V1 behavior**.

Do not claim features that are not proven.

## Header

Recommended title:

`# Payload CMS Starter`

Recommended description:

A production-oriented Payload CMS + Next.js starter using PostgreSQL, typed block-based pages, localization, technical SEO, redirects, RBAC, forms, drafts/previews, scheduled publishing, Docker, and automated tests.

Do not call it "official Payload" or imply endorsement by Payload maintainers.

## Why this starter

Briefly explain that it provides reusable infrastructure commonly needed for content-driven sites:

- CMS/admin
- Page/Blocks
- localization
- SEO
- redirects
- forms/media
- permissions
- drafts/previews
- scheduling
- migrations
- Docker
- tests/CI

Avoid marketing exaggeration.

## Stack

Document actual final versions/requirements for:
- Payload
- Next.js
- React
- TypeScript
- PostgreSQL
- Node
- Docker

## Features

Group features into:

### CMS
- Page/content management
- generic Blocks
- Media
- Forms
- Drafts/Versions
- Preview
- Scheduled publishing
- Audit
- RBAC

### SEO
Only claim tested behavior:
- centralized resolver
- canonical
- robots
- OG/Twitter
- hreflang
- redirects
- sitemap/robots.txt
- structured data
- preview noindex
- SEO role

### Localization
Explain default configured locales and how to modify them.

### Developer / Operations
- migrations
- bootstrap/demo seed
- Docker
- CI/tests
- backup/restore docs

## Repository structure

Show a short accurate tree only.

## Quick Start — mandatory and fresh-clone tested

Show exact commands in exact order:

1. clone/use template
2. enter repository/project directory
3. copy/create env
4. start PostgreSQL/full Docker path
5. install
6. migrate
7. bootstrap
8. run dev/start

Do not omit migrations.

If two supported approaches exist, separate clearly:
- local Node + Docker PostgreSQL
- full Docker

## Environment

Link `.env.example`.

Provide:

| Variable | Required | Purpose |
|---|---|---|

Never include real secrets.

## Bootstrap / Demo

Explain:
- required bootstrap
- optional demo seed
- admin creation
- idempotency/rerun
- removing demo content

## Admin / Roles

Document admin URL and actual permissions for:
- admin
- editor
- seo
- viewer

## Creating a New Website

This is a key section.

Recommended workflow:

```text
Use template / clone
-> set site identity/environment
-> configure locales
-> migrate/bootstrap
-> replace demo content
-> create/adjust Blocks where needed
-> implement visual theme
-> test
-> deploy
```

Link `docs/CREATING_A_SITE.md`.

Explain:
- keep SEO centralized;
- visual Blocks must not reimplement document-level SEO;
- site-specific integrations should remain optional/configured.

## Page / Blocks

List actual generic Blocks and explain at a high level how to add one.

Do not market ABRIT-only variants as generic features.

## SEO

Link `docs/SEO.md` and document:
- self canonical
- manual canonical rules
- noindex/sitemap relationship
- preview noindex
- hreflang availability
- redirects after published path changes

## Localization

Link `docs/LOCALIZATION.md` and document:
- default locale
- configured locales
- add/remove process
- RTL/LTR
- translation publication behavior
- hreflang implications

## Forms / Media

Document:
- form creation/submissions
- private/public uploads where supported
- localized ALT
- storage persistence

## Tests

List actual scripts for:
- lint
- typecheck
- unit
- integration
- E2E
- complete check

Explain required services/env for integration/E2E.

## Database / Migrations

Document:
- fresh DB setup
- creating/applying migrations
- released migrations are immutable
- backup before production upgrades

## Docker / Deployment

Link `docs/DEPLOYMENT.md`.
Show simplest supported production-like command and describe web/db/scheduler/media.

## Scheduled Publishing

Explain the scheduler/job service and production requirement.

## Backup / Restore

Link `docs/BACKUP_RESTORE.md` and mention PostgreSQL + media.

## Updating / Upgrading

Link `docs/UPGRADING.md` and explain SemVer release/update approach.

## Security

Link `docs/SECURITY.md`.
At minimum:
- never commit `.env`;
- rotate secrets;
- apply security updates deliberately;
- review production access controls.

## CI / GitHub

Explain what CI actually validates. Add badges only for real stable workflows.

## Production checklist

Include a short checklist:
- secure secrets
- production site URL
- DB backup
- media persistence/backup
- migrations
- scheduler
- health checks
- HTTPS/reverse proxy
- CI green
- smoke test
- robots/sitemap

## License

Do not invent a license.
If no owner-approved license exists, omit license claim or state factually that no license has been declared.

## Credits

Acceptable:
`Built with Payload CMS and Next.js.`

Link official upstream docs/project without implying endorsement.

## README acceptance

README is accepted only if:
- Quick Start was fresh-clone tested;
- no ABRIT runtime instructions remain;
- no secrets/private info appears;
- claims match tested behavior;
- links exist;
- commands match package scripts/Docker;
- a new developer can reach a running admin/public site from README.
