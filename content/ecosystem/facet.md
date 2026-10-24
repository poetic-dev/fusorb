---
title: Facet
section: ecosystem
order: 2
summary: The single UI system for the whole ecosystem — a domain-customizable, auth-first component system.
status: draft
---

# Facet

Facet is the **single UI system for the whole ecosystem**: a domain-customizable,
auth-first component system. Every product consumes Facet instead of maintaining
its own UI.

## Purpose

Facet owns the shared presentation layer. Every component follows a four-layer
model — primitive, styled base, composed, and domain preset — customized along
three axes: appearance, config, and slots. It publishes the `@fusorb/facet-*`
npm packages via Changesets and a GitHub Actions pipeline.

## What it owns

- Design tokens, styled components, auth components and domain presets, layout
  shells, framework-agnostic stores, the SDK that wraps the SovGrant API, a docs
  engine, a CLI, and an email builder.
- The `@fusorb/facet-*` npm scope as the canonical UI distribution channel.

## What it does not own

- Any identity or access logic. That belongs to SovGrant; Facet's SDK is a client
  for it.
- Any backend or data storage. Facet is presentation and client-side concerns.

## Who consumes it and what it consumes

Facet consumes the SovGrant API through its SDK. It is consumed by SovGrant (for
its dashboard), by SovPort (SDK only), and is the target for Relnex once its
migration completes.

## Status

The repo is mature and publishes to npm. There is a **decided but unreleased**
rename of the SovGrant-facing SDK and auth identifiers: the repo source and
README already use the new identifiers, while the published packages still
export the old identifiers. Consumers keep the old identifiers until the release
lands. See [versioning and releases](../standards/versioning-and-releases.md) and
the [naming standard](../standards/naming.md).

## Evidence

- `facet/README.md`
- `facet/package.json`
- `facet/pnpm-workspace.yaml`
- `facet/AGENTS.md`
- `facet/CLAUDE.md`
- `facet/.changeset/rename-arcid-to-sg.md` (legacy-ok)
- `facet/.changeset/config.json`
- `facet/.github/workflows/ci-cd.yml`
