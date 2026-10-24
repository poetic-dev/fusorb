---
status: Proposed
date: 2026-10-24
governs: [fusorb]
---

# 4. Content format

## Context

The content must be consumable by a future docs engine without a rewrite.

## Decision

Content is plain Markdown with frontmatter (title, section, order, summary,
status). No MDX and no custom directives. Pages start at draft; only the owner
promotes them to reviewed.

## Alternatives

- MDX — rejected: couples content to a specific renderer.
- Custom directives — rejected: they would need a custom engine and would not be
  portable.

## Consequences

A later docs engine can consume `content/` directly. The frontmatter carries the
navigation and status needed to render and gate the pages.

## Verification

`pnpm check:content` validates frontmatter and internal links.
