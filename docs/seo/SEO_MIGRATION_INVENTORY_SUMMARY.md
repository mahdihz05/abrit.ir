# SEO Migration Inventory Summary

Site origin: `https://abrit.ir`

| Metric | Count |
|---|---:|
| records | 93 |
| invalidPaths | 3 |
| normalizedCollisions | 0 |
| duplicateCurrentPaths | 0 |
| duplicateCurrentSlugs | 0 |
| redirectsRequired | 0 |
| suspiciousCanonicalOverrides | 0 |
| unsupportedRoutes | 2 |

## Remediation Candidates

- `fa:1234` `testing` -> `testing`: slug:contains-whitespace-or-control, slug:invalid-segment
- `en:1234` `<missing>` -> ``: slug:invalid-segment, slug:missing-localized-value, path:missing-localized-value, path:non-home-empty, invalid-public-path
- `ar-ae:1234` `<missing>` -> ``: slug:invalid-segment, slug:missing-localized-value, path:missing-localized-value, path:non-home-empty, invalid-public-path

## Future Uniqueness Migration

Apply a locale-aware unique database constraint only after every validation error and normalized collision is resolved. Do not rewrite paths silently; create redirects for approved published URL changes before enabling the constraint.
