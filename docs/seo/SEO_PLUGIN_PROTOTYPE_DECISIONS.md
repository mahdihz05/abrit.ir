# Official Payload Plugin Prototype Decisions

Target: Payload `3.88.0`. Evaluation used the published `3.88.0` package manifests, exported types, compiled config transforms, and official documentation. Neither plugin was enabled and no schema/data mutation occurred.

## `@payloadcms/plugin-seo`: REJECT

- Version compatibility: exact `payload: 3.88.0` peer; React 19.2 is supported.
- The plugin always adds a separate `meta` group with title, description, image, overview, and preview fields.
- Localization is not part of the default field model; field overrides could add it, but would still create parallel storage beside existing localized `content.seo` data.
- Canonical, robots, OG-specific fields, workflow policy, and resolver behavior are not provided by the default model.
- Generation callbacks and preview UI are extensible, but adopting them requires the plugin-created storage/endpoints and would risk a second SEO authority.
- Current localized SEO data cannot be retained in place without replacing the plugin's core field model.

Decision rationale: ABRIT already has the richer localized source fields that the application-owned resolver must consume. Adding `meta` duplicates those values; replacing all plugin defaults provides insufficient benefit. Individual supported admin components may be reconsidered later without adopting a second storage model.

## `@payloadcms/plugin-redirects`: REJECT

- Version compatibility: exact `payload: 3.88.0` peer.
- The plugin creates a `redirects` collection with globally unique raw `from`, reference/custom destination, and optional HTTP status.
- It does not model locale separately, normalize source paths, enforce internal canonical targets, enabled state, redirect audit fields, or path-change lifecycle.
- It does not prevent self redirects, loops, or chains and does not execute redirects in Next.js.
- Collection fields/access/hooks can be overridden, but meeting the ABRIT contract would replace nearly every substantive default.
- Built-in public read access would need replacement before use.

Decision rationale: a small application-owned collection/service is narrower and safer than depending on a plugin only to append a collection whose storage, validation, access, hooks, and execution all require replacement. No plugin internals will be copied or forked.
