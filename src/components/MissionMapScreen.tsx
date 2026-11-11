import React, { useState } from 'react';
import { LEVELS } from '../data/levels';
import { Language, LevelConfig, PlayerSaveData } from '../types/game';
import { soundEngine } from '../audio/soundEngine';
import { Crown3DIcon, Star3DIcon, Task3DIcon } from './ui/CandyIcons3D';
import { ArrowLeft, Lock, Play, Unlock, X } from 'lucide-react';

interface MissionMapScreenProps {
  lang: Language;
  saveData: PlayerSaveData;
  onSelectLevel: (levelId: number) => void;
  onUnlockAll: () => void;
  onBackHome: () => void;
}

const NODE_COORDS = [
  { x: 50, y: 86, zoneEn: 'Sugar Gate', zoneBn: 'সুগার গেট' },
  { x: 24, y: 71, zoneEn: 'Caramel Lava', zoneBn: 'ক্যারামেল লাভা' },
  { x: 76, y: 56, zoneEn: 'Key Cavern', zoneBn: 'রহস্য গুহা' },
  { x: 26, y: 41, zoneEn: 'Frost Peaks', zoneBn: 'বরফ চূড়া' },
  { x: 74, y: 26, zoneEn: 'Boulder Ridge', zoneBn: 'বোল্ডার পাহাড়' },
  { x: 50, y: 10, zoneEn: 'King’s Citadel', zoneBn: 'ড্রাগন দুর্গ' },
];

export const MissionMapScreen: React.FC<MissionMapScreenProps> = ({
  lang,
  saveData,
  onSelectLevel,
  onUnlockAll,
  onBackHome,
}) => {
  const [selectedBriefing, setSelectedBriefing] = useState<LevelConfig | null>(null);

  return (
    <div className="w-full h-full flex flex-col items-center p-3 sm:p-4 overflow-hidden">
      {/* Top Royal Navigation Bar */}
      <div className="w-full max-w-[460px] royal-hud-bar rounded-2xl px-3.5 py-2.5 mb-3 flex items-center justify-between z-10">
        <button
          type="button"
          onClick={() => {
            soundEngine.unlock();
            onBackHome();
          }}
          className="candy-booster-slot px-3 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold text-amber-200 flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'bn' ? 'হোম' : 'Menu'}</span>
        </button>

        <h1 className="text-base sm:text-lg font-extrabold text-amber-300 candy-text-shadow">
          {lang === 'bn' ? 'ফ্যান্টাসি ক্যান্ডি ম্যাপ' : 'Candy Kingdom Map'}
        </h1>

        {saveData.unlockedLevel < LEVELS.length ? (
          <button
            type="button"
            onClick={() => {
              soundEngine.unlock();
              onUnlockAll();
            }}
            className="candy-btn-orange px-3 py-1.5 rounded-xl text-xs font-extrabold text-white flex items-center gap-1"
          >
            <Unlock className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'সব আনলক' : 'Unlock All'}</span>
          </button>
        ) : (
          <div className="flex items-center gap-1 bg-emerald-500/20 border border-emerald-400/50 px-2.5 py-1 rounded-full text-xs font-extrabold text-emerald-300">
            <span>6 / 6</span>
          </div>
        )}
      </div>

      {/* Fantasy Candy Trail Map Canvas */}
      <div className="relative w-full max-w-[460px] flex-1 royal-panel-3d rounded-[2.2rem] overflow-hidden">
        {/* Enchanted Fantasy Gradient Sky + Floating Candy Clouds */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 50% 10%, #4c1d95 0%, #1e3a8a 42%, #0f172a 100%)',
          }}
        />
        <div className="absolute top-6 left-6 w-24 h-10 rounded-full bg-pink-400/15 blur-xl pointer-events-none" />
        <div className="absolute top-1/3 right-4 w-32 h-14 rounded-full bg-amber-400/15 blur-xl pointer-events-none" />
        <div className="absolute bottom-10 left-8 w-36 h-14 rounded-full bg-emerald-400/15 blur-xl pointer-events-none" />

        {/* Winding SVG Golden Kingdom Path */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          <defs>
            <linearGradient id="roadGlow" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="50%" stopColor="#FB923C" />
              <stop offset="100%" stopColor="#C084FC" />
            </linearGradient>
          </defs>
          <path
            d="M 50 86 C 35 80, 18 78, 24 71 C 32 62, 72 64, 76 56 C 80 48, 22 49, 26 41 C 30 33, 76 34, 74 26 C 72 18, 56 16, 50 10"
            fill="none"
            stroke="rgba(15, 23, 42, 0.7)"
            strokeWidth="3.6"
            strokeLinecap="round"
          />
          <path
            d="M 50 86 C 35 80, 18 78, 24 71 C 32 62, 72 64, 76 56 C 80 48, 22 49, 26 41 C 30 33, 76 34, 74 26 C 72 18, 56 16, 50 10"
            fill="none"
            stroke="url(#roadGlow)"
            strokeWidth="1.7"
            strokeDasharray="3 2"
            strokeLinecap="round"
          />
        </svg>

        {/* 6 Interactive 3D Level Nodes (Bottom-to-Top Saga Progression) */}
        {LEVELS.map((lvl, idx) => {
          const coord = NODE_COORDS[idx];
          const isUnlocked = lvl.id <= saveData.unlockedLevel;
          const isCurrent = lvl.id === saveData.unlockedLevel;
          const isBoss = lvl.id === 6;
          const stars = saveData.starsByLevel[lvl.id] ?? 0;

          return (
            <button
              key={lvl.id}
              type="button"
              onClick={() => {
                soundEngine.unlock();
                if (isUnlocked) {
                  setSelectedBriefing(lvl);
                }
              }}
              style={{ left: `${coord.x}%`, top: `${coord.y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group focus:outline-none ${
                isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed opacity-75'
              }`}
            >
              {/* Boss Crown above Mission 6 */}
              {isBoss && (
                <div className="mb-0.5 animate-float">
                  <Crown3DIcon size={26} />
                </div>
              )}

              {/* Pulsing Halo for Current Active Mission */}
              <div className="relative flex items-center justify-center">
                {isCurrent && (
                  <span className="absolute -inset-2.5 rounded-full bg-amber-400/40 animate-ping" />
                )}

                <div
                  className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center border-3 shadow-xl transition-transform group-hover:scale-110 ${
                    !isUnlocked
                      ? 'bg-gradient-to-b from-slate-600 to-slate-800 border-slate-400 shadow-[0_5px_0_#1e293b]'
                      : isBoss
                        ? 'bg-gradient-to-b from-fuchsia-400 via-purple-600 to-indigo-900 border-amber-300 shadow-[0_6px_0_#4c1d95]'
                        : isCurrent
                          ? 'candy-btn-green'
                          : 'candy-btn-orange'
                  }`}
                >
                  {isUnlocked ? (
                    <span className="font-candy text-2xl font-extrabold text-white candy-text-shadow">
                      {lvl.id}
                    </span>
                  ) : (
                    <Lock className="w-5 h-5 text-slate-300" />
                  )}
                </div>
              </div>

              {/* Zone Banner + 3D Stars */}
              <div className="mt-1 bg-slate-950/85 border border-amber-300/40 px-2.5 py-0.5 rounded-full shadow-md flex flex-col items-center">
                <span className="text-[10px] sm:text-[11px] font-extrabold text-amber-200 whitespace-nowrap">
                  {lang === 'bn' ? coord.zoneBn : coord.zoneEn}
                </span>
                <div className="flex items-center gap-0.5 -mt-0.5">
                  {[1, 2, 3].map((s) => (
                    <Star3DIcon key={s} size={13} active={s <= stars} />
                  ))}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* MISSION INTRODUCTION BRIEFING POPUP */}
      {selectedBriefing && (
        <div className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm royal-panel-3d rounded-[2.2rem] p-6 text-center relative animate-pop-in">
            <button
              type="button"
              onClick={() => setSelectedBriefing(null)}
              className="absolute top-4 right-4 candy-booster-slot p-1.5 rounded-full text-amber-200"
            >
              <X className="w-4 h-4" />
            </button>

            {selectedBriefing.id === 6 && (
              <div className="inline-flex items-center gap-1.5 bg-purple-600/40 border border-amber-300/60 px-3 py-1 rounded-full text-xs font-extrabold text-amber-200 mb-2">
                <Crown3DIcon size={16} />
                <span>{lang === 'bn' ? 'ফাইনাল বস মিশন' : 'FINAL BOSS RESCUE'}</span>
              </div>
            )}

            <h2 className="text-xl sm:text-2xl font-extrabold text-amber-300 candy-text-shadow mb-1.5">
              {lang === 'bn' ? selectedBriefing.titleBn : selectedBriefing.titleEn}
            </h2>
            <p className="text-xs sm:text-sm text-indigo-100 mb-4 leading-relaxed">
              {lang === 'bn' ? selectedBriefing.subtitleBn : selectedBriefing.subtitleEn}
            </p>

            {/* Rescue Objectives Box */}
            <div className="bg-slate-950/65 border border-amber-300/30 rounded-2xl p-3.5 mb-5">
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-amber-300/90 mb-2.5">
                {lang === 'bn' ? 'মিশন টাস্কসমূহ' : 'Rescue Objectives'}
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {selectedBriefing.tasks.map((tk) => (
                  <div
                    key={tk.kind}
                    className="flex items-center gap-2 bg-indigo-950/90 border border-amber-300/40 px-3 py-1.5 rounded-xl"
                  >
                    <Task3DIcon kind={tk.kind} size={22} />
                    <div className="text-left">
                      <div className="text-[11px] text-indigo-200 leading-none">
                        {lang === 'bn' ? tk.labelBn : tk.labelEn}
                      </div>
                      <div className="text-sm font-extrabold text-amber-300">
                        x{tk.target}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                const id = selectedBriefing.id;
                setSelectedBriefing(null);
                onSelectLevel(id);
              }}
              className="w-full candy-btn-green py-3.5 rounded-full font-candy text-xl font-extrabold text-white candy-text-shadow flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>{lang === 'bn' ? 'মিশন শুরু করো!' : 'Start Rescue!'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
