import React from 'react';
import { LEVELS } from '../data/levels';
import { Language, PlayerSaveData } from '../types/game';
import { ArrowLeft, Lock, Play, Unlock } from 'lucide-react';
import { soundEngine } from '../audio/soundEngine';

interface MissionMapScreenProps {
  lang: Language;
  saveData: PlayerSaveData;
  onSelectLevel: (levelId: number) => void;
  onUnlockAll: () => void;
  onBackHome: () => void;
}

export const MissionMapScreen: React.FC<MissionMapScreenProps> = ({
  lang,
  saveData,
  onSelectLevel,
  onUnlockAll,
  onBackHome,
}) => {
  return (
    <div className="w-full h-full flex flex-col items-center p-3 sm:p-5 overflow-hidden">
      {/* Header */}
      <div className="w-full max-w-[460px] flex items-center justify-between bg-slate-900/90 border border-amber-400/40 rounded-2xl px-4 py-2.5 mb-3 shadow-lg">
        <button
          type="button"
          onClick={() => {
            soundEngine.unlock();
            onBackHome();
          }}
          className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-amber-200 hover:text-white bg-slate-800 px-3 py-1.5 rounded-xl border border-white/15"
        >
          <ArrowLeft className="w-4 h-4" />
          {lang === 'bn' ? 'হোম' : 'Home'}
        </button>

        <h1 className="text-base sm:text-lg font-extrabold text-amber-300 candy-text-shadow">
          {lang === 'bn' ? '🗺️ রেসকিউ টাস্ক ম্যাপ' : '🗺️ Rescue Mission Map'}
        </h1>

        {saveData.unlockedLevel < LEVELS.length ? (
          <button
            type="button"
            onClick={() => {
              soundEngine.unlock();
              onUnlockAll();
            }}
            className="flex items-center gap-1 text-[11px] font-bold bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 text-amber-200 px-2.5 py-1.5 rounded-xl"
            title="Unlock all missions for testing"
          >
            <Unlock className="w-3.5 h-3.5" />
            {lang === 'bn' ? 'সব আনলক' : 'Unlock All'}
          </button>
        ) : (
          <div className="text-xs font-bold text-emerald-300 px-2">✓ 6/6</div>
        )}
      </div>

      {/* Scrollable Mission Cards */}
      <div className="w-full max-w-[460px] flex-1 overflow-y-auto space-y-3 pr-1 pb-6">
        {LEVELS.map((lvl) => {
          const isUnlocked = lvl.id <= saveData.unlockedLevel;
          const stars = saveData.starsByLevel[lvl.id] ?? 0;
          const bestScore = saveData.bestScoreByLevel[lvl.id] ?? 0;

          return (
            <div
              key={lvl.id}
              className={`relative rounded-3xl p-4 border-2 transition shadow-xl ${
                isUnlocked
                  ? 'bg-gradient-to-r from-slate-900/95 via-[#182944]/95 to-slate-900/95 border-amber-400/60 hover:border-amber-300'
                  : 'bg-slate-950/80 border-slate-800 opacity-70'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-400 text-slate-950 font-extrabold text-sm shadow">
                      {lvl.id}
                    </span>
                    <h2 className="text-sm sm:text-base font-extrabold text-white truncate">
                      {lang === 'bn' ? lvl.titleBn : lvl.titleEn}
                    </h2>
                  </div>

                  <p className="text-xs text-slate-300 mb-2.5 leading-snug">
                    {lang === 'bn' ? lvl.subtitleBn : lvl.subtitleEn}
                  </p>

                  {/* Task Preview Chips */}
                  <div className="flex flex-wrap gap-1.5">
                    {lvl.tasks.map((tk) => (
                      <span
                        key={tk.kind}
                        className="inline-flex items-center gap-1 bg-slate-950/80 border border-white/15 px-2.5 py-0.5 rounded-full text-[11px] font-bold text-amber-200"
                      >
                        <span>{tk.icon}</span>
                        <span>
                          {lang === 'bn' ? tk.labelBn : tk.labelEn} ({tk.target})
                        </span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right Play / Lock & Stars */}
                <div className="flex flex-col items-end justify-between gap-2 shrink-0">
                  <div className="flex items-center gap-0.5 text-sm">
                    {[1, 2, 3].map((s) => (
                      <span key={s} className={s <= stars ? '' : 'opacity-20 grayscale'}>
                        ⭐
                      </span>
                    ))}
                  </div>

                  {bestScore > 0 && (
                    <span className="text-[11px] font-bold text-emerald-300">
                      {bestScore} pts
                    </span>
                  )}

                  {isUnlocked ? (
                    <button
                      type="button"
                      onClick={() => {
                        soundEngine.unlock();
                        onSelectLevel(lvl.id);
                      }}
                      className="candy-btn-green px-4 py-2 rounded-full font-extrabold text-xs sm:text-sm text-white flex items-center gap-1"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      {lang === 'bn' ? 'খেলো' : 'Play'}
                    </button>
                  ) : (
                    <div className="px-3.5 py-2 rounded-full bg-slate-800 text-slate-400 text-xs font-bold flex items-center gap-1 border border-slate-700">
                      <Lock className="w-3.5 h-3.5" />
                      {lang === 'bn' ? 'লকড' : 'Locked'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
