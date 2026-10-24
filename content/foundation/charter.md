---
title: Charter
section: foundation
order: 1
summary: The problem the ecosystem addresses and the layer model that structures it.
status: draft
---

# Charter

## The problem

Identity, credentials, and the knowledge that depends on them are fragmented.
Verification is repeated per institution, the same data is held in many places,
and the tools built to fix this drift apart — names change, scopes overlap, and
repos contradict each other. Fusorb exists to build both the tools and the
practices that keep the solution consistent.

## The layer model

- **Fusorb** is the architecture layer: the product repos and the `@fusorb` npm
  scope. It records what is decided and holds the standards and gates.
- **ArcevoCirqle** is the public layer and the live ecosystem. Its domain is live
  and hosts the public brand.
- **Products** are the repos that build the capabilities: Facet (UI), SovGrant
  (identity), Relnex (knowledge graph), SovPort (wallet), and Intel (cross-repo
  intelligence).

## How the layers relate

The Fusorb layer decides; the products implement; the public layer presents. A
product may be described publicly only when its audience is public. Products
whose audience is undecided stay out of the public layer until the owner decides.

## Authority

This repo is the canonical owner of decided facts. Each product repo owns its
code and its derived facts. Intel owns cross-repo measurement and relationships.
See [facts and sources](../standards/facts-and-sources.md).
