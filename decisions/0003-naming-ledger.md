---
status: Proposed
date: 2026-10-24
governs: [fusorb, facet, sovgrant, relnex, sovport, intel]
---

# 3. The naming ledger

## Context

Legacy names leak into docs and code. A naive rename of the shared prefix would
break the live public brand and domain.

## Decision

All renames go through `ecosystem/naming-ledger.json` with three classes:
renamed, pending, and live. A renamed token is safe to replace everywhere except
the allowlist. A pending rename is not adopted until its blocker clears. A live
name is never renamed without an owner decision. Renames are applied later, per
repo, by each repo's own agent.

## Alternatives

- One big search-and-replace — rejected: it breaks the live domain and email
  addresses.
- No ledger — rejected: drift returns and the live-name trap is not caught.

## Consequences

Every rename is deliberate, recorded, and gate-checked. The live-name self-test
proves no renamed or pending pattern can match a live name.

## Verification

`pnpm check:names` self-tests the ledger and fails when a renamed token appears
outside the allowlist.

## Update 2026-10-25

The Sg rename — the `ArcIdClient` / `ArcProvider` identifiers and the `arcid_*`
storage keys — shipped in the facet auth and sdk majors, so those two entries
moved from `pending` to `renamed`. Renamed entries may now carry `availableIn`
(package → minimum version) and `adoptWith` (packages that must be upgraded in
the same change). The `pending` class remains supported with zero entries.
