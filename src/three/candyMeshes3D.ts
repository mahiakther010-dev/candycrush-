import * as THREE from 'three';
import { BlockerType, CandyColor, SpecialType } from '../types/game';

export const CANDY_HEX: Record<CandyColor, number> = {
  red: 0xff1e4d,
  blue: 0x0ea5e9,
  yellow: 0xfacc15,
  green: 0x22c55e,
  purple: 0xa855f7,
  orange: 0xf97316,
};

export const CANDY_EMISSIVE_HEX: Record<CandyColor, number> = {
  red: 0x520416,
  blue: 0x042f4a,
  yellow: 0x4d3800,
  green: 0x063b17,
  purple: 0x31095c,
  orange: 0x4f1c02,
};

interface GeometryLibrary {
  strawberryBody: THREE.BufferGeometry;
  strawberrySeed: THREE.BufferGeometry;
  leaf: THREE.BufferGeometry;
  crystalBody: THREE.BufferGeometry;
  crystalInner: THREE.BufferGeometry;
  lemonBody: THREE.BufferGeometry;
  appleBody: THREE.BufferGeometry;
  appleStem: THREE.BufferGeometry;
  grapeSphere: THREE.BufferGeometry;
  caramelBase: THREE.BufferGeometry;
  caramelSwirl: THREE.TorusGeometry;
  stripeBand: THREE.TorusGeometry;
  wrapperBox: THREE.BufferGeometry;
  wrapperFlute: THREE.CylinderGeometry;
  bombSphere: THREE.SphereGeometry;
  bombVent: THREE.CylinderGeometry;
  rainbowSphere: THREE.SphereGeometry;
  rainbowGem: THREE.OctahedronGeometry;
  rainbowHalo: THREE.TorusGeometry;
  keyRing: THREE.TorusGeometry;
  keyShaft: THREE.CylinderGeometry;
  keyBit: THREE.BoxGeometry;
  crateBox: THREE.BoxGeometry;
  cratePlank: THREE.BoxGeometry;
  iceBox: THREE.BoxGeometry;
  chainBar: THREE.CylinderGeometry;
  slimeDome: THREE.SphereGeometry;
  shadowDisc: THREE.CircleGeometry;
}

let cachedGeos: GeometryLibrary | null = null;
let cachedMats: Record<string, THREE.Material> | null = null;

function buildLatheStrawberry(): THREE.BufferGeometry {
  const pts: THREE.Vector2[] = [];
  const steps = 20;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps; // 0 bottom tip -> 1 top crown
    const y = (t - 0.48) * 0.78;
    // Plump tapered strawberry profile: narrow bottom tip, wide upper shoulder
    const r =
      Math.sin(t * Math.PI) *
      (0.24 + 0.21 * Math.pow(t, 0.75)) *
      (t > 0.88 ? 1 - (t - 0.88) * 1.4 : 1);
    pts.push(new THREE.Vector2(Math.max(0.001, r), y));
  }
  const geo = new THREE.LatheGeometry(pts, 28);
  geo.computeVertexNormals();
  return geo;
}

function buildLatheLemon(): THREE.BufferGeometry {
  const pts: THREE.Vector2[] = [];
  const steps = 22;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const u = t * 2 - 1; // -1..1
    const y = u * 0.43;
    // Signature citrus lemon silhouette with cute nipple tips at both poles
    const base = Math.sqrt(Math.max(0, 1 - u * u)) * 0.34;
    const tipBoost = Math.exp(-Math.pow((Math.abs(u) - 0.86) * 7, 2)) * 0.045;
    pts.push(new THREE.Vector2(Math.max(0.002, base + tipBoost), y));
  }
  const geo = new THREE.LatheGeometry(pts, 26);
  geo.rotateZ(0.45);
  geo.computeVertexNormals();
  return geo;
}

function buildLatheApple(): THREE.BufferGeometry {
  const pts: THREE.Vector2[] = [];
  const steps = 22;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const ang = t * Math.PI; // 0 bottom -> PI top
    const sinA = Math.sin(ang);
    const cosA = Math.cos(ang);
    // Dimpled apple crown and base
    const r = 0.02 + sinA * (0.37 + 0.06 * Math.sin(ang * 0.85));
    const dimple = Math.pow(Math.abs(cosA), 6) * 0.085;
    const y = -cosA * 0.36 + (cosA > 0 ? dimple : -dimple * 1.2);
    pts.push(new THREE.Vector2(r, y));
  }
  const geo = new THREE.LatheGeometry(pts, 28);
  geo.computeVertexNormals();
  return geo;
}

function buildCaramelCushion(): THREE.BufferGeometry {
  const pts: THREE.Vector2[] = [];
  const steps = 18;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const ang = t * Math.PI;
    const r = Math.sin(ang) * 0.39;
    const y = -Math.cos(ang) * 0.25;
    pts.push(new THREE.Vector2(Math.max(0.002, r), y));
  }
  const geo = new THREE.LatheGeometry(pts, 28);
  geo.rotateX(Math.PI * 0.35);
  geo.computeVertexNormals();
  return geo;
}

function getGeos(): GeometryLibrary {
  if (cachedGeos) return cachedGeos;

  const crystalBody = new THREE.OctahedronGeometry(0.41, 1);
  crystalBody.scale(0.88, 1.08, 0.72);
  crystalBody.computeVertexNormals();

  const crystalInner = new THREE.OctahedronGeometry(0.24, 0);
  crystalInner.scale(0.85, 1.1, 0.7);

  const leaf = new THREE.SphereGeometry(0.11, 12, 8);
  leaf.scale(1.35, 0.28, 0.65);

  const wrapperBox = new THREE.SphereGeometry(0.44, 20, 16);
  wrapperBox.scale(1.06, 0.96, 0.78);

  cachedGeos = {
    strawberryBody: buildLatheStrawberry(),
    strawberrySeed: new THREE.SphereGeometry(0.024, 6, 6),
    leaf,
    crystalBody,
    crystalInner,
    lemonBody: buildLatheLemon(),
    appleBody: buildLatheApple(),
    appleStem: new THREE.CylinderGeometry(0.022, 0.032, 0.15, 8),
    grapeSphere: new THREE.SphereGeometry(0.165, 16, 14),
    caramelBase: buildCaramelCushion(),
    caramelSwirl: new THREE.TorusGeometry(0.17, 0.042, 12, 26, Math.PI * 1.75),
    stripeBand: new THREE.TorusGeometry(0.37, 0.046, 10, 28),
    wrapperBox,
    wrapperFlute: new THREE.CylinderGeometry(0.06, 0.22, 0.22, 12, 1, false),
    bombSphere: new THREE.SphereGeometry(0.38, 24, 20),
    bombVent: new THREE.CylinderGeometry(0.08, 0.08, 0.08, 12),
    rainbowSphere: new THREE.SphereGeometry(0.39, 26, 22),
    rainbowGem: new THREE.OctahedronGeometry(0.088, 0),
    rainbowHalo: new THREE.TorusGeometry(0.46, 0.024, 10, 36),
    keyRing: new THREE.TorusGeometry(0.16, 0.052, 12, 24),
    keyShaft: new THREE.CylinderGeometry(0.045, 0.045, 0.44, 12),
    keyBit: new THREE.BoxGeometry(0.13, 0.055, 0.05),
    crateBox: new THREE.BoxGeometry(0.86, 0.86, 0.36),
    cratePlank: new THREE.BoxGeometry(0.88, 0.13, 0.4),
    iceBox: new THREE.BoxGeometry(0.88, 0.88, 0.56),
    chainBar: new THREE.CylinderGeometry(0.045, 0.045, 0.96, 10),
    slimeDome: new THREE.SphereGeometry(0.45, 20, 16),
    shadowDisc: new THREE.CircleGeometry(0.39, 20),
  };

  return cachedGeos;
}

function getMats(): Record<string, THREE.Material> {
  if (cachedMats) return cachedMats;

  cachedMats = {
    red: new THREE.MeshPhysicalMaterial({
      color: 0xff1744,
      emissive: 0x4a0313,
      roughness: 0.1,
      metalness: 0.04,
      clearcoat: 1.0,
      clearcoatRoughness: 0.06,
      reflectivity: 1.0,
    }),
    blue: new THREE.MeshPhysicalMaterial({
      color: 0x00a8ff,
      emissive: 0x053769,
      roughness: 0.05,
      metalness: 0.08,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      transmission: 0.25,
      thickness: 0.8,
      ior: 1.52,
    }),
    blueCore: new THREE.MeshBasicMaterial({
      color: 0xbaf0ff,
      transparent: true,
      opacity: 0.72,
    }),
    yellow: new THREE.MeshPhysicalMaterial({
      color: 0xffd000,
      emissive: 0x573b00,
      roughness: 0.11,
      metalness: 0.02,
      clearcoat: 1.0,
      clearcoatRoughness: 0.07,
    }),
    green: new THREE.MeshPhysicalMaterial({
      color: 0x25d336,
      emissive: 0x074011,
      roughness: 0.09,
      metalness: 0.03,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
    }),
    purple: new THREE.MeshPhysicalMaterial({
      color: 0xa838ff,
      emissive: 0x300659,
      roughness: 0.09,
      metalness: 0.05,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
    }),
    orange: new THREE.MeshPhysicalMaterial({
      color: 0xff7b0f,
      emissive: 0x541d00,
      roughness: 0.11,
      metalness: 0.04,
      clearcoat: 1.0,
      clearcoatRoughness: 0.06,
    }),
    creamSwirl: new THREE.MeshPhysicalMaterial({
      color: 0xfff3d6,
      emissive: 0x452b09,
      roughness: 0.14,
      clearcoat: 0.95,
    }),
    leaf: new THREE.MeshPhysicalMaterial({
      color: 0x38e048,
      emissive: 0x0a3d10,
      roughness: 0.18,
      clearcoat: 0.8,
    }),
    stem: new THREE.MeshStandardMaterial({
      color: 0x6b3e1b,
      roughness: 0.55,
    }),
    seed: new THREE.MeshStandardMaterial({
      color: 0xffe066,
      emissive: 0x594300,
      roughness: 0.25,
    }),
    stripeGlow: new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      emissive: 0xfff0b3,
      emissiveIntensity: 0.55,
      roughness: 0.1,
      clearcoat: 1.0,
    }),
    wrapperShell: new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      emissive: 0xffb3d9,
      emissiveIntensity: 0.22,
      transparent: true,
      opacity: 0.42,
      roughness: 0.04,
      clearcoat: 1.0,
      side: THREE.DoubleSide,
    }),
    bombCore: new THREE.MeshPhysicalMaterial({
      color: 0x261738,
      emissive: 0x450a29,
      roughness: 0.18,
      metalness: 0.72,
      clearcoat: 1.0,
    }),
    bombEnergy: new THREE.MeshBasicMaterial({
      color: 0xff5e1a,
    }),
    rainbowBody: new THREE.MeshPhysicalMaterial({
      color: 0x2e1527,
      emissive: 0x1c0824,
      roughness: 0.12,
      metalness: 0.35,
      clearcoat: 1.0,
    }),
    rainbowRing: new THREE.MeshBasicMaterial({
      color: 0xffe680,
      transparent: true,
      opacity: 0.82,
    }),
    gold: new THREE.MeshPhysicalMaterial({
      color: 0xffcf33,
      emissive: 0x5e3b00,
      roughness: 0.16,
      metalness: 0.85,
      clearcoat: 1.0,
    }),
    ruby: new THREE.MeshPhysicalMaterial({
      color: 0xff1744,
      emissive: 0x7a001e,
      roughness: 0.06,
      clearcoat: 1.0,
    }),
    crate1: new THREE.MeshStandardMaterial({
      color: 0xd98a2b,
      roughness: 0.42,
      metalness: 0.08,
    }),
    crate1Trim: new THREE.MeshStandardMaterial({
      color: 0x8f4d0e,
      roughness: 0.5,
    }),
    crate2: new THREE.MeshStandardMaterial({
      color: 0x8a4b19,
      roughness: 0.45,
      metalness: 0.18,
    }),
    iron: new THREE.MeshStandardMaterial({
      color: 0xd8e2ef,
      roughness: 0.25,
      metalness: 0.82,
    }),
    ice1: new THREE.MeshPhysicalMaterial({
      color: 0x9be7ff,
      emissive: 0x0d4f78,
      transparent: true,
      opacity: 0.45,
      roughness: 0.06,
      clearcoat: 1.0,
    }),
    ice2: new THREE.MeshPhysicalMaterial({
      color: 0x5ccdff,
      emissive: 0x083b66,
      transparent: true,
      opacity: 0.68,
      roughness: 0.08,
      clearcoat: 1.0,
    }),
    slime: new THREE.MeshPhysicalMaterial({
      color: 0x3ef068,
      emissive: 0x0c591f,
      transparent: true,
      opacity: 0.58,
      roughness: 0.08,
      clearcoat: 1.0,
    }),
    contactShadow: new THREE.MeshBasicMaterial({
      color: 0x060913,
      transparent: true,
      opacity: 0.36,
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
      // 1. Red Strawberry Candy
      const berry = new THREE.Mesh(g.strawberryBody, m.red);
      berry.rotation.z = -0.14;
      group.add(berry);

      // Tiny golden seeds around berry
      for (let i = 0; i < 8; i++) {
        const ang = (i / 8) * Math.PI * 2;
        const rowY = i % 2 === 0 ? 0.03 : -0.12;
        const rad = i % 2 === 0 ? 0.34 : 0.26;
        const seed = new THREE.Mesh(g.strawberrySeed, m.seed);
        seed.position.set(Math.cos(ang) * rad, rowY, Math.sin(ang) * rad);
        berry.add(seed);
      }

      // 4-leaf green crown calyx on top
      const crown = new THREE.Group();
      crown.position.set(0, 0.35, 0);
      for (let k = 0; k < 4; k++) {
        const lf = new THREE.Mesh(g.leaf, m.leaf);
        const a = (k / 4) * Math.PI * 2 + 0.4;
        lf.position.set(Math.cos(a) * 0.11, 0, Math.sin(a) * 0.11);
        lf.rotation.y = -a;
        lf.rotation.z = -0.25;
        crown.add(lf);
      }
      berry.add(crown);
      break;
    }

    case 'blue': {
      // 2. Blue Crystal Candy
      const gem = new THREE.Mesh(g.crystalBody, m.blue);
      gem.rotation.z = 0.15;
      const core = new THREE.Mesh(g.crystalInner, m.blueCore);
      gem.add(core);
      group.add(gem);
      break;
    }

    case 'yellow': {
      // 3. Yellow Lemon Candy
      const lemon = new THREE.Mesh(g.lemonBody, m.yellow);
      group.add(lemon);
      break;
    }

    case 'green': {
      // 4. Green Apple Candy
      const apple = new THREE.Mesh(g.appleBody, m.green);
      const stem = new THREE.Mesh(g.appleStem, m.stem);
      stem.position.set(0, 0.33, 0);
      stem.rotation.z = -0.2;
      apple.add(stem);

      const lf = new THREE.Mesh(g.leaf, m.leaf);
      lf.position.set(0.12, 0.34, 0.04);
      lf.rotation.z = 0.35;
      apple.add(lf);
      group.add(apple);
      break;
    }

    case 'purple': {
      // 5. Purple Grape Cluster Candy
      const bunch = new THREE.Group();
      const offsets: Array<[number, number, number]> = [
        [-0.14, 0.15, 0.05],
        [0.14, 0.15, 0.05],
        [0, 0.16, -0.12],
        [-0.15, -0.04, 0.09],
        [0.15, -0.04, 0.09],
        [0, -0.02, 0.18],
        [0, -0.22, 0.06],
      ];
      for (const [ox, oy, oz] of offsets) {
        const gp = new THREE.Mesh(g.grapeSphere, m.purple);
        gp.position.set(ox, oy, oz);
        bunch.add(gp);
      }
      const lf = new THREE.Mesh(g.leaf, m.leaf);
      lf.position.set(0.06, 0.31, 0.06);
      lf.rotation.z = 0.25;
      bunch.add(lf);
      bunch.rotation.z = -0.12;
      group.add(bunch);
      break;
    }

    case 'orange': {
      // 6. Orange Caramel Swirl Candy
      const pad = new THREE.Mesh(g.caramelBase, m.orange);
      const swirl = new THREE.Mesh(g.caramelSwirl, m.creamSwirl);
      swirl.position.set(0, 0.06, 0.16);
      swirl.rotation.x = -0.2;
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

  // Soft contact shadow disc slightly behind piece
  const shadow = new THREE.Mesh(g.shadowDisc, m.contactShadow);
  shadow.position.set(0.04, -0.08, -0.28);
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
    // Rainbow Color Bomb with reflective multi-colored crystal particles!
    const core = new THREE.Mesh(g.rainbowSphere, m.rainbowBody);
    visual.add(core);

    const gemColors: CandyColor[] = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];
    // Fibonacci sphere placement for 14 vivid gems
    const count = 14;
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 0.39;
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
    // Glowing Energy Bomb Candy
    const bomb = new THREE.Mesh(g.bombSphere, m.bombCore);
    // Colored candy accent ring so player also sees its color!
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
      vent.lookAt(vx * 2, vy * 2, vz * 2);
      vent.rotateX(Math.PI * 0.5);
      bomb.add(vent);
    }

    const halo = new THREE.Mesh(g.rainbowHalo, m.bombEnergy);
    halo.name = 'spinRing';
    visual.add(bomb, halo);
    return root;
  }

  // Base sculpted fruit/crystal candy
  const baseCandy = buildBaseCandySculpture(color);
  visual.add(baseCandy);

  // Add Striped directional glowing bands
  if (special === 'striped_h' || special === 'striped_v') {
    const stripeGroup = new THREE.Group();
    for (const offset of [-0.14, 0, 0.14]) {
      const band = new THREE.Mesh(g.stripeBand, m.stripeGlow);
      band.scale.setScalar(offset === 0 ? 1.03 : 0.88);
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

  // Add Wrapped 3D Translucent Cellophane Wrapper + Bow Flutes!
  if (special === 'wrapped') {
    const shell = new THREE.Mesh(g.wrapperBox, m.wrapperShell);
    const leftBow = new THREE.Mesh(g.wrapperFlute, m.wrapperShell);
    leftBow.rotation.z = Math.PI * 0.5;
    leftBow.position.set(-0.46, 0, 0);

    const rightBow = new THREE.Mesh(g.wrapperFlute, m.wrapperShell);
    rightBow.rotation.z = -Math.PI * 0.5;
    rightBow.position.set(0.46, 0, 0);

    visual.add(shell, leftBow, rightBow);
  }

  return root;
}

export function createBlockerMesh3D(blocker: BlockerType): THREE.Group | null {
  if (blocker === 'none') return null;
  const g = getGeos();
  const m = getMats();
  const group = new THREE.Group();

  if (blocker === 'crate_1' || blocker === 'crate_2') {
    const mainMat = blocker === 'crate_2' ? m.crate2 : m.crate1;
    const box = new THREE.Mesh(g.crateBox, mainMat);
    group.add(box);

    const p1 = new THREE.Mesh(g.cratePlank, m.crate1Trim);
    p1.rotation.z = Math.PI * 0.25;
    const p2 = new THREE.Mesh(g.cratePlank, m.crate1Trim);
    p2.rotation.z = -Math.PI * 0.25;
    group.add(p1, p2);

    if (blocker === 'crate_2') {
      for (const sx of [-0.33, 0.33]) {
        for (const sy of [-0.33, 0.33]) {
          const rivet = new THREE.Mesh(g.strawberrySeed, m.iron);
          rivet.scale.setScalar(2.4);
          rivet.position.set(sx, sy, 0.2);
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
    const c1 = new THREE.Mesh(g.chainBar, m.iron);
    c1.rotation.z = Math.PI * 0.25;
    c1.position.z = 0.35;
    const c2 = new THREE.Mesh(g.chainBar, m.iron);
    c2.rotation.z = -Math.PI * 0.25;
    c2.position.z = 0.35;

    const lock = new THREE.Mesh(g.keyBit, m.gold);
    lock.scale.set(1.8, 3.2, 2.2);
    lock.position.set(0, -0.02, 0.42);
    group.add(c1, c2, lock);
    return group;
  }

  if (blocker === 'slime') {
    const slime = new THREE.Mesh(g.slimeDome, m.slime);
    slime.scale.set(1.02, 1.02, 0.65);
    slime.position.z = 0.18;
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
    roughness: 0.18,
    clearcoat: 0.85,
  });
  const cuffMat = new THREE.MeshPhysicalMaterial({
    color: 0xff3b7f,
    roughness: 0.2,
    clearcoat: 0.9,
  });

  const body = new THREE.Group();
  body.rotation.z = 0.38;
  body.rotation.x = -0.22;

  const palm = new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 14), gloveMat);
  palm.scale.set(1.05, 1.1, 0.65);
  body.add(palm);

  const indexFinger = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.075, 0.28, 8, 12),
    gloveMat
  );
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
