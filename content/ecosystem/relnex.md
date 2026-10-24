---
title: Relnex
section: ecosystem
order: 4
summary: The knowledge, resource, and graph system — a content engine in mid-migration.
status: draft
---

# Relnex

Relnex is the **knowledge, resource, and graph system** of the ecosystem: a
content engine where users create, organize, and discover resources connected by
typed relations. Auth is delegated to SovGrant.

## Purpose

Relnex manages knowledge resources (articles, notes, videos) and their
relationships. It is a Next.js app on Prisma/PostgreSQL with Tailwind v4 and a
shadcn-based UI.

## What it owns

- The content/knowledge domain model and its flows, services, and repositories.
- Its own route handlers (thin, delegating to domain flows).

## What it does not own

- Identity and auth. Those are delegated to SovGrant; Relnex keeps only a bridge
  to the SovGrant identity.

## Who consumes it and what it consumes

Relnex consumes SovGrant (for auth) and, for UI, the shadcn stack. It does not
yet consume the Facet packages — that is the in-flight migration. It is sequenced
to mature after SovGrant.

## Status

Relnex is **mid-migration**: the owner is moving it to the published Facet
packages, with uncommitted work in progress. Agents must not touch Relnex until
the owner says the migration is done. Its audience is undecided.

## Known gaps

- Its README is still titled under a retired name while the package declares
  `relnex` (see the naming ledger).
- Its README states a previous Next.js major while the package manifest pins a
  later one.
- Its README references a retired org and a retired identity-service name.
- It builds UI with shadcn rather than Facet — a known deviation of the UI
  invariant, currently in migration (see the UI invariant standard).

## Evidence

- `relnex/README.md`
- `relnex/package.json`
- `relnex/AGENTS.md`
- `relnex/CLAUDE.md`
- `relnex/docs/`
