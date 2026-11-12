import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Language } from '../types/game';
import { createCandyStudioEnvironment, setupCinematicLights } from '../three/studioEnv';
import { createCandyMesh3D } from '../three/candyMeshes3D';
import { createMochiRig3D, updateMochiRigAnimation } from '../three/mochiCharacter3D';
import { createSerpentRig3D, updateSerpentAlongCurve } from '../three/serpentMonster3D';
import { soundEngine } from '../audio/soundEngine';
import {
  Crown3DIcon,
  Frost3DIcon,
  Star3DIcon,
  Task3DIcon,
} from './ui/CandyIcons3D';
import { CharacterShowcase3DModal } from './CharacterShowcase3DModal';
import { HelpCircle, Map as MapIcon, Play, Rotate3d, Volume2, VolumeX, X, Globe } from 'lucide-react';

interface TitleScreenProps {
  lang: Language;
  soundEnabled: boolean;
  highestLevel: number;
  totalStars: number;
  totalLevels: number;
  onPlayCurrent: () => void;
  onOpenMap: () => void;
  onToggleLang: () => void;
  onToggleSound: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  lang,
  soundEnabled,
  highestLevel,
  totalStars,
  totalLevels,
  onPlayCurrent,
  onOpenMap,
  onToggleLang,
  onToggleSound,
}) => {
  const heroCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const [showShowcase3D, setShowShowcase3D] = useState(false);

  useEffect(() => {
    const canvas = heroCanvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.NeutralToneMapping;
    renderer.toneMappingExposure = 1.04;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#1d4ed8');
    const envTex = createCandyStudioEnvironment(renderer);
    scene.environment = envTex;

    const camera = new THREE.PerspectiveCamera(32, 420 / 245, 0.5, 45);
    camera.position.set(0, 0.35, 7.35);
    camera.lookAt(0, 0.05, 0);

    setupCinematicLights(scene);

    // Vibrant Sunny-Gold & Turquoise Pedestal Stage (Zero bloom haze!)
    const pedestal = new THREE.Mesh(
      new THREE.CylinderGeometry(2.1, 2.35, 0.35, 36),
      new THREE.MeshPhysicalMaterial({
        color: 0xffb703,
        roughness: 0.18,
        metalness: 0.28,
        clearcoat: 0.95,
      })
    );
    pedestal.receiveShadow = true;
    pedestal.position.set(0.82, -1.22, 0);
    scene.add(pedestal);

    // Glowing Portal Arch behind Mochi
    const portalArch = new THREE.Mesh(
      new THREE.TorusGeometry(1.38, 0.14, 14, 36),
      new THREE.MeshPhysicalMaterial({
        color: 0xffcf33,
        metalness: 0.8,
        roughness: 0.16,
        clearcoat: 1,
      })
    );
    portalArch.position.set(0.82, 0.08, -0.85);
    scene.add(portalArch);

    // Subdivision-Sculpted 3D Mochi Heroine
    const mochi = createMochiRig3D();
    mochi.root.scale.setScalar(1.32);
    mochi.root.position.set(0.85, -0.14, 0.32);
    mochi.root.rotation.y = -0.18;
    scene.add(mochi.root);

    // Seamless Continuous Spine-Skinned 3D Sovereign Dragon lunging from the left!
    const serpent = createSerpentRig3D(24, true, 'boss_dragon');
    const serpentCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-4.1, -0.95, -0.75),
      new THREE.Vector3(-2.65, -0.42, -0.15),
      new THREE.Vector3(-1.75, 0.25, 0.25),
      new THREE.Vector3(-0.78, 0.18, 0.65),
    ]);
    scene.add(serpent.root);

    // Orbiting 3D Sculpted Candies Showcase!
    const showcaseSpecs = [
      { c: 'red' as const, s: 'none' as const, x: -2.4, y: 1.15, z: 0.5 },
      { c: 'blue' as const, s: 'wrapped' as const, x: -0.75, y: 1.32, z: 0.45 },
      { c: 'yellow' as const, s: 'striped_h' as const, x: 2.35, y: 1.12, z: 0.5 },
      { c: 'purple' as const, s: 'none' as const, x: 2.55, y: -0.45, z: 0.6 },
      { c: 'green' as const, s: 'rainbow' as const, x: -0.65, y: -1.1, z: 0.9 },
      { c: 'orange' as const, s: 'key' as const, x: 2.1, y: 0.3, z: 0.8 },
    ];

    const floatingCandies = showcaseSpecs.map((sp) => {
      const m = createCandyMesh3D(sp.c, sp.s);
      m.scale.setScalar(0.86);
      m.position.set(sp.x, sp.y, sp.z);
      scene.add(m);
      return { mesh: m, base: sp };
    });

    let animId = 0;
    const renderLoop = (now: number) => {
      const t = now / 1000;
      const w = canvas.clientWidth || 420;
      const h = canvas.clientHeight || 245;
      if (
        canvas.width !== Math.floor(w * renderer.getPixelRatio()) ||
        canvas.height !== Math.floor(h * renderer.getPixelRatio())
      ) {
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      }

      updateMochiRigAnimation(mochi, {
        time: t,
        danger: 25,
        status: 'playing',
        happyTimer: Math.sin(t * 0.9) > 0.35 ? 1 : 0,
        surprisedTimer: 0,
      });

      updateSerpentAlongCurve(
        serpent,
        serpentCurve,
        0.86 + Math.sin(t * 2.2) * 0.06,
        t,
        false,
        true,
        0.82
      );

      floatingCandies.forEach((fc, idx) => {
        fc.mesh.position.y = fc.base.y + Math.sin(t * 2.6 + idx * 1.1) * 0.14;
        const body = fc.mesh.getObjectByName('candyBody');
        if (body) {
          body.rotation.y = t * 1.1 + idx;
          body.rotation.x = Math.sin(t * 1.8 + idx) * 0.2;
        }
      });

      renderer.render(scene, camera);
      animId = requestAnimationFrame(renderLoop);
    };

    animId = requestAnimationFrame(renderLoop);
    return () => {
      cancelAnimationFrame(animId);
      envTex.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-3 sm:p-5 overflow-y-auto">
      {/* Top Status & Settings Bar */}
      <div className="w-full max-w-[440px] flex items-center justify-between mb-3">
        <div className="royal-hud-bar flex items-center gap-2 px-3.5 py-1.5 rounded-full">
          <Star3DIcon size={22} active />
          <span className="text-sm font-extrabold text-amber-200 candy-text-shadow">
            {totalStars} / {totalLevels * 3}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              soundEngine.unlock();
              setShowGuide(true);
            }}
            className="candy-booster-slot p-2 rounded-full text-amber-200"
            title="How to Play"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onToggleSound}
            className="candy-booster-slot p-2 rounded-full text-sky-200"
            title="Sound"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={onToggleLang}
            className="candy-booster-slot px-3 py-1.5 rounded-full text-xs font-extrabold text-amber-200 flex items-center gap-1"
          >
            <Globe className="w-3.5 h-3.5 text-sky-300" />
            <span>{lang === 'bn' ? 'EN' : 'বাংলা'}</span>
          </button>
        </div>
      </div>

      {/* Main Royal 3D Card */}
      <div className="w-full max-w-[440px] royal-panel-3d rounded-[2.2rem] p-5 text-center relative">
        {/* Sculpted Multi-Layered Candy Crest Logo */}
        <div className="inline-block bg-gradient-to-b from-amber-200 via-yellow-400 to-amber-600 p-1.5 rounded-[1.8rem] shadow-2xl mb-3.5 transform -rotate-1">
          <div className="bg-gradient-to-b from-rose-500 via-pink-600 to-rose-900 px-7 py-2.5 rounded-[1.45rem] border-2 border-amber-100/80 shadow-inner">
            <div className="flex items-center justify-center gap-2">
              <Crown3DIcon size={26} />
              <span className="font-candy text-3xl sm:text-4xl font-extrabold tracking-wide text-amber-200 candy-text-shadow leading-none">
                Candy Rescue
              </span>
            </div>
            <div className="text-xs sm:text-sm font-extrabold text-white tracking-widest uppercase mt-1 candy-text-shadow">
              {lang === 'bn' ? 'মোচিকে বাঁচানোর থ্রিডি অ্যাডভেঞ্চার' : '3D MOCHI RESCUE SAGA'}
            </div>
          </div>
        </div>

        {/* Real-Time Three.js 3D Diorama Stage (Click to Open 360° Studio!) */}
        <div
          onClick={() => {
            soundEngine.unlock();
            setShowShowcase3D(true);
          }}
          className="relative w-full rounded-3xl overflow-hidden border-2 border-amber-300/60 shadow-[0_10px_28px_rgba(0,0,0,0.55)] mb-4 bg-[#131c3d] cursor-pointer group"
        >
          <canvas ref={heroCanvasRef} className="w-full h-auto aspect-[420/245] block" />
          <div className="absolute bottom-2 right-2.5 px-2.5 py-1 rounded-full bg-slate-950/75 border border-amber-300/45 text-[11px] font-extrabold text-amber-200 flex items-center gap-1.5 group-hover:scale-105 transition">
            <Rotate3d className="w-3.5 h-3.5 text-sky-300" />
            <span>{lang === 'bn' ? '360° ক্লোজ-আপ দেখুন' : 'Inspect 360°'}</span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-indigo-100/95 mb-5 leading-relaxed px-2 font-medium">
          {lang === 'bn'
            ? 'গ্লসি 3D ক্যান্ডি মিলিয়ে মার্বেল খালি করো, সোনালি চাবি নামাও, লাভা ব্রিজ বানাও এবং ড্রাগনের হাত থেকে মোচিকে বাঁচাও!'
            : 'Match glossy 3D candies to drain marbles, unlock golden gates, build caramel bridges, and rescue Mochi!'}
        </p>

        {/* Prominent 3D Play & Map Buttons */}
        <div className="flex flex-col gap-3.5">
          <button
            type="button"
            onClick={() => {
              soundEngine.unlock();
              onPlayCurrent();
            }}
            className="candy-btn-green py-3.5 px-8 rounded-full font-candy text-2xl font-extrabold text-white candy-text-shadow flex items-center justify-center gap-2.5"
          >
            <Play className="w-6 h-6 fill-current" />
            <span>
              {lang === 'bn' ? `খেলা শুরু • মিশন ${highestLevel}` : `Play Now • Mission ${highestLevel}`}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEngine.unlock();
              onOpenMap();
            }}
            className="candy-btn-orange py-3 px-6 rounded-full font-extrabold text-base text-white candy-text-shadow flex items-center justify-center gap-2"
          >
            <MapIcon className="w-5 h-5" />
            <span>
              {lang === 'bn'
                ? `বিশ্ব সাগা ম্যাপ (${totalLevels}টি মিশন • ১০ চ্যাপ্টার)`
                : `Saga World Map (${totalLevels} Missions • 10 Chapters)`}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEngine.unlock();
              setShowShowcase3D(true);
            }}
            className="py-2.5 px-5 rounded-full font-extrabold text-sm text-amber-100 bg-gradient-to-r from-indigo-900/90 via-purple-800/90 to-rose-900/90 border-2 border-amber-300/50 shadow-lg hover:brightness-110 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Rotate3d className="w-4 h-4 text-amber-300" />
            <span>
              {lang === 'bn'
                ? '3D মোচি ও এনিমি স্টুডিও (360° ক্লোজ-আপ ভিউ)'
                : '3D Mochi & Enemy Studio (360° Close-Up)'}
            </span>
          </button>
        </div>
      </div>

      {showShowcase3D && (
        <CharacterShowcase3DModal lang={lang} onClose={() => setShowShowcase3D(false)} />
      )}

      {/* HOW TO PLAY 3D POPUP */}
      {showGuide && (
        <div className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md royal-panel-3d rounded-[2rem] p-6 relative animate-pop-in">
            <button
              type="button"
              onClick={() => setShowGuide(false)}
              className="absolute top-4 right-4 candy-booster-slot p-1.5 rounded-full text-amber-200"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-2xl font-extrabold text-amber-300 candy-text-shadow mb-4 text-center">
              {lang === 'bn' ? 'কীভাবে মোচিকে বাঁচাবে?' : 'How to Rescue Mochi'}
            </h3>

            <div className="space-y-3 text-xs sm:text-sm text-indigo-50 text-left">
              <div className="flex items-center gap-3 bg-indigo-950/70 p-3 rounded-2xl border border-amber-300/25">
                <Task3DIcon kind="marbles" size={32} />
                <span>
                  {lang === 'bn'
                    ? 'পাশাপাশি ৩ বা তার বেশি 3D ক্যান্ডি মিলিয়ে মার্বেল ও লক বক্স পরিষ্কার করো।'
                    : 'Swipe 3 or more matching 3D candies to break blockers and drain candy marbles.'}
                </span>
              </div>

              <div className="flex items-center gap-3 bg-indigo-950/70 p-3 rounded-2xl border border-amber-300/25">
                <Task3DIcon kind="specials" size={32} />
                <span>
                  {lang === 'bn'
                    ? '৪টি মেলালে স্ট্রাইপড ক্যান্ডি, ২x২ বা L-আকারে র‍্যাপড ক্যান্ডি এবং ৫টিতে রেইনবো বোমা তৈরি হয়!'
                    : 'Match 4 for Striped, 2x2/L for 3D Wrapped Candy, T-shape for Energy Bomb, and 5 for Rainbow Bomb!'}
                </span>
              </div>

              <div className="flex items-center gap-3 bg-indigo-950/70 p-3 rounded-2xl border border-amber-300/25">
                <Task3DIcon kind="keys" size={32} />
                <span>
                  {lang === 'bn'
                    ? 'সোনালি চাবির নিচের ক্যান্ডি মিলিয়ে চাবিগুলো নিচে নামালে উপরের তালা খুলে যাবে।'
                    : 'Clear candies beneath 3D Golden Keys to drop them to the exit row and unlock Mochi’s gates.'}
                </span>
              </div>

              <div className="flex items-center gap-3 bg-indigo-950/70 p-3 rounded-2xl border border-amber-300/25">
                <Frost3DIcon size={32} />
                <span>
                  {lang === 'bn'
                    ? 'বিপদ বাড়লে হাতুড়ি, ফ্রিজ বা শাফল বুস্টার ব্যবহার করে মোচিকে বাঁচাও!'
                    : 'Use Smash Hammer, Frost Freeze, and Shuffle boosters whenever danger gets close!'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowGuide(false)}
              className="mt-5 w-full candy-btn-green py-3 rounded-full font-extrabold text-lg text-white candy-text-shadow"
            >
              {lang === 'bn' ? 'চলো শুরু করি!' : 'Let’s Rescue Mochi!'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
