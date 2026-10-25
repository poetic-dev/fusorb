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
| fusorb.com | planned (before end of 2026) | — | — | hosts this repo's future site once secured |
| facet.fusorb.com | planned | facet | — | — |
| intel.fusorb.com | planned | intel | — | access-controlled |
<!-- END -->

## The model

- A public brand domain is live and hosts the brand and email.
- The Fusorb root domain is planned (not yet secured).
- Products deploy as subdomains of the root domain once it is secured, following
  a per-product pattern. Only the named ones are assigned; the rest are
  unassigned until the owner names them.

## Access control

One planned subdomain (Intel) is access-controlled. It stays out of any public
statement.
