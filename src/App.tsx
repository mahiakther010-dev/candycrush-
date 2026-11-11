import React, { useCallback, useEffect, useState } from 'react';
import { LEVELS } from './data/levels';
import { BoosterKind, PlayerSaveData } from './types/game';
import { TitleScreen } from './components/TitleScreen';
import { MissionMapScreen } from './components/MissionMapScreen';
import { RescueGameStage } from './components/RescueGameStage';
import { soundEngine } from './audio/soundEngine';

const STORAGE_KEY = 'candy_rescue_save_v2_56lvls';

const DEFAULT_SAVE: PlayerSaveData = {
  unlockedLevel: 1,
  starsByLevel: {},
  bestScoreByLevel: {},
  boosters: {
    hammer: 3,
    bomb: 3,
    shield: 3,
    freeze: 3,
    magnet: 3,
    shuffle: 3,
  },
  language: 'bn',
  soundEnabled: true,
};

function loadSaveData(): PlayerSaveData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem('candy_rescue_save_v1');
    if (!raw) return DEFAULT_SAVE;
    const parsed = JSON.parse(raw) as Partial<PlayerSaveData>;
    return {
      ...DEFAULT_SAVE,
      ...parsed,
      boosters: {
        ...DEFAULT_SAVE.boosters,
        ...(parsed.boosters ?? {}),
      },
    };
  } catch {
    return DEFAULT_SAVE;
  }
}

export const App: React.FC = () => {
  const [saveData, setSaveData] = useState<PlayerSaveData>(() => loadSaveData());
  const [screen, setScreen] = useState<'title' | 'map' | 'game'>('title');
  const [activeLevelId, setActiveLevelId] = useState<number>(1);

  useEffect(() => {
    soundEngine.enabled = saveData.soundEnabled;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saveData));
    } catch {
      // Ignore storage quota / iframe privacy errors
    }
  }, [saveData]);

  const toggleSound = useCallback(() => {
    setSaveData((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  }, []);

  const toggleLang = useCallback(() => {
    setSaveData((prev) => ({
      ...prev,
      language: prev.language === 'bn' ? 'en' : 'bn',
    }));
  }, []);

  const consumeBooster = useCallback(
    (kind: BoosterKind): boolean => {
      if ((saveData.boosters[kind] ?? 0) <= 0) return false;
      setSaveData((prev) => ({
        ...prev,
        boosters: {
          ...prev.boosters,
          [kind]: Math.max(0, (prev.boosters[kind] ?? 0) - 1),
        },
      }));
      return true;
    },
    [saveData.boosters]
  );

  const handleLevelWin = useCallback((levelId: number, stars: number, score: number) => {
    setSaveData((prev) => {
      const prevStars = prev.starsByLevel[levelId] ?? 0;
      const prevBest = prev.bestScoreByLevel[levelId] ?? 0;
      const nextUnlocked = Math.min(LEVELS.length, Math.max(prev.unlockedLevel, levelId + 1));
      const lvlObj = LEVELS.find((l) => l.id === levelId);
      const isBoss = Boolean(lvlObj?.isBoss);

      return {
        ...prev,
        unlockedLevel: nextUnlocked,
        starsByLevel: {
          ...prev.starsByLevel,
          [levelId]: Math.max(prevStars, stars),
        },
        bestScoreByLevel: {
          ...prev.bestScoreByLevel,
          [levelId]: Math.max(prevBest, score),
        },
        boosters: {
          ...prev.boosters,
          hammer: stars === 3 ? prev.boosters.hammer + 1 : prev.boosters.hammer,
          bomb: isBoss ? prev.boosters.bomb + 1 : prev.boosters.bomb,
          shield: isBoss ? prev.boosters.shield + 1 : prev.boosters.shield,
        },
      };
    });
  }, []);

  const totalStars = Object.values(saveData.starsByLevel).reduce((a, b) => a + b, 0);
  const currentLevel = LEVELS.find((l) => l.id === activeLevelId) ?? LEVELS[0];

  return (
    <main className="w-screen h-screen overflow-hidden flex items-center justify-center">
      {screen === 'title' && (
        <TitleScreen
          lang={saveData.language}
          soundEnabled={saveData.soundEnabled}
          highestLevel={saveData.unlockedLevel}
          totalStars={totalStars}
          totalLevels={LEVELS.length}
          onPlayCurrent={() => {
            setActiveLevelId(saveData.unlockedLevel);
            setScreen('game');
          }}
          onOpenMap={() => setScreen('map')}
          onToggleLang={toggleLang}
          onToggleSound={toggleSound}
        />
      )}

      {screen === 'map' && (
        <MissionMapScreen
          lang={saveData.language}
          saveData={saveData}
          onSelectLevel={(id) => {
            setActiveLevelId(id);
            setScreen('game');
          }}
          onUnlockAll={() =>
            setSaveData((prev) => ({ ...prev, unlockedLevel: LEVELS.length }))
          }
          onBackHome={() => setScreen('title')}
        />
      )}

      {screen === 'game' && (
        <RescueGameStage
          key={currentLevel.id}
          level={currentLevel}
          lang={saveData.language}
          soundEnabled={saveData.soundEnabled}
          boosters={saveData.boosters}
          onToggleSound={toggleSound}
          onToggleLang={toggleLang}
          onConsumeBooster={consumeBooster}
          onLevelWin={handleLevelWin}
          onNextLevel={() => {
            const nextId = Math.min(LEVELS.length, currentLevel.id + 1);
            setActiveLevelId(nextId);
          }}
          onBackToMap={() => setScreen('map')}
          hasNextLevel={currentLevel.id < LEVELS.length}
        />
      )}
    </main>
  );
};

export default App;
