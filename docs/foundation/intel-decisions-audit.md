# Intel decision audit

Verification (2026-11-01):
- Read `intel/packages/ingest/src/decisions.ts` (ECOSYSTEM_DECISIONS). ARCH_REPO_COMMIT = "424e31c"; this repo head is later.
- Checked `ecosystem/ecosystem.json` and authored standards/ADRs in this repo for supporting text.

| Key | Cited sourcePath | sourceCommitSha | Exists in this repo today? | Statement text supported by that file? (quote/support) | Recommended home |
|---|---|---|---|---|---|
| ui-invariant-facet | content/standards/ui-invariant.md | 424e31c | Yes (`content/standards/ui-invariant.md` exists) | Supported. States Facet is single mandatory UI system, waiver process, native surfaces use facet-sdk only. (Matches statement.) | Existing ADR/standard (ADR 0005/UI invariant standard) — OK. |
| naming-ledger | content/standards/naming.md | 424e31c | Yes (`content/standards/naming.md` exists; ledger at `ecosystem/naming-ledger.json`) | Supported. Names come from ledger, gate `pnpm check:names` enforces; lists renames including live names. (Matches.) | Existing (ADR 0003 / naming standard) — OK. |
| retired-npm-scope | ecosystem/ecosystem.json | 424e31c | Yes | Supported. `ecosystem.json` shows npmScopes with the retired scope and `@fusorb` live. Statement says the retired scope is retired/unpublished. | Ecosystem fact (canonical in ecosystem.json). Could be referenced from standard; seed is fine if sourced from canonical. |
| identity-authority | ecosystem/ecosystem.json | 424e31c | Yes (file exists) | **Not present verbatim.** `ecosystem.json` states products.sovgrant.role = "Canonical identity and access layer" and lists consumers; it does **not** state the full delegation/identity-id/JWT sub mapping. The detailed identity model lives in product copies (sovgrant/relnex/docs/identity-model.md) and is now captured in **ADR 0007** (Proposed). | **New ADR (0007)** in this repo. Intel should ingest ADR 0007's ## Decision section (or update seed to point to decisions/0007-identity-authority.md). Do not keep seeding from ecosystem.json for this detailed statement. |
| repo-structure-baseline | content/standards/repo-structure.md | 424e31c | Yes | Supported. Standard describes baseline elements (AGENTS.md, CLAUDE.md, CI, decisions/, README, .gitignore/.gitattributes). | Existing standard — OK. |
| agent-protocol | content/standards/agent-protocol.md | 424e31c | Yes | Supported. States agents write only inside target repo, consult naming ledger, branch per task, never push, use .agent/, verify against code. | Existing standard — OK. |

**Counts:** supported 5 / unsupported 1 (identity-authority) / missing 0. Intel needs to update the `identity-authority` seed to read from `decisions/0007-identity-authority.md` (or equivalent) and align governs to [sovgrant, relnex, sovport] as in ADR 0007.
