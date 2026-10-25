---
title: Ecosystem overview
section: ecosystem
order: 1
summary: The orgs, layers, products, domains, and build sequencing of the Fusorb ecosystem.
status: draft
---

# Ecosystem overview

The ecosystem is a set of orgs, two layers, and five products. The single
machine-readable source for these facts is
[`ecosystem/ecosystem.json`](../../ecosystem/ecosystem.json).

## Organizations

<!-- BEGIN:generated ecosystem.orgs -->
- **fusorb** (`active`) — Canonical architecture org: product repos and the @fusorb npm scope
- **poetic-dev** (`active`) — Current host of the fusorb and arcevocirqle foundation repos (they stay here)
- **ArcevoDev** (`retired`) — Legacy org; inaccessible and unused. Never link to it.
<!-- END -->

## Layers

There are two layers. The Fusorb layer is the architecture layer — this repo and
the product repos. The ArcevoCirqle layer is the public-facing layer and the live
ecosystem.

## Products

<!-- BEGIN:generated ecosystem.products -->
| Id | Name | Role | Audience | Repo |
| --- | --- | --- | --- | --- |
| facet | Facet | The single UI system for the whole ecosystem | public | fusorb/facet |
| sovgrant | SovGrant | Canonical identity and access layer | undecided | fusorb/sovgrant |
| relnex | Relnex | Knowledge, resource and graph system | undecided | fusorb/relnex |
| sovport | SovPort | Self-sovereign wallet and portable identity | undecided | fusorb/sovport |
| intel | Intel | Architectural and engineering intelligence layer | internal | fusorb/intel |
<!-- END -->

## Build sequencing

SovGrant matures first, then Relnex. The exact order and notes live in the
`sequencing` array of the ecosystem file.

## Domains

The full domain model (live vs planned) is in
[domains and deploy](../standards/domains-and-deploy.md).
