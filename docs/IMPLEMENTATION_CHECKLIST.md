# AbrIT implementation checklist

Checkboxes are marked complete only after the related code and verification pass. Items marked **Gate** require evidence before release.

## 0. Source control and project records

- [x] Initialize the Git repository.
- [x] Preserve `abrit-homepage-polished-v5.html` as the visual reference.
- [x] Record the approved architecture and delivery stages.
- [x] Create this persistent implementation checklist.
- [x] Record the initial production constraints: shared hosting, SSH, cron, Python, Node and SQLite.
- [ ] Record each verified milestone in the checklist and Git history.
- [ ] Add final architecture, content model, CMS, API, translation, SEO, agent and deployment guides.

## 1. Foundation

- [x] Create the `backend`, `frontend`, `docs` and `scripts` project surfaces.
- [x] Scaffold Django 5.2 LTS and Next.js 16 with TypeScript.
- [x] Pin the initial Python dependency set.
- [x] Configure environment-specific Django settings without committed secrets.
- [x] Configure SQLite path, timeout, immediate transactions and persistent local storage.
- [x] Configure DRF, OpenAPI, CORS, CSRF, static files, public media and private media.
- [x] Add health and version endpoints.
- [x] Configure frontend environment validation and typed API access.
- [x] Add backend and frontend quality scripts.
- [x] Pass initial Django checks, backend tests, frontend lint, typecheck and production build.

## 2. CMS core and workflow

- [x] Implement UUID/timestamp base models.
- [x] Implement singleton site settings and localized contact/SEO settings.
- [ ] Implement validated and revisioned design settings.
- [x] Implement content items for page, service, solution, knowledge and news.
- [x] Implement locale translations, path uniqueness and missing-translation behavior.
- [x] Implement draft, review, scheduled, published and archived workflow.
- [x] Implement translation status: missing, draft, translated, reviewed and outdated.
- [x] Implement controlled, ordered and versioned content blocks.
- [x] Implement content relationships and taxonomy.
- [x] Implement service/capability/technology separation.
- [x] Implement content revisions, restore and audit logs.
- [x] Implement short atomic service-layer operations.
- [x] Implement scheduled publishing command.
- [x] Implement revalidation outbox, retry command and signed Next.js endpoint.
- [ ] Customize Django Admin with inlines, filters, search, preview and publish actions.

## 3. Media, navigation and design system

- [x] Implement reusable public MediaAsset records.
- [x] Implement localized alt, title and caption metadata.
- [x] Keep public media and submission files in separate storage roots.
- [x] Implement header, footer and mobile menu locations.
- [x] Implement hierarchical menu items and published-target validation.
- [ ] Implement desktop Mega Menu data and mobile accordion representation.
- [ ] Create the new AbrIT SVG wordmark, monochrome mark and favicon.
- [x] Remove all Infinite Cloud branding from production assets.
- [ ] Implement CSS design tokens and their safe CMS mapping.

## 4. Public frontend and Home vertical slice

- [x] Implement locale validation and `/fa`, `/en`, `/ar-ae` routing.
- [x] Implement RTL for Persian/Arabic and LTR for English.
- [x] Implement optimized Persian, English and Arabic fonts.
- [x] Implement accessible Header, language switcher, search trigger and navigation.
- [x] Implement desktop Mega Menu and mobile drawer/accordion.
- [ ] Implement the validated component registry and safe unknown-block fallback.
- [ ] Rebuild all approved v5 Home sections as reusable components.
- [x] Preserve purposeful CSS/IntersectionObserver motion and reduced-motion behavior.
- [ ] Replace remote prototype imagery with CMS media or intentional CSS visuals.
- [x] Seed the complete approved FA/EN/AR Home content.
- [ ] Render Home entirely from the CMS API.
- [ ] Implement loading, empty, API error, 404 and 500 states.
- [ ] Pass visual comparison at 1440px, 768px and 390px.

## 5. Content domains

- [ ] Implement Service list/detail with blocks, capability and technology relationships.
- [x] Seed all 10 approved services in three languages.
- [ ] Implement Solution list/detail and seed all six approved solutions.
- [ ] Implement Knowledge categories, tags, list/detail and related services/articles.
- [ ] Implement News & Media types, list/detail and related services.
- [ ] Implement About, Contact, Terms, Privacy and Customer Portal CMS pages.
- [ ] Hide unset email, social links and exact address fields.
- [ ] Implement related-content internal linking.

## 6. Pricing and configurator

- [x] Model packages, translations, capacities, features, rates and contract terms.
- [x] Store all money as integer toman and all percentages as basis points.
- [ ] Seed the five approved 1405 packages and complete comparison matrix.
- [x] Seed 3/6/12-month discounts and onboarding factors.
- [x] Implement exact overage rules up to the next tier.
- [x] Return Enterprise Custom when requests exceed the Enterprise boundary.
- [x] Apply contract discount only to base package price.
- [ ] Keep unpriced services outside totals and mark them quote-required.
- [ ] Implement versioned server-side pricing calculations with line items.
- [ ] Implement comparison and configurator UI without internal checkout.
- [ ] Use an internal placeholder until a real external checkout URL is provided.
- [ ] Verify every published total against the approved Word tables.

## 7. Forms and private uploads

- [x] Implement structured forms and all specified field types.
- [x] Implement localized form and field labels/help/options.
- [ ] Implement page/service embed and dedicated form routes.
- [ ] Validate submissions server-side and store them in Admin.
- [ ] Add honeypot, rate limiting and basic abuse protection.
- [ ] Enforce five files per submission and 10MB per file.
- [x] Allow only PDF, DOCX, XLSX, JPG/JPEG and PNG in version one.
- [ ] Validate extension, signature, MIME and safe OOXML structure.
- [x] Reject executables, malformed archives and macro-enabled Office files.
- [x] Store submission files outside the public webroot.
- [ ] Require authenticated Admin download for private files.
- [ ] Prepare and translate a Privacy Policy draft for human approval.
- [ ] **Gate:** do not activate public forms before Privacy consent approval.
- [ ] Purge submissions and files after 12 months and audit the purge.

## 8. Search and SEO

- [ ] Build normalized Persian/Arabic SearchDocument records on publication.
- [ ] Search only published pages, services, solutions, knowledge and news.
- [ ] Exclude drafts, submissions, private files and Admin data.
- [x] Implement locale-aware metadata, canonical and OpenGraph tags.
- [ ] Implement dynamic sitemap for public indexable translations.
- [ ] Implement valid hreflang sets without missing translations.
- [ ] Implement robots rules and keep Admin/private API paths unindexed.
- [ ] Implement 301/302 redirect management and redirect loop validation.
- [ ] Implement Organization, Breadcrumb, Service, Article and FAQ JSON-LD only when data exists.
- [ ] Implement localized image alt metadata.

## 9. Security, accessibility and performance

- [x] Keep production secrets out of source control.
- [x] Enforce HTTPS-ready secure cookies, hosts, CSRF and restricted CORS.
- [ ] Disable debug and run Django deployment checks.
- [ ] Protect Admin with strong authentication and lockout policy.
- [ ] Validate all untrusted media and never execute uploaded content.
- [x] Add semantic landmarks, skip link, keyboard support and visible focus states.
- [ ] Meet color-contrast and reduced-motion requirements.
- [ ] Optimize images, fonts, client JavaScript and cache behavior.
- [ ] Establish Lighthouse and bundle budgets for representative pages.

## 10. Verification and release preparation

- [ ] Pass backend model, service, workflow, API, pricing, form, search and SEO tests.
- [ ] Pass OpenAPI generation and generated TypeScript contract checks.
- [ ] Pass frontend unit, accessibility and interaction tests.
- [ ] Pass E2E tests for all three locales and directions.
- [x] Pass Next.js lint, typecheck and production build.
- [x] Run migrations and seed successfully on a clean environment.
- [ ] Validate SQLite JSON1, filesystem locks and expected low-write concurrency on the host.
- [ ] Configure daily DB/media backups with 30-copy retention.
- [ ] Perform and document a restore test.
- [ ] Configure shared-host Node/Python apps and cron examples.
- [ ] **Gate:** approve final AbrIT logo.
- [ ] **Gate:** approve the three-language Privacy Policy and form consent.
- [ ] **Gate:** provide real portal and checkout URLs or retain approved placeholders.
- [ ] **Gate:** verify SSL, domain routing and production runtime versions.
- [ ] **Gate:** receive explicit authorization before any production deployment, DNS change or production migration.
