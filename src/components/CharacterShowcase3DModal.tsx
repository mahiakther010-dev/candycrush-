import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { Language } from '../types/game';
import { createCandyStudioEnvironment, setupCinematicLights } from '../three/studioEnv';
import { createMochiRig3D, updateMochiRigAnimation } from '../three/mochiCharacter3D';
import {
  createJuggernautBeastRig3D,
  createMagmaGolemRig3D,
  createSerpentRig3D,
  updateMagmaGolemAnimation,
  updateSerpentAlongCurve,
} from '../three/serpentMonster3D';
import { Rotate3d, Snowflake, Sparkles, X, ZoomIn, ZoomOut } from 'lucide-react';

type ActorTab =
  | 'mochi'
  | 'boss_dragon'
  | 'venom_naga'
  | 'frost_wyrm'
  | 'magma_golem'
  | 'juggernaut';

type MochiPose = 'idle' | 'panic' | 'run' | 'victory';

interface CharacterShowcase3DModalProps {
  lang: Language;
  onClose: () => void;
}

export const CharacterShowcase3DModal: React.FC<CharacterShowcase3DModalProps> = ({
  lang,
  onClose,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activeActor, setActiveActor] = useState<ActorTab>('mochi');
  const [mochiPose, setMochiPose] = useState<MochiPose>('idle');
  const [freezeEnemy, setFreezeEnemy] = useState<boolean>(false);
  const [zoomDist, setZoomDist] = useState<number>(3.65);

  const actorRef = useRef<ActorTab>(activeActor);
  const poseRef = useRef<MochiPose>(mochiPose);
  const freezeRef = useRef<boolean>(freezeEnemy);
  const zoomRef = useRef<number>(zoomDist);
  const yawRef = useRef<number>(0.18);
  const pitchRef = useRef<number>(0.08);
  const draggingRef = useRef<{ active: boolean; lastX: number; lastY: number }>({
    active: false,
    lastX: 0,
    lastY: 0,
  });

  useEffect(() => {
    actorRef.current = activeActor;
    yawRef.current = activeActor === 'mochi' ? 0.14 : -0.35;
    pitchRef.current = 0.08;
  }, [activeActor]);

  useEffect(() => {
    poseRef.current = mochiPose;
  }, [mochiPose]);

  useEffect(() => {
    freezeRef.current = freezeEnemy;
  }, [freezeEnemy]);

  useEffect(() => {
    zoomRef.current = zoomDist;
  }, [zoomDist]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0d1429');
    const envTex = createCandyStudioEnvironment(renderer);
    scene.environment = envTex;

    const camera = new THREE.PerspectiveCamera(34, 420 / 340, 0.3, 40);
    setupCinematicLights(scene);

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(new UnrealBloomPass(new THREE.Vector2(420, 340), 0.3, 0.5, 0.88));
    composer.addPass(new OutputPass());

    // Luxury Turntable Pedestal
    const turntable = new THREE.Group();
    scene.add(turntable);

    const baseDisc = new THREE.Mesh(
      new THREE.CylinderGeometry(1.42, 1.58, 0.16, 48),
      new THREE.MeshPhysicalMaterial({
        color: 0x1e293b,
        roughness: 0.18,
        metalness: 0.55,
        clearcoat: 1.0,
      })
    );
    baseDisc.receiveShadow = true;
    baseDisc.position.y = -0.92;
    turntable.add(baseDisc);

    const goldTrim = new THREE.Mesh(
      new THREE.TorusGeometry(1.45, 0.035, 12, 48),
      new THREE.MeshPhysicalMaterial({
        color: 0xffd447,
        emissive: 0x5c3800,
        roughness: 0.12,
        metalness: 0.92,
        clearcoat: 1.0,
      })
    );
    goldTrim.rotation.x = Math.PI * 0.5;
    goldTrim.position.y = -0.85;
    turntable.add(goldTrim);

    // Instantiate all studio 3D rigs once inside turntable
    const mochi = createMochiRig3D();
    mochi.root.scale.setScalar(1.08);
    mochi.root.position.y = -0.02;
    turntable.add(mochi.root);

    const sCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.35, -0.58, -0.95),
      new THREE.Vector3(0.95, -0.45, -0.45),
      new THREE.Vector3(-0.75, -0.1, 0.05),
      new THREE.Vector3(0.35, 0.32, 0.52),
      new THREE.Vector3(0.05, 0.42, 0.92),
    ]);

    const bossDragon = createSerpentRig3D(24, true, 'boss_dragon');
    const venomNaga = createSerpentRig3D(22, false, 'venom_naga');
    const frostWyrm = createSerpentRig3D(22, false, 'frost_wyrm');
    turntable.add(bossDragon.root, venomNaga.root, frostWyrm.root);

    const magmaGolem = createMagmaGolemRig3D();
    magmaGolem.root.scale.setScalar(0.95);
    magmaGolem.root.rotation.y = -Math.PI * 0.42;
    magmaGolem.root.position.set(0, -0.15, 0);
    turntable.add(magmaGolem.root);

    const juggernaut = createJuggernautBeastRig3D();
    juggernaut.root.scale.setScalar(0.92);
    juggernaut.root.position.set(0, 0.02, 0);
    turntable.add(juggernaut.root);

    let animId = 0;
    let last = performance.now();

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const t = now / 1000;

      const w = canvas.clientWidth || 420;
      const h = canvas.clientHeight || 340;
      if (
        canvas.width !== Math.floor(w * renderer.getPixelRatio()) ||
        canvas.height !== Math.floor(h * renderer.getPixelRatio())
      ) {
        renderer.setSize(w, h, false);
        composer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      }

      if (!draggingRef.current.active) {
        yawRef.current += dt * 0.28; // Gentle showcase turntable rotation when idle
      }
      turntable.rotation.y = yawRef.current;

      const dist = zoomRef.current;
      camera.position.set(
        0,
        0.15 + Math.sin(pitchRef.current) * dist * 0.45,
        Math.cos(pitchRef.current) * dist
      );
      camera.lookAt(0, 0.02, 0);

      const cur = actorRef.current;
      const isFrz = freezeRef.current;

      mochi.root.visible = cur === 'mochi';
      bossDragon.root.visible = cur === 'boss_dragon';
      venomNaga.root.visible = cur === 'venom_naga';
      frostWyrm.root.visible = cur === 'frost_wyrm';
      magmaGolem.root.visible = cur === 'magma_golem';
      juggernaut.root.visible = cur === 'juggernaut';

      if (cur === 'mochi') {
        const p = poseRef.current;
        updateMochiRigAnimation(mochi, {
          time: t,
          danger: p === 'panic' ? 85 : 12,
          status: p === 'victory' ? 'won' : 'playing',
          happyTimer: p === 'victory' ? 1 : 0,
          surprisedTimer: p === 'panic' ? 1 : 0,
          isMoving: p === 'run',
          poseOverride: p,
        });
      } else if (cur === 'boss_dragon') {
        updateSerpentAlongCurve(bossDragon, sCurve, 0.92, t, isFrz, true, 0.92);
      } else if (cur === 'venom_naga') {
        updateSerpentAlongCurve(venomNaga, sCurve, 0.92, t, isFrz, false, 0.92);
      } else if (cur === 'frost_wyrm') {
        updateSerpentAlongCurve(frostWyrm, sCurve, 0.92, t, isFrz, false, 0.92);
      } else if (cur === 'magma_golem') {
        updateMagmaGolemAnimation(magmaGolem, t, isFrz);
      } else if (cur === 'juggernaut') {
        juggernaut.armorMat.color.setHex(isFrz ? 0x38bdf8 : 0xbe123c);
        if (!isFrz) juggernaut.wheelBody.rotation.z -= dt * 3.8;
      }

      composer.render();
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(animId);
      composer.dispose();
      envTex.dispose();
      renderer.dispose();
    };
  }, []);

  const actorTabs: Array<{ id: ActorTab; bn: string; en: string }> = [
    { id: 'mochi', bn: 'মোচি (Heroine)', en: 'Mochi (3D Heroine)' },
    { id: 'boss_dragon', bn: 'ড্রাগন কিং বস', en: 'Dragon King Boss' },
    { id: 'venom_naga', bn: 'ভেনম নাগা সর্প', en: 'Venom Naga Viper' },
    { id: 'frost_wyrm', bn: 'ফ্রস্ট ওয়ার্ম', en: 'Glacier Frost Wyrm' },
    { id: 'magma_golem', bn: 'ম্যাগমা গোলেম', en: 'Magma Crusher Golem' },
    { id: 'juggernaut', bn: 'জাগারনট বিস্ট', en: 'Armored Juggernaut' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3">
      <div className="royal-modal-panel w-full max-w-[460px] rounded-3xl p-4 text-white shadow-2xl border border-amber-300/35">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-300" />
            <h2 className="text-base sm:text-lg font-black text-amber-200 candy-text-shadow">
              {lang === 'bn' ? '3D মোচি ও এনিমি স্টুডিও (360°)' : '3D Mochi & Enemy Studio (360°)'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full bg-rose-500/80 hover:bg-rose-500 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Actor Selector Pills */}
        <div className="grid grid-cols-3 gap-1.5 mb-2.5">
          {actorTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveActor(tab.id)}
              className={`px-2 py-1.5 rounded-xl text-[11px] font-extrabold transition cursor-pointer border ${
                activeActor === tab.id
                  ? 'bg-gradient-to-b from-amber-300 to-amber-500 text-slate-950 border-white shadow-md'
                  : 'bg-slate-900/75 text-slate-200 border-white/15 hover:bg-slate-800'
              }`}
            >
              {lang === 'bn' ? tab.bn : tab.en}
            </button>
          ))}
        </div>

        {/* Interactive 360° WebGL Viewport */}
        <div className="relative w-full h-[300px] sm:h-[330px] rounded-2xl overflow-hidden border-2 border-amber-300/40 bg-slate-950 shadow-inner">
          <canvas
            ref={canvasRef}
            onPointerDown={(e) => {
              draggingRef.current = { active: true, lastX: e.clientX, lastY: e.clientY };
              e.currentTarget.setPointerCapture(e.pointerId);
            }}
            onPointerMove={(e) => {
              if (!draggingRef.current.active) return;
              const dx = e.clientX - draggingRef.current.lastX;
              const dy = e.clientY - draggingRef.current.lastY;
              draggingRef.current.lastX = e.clientX;
              draggingRef.current.lastY = e.clientY;
              yawRef.current += dx * 0.012;
              pitchRef.current = Math.max(-0.35, Math.min(0.55, pitchRef.current + dy * 0.008));
            }}
            onPointerUp={() => {
              draggingRef.current.active = false;
            }}
            onPointerCancel={() => {
              draggingRef.current.active = false;
            }}
            className="w-full h-full block touch-none cursor-grab active:cursor-grabbing"
          />

          <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-slate-950/70 border border-white/15 flex items-center gap-1.5 text-[11px] text-amber-200 pointer-events-none">
            <Rotate3d className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'আঙুল/মাউস টেনে ৩৬০° ঘোরান' : 'Drag to Rotate 360°'}</span>
          </div>

          <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5">
            <button
              type="button"
              onClick={() => setZoomDist((d) => Math.max(2.1, d - 0.45))}
              className="p-1.5 rounded-lg bg-slate-900/80 border border-white/20 hover:bg-slate-800 cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4 text-amber-200" />
            </button>
            <button
              type="button"
              onClick={() => setZoomDist((d) => Math.min(5.2, d + 0.45))}
              className="p-1.5 rounded-lg bg-slate-900/80 border border-white/20 hover:bg-slate-800 cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4 text-amber-200" />
            </button>
          </div>
        </div>

        {/* Pose / Freeze Controls */}
        <div className="mt-3 flex items-center justify-between gap-2 flex-wrap">
          {activeActor === 'mochi' ? (
            <div className="grid grid-cols-4 gap-1.5 w-full">
              {(
                [
                  { id: 'idle', bn: 'আইডল', en: 'Idle' },
                  { id: 'panic', bn: 'ভয় / বিপদ', en: 'Panic!' },
                  { id: 'run', bn: 'দৌড়ানো', en: 'Run' },
                  { id: 'victory', bn: 'বিজয় উল্লাস', en: 'Victory' },
                ] as const
              ).map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setMochiPose(p.id)}
                  className={`py-1.5 rounded-xl text-xs font-extrabold border transition cursor-pointer ${
                    mochiPose === p.id
                      ? 'bg-pink-500 text-white border-pink-200 shadow'
                      : 'bg-slate-900/70 text-slate-200 border-white/15'
                  }`}
                >
                  {lang === 'bn' ? p.bn : p.en}
                </button>
              ))}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setFreezeEnemy((f) => !f)}
              className={`w-full py-2 rounded-xl text-xs font-extrabold border flex items-center justify-center gap-2 transition cursor-pointer ${
                freezeEnemy
                  ? 'bg-sky-500 text-slate-950 border-sky-100 shadow'
                  : 'bg-slate-900/75 text-sky-200 border-sky-400/35 hover:bg-slate-800'
              }`}
            >
              <Snowflake className="w-4 h-4" />
              <span>
                {freezeEnemy
                  ? lang === 'bn'
                    ? 'বরফ অবস্থা সক্রিয় (ট্যাপ করে স্বাভাবিক করুন)'
                    : 'Ice-Frozen State Active (Tap to Thaw)'
                  : lang === 'bn'
                    ? 'ফ্রিজ বুস্টার ইফেক্ট টেস্ট করুন'
                    : 'Test Freeze Booster Ice Effect'}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
