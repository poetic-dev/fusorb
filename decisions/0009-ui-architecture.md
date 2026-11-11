---
status: Proposed
date: 2026-11-10
governs: [fusorb, arcevocirqle, facet]
---

# 9. UI architecture for the ecosystem surfaces

## Context

Two surfaces will eventually render this ecosystem: the Fusorb site (this repo's
future root site at `fusorb.com`, once secured) and the ArcevoCirqle public site
(the live `arcevocirqle.com.ng`). Both must present decided facts without becoming
a second source of truth, and both must use the single UI system.

Several decisions already bound the surfaces — this repo's ADRs 0001 (role and
boundary), 0005 (Facet is the only UI system), 0006 (hosting and domain model),
and 0008 (consumer sync by vendored snapshot), plus the ArcevoCirqle layer's own
ADRs 0001–0003 (present, don't define) and 0004 (site platform deferred). What is
not yet recorded is the *architecture* the surfaces are built to: how truth flows
into pages, what a page is, and how the presentation can be replaced without
re-deciding facts. This ADR records that; it does not start a site.

## Decision

The ecosystem adopts a layered, schema-driven UI architecture. Presentation is
replaceable; truth is not.

### Layers

1. **Canonical data.** Decided facts from `ecosystem/ecosystem.json` and
   `ecosystem/naming-ledger.json`, consumed as versioned vendored snapshots with
   provenance (ADR 0008). No page hand-types a decided fact.
2. **Authored content.** Markdown with frontmatter, treated as data — portable,
   diffable, renderable by any future surface — never as framework-specific
   components (ADR 0004).
3. **Presentation.** Thin views composed only from `@fusorb/facet-*` over layers
   1 and 2. Components map data to UI and hold no business truth (ADR 0005).
4. **Delivery.** Hosting and build are an adapter. Prefer static, edge-first,
   content-addressable artifacts so the site outlives any single host or runtime.
5. **Governance.** The gates are the contract, not convention: `pnpm check:all`
   (ecosystem, names, content, ADR, consumer-sync) here, plus each consumer's
   content, boundary, and sync gates.

### Pages are data

A small, stable set of page types — document/standard, ADR, generated ecosystem
view, and narrative — is rendered from layers 1 and 2. New facts and products
flow through data and content, not code forks. Generated views are rendered from
the canonical source with the existing generated-block mechanism, so renames and
additions propagate without hand edits.

### One content model, already enforced

The content model (frontmatter fields and page types) is the one the gates
already enforce; this ADR adds no parallel schema. The content gate is the
spec — a page that is well-formed for the gate is well-formed for the surface.

### Boundaries

Each surface renders only what its repo may show. The Fusorb surface renders
standards, ADRs, and the ecosystem data. The ArcevoCirqle surface renders only
products whose audience is public and only hosts whose status is live (the public
boundary gate). No surface reads a product repo. No surface implies a planned
domain is live (ADR 0006).

### Facet dependency

Surfaces build only on `@fusorb/facet-*`, confined to a thin adapter so a Facet
major is a bounded change. Versions are pinned to a recorded, registry-verified
baseline before launch — for ArcevoCirqle, in its start ADR (ADR 0004); for the
Fusorb site, likewise. No floating or unverified majors at launch.

### Not in scope

This ADR does not start either site, select hosting, plan a cutover, or author
content. Those remain gated — the ArcevoCirqle start decision (ADR 0004) and
securing `fusorb.com` — and are recorded separately.

## Alternatives

- **Per-surface or per-repo UI** — rejected: recreates the duplication the
  ecosystem exists to remove (ADR 0005).
- **Content as framework components (MDX or custom directives)** — rejected:
  couples truth to a renderer and blocks portability (ADR 0004).
- **Hand-typed facts inside pages** — rejected: two sources of truth and drift
  (ADR 0001).
- **A heavyweight runtime or database behind the surfaces** — rejected:
  unnecessary coupling for document-centric sites and it breaks static
  durability.

## Consequences

Presentation can be rewritten or migrated without touching truth. Adding a
product or a domain becomes a data change plus a generated render, not a code
fork. Every surface carries the gates; the public surface additionally carries
the boundary and sync gates. Contributors work with a small, stable set of page
types instead of bespoke pages.

## Verification

- `pnpm check:all` (ecosystem, names, content, ADR, consumer-sync) stays green in
  this repo.
- Consumers keep their own gates (`check:content`, `check:public-boundary`,
  `check:sync`); a surface that violates the layers fails a gate, not a review.
- This ADR is not the site-start decision: the ArcevoCirqle start ADR (0004)
  remains the gate for beginning that site, and securing `fusorb.com` remains the
  gate for this repo's own site.
