#!/usr/bin/env node
// sync-fusorb.mjs — shared consumer sync tool (vendor/fusorb/ snapshot)
// Dependency-free, Windows-safe (node:path, \r?\n). Zero repo-specific constants except profile lists.
// Reference: arcevocirqle/scripts/sync-fusorb.mjs (read-only). Differences: profiles (names|full), --profile, self-testable,
// provenance has no org names or local paths; tool itself is vendored so consumers can update it.

import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFile, writeFile, mkdir, readdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..");
const VENDOR = path.join(ROOT, "vendor", "fusorb");
const PROVENANCE_PATH = path.join(VENDOR, "PROVENANCE.json");
const PROFILES_PATH = path.join(__dirname, "profiles.json");

function sha256(buf) {
  return createHash("sha256").update(buf).digest("hex");
}

function parseArgs(argv) {
  const opts = { check: false, from: null, profile: "full" };
  for (let i = 2; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === "--check") opts.check = true;
    else if (a === "--from") opts.from = argv[++i];
    else if (a === "--profile") opts.profile = argv[++i];
    else {
      console.error(`sync-fusorb: unknown argument "${a}"`);
      process.exit(1);
    }
  }
  if (!opts.check && !opts.from) {
    console.error("sync-fusorb: use --from <path> to sync, or --check to verify");
    process.exit(1);
  }
  if (opts.profile !== "names" && opts.profile !== "full") {
    console.error("sync-fusorb: --profile must be names|full");
    process.exit(1);
  }
  return opts;
}

async function loadProfiles() {
  try {
    const raw = await readFile(PROFILES_PATH, "utf8");
    const parsed = JSON.parse(raw);
    return parsed.profiles || {};
  } catch (e) {
    console.error(`sync-fusorb: cannot read profiles.json: ${e.message}`);
    process.exit(1);
  }
}

async function listFiles(dir, base = dir) {
  const out = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    const rel = path.relative(base, full).split(path.sep).join("/");
    if (entry.isDirectory()) {
      out.push(...(await listFiles(full, base)));
    } else if (entry.isFile()) {
      out.push(rel);
    }
  }
  return out;
}

function validateEcosystem(eco) {
  const problems = [];
  if (eco === null || typeof eco !== "object" || Array.isArray(eco)) {
    return ["ecosystem.json must be a JSON object"];
  }
  if (!Array.isArray(eco.products)) {
    problems.push("ecosystem.json products must be an array");
  } else {
    eco.products.forEach((p, i) => {
      const where = `products[${i}]`;
      if (typeof p?.name !== "string" || p.name === "") problems.push(`${where}.name must be a non-empty string`);
      if (typeof p?.audience !== "string" || p.audience === "") problems.push(`${where}.audience must be a non-empty string`);
      if (typeof p?.role !== "string" || p.role === "") problems.push(`${where}.role must be a non-empty string`);
      if (p?.legacyNames !== undefined && !Array.isArray(p.legacyNames)) problems.push(`${where}.legacyNames must be an array`);
    });
  }
  if (!Array.isArray(eco.domains)) {
    problems.push("ecosystem.json domains must be an array");
  } else {
    eco.domains.forEach((d, i) => {
      const where = `domains[${i}]`;
      if (typeof d?.host !== "string" || d.host === "") problems.push(`${where}.host must be a non-empty string`);
      if (typeof d?.status !== "string" || d.status === "") problems.push(`${where}.status must be a non-empty string`);
    });
  }
  return problems;
}

async function sync(from, profileName) {
  const profiles = await loadProfiles();
  const profile = profiles[profileName];
  if (!profile) {
    console.error(`sync-fusorb: unknown profile "${profileName}"`);
    process.exit(1);
  }
  const FILES = profile.files || [];

  let sourceCommit;
  try {
    sourceCommit = execFileSync("git", ["-C", from, "rev-parse", "HEAD"], { encoding: "utf8" }).trim();
  } catch (e) {
    console.error(`sync-fusorb: cannot read git HEAD of --from path: ${e.message}`);
    process.exit(1);
  }

  await rm(VENDOR, { recursive: true, force: true });
  await mkdir(VENDOR, { recursive: true });

  const provenance = { sourceCommit, syncedAt: new Date().toISOString(), files: [] };
  for (const { src, dst } of FILES) {
    const srcPath = path.join(from, src);
    const dstPath = path.join(VENDOR, dst);
    const data = await readFile(srcPath);
    await mkdir(path.dirname(dstPath), { recursive: true });
    await writeFile(dstPath, data);
    provenance.files.push({ path: dst, sha256: sha256(data) });
  }
  await writeFile(PROVENANCE_PATH, JSON.stringify(provenance, null, 2) + "\n", "utf8");
  return provenance;
}

async function check({ from = null, profileName = "full" } = {}) {
  const profiles = await loadProfiles();
  const profile = profiles[profileName];
  if (!profile) {
    console.error(`sync-fusorb: unknown profile "${profileName}"`);
    process.exit(1);
  }
  const FILES = profile.files || [];

  let failures = 0;
  const fail = (msg) => {
    failures += 1;
    console.error("check:sync: " + msg);
  };

  let provenance;
  try {
    provenance = JSON.parse(await readFile(PROVENANCE_PATH, "utf8"));
  } catch (e) {
    fail(`cannot read vendor/fusorb/PROVENANCE.json (${e.message}); run sync:fusorb --from <path>`);
    return failures;
  }

  const listed = new Map((provenance.files || []).map((f) => [f.path, f.sha256]));
  const actualFiles = (await listFiles(VENDOR)).filter((f) => f !== "PROVENANCE.json");

  for (const rel of actualFiles) {
    const data = await readFile(path.join(VENDOR, rel));
    const hash = sha256(data);
    if (!listed.has(rel)) {
      fail(`unlisted file under vendor/fusorb/: ${rel}`);
    } else if (listed.get(rel) !== hash) {
      fail(`vendored file hash mismatch: ${rel}`);
    }
  }
  for (const rel of listed.keys()) {
    if (!actualFiles.includes(rel)) fail(`provenance lists missing file: ${rel}`);
  }

  // If ecosystem.json is vendored (full profile), validate structure
  if (listed.has("ecosystem.json")) {
    let eco;
    try {
      eco = JSON.parse(await readFile(path.join(VENDOR, "ecosystem.json"), "utf8"));
    } catch (e) {
      fail(`vendored ecosystem.json is not valid JSON: ${e.message}`);
      return failures;
    }
    for (const p of validateEcosystem(eco)) fail(p);
  }

  if (from) {
    for (const { src, dst } of FILES) {
      let srcData;
      try {
        srcData = await readFile(path.join(from, src));
      } catch {
        fail(`source file missing: ${src}`);
        continue;
      }
      let vendoredData;
      try {
        vendoredData = await readFile(path.join(VENDOR, dst));
      } catch {
        fail(`vendored file missing for source: ${src} (dst ${dst})`);
        continue;
      }
      if (sha256(srcData) !== sha256(vendoredData)) {
        fail(`source differs from vendored copy: ${src}`);
      }
    }
  }

  return failures;
}

async function main() {
  const opts = parseArgs(process.argv);
  if (opts.check) {
    const failures = await check({ from: opts.from, profileName: opts.profile });
    if (failures > 0) {
      console.error(`check:sync: ${failures} problem(s) found`);
      process.exit(1);
    }
    console.log("check:sync: OK");
    return;
  }
  const provenance = await sync(opts.from, opts.profile);
  console.log(`sync:fusorb: vendored ${provenance.files.length} files from ${provenance.sourceCommit}`);
}

main().catch((e) => {
  console.error("sync-fusorb: " + e.message);
  process.exit(1);
});
