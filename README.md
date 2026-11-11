# Candy Rescue Saga — Mochi 3D Rescue Adventure

A premium 3D stylized Match-3 Character Rescue puzzle adventure built with **React + TypeScript + Three.js + Vite + Web Audio API**.

---

## 3D Visual & Technical Architecture

1. **Real-Time Three.js PBR Candy Engine (`src/three/candyMeshes3D.ts`, `src/three/studioEnv.ts`):**
   - Procedural HDR-style Studio Environment lighting (`PMREMGenerator`) with `ACESFilmicToneMapping`, soft PCF shadows, and `MeshPhysicalMaterial` clearcoat/transmission shaders.
   - **6 Distinct Sculpted 3D Candies:** Red Strawberry, Blue Faceted Crystal, Yellow Citrus Lemon, Green Orchard Apple, Purple Grape Cluster, and Orange Caramel Swirl.
   - **4 Premium Special Candies & 3D Blockers:** Glowing Directional Striped Candy, 3D Translucent Cellophane Wrapped Candy, Plasma Energy Bomb, and Gem-Studded Rainbow Color Bomb, plus 3D Golden Keys, Wafer Crates, Frosted Ice Cubes, Iron Chains, and Boss Slime.

2. **Articulated 3D Mochi Character Rig (`src/three/mochiCharacter3D.ts`):**
   - Preserves Mochi's signature cream marshmallow-cub chibi identity with sculpted 3D hair volume & swaying side-locks, multi-layered anime eyes with dual catchlights & natural blinking, scalloped rose capelet, and pleated skirt.
   - **Gameplay-Reactive Expressions:** Idle breathing, periodic blinking, cheerful match celebrations, surprised gasps, high-danger trembling with 3D sweat drops, teary failure animation, and spinning jump victory celebration.
   - *Note on procedural 3D character rig:* Mochi and the Serpent are currently built from articulated procedural Three.js meshes (`THREE.Group` hierarchies) so zero external `.glb` downloads are required; the rig modularly isolates character rendering in `mochiCharacter3D.ts` and `serpentMonster3D.ts` for future custom character sheet/model integration.

3. **3D Rescue Worlds & Monster System (`src/three/rescueWorld3D.ts`, `src/three/serpentMonster3D.ts`):**
   - All **6 Rescue Missions** rendered in a unified 3D Candy Kingdom arena connected directly to the 3D beveled puzzle board:
     1. *Spiral Serpent Escape* (3D G-labyrinth + glass marble silo)
     2. *Molten Caramel Bridge* (3D lava waves + spiked wall + 4 wafer bridge planks)
     3. *Triple Key Dungeon* (3 crystal laser gates + 3D golden key drops)
     4. *Frost Turret & Dual Chompers* (Twin 3D serpents + ceiling crystal frost cannon)
     5. *Rolling Jawbreaker Escape* (Sloped 3D ramp + giant spiked boulder)
     6. *Serpent King’s Citadel* (Crowned Boss Dragon + slime projectiles + Rainbow Mega-Beam)

4. **Premium Casual 3D UI (`src/components/ui/CandyIcons3D.tsx`):**
   - Royal gold-trimmed beveled 3D panels, tactile pillow buttons, custom 3D vector emblems (zero emoji placeholders), winding Fantasy Kingdom Mission Map, and animated Mission Intro / Victory / Fail popups.

---

## Running Locally

```bash
npm install
npm run dev
```

Build production bundle:

```bash
npm run build
```
