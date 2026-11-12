import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { getRenderProfile } from '../three/renderProfile';
import { Language } from '../types/game';
import { createCandyStudioEnvironment, setupCinematicLights } from '../three/studioEnv';
import { createCandyMesh3D, createHintHand3D } from '../three/candyMeshes3D';
import { createMochiRig3D, updateMochiRigAnimation } from '../three/mochiCharacter3D';
import { createSerpentRig3D, updateSerpentAlongCurve } from '../three/serpentMonster3D';
import { soundEngine } from '../audio/soundEngine';
import { FastForward } from 'lucide-react';

interface IntroCutsceneProps {
  lang: Language;
  onComplete: () => void;
}

export const IntroCutscene: React.FC<IntroCutsceneProps> = ({ lang, onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const stepRef = useRef<0 | 1 | 2>(0);
  const stepTimeRef = useRef<number>(0);
  const completedRef = useRef<boolean>(false);

  useEffect(() => {
    stepRef.current = step;
    stepTimeRef.current = 0;
  }, [step]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const profile = getRenderProfile();
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: profile.antialias });
    renderer.setPixelRatio(profile.pixelRatio);
    renderer.toneMapping = THREE.NeutralToneMapping;
    renderer.toneMappingExposure = 1.04;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#1e40af');
    const envTex = createCandyStudioEnvironment(renderer);
    scene.environment = envTex;

    const camera = new THREE.PerspectiveCamera(36, 440 / 640, 0.5, 50);
    camera.position.set(0, 0.4, 13.5);
    camera.lookAt(0, 0.2, 0);

    setupCinematicLights(scene);

    // 3D Castle Wall & Caramel Ramp
    const backWall = new THREE.Mesh(
      new THREE.BoxGeometry(10, 14, 0.5),
      new THREE.MeshStandardMaterial({ color: 0x1e2d54, roughness: 0.6 })
    );
    backWall.position.z = -1.1;
    scene.add(backWall);

    const ramp = new THREE.Mesh(
      new THREE.BoxGeometry(6.8, 0.32, 1.1),
      new THREE.MeshPhysicalMaterial({ color: 0xf59e0b, roughness: 0.22, clearcoat: 0.85 })
    );
    ramp.position.set(0.3, -2.55, 0);
    ramp.rotation.z = -0.14;
    scene.add(ramp);

    // 3x3 3D Candy Switch Pad on upper-left wall
    const switchPad = new THREE.Group();
    switchPad.position.set(-1.35, 1.35, -0.2);
    switchPad.rotation.y = 0.22;
    const padFrame = new THREE.Mesh(
      new THREE.BoxGeometry(2.35, 2.35, 0.28),
      new THREE.MeshPhysicalMaterial({
        color: 0x263869,
        roughness: 0.3,
        clearcoat: 0.8,
      })
    );
    const padBorder = new THREE.Mesh(
      new THREE.BoxGeometry(2.52, 2.52, 0.22),
      new THREE.MeshPhysicalMaterial({
        color: 0xffcf33,
        metalness: 0.75,
        roughness: 0.18,
        clearcoat: 1,
      })
    );
    padBorder.position.z = -0.04;
    switchPad.add(padBorder, padFrame);

    const miniColors = [
      'red',
      'yellow',
      'blue',
      'green',
      'purple',
      'orange',
      'blue',
      'red',
      'green',
    ] as const;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const cm = createCandyMesh3D(miniColors[r * 3 + c], r === 1 && c === 1 ? 'bomb' : 'none');
        cm.scale.setScalar(0.68);
        cm.position.set((c - 1) * 0.72, (1 - r) * 0.72, 0.22);
        switchPad.add(cm);
      }
    }
    scene.add(switchPad);

    // Glowing 3D Tunnel Entrance Arch (revealed in Step 1!)
    const tunnelGroup = new THREE.Group();
    tunnelGroup.position.set(-0.2, 1.55, -0.15);
    tunnelGroup.visible = false;
    const arch = new THREE.Mesh(
      new THREE.TorusGeometry(0.95, 0.18, 14, 32),
      new THREE.MeshPhysicalMaterial({
        color: 0xffbe0b,
        roughness: 0.18,
        metalness: 0.55,
        clearcoat: 1,
      })
    );
    const portalCore = new THREE.Mesh(
      new THREE.CircleGeometry(0.86, 28),
      new THREE.MeshBasicMaterial({ color: 0xffe89e })
    );
    portalCore.position.z = -0.05;
    tunnelGroup.add(arch, portalCore);
    scene.add(tunnelGroup);

    // 3D Mochi & Chasing 3D Serpent
    const mochi = createMochiRig3D();
    mochi.root.scale.setScalar(1.15);
    mochi.root.position.set(0.55, -1.75, 0.35);
    scene.add(mochi.root);

    const serpent = createSerpentRig3D(20, false, 'venom_naga');
    const serpentCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(4.8, -2.35, -0.1),
      new THREE.Vector3(3.15, -1.92, 0.15),
      new THREE.Vector3(1.85, -1.98, 0.25),
    ]);
    scene.add(serpent.root);

    const hintHand = createHintHand3D();
    hintHand.scale.setScalar(1.35);
    scene.add(hintHand);

    let animId = 0;
    let last = performance.now();

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const t = now / 1000;
      stepTimeRef.current += dt;

      const w = canvas.clientWidth || 440;
      const h = canvas.clientHeight || 640;
      if (
        canvas.width !== Math.floor(w * renderer.getPixelRatio()) ||
        canvas.height !== Math.floor(h * renderer.getPixelRatio())
      ) {
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      }

      updateSerpentAlongCurve(
        serpent,
        serpentCurve,
        0.75 + Math.sin(t * 3) * 0.08,
        t,
        false,
        false,
        0.75
      );

      const curStep = stepRef.current;
      if (curStep === 0) {
        switchPad.visible = true;
        tunnelGroup.visible = false;
        hintHand.visible = true;
        hintHand.position.set(-1.1, 1.0, 0.65 + Math.sin(t * 7) * 0.14);

        mochi.root.position.set(0.45, -1.72, 0.35);
        updateMochiRigAnimation(mochi, {
          time: t,
          danger: 76,
          status: 'playing',
          happyTimer: 0,
          surprisedTimer: 1,
        });
      } else if (curStep === 1) {
        switchPad.visible = false;
        tunnelGroup.visible = true;
        tunnelGroup.rotation.z = Math.sin(t * 2) * 0.05;

        const jumpP = Math.min(1, stepTimeRef.current * 1.65);
        const mx = THREE.MathUtils.lerp(0.45, 0.85, jumpP);
        const my = THREE.MathUtils.lerp(-1.72, 0.95, Math.sin(jumpP * Math.PI * 0.5));
        mochi.root.position.set(mx, my, 0.45);

        hintHand.visible = true;
        hintHand.position.set(0.05, 1.25, 0.65 + Math.sin(t * 7) * 0.14);

        updateMochiRigAnimation(mochi, {
          time: t,
          danger: 30,
          status: 'playing',
          happyTimer: 1,
          surprisedTimer: 0,
        });
      } else {
        tunnelGroup.visible = true;
        hintHand.visible = false;
        const diveP = Math.min(1, stepTimeRef.current * 2.4);
        mochi.root.position.set(
          THREE.MathUtils.lerp(0.85, -0.2, diveP),
          THREE.MathUtils.lerp(0.95, 1.55, diveP),
          THREE.MathUtils.lerp(0.45, -0.1, diveP)
        );
        mochi.root.scale.setScalar(Math.max(0.08, 1.15 * (1 - diveP * 0.9)));

        updateMochiRigAnimation(mochi, {
          time: t,
          danger: 0,
          status: 'rescuing',
          happyTimer: 1,
          surprisedTimer: 0,
        });

        if (diveP >= 1 && !completedRef.current) {
          completedRef.current = true;
          onComplete();
          return;
        }
      }

      renderer.render(scene, camera);
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(animId);
      envTex.dispose();
      renderer.dispose();
    };
  }, [onComplete]);

  const handleStageTap = () => {
    soundEngine.unlock();
    if (step === 0) {
      soundEngine.playSpecialBlast('bomb');
      setStep(1);
    } else if (step === 1) {
      soundEngine.playKeyUnlock();
      setStep(2);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-3">
      <div
        onClick={handleStageTap}
        className="relative w-full max-w-[440px] aspect-[440/640] max-h-[86vh] royal-panel-3d rounded-[2rem] overflow-hidden cursor-pointer"
      >
        <canvas ref={canvasRef} className="w-full h-full block" />

        <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between gap-2 pointer-events-none">
          <div className="royal-hud-bar px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold text-amber-200 candy-text-shadow">
            {step === 0
              ? lang === 'bn'
                ? 'ক্যান্ডি সুইচে ট্যাপ করে মোচিকে লাফ দাওয়াও!'
                : 'Tap the 3D Candy Switch to launch Mochi!'
              : lang === 'bn'
                ? 'সোনালি টানেলে ট্যাপ করে মোচিকে ভেতরে পাঠাও!'
                : 'Tap the Golden Portal to enter the maze!'}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              soundEngine.unlock();
              onComplete();
            }}
            className="pointer-events-auto candy-btn-blue px-3.5 py-1.5 rounded-full text-xs font-extrabold text-white flex items-center gap-1"
          >
            <span>{lang === 'bn' ? 'স্কিপ' : 'Skip'}</span>
            <FastForward className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
