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
- Never touch Relnex until the owner says its migration is done.

## Branching and commits

- Branch per task.
- Never push; never touch main.

## Verification

- Verify against code, not roadmaps or README claims.
- Run the gates (`pnpm check:all`) before considering work done.

## Local scratch

- Use the local-only `.agent/` directory for planning output and the live
  dashboard. `.agent/` is gitignored and never committed.
