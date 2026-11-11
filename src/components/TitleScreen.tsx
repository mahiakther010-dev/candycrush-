import React, { useEffect, useRef, useState } from 'react';
import { Language } from '../types/game';
import { drawCandyPiece } from '../engine/candyArt';
import { drawBlueBrickWall, drawMochiCharacter, drawSerpentMonster } from '../engine/rescueRenderer';
import { soundEngine } from '../audio/soundEngine';
import { HelpCircle, Map as MapIcon, Volume2, VolumeX, X } from 'lucide-react';

interface TitleScreenProps {
  lang: Language;
  soundEnabled: boolean;
  highestLevel: number;
  totalStars: number;
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
  onPlayCurrent,
  onOpenMap,
  onToggleLang,
  onToggleSound,
}) => {
  const heroCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    const canvas = heroCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    const loop = (now: number) => {
      const t = now / 1000;
      const dpr = window.devicePixelRatio || 1;
      const W = 400;
      const H = 220;
      if (canvas.width !== W * dpr || canvas.height !== H * dpr) {
        canvas.width = W * dpr;
        canvas.height = H * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, W, H);

      drawBlueBrickWall(ctx, 4, 4, W - 8, H - 8);

      // Orange tunnel frame
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 10;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(26, H - 34);
      ctx.lineTo(W - 26, H - 34);
      ctx.stroke();

      // Slithering green monster chasing from left
      drawSerpentMonster(
        ctx,
        [
          { x: 24, y: H - 64 },
          { x: 185 + Math.sin(t * 2) * 14, y: H - 64 },
        ],
        1,
        t,
        { bodyLength: 155 }
      );

      // Mochi hopping excitedly on the right!
      drawMochiCharacter(
        ctx,
        295,
        H - 68,
        1.22,
        62,
        'playing',
        t,
        lang === 'bn' ? 'আমাকে বাঁচাও!' : 'Save Me!'
      );

      // Floating 3D candies around top
      const floatCandies = [
        { x: 58, y: 48, c: 'red' as const, s: 'none' as const },
        { x: 132, y: 38, c: 'yellow' as const, s: 'striped_h' as const },
        { x: 215, y: 42, c: 'blue' as const, s: 'rainbow' as const },
        { x: 348, y: 52, c: 'green' as const, s: 'key' as const },
      ];
      floatCandies.forEach((fc, idx) => {
        drawCandyPiece(
          ctx,
          fc.x,
          fc.y + Math.sin(t * 3 + idx * 1.3) * 6,
          18,
          fc.c,
          fc.s,
          t
        );
      });

      ctx.restore();
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [lang]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-4 overflow-y-auto">
      {/* Top Controls */}
      <div className="w-full max-w-[420px] flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 bg-slate-900/80 border border-amber-400/35 px-3 py-1 rounded-full text-xs font-bold text-amber-300">
          <span>⭐ {totalStars} / 18</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              soundEngine.unlock();
              setShowGuide(true);
            }}
            className="p-2 rounded-full bg-slate-900/85 hover:bg-slate-800 border border-white/15 text-amber-300"
            title="How to Play"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onToggleSound}
            className="p-2 rounded-full bg-slate-900/85 hover:bg-slate-800 border border-white/15 text-sky-300"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={onToggleLang}
            className="px-3 py-1.5 rounded-full bg-slate-900/85 hover:bg-slate-800 border border-white/15 text-xs font-bold text-amber-200"
          >
            {lang === 'bn' ? 'English' : 'বাংলা'}
          </button>
        </div>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-[420px] bg-gradient-to-b from-[#1e3252]/95 to-[#0d1729]/95 border-2 border-amber-400/60 rounded-[2rem] p-5 shadow-2xl text-center">
        {/* Candy Logo Crest */}
        <div className="inline-block bg-gradient-to-b from-amber-200 via-amber-400 to-orange-500 p-1 rounded-3xl shadow-xl mb-3 transform -rotate-1">
          <div className="bg-gradient-to-b from-rose-600 via-red-600 to-rose-900 px-6 py-2.5 rounded-[1.3rem] border-2 border-amber-100/70">
            <div className="font-candy text-3xl sm:text-4xl font-extrabold tracking-wide text-amber-200 candy-text-shadow leading-none">
              Candy Rescue
            </div>
            <div className="text-xs sm:text-sm font-extrabold text-white tracking-widest uppercase mt-0.5">
              {lang === 'bn' ? 'মোচিকে বাঁচানোর মিশন!' : 'SAVE MOCHI SAGA'}
            </div>
          </div>
        </div>

        {/* Live Animated Preview Scene */}
        <div className="w-full rounded-2xl overflow-hidden shadow-inner mb-4 border border-amber-400/30">
          <canvas ref={heroCanvasRef} className="w-full h-auto aspect-[400/220] block" />
        </div>

        <p className="text-xs sm:text-sm text-slate-200 mb-5 leading-relaxed px-1">
          {lang === 'bn'
            ? 'ক্যান্ডি মিলিয়ে মার্বেল খালি করো, সোনালি চাবি নামাও, ব্রিজ বানাও এবং ভয়ংকর সবুজ ড্রাগনের হাত থেকে মোচিকে বাঁচাও!'
            : 'Match candies to drain marbles, drop golden keys, build bridges, and rescue cute Mochi before the giant Serpent strikes!'}
        </p>

        {/* Glossy Green PLAY NOW CTA (just like the reference end-card!) */}
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => {
              soundEngine.unlock();
              onPlayCurrent();
            }}
            className="candy-btn-green py-3.5 px-8 rounded-full font-candy text-2xl font-extrabold text-white candy-text-shadow tracking-wide"
          >
            {lang === 'bn' ? `Play Now • মিশন ${highestLevel}` : `Play Now • Mission ${highestLevel}`}
          </button>

          <button
            type="button"
            onClick={() => {
              soundEngine.unlock();
              onOpenMap();
            }}
            className="candy-btn-orange py-2.5 px-6 rounded-full font-bold text-base text-white flex items-center justify-center gap-2"
          >
            <MapIcon className="w-4 h-4" />
            {lang === 'bn' ? 'সবগুলো রেসকিউ টাস্ক দেখো (৬টি মিশন)' : 'All Rescue Tasks (6 Missions)'}
          </button>
        </div>
      </div>

      {/* HOW TO PLAY MODAL */}
      {showGuide && (
        <div className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border-2 border-amber-400 rounded-3xl p-5 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setShowGuide(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-300 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-xl font-extrabold text-amber-300 mb-3">
              {lang === 'bn' ? '🎮 কীভাবে মোচিকে বাঁচাবে?' : '🎮 How to Rescue Mochi'}
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-200 text-left">
              <li className="bg-slate-800/70 p-2.5 rounded-xl border border-white/10">
                🍬{' '}
                {lang === 'bn'
                  ? 'পাশাপাশি ৩ বা তার বেশি একই রঙের ক্যান্ডি সোয়াইপ করে মেলাও।'
                  : 'Swipe adjacent candies to match 3 or more of the same color.'}
              </li>
              <li className="bg-slate-800/70 p-2.5 rounded-xl border border-white/10">
                ⚡{' '}
                {lang === 'bn'
                  ? '৪টি ক্যান্ডি মেলালে স্ট্রাইপড ব্লাস্ট এবং ৫টি মেলালে রেইনবো কালার বোমা তৈরি হবে!'
                  : 'Match 4 for a Striped Laser Candy, L/T for a Bomb, and 5 for a Rainbow Color Bomb!'}
              </li>
              <li className="bg-slate-800/70 p-2.5 rounded-xl border border-white/10">
                🗝️{' '}
                {lang === 'bn'
                  ? 'প্রতিটি লেভেলে আলাদা টাস্ক থাকে—মার্বেল সরানো, সোনালি চাবি নিচে নামানো, লাভা ব্রিজ তৈরি বা আইস ক্যানন চার্জ করা!'
                  : 'Each mission has unique rescue tasks: drain marbles, drop keys, build lava bridges, or fire frost turrets!'}
              </li>
              <li className="bg-slate-800/70 p-2.5 rounded-xl border border-white/10">
                🐊{' '}
                {lang === 'bn'
                  ? 'উপরের Danger Bar ১০০% হওয়ার আগেই সব টাস্ক শেষ করে মোচিকে সেফ গেটে পৌঁছে দাও!'
                  : 'Finish all rescue tasks before the monster danger meter hits 100%!'}
              </li>
            </ul>
            <button
              type="button"
              onClick={() => setShowGuide(false)}
              className="mt-4 w-full candy-btn-green py-2.5 rounded-full font-extrabold text-white"
            >
              {lang === 'bn' ? 'বুঝেছি! চলো খেলি' : 'Got it! Let’s Rescue!'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
