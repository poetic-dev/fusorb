#!/usr/bin/env node
// check-ecosystem.mjs — structural gate for ecosystem/ecosystem.json.
//
// Fails (exit 1) with file:line-style hints when:
//   * ecosystem.json violates its structure (schemaVersion, required fields, enums)
//   * any id is duplicated (orgs, products, layers, npm scopes, domains)
//   * a domain `serves` an unknown product
//   * an ADR (decisions/*.md) `governs` an unknown product/layer id
//
// Zero runtime dependencies. Node 22+, ESM. Windows + Linux safe.
// It intentionally avoids a JSON Schema validator; the checks below mirror
// ecosystem/ecosystem.schema.json.

import { readFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { parseFrontmatter } from "./lib/frontmatter.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

let failures = 0;
function fail(msg) {
  failures += 1;
  console.error("check-ecosystem: " + msg);
}

function isPlainObject(v) {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

function requireString(obj, field, where) {
  if (typeof obj[field] !== "string" || obj[field] === "") {
    fail(`${where}.${field} must be a non-empty string`);
    return false;
  }
  return true;
}

function validateEcosystem(eco) {
  if (!isPlainObject(eco)) {
    fail("ecosystem.json must be a JSON object");
    return;
  }
  if (eco.schemaVersion !== 1) {
    fail("ecosystem.json schemaVersion must be 1");
  }

  for (const key of ["orgs", "npmScopes", "layers", "products", "domains", "sequencing"]) {
    if (!Array.isArray(eco[key])) {
      fail(`ecosystem.json ${key} must be an array`);
      eco[key] = [];
    }
  }

  const seen = { org: new Set(), product: new Set(), layer: new Set(), scope: new Set(), host: new Set() };

  for (const [i, org] of eco.orgs.entries()) {
    const where = `orgs[${i}]`;
    if (!isPlainObject(org)) { fail(`${where} must be an object`); continue; }
    if (requireString(org, "id", where)) {
      if (seen.org.has(org.id)) fail(`duplicate org id "${org.id}"`);
      seen.org.add(org.id);
    }
    if (!["active", "retired"].includes(org.status)) fail(`${where}.status must be active|retired`);
    requireString(org, "role", where);
  }

  for (const [i, scope] of eco.npmScopes.entries()) {
    const where = `npmScopes[${i}]`;
    if (!isPlainObject(scope)) { fail(`${where} must be an object`); continue; }
    if (requireString(scope, "scope", where)) {
      if (seen.scope.has(scope.scope)) fail(`duplicate npm scope "${scope.scope}"`);
      seen.scope.add(scope.scope);
    }
    if (!["live", "retired"].includes(scope.status)) fail(`${where}.status must be live|retired`);
  }

  for (const [i, layer] of eco.layers.entries()) {
    const where = `layers[${i}]`;
    if (!isPlainObject(layer)) { fail(`${where} must be an object`); continue; }
    if (requireString(layer, "id", where)) {
      if (seen.layer.has(layer.id)) fail(`duplicate layer id "${layer.id}"`);
      seen.layer.add(layer.id);
    }
    if (!isPlainObject(layer.repo) || typeof layer.repo.org !== "string" || typeof layer.repo.name !== "string") {
      fail(`${where}.repo must be { org, name }`);
    }
    requireString(layer, "audience", where);
    requireString(layer, "role", where);
  }

  for (const [i, product] of eco.products.entries()) {
    const where = `products[${i}]`;
    if (!isPlainObject(product)) { fail(`${where} must be an object`); continue; }
    if (requireString(product, "id", where)) {
      if (seen.product.has(product.id)) fail(`duplicate product id "${product.id}"`);
      seen.product.add(product.id);
    }
    requireString(product, "name", where);
    if (!Array.isArray(product.legacyNames)) fail(`${where}.legacyNames must be an array`);
    if (!isPlainObject(product.repo) || typeof product.repo.org !== "string" || typeof product.repo.name !== "string") {
      fail(`${where}.repo must be { org, name }`);
    }
    requireString(product, "role", where);
    requireString(product, "audience", where);
  }

  for (const [i, domain] of eco.domains.entries()) {
    const where = `domains[${i}]`;
    if (!isPlainObject(domain)) { fail(`${where} must be an object`); continue; }
    if (requireString(domain, "host", where)) {
      if (seen.host.has(domain.host)) fail(`duplicate domain host "${domain.host}"`);
      seen.host.add(domain.host);
    }
    if (!["live", "planned"].includes(domain.status)) fail(`${where}.status must be live|planned`);
    if (domain.serves !== undefined && domain.serves !== "") {
      if (!seen.product.has(domain.serves)) {
        fail(`${where}.serves references unknown product "${domain.serves}"`);
      }
    }
  }

  for (const [i, seq] of eco.sequencing.entries()) {
    const where = `sequencing[${i}]`;
    if (!isPlainObject(seq)) { fail(`${where} must be an object`); continue; }
    if (typeof seq.order !== "number") fail(`${where}.order must be a number`);
    if (requireString(seq, "product", where) && !seen.product.has(seq.product)) {
      fail(`${where}.product references unknown product "${seq.product}"`);
    }
  }

  return seen;
}

async function checkAdrGoverns(seen) {
  const validIds = new Set([...seen.layer, ...seen.product]);
  const dir = path.join(ROOT, "decisions");
  let files;
  try {
    files = await readdir(dir);
  } catch {
    fail("decisions/ directory is missing (expected ADRs)");
    return;
  }
  const md = files.filter((f) => f.endsWith(".md")).sort();
  for (const file of md) {
    const full = path.join(dir, file);
    const text = await readFile(full, "utf8");
    const { data, hasFrontmatter } = parseFrontmatter(text);
    if (!hasFrontmatter) {
      fail(`decisions/${file} has no frontmatter`);
      continue;
    }
    const governs = data.governs ?? [];
    const list = Array.isArray(governs) ? governs : [governs];
    for (const g of list) {
      if (!validIds.has(g)) {
        fail(`decisions/${file} governs unknown id "${g}" (not a product or layer id in ecosystem.json)`);
      }
    }
  }
}

async function main() {
  const ecoPath = path.join(ROOT, "ecosystem", "ecosystem.json");
  let raw;
  try {
    raw = await readFile(ecoPath, "utf8");
  } catch (e) {
    fail(`cannot read ecosystem/ecosystem.json: ${e.message}`);
    process.exit(1);
  }
  let eco;
  try {
    eco = JSON.parse(raw);
  } catch (e) {
    fail(`ecosystem/ecosystem.json is not valid JSON: ${e.message}`);
    process.exit(1);
  }
  const seen = validateEcosystem(eco);
  await checkAdrGoverns(seen);

  if (failures > 0) {
    console.error(`check-ecosystem: ${failures} problem(s) found`);
    process.exit(1);
  }
  console.log("check-ecosystem: OK");
}

main();
