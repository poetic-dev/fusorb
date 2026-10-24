---
title: SovGrant
section: ecosystem
order: 3
summary: The canonical identity and access layer — a sovereign, multi-tenant identity and access management engine.
status: draft
---

# SovGrant

SovGrant is the **canonical identity and access layer** of the ecosystem: a
sovereign, multi-tenant identity and access management engine. It issues and
verifies credentials, federates identity, and enforces tenant policy.

## Purpose

SovGrant is the identity backbone. A verified attribute is issued once, held by
the individual, and reused across sectors, instead of every institution
re-verifying the same facts. It is a Fastify + PostgreSQL (Prisma) backend with a
Next.js admin dashboard.

## What it owns

Authentication (password, passkeys, TOTP, magic links, social), OAuth and OIDC,
Verifiable Credentials (SD-JWT) with did:web and did:key resolution, multi-tenancy
and RBAC, external identifiers, webhook delivery, subscription billing, and audit
logging.

## What it does not own

- UI primitives. SovGrant consumes the published `@fusorb/facet-*` packages and
  keeps no local UI primitives to maintain.

## Who consumes it and what it consumes

SovGrant consumes the published Facet packages. It is consumed by Facet's SDK
(as its backend contract), by SovPort (as its identity backend), and by Relnex
(auth is delegated to SovGrant). It is sequenced to reach maturity first.

## Status

Backend capabilities are implemented and the frontend is migrated to the
published Facet packages. Its audience is undecided, so the public layer must not
describe it yet.

## Known gaps

- The README and the agent handbook report different test totals for the same
  snapshot; those are derived facts owned by the repo and are not restated here.
- The v2 roadmap still names the wallet product by its retired name (see the
  naming ledger).
- The SDK singleton locally aliases the published client identifier to the new
  name, confirming the published SDK still ships the pre-rename identifier.

## Evidence

- `sovgrant/README.md`
- `sovgrant/package.json`
- `sovgrant/AGENTS.md`
- `sovgrant/CLAUDE.md`
- `sovgrant/src/sdk/index.ts`
- `sovgrant/.gitattributes`
- `sovgrant/docs/planning/`
- `sovgrant/.github/workflows/`
