---
doc_id: ABRIT-ENVATO-AUDIT
doc_type: design-context
title: Envato Template Audit
status: verified
owner: TBD-owner
audience: [engineering, design]
confidentiality: internal
source_of_truth: repository
last_verified: '2026-09-12'
baseline: a129fb3
related: [ABRIT-ENVATO-MAP, ABRIT-BLOCKS]
---

# Envato Template Audit — `VERIFIED`

- Root: `techor-html-package/techor-placeholder/` — "Techor IT Solution & Technology HTML Template" (placeholder/subset; only `documentation.txt` → ittruck docs link). 17 pages: 404, about, blog-{details,grid,list}, contact, faq, index(+2 variants), price, project(+details), service(+details), team(+details).
- Assets: CSS 11 (`bootstrap.min.css v5.2.0-beta1`, slick, custom-animation, nice-select, swiper-bundle, font-awesome-pro, magnific-popup, spacing, main), JS 15 (`jquery.js v3.6.0`, bootstrap.bundle, slick, magnific-popup, purecounter, wow, nice-select, range-slider, swiper, isotope-pkgd, imagesloaded-pkgd, main-tv, custom-gsap, slider, main), img 149 files/21 dirs, fonts 8 (FA Pro ttf/woff2), scss 50, `mail.php`.
- Homepage (`index.html` 1363 lines): header (top bar, sticky, search/offcanvas/mobile), hero slider, about, services, projects, team, process, CTA, pricing (`priceing-area`), counter, testimonials, blog, footer (newsletter + 4-col + social + © 2025 Techor).
- Approved AbrIT reference (not Techor verbatim): `abrit-homepage-polished-v5.html` (1067 lines, RTL fa, 16 sections: hero, statement, operations, outcomes, services, network, solutions, process, assurance, tech, pricing, usecases, hub, faq, cta, footer).
- Classification: header/footer/hero/services/pricing/testimonials/blog/faq/contact/CTA → Reusable/Global (rebuild); sliders/counters → Static/Reusable w/o jQuery; `mail.php`, FA-Pro fonts, GSAP-split, desktop.ini, maps → Discard/Replace.
- Do-not-port: jQuery 3.6 + 7 plugins, Bootstrap 5.2-beta1 grid, `custom-gsap.js` w/o npm dep, FA-Pro (license → owner item #6), `mail.php` (→ Payload forms API), LTR CSS (Techor `lang=zxx` vs AbrIT RTL).
