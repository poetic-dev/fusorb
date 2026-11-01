---
title: Agent protocol
section: standards
order: 6
summary: Rules for agents working across the Fusorb repos.
status: draft
---

# Agent protocol

These rules apply to AI agents working in the Fusorb ecosystem. CommandCode is
the agent in use today.

## Session boundaries

- Open sessions inside the repo being changed.
- Sibling and product repos are read-only unless the task is for that repo.
- Never write, commit, install, build, or run scripts outside the repo being
  changed.

## Naming first

- Consult the naming ledger before any rename.
- Never apply a rename to a repo without a ledger entry.

## Branching and commits

- Branch per task.
- Never push; never touch main.

## Verification

- Verify against code, not roadmaps or README claims.
- Run the gates (`pnpm check:all`) before considering work done.

## Local scratch

- Use the local-only `.agent/` directory for planning output and the live
  dashboard. `.agent/` is gitignored and never committed.

## Agent-tool files

- **Track deliberately.** `.commandcode/taste/**` must remain tracked (deliberate, reviewed, shared preferences). 
- **Ignore everything else under `.commandcode/`.** All other paths under `.commandcode/` (settings, runtime state, caches, logs) are machine-specific and can go stale. As demonstrated by `relnex/.commandcode/settings.json` containing npm view commands for `@fusorb/...` references in historical context (retired scope usage), machine-specific settings must not be tracked.
- **`.gitignore` pattern pair (to enforce).** Ignoring the directory itself would also hide `taste/`. Use a pattern pair that ignores contents but re-includes `taste/`:
  ```gitignore
  .commandcode/*
  !.commandcode/taste/
  !.commandcode/taste/**
  ```
  In this repo, do **not** change `.gitignore` unless the owner confirms; if unchanged, state that explicitly. Owner question `agent-files` is added for confirmation (default: this policy).
- **Verification.** Use `git check-ignore -v` on sample paths in a temp repo to prove the pattern pair works as intended.
