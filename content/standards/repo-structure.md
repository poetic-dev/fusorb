---
title: Repo structure
section: standards
order: 2
summary: The minimum baseline every Fusorb repo should meet, derived from the strongest repos.
status: draft
---

# Repo structure

Every Fusorb repo should meet a minimum baseline. This baseline is derived from
what the strongest repos already do; where it is not yet true everywhere, it is
marked planned.

## The baseline

- An agent rules file (AGENTS.md) loaded at the start of every session.
- A thin CLAUDE.md pointing to AGENTS.md and the structure.
- A CI workflow that installs and runs the repo's checks.
- A `decisions/` folder for ADRs.
- A README with purpose, setup, and structure sections.
- A `.gitignore` and, on Windows-authored repos, a `.gitattributes` with LF
  normalization.

## Current gaps (named, not fixed here)

- SovPort has no AGENTS.md, no CLAUDE.md, and no CI workflow.
- Relnex has no CI workflow.

Fixing these belongs to each repo's own agent, not to this repo.

## Sync

- **Vendored snapshot.** Repos that consume fusorb facts use a vendored snapshot under `vendor/fusorb/` with `PROVENANCE.json` (as arcevocirqle does), replacing hand-written `SYNC.md`. `SYNC.md` is **retired**. (See ADR 0008.)
- **Profiles.** What is vendored is selected by profile: `names` (the ledger and the naming gate), `full` (ecosystem data plus the shared libs), and `decisions` (the ADRs). Profiles compose, so `--profile full,decisions` vendors both. A directory entry vendors a whole tree, so a new file — including a new ADR — is picked up without editing the profile.
- **Freshness.** The offline check verifies the vendored bytes alone and is CI-safe. Given the sibling repo, the freshness check additionally fails when the recorded source commit is behind the source, when a profiled source file is not vendored, or when a vendored file has no source. Consumers run it locally or in a scheduled job; usage is documented in `tools/consumer/README.md`.

## Planned

- A naming gate wired into every repo's CI (today only this repo and the vendored
  script exist).
- A consistent local `.agent/` scratch convention (already present in most
  product repos).
