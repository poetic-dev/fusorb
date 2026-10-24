#!/usr/bin/env node
// gen-ecosystem-docs.mjs — renders generated blocks in content/ from ecosystem.json.
//
// Blocks are delimited by <!-- BEGIN:generated ecosystem.<name> --> and
// <!-- END -->. Supported names: domains, products, orgs.
// --check mode reports drift (exit 1) without writing; plain mode writes.
//
// This keeps every hostname and product table rendered from the single
// canonical source (ecosystem/ecosystem.json) rather than hand-typed.

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import { walkFiles } from "./lib/fs-walk.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CONTENT = path.join(ROOT, "content");
const ECOSYSTEM = path.join(ROOT, "ecosystem", "ecosystem.json");

const BLOCKS = ["domains", "products", "orgs"];

export function renderBlock(name, eco) {
  if (name === "domains") return renderDomains(eco);
  if (name === "products") return renderProducts(eco);
  if (name === "orgs") return renderOrgs(eco);
  throw new Error(`unknown generated block "${name}"`);
}

function renderDomains(eco) {
  const header = ["| Host | Status | Serves | Uses | Note |", "| --- | --- | --- | --- | --- |"];
  const rows = eco.domains.map((d) => {
    const status = d.target ? `${d.status} (${d.target})` : d.status;
    const serves = d.serves || "—";
    const uses = Array.isArray(d.uses) ? d.uses.join(", ") : d.uses || "—";
    const note = d.note || "—";
    return `| ${d.host} | ${status} | ${serves} | ${uses} | ${note} |`;
  });
  return [...header, ...rows].join("\n");
}

function renderProducts(eco) {
  const header = ["| Id | Name | Role | Audience | Repo |", "| --- | --- | --- | --- | --- |"];
  const rows = eco.products.map(
    (p) => `| ${p.id} | ${p.name} | ${p.role} | ${p.audience} | ${p.repo.org}/${p.repo.name} |`
  );
  return [...header, ...rows].join("\n");
}

function renderOrgs(eco) {
  return eco.orgs.map((o) => `- **${o.id}** (\`${o.status}\`) — ${o.role}`).join("\n");
}

export async function syncEcosystemDocs({ check = false, root = ROOT } = {}) {
  const eco = JSON.parse(await readFile(ECOSYSTEM, "utf8"));
  const contentDir = path.join(root, "content");
  const files = (await walkFiles(contentDir)).filter((f) => f.endsWith(".md"));
  let drift = false;
  for (const rel of files) {
    const full = path.join(contentDir, rel);
    let text = await readFile(full, "utf8");
    let changed = false;
    for (const name of BLOCKS) {
      const begin = `<!-- BEGIN:generated ecosystem.${name} -->`;
      const end = "<!-- END -->";
      const bi = text.indexOf(begin);
      if (bi === -1) continue;
      const contentStart = bi + begin.length;
      const ei = text.indexOf(end, contentStart);
      if (ei === -1) continue;
      const expected = `\n${renderBlock(name, eco)}\n`;
      const current = text.slice(contentStart, ei);
      if (check) {
        if (current !== expected) {
          drift = true;
          console.error(`${rel}: generated ecosystem.${name} block is out of sync; run pnpm gen:docs`);
        }
      } else if (current !== expected) {
        text = text.slice(0, contentStart) + expected + text.slice(ei);
        changed = true;
      }
    }
    if (changed) await writeFile(full, text, "utf8");
  }
  return drift;
}

async function main() {
  const check = process.argv.includes("--check");
  const drift = await syncEcosystemDocs({ check });
  if (check && drift) process.exit(1);
  console.log(check ? "gen-ecosystem-docs: no drift" : "gen-ecosystem-docs: done");
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  main().catch((e) => {
    console.error("gen-ecosystem-docs: " + e.message);
    process.exit(1);
  });
}
