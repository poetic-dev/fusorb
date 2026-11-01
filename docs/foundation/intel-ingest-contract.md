# Intel ingest contract

This document states exactly what a reader needs to ingest this repo without hand-seeding.

## Required files
- `ecosystem/ecosystem.json` — canonical orgs, npm scopes, layers, products, domains, sequencing
- `ecosystem/naming-ledger.json` — renamed/live rules for violation detection
- `decisions/*.md` — ADRs with frontmatter
- `content/standards/*` — authored standards

## ecosystem.json → repositories and products
- `products[]` gives repos via `repo: { org, name }` (e.g. sovgrant, relnex, sovport, facet, intel). Use these for `governs` targets.
- `orgs[]`, `npmScopes[]`, `layers[]`, `domains[]`, `sequencing[]` provide context.

## decisions/*.md frontmatter keys
Required keys (enforced by gate): `status`, `date`, `governs`  
Optional: `title`, `section`, `order`, `summary`, `applies to`, `related`

## ## Decision section as the statement
For ADRs that are decision records, the **## Decision** section is the canonical statement to extract verbatim (Intel should read it). ADR 0007's ## Decision section is self-contained for this purpose.

## Naming ledger → renamed/live rules for violation detection
- `entries[]` with `class` (`renamed` or `live`), `patterns` (regex strings), `to` (or null for live), `from`, `notes`, `evidence`, `examples`, `availableIn`, `adoptWith`.
- **Renamed:** treat matches as violations to be renamed to `to`. 
- **Live:** never rename (brand/domain/email/handles). 
- **Coordinated adoption:** `availableIn` and `adoptWith` indicate when renames are available/adoptable across packages (e.g. legacy identifier families).
- Gate `pnpm check:names` enforces ledger rules.

## Compute "stale consumer" from PROVENANCE.json
For repos using vendored snapshots:
1. Read `vendor/fusorb/PROVENANCE.json` → `sourceCommit` (this repo's commit the snapshot was taken from).
2. Compare to this repo's current HEAD (Intel can get via git or API).
3. If `sourceCommit != <fusorb HEAD>`, the consumer is **stale**. Report it (nightly job as specified in ADR 0008).
4. Also verify file hashes match PROVENANCE.json (integrity). Use `--check` mode.

## Gate to enforce contract
A gate (check-content or new script) must fail if an ADR lacks `status`, `date`, `governs`, or has not exactly one `## Decision` heading. This prevents silent breakage of the ingest contract.
