import React, { useEffect, useRef, useState } from 'react';
import { Language } from '../types/game';
import { drawCandyPiece, drawHintHand } from '../engine/candyArt';
import { drawBlueBrickWall, drawMochiCharacter } from '../engine/rescueRenderer';
import { soundEngine } from '../audio/soundEngine';

interface IntroCutsceneProps {
  lang: Language;
  onComplete: () => void;
}

export const IntroCutscene: React.FC<IntroCutsceneProps> = ({ lang, onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const stepProgressRef = useRef(0);

  useEffect(() => {
    stepProgressRef.current = 0;
  }, [step]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let lastTime = performance.now();

    const render = (now: number) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;
      const t = now / 1000;
      stepProgressRef.current += dt;

      const dpr = window.devicePixelRatio || 1;
      const W = 440;
      const H = 640;
      if (canvas.width !== W * dpr || canvas.height !== H * dpr) {
        canvas.width = W * dpr;
        canvas.height = H * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, W, H);

      drawBlueBrickWall(ctx, 8, 8, W - 16, H - 16);

      // Warm glowing portal at bottom-left (like Frame 1!)
      const glow = ctx.createRadialGradient(30, H - 120, 10, 30, H - 120, 130);
      glow.addColorStop(0, 'rgba(255, 237, 160, 0.95)');
      glow.addColorStop(0.5, 'rgba(251, 146, 60, 0.45)');
      glow.addColorStop(1, 'rgba(251, 146, 60, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(8, H - 250, 180, 230);

      // Orange diagonal ramp (Frame 1)
      ctx.save();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 16;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(95, H - 140);
      ctx.lineTo(W - 16, H - 90);
      ctx.stroke();
      ctx.restore();

      // Menacing Green Croc Snout peeking from bottom-right!
      ctx.save();
      ctx.translate(W - 42 + Math.sin(t * 5) * 6, H - 128);
      ctx.rotate(Math.PI);
      ctx.fillStyle = '#4d9c11';
      ctx.strokeStyle = '#143302';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(0, -18, 66, 26, 10);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#fff';
      for (const tx of [14, 28, 42]) {
        ctx.beginPath();
        ctx.moveTo(tx, 8);
        ctx.lineTo(tx + 4, 16);
        ctx.lineTo(tx + 8, 8);
        ctx.fill();
      }
      ctx.beginPath();
      ctx.arc(18, -10, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#fde047';
      ctx.fill();
      ctx.fillStyle = '#7f1d1d';
      ctx.fillRect(17, -14, 2.5, 8);
      ctx.restore();

      // Step 0: Tap the 3x3 Mini Candy Switch on the wall! (Frame 2)
      if (step === 0) {
        const padX = 86;
        const padY = 195;
        ctx.save();
        ctx.translate(padX, padY);
        ctx.transform(1, 0.14, 0, 1, 0, 0);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.roundRect(-62, -62, 124, 124, 14);
        ctx.fill();
        ctx.stroke();

        const miniColors = [
          'green',
          'orange',
          'red',
          'yellow',
          'green',
          'orange',
          'blue',
          'green',
          'red',
        ] as const;
        for (let r = 0; r < 3; r++) {
          for (let c = 0; c < 3; c++) {
            drawCandyPiece(
              ctx,
              (c - 1) * 36,
              (r - 1) * 36,
              15,
              miniColors[r * 3 + c],
              'none',
              t,
              c === 1 && r === 1
            );
          }
        }
        ctx.restore();

        drawHintHand(ctx, padX + 12, padY + 18, t);

        drawMochiCharacter(
          ctx,
          245,
          H - 142,
          1.22,
          75,
          'playing',
          t,
          lang === 'bn' ? 'সুইচে ট্যাপ করো!' : 'Tap Switch!'
        );
      }

      // Step 1: Mochi launches up into the air! Tap the Orange Tunnel! (Frame 3)
      else if (step === 1) {
        const jumpP = Math.min(1, stepProgressRef.current * 1.8);
        const mochiX = 245 + (285 - 245) * jumpP;
        const mochiY = H - 142 - Math.sin(jumpP * Math.PI * 0.65) * 260;

        // Glowing Orange Tunnel Entrance on wall!
        const tunX = 148;
        const tunY = 205;
        ctx.save();
        ctx.translate(tunX, tunY);
        ctx.fillStyle = '#7c2d12';
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.roundRect(-52, -46, 104, 92, 12);
        ctx.fill();
        ctx.stroke();

        const innerGlow = ctx.createRadialGradient(0, 0, 6, 0, 0, 48);
        innerGlow.addColorStop(0, 'rgba(254, 240, 138, 0.85)');
        innerGlow.addColorStop(1, 'rgba(234, 88, 12, 0.15)');
        ctx.fillStyle = innerGlow;
        ctx.fillRect(-46, -40, 92, 80);
        ctx.restore();

        drawHintHand(ctx, tunX + 14, tunY + 20, t);
        drawMochiCharacter(
          ctx,
          mochiX,
          mochiY,
          1.28,
          55,
          'playing',
          t,
          lang === 'bn' ? 'টানেলে ঢোকাও!' : 'Enter Tunnel!'
        );
      }

      // Step 2: Mochi dives into tunnel -> Start Game!
      else {
        const diveP = Math.min(1, stepProgressRef.current * 2.4);
        const tunX = 148;
        const tunY = 205;
        ctx.save();
        ctx.translate(tunX, tunY);
        ctx.fillStyle = '#7c2d12';
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.roundRect(-52, -46, 104, 92, 12);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        const mx = 285 + (tunX - 285) * diveP;
        const my = 225 + (tunY - 225) * diveP;
        const sc = Math.max(0.15, 1.25 * (1 - diveP * 0.85));
        drawMochiCharacter(ctx, mx, my, sc, 30, 'rescuing', t);

        if (diveP >= 1) {
          onComplete();
          ctx.restore();
          return;
        }
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [step, lang, onComplete]);

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
    <div className="relative w-full h-full flex flex-col items-center justify-center p-2">
      <div className="relative w-full max-w-[430px] aspect-[440/640] max-h-[82vh] rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-400/50 cursor-pointer" onClick={handleStageTap}>
        <canvas ref={canvasRef} className="w-full h-full block" />

        {/* Top Banner & Skip */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
          <div className="bg-slate-950/80 backdrop-blur-md border border-amber-400/40 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold text-amber-200 shadow-lg">
            {step === 0
              ? lang === 'bn'
                ? '⚡ ক্যান্ডি সুইচে ট্যাপ করে মোচিকে লাফ দাওয়াও!'
                : '⚡ Tap the Candy Switch to launch Mochi!'
              : lang === 'bn'
                ? '🚪 কমলা টানেলে ট্যাপ করে মোচিকে ভেতরে পাঠাও!'
                : '🚪 Tap the Orange Tunnel to hide Mochi!'}
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              soundEngine.unlock();
              onComplete();
            }}
            className="pointer-events-auto bg-slate-900/85 hover:bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/20 shadow"
          >
            {lang === 'bn' ? 'স্কিপ ⏭' : 'Skip ⏭'}
          </button>
        </div>
      </div>
    </div>
  );
};
