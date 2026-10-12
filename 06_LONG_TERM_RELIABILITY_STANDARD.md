# Payload CMS Starter V1 — Long-Term Reliability Standard

Goal: reduce the chance that the starter works only on release day.

This is not a promise of zero bugs. It defines controls for prevention, detection, recovery, and safe upgrades.

## 1. Deterministic builds

Require:
- committed lockfile
- documented Node major
- `npm ci` in CI/deployment
- production build in CI
- Docker build in release gate

Avoid undocumented global machine dependencies.

## 2. Explicit configuration

Required production config must fail clearly if absent.

Never silently fall back in production to:
- ABRIT domain
- demo secrets
- localhost canonical origin
- demo DB credentials
- third-party credentials

## 3. Health / startup

Provide observable health/readiness behavior.
Where practical distinguish process alive/app ready/critical DB connectivity.
Do not expose secrets in health output.

## 4. Database safety

- source-controlled migrations
- released migrations immutable
- empty DB migration tested
- representative upgrade path tested for significant releases
- backup before production schema changes
- bootstrap separate from migrations
- minimize site-specific data transformations in core schema migrations

## 5. Stateful media

Container rebuild/redeploy must not destroy uploads.
Document persistence and backup for public/private media.
Test private media access boundaries.

## 6. Jobs / scheduler

Scheduled publishing must have a reproducible non-interactive production process, restart strategy, logging/failure visibility, and controlled test evidence.

## 7. Cache / revalidation

Maintain regression tests for:
- publish/unpublish
- SEO changes
- path changes
- redirects
- sitemap eligibility
- preview cache separation

## 8. Security boundaries

Regression-test:
- admin/auth
- SEO role
- editor restrictions
- preview authorization
- private uploads
- revalidation endpoint
- redirects
- form uploads

Do not rely only on UI hiding; test API/data-level access.

## 9. Logging / error handling

Startup/migration/scheduler failures should be observable and non-zero where appropriate.
Do not log secrets.
Unexpected SEO/sitemap failures must not silently publish invalid output.

## 10. Automated regression gates

Routing/SEO/database/auth changes require relevant integration/E2E coverage, not typecheck only.
Favor a small high-value production-mode smoke suite over brittle huge UI suites.

## 11. Dependency drift

Use automated update PRs, not blind auto-merge.
Framework upgrades are deliberate, tested, documented releases.

## 12. Recovery

Reliability requires restore capability:
- PostgreSQL backup/restore
- media backup/restore
- environment/secrets recreation guidance

Periodically exercise restore outside production.

## 13. Documentation as interface

When setup/config changes, docs change in the same commit.
Do not maintain contradictory setup guides.
Fresh-clone gates should expose stale setup instructions.

## 14. Starter compatibility

Generated sites will diverge.
Therefore:
- use SemVer;
- document breaking changes;
- prefer additive stable config/Block evolution;
- provide migration notes;
- do not promise painless automatic merging of all starter releases into customized sites.

## 15. Significant release validation

```text
clean install
+ empty DB migrate
+ bootstrap
+ unit/integration
+ production build
+ E2E smoke
+ Docker smoke
+ public-tree/secret scan
```

For major/important minor releases rerun full fresh-clone acceptance.

## 16. V1 reliability definition

Starter V1 is robust enough to publish when:
- deterministic install/build passes;
- empty DB setup passes;
- bootstrap passes;
- runtime starts cleanly;
- tests pass;
- Docker smoke passes;
- scheduled publishing path is proven;
- SEO routing/indexability regression passes;
- backup/restore is documented and DB restore exercised where feasible;
- no known private/ABRIT runtime coupling remains;
- CI reproduces critical gates;
- a second clean clone can follow README and run successfully.

Do not claim "works forever". Provide controlled upgrades, tests and recovery.
