---
status: Proposed
date: 2026-11-01
governs:
  - sovgrant
  - relnex
  - sovport
---

# 7. SovGrant is the canonical identity provider

## Context

Multiple Fusorb products need user accounts; third-party client systems may also need accounts. Without a single identity provider, credentials and sessions fragment across services. Two product copies (sovgrant/docs/identity-model.md and relnex/docs/identity-model.md) both state SovGrant as the canonical IdP but have diverged in wording (see docs/foundation/identity-decision-reconciliation.md). Intel's ingest seeded an identity-authority decision citing `ecosystem/ecosystem.json` with a bridge statement that this ADR now records canonically in-repo.

Product copies mention first-party products and "third-party relying parties" (including names not present as product ids in `ecosystem/ecosystem.json`, e.g. a draft idea called "Scholium"). Such names are not ecosystem products unless/until added to `ecosystem/ecosystem.json`; no new products are assumed here. Both copies agree shared-secret verification is temporary and JWKS is the target.

## Decision

**SovGrant is the single Identity Provider (IdP) for the ecosystem.** Every consumer (first-party and third-party relying parties) delegates authentication to SovGrant and never owns credentials. The integration contract is **OIDC**. New relying parties integrate as **OIDC clients** using authorization code with PKCE.

- **Canonical ownership:** SovGrant owns identity, credentials (password/WebAuthn/passkeys/MFA), sessions/tokens, federation, consent, lifecycle, and org/tenant membership, roles, and scopes. Relying parties do **not** treat cached identity attributes as authoritative.
- **Relying parties:** A relying party is a consumer of SovGrant identity. It keys local data by a reference to the canonical identity (`identityId`/reference; no foreign key required). It may keep a local projection (product profile/preferences) keyed by that reference, but must not mirror identity attributes as authority.
- **Token verification:** Relying parties verify tokens **locally via JWKS** (SovGrant issues; relying parties verify). Shared-secret verification (`SG_JWT_SECRET`) is a **temporary, first-party-only** shortcut and must be retired in favor of JWKS for all relying parties once SovGrant is fully stable (owner-confirmed 2026-11-10; no fixed calendar date).
- **Bridge (canonical):** The canonical identity reference is the SovGrant `Identity.id`; consumers reference it as `identityId`. The JWT `sub` claim is that `Identity.id`. This statement is canonical in this repo.
- **Sync:** Relying-party projections stay consistent with SovGrant **one-way via webhooks** (identity created/suspended/deleted/updated). Identity-level account management must route through SovGrant; identity-settings must have a single canonical surface at SovGrant (relying parties link, not re-host).
- **Classes:** First-party and third-party relying parties both use the OIDC contract; third-party clients use the public OIDC surface only, are consent- and scope-gated, and get no privileged access. First-party may use shared UI/SDK convenience on top while still dogfooding the contract.
- **Scopes/roles:** Membership, roles, and scopes meaningful across systems are canonical in SovGrant; relying parties keep only local, non-identity roles.

This ADR records the ecosystem-level decision. In-scope relying parties are the consumers governed by this ADR (currently SovGrant, Relnex, SovPort per frontmatter) and other relying parties that adopt the OIDC contract; names not present as product ids in `ecosystem/ecosystem.json` (e.g. draft ideas such as "Scholium") are not assumed. See docs/foundation/owner-questions.md for the recorded owner answers. Product repos retain implementation detail and must link to this ADR.

## Alternatives

- Each product owns credentials/sessions — rejected: fragmentation, drift, inconsistent security posture.
- Shared secret for all — rejected: long-term, use JWKS.

## Consequences

SovGrant is the load-bearing identity authority. Relying parties must implement the OIDC+JWKS contract, key by identity reference, and route identity operations to SovGrant. Intel and consumers must align to this contract.

## Verification

- Reconciled against sovgrant/docs/identity-model.md and relnex/docs/identity-model.md (see docs/foundation/identity-decision-reconciliation.md).
- governs restricted to ids that exist in ecosystem.json (sovgrant, relnex, sovport).
