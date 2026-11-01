# Identity decision reconciliation

Verified: 2026-11-01 by reading both product copies in full and Intel's seed (read-only).

## Commands used to verify (re-verified)
- cat C:/Users/HP/Desktop/fusorb/sovgrant/docs/identity-model.md | wc -l
- cat C:/Users/HP/Desktop/fusorb/relnex/docs/identity-model.md | wc -l
- grep -rn "identityId\|Identity.id" ecosystem decisions content 2>&1 | tail -15
- grep -rn "ECOSYSTEM_DECISIONS" C:/Users/HP/Desktop/fusorb/intel/packages/ingest/src/decisions.ts | head -2

## Observations
- sovgrant/docs/identity-model.md (88 lines, Status: Accepted 2026-10-31) declares itself a "Mirror" of relnex. relnex/docs/identity-model.md (96 lines) declares itself a "Mirror" of sovgrant. Line diff shows wording diverged.
- Intel ECOSYSTEM_DECISIONS["identity-authority"] (key identity-authority, sourcePath ecosystem/ecosystem.json, governs [repo("relnex"), repo("sovport")], ARCH_REPO_COMMIT 424e31c) states: "SovGrant is the ecosystem's canonical identity and access layer — it owns passwords, MFA, sessions, OAuth, and credentials. Consumers (Relnex, SovPort) delegate authentication to it rather than implementing their own. The identity bridge is fixed: a consumer's User.identityId is the SovGrant Identity.id, and the JWT sub claim is that Identity.id."
- That exact statement is not present anywhere in this repo (grep -rn "identityId\|Identity.id" ecosystem decisions content returns nothing). This repo's decisions/ has no identity ADR at all.
- Product copies mention first-party products (Relnex, Scholium, Facet, SovPort context) and "third-party relying parties"/"external clients" (e.g. "Scholium") not in ecosystem.json. Raised as owner questions.