# fusorb: Agent Session Rules

Loaded at the start of every session.

## Purpose and audience

This repo is the product and architecture layer of the Fusorb ecosystem. It is
written for developers, organizations, and integrators. It records decisions and
standards — not measurements, not application code.

## The laws

- **Decided vs derived.** Decided facts live in `ecosystem/`. Derived facts
  (versions, counts, test totals) are owned elsewhere and never hand-typed here.
- **One canonical owner per fact.** Link to the owner; do not copy.
- **Link, don't copy.** Decided facts are recorded once and linked from prose.

## Write boundary

Write only inside this repo. Product repos and the sibling repo are read-only.
Never open the `projects/` directory.

## No UI dependencies

Facet is the single UI system. This repo adds no UI dependency now.

## Naming ledger first

Before any rename, read `ecosystem/naming-ledger.json`. Do not touch Relnex until
the owner says its migration is done.

## Gates

```sh
pnpm check:ecosystem
pnpm check:names
pnpm check:content
pnpm gen:docs
pnpm check:all
```

Run `pnpm check:all` before considering work done. `pnpm gen:docs` regenerates
the generated blocks from `ecosystem.json`.

## Local scratch

Write analysis and planning output to `.agent/output.txt` (gitignored). Update
the dashboard after each milestone.

## Commit style

Conventional commit subjects (`chore:`, `docs:`, `feat:`), one change per commit.
