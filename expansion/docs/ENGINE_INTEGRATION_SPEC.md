# Candy Rescue Saga — Technical Integration Specification (v1.0.0)

**Target Audience:** Core Mobile Game Engine & 3D Architecture Agent  
**Scope:** Expansion Levels `LVL_007` – `LVL_056` (`EXP_001` – `EXP_050`, Chapters `CHAPTER_01` – `CHAPTER_10`)  
**Isolation Guarantee:** 100% standalone data & contracts inside `/expansion/`. Zero core engine, renderer, or UI files were modified.

---

## 1. File Manifest & Single Source of Truth

| Path | Purpose | Format |
| :--- | :--- | :--- |
| `expansion/schemas/expansion-schema.json` | JSON Schema (Draft 2020-12) validating the entire expansion package | JSON Schema |
| `expansion/data/candy-rescue-expansion-bundle.json` | **Single-file unified bundle** containing metadata, candies, tools, obstacles, enemies, bosses, chapters, and all 50 levels | UTF-8 JSON |
| `expansion/data/chapters.json` | 10 South Asian secular regional chapters (`CHAPTER_01`..`CHAPTER_10`) | UTF-8 JSON |
| `expansion/data/regional-candies.json` | 10 fruit & dessert candy definitions (`CANDY_*`) | UTF-8 JSON |
| `expansion/data/tools.json` | 18 strategic survival tools (`TOOL_*`) | UTF-8 JSON |
| `expansion/data/obstacles.json` | 24 puzzle & arena survival obstacles (`OBS_*`) | UTF-8 JSON |
| `expansion/data/enemies-and-bosses.json` | 12 regular/elite enemies (`ENEMY_*`) + 6 multi-phase bosses (`BOSS_*`) | UTF-8 JSON |
| `expansion/data/levels-all-50.json` | Flat ordered array of all 50 expansion level specs (`LVL_007`..`LVL_056`) | UTF-8 JSON |
| `expansion/scripts/validate-expansion.mjs` | Automated integrity, balance & secular-policy CI validator (`node expansion/scripts/validate-expansion.mjs`) | Node ESM |

---

## 2. Canonical ID Taxonomy

All cross-references across chapters, levels, objectives, tools, obstacles, enemies, and rewards use deterministic uppercase snake-case IDs:

- **Base Game Levels (Existing):** `LVL_001` .. `LVL_006`
- **Expansion Campaign Levels:** `LVL_007` .. `LVL_056` (`expansionNumber`: `1` .. `50`, `campaignNumber`: `7` .. `56`)
- **Chapters:** `CHAPTER_01` .. `CHAPTER_10` (5 levels per chapter)
- **Candies:** `CANDY_HIMSAGAR_MANGO`, `CANDY_DINAJPUR_LITCHI`, `CANDY_BARISAL_GUAVA`, `CANDY_MADHUPUR_JACKFRUIT`, `CANDY_KALOJAM_JAMUN`, `CANDY_TENDER_COCONUT`, `CANDY_DARJEELING_ORANGE`, `CANDY_PISTACHIO_KULFI`, `CANDY_CRISPY_JILAPI`, `CANDY_SPONGY_RASGULLA`
- **Survival Tools (18):** `TOOL_CANDY_HAMMER` .. `TOOL_SYRUP_CONDUIT_BRUSH`
- **Survival Obstacles (24):** `OBS_CARAMEL_LAVA` .. `OBS_CRYSTAL_PRISM_MIRROR`
- **Enemies (12) & Bosses (6):** `ENEMY_GREEN_SERPENT` .. `ENEMY_MIRAGE_CHAMELEON`, `BOSS_01_*` .. `BOSS_06_*`

---

## 3. Engine-Agnostic Subsystem Interfaces

Whether the target mobile engine is implemented in **Unity (C#)**, **Unreal (C++)**, **Godot (GDScript/C#)**, **Flutter/Flame**, or **React Native / TypeScript**, the core runtime only needs four decoupled controllers consuming `candy-rescue-expansion-bundle.json`:

### 3.1 `IBoardSimulationController` (Puzzle Grid Layer)
Reads `level.boardBlueprint` (`rows`, `cols`, `voidCells`, `specialZones`):
- **Standard Gravity:** Tiles above empty cells fall `+1 row` downward.
- **Dual-Gravity Flood Zone (`submerged_upward_gravity`):** When `OBS_MONSOON_FLOOD_TIDE` submerges rows `[r..6]`, empty cells in submerged rows pull candies `-1 row` **upward** from `row 6` spawners, converging at the waterline (`row r - 1`).
- **Wind Conveyor Belt (`wind_row_right` / `wind_row_left`):** After cascades settle on a move, unlocked tiles on designated rows shift `±1 col` with wrap-around, then re-evaluate matches.
- **Beam Deflection & Splitting:**
  - `OBS_COCONUT_HUSK_BUMPER`: Absorbs 1 HP from an incoming Striped beam and emits a perpendicular 90° beam from its coordinate.
  - `OBS_CRYSTAL_PRISM_MIRROR`: Toggles state each move (`ORTHOGONAL_PLUS` on odd moves, `DIAGONAL_X` on even moves) and splits any touching Striped/Rainbow beam along all 4 rays of its active state.
  - `CANDY_CRISPY_JILAPI`: When struck by any beam, triggers a `3x3` ring pulse around itself.

### 3.2 `ISurvivalArenaController` (3D/2.5D Rescue Stage Layer)
Reads `level.pressureConfig`, `level.enemyOrThreat`, and `level.mainObjective`:
- **`pressureConfig.mode === "real_time_survival"`**: `dangerPct` advances continuously at `dangerRatePerSec * dt` (`0..100`).
- **`pressureConfig.mode === "move_limited"`**: `dangerPct` advances deterministically by `100 / moveLimit` per committed swap (zero real-time timer anxiety).
- **`pressureConfig.mode === "hybrid_turn_chase"`**: Enforces both `moveLimit` and a gentler `dangerRatePerSec` ceiling.
- **Inverted Gate (`OBS_TIMED_BLAST_SHUTTER`)**: Initializes `shutterOpenPct = 100` and decays each second/move; requires `shutterOpenPct >= targetMinPct` when final key/objective finishes.

### 3.3 `ISurvivalToolInventory` (Tactical Loadout Layer)
- Players equip **up to 3 tools** into a mission (`level.recommendedTools` provides smart defaults for UI auto-suggest).
- Enforces per-mission charge caps (`1` or `2` charges) and contextual trade-offs defined in `tools.json`:
  - Firing `TOOL_JILAPI_CLUSTER_BOMB` while `OBS_LOOSE_SHALE_ROCKFALL` is active spawns `2` Shale Pebble blockers at `row 0`.
  - Firing `TOOL_MONSOON_WATER_BLASTER` while `OBS_MONSOON_FLOOD_TIDE` is active increments `floodGaugePct += 5`.
  - Firing `TOOL_TEA_LEAF_GUST_FAN` while `OBS_CHILI_EMBER_FIRE` is unextinguished causes `1` adjacent spark hop.

---

## 4. Standardized Gameplay Event Bus Contract

The Puzzle Board and 3D Survival Arena communicate exclusively via serializable events—never direct scene-graph coupling:

```json
{
  "events": [
    {
      "event": "ON_CANDY_MATCH_RESOLVED",
      "payload": { "candyId": "CANDY_HIMSAGAR_MANGO", "count": 4, "shape": "LINE_4", "row": 3, "col": 2, "wasWindAssisted": false }
    },
    {
      "event": "ON_BEAM_ROUTED",
      "payload": { "origin": [4, 0], "deflectedBy": "OBS_COCONUT_HUSK_BUMPER", "splitBy": "OBS_CRYSTAL_PRISM_MIRROR", "hitArenaFlank": true }
    },
    {
      "event": "ON_OBSTACLE_STATE_CHANGED",
      "payload": { "obstacleId": "OBS_BRASS_TREASURE_TRUNK", "cell": [2, 1], "remainingClasps": ["CANDY_KALOJAM_JAMUN"], "cleared": false }
    },
    {
      "event": "ON_SURVIVAL_TOOL_EXECUTED",
      "payload": { "toolId": "TOOL_PRISM_TELEPORTER", "sourceCell": [5, 1], "targetCell": [2, 6], "sideEffectTriggered": null }
    },
    {
      "event": "ON_ENEMY_OR_BOSS_TICK",
      "payload": { "actorId": "BOSS_06_EMPEROR_PRISM_HYDRA_SERPENT", "phase": 2, "hpRemaining": 195, "stance": "PRISM_TIDE", "activeColorCrest": null }
    },
    {
      "event": "ON_MOCHI_CHECKPOINT_ADVANCED",
      "payload": { "checkpointIndex": 2, "totalCheckpoints": 4, "dangerPushbackApplied": 15.0, "reactiveAnimState": "CHEER_HOP" }
    },
    {
      "event": "ON_MISSION_OUTCOME",
      "payload": { "levelId": "LVL_056", "result": "VICTORY", "starsEarned": 3, "secondaryCompleted": true, "rewardsGranted": { "coins": 1000 } }
    }
  ]
}
```

---

## 5. Campaign Progression & Save-State Contract

Each player profile persists a compact progression object keyed by `levelId`:
- `LVL_007` unlocks automatically when base mission `LVL_006` has `cleared === true`.
- Every subsequent expansion mission `LVL_N` checks `prerequisiteLevels` (linear backbone `LVL_007 -> LVL_056`, with Chapter gates opening seamlessly upon beating the preceding Chapter's 5th climax/boss stage).
- Secondary objectives award the **3rd Mastery Star** and bonus coins without gating forward story progression—keeping casual players unblocked while rewarding completionists.
