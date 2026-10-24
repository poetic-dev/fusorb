---
status: Proposed
date: 2026-10-24
governs: [arcevocirqle, facet, intel, sovgrant, relnex, sovport]
---

# 6. Hosting and domain model

## Context

Domains must be recorded with their live or planned status, so a planned domain
is never implied to be live.

## Decision

Domains live in `ecosystem.json` with a status (live or planned). Products deploy
as subdomains of the root domain once it is secured, following a per-product
pattern. Only the named subdomains are assigned; the rest are unassigned.

## Alternatives

- Hardcode host names in prose — rejected: drift and no single source of truth.
- Assume the root domain is already secured — rejected: it is not yet, and
  implying otherwise misleads integrators.

## Consequences

Status is explicit everywhere. Content renders the domain table from the single
source rather than hand-typing host names.

## Verification

`pnpm check:ecosystem` validates that a domain serving a product references a
known product id. `pnpm check:content` fails when the generated domain table
drifts.
