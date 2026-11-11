# UI plan

Status: living plan. The durable decisions live in the ADRs; this file is the
plan and the cross-repo handoff for the two ecosystem surfaces. Nothing here
starts a site.

- Decisions: [UI architecture](../decisions/0009-ui-architecture.md) ·
  [UI invariant](../decisions/0005-ui-invariant.md) ·
  [hosting and domain model](../decisions/0006-hosting-and-domain-model.md) ·
  [role and boundary](../decisions/0001-role-and-boundary.md) ·
  [consumer sync](../decisions/0008-consumer-sync.md)
- Standards: [UI invariant](../../content/standards/ui-invariant.md) ·
  [facts and sources](../../content/standards/facts-and-sources.md) ·
  [domains and deploy](../../content/standards/domains-and-deploy.md) ·
  [versioning and releases](../../content/standards/versioning-and-releases.md)

## Scope and non-goals

In scope: the information architecture, the page/content model, the Facet
dependency policy, the cross-cutting qualities, and the phased plan for the two
surfaces.

Out of scope: starting either site, choosing hosting, planning a cutover, or
authoring public copy. Those are gated (see the roadmap and the handoff).

## The two surfaces

- **Fusorb surface** — this repo's future root site at `fusorb.com`, once that
  domain is secured (see the domain model). It presents decided facts, standards,
  and decision records to developers, organizations, and integrators. It is the
  architecture layer's own face; it decides nothing new at render time.
- **ArcevoCirqle surface** — the public site at the live `arcevocirqle.com.ng`.
  It presents and links; it never defines. It renders only public-audience
  products and only live hosts.

Both consume truth the same way; they differ only in which facts they are allowed
to show.

## Invariants

These must hold for the life of the system and are owned by the linked records,
not restated here:

- One UI system. Every surface consumes `@fusorb/facet-*` only.
- Present, don't define. Decided facts come from `ecosystem/`, never hand-typed
  into pages.
- One owner per fact. Decided (this repo), derived (product repos, Facet
  registry, Intel), authored (content).
- No implied liveness. A planned domain is never shown as live.
- Links, not copies. Facts are recorded once and linked.

## Layering

The architecture is five layers so any layer can be replaced without corrupting
truth (recorded in [ADR 0009](../decisions/0009-ui-architecture.md)):

| Layer | Owns | Consumed as |
| --- | --- | --- |
| Canonical data | `ecosystem/ecosystem.json`, `naming-ledger.json` | vendored snapshot with provenance |
| Authored content | Markdown + frontmatter | data, not components |
| Presentation | `@fusorb/facet-*` compositions | thin views over the two layers above |
| Delivery | hosting and build | a replaceable adapter, static-first |
| Governance | the gates | the contract that keeps it all true |

## Information architecture — Fusorb surface

Stable, URL-safe, document-centric:

- **Orientation** — charter, principles, layer model, glossary
  (`content/foundation/`).
- **Ecosystem** — orgs, layers, products, domains, and sequencing, rendered from
  `ecosystem.json` with generated blocks (the same source the standards render
  from).
- **Standards and protocols** — naming, repo structure, UI invariant,
  facts/sources, domains/deploy, versioning/releases, agent protocol, integrators.
- **Decisions** — the ADR index and detail; an immutable, traceable record of
  why.
- **Evidence pointers** — links to dated evidence; measurements are never
  restated.

Audience and posture: written for developers, organizations, and integrators.
Access-controlled surfaces (for example the planned Intel subdomain) are never
linked as public.

## Information architecture — ArcevoCirqle surface

Public-safe, and only what the boundary permits:

- **Home / About** — owner-authored public identity and mission (currently a
  draft seed).
- **Ecosystem** — a generated view of public products from the vendored
  snapshot, filtered to audience public and live hosts.
- **Community and Contact** — owner-authored channels and addresses only, from
  resolved facts; nothing invented.
- **Legal** — privacy and terms, owner/counsel-authored before publish.
- **Provenance** — an optional, subtle "last synced" disclosure of snapshot
  provenance, so "presents, don't define" is auditable in public without exposing
  internals.

Publication model: frontmatter `status` and `visibility` are enforced by gates;
nothing promotes to public without explicit owner action.

## Page and content model

The model is whatever the gates enforce — this plan does not invent a parallel
schema. Today that is:

- **Content frontmatter (this repo):** `title`, `section`, `order` (a number),
  `summary`, `status` in `draft | reviewed | planned`. Pages start at `draft`.
- **Content frontmatter (the public layer):** the same fields plus `visibility`
  in `draft | public`.
- **ADRs:** `status`, `date`, `governs`, with the sections Context, Decision,
  Alternatives, Consequences, Verification; numbering is contiguous.
- **Generated views:** blocks delimited by `<!-- BEGIN:generated ... -->` and
  `<!-- END -->`, rendered from the canonical source.

Page types are a small, closed set: index, foundation (charter/principles/
glossary), standard/protocol, ecosystem (generated), decision (ADR), narrative
(public about/community/contact), legal, and integrator. A new page chooses an
existing type; a new type is a schema change, recorded, not a one-off page.

## Facet dependency and upgrade policy

- Pin to declared, registry-verified `@fusorb/facet-*` versions recorded in the
  relevant start decision; no floating or unverified majors at launch.
- Adopt releases deliberately, following the versioning and releases standard and
  the naming ledger. A breaking rename is adopted together with every package
  listed in the ledger's `adoptWith`, in one change.
- Confine all Facet primitives to a thin adapter so a Facet major is a bounded
  change. Keep domain and content logic framework-agnostic.
- No waivers by default. An exception needs the documented waiver (product,
  reason, migration plan, owner) and is temporary.

## Cross-cutting qualities

- **Accessibility and semantics** — semantic HTML, keyboard and screen-reader
  support, contrast and performance budgets. Non-negotiable; Facet should encode
  them and surfaces must not regress them.
- **Internationalization-ready** — strings separated from layout, stable content
  keys, date and number neutrality, even while single-locale.
- **Progressive enhancement and durability** — core content readable with minimal
  client dependency; truth never coupled to client-only state; artifacts carry
  explicit provenance.
- **Security and trust** — no secrets or personal data in a public repo; strict
  boundary gates; access-controlled surfaces never linked publicly; pinned
  dependencies.
- **Observability of truth** — build-time assertions that rendered output matches
  the snapshot and the boundary; fail closed on drift.
- **Evolution** — additive schemas, versioned content types, and
  migration-friendly ADRs, so future products plug in without redesign.

## Phased roadmap

Each phase names its entry gate; no phase starts before the prior gate clears.

- **Phase 0 — Align and decide (now, no UI dependency).** Close the public
  layer's owner inputs #1, #2, and #4 and record its site-start ADR (Facet
  baseline, host, DNS/email-safe cutover, ready content). Confirm the Fusorb
  root-site hosting and cutover when `fusorb.com` is secured. Lock the minimal
  Facet package baseline.
- **Phase 1 — Foundations (scaffolds, Facet-only).** Create the site workspace(s)
  with CI gates (names, content, boundary, sync, no non-Facet UI dependency,
  frozen lockfile). Implement the data loaders: this repo reads `ecosystem/` plus
  `content/`; the public layer reads the vendored snapshot plus its authored
  content, with visibility filtering.
- **Phase 2 — Content and systemization.** Define the small set of page templates
  and a Facet token/type/layout baseline; wire the generated views so data drives
  pages.
- **Phase 3 — Public-safe launch (public layer).** Owner-authored about, legal,
  and contact complete; boundary checks green; provenance surfaced; DNS/email-safe
  deploy to `arcevocirqle.com.ng`; only public, live facts rendered.
- **Phase 4 — Fusorb site and hardening.** Deploy to `fusorb.com` once secured;
  add accessibility and internationalization hardening, performance budgets, and
  documented upgrade playbooks for Facet majors and snapshot evolution.
- **Phase 5 — Operate and evolve.** Routine `sync:fusorb` and regeneration in CI,
  periodic Facet upgrades, and ADR-governed changes. The system stays correct by
  gates, not memory.

## Handoff — ArcevoCirqle (applied by that repo's own agent)

Per this repo's boundary and owner question 7, cross-repo changes are applied by
the target repo's own agent. The public layer's agent should do the following
there; nothing below is decided in that repo by this file.

### Site-start ADR skeleton (new file in the public layer's `decisions/`, status Proposed)

It must use the repo's ADR template and the five required sections, and address
exactly what ADR 0004 requires:

- **Context** — the site is being started now; the deferral (ADR 0004) is being
  closed; the owner inputs it depended on are resolved.
- **Decision** — the required `@fusorb/facet-*` versions available on npm (the
  pinned baseline); the chosen hosting provider; the DNS and email-safe cutover
  plan for `arcevocirqle.com.ng` (the domain also carries email); the set of
  owner-authored content that is ready to publish; the page types and provenance
  disclosure to be used.
- **Alternatives** — starting earlier on a placeholder stack; a non-Facet stack
  (both rejected under the UI invariant and the deferral).
- **Consequences** — the site becomes buildable; the public boundary and
  visibility gates become load-bearing at launch; the live domain is now served
  by the app.
- **Verification** — the frozen lockfile proves no non-Facet UI dependency; the
  content, boundary, and sync gates run in CI; the cutover plan is DNS/email-safe.

### Required owner inputs before that ADR can leave draft

- #1 Public wording for the about page.
- #2 Authors and contact addresses, plus which addresses may be published.
- #4 Hosting provider and the DNS/email-safe cutover plan.

(Inputs #3, #5, and #6 are already answered and consumed from the vendored
snapshot.)

### Schema note for the public layer

Its content model already adds `visibility` to the shared frontmatter and it
generates the public-products block from the vendored snapshot. That is the
model the surface should render; keep it, and add page types rather than new
fields.

## Open inputs

Blocking the public layer's start decision: its owner inputs #1, #2, and #4.

Blocking this repo's own site: securing `fusorb.com`.
