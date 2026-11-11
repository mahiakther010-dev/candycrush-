# Candy Rescue Saga — 50-Level Survival Expansion
## Master Level Design Document (LDD v1.0.0)

- **Campaign Span:** Expansion Levels `1–50` (`LVL_007` – `LVL_056`, expanding total campaign from 6 to **56 Major Levels**)
- **Chapter Structure:** `10 Secular Regional Chapters` × `5 Levels per Chapter`
- **Survival Systems:** `10` Regional Fruit/Dessert Candies · `18` Strategic Survival Tools · `24` Survival Obstacles · `12` Enemies · `6` Multi-Phase Bosses
- **Content Policy:** 100% Secular Nature, Fruit, Culinary & Everyday Craft Inspiration (Bangladesh & India) — Automated Zero-Religious-Term Verified
- **Architecture:** Technology-Independent JSON Data + Decoupled Event Contracts (`/expansion/`)

---

## 1. Benchmark Game Research vs. Original Candy Rescue Design

To ensure every mission feels genuinely tactical, readable, and rewarding on mobile screens, we studied nine genre-defining puzzle and physics-rescue benchmarks and distilled their structural lessons into **100% original mechanics**:

| Benchmark Studied | Researched Principle (What Works) | Our Original Candy Rescue Innovation (How We Built Something New) |
| :--- | :--- | :--- |
| **Candy Crush Saga** *(King)* | **Complexity Staircase & Blocker Containment:** Introduce one blocker in an isolated board; spreading blockers (like Chocolate) stop spreading for 1 turn whenever the player clears at least 1 unit. | **Spiced Sugar Fire (`OBS_CHILI_EMBER_FIRE`) & Steam Alchemy:** Clearing 1 ember halts fire spread for that turn, AND steering Fire next to Sticky Slime with a Coconut match triggers a beneficial 3x3 **Steam Burst**! |
| **Royal Match** *(Dream Games)* | **5-Level Sawtooth Teeth & King's Nightmare Urgency:** Peak tension on the 5th stage of a cycle followed by a joyful breather stage; urgent visual rescue stakes above the board. | **10 × 5-Level Regional Chapters + 3 Pressure Modes:** Every chapter follows an `Onboarding/Breather -> Ramp -> Ramp -> Spike -> Climax/Boss` 5-stage sawtooth, alternating **Real-Time Chase**, **Pure Turn-Based Clockwork**, and **Hybrid** modes so urgency never causes fatigue. |
| **Toon Blast** *(Peak Games)* | **Compartmentalized Topologies & 2–3 Obstacle Layering:** 18–25 well-crafted obstacles generate hundreds of fresh puzzles when paired across notched/alcove grids. | **24 Cross-Coupled Survival Obstacles:** Obstacles bridge the puzzle grid and 3D rescue stage—e.g., `OBS_ROTATING_WATERWHEEL_GATE` flips 90° on the board AND toggles Mochi's upper tunnel gate in sync. |
| **Homescapes & Gardenscapes** *(Playrix)* | **Adjacent Double-Special Combos & Multi-Step Unlock Containers:** Pairing two specials side-by-side creates dramatic board sweeps; multi-lock chests reward targeted color hunting. | **Brass Sweet Trunks (`OBS_BRASS_TREASURE_TRUNK`) & Charkha-Bot Dynamo:** Hammer-immune chests with 3 fruit-gem clasps unlocked via orthogonal line-of-sight color matches; Boss #5 short-circuits specifically from Double-Special combos. |
| **Fishdom** *(Playrix)* | **Buoyancy & Fluid Chamber Variety:** Water levels alter visual flow and collection routing. | **Dual-Gravity Monsoon Flood (`OBS_MONSOON_FLOOD_TIDE`):** Submerged bottom rows float **UPWARD** while top rows fall **DOWNWARD**, colliding at the central waterline (`LVL_037`–`LVL_041`, `LVL_053`, `LVL_056`)! |
| **Cut the Rope & Angry Birds** *(ZeptoLab / Rovio)* | **Momentum, Deflection & Environmental Gadgets:** Bouncers, air cushions, ropes, and structural weak-points turn physics into puzzle tools. | **45° Coconut Husk Laser Billiards (`OBS_COCONUT_HUSK_BUMPER`), Quartz Prisms (`OBS_CRYSTAL_PRISM_MIRROR`) & Rasgulla Boulder Rebounds:** Players bank Striped beams 90° around corners and bounce Boss #4's jawbreakers back into his glacier armor! |
| **Save the Dog** *(Casual Survival)* | **Readable Short-Horizon Shielding:** Clear visual telegraphs before hazards strike the hero character. | **Strategic Survival Loadouts (18 Tools with Real Trade-Offs):** No tool auto-wins a level—e.g., `TOOL_JILAPI_CLUSTER_BOMB` shakes loose ceiling pebbles in Shale Caves, and `TOOL_MONSOON_WATER_BLASTER` adds +5% flood height in Monsoon stages! |

---

## 2. Secular Regional Theme Bible (Bangladesh & India)

Every chapter celebrates vibrant, non-religious natural landscapes, seasonal fruits, traditional sweets, river ferries, tea hills, and rural craft fairs across Bangladesh and India.

### 2.1 Ten Regional Chapters Overview

| Chapter | Title | Campaign Levels | Exp Levels | Secular Regional Inspiration | Chapter Boss |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `CHAPTER_01` | **Bengal Mango Valley** | `LVL_007–LVL_011` | `1–5` | Sun-drenched Rajshahi (Bangladesh) and Malda (India) summer Himsagar mango orchards, red-clay garden paths, woven bamboo fruit baskets, and terracotta orchard walls. | *(Chapter Climax Gauntlet)* |
| `CHAPTER_02` | **Sylhet Tea Garden** | `LVL_012–LVL_016` | `6–10` | Lush rolling emerald tea estates of Sreemangal/Sylhet (Bangladesh) and Assam (India), bamboo irrigation flumes, wooden waterwheels, and cool morning valley mist. | `BOSS_01_MANGROVE_SERPENT_MATRIARCH` |
| `CHAPTER_03` | **Sundarbans Adventure** | `LVL_017–LVL_021` | `11–15` | World's largest coastal mangrove forest spanning Bangladesh and West Bengal—winding tidal creeks, aerial pneumatophore roots, wild golden honeycombs, and wooden dinghy boats. | *(Chapter Climax Gauntlet)* |
| `CHAPTER_04` | **Litchi Orchard Escape** | `LVL_022–LVL_026` | `16–20` | Vibrant crimson summer litchi groves of Dinajpur (Bangladesh) and Muzaffarpur (India), high treehouse platforms, pulley zip-lines, and sunlit orchard canopies. | `BOSS_02_ROYAL_MANGROVE_CRAB_MECH` |
| `CHAPTER_05` | **Riverside Candy Market** | `LVL_027–LVL_031` | `21–25` | Lively secular riverfront sweet & fruit bazaars along the Padma, Buriganga, and Hooghly rivers—striped canvas awnings, sizzling jilapi skillets, brass sweet-trays, and wooden ferries. | *(Chapter Climax Gauntlet)* |
| `CHAPTER_06` | **Tropical Island Survival** | `LVL_032–LVL_036` | `26–30` | Turquoise coral lagoons and coconut palms of St. Martin's Island (Bangladesh) and the Andaman/Lakshadweep islands (India). | `BOSS_03_RAJA_GOLLA_DEVOURER` |
| `CHAPTER_07` | **Monsoon River Rescue** | `LVL_037–LVL_041` | `31–35` | Dramatic Meghna & Brahmaputra monsoon river crossings—silver rain curtains, paper boats, brass sluice floodgates, and surging turquoise currents. | *(Chapter Climax Gauntlet)* |
| `CHAPTER_08` | **Himalayan Foothill Expedition** | `LVL_042–LVL_046` | `36–40` | Crisp alpine pine valleys, Darjeeling/Dooars mountain toy-train stone viaducts, sunlit snow ledges, and mandarin foothill terraces. | `BOSS_04_HIMALAYAN_AVALANCHE_TITAN` |
| `CHAPTER_09` | **Colorful Fruit Festival** | `LVL_047–LVL_051` | `41–45` | Secular rural harvest & orchard craft fair (Mela)—handcrafted paper pinwheels, colourful kites, wooden ferris wheels, folk geometric alpona floor borders, and overflowing fruit pavilions. | `BOSS_05_FESTIVAL_CLOCKWORK_JUGGERNAUT` |
| `CHAPTER_10` | **Crystal Jungle Adventure** | `LVL_052–LVL_056` | `46–50` | Luminous subterranean quartz-and-waterfall caverns beneath the lush Bandarban/Meghalaya green hills—natural living-root bridges, glowing mineral geodes, and emerald underground rivers. | `BOSS_06_EMPEROR_PRISM_HYDRA_SERPENT` |

### 2.2 Ten Regional Fruit & Dessert Candies

| Candy ID | Name | Color Family | Regional Culinary/Botanical Inspiration | Unique Gameplay Synergy |
| :--- | :--- | :--- | :--- | :--- |
| `CANDY_HIMSAGAR_MANGO` | **Himsagar Mango Drop** | `golden_yellow` | Rajshahi (Bangladesh) & Malda (West Bengal, India) mango orchards | Matching 4+ Mango Drops near Sticky Sap or Mud Bog coats 1 adjacent tile in slick nectar, speeding up falling mission keys by 2x. |
| `CANDY_DINAJPUR_LITCHI` | **Dinajpur Ruby Litchi** | `crimson_red` | Dinajpur (Bangladesh) & Muzaffarpur (Bihar, India) summer litchi groves | Generates +20% bonus rescue winch charge when matched in vertical columns. |
| `CANDY_BARISAL_GUAVA` | **Floating Market Guava Crisp** | `emerald_green` | Barisal backwater floating guava markets (Bangladesh) & Allahabad orchards (India) | Naturally buoyant in Monsoon Floodwater rows — resists sinking traps and reinforces wooden bridges. |
| `CANDY_MADHUPUR_JACKFRUIT` | **Honeyed Jackfruit Pod** | `warm_amber` | Madhupur & Gazipur orchards (Bangladesh) & Kerala/Assam jackfruit groves (India) | Heavyweight candy: deals +1 bonus impact vibration to adjacent Bamboo Cages when matched in L/T shapes. |
| `CANDY_KALOJAM_JAMUN` | **Monsoon Jamun Berry** | `royal_purple` | Rural monsoon orchard avenues across Bengal and northern India | Releases cooling purple juice splash on match that neutralizes 1 stack of Chili-Sugar Ember heat. |
| `CANDY_TENDER_COCONUT` | **Daab Coconut Splash Cube** | `sky_blue` | St. Martin's Island, Cox's Bazar & coastal Malabar/Andaman groves | Sprays clear coconut water 1 tile orthogonally when popped inside a Wrapped combo, washing away Sticky Slime. |
| `CANDY_DARJEELING_ORANGE` | **Foothill Mandarin Crescent** | `bright_orange` | Sylhet citrus hills & Darjeeling/Sikkim foothill orchards | Zest burst clears Tea Mist clouds in a 1-tile radius around the match. |
| `CANDY_PISTACHIO_KULFI` | **Saffron Pistachio Kulfi** | `frost_mint` | Old Dhaka & Delhi/Kolkata summer street kulfi carts | Crafted or spawned in thermal levels: matching chills approaching Lava Crawlers (-8% danger) or freezes 1 Caramel Lava spout for 2 turns. |
| `CANDY_CRISPY_JILAPI` | **Golden Syrup Jilapi Coil** | `amber_gold` | Riverbank fairs and everyday sweet shops across Bangladesh and India | Acts as a spiral energy relay: when hit by any Striped blast, re-emits a ring pulse hitting all 8 surrounding tiles. |
| `CANDY_SPONGY_RASGULLA` | **Cloud-Soft Rasgulla Orb** | `pearl_white` | Bengal dairy sweetmaking tradition (Bangladesh & West Bengal) | Cushion physics: matching Rasgulla Orbs inflates Mochi's safety airbag bumper, absorbing 1 falling shale rock or crusher shock. |

---

## 3. Strategic Survival Tool System (18 Tools)

Players bring up to **3 Survival Tools** into a mission. Tools create tactical openings, clutch saves, or geometric setups—never automatic victories.

### Artisan Mallet (Hammer) (`TOOL_CANDY_HAMMER`) — *Unlocks Campaign Lvl 1*
- **Purpose:** Shatters 1 HP layer of a single targeted board obstacle or pops 1 unlocked candy without spending a turn.
- **How It Works:** Player taps the Hammer slot, then taps any valid board tile. Deals 1 structural hit to Bamboo Cages, Ice, Chains, Coconut Husks, or Crates, or triggers 1 candy/special.
- **When Usable:** During player idle input phase on the puzzle board (disabled mid-cascade).
- **Limitations & Strategic Trade-Off:** Cannot destroy indestructible mission Keys, Brass Trunks (requires key-gems), or multi-HP armored obstacles in a single hit; max 2 uses per mission.
- **3D Visual Effect:** A carved rosewood-and-sugar mallet swings down in 3D with radial candy dust and a crisp contact shockwave.
- **Candy Mechanic Interaction:** If used directly on a Striped, Wrapped, or Jilapi Coil candy, immediately detonates that special candy in place.
- **Impact on Mission Difficulty:** Relieves single-tile choke bottlenecks (such as a final block under a Key) without clearing entire objective quotas.

### Cryo Freeze Blast (`TOOL_FREEZE_BLAST`) — *Unlocks Campaign Lvl 2*
- **Purpose:** Temporarily halts advancing enemies in the upper survival arena for 6 seconds (or 2 enemy turn ticks).
- **How It Works:** Broadcasts a cold shockwave across the rescue stage, encasing active enemies in translucent frost rime and pushing danger back by 8%.
- **When Usable:** Anytime during active gameplay while danger is below 99%.
- **Limitations & Strategic Trade-Off:** Does not halt non-biological mechanical crushers (`OBS_PISTON_CANDY_CRUSHER`) and has a 15-second cooldown between charges; Lava Crawlers thaw 40% faster.
- **3D Visual Effect:** Expanding sapphire frost ring with floating ice prisms and crystalline rim-shader override on monsters.
- **Candy Mechanic Interaction:** Also freezes spreading Chili-Ember Fire on the board for 1 turn so it cannot propagate.
- **Impact on Mission Difficulty:** Buys a critical 2-move window to complete a 4/5-candy setup under high survival pressure.

### Bazaar Basket Shuffle (`TOOL_SMART_SHUFFLE`) — *Unlocks Campaign Lvl 3*
- **Purpose:** Rearranges all movable normal candies when the board has poor synergy, guaranteeing at least two 4-match opportunities.
- **How It Works:** Lifts all unchained, non-key candies into a swirling woven bamboo basket vortex and redistributes them into high-potential clusters.
- **When Usable:** During idle board state when at least 6 movable candies exist.
- **Limitations & Strategic Trade-Off:** Does not move locked, iced, slimed, or caged tiles; costs 1 tool charge (auto-deadlock shuffles remain free but do not bias toward 4-matches).
- **3D Visual Effect:** Candies arc upward in a spiral ribbon trail with golden chimes before snapping cleanly back into tile wells.
- **Candy Mechanic Interaction:** Preserves existing Special Candies on the board and upgrades 1 random fruit candy into a Striped candy.
- **Impact on Mission Difficulty:** Mitigates RNG drought on compartmentalized boards while still requiring the player to spot and execute the resulting combos.

### Crystal Sugar Shield (`TOOL_SUGAR_SHIELD`) — *Unlocks Campaign Lvl 7*
- **Purpose:** Wraps Mochi in a shimmering spun-sugar dome that blocks exactly one incoming hazard hit, slime spit, or enemy lunge.
- **How It Works:** Applies a 1-stack protective barrier around Mochi in the rescue arena. When danger hits 100% or a falling rock/projectile strikes Mochi, the dome shatters and knocks the threat back 22%.
- **When Usable:** Proactively during active play before Mochi is caught.
- **Limitations & Strategic Trade-Off:** Strictly 1-charge per mission; does not protect against floor collapse if Mochi has no platform beneath her (`OBS_ROPE_SLAT_BRIDGE` total collapse).
- **3D Visual Effect:** Iridescent geodesic sugar-glass bubble humming around Mochi that bursts into rainbow shards upon absorbing a hit.
- **Candy Mechanic Interaction:** Matching 5 candies (Rainbow Bomb) while Shield is active overcharges the dome to reflect 1 projectile back at Bosses.
- **Impact on Mission Difficulty:** Provides a forgiving safety net on spike-damage levels without advancing collection objectives.

### Golden Jute Grapple Rope (`TOOL_JUTE_ROPE_RESCUE`) — *Unlocks Campaign Lvl 9*
- **Purpose:** Creates a temporary braided jute zip-line or swing bypass across 1 missing bridge segment or flooded pit.
- **How It Works:** Fires a bamboo grappling hook above Mochi, allowing her to cross 1 unbuilt bridge gap or hover safely above rising lava/water for 8 seconds.
- **When Usable:** On bridge, chasm, flood, or multi-ledge survival missions.
- **Limitations & Strategic Trade-Off:** Bridges only 1 segment out of multi-segment chasms; rope frays after 8 seconds (or 3 moves) if the permanent objective isn't finished.
- **3D Visual Effect:** Braided golden Bengal jute fiber line snaps taut between carved wooden posts as Mochi holds on with both hands.
- **Candy Mechanic Interaction:** Matching Guava or Jackfruit candies while Mochi hangs on the rope reinforces its duration by +2 seconds.
- **Impact on Mission Difficulty:** Lets players survive a temporary lava/tide surge while hunting for the last bridge plank matches.

### Amber Gur Hourglass (Time Boost) (`TOOL_CHRONO_SANDGLASS`) — *Unlocks Campaign Lvl 11*
- **Purpose:** Adds +12 seconds to real-time survival missions or +3 emergency moves on turn-capped missions.
- **How It Works:** Flips an ornate brass-and-jaggery sandglass, slowing arena hazard clocks by 50% for 4 seconds while adding buffer time/moves.
- **When Usable:** Once per mission when remaining time < 20s or remaining moves <= 5.
- **Limitations & Strategic Trade-Off:** Cannot be stacked repeatedly in the same level (hard cap: 1 per attempt); does not unlock jammed mechanical gates.
- **3D Visual Effect:** Warm golden time-dust ripples across the HUD clock and briefly tints the arena in slow-motion amber light.
- **Candy Mechanic Interaction:** During the 4-second slow-motion window, cascading matches grant +25% bonus score.
- **Impact on Mission Difficulty:** Converts razor-thin 95%-complete losses into clutch victories while still requiring the player to clear the remaining tasks.

### Jilapi Spark Bomb (Candy Bomb) (`TOOL_JILAPI_CLUSTER_BOMB`) — *Unlocks Campaign Lvl 13*
- **Purpose:** Places and detonates a high-energy 3x3 blast on a chosen board coordinate to crack dense obstacle clusters.
- **How It Works:** Player drags the Jilapi Spark Bomb onto any board cell; it pulses once and blasts a 3x3 square, dealing 1 damage to all obstacles in range.
- **When Usable:** During idle board input; 2-move cooldown if multiple charges are carried.
- **Limitations & Strategic Trade-Off:** In Cave/Foothill levels (`OBS_LOOSE_SHALE_ROCKFALL`), heavy bomb blasts shake loose 2 small pebble blockers at the top of the board—demanding smart timing!
- **3D Visual Effect:** Sizzling golden spiral firework expands into a crisp 3D shockwave ring with caramelized sparks.
- **Candy Mechanic Interaction:** Triggers chain reactions with any Striped, Wrapped, or Prism Mirror tiles inside its 3x3 blast zone.
- **Impact on Mission Difficulty:** Breaks symmetric blocker walls in mid/late chapters while carrying tactical seismic risk in rockfall caves.

### Royal Kulfi Ice Cannon (`TOOL_KULFI_ICE_CANNON`) — *Unlocks Campaign Lvl 16*
- **Purpose:** Fires a concentrated cryo-beam that simultaneously freezes 1 arena hazard lane AND solidifies molten lava/bog tiles in a selected column.
- **How It Works:** Player selects a target column; the cannon fires upward from that column into the rescue arena, cooling lava/fire along the path and stunning any enemy above that column.
- **When Usable:** During active play; requires aiming at one of the board columns.
- **Limitations & Strategic Trade-Off:** Narrow 1-column width—missing a fast-moving Flying Candy Thief wastes the stun portion; 18-second cooldown.
- **3D Visual Effect:** Creamy mint-sapphire beam laced with pistachio crystal flecks leaves a frosted crust trail from board to arena.
- **Candy Mechanic Interaction:** Turns 1 random candy in the fired column into a `CANDY_PISTACHIO_KULFI` special piece.
- **Impact on Mission Difficulty:** Rewards spatial alignment between board column selection and enemy position in the arena.

### Orchard Harvester Magnet (`TOOL_BAMBOO_MAGNET`) — *Unlocks Campaign Lvl 19*
- **Purpose:** Pulls stranded mission Keys, Brass Tokens, or Fruit Baskets 2 rows downward through normal candies (or collects up to 5 loose target fruits).
- **How It Works:** Generates a downward magnetic pulse at the bottom exit chutes, swapping each Key downward past up to 2 normal unlocked candies.
- **When Usable:** When at least 1 collectible drop item or fruit quota is active on the board.
- **Limitations & Strategic Trade-Off:** Blocked by solid obstacles (`OBS_BAMBOO_WOOD_CAGE`, `OBS_SLIDING_STONE_WALL`, `OBS_COCONUT_HUSK_BUMPER`)—players must clear hard blockers beneath the Key first!
- **3D Visual Effect:** U-shaped brass-and-bamboo magnet hums with golden field rings below the board, tugging metallic keys downward.
- **Candy Mechanic Interaction:** After keys shift 2 rows down, displaced candies settle and can trigger natural cascade matches.
- **Impact on Mission Difficulty:** Eliminates frustrating final-row stalls on Key levels without bypassing solid obstacle puzzles.

### Tender Coconut Extinguisher (`TOOL_FOAM_EXTINGUISHER`) — *Unlocks Campaign Lvl 22*
- **Purpose:** Extinguishes up to 4 Chili-Ember Fire Barriers on the board and cools rising Caramel Lava by 20%.
- **How It Works:** Sprays a wide cone of chilled coconut-foam across burning board tiles and onto the arena lava surface.
- **When Usable:** Active whenever Fire Barriers, Lava Crawlers, or Rising Caramel Lava are present.
- **Limitations & Strategic Trade-Off:** Ineffective against Ice, Water, Chains, or Mechanical enemies; extinguished lava re-heats after 10 seconds if objectives stall.
- **3D Visual Effect:** Billowing white frothy coconut-milk spray with cool steam puffs and sizzling audio feedback.
- **Candy Mechanic Interaction:** Leaves clean wet droplets on 2 extinguished candies, granting +1 bonus count if matched on the next move.
- **Impact on Mission Difficulty:** Prevents runaway fire-spread spirals when the board gets cramped.

### Monsoon Hydro Blaster (`TOOL_MONSOON_WATER_BLASTER`) — *Unlocks Campaign Lvl 25*
- **Purpose:** High-pressure water jet that flushes Sticky Mango Slime, Honeycomb Wax, and Mud Bog across a 2-row horizontal sweep.
- **How It Works:** Player taps any row; a brass pump-nozzle sweeps across that row and the row below, dissolving all 1-layer sticky coatings without destroying the candies underneath.
- **When Usable:** During player input phase; max 2 charges per mission.
- **Limitations & Strategic Trade-Off:** Do NOT use carelessly in Monsoon Flood levels (`OBS_MONSOON_FLOOD_TIDE`), where firing adds +5% water height to the flood gauge—creating a genuine tactical trade-off!
- **3D Visual Effect:** Sparkling turquoise pressurized water stream arcs left-to-right with rainbow mist droplets.
- **Candy Mechanic Interaction:** Frees slimed Special Candies intact so they can immediately be swapped on the same turn.
- **Impact on Mission Difficulty:** Hard-counters Slime Monster & Boss slime barrages while demanding flood-gauge awareness in Chapter 7.

### Crystal Swap Teleporter (`TOOL_PRISM_TELEPORTER`) — *Unlocks Campaign Lvl 28*
- **Purpose:** Teleports and exchanges any two non-locked items anywhere on the board—even non-adjacent tiles!
- **How It Works:** Player taps Tile A and Tile B anywhere on the grid. Both pieces warp through twin violet-gold portals without consuming a move.
- **When Usable:** During idle input; works on normal candies, Special Candies, and unlocked Golden Keys.
- **Limitations & Strategic Trade-Off:** Cannot target Chained, Iced, Caged, or Solid Wall cells; does not auto-detonate unless the teleported placement forms a 3+ match.
- **3D Visual Effect:** Twin spinning geometric quartz portals open beneath both tiles as the pieces beam across in a flash of prism light.
- **Candy Mechanic Interaction:** Enables pro-level plays: teleporting a Rainbow Bomb next to a Striped Candy across the board, or warping a Key from a blocked column to an open drain chute!
- **Impact on Mission Difficulty:** Highest skill-ceiling tool in the game—rewards clever board reading rather than brute force.

### Sylhet Bamboo Gust Fan (`TOOL_TEA_LEAF_GUST_FAN`) — *Unlocks Campaign Lvl 14*
- **Purpose:** Dispels all Tea Mist clouds on the board, reverses Wind Tunnel currents for 2 turns, and blows Flying Candy Thieves away.
- **How It Works:** Swings a giant woven palm-and-bamboo fan, sweeping clean air diagonally across both puzzle board and rescue canopy.
- **When Usable:** Whenever Mist, Wind Tunnels, Airborne Spores, or Flying Thieves are active.
- **Limitations & Strategic Trade-Off:** Fans Chili-Ember Fire if active (causing 1 spark hop if fire isn't extinguished first!), reinforcing elemental mindfulness.
- **3D Visual Effect:** Swirling emerald tea leaves and golden wind ribbons sweep across the 3D viewport.
- **Candy Mechanic Interaction:** Shifts loose airborne bubble-candies 1 column toward the center where combos are easier to form.
- **Impact on Mission Difficulty:** Restores full board visibility in fog chapters and interrupts aerial theft animations.

### Golden Resin Platform Clamp (`TOOL_JACKFRUIT_RESIN_ANCHOR`) — *Unlocks Campaign Lvl 31*
- **Purpose:** Stabilizes Crumbling Biscuit Platforms, Collapsing Bridges, and Rotating Gates in their current state for 3 moves (or 10 seconds).
- **How It Works:** Coats structural joints in amber jackfruit-tree resin, locking moving/falling arena mechanisms in place.
- **When Usable:** Strategic timing tool—must be triggered WHILE a Rotating Gate is open or BEFORE a platform drops!
- **Limitations & Strategic Trade-Off:** If triggered while a Rotating Gate is in the CLOSED orientation, it locks the gate closed too—timing matters!
- **3D Visual Effect:** Warm glowing amber resin crystallizes around platform hinges and bridge ropes.
- **Candy Mechanic Interaction:** Also prevents Sliding Stone Walls on the board from shifting for 2 turns.
- **Impact on Mission Difficulty:** Transforms frantic twitch-timing platform hazards into controlled puzzle windows.

### Giant Rasgulla Trampoline (`TOOL_RASGULLA_BOUNCE_PAD`) — *Unlocks Campaign Lvl 34*
- **Purpose:** Deploys a super-elastic spongy Rasgulla cushion ahead of or beneath Mochi to deflect 1 rolling boulder or bounce her over a ground spike trap.
- **How It Works:** Drops a plump white syrup-sponge pad onto Mochi's immediate track segment.
- **When Usable:** On Boulder, Spike Trap, Falling Rock, or Multi-Tier Ledge levels.
- **Limitations & Strategic Trade-Off:** Absorbs 1 heavy boulder/rock impact before squishing flat; ineffective against liquid hazards (lava/flood).
- **3D Visual Effect:** Comical squishy jelly deformation physics with sparkling sugar-syrup droplets and a boing harmonic.
- **Candy Mechanic Interaction:** Spawns 2 `CANDY_SPONGY_RASGULLA` pieces onto the top row of the puzzle board.
- **Impact on Mission Difficulty:** Counters boulder/crusher checkpoints while feeding sponge candies back into the match grid.

### Firefly Glass Jar Beacon (`TOOL_LANTERN_FLARE_BEACON`) — *Unlocks Campaign Lvl 38*
- **Purpose:** Illuminates darkened cave/canopy zones and dazzles nocturnal Jungle Crawlers or Mirage Chameleons, locking their color camouflage.
- **How It Works:** Releases a warm swarm of bioluminescent orchard fireflies from a mason jar.
- **When Usable:** In shadowed cavern levels or against camouflaged/stealth enemies.
- **Limitations & Strategic Trade-Off:** Lasts 3 moves (or 12 seconds); does not deal direct obstacle damage.
- **3D Visual Effect:** Dozens of warm golden 3D point-light fireflies orbit Mochi and highlight optimal hint matches on the board.
- **Candy Mechanic Interaction:** Reveals hidden color identities of camouflaged/misted candies and forces Mirage Chameleon to stay vulnerable.
- **Impact on Mission Difficulty:** Removes information-hiding friction in late-game chapters.

### Brass Riverboat Winch (`TOOL_GRAPPLING_PULLEY_WINCH`) — *Unlocks Campaign Lvl 41*
- **Purpose:** Manually cranks Timed Escape Doors, Sluice Floodgates, or Ferry Gondolas forward by +25% progress.
- **How It Works:** Attaches a heavy brass river-barge pulley to the primary mechanical arena gate and winches it 1 stage open.
- **When Usable:** Only on missions featuring mechanical gates, ferries, or timed shutters; max 1 use per mission.
- **Limitations & Strategic Trade-Off:** If a gate is still padlocked by a Key objective, the winch cannot pull until the Key lock is disengaged first.
- **3D Visual Effect:** Spinning brass gears and taut steel cable crank the heavy door upward with metallic ratcheting audio.
- **Candy Mechanic Interaction:** Clears 1 Wrought Metal Chain on the board from excess cable tension.
- **Impact on Mission Difficulty:** Provides clutch mechanical progress in complex multi-objective late-game stages.

### Saffron Glaze Color Brush (`TOOL_SYRUP_CONDUIT_BRUSH`) — *Unlocks Campaign Lvl 44*
- **Purpose:** Repaints up to 3 contiguous normal candies into a single fruit color of the player's choice to engineer 5-in-a-row Rainbow Bombs or L/T combos.
- **How It Works:** Player selects the brush, drags across up to 3 adjacent unlocked candies, and releases; all 3 adopt the color of the first touched candy.
- **When Usable:** During idle board state; 1 charge per mission.
- **Limitations & Strategic Trade-Off:** Only paints up to 3 tiles—to form a 4-match or 5-match Rainbow Bomb, the player must paint next to 1–2 existing matching candies and execute the final swap!
- **3D Visual Effect:** Lush glossy saffron-gold pastry brush strokes glossy color glaze over each touched 3D candy.
- **Candy Mechanic Interaction:** Directly enables player-crafted Striped, Wrapped, Energy Bomb, or Rainbow Color Bomb formations on demand.
- **Impact on Mission Difficulty:** Rewards foresight and geometry planning on Expert/Master levels (41–50).

---

## 4. Survival Obstacles Library (24 Obstacles)

| Obstacle ID | Name | Zone | HP | First Lvl | Behavior & Combinatorics | Clear / Counter Condition |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `OBS_CARAMEL_LAVA` | **Rising Caramel Lava** | `arena_and_board_bottom` | 1 | Lvl 2 | Bubbling golden-orange molten caramel rises steadily in the survival pit; in advanced chapters, lava geysers bubble onto bottom-row board tiles if left unchecked for 3 moves. *(Pairs with Collapsing Bridges and Fire Barriers to create vertical urgency.)* | Cooled into walkable sugar-crust by matching Coconut/Kulfi candies, activating Ice Cannons, or using Tender Coconut Extinguisher. |
| `OBS_SPIKED_BOULDER` | **Rolling Spiked Jawbreaker** | `arena_track` | 3 | Lvl 5 | Massive layered candy boulder studded with sugar-crystal spikes rolling down sloped orchard/foothill tracks behind Mochi. *(Combines with Rotating Gates and Crumbling Platforms on downhill chase stages.)* | Slowed by Rasgulla Bounce Pads, halted by raised mechanical gates, or shattered by 3 Special Candy blasts. |
| `OBS_GLACIER_ICE_BARRIER` | **Himalayan Frost Ice** | `board_overlay` | 2 | Lvl 3 | Encases candies or exit chutes in 1-to-2 layers of translucent alpine ice, preventing tile movement until thawed. *(Protects Golden Keys and Brass Trunks from premature collection.)* | Cracked by matching the candy inside (if 1-layer translucent) or matching orthogonally adjacent candies / Striped lasers. |
| `OBS_BAMBOO_WOOD_CAGE` | **Woven Bamboo Crate Cage** | `board_solid` | 2 | Lvl 7 | Sturdy criss-crossed Bengal bamboo crate occupying a board cell and blocking vertical candy/marble gravity above drain chutes. *(Forms diagonal waterfall funnels when staggered with Coconut Husk Bumpers.)* | Damaged by adjacent matches, Jackfruit heavy-match shockwaves (+1 bonus damage), Hammer, or Bomb blasts. |
| `OBS_WROUGHT_METAL_CHAIN` | **Forged Iron Padlock Chain** | `board_lock` | 1 | Lvl 5 | Crossed metallic links locking a candy in place so it cannot be swapped or fall, though its color can still participate in matches. *(Locks Special Candies or Keys mid-board as high-value rewards once freed.)* | Include the chained candy in a 3+ match, hit with any Special blast, or snap via Riverboat Winch tension. |
| `OBS_STICKY_MANGO_SLIME` | **Sticky Tree-Sap Slime** | `board_coating` | 1 | Lvl 6 | Viscous lime-amber gummy ooze spat by serpents or oozing from slime blobs; prevents swapping and spreads 1 tile every 3 turns if none are cleared. *(Synergizes dangerously with Tea Mist Clouds that hide where slime is about to spread.)* | Cleared by matching with the coated candy, Coconut Splash combos, or Monsoon Water Blaster. |
| `OBS_CRUMBLING_BISCUIT_PLATFORM` | **Falling Wafer Platform** | `arena_floor` | 1 | Lvl 8 | Crispy butter-biscuit ledges under Mochi that crack stage-by-stage every 10 seconds (or 3 moves) before dropping into the chasm. *(Pairs with Jute Grapple Rope and Timed Escape Doors.)* | Advance Mochi to the next safe ledge via objective matches, or clamp with Golden Resin Platform Anchor. |
| `OBS_SLIDING_STONE_WALL` | **Moving Terracotta Partition** | `board_dynamic_divider` | 99 | Lvl 10 | Indestructible 2-tile terracotta slider bar that shifts 1 column left or right after every move, dynamically opening and closing drain chutes! *(Forces rhythmic planning on Key-drop and Marble-drain boards.)* | Not destroyed—outsmarted by timing matches when the chute aligns, or temporarily pinned with Resin Anchor. |
| `OBS_ROPE_SLAT_BRIDGE` | **Collapsing Suspension Bridge** | `arena_path` | 4 | Lvl 12 | Multi-plank wooden bridge across canyon/river gaps whose slats snap one by one under enemy pursuit or monsoon gusts. *(Combines with Gale Wind Tunnels and Mangrove Root Crawlers.)* | Rebuilt plank-by-plank by matching Guava/Jackfruit structural candies on the board. |
| `OBS_BUBBLING_MUD_BOG` | **Sticky Sundarbans Mud Bog** | `hybrid_linked` | 2 | Lvl 17 | 100% poison-free, comical chocolaty silt bog! Slows Mochi's movement speed by 50% in the arena and swallows falling board items unless paved over with leaf-mats. *(Slows Mochi while Mangrove Root Crawlers close distance.)* | Flushed clean by Monsoon Water Blaster, Daab Coconut matches, or bridged with Mango Nectar slicks. |
| `OBS_MONSOON_FLOOD_TIDE` | **Monsoon River Floodwater** | `hybrid_linked` | 1 | Lvl 37 | Submerges the bottom 2–3 rows of the puzzle board in sparkling river water! Submerged candies float UPWARD instead of falling downward when matched, inverting cascade physics! *(Creates mind-bending dual-gravity boards where top rows fall down and bottom rows float up!)* | Lowered by matching pump-valve candies or cranking Sluice Floodgates. |
| `OBS_CHILI_EMBER_FIRE` | **Spiced Sugar Fire Barrier** | `board_spreading` | 1 | Lvl 22 | Crackling warm cinnamon-chili flame ring around board tiles; spreads 1 adjacent tile if no fire tile is extinguished on a turn. Destroys normal candies it overtakes (never Keys). *(Avoid using Gust Fan while Fire is active unless extinguished first!)* | Extinguished by adjacent Jamun/Coconut matches, Freeze Blast, or Tender Coconut Extinguisher. |
| `OBS_ROTATING_WATERWHEEL_GATE` | **Rotating Tea-Mill Gate** | `hybrid_linked` | 99 | Lvl 13 | 4-blade wooden paddle turnstile that rotates 90 degrees after every move, alternating between blocking horizontal matches vs blocking vertical drops—and toggling Mochi's upper tunnel gate in sync! *(Turns move counting into a puzzle rhythm game.)* | Controlled via move cadence, Riverboat Winch, or Resin Anchor. |
| `OBS_PISTON_CANDY_CRUSHER` | **Sugar-Mill Piston Crusher** | `hybrid_linked` | 3 | Lvl 24 | Heavy brass press that glows amber to telegraph 1 turn ahead, then slams down—compressing an arena corridor or crushing unprotected Special Candies in its target column! *(Punishes hoarding Special Candies in telegraphed danger columns.)* | Jammed for 3 turns by hitting its gear-switch tile with a Striped/Wrapped blast, or absorbed by Rasgulla Orbs. |
| `OBS_RETRACTABLE_SPIKE_TRAP` | **Alternating Bamboo Thorn Plate** | `arena_floor` | 1 | Lvl 18 | Floor panels along Mochi's escape corridor whose blunt cartoon thorn-pegs pop UP on odd moves and retract DOWN on even moves. *(Adds turn-synchronization tension to Key unlocks.)* | Advance Mochi only on safe 'even' beats, shield her with Sugar Shield, or bounce over with Rasgulla Trampoline. |
| `OBS_BRASS_TREASURE_TRUNK` | **Locked Brass Sweet Trunk** | `board_objective_container` | 3 | Lvl 21 | Ornate locked market chest sitting on the board with 3 colored gem-locks (e.g., 1 Mango, 1 Litchi, 1 Jamun); immune to generic hammers until its matching fruit colors are matched nearby! *(Requires targeted color-hunting amidst chaotic hazards.)* | Match the displayed fruit colors anywhere in the chest's row/column to pop all 3 clasps and release Rescue Parts. |
| `OBS_GALE_WIND_TUNNEL` | **Cyclone Wind Current** | `hybrid_linked` | 99 | Lvl 15 | Breezy wind stream across 2 designated rows that slides all unblocked candies 1 cell sideways at the end of every turn—and pushes Mochi's sailboat/balloon in the arena! *(Auto-creates surprise cascade chains for clever players who anticipate the 1-cell sideways drift!)* | Redirected or calmed for 2 turns by Sylhet Bamboo Gust Fan or matching Wind-Vane switches. |
| `OBS_FERRY_MOVING_PLATFORM` | **Country-Boat Ferry Gondola** | `arena_path` | 1 | Lvl 27 | Wooden river sampan carrying Mochi across wide water channels; drifts backward with the current unless propelled forward by matching Blue/Aqua candies. *(Turns the entire board into a tug-of-war propulsion engine.)* | Reach the far pier by accumulating propulsion matches while fending off Whirlpool Eels. |
| `OBS_LOOSE_SHALE_ROCKFALL` | **Foothill Sugar-Shale Rockfall** | `hybrid_linked` | 1 | Lvl 39 | Unstable cavern ceiling that drops 2 crunchy rock-candy pebbles into the top board rows (and threatens Mochi's helmet!) whenever a 3x3 Bomb detonates. *(Balances explosive power-up spam in Chapter 8 & 10.)* | Pebbles clear with 1 adjacent match; promotes precision Striped/Teleporter play over reckless bombing. |
| `OBS_TIMED_BLAST_SHUTTER` | **Counterweight Sluice Shutter** | `arena_gate` | 4 | Lvl 30 | Heavy exit blast door that starts 100% OPEN at level start and ratchets CLOSED by 4% every second! Matching counterweight candies cranks it back up. *(Inverts the standard 'unlock closed gate' formula into a 'hold the door open!' thriller.)* | Keep the shutter >= 35% open at the moment Mochi reaches the exit threshold. |
| `OBS_TEA_MIST_CLOUD` | **Sylhet Highland Mist Veil** | `board_vision_veil` | 1 | Lvl 12 | Soft pearlescent valley fog drifting over a 3x3 patch of candies, obscuring their colors (silhouettes faintly peek through!) until cleared. *(Tests silhouette recognition (which is why each 3D candy has a unique shape!).)* | Cleared by any match touching the mist, Mandarin Orange zest burst, Bamboo Gust Fan, or Firefly Beacon. |
| `OBS_COCONUT_HUSK_BUMPER` | **Armored Coconut Husk Bumper** | `board_deflector` | 3 | Lvl 32 | Tough fibrous shell angled at 45 degrees: absorbs 1 HP when hit by a Striped laser AND reflects the remaining laser beam 90 degrees across the perpendicular axis! *(Enables trick-shot laser geometry around indestructible corners!)* | 3 adjacent matches or 3 laser bank-shots crack the husk open to reveal a bonus Tender Coconut candy. |
| `OBS_HONEYCOMB_WAX_SEAL` | **Sundarbans Golden Honeycomb** | `board_network` | 2 | Lvl 19 | Connected cluster of 4–7 hexagonal golden wax cells; peripheral cells regenerate 1 HP unless the glowing central 'Queen Drop' cell is cracked first! *(Teaches target prioritization instead of random matching.)* | Focus matches or Hammer/Striped blasts onto the glowing central Queen Wax cell to shatter the entire linked honeycomb at once! |
| `OBS_CRYSTAL_PRISM_MIRROR` | **Refracting Quartz Prism** | `board_amplifier` | 99 | Lvl 47 | Permanent crystalline node on the board: whenever a Striped blast or Rainbow arc touches it, the prism splits and fires beams in BOTH row and column directions! *(Core mechanic of Chapter 10 & the Final Prism Hydra Boss fight!)* | Beneficial puzzle structure—rotates 45 degrees each turn between Orthogonal (+) and Diagonal (X) beam splitting! |

---

## 5. Enemy Roster (12 Enemies) & Boss Encounters (6 Multi-Phase Bosses)

### 5.1 Regular & Elite Enemies (12)

#### Emerald Gummy Serpent (`ENEMY_GREEN_SERPENT`) — *Recurring Signature Pursuer, First Appears Lvl 1*
- **Behavior:** Slithers steadily through curved orchard chutes, tea aqueducts, and cavern tunnels toward Mochi's chamber.
- **Attack Pattern:** Continuous spline advance (+1.8% to +2.4% danger/sec); lunges faster (+35% burst) for 2 seconds if the player makes 2 invalid swaps in a row.
- **Weakness:** Sensitive to Cryo Freeze Blasts, Kulfi matches, and counterweight gate slams.
- **Counter Strategy:** Prioritize drain-column matches and keep a Freeze Blast or Blue/Kulfi match ready when danger passes 70%.
- **Visual Identity:** Segmented glossy emerald-lime dragon-serpent with expressive yellow slit-eyes, dorsal lime ridges, and comical chomping white fangs.
- **Gameplay Interaction:** Directly drives the real-time Danger Meter and triggers Mochi's nervous/scared animations as distance shrinks.
- **Defeat Animation Concept:** Gets bonked harmlessly on the snout by the closing rescue gate, sees cartoon stars, and coils backward down the chute.

#### Golla-Gulp (Giant Candy-Eating Creature) (`ENEMY_GLUTTON_CHOMPER`) — *Objective Competitor, First Appears Lvl 8*
- **Behavior:** Plump, wide-mouthed magenta-and-cream puff-beast perched beside the puzzle board, eyeing the player's target fruit candies!
- **Attack Pattern:** Every 3 moves, extends a stretchy chameleon-like tongue onto the board to gobble up to 3 candies of the player's Main Objective fruit color—advancing its belly-meter toward Mochi's platform!
- **Weakness:** Gets a comical 'sour brain-freeze' hiccup if tricked into swallowing a Striped Candy, Wrapped Candy, or tangy Darjeeling Orange cluster!
- **Counter Strategy:** Match away target fruits before its 3-turn tongue telegraph lands, OR slide a Striped/Wrapped candy onto its targeted tile so it swallows a fizzy pop and spits back +5 bonus fruits!
- **Visual Identity:** Round bouncy berry-colored gourmand creature wearing a tiny chef's bib with expressive hungry eyes.
- **Gameplay Interaction:** Marks 3 target board cells with a fork-and-spoon reticle 1 turn before slurping them.
- **Defeat Animation Concept:** Burps out a shower of sparkling rainbow candies, pats its full round belly happily, and naps peacefully.

#### Brass Clockwork Automaton (`ENEMY_CLOCKWORK_SENTINEL`) — *Turn-Based Mechanical Guardian, First Appears Lvl 13*
- **Behavior:** Polished brass-and-teakwood wind-up toy guardian patrolling warehouse and carnival tracks strictly on player move ticks (no real-time rush—pure tactical chess!).
- **Attack Pattern:** Advances 1 track node per player move; every 4th move, turns its wind-up key to lock 2 board tiles in Wrought Metal Chains.
- **Weakness:** Overwinds and stalls for 2 turns when hit by a Striped Laser aligned with its column or jammed with Riverboat Winch.
- **Counter Strategy:** Take time to plan high-efficiency combos (since it only moves when you move!) and snipe its column with vertical Striped blasts.
- **Visual Identity:** Charming vintage brass clockwork knight-bot with a spinning golden dorsal wind-up key and glowing amber monocle.
- **Gameplay Interaction:** Converts real-time panic into pure move-efficiency survival puzzles.
- **Defeat Animation Concept:** Its dorsal wind-up key spins harmlessly free with a playful cuckoo-clock spring boing as it bows politely.

#### Foothill Snow-Kulfi Golem (`ENEMY_FROST_YETI_GOLEM`) — *Board Freezer, First Appears Lvl 36*
- **Behavior:** Lumbering, goofy snow-and-pistachio-ice creature stomping down Himalayan foothill ledges.
- **Attack Pattern:** Inhales deeply for 1 turn, then exhales a frosty gale across a 2x3 board zone, encasing candies in `OBS_GLACIER_ICE_BARRIER`.
- **Weakness:** Immune to Freeze Blast! Instead, melts and shrinks rapidly when countered by warm `CANDY_CRISPY_JILAPI` coils, Orange/Litchi matches, or Chili-Sugar warmth.
- **Counter Strategy:** Do NOT bring cryo tools—equip Artisan Mallet or Jilapi Spark Bomb and match warm red/orange candies to melt its frost armor.
- **Visual Identity:** Fluffy snow-white and mint-ice golem with waffle-cone shoulder pads and frosty eyebrows.
- **Gameplay Interaction:** Subverts player reliance on Freeze Blast by demanding warm-color combos instead.
- **Defeat Animation Concept:** Melts down into a cheerful miniature snowman waving a tiny waffle flag.

#### Sizzling Caramel Salamander (`ENEMY_MOLTEN_CRAWLER`) — *Thermal Spreader, First Appears Lvl 22*
- **Behavior:** Glowing amber-crust lizard skittering along cauldron rims and bridge ropes.
- **Attack Pattern:** Drops 1 `OBS_CHILI_EMBER_FIRE` spark onto the board every 8 seconds while heating the Caramel Lava beneath Mochi.
- **Weakness:** Takes double pushback from `CANDY_TENDER_COCONUT`, `CANDY_PISTACHIO_KULFI`, Kulfi Ice Cannon, and Tender Coconut Extinguisher.
- **Counter Strategy:** Cool its glowing shell with blue/aqua matches or Foam Extinguisher to turn its shell into brittle sugar-glass, then shatter with any combo.
- **Visual Identity:** Translucent glowing butterscotch-orange gecko with flickering cartoon flame tail.
- **Gameplay Interaction:** Links board fire-control directly to arena lava-rise speed.
- **Defeat Animation Concept:** Cools into a shiny harmless amber candy statue that slides smoothly off the ledge.

#### Armored Jawbreaker Roller (`ENEMY_JAWBREAKER_PANGOLIN`) — *Stance-Switching Charger, First Appears Lvl 29*
- **Behavior:** Alternates between curled 'Invulnerable Rolling Ball' stance (2 turns) and uncurled 'Dizzy Breather' stance (2 turns).
- **Attack Pattern:** While curled, rolls rapidly down ramps and shrugs off normal blasts; shakes loose 2 board blockers on wall impact.
- **Weakness:** Deflecting its roll with a `TOOL_RASGULLA_BOUNCE_PAD` or hitting it WHILE uncurled deals 3x pushback!
- **Counter Strategy:** Save Special Candies during its curled roll phase, then unleash a chain cascade the moment it uncurls!
- **Visual Identity:** Cute roly-poly creature with concentric rainbow jawbreaker armor plates.
- **Gameplay Interaction:** Teaches burst-damage timing windows instead of mindless spamming.
- **Defeat Animation Concept:** Bounces harmlessly off a spongy cushion like a pinball and rolls cheering into a hammock.

#### Sticky Gur-Slime Blob (`ENEMY_SYRUP_OOZE_BLOB`) — *Splitting Hazard, First Appears Lvl 18*
- **Behavior:** Bouncy lime-molasses jelly creature oozing down bamboo chutes.
- **Attack Pattern:** Coats 2 board candies in `OBS_STICKY_MANGO_SLIME` every 9 seconds; if hit by a raw Bomb without water, splits into 2 smaller fast blobs!
- **Weakness:** Dissolves cleanly without splitting when hit by `TOOL_MONSOON_WATER_BLASTER` or `CANDY_TENDER_COCONUT` splash matches.
- **Counter Strategy:** Use hydro/coconut cleanses rather than dry explosives.
- **Visual Identity:** Wiggly translucent chartreuse jelly cube with two floating googly eyes inside.
- **Gameplay Interaction:** Rewards elemental tool pairing (`TOOL_MONSOON_WATER_BLASTER`).
- **Defeat Animation Concept:** Washes away into sparkling clean bubbles leaving behind a shiny Rainbow Bomb on the board.

#### Acrobatic Canopy Glider (`ENEMY_MYNAH_GLIDER_THIEF`) — *Aerial Item Snatcher, First Appears Lvl 23*
- **Behavior:** Mischievous Mechanical-Winged Sugar Glider swooping over Litchi Orchards and River Markets.
- **Attack Pattern:** Hovers above a Special Candy or Golden Key for 2 turns (casting a circular shadow), then dives to carry it 2 rows UPWARD away from the exit!
- **Weakness:** Blown off-course immediately by `TOOL_TEA_LEAF_GUST_FAN` or matching candies directly inside its shadow reticle.
- **Counter Strategy:** Watch for the circular shadow reticle on Key columns and match beneath the Key before the 2-turn dive completes.
- **Visual Identity:** Playful aviator-goggled glider critter carrying a tiny woven fruit basket.
- **Gameplay Interaction:** Creates vertical tug-of-war on Key-drop missions.
- **Defeat Animation Concept:** Gets spun around by a gust of wind, drops a bonus fruit bundle, and glides off waving.

#### Faceted Crystal Sentinel (`ENEMY_QUARTZ_WARDEN`) — *Directional Shield Tank, First Appears Lvl 47*
- **Behavior:** Floating geometric crystal construct guarding Chapter 10 cavern bridges.
- **Attack Pattern:** Holds a reflective front shield that blocks vertical beams from below while firing slow laser locks onto the board.
- **Weakness:** Vulnerable from the SIDES—bank a Striped laser off `OBS_CRYSTAL_PRISM_MIRROR` or `OBS_COCONUT_HUSK_BUMPER` to strike its unshielded flank!
- **Counter Strategy:** Use board prisms and angled bumpers to route horizontal beams into its crystal core.
- **Visual Identity:** Sleek hovering amethyst-and-gold polyhedron golem.
- **Gameplay Interaction:** Turns match-3 laser routing into geometric trick-shot puzzles.
- **Defeat Animation Concept:** De-materializes into a harmonic chord of floating prism sparkles.

#### Tangle-Vine Stilt Crawler (`ENEMY_MANGROVE_ROOT_CRAWLER`) — *Bridge Saboteur, First Appears Lvl 19*
- **Behavior:** Long-legged wooden stilt-bug striding across Sundarbans creeks.
- **Attack Pattern:** Wraps vine tendrils around 1 built bridge plank or board column, locking it in `OBS_BAMBOO_WOOD_CAGE`.
- **Weakness:** Dazzled by `TOOL_LANTERN_FLARE_BEACON` and knocked back by heavy `CANDY_MADHUPUR_JACKFRUIT` L/T matches.
- **Counter Strategy:** Keep Firefly Beacon or Jackfruit clusters ready to snap its stilt-vines.
- **Visual Identity:** Whimsical animated driftwood-and-leaf stilt walker with glowing amber lantern antennae.
- **Gameplay Interaction:** Threatens already-completed bridge segments if player stalls.
- **Defeat Animation Concept:** Tangles its own stilts comically and tumbles onto a soft moss bank.

#### Swirling River-Current Eel (`ENEMY_MONSOON_WHIRLPOOL_EEL`) — *Current Manipulator, First Appears Lvl 38*
- **Behavior:** Playful electric-blue ribbon eel circling Mochi's ferry boat during monsoon crossings.
- **Attack Pattern:** Spins a mini-whirlpool every 2 moves that rotates a 2x2 block of board candies clockwise AND tugs Mochi's ferry backward 10%.
- **Weakness:** Calmed by matching `CANDY_BARISAL_GUAVA` (buoyant fruit) or stunning with Striped lightning.
- **Counter Strategy:** Anticipate its clockwise 2x2 board rotation—clever players let the eel rotate a 4th candy into a 5-in-a-row match!
- **Visual Identity:** Sleek bioluminescent turquoise ribbon-fish with golden whisker fins.
- **Gameplay Interaction:** Introduces rotational tile manipulation on flooded boards.
- **Defeat Animation Concept:** Leaps in a cheerful dolphin-arc over the ferry leaving a rainbow spray.

#### Orchard Prism Chameleon (`ENEMY_MIRAGE_CHAMELEON`) — *Color-Shifting Stalker, First Appears Lvl 42*
- **Behavior:** Perched on overhanging branches, shifting its glossy skin color after every turn to match one of the active board candy colors!
- **Attack Pattern:** Advances stealthily unless players match candies of its CURRENT displayed skin color; matching wrong colors gives 0 pushback!
- **Weakness:** Rainbow Color Bomb hits ALL colors at once, or `TOOL_LANTERN_FLARE_BEACON` locks its color for 3 turns.
- **Counter Strategy:** Watch its bright crest color badge in the arena and match that exact fruit color (or paint 3 candies with `TOOL_SYRUP_CONDUIT_BRUSH`).
- **Visual Identity:** Expressive curly-tailed cartoon chameleon with kaleidoscope crystal scales.
- **Gameplay Interaction:** Demands real-time attention to enemy visual state before choosing which match to take.
- **Defeat Animation Concept:** Blushes bright polka-dot pink, tips its leaf hat, and zips up into the canopy.

### 5.2 Multi-Phase Boss Encounters (6)

#### Mist-Coiled Tea Serpent Matriarch (`BOSS_01_MANGROVE_SERPENT_MATRIARCH`) — *Campaign Lvl 16 / Expansion Lvl 10 (`CHAPTER_02`, 120 HP)*
- **Core Weakness:** Mandarin Orange zest bursts + Striped blasts aligned with open Waterwheel paddles.
- **Phase 1 (100%–50% HP):** Slithers through twin Sylhet waterwheel aqueducts while exhaling `OBS_TEA_MIST_CLOUD` over 3x3 board zones. Matching Mandarin Oranges or firing Gust Fan clears mist and exposes her golden collar target.
- **Phase 2 (50%–0% HP):** Reverses the Rotating Waterwheel Gates every turn and spits Sticky Sap onto drain columns. Dropping 2 Brass Tea-Chest Keys while draining 40 marbles triggers the Giant Waterwheel Splashdown!
- **Defeat Sequence:** Swept gently down the tea-terrace flume slide in a giant sparkling bubble.

#### Captain Clamp — Brass Mangrove Crab-Sub (`BOSS_02_ROYAL_MANGROVE_CRAB_MECH`) — *Campaign Lvl 26 / Expansion Lvl 20 (`CHAPTER_04`, 160 HP)*
- **Core Weakness:** Jackfruit L/T shockwaves + Prism/Wrapped blasts once both Claw Trunks unlock.
- **Phase 1 (100%–55% HP):** Armored brass crab-craft pinches Mochi's orchard rope-bridge with Left & Right Mechanical Claws (represented by 2 armored `OBS_BRASS_TREASURE_TRUNK` locks on cols 1 & 6).
- **Phase 2 (55%–0% HP):** Launches 2 Canopy Glider drones to lift your Keys while rising mud bubbles below. Unlocking both Claw Trunks drops its periscope shield so Special Candies deal full damage!
- **Defeat Sequence:** Pops confetti from its brass smokestack and sputters backward into the creek.

#### Maharaja Gulp — The Grand Sweet-Guzzler (`BOSS_03_RAJA_GOLLA_DEVOURER`) — *Campaign Lvl 36 / Expansion Lvl 30 (`CHAPTER_06`, 200 HP)*
- **Core Weakness:** Feeding Special Candies into its telegraphed slurp beam deals 40 stun damage per special!
- **Phase 1 (100%–60% HP):** Inhales whole rows of candies toward its coral-cove barge while Coconut Husk Bumpers guard the board flanks.
- **Phase 2 (60%–0% HP):** Opens its cavernous mouth for a 'Mega-Slurp' every 3 turns: players must bank Striped lasers off the 45-degree Coconut Bumpers OR feed it 3 Wrapped/Jilapi fizz-bombs to overfill its sweet-meter!
- **Defeat Sequence:** Floats skyward like a giant cheerful parade balloon after eating too many fizzy candies.

#### Kanchen-Frost — The Glacier Yeti Colossus (`BOSS_04_HIMALAYAN_AVALANCHE_TITAN`) — *Campaign Lvl 46 / Expansion Lvl 40 (`CHAPTER_08`, 240 HP)*
- **Core Weakness:** Deflected boulders + warm Jilapi/Litchi combos (immune to cryo tools!).
- **Phase 1 (100%–50% HP):** Freezes outer columns in 2-layer Glacier Ice and rolls twin Spiked Jawbreakers down the Darjeeling trestle track.
- **Phase 2 (50%–0% HP):** Summons Foothill Wind gusts that slide candies sideways each turn; players use Golden Jilapi Coils & Rasgulla Bounce Pads to deflect its own boulders back into its ice shield!
- **Defeat Sequence:** Its giant ice-armor cracks open to reveal a tiny friendly snow-marmot riding inside!

#### Charkha-Bot — The Grand Carnival Automaton (`BOSS_05_FESTIVAL_CLOCKWORK_JUGGERNAUT`) — *Campaign Lvl 51 / Expansion Lvl 45 (`CHAPTER_09`, 260 HP)*
- **Core Weakness:** Double-Special combos (Striped + Wrapped / Rainbow + Striped) overload its brass dynamo.
- **Phase 1 (100%–50% HP):** Synchronized with 2 Piston Candy Crushers and 2 Rotating Pinwheel Gates on the board; marches strictly on move ticks while chaining unattended specials.
- **Phase 2 (50%–0% HP):** Activates a Countdown Escape Shutter! Players must keep the shutter cranked above 40% while detonating 4 Special Combos to short-circuit its master gear.
- **Defeat Sequence:** Transforms into a dazzling carnival ferris-wheel firework fountain as Mochi rides the gondola to safety.

#### Emperor Chroma-Fang — The Three-Headed Prism Serpent (`BOSS_06_EMPEROR_PRISM_HYDRA_SERPENT`) — *Campaign Lvl 56 / Expansion Lvl 50 (`CHAPTER_10`, 350 HP)*
- **Core Weakness:** Prism-split Rainbow + Striped mega-combos hit all 3 heads simultaneously!
- **Phase 1 (100%–65% HP):** Three elemental serpent heads (Ruby Ember Head, Sapphire Frost Head, Emerald Slime Head) guard the Crystal Jungle Sanctum! Each head projects its hazard (`OBS_CHILI_EMBER_FIRE`, `OBS_GLACIER_ICE_BARRIER`, `OBS_STICKY_MANGO_SLIME`) onto the board.
- **Phase 2 (65%–30% HP):** Submerges the bottom 2 rows in Monsoon Crystal Tide (dual-gravity!) while rotating 2 `OBS_CRYSTAL_PRISM_MIRROR` nodes in the center of the board. Players bank Striped/Rainbow beams through the prisms to stun all 3 heads!
- **Phase 3 (30%–0% HP):** Final Desperation Chase! All 3 heads merge into a Prism Super-Serpent racing down the spiral chute while Mochi sprints for the Grand Golden Portal. Drop the Final Royal Key + charge the 100% Rainbow Prism Mega-Cannon for the ultimate rescue blast!
- **Defeat Sequence:** Shatters its dark crystal crown in a breathtaking full-screen rainbow aurora, turning back into three harmless baby gummy geckos as Mochi celebrates on the Grand Trophy Terrace!

---

## 6. Difficulty Progression Chart, Economy & Dependency Map

### 6.1 50-Level Sawtooth Difficulty Curve

Every 5-level chapter ramps smoothly to a climax/boss and immediately drops into a refreshing breather stage at the start of the next chapter—preventing burnout while steadily deepening strategic mastery without ever starving move counts (all move-limited missions grant **25–30 moves**):

```text
Difficulty (1-10)
10 |                                                                                                   ★(50)
 9 |                                                                             ★(40)       ★(45)   ▲ ▲
 8 |                                       ★(20)             ★(30)       ▲ ★(35)     ▲     ▲ ▲     ▲
 7 |                   ★(10)             ▲       ▲     ▲   ▲       ▲   ▲       ▲   ▲     ▲       ▲
 6 |         ★(5)    ▲       ▲   ★(15) ▲           ▲ ▲   ▲           ▲           ▲               
 5 |       ▲       ▲   ▲   ▲   ▲       ○         ▲     ▲           ○           ○       ○       
 4 |     ▲       ▲       ▲           ○         ○     ○                                         
 3 |   ▲                       ○             ○                                                 
 2 | ○         ○                                                                               
   +----------------------------------------------------------------------------------------------------
     Ch1(1-5)  Ch2(6-10) Ch3(11-15) Ch4(16-20) Ch5(21-25) Ch6(26-30) Ch7(31-35) Ch8(36-40) Ch9   Ch10
     Legend: ○ = Onboarding / Relief Breather   ▲ = Tactical Ramp / Spike   ★ = Chapter Climax / Boss
```

### 6.2 Five-Band Mastery Progression Summary

| Band | Expansion Levels | Campaign Levels | Chapters | Core Design Focus | Move / Time Envelope |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Band I: Onboarding** | `EXP 01–10` | `LVL 007–016` | `CH 01–02` | Teaches Bamboo Cages, Crumbling Platforms, Sliding Walls, Tea Mist silhouettes, Clockwork turn-ticks, Wind Conveyors & Boss #1. | `26–30 moves` or `54–68s` |
| **Band II: Combinatorics** | `EXP 11–20` | `LVL 017–026` | `CH 03–04` | Pairs Mud Bogs, Even-Beat Thorn Plates, Queen Honeycombs, Brass Trunks, Fire vs Slime Steam Alchemy, Piston Crushers & Boss #2. | `26–30 moves` or `54–75s` |
| **Band III: Elite Counterplay** | `EXP 21–30` | `LVL 027–036` | `CH 05–06` | Introduces Ferry Tug-of-War, Stance-Switching Pangolin, Closing Shutters, 45° Coconut Laser Billiards & Boss #3 Trojan-Slurp. | `25–30 moves` or `52–70s` |
| **Band IV: Dynamic Physics** | `EXP 31–40` | `LVL 037–046` | `CH 07–08` | Dual-Gravity Monsoon Floods, Center-Row Key Convergence, Cryo-Immune Yeti, Seismic Shale Tunnels, Chameleon Color-Sync & Boss #4. | `26–29 moves` or `55–72s` |
| **Band V: Grand Mastery** | `EXP 41–50` | `LVL 047–056` | `CH 09–10` | Alternating `+`/`X` Quartz Prisms, Quad-Jilapi Firework Chains, Flank-Shield Crystal Sentinels, Boss #5 & 3-Phase Prism Hydra Finale! | `25–28 moves` or `55–80s` |

### 6.3 Reward Economy & Campaign Dependency Chain

- **Total Expansion First-Clear Economy:** **12,480 Coins**, **150 Mastery Stars** (3 per level), **25 Strategic Survival Tool Grants** unlocked right before the mechanics they counter, and **50 Unique Secular Cultural Keepsake Collectibles**.
- **Dependency Graph:** `LVL_006 (Base Citadel)` → `LVL_007` → `LVL_008` → ... → `LVL_056` (strictly linear main rescue path where clearing `LVL_(N)` unlocks `LVL_(N+1)`, with Secondary Objectives awarding Star #3 and bonus coins without ever hard-gating story progress).

---

## 7. Complete 50-Level Playable Specifications (`LVL_007` – `LVL_056`)

### Expansion Level 1 (`LVL_007` / Campaign #7): Himsagar Chute Awakening
- **Chapter:** `CHAPTER_01` | **Prerequisites:** `LVL_006` | **Board:** `7x8` (`full_rectangle`)
1. **Level Name:** Himsagar Chute Awakening
2. **Environment Description:** Sunlit Rajshahi mango orchard courtyard with terracotta garden walls, a tall split-bamboo mango chute on the left, and a shady banyan-branch gazebo exit on the right.
3. **Rescue Story:** Mochi climbed into the orchard sorting loft to taste ripe Himsagar mangoes, accidentally tripping the bamboo harvest latch as the Emerald Serpent slithers up the irrigation trench!
4. **Main Objective:** Break 6 Woven Bamboo Cages and drain 50 Golden Mango Marbles to lift the loft counter-gate.
5. **Secondary Objective:** Collect 24 Himsagar Mango Drops to pack Mochi's picnic basket for +1 Bonus Star.
6. **Candy Matching Requirement:** 5-color fruit board (Mango, Litchi, Guava, Coconut, Jamun); matching 4+ Mango Drops coats drain chutes in slick nectar for 2x marble flow.
7. **Survival Obstacle:** Primary: `OBS_BAMBOO_WOOD_CAGE` — 6 2-HP Bamboo Cages staggered in a staircase across columns 0–2 directly under the mango silo.
8. **Enemy or Environmental Threat:** `ENEMY_GREEN_SERPENT` — Slithers along an S-curved terracotta orchard wall channel at steady onboarding speed (1.7%/sec).
9. **Special Mechanics:** Mango Nectar Slick: every 4-in-a-row of Himsagar Mango Drops lubricates the bamboo chute for 5 seconds, doubling marble release per match.
10. **Move Limit / Time Pressure:** Real-Time Survival (58s envelope, 1.72%/s danger)
11. **Difficulty Rating:** **Easy** (2/10 — *onboarding*)
12. **Victory Condition:** All 6 Bamboo Cages broken and all 50 Mango Marbles drained before Danger reaches 100%.
13. **Failure Condition:** Emerald Serpent reaches Mochi's sorting loft (Danger = 100%).
14. **Reward:** `120 Coins`, up to `3 Stars` + 2x `TOOL_SUGAR_SHIELD`, Keepsake: *Golden Mango Basket*
15. **Unique Gameplay Twist:** First introduction of Nectar-lubricated drain columns where 4-matches temporarily double physical marble gravity speed.
- **Recommended Loadout:** `TOOL_CANDY_HAMMER`, `TOOL_SUGAR_SHIELD`

### Expansion Level 2 (`LVL_008` / Campaign #8): Biscuit Branch Hop
- **Chapter:** `CHAPTER_01` | **Prerequisites:** `LVL_007` | **Board:** `7x8` (`notched_corners`)
1. **Level Name:** Biscuit Branch Hop
2. **Environment Description:** High orchard canopy walkway built from four crispy tea-biscuit ledges suspended between mango boughs above a soft hay cart far below.
3. **Rescue Story:** Hungry Golla-Gulp has perched beside the canopy walkway, shaking the branches so the crispy wafer ledges beneath Mochi begin cracking one by one!
4. **Main Objective:** Collect 30 Guava Crisps and 20 Jackfruit Pods to hop Mochi across all 4 Crumbling Biscuit Platforms before they drop.
5. **Secondary Objective:** Trick Golla-Gulp into swallowing 2 Striped or Wrapped candies for a fizzy hiccup bonus.
6. **Candy Matching Requirement:** 5-color fruit board including Madhupur Jackfruit; players must race Golla-Gulp for green Guava clusters or bait its tongue reticle with Special Candies.
7. **Survival Obstacle:** Primary: `OBS_CRUMBLING_BISCUIT_PLATFORM`, Secondary: `OBS_BAMBOO_WOOD_CAGE` — Each of Mochi's 4 upper ledges cracks over 3 player moves unless Mochi advances to the next ledge.
8. **Enemy or Environmental Threat:** `ENEMY_GLUTTON_CHOMPER` — Every 3 moves, marks 3 Guava candies on the board and slurps them away unless matched first or replaced with a Special Candy.
9. **Special Mechanics:** Bait-and-Fizzy Counter: sliding a Striped or Wrapped candy onto Golla-Gulp's fork-and-spoon reticle causes it to hiccup +6 Guava candies back onto the board!
10. **Move Limit / Time Pressure:** Move-Limited (28 moves, 0 real-time timer stress)
11. **Difficulty Rating:** **Easy-Medium** (3/10 — *ramp*)
12. **Victory Condition:** Complete both fruit quotas within 28 moves while keeping an intact Biscuit Platform beneath Mochi.
13. **Failure Condition:** Mochi's current Biscuit Platform hits 0 stability (3 turns without advancing) or 28 moves expire.
14. **Reward:** `140 Coins`, up to `3 Stars`, Keepsake: *Crispy Orchard Wafer*
15. **Unique Gameplay Twist:** Turn-based platform decay coupled with an enemy that competes for your exact target candy color on the grid.
- **Recommended Loadout:** `TOOL_SUGAR_SHIELD`, `TOOL_SMART_SHUFFLE`

### Expansion Level 3 (`LVL_009` / Campaign #9): Jute Swing Over Nectar Creek
- **Chapter:** `CHAPTER_01` | **Prerequisites:** `LVL_008` | **Board:** `7x8` (`twin_bridge_chutes`)
1. **Level Name:** Jute Swing Over Nectar Creek
2. **Environment Description:** A sunlit irrigation canal cutting through red-earth mango groves, spanned by an overhead bamboo beam rigged with golden Bengal jute ropes.
3. **Rescue Story:** A summer gust washed out the middle footbridge over Nectar Creek while the Emerald Serpent swims upstream toward Mochi's bank!
4. **Main Objective:** Drop 2 Orchard Pulley Keys and break 8 Bamboo Cages to rig Mochi's overhead jute zip-swing across the creek.
5. **Secondary Objective:** Create 3 Wrapped Candies (2x2 or L-shape) to weave bonus rope knots.
6. **Candy Matching Requirement:** 5-color board; Jackfruit L/T matches deal +1 bonus damage to adjacent 2-HP Bamboo Cages blocking the Key chutes.
7. **Survival Obstacle:** Primary: `OBS_BAMBOO_WOOD_CAGE`, Secondary: `OBS_WROUGHT_METAL_CHAIN` — Columns 2 and 5 hold Pulley Keys guarded by 2-HP Bamboo Cages at row 4 and Chained candies at row 5.
8. **Enemy or Environmental Threat:** `ENEMY_GREEN_SERPENT` — Swims up the creek bank channel at 1.85%/sec.
9. **Special Mechanics:** Two-Stage Zip-Line: the first Pulley Key swings Mochi to a mid-stream boulder island (+15% safety distance from the serpent); the second swings her to the exit gazebo!
10. **Move Limit / Time Pressure:** Real-Time Survival (55s envelope, 1.85%/s danger)
11. **Difficulty Rating:** **Medium** (4/10 — *ramp*)
12. **Victory Condition:** Drop both Pulley Keys and clear all 8 Bamboo Cages before the Serpent reaches Mochi's current bank.
13. **Failure Condition:** Danger reaches 100% before Mochi swings clear.
14. **Reward:** `160 Coins`, up to `3 Stars` + 2x `TOOL_JUTE_ROPE_RESCUE`, Keepsake: *Braided Golden Jute*
15. **Unique Gameplay Twist:** Mid-mission positional checkpoint: dropping Key #1 physically relocates Mochi halfway across the river, dynamically resetting enemy proximity by 20%.
- **Recommended Loadout:** `TOOL_JUTE_ROPE_RESCUE`, `TOOL_CANDY_HAMMER`

### Expansion Level 4 (`LVL_010` / Campaign #10): Terracotta Slider Courtyard
- **Chapter:** `CHAPTER_01` | **Prerequisites:** `LVL_009` | **Board:** `7x8` (`slider_tiers`)
1. **Level Name:** Terracotta Slider Courtyard
2. **Environment Description:** An old brick mango-ripening storehouse with carved terracotta ventilation sliders and glowing brass skylights.
3. **Rescue Story:** Mochi is locked inside the storehouse courtyard behind heavy sliding terracotta vents that shift left and right with every move!
4. **Main Objective:** Guide 3 Brass Courtyard Keys past the Moving Terracotta Partitions to the bottom exit slots.
5. **Secondary Objective:** Clean 8 Sticky Tree-Sap tiles before they spread.
6. **Candy Matching Requirement:** 5-color board including Tender Coconut; Coconut Wrapped combos wash sap off 2 neighboring tiles.
7. **Survival Obstacle:** Primary: `OBS_SLIDING_STONE_WALL`, Secondary: `OBS_STICKY_MANGO_SLIME` — Two indestructible 2-cell Terracotta Sliders on rows 2 and 4 oscillate 1 column horizontally after each turn.
8. **Enemy or Environmental Threat:** `ENEMY_GREEN_SERPENT` — Prowls along the courtyard parapet in hybrid turn-plus-slow-drift mode.
9. **Special Mechanics:** Oscillating Chute Alignment: Keys can only drop past rows 2 and 4 on turns when the Terracotta Slider shifts clear of their column!
10. **Move Limit / Time Pressure:** Hybrid Turn + Chase (26 moves / 75s, 1.35%/s danger)
11. **Difficulty Rating:** **Medium-Hard** (5/10 — *spike*)
12. **Victory Condition:** Drop all 3 Brass Courtyard Keys before 26 moves or 100% Serpent danger.
13. **Failure Condition:** Out of moves or Serpent reaches parapet drop-point.
14. **Reward:** `185 Coins`, up to `3 Stars`, Keepsake: *Terracotta Sun Tile*
15. **Unique Gameplay Twist:** Rhythmic horizontal sliding dividers on the Match-3 grid require looking 1 move ahead before pulling a Key downward.
- **Recommended Loadout:** `TOOL_FREEZE_BLAST`, `TOOL_CANDY_HAMMER`

### Expansion Level 5 (`LVL_011` / Campaign #11): Great Mango Harvest Stampede
- **Chapter:** `CHAPTER_01` | **Prerequisites:** `LVL_010` | **Board:** `7x8` (`diamond_cages`)
1. **Level Name:** Great Mango Harvest Stampede
2. **Environment Description:** Grand Rajshahi orchard amphitheater where twin wooden mango-cart ramps converge toward a golden harvest pavilion.
3. **Rescue Story:** Both the Emerald Serpent AND hungry Golla-Gulp corner Mochi at the harvest pavilion while a giant mango-barrel rolls down the upper ramp!
4. **Main Objective:** Drain 65 Mango Marbles, break 8 Bamboo Cages, and trigger 4 Special Candies to raise the Pavilion Drawbridge.
5. **Secondary Objective:** Finish with Danger below 55% to earn the Chapter 1 Golden Mango Trophy.
6. **Candy Matching Requirement:** 5-color fruit board with high cascade density; matching 5 creates Rainbow Bombs that stun both enemies simultaneously.
7. **Survival Obstacle:** Primary: `OBS_SPIKED_BOULDER`, Secondary: `OBS_CRUMBLING_BISCUIT_PLATFORM` — Crumbling Biscuit Ledge holds Mochi while Bamboo Cages frame a diamond island in the center of the board.
8. **Enemy or Environmental Threat:** `ENEMY_GLUTTON_CHOMPER` — Golla-Gulp steals Mango Drops on the board while a Spiked Barrel-Boulder rolls down the ramp at 1.95%/sec.
9. **Special Mechanics:** Dual-Threat Synergy: feeding Golla-Gulp a fizzy Special Candy causes it to sneeze a gust that pushes the rolling Barrel-Boulder uphill by 18%!
10. **Move Limit / Time Pressure:** Real-Time Survival (54s envelope, 1.95%/s danger)
11. **Difficulty Rating:** **Hard** (6/10 — *boss_climax*)
12. **Victory Condition:** Complete all 3 harvest drawbridge tasks before the rolling barrel reaches Mochi.
13. **Failure Condition:** Barrel impact or crumbling ledge failure.
14. **Reward:** `250 Coins`, up to `3 Stars` + 2x `TOOL_CHRONO_SANDGLASS`, Keepsake: *Royal Himsagar Seal*
15. **Unique Gameplay Twist:** Using one enemy to counter another: fizzy-stunning Golla-Gulp physically knocks back the arena boulder hazard!
- **Recommended Loadout:** `TOOL_CHRONO_SANDGLASS`, `TOOL_SUGAR_SHIELD`

### Expansion Level 6 (`LVL_012` / Campaign #12): Sreemangal Morning Mist
- **Chapter:** `CHAPTER_02` | **Prerequisites:** `LVL_011` | **Board:** `7x8` (`full_rectangle`)
1. **Level Name:** Sreemangal Morning Mist
2. **Environment Description:** Emerald hillside tea terraces in Sylhet wrapped in silvery dawn mist, with a wooden pluckers' footbridge leading to a cozy tea bungalow.
3. **Rescue Story:** Cool highland fog rolled across the tea terraces just as Mochi stepped onto a swaying rope bridge—she needs clear sightlines to cross safely!
4. **Main Objective:** Dispel 12 Tea Mist Clouds and collect 32 Darjeeling Mandarin segments to repair the 4 Rope Bridge slats.
5. **Secondary Objective:** Complete with 8+ moves remaining for +150 bonus coins.
6. **Candy Matching Requirement:** 5-color board introducing `CANDY_DARJEELING_ORANGE`; Mandarin matches emit a citrus zest ring that clears Mist in a 3x3 halo!
7. **Survival Obstacle:** Primary: `OBS_TEA_MIST_CLOUD`, Secondary: `OBS_ROPE_SLAT_BRIDGE` — 12 Mist Clouds veil the central 4x3 region; unique 3D candy silhouettes peek subtly through the mist.
8. **Enemy or Environmental Threat:** `ENEMY_GREEN_SERPENT` — Gentle breather pace: advances 1 step only every move (move-linked) along the lower tea hedge.
9. **Special Mechanics:** Silhouette Recognition & Zest Reveal: players can still swap misted candies by reading their 3D silhouettes, and Mandarin matches burst fog across neighbors!
10. **Move Limit / Time Pressure:** Move-Limited (30 moves, 0 real-time timer stress)
11. **Difficulty Rating:** **Easy** (2/10 — *relief_breather*)
12. **Victory Condition:** All 12 Mist Clouds cleared and 4 Rope Bridge slats rebuilt within 30 moves.
13. **Failure Condition:** Moves exhausted before Mochi crosses the footbridge.
14. **Reward:** `150 Coins`, up to `3 Stars`, Keepsake: *Silver-Tip Tea Leaf*
15. **Unique Gameplay Twist:** Post-climax relief breather where 3D candy shape silhouettes let observant players make matches right inside fog banks!
- **Recommended Loadout:** `TOOL_SMART_SHUFFLE`

### Expansion Level 7 (`LVL_013` / Campaign #13): Tick-Tock Tea Mill
- **Chapter:** `CHAPTER_02` | **Prerequisites:** `LVL_012` | **Board:** `7x8` (`twin_mill_wheels`)
1. **Level Name:** Tick-Tock Tea Mill
2. **Environment Description:** A timber hillside irrigation mill featuring giant teakwood paddle waterwheels and brass sorting chutes.
3. **Rescue Story:** A Brass Clockwork Automaton patrolling the tea mill mistook Mochi for an unweighed tea sack—she must slip through the Rotating Waterwheel Gates!
4. **Main Objective:** Drop 2 Mill-Wheel Keys and snap 8 Wrought Metal Chains while syncing with the Rotating Gates.
5. **Secondary Objective:** Overwind-stun the Brass Clockwork Automaton twice using vertical Striped blasts.
6. **Candy Matching Requirement:** 5-color board; vertical Striped blasts aligned with the Automaton's column stall its march for 2 moves.
7. **Survival Obstacle:** Primary: `OBS_ROTATING_WATERWHEEL_GATE`, Secondary: `OBS_WROUGHT_METAL_CHAIN` — Two Rotating Waterwheel Gates at (3,2) and (3,5) flip 90 degrees each turn between horizontal-open and vertical-drop-open.
8. **Enemy or Environmental Threat:** `ENEMY_CLOCKWORK_SENTINEL` — Turn-based march (0 real-time stress!): advances 1 node per move and chains 2 tiles every 4th move.
9. **Special Mechanics:** Turnstile Cadence: Keys above the Waterwheel Gates can only drop through on EVEN moves when the paddles align vertically!
10. **Move Limit / Time Pressure:** Move-Limited (27 moves, 0 real-time timer stress)
11. **Difficulty Rating:** **Medium** (4/10 — *ramp*)
12. **Victory Condition:** Drop both Mill-Wheel Keys and clear 8 Chains before the Automaton completes its 27-step patrol.
13. **Failure Condition:** Automaton reaches Mochi's platform on move 27.
14. **Reward:** `170 Coins`, up to `3 Stars` + 2x `TOOL_JILAPI_CLUSTER_BOMB`, Keepsake: *Brass Mill Gear*
15. **Unique Gameplay Twist:** Zero real-time clock—100% pure turn-based clockwork puzzle where every gate and enemy ticks only when you swipe!
- **Recommended Loadout:** `TOOL_JILAPI_CLUSTER_BOMB`, `TOOL_CANDY_HAMMER`

### Expansion Level 8 (`LVL_014` / Campaign #14): Breezy Bamboo Aqueduct
- **Chapter:** `CHAPTER_02` | **Prerequisites:** `LVL_013` | **Board:** `7x8` (`wind_belt`)
1. **Level Name:** Breezy Bamboo Aqueduct
2. **Environment Description:** Elevated split-bamboo water flumes crisscrossing a breezy green canyon between two Sylhet hills.
3. **Rescue Story:** Strong canyon winds are blowing Mochi's leaf-raft backward toward a waterfall drop while mist obscures the flume valves!
4. **Main Objective:** Drain 55 Flume Marbles and match 28 Guava Crisps to sail Mochi's leaf-raft upstream to the stone dock.
5. **Secondary Objective:** Trigger 5 automatic cascade matches caused by the Wind Tunnel's sideways drift.
6. **Candy Matching Requirement:** 5-color board; rows 2 and 3 are swept rightward 1 cell after every move by `OBS_GALE_WIND_TUNNEL`.
7. **Survival Obstacle:** Primary: `OBS_GALE_WIND_TUNNEL`, Secondary: `OBS_TEA_MIST_CLOUD` — Rows 2–3 slide 1 tile right (wrapping around!) after each cascade settles.
8. **Enemy or Environmental Threat:** `ENEMY_GREEN_SERPENT` — Pursues along the parallel bamboo aqueduct at 1.8%/sec.
9. **Special Mechanics:** Conveyor Cascade Surfing: planning swaps so the end-of-turn 1-cell wind shift lines up 4 or 5 candies automatically awards +2x raft boost!
10. **Move Limit / Time Pressure:** Real-Time Survival (56s envelope, 1.8%/s danger)
11. **Difficulty Rating:** **Medium** (5/10 — *ramp*)
12. **Victory Condition:** Reach 100% dock propulsion and drain 55 Flume Marbles before waterfall/Serpent catch.
13. **Failure Condition:** Wind pushes leaf-raft to 100% danger brink.
14. **Reward:** `180 Coins`, up to `3 Stars` + 2x `TOOL_TEA_LEAF_GUST_FAN`, Keepsake: *Woven Bamboo Fan*
15. **Unique Gameplay Twist:** Wrap-around sideways wind conveyor on rows 2–3 turns environmental drift into an intentional combo-building engine.
- **Recommended Loadout:** `TOOL_TEA_LEAF_GUST_FAN`, `TOOL_FREEZE_BLAST`

### Expansion Level 9 (`LVL_015` / Campaign #15): Twin Terrace Sluice Race
- **Chapter:** `CHAPTER_02` | **Prerequisites:** `LVL_014` | **Board:** `7x8` (`split_wings`)
1. **Level Name:** Twin Terrace Sluice Race
2. **Environment Description:** Steep double-tiered tea garden staircase where two stone sluice channels race downward toward a central pavilion.
3. **Rescue Story:** Mochi is descending the central garden steps while BOTH a Clockwork Automaton on the left wall and an Emerald Serpent in the right sluice race to block the bottom gate!
4. **Main Objective:** Break 10 Glacier Ice seals, clear 8 Mist Clouds, and detonate 4 Special Candies to open both terrace gates.
5. **Secondary Objective:** Craft 1 Rainbow Color Bomb to clear an entire fruit terrace at once.
6. **Candy Matching Requirement:** 5-color board divided into Left & Right 4-column wings separated by a Rotating Waterwheel in the middle.
7. **Survival Obstacle:** Primary: `OBS_GLACIER_ICE_BARRIER`, Secondary: `OBS_ROTATING_WATERWHEEL_GATE` — Left wing counters the turn-based Automaton; right wing counters the real-time Serpent!
8. **Enemy or Environmental Threat:** `ENEMY_CLOCKWORK_SENTINEL` — Hybrid dual-enemy pressure: Left lane advances per move; Right lane advances slowly over time (1.45%/sec)!
9. **Special Mechanics:** Split-Wing Attention: matches on columns 0–3 push back the Automaton, while matches on columns 4–7 push back the Serpent!
10. **Move Limit / Time Pressure:** Hybrid Turn + Chase (26 moves / 68s, 1.45%/s danger)
11. **Difficulty Rating:** **Hard** (6/10 — *spike*)
12. **Victory Condition:** Clear all Ice, Mist, and Special quotas before either lane's pursuer locks the bottom gate.
13. **Failure Condition:** Left Automaton reaches step 26 OR Right Serpent hits 100% danger.
14. **Reward:** `210 Coins`, up to `3 Stars`, Keepsake: *Porcelain Tea Medallion*
15. **Unique Gameplay Twist:** Asymmetric Left-vs-Right board hemispheres—left matches manage turn-based danger while right matches manage real-time danger!
- **Recommended Loadout:** `TOOL_JILAPI_CLUSTER_BOMB`, `TOOL_TEA_LEAF_GUST_FAN`

### Expansion Level 10 (`LVL_016` / Campaign #16): BOSS: Mist-Coiled Tea Matriarch
- **Chapter:** `CHAPTER_02` | **Prerequisites:** `LVL_015` | **Board:** `7x8` (`boss_reservoir`)
1. **Level Name:** BOSS: Mist-Coiled Tea Matriarch
2. **Environment Description:** Grand Sylhet Watermill Reservoir with twin cascading waterfalls, giant spinning timber waterwheels, and a golden cable-car escape station.
3. **Rescue Story:** BOSS ENCOUNTER 1! The giant Mist-Coiled Serpent Matriarch wraps around the main reservoir wheel, blanketing the board in highland fog while blocking Mochi's cable car!
4. **Main Objective:** Deplete the Matriarch's 120 HP shield by clearing Mist, dropping 2 Brass Tea-Chest Keys, and draining 45 Reservoir Marbles.
5. **Secondary Objective:** Defeat the Matriarch without letting Mochi's cable car take slime damage.
6. **Candy Matching Requirement:** 5-color board featuring Mandarin Oranges; clearing Mist exposes glowing Weak-Point Bells on row 0 that deal 25 Boss damage when hit by vertical Striped blasts!
7. **Survival Obstacle:** Primary: `OBS_TEA_MIST_CLOUD`, Secondary: `OBS_STICKY_MANGO_SLIME` — Phase 1 spawns 3x3 Mist veils; Phase 2 toggles Waterwheel Gates and spits Sap onto drain columns.
8. **Enemy or Environmental Threat:** `BOSS_01_MANGROVE_SERPENT_MATRIARCH` — 2-Phase Boss advancing at 1.5%/sec with periodic Mist Breath (every 9s) and Sap Spit.
9. **Special Mechanics:** Waterwheel Splashdown Finisher: once both Keys unlock the reservoir wheel and Boss HP hits 0, a giant sparkling wave washes the Matriarch harmlessly down the flume!
10. **Move Limit / Time Pressure:** Real-Time Survival (68s envelope, 1.5%/s danger)
11. **Difficulty Rating:** **Boss-Hard** (7/10 — *boss_climax*)
12. **Victory Condition:** Reduce Boss HP to 0, drop 2 Keys, and drain 45 Marbles before cable-car danger hits 100%.
13. **Failure Condition:** Matriarch coils around the cable car (Danger = 100%).
14. **Reward:** `350 Coins`, up to `3 Stars` + 2x `TOOL_KULFI_ICE_CANNON`, Keepsake: *Emerald Waterwheel Crest*
15. **Unique Gameplay Twist:** Two-phase boss puzzle where dispelling fog reveals physical overhead Bell targets that can be sniped by vertical Striped candies!
- **Recommended Loadout:** `TOOL_TEA_LEAF_GUST_FAN`, `TOOL_JILAPI_CLUSTER_BOMB`, `TOOL_SUGAR_SHIELD`

### Expansion Level 11 (`LVL_017` / Campaign #17): Mangrove Boardwalk Stepping
- **Chapter:** `CHAPTER_03` | **Prerequisites:** `LVL_016` | **Board:** `7x8` (`full_rectangle`)
1. **Level Name:** Mangrove Boardwalk Stepping
2. **Environment Description:** Dappled emerald sunlight filtering through Sundarbans mangrove arches onto a wooden stilt boardwalk bordered by comical bubbling chocolate-brown silt puddles.
3. **Rescue Story:** After escaping the highlands, Mochi lands on a Sundarbans nature boardwalk—where playful bubbling mud bogs threaten to glue her boots in place!
4. **Main Objective:** Clear 10 Bubbling Mud Bog tiles and collect 30 Tender Coconut cubes to lay clean palm-mat walkways for Mochi.
5. **Secondary Objective:** Create 2 Mango 4-matches to give Mochi a sprint boost.
6. **Candy Matching Requirement:** 5-color board (Coconut, Mango, Jackfruit, Guava, Jamun); Coconut matches splash clean water onto adjacent 2-HP Mud Bog cells.
7. **Survival Obstacle:** Primary: `OBS_BUBBLING_MUD_BOG` — 10 poison-free Mud Bog puddles along rows 4–6; if an item falls onto mud without clearing it, it sticks for 1 turn.
8. **Enemy or Environmental Threat:** `ENEMY_GREEN_SERPENT` — Relaxed Chapter-opener pursuit through mangrove roots (move-linked, 30 moves).
9. **Special Mechanics:** Clean Splash Chain: popping a Wrapped Coconut candy washes away all Mud Bog puddles in a 3x3 zone in a single move!
10. **Move Limit / Time Pressure:** Move-Limited (30 moves, 0 real-time timer stress)
11. **Difficulty Rating:** **Easy** (3/10 — *relief_breather*)
12. **Victory Condition:** Wash away all 10 Mud Bog tiles and collect 30 Coconut cubes within 30 moves.
13. **Failure Condition:** Moves run out while Mochi is still mired on the boardwalk.
14. **Reward:** `165 Coins`, up to `3 Stars`, Keepsake: *Sundari Wood Plank*
15. **Unique Gameplay Twist:** Relaxing post-boss breather introducing poison-free sticky silt puddles that reward splash-radius Coconut combos.
- **Recommended Loadout:** `TOOL_CANDY_HAMMER`

### Expansion Level 12 (`LVL_018` / Campaign #18): Thorn-Step Watchtower
- **Chapter:** `CHAPTER_03` | **Prerequisites:** `LVL_017` | **Board:** `7x8` (`watchtower_aisle`)
1. **Level Name:** Thorn-Step Watchtower
2. **Environment Description:** A timber forest-ranger watchtower connected by checkered sandstone causeways fitted with alternating bamboo thorn-pegs.
3. **Rescue Story:** A wiggly Gur-Slime Blob is oozing down the watchtower ramp! Mochi must sprint across the causeway ONLY on safe even beats when the bamboo pegs retract!
4. **Main Objective:** Clear 10 Sticky Slime coatings and collect 36 Guava Crisps to advance Mochi across 4 Retractable Thorn Checkpoints.
5. **Secondary Objective:** Defeat or shrink the Slime Blob without splitting it with dry bombs.
6. **Candy Matching Requirement:** 5-color board; avoid hitting `ENEMY_SYRUP_OOZE_BLOB` projections with dry Jilapi Bombs (use Coconut/Water matches instead!).
7. **Survival Obstacle:** Primary: `OBS_RETRACTABLE_SPIKE_TRAP`, Secondary: `OBS_STICKY_MANGO_SLIME` — Causeway pegs toggle UP (odd moves) and DOWN (even moves). Completing a 9-Guava checkpoint on an odd move holds Mochi safely at the curb until the next even beat!
8. **Enemy or Environmental Threat:** `ENEMY_SYRUP_OOZE_BLOB` — Coats 2 candies in Slime every 3 moves; splits into faster twins if hit by dry explosives.
9. **Special Mechanics:** Even-Beat Safe Crossing: completing a Guava threshold ON an even move grants an instant 'Perfect Stride!' leap (+10% distance bonus)!
10. **Move Limit / Time Pressure:** Move-Limited (28 moves, 0 real-time timer stress)
11. **Difficulty Rating:** **Medium** (4/10 — *ramp*)
12. **Victory Condition:** Clear 10 Slimes and reach Watchtower Door within 28 moves.
13. **Failure Condition:** Slime Blob overtakes Mochi on the causeway.
14. **Reward:** `185 Coins`, up to `3 Stars`, Keepsake: *Ranger Brass Compass*
15. **Unique Gameplay Twist:** Odd/Even move rhythm bonus rewards counting turns before completing each 9-Guava movement threshold!
- **Recommended Loadout:** `TOOL_SUGAR_SHIELD`, `TOOL_KULFI_ICE_CANNON`

### Expansion Level 13 (`LVL_019` / Campaign #19): Golden Honeycomb Creek
- **Chapter:** `CHAPTER_03` | **Prerequisites:** `LVL_018` | **Board:** `7x8` (`honeycomb_triad`)
1. **Level Name:** Golden Honeycomb Creek
2. **Environment Description:** Overhanging Sundarbans branches heavy with giant shimmering golden wild-honeycombs above a turquoise tidal creek.
3. **Rescue Story:** A Tangle-Vine Stilt Crawler has woven wooden cages around Mochi's dinghy rope while giant Golden Honeycombs seal the center of the puzzle board!
4. **Main Objective:** Shatter 3 Queen Honeycomb Clusters and drop 2 Dinghy Oar Keys to untie Mochi's boat.
5. **Secondary Objective:** Land 3 Jackfruit L/T matches to knock back the Stilt Crawler's wooden legs.
6. **Candy Matching Requirement:** 5-color board featuring Madhupur Jackfruit; peripheral Honeycomb cells regenerate unless players snipe the glowing central Queen Cell of each 5-tile hex cluster!
7. **Survival Obstacle:** Primary: `OBS_HONEYCOMB_WAX_SEAL`, Secondary: `OBS_BAMBOO_WOOD_CAGE` — Three 5-cell Honeycomb clusters at top-left, center, and top-right; cracking the center cell shatters all 4 petals instantly!
8. **Enemy or Environmental Threat:** `ENEMY_MANGROVE_ROOT_CRAWLER` — Strides across the creek at 1.75%/sec and cages 1 bottom-row tile every 12s.
9. **Special Mechanics:** Queen-Cell Target Priority: striking the glowing central wax cell causes a chain-pop that clears all linked wax petals AND releases sweet honey that slows the Stilt Crawler by 25%!
10. **Move Limit / Time Pressure:** Real-Time Survival (58s envelope, 1.75%/s danger)
11. **Difficulty Rating:** **Medium-Hard** (5/10 — *ramp*)
12. **Victory Condition:** Shatter all 3 Honeycomb clusters and drop both Oar Keys before the Stilt Crawler pins the boat.
13. **Failure Condition:** Danger hits 100% before dinghy launch.
14. **Reward:** `200 Coins`, up to `3 Stars` + 2x `TOOL_BAMBOO_MAGNET`, Keepsake: *Wild Sundarbans Honey Jar*
15. **Unique Gameplay Twist:** Regenerating hex-clusters that collapse instantaneously when you snipe their glowing central Queen node!
- **Recommended Loadout:** `TOOL_CANDY_HAMMER`, `TOOL_BAMBOO_MAGNET`

### Expansion Level 14 (`LVL_020` / Campaign #20): Tidal Roots Labyrinth
- **Chapter:** `CHAPTER_03` | **Prerequisites:** `LVL_019` | **Board:** `7x8` (`chained_core`)
1. **Level Name:** Tidal Roots Labyrinth
2. **Environment Description:** Intersecting mangrove root tunnels where rising and ebbing brackish creek water shifts floating driftwood bridges.
3. **Rescue Story:** Mochi is navigating a forked mangrove tunnel where a Stilt Crawler blocks the high path and a Slime Blob oozes up the low path!
4. **Main Objective:** Drain 60 Creek Marbles, clear 8 Mud Bogs, and break 6 Iron Chains to open the high-canopy root bridge.
5. **Secondary Objective:** Win with at least 2 Special Candies still gleaming on the board for bonus fireworks.
6. **Candy Matching Requirement:** 5-color board; Chained Special Candies sit pre-placed in the center waiting to be unlocked.
7. **Survival Obstacle:** Primary: `OBS_WROUGHT_METAL_CHAIN`, Secondary: `OBS_BUBBLING_MUD_BOG` — 4 Chained Striped Candies in row 3 unlock massive cross-clears once freed.
8. **Enemy or Environmental Threat:** `ENEMY_MANGROVE_ROOT_CRAWLER` — Advances at 1.9%/sec while Mud Bogs halve Mochi's gate-opening speed until cleaned.
9. **Special Mechanics:** Mud-Friction Coupling: as long as >4 Mud Bog tiles remain on the board, the counterweight gate rises at 50% speed—cleaning the mud first restores 100% winch speed!
10. **Move Limit / Time Pressure:** Real-Time Survival (54s envelope, 1.9%/s danger)
11. **Difficulty Rating:** **Hard** (6/10 — *spike*)
12. **Victory Condition:** Clean Mud Bogs, free Chains, and drain 60 Marbles before capture.
13. **Failure Condition:** Stilt Crawler reaches Mochi's fork chamber.
14. **Reward:** `220 Coins`, up to `3 Stars`, Keepsake: *Carved Driftwood Oar*
15. **Unique Gameplay Twist:** Order-of-operations puzzle: clearing Mud Bogs FIRST doubles the mechanical efficiency of all subsequent marble-draining matches!
- **Recommended Loadout:** `TOOL_KULFI_ICE_CANNON`, `TOOL_SUGAR_SHIELD`

### Expansion Level 15 (`LVL_021` / Campaign #21): Sunken Brass Chest Cove
- **Chapter:** `CHAPTER_03` | **Prerequisites:** `LVL_020` | **Board:** `7x8` (`lagoon_shoals`)
1. **Level Name:** Sunken Brass Chest Cove
2. **Environment Description:** A quiet emerald lagoon at the edge of the Sundarbans where three ornate Brass Sweet Trunks rest on sandy shoals beside a waiting sailboat.
3. **Rescue Story:** Mochi's sailboat rudder, sail-pin, and compass are locked inside three Brass Sweet Trunks—each sealed with three color-coded fruit gem clasps!
4. **Main Objective:** Unlock all 3 Brass Treasure Trunks (9 color-coded gem clasps total) and clear 2 Honeycomb Seals to launch the sailboat.
5. **Secondary Objective:** Launch the sailboat within 20 moves for 3 Stars.
6. **Candy Matching Requirement:** 5-color board; each Brass Trunk displays 3 glowing fruit icons (e.g. Mango + Coconut + Jamun)—matching that fruit anywhere in the Trunk's row or column pops 1 clasp!
7. **Survival Obstacle:** Primary: `OBS_BRASS_TREASURE_TRUNK`, Secondary: `OBS_HONEYCOMB_WAX_SEAL` — Trunks sit at (2,1), (4,4), and (2,6), immune to raw bomb damage—only aligned color matches pop their clasps!
8. **Enemy or Environmental Threat:** `ENEMY_GREEN_SERPENT` — Circles the lagoon shoal in hybrid turn-plus-tide mode (26 moves / 75s).
9. **Special Mechanics:** Line-of-Sight Color Unlocking: matching the required fruit color in the same row OR column as a Brass Trunk shoots a laser-key beam straight into its matching clasp!
10. **Move Limit / Time Pressure:** Hybrid Turn + Chase (26 moves / 75s, 1.35%/s danger)
11. **Difficulty Rating:** **Hard** (6/10 — *boss_climax*)
12. **Victory Condition:** Pop all 3 Brass Trunks and clear both Honeycombs to sail away.
13. **Failure Condition:** 26 moves exhausted or lagoon Danger hits 100%.
14. **Reward:** `260 Coins`, up to `3 Stars` + 2x `TOOL_FOAM_EXTINGUISHER`, Keepsake: *Brass Lagoon Sextant*
15. **Unique Gameplay Twist:** Hammer-immune color-combination locks that require aligning specific fruit colors along orthogonal sightlines!
- **Recommended Loadout:** `TOOL_SMART_SHUFFLE`, `TOOL_CHRONO_SANDGLASS`

### Expansion Level 16 (`LVL_022` / Campaign #22): Dinajpur Ruby Canopy
- **Chapter:** `CHAPTER_04` | **Prerequisites:** `LVL_021` | **Board:** `7x8` (`full_rectangle`)
1. **Level Name:** Dinajpur Ruby Canopy
2. **Environment Description:** Sun-dappled crimson litchi treehouses in Dinajpur connected by bamboo zip-platforms above sizzling jaggery-boiling pans.
3. **Rescue Story:** A Sizzling Caramel Salamander is scampering along the treehouse ropes, dropping hot sugar sparks that threaten to singe Mochi's ladder!
4. **Main Objective:** Extinguish 10 Spiced Sugar Fire Barriers and harvest 35 Ruby Litchis to raise the treehouse rope ladder.
5. **Secondary Objective:** Match 9 Pistachio Kulfi or Coconut pieces to cool the Salamander's tail.
6. **Candy Matching Requirement:** 5-color board introducing `OBS_CHILI_EMBER_FIRE` alongside Jamun & Coconut cooling fruits.
7. **Survival Obstacle:** Primary: `OBS_CHILI_EMBER_FIRE` — 6 initial Fire rings on row 4; if zero fire tiles are cleared on any move, 1 new fire spark hops to an adjacent tile.
8. **Enemy or Environmental Threat:** `ENEMY_MOLTEN_CRAWLER` — Gentle Chapter-4 onboarding pace (29 moves); drops 1 fresh ember every 3 moves.
9. **Special Mechanics:** Containment Rule: clearing at least 1 Fire Barrier on a turn completely prevents ALL remaining Fire Barriers from spreading that turn!
10. **Move Limit / Time Pressure:** Move-Limited (29 moves, 0 real-time timer stress)
11. **Difficulty Rating:** **Easy-Medium** (3/10 — *relief_breather*)
12. **Victory Condition:** Extinguish 10 Fire Barriers and collect 35 Ruby Litchis within 29 moves.
13. **Failure Condition:** Fire Barriers spread to >16 tiles or moves reach 0.
14. **Reward:** `175 Coins`, up to `3 Stars`, Keepsake: *Ruby Litchi Cluster*
15. **Unique Gameplay Twist:** Classic Candy-Crush-Chocolate containment cadence: dousing just 1 ember per turn freezes the entire fire network's expansion!
- **Recommended Loadout:** `TOOL_FOAM_EXTINGUISHER`

### Expansion Level 17 (`LVL_023` / Campaign #23): Sky-Glider Key Snatch
- **Chapter:** `CHAPTER_04` | **Prerequisites:** `LVL_022` | **Board:** `7x8` (`canopy_deck`)
1. **Level Name:** Sky-Glider Key Snatch
2. **Environment Description:** Open treetop sorting deck strung with colourful fluttering orchard pennants and pulley baskets.
3. **Rescue Story:** Two mischievous Canopy Gliders are swooping over the sorting deck trying to snatch Mochi's Treehouse Keys right off the puzzle board!
4. **Main Objective:** Drop 3 Treehouse Pulley Keys to the bottom row before the Canopy Gliders lift them back to the top!
5. **Secondary Objective:** Disrupt 3 Glider swoop shadows by matching directly inside their target circles.
6. **Candy Matching Requirement:** 5-color board; vertical Litchi matches charge +20% bonus pulley pull.
7. **Survival Obstacle:** Primary: `OBS_BAMBOO_WOOD_CAGE`, Secondary: `OBS_GALE_WIND_TUNNEL` — Keys start at row 1 in cols 1, 4, 6; Glider shadow reticles lock onto a Key for 2 moves before lifting it 2 rows UP.
8. **Enemy or Environmental Threat:** `ENEMY_MYNAH_GLIDER_THIEF` — Swoops every 2 moves to hoist unguarded Keys upward while the Emerald Serpent climbs the trunk (1.65%/sec).
9. **Special Mechanics:** Shadow-Reticle Counterplay: matching any 3 candies touching a Glider's shadow startles the Glider into dropping a bonus Striped Candy!
10. **Move Limit / Time Pressure:** Real-Time Survival (60s envelope, 1.65%/s danger)
11. **Difficulty Rating:** **Medium** (5/10 — *ramp*)
12. **Victory Condition:** Deliver all 3 Treehouse Keys to row 6 before the Serpent climbs the trunk.
13. **Failure Condition:** Trunk Danger reaches 100%.
14. **Reward:** `195 Coins`, up to `3 Stars`, Keepsake: *Aviator Leaf Goggles*
15. **Unique Gameplay Twist:** Vertical tug-of-war where aerial thieves pull your Keys UPWARD if you ignore their 2-turn warning shadows!
- **Recommended Loadout:** `TOOL_BAMBOO_MAGNET`, `TOOL_TEA_LEAF_GUST_FAN`

### Expansion Level 18 (`LVL_024` / Campaign #24): Juice-Press Piston Alley
- **Chapter:** `CHAPTER_04` | **Prerequisites:** `LVL_023` | **Board:** `7x8` (`piston_lanes`)
1. **Level Name:** Juice-Press Piston Alley
2. **Environment Description:** Bustling orchard juice-pressing shed with gleaming brass piston presses, wooden fruit troughs, and overhead conveyor belts.
3. **Rescue Story:** Mochi slipped onto the sorting conveyor headed toward two rhythmic Sugar-Mill Piston Crushers—jam their gears before they Cycle!
4. **Main Objective:** Hit the 2 Brass Crusher Gear-Switches 3 times each (6 hits total) with Special blasts and break 8 Iron Chains.
5. **Secondary Objective:** Lose 0 Special Candies to Piston Crusher slams.
6. **Candy Matching Requirement:** 5-color board; Columns 2 and 5 are Crusher Lanes that flash amber on Turn N and slam on Turn N+1!
7. **Survival Obstacle:** Primary: `OBS_PISTON_CANDY_CRUSHER`, Secondary: `OBS_WROUGHT_METAL_CHAIN` — Any Special Candy left sitting in Column 2 or 5 on a Slam beat gets flattened unless detonated or swapped out first!
8. **Enemy or Environmental Threat:** `ENEMY_CLOCKWORK_SENTINEL` — Advances the conveyor belt 1 notch per move (26 moves max).
9. **Special Mechanics:** Telegraphed Column Slam: firing a Striped or Wrapped blast INTO a flashing Crusher column jams that Piston UP for 3 turns and scores 1 Gear-Switch hit!
10. **Move Limit / Time Pressure:** Move-Limited (26 moves, 0 real-time timer stress)
11. **Difficulty Rating:** **Medium-Hard** (6/10 — *ramp*)
12. **Victory Condition:** Deliver 6 Special hits to the Crusher Gears and clear 8 Chains within 26 moves.
13. **Failure Condition:** Conveyor reaches the active press after move 26.
14. **Reward:** `215 Coins`, up to `3 Stars`, Keepsake: *Pressed Litchi Nectar Bottle*
15. **Unique Gameplay Twist:** Risk-reward columns: Columns 2 and 5 are where you MUST fire Specials, yet leaving an unpopped Special resting there for 1 turn gets it crushed!
- **Recommended Loadout:** `TOOL_JILAPI_CLUSTER_BOMB`, `TOOL_CANDY_HAMMER`

### Expansion Level 19 (`LVL_025` / Campaign #25): Sizzling Syrup Cauldron Crossing
- **Chapter:** `CHAPTER_04` | **Prerequisites:** `LVL_024` | **Board:** `7x8` (`opposing_halves`)
1. **Level Name:** Sizzling Syrup Cauldron Crossing
2. **Environment Description:** Outdoor orchard jaggery kitchen where giant copper cauldrons bubble with golden syrup beneath a three-span bamboo suspension bridge.
3. **Rescue Story:** Both a Caramel Salamander and a Slime Blob are sabotaging Mochi's suspension bridge from opposite ends—fire AND slime collide on one board!
4. **Main Objective:** Extinguish 8 Fire Barriers, wash 8 Sticky Slimes, and build 4 Bridge Spans (36 Litchi/Jackfruit candies).
5. **Secondary Objective:** Trigger 3 'Steam Burst' reactions by matching Coconut/Kulfi directly between adjacent Fire and Slime tiles.
6. **Candy Matching Requirement:** 5-color board; matching cooling candies adjacent to BOTH Fire and Slime triggers a harmless Steam Pop clearing a 3x3 diamond!
7. **Survival Obstacle:** Primary: `OBS_CHILI_EMBER_FIRE`, Secondary: `OBS_STICKY_MANGO_SLIME` — Left half starts with Fire Barriers; Right half starts with Sticky Slime!
8. **Enemy or Environmental Threat:** `ENEMY_MOLTEN_CRAWLER` — Advances caramel heat at 1.9%/sec while Slime slows bridge assembly.
9. **Special Mechanics:** Elemental Steam Alchemy: letting Fire and Slime meet near a Coconut/Jamun match vaporizes both hazards in a joyful 3x3 steam cloud!
10. **Move Limit / Time Pressure:** Real-Time Survival (55s envelope, 1.9%/s danger)
11. **Difficulty Rating:** **Hard** (7/10 — *spike*)
12. **Victory Condition:** Clear all Fire & Slime quotas and finish all 4 Bridge Spans before cauldron boil-over.
13. **Failure Condition:** Danger reaches 100%.
14. **Reward:** `235 Coins`, up to `3 Stars` + 2x `TOOL_MONSOON_WATER_BLASTER`, Keepsake: *Copper Jaggery Ladle*
15. **Unique Gameplay Twist:** Opposing hazards (`Fire` vs `Slime`) can be intentionally steered together to trigger beneficial 3x3 Steam Burst board clears!
- **Recommended Loadout:** `TOOL_MONSOON_WATER_BLASTER`, `TOOL_FOAM_EXTINGUISHER`

### Expansion Level 20 (`LVL_026` / Campaign #26): BOSS: Captain Clamp's Crab-Sub
- **Chapter:** `CHAPTER_04` | **Prerequisites:** `LVL_025` | **Board:** `7x8` (`crab_pincers`)
1. **Level Name:** BOSS: Captain Clamp's Crab-Sub
2. **Environment Description:** Where the Dinajpur orchard canal meets a wide river confluence—an oversized brass-and-wood mechanical Crab-Submarine surfaces, clamping Mochi's dock!
3. **Rescue Story:** BOSS ENCOUNTER 2! Captain Clamp's Brass Crab-Sub has locked both mechanical pincers onto Mochi's river-pier while launching Glider drones overhead!
4. **Main Objective:** Unlock both Claw Brass Trunks (cols 1 & 6), drop 2 Dock Release Keys, and deplete Captain Clamp's 160 HP hull.
5. **Secondary Objective:** Unlock both Claw Trunks within the first 30 seconds.
6. **Candy Matching Requirement:** 5-color board; Boss hull takes 50% reduced damage until BOTH Claw Brass Trunks are color-unlocked!
7. **Survival Obstacle:** Primary: `OBS_BRASS_TREASURE_TRUNK`, Secondary: `OBS_BUBBLING_MUD_BOG` — Claw Trunks at (3,1) and (3,6); Phase 2 summons Canopy Gliders attempting to lift your 2 Dock Keys.
8. **Enemy or Environmental Threat:** `BOSS_02_ROYAL_MANGROVE_CRAB_MECH` — 2-Phase Boss winching Mochi's pier closer at 1.55%/sec while deploying Glider drones and Mud bubbles.
9. **Special Mechanics:** Shielded Periscope Core: popping all 3 fruit-clasps on BOTH Claw Trunks drops the Crab-Sub's periscope shield, exposing it to 2x Special Candy combo damage!
10. **Move Limit / Time Pressure:** Real-Time Survival (66s envelope, 1.55%/s danger)
11. **Difficulty Rating:** **Boss-Hard** (8/10 — *boss_climax*)
12. **Victory Condition:** Unlock both Claw Trunks, drop 2 Keys, and reduce Boss HP to 0 before pier crush.
13. **Failure Condition:** Danger reaches 100%.
14. **Reward:** `400 Coins`, up to `3 Stars` + 1x `TOOL_PRISM_TELEPORTER`, Keepsake: *Golden Periscope Badge*
15. **Unique Gameplay Twist:** Two-step armor puzzle: color-matching Brass Trunks disables the Boss's mechanical pincers first so explosive combos deal massive hull damage in Phase 2!
- **Recommended Loadout:** `TOOL_BAMBOO_MAGNET`, `TOOL_MONSOON_WATER_BLASTER`, `TOOL_JILAPI_CLUSTER_BOMB`

### Expansion Level 21 (`LVL_027` / Campaign #27): Padma Ferry Lantern Crossing
- **Chapter:** `CHAPTER_05` | **Prerequisites:** `LVL_026` | **Board:** `7x8` (`full_rectangle`)
1. **Level Name:** Padma Ferry Lantern Crossing
2. **Environment Description:** Warm golden twilight at a bustling Padma riverfront candy bazaar with painted wooden sampan boats, striped awnings, and glowing paper lanterns.
3. **Rescue Story:** Mochi hops aboard a painted country-boat ferry to reach the Sweet Market pier, but river currents gently tug the boat backward unless you row with matches!
4. **Main Objective:** Row Mochi's Country-Boat Ferry 100m across the channel by matching 40 Coconut/Jamun river candies and clearing 6 Bamboo Cages.
5. **Secondary Objective:** Detonate 3 Golden Syrup Jilapi Coils to light the bazaar pier lanterns.
6. **Candy Matching Requirement:** 5-color board introducing `CANDY_CRISPY_JILAPI` relay coils pre-placed in the corners!
7. **Survival Obstacle:** Primary: `OBS_FERRY_MOVING_PLATFORM`, Secondary: `OBS_BAMBOO_WOOD_CAGE` — Ferry drifts back 4m every turn you don't match Blue/Purple river candies, but leaps +12m on combos!
8. **Enemy or Environmental Threat:** `ENEMY_GREEN_SERPENT` — Calm Chapter-5 breather (28 moves): Serpent waits at the departure bank if Ferry drifts all the way back to 0m.
9. **Special Mechanics:** Jilapi Ring Relay: hitting any pre-placed `CANDY_CRISPY_JILAPI` coil with a Striped laser emits an 8-tile ring burst that surges the Ferry +20m forward!
10. **Move Limit / Time Pressure:** Move-Limited (28 moves, 0 real-time timer stress)
11. **Difficulty Rating:** **Easy-Medium** (4/10 — *relief_breather*)
12. **Victory Condition:** Reach 100m Ferry progress and clear 6 Cages within 28 moves.
13. **Failure Condition:** Moves run out or Ferry drifts back to 0m departure bank.
14. **Reward:** `190 Coins`, up to `3 Stars` + 1x `TOOL_PRISM_TELEPORTER`, Keepsake: *Painted Sampan Lantern*
15. **Unique Gameplay Twist:** Tug-of-war river ferry propulsion boosted by Jilapi spiral relay nodes on the board!
- **Recommended Loadout:** `TOOL_SMART_SHUFFLE`

### Expansion Level 22 (`LVL_028` / Campaign #28): Rasgulla Cushion Bazaar
- **Chapter:** `CHAPTER_05` | **Prerequisites:** `LVL_027` | **Board:** `7x8` (`bazaar_alcoves`)
1. **Level Name:** Rasgulla Cushion Bazaar
2. **Environment Description:** Colourful sweet-stall alley stacked with clay handi pots of snowy Rasgullas beneath striped bazaar canopies.
3. **Rescue Story:** Falling wooden crates from an overloaded pushcart are tumbling down the bazaar steps—Mochi needs bouncy Rasgulla cushions to hop safely across!
4. **Main Objective:** Collect 25 Spongy Rasgulla Orbs, unlock 2 Brass Sweet Trunks, and clear 8 Ice-chilled pots.
5. **Secondary Objective:** Combine 2 Special Candies together twice.
6. **Candy Matching Requirement:** 5-color board featuring `CANDY_SPONGY_RASGULLA`; every 5 Rasgullas collected inflates 1 safety bounce-awning in the arena!
7. **Survival Obstacle:** Primary: `OBS_BRASS_TREASURE_TRUNK`, Secondary: `OBS_CRUMBLING_BISCUIT_PLATFORM` — 2 Brass Trunks sit in isolated side pockets reachable via Striped beams or Prism Teleporter!
8. **Enemy or Environmental Threat:** `ENEMY_GLUTTON_CHOMPER` — Tries to gobble Rasgulla Orbs off the board every 3 turns!
9. **Special Mechanics:** Isolated Pocket Geometry: side-alcove Trunks reward aligned row matches or warping a Striped Candy into the alcove using Prism Teleporter!
10. **Move Limit / Time Pressure:** Move-Limited (27 moves, 0 real-time timer stress)
11. **Difficulty Rating:** **Medium** (5/10 — *ramp*)
12. **Victory Condition:** Collect 25 Rasgullas, open both Trunks, and clear 8 Ice tiles within 27 moves.
13. **Failure Condition:** Moves reach 0 before awning path completes.
14. **Reward:** `210 Coins`, up to `3 Stars`, Keepsake: *Clay Rasgulla Handi*
15. **Unique Gameplay Twist:** Side-alcove board pockets challenge players to snipe horizontally across gaps while racing Golla-Gulp for Rasgulla orbs.
- **Recommended Loadout:** `TOOL_PRISM_TELEPORTER`, `TOOL_CANDY_HAMMER`

### Expansion Level 23 (`LVL_029` / Campaign #29): Roly-Poly Cobblestone Ramp
- **Chapter:** `CHAPTER_05` | **Prerequisites:** `LVL_028` | **Board:** `7x8` (`cobble_chutes`)
1. **Level Name:** Roly-Poly Cobblestone Ramp
2. **Environment Description:** A steep cobblestone spice-and-candy lane winding up toward the town clocktower.
3. **Rescue Story:** Meet the Armored Jawbreaker Pangolin! It curls into an unstoppable rainbow ball down the cobblestone lane, then uncurls to catch its breath!
4. **Main Objective:** Drain 65 Bazaar Marbles and break 10 Wrought Metal Chains while knocking back the Jawbreaker Pangolin during its uncurled window.
5. **Secondary Objective:** Deal 3 Special Candy hits ONLY while the Pangolin is uncurled.
6. **Candy Matching Requirement:** 5-color board; players craft and hold Striped/Wrapped specials during the 2-turn Curled Roll, then detonate them during the 2-turn Uncurled Stance!
7. **Survival Obstacle:** Primary: `OBS_WROUGHT_METAL_CHAIN`, Secondary: `OBS_SLIDING_STONE_WALL` — Sliding Terracotta Partition on row 3 + Chained candies guarding drain cols 0–1 and 6–7.
8. **Enemy or Environmental Threat:** `ENEMY_JAWBREAKER_PANGOLIN` — Alternates every 6 seconds between Curled Charge (immune to knockback!) and Uncurled Breather (takes 3x knockback!).
9. **Special Mechanics:** Burst-Window Discipline: firing combos while the Pangolin is curled wastes knockback, whereas waiting for its uncurled dizzy icon sends it rolling 25% backward uphill!
10. **Move Limit / Time Pressure:** Real-Time Survival (58s envelope, 1.85%/s danger)
11. **Difficulty Rating:** **Medium-Hard** (6/10 — *ramp*)
12. **Victory Condition:** Drain 65 Marbles and break 10 Chains before the Pangolin reaches Mochi.
13. **Failure Condition:** Pangolin collides with Mochi at 100% danger.
14. **Reward:** `225 Coins`, up to `3 Stars`, Keepsake: *Rainbow Jawbreaker Scale*
15. **Unique Gameplay Twist:** Introduces armored stance-switching: teaches players to stockpile Special Candies on the board and unleash them in synchronized burst windows!
- **Recommended Loadout:** `TOOL_SUGAR_SHIELD`, `TOOL_CHRONO_SANDGLASS`

### Expansion Level 24 (`LVL_030` / Campaign #30): Closing Warehouse Shutter!
- **Chapter:** `CHAPTER_05` | **Prerequisites:** `LVL_029` | **Board:** `7x8` (`granary_aisle`)
1. **Level Name:** Closing Warehouse Shutter!
2. **Environment Description:** Grand riverfront sugar-granary gatehouse with a massive bronze counterweight shutter slowly ratcheting downward.
3. **Rescue Story:** The bazaar curfew bell rang! The heavy Bronze Sluice Shutter starts WIDE OPEN and is steadily closing—Mochi must sprint down the aisle before it seals!
4. **Main Objective:** Keep the Timed Blast Shutter >= 35% open while dropping 3 Granary Keys to sprint Mochi through the doorway!
5. **Secondary Objective:** Escape while the Shutter is still >= 70% open for 3 Stars.
6. **Candy Matching Requirement:** 5-color board; matching Litchi or Jilapi candies cranks the counterweight chains UP (+8% shutter height per match)!
7. **Survival Obstacle:** Primary: `OBS_TIMED_BLAST_SHUTTER`, Secondary: `OBS_PISTON_CANDY_CRUSHER` — Shutter starts at 100% open and drops 3.2%/sec; 1 central Piston Crusher guards Column 4.
8. **Enemy or Environmental Threat:** `ENEMY_MYNAH_GLIDER_THIEF` — Glider swoops to tug Keys upward while the Shutter ratchets down toward 0%!
9. **Special Mechanics:** Inverted Gate Tension: instead of opening a closed gate, you are holding a closing door open with one hand (Litchi matches) while dropping Keys with the other!
10. **Move Limit / Time Pressure:** Real-Time Survival (52s envelope, 2%/s danger)
11. **Difficulty Rating:** **Hard** (7/10 — *spike*)
12. **Victory Condition:** Drop all 3 Granary Keys while the Timed Blast Shutter is >= 35% open.
13. **Failure Condition:** Shutter slams completely shut (0% open) before Mochi exits.
14. **Reward:** `245 Coins`, up to `3 Stars` + 2x `TOOL_JACKFRUIT_RESIN_ANCHOR`, Keepsake: *Bronze Counterweight Key*
15. **Unique Gameplay Twist:** Inverts the classic gate formula—the exit starts open and is actively closing, demanding dual focus on counterweight cranking and key dropping!
- **Recommended Loadout:** `TOOL_JACKFRUIT_RESIN_ANCHOR`, `TOOL_BAMBOO_MAGNET`

### Expansion Level 25 (`LVL_031` / Campaign #31): Midnight Lantern Regatta
- **Chapter:** `CHAPTER_05` | **Prerequisites:** `LVL_030` | **Board:** `7x8` (`pontoon_decks`)
1. **Level Name:** Midnight Lantern Regatta
2. **Environment Description:** Illuminated riverfront festival pier where three moving ferry pontoons form a shifting bridge toward a grand riverboat steamer.
3. **Rescue Story:** Chapter 5 Finale! Mochi must hop across three Moving Ferry Pontoons while a Caramel Salamander, Jawbreaker Pangolin, and Closing Gangway Shutter converge!
4. **Main Objective:** Align 3 Ferry Pontoons (45 River Candies), extinguish 8 Fire Embers, and detonate 5 Special Candies before the steamer gangway closes!
5. **Secondary Objective:** Chain 2 Jilapi Ring Relays in a single turn.
6. **Candy Matching Requirement:** 6-color market board (Mango, Litchi, Guava, Coconut, Jamun, Jilapi specials); Resin Anchor can lock aligned pontoons in place!
7. **Survival Obstacle:** Primary: `OBS_FERRY_MOVING_PLATFORM`, Secondary: `OBS_TIMED_BLAST_SHUTTER` — Pontoons align at 15, 30, and 45 river-candy milestones while Fire Barriers nibble from row 6 upward.
8. **Enemy or Environmental Threat:** `ENEMY_MOLTEN_CRAWLER` — Sparks embers on row 6 while steamer gangway timer ticks at 1.75%/sec.
9. **Special Mechanics:** Milestone Lock-In: each time Mochi hops onto the next Ferry Pontoon, a fireworks burst clears the bottom row of Fire Embers automatically!
10. **Move Limit / Time Pressure:** Real-Time Survival (58s envelope, 1.75%/s danger)
11. **Difficulty Rating:** **Hard** (7/10 — *boss_climax*)
12. **Victory Condition:** Complete all 3 Pontoon milestones, clear 8 Embers, and trigger 5 Specials before gangway lift.
13. **Failure Condition:** Steamer gangway closes (Danger = 100%).
14. **Reward:** `290 Coins`, up to `3 Stars` + 2x `TOOL_RASGULLA_BOUNCE_PAD`, Keepsake: *Captain's Brass Bell*
15. **Unique Gameplay Twist:** Three-stage milestone checkpoints where each Mochi hop triggers a celebratory board-wide bottom-row ember sweep!
- **Recommended Loadout:** `TOOL_JACKFRUIT_RESIN_ANCHOR`, `TOOL_FOAM_EXTINGUISHER`

### Expansion Level 26 (`LVL_032` / Campaign #32): St. Martin's Coral Ricochet
- **Chapter:** `CHAPTER_06` | **Prerequisites:** `LVL_031` | **Board:** `7x8` (`coral_billiards`)
1. **Level Name:** St. Martin's Coral Ricochet
2. **Environment Description:** Crystal-turquoise coral cove inspired by St. Martin's Island, framed by swaying coconut palms, white shell sandbars, and driftwood cabanas.
3. **Rescue Story:** Mochi lands on a sunny coral sandbar, but her beach-cabana bridge lock sits around a solid coral corner—bank Striped lasers off angled Coconut Husk Bumpers to hit it!
4. **Main Objective:** Crack 4 Armored Coconut Husk Bumpers (12 hits) and pop 3 Corner Coral Locks using deflected Striped lasers.
5. **Secondary Objective:** Hit 2 Coral Locks in a single turn via a double-bumper ricochet.
6. **Candy Matching Requirement:** 5-color tropical board (Coconut, Mango, Mandarin, Guava, Litchi); firing a vertical Striped beam into a 45° Coconut Bumper bends the laser 90° horizontally into the side alcove!
7. **Survival Obstacle:** Primary: `OBS_COCONUT_HUSK_BUMPER` — 4 Coconut Bumpers placed at (1,2), (1,5), (5,2), and (5,5) form a rectangular laser mirror circuit.
8. **Enemy or Environmental Threat:** `ENEMY_GREEN_SERPENT` — Sunny island breather pace (30 moves, turn-based): Serpent sunbathes along the outer reef track.
9. **Special Mechanics:** 90-Degree Laser Billiards: angled Pearl-Shell Coconut Bumpers turn vertical Striped Candies into horizontal L-beams (and vice versa)!
10. **Move Limit / Time Pressure:** Move-Limited (30 moves, 0 real-time timer stress)
11. **Difficulty Rating:** **Medium** (4/10 — *relief_breather*)
12. **Victory Condition:** Pop all 3 Corner Coral Locks and crack 4 Coconut Bumpers within 30 moves.
13. **Failure Condition:** Moves run out before reef bridge drops.
14. **Reward:** `200 Coins`, up to `3 Stars`, Keepsake: *Iridescent Conch Shell*
15. **Unique Gameplay Twist:** Billiard-style 90-degree laser reflection lets players snipe tucked-away locks around indestructible coral walls!
- **Recommended Loadout:** `TOOL_CANDY_HAMMER`, `TOOL_SMART_SHUFFLE`

### Expansion Level 27 (`LVL_033` / Campaign #33): Tidepool Slime Lagoon
- **Chapter:** `CHAPTER_06` | **Prerequisites:** `LVL_032` | **Board:** `7x8` (`tidepool_terraces`)
1. **Level Name:** Tidepool Slime Lagoon
2. **Environment Description:** Stepped coral-limestone tidepools sparkling under tropical sun with bamboo stepping posts.
3. **Rescue Story:** Twin Gur-Slime Blobs are oozing across the tidepool stepping posts while Coconut Husk Bumpers guard the lagoon drains!
4. **Main Objective:** Wash away 14 Sticky Slime tiles and drain 65 Lagoon Marbles to raise the driftwood causeway.
5. **Secondary Objective:** Trigger 4 Wrapped Tender Coconut splash bursts.
6. **Candy Matching Requirement:** 5-color board; Tender Coconut Wrapped bursts cleanse Slime in a plus-shaped hydro cross.
7. **Survival Obstacle:** Primary: `OBS_STICKY_MANGO_SLIME`, Secondary: `OBS_COCONUT_HUSK_BUMPER` — Coconut Bumpers shield drain cols 0 and 7 until cracked or bypassed via reflected beams.
8. **Enemy or Environmental Threat:** `ENEMY_SYRUP_OOZE_BLOB` — Advances at 1.8%/sec and coats 2 candies in Slime every 8s.
9. **Special Mechanics:** Hydro Ricochet: banking a Blue/Coconut Striped beam off a Coconut Bumper upgrades the reflected beam into a Pressurized Hydro Jet that strips ALL Slime along its row!
10. **Move Limit / Time Pressure:** Real-Time Survival (56s envelope, 1.8%/s danger)
11. **Difficulty Rating:** **Medium-Hard** (6/10 — *ramp*)
12. **Victory Condition:** Clean 14 Slimes and drain 65 Lagoon Marbles before Slime Blobs coat Mochi's post.
13. **Failure Condition:** Danger reaches 100%.
14. **Reward:** `220 Coins`, up to `3 Stars`, Keepsake: *Turquoise Starfish Token*
15. **Unique Gameplay Twist:** Elemental beam upgrade: reflecting a Coconut-colored Striped laser off a Coconut Bumper turns it into a Slime-erasing Hydro Jet!
- **Recommended Loadout:** `TOOL_MONSOON_WATER_BLASTER`, `TOOL_FREEZE_BLAST`

### Expansion Level 28 (`LVL_034` / Campaign #34): Jawbreaker Beach Pinball
- **Chapter:** `CHAPTER_06` | **Prerequisites:** `LVL_033` | **Board:** `7x8` (`pinball_funnel`)
1. **Level Name:** Jawbreaker Beach Pinball
2. **Environment Description:** Sloping palm-lined white-sand beach boardwalk dotted with springy Rasgulla beach-umbrellas and giant coconut bumpers.
3. **Rescue Story:** A Spiked Jawbreaker Boulder AND an Armored Jawbreaker Pangolin are rolling down the boardwalk ramp behind Mochi—bounce them back!
4. **Main Objective:** Collect 28 Spongy Rasgulla Orbs, drop 2 Cabana Keys, and shatter the Spiked Boulder (3 Special hits).
5. **Secondary Objective:** Bounce the rolling hazard backward twice using Rasgulla cushions.
6. **Candy Matching Requirement:** 6-color island board including `CANDY_SPONGY_RASGULLA`; every 14 Rasgullas collected deploys an automatic Bounce Cushion behind Mochi!
7. **Survival Obstacle:** Primary: `OBS_SPIKED_BOULDER`, Secondary: `OBS_CRUMBLING_BISCUIT_PLATFORM` — Keys navigate through staggered Coconut Bumpers and Crumbling Sand-Wafer tiles.
8. **Enemy or Environmental Threat:** `ENEMY_JAWBREAKER_PANGOLIN` — Rolls down the boardwalk at 1.95%/sec alongside the Spiked Jawbreaker.
9. **Special Mechanics:** Pinball Cushion Rebound: when the Pangolin hits a deployed Rasgulla Cushion, it rebounds into the Spiked Boulder behind it, dealing 1 free Special hit to the boulder!
10. **Move Limit / Time Pressure:** Real-Time Survival (54s envelope, 1.95%/s danger)
11. **Difficulty Rating:** **Hard** (7/10 — *ramp*)
12. **Victory Condition:** Collect 28 Rasgullas, drop 2 Keys, and shatter the Spiked Boulder before boardwalk impact.
13. **Failure Condition:** Boulder or Pangolin reaches Mochi at 100% danger.
14. **Reward:** `240 Coins`, up to `3 Stars`, Keepsake: *Striped Beach Parasol*
15. **Unique Gameplay Twist:** Arena pinball physics: bouncing the lead Pangolin makes it collide with the trailing Spiked Boulder for chain-reaction damage!
- **Recommended Loadout:** `TOOL_RASGULLA_BOUNCE_PAD`, `TOOL_BAMBOO_MAGNET`

### Expansion Level 29 (`LVL_035` / Campaign #35): Cyclone Breeze Sandbar
- **Chapter:** `CHAPTER_06` | **Prerequisites:** `LVL_034` | **Board:** `7x8` (`wind_carousel`)
1. **Level Name:** Cyclone Breeze Sandbar
2. **Environment Description:** A narrow twin-lagoon sandbar swept by brisk sea breezes, linking two coral lighthouses with a wooden zip-trolley.
3. **Rescue Story:** Brisk island crosswinds are shifting candies sideways while a Closing Lighthouse Door slowly descends ahead of Mochi's zip-trolley!
4. **Main Objective:** Keep the Lighthouse Shutter >= 40% open, unlock 2 Brass Signal Trunks, and break 10 Iron Chains.
5. **Secondary Objective:** Unlock both Signal Trunks with 7+ moves to spare.
6. **Candy Matching Requirement:** 6-color board; Row 1 blows LEFT while Row 5 blows RIGHT (`OBS_GALE_WIND_TUNNEL` counter-currents)!
7. **Survival Obstacle:** Primary: `OBS_GALE_WIND_TUNNEL`, Secondary: `OBS_TIMED_BLAST_SHUTTER` — Counter-rotating wind belts on rows 1 and 5 circulate candies around the 2 central Brass Signal Trunks!
8. **Enemy or Environmental Threat:** `ENEMY_MYNAH_GLIDER_THIEF` — Rides the wind belts in hybrid mode (25 moves / 70s) to re-chain unlocked tiles.
9. **Special Mechanics:** Counter-Current Carousel: candies ride Row 1 left and Row 5 right, automatically bringing needed fruit colors into alignment with the central Brass Trunks!
10. **Move Limit / Time Pressure:** Hybrid Turn + Chase (25 moves / 70s, 1.45%/s danger)
11. **Difficulty Rating:** **Hard** (7/10 — *spike*)
12. **Victory Condition:** Open both Brass Trunks and break 10 Chains while keeping Lighthouse Shutter >= 40% open.
13. **Failure Condition:** Shutter closes below 40% at move 25 or timer expiry.
14. **Reward:** `255 Coins`, up to `3 Stars`, Keepsake: *Coral Lighthouse Lens*
15. **Unique Gameplay Twist:** Opposing left/right wind conveyor rows create a circular candy carousel around stationary color-locked chests!
- **Recommended Loadout:** `TOOL_TEA_LEAF_GUST_FAN`, `TOOL_PRISM_TELEPORTER`

### Expansion Level 30 (`LVL_036` / Campaign #36): BOSS: Maharaja Gulp's Lagoon Barge
- **Chapter:** `CHAPTER_06` | **Prerequisites:** `LVL_035` | **Board:** `7x8` (`barge_amphitheater`)
1. **Level Name:** BOSS: Maharaja Gulp's Lagoon Barge
2. **Environment Description:** A flamboyant floating sweet-banquet barge anchored in a coral bay, captained by the gigantic Maharaja Gulp!
3. **Rescue Story:** BOSS ENCOUNTER 3! Maharaja Gulp activates his vacuum-slurp horn, pulling whole rows of island candies—and Mochi's raft!—toward his banquet barge!
4. **Main Objective:** Deplete Maharaja Gulp's 200 HP appetite bar by banking lasers off 4 Coconut Bumpers and feeding 5 Special Candies into his Mega-Slurp beam!
5. **Secondary Objective:** Feed a Rainbow Color Bomb directly into a Mega-Slurp beam for an instant 60-HP Fizzy Overload!
6. **Candy Matching Requirement:** 6-color island board; every 3 turns Maharaja Gulp highlights 2 columns with a golden Vacuum Beam—any Special Candy left inside those columns gets slurped for 40 Boss stun damage!
7. **Survival Obstacle:** Primary: `OBS_COCONUT_HUSK_BUMPER`, Secondary: `OBS_STICKY_MANGO_SLIME` — 4 angled Coconut Bumpers allow horizontal sniping into Gulp's flank shield during non-slurp turns.
8. **Enemy or Environmental Threat:** `BOSS_03_RAJA_GOLLA_DEVOURER` — 2-Phase Boss pulling Mochi's raft closer at 1.55%/sec with periodic 2-column Mega-Slurps.
9. **Special Mechanics:** Trojan-Candy Counterattack: instead of detonating every Special immediately, parking Specials inside Maharaja Gulp's telegraphed Vacuum Columns turns his own attack against him!
10. **Move Limit / Time Pressure:** Real-Time Survival (68s envelope, 1.55%/s danger)
11. **Difficulty Rating:** **Boss-Hard** (8/10 — *boss_climax*)
12. **Victory Condition:** Reduce Maharaja Gulp's 200 HP to 0 and land 5 Fizzy Slurp counters before Mochi's raft hits the barge.
13. **Failure Condition:** Raft pulled into banquet barge (Danger = 100%).
14. **Reward:** `450 Coins`, up to `3 Stars` + 2x `TOOL_LANTERN_FLARE_BEACON`, Keepsake: *Golden Banquet Crown Spoon*
15. **Unique Gameplay Twist:** Inverts normal match-3 habits: you intentionally LEAVE Special Candies unpopped in telegraphed boss columns so the boss swallows them for massive stun damage!
- **Recommended Loadout:** `TOOL_PRISM_TELEPORTER`, `TOOL_SMART_SHUFFLE`, `TOOL_SUGAR_SHIELD`

### Expansion Level 31 (`LVL_037` / Campaign #37): Meghna Upside-Down Tide!
- **Chapter:** `CHAPTER_07` | **Prerequisites:** `LVL_036` | **Board:** `7x8` (`dual_gravity_waterline`)
1. **Level Name:** Meghna Upside-Down Tide!
2. **Environment Description:** Rain-kissed Meghna riverbank embankment with blooming pink shapla (water-lilies), floating origami paper boats, and brass drainage pumps.
3. **Rescue Story:** Monsoon rains have submerged the bottom 3 rows of the puzzle board in crystal river water—making submerged candies float UPWARD instead of falling down!
4. **Main Objective:** Collect 36 Buoyant Barisal Guavas and 24 Monsoon Jamuns while mastering the Dual-Gravity Flood Line!
5. **Secondary Objective:** Form 4 matches right across the Row-3 Waterline Equator.
6. **Candy Matching Requirement:** 5-color monsoon board introducing `OBS_MONSOON_FLOOD_TIDE`: Rows 0–3 fall DOWN toward Row 3, while submerged Rows 4–6 float UP toward Row 4!
7. **Survival Obstacle:** Primary: `OBS_MONSOON_FLOOD_TIDE` — Rows 4, 5, and 6 are underwater; candies spawn from BOTH row 0 (sky) and row 6 (riverbed) and meet in the middle!
8. **Enemy or Environmental Threat:** `ENEMY_GREEN_SERPENT` — Gentle Chapter-7 onboarding pace (29 moves) as players enjoy learning dual-gravity cascades!
9. **Special Mechanics:** Waterline Convergence: because top candies fall down and bottom candies float up, rows 3 and 4 become a super-dense cascade collision zone!
10. **Move Limit / Time Pressure:** Move-Limited (29 moves, 0 real-time timer stress)
11. **Difficulty Rating:** **Medium** (5/10 — *relief_breather*)
12. **Victory Condition:** Harvest 36 Guavas and 24 Jamuns within 29 moves.
13. **Failure Condition:** Moves expire before Mochi's paper-boat dock rises.
14. **Reward:** `210 Coins`, up to `3 Stars`, Keepsake: *Pink Shapla Water-Lily*
15. **Unique Gameplay Twist:** Dual-gravity horizon: top half falls downward while submerged bottom half floats upward, colliding at the central waterline!
- **Recommended Loadout:** `TOOL_SMART_SHUFFLE`

### Expansion Level 32 (`LVL_038` / Campaign #38): Whirlpool Eel Ferry Spin
- **Chapter:** `CHAPTER_07` | **Prerequisites:** `LVL_037` | **Board:** `7x8` (`whirlpool_twins`)
1. **Level Name:** Whirlpool Eel Ferry Spin
2. **Environment Description:** Wide monsoon river channel crossed by a lantern-lit covered sampan boat amidst playful glowing turquoise whirlpools.
3. **Rescue Story:** A Swirling River-Current Eel is spinning mini-whirlpools around Mochi's sampan—rotating 2x2 blocks of candies clockwise every 2 turns!
4. **Main Objective:** Propel Mochi's Sampan 120m to the stone ghat and free 8 Chained Buoy-Candies.
5. **Secondary Objective:** Let the Eel's clockwise 2x2 spin complete a 4+ match for you twice!
6. **Candy Matching Requirement:** 5-color board with submerged Rows 5–6; Guava matches calm the Eel's backward current tug.
7. **Survival Obstacle:** Primary: `OBS_FERRY_MOVING_PLATFORM`, Secondary: `OBS_MONSOON_FLOOD_TIDE` — Two glowing 2x2 Whirlpool rings at (2,1)-(3,2) and (2,5)-(3,6) rotate their 4 candies 90° clockwise every 2 moves.
8. **Enemy or Environmental Threat:** `ENEMY_MONSOON_WHIRLPOOL_EEL` — Tugs ferry back 8m every 2 moves while rotating the whirlpool tiles.
9. **Special Mechanics:** Predictive Spin Setup: setting 3 matching candies adjacent to a Whirlpool quadrant lets the Eel rotate the 4th candy into a free Striped/Rainbow match!
10. **Move Limit / Time Pressure:** Move-Limited (27 moves, 0 real-time timer stress)
11. **Difficulty Rating:** **Medium-Hard** (6/10 — *ramp*)
12. **Victory Condition:** Reach 120m Sampan distance and snap 8 Chains within 27 moves.
13. **Failure Condition:** Moves reach 0 before docking.
14. **Reward:** `230 Coins`, up to `3 Stars`, Keepsake: *Bioluminescent Fin Charm*
15. **Unique Gameplay Twist:** Predictable clockwise 2x2 whirlpool tile rotations let clever players engineer hands-free end-of-turn combos!
- **Recommended Loadout:** `TOOL_PRISM_TELEPORTER`, `TOOL_CANDY_HAMMER`

### Expansion Level 33 (`LVL_039` / Campaign #39): Buoyant Key Flotation!
- **Chapter:** `CHAPTER_07` | **Prerequisites:** `LVL_038` | **Board:** `7x8` (`center_sluice`)
1. **Level Name:** Buoyant Key Flotation!
2. **Environment Description:** Submerged brick sluice-house where the escape keyholes are mounted at the WATERLINE in the middle of the board instead of the bottom!
3. **Rescue Story:** The lower sluice chamber flooded! Because the Cork-Float Keys are buoyant in water, two Keys drop DOWN from the roof while two float UP from the floor toward Row 3!
4. **Main Objective:** Deliver 2 Top Keys DOWN and 2 Submerged Cork-Keys UP into the central Row-3 Sluice Locks!
5. **Secondary Objective:** Clear the stage without raising the flood gauge above 60%.
6. **Candy Matching Requirement:** 5-color board; Top Keys start at Row 0 (cols 1, 6) falling down; Bottom Cork-Keys start at Row 6 (cols 2, 5) floating UP toward Row 3!
7. **Survival Obstacle:** Primary: `OBS_MONSOON_FLOOD_TIDE`, Secondary: `OBS_BAMBOO_WOOD_CAGE` — Row 3 holds 4 Sluice Lock receptacles guarded by 2-HP Bamboo Cages.
8. **Enemy or Environmental Threat:** `ENEMY_MANGROVE_ROOT_CRAWLER` — Stalks along the upper sluice catwalk at 1.8%/sec.
9. **Special Mechanics:** Bidirectional Key Extraction: for the first time ever, Keys converge from BOTH top and bottom toward the middle row of the grid!
10. **Move Limit / Time Pressure:** Real-Time Survival (58s envelope, 1.8%/s danger)
11. **Difficulty Rating:** **Hard** (7/10 — *ramp*)
12. **Victory Condition:** Seat all 4 Keys into the Row-3 Sluice Locks before the Stilt Crawler reaches Mochi.
13. **Failure Condition:** Danger reaches 100%.
14. **Reward:** `250 Coins`, up to `3 Stars` + 2x `TOOL_GRAPPLING_PULLEY_WINCH`, Keepsake: *Cork-Float Brass Key*
15. **Unique Gameplay Twist:** Center-row Key exits fed simultaneously by downward gravity from above and upward buoyancy from below!
- **Recommended Loadout:** `TOOL_CANDY_HAMMER`, `TOOL_PRISM_TELEPORTER`

### Expansion Level 34 (`LVL_040` / Campaign #40): Firefly Mist Embankment
- **Chapter:** `CHAPTER_07` | **Prerequisites:** `LVL_039` | **Board:** `7x8` (`receding_levee`)
1. **Level Name:** Firefly Mist Embankment
2. **Environment Description:** Twilight monsoon levee shrouded in rain-mist, illuminated only by warm mason-jar firefly lanterns along a collapsing plank bridge.
3. **Rescue Story:** Rain-mist hides the puzzle board while rising floodwater pushes Mochi's plank bridge upward against sharp overhead beams—drain the sluice fast!
4. **Main Objective:** Clear 12 Rain-Mist Clouds, lower Floodwater by draining 70 Sluice Marbles, and repair 4 Bridge Planks.
5. **Secondary Objective:** Trigger a Rainbow + Striped combo to light all levee lanterns at once.
6. **Candy Matching Requirement:** 6-color monsoon board; warning—using `TOOL_MONSOON_WATER_BLASTER` here adds +5% floodwater height, so prefer Gust Fan or Firefly Beacon!
7. **Survival Obstacle:** Primary: `OBS_MONSOON_FLOOD_TIDE`, Secondary: `OBS_TEA_MIST_CLOUD` — Every 25 Sluice Marbles drained lowers the submerged water level by 1 full board row, restoring normal gravity!
8. **Enemy or Environmental Threat:** `ENEMY_MONSOON_WHIRLPOOL_EEL` — Raises flood pressure at 1.9%/sec while spinning misted tiles.
9. **Special Mechanics:** Dynamic Receding Waterline: as you drain Sluice Marbles (25 -> 50 -> 70), the floodwater visibly drops row-by-row on the 3D board!
10. **Move Limit / Time Pressure:** Real-Time Survival (55s envelope, 1.9%/s danger)
11. **Difficulty Rating:** **Hard** (8/10 — *spike*)
12. **Victory Condition:** Clear 12 Mist Clouds, drain 70 Marbles, and rebuild 4 Planks before flood surge hits 100%.
13. **Failure Condition:** Flood gauge reaches 100%.
14. **Reward:** `265 Coins`, up to `3 Stars`, Keepsake: *Firefly Mason Lantern*
15. **Unique Gameplay Twist:** Board physics evolve mid-level: draining marbles physically lowers the waterline row-by-row, flipping submerged rows back to normal downward gravity!
- **Recommended Loadout:** `TOOL_LANTERN_FLARE_BEACON`, `TOOL_TEA_LEAF_GUST_FAN`

### Expansion Level 35 (`LVL_041` / Campaign #41): Great Brahmaputra Barrage
- **Chapter:** `CHAPTER_07` | **Prerequisites:** `LVL_040` | **Board:** `7x8` (`barrage_turbines`)
1. **Level Name:** Great Brahmaputra Barrage
2. **Environment Description:** Monumental brick-and-brass river barrage spanning surging turquoise waters with three giant counterweight floodgates.
3. **Rescue Story:** Chapter 7 Finale! Mochi must cross the Great Barrage catwalk by cranking three Floodgates while Whirlpool Eels, Rotating Turbines, and Rising Tides test every river skill!
4. **Main Objective:** Unlock 3 Brass Turbine Trunks, crank the Timed Flood Shutter >= 50%, and detonate 6 Special Candies.
5. **Secondary Objective:** Finish with 6+ moves remaining.
6. **Candy Matching Requirement:** 6-color board combining 2 Rotating Turbine Gates, submerged rows 5–6, and 3 Brass Turbine Trunks.
7. **Survival Obstacle:** Primary: `OBS_ROTATING_WATERWHEEL_GATE`, Secondary: `OBS_TIMED_BLAST_SHUTTER` — Hybrid turn + tide challenge; Riverboat Winch tool instantly boosts Shutter by +25%.
8. **Enemy or Environmental Threat:** `ENEMY_MONSOON_WHIRLPOOL_EEL` — Hybrid pressure (26 moves / 72s) with 2x2 whirlpool spins.
9. **Special Mechanics:** Hydro-Turbine Overdrive: firing a Striped blast through an open Rotating Turbine Gate spins the generator to crank +20% Shutter height at once!
10. **Move Limit / Time Pressure:** Hybrid Turn + Chase (26 moves / 72s, 1.45%/s danger)
11. **Difficulty Rating:** **Very Hard** (8/10 — *boss_climax*)
12. **Victory Condition:** Open all 3 Brass Trunks and trigger 6 Specials with Flood Shutter >= 50%.
13. **Failure Condition:** Out of moves or Flood Shutter seals shut.
14. **Reward:** `320 Coins`, up to `3 Stars` + 1x `TOOL_SYRUP_CONDUIT_BRUSH`, Keepsake: *Bronze Barrage Wheel*
15. **Unique Gameplay Twist:** Threading Striped lasers through open Rotating Turbine paddles supercharges the mechanical escape gate!
- **Recommended Loadout:** `TOOL_GRAPPLING_PULLEY_WINCH`, `TOOL_JACKFRUIT_RESIN_ANCHOR`

### Expansion Level 36 (`LVL_042` / Campaign #42): Darjeeling Toy-Train Trestle
- **Chapter:** `CHAPTER_08` | **Prerequisites:** `LVL_041` | **Board:** `7x8` (`viaduct_arches`)
1. **Level Name:** Darjeeling Toy-Train Trestle
2. **Environment Description:** Crisp sunlit Himalayan foothills with pine groves, stone viaduct arches, and a cheerful miniature blue steam-train waiting on a frosted siding.
3. **Rescue Story:** Welcome to the Foothills! A Foothill Snow-Kulfi Golem is icing the miniature steam-train switch while a Prism Chameleon shifts colors on a pine branch!
4. **Main Objective:** Shatter 12 Himalayan Frost Ice blocks and land 4 Color-Matched strikes on the Prism Chameleon to clear the train switch!
5. **Secondary Objective:** Detonate 2 Golden Jilapi Coils to melt surrounding Ice in 1 hit.
6. **Candy Matching Requirement:** 5-color alpine board (Mandarin, Litchi, Mango, Jamun, Kulfi); `ENEMY_FROST_YETI_GOLEM` is IMMUNE to Freeze Blast—match warm Mandarin/Litchi/Jilapi pieces instead!
7. **Survival Obstacle:** Primary: `OBS_GLACIER_ICE_BARRIER` — 12 2-HP Frost Ice blocks encase the switch tracks; Jilapi ring-pulses melt 2 HP of Ice instantly!
8. **Enemy or Environmental Threat:** `ENEMY_MIRAGE_CHAMELEON` — Chapter-8 breather pace (29 moves): shifts its crest badge to a random board color each turn.
9. **Special Mechanics:** Chameleon Color-Sync: matching the exact fruit color displayed on the Chameleon's crest fires a targeted beam that pushes both foothill creatures back!
10. **Move Limit / Time Pressure:** Move-Limited (29 moves, 0 real-time timer stress)
11. **Difficulty Rating:** **Medium** (5/10 — *relief_breather*)
12. **Victory Condition:** Clear 12 Frost Ice blocks and score 4 Color-Matched Chameleon hits within 29 moves.
13. **Failure Condition:** Moves run out before toy-train switch clears.
14. **Reward:** `225 Coins`, up to `3 Stars`, Keepsake: *Blue Steam-Train Ticket*
15. **Unique Gameplay Twist:** Color-reactive enemy targeting: watching the Chameleon's live crest color tells you which candy color deals knockback on that turn!
- **Recommended Loadout:** `TOOL_LANTERN_FLARE_BEACON`, `TOOL_CANDY_HAMMER`

### Expansion Level 37 (`LVL_043` / Campaign #43): Echoing Sugar-Shale Tunnel
- **Chapter:** `CHAPTER_08` | **Prerequisites:** `LVL_042` | **Board:** `7x8` (`shale_tunnel`)
1. **Level Name:** Echoing Sugar-Shale Tunnel
2. **Environment Description:** Resonant mountain railway tunnel lined with glittering amber rock-sugar veins and wooden support beams.
3. **Rescue Story:** Careful with loud blasts! In this echoing tunnel, heavy 3x3 Bombs shake loose Falling Sugar-Shale pebbles from the ceiling—precision Striped lasers are king!
4. **Main Objective:** Drop 3 Railway Lantern Keys and clear 10 Frost Ice tiles without burying the chutes in Shale Rockfall!
5. **Secondary Objective:** Win while triggering <= 2 Rockfall tremors.
6. **Candy Matching Requirement:** 6-color foothill board introducing `OBS_LOOSE_SHALE_ROCKFALL`; Striped Candies cut cleanly with ZERO tremor, whereas Wrapped/Cluster Bombs shake down 2 top-row Shale Pebbles!
7. **Survival Obstacle:** Primary: `OBS_LOOSE_SHALE_ROCKFALL`, Secondary: `OBS_GLACIER_ICE_BARRIER` — Keys start at row 1; reckless bombing drops Shale Pebbles right on top of your Keys!
8. **Enemy or Environmental Threat:** `ENEMY_FROST_YETI_GOLEM` — Advances along the tunnel siding at 1.75%/sec and exhales frost every 10s.
9. **Special Mechanics:** Surgical Laser Discipline: rewards 4-in-a-row Striped Candies and Prism Teleporter finesse over noisy area-of-effect bombs!
10. **Move Limit / Time Pressure:** Real-Time Survival (58s envelope, 1.75%/s danger)
11. **Difficulty Rating:** **Hard** (7/10 — *ramp*)
12. **Victory Condition:** Deliver all 3 Lantern Keys and clear 10 Frost Ice tiles before the Yeti blocks the tunnel.
13. **Failure Condition:** Danger reaches 100%.
14. **Reward:** `245 Coins`, up to `3 Stars`, Keepsake: *Amber Rock-Sugar Geode*
15. **Unique Gameplay Twist:** Seismic noise mechanic: explosive 3x3 bombs trigger ceiling rockfalls, elevating clean 4-match Striped surgery over brute blast spam!
- **Recommended Loadout:** `TOOL_PRISM_TELEPORTER`, `TOOL_RASGULLA_BOUNCE_PAD`

### Expansion Level 38 (`LVL_044` / Campaign #44): Cable-Car Crosswind Gorge
- **Chapter:** `CHAPTER_08` | **Prerequisites:** `LVL_043` | **Board:** `7x8` (`gorge_span`)
1. **Level Name:** Cable-Car Crosswind Gorge
2. **Environment Description:** Breathtaking high-altitude ropeway cable car suspended between two snow-dusted mandarin ridges.
3. **Rescue Story:** Mochi's bright red cable car stalled mid-gorge! High ridge gusts blow candies diagonally while a Clockwork Sentinel cranks a Piston Press on the tower!
4. **Main Objective:** Jam 2 Tower Piston Crushers (6 hits), break 10 Iron Chains, and drain 65 Gorge Marbles to winch Mochi's cable car to the summit.
5. **Secondary Objective:** Craft 2 Rainbow Color Bombs during the climb.
6. **Candy Matching Requirement:** 6-color board; unlocks `TOOL_SYRUP_CONDUIT_BRUSH` reward upon completion!
7. **Survival Obstacle:** Primary: `OBS_GALE_WIND_TUNNEL`, Secondary: `OBS_PISTON_CANDY_CRUSHER` — Wind shifts Row 3 rightward toward Crusher Column 5—careful not to let your Striped Candy drift under a slamming piston!
8. **Enemy or Environmental Threat:** `ENEMY_CLOCKWORK_SENTINEL` — Turn-based precision challenge (26 moves): chains 2 tiles every 4th move.
9. **Special Mechanics:** Wind-Assisted Crusher Jam: letting the Row-3 wind drift slide a Striped Candy INTO Column 5 on the Piston's telegraph turn auto-fires it to jam the press!
10. **Move Limit / Time Pressure:** Move-Limited (26 moves, 0 real-time timer stress)
11. **Difficulty Rating:** **Hard** (7/10 — *ramp*)
12. **Victory Condition:** Jam both Crushers (6 hits), snap 10 Chains, and drain 65 Marbles in 26 moves.
13. **Failure Condition:** Moves run out mid-gorge.
14. **Reward:** `265 Coins`, up to `3 Stars` + 2x `TOOL_SYRUP_CONDUIT_BRUSH`, Keepsake: *Summit Cable Gondola Pin*
15. **Unique Gameplay Twist:** Combining Wind Drift with Piston Timing: drifting a Special into a telegraphing Crusher lane jams the hazard hands-free!
- **Recommended Loadout:** `TOOL_TEA_LEAF_GUST_FAN`, `TOOL_CANDY_HAMMER`

### Expansion Level 39 (`LVL_045` / Campaign #45): Thermal Ridge Dual-Track
- **Chapter:** `CHAPTER_08` | **Prerequisites:** `LVL_044` | **Board:** `7x8` (`thermal_divide`)
1. **Level Name:** Thermal Ridge Dual-Track
2. **Environment Description:** Dramatic mountain pass where a steaming hot-spring caramel flume meets an icy glacier ledge beneath a twin-arch bridge.
3. **Rescue Story:** Fire and Ice! A Snow-Kulfi Golem stomps down the left ice ledge while a Sizzling Caramel Salamander races up the right hot-spring trench!
4. **Main Objective:** Clear 10 Glacier Ice blocks, extinguish 10 Fire Embers, and unlock 2 Summit Brass Trunks.
5. **Secondary Objective:** Bank 3 Striped lasers from the warm right half into the icy left half via Coconut Bumpers.
6. **Candy Matching Requirement:** 6-color board; Left cols 0–3 spawn chilly Ice; Right cols 4–7 spawn hot Fire Embers; 2 Coconut Bumpers route beams across the thermal divide!
7. **Survival Obstacle:** Primary: `OBS_GLACIER_ICE_BARRIER`, Secondary: `OBS_CHILI_EMBER_FIRE` — Cross-routing warm beams left melts 2-HP Ice instantly; cross-routing cool Coconut beams right douses entire Ember rows!
8. **Enemy or Environmental Threat:** `ENEMY_FROST_YETI_GOLEM` — Dual elemental advance at 1.9%/sec unless cross-countered.
9. **Special Mechanics:** Cross-Hemisphere Elemental Routing: each half of the board holds the exact elemental counter needed to clear the opposite half twice as fast!
10. **Move Limit / Time Pressure:** Real-Time Survival (56s envelope, 1.9%/s danger)
11. **Difficulty Rating:** **Very Hard** (8/10 — *spike*)
12. **Victory Condition:** Clear 10 Ice, 10 Fire, and both Brass Trunks before either creature reaches the bridge.
13. **Failure Condition:** Thermal danger reaches 100%.
14. **Reward:** `285 Coins`, up to `3 Stars`, Keepsake: *Twin-Peak Brass Badge*
15. **Unique Gameplay Twist:** Asymmetric Fire-and-Ice board halves where cross-shooting lasers across the center divider deals 2x elemental weakness clears!
- **Recommended Loadout:** `TOOL_FOAM_EXTINGUISHER`, `TOOL_SYRUP_CONDUIT_BRUSH`

### Expansion Level 40 (`LVL_046` / Campaign #46): BOSS: Kanchen-Frost the Glacier Colossus
- **Chapter:** `CHAPTER_08` | **Prerequisites:** `LVL_045` | **Board:** `7x8` (`alpine_colossus`)
1. **Level Name:** BOSS: Kanchen-Frost the Glacier Colossus
2. **Environment Description:** High alpine observatory viaduct overlooking sunlit snow peaks, where the towering Kanchen-Frost Yeti Colossus blocks the mountain express!
3. **Rescue Story:** BOSS ENCOUNTER 4! Kanchen-Frost freezes the outer puzzle columns and hurls twin Spiked Jawbreakers down the viaduct—use Rasgulla Trampolines to bounce his boulders right back into his ice armor!
4. **Main Objective:** Shatter Kanchen-Frost's 240 HP Glacier Armor by rebounding 3 Boulders (via Rasgulla Orbs) and detonating 4 Warm Jilapi/Special combos!
5. **Secondary Objective:** Defeat Kanchen-Frost with > 40% viaduct safety margin.
6. **Candy Matching Requirement:** 6-color alpine board featuring `CANDY_SPONGY_RASGULLA` and `CANDY_CRISPY_JILAPI`; Boss is immune to Cryo tools—warm combos & boulder rebounds deal huge damage!
7. **Survival Obstacle:** Primary: `OBS_SPIKED_BOULDER`, Secondary: `OBS_GALE_WIND_TUNNEL` — Phase 1 freezes cols 0 & 7; Phase 2 adds Foothill Wind gusts and twin boulders.
8. **Enemy or Environmental Threat:** `BOSS_04_HIMALAYAN_AVALANCHE_TITAN` — 2-Phase Colossus stomping at 1.6%/sec with Frost Breath & Boulder Hurls.
9. **Special Mechanics:** Avalanche Counter-Volley: collecting 10 Rasgulla Orbs deploys a Spring Bumper on the viaduct that launches Kanchen-Frost's next boulder straight back for 50 Armor Damage!
10. **Move Limit / Time Pressure:** Real-Time Survival (70s envelope, 1.6%/s danger)
11. **Difficulty Rating:** **Boss-Very Hard** (9/10 — *boss_climax*)
12. **Victory Condition:** Reduce Kanchen-Frost's 240 HP to 0 via 3 Boulder Rebounds and 4 Warm Combos.
13. **Failure Condition:** Viaduct crushed at 100% danger.
14. **Reward:** `500 Coins`, up to `3 Stars` + 2x `TOOL_PRISM_TELEPORTER`, Keepsake: *Waffle-Cone Snow Crown*
15. **Unique Gameplay Twist:** Boss is immune to Freeze tools—instead you harvest Rasgulla sponge candies to volley his own giant jawbreakers back at him!
- **Recommended Loadout:** `TOOL_RASGULLA_BOUNCE_PAD`, `TOOL_SYRUP_CONDUIT_BRUSH`, `TOOL_PRISM_TELEPORTER`

### Expansion Level 41 (`LVL_047` / Campaign #47): Pinwheel & Prism Fairground
- **Chapter:** `CHAPTER_09` | **Prerequisites:** `LVL_046` | **Board:** `7x8` (`carnival_plaza`)
1. **Level Name:** Pinwheel & Prism Fairground
2. **Environment Description:** Joyful secular rural Fruit & Kite Carnival (Mela) decked with rainbow paper pinwheels, geometric painted borders, and fruit pavilions.
3. **Rescue Story:** Welcome to the Harvest Carnival! Sparkling Refracting Quartz Prisms sit on the fairground board—hit one with a Striped laser and watch it split into FOUR beams!
4. **Main Objective:** Fire 5 Prism-Split Laser Bursts to pop 14 Woven Bamboo Cages and unlock Mochi's Kite-Balloon tether!
5. **Secondary Objective:** Chain both Quartz Prisms together in a single move!
6. **Candy Matching Requirement:** 5-color festive board introducing `OBS_CRYSTAL_PRISM_MIRROR`: alternates each turn between Orthogonal (+) Cross-Split and Diagonal (X) Star-Split!
7. **Survival Obstacle:** Primary: `OBS_CRYSTAL_PRISM_MIRROR`, Secondary: `OBS_BAMBOO_WOOD_CAGE` — 2 Quartz Prisms at (3,2) and (3,5) amplify any Striped blast into multi-axis fireworks!
8. **Enemy or Environmental Threat:** `ENEMY_GLUTTON_CHOMPER` — Festive Chapter-9 breather (28 moves): Golla-Gulp samples fairground fruits beside the stall.
9. **Special Mechanics:** Orthogonal-vs-Diagonal Prism Alternation: on odd moves Prisms fire + cross beams; on even moves they fire X diagonal beams into the corners!
10. **Move Limit / Time Pressure:** Move-Limited (28 moves, 0 real-time timer stress)
11. **Difficulty Rating:** **Medium** (5/10 — *relief_breather*)
12. **Victory Condition:** Trigger 5 Prism-Split Bursts and break 14 Cages within 28 moves.
13. **Failure Condition:** Moves expire before Kite-Balloon lifts off.
14. **Reward:** `240 Coins`, up to `3 Stars`, Keepsake: *Rainbow Paper Pinwheel*
15. **Unique Gameplay Twist:** Alternating + and X Refracting Quartz Prisms turn single Striped matches into celebratory full-board geometric laser shows!
- **Recommended Loadout:** `TOOL_SYRUP_CONDUIT_BRUSH`

### Expansion Level 42 (`LVL_048` / Campaign #48): Kite-String Sky Relay
- **Chapter:** `CHAPTER_09` | **Prerequisites:** `LVL_047` | **Board:** `7x8` (`kite_diamond`)
1. **Level Name:** Kite-String Sky Relay
2. **Environment Description:** High above the carnival grounds where colorful diamond paper kites (ghuri) carry basket bridges between two wooden fairground towers.
3. **Rescue Story:** Three Canopy Gliders are tangling Mochi's kite-bridge strings while a Prism Chameleon camouflages on the tower flagpole!
4. **Main Objective:** Drop 4 Kite-Spool Keys, score 4 Color-Matched Chameleon hits, and shatter 2 Honeycomb Seals.
5. **Secondary Objective:** Drop 2 Keys on the exact same turn.
6. **Candy Matching Requirement:** 6-color board; firing a Striped beam of the Chameleon's active color through a Quartz Prism counts as a Double Critical Hit!
7. **Survival Obstacle:** Primary: `OBS_CRYSTAL_PRISM_MIRROR`, Secondary: `OBS_HONEYCOMB_WAX_SEAL` — Central Quartz Prism at (3,3) sits right between the two Queen Honeycomb clusters.
8. **Enemy or Environmental Threat:** `ENEMY_MYNAH_GLIDER_THIEF` — Gliders swoop for Spool Keys while Chameleon stalks at 1.85%/sec.
9. **Special Mechanics:** Prism Snipe: hitting the central Prism on an even (X-diagonal) beat snipes BOTH Queen Honeycomb cells in the top corners simultaneously!
10. **Move Limit / Time Pressure:** Real-Time Survival (58s envelope, 1.85%/s danger)
11. **Difficulty Rating:** **Hard** (7/10 — *ramp*)
12. **Victory Condition:** Deliver 4 Spool Keys, land 4 Chameleon hits, and clear 2 Honeycombs before tether snap.
13. **Failure Condition:** Danger reaches 100%.
14. **Reward:** `265 Coins`, up to `3 Stars`, Keepsake: *Painted Diamond Ghuri Kite*
15. **Unique Gameplay Twist:** Diagonal X-Prism geometry lets one well-timed center shot simultaneously snipe both corner Queen Honeycombs AND shoo Gliders!
- **Recommended Loadout:** `TOOL_BAMBOO_MAGNET`, `TOOL_LANTERN_FLARE_BEACON`

### Expansion Level 43 (`LVL_049` / Campaign #49): Ferris-Wheel Turnstile Waltz
- **Chapter:** `CHAPTER_09` | **Prerequisites:** `LVL_048` | **Board:** `7x8` (`ferris_spokes`)
1. **Level Name:** Ferris-Wheel Turnstile Waltz
2. **Environment Description:** Hand-carved wooden village ferris wheel decked in marigold-colored ribbons and spinning fruit gondolas.
3. **Rescue Story:** Mochi is riding Gondola #1 up to the top exit deck, but four Rotating Pinwheel Gates and a Sliding Terracotta Bar keep rearranging the chutes!
4. **Main Objective:** Unlock 3 Brass Gondola Trunks and drain 75 Carnival Marbles within 25 strategic moves.
5. **Secondary Objective:** Drain 25+ Marbles in a single cascade turn.
6. **Candy Matching Requirement:** 6-color board; pure turn-based masterwork combining 4 Rotating Gates + 1 Sliding Partition + 1 Quartz Prism!
7. **Survival Obstacle:** Primary: `OBS_ROTATING_WATERWHEEL_GATE`, Secondary: `OBS_SLIDING_STONE_WALL` — Zero real-time stress—every single board mechanism moves deterministically on your swipe!
8. **Enemy or Environmental Threat:** `ENEMY_CLOCKWORK_SENTINEL` — Advances 1 ferris-spoke per move (25 moves total).
9. **Special Mechanics:** Deterministic Clockwork Symphony: clamping the open state with `TOOL_JACKFRUIT_RESIN_ANCHOR` lets a single Prism-Rainbow cascade drain 30+ Marbles!
10. **Move Limit / Time Pressure:** Move-Limited (25 moves, 0 real-time timer stress)
11. **Difficulty Rating:** **Very Hard** (8/10 — *ramp*)
12. **Victory Condition:** Open 3 Brass Trunks and drain 75 Marbles within 25 moves.
13. **Failure Condition:** Clockwork Sentinel locks the wheel on move 25.
14. **Reward:** `280 Coins`, up to `3 Stars`, Keepsake: *Wooden Ferris Gondola Model*
15. **Unique Gameplay Twist:** Grand clockwork puzzle box—every gate, slider, prism, and sentinel moves on exact deterministic turn beats with zero RNG timer panic!
- **Recommended Loadout:** `TOOL_JACKFRUIT_RESIN_ANCHOR`, `TOOL_SYRUP_CONDUIT_BRUSH`

### Expansion Level 44 (`LVL_050` / Campaign #50): Grand Jilapi Firework Arcade
- **Chapter:** `CHAPTER_09` | **Prerequisites:** `LVL_049` | **Board:** `7x8` (`firework_quad`)
1. **Level Name:** Grand Jilapi Firework Arcade
2. **Environment Description:** Festive twilight sweet-arcade Pavilion with sizzling Jilapi skillets, bouncing Rasgulla trampolines, and a Descending Stage Curtain!
3. **Rescue Story:** The carnival finale curtain is lowering while a Jawbreaker Pangolin and Molten Salamander put on an unruly pyrotechnic show along Mochi's stage!
4. **Main Objective:** Keep the Stage Shutter >= 45% open, trigger 6 Jilapi Ring Relays, and extinguish 12 Fire Embers!
5. **Secondary Objective:** Finish with Stage Shutter >= 80% open!
6. **Candy Matching Requirement:** 6-color board; 4 respawning Jilapi Relay pedestals amplify Prism-split lasers into massive overlapping ring bursts!
7. **Survival Obstacle:** Primary: `OBS_TIMED_BLAST_SHUTTER`, Secondary: `OBS_CHILI_EMBER_FIRE` — Prism at (3,4) feeds directly into 4 corner Jilapi Relays on even (X-diagonal) moves!
8. **Enemy or Environmental Threat:** `ENEMY_JAWBREAKER_PANGOLIN` — High-tempo carnival rush at 1.95%/sec alongside spreading Fire Embers.
9. **Special Mechanics:** Diagonal Prism-to-Jilapi Supernova: hitting the center Prism on an X-turn triggers ALL FOUR corner Jilapi Coils at once, cranking the Stage Curtain +35% open!
10. **Move Limit / Time Pressure:** Real-Time Survival (55s envelope, 1.95%/s danger)
11. **Difficulty Rating:** **Very Hard** (8/10 — *spike*)
12. **Victory Condition:** Trigger 6 Jilapi Relays and douse 12 Embers while keeping Stage Shutter >= 45% open.
13. **Failure Condition:** Curtain slams shut or Pangolin catches Mochi.
14. **Reward:** `300 Coins`, up to `3 Stars`, Keepsake: *Golden Carnival Sparkler*
15. **Unique Gameplay Twist:** Center X-Prism wired to four corner Jilapi Coils rewards timing a single shot for a quadruple chain detonation!
- **Recommended Loadout:** `TOOL_FOAM_EXTINGUISHER`, `TOOL_GRAPPLING_PULLEY_WINCH`

### Expansion Level 45 (`LVL_051` / Campaign #51): BOSS: Charkha-Bot the Carnival Juggernaut
- **Chapter:** `CHAPTER_09` | **Prerequisites:** `LVL_050` | **Board:** `7x8` (`carousel_dynamo`)
1. **Level Name:** BOSS: Charkha-Bot the Carnival Juggernaut
2. **Environment Description:** Centerpiece Brass Clockwork Carousel Pavilion towering above the fruit festival with giant spinning gears and confetti cannons.
3. **Rescue Story:** BOSS ENCOUNTER 5! Charkha-Bot, the giant brass carnival automaton, has gone haywire—synchronizing two Piston Crushers and a Countdown Shutter to block Mochi's balloon!
4. **Main Objective:** Overload Charkha-Bot's 260 HP dynamo using 4 Double-Special Combos while jamming 2 Piston Crushers and keeping the Escape Shutter >= 40%!
5. **Secondary Objective:** Defeat Charkha-Bot within 22 moves!
6. **Candy Matching Requirement:** 6-color board; Hybrid Boss (26 moves / 75s)—combining two adjacent Specials (e.g. Striped + Wrapped) short-circuits Charkha-Bot for 65 HP!
7. **Survival Obstacle:** Primary: `OBS_PISTON_CANDY_CRUSHER`, Secondary: `OBS_TIMED_BLAST_SHUTTER` — 2 Quartz Prisms help clear chains quickly so you can pair adjacent Specials via Saffron Brush or Prism Teleporter!
8. **Enemy or Environmental Threat:** `BOSS_05_FESTIVAL_CLOCKWORK_JUGGERNAUT` — 2-Phase Clockwork Boss advancing on both move ticks and shutter countdown.
9. **Special Mechanics:** Dynamo Short-Circuit: single matches tickle its brass armor, whereas swapping ANY two Special Candies together unleashes an overload arc for massive damage + 2-turn stun!
10. **Move Limit / Time Pressure:** Hybrid Turn + Chase (26 moves / 75s, 1.4%/s danger)
11. **Difficulty Rating:** **Boss-Very Hard** (9/10 — *boss_climax*)
12. **Victory Condition:** Deplete 260 Boss HP and execute 4 Double-Special Combos with Shutter >= 40%.
13. **Failure Condition:** Moves hit 0 or Escape Shutter closes.
14. **Reward:** `550 Coins`, up to `3 Stars` + 2x `TOOL_SYRUP_CONDUIT_BRUSH`, Keepsake: *Master Clockwork Golden Key*
15. **Unique Gameplay Twist:** Pure combo-crafting boss test: rewards pairing two Special Candies side-by-side to short-circuit heavy clockwork armor!
- **Recommended Loadout:** `TOOL_SYRUP_CONDUIT_BRUSH`, `TOOL_PRISM_TELEPORTER`, `TOOL_GRAPPLING_PULLEY_WINCH`

### Expansion Level 46 (`LVL_052` / Campaign #52): Living-Root Geode Bridge
- **Chapter:** `CHAPTER_10` | **Prerequisites:** `LVL_051` | **Board:** `7x8` (`geode_flanks`)
1. **Level Name:** Living-Root Geode Bridge
2. **Environment Description:** Luminous subterranean jungle cavern inspired by Meghalaya & Bandarban hills, spanned by woven living-root bridges glowing with amethyst and quartz crystals.
3. **Rescue Story:** Final Chapter! A Faceted Crystal Sentinel hovers before the Living-Root Bridge—its front mirror blocks vertical shots, so bank lasers into its unshielded flanks!
4. **Main Objective:** Land 5 Side-Flank Laser Hits on the Crystal Sentinel (via Bumpers/Prisms) and collect 36 Tender Coconuts to hydrate the living-root bridge.
5. **Secondary Objective:** Avoid firing vertical beams into the Sentinel's front mirror shield.
6. **Candy Matching Requirement:** 5-color crystal cavern board introducing `ENEMY_QUARTZ_WARDEN`—immune from below, 100% vulnerable to horizontal beams bent off Coconut Bumpers or + Prisms!
7. **Survival Obstacle:** Primary: `OBS_COCONUT_HUSK_BUMPER`, Secondary: `OBS_CRYSTAL_PRISM_MIRROR` — Coconut Bumpers on cols 0 & 7 bend vertical Striped shots horizontally right into the Warden's left/right core!
8. **Enemy or Environmental Threat:** `ENEMY_QUARTZ_WARDEN` — Chapter-10 tactical opener (28 moves): advances 1 root-knot per move.
9. **Special Mechanics:** Flank-Only Geometry: teaches directional shield routing—vertical beams in cols 3–4 bounce off harmlessly, whereas outer-column bank shots pierce straight through!
10. **Move Limit / Time Pressure:** Move-Limited (28 moves, 0 real-time timer stress)
11. **Difficulty Rating:** **Medium-Hard** (6/10 — *relief_breather*)
12. **Victory Condition:** Deliver 5 Side-Flank Laser Hits and collect 36 Coconuts within 28 moves.
13. **Failure Condition:** Sentinel reaches Mochi's root arch after move 28.
14. **Reward:** `260 Coins`, up to `3 Stars`, Keepsake: *Glowing Amethyst Leaf*
15. **Unique Gameplay Twist:** Directional boss-lite shield puzzle: frontal vertical attacks fail, requiring 90-degree lateral bank shots via side bumpers!
- **Recommended Loadout:** `TOOL_CANDY_HAMMER`, `TOOL_SYRUP_CONDUIT_BRUSH`

### Expansion Level 47 (`LVL_053` / Campaign #53): Subterranean Mirror Waterfall
- **Chapter:** `CHAPTER_10` | **Prerequisites:** `LVL_052` | **Board:** `7x8` (`waterfall_nexus`)
1. **Level Name:** Subterranean Mirror Waterfall
2. **Environment Description:** Sparkling underground emerald waterfall feeding a crystal-clear cavern pool where submerged crystal rows meet refracting prisms!
3. **Rescue Story:** Dual-gravity crystal waters submerge the lower cavern while BOTH a Crystal Sentinel and Whirlpool Eel guard the waterfall elevator!
4. **Main Objective:** Converge 4 Crystal Elevator Keys (2 top-down, 2 bottom-up) to Row 3 and land 4 Flank Hits on the Crystal Sentinel!
5. **Secondary Objective:** Let the Eel spin a Striped Candy into alignment with a Quartz Prism.
6. **Candy Matching Requirement:** 6-color cavern board combining Dual-Gravity `OBS_MONSOON_FLOOD_TIDE` (rows 4–6) with Row-3 `OBS_CRYSTAL_PRISM_MIRROR` nodes!
7. **Survival Obstacle:** Primary: `OBS_MONSOON_FLOOD_TIDE`, Secondary: `OBS_CRYSTAL_PRISM_MIRROR` — Row 3 hosts both the 4 Key Receptacles AND 2 Quartz Prisms!
8. **Enemy or Environmental Threat:** `ENEMY_QUARTZ_WARDEN` — Real-time cavern advance at 1.85%/sec with Eel whirlpool spins.
9. **Special Mechanics:** Waterline Prism Nexus: because cascades from BOTH top and bottom collide at Row 3, the Row-3 Quartz Prisms trigger chain-split beams nearly every cascade!
10. **Move Limit / Time Pressure:** Real-Time Survival (60s envelope, 1.85%/s danger)
11. **Difficulty Rating:** **Very Hard** (8/10 — *ramp*)
12. **Victory Condition:** Seat all 4 Elevator Keys at Row 3 and land 4 Sentinel Flank Hits before capture.
13. **Failure Condition:** Danger reaches 100%.
14. **Reward:** `290 Coins`, up to `3 Stars`, Keepsake: *Waterfall Quartz Vial*
15. **Unique Gameplay Twist:** Placing Refracting Prisms right on the Dual-Gravity Waterline creates spectacular self-sustaining cascade fireworks!
- **Recommended Loadout:** `TOOL_PRISM_TELEPORTER`, `TOOL_SUGAR_SHIELD`

### Expansion Level 48 (`LVL_054` / Campaign #54): Kaleidoscope Chameleon Vault
- **Chapter:** `CHAPTER_10` | **Prerequisites:** `LVL_053` | **Board:** `7x8` (`octagon_vault`)
1. **Level Name:** Kaleidoscope Chameleon Vault
2. **Environment Description:** A vaulted octagonal mineral chamber lit by shifting rainbow shafts, housing three ancient secular Brass Explorer Trunks.
3. **Rescue Story:** Two Twin Prism Chameleons guard the Explorer Vault while fragile Crystal Shale hangs overhead—use clean laser surgical precision to unlock all three Trunks!
4. **Main Objective:** Unlock 3 Brass Explorer Trunks, land 6 Color-Synced Chameleon Hits, and clear 10 Glacier Crystal seals in 25 moves!
5. **Secondary Objective:** Complete with 0 Shale Rockfall tremors triggered!
6. **Candy Matching Requirement:** 6-color board with `OBS_LOOSE_SHALE_ROCKFALL`—avoid 3x3 Bombs; use Striped + Prism + Saffron Color Brush!
7. **Survival Obstacle:** Primary: `OBS_BRASS_TREASURE_TRUNK`, Secondary: `OBS_LOOSE_SHALE_ROCKFALL` — Octagonal board (4 corners cut) with central X/+ Prism routing color matches to all 3 Brass Trunks.
8. **Enemy or Environmental Threat:** `ENEMY_MIRAGE_CHAMELEON` — Turn-based precision test (25 moves): Twin Chameleons display 2 target colors each turn.
9. **Special Mechanics:** Dual-Spectrum Sync: matching a color shared by BOTH a Brass Trunk clasp AND a Chameleon crest simultaneously unlocks the chest AND stuns the stalker!
10. **Move Limit / Time Pressure:** Move-Limited (25 moves, 0 real-time timer stress)
11. **Difficulty Rating:** **Very Hard** (9/10 — *ramp*)
12. **Victory Condition:** Open all 3 Explorer Trunks, score 6 Chameleon hits, and clear 10 Crystal Ice seals in 25 moves.
13. **Failure Condition:** Moves reach 0 inside the vault.
14. **Reward:** `310 Coins`, up to `3 Stars`, Keepsake: *Kaleidoscope Prism Astrolabe*
15. **Unique Gameplay Twist:** High-IQ surgical puzzle combining seismic bomb restrictions with overlapping Trunk-and-Chameleon color targeting!
- **Recommended Loadout:** `TOOL_LANTERN_FLARE_BEACON`, `TOOL_SYRUP_CONDUIT_BRUSH`

### Expansion Level 49 (`LVL_055` / Campaign #55): Gauntlet of the Crystal Causeway
- **Chapter:** `CHAPTER_10` | **Prerequisites:** `LVL_054` | **Board:** `7x8` (`grand_causeway`)
1. **Level Name:** Gauntlet of the Crystal Causeway
2. **Environment Description:** A soaring crystal-arched suspension causeway leading directly to the Grand Sanctuary Gates above a glowing caramel-and-waterfall chasm.
3. **Rescue Story:** Penultimate Survival Gauntlet! The Emerald Serpent, Crystal Sentinel, AND Closing Sanctuary Gate converge as Mochi makes her final dash to the Sanctum!
4. **Main Objective:** Keep the Sanctuary Shutter >= 45% open, drop 3 Royal Sanctum Keys, drain 80 Crystal Marbles, and land 4 Flank Hits!
5. **Secondary Objective:** Escape with Danger below 50% and Shutter >= 75%!
6. **Candy Matching Requirement:** 6-color full-arsenal board featuring Prisms, Coconut Bumpers, Rotating Gates, and Jilapi Relays!
7. **Survival Obstacle:** Primary: `OBS_TIMED_BLAST_SHUTTER`, Secondary: `OBS_ROTATING_WATERWHEEL_GATE` — Every system learned across Chapters 1–10 works in harmony to generate huge cascade chains!
8. **Enemy or Environmental Threat:** `ENEMY_GREEN_SERPENT` — Elite Serpent + Sentinel pursuit at 2.0%/sec.
9. **Special Mechanics:** Full-Arsenal Harmonic Chain: banking a Striped shot off a Coconut Bumper into a Quartz Prism triggers Jilapi Relays that simultaneously drain Marbles, flank the Sentinel, and crank the Shutter!
10. **Move Limit / Time Pressure:** Real-Time Survival (62s envelope, 2%/s danger)
11. **Difficulty Rating:** **Master** (9/10 — *spike*)
12. **Victory Condition:** Complete all 4 Causeway objectives while keeping Sanctuary Shutter >= 45% open.
13. **Failure Condition:** Shutter closes or Serpent catches Mochi.
14. **Reward:** `360 Coins`, up to `3 Stars` + 2x `TOOL_CHRONO_SANDGLASS`, Keepsake: *Diamond Causeway Crest*
15. **Unique Gameplay Twist:** Rube-Goldberg laser circuit where one well-aimed bank shot chains Bumper -> Prism -> Jilapi Coil to advance all 4 objectives at once!
- **Recommended Loadout:** `TOOL_GRAPPLING_PULLEY_WINCH`, `TOOL_PRISM_TELEPORTER`, `TOOL_CHRONO_SANDGLASS`

### Expansion Level 50 (`LVL_056` / Campaign #56): FINAL BOSS: Emperor Chroma-Fang's Prism Sanctum
- **Chapter:** `CHAPTER_10` | **Prerequisites:** `LVL_055` | **Board:** `7x8` (`grand_prism_sanctum`)
1. **Level Name:** FINAL BOSS: Emperor Chroma-Fang's Prism Sanctum
2. **Environment Description:** Breathtaking sunlit Crystal Jungle Amphitheater crowned by a rainbow waterfall terrace, living-root arches, and the Grand Golden Rescue Portal!
3. **Rescue Story:** GRAND CAMPAIGN FINALE (Level 56)! Emperor Chroma-Fang—the Three-Headed Prism Serpent (Ruby Fire Head, Sapphire Frost Head, Emerald Slime Head)—blocks the Golden Portal in an epic 3-Phase showdown!
4. **Main Objective:** Vanquish Emperor Chroma-Fang's 350 HP across 3 Phases: (1) Counter Fire/Ice/Slime Heads, (2) Route Dual-Gravity Prism Beams, and (3) Drop the Final Royal Key + Fire the 100% Rainbow Mega-Cannon!
5. **Secondary Objective:** Land a Rainbow Bomb + Striped Candy mega-combo through a Quartz Prism to hit all 3 Serpent Heads simultaneously!
6. **Candy Matching Requirement:** Full 6-color Grand Finale palette (Himsagar Mango, Dinajpur Litchi, Tender Coconut, Monsoon Jamun, Pistachio Kulfi, Crispy Jilapi)!
7. **Survival Obstacle:** Primary: `OBS_CRYSTAL_PRISM_MIRROR`, Secondary: `OBS_MONSOON_FLOOD_TIDE` — Phase 1: Fire/Ice/Slime tri-hazards; Phase 2: Rows 5–6 submerge in Dual-Gravity Crystal Tide around 2 central Prisms; Phase 3: Spiral sprint for the Final Key!
8. **Enemy or Environmental Threat:** `BOSS_06_EMPEROR_PRISM_HYDRA_SERPENT` — 3-Phase Ultimate Boss (350 HP) shifting arena physics at 65% and 30% HP thresholds!
9. **Special Mechanics:** Tri-Elemental Prism Finale: routing a Rainbow + Striped combo into the central Quartz Prisms refracts elemental counter-beams into all 3 Hydra heads at once, charging the Golden Rescue Mega-Cannon!
10. **Move Limit / Time Pressure:** Real-Time Survival (80s envelope, 1.45%/s danger)
11. **Difficulty Rating:** **Grand-Master Finale** (10/10 — *boss_climax*)
12. **Victory Condition:** Deplete all 350 HP of Emperor Chroma-Fang, deliver the Final Royal Key, and fire the 100% Rainbow Mega-Cannon!
13. **Failure Condition:** Chroma-Fang overtakes the Golden Portal terrace (Danger = 100%).
14. **Reward:** `1000 Coins`, up to `3 Stars` + 3x `TOOL_PRISM_TELEPORTER`, Keepsake: *Grand Prism Rescue Trophy*
15. **Unique Gameplay Twist:** Three-stage evolving boss arena that synthesizes elemental counterplay, dual-gravity waterline cascades, and prism-refracted Rainbow mega-combos into one unforgettable climax!
- **Recommended Loadout:** `TOOL_PRISM_TELEPORTER`, `TOOL_SYRUP_CONDUIT_BRUSH`, `TOOL_SUGAR_SHIELD`, `TOOL_CHRONO_SANDGLASS`

