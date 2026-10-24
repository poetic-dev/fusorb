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

## Planned

- A naming gate wired into every repo's CI (today only this repo and the vendored
  script exist).
- A consistent local `.agent/` scratch convention (already present in most
  product repos).
