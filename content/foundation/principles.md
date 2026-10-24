---
title: Principles
section: foundation
order: 2
summary: The rules that govern how facts, names, and standards are treated.
status: draft
---

# Principles

## One canonical owner per fact

Every fact has exactly one owner. This repo owns decided facts and standards.
Each product repo owns its code and its derived facts. Facet owns the UI and its
registry. Intel owns cross-repo measurement and relationships. No fact is owned
by two places.

## Decided, derived, authored

- **Decided** facts are choices made by the owner (names, boundaries, sequencing)
  and live in `ecosystem/ecosystem.json`.
- **Derived** facts are measurements (versions, counts, test totals) owned
  elsewhere. They are never hand-typed here.
- **Authored** meaning is the prose in `content/` — the explanation of the
  decided facts, not a source of new measurements.

## Link, don't copy

Decided facts are recorded once in `ecosystem/` and linked to from prose. Nothing
is copied into a second place where it could drift.

## Name via the ledger

Any rename goes through `ecosystem/naming-ledger.json` first. No rename is
applied to a repo without a ledger entry. Live names are never renamed without
an owner decision.

## Gates over discipline

Rules that can be checked are checked. `pnpm check:all` runs the gates that keep
the decided facts, the naming ledger, and the content rules true.
