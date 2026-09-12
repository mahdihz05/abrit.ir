# Non-Visual Content and SEO Contract

- Existing `content` remains the Page source and retains identity, localized content/SEO, Blocks, workflow, versions, scheduling, audit, and Media relationships.
- `SeoDocumentInput` in `frontend/src/lib/seo-contract.ts` is the single shaped input shared by the future renderer and SEO resolver.
- Site/landing/home content is `page`; managed services and solutions remain typed content rendered as pages; independent services retain justified service facts; knowledge/news map to `editorial`; products/packages remain typed commercial data; navigation/site identity remain Globals.
- Page identity owns the one meaningful H1 (`content.h1`). Blocks own visible structure but do not own document-level canonical, robots, social, or sitemap decisions.
- Media owns localized ALT. The resolver owns canonical breadcrumbs derived from validated route hierarchy.
- Schema accepts typed reliable facts only. FAQ input must come from visible validated FAQ content; arbitrary JSON/script is not accepted.
- Translation availability explicitly carries published, active, route-valid, unique-path state. Missing locale values never imply fallback availability.
- Preview state explicitly distinguishes requested/authorized output. The resolver must reject unauthorized draft input and force authorized preview to `noindex,nofollow`.
- This contract does not change current visual rendering or create a second URL/content storage model.
