---
title: UI invariant
section: standards
order: 3
summary: Facet is the single UI system; how waivers work and who holds them.
status: draft
---

# UI invariant

**Facet is the single mandatory UI system.** No Fusorb repo builds an independent
UI. Any future web surface consumes `@fusorb/facet-*`.

## Why

The ecosystem exists to stop the same UI being duplicated across repos. A single
component system means one place for tokens, components, auth, and layout.

## Waiver process

A product that cannot use Facet may request a waiver. A waiver names:

- the product,
- the reason Facet cannot be used today,
- the migration plan, and
- the owner who holds the waiver.

A waiver is a deviation, not a resolution. It closes when the product migrates.

## Current deviation

Relnex builds its UI with shadcn instead of Facet. This is a **known deviation in
migration**, with the owner as the waiver holder. It is not resolved: the owner is
moving Relnex to the published Facet packages and has uncommitted work in
progress.

## Effect on this repo

This repo adds no UI dependency now. Any future web surface consumes
`@fusorb/facet-*`.
