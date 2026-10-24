---
title: Glossary
section: foundation
order: 3
summary: Ecosystem terms and the retired names they replaced.
status: draft
---

# Glossary

## Core terms

- **Fusorb** — the product and architecture layer; the canonical org and npm scope.
- **ArcevoCirqle** — the live, public-facing brand and ecosystem; its domain and
  email addresses are live names, not legacy names.
- **Layer** — a named slice of the ecosystem (Fusorb = architecture layer,
  ArcevoCirqle = public layer).
- **Product** — one of the capability repos: Facet, SovGrant, Relnex, SovPort, Intel.
- **Decided fact** — a choice owned by this repo and stored in `ecosystem/`.
- **Derived fact** — a measurement owned elsewhere (a version, a count, a test
  total). Never hand-typed here.
- **Authored meaning** — the explanatory prose in `content/`.
- **Naming ledger** — `ecosystem/naming-ledger.json`: renamed, pending, and live names.
- **Gate** — a `scripts/check-*.mjs` program that fails the build when a rule is broken.
- **ADR** — an Architecture Decision Record in `decisions/`.

## Retired names

The table below lists the retired names and the current names that replaced
them. This is the only place besides the [naming standard](../standards/naming.md)
and the evidence snapshots that spells them out. See the ledger for the exact
patterns and evidence.

| Retired | Current |
| --- | --- |
| ArcUI | Facet |
| ArcID (Arc-ID, arc-id, arcid as a product name) | SovGrant |
| ArcBase / Arcbase | Relnex |
| ArcWallet | SovPort |
| @arcevo/ (npm scope) | @fusorb/ |
| ArcevoDev (GitHub org) | fusorb |

Pending renames (decided but not yet released) and the live names are recorded in
the [naming ledger](../../ecosystem/naming-ledger.json); consumers must not adopt
pending names until the blocker clears.
