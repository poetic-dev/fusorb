# Identity decision reconciliation

Verified: 2026-11-01 by reading both product copies in full and Intel's seed (read-only). Updated 2026-11-10 to reflect owner answers recorded in `docs/foundation/owner-questions.md`.

## Commands used to verify (re-verified)
- `cat C:/Users/HP/Desktop/fusorb/sovgrant/docs/identity-model.md | wc -l`
- `cat C:/Users/HP/Desktop/fusorb/relnex/docs/identity-model.md | wc -l`
- `grep -rn "identityId\|Identity.id" ecosystem decisions content 2>&1 | tail -15`
- `grep -rn "ECOSYSTEM_DECISIONS" C:/Users/HP/Desktop/fusorb/intel/packages/ingest/src/decisions.ts | head -2`

## Observations
- sovgrant/docs/identity-model.md (88 lines, Status: Accepted 2026-10-31) declares itself a "Mirror" of relnex. relnex/docs/identity-model.md (96 lines) declares itself a "Mirror" of sovgrant. Line diff shows wording diverged.
- Intel ECOSYSTEM_DECISIONS["identity-authority"] (key identity-authority, sourcePath ecosystem/ecosystem.json, governs [repo("relnex"), repo("sovport")], ARCH_REPO_COMMIT 424e31c) states: "SovGrant is the ecosystem's canonical identity and access layer — it owns passwords, MFA, sessions, OAuth, and credentials. Consumers (Relnex, SovPort) delegate authentication to it rather than implementing their own. The identity bridge is fixed: a consumer's User.identityId is the SovGrant Identity.id, and the JWT sub claim is that Identity.id."
- That bridge statement is now recorded canonically in this repo in [ADR 0007](../../decisions/0007-identity-authority.md) (consumers reference SovGrant `Identity.id` as `identityId`; JWT `sub` is that `Identity.id`), making the decision self-contained for extraction.
- Product copies mention first-party products and "third-party relying parties" (including "Scholium") not in `ecosystem/ecosystem.json`. **Owner resolution (2026-11-10):** "Scholium" is a draft idea only, not a real product and not assumed as a relying party; it must not be added to `ecosystem/ecosystem.json`. Shared-secret (`SG_JWT_SECRET`) verification is a temporary first-party-only shortcut to be retired in favor of JWKS once SovGrant is fully stable (no fixed calendar date). See `docs/foundation/owner-questions.md`.