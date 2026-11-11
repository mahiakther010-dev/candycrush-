# Candy Rescue Saga — 50-Level Survival Expansion (`/expansion`)

Standalone, technology-independent level design, survival systems, regional worldbuilding, and structured JSON package expanding **Candy Rescue Saga** from **6** to **56 Major Campaign Levels** (`LVL_007` – `LVL_056`).

## Directory Contents

- **`docs/LEVEL_DESIGN_DOCUMENT.md`** — Full 1,406-line Master Level Design Document (benchmark research vs. original designs, 10 secular Bangladesh & India regional chapters, 10 regional candies, 18 survival tools, 24 obstacles, 12 enemies, 6 multi-phase bosses, sawtooth difficulty chart, reward economy, and all 50 playable level specifications).
- **`docs/ENGINE_INTEGRATION_SPEC.md`** — Engine-agnostic subsystem interfaces, canonical ID taxonomy, save-state rules, and Gameplay Event Bus contracts for the Core Mobile Game AI Agent.
- **`data/candy-rescue-expansion-bundle.json`** — Unified single-file JSON payload containing all catalogs + all 50 levels.
- **`data/levels-all-50.json`** — Flat array of all 50 expansion levels (`LVL_007`..`LVL_056`), plus modular chapter splits (`levels-part1-ch01-05.json`, `levels-part2-ch06-10.json`).
- **`data/chapters.json`**, **`data/regional-candies.json`**, **`data/tools.json`**, **`data/obstacles.json`**, **`data/enemies-and-bosses.json`** — Normalized catalogs.
- **`schemas/expansion-schema.json`** — JSON Schema (Draft 2020-12) contract.
- **`scripts/validate-expansion.mjs`** — Automated integrity, balance, and strict secular-policy audit script.

## Run Validation

```bash
node expansion/scripts/validate-expansion.mjs
```
