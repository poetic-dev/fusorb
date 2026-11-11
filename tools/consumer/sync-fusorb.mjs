#!/usr/bin/env node
// sync-fusorb.mjs — shared consumer sync tool (vendor/fusorb/ snapshot).
//
// Dependency-free, Windows-safe (node:path, \r?\n). Zero repo-specific constants
// except the profile lists in profiles.json.
//
// Modes:
//   --from <path>          copy the profiled files from the fusorb repo and write
//                          vendor/fusorb/PROVENANCE.json (sourceCommit, syncedAt, hashes).
//   --check                offline: verify the vendored bytes against PROVENANCE.json
//                          and that the manifest and the vendored tree agree.
//   --check --from <path>  freshness: the offline checks, plus the snapshot must match
//                          the live source repo —
//                            * provenance.sourceCommit == source HEAD (commit freshness)
//                            * every profiled source file is vendored and byte-identical
//                            * no profiled source file is missing from the manifest
//                            * no manifest file vanished from the source
//   --profile a[,b,...]    select the file set (default full); profiles compose.
//
// The freshness checks need the sibling fusorb repo, so --check --from runs locally
// or in a scheduled job; the offline --check (no --from) is the CI-safe one.
//
// A profile entry is either a file mapping { src, dst } or a directory mapping
// { srcDir, dstDir }; a directory expands to every file under it with relative
// paths preserved, so a new file (for example a new decision) is vendored without
// editing the profile.

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
  const opts = { check: false, from: null, profiles: ["full"] };
  for (let i = 2; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === "--check") opts.check = true;
    else if (a === "--from") opts.from = argv[++i];
    else if (a === "--profile") {
      opts.profiles = String(argv[++i])
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    } else {
      console.error(`sync-fusorb: unknown argument "${a}"`);
      process.exit(1);
    }
  }
  if (opts.profiles.length === 0) {
    console.error("sync-fusorb: --profile requires at least one profile name");
    process.exit(1);
  }
  if (!opts.check && !opts.from) {
    console.error("sync-fusorb: use --from <path> to sync, or --check to verify");
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

// Resolve one or more profile names into a single, de-duplicated list of entries.
async function resolveProfile(names) {
  const profiles = await loadProfiles();
  const entries = [];
  const labels = [];
  for (const name of names) {
    const profile = profiles[name];
    if (!profile) {
      console.error(`sync-fusorb: unknown profile "${name}"`);
      process.exit(1);
    }
    labels.push(name);
    for (const entry of profile.files || []) entries.push(entry);
  }
  return { entries, label: labels.join(",") };
}

// Expand file and directory entries into concrete { src, dst } pairs, preserving
// order and de-duplicating by destination.
async function expandProfile(from, entries) {
  const out = [];
  const seen = new Set();
  for (const entry of entries) {
    if (entry.srcDir) {
      const files = await listFiles(path.join(from, entry.srcDir));
      for (const rel of files) {
        const dst = `${entry.dstDir}/${rel}`;
        if (seen.has(dst)) continue;
        seen.add(dst);
        out.push({ src: `${entry.srcDir}/${rel}`, dst });
      }
    } else if (entry.src) {
      if (seen.has(entry.dst)) continue;
      seen.add(entry.dst);
      out.push({ src: entry.src, dst: entry.dst });
    }
  }
  return out;
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

function sourceHead(from) {
  try {
    return execFileSync("git", ["-C", from, "rev-parse", "HEAD"], { encoding: "utf8" }).trim();
  } catch {
    return null;
  }
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

async function sync(from, profileNames) {
  const { entries } = await resolveProfile(profileNames);
  const files = await expandProfile(from, entries);

  const sourceCommit = sourceHead(from);
  if (!sourceCommit) {
    console.error("sync-fusorb: cannot read git HEAD of --from path");
    process.exit(1);
  }

  await rm(VENDOR, { recursive: true, force: true });
  await mkdir(VENDOR, { recursive: true });

  const provenance = { sourceCommit, syncedAt: new Date().toISOString(), files: [] };
  for (const { src, dst } of files) {
    const data = await readFile(path.join(from, src));
    const dstPath = path.join(VENDOR, dst);
    await mkdir(path.dirname(dstPath), { recursive: true });
    await writeFile(dstPath, data);
    provenance.files.push({ path: dst, sha256: sha256(data) });
  }
  await writeFile(PROVENANCE_PATH, JSON.stringify(provenance, null, 2) + "\n", "utf8");
  return provenance;
}

async function check({ from = null, profileNames = ["full"] } = {}) {
  const { entries, label } = await resolveProfile(profileNames);

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

  // Offline self-consistency: the vendored tree must match the manifest exactly.
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

  // If ecosystem.json is vendored (full profile), validate structure.
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

  // Freshness: the snapshot must match the live source repo.
  if (from) {
    const head = sourceHead(from);
    if (!head) {
      fail(`cannot read git HEAD of source repo "${from}"`);
    } else if (provenance.sourceCommit !== head) {
      fail(
        `stale sync: vendored from ${String(provenance.sourceCommit).slice(0, 7)} ` +
          `but source HEAD is ${head.slice(0, 7)} (run sync:fusorb --from <path>)`
      );
    }

    const srcFiles = await expandProfile(from, entries);
    const srcByDst = new Map(srcFiles.map((f) => [f.dst, f.src]));
    for (const { src, dst } of srcFiles) {
      let srcData;
      try {
        srcData = await readFile(path.join(from, src));
      } catch {
        fail(`source file missing: ${src}`);
        continue;
      }
      if (!listed.has(dst)) {
        fail(`source file not vendored: ${src} (run sync:fusorb --from <path>)`);
        continue;
      }
      const vendored = await readFile(path.join(VENDOR, dst));
      if (sha256(srcData) !== sha256(vendored)) {
        fail(`source differs from vendored copy: ${src}`);
      }
    }
    for (const dst of listed.keys()) {
      if (!srcByDst.has(dst)) {
        fail(`vendored file has no source in profile "${label}": ${dst}`);
      }
    }
  }

  return failures;
}

async function main() {
  const opts = parseArgs(process.argv);
  if (opts.check) {
    const failures = await check({ from: opts.from, profileNames: opts.profiles });
    if (failures > 0) {
      console.error(`check:sync: ${failures} problem(s) found`);
      process.exit(1);
    }
    console.log("check:sync: OK");
    return;
  }
  const provenance = await sync(opts.from, opts.profiles);
  console.log(`sync:fusorb: vendored ${provenance.files.length} files from ${provenance.sourceCommit}`);
}

main().catch((e) => {
  console.error("sync-fusorb: " + e.message);
  process.exit(1);
});
