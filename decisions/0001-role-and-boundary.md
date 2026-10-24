---
status: Proposed
date: 2026-10-24
governs: [fusorb]
---

# 1. Role and boundary of this repo

## Context

The Fusorb ecosystem has several repos but no single place that records what is
decided. Decisions were drifting across READMEs and roadmaps.

## Decision

This repo is the canonical record of decided ecosystem facts and standards. It
records decisions; it does not record measurements. It adds no application or UI
code, and it does not edit product repos.

## Alternatives

- Put the decided facts in each product repo — rejected: no single source of
  truth, and drift returns.
- Put the decided facts in Intel — rejected: Intel owns measurement and
  relationships, not the decisions themselves.

## Consequences

Decided facts have one home. Anything that belongs elsewhere is linked, not
copied.

## Verification

`pnpm check:content` fails when a derived fact (a measurement) is hand-typed in
authored text, keeping this repo within its boundary.
