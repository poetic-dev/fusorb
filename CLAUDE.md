# fusorb: Engineering Handbook

Thin pointer. Read `AGENTS.md` for the agent rules.

## Structure

```
fusorb/
├─ ecosystem/       decided facts + naming ledger + schemas
├─ content/         authored Markdown + frontmatter
├─ decisions/       ecosystem ADRs
├─ scripts/         dependency-free gates (check-* + gen-*)
├─ docs/foundation/ evidence snapshots + owner questions + deviations
└─ .github/         CI
```

## Commands

```sh
pnpm check:ecosystem   # validate ecosystem.json + ADR governs
pnpm check:names       # naming gate (self-test included)
pnpm check:content     # frontmatter, links, ADRs, derived facts, generated blocks
pnpm gen:docs          # regenerate generated blocks
pnpm check:all         # all checks in order
```

See `content/index.md` for the full content map.
