#!/usr/bin/env node
// Self-test for consumer sync tool (Windows-safe, uses OS temp dir, cleans up)
import { mkdtemp, rm, writeFile, mkdir, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SYNC_TOOL = path.join(ROOT, "tools", "consumer", "sync-fusorb.mjs");

function run(cmd, args, cwd) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { cwd, stdio: "inherit", shell: false });
    p.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} ${args.join(" ")} exited ${code}`));
    });
  });
}

async function runCapture(cmd, args, cwd) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { cwd, stdio: ["ignore", "pipe", "pipe"], shell: false });
    let out = "", err = "";
    p.stdout.on("data", d => out += d);
    p.stderr.on("data", d => err += d);
    p.on("close", (code) => {
      resolve({ code, out, err });
    });
  });
}

async function main() {
  const base = await mkdtemp(path.join(tmpdir(), "fusorb-sync-test-"));
  try {
    // Create a fake source repo
    const src = path.join(base, "src-repo");
    await mkdir(src, { recursive: true });
    await mkdir(path.join(src, "ecosystem"), { recursive: true });
    await mkdir(path.join(src, "scripts", "lib"), { recursive: true });
    
    await writeFile(path.join(src, "ecosystem", "ecosystem.json"), JSON.stringify({
      schemaVersion: 1,
      orgs: [],
      npmScopes: [],
      layers: [],
      products: [{ name: "Test", audience: "internal", role: "test" }],
      domains: [{ host: "test.com", status: "live" }],
      sequencing: []
    }, null, 2) + "\r\n"); // CRLF
    
    await writeFile(path.join(src, "ecosystem", "naming-ledger.json"), JSON.stringify({
      schemaVersion: 1,
      allow: [],
      entries: []
    }, null, 2));
    
    await writeFile(path.join(src, "scripts", "check-legacy-names.mjs"), "export const x = 1;\n");
    await writeFile(path.join(src, "scripts", "lib", "fs-walk.mjs"), "export const fs = {};\n");
    await writeFile(path.join(src, "scripts", "lib", "glob.mjs"), "export const glob = {};\n");
    await writeFile(path.join(src, "scripts", "lib", "frontmatter.mjs"), "export const fm = {};\n");
    await writeFile(path.join(src, "scripts", "lib", "derived-facts.mjs"), "export const df = {};\n");
    await writeFile(path.join(src, "scripts", "lib", "links.mjs"), "export const links = {};\n");
    
    // Init git repo
    await run("git", ["init"], src);
    await run("git", ["-C", src, "add", "."], src);
    await run("git", ["-C", src, "-c", "user.email=test@test.com", "-c", "user.name=test", "commit", "-m", "init"], src);
    
    // Create consumer repo
    const consumer = path.join(base, "consumer");
    await mkdir(consumer, { recursive: true });
    await mkdir(path.join(consumer, "tools", "consumer"), { recursive: true });
    
    // Copy our tool and profiles
    await writeFile(path.join(consumer, "tools", "consumer", "sync-fusorb.mjs"), await readFile(SYNC_TOOL));
    await writeFile(path.join(consumer, "tools", "consumer", "profiles.json"), await readFile(path.join(ROOT, "tools", "consumer", "profiles.json")));
    
    // Test full profile
    await run("node", ["tools/consumer/sync-fusorb.mjs", "--from", src, "--profile", "full"], consumer);
    let res = await runCapture("node", ["tools/consumer/sync-fusorb.mjs", "--check", "--profile", "full"], consumer);
    if (res.code !== 0) throw new Error("full profile clean sync should pass");
    
    // Test names profile
    await rm(path.join(consumer, "vendor"), { recursive: true, force: true });
    await run("node", ["tools/consumer/sync-fusorb.mjs", "--from", src, "--profile", "names"], consumer);
    res = await runCapture("node", ["tools/consumer/sync-fusorb.mjs", "--check", "--profile", "names"], consumer);
    if (res.code !== 0) throw new Error("names profile clean sync should pass");
    
    // Flip one byte in names profile file
    const ledgerPath2 = path.join(consumer, "vendor", "fusorb", "naming-ledger.json");
    const ledgerData2 = await readFile(ledgerPath2);
    await writeFile(ledgerPath2, Buffer.concat([ledgerData2.slice(0, ledgerData2.length-1), Buffer.from([ledgerData2[ledgerData2.length-1] ^ 0x01])]));
    res = await runCapture("node", ["tools/consumer/sync-fusorb.mjs", "--check", "--profile", "names"], consumer);
    if (res.code === 0) throw new Error("flipped byte should fail");
    
    // Unlisted file should fail
    await rm(path.join(consumer, "vendor"), { recursive: true, force: true });
    await run("node", ["tools/consumer/sync-fusorb.mjs", "--from", src, "--profile", "full"], consumer);
    await writeFile(path.join(consumer, "vendor", "fusorb", "extra.txt"), "bad");
    res = await runCapture("node", ["tools/consumer/sync-fusorb.mjs", "--check", "--profile", "full"], consumer);
    if (res.code === 0) throw new Error("unlisted file should fail");
    
    console.log("All self-tests passed");
  } finally {
    await rm(base, { recursive: true, force: true });
  }
}

main().catch((e) => {
  console.error("Self-test failed:", e.message);
  process.exit(1);
});
