import * as THREE from 'three';
import { GameStatus } from '../types/game';

export interface MochiRig3D {
  root: THREE.Group;
  bodyPivot: THREE.Group;
  headGroup: THREE.Group;
  leftEar: THREE.Group;
  rightEar: THREE.Group;
  hairBangs: THREE.Group;
  leftHairLock: THREE.Mesh;
  rightHairLock: THREE.Mesh;
  leftArm: THREE.Group;
  rightArm: THREE.Group;
  leftFoot: THREE.Mesh;
  rightFoot: THREE.Mesh;
  leftEyeOpen: THREE.Group;
  rightEyeOpen: THREE.Group;
  leftEyelid: THREE.Mesh;
  rightEyelid: THREE.Mesh;
  leftHappyArc: THREE.Mesh;
  rightHappyArc: THREE.Mesh;
  leftBrow: THREE.Mesh;
  rightBrow: THREE.Mesh;
  mouthSmile: THREE.Mesh;
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
  happyTimer: number; // > 0 right after matches
  surprisedTimer: number; // > 0 when hazard/slime triggers
}

export function createMochiRig3D(): MochiRig3D {
  const root = new THREE.Group();

  const skinMat = new THREE.MeshPhysicalMaterial({
    color: 0xfff6ed,
    emissive: 0x422214,
    emissiveIntensity: 0.34,
    roughness: 0.28,
    clearcoat: 0.28,
    clearcoatRoughness: 0.42,
    sheen: 0.35,
    sheenColor: new THREE.Color(0xffd6cc),
    envMapIntensity: 1.35,
  });

  const hairMat = new THREE.MeshPhysicalMaterial({
    color: 0xffe3d3,
    emissive: 0x451c25,
    emissiveIntensity: 0.28,
    roughness: 0.22,
    clearcoat: 0.78,
    clearcoatRoughness: 0.2,
    sheen: 0.65,
    sheenColor: new THREE.Color(0xfff0f5),
    envMapIntensity: 1.65,
  });

  const earInnerMat = new THREE.MeshPhysicalMaterial({
    color: 0xff8fab,
    emissive: 0x4a0d22,
    emissiveIntensity: 0.25,
    roughness: 0.26,
    sheen: 0.55,
    clearcoat: 0.4,
  });

  const capeMat = new THREE.MeshPhysicalMaterial({
    color: 0xf43f6e,
    emissive: 0x4a071c,
    emissiveIntensity: 0.32,
    roughness: 0.32,
    sheen: 0.9,
    sheenColor: new THREE.Color(0xffb3c6),
    clearcoat: 0.45,
    envMapIntensity: 1.5,
  });

  const skirtMat = new THREE.MeshPhysicalMaterial({
    color: 0xffcdd9,
    emissive: 0x3d1222,
    emissiveIntensity: 0.25,
    roughness: 0.34,
    sheen: 0.85,
    sheenColor: new THREE.Color(0xffffff),
    clearcoat: 0.3,
  });

  const goldMat = new THREE.MeshPhysicalMaterial({
    color: 0xffd147,
    emissive: 0x6e4700,
    emissiveIntensity: 0.65,
    roughness: 0.12,
    metalness: 0.92,
    clearcoat: 1.0,
    envMapIntensity: 2.1,
  });

  const bootMat = new THREE.MeshPhysicalMaterial({
    color: 0xd92656,
    roughness: 0.22,
    clearcoat: 0.75,
  });

  const cheekMat = new THREE.MeshBasicMaterial({
    color: 0xff6b95,
    transparent: true,
    opacity: 0.52,
  });

  const darkFeatureMat = new THREE.MeshBasicMaterial({ color: 0x2b121a });
  const irisMat = new THREE.MeshPhysicalMaterial({
    color: 0x9d3464,
    emissive: 0x3d0921,
    roughness: 0.08,
    clearcoat: 1.0,
  });
  const whiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const waterMat = new THREE.MeshPhysicalMaterial({
    color: 0x5ce1ff,
    emissive: 0x0a5880,
    transparent: true,
    opacity: 0.88,
    roughness: 0.05,
    clearcoat: 1.0,
  });

  // Ground contact shadow
  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(0.56, 24),
    new THREE.MeshBasicMaterial({
      color: 0x050812,
      transparent: true,
      opacity: 0.44,
      depthWrite: false,
    })
  );
  shadow.rotation.x = -Math.PI * 0.5;
  shadow.position.y = -0.62;
  root.add(shadow);

  const bodyPivot = new THREE.Group();
  root.add(bodyPivot);

  // Cute Berry Boots / Feet
  const footGeo = new THREE.SphereGeometry(0.14, 14, 12);
  footGeo.scale(1.1, 0.75, 1.35);
  const leftFoot = new THREE.Mesh(footGeo, bootMat);
  leftFoot.position.set(-0.18, -0.53, 0.06);
  const rightFoot = new THREE.Mesh(footGeo, bootMat);
  rightFoot.position.set(0.18, -0.53, 0.06);
  bodyPivot.add(leftFoot, rightFoot);

  // Torso & Pleated Pastel Skirt with sculpted folds!
  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.31, 0.42, 20), skinMat);
  torso.position.y = -0.22;
  bodyPivot.add(torso);

  const skirtGroup = new THREE.Group();
  skirtGroup.position.y = -0.34;
  const skirtBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.25, 0.39, 0.24, 20, 1, false),
    skirtMat
  );
  skirtGroup.add(skirtBase);

  // 12 sculpted pleats around skirt
  const pleatGeo = new THREE.CapsuleGeometry(0.045, 0.14, 6, 8);
  for (let i = 0; i < 12; i++) {
    const ang = (i / 12) * Math.PI * 2;
    const pleat = new THREE.Mesh(pleatGeo, skirtMat);
    pleat.position.set(Math.cos(ang) * 0.33, -0.02, Math.sin(ang) * 0.33);
    pleat.rotation.z = Math.cos(ang) * -0.22;
    pleat.rotation.x = Math.sin(ang) * 0.22;
    skirtGroup.add(pleat);
  }
  bodyPivot.add(skirtGroup);

  // Scalloped Strawberry-Rose Capelet Collar + Gold Heart Gem Brooch!
  const cape = new THREE.Mesh(
    new THREE.CylinderGeometry(0.22, 0.35, 0.19, 20),
    capeMat
  );
  cape.position.y = -0.11;
  bodyPivot.add(cape);

  const brooch = new THREE.Mesh(new THREE.OctahedronGeometry(0.075, 0), goldMat);
  brooch.position.set(0, -0.1, 0.31);
  bodyPivot.add(brooch);

  // Articulated Plump Arms
  const armGeo = new THREE.CapsuleGeometry(0.088, 0.19, 8, 12);
  const leftArm = new THREE.Group();
  leftArm.position.set(-0.28, -0.09, 0.04);
  const leftArmMesh = new THREE.Mesh(armGeo, skinMat);
  leftArmMesh.position.set(-0.08, -0.1, 0);
  leftArmMesh.rotation.z = -0.35;
  leftArm.add(leftArmMesh);

  const rightArm = new THREE.Group();
  rightArm.position.set(0.28, -0.09, 0.04);
  const rightArmMesh = new THREE.Mesh(armGeo, skinMat);
  rightArmMesh.position.set(0.08, -0.1, 0);
  rightArmMesh.rotation.z = 0.35;
  rightArm.add(rightArmMesh);

  bodyPivot.add(leftArm, rightArm);

  // ================= SCULPTED CHIBI HEAD & HAIR =================
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 0.24, 0);
  bodyPivot.add(headGroup);

  const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.42, 28, 24), skinMat);
  headMesh.scale.set(1.08, 0.98, 0.96);
  headGroup.add(headMesh);

  // Signature Twin Marshmallow Puff-Ears with satin pink cushions!
  const makeEar = (side: -1 | 1) => {
    const earG = new THREE.Group();
    earG.position.set(side * 0.34, 0.34, -0.02);
    earG.rotation.z = side * -0.24;

    const outer = new THREE.Mesh(new THREE.SphereGeometry(0.165, 18, 16), skinMat);
    outer.scale.set(1, 1.08, 0.72);
    earG.add(outer);

    const inner = new THREE.Mesh(new THREE.SphereGeometry(0.095, 14, 12), earInnerMat);
    inner.scale.set(1, 1.05, 0.45);
    inner.position.set(0, -0.01, 0.09);
    earG.add(inner);
    return earG;
  };
  const leftEar = makeEar(-1);
  const rightEar = makeEar(1);
  headGroup.add(leftEar, rightEar);

  // Voluminous 3D Anime Hair Cap, Bangs, Swaying Side-Locks & Berry Ribbon Bow!
  const hairCap = new THREE.Mesh(
    new THREE.SphereGeometry(0.435, 24, 18, 0, Math.PI * 2, 0, Math.PI * 0.58),
    hairMat
  );
  hairCap.scale.set(1.1, 1.02, 1.0);
  hairCap.rotation.x = -0.16;
  hairCap.position.y = 0.03;
  headGroup.add(hairCap);

  const hairBangs = new THREE.Group();
  hairBangs.position.set(0, 0.24, 0.34);
  const bangConfigs: Array<[number, number, number, number]> = [
    [-0.17, 0.01, 0.26, 0.9],
    [-0.05, 0.03, 0.08, 1.05],
    [0.08, 0.02, -0.1, 1.0],
    [0.2, 0.0, -0.28, 0.85],
  ];
  for (const [bx, by, rotZ, sc] of bangConfigs) {
    const tuft = new THREE.Mesh(new THREE.ConeGeometry(0.095 * sc, 0.24 * sc, 12), hairMat);
    tuft.rotation.z = Math.PI + rotZ;
    tuft.rotation.x = 0.28;
    tuft.position.set(bx, by, 0);
    hairBangs.add(tuft);
  }
  headGroup.add(hairBangs);

  // Swaying side hair locks framing cheeks
  const lockGeo = new THREE.CapsuleGeometry(0.068, 0.22, 8, 10);
  const leftHairLock = new THREE.Mesh(lockGeo, hairMat);
  leftHairLock.position.set(-0.4, -0.04, 0.22);
  leftHairLock.rotation.z = 0.15;

  const rightHairLock = new THREE.Mesh(lockGeo, hairMat);
  rightHairLock.position.set(0.4, -0.04, 0.22);
  rightHairLock.rotation.z = -0.15;
  headGroup.add(leftHairLock, rightHairLock);

  // Cute Glossy Berry-Pink Ribbon Bow by right ear!
  const bowGroup = new THREE.Group();
  bowGroup.position.set(0.22, 0.38, 0.18);
  bowGroup.rotation.z = -0.28;
  const bowLoopGeo = new THREE.SphereGeometry(0.09, 12, 10);
  bowLoopGeo.scale(1.3, 0.85, 0.55);
  const bowL = new THREE.Mesh(bowLoopGeo, capeMat);
  bowL.position.x = -0.09;
  const bowR = new THREE.Mesh(bowLoopGeo, capeMat);
  bowR.position.x = 0.09;
  const bowKnot = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 10), goldMat);
  bowGroup.add(bowL, bowR, bowKnot);
  headGroup.add(bowGroup);

  // Rosy Cheeks
  const cheekGeo = new THREE.CircleGeometry(0.078, 16);
  const leftCheek = new THREE.Mesh(cheekGeo, cheekMat);
  leftCheek.position.set(-0.24, -0.08, 0.37);
  leftCheek.rotation.y = -0.42;
  const rightCheek = new THREE.Mesh(cheekGeo, cheekMat);
  rightCheek.position.set(0.24, -0.08, 0.37);
  rightCheek.rotation.y = 0.42;
  headGroup.add(leftCheek, rightCheek);

  // ================= MULTI-LAYERED ANIME EYES =================
  const buildEye = (side: -1 | 1) => {
    const eyeRoot = new THREE.Group();
    eyeRoot.position.set(side * 0.155, -0.01, 0.385);
    eyeRoot.rotation.y = side * 0.24;

    const sclera = new THREE.Mesh(new THREE.SphereGeometry(0.095, 16, 14), whiteMat);
    sclera.scale.set(0.95, 1.12, 0.35);
    eyeRoot.add(sclera);

    const iris = new THREE.Mesh(new THREE.SphereGeometry(0.076, 16, 14), irisMat);
    iris.scale.set(0.95, 1.12, 0.36);
    iris.position.z = 0.012;
    eyeRoot.add(iris);

    const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.048, 14, 12), darkFeatureMat);
    pupil.scale.set(0.95, 1.12, 0.38);
    pupil.position.z = 0.022;
    eyeRoot.add(pupil);

    // Dual glossy specular catchlights!
    const specBig = new THREE.Mesh(new THREE.SphereGeometry(0.024, 10, 10), whiteMat);
    specBig.position.set(-0.024, 0.032, 0.042);
    const specSmall = new THREE.Mesh(new THREE.SphereGeometry(0.013, 8, 8), whiteMat);
    specSmall.position.set(0.024, -0.028, 0.042);
    eyeRoot.add(specBig, specSmall);

    // Blinking upper eyelid
    const eyelid = new THREE.Mesh(
      new THREE.SphereGeometry(0.102, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55),
      skinMat
    );
    eyelid.scale.set(0.98, 1.14, 0.42);
    eyelid.rotation.x = -1.35; // Open by default
    eyeRoot.add(eyelid);

    return { eyeRoot, eyelid };
  };

  const leftEyeBuilt = buildEye(-1);
  const rightEyeBuilt = buildEye(1);
  headGroup.add(leftEyeBuilt.eyeRoot, rightEyeBuilt.eyeRoot);

  // Happy curved ^ ^ eye crescents (shown during match cheers & victory!)
  const happyArcGeo = new THREE.TorusGeometry(0.075, 0.018, 8, 16, Math.PI);
  const leftHappyArc = new THREE.Mesh(happyArcGeo, darkFeatureMat);
  leftHappyArc.position.set(-0.155, -0.02, 0.41);
  leftHappyArc.rotation.y = -0.24;
  leftHappyArc.visible = false;

  const rightHappyArc = new THREE.Mesh(happyArcGeo, darkFeatureMat);
  rightHappyArc.position.set(0.155, -0.02, 0.41);
  rightHappyArc.rotation.y = 0.24;
  rightHappyArc.visible = false;
  headGroup.add(leftHappyArc, rightHappyArc);

  // Expressive Eyebrows
  const browGeo = new THREE.CapsuleGeometry(0.015, 0.09, 6, 8);
  const leftBrow = new THREE.Mesh(browGeo, darkFeatureMat);
  leftBrow.position.set(-0.155, 0.13, 0.39);
  leftBrow.rotation.z = Math.PI * 0.5;

  const rightBrow = new THREE.Mesh(browGeo, darkFeatureMat);
  rightBrow.position.set(0.155, 0.13, 0.39);
  rightBrow.rotation.z = Math.PI * 0.5;
  headGroup.add(leftBrow, rightBrow);

  // 3 Mouth states: Smile, Surprised/Scared O, Sad arc
  const smileGeo = new THREE.TorusGeometry(0.052, 0.014, 8, 16, Math.PI);
  const mouthSmile = new THREE.Mesh(smileGeo, darkFeatureMat);
  mouthSmile.position.set(0, -0.095, 0.405);
  mouthSmile.rotation.z = Math.PI;
  headGroup.add(mouthSmile);

  const mouthSurprised = new THREE.Mesh(
    new THREE.SphereGeometry(0.048, 12, 12),
    capeMat
  );
  mouthSurprised.scale.set(0.85, 1.15, 0.35);
  mouthSurprised.position.set(0, -0.115, 0.405);
  mouthSurprised.visible = false;
  headGroup.add(mouthSurprised);

  const mouthSad = new THREE.Mesh(smileGeo, darkFeatureMat);
  mouthSad.position.set(0, -0.145, 0.405);
  mouthSad.visible = false;
  headGroup.add(mouthSad);

  // 3D Sweat Drop (high danger) & Tear Drops (failure)
  const dropGeo = new THREE.ConeGeometry(0.042, 0.12, 10);
  const sweatDrop = new THREE.Mesh(dropGeo, waterMat);
  sweatDrop.position.set(0.36, 0.16, 0.28);
  sweatDrop.visible = false;
  headGroup.add(sweatDrop);

  const tearGeo = new THREE.SphereGeometry(0.036, 10, 10);
  tearGeo.scale(0.8, 1.3, 0.8);
  const leftTear = new THREE.Mesh(tearGeo, waterMat);
  leftTear.position.set(-0.19, -0.09, 0.41);
  leftTear.visible = false;

  const rightTear = new THREE.Mesh(tearGeo, waterMat);
  rightTear.position.set(0.19, -0.09, 0.41);
  rightTear.visible = false;
  headGroup.add(leftTear, rightTear);

  root.traverse((obj) => {
    if ((obj as THREE.Mesh).isMesh) {
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
    leftHairLock,
    rightHairLock,
    leftArm,
    rightArm,
    leftFoot,
    rightFoot,
    leftEyeOpen: leftEyeBuilt.eyeRoot,
    rightEyeOpen: rightEyeBuilt.eyeRoot,
    leftEyelid: leftEyeBuilt.eyelid,
    rightEyelid: rightEyeBuilt.eyelid,
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

export function updateMochiRigAnimation(rig: MochiRig3D, params: MochiAnimParams) {
  const { time, danger, status, happyTimer, surprisedTimer } = params;

  const isVictory = status === 'rescuing' || status === 'won';
  const isLost = status === 'lost';
  const isHappy = isVictory || (happyTimer > 0 && danger < 82 && !isLost);
  const isScared = !isVictory && !isLost && (danger >= 62 || surprisedTimer > 0);

  // 1. Body breathing, jumping, or trembling
  let jumpY = 0;
  let breathScaleY = 1 + Math.sin(time * 3.2) * 0.025;
  let breathScaleXZ = 1 - Math.sin(time * 3.2) * 0.015;
  let shakeX = 0;
  let spinY = 0;

  if (isVictory) {
    jumpY = Math.abs(Math.sin(time * 8.5)) * 0.38;
    spinY = Math.sin(time * 3.5) * 0.45;
    breathScaleY = 1.04;
  } else if (isHappy) {
    jumpY = Math.abs(Math.sin(time * 10)) * 0.16;
  } else if (isLost) {
    jumpY = -0.08;
    breathScaleY = 0.94 + Math.sin(time * 6) * 0.02;
  } else if (danger >= 72) {
    jumpY = Math.abs(Math.sin(time * 12)) * 0.09;
    shakeX = Math.sin(time * 36) * 0.032;
  } else if (danger >= 45) {
    shakeX = Math.sin(time * 22) * 0.014;
  }

  rig.bodyPivot.position.set(shakeX, jumpY, 0);
  rig.bodyPivot.rotation.y = spinY;
  rig.bodyPivot.scale.set(breathScaleXZ, breathScaleY, breathScaleXZ);

  const shadowScale = Math.max(0.55, 1 - jumpY * 0.7);
  rig.shadow.scale.setScalar(shadowScale);

  // 2. Subtle head tilt & natural hair sway
  if (isLost) {
    rig.headGroup.rotation.x = 0.25;
    rig.headGroup.rotation.z = Math.sin(time * 4) * 0.06;
  } else if (isScared) {
    rig.headGroup.rotation.x = -0.06;
    rig.headGroup.rotation.y = Math.sin(time * 5.5) * 0.22;
    rig.headGroup.rotation.z = Math.sin(time * 9) * 0.06;
  } else {
    rig.headGroup.rotation.x = Math.sin(time * 2.1) * 0.04;
    rig.headGroup.rotation.y = Math.sin(time * 1.5) * 0.12;
    rig.headGroup.rotation.z = Math.sin(time * 2.4) * 0.065;
  }

  const hairSway = Math.sin(time * 3.6) * 0.09;
  rig.leftHairLock.rotation.z = 0.16 + hairSway;
  rig.rightHairLock.rotation.z = -0.16 + hairSway;
  rig.hairBangs.rotation.x = Math.sin(time * 3.2) * 0.04;

  // Ear perk / droop
  const earFlop = isLost ? 0.35 : isScared ? 0.18 : -0.05 + Math.sin(time * 3.8) * 0.06;
  rig.leftEar.rotation.z = 0.24 + earFlop;
  rig.rightEar.rotation.z = -0.24 - earFlop;

  // 3. Arm gestures
  if (isVictory || isHappy) {
    rig.leftArm.rotation.z = -1.85 + Math.sin(time * 13) * 0.35;
    rig.rightArm.rotation.z = 1.85 - Math.sin(time * 13) * 0.35;
  } else if (isScared) {
    // Hands raised near cheeks in panic!
    rig.leftArm.rotation.z = -1.35 + Math.sin(time * 16) * 0.22;
    rig.rightArm.rotation.z = 1.35 - Math.sin(time * 16) * 0.22;
  } else if (isLost) {
    rig.leftArm.rotation.z = -0.2;
    rig.rightArm.rotation.z = 0.2;
  } else {
    rig.leftArm.rotation.z = -0.25 + Math.sin(time * 3.2) * 0.16;
    rig.rightArm.rotation.z = 0.35 + Math.cos(time * 3.2) * 0.22;
  }

  // Foot tapping
  rig.leftFoot.rotation.x = isVictory ? Math.sin(time * 12) * 0.35 : 0;
  rig.rightFoot.rotation.x = isVictory ? -Math.sin(time * 12) * 0.35 : 0;

  // 4. Natural Blinking & Facial Expressions!
  const blinkCycle = time % 3.4;
  const isBlinking = blinkCycle > 3.22;

  if (isHappy) {
    rig.leftEyeOpen.visible = false;
    rig.rightEyeOpen.visible = false;
    rig.leftHappyArc.visible = true;
    rig.rightHappyArc.visible = true;
  } else {
    rig.leftEyeOpen.visible = true;
    rig.rightEyeOpen.visible = true;
    rig.leftHappyArc.visible = false;
    rig.rightHappyArc.visible = false;

    const lidRot = isBlinking ? -0.05 : isLost ? -0.55 : -1.35;
    rig.leftEyelid.rotation.x = lidRot;
    rig.rightEyelid.rotation.x = lidRot;

    const eyeScale = isScared ? 1.12 : 1.0;
    rig.leftEyeOpen.scale.setScalar(eyeScale);
    rig.rightEyeOpen.scale.setScalar(eyeScale);
  }

  // Eyebrows
  if (isScared || isLost) {
    rig.leftBrow.rotation.z = Math.PI * 0.5 - 0.34;
    rig.rightBrow.rotation.z = Math.PI * 0.5 + 0.34;
  } else {
    rig.leftBrow.rotation.z = Math.PI * 0.5 + 0.06;
    rig.rightBrow.rotation.z = Math.PI * 0.5 - 0.06;
  }

  // Mouths
  rig.mouthSmile.visible = !isScared && !isLost;
  rig.mouthSurprised.visible = isScared && !isLost;
  rig.mouthSad.visible = isLost;

  // Sweat & Tears
  rig.sweatDrop.visible = isScared && danger >= 60;
  if (rig.sweatDrop.visible) {
    rig.sweatDrop.position.y = 0.22 - ((time * 0.55) % 0.28);
  }

  rig.leftTear.visible = isLost;
  rig.rightTear.visible = isLost;
  if (isLost) {
    const tearFall = (time * 0.45) % 0.18;
    rig.leftTear.position.y = -0.08 - tearFall;
    rig.rightTear.position.y = -0.08 - ((tearFall + 0.09) % 0.18);
  }
}
