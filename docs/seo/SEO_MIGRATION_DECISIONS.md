# SEO Migration Decisions

| Current Component | Keep | Refactor | Replace | Remove Later | Reason |
| --- | --- | --- | --- | --- | --- |
| `content` collection | Yes | Yes | No | No | Evolve it as the first Page source; it already stores blocks, locales, workflow, SEO data, and production data. |
| Current SEO fields | Yes | Yes | No | No | Preserve as migration source; normalize names/validation/ownership through the future resolver. |
| `contentMetadata` | Concept only | No | Yes | Yes | Its resolver responsibilities survive, but route-limited implementation must be replaced by a single typed resolver. |
| `routeMetadata` | No | No | Yes | Yes | It is a legacy route-specific fallback that omits key SEO controls. |
| Static services (`public-content`) | No | No | Yes | Yes | Move public service content to Payload Pages/Blocks while retaining canonical URLs. |
| Static solutions (`public-content`) | No | No | Yes | Yes | Same static-content bypass and migration strategy as services. |
| Homepage metadata | No | No | Yes | Yes | Replace hard-coded values with resolved Page/site defaults; keep current values as migration seed. |
| Sitemap route | Yes | Yes | No | No | Keep Next metadata-route endpoint, replace direct collection query with resolver eligibility. |
| Robots route | Yes | Yes | No | No | Keep endpoint, add environment and system indexability policy. |
| `structured-data.tsx` | Yes | Yes | No | No | Keep safe JSON serialization/Organization source, refactor builders behind resolver and typed schema rules. |
| Revalidation hooks | No | Yes | Yes | Yes | Replace broad unused tag invalidation with explicit resolver/page/redirect/sitemap tags. |
| Access model | Yes | Yes | No | No | Preserve roles; define a functional SEO role and field/workflow permissions. |
| Current route architecture | No | No | Yes | Yes | Replace route-specific/static content paths with Page renderer while preserving URL contract. |
| Locales (`fa`, `en`, `ar-ae`) | Yes | Yes | No | No | Keep supported locales and route prefixes; formalize availability/hreflang contract. |
| Media ALT/image sizes | Yes | Yes | No | No | Keep required localized ALT and derivatives; ensure Block renderer propagates them. |
| Audit hooks/logs | Yes | Yes | No | No | Preserve history; add SEO/redirect-aware presentation rather than a separate audit system. |
| Drafts/versions/schedule | Yes | Yes | No | No | Preserve Payload workflows; make preview, workers, indexability, and cache behavior testable. |
