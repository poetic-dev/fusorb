---
title: Fusorb
section: index
order: 0
summary: The product and architecture layer of the Fusorb ecosystem — decided facts, standards, and the gates that keep them true.
status: draft
---

# Fusorb

Fusorb is the **product and architecture layer** of its ecosystem: the canonical
record of what is decided, how the pieces are named, what standards hold, and
the gates that keep those claims true. It is written for developers,
organizations, and integrators of Fusorb products.

## What this repo is

- The canonical source of **decided facts** — orgs, npm scopes, layers, products,
  domains, and build sequencing — in [`ecosystem/ecosystem.json`](../ecosystem/ecosystem.json).
- The **naming ledger** that records what has been renamed, what is pending, and
  what is live and must never be renamed.
- **Standards** that every Fusorb repo is expected to meet.
- **Decision records** (ADRs) that explain why the above is the way it is.
- **Gates** (`pnpm check:all`) that fail the build when a decided fact, a name,
  or a content rule is violated.

## What this repo is not

- It is **not an application or a site**. There is no UI, and no UI dependency.
- It **does not own measurements**. Versions, counts, test totals, and file
  inventories are derived facts owned by the product repos, the Facet registry,
  and Intel. They are never hand-typed here.
- It **does not edit product repos**. Naming fixes happen later, per repo, by
  each repo's own agent, driven by the ledger.

## Navigation

- [Charter](foundation/charter.md) — the problem and the layer model.
- [Principles](foundation/principles.md) — the rules that govern everything else.
- [Glossary](foundation/glossary.md) — ecosystem terms and retired names.
- [Ecosystem overview](ecosystem/overview.md) — the orgs, layers, and products.
- [Naming](standards/naming.md) — how names are decided and enforced.
- [Repo structure](standards/repo-structure.md) — the minimum baseline every repo should meet.
- [UI invariant](standards/ui-invariant.md) — Facet is the single UI system.
- [Versioning and releases](standards/versioning-and-releases.md) — how Facet ships and consumers adopt.
- [Facts and sources](standards/facts-and-sources.md) — who owns which fact.
- [Agent protocol](standards/agent-protocol.md) — rules for agents working across repos.
- [Domains and deploy](standards/domains-and-deploy.md) — the domain model.
- [Integrators](integrate/index.md) — what integrators will eventually find (planned).
- [Decision records](../decisions/) — the ADRs.
