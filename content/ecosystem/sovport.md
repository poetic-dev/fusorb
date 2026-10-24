---
title: SovPort
section: ecosystem
order: 5
summary: The self-sovereign wallet and portable identity — a mobile wallet scaffold.
status: draft
---

# SovPort

SovPort is the **self-sovereign wallet and portable identity** of the ecosystem:
a mobile wallet that holds credentials and proves identity against SovGrant.

## Purpose

SovPort is the holder-side credential wallet. It will authenticate, hold SD-JWT
Verifiable Credentials, prove identity via QR-based challenge-response, and manage
self-owned DIDs, all against the SovGrant backend.

## What it owns

- Its native (Expo / React Native) screens and navigation.
- Its own state and token-storage adapter.

## What it does not own

- Web UI components. The Facet component, auth, and layout packages are web-only
  and do not run in React Native; SovPort owns its native screens.
- Identity/access logic; that lives in SovGrant.

## Who consumes it and what it consumes

SovPort consumes the framework-agnostic Facet SDK and the Facet store. It is
consumed by end users once it is built. Its audience is undecided.

## Status

The repo is a blank Expo starter. The SovGrant integration has not been built;
the target architecture is documented in its planning docs.

## Known gaps

- No agent rules file, no CLAUDE pointer, and no CI workflow (see the repo
  structure standard for the baseline).

## Evidence

- `sovport/README.md`
- `sovport/package.json`
- `sovport/docs/`
