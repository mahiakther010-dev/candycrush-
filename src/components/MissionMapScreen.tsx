import React, { useMemo, useState } from 'react';
import { LEVELS } from '../data/levels';
import { Language, LevelConfig, PlayerSaveData } from '../types/game';
import { soundEngine } from '../audio/soundEngine';
import { Crown3DIcon, Star3DIcon, Task3DIcon } from './ui/CandyIcons3D';
import { ArrowLeft, ChevronLeft, ChevronRight, Lock, Play, Unlock, X } from 'lucide-react';

interface MissionMapScreenProps {
  lang: Language;
  saveData: PlayerSaveData;
  onSelectLevel: (levelId: number) => void;
  onUnlockAll: () => void;
  onBackHome: () => void;
}

const COORDS_6 = [
  { x: 50, y: 86 },
  { x: 24, y: 71 },
  { x: 76, y: 56 },
  { x: 26, y: 41 },
  { x: 74, y: 26 },
  { x: 50, y: 11 },
];

const COORDS_5 = [
  { x: 50, y: 85 },
  { x: 24, y: 67 },
  { x: 76, y: 49 },
  { x: 26, y: 31 },
  { x: 50, y: 12 },
];

export const MissionMapScreen: React.FC<MissionMapScreenProps> = ({
  lang,
  saveData,
  onSelectLevel,
  onUnlockAll,
  onBackHome,
}) => {
  const chapters = useMemo(() => {
    const map = new Map<number, { num: number; titleEn: string; titleBn: string; levels: LevelConfig[] }>();
    for (const lvl of LEVELS) {
      const num = lvl.chapterNumber ?? 0;
      if (!map.has(num)) {
        map.set(num, {
          num,
          titleEn: lvl.chapterTitleEn ?? `Chapter ${num}`,
          titleBn: lvl.chapterTitleBn ?? `অধ্যায় ${num}`,
          levels: [],
        });
      }
      map.get(num)!.levels.push(lvl);
    }
    return Array.from(map.values()).sort((a, b) => a.num - b.num);
  }, []);

  const initialChapter = useMemo(() => {
    const cur = LEVELS.find((l) => l.id === saveData.unlockedLevel);
    return cur?.chapterNumber ?? 0;
  }, [saveData.unlockedLevel]);

  const [activeChapterNum, setActiveChapterNum] = useState<number>(initialChapter);
  const [selectedBriefing, setSelectedBriefing] = useState<LevelConfig | null>(null);

  const activeChapter = chapters.find((c) => c.num === activeChapterNum) ?? chapters[0];
  const chapterLevels = activeChapter.levels;
  const coords = chapterLevels.length === 6 ? COORDS_6 : COORDS_5;
  const palette = chapterLevels[0]?.themePalette;

  const skyBg = palette
    ? `radial-gradient(circle at 50% 10%, ${palette.pillar}55 0%, ${palette.wall} 48%, ${palette.sky} 100%)`
    : 'radial-gradient(circle at 50% 10%, #4c1d95 0%, #1e3a8a 42%, #0f172a 100%)';

  return (
    <div className="w-full h-full flex flex-col items-center p-2.5 sm:p-4 overflow-hidden">
      {/* Top Royal Navigation Bar */}
      <div className="w-full max-w-[475px] royal-hud-bar rounded-2xl px-3 py-2 mb-2 flex items-center justify-between z-10">
        <button
          type="button"
          onClick={() => {
            soundEngine.unlock();
            onBackHome();
          }}
          className="candy-booster-slot px-2.5 py-1.5 rounded-xl text-xs font-extrabold text-amber-200 flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'bn' ? 'হোম' : 'Menu'}</span>
        </button>

        <h1 className="text-sm sm:text-base font-extrabold text-amber-300 candy-text-shadow truncate px-2">
          {lang === 'bn' ? '৫৬ মিশন সাগা ম্যাপ' : '56-Mission Saga Map'}
        </h1>

        {saveData.unlockedLevel < LEVELS.length ? (
          <button
            type="button"
            onClick={() => {
              soundEngine.unlock();
              onUnlockAll();
            }}
            className="candy-btn-orange px-2.5 py-1.5 rounded-xl text-xs font-extrabold text-white flex items-center gap-1"
          >
            <Unlock className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'সব আনলক' : 'Unlock 56'}</span>
          </button>
        ) : (
          <div className="flex items-center gap-1 bg-emerald-500/20 border border-emerald-400/50 px-2.5 py-1 rounded-full text-xs font-extrabold text-emerald-300">
            <span>56 / 56</span>
          </div>
        )}
      </div>

      {/* Chapter Selector Bar (Prologue + 10 Regional Chapters) */}
      <div className="w-full max-w-[475px] flex items-center gap-1.5 mb-2 z-10">
        <button
          type="button"
          disabled={activeChapterNum <= 0}
          onClick={() => setActiveChapterNum((c) => Math.max(0, c - 1))}
          className="candy-booster-slot p-1.5 rounded-xl text-amber-200 disabled:opacity-40"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex-1 royal-hud-bar rounded-xl px-3 py-1.5 text-center truncate">
          <div className="text-[10px] font-bold text-sky-300 uppercase tracking-wider leading-none">
            {lang === 'bn'
              ? `মিশন ${chapterLevels[0].id}–${chapterLevels[chapterLevels.length - 1].id}`
              : `Missions ${chapterLevels[0].id}–${chapterLevels[chapterLevels.length - 1].id} of ${LEVELS.length}`}
          </div>
          <div className="text-xs sm:text-sm font-extrabold text-amber-200 truncate mt-0.5">
            {lang === 'bn' ? activeChapter.titleBn : activeChapter.titleEn}
          </div>
        </div>

        <button
          type="button"
          disabled={activeChapterNum >= chapters.length - 1}
          onClick={() => setActiveChapterNum((c) => Math.min(chapters.length - 1, c + 1))}
          className="candy-booster-slot p-1.5 rounded-xl text-amber-200 disabled:opacity-40"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Chapter Number Pills */}
      <div className="w-full max-w-[475px] flex items-center gap-1 overflow-x-auto pb-1.5 mb-1.5 z-10">
        {chapters.map((ch) => {
          const isAct = ch.num === activeChapterNum;
          const firstUnlocked = ch.levels[0].id <= saveData.unlockedLevel;
          return (
            <button
              key={ch.num}
              type="button"
              onClick={() => setActiveChapterNum(ch.num)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold whitespace-nowrap border transition ${
                isAct
                  ? 'bg-amber-400 text-slate-950 border-white shadow-md'
                  : firstUnlocked
                    ? 'bg-slate-900/80 text-amber-200 border-amber-400/40'
                    : 'bg-slate-950/60 text-slate-400 border-slate-700'
              }`}
            >
              {ch.num === 0 ? (lang === 'bn' ? 'শুরু' : 'Base') : `Ch ${ch.num}`}
            </button>
          );
        })}
      </div>

      {/* Chapter Trail Map Canvas */}
      <div className="relative w-full max-w-[475px] flex-1 royal-panel-3d rounded-[2.2rem] overflow-hidden">
        <div className="absolute inset-0 transition-all duration-300" style={{ background: skyBg }} />
        <div className="absolute top-6 left-6 w-24 h-10 rounded-full bg-pink-400/15 blur-xl pointer-events-none" />
        <div className="absolute top-1/3 right-4 w-32 h-14 rounded-full bg-amber-400/15 blur-xl pointer-events-none" />

        {/* Winding SVG Golden Trail */}
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
            d={
              chapterLevels.length === 6
                ? 'M 50 86 C 35 80, 18 78, 24 71 C 32 62, 72 64, 76 56 C 80 48, 22 49, 26 41 C 30 33, 76 34, 74 26 C 72 18, 56 16, 50 11'
                : 'M 50 85 C 32 79, 18 74, 24 67 C 32 58, 72 58, 76 49 C 80 40, 22 40, 26 31 C 30 22, 46 18, 50 12'
            }
            fill="none"
            stroke="rgba(15, 23, 42, 0.7)"
            strokeWidth="3.6"
            strokeLinecap="round"
          />
          <path
            d={
              chapterLevels.length === 6
                ? 'M 50 86 C 35 80, 18 78, 24 71 C 32 62, 72 64, 76 56 C 80 48, 22 49, 26 41 C 30 33, 76 34, 74 26 C 72 18, 56 16, 50 11'
                : 'M 50 85 C 32 79, 18 74, 24 67 C 32 58, 72 58, 76 49 C 80 40, 22 40, 26 31 C 30 22, 46 18, 50 12'
            }
            fill="none"
            stroke="url(#roadGlow)"
            strokeWidth="1.7"
            strokeDasharray="3 2"
            strokeLinecap="round"
          />
        </svg>

        {/* Interactive 3D Level Nodes */}
        {chapterLevels.map((lvl, idx) => {
          const coord = coords[idx];
          const isUnlocked = lvl.id <= saveData.unlockedLevel;
          const isCurrent = lvl.id === saveData.unlockedLevel;
          const isBoss = Boolean(lvl.isBoss);
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
              {isBoss && (
                <div className="mb-0.5 animate-float">
                  <Crown3DIcon size={25} />
                </div>
              )}

              <div className="relative flex items-center justify-center">
                {isCurrent && (
                  <span className="absolute -inset-2.5 rounded-full bg-amber-400/40 animate-ping" />
                )}

                <div
                  className={`relative w-13 h-13 sm:w-15 sm:h-15 px-3 py-2 rounded-full flex items-center justify-center border-3 shadow-xl transition-transform group-hover:scale-110 ${
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
                    <span className="font-candy text-xl sm:text-2xl font-extrabold text-white candy-text-shadow">
                      {lvl.id}
                    </span>
                  ) : (
                    <Lock className="w-5 h-5 text-slate-300" />
                  )}
                </div>
              </div>

              <div className="mt-1 bg-slate-950/85 border border-amber-300/40 px-2.5 py-0.5 rounded-full shadow-md flex flex-col items-center">
                <span className="text-[10px] font-extrabold text-amber-200 whitespace-nowrap max-w-[115px] truncate">
                  {lang === 'bn' ? lvl.zoneBn ?? `মিশন ${lvl.id}` : lvl.zoneEn ?? `Mission ${lvl.id}`}
                </span>
                <div className="flex items-center gap-0.5 -mt-0.5">
                  {[1, 2, 3].map((s) => (
                    <Star3DIcon key={s} size={12} active={s <= stars} />
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

            {selectedBriefing.isBoss && (
              <div className="inline-flex items-center gap-1.5 bg-purple-600/40 border border-amber-300/60 px-3 py-1 rounded-full text-xs font-extrabold text-amber-200 mb-2">
                <Crown3DIcon size={16} />
                <span>{lang === 'bn' ? 'বস এনকাউন্টার!' : 'BOSS ENCOUNTER'}</span>
              </div>
            )}

            <div className="text-[11px] font-bold text-sky-300 mb-0.5">
              {lang === 'bn' ? selectedBriefing.chapterTitleBn : selectedBriefing.chapterTitleEn}
            </div>

            <h2 className="text-lg sm:text-xl font-extrabold text-amber-300 candy-text-shadow mb-1.5">
              {lang === 'bn' ? selectedBriefing.titleBn : selectedBriefing.titleEn}
            </h2>
            <p className="text-xs text-indigo-100 mb-3 leading-relaxed">
              {lang === 'bn' ? selectedBriefing.subtitleBn : selectedBriefing.subtitleEn}
            </p>

            {/* Rescue Objectives Box */}
            <div className="bg-slate-950/65 border border-amber-300/30 rounded-2xl p-3 mb-4">
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-amber-300/90 mb-2">
                {lang === 'bn' ? 'মিশন টাস্কসমূহ' : 'Rescue Objectives'}
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {selectedBriefing.tasks.map((tk, idx) => (
                  <div
                    key={`${tk.kind}-${idx}`}
                    className="flex items-center gap-2 bg-indigo-950/90 border border-amber-300/40 px-2.5 py-1.5 rounded-xl"
                  >
                    <Task3DIcon kind={tk.kind} targetColor={tk.targetColor} size={20} />
                    <div className="text-left">
                      <div className="text-[10px] text-indigo-200 leading-none">
                        {lang === 'bn' ? tk.labelBn : tk.labelEn}
                      </div>
                      <div className="text-xs font-extrabold text-amber-300">x{tk.target}</div>
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
