---
title: Facts and sources
section: standards
order: 5
summary: One canonical owner per fact, and the split between decided, derived, and authored.
status: draft
---

# Facts and sources

## The law

**One canonical owner per fact.** A fact is recorded once, owned by one place,
and linked to from everywhere else. When two places disagree, the owner wins.

## The split

- **Decided facts** (this repo): orgs, scopes, layers, products, domains,
  sequencing, and the naming ledger.
- **Derived facts** (product repos, the Facet registry, Intel): versions, counts,
  test totals, dependency graphs, and file inventories.
- **Authored meaning** (this repo's `content/`): the prose that explains the
  decided facts.

## Who owns what

- This repo owns decided facts and standards.
- Each product repo owns its code and its derived facts.
- Facet owns the UI and its registry.
- Intel owns cross-repo measurement and relationships.

## Consequence

This repo never hand-types a version, a count, a test total, a dependency graph,
or a file inventory. When such a number is needed as evidence, it is recorded as
dated evidence in the versioning standard or as an evidence snapshot, never as an
authored claim.
