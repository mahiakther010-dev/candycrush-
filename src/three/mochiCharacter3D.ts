import * as THREE from 'three';
import { LoopSubdivision } from 'three-subdivide';
import { GameStatus } from '../types/game';
import { getCharacterTextures } from './characterTextures3D';

export interface MochiRig3D {
  root: THREE.Group;
  bodyPivot: THREE.Group;
  headGroup: THREE.Group;
  leftEar: THREE.Group;
  rightEar: THREE.Group;
  hairBangs: THREE.Group;
  leftTwinTail: THREE.Group;
  rightTwinTail: THREE.Group;
  leftArm: THREE.Group;
  leftForearm: THREE.Group;
  rightArm: THREE.Group;
  rightForearm: THREE.Group;
  leftLeg: THREE.Group;
  leftShin: THREE.Group;
  rightLeg: THREE.Group;
  rightShin: THREE.Group;
  skirtGroup: THREE.Group;
  capeMesh: THREE.Mesh;
  leftEyeOpen: THREE.Group;
  rightEyeOpen: THREE.Group;
  leftIrisMesh: THREE.Mesh;
  rightIrisMesh: THREE.Mesh;
  leftEyelid: THREE.Mesh;
  rightEyelid: THREE.Mesh;
  leftHappyArc: THREE.Mesh;
  rightHappyArc: THREE.Mesh;
  leftBrow: THREE.Mesh;
  rightBrow: THREE.Mesh;
  mouthSmile: THREE.Group;
  mouthSurprised: THREE.Mesh;
  mouthSad: THREE.Mesh;
  sweatDrop: THREE.Mesh;
  leftTear: THREE.Mesh;
  rightTear: THREE.Mesh;
  shadow: THREE.Mesh;
}

export interface MochiAnimParams {
  time: number;
  danger: number; // 0..100
  status: GameStatus;
  happyTimer: number;
  surprisedTimer: number;
  isMoving?: boolean;
  poseOverride?: 'idle' | 'panic' | 'run' | 'victory';
}

/**
 * Builds a Subdivision-Smoothed Pixar/Anime Chibi Head Mesh:
 * Rounded cranium, soft indented eye sockets, plump lower cheeks, delicate tapered chin,
 * and a cute sculpted 3D button nose contour.
 */
function buildSculptedAnimeHeadGeometry(): THREE.BufferGeometry {
  const base = new THREE.SphereGeometry(0.41, 24, 20);
  const pos = base.attributes.position;
  const v = new THREE.Vector3();

  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const ny = v.y / 0.41; // -1..1
    const nx = v.x / 0.41;
    const nz = v.z / 0.41;

    // 1. Cranium width & soft anime baby-cheeks
    let widthScale = 1.07;
    if (ny < 0.05 && ny > -0.58 && nz > 0) {
      // Plump lower cheeks
      const cheekFactor = Math.exp(-Math.pow((ny + 0.22) * 3.2, 2)) * Math.max(0, nz);
      widthScale += cheekFactor * 0.14;
      v.z += cheekFactor * 0.032;
    }

    // 2. Delicate tapered chin at bottom
    if (ny < -0.35) {
      const chinT = Math.min(1, (-ny - 0.35) / 0.65);
      widthScale *= 1 - chinT * 0.34;
      v.z += chinT * 0.035 * Math.max(0, nz + 0.3);
      v.y += chinT * 0.028;
    }

    v.x *= widthScale;
    v.z *= 0.96;

    // 3. Gentle eye-socket concavity on front face so 3D eyes sit naturally inside sockets
    if (nz > 0.45) {
      for (const sx of [-0.42, 0.42]) {
        const dx = nx - sx;
        const dy = ny + 0.04;
        const d2 = dx * dx + dy * dy * 1.3;
        if (d2 < 0.14) {
          v.z -= (0.14 - d2) * 0.22;
        }
      }

      // 4. Cute sculpted anime button nose ridge at center
      const noseDx = nx;
      const noseDy = ny + 0.16;
      const noseD2 = noseDx * noseDx * 2.5 + noseDy * noseDy * 3.2;
      if (noseD2 < 0.055) {
        v.z += (0.055 - noseD2) * 0.85;
      }
    }

    pos.setXYZ(i, v.x, v.y, v.z);
  }

  base.computeVertexNormals();
  return LoopSubdivision.modify(base, 1, { split: false, uvSmooth: true });
}

/**
 * Builds a tapered, curved 3D hair lock along a CatmullRomCurve3.
 */
function buildTaperedHairLockGeometry(
  points: THREE.Vector3[],
  baseRadius: number,
  tubularSegments = 22,
  radialSegments = 10
): THREE.BufferGeometry {
  const curve = new THREE.CatmullRomCurve3(points);
  const geo = new THREE.TubeGeometry(curve, tubularSegments, baseRadius, radialSegments, false);
  const pos = geo.attributes.position;
  const ringSize = radialSegments + 1;

  for (let i = 0; i <= tubularSegments; i++) {
    const t = i / tubularSegments;
    const center = curve.getPointAt(t);
    // Swell slightly in middle, taper to a fine silky point at tip (t=1) and root (t=0)
    const taper =
      Math.sin(Math.min(1, t * 2.8) * Math.PI * 0.5) * Math.pow(1 - t, 0.72) * (1 + 0.18 * Math.sin(t * Math.PI));

    for (let j = 0; j < ringSize; j++) {
      const idx = i * ringSize + j;
      const vx = pos.getX(idx) - center.x;
      const vy = pos.getY(idx) - center.y;
      const vz = pos.getZ(idx) - center.z;
      // Slightly flatten hair strand cross-section into a silky ribbon
      pos.setXYZ(
        idx,
        center.x + vx * taper,
        center.y + vy * taper * 0.85,
        center.z + vz * taper * 0.78
      );
    }
  }

  geo.computeVertexNormals();
  return geo;
}

/**
 * Builds a Subdivision-Sculpted Laced Riding Boot!
 */
function buildSculptedBootGeometry(): THREE.BufferGeometry {
  const box = new THREE.BoxGeometry(0.18, 0.22, 0.28, 3, 3, 4);
  const pos = box.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i);
    let y = pos.getY(i);
    let z = pos.getZ(i);
    // Extend rounded toe forward at bottom
    if (y < 0 && z > 0) {
      z += 0.065 * (1 - Math.abs(x) / 0.12);
      y *= 0.88;
    }
    // Taper ankle slightly at top
    if (y > 0.04) {
      x *= 0.82;
      z *= 0.82;
    }
    pos.setXYZ(i, x, y, z);
  }
  box.computeVertexNormals();
  return LoopSubdivision.modify(box, 1, { split: false });
}

export function createMochiRig3D(): MochiRig3D {
  const root = new THREE.Group();
  const tex = getCharacterTextures();

  // Studio-grade Subsurface Porcelain-Peach Skin Material
  const skinMat = new THREE.MeshPhysicalMaterial({
    map: tex.mochiSkinTex,
    color: 0xffffff,
    emissive: 0x471e14,
    emissiveIntensity: 0.26,
    roughness: 0.34,
    metalness: 0.0,
    clearcoat: 0.18,
    clearcoatRoughness: 0.48,
    sheen: 0.45,
    sheenColor: new THREE.Color(0xffc8be),
    envMapIntensity: 1.25,
  });

  // Anisotropic Silky Strawberry-Chestnut to Rose Hair Material
  const hairMat = new THREE.MeshPhysicalMaterial({
    map: tex.mochiHairTex,
    normalMap: tex.mochiHairNormal,
    normalScale: new THREE.Vector2(0.32, 0.32),
    emissive: 0x3b0d20,
    emissiveIntensity: 0.24,
    roughness: 0.24,
    metalness: 0.06,
    clearcoat: 0.72,
    clearcoatRoughness: 0.22,
    sheen: 0.85,
    sheenColor: new THREE.Color(0xffd6e7),
    envMapIntensity: 1.65,
  });

  // Royal Embroidered Velvet Dress Material
  const dressMat = new THREE.MeshPhysicalMaterial({
    map: tex.mochiDressTex,
    emissive: 0x3b071b,
    emissiveIntensity: 0.24,
    roughness: 0.36,
    sheen: 0.92,
    sheenColor: new THREE.Color(0xffb8d0),
    clearcoat: 0.28,
    envMapIntensity: 1.4,
  });

  // Cream Satin Blouse & Stockings Material
  const satinCreamMat = new THREE.MeshPhysicalMaterial({
    color: 0xfff7f2,
    emissive: 0x331b24,
    emissiveIntensity: 0.2,
    roughness: 0.28,
    sheen: 0.8,
    sheenColor: new THREE.Color(0xffffff),
    clearcoat: 0.35,
  });

  // Royal Crimson-Berry Capelet & Ribbon Material
  const capeMat = new THREE.MeshPhysicalMaterial({
    color: 0xe11d58,
    emissive: 0x4c0519,
    emissiveIntensity: 0.28,
    roughness: 0.32,
    sheen: 0.95,
    sheenColor: new THREE.Color(0xffacc5),
    clearcoat: 0.35,
    side: THREE.DoubleSide,
  });

  // Polished 24k Gold Filigree & Buckles
  const goldMat = new THREE.MeshPhysicalMaterial({
    color: 0xffd447,
    emissive: 0x6e4700,
    emissiveIntensity: 0.55,
    roughness: 0.12,
    metalness: 0.92,
    clearcoat: 1.0,
    envMapIntensity: 2.1,
  });

  const rubyGemMat = new THREE.MeshPhysicalMaterial({
    color: 0xff1744,
    emissive: 0x990026,
    emissiveIntensity: 0.85,
    roughness: 0.04,
    clearcoat: 1.0,
    transmission: 0.45,
    ior: 1.54,
  });

  const bootLeatherMat = new THREE.MeshPhysicalMaterial({
    color: 0x9f1239,
    emissive: 0x2e0512,
    emissiveIntensity: 0.22,
    roughness: 0.22,
    clearcoat: 0.78,
    clearcoatRoughness: 0.18,
  });

  const bootSoleMat = new THREE.MeshStandardMaterial({
    color: 0x29151c,
    roughness: 0.65,
  });

  const lashMat = new THREE.MeshBasicMaterial({ color: 0x240b15 });
  const mouthCavityMat = new THREE.MeshBasicMaterial({ color: 0x7a0c2e });
  const tongueMat = new THREE.MeshPhysicalMaterial({
    color: 0xff7597,
    emissive: 0x4a0c1d,
    roughness: 0.25,
    clearcoat: 0.8,
  });
  const teethMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

  const eyeIrisMat = new THREE.MeshPhysicalMaterial({
    map: tex.mochiIrisTex,
    roughness: 0.03,
    clearcoat: 1.0,
    clearcoatRoughness: 0.01,
    ior: 1.38,
    envMapIntensity: 1.9,
  });

  const tearMat = new THREE.MeshPhysicalMaterial({
    color: 0x7dd3fc,
    emissive: 0x0369a1,
    emissiveIntensity: 0.35,
    roughness: 0.02,
    clearcoat: 1.0,
    transmission: 0.75,
    ior: 1.33,
  });

  // Soft Ground Contact Shadow
  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(0.54, 28),
    new THREE.MeshBasicMaterial({
      color: 0x040712,
      transparent: true,
      opacity: 0.46,
      depthWrite: false,
    })
  );
  shadow.rotation.x = -Math.PI * 0.5;
  shadow.position.y = -0.78;
  root.add(shadow);

  const bodyPivot = new THREE.Group();
  root.add(bodyPivot);

  // ================= 1. ARTICULATED LEGS, KNEES & LACED RIDING BOOTS =================
  const bootGeo = buildSculptedBootGeometry();
  const buildArticulatedLeg = (side: -1 | 1) => {
    const hipGroup = new THREE.Group();
    hipGroup.position.set(side * 0.135, -0.35, 0.01);

    // Upper thigh
    const thigh = new THREE.Mesh(new THREE.CapsuleGeometry(0.068, 0.13, 8, 14), skinMat);
    thigh.position.y = -0.08;
    hipGroup.add(thigh);

    // Knee & Stocking Shin Pivot
    const shinGroup = new THREE.Group();
    shinGroup.position.y = -0.17;
    hipGroup.add(shinGroup);

    const stocking = new THREE.Mesh(new THREE.CapsuleGeometry(0.06, 0.13, 8, 14), satinCreamMat);
    stocking.position.y = -0.07;
    shinGroup.add(stocking);

    // Ruffled boot cuff
    const bootCuff = new THREE.Mesh(new THREE.TorusGeometry(0.072, 0.026, 10, 18), satinCreamMat);
    bootCuff.rotation.x = Math.PI * 0.5;
    bootCuff.position.y = -0.13;
    shinGroup.add(bootCuff);

    // Sculpted Laced Berry-Leather Boot
    const boot = new THREE.Mesh(bootGeo, bootLeatherMat);
    boot.position.set(0, -0.21, 0.03);
    shinGroup.add(boot);

    // Boot Sole & Gold Buckle
    const sole = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.035, 0.27), bootSoleMat);
    sole.position.set(0, -0.295, 0.038);
    shinGroup.add(sole);

    const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.045, 0.025), goldMat);
    buckle.position.set(0, -0.19, 0.155);
    shinGroup.add(buckle);

    return { hipGroup, shinGroup };
  };

  const leftLegRig = buildArticulatedLeg(-1);
  const rightLegRig = buildArticulatedLeg(1);
  bodyPivot.add(leftLegRig.hipGroup, rightLegRig.hipGroup);

  // ================= 2. SCULPTED WAISTED BODICE, PLEATED SKIRT & CAPELET =================
  // Slender Neck
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.105, 0.16, 16), skinMat);
  neck.position.set(0, 0.05, 0.01);
  bodyPivot.add(neck);

  // Sculpted Lathe Corset Bodice (cinched waist + gentle chest contour)
  const bodicePts = [
    new THREE.Vector2(0.01, 0.04),
    new THREE.Vector2(0.14, 0.03),
    new THREE.Vector2(0.21, -0.06),
    new THREE.Vector2(0.175, -0.18), // Cinched waist!
    new THREE.Vector2(0.22, -0.26),
  ];
  const bodice = new THREE.Mesh(new THREE.LatheGeometry(bodicePts, 24), dressMat);
  bodice.scale.set(1.06, 1, 0.88);
  bodice.position.y = -0.01;
  bodyPivot.add(bodice);

  // White Satin Sweetheart Collar + Gold Waist Belt
  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.135, 0.034, 10, 22), satinCreamMat);
  collar.rotation.x = Math.PI * 0.52;
  collar.position.set(0, 0.0, 0.01);
  bodyPivot.add(collar);

  const waistBelt = new THREE.Mesh(new THREE.TorusGeometry(0.175, 0.024, 10, 24), goldMat);
  waistBelt.rotation.x = Math.PI * 0.5;
  waistBelt.scale.set(1.06, 0.88, 1);
  waistBelt.position.y = -0.19;
  bodyPivot.add(waistBelt);

  // Flared 16-Pleat Royal Skirt + Fluffy Petticoat Underskirt
  const skirtGroup = new THREE.Group();
  skirtGroup.position.y = -0.21;
  bodyPivot.add(skirtGroup);

  const petticoat = new THREE.Mesh(
    new THREE.CylinderGeometry(0.17, 0.36, 0.22, 24, 1, false),
    satinCreamMat
  );
  petticoat.position.y = -0.11;
  skirtGroup.add(petticoat);

  const outerSkirt = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.39, 0.23, 28, 2, true),
    dressMat
  );
  outerSkirt.position.y = -0.1;
  skirtGroup.add(outerSkirt);

  const pleatGeo = new THREE.CapsuleGeometry(0.042, 0.16, 6, 10);
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    const pleat = new THREE.Mesh(pleatGeo, dressMat);
    pleat.position.set(Math.cos(a) * 0.29, -0.1, Math.sin(a) * 0.27);
    pleat.rotation.z = Math.cos(a) * -0.38;
    pleat.rotation.x = Math.sin(a) * 0.38;
    skirtGroup.add(pleat);
  }

  // Flowing Royal Capelet + Faceted Ruby-Gold Brooch
  const capeMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.16, 0.41, 0.32, 24, 2, true, Math.PI * 0.68, Math.PI * 1.64),
    capeMat
  );
  capeMesh.position.set(0, -0.12, -0.03);
  bodyPivot.add(capeMesh);

  const broochFrame = new THREE.Mesh(new THREE.OctahedronGeometry(0.068, 0), goldMat);
  broochFrame.scale.set(1.1, 1.1, 0.55);
  broochFrame.position.set(0, -0.05, 0.195);
  const broochGem = new THREE.Mesh(new THREE.OctahedronGeometry(0.046, 1), rubyGemMat);
  broochGem.position.z = 0.025;
  broochFrame.add(broochGem);
  bodyPivot.add(broochFrame);

  // ================= 3. ARTICULATED ARMS, PUFF SLEEVES, FOREARMS & SCULPTED HANDS =================
  const buildArticulatedArm = (side: -1 | 1) => {
    const shoulderGroup = new THREE.Group();
    shoulderGroup.position.set(side * 0.205, -0.035, 0.01);

    // Royal Puff Sleeve
    const puff = new THREE.Mesh(new THREE.SphereGeometry(0.088, 16, 14), satinCreamMat);
    puff.scale.set(1.05, 1.12, 0.98);
    puff.position.set(side * 0.02, -0.02, 0);
    shoulderGroup.add(puff);

    const sleeveBand = new THREE.Mesh(new THREE.TorusGeometry(0.062, 0.015, 8, 16), goldMat);
    sleeveBand.rotation.x = Math.PI * 0.5;
    sleeveBand.rotation.y = side * 0.25;
    sleeveBand.position.set(side * 0.035, -0.085, 0);
    shoulderGroup.add(sleeveBand);

    // Upper Arm
    const upperArm = new THREE.Mesh(new THREE.CapsuleGeometry(0.048, 0.1, 8, 12), skinMat);
    upperArm.position.set(side * 0.045, -0.11, 0);
    upperArm.rotation.z = side * 0.22;
    shoulderGroup.add(upperArm);

    // Elbow & Forearm Pivot
    const forearmGroup = new THREE.Group();
    forearmGroup.position.set(side * 0.07, -0.18, 0.01);
    shoulderGroup.add(forearmGroup);

    const forearm = new THREE.Mesh(new THREE.CapsuleGeometry(0.044, 0.105, 8, 12), skinMat);
    forearm.position.set(side * 0.02, -0.065, 0.02);
    forearm.rotation.z = side * 0.12;
    forearmGroup.add(forearm);

    // Sculpted 3D Anime Hand (Palm + Fingers + Opposable Thumb!)
    const handGroup = new THREE.Group();
    handGroup.position.set(side * 0.035, -0.145, 0.035);
    forearmGroup.add(handGroup);

    const palm = new THREE.Mesh(new THREE.SphereGeometry(0.052, 14, 12), skinMat);
    palm.scale.set(0.95, 1.12, 0.68);
    handGroup.add(palm);

    const thumb = new THREE.Mesh(new THREE.CapsuleGeometry(0.018, 0.032, 6, 8), skinMat);
    thumb.position.set(-side * 0.042, 0.01, 0.022);
    thumb.rotation.z = side * 0.65;
    handGroup.add(thumb);

    for (let f = 0; f < 3; f++) {
      const finger = new THREE.Mesh(new THREE.CapsuleGeometry(0.015, 0.036, 6, 8), skinMat);
      finger.position.set((f - 1) * 0.024, -0.048, 0.01);
      handGroup.add(finger);
    }

    return { shoulderGroup, forearmGroup };
  };

  const leftArmRig = buildArticulatedArm(-1);
  const rightArmRig = buildArticulatedArm(1);
  bodyPivot.add(leftArmRig.shoulderGroup, rightArmRig.shoulderGroup);

  // ================= 4. SUBDIVISION-SCULPTED HEAD, PIXAR EYES & SILK TWIN-TAILS =================
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 0.36, 0.02);
  bodyPivot.add(headGroup);

  const headGeo = buildSculptedAnimeHeadGeometry();
  const headMesh = new THREE.Mesh(headGeo, skinMat);
  headGroup.add(headMesh);

  // Delicate Anime Ears on sides of head
  for (const side of [-1, 1] as const) {
    const humanEar = new THREE.Mesh(new THREE.SphereGeometry(0.072, 12, 10), skinMat);
    humanEar.scale.set(0.45, 0.95, 0.68);
    humanEar.position.set(side * 0.425, -0.04, -0.02);
    humanEar.rotation.y = side * -0.25;
    headGroup.add(humanEar);
  }

  // Iconic Cute Ribbon-Wrapped Hair Buns (kept as leftEar/rightEar for expressive droop/perk!)
  const makeHairBunRibbon = (side: -1 | 1) => {
    const bunG = new THREE.Group();
    bunG.position.set(side * 0.34, 0.32, -0.04);
    bunG.rotation.z = side * -0.32;

    const bun = new THREE.Mesh(new THREE.SphereGeometry(0.145, 20, 16), hairMat);
    bun.scale.set(1.06, 0.96, 0.96);
    bunG.add(bun);

    // Sculpted 3D Satin Ribbon Bow at base of bun
    const bowCenter = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 10), capeMat);
    bowCenter.position.set(0, -0.08, 0.09);
    bunG.add(bowCenter);

    for (const bSide of [-1, 1]) {
      const loop = new THREE.Mesh(new THREE.ConeGeometry(0.068, 0.13, 12), capeMat);
      loop.scale.set(1, 1, 0.52);
      loop.rotation.z = bSide * Math.PI * 0.46;
      loop.position.set(bSide * 0.065, -0.075, 0.085);
      bunG.add(loop);
    }

    const starPin = new THREE.Mesh(new THREE.OctahedronGeometry(0.038, 0), goldMat);
    starPin.position.set(0, -0.08, 0.135);
    bunG.add(starPin);

    return bunG;
  };
  const leftEar = makeHairBunRibbon(-1);
  const rightEar = makeHairBunRibbon(1);
  headGroup.add(leftEar, rightEar);

  // Voluminous Back Hair Crown
  const hairCrown = new THREE.Mesh(
    new THREE.SphereGeometry(0.445, 28, 22, 0, Math.PI * 2, 0, Math.PI * 0.66),
    hairMat
  );
  hairCrown.scale.set(1.09, 1.04, 1.03);
  hairCrown.rotation.x = -0.26;
  hairCrown.position.set(0, 0.03, -0.02);
  headGroup.add(hairCrown);

  // Sculpted Curved 3D Forehead Bangs (7 tapered TubeGeometry locks!)
  const hairBangs = new THREE.Group();
  headGroup.add(hairBangs);

  const bangSpecs: Array<{ xTop: number; xMid: number; xTip: number; yTip: number; zMid: number; r: number }> = [
    { xTop: 0.0, xMid: 0.01, xTip: 0.02, yTip: 0.05, zMid: 0.435, r: 0.078 },
    { xTop: -0.08, xMid: -0.13, xTip: -0.15, yTip: 0.07, zMid: 0.42, r: 0.074 },
    { xTop: 0.08, xMid: 0.13, xTip: 0.15, yTip: 0.07, zMid: 0.42, r: 0.074 },
    { xTop: -0.16, xMid: -0.25, xTip: -0.29, yTip: 0.04, zMid: 0.37, r: 0.068 },
    { xTop: 0.16, xMid: 0.25, xTip: 0.29, yTip: 0.04, zMid: 0.37, r: 0.068 },
    { xTop: -0.24, xMid: -0.35, xTip: -0.39, yTip: -0.14, zMid: 0.26, r: 0.065 }, // Cheek-framing lock!
    { xTop: 0.24, xMid: 0.35, xTip: 0.39, yTip: -0.14, zMid: 0.26, r: 0.065 },
  ];

  for (const bs of bangSpecs) {
    const lockGeo = buildTaperedHairLockGeometry(
      [
        new THREE.Vector3(bs.xTop * 0.6, 0.42, 0.14),
        new THREE.Vector3(bs.xMid, 0.25, bs.zMid),
        new THREE.Vector3(bs.xTip, bs.yTip, bs.zMid - 0.035),
      ],
      bs.r,
      18,
      10
    );
    const lockMesh = new THREE.Mesh(lockGeo, hairMat);
    hairBangs.add(lockMesh);
  }

  // Long Flowing Curled Twin-Tails!
  const buildTwinTail = (side: -1 | 1) => {
    const tailPivot = new THREE.Group();
    tailPivot.position.set(side * 0.36, 0.26, -0.06);

    const mainStrand = new THREE.Mesh(
      buildTaperedHairLockGeometry(
        [
          new THREE.Vector3(0, 0.04, 0),
          new THREE.Vector3(side * 0.16, -0.16, -0.04),
          new THREE.Vector3(side * 0.22, -0.44, 0.04),
          new THREE.Vector3(side * 0.12, -0.68, 0.1),
        ],
        0.115,
        24,
        12
      ),
      hairMat
    );
    const curlStrand = new THREE.Mesh(
      buildTaperedHairLockGeometry(
        [
          new THREE.Vector3(side * 0.02, 0.02, -0.03),
          new THREE.Vector3(side * 0.22, -0.22, -0.1),
          new THREE.Vector3(side * 0.16, -0.52, -0.05),
          new THREE.Vector3(side * 0.24, -0.72, 0.04),
        ],
        0.082,
        20,
        10
      ),
      hairMat
    );
    tailPivot.add(mainStrand, curlStrand);
    return tailPivot;
  };
  const leftTwinTail = buildTwinTail(-1);
  const rightTwinTail = buildTwinTail(1);
  headGroup.add(leftTwinTail, rightTwinTail);

  // ================= 5. DEEP 3D PIXAR/ANIME EYES, LASHES, BROWS & EXPRESSIVE MOUTHS =================
  const buildPixarEye = (side: -1 | 1) => {
    const eyeRoot = new THREE.Group();
    eyeRoot.position.set(side * 0.168, -0.02, 0.345);
    eyeRoot.rotation.y = side * 0.2;

    // 3D Curved Eyeball mapped with 512x512 Pixar Iris + Corneal Clearcoat
    const irisDome = new THREE.Mesh(
      new THREE.SphereGeometry(0.098, 24, 20, 0, Math.PI * 2, 0, Math.PI * 0.55),
      eyeIrisMat
    );
    irisDome.rotation.x = Math.PI * 0.5;
    irisDome.scale.set(0.94, 1.0, 0.52);
    eyeRoot.add(irisDome);

    // Sculpted Curved 3D Upper Eyelash Wing!
    const lashCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-side * 0.082, 0.042, 0.038),
      new THREE.Vector3(0, 0.092, 0.048),
      new THREE.Vector3(side * 0.092, 0.052, 0.036),
      new THREE.Vector3(side * 0.115, 0.068, 0.02),
    ]);
    const upperLash = new THREE.Mesh(new THREE.TubeGeometry(lashCurve, 14, 0.015, 8, false), lashMat);
    eyeRoot.add(upperLash);

    return { eyeRoot, irisDome };
  };

  const leftEyeBuilt = buildPixarEye(-1);
  const rightEyeBuilt = buildPixarEye(1);
  const leftEyeOpen = leftEyeBuilt.eyeRoot;
  const rightEyeOpen = rightEyeBuilt.eyeRoot;
  const leftIrisMesh = leftEyeBuilt.irisDome;
  const rightIrisMesh = rightEyeBuilt.irisDome;
  headGroup.add(leftEyeOpen, rightEyeOpen);

  // 3D Blinking Eyelids
  const makeEyelid = (side: -1 | 1) => {
    const lid = new THREE.Mesh(
      new THREE.SphereGeometry(0.102, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.52),
      skinMat
    );
    lid.rotation.x = Math.PI * 0.5;
    lid.scale.set(0.98, 0.55, 1.05);
    lid.position.set(side * 0.168, -0.02, 0.348);
    lid.rotation.y = side * 0.2;
    lid.visible = false;
    return lid;
  };
  const leftEyelid = makeEyelid(-1);
  const rightEyelid = makeEyelid(1);
  headGroup.add(leftEyelid, rightEyelid);

  // Happy Crescent Eye Arcs (^ ^)
  const makeHappyArc = (side: -1 | 1) => {
    const arc = new THREE.Mesh(
      new THREE.TorusGeometry(0.072, 0.015, 8, 18, Math.PI * 0.88),
      lashMat
    );
    arc.position.set(side * 0.168, -0.03, 0.388);
    arc.rotation.y = side * 0.2;
    arc.rotation.z = Math.PI * 0.06;
    arc.visible = false;
    return arc;
  };
  const leftHappyArc = makeHappyArc(-1);
  const rightHappyArc = makeHappyArc(1);
  headGroup.add(leftHappyArc, rightHappyArc);

  // Expressive 3D Eyebrows
  const browGeo = new THREE.CapsuleGeometry(0.013, 0.095, 6, 10);
  const leftBrow = new THREE.Mesh(browGeo, hairMat);
  leftBrow.rotation.z = Math.PI * 0.5;
  leftBrow.position.set(-0.168, 0.125, 0.385);

  const rightBrow = new THREE.Mesh(browGeo, hairMat);
  rightBrow.rotation.z = Math.PI * 0.5;
  rightBrow.position.set(0.168, 0.125, 0.385);
  headGroup.add(leftBrow, rightBrow);

  // Sculpted 3D Open Joyful Smile (Mouth Cavity + Cute Tongue + Upper Teeth!)
  const mouthSmile = new THREE.Group();
  mouthSmile.position.set(0, -0.175, 0.382);

  const smileCavity = new THREE.Mesh(
    new THREE.SphereGeometry(0.056, 14, 12, 0, Math.PI, 0, Math.PI),
    mouthCavityMat
  );
  smileCavity.scale.set(1.25, 0.88, 0.45);
  smileCavity.rotation.z = Math.PI;
  mouthSmile.add(smileCavity);

  const smileTongue = new THREE.Mesh(new THREE.SphereGeometry(0.034, 10, 8), tongueMat);
  smileTongue.scale.set(1.15, 0.65, 0.5);
  smileTongue.position.set(0, -0.022, 0.012);
  mouthSmile.add(smileTongue);

  const smileTeeth = new THREE.Mesh(new THREE.BoxGeometry(0.062, 0.014, 0.015), teethMat);
  smileTeeth.position.set(0, 0.006, 0.018);
  mouthSmile.add(smileTeeth);
  headGroup.add(mouthSmile);

  // Surprised / Panic 'O' Mouth
  const mouthSurprised = new THREE.Mesh(
    new THREE.TorusGeometry(0.042, 0.013, 10, 18),
    mouthCavityMat
  );
  mouthSurprised.scale.set(0.9, 1.18, 0.7);
  mouthSurprised.position.set(0, -0.19, 0.386);
  mouthSurprised.visible = false;
  headGroup.add(mouthSurprised);

  // Sad / Worried Mouth Arc
  const mouthSad = new THREE.Mesh(
    new THREE.TorusGeometry(0.048, 0.012, 8, 16, Math.PI * 0.85),
    lashMat
  );
  mouthSad.position.set(0, -0.225, 0.386);
  mouthSad.rotation.z = Math.PI * 0.08;
  mouthSad.visible = false;
  headGroup.add(mouthSad);

  // Panic Sweat Drop + Refractive 3D Tears
  const dropGeo = new THREE.ConeGeometry(0.036, 0.1, 12);
  const sweatDrop = new THREE.Mesh(dropGeo, tearMat);
  sweatDrop.position.set(0.34, 0.14, 0.28);
  sweatDrop.rotation.z = -0.24;
  sweatDrop.visible = false;
  headGroup.add(sweatDrop);

  const tearGeo = new THREE.SphereGeometry(0.03, 12, 10);
  tearGeo.scale(0.85, 1.35, 0.85);
  const leftTear = new THREE.Mesh(tearGeo, tearMat);
  leftTear.position.set(-0.22, -0.1, 0.39);
  leftTear.visible = false;

  const rightTear = new THREE.Mesh(tearGeo, tearMat);
  rightTear.position.set(0.22, -0.1, 0.39);
  rightTear.visible = false;
  headGroup.add(leftTear, rightTear);

  root.traverse((obj) => {
    if ((obj as THREE.Mesh).isMesh && obj !== shadow) {
      obj.castShadow = true;
    }
  });

  return {
    root,
    bodyPivot,
    headGroup,
    leftEar,
    rightEar,
    hairBangs,
    leftTwinTail,
    rightTwinTail,
    leftArm: leftArmRig.shoulderGroup,
    leftForearm: leftArmRig.forearmGroup,
    rightArm: rightArmRig.shoulderGroup,
    rightForearm: rightArmRig.forearmGroup,
    leftLeg: leftLegRig.hipGroup,
    leftShin: leftLegRig.shinGroup,
    rightLeg: rightLegRig.hipGroup,
    rightShin: rightLegRig.shinGroup,
    skirtGroup,
    capeMesh,
    leftEyeOpen,
    rightEyeOpen,
    leftIrisMesh,
    rightIrisMesh,
    leftEyelid,
    rightEyelid,
    leftHappyArc,
    rightHappyArc,
    leftBrow,
    rightBrow,
    mouthSmile,
    mouthSurprised,
    mouthSad,
    sweatDrop,
    leftTear,
    rightTear,
    shadow,
  };
}

export function updateMochiRigAnimation(rig: MochiRig3D, p: MochiAnimParams) {
  const { time, danger, status, happyTimer, surprisedTimer } = p;
  const pose = p.poseOverride;

  const isVictory =
    pose === 'victory' || status === 'won' || status === 'rescuing' || happyTimer > 0;
  const isLost = status === 'lost';
  const isRunning = pose === 'run' || Boolean(p.isMoving) || status === 'rescuing';
  const isPanicked =
    pose === 'panic' || (!isVictory && (danger >= 58 || surprisedTimer > 0 || isLost));
  const isWorried = !isVictory && !isPanicked && danger >= 32;

  // Periodic natural blink every 3.4s
  const blinkCycle = time % 3.4;
  const isBlinking = !isVictory && !isPanicked && blinkCycle > 3.24;

  // 1. Body Bounce, Tremble & Run Stride
  let bounceY = Math.sin(time * 3.1) * 0.032;
  let shiverX = 0;
  let leanX = 0;

  if (isVictory) {
    bounceY = Math.abs(Math.sin(time * 7.8)) * 0.14;
  } else if (isRunning) {
    bounceY = Math.abs(Math.sin(time * 13.0)) * 0.09;
    leanX = 0.14;
  } else if (isPanicked) {
    const tremor = Math.min(1, (Math.max(60, danger) - 50) / 50);
    shiverX = Math.sin(time * 42) * 0.026 * tremor;
    bounceY = Math.sin(time * 9.5) * 0.022;
  }

  rig.bodyPivot.position.set(shiverX, bounceY, 0);
  rig.bodyPivot.rotation.x = leanX;
  rig.shadow.scale.setScalar(1 - Math.max(0, bounceY) * 1.15);

  // 2. Head Tilt & Glance Toward Hazard When Panicked
  if (isVictory) {
    rig.headGroup.rotation.z = Math.sin(time * 5.8) * 0.11;
    rig.headGroup.rotation.y = Math.sin(time * 3.2) * 0.16;
    rig.headGroup.rotation.x = -0.06;
  } else if (isPanicked) {
    rig.headGroup.rotation.z = Math.sin(time * 16) * 0.065;
    rig.headGroup.rotation.y = Math.sin(time * 4.2) * 0.24;
    rig.headGroup.rotation.x = 0.06;
  } else {
    rig.headGroup.rotation.z = Math.sin(time * 2.1) * 0.045;
    rig.headGroup.rotation.y = Math.sin(time * 1.4) * 0.1;
    rig.headGroup.rotation.x = Math.sin(time * 1.8) * 0.03;
  }

  // 3. Hair Buns & Flowing Silk Twin-Tail Physics!
  const bunDroop = isPanicked || isLost ? 0.18 : isWorried ? 0.08 : 0;
  rig.leftEar.rotation.z = 0.32 + bunDroop + Math.sin(time * 4.2) * 0.05;
  rig.rightEar.rotation.z = -0.32 - bunDroop - Math.sin(time * 4.2) * 0.05;

  const tailSwing = isRunning ? Math.sin(time * 13) * 0.28 : Math.sin(time * 3.4) * 0.11;
  const tailFlare = isVictory ? 0.24 + Math.abs(Math.sin(time * 7.8)) * 0.18 : 0.08;
  rig.leftTwinTail.rotation.z = -tailFlare + tailSwing * 0.5;
  rig.rightTwinTail.rotation.z = tailFlare + tailSwing * 0.5;
  rig.leftTwinTail.rotation.x = isRunning ? 0.32 : Math.sin(time * 2.8) * 0.08;
  rig.rightTwinTail.rotation.x = isRunning ? 0.32 : Math.cos(time * 2.8) * 0.08;

  // 4. Two-Joint Articulated Arm Poses (Hands to cheeks in panic, Cheer on victory, Pump on run!)
  if (isVictory) {
    rig.leftArm.rotation.set(-0.35, 0, -2.15 + Math.sin(time * 10) * 0.25);
    rig.leftForearm.rotation.set(-0.35, 0, -0.3);
    rig.rightArm.rotation.set(-0.35, 0, 2.15 - Math.sin(time * 10) * 0.25);
    rig.rightForearm.rotation.set(-0.35, 0, 0.3);
  } else if (isRunning) {
    const swing = Math.sin(time * 13) * 0.85;
    rig.leftArm.rotation.set(swing, 0, -0.25);
    rig.leftForearm.rotation.set(-0.85, 0, 0);
    rig.rightArm.rotation.set(-swing, 0, 0.25);
    rig.rightForearm.rotation.set(-0.85, 0, 0);
  } else if (isPanicked) {
    // Hands raised adorably toward cheeks in survival panic!
    const trem = Math.sin(time * 28) * 0.08;
    rig.leftArm.rotation.set(-1.15, 0.35, -0.55 + trem);
    rig.leftForearm.rotation.set(-1.25, 0, 0.55);
    rig.rightArm.rotation.set(-1.15, -0.35, 0.55 - trem);
    rig.rightForearm.rotation.set(-1.25, 0, -0.55);
  } else {
    rig.leftArm.rotation.set(Math.sin(time * 2.4) * 0.08, 0, -0.18 - Math.sin(time * 2.6) * 0.06);
    rig.leftForearm.rotation.set(-0.28, 0, 0.1);
    rig.rightArm.rotation.set(-Math.sin(time * 2.4) * 0.08, 0, 0.18 + Math.sin(time * 2.6) * 0.06);
    rig.rightForearm.rotation.set(-0.28, 0, -0.1);
  }

  // 5. Articulated Legs, Knees & Skirt Sway
  if (isRunning) {
    const stride = Math.sin(time * 13) * 0.72;
    rig.leftLeg.rotation.set(stride, 0, 0);
    rig.leftShin.rotation.set(Math.max(0, -stride * 0.85), 0, 0);
    rig.rightLeg.rotation.set(-stride, 0, 0);
    rig.rightShin.rotation.set(Math.max(0, stride * 0.85), 0, 0);
  } else if (isVictory) {
    const kick = Math.sin(time * 7.8) * 0.32;
    rig.leftLeg.rotation.set(kick, 0, -0.06);
    rig.leftShin.rotation.set(0.25, 0, 0);
    rig.rightLeg.rotation.set(-kick, 0, 0.06);
    rig.rightShin.rotation.set(0.25, 0, 0);
  } else if (isPanicked) {
    // Pigeon-toed trembling knees!
    rig.leftLeg.rotation.set(0.08, 0.15, 0.06);
    rig.leftShin.rotation.set(0.12, 0, 0);
    rig.rightLeg.rotation.set(0.08, -0.15, -0.06);
    rig.rightShin.rotation.set(0.12, 0, 0);
  } else {
    rig.leftLeg.rotation.set(0, 0, -0.03);
    rig.leftShin.rotation.set(0, 0, 0);
    rig.rightLeg.rotation.set(0, 0, 0.03);
    rig.rightShin.rotation.set(0, 0, 0);
  }

  rig.skirtGroup.rotation.z = Math.sin(time * 3.2) * 0.04;
  rig.capeMesh.rotation.x = isRunning ? 0.28 + Math.sin(time * 13) * 0.08 : 0.06 + Math.sin(time * 2.8) * 0.04;

  // 6. Facial Expressions (Pixar Eyes, Pupil Tremor, Brows, Mouths, Sweat & Tears)
  rig.leftHappyArc.visible = isVictory;
  rig.rightHappyArc.visible = isVictory;
  rig.leftEyelid.visible = !isVictory && isBlinking;
  rig.rightEyelid.visible = !isVictory && isBlinking;
  rig.leftEyeOpen.visible = !isVictory && !isBlinking;
  rig.rightEyeOpen.visible = !isVictory && !isBlinking;

  // Subtle iris shrink/tremble when monster is dangerously close!
  const eyeScale = isPanicked ? 0.92 + Math.sin(time * 35) * 0.03 : 1.0;
  rig.leftIrisMesh.scale.set(0.94 * eyeScale, 1.0 * eyeScale, 0.52);
  rig.rightIrisMesh.scale.set(0.94 * eyeScale, 1.0 * eyeScale, 0.52);

  if (isPanicked || isWorried) {
    rig.leftBrow.rotation.z = Math.PI * 0.5 - 0.34;
    rig.rightBrow.rotation.z = Math.PI * 0.5 + 0.34;
    rig.leftBrow.position.y = 0.145;
    rig.rightBrow.position.y = 0.145;
  } else {
    rig.leftBrow.rotation.z = Math.PI * 0.5 + 0.08;
    rig.rightBrow.rotation.z = Math.PI * 0.5 - 0.08;
    rig.leftBrow.position.y = 0.125;
    rig.rightBrow.position.y = 0.125;
  }

  rig.mouthSmile.visible = isVictory || (!isWorried && !isPanicked && !isLost);
  rig.mouthSurprised.visible = isPanicked && !isLost;
  rig.mouthSad.visible = isWorried || isLost;
  if (rig.mouthSurprised.visible) {
    rig.mouthSurprised.scale.set(
      0.9 + Math.sin(time * 18) * 0.12,
      1.18 + Math.cos(time * 18) * 0.15,
      0.7
    );
  }

  rig.sweatDrop.visible = (danger >= 45 || isPanicked) && !isVictory;
  if (rig.sweatDrop.visible) {
    rig.sweatDrop.position.y = 0.16 - ((time * 0.38) % 0.18);
  }

  const showTears = (danger >= 72 || isLost || pose === 'panic') && !isVictory;
  rig.leftTear.visible = showTears;
  rig.rightTear.visible = showTears;
  if (showTears) {
    const tearFall = (time * 0.32) % 0.14;
    rig.leftTear.position.y = -0.09 - tearFall;
    rig.rightTear.position.y = -0.09 - ((tearFall + 0.07) % 0.14);
  }
}
