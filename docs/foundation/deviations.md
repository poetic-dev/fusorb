# Deviations

Spec deviations from the target structure (§5) and seed data (§6), with reason
and evidence. Anything not listed here matches the spec.

## 1. No `pnpm-workspace.yaml`

§5 allows it "only if needed". There are no workspace packages yet — `scripts/`
is dependency-free `.mjs` run directly by `node`, and `apps/*` does not exist
until the first app. Nothing to declare.

## 2. `.gitignore` also ignores `/.commandcode/`

§5 requires `.agent/` to be ignored (it is). `.commandcode/` is the local agent
tool state for this machine and is ignored for the same reason.

## 3. `packageManager` stays at pnpm 12.4.1

§5 says "use the same pnpm major as the facet repo and record the exact version".
Facet pins pnpm 12.4.0; the installed pnpm here is 12.4.1 (same major 12). The
exact installed version is recorded. Restoring 12.4.0 is a one-line revert if the
owner prefers it.

## 4. The naming gate skips generated blocks

§6.2 lists the allowlist and `legacy-ok` as the exemptions. The generated blocks
(`<!-- BEGIN:generated ... -->` … `<!-- END -->`) render the allowlisted
canonical source (`ecosystem.json`), which includes the retired org name. Without
skipping generated blocks, the generated orgs table would fail the naming gate on
a name that is itself a decided fact. The skip is scoped to generated blocks only;
authored prose is still fully scanned.

## 5. `legacy-ok` markers in the versioning standard

§4 requires the dated npm evidence (including the retired npm scope and the
pending identifiers) to be recorded in `content/standards/versioning-and-releases.md`.
That file is not in the §6.2 allowlist, so the specific evidence lines carry the
`legacy-ok` marker that §6.2 defines for exactly this case.
