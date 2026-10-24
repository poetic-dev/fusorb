# fusorb

Product and architecture layer of the Fusorb ecosystem — decided facts,
standards, and the gates that keep them true. Written for developers,
organizations, and integrators of Fusorb products. No application or UI code.

## What this repo is

- The canonical source of decided facts in `ecosystem/ecosystem.json`.
- The naming ledger in `ecosystem/naming-ledger.json`.
- Authored standards in `content/`.
- Decision records in `decisions/`.
- Dependency-free gates in `scripts/`.

## What this repo is not

- Not an application or a site (no UI dependency).
- Not a source of measurements — versions, counts, and test totals are owned by
  the product repos, the Facet registry, and Intel.

## Gates

```sh
pnpm check:all
```

Runs the ecosystem, naming, and content gates in order. See `AGENTS.md` for the
rules for agents working here.

## Navigation

See `content/index.md` for the full map.
