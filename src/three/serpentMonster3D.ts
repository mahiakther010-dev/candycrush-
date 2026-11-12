import * as THREE from 'three';
import { LoopSubdivision } from 'three-subdivide';
import { getCharacterTextures, SerpentSkinVariant } from './characterTextures3D';
import { getProceduralPBRMaps } from './proceduralTextures3D';

export interface SerpentRig3D {
  root: THREE.Group;
  bodyMesh: THREE.Mesh;
  dorsalSpines: THREE.Mesh[];
  tailBlade: THREE.Group;
  headPivot: THREE.Group;
  upperJaw: THREE.Group;
  lowerJaw: THREE.Group;
  tongueGroup: THREE.Group;
  leftEye: THREE.Mesh;
  rightEye: THREE.Mesh;
  crownGroup: THREE.Group;
  scaleMat: THREE.MeshPhysicalMaterial;
  bellyMat: THREE.MeshPhysicalMaterial;
  spineRings: number;
  radialSegs: number;
  variant: SerpentSkinVariant;
}

export interface MagmaGolemRig3D {
  root: THREE.Group;
  torsoGroup: THREE.Group;
  headGroup: THREE.Group;
  jawMesh: THREE.Mesh;
  leftArm: THREE.Group;
  rightArm: THREE.Group;
  leftDrill: THREE.Group;
  rightDrill: THREE.Group;
  rockMat: THREE.MeshPhysicalMaterial;
}

export interface JuggernautBeastRig3D {
  root: THREE.Group;
  wheelBody: THREE.Group;
  headVisor: THREE.Group;
  armorMat: THREE.MeshPhysicalMaterial;
}

/**
 * Builds a Subdivision-Sculpted Organic Predatory Dragon / Viper Upper Skull!
 * Eliminates harsh BoxGeometry completely—smooth curved snout, flared nostrils,
 * swept cheek ridges, and wide venomous cranium.
 */
function buildSculptedDragonUpperSkull(): THREE.BufferGeometry {
  const box = new THREE.BoxGeometry(0.58, 0.3, 0.86, 4, 3, 5);
  const pos = box.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i);
    let y = pos.getY(i);
    let z = pos.getZ(i); // -0.43 (back cranium) .. +0.43 (snout tip)

    const tz = (z + 0.43) / 0.86; // 0 = back skull, 1 = snout tip
    // Taper snout toward front while flaring menacingly at temporal jaw muscles (tz ~ 0.25)
    const widthProfile =
      tz < 0.3
        ? 0.92 + Math.sin((tz / 0.3) * Math.PI * 0.5) * 0.26
        : 1.18 * (1 - (tz - 0.3) * 0.62);
    x *= widthProfile;

    // Predatory arched nasal bridge + hooked upper beak lip at front
    if (y > 0) {
      y *= 1.05 - tz * 0.38;
      // Flared nostril ridges near snout tip
      if (tz > 0.72 && Math.abs(x) > 0.08) {
        y += 0.035;
      }
    } else {
      // Concave upper palate curve
      y *= 0.65;
      if (tz > 0.85) y -= 0.028; // Hooked viper tip
    }

    pos.setXYZ(i, x, y, z + 0.14);
  }
  box.computeVertexNormals();
  return LoopSubdivision.modify(box, 2, { split: false, uvSmooth: true });
}

/**
 * Builds a Subdivision-Sculpted Curved Lower Reptile Mandible.
 */
function buildSculptedLowerMandible(): THREE.BufferGeometry {
  const box = new THREE.BoxGeometry(0.46, 0.14, 0.74, 3, 2, 4);
  const pos = box.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i);
    let y = pos.getY(i);
    const z = pos.getZ(i);
    const tz = (z + 0.37) / 0.74;
    x *= 1.08 * (1 - tz * 0.52);
    if (y < 0) {
      y *= 1.15 - tz * 0.45;
    }
    pos.setXYZ(i, x, y - 0.05, z + 0.2);
  }
  box.computeVertexNormals();
  return LoopSubdivision.modify(box, 2, { split: false, uvSmooth: true });
}

/**
 * Creates a Seamless Continuous Spine-Deformed 3D Naga-Viper / Sovereign Dragon!
 * Zero disconnected spheres—uses a 72-ring continuous tubular skin mesh with Cobra Hood,
 * ventral belly scutes, dorsal spine crest, and Subdivision-Sculpted Dragon Skull.
 */
export function createSerpentRig3D(
  _legacySegments: number = 22,
  isBoss: boolean = false,
  skinOverride?: SerpentSkinVariant
): SerpentRig3D {
  const root = new THREE.Group();
  const charTex = getCharacterTextures();
  const pbrMaps = getProceduralPBRMaps();

  const variant: SerpentSkinVariant =
    skinOverride ?? (isBoss ? 'boss_dragon' : 'venom_naga');

  const bodySkinTex = charTex.serpentSkins[variant].clone();
  bodySkinTex.wrapS = THREE.RepeatWrapping;
  bodySkinTex.wrapT = THREE.RepeatWrapping;
  bodySkinTex.repeat.set(1, 5.5);
  bodySkinTex.needsUpdate = true;

  const normalTex = pbrMaps.reptileScaleNormal;

  const scaleMat = new THREE.MeshPhysicalMaterial({
    map: bodySkinTex,
    color: 0xffffff,
    roughness: 0.18,
    metalness: 0.1,
    clearcoat: 0.95,
    clearcoatRoughness: 0.08,
    normalMap: normalTex,
    normalScale: new THREE.Vector2(0.75, 0.75),
    envMapIntensity: 1.35,
  });

  const headScaleMat = new THREE.MeshPhysicalMaterial({
    color:
      variant === 'boss_dragon'
        ? 0x7b2cbf
        : variant === 'frost_wyrm'
          ? 0x0096ff
          : variant === 'river_gharial'
            ? 0x00bfa5
            : 0x00c838,
    roughness: 0.18,
    metalness: 0.12,
    clearcoat: 0.95,
    clearcoatRoughness: 0.08,
    normalMap: normalTex,
    normalScale: new THREE.Vector2(0.7, 0.7),
    envMapIntensity: 1.35,
  });

  const bellyMat = new THREE.MeshPhysicalMaterial({
    color: variant === 'frost_wyrm' ? 0x72efdd : 0xffd60a,
    roughness: 0.22,
    clearcoat: 0.8,
  });

  // High-contrast vibrant horn & crest colors (Crimson-Gold / Coral-Orange / Sunny Gold)
  const hornMat = new THREE.MeshPhysicalMaterial({
    color:
      variant === 'boss_dragon'
        ? 0xffcc00
        : variant === 'frost_wyrm'
          ? 0xff9e00
          : variant === 'river_gharial'
            ? 0xff6d00
            : 0xff1744,
    roughness: 0.18,
    metalness: isBoss ? 0.8 : 0.25,
    clearcoat: 0.95,
  });

  const fangMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0.06,
    clearcoat: 1.0,
    envMapIntensity: 1.5,
  });

  const gumMat = new THREE.MeshPhysicalMaterial({
    color: 0xff0a54,
    roughness: 0.16,
    clearcoat: 0.9,
  });

  const eyeTex =
    variant === 'boss_dragon'
      ? charTex.reptileEyeBossTex
      : variant === 'frost_wyrm'
        ? charTex.reptileEyeIceTex
        : charTex.reptileEyeGoldTex;

  const eyeMat = new THREE.MeshPhysicalMaterial({
    map: eyeTex,
    roughness: 0.03,
    clearcoat: 1.0,
    envMapIntensity: 1.35,
  });

  const rubyMat = new THREE.MeshPhysicalMaterial({
    color: 0xff0044,
    roughness: 0.06,
    clearcoat: 1.0,
  });

  // ================= 1. CONTINUOUS SEAMLESS MUSCULAR SPINE TUBE MESH =================
  const spineRings = 72;
  const radialSegs = 24;
  const vertCount = (spineRings + 1) * (radialSegs + 1);
  const positions = new Float32Array(vertCount * 3);
  const normals = new Float32Array(vertCount * 3);
  const uvs = new Float32Array(vertCount * 2);
  const indices: number[] = [];

  for (let i = 0; i <= spineRings; i++) {
    const v = i / spineRings;
    for (let j = 0; j <= radialSegs; j++) {
      const u = j / radialSegs;
      const idx = i * (radialSegs + 1) + j;
      uvs[idx * 2] = u;
      uvs[idx * 2 + 1] = v;
    }
  }

  for (let i = 0; i < spineRings; i++) {
    for (let j = 0; j < radialSegs; j++) {
      const a = i * (radialSegs + 1) + j;
      const b = (i + 1) * (radialSegs + 1) + j;
      const c = (i + 1) * (radialSegs + 1) + (j + 1);
      const d = i * (radialSegs + 1) + (j + 1);
      indices.push(a, b, d, b, c, d);
    }
  }

  const bodyGeo = new THREE.BufferGeometry();
  bodyGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  bodyGeo.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
  bodyGeo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  bodyGeo.setIndex(indices);

  const bodyMesh = new THREE.Mesh(bodyGeo, scaleMat);
  bodyMesh.frustumCulled = false;
  bodyMesh.castShadow = true;
  bodyMesh.receiveShadow = true;
  root.add(bodyMesh);

  // Sculpted Dorsal Dragon Crest Spines riding seamlessly along the back
  const dorsalSpines: THREE.Mesh[] = [];
  const crestGeo = new THREE.ConeGeometry(0.058, 0.22, 6);
  crestGeo.rotateX(-Math.PI * 0.18);
  for (let s = 0; s < 16; s++) {
    const sp = new THREE.Mesh(crestGeo, hornMat);
    sp.castShadow = true;
    root.add(sp);
    dorsalSpines.push(sp);
  }

  // Sculpted Tail Rattle / Crystal Blade Tip!
  const tailBlade = new THREE.Group();
  const bladeMesh = new THREE.Mesh(new THREE.OctahedronGeometry(0.16, 0), hornMat);
  bladeMesh.scale.set(0.65, 0.45, 1.9);
  tailBlade.add(bladeMesh);
  root.add(tailBlade);

  // ================= 2. SUBDIVISION-SCULPTED PREDATORY DRAGON / VIPER SKULL =================
  const headPivot = new THREE.Group();
  if (isBoss) headPivot.scale.setScalar(1.22);
  root.add(headPivot);

  const upperJaw = new THREE.Group();
  headPivot.add(upperJaw);

  const upperSkullMesh = new THREE.Mesh(buildSculptedDragonUpperSkull(), headScaleMat);
  upperSkullMesh.position.y = 0.08;
  upperJaw.add(upperSkullMesh);

  // Upper Pink/Crimson Palate inside mouth
  const palate = new THREE.Mesh(new THREE.SphereGeometry(0.2, 14, 10), gumMat);
  palate.scale.set(0.95, 0.28, 1.55);
  palate.position.set(0, 0.01, 0.22);
  upperJaw.add(palate);

  // Blazing 3D Reptile Eyes + Swept Supraorbital Horn Brows + Temporal Cheek Spikes!
  const buildDragonEye = (side: -1 | 1) => {
    const eyeSphere = new THREE.Mesh(new THREE.SphereGeometry(0.105, 18, 16), eyeMat);
    eyeSphere.position.set(side * 0.235, 0.185, 0.16);
    eyeSphere.rotation.y = side * Math.PI * 0.36;

    // Fierce Armored Supraorbital Brow Horn
    const browCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(side * 0.14, 0.24, 0.3),
      new THREE.Vector3(side * 0.27, 0.28, 0.14),
      new THREE.Vector3(side * 0.34, 0.34, -0.18),
    ]);
    const browHorn = new THREE.Mesh(new THREE.TubeGeometry(browCurve, 14, 0.042, 8, false), hornMat);
    upperJaw.add(browHorn);

    // Swept Cheek Spike
    const cheekSpike = new THREE.Mesh(new THREE.ConeGeometry(0.048, 0.24, 8), hornMat);
    cheekSpike.rotation.x = -Math.PI * 0.45;
    cheekSpike.rotation.z = side * -0.45;
    cheekSpike.position.set(side * 0.31, 0.06, -0.14);
    upperJaw.add(cheekSpike);

    // Swept-back Sovereign Dragon Horns (larger on Boss, sleek on Naga)
    const hornCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(side * 0.18, 0.24, -0.06),
      new THREE.Vector3(side * 0.28, 0.38, -0.28),
      new THREE.Vector3(side * 0.22, 0.52, -0.56),
    ]);
    const mainHorn = new THREE.Mesh(
      new THREE.TubeGeometry(hornCurve, 16, isBoss ? 0.058 : 0.036, 8, false),
      hornMat
    );
    upperJaw.add(mainHorn);

    return eyeSphere;
  };
  const leftEye = buildDragonEye(-1);
  const rightEye = buildDragonEye(1);
  upperJaw.add(leftEye, rightEye);

  // Curved Conical Venom Fangs (2 long front + 4 rear teeth)
  const mainFangGeo = new THREE.ConeGeometry(0.038, 0.19, 10);
  const subToothGeo = new THREE.ConeGeometry(0.024, 0.095, 8);
  for (const side of [-1, 1]) {
    const fang = new THREE.Mesh(mainFangGeo, fangMat);
    fang.rotation.x = Math.PI - 0.22;
    fang.position.set(side * 0.15, -0.06, 0.44);
    upperJaw.add(fang);

    for (const tz of [0.18, 0.31]) {
      const tooth = new THREE.Mesh(subToothGeo, fangMat);
      tooth.rotation.x = Math.PI;
      tooth.position.set(side * 0.17, -0.035, tz);
      upperJaw.add(tooth);
    }
  }

  // Hinged Subdivided Lower Mandible + Flickering Forked 3D Tongue!
  const lowerJaw = new THREE.Group();
  lowerJaw.position.set(0, -0.02, -0.04);
  headPivot.add(lowerJaw);

  const lowerJawMesh = new THREE.Mesh(buildSculptedLowerMandible(), bellyMat);
  lowerJaw.add(lowerJawMesh);

  const lowerGum = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 10), gumMat);
  lowerGum.scale.set(0.9, 0.25, 1.5);
  lowerGum.position.set(0, -0.01, 0.22);
  lowerJaw.add(lowerGum);

  for (const side of [-1, 1]) {
    const lowTooth = new THREE.Mesh(subToothGeo, fangMat);
    lowTooth.position.set(side * 0.13, 0.035, 0.38);
    lowerJaw.add(lowTooth);
  }

  // Forked 3D Viper Tongue
  const tongueGroup = new THREE.Group();
  tongueGroup.position.set(0, 0.01, 0.36);
  lowerJaw.add(tongueGroup);

  const tongueStem = new THREE.Mesh(new THREE.CapsuleGeometry(0.018, 0.24, 6, 8), rubyMat);
  tongueStem.rotation.x = Math.PI * 0.5;
  tongueStem.position.z = 0.12;
  tongueGroup.add(tongueStem);

  for (const side of [-1, 1]) {
    const fork = new THREE.Mesh(new THREE.ConeGeometry(0.016, 0.14, 6), rubyMat);
    fork.rotation.x = Math.PI * 0.5;
    fork.rotation.y = side * 0.32;
    fork.position.set(side * 0.032, 0, 0.29);
    tongueGroup.add(fork);
  }

  // Sovereign Boss Crown
  const crownGroup = new THREE.Group();
  crownGroup.position.set(0, 0.28, -0.02);
  crownGroup.visible = isBoss;

  const crownBase = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.15, 0.13, 12), hornMat);
  crownGroup.add(crownBase);
  for (let k = 0; k < 5; k++) {
    const a = (k / 5) * Math.PI * 2;
    const spike = new THREE.Mesh(new THREE.ConeGeometry(0.048, 0.15, 8), hornMat);
    spike.position.set(Math.cos(a) * 0.15, 0.12, Math.sin(a) * 0.15);
    crownGroup.add(spike);
  }
  const crownGem = new THREE.Mesh(new THREE.OctahedronGeometry(0.065, 0), rubyMat);
  crownGem.position.set(0, 0.03, 0.17);
  crownGroup.add(crownGem);
  upperJaw.add(crownGroup);

  root.traverse((obj) => {
    if ((obj as THREE.Mesh).isMesh) {
      obj.castShadow = true;
    }
  });

  return {
    root,
    bodyMesh,
    dorsalSpines,
    tailBlade,
    headPivot,
    upperJaw,
    lowerJaw,
    tongueGroup,
    leftEye,
    rightEye,
    crownGroup,
    scaleMat,
    bellyMat,
    spineRings,
    radialSegs,
    variant,
  };
}

/**
 * Updates the Seamless Continuous Muscular Serpent Mesh + Flared Cobra Hood + Skull + Tongue
 * along any 3D CatmullRomCurve3 in real time!
 */
export function updateSerpentAlongCurve(
  rig: SerpentRig3D,
  curve: THREE.CatmullRomCurve3,
  progress01: number,
  time: number,
  isFrozen: boolean = false,
  isBoss: boolean = false,
  bodyArcFraction: number = 0.48
) {
  if (isFrozen) {
    rig.scaleMat.color.setHex(0x38bdf8);
  } else {
    rig.scaleMat.color.setHex(0xffffff);
  }
  rig.crownGroup.visible = isBoss;

  const headU = THREE.MathUtils.clamp(0.06 + progress01 * 0.92, 0.06, 0.99);
  const tailStartU = Math.max(0.004, headU - bodyArcFraction);
  const activeSpan = Math.max(0.02, headU - tailStartU);

  // 1. Orient Sculpted Dragon/Viper Skull at headU
  const headPos = curve.getPointAt(headU);
  const headTan = curve.getTangentAt(headU).normalize();
  const sideHead = new THREE.Vector3(-headTan.y, headTan.x, 0);
  if (sideHead.lengthSq() < 0.0001) sideHead.set(1, 0, 0);
  sideHead.normalize();

  const slitherHead = isFrozen ? 0 : Math.sin(time * 7.2) * 0.065;
  const finalHeadPos = headPos.clone().addScaledVector(sideHead, slitherHead);
  rig.headPivot.position.copy(finalHeadPos);
  rig.headPivot.lookAt(finalHeadPos.clone().add(headTan));

  // Menacing jaw hiss/chomp + flickering forked 3D tongue!
  const chomp = isFrozen ? 0.06 : 0.14 + Math.pow(Math.abs(Math.sin(time * 5.2)), 1.6) * 0.42;
  rig.lowerJaw.rotation.x = chomp;
  rig.upperJaw.rotation.x = -chomp * 0.32;

  const tongueExtend = isFrozen ? 0.2 : 0.45 + Math.max(0, Math.sin(time * 9.5)) * 0.85;
  rig.tongueGroup.scale.set(1, 1, tongueExtend);
  rig.tongueGroup.rotation.x = Math.sin(time * 26) * 0.18;

  // 2. Deform Continuous Seamless 1,872-Vertex Muscular Body Mesh from Neck -> Tail!
  const posAttr = rig.bodyMesh.geometry.attributes.position as THREE.BufferAttribute;
  const normAttr = rig.bodyMesh.geometry.attributes.normal as THREE.BufferAttribute;
  const rings = rig.spineRings;
  const rads = rig.radialSegs;
  const baseRadius = isBoss ? 0.31 : 0.265;
  const hoodAggression = 1.0 + progress01 * 0.38; // Cobra/Dragon hood flares wider as danger rises!

  const pt = new THREE.Vector3();
  const tan = new THREE.Vector3();
  const normalVec = new THREE.Vector3();
  const binormalVec = new THREE.Vector3();
  const vOut = new THREE.Vector3();

  for (let i = 0; i <= rings; i++) {
    const frac = i / rings; // 0 = neck behind skull, 1 = tail tip
    const uCurve = THREE.MathUtils.clamp(headU - frac * activeSpan, 0.001, 0.999);

    curve.getPointAt(uCurve, pt);
    curve.getTangentAt(uCurve, tan).normalize();

    // 2D-stable frame in board/arena XY plane with Z facing camera!
    normalVec.set(-tan.y, tan.x, 0);
    if (normalVec.lengthSq() < 0.0001) normalVec.set(1, 0, 0);
    normalVec.normalize();
    binormalVec.crossVectors(tan, normalVec).normalize();

    // Sinusoidal slither wave (smoothly zeroed at neck frac=0 so it joins head seamlessly!)
    const neckBlend = Math.min(1, frac * 5.5);
    const slitherAmp = isFrozen
      ? 0
      : Math.sin(time * 7.2 - frac * 11.5) * 0.095 * (1 - frac * 0.45);
    const waveOffset = THREE.MathUtils.lerp(slitherHead, slitherAmp, neckBlend);
    pt.addScaledVector(normalVec, waveOffset);

    // Anatomical Profile: Neck -> Flared Royal Cobra/Dragon Hood -> Muscular Belly -> Whip Tail!
    const hoodBell = Math.exp(-Math.pow((frac - 0.09) * 11.5, 2));
    const taper = Math.pow(1 - frac * 0.88, 0.68);
    const breath = 1 + (isFrozen ? 0 : Math.sin(time * 4.5 - frac * 6) * 0.04);

    const rWidth = baseRadius * taper * breath * (1 + hoodBell * 0.72 * hoodAggression);
    const rHeight = baseRadius * taper * breath * (0.88 - hoodBell * 0.16);

    for (let j = 0; j <= rads; j++) {
      const theta = (j / rads) * Math.PI * 2;
      // theta = 0 is dorsal spine (+binormal/Z), theta = PI is ventral belly (-binormal)
      const cosT = Math.cos(theta);
      const sinT = Math.sin(theta);

      // Flatten ventral belly slightly & create subtle dorsal ridge keel!
      let radH = rHeight * cosT;
      if (cosT < 0) radH *= 0.78;
      if (cosT > 0.75) radH += rHeight * 0.12 * Math.pow((cosT - 0.75) / 0.25, 2);
      const radW = rWidth * sinT;

      const idx = i * (rads + 1) + j;
      const vx = pt.x + normalVec.x * radW + binormalVec.x * radH;
      const vy = pt.y + normalVec.y * radW + binormalVec.y * radH;
      const vz = pt.z + normalVec.z * radW + binormalVec.z * radH;
      posAttr.setXYZ(idx, vx, vy, vz);

      vOut
        .set(
          normalVec.x * sinT + binormalVec.x * cosT,
          normalVec.y * sinT + binormalVec.y * cosT,
          normalVec.z * sinT + binormalVec.z * cosT
        )
        .normalize();
      normAttr.setXYZ(idx, vOut.x, vOut.y, vOut.z);
    }
  }

  posAttr.needsUpdate = true;
  normAttr.needsUpdate = true;

  // 3. Position Dorsal Spines & Tail Blade seamlessly along deformed spine
  for (let s = 0; s < rig.dorsalSpines.length; s++) {
    const frac = 0.08 + (s / rig.dorsalSpines.length) * 0.78;
    const uCurve = THREE.MathUtils.clamp(headU - frac * activeSpan, 0.002, 0.998);
    curve.getPointAt(uCurve, pt);
    curve.getTangentAt(uCurve, tan).normalize();
    normalVec.set(-tan.y, tan.x, 0).normalize();
    binormalVec.crossVectors(tan, normalVec).normalize();

    const slitherAmp = isFrozen ? 0 : Math.sin(time * 7.2 - frac * 11.5) * 0.095 * (1 - frac * 0.45);
    pt.addScaledVector(normalVec, slitherAmp);
    const sc = (1 - frac * 0.65) * (isBoss ? 1.25 : 0.95);
    const sp = rig.dorsalSpines[s];
    sp.position.copy(pt).addScaledVector(binormalVec, baseRadius * sc * 0.85);
    sp.lookAt(sp.position.clone().add(binormalVec));
    sp.rotateX(Math.PI * 0.5);
    sp.scale.setScalar(sc);
  }

  curve.getPointAt(tailStartU, pt);
  curve.getTangentAt(tailStartU, tan).normalize();
  rig.tailBlade.position.copy(pt);
  rig.tailBlade.lookAt(pt.clone().sub(tan));
}

/**
 * Living 3D Volcanic Magma Crusher Golem (for `lava_bridge` survival arenas!).
 */
export function createMagmaGolemRig3D(): MagmaGolemRig3D {
  const root = new THREE.Group();
  const charTex = getCharacterTextures();
  const pbr = getProceduralPBRMaps();

  const rockMat = new THREE.MeshPhysicalMaterial({
    map: charTex.magmaCracksTex,
    roughness: 0.35,
    metalness: 0.18,
    normalMap: pbr.stoneBrickNormal,
    normalScale: new THREE.Vector2(0.7, 0.7),
    clearcoat: 0.35,
  });

  // Crisp Vibrant Tangerine-Gold Core (Zero bloom blur)
  const magmaCoreMat = new THREE.MeshPhysicalMaterial({
    color: 0xff6d00,
    roughness: 0.12,
    clearcoat: 1.0,
  });

  const ironSpikeMat = new THREE.MeshPhysicalMaterial({
    color: 0xffcc00,
    roughness: 0.16,
    metalness: 0.85,
    clearcoat: 0.9,
  });

  const torsoGroup = new THREE.Group();
  root.add(torsoGroup);

  // Subdivided Muscular Volcanic Boulder Torso
  const torsoGeo = LoopSubdivision.modify(new THREE.DodecahedronGeometry(0.68, 0), 1, {
    split: false,
  });
  const torsoMesh = new THREE.Mesh(torsoGeo, rockMat);
  torsoMesh.scale.set(0.95, 1.18, 0.95);
  torsoGroup.add(torsoMesh);

  // Glowing Furnace Chest Core
  const furnace = new THREE.Mesh(new THREE.OctahedronGeometry(0.28, 1), magmaCoreMat);
  furnace.position.set(0.45, 0.08, 0.18);
  torsoGroup.add(furnace);

  // Fierce Horned Volcanic Golem Head & Chomping Jaw
  const headGroup = new THREE.Group();
  headGroup.position.set(0.15, 0.78, 0.08);
  torsoGroup.add(headGroup);

  const cranium = new THREE.Mesh(
    LoopSubdivision.modify(new THREE.BoxGeometry(0.56, 0.44, 0.56, 2, 2, 2), 1, { split: false }),
    rockMat
  );
  headGroup.add(cranium);

  for (const sz of [-1, 1]) {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.085, 12, 10), magmaCoreMat);
    eye.position.set(0.24, 0.06, sz * 0.14);
    headGroup.add(eye);

    const horn = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.38, 8), ironSpikeMat);
    horn.rotation.z = -0.55;
    horn.rotation.x = sz * 0.35;
    horn.position.set(0.05, 0.32, sz * 0.24);
    headGroup.add(horn);
  }

  const jawMesh = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.16, 0.44), rockMat);
  jawMesh.position.set(0.12, -0.22, 0);
  headGroup.add(jawMesh);

  // Articulated Heavy Stone Crusher Arms + Spinning Magma Saw-Drills!
  const buildCrusherArm = (sideZ: -1 | 1) => {
    const armG = new THREE.Group();
    armG.position.set(0.1, 0.28, sideZ * 0.58);

    const pauldron = new THREE.Mesh(new THREE.DodecahedronGeometry(0.28, 0), rockMat);
    armG.add(pauldron);

    const forearm = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.26, 0.28), rockMat);
    forearm.position.set(0.32, -0.18, 0);
    armG.add(forearm);

    const drillGroup = new THREE.Group();
    drillGroup.position.set(0.68, -0.18, 0);
    armG.add(drillGroup);

    const mainCone = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.48, 8), ironSpikeMat);
    mainCone.rotation.z = -Math.PI * 0.5;
    drillGroup.add(mainCone);

    const glowRing = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.035, 8, 16), magmaCoreMat);
    glowRing.rotation.y = Math.PI * 0.5;
    glowRing.position.x = -0.14;
    drillGroup.add(glowRing);

    return { armG, drillGroup };
  };

  const leftBuilt = buildCrusherArm(-1);
  const rightBuilt = buildCrusherArm(1);
  torsoGroup.add(leftBuilt.armG, rightBuilt.armG);

  root.traverse((obj) => {
    if ((obj as THREE.Mesh).isMesh) obj.castShadow = true;
  });

  return {
    root,
    torsoGroup,
    headGroup,
    jawMesh,
    leftArm: leftBuilt.armG,
    rightArm: rightBuilt.armG,
    leftDrill: leftBuilt.drillGroup,
    rightDrill: rightBuilt.drillGroup,
    rockMat,
  };
}

export function updateMagmaGolemAnimation(
  rig: MagmaGolemRig3D,
  time: number,
  isFrozen: boolean
) {
  rig.rockMat.color.setHex(isFrozen ? 0x38bdf8 : 0xffffff);
  if (isFrozen) return;

  rig.torsoGroup.position.y = Math.abs(Math.sin(time * 4.8)) * 0.11;
  rig.torsoGroup.rotation.z = Math.sin(time * 4.8) * 0.06;
  rig.jawMesh.position.y = -0.22 - Math.abs(Math.sin(time * 6.5)) * 0.08;
  rig.leftArm.rotation.z = Math.sin(time * 5.2) * 0.24;
  rig.rightArm.rotation.z = -Math.sin(time * 5.2) * 0.24;
  rig.leftDrill.rotation.x = time * 9.5;
  rig.rightDrill.rotation.x = -time * 9.5;
}

/**
 * Living 3D Armored Horned Rhino-Pangolin Juggernaut Beast (for `boulder_run` survival arenas!).
 */
export function createJuggernautBeastRig3D(): JuggernautBeastRig3D {
  const root = new THREE.Group();
  const charTex = getCharacterTextures();
  const pbr = getProceduralPBRMaps();

  const armorMat = new THREE.MeshPhysicalMaterial({
    color: 0xff0a54,
    roughness: 0.18,
    metalness: 0.35,
    clearcoat: 0.95,
    normalMap: pbr.reptileScaleNormal,
    normalScale: new THREE.Vector2(0.6, 0.6),
    envMapIntensity: 1.4,
  });

  const cobaltPlateMat = new THREE.MeshPhysicalMaterial({
    color: 0x0077ff,
    roughness: 0.18,
    metalness: 0.45,
    clearcoat: 0.95,
  });

  const bladeMat = new THREE.MeshPhysicalMaterial({
    color: 0xffcc00,
    roughness: 0.15,
    metalness: 0.85,
    clearcoat: 1.0,
  });

  const eyeMat = new THREE.MeshPhysicalMaterial({
    map: charTex.reptileEyeBossTex,
    roughness: 0.04,
    clearcoat: 1.0,
  });

  const wheelBody = new THREE.Group();
  root.add(wheelBody);

  const coreSphere = new THREE.Mesh(new THREE.SphereGeometry(0.74, 28, 24), armorMat);
  wheelBody.add(coreSphere);

  // Overlapping Sculpted Electric-Cobalt Chitin Armor Plates + Sunny Gold Scythe Horn Blades!
  const plateGeo = new THREE.TorusGeometry(0.74, 0.085, 10, 24, Math.PI * 1.4);
  for (let p = 0; p < 3; p++) {
    const plate = new THREE.Mesh(plateGeo, cobaltPlateMat);
    plate.rotation.y = (p / 3) * Math.PI;
    wheelBody.add(plate);
  }

  const hornGeo = new THREE.ConeGeometry(0.12, 0.42, 8);
  for (let i = 0; i < 10; i++) {
    const ang = (i / 10) * Math.PI * 2;
    const horn = new THREE.Mesh(hornGeo, bladeMat);
    horn.position.set(Math.cos(ang) * 0.82, Math.sin(ang) * 0.82, 0);
    horn.rotation.z = ang - Math.PI * 0.62;
    wheelBody.add(horn);
  }

  // Non-rotating Fierce Monster Head Visor peeking from side/front of Juggernaut!
  const headVisor = new THREE.Group();
  headVisor.position.set(0.28, 0.12, 0.56);
  root.add(headVisor);

  const browHelmet = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.42, 8), bladeMat);
  browHelmet.rotation.z = -Math.PI * 0.42;
  browHelmet.position.set(0.18, 0.08, 0);
  headVisor.add(browHelmet);

  const fierceEye = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 14), eyeMat);
  fierceEye.position.set(0.02, -0.02, 0.14);
  headVisor.add(fierceEye);

  root.traverse((obj) => {
    if ((obj as THREE.Mesh).isMesh) obj.castShadow = true;
  });

  return { root, wheelBody, headVisor, armorMat };
}
