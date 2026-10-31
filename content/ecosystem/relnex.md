---
title: Relnex
section: ecosystem
order: 4
summary: The knowledge, resource, and graph system — a content engine now on the published Facet packages.
status: draft
---

# Relnex

Relnex is the **knowledge, resource, and graph system** of the ecosystem: a
content engine where users create, organize, and discover resources connected by
typed relations. Auth is delegated to SovGrant.

## Purpose

Relnex manages knowledge resources (articles, notes, videos) and their
relationships. It is a Next.js app on Prisma/PostgreSQL with the published Facet
packages for its UI.

## What it owns

- The content/knowledge domain model and its flows, services, and repositories.
- Its own route handlers (thin, delegating to domain flows).

## What it does not own

- Identity and auth. Those are delegated to SovGrant; Relnex keeps only a bridge
  to the SovGrant identity.
- UI primitives. Relnex consumes the published `@fusorb/facet-*` packages and
  keeps no local UI primitives to maintain.

## Who consumes it and what it consumes

Relnex consumes SovGrant (for auth) and the published Facet packages for its UI.
It is sequenced to mature after SovGrant.

## Status

Relnex is **migrated**: it consumes the published Facet packages, its UI is
Facet-based, and its repo carries the current name. Development is then paused
while SovGrant stabilizes; the backend is stabilized and the app builds. Its
audience is internal, so the public layer must not describe it yet.

## Evidence

- `relnex/README.md`
- `relnex/package.json`
- `relnex/AGENTS.md`
- `relnex/CLAUDE.md`
- `relnex/docs/`
