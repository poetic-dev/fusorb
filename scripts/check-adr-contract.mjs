#!/usr/bin/env node
// Gate: ADRs must have status, date, governs, and exactly one ## Decision heading
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseFrontmatter } from "./lib/frontmatter.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DECISIONS = path.join(ROOT, "decisions");

async function main() {
  let entries;
  try {
    entries = await readdir(DECISIONS);
  } catch (e) {
    console.error(`check:adr: cannot read decisions/: ${e.message}`);
    process.exit(1);
  }
  
  const adrs = entries.filter(f => f.endsWith(".md") && f !== "0000-template.md");
  let failures = 0;
  
  for (const adr of adrs) {
    const full = path.join(DECISIONS, adr);
    const raw = await readFile(full, "utf8");
    let fm, body;
    try {
      const parsed = parseFrontmatter(raw);
      fm = parsed.data;
      body = parsed.content;
    } catch (e) {
      console.error(`check:adr: ${adr}: ${e.message}`);
      failures++;
      continue;
    }
    
    if (!fm.status) {
      console.error(`check:adr: ${adr}: missing frontmatter status`);
      failures++;
    }
    if (!fm.date) {
      console.error(`check:adr: ${adr}: missing frontmatter date`);
      failures++;
    }
    if (fm.governs === undefined || fm.governs === null) {
      console.error(`check:adr: ${adr}: missing frontmatter governs`);
      failures++;
    } else if (!Array.isArray(fm.governs)) {
      console.error(`check:adr: ${adr}: governs must be an array`);
      failures++;
    }
    
    let b = body || (raw.replace(/^---[\r\n]+[\s\S]*?[\r\n]+---[\r\n]*/, '') || '');
    const c = (b.match(/##[ \t]*Decision\b/g) || []).length;
    if (c !== 1) {
      console.error(`check:adr: ${adr}: must have exactly one "## Decision" heading (found ${c})`);
      failures++;
    }
  }
  
  if (failures > 0) {
    console.error(`check:adr: ${failures} problem(s) found`);
    process.exit(1);
  }
  console.log(`check:adr: OK (${adrs.length} ADRs)`);
}

main().catch((e) => {
  console.error("check:adr: " + e.message);
  process.exit(1);
});
