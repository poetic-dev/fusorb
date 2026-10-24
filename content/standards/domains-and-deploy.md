---
title: Domains and deploy
section: standards
order: 7
summary: The domain model — live vs planned — and how products deploy as subdomains.
status: draft
---

# Domains and deploy

The domain model has one rule: **never imply a planned domain is live**. Status
is recorded everywhere (live or planned). This file holds no hand-typed host
names; the table below is generated from `ecosystem.json`.

## Domain model

<!-- BEGIN:generated ecosystem.domains -->
| Host | Status | Serves | Uses | Note |
| --- | --- | --- | --- | --- |
| arcevocirqle.com.ng | live | — | email, arcevocirqle public site (to be deployed) | — |
| fusorb.com | planned (before end of 2026) | — | — | — |
| facet.fusorb.com | planned | facet | — | — |
| intel.fusorb.com | planned | intel | — | audience of this deployment is undecided |
<!-- END -->

## The model

- A public brand domain is live and hosts the brand and email.
- The Fusorb root domain is planned (not yet secured).
- Products deploy as subdomains of the root domain once it is secured, following
  a per-product pattern. Only the named ones are assigned; the rest are
  unassigned until the owner names them.

## Undecided

Whether one planned subdomain is publicly reachable or access-controlled is
undecided. It stays out of any public statement until the owner decides.
