---
title: Intel
section: ecosystem
order: 6
summary: The architectural and engineering intelligence layer — a knowledge graph with provenance.
status: draft
---

# Intel

Intel is the **architectural and engineering intelligence layer**: a knowledge
graph that ingests the other product repos and records entities and relationships
with full provenance.

## Purpose

Intel ingests the active product repos into a PostgreSQL graph, extracts
structured entities and relationships, and tags every fact with provenance and an
evidence level. It is tier-one infrastructure, not a product that ships to end
users.

## What it owns

- The graph schema: repositories, packages, modules, symbols, documents,
  decisions, and relationships.
- The ingest pipeline, retrieval, provider, and read-only tool surface.
- Cross-repo measurement and relationships — the derived facts this repo refuses
  to hand-type.

## What it does not own

- The products' code. It clones and reads them; it never writes to them.
- Any UI. No frontend is planned at this tier.

## Who consumes it and what it consumes

Intel consumes the other product repos by git clone (not by npm). It is consumed
internally for cross-repo questions. Its audience is internal.

## Status

Ingestion, provenance, retrieval, provider, and tools are implemented; an API and
UI are deferred.

## Known gaps

- Its README states that SovGrant imports the retired npm scope, but SovGrant's
  package manifest shows the current scope — a stale cross-repo claim in Intel's
  own documentation.

## Evidence

- `intel/README.md`
- `intel/package.json`
- `intel/AGENTS.md`
- `intel/CLAUDE.md`
- `intel/docs/`
- `intel/.github/workflows/`
