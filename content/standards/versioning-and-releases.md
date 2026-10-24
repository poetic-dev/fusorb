---
title: Versioning and releases
section: standards
order: 4
summary: How Facet releases, how breaking renames ship, and the dated npm evidence.
status: draft
---

# Versioning and releases

## How Facet releases

Facet publishes the `@fusorb/facet-*` packages with Changesets, driven by a
GitHub Actions pipeline (ci → changeset version → publish). A changeset records
the bump; the version job opens a "Version Packages" PR; the publish job builds a
clean checkout and publishes after the version PR merges.

## Breaking renames ship as majors

A rename that breaks identifiers ships as a **major** release. Consumers adopt it
only after the release lands, and they upgrade and rename in one change. The
cross-repo order is:

release → consumers upgrade and rename in one change.

## Dated evidence

<!-- BEGIN:evidence -->
Verified against the npm registry and the published tarballs on 2026-10-24.
Lines marked `legacy-ok` reference identifiers that are pending or retired at the
time of verification; the marker exempts them from the naming gate.

```text
npm view @fusorb/facet-auth version        # latest 1.3.7
npm view @fusorb/facet-sdk version         # latest 1.2.1
npm view @fusorb/facet-components version  # latest 3.1.0
npm view @fusorb/facet-docs version        # latest 1.5.7
npm view @fusorb/facet-sandbox version     # latest 2.0.0
npm view @arcevo/facet-auth version        # 404 legacy-ok
npm pack @fusorb/facet-auth@1.3.7          # exports ArcProvider/ArcProviderProps; keys arcid_access_token/arcid_refresh_token legacy-ok
npm pack @fusorb/facet-sdk@1.2.1           # exports ArcIdClient/ArcIdClientConfig; no SgClient legacy-ok
```

The `@fusorb/intel-*` packages are not on npm; Intel consumes the other repos by
git clone. The identifier and storage-key rename is recorded as
`facet/.changeset/rename-arcid-to-sg.md` (legacy-ok) and ships as a breaking
release; until then the old identifiers are pending, not renamed.
<!-- END:evidence -->
