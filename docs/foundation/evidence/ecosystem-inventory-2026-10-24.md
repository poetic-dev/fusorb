# Fusorb Ecosystem Inventory

**Generated:** 2026-10-24
**Method:** Read-only reconnaissance. Evidence read from actual files (package.json, pnpm-workspace.yaml, source, docs, .git config), not from READMEs/roadmaps alone. Git state inspected but never modified. Unverified claims are marked `unverified`.

**Folders inspected:**
- `C:\Users\HP\Desktop\fusorb` — the 5 Fusorb org product repos (GitHub org `fusorb`)
- `C:\Users\HP\Desktop\poetic-dev` — the two new foundation repos (GitHub org `poetic-dev`) plus an unexpected `projects/` subfolder (GitHub org `ArcevoDev`)

---

## 1. Repo map

| Repo | Folder | package.json name | npm scope | Version | GitHub remote | Role | Maturity |
|---|---|---|---|---|---|---|---|
| facet | fusorb/facet | `@fusorb/facet` | `@fusorb/facet-*` | 2.0.0 | github.com/fusorb/facet | UI component system | Mature (14 pkgs) |
| intel | fusorb/intel | `@fusorb/intel` | `@fusorb/intel-*` | 0.1.0 | github.com/fusorb/intel | Knowledge graph (internal) | Early, real code |
| relnex | fusorb/relnex | `relnex` (unscoped) | none (imports `@arcevo/facet-*`) | 0.1.0 | github.com/fusorb/relnex | Knowledge-graph CMS | Early/mid, dirty |
| sovgrant | fusorb/sovgrant | `sovgrant` (unscoped) | consumes `@fusorb/facet-*` | 0.1.0 | github.com/fusorb/sovgrant | Identity/access engine | v1 (claimed) |
| sovport | fusorb/sovport | `sovport` (unscoped) | consumes `@fusorb/facet-*` | 1.0.0 | github.com/fusorb/sovport | Wallet (Expo) | Scaffold |
| fusorb | poetic-dev/fusorb | `fusorb` | — | 1.0.0 | github.com/poetic-dev/fusorb | Product/architecture layer | Empty stub |
| arcevocirqle | poetic-dev/arcevocirqle | `arcevocirqle` | — | 1.0.0 | github.com/poetic-dev/arcevocirqle | Public-facing layer | Empty stub |
| auth-project | poetic-dev/projects/auth-project | `auth` | — | 1.0.0 | github.com/ArcevoDev/auth-project | (out of scope) | n/a |
| nexasync | poetic-dev/projects/nexasync | `nexasync` | — | 0.1.0 | github.com/ArcevoDev/nexasync | (out of scope) | n/a |
| stream-wise | poetic-dev/projects/stream-wise | `stream-wise` | — | 1.0.0 | github.com/ArcevoDev/stream-wise | (out of scope) | n/a |

---

## 2. Per-repo findings

### facet (`@fusorb/facet`)
- **Purpose as code shows it:** domain-customizable auth-first component system (package.json description, README, `packages/*`). Code and README agree — no mismatch.
- **Stack:** pnpm 12.4.0 workspaces (`packages/*`, `apps/*`), Turborepo, Changesets, TypeScript strict, Node >= 22, Vitest, Vite, tsup, ESLint 9. MIT license.
- **Layout:** 14 packages (auth, cli, components, docs, emails, layout, motion, native, registry, sandbox, sdk, store, tokens, utils) + 3 apps (docs, landing, playground). Evidence: `packages/` and `apps/` directories.
- **Published names/scope:** `@fusorb/facet-*` (all). `registry` is `private`. Evidence: `packages/*/package.json`, `pnpm-workspace.yaml`. Actual npm publication is `unverified` (README claims a Changesets -> GitHub Actions publish flow; `.github/workflows/ci-cd.yml`).
- **Arc-prefixed names:** 39 occurrences / 13 files — almost all in `CHANGELOG.md` files, `changeset.md`, and `.changeset/rename-arcid-to-sg.md`. Not in active source. Evidence: `.changeset/rename-arcid-to-sg.md`, `packages/*/CHANGELOG.md`, `apps/docs/src/data/changelog.ts`.
- **Dependencies (graph):** leaf — depends on no other ecosystem repo; publishes `@fusorb/facet-*` consumed by sovgrant/sovport/relnex.
- **Docs/standards/CI/agent:** `AGENTS.md`, `CLAUDE.md`, `.commandcode/`, `.github/workflows/ci-cd.yml`, ADRs at `docs/rebuild/adr/0000-ADRS.md` (MADR format, status "Proposed"), `docs/rebuild/00-inventory.md`, `.changeset/`.
- **User-facing vs internal:** packages are public-facing; `apps/landing` + `apps/docs` are public sites; `registry` is private/internal.
- **Maturity:** mature; 14 packages with full test/build/typecheck. Note a count drift: README says "112 components", ADR-001 says "113 panels", intel README says "114 components" (last commit message: "correct component/workspace counts").
- **Git:** branch `main`, 0 uncommitted, last `3cebca6` (2026-10-24).

### intel (`@fusorb/intel`)
- **Purpose as code shows it:** knowledge graph / ingestion + evidence provenance ("tier-1 infrastructure", not end-user). Code and README agree. Evidence: `packages/ingest`, `packages/retrieval`, `schemas/graph.prisma`.
- **Stack:** pnpm workspaces (`packages/*`), Prisma 7 + PostgreSQL (adapter-pg), TypeScript strict, tsx, tsup, Vitest. Node >= 22.
- **Published names/scope:** `@fusorb/intel-*` (evidence, graph, ingest, provider, retrieval, tools). Evidence: `packages/*/package.json`. Publication to npm is `unverified`.
- **Arc-prefixed names:** 14 occurrences / 3 files — all documentation of the rename, not live identifiers. Evidence: `README.md` (7), `scripts/verify.ts` (5), `packages/retrieval/test/retrieval.test.ts` (2).
- **Dependencies (graph):** consumes facet, sovgrant, relnex, sovport via `git clone` in the ingest pipeline (not npm). Evidence: `packages/ingest/src/ingest.ts`, `package.json` `ingest:all` script.
- **Docs/standards/CI/agent:** `AGENTS.md`, `CLAUDE.md`, `.commandcode/`, `.github/workflows/anthropic-wif-test.yml`, `docs/api-contract.md`, `schemas/graph.prisma`.
- **Maturity:** early (0.1.0) but real: ingestion + retrieval + tests present. Deferred: API/console surface, symbol tools, embeddings, agentic loop, any UI.
- **Git:** branch `main`, 3 uncommitted, last `104b3fb` (2026-09-29).

### relnex
- **Purpose mismatch (flag):** `package.json` name is `relnex` (unscoped), but `README.md` title is **"Arcbase"** and `docs/architecture.md` title is **"Arcbase Architecture"**. README also says "Next.js 15", but `package.json` pins `next 16.3.4` (stale doc).
- **Stack:** Next.js 16 (App Router, Turbopack), Prisma 7, PostgreSQL (adapter-pg), shadcn/ui + Tailwind v4, AWS S3, Upstash Redis, pino, husky + lint-staged.
- **Layout:** single app (not a monorepo; `pnpm-workspace.yaml` has no `packages:` glob).
- **Arc-prefixed names (largest offender):** 426 occurrences / 55 files. Key clusters: `src/lib/arcid/` (client.ts 32, index.ts 2), `docs/arcbase-roadmap.md`, `.env.arcid.example` (10), `.env.example` (9), `scaffold.js` (141), `.agent/AUDIT.md` (43), plus `@arcevo/facet-*` imports across `src/`.
- **Dependencies (graph):** imports `@arcevo/facet-tokens|store|sdk|components|layout|auth` (OLD scope) in source — e.g. `src/stores/*.store.ts`, `src/components/auth/*`, `src/lib/facet/*`, `src/app/(auth)/*`. **Flag:** `package.json` does NOT declare any `@arcevo/facet-*` dependency, so these imports are undeclared (build/resolution status `unverified`). Also depends on external `arc-id` (ArcevoDev) identity service — evidence `README.md`, `docs/architecture.md` ("Auth delegated to Arc-ID"), `src/lib/arcid/client.ts`.
- **Docs/standards/CI/agent:** `AGENTS.md`, `CLAUDE.md`, `.commandcode/`, `.husky/`, `docs/architecture.md`, `docs/arcbase-roadmap.md`. **No `.github/workflows/` (empty).**
- **Maturity:** early/mid; "rebuild in progress", auth delegated to SovGrant (per intel README). Uses shadcn/ui instead of `@fusorb/facet-*` (documented ecosystem-invariant violation).
- **Git:** branch `main`, **120 uncommitted lines (dirty)**, last `fa746fc` (2026-09-09).

### sovgrant
- **Purpose:** Sovereign multi-tenant DID & access management engine. README title "SovGrant" matches `package.json` name `sovgrant`; package description still says "ArcevoCirqle ecosystem".
- **Stack:** Fastify 5, Prisma 7, PostgreSQL + Redis, Next.js 16 admin dashboard, WebAuthn/Passkeys, SD-JWT VCs, OIDC/OAuth2, node-saml, arctic, pino, Docker. Evidence: `package.json`, `docker-compose.yml`, `Dockerfile`.
- **Published names/scope:** consumes `@fusorb/facet-*` (NEW scope) at pinned versions (facet-auth 1.3.7, components 3.1.0, sdk 1.2.1, etc.). Evidence: `package.json`.
- **Arc-prefixed names:** 114 occurrences / 38 files. Mostly `arcevocirqle` branding (email domain `@arcevocirqle.com.ng`, twitter `@arcevocirqle`) and one `pnpm-workspace.yaml` comment referencing `@arcevo/facet-components`. Evidence: `prisma/seed.ts`, `src/core/config/env.validator.ts`, `src/components/metadata.ts`, `pnpm-workspace.yaml`.
- **Dependencies (graph):** depends on facet (published `@fusorb/facet-*`). Is itself depended on by sovport (SDK) and relnex (auth) and ingested by intel.
- **Docs/standards/CI/agent:** `AGENTS.md`, `CLAUDE.md`, `.commandcode/` (taste files), `.husky/`, `.github/workflows/` (ci.yml, deploy-api.yml, deploy-web.yml), `docs/planning/` (sovgrant-v2-roadmap.md, cli design, etc.).
- **Maturity:** README claims v1 complete — "61 test files / 342 tests / 0 failures". Note intel README records conflicting test counts (358 in roadmap, 342 in README, 326 in older doc) — treat as claimed, not verified here.
- **Git:** branch `main`, 6 uncommitted, last `b7086d0` (2026-10-23).

### sovport
- **Purpose:** self-sovereign identity wallet. README title "sovport" matches `package.json`. Status: "blank Expo starter" — SovGrant integration not built. Code and README agree (target architecture documented, not implemented).
- **Stack:** Expo 57, React Native 0.86, expo-router, zustand, jose. Evidence: `package.json`, `app.json`, `metro.config.js`.
- **Published names/scope:** consumes `@fusorb/facet-sdk` 1.2.1 + `@fusorb/facet-store` 1.0.1 (NEW scope). Evidence: `package.json`.
- **Arc-prefixed names:** 5 occurrences / 3 files (`README.md`, `src/sdk/index.ts`, `src/app/login.tsx`) plus `docs/arcwallet-integration-planning.md` and `.agent/arcwallet-*` files.
- **Dependencies (graph):** depends on sovgrant via `@fusorb/facet-sdk`.
- **Docs/standards/CI/agent:** `.commandcode/`, `docs/arcwallet-integration-planning.md`. **No `AGENTS.md`, no `CLAUDE.md`, no `.github/workflows/`.**
- **Maturity:** pre-integration scaffold (4-phase plan documented but not implemented).
- **Git:** branch `main`, 25 uncommitted, last `9f15953` (2026-08-13).

---

## 3. poetic-dev foundation repos

The user described these as "two empty repos". **Finding: neither is literally empty — both are Next.js starter stubs with no source code yet.**

| Repo | GitHub remote | Contents | Empty? |
|---|---|---|---|
| `poetic-dev/fusorb` | github.com/poetic-dev/fusorb.git | `package.json` (name `fusorb` v1.0.0, dep `next ^16.3.4`, pnpm 12.4.1), `pnpm-lock.yaml`, `.gitignore`, `.commandcode/taste/taste.md`. No `src/`, no `app/`. | Empty stub (no code) |
| `poetic-dev/arcevocirqle` | github.com/poetic-dev/arcevocirqle.git | `package.json` (name `arcevocirqle` v1.0.0, dep `next ^16.3.4`), `.gitignore`. No source. | Empty stub (no code) |

Both are on branch `main`, both "first commit" 2026-09-12, with 1–2 uncommitted lines.

**Unexpected discovery:** `poetic-dev/projects/` contains three additional repos all pointing at the OLD GitHub org:
- `auth-project` -> github.com/ArcevoDev/auth-project.git
- `nexasync` -> github.com/ArcevoDev/nexasync.git
- `stream-wise` -> github.com/ArcevoDev/stream-wise.git

These are outside the stated scope; flagged for the owner (see open questions).

---

## 4. Draft naming ledger (old -> new)

| Old name | New name | Evidence |
|---|---|---|
| `ArcUI` | `Facet` (repo) | `intel/README.md` ("ArcUI -> Facet") |
| `ArcID` | `SovGrant` (repo) | `intel/README.md`; residual `relnex/src/lib/arcid/`, `relnex/.env.arcid.example`, `relnex/src/app/api/webhooks/arcid/route.ts` |
| `ArcBase` | `Relnex` (repo) | `intel/README.md`; residual `relnex/README.md` title "Arcbase", `relnex/docs/arcbase-roadmap.md`, `relnex/docs/architecture.md` |
| `ArcWallet` | `SovPort` (repo) | `intel/README.md`; residual `sovport/docs/arcwallet-integration-planning.md`, `.agent/arcwallet-*` |
| `@arcevo/*` | `@fusorb/*` (npm scope) | `facet/package.json` (publishes `@fusorb`), `sovgrant/package.json` (consumes `@fusorb`), `sovport/package.json`; residual old scope in `relnex/src/**` imports |
| `ArcevoDev` (GitHub org) | `fusorb` (GitHub org) | remotes `github.com/fusorb/*`; old org still in `poetic-dev/projects/*` remotes |
| `ArcIdClient` | `SgClient` | `facet/.changeset/rename-arcid-to-sg.md` |
| `ArcIdClientConfig` | `SgClientConfig` | `facet/.changeset/rename-arcid-to-sg.md` |
| `ArcProvider` | `SgProvider` | `facet/.changeset/rename-arcid-to-sg.md` |
| `ArcProviderProps` | `SgProviderProps` | `facet/.changeset/rename-arcid-to-sg.md` |
| `arcid_access_token` / `arcid_refresh_token` | `sg_access_token` / `sg_refresh_token` | `facet/.changeset/rename-arcid-to-sg.md` |
| `ArcevoCirqle` (product/brand) | `Fusorb` (?) | OPEN — see below; email domain `arcevocirqle.com.ng` and twitter `@arcevocirqle` still live in sovgrant |

**Remaining Arc-prefixed name counts (source + docs + config, excluding node_modules/dist/.next/generated):**

| Repo | Occurrences | Files |
|---|---|---|
| facet | 39 | 13 |
| intel | 14 | 3 |
| relnex | 426 | 55 |
| sovgrant | 114 | 38 |
| sovport | 5 | 3 |

---

## 5. Cross-repo facts needing a single owner

- **npm scope (`@fusorb` vs `@arcevo`)** — facet publishes `@fusorb`, sovgrant/sovport consume `@fusorb`, but relnex source still imports `@arcevo/facet-*` (undeclared in its package.json). One owner must drive the scope migration and deprecate `@arcevo`.
- **Identifier rename (`ArcIdClient`/`ArcProvider` -> `SgClient`/`SgProvider`)** — facet has the changeset, but relnex source still uses `ArcProvider` and `ArcIdClient`.
- **Repo naming (`Arc*` -> Sov/Facet/Relnex)** — the mapping is documented in intel/README but old names persist in relnex docs (`arcbase-roadmap.md`, `architecture.md`) and sovport docs (`arcwallet-integration-planning.md`).
- **Product brand (`ArcevoCirqle` vs `Fusorb`)** — sovgrant package description, README, email domain (`arcevocirqle.com.ng`) and twitter (`@arcevocirqle`) still say ArcevoCirqle; new foundation repos are named `fusorb`/`arcevocirqle`.
- **"Facet is the single mandatory UI system" invariant** — relnex uses shadcn/ui instead of `@fusorb/facet-components` (a documented violation), while sovgrant uses facet correctly. This invariant needs an owner to enforce or formally waive.
- **Component/test count drift** — "112" (facet README) vs "113" (facet ADR-001) vs "114" (intel README); sovgrant test counts 342/358/326 disagree across docs. Intel exists to track this, but a human must define the canonical source of truth.

---

## 6. Open questions (owner only)

1. Is the product brand now **"Fusorb"**, still **"ArcevoCirqle"**, or both? What happens to the live `arcevocirqle.com.ng` email domain and `@arcevocirqle` twitter handle?
2. Which GitHub org is canonical going forward — `fusorb`, `poetic-dev`, or `ArcevoDev`? `poetic-dev/projects/*` still live under the old `ArcevoDev` org.
3. Are `@fusorb/facet-*` packages actually published to npm, and is the `@arcevo` scope deprecated/blocked? The intel README references an "npm-org namespace blocked" reason it cannot state (`unverified`).
4. Is relnex supposed to migrate from `@arcevo/facet-*` to `@fusorb/facet-*`, or drop facet for shadcn/ui? Its imports are currently undeclared in `package.json` — is the build broken or resolved some other way (`unverified`)?
5. What is the relationship of `poetic-dev/projects/{auth-project,nexasync,stream-wise}` to the Fusorb ecosystem — dead, to-be-migrated, or unrelated?
6. Final wallet name: `SovPort` (repo) vs `ArcWallet` (still referenced in docs/plans)?
