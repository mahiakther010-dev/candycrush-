#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const expRoot = path.resolve(__dirname, '..');
const dataDir = path.join(expRoot, 'data');
const docsDir = path.join(expRoot, 'docs');

const bundle = JSON.parse(fs.readFileSync(path.join(dataDir, 'candy-rescue-expansion-bundle.json'), 'utf8'));

const lines = [];
const push = (...args) => lines.push(...args);

push(
  '# Candy Rescue Saga — 50-Level Survival Expansion',
  '## Master Level Design Document (LDD v1.0.0)',
  '',
  '- **Campaign Span:** Expansion Levels `1–50` (`LVL_007` – `LVL_056`, expanding total campaign from 6 to **56 Major Levels**)',
  '- **Chapter Structure:** `10 Secular Regional Chapters` × `5 Levels per Chapter`',
  '- **Survival Systems:** `10` Regional Fruit/Dessert Candies · `18` Strategic Survival Tools · `24` Survival Obstacles · `12` Enemies · `6` Multi-Phase Bosses',
  '- **Content Policy:** 100% Secular Nature, Fruit, Culinary & Everyday Craft Inspiration (Bangladesh & India) — Automated Zero-Religious-Term Verified',
  '- **Architecture:** Technology-Independent JSON Data + Decoupled Event Contracts (`/expansion/`)',
  '',
  '---',
  '',
  '## 1. Benchmark Game Research vs. Original Candy Rescue Design',
  '',
  'To ensure every mission feels genuinely tactical, readable, and rewarding on mobile screens, we studied nine genre-defining puzzle and physics-rescue benchmarks and distilled their structural lessons into **100% original mechanics**:',
  '',
  '| Benchmark Studied | Researched Principle (What Works) | Our Original Candy Rescue Innovation (How We Built Something New) |',
  '| :--- | :--- | :--- |',
  '| **Candy Crush Saga** *(King)* | **Complexity Staircase & Blocker Containment:** Introduce one blocker in an isolated board; spreading blockers (like Chocolate) stop spreading for 1 turn whenever the player clears at least 1 unit. | **Spiced Sugar Fire (`OBS_CHILI_EMBER_FIRE`) & Steam Alchemy:** Clearing 1 ember halts fire spread for that turn, AND steering Fire next to Sticky Slime with a Coconut match triggers a beneficial 3x3 **Steam Burst**! |',
  '| **Royal Match** *(Dream Games)* | **5-Level Sawtooth Teeth & King\'s Nightmare Urgency:** Peak tension on the 5th stage of a cycle followed by a joyful breather stage; urgent visual rescue stakes above the board. | **10 × 5-Level Regional Chapters + 3 Pressure Modes:** Every chapter follows an `Onboarding/Breather -> Ramp -> Ramp -> Spike -> Climax/Boss` 5-stage sawtooth, alternating **Real-Time Chase**, **Pure Turn-Based Clockwork**, and **Hybrid** modes so urgency never causes fatigue. |',
  '| **Toon Blast** *(Peak Games)* | **Compartmentalized Topologies & 2–3 Obstacle Layering:** 18–25 well-crafted obstacles generate hundreds of fresh puzzles when paired across notched/alcove grids. | **24 Cross-Coupled Survival Obstacles:** Obstacles bridge the puzzle grid and 3D rescue stage—e.g., `OBS_ROTATING_WATERWHEEL_GATE` flips 90° on the board AND toggles Mochi\'s upper tunnel gate in sync. |',
  '| **Homescapes & Gardenscapes** *(Playrix)* | **Adjacent Double-Special Combos & Multi-Step Unlock Containers:** Pairing two specials side-by-side creates dramatic board sweeps; multi-lock chests reward targeted color hunting. | **Brass Sweet Trunks (`OBS_BRASS_TREASURE_TRUNK`) & Charkha-Bot Dynamo:** Hammer-immune chests with 3 fruit-gem clasps unlocked via orthogonal line-of-sight color matches; Boss #5 short-circuits specifically from Double-Special combos. |',
  '| **Fishdom** *(Playrix)* | **Buoyancy & Fluid Chamber Variety:** Water levels alter visual flow and collection routing. | **Dual-Gravity Monsoon Flood (`OBS_MONSOON_FLOOD_TIDE`):** Submerged bottom rows float **UPWARD** while top rows fall **DOWNWARD**, colliding at the central waterline (`LVL_037`–`LVL_041`, `LVL_053`, `LVL_056`)! |',
  '| **Cut the Rope & Angry Birds** *(ZeptoLab / Rovio)* | **Momentum, Deflection & Environmental Gadgets:** Bouncers, air cushions, ropes, and structural weak-points turn physics into puzzle tools. | **45° Coconut Husk Laser Billiards (`OBS_COCONUT_HUSK_BUMPER`), Quartz Prisms (`OBS_CRYSTAL_PRISM_MIRROR`) & Rasgulla Boulder Rebounds:** Players bank Striped beams 90° around corners and bounce Boss #4\'s jawbreakers back into his glacier armor! |',
  '| **Save the Dog** *(Casual Survival)* | **Readable Short-Horizon Shielding:** Clear visual telegraphs before hazards strike the hero character. | **Strategic Survival Loadouts (18 Tools with Real Trade-Offs):** No tool auto-wins a level—e.g., `TOOL_JILAPI_CLUSTER_BOMB` shakes loose ceiling pebbles in Shale Caves, and `TOOL_MONSOON_WATER_BLASTER` adds +5% flood height in Monsoon stages! |',
  '',
  '---',
  '',
  '## 2. Secular Regional Theme Bible (Bangladesh & India)',
  '',
  'Every chapter celebrates vibrant, non-religious natural landscapes, seasonal fruits, traditional sweets, river ferries, tea hills, and rural craft fairs across Bangladesh and India.',
  '',
  '### 2.1 Ten Regional Chapters Overview',
  '',
  '| Chapter | Title | Campaign Levels | Exp Levels | Secular Regional Inspiration | Chapter Boss |',
  '| :--- | :--- | :--- | :--- | :--- | :--- |'
);

for (const ch of bundle.chapters) {
  push(
    `| \`${ch.chapterId}\` | **${ch.title}** | \`LVL_${String(ch.campaignLevelRange[0]).padStart(3, '0')}–LVL_${String(ch.campaignLevelRange[1]).padStart(3, '0')}\` | \`${ch.expansionLevelRange[0]}–${ch.expansionLevelRange[1]}\` | ${ch.regionalInspiration} | ${ch.chapterBossId ? `\`${ch.chapterBossId}\`` : '*(Chapter Climax Gauntlet)*'} |`
  );
}

push(
  '',
  '### 2.2 Ten Regional Fruit & Dessert Candies',
  '',
  '| Candy ID | Name | Color Family | Regional Culinary/Botanical Inspiration | Unique Gameplay Synergy |',
  '| :--- | :--- | :--- | :--- | :--- |'
);

for (const c of bundle.regionalCandies) {
  push(`| \`${c.candyId}\` | **${c.name}** | \`${c.colorFamily}\` | ${c.regionalOrigin} | ${c.specialBoardProperty} |`);
}

push(
  '',
  '---',
  '',
  '## 3. Strategic Survival Tool System (18 Tools)',
  '',
  'Players bring up to **3 Survival Tools** into a mission. Tools create tactical openings, clutch saves, or geometric setups—never automatic victories.',
  ''
);

for (const t of bundle.tools) {
  push(
    `### ${t.name} (\`${t.toolId}\`) — *Unlocks Campaign Lvl ${t.unlockCampaignLevel}*`,
    `- **Purpose:** ${t.purpose}`,
    `- **How It Works:** ${t.howItWorks}`,
    `- **When Usable:** ${t.whenCanBeUsed}`,
    `- **Limitations & Strategic Trade-Off:** ${t.limitations}`,
    `- **3D Visual Effect:** ${t.visualEffect}`,
    `- **Candy Mechanic Interaction:** ${t.candyInteraction}`,
    `- **Impact on Mission Difficulty:** ${t.difficultyImpact}`,
    ''
  );
}

push(
  '---',
  '',
  '## 4. Survival Obstacles Library (24 Obstacles)',
  '',
  '| Obstacle ID | Name | Zone | HP | First Lvl | Behavior & Combinatorics | Clear / Counter Condition |',
  '| :--- | :--- | :--- | :--- | :--- | :--- | :--- |'
);

for (const o of bundle.obstacles) {
  push(
    `| \`${o.obstacleId}\` | **${o.name}** | \`${o.placementZone}\` | ${o.hitPoints} | Lvl ${o.firstAppearsCampaignLevel} | ${o.behavior} *(${o.combinatorics})* | ${o.clearCondition} |`
  );
}

push(
  '',
  '---',
  '',
  '## 5. Enemy Roster (12 Enemies) & Boss Encounters (6 Multi-Phase Bosses)',
  '',
  '### 5.1 Regular & Elite Enemies (12)',
  ''
);

for (const e of bundle.enemies) {
  push(
    `#### ${e.name} (\`${e.enemyId}\`) — *${e.role}, First Appears Lvl ${e.firstAppearsCampaignLevel}*`,
    `- **Behavior:** ${e.behavior}`,
    `- **Attack Pattern:** ${e.attackPattern}`,
    `- **Weakness:** ${e.weakness}`,
    `- **Counter Strategy:** ${e.counterStrategy}`,
    `- **Visual Identity:** ${e.visualIdentity}`,
    `- **Gameplay Interaction:** ${e.gameplayInteraction}`,
    `- **Defeat Animation Concept:** ${e.defeatAnimationConcept}`,
    ''
  );
}

push('### 5.2 Multi-Phase Boss Encounters (6)', '');

for (const b of bundle.bosses) {
  push(
    `#### ${b.name} (\`${b.bossId}\`) — *Campaign Lvl ${b.campaignLevel} / Expansion Lvl ${b.expansionLevel} (\`${b.chapterId}\`, ${b.healthPool} HP)*`,
    `- **Core Weakness:** ${b.weakness}`,
    ...b.phases.map((p) => `- **Phase ${p.phase} (${p.hpRange} HP):** ${p.mechanic}`),
    `- **Defeat Sequence:** ${b.defeatSequence}`,
    ''
  );
}

push(
  '---',
  '',
  '## 6. Difficulty Progression Chart, Economy & Dependency Map',
  '',
  '### 6.1 50-Level Sawtooth Difficulty Curve',
  '',
  'Every 5-level chapter ramps smoothly to a climax/boss and immediately drops into a refreshing breather stage at the start of the next chapter—preventing burnout while steadily deepening strategic mastery without ever starving move counts (all move-limited missions grant **25–30 moves**):',
  '',
  '```text',
  'Difficulty (1-10)',
  '10 |                                                                                                   ★(50)',
  ' 9 |                                                                             ★(40)       ★(45)   ▲ ▲',
  ' 8 |                                       ★(20)             ★(30)       ▲ ★(35)     ▲     ▲ ▲     ▲',
  ' 7 |                   ★(10)             ▲       ▲     ▲   ▲       ▲   ▲       ▲   ▲     ▲       ▲',
  ' 6 |         ★(5)    ▲       ▲   ★(15) ▲           ▲ ▲   ▲           ▲           ▲               ',
  ' 5 |       ▲       ▲   ▲   ▲   ▲       ○         ▲     ▲           ○           ○       ○       ',
  ' 4 |     ▲       ▲       ▲           ○         ○     ○                                         ',
  ' 3 |   ▲                       ○             ○                                                 ',
  ' 2 | ○         ○                                                                               ',
  '   +----------------------------------------------------------------------------------------------------',
  '     Ch1(1-5)  Ch2(6-10) Ch3(11-15) Ch4(16-20) Ch5(21-25) Ch6(26-30) Ch7(31-35) Ch8(36-40) Ch9   Ch10',
  '     Legend: ○ = Onboarding / Relief Breather   ▲ = Tactical Ramp / Spike   ★ = Chapter Climax / Boss',
  '```',
  '',
  '### 6.2 Five-Band Mastery Progression Summary',
  '',
  '| Band | Expansion Levels | Campaign Levels | Chapters | Core Design Focus | Move / Time Envelope |',
  '| :--- | :--- | :--- | :--- | :--- | :--- |',
  '| **Band I: Onboarding** | `EXP 01–10` | `LVL 007–016` | `CH 01–02` | Teaches Bamboo Cages, Crumbling Platforms, Sliding Walls, Tea Mist silhouettes, Clockwork turn-ticks, Wind Conveyors & Boss #1. | `26–30 moves` or `54–68s` |',
  '| **Band II: Combinatorics** | `EXP 11–20` | `LVL 017–026` | `CH 03–04` | Pairs Mud Bogs, Even-Beat Thorn Plates, Queen Honeycombs, Brass Trunks, Fire vs Slime Steam Alchemy, Piston Crushers & Boss #2. | `26–30 moves` or `54–75s` |',
  '| **Band III: Elite Counterplay** | `EXP 21–30` | `LVL 027–036` | `CH 05–06` | Introduces Ferry Tug-of-War, Stance-Switching Pangolin, Closing Shutters, 45° Coconut Laser Billiards & Boss #3 Trojan-Slurp. | `25–30 moves` or `52–70s` |',
  '| **Band IV: Dynamic Physics** | `EXP 31–40` | `LVL 037–046` | `CH 07–08` | Dual-Gravity Monsoon Floods, Center-Row Key Convergence, Cryo-Immune Yeti, Seismic Shale Tunnels, Chameleon Color-Sync & Boss #4. | `26–29 moves` or `55–72s` |',
  '| **Band V: Grand Mastery** | `EXP 41–50` | `LVL 047–056` | `CH 09–10` | Alternating `+`/`X` Quartz Prisms, Quad-Jilapi Firework Chains, Flank-Shield Crystal Sentinels, Boss #5 & 3-Phase Prism Hydra Finale! | `25–28 moves` or `55–80s` |',
  '',
  '### 6.3 Reward Economy & Campaign Dependency Chain',
  '',
  '- **Total Expansion First-Clear Economy:** **12,480 Coins**, **150 Mastery Stars** (3 per level), **25 Strategic Survival Tool Grants** unlocked right before the mechanics they counter, and **50 Unique Secular Cultural Keepsake Collectibles**.',
  '- **Dependency Graph:** `LVL_006 (Base Citadel)` → `LVL_007` → `LVL_008` → ... → `LVL_056` (strictly linear main rescue path where clearing `LVL_(N)` unlocks `LVL_(N+1)`, with Secondary Objectives awarding Star #3 and bonus coins without ever hard-gating story progress).',
  '',
  '---',
  '',
  '## 7. Complete 50-Level Playable Specifications (`LVL_007` – `LVL_056`)',
  ''
);

for (const lvl of bundle.levels) {
  const pressureStr =
    lvl.pressureConfig.mode === 'move_limited'
      ? `Move-Limited (${lvl.pressureConfig.moveLimit} moves, 0 real-time timer stress)`
      : lvl.pressureConfig.mode === 'real_time_survival'
      ? `Real-Time Survival (${lvl.pressureConfig.timeLimitSeconds}s envelope, ${lvl.pressureConfig.dangerRatePerSec}%/s danger)`
      : `Hybrid Turn + Chase (${lvl.pressureConfig.moveLimit} moves / ${lvl.pressureConfig.timeLimitSeconds}s, ${lvl.pressureConfig.dangerRatePerSec}%/s danger)`;

  const grantStr = lvl.rewards.firstClearToolGrant
    ? ` + ${lvl.rewards.firstClearToolGrant.quantity}x \`${lvl.rewards.firstClearToolGrant.toolId}\``
    : '';

  push(
    `### Expansion Level ${lvl.expansionNumber} (\`${lvl.levelId}\` / Campaign #${lvl.campaignNumber}): ${lvl.levelName}`,
    `- **Chapter:** \`${lvl.chapterId}\` | **Prerequisites:** ${lvl.prerequisiteLevels.map((p) => `\`${p}\``).join(', ')} | **Board:** \`${lvl.boardBlueprint.rows}x${lvl.boardBlueprint.cols}\` (\`${lvl.boardBlueprint.topology}\`)`,
    `1. **Level Name:** ${lvl.levelName}`,
    `2. **Environment Description:** ${lvl.environmentDescription}`,
    `3. **Rescue Story:** ${lvl.rescueStory}`,
    `4. **Main Objective:** ${lvl.mainObjective.summary}`,
    `5. **Secondary Objective:** ${lvl.secondaryObjective.summary}`,
    `6. **Candy Matching Requirement:** ${lvl.candyMatchingRequirement}`,
    `7. **Survival Obstacle:** Primary: \`${lvl.survivalObstacle.primary}\`${lvl.survivalObstacle.secondary ? `, Secondary: \`${lvl.survivalObstacle.secondary}\`` : ''} — ${lvl.survivalObstacle.layoutNotes}`,
    `8. **Enemy or Environmental Threat:** \`${lvl.enemyOrThreat.enemyId}\` — ${lvl.enemyOrThreat.threatSummary}`,
    `9. **Special Mechanics:** ${lvl.specialMechanics}`,
    `10. **Move Limit / Time Pressure:** ${pressureStr}`,
    `11. **Difficulty Rating:** **${lvl.difficultyRating.tier}** (${lvl.difficultyRating.numericScore1To10}/10 — *${lvl.difficultyRating.sawtoothRole}*)`,
    `12. **Victory Condition:** ${lvl.victoryCondition}`,
    `13. **Failure Condition:** ${lvl.failureCondition}`,
    `14. **Reward:** \`${lvl.rewards.coins} Coins\`, up to \`${lvl.rewards.starsMax} Stars\`${grantStr}, Keepsake: *${lvl.rewards.collectibleIngredient}*`,
    `15. **Unique Gameplay Twist:** ${lvl.uniqueGameplayTwist}`,
    `- **Recommended Loadout:** ${lvl.recommendedTools.map((t) => `\`${t}\``).join(', ')}`,
    ''
  );
}

fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(path.join(docsDir, 'LEVEL_DESIGN_DOCUMENT.md'), lines.join('\n') + '\n');
console.log(`Generated LEVEL_DESIGN_DOCUMENT.md (${lines.length} lines)`);
