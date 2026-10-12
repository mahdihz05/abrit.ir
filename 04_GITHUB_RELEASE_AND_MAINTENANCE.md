# Payload CMS Starter — GitHub Release & Maintenance Standard

Target: `https://github.com/mahdihz05/payload-CMS`

## Branches

`main` must represent the latest stable tested starter.

Use short-lived branches such as:
- `feature/*`
- `fix/*`
- `chore/*`
- `upgrade/*`
- `release/*`

Do not perform risky framework upgrades directly on `main`.

## Versioning

Use SemVer:
- `1.0.0` first stable starter
- patch = compatible fix/security fix
- minor = backward-compatible capability
- major = breaking config/content/migration contract

Never retag a released version.

## Release gate

Before a release:
- clean tree
- CI green
- migrations tested
- generic bootstrap tested
- production build tested
- fresh-clone gate for significant releases
- no secret/private-data finding
- breaking changes documented
- migration/backup notes where relevant

## Dependencies

Use Dependabot for npm and GitHub Actions where appropriate.

Rules:
- no automatic merge;
- no automatic major Payload/Next upgrade;
- group compatible low-risk updates when useful;
- security patches receive priority but still require test gates.

## Node / lockfile

- Declare supported Node major.
- Commit lockfile.
- Use `npm ci` in CI/deployment.
- Do not regenerate lockfile during unrelated work without reason.

## Payload / Next upgrades

For significant framework upgrades:
1. read upstream migration/release notes;
2. create upgrade branch;
3. back up representative/staging data;
4. update dependencies intentionally;
5. regenerate Payload types if required;
6. create/review migrations;
7. test empty DB;
8. test representative upgrade DB;
9. run all gates;
10. fresh-clone smoke;
11. update docs;
12. release with migration notes.

Do not mix major framework upgrade with unrelated visual/content work.

## Database migration rule

Released migrations are immutable. Add a new migration for later changes.

Production upgrade sequence:
1. DB/media backup;
2. deploy compatible code/migrations;
3. apply migrations;
4. verify health/routes/jobs;
5. monitor errors.

Prefer restore-based rollback unless down migrations are explicitly tested.

## Security maintenance

Periodically:
- review Dependabot/security advisories;
- review npm audit/advisories intelligently;
- update GitHub Actions dependencies;
- patch critical framework issues;
- re-check auth/preview/revalidation/private file boundaries after upgrades.

Never commit `.env`, credentials, DB dumps, real private uploads, API tokens or production session data.

## Release notes template

```md
## Payload CMS Starter vX.Y.Z

### Added
- ...

### Changed
- ...

### Fixed
- ...

### Database / Migration
- None / ...

### Breaking changes
- None / ...

### Upgrade
1. Back up DB/media.
2. Pull release.
3. Install from lockfile.
4. Run migrations.
5. Build/start.
6. Verify health/jobs.

### Verification
- CI: PASS
- Build: PASS
- Tests: PASS
```

## Template repository

When GitHub permissions allow, enable:

`Settings -> General -> Template repository`

Future sites should usually use **Use this template**.

Do not promise automatic upstream synchronization for heavily customized site projects. Starter releases should be treated as reviewable upstream improvements, not blindly merged updates.
