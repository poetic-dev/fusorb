# Taste
- Prefers file copy/import operations to leave changes uncommitted so a separate commit agent can handle the commit. Confidence: 0.8
- Organizes foundation/evidence documents under `docs/foundation/evidence/` with ISO date-suffixed filenames (e.g., `ecosystem-inventory-2026-10-24.md`). Confidence: 0.7
- After copying a file into the repo and verifying the copy, prefers to delete the original source to avoid duplicate copies. Confidence: 0.7
- Records answers to open questions by editing the question doc directly and expects the agent to discover and apply them rather than re-ask. Confidence: 0.7
- Generally accepts the agent's recommendations and is comfortable with the agent proceeding on the recommended option. Confidence: 0.7
- Expects claims recorded about sibling/product repos to be verified against the actual local repo sources (package manifests, READMEs, changelogs) rather than trusted from recorded docs. Confidence: 0.65
- Expects work to end fully committed and published — a clean working tree is not enough; every repo (including vendored/synced ones) should match origin/main with no dangling uncommitted or unpushed changes. Confidence: 0.6
