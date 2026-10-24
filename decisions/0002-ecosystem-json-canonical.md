---
status: Proposed
date: 2026-10-24
governs: [fusorb]
---

# 2. ecosystem.json as the canonical owner of decided ecosystem facts

## Context

Orgs, scopes, layers, products, domains, and sequencing need one machine-readable
home.

## Decision

`ecosystem/ecosystem.json` is the canonical owner of decided ecosystem facts. It
is machine-readable so Intel can later ingest it. ADRs carry a `governs` field
that references product or layer ids from this file, matching the GOVERNS
relationship Intel already models.

## Alternatives

- Markdown tables only — rejected: not machine-readable.
- A database — rejected: overkill for a small set of decided facts, and it would
  duplicate Intel.

## Consequences

Any place that needs a host name, a product list, or an org list renders it from
this file, never hand-types it.

## Verification

`pnpm check:ecosystem` validates the file structure and that ADRs only govern
known ids. `pnpm check:content` fails on generated-block drift.
