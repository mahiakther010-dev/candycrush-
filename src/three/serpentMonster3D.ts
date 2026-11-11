import * as THREE from 'three';

export interface SerpentRig3D {
  root: THREE.Group;
  segments: THREE.Mesh[];
  spines: THREE.Mesh[];
  headPivot: THREE.Group;
  upperJaw: THREE.Group;
  lowerJaw: THREE.Group;
  leftEye: THREE.Mesh;
  rightEye: THREE.Mesh;
  crownGroup: THREE.Group;
  scaleMat: THREE.MeshPhysicalMaterial;
  bellyMat: THREE.MeshPhysicalMaterial;
}

export function createSerpentRig3D(numSegments: number = 22, isBoss: boolean = false): SerpentRig3D {
  const root = new THREE.Group();

  const scaleMat = new THREE.MeshPhysicalMaterial({
    color: isBoss ? 0x16a34a : 0x43b518,
    emissive: isBoss ? 0x052e16 : 0x113604,
    roughness: 0.16,
    metalness: 0.08,
    clearcoat: 0.95,
    clearcoatRoughness: 0.1,
  });

  const bellyMat = new THREE.MeshPhysicalMaterial({
    color: 0xbef264,
    emissive: 0x284705,
    roughness: 0.22,
    clearcoat: 0.7,
  });

  const fangMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0.1,
    clearcoat: 0.9,
  });

  const eyeMat = new THREE.MeshBasicMaterial({ color: 0xffe600 });
  const pupilMat = new THREE.MeshBasicMaterial({ color: 0x5c0512 });
  const goldMat = new THREE.MeshPhysicalMaterial({
    color: 0xffd026,
    emissive: 0x593a00,
    roughness: 0.15,
    metalness: 0.85,
    clearcoat: 1.0,
  });
  const rubyMat = new THREE.MeshPhysicalMaterial({
    color: 0xff1744,
    emissive: 0x690018,
    roughness: 0.08,
    clearcoat: 1.0,
  });

  const segments: THREE.Mesh[] = [];
  const spines: THREE.Mesh[] = [];

  const segGeo = new THREE.SphereGeometry(0.28, 18, 14);
  const spineGeo = new THREE.ConeGeometry(0.065, 0.16, 8);

  for (let i = 0; i < numSegments; i++) {
    const t = i / (numSegments - 1); // 0 near head -> 1 tail tip
    const radiusScale = (1 - t * 0.62) * (isBoss ? 1.12 : 0.98);

    const seg = new THREE.Mesh(segGeo, scaleMat);
    seg.scale.set(radiusScale, radiusScale * 0.92, radiusScale * 1.12);

    // Dorsal spine on every other segment
    if (i % 2 === 0 && i < numSegments - 2) {
      const sp = new THREE.Mesh(spineGeo, bellyMat);
      sp.position.set(0, 0.26, 0);
      seg.add(sp);
      spines.push(sp);
    }

    root.add(seg);
    segments.push(seg);
  }

  // Sculpted 3D Dragon / Serpent Head!
  const headPivot = new THREE.Group();
  if (isBoss) headPivot.scale.setScalar(1.18);
  root.add(headPivot);

  const upperJaw = new THREE.Group();
  headPivot.add(upperJaw);

  const snout = new THREE.Mesh(new THREE.BoxGeometry(0.54, 0.28, 0.72), scaleMat);
  snout.position.set(0, 0.08, 0.22);
  // Round out skull back
  const cranium = new THREE.Mesh(new THREE.SphereGeometry(0.32, 18, 14), scaleMat);
  cranium.scale.set(1.05, 0.88, 1.05);
  cranium.position.set(0, 0.1, -0.05);
  upperJaw.add(snout, cranium);

  // Fierce Brow Ridges & Expressive Reptile Eyes
  const buildReptileEye = (side: -1 | 1) => {
    const eyeSphere = new THREE.Mesh(new THREE.SphereGeometry(0.095, 14, 12), eyeMat);
    eyeSphere.position.set(side * 0.23, 0.22, 0.08);

    const slit = new THREE.Mesh(new THREE.BoxGeometry(0.032, 0.14, 0.04), pupilMat);
    slit.position.set(side * 0.04, 0, 0.075);
    eyeSphere.add(slit);

    const brow = new THREE.Mesh(new THREE.CapsuleGeometry(0.038, 0.18, 6, 8), bellyMat);
    brow.position.set(side * 0.23, 0.31, 0.1);
    brow.rotation.x = Math.PI * 0.5;
    brow.rotation.z = side * -0.28;
    upperJaw.add(brow);

    return eyeSphere;
  };
  const leftEye = buildReptileEye(-1);
  const rightEye = buildReptileEye(1);
  upperJaw.add(leftEye, rightEye);

  // Nostrils + Upper Fangs
  const fangGeo = new THREE.ConeGeometry(0.042, 0.14, 8);
  for (const side of [-1, 1]) {
    for (const fz of [0.22, 0.44]) {
      const fang = new THREE.Mesh(fangGeo, fangMat);
      fang.rotation.x = Math.PI;
      fang.position.set(side * 0.2, -0.08, fz);
      upperJaw.add(fang);
    }
  }

  // Hinged Lower Jaw
  const lowerJaw = new THREE.Group();
  lowerJaw.position.set(0, -0.04, -0.02);
  headPivot.add(lowerJaw);

  const jawMesh = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.15, 0.64), bellyMat);
  jawMesh.position.set(0, -0.06, 0.24);
  lowerJaw.add(jawMesh);

  for (const side of [-1, 1]) {
    const lFang = new THREE.Mesh(fangGeo, fangMat);
    lFang.position.set(side * 0.17, 0.05, 0.44);
    lowerJaw.add(lFang);
  }

  // Royal Golden Crown for Boss Mission 6!
  const crownGroup = new THREE.Group();
  crownGroup.position.set(0, 0.36, -0.02);
  crownGroup.visible = isBoss;
  const crownBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.21, 0.17, 0.15, 10),
    goldMat
  );
  crownGroup.add(crownBase);
  for (let k = 0; k < 5; k++) {
    const a = (k / 5) * Math.PI * 2;
    const spike = new THREE.Mesh(new THREE.ConeGeometry(0.055, 0.15, 8), goldMat);
    spike.position.set(Math.cos(a) * 0.17, 0.13, Math.sin(a) * 0.17);
    crownGroup.add(spike);
  }
  const frontRuby = new THREE.Mesh(new THREE.OctahedronGeometry(0.065, 0), rubyMat);
  frontRuby.position.set(0, 0.02, 0.19);
  crownGroup.add(frontRuby);
  upperJaw.add(crownGroup);

  return {
    root,
    segments,
    spines,
    headPivot,
    upperJaw,
    lowerJaw,
    leftEye,
    rightEye,
    crownGroup,
    scaleMat,
    bellyMat,
  };
}

export function updateSerpentAlongCurve(
  rig: SerpentRig3D,
  curve: THREE.CatmullRomCurve3,
  progress01: number,
  time: number,
  isFrozen: boolean = false,
  isBoss: boolean = false,
  bodyArcFraction: number = 0.42
) {
  // Material tint for Frozen vs Normal
  if (isFrozen) {
    rig.scaleMat.color.setHex(0x38bdf8);
    rig.scaleMat.emissive.setHex(0x075985);
    rig.bellyMat.color.setHex(0xe0f2fe);
  } else {
    rig.scaleMat.color.setHex(isBoss ? 0x16a34a : 0x43b518);
    rig.scaleMat.emissive.setHex(isBoss ? 0x052e16 : 0x113604);
    rig.bellyMat.color.setHex(0xbef264);
  }
  rig.crownGroup.visible = isBoss;

  const headU = THREE.MathUtils.clamp(0.06 + progress01 * 0.92, 0.06, 0.99);

  // Position & orient Head along curve tangent!
  const headPos = curve.getPointAt(headU);
  const headTan = curve.getTangentAt(headU).normalize();
  const slitherHead = isFrozen ? 0 : Math.sin(time * 7.2) * 0.06;
  const sideVec = new THREE.Vector3(-headTan.y, headTan.x, 0).normalize();

  rig.headPivot.position.copy(headPos).addScaledVector(sideVec, slitherHead);
  const lookTarget = headPos.clone().add(headTan);
  rig.headPivot.lookAt(lookTarget);

  // Menacing jaw chomping animation!
  const chomp = isFrozen ? 0.08 : 0.15 + Math.abs(Math.sin(time * 7.8)) * 0.34;
  rig.lowerJaw.rotation.x = chomp;
  rig.upperJaw.rotation.x = -chomp * 0.35;

  // Position body segments trailing behind head with rib-breathing + sinusoidal slither!
  const count = rig.segments.length;
  for (let i = 0; i < count; i++) {
    const frac = (i + 1) / count;
    const segU = headU - frac * bodyArcFraction;
    const seg = rig.segments[i];

    if (segU <= 0.005) {
      seg.visible = false;
      continue;
    }
    seg.visible = true;

    const pt = curve.getPointAt(segU);
    const tan = curve.getTangentAt(segU).normalize();
    const perp = new THREE.Vector3(-tan.y, tan.x, 0).normalize();

    const wave = isFrozen ? 0 : Math.sin(time * 7.2 - i * 0.55) * 0.09 * (1 - frac * 0.45);
    seg.position.copy(pt).addScaledVector(perp, wave);
    seg.lookAt(pt.clone().add(tan));

    // Subtle breathing pulse along ribs
    const breath = 1 + (isFrozen ? 0 : Math.sin(time * 4 - i * 0.3) * 0.04);
    const baseScale = (1 - frac * 0.6) * (isBoss ? 1.12 : 0.98) * breath;
    seg.scale.set(baseScale, baseScale * 0.92, baseScale * 1.15);
  }
}
