---
title: Naming
section: standards
order: 1
summary: How names are decided, recorded in the ledger, and enforced by the gate.
status: draft
---

# Naming

Names in the Fusorb ecosystem are not left to drift. The single source of truth
is [`ecosystem/naming-ledger.json`](../../ecosystem/naming-ledger.json), and the
gate `pnpm check:names` enforces it.

## The three classes

- **renamed** — a legacy name that has been replaced by a current name. Safe to
  replace everywhere except the allowlist.
- **pending** — a rename that is decided but not yet available. Consumers must
  not adopt the new name until the blocker clears.
- **live** — a name that must never be renamed without an owner decision.

## The live-name trap

The ecosystem has a live public brand and domain (ArcevoCirqle,
arcevocirqle.com.ng, and email addresses on that domain). Many legacy names
begin with the same prefix. A naive search-and-replace of "arc" would break the
live domain. Therefore every renamed and pending pattern must be provably unable
to match a live token. The `@arcevo/` scope pattern includes the trailing slash
so it never matches `@arcevocirqle`. The gate self-tests this: it fails hard if
any renamed or pending pattern matches a live example.

## Pending until released

A rename is **pending**, not renamed, until the package that carries it is
actually released. The rename of `ArcIdClient`, `ArcIdClientConfig`,
`ArcProvider`, `ArcProviderProps`, and the `arcid_access_token` /
`arcid_refresh_token` storage keys is pending: the facet source and README use
the new `SgClient` / `SgProvider` / `sg_*` identifiers, but the published
packages still export the old identifiers and storage keys. Consumers keep the
old identifiers until facet releases, then upgrade and rename in one change. See
[versioning and releases](versioning-and-releases.md).

## The allowlist

Legacy tokens are permitted only in history and evidence paths:

- `**/CHANGELOG.md`
- `.changeset/**`
- `decisions/**`
- `docs/**/evidence/**`
- `ecosystem/naming-ledger.json`
- `content/standards/naming.md` (this file)

A line containing `legacy-ok` is exempt. Extra repo-specific allowlist paths are
passed via `--allow`.

## The per-repo execution model

The ledger names the rename; each repo's own agent applies it, later, per repo.
This repo never edits a product repo. Agents must not touch Relnex until the
owner says its migration is done.
