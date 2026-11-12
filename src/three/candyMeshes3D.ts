import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { BlockerType, CandyColor, SpecialType } from '../types/game';
import { getProceduralPBRMaps } from './proceduralTextures3D';

export const CANDY_HEX: Record<CandyColor, number> = {
  red: 0xff003c,
  blue: 0x0095ff,
  yellow: 0xffd000,
  green: 0x00d936,
  purple: 0x9d00ff,
  orange: 0xff6600,
};

export const CANDY_EMISSIVE_HEX: Record<CandyColor, number> = {
  red: 0x000000,
  blue: 0x000000,
  yellow: 0x000000,
  green: 0x000000,
  purple: 0x000000,
  orange: 0x000000,
};

interface GeometryLibrary {
  strawberryBody: THREE.BufferGeometry;
  innerGlowCore: THREE.SphereGeometry;
  strawberrySeed: THREE.BufferGeometry;
  leaf: THREE.BufferGeometry;
  crystalBody: THREE.BufferGeometry;
  crystalInner: THREE.BufferGeometry;
  lemonBody: THREE.BufferGeometry;
  appleBody: THREE.BufferGeometry;
  appleStem: THREE.CylinderGeometry;
  grapeSphere: THREE.SphereGeometry;
  dewDrop: THREE.SphereGeometry;
  caramelBase: THREE.BufferGeometry;
  caramelSwirl: THREE.TorusGeometry;
  stripeBand: THREE.TorusGeometry;
  wrapperBox: RoundedBoxGeometry;
  wrapperFlute: THREE.CylinderGeometry;
  bombSphere: THREE.SphereGeometry;
  bombVent: THREE.CylinderGeometry;
  rainbowSphere: THREE.SphereGeometry;
  rainbowGem: THREE.OctahedronGeometry;
  rainbowHalo: THREE.TorusGeometry;
  keyRing: THREE.TorusGeometry;
  keyShaft: THREE.CylinderGeometry;
  keyBit: RoundedBoxGeometry;
  crateBox: RoundedBoxGeometry;
  cratePlank: RoundedBoxGeometry;
  iceBox: RoundedBoxGeometry;
  chainLink: THREE.TorusGeometry;
  slimeDome: THREE.SphereGeometry;
  shadowDisc: THREE.CircleGeometry;
}

let cachedGeos: GeometryLibrary | null = null;
let cachedMats: Record<string, THREE.Material> | null = null;

function buildLatheStrawberry(): THREE.BufferGeometry {
  const pts: THREE.Vector2[] = [];
  const steps = 28;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const y = (t - 0.48) * 0.8;
    const r =
      Math.sin(t * Math.PI) *
      (0.25 + 0.21 * Math.pow(t, 0.74)) *
      (t > 0.88 ? 1 - (t - 0.88) * 1.35 : 1);
    pts.push(new THREE.Vector2(Math.max(0.001, r), y));
  }
  const geo = new THREE.LatheGeometry(pts, 36);
  geo.computeVertexNormals();
  return geo;
}

function buildLatheMangoDrop(): THREE.BufferGeometry {
  const pts: THREE.Vector2[] = [];
  const steps = 28;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const u = t * 2 - 1;
    const y = u * 0.43;
    const base = Math.sqrt(Math.max(0, 1 - u * u)) * (0.35 + u * 0.035);
    const tipBoost = Math.exp(-Math.pow((Math.abs(u) - 0.86) * 7, 2)) * 0.042;
    pts.push(new THREE.Vector2(Math.max(0.002, base + tipBoost), y));
  }
  const geo = new THREE.LatheGeometry(pts, 36);
  geo.rotateZ(0.42);
  geo.computeVertexNormals();
  return geo;
}

function buildLatheApple(): THREE.BufferGeometry {
  const pts: THREE.Vector2[] = [];
  const steps = 28;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const ang = t * Math.PI;
    const sinA = Math.sin(ang);
    const cosA = Math.cos(ang);
    const r = 0.02 + sinA * (0.375 + 0.06 * Math.sin(ang * 0.85));
    const dimple = Math.pow(Math.abs(cosA), 6) * 0.088;
    const y = -cosA * 0.36 + (cosA > 0 ? dimple : -dimple * 1.2);
    pts.push(new THREE.Vector2(r, y));
  }
  const geo = new THREE.LatheGeometry(pts, 36);
  geo.computeVertexNormals();
  return geo;
}

function buildCaramelCushion(): THREE.BufferGeometry {
  const geo = new RoundedBoxGeometry(0.74, 0.74, 0.42, 5, 0.16);
  return geo;
}

function getGeos(): GeometryLibrary {
  if (cachedGeos) return cachedGeos;

  const crystalBody = new THREE.OctahedronGeometry(0.42, 2);
  crystalBody.scale(0.88, 1.08, 0.72);
  crystalBody.computeVertexNormals();

  const crystalInner = new THREE.OctahedronGeometry(0.24, 0);
  crystalInner.scale(0.85, 1.1, 0.7);

  const leaf = new THREE.SphereGeometry(0.11, 14, 10);
  leaf.scale(1.38, 0.25, 0.65);

  cachedGeos = {
    strawberryBody: buildLatheStrawberry(),
    innerGlowCore: new THREE.SphereGeometry(0.18, 14, 12),
    strawberrySeed: new THREE.SphereGeometry(0.023, 8, 8),
    leaf,
    crystalBody,
    crystalInner,
    lemonBody: buildLatheMangoDrop(),
    appleBody: buildLatheApple(),
    appleStem: new THREE.CylinderGeometry(0.022, 0.032, 0.16, 10),
    grapeSphere: new THREE.SphereGeometry(0.17, 20, 18),
    dewDrop: new THREE.SphereGeometry(0.032, 8, 8),
    caramelBase: buildCaramelCushion(),
    caramelSwirl: new THREE.TorusGeometry(0.185, 0.046, 14, 36, Math.PI * 1.85),
    stripeBand: new THREE.TorusGeometry(0.375, 0.045, 12, 34),
    wrapperBox: new RoundedBoxGeometry(0.84, 0.78, 0.62, 4, 0.16),
    wrapperFlute: new THREE.CylinderGeometry(0.05, 0.23, 0.23, 14, 1, false),
    bombSphere: new THREE.SphereGeometry(0.38, 28, 24),
    bombVent: new THREE.CylinderGeometry(0.08, 0.08, 0.08, 14),
    rainbowSphere: new THREE.SphereGeometry(0.39, 32, 26),
    rainbowGem: new THREE.OctahedronGeometry(0.09, 0),
    rainbowHalo: new THREE.TorusGeometry(0.46, 0.025, 12, 40),
    keyRing: new THREE.TorusGeometry(0.165, 0.054, 14, 28),
    keyShaft: new THREE.CylinderGeometry(0.046, 0.046, 0.44, 14),
    keyBit: new RoundedBoxGeometry(0.14, 0.06, 0.055, 2, 0.015),
    crateBox: new RoundedBoxGeometry(0.86, 0.86, 0.38, 3, 0.07),
    cratePlank: new RoundedBoxGeometry(0.88, 0.13, 0.42, 2, 0.03),
    iceBox: new RoundedBoxGeometry(0.88, 0.88, 0.58, 4, 0.1),
    chainLink: new THREE.TorusGeometry(0.13, 0.038, 10, 20),
    slimeDome: new THREE.SphereGeometry(0.45, 26, 20),
    shadowDisc: new THREE.CircleGeometry(0.4, 24),
  };

  return cachedGeos;
}

function getMats(): Record<string, THREE.Material> {
  if (cachedMats) return cachedMats;
  const maps = getProceduralPBRMaps();

  cachedMats = {
    // Pure Vibrant Ruby-Crimson Berry Glaze (Zero muddy emissive glow)
    red: new THREE.MeshPhysicalMaterial({
      color: 0xff003c,
      roughness: 0.06,
      metalness: 0.02,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      normalMap: maps.citrusNormal,
      normalScale: new THREE.Vector2(0.14, 0.14),
      specularIntensity: 1.15,
      envMapIntensity: 1.35,
    }),
    redInner: new THREE.MeshBasicMaterial({
      color: 0xff4d79,
      transparent: true,
      opacity: 0.4,
    }),
    // Vivid Electric Sapphire Crystal Gem
    blue: new THREE.MeshPhysicalMaterial({
      color: 0x0095ff,
      roughness: 0.03,
      metalness: 0.05,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      transmission: 0.5,
      thickness: 0.95,
      ior: 1.54,
      attenuationColor: new THREE.Color(0x0066ff),
      attenuationDistance: 0.9,
      envMapIntensity: 1.5,
    }),
    blueCore: new THREE.MeshBasicMaterial({
      color: 0x80d8ff,
      transparent: true,
      opacity: 0.85,
    }),
    // Sunny Canary-Mango Citrus Drop
    yellow: new THREE.MeshPhysicalMaterial({
      color: 0xffd000,
      roughness: 0.06,
      metalness: 0.02,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      normalMap: maps.citrusNormal,
      normalScale: new THREE.Vector2(0.2, 0.2),
      specularIntensity: 1.15,
      envMapIntensity: 1.35,
    }),
    // Crisp Electric Lime-Emerald Apple Candy
    green: new THREE.MeshPhysicalMaterial({
      color: 0x00d936,
      roughness: 0.06,
      metalness: 0.02,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      specularIntensity: 1.15,
      envMapIntensity: 1.35,
    }),
    // Rich Royal Amethyst-Violet Grape Cluster
    purple: new THREE.MeshPhysicalMaterial({
      color: 0x9d00ff,
      roughness: 0.06,
      metalness: 0.04,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      sheen: 0.5,
      sheenColor: new THREE.Color(0xf3d4ff),
      envMapIntensity: 1.4,
    }),
    // Vivid Tangerine-Saffron Cushion
    orange: new THREE.MeshPhysicalMaterial({
      color: 0xff6600,
      roughness: 0.06,
      metalness: 0.03,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      normalMap: maps.citrusNormal,
      normalScale: new THREE.Vector2(0.12, 0.12),
      envMapIntensity: 1.35,
    }),
    creamSwirl: new THREE.MeshPhysicalMaterial({
      color: 0xfff8eb,
      roughness: 0.08,
      clearcoat: 1.0,
      envMapIntensity: 1.3,
    }),
    waterDrop: new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.0,
      clearcoat: 1.0,
      transmission: 0.85,
      ior: 1.33,
      envMapIntensity: 1.6,
    }),
    leaf: new THREE.MeshPhysicalMaterial({
      color: 0x00e640,
      roughness: 0.16,
      clearcoat: 0.85,
    }),
    stem: new THREE.MeshStandardMaterial({
      color: 0x6b3a14,
      roughness: 0.5,
    }),
    seed: new THREE.MeshPhysicalMaterial({
      color: 0xffe600,
      roughness: 0.18,
      metalness: 0.25,
      clearcoat: 0.9,
    }),
    stripeGlow: new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.08,
      clearcoat: 1.0,
    }),
    wrapperShell: new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.36,
      roughness: 0.03,
      clearcoat: 1.0,
      iridescence: 0.65,
      iridescenceIOR: 1.4,
      envMapIntensity: 1.5,
      side: THREE.DoubleSide,
    }),
    bombCore: new THREE.MeshPhysicalMaterial({
      color: 0x1e1b4b,
      roughness: 0.14,
      metalness: 0.82,
      clearcoat: 1.0,
      envMapIntensity: 1.5,
    }),
    bombEnergy: new THREE.MeshPhysicalMaterial({
      color: 0xffbe0b,
      roughness: 0.1,
      clearcoat: 1.0,
    }),
    rainbowBody: new THREE.MeshPhysicalMaterial({
      color: 0x3b0764,
      roughness: 0.1,
      metalness: 0.45,
      clearcoat: 1.0,
      envMapIntensity: 1.5,
    }),
    rainbowRing: new THREE.MeshPhysicalMaterial({
      color: 0xffd60a,
      roughness: 0.12,
      metalness: 0.8,
      clearcoat: 1.0,
    }),
    gold: new THREE.MeshPhysicalMaterial({
      color: 0xffcc00,
      roughness: 0.12,
      metalness: 0.9,
      clearcoat: 1.0,
      envMapIntensity: 1.6,
    }),
    ruby: new THREE.MeshPhysicalMaterial({
      color: 0xff0044,
      roughness: 0.04,
      clearcoat: 1.0,
    }),
    crate1: new THREE.MeshPhysicalMaterial({
      color: 0xf59e0b,
      roughness: 0.34,
      metalness: 0.06,
      clearcoat: 0.35,
      normalMap: maps.woodNormal,
      normalScale: new THREE.Vector2(0.55, 0.55),
    }),
    crate1Trim: new THREE.MeshPhysicalMaterial({
      color: 0xb45309,
      roughness: 0.4,
      normalMap: maps.woodNormal,
      normalScale: new THREE.Vector2(0.45, 0.45),
    }),
    crate2: new THREE.MeshPhysicalMaterial({
      color: 0x92400e,
      roughness: 0.36,
      metalness: 0.16,
      clearcoat: 0.35,
      normalMap: maps.woodNormal,
      normalScale: new THREE.Vector2(0.65, 0.65),
    }),
    iron: new THREE.MeshPhysicalMaterial({
      color: 0xf1f5f9,
      roughness: 0.18,
      metalness: 0.9,
      clearcoat: 0.65,
      envMapIntensity: 1.5,
    }),
    ice1: new THREE.MeshPhysicalMaterial({
      color: 0x90e0ef,
      roughness: 0.06,
      clearcoat: 1.0,
      transmission: 0.62,
      thickness: 0.85,
      ior: 1.31,
      normalMap: maps.iceCrackNormal,
      normalScale: new THREE.Vector2(0.38, 0.38),
      envMapIntensity: 1.5,
    }),
    ice2: new THREE.MeshPhysicalMaterial({
      color: 0x00b4d8,
      roughness: 0.08,
      clearcoat: 1.0,
      transmission: 0.45,
      thickness: 1.1,
      ior: 1.34,
      normalMap: maps.iceCrackNormal,
      normalScale: new THREE.Vector2(0.65, 0.65),
      envMapIntensity: 1.5,
    }),
    slime: new THREE.MeshPhysicalMaterial({
      color: 0x46f56c,
      emissive: 0x0f6924,
      emissiveIntensity: 0.35,
      roughness: 0.04,
      clearcoat: 1.0,
      transmission: 0.58,
      thickness: 0.75,
      ior: 1.42,
      envMapIntensity: 1.9,
    }),
    contactShadow: new THREE.MeshBasicMaterial({
      color: 0x040711,
      transparent: true,
      opacity: 0.44,
      depthWrite: false,
    }),
  };

  return cachedMats;
}

function buildBaseCandySculpture(color: CandyColor): THREE.Group {
  const g = getGeos();
  const m = getMats();
  const group = new THREE.Group();

  switch (color) {
    case 'red': {
      const berry = new THREE.Mesh(g.strawberryBody, m.red);
      berry.castShadow = true;
      berry.rotation.z = -0.14;
      const core = new THREE.Mesh(g.innerGlowCore, m.redInner);
      berry.add(core);

      for (let i = 0; i < 12; i++) {
        const ang = (i / 12) * Math.PI * 2;
        const rowY = i % 3 === 0 ? 0.08 : i % 3 === 1 ? -0.05 : -0.17;
        const rad = i % 3 === 0 ? 0.35 : i % 3 === 1 ? 0.32 : 0.23;
        const seed = new THREE.Mesh(g.strawberrySeed, m.seed);
        seed.position.set(Math.cos(ang) * rad, rowY, Math.sin(ang) * rad);
        berry.add(seed);
      }

      const crown = new THREE.Group();
      crown.position.set(0, 0.36, 0);
      for (let k = 0; k < 5; k++) {
        const lf = new THREE.Mesh(g.leaf, m.leaf);
        const a = (k / 5) * Math.PI * 2 + 0.3;
        lf.position.set(Math.cos(a) * 0.115, 0, Math.sin(a) * 0.115);
        lf.rotation.y = -a;
        lf.rotation.z = -0.22;
        crown.add(lf);
      }
      berry.add(crown);
      group.add(berry);
      break;
    }

    case 'blue': {
      const gem = new THREE.Mesh(g.crystalBody, m.blue);
      gem.castShadow = true;
      gem.rotation.z = 0.15;
      const core = new THREE.Mesh(g.crystalInner, m.blueCore);
      gem.add(core);
      group.add(gem);
      break;
    }

    case 'yellow': {
      const mango = new THREE.Mesh(g.lemonBody, m.yellow);
      mango.castShadow = true;
      const tipLeaf = new THREE.Mesh(g.leaf, m.leaf);
      tipLeaf.position.set(-0.12, 0.36, 0.04);
      tipLeaf.rotation.z = 0.45;
      mango.add(tipLeaf);
      group.add(mango);
      break;
    }

    case 'green': {
      const apple = new THREE.Mesh(g.appleBody, m.green);
      apple.castShadow = true;
      const stem = new THREE.Mesh(g.appleStem, m.stem);
      stem.position.set(0, 0.33, 0);
      stem.rotation.z = -0.2;
      apple.add(stem);

      const lf = new THREE.Mesh(g.leaf, m.leaf);
      lf.position.set(0.12, 0.34, 0.04);
      lf.rotation.z = 0.35;
      apple.add(lf);

      const dew = new THREE.Mesh(g.dewDrop, m.waterDrop);
      dew.position.set(-0.22, 0.12, 0.31);
      apple.add(dew);
      group.add(apple);
      break;
    }

    case 'purple': {
      const bunch = new THREE.Group();
      const offsets: Array<[number, number, number]> = [
        [-0.14, 0.15, 0.05],
        [0.14, 0.15, 0.05],
        [0, 0.16, -0.12],
        [-0.15, -0.04, 0.09],
        [0.15, -0.04, 0.09],
        [0, -0.02, 0.19],
        [0, -0.22, 0.06],
      ];
      for (const [ox, oy, oz] of offsets) {
        const gp = new THREE.Mesh(g.grapeSphere, m.purple);
        gp.castShadow = true;
        gp.position.set(ox, oy, oz);
        bunch.add(gp);
      }
      const dew = new THREE.Mesh(g.dewDrop, m.waterDrop);
      dew.position.set(0.08, 0.04, 0.34);
      bunch.add(dew);

      const lf = new THREE.Mesh(g.leaf, m.leaf);
      lf.position.set(0.06, 0.31, 0.06);
      lf.rotation.z = 0.25;
      bunch.add(lf);
      bunch.rotation.z = -0.12;
      group.add(bunch);
      break;
    }

    case 'orange': {
      const pad = new THREE.Mesh(g.caramelBase, m.orange);
      pad.castShadow = true;
      pad.rotation.z = 0.08;
      const swirl = new THREE.Mesh(g.caramelSwirl, m.creamSwirl);
      swirl.position.set(0, 0, 0.2);
      pad.add(swirl);
      group.add(pad);
      break;
    }
  }

  return group;
}

export function createCandyMesh3D(color: CandyColor, special: SpecialType): THREE.Group {
  const g = getGeos();
  const m = getMats();
  const root = new THREE.Group();

  const shadow = new THREE.Mesh(g.shadowDisc, m.contactShadow);
  shadow.position.set(0.05, -0.09, -0.28);
  root.add(shadow);

  const visual = new THREE.Group();
  visual.name = 'candyBody';
  root.add(visual);

  if (special === 'key') {
    const keyGroup = new THREE.Group();
    keyGroup.rotation.z = -0.45;

    const bow = new THREE.Mesh(g.keyRing, m.gold);
    bow.position.set(0, 0.2, 0);
    keyGroup.add(bow);

    const gem = new THREE.Mesh(g.rainbowGem, m.ruby);
    gem.position.set(0, 0.2, 0.04);
    keyGroup.add(gem);

    const shaft = new THREE.Mesh(g.keyShaft, m.gold);
    shaft.position.set(0, -0.12, 0);
    keyGroup.add(shaft);

    const bit1 = new THREE.Mesh(g.keyBit, m.gold);
    bit1.position.set(0.08, -0.22, 0);
    const bit2 = new THREE.Mesh(g.keyBit, m.gold);
    bit2.scale.x = 0.75;
    bit2.position.set(0.07, -0.31, 0);
    keyGroup.add(bit1, bit2);

    const halo = new THREE.Mesh(g.rainbowHalo, m.rainbowRing);
    keyGroup.add(halo);

    visual.add(keyGroup);
    return root;
  }

  if (special === 'rainbow') {
    const core = new THREE.Mesh(g.rainbowSphere, m.rainbowBody);
    visual.add(core);

    const gemColors: CandyColor[] = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];
    const count = 16;
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 0.395;
      const gx = r * Math.sin(phi) * Math.cos(theta);
      const gy = r * Math.sin(phi) * Math.sin(theta);
      const gz = r * Math.cos(phi);

      const clr = gemColors[i % gemColors.length];
      const gem = new THREE.Mesh(g.rainbowGem, m[clr]);
      gem.position.set(gx, gy, gz);
      gem.lookAt(gx * 2, gy * 2, gz * 2);
      core.add(gem);
    }

    const halo = new THREE.Mesh(g.rainbowHalo, m.rainbowRing);
    halo.name = 'spinRing';
    visual.add(halo);
    return root;
  }

  if (special === 'bomb') {
    const bomb = new THREE.Mesh(g.bombSphere, m.bombCore);
    const colorBand = new THREE.Mesh(g.stripeBand, m[color]);
    bomb.add(colorBand);

    const ventDirs: Array<[number, number, number]> = [
      [0, 0, 0.36],
      [0, 0.36, 0],
      [0, -0.36, 0],
      [0.36, 0, 0],
      [-0.36, 0, 0],
    ];
    for (const [vx, vy, vz] of ventDirs) {
      const vent = new THREE.Mesh(g.bombVent, m.bombEnergy);
      vent.position.set(vx, vy, vz);
      vent.lookAt(vx * 2, gyOrZero(vy), vz * 2);
      vent.rotateX(Math.PI * 0.5);
      bomb.add(vent);
    }

    const halo = new THREE.Mesh(g.rainbowHalo, m.bombEnergy);
    halo.name = 'spinRing';
    visual.add(bomb, halo);
    return root;
  }

  const baseCandy = buildBaseCandySculpture(color);
  visual.add(baseCandy);

  if (special === 'striped_h' || special === 'striped_v') {
    const stripeGroup = new THREE.Group();
    for (const offset of [-0.14, 0, 0.14]) {
      const band = new THREE.Mesh(g.stripeBand, m.stripeGlow);
      band.scale.setScalar(offset === 0 ? 1.04 : 0.88);
      if (special === 'striped_h') {
        band.rotation.x = Math.PI * 0.5;
        band.position.y = offset;
      } else {
        band.rotation.y = Math.PI * 0.5;
        band.position.x = offset;
      }
      stripeGroup.add(band);
    }
    visual.add(stripeGroup);
  }

  if (special === 'wrapped') {
    const shell = new THREE.Mesh(g.wrapperBox, m.wrapperShell);
    const leftBow = new THREE.Mesh(g.wrapperFlute, m.wrapperShell);
    leftBow.rotation.z = Math.PI * 0.5;
    leftBow.position.set(-0.47, 0, 0);

    const rightBow = new THREE.Mesh(g.wrapperFlute, m.wrapperShell);
    rightBow.rotation.z = -Math.PI * 0.5;
    rightBow.position.set(0.47, 0, 0);

    visual.add(shell, leftBow, rightBow);
  }

  return root;
}

function gyOrZero(v: number) {
  return v * 2;
}

export function createBlockerMesh3D(blocker: BlockerType): THREE.Group | null {
  if (blocker === 'none') return null;
  const g = getGeos();
  const m = getMats();
  const group = new THREE.Group();

  if (blocker === 'crate_1' || blocker === 'crate_2') {
    const mainMat = blocker === 'crate_2' ? m.crate2 : m.crate1;
    const box = new THREE.Mesh(g.crateBox, mainMat);
    box.castShadow = true;
    box.receiveShadow = true;
    group.add(box);

    const p1 = new THREE.Mesh(g.cratePlank, m.crate1Trim);
    p1.rotation.z = Math.PI * 0.25;
    const p2 = new THREE.Mesh(g.cratePlank, m.crate1Trim);
    p2.rotation.z = -Math.PI * 0.25;
    group.add(p1, p2);

    if (blocker === 'crate_2') {
      for (const sx of [-0.32, 0.32]) {
        for (const sy of [-0.32, 0.32]) {
          const rivet = new THREE.Mesh(g.strawberrySeed, m.iron);
          rivet.scale.setScalar(2.6);
          rivet.position.set(sx, sy, 0.21);
          group.add(rivet);
        }
      }
    }
    return group;
  }

  if (blocker === 'ice_1' || blocker === 'ice_2') {
    const ice = new THREE.Mesh(g.iceBox, blocker === 'ice_2' ? m.ice2 : m.ice1);
    ice.position.z = 0.14;
    group.add(ice);
    return group;
  }

  if (blocker === 'chain') {
    // Realistic interlocking 3D steel chain links + gleaming brass padlock!
    const offsets = [-0.28, -0.1, 0.1, 0.28];
    for (let i = 0; i < offsets.length; i++) {
      const d = offsets[i];
      const linkA = new THREE.Mesh(g.chainLink, m.iron);
      linkA.position.set(d, d, 0.35);
      linkA.rotation.z = Math.PI * 0.25;
      linkA.rotation.x = i % 2 === 0 ? 0.45 : -0.45;

      const linkB = new THREE.Mesh(g.chainLink, m.iron);
      linkB.position.set(d, -d, 0.35);
      linkB.rotation.z = -Math.PI * 0.25;
      linkB.rotation.x = i % 2 === 0 ? -0.45 : 0.45;
      group.add(linkA, linkB);
    }

    const lock = new THREE.Mesh(g.keyBit, m.gold);
    lock.scale.set(1.9, 3.3, 2.4);
    lock.position.set(0, -0.02, 0.45);
    group.add(lock);
    return group;
  }

  if (blocker === 'slime') {
    const slime = new THREE.Mesh(g.slimeDome, m.slime);
    slime.scale.set(1.02, 1.02, 0.66);
    slime.position.z = 0.18;
    // Internal suspended 3D air bubbles inside translucent slime!
    for (const [bx, by, bz] of [[-0.16, 0.14, 0.12], [0.18, -0.1, 0.15], [0.04, 0.2, 0.1]]) {
      const bub = new THREE.Mesh(g.dewDrop, m.waterDrop);
      bub.position.set(bx, by, bz);
      slime.add(bub);
    }
    group.add(slime);
    return group;
  }

  return null;
}

export function createHintHand3D(): THREE.Group {
  const root = new THREE.Group();

  const gloveMat = new THREE.MeshPhysicalMaterial({
    color: 0xfff8f2,
    emissive: 0x3b2219,
    roughness: 0.16,
    clearcoat: 0.9,
  });
  const cuffMat = new THREE.MeshPhysicalMaterial({
    color: 0xff3b7f,
    roughness: 0.18,
    clearcoat: 0.95,
  });

  const body = new THREE.Group();
  body.rotation.z = 0.38;
  body.rotation.x = -0.22;

  const palm = new THREE.Mesh(new THREE.SphereGeometry(0.24, 18, 16), gloveMat);
  palm.scale.set(1.05, 1.1, 0.65);
  body.add(palm);

  const indexFinger = new THREE.Mesh(new THREE.CapsuleGeometry(0.075, 0.28, 8, 12), gloveMat);
  indexFinger.position.set(-0.06, 0.28, 0.04);
  body.add(indexFinger);

  const thumb = new THREE.Mesh(new THREE.CapsuleGeometry(0.068, 0.14, 8, 10), gloveMat);
  thumb.position.set(-0.22, 0.04, 0.05);
  thumb.rotation.z = 0.55;
  body.add(thumb);

  const cuff = new THREE.Mesh(new THREE.TorusGeometry(0.19, 0.055, 10, 20), cuffMat);
  cuff.rotation.x = Math.PI * 0.5;
  cuff.position.set(0.02, -0.22, 0);
  body.add(cuff);

  root.add(body);
  return root;
}
