---
status: Proposed
date: 2026-11-01
governs: [fusorb, arcevocirqle, facet, sovgrant, relnex, sovport, intel]
---

# ADR 0008: Consumer sync via vendored snapshot

- **Related:** docs/foundation/intel-ingest-contract.md, tools/consumer/sync-fusorb.mjs, arcevocirqle/scripts/sync-fusorb.mjs

## Context

§1.2 (verified 2026-11-01): Cross-repo sync is hand-written prose that rotted. `SYNC.md` exists in sovgrant, sovport and intel, each saying "Last synced against fusorb 424e31c". No standard in this repo defines `SYNC.md`. Meanwhile arcevocirqle already uses the right mechanism (`vendor/fusorb/` + `PROVENANCE.json` + `sync-fusorb.mjs --check`). Agent-tool files are handled four different ways across repos, compounding drift.

Prose sync notes fail because: (1) they are not machine-verifiable, (2) there is no integrity check, (3) they become stale with no automated detection, (4) different repos track different things informally.

## Decision

**Every consuming repo keeps a vendored snapshot under `vendor/fusorb/` with `PROVENANCE.json`**, replacing hand-written `SYNC.md`. `SYNC.md` is retired.

### Provenance format
`PROVENANCE.json` holds:
```json
{
  "sourceCommit": "<git sha of fusorb repo at sync time>",
  "syncedAt": "<ISO 8601>",
  "files": [{ "path": "<vendored relative path>", "sha256": "<hex>" }]
}
```
Provenance must contain **no org names or local paths**. It is portable across machines and repos.

### Profiles
Two profiles are supported (defined in `tools/consumer/profiles.json`):
- **names** = ledger + names tool + its two libs (`ecosystem/naming-ledger.json`, `scripts/check-legacy-names.mjs`, `scripts/lib/fs-walk.mjs`, `scripts/lib/glob.mjs`) — minimal for repos that only need naming enforcement.
- **full** = arcevocirqle's current set (ecosystem.json, naming-ledger.json, check-legacy-names.mjs, and all lib files: fs-walk, glob, frontmatter, derived-facts, links) — full consumption.

### Tool behavior
`tools/consumer/sync-fusorb.mjs` (dependency-free, Windows-safe with `node:path`, `\r?\n`):
- `--from <path>`: copy vendored files from the fusorb repo per selected profile, write `vendor/fusorb/PROVENANCE.json` with sourceCommit (from `git rev-parse HEAD` in source), syncedAt, and file hashes.
- `--profile names|full` (default `full`): select which files to vend.
- `--check` (offline, CI): verify every vendored file's SHA-256 matches `PROVENANCE.json`, no unlisted file exists under `vendor/fusorb/` (excluding `PROVENANCE.json`), and if ecosystem.json is vendored it passes structural validation.
- `--check --from <path>` (local freshness): additionally fail if any source file differs from its vendored copy (ensures local working tree is in sync).
- The tool itself is one of the vendored files so consumers can update it via the sync mechanism.
- Zero repo-specific constants except the profile lists in `profiles.json`.

### Reference and differences
Use `arcevocirqle/scripts/sync-fusorb.mjs` (read-only) as the reference. Differences: profiles (names|full), `--profile` flag, provenance contains only the required fields (no org names/local paths), tool is designed to be vendored, and self-testable.

### Freshness detection (Intel)
A nightly job compares each repo's `PROVENANCE.json` `sourceCommit` with this repo's HEAD and reports stale repos. This is the intended verification mechanism (recorded here; not built in this repo).

### Self-test
`scripts/test-consumer-sync.mjs` proves: clean sync passes `--check` (both profiles), flipping one byte fails, an unlisted file fails, both profiles work against a temp directory (OS temp dir, cleaned up). Windows-style paths and CRLF input are tested.

## Alternatives
- **Hand-written SYNC.md:** rejected (rots, not machine-verifiable, no integrity/staleness detection).
- **Submodule:** rejected (adds complexity; vendored snapshot with provenance is simpler and matches arcevocirqle's approach).

## Consequences
- Hand-written `SYNC.md` becomes invalid; consumers must migrate to vendored snapshot + provenance.
- CI should run `--check` to catch tampering/missing files.
- Intel can detect staleness via provenance vs fusorb HEAD.
- The shared tool lives in this repo (`tools/consumer/`) and is vendored to consumers.

## Verification
- Self-test `scripts/test-consumer-sync.mjs` passes (clean sync both profiles, byte flip fails, unlisted file fails, Windows paths/CRLF).
- Gate `pnpm check:consumer-sync` runs self-test via `check:all`.

## Update 2026-11-10

Offline `--check` only proves self-consistency (`vendor/` vs `PROVENANCE.json`), so
it cannot see a live fusorb change such as a new decision. The consumer tooling is
hardened for freshness.

- **Directory profiles.** A profile entry may be a directory mapping
  (`{ srcDir, dstDir }`) that expands to every file under it, so a new file — for
  example a new ADR — is vendored without editing the profile. A `decisions`
  profile is added for consumers that vendor the decision record, and profiles
  compose (`--profile full,decisions`).
- **Freshness mode.** `--check --from <fusorb>` now also fails when
  `PROVENANCE.sourceCommit` differs from the source repo's HEAD (commit drift),
  when a profiled source file is not vendored (a new file), or when a vendored
  file has no source in the selected profile. The offline `--check` (no `--from`)
  is unchanged and stays CI-safe; freshness needs the sibling repo and is
  therefore a local or scheduled check.
- **Tests.** `scripts/test-consumer-sync.mjs` covers commit drift, an unvendored
  source file, the `decisions` profile, and profile composition.
- **Consumers** run the local freshness check as a `check:freshness` script;
  `tools/consumer/README.md` documents the modes and wiring.
