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
Evidence is dated; later blocks supersede earlier ones. Lines marked `legacy-ok`
reference identifiers that were pending or retired at the time and are exempt
from the naming gate.

### 2026-10-24 (superseded)

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
git clone.

### 2026-10-25

```text
npm view @fusorb/facet-sdk version              # 2.0.0
npm view @fusorb/facet-auth version             # 2.0.0
npm view @fusorb/facet-store version            # 1.0.2
npm view @fusorb/facet-store peerDependencies   # @fusorb/facet-sdk exactly 2.0.0
npm view @fusorb/facet-layout version dependencies  # 1.6.0; no @fusorb/facet-auth dependency
npm view @fusorb/facet-docs version dependencies    # 1.5.8; auth 2.0.0, sdk 2.0.0, layout 1.6.0
npm view @fusorb/facet-layout@1.5.7 dependencies    # @fusorb/facet-auth 1.3.7
npm view @fusorb/facet-docs@1.5.7 dependencies      # @fusorb/facet-auth 1.3.7, @fusorb/facet-sdk 1.2.1
npm pack @fusorb/facet-sdk@2.0.0               # exports SgClient; no ArcIdClient legacy-ok
npm pack @fusorb/facet-auth@2.0.0              # exports SgProvider; keys sg_access_token/sg_refresh_token; no ArcProvider; no useAuthSession legacy-ok
```
<!-- END:evidence -->

## Known release hazards

These are observations about the Facet release, each with the command that shows
it. Items (b) through (d) are observations about Facet to be handled in the Facet
repo, not in this repo.

### (a) Token storage-key rename forces re-authentication

Renaming the token storage keys means sessions stored under the old keys are not
restored after upgrade, so users re-authenticate.

```text
npm pack @fusorb/facet-auth@2.0.0   # index.js: ACCESS_KEY "sg_access_token", REFRESH_KEY "sg_refresh_token"
```

### (b) Layout changes behaviour in a minor release

The layout package ships a behaviour change — no auto-detection of the auth
provider, an explicit session is required — while bumping only the minor version,
so consumers on caret ranges are affected.

```text
npm view @fusorb/facet-layout version dependencies   # 1.6.0; dependencies: @fusorb/facet-components only
```

### (c) Facet pins inter-package versions exactly

Facet publishes inter-package dependencies and peerDependencies as exact
versions, which forces lockstep upgrades and can install two copies of a package
when a consumer mixes versions.

```text
npm view @fusorb/facet-store peerDependencies   # @fusorb/facet-sdk exactly 2.0.0
npm view @fusorb/facet-docs dependencies        # auth 2.0.0, sdk 2.0.0, layout 1.6.0 (exact)
```

### (d) Layout changelog references a missing export

The layout changelog's migration example uses a hook that is not exported by the
auth package at its current major.

```text
npm pack @fusorb/facet-auth@2.0.0                            # grep useAuthSession: absent
curl https://raw.githubusercontent.com/fusorb/facet/main/packages/layout/CHANGELOG.md  # 1.6.0 migration uses session={useAuthSession()}
```
