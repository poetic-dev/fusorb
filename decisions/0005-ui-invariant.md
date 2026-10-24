---
status: Proposed
date: 2026-10-24
governs: [facet, sovgrant, relnex, sovport, intel]
---

# 5. UI invariant and waiver process

## Context

UI was being duplicated across repos.

## Decision

Facet is the single mandatory UI system. No repo builds an independent UI. A
product that cannot use Facet may hold a waiver, which names the reason, the
migration plan, and the waiver holder. Relnex's shadcn UI is a known deviation in
migration, with the owner as the waiver holder.

## Alternatives

- Allow per-repo UI — rejected: it recreates the duplication this ecosystem
  exists to remove.
- Force an immediate rewrite of every repo — rejected: migration must be
  sequenced.

## Consequences

UI work is centralized in Facet. Deviations are explicit and close when the
product migrates.

## Verification

The naming and content gates keep the invariant visible; the waiver itself is a
decided fact recorded in the standard and, for the Relnex deviation, tracked by
its migration.
