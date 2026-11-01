# Owner questions

These are open decisions the foundation cannot make. Each has options, a
recommendation, and what it blocks.

## 1. Audience for SovGrant, Relnex, and SovPort

- **Options:** public / internal.
- **Recommendation:** keep internal until each is ready to be described publicly.
- **Blocks:** what the public layer may mention about those products.

Resolved 2026-10-31: all three stay internal for now.

## 2. Whether intel.fusorb.com is public or access-controlled

- **Options:** public / access-controlled.
- **Recommendation:** access-controlled, since Intel is internal.
- **Blocks:** the domain-model note for that subdomain.

## 3. Whether the @arcevocirqle social handle is live and stays

- **Options:** live and keep / not live.
- **Recommendation:** confirm live and keep.
- **Blocks:** the live-name set in the naming ledger.

@arcevocirqle social handle does not exist... 
but we have @fusorb_hq X(formerly twitter) handle, 
and a linkedin.com/company/arcevocirqle account

## 4. What to do with the older hyphenated GitHub repo (arcevo-cirqle)

- **Options:** archive / redirect / leave.
- **Recommendation:** archive with a redirect note.
- **Blocks:** repo hygiene for the public org.

I deleted the hyphenated repo from my public github profile, 
we might as well eject it from our local disk, i think i will handle that... 
I don't think it exist anywhere in our local disk...

## 5. Whether the two foundation repos transfer from poetic-dev to the fusorb org, and when

- **Options:** transfer now / later / never.
- **Recommendation:** transfer once fusorb.com is secured.
- **Blocks:** the repo `org` field in ecosystem.json.

i think the foundation repos should stay in the poetic-dev dir, as is on our github profile also...
then, maybe in future, when arcevocirqle fully evolves into fusorbHQ, we might put in our fusorb repo then,
maybe merging this repo with it then, while at it...

## 6. Which role fusorb.com root plays once secured

- **Options:** this repo's future site / something else.
- **Recommendation:** this repo's future site.
- **Blocks:** the root domain's role in the domain model.

Resolved 2026-10-31: the root hosts this repo's future site.

## 7. Agent-tool files policy

- **Options:** adopt the proposed policy (track `.commandcode/taste/**` only, ignore everything else under `.commandcode/` with the pattern pair `.commandcode/*` + `!.commandcode/taste/` + `!.commandcode/taste/**`) / keep current approach / other.
- **Recommendation:** adopt this policy (default). Evidence: `relnex/.commandcode/settings.json` contains npm view commands referencing a retired scope; machine-specific settings must not be tracked. Tracking only `taste/**` (deliberate, reviewed, shared preferences) is correct.
- **Blocks:** whether to update this repo's `.gitignore` to enforce the pattern pair.
- **Status:** Proposed (default = this policy). This repo's `.gitignore` not changed unless confirmed.

## 8. Identity (ADR 0007)
- **Relying party scope:** sovgrant and relnex identity-model docs say "all relying parties - first-party Fusorb products (Relnex, Scholium, Facet, ...) and third-party client systems and products we do not own". "Scholium" appears but is not present as a product id in ecosystem.json. Intel's identity-authority governs [repo("relnex"), repo("sovport")]. Confirm which products are in scope as first-party vs third-party; do not assume new products.
- **Identity bridge details:** Intel seed states "a consumer's User.identityId is the SovGrant Identity.id, and the JWT sub claim is that Identity.id" (sourcePath ecosystem/ecosystem.json). This exact pairing is not present in this repo's files. Confirm this is the canonical ecosystem statement (and its location). ADR 0007 must be self-contained because Intel will extract the ## Decision section verbatim.
- **Shared-secret sunset:** Both copies say SG_JWT_SECRET is temporary/first-party-only and target is JWKS. Confirm the required retirement stance/timeline for ecosystem-level statement.
