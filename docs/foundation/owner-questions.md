# Owner questions

Decisions the foundation needed from the owner. Resolved items are recorded
below with the answer and date.

## 1. Audience for SovGrant, Relnex, and SovPort

- **Options:** public / internal.
- **Recommendation:** keep internal until each is ready to be described publicly.
- **Blocks:** what the public layer may mention about those products.

**Resolved 2026-10-31:** all three stay internal for now.

## 2. Whether intel.fusorb.com is public or access-controlled

- **Options:** public / access-controlled.
- **Recommendation:** access-controlled, since Intel is internal.
- **Blocks:** the domain-model note for that subdomain.

**Resolved 2026-11-10:** access-controlled (accepted recommendation to avoid
future threats and architectural debt). Recorded in `ecosystem/ecosystem.json`
(`intel.fusorb.com` note).

## 3. Whether the @arcevocirqle social handle is live and stays

- **Options:** live and keep / not live.
- **Recommendation:** confirm live and keep.
- **Blocks:** the live-name set in the naming ledger.

**Resolved 2026-11-10:** the `@arcevocirqle` social handle does not exist. Live
social presence is `@fusorb_hq` on X (formerly Twitter) and the LinkedIn company
page `linkedin.com/company/arcevocirqle` (recorded in the naming ledger's live
entry).

## 4. What to do with the older hyphenated GitHub repo (arcevo-cirqle)

- **Options:** archive / redirect / leave.
- **Recommendation:** archive with a redirect note.
- **Blocks:** repo hygiene for the public org.

**Resolved 2026-11-10:** the hyphenated repo was deleted from the public GitHub
profile; any local copy is handled separately. No further repo-hygiene action
required here.

## 5. Whether the two foundation repos transfer from poetic-dev to the fusorb org, and when

- **Options:** transfer now / later / never.
- **Recommendation:** transfer once fusorb.com is secured.
- **Blocks:** the repo `org` field in ecosystem.json.

**Resolved 2026-11-10:** both foundation repos stay in `poetic-dev` for now (as
on GitHub). A future move (e.g. when ArcevoCirqle fully evolves into Fusorb HQ,
possibly merging this repo into a fusorb repo) may be revisited later; `ecosystem/ecosystem.json` remains unchanged until then.

## 6. Which role fusorb.com root plays once secured

- **Options:** this repo's future site / something else.
- **Recommendation:** this repo's future site.
- **Blocks:** the root domain's role in the domain model.

**Resolved 2026-10-31:** the root hosts this repo's future site.

## 7. Agent-tool files policy

- **Options:** adopt the proposed policy (track `.commandcode/taste/**` only, ignore everything else under `.commandcode/` with the pattern pair `.commandcode/*` + `!.commandcode/taste/` + `!.commandcode/taste/**`) / keep current approach / other.
- **Recommendation:** adopt this policy (default). Evidence: `relnex/.commandcode/settings.json` contains npm view commands referencing a retired scope; machine-specific settings must not be tracked. Tracking only `taste/**` (deliberate, reviewed, shared preferences) is correct.
- **Blocks:** whether to update this repo's `.gitignore` to enforce the pattern pair.

**Resolved 2026-11-10:** track `.commandcode/settings.json` and
`.agent/episodes.md` in this repo (architectural inferences/episode notes),
while keeping other local agent scratch ignored. `.gitignore` and deviations are
updated accordingly. The same intent applies to the sibling public-layer repo
(`arcevocirqle`), to be applied there by that repo's own agent.

## 8. Identity (ADR 0007)

- **Relying party scope:** sovgrant and relnex identity-model docs say "all relying parties - first-party Fusorb products (Relnex, Scholium, Facet, ...) and third-party client systems and products we do not own". "Scholium" appears but is not present as a product id in ecosystem.json. Intel's identity-authority governs [repo("relnex"), repo("sovport")]. Confirm which products are in scope as first-party vs third-party; do not assume new products.
- **Identity bridge details:** Intel seed states "a consumer's User.identityId is the SovGrant Identity.id, and the JWT sub claim is that Identity.id" (sourcePath ecosystem/ecosystem.json). This exact pairing is not present in this repo's files. Confirm this is the canonical ecosystem statement (and its location). ADR 0007 must be self-contained because Intel will extract the ## Decision section verbatim.
- **Shared-secret sunset:** Both copies say SG_JWT_SECRET is temporary/first-party-only and target is JWKS. Confirm the required retirement stance/timeline for ecosystem-level statement.

**Resolved 2026-11-10:** "Scholium" is not a real product in the ecosystem yet
(it is a draft idea only) and must not be added to `ecosystem/ecosystem.json` or
assumed as a relying party. Once SovGrant is fully stable, the shared-secret
(`SG_JWT_SECRET`) shortcut is to be retired in favor of JWKS (owner-confirmed
risk stance; no fixed calendar date set). The identity bridge stated in ADR 0007
(`identityId` references SovGrant `Identity.id`; JWT `sub` is that `Identity.id`)
is the canonical ecosystem statement recorded in this repo (ADR 0007, self-contained
for extraction). First-party systems (e.g. SovGrant, SovPort, Relnex) are planned
to become public only after they are fully stable and running; no new products
are assumed.