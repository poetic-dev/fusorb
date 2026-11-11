# Consumer sync tool

`sync-fusorb.mjs` keeps a consumer repo's `vendor/fusorb/` snapshot of fusorb
facts in step with the fusorb repo. It is dependency-free, Windows-safe, and
configures itself only from `profiles.json`. See ADR 0008 for the decision behind
it.

## Modes

| Command | What it does |
| --- | --- |
| `node tools/consumer/sync-fusorb.mjs --from <fusorb> [--profile <names>]` | Copy the profiled files into `vendor/fusorb/` and (re)write `PROVENANCE.json` with the source commit, sync time, and a SHA-256 per file. |
| `node tools/consumer/sync-fusorb.mjs --check [--profile <names>]` | Offline: verify the vendored bytes against `PROVENANCE.json` and that the manifest and the vendored tree agree. CI-safe, needs no sibling repo. |
| `node tools/consumer/sync-fusorb.mjs --check --from <fusorb> [--profile <names>]` | Freshness: the offline checks, plus the snapshot must match the live source repo. |

## Freshness

`--check` alone only proves **self-consistency** (`vendor/` vs `PROVENANCE.json`);
it cannot see a change in the live fusorb repo. Given the sibling repo,
`--check --from <fusorb>` is a **freshness** check and additionally fails when:

- `PROVENANCE.sourceCommit` differs from the source repo's HEAD (commit drift),
- a profiled source file is not vendored (for example a new decision), or
- a vendored file has no source in the selected profile.

Freshness needs the fusorb repo present, so run it locally, or in a scheduled job
where the sibling repo is available. The offline `--check` is the CI-safe one.

## Profiles

Select what is vendored with `--profile`. Profiles compose, so
`--profile full,decisions` vendors both sets.

| Profile | Contents |
| --- | --- |
| `names` | The naming ledger, the names gate, and its two libs (`fs-walk`, `glob`). Minimal, for repos that only need naming enforcement. |
| `full` | Ecosystem data (`ecosystem.json`, `naming-ledger.json`) plus the names gate and all shared libs. |
| `decisions` | The ADRs (`decisions/**`). For consumers that vendor the decision record. |

An entry in a profile is a file mapping `{ src, dst }` or a directory mapping
`{ srcDir, dstDir }`. A directory expands to every file under it with relative
paths preserved, so a new file — including a new ADR — is picked up without
editing the profile.

## Wiring into a consumer

In the consumer's `package.json`:

```json
{
  "scripts": {
    "sync:fusorb": "node tools/consumer/sync-fusorb.mjs",
    "check:sync": "node tools/consumer/sync-fusorb.mjs --check",
    "check:freshness": "node tools/consumer/sync-fusorb.mjs --check --from ../fusorb"
  }
}
```

`PROVENANCE.json` holds no org names or local paths, so it is portable between
machines and repos.
