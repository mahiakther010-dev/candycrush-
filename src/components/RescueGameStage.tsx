import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  BoosterKind,
  CandyColor,
  createSnakeObstacles,
  GameStatus,
  GridCell,
  Language,
  LevelConfig,
  SNAKE_BOSS_DAMAGE_SCALE,
  SNAKE_PUSHBACK_PER_PERCENT,
  SnakeObstacleState,
  SpecialType,
  TaskProgress,
} from '../types/game';
import {
  applyGravityAndRefill,
  applyWindConveyor,
  buildInitialBoard,
  calculateSnakeDamage,
  canSwapCells,
  collectBottomKeys,
  countSmashedForObstacles,
  createPiece,
  findBestHintMove,
  findMatches,
  hasAnyValidMove,
  HintMove,
  isProductiveSwap,
  pullKeysWithMagnet,
  resolveCellsToClear,
  shuffleNormalCandies,
  StepBlastResult,
} from '../engine/match3';
import { RescueWorld3D } from '../three/rescueWorld3D';
import { soundEngine } from '../audio/soundEngine';
import { IntroCutscene } from './IntroCutscene';
import {
  Bomb3DIcon,
  Frost3DIcon,
  Hammer3DIcon,
  Magnet3DIcon,
  SerpentDanger3DIcon,
  Shield3DIcon,
  Shuffle3DIcon,
  Star3DIcon,
  Task3DIcon,
} from './ui/CandyIcons3D';
import {
  Pause,
  RotateCcw,
  Map as MapIcon,
  Volume2,
  VolumeX,
  Check,
  Play,
  Globe,
} from 'lucide-react';

interface FloatingBanner {
  id: number;
  text: string;
  colorClass: string;
}

interface RescueGameStageProps {
  level: LevelConfig;
  lang: Language;
  soundEnabled: boolean;
  boosters: Record<BoosterKind, number>;
  onToggleSound: () => void;
  onToggleLang: () => void;
  onConsumeBooster: (kind: BoosterKind) => boolean;
  onLevelWin: (levelId: number, stars: number, score: number) => void;
  onNextLevel: () => void;
  onBackToMap: () => void;
  hasNextLevel: boolean;
}

export const RescueGameStage: React.FC<RescueGameStageProps> = ({
  level,
  lang,
  soundEnabled,
  boosters,
  onToggleSound,
  onToggleLang,
  onConsumeBooster,
  onLevelWin,
  onNextLevel,
  onBackToMap,
  hasNextLevel,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const worldRef = useRef<RescueWorld3D | null>(null);

  const [status, setStatus] = useState<GameStatus>(
    level.hasIntroCutscene ? 'intro' : 'playing'
  );
  const [tasks, setTasks] = useState<TaskProgress[]>(() =>
    level.tasks.map((t) => ({ ...t, current: 0 }))
  );
  const [danger, setDanger] = useState<number>(4);
  const [isFrozenUI, setIsFrozenUI] = useState<boolean>(false);
  const [shieldActiveUI, setShieldActiveUI] = useState<boolean>(false);
  const [movesUsed, setMovesUsed] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [targetTool, setTargetTool] = useState<'hammer' | 'bomb' | null>(null);
  // Mirror of targetTool for the render loop: reading state there would rebuild the 3D world
  const targetToolRef = useRef<'hammer' | 'bomb' | null>(null);
  useEffect(() => {
    targetToolRef.current = targetTool;
  }, [targetTool]);
  const [earnedStars, setEarnedStars] = useState<number>(3);
  const [banner, setBanner] = useState<FloatingBanner | null>(null);
  const [worldEpoch, setWorldEpoch] = useState<number>(0);
  const [snakeHp, setSnakeHp] = useState<number>(100);
  const [snakeObstaclesUI, setSnakeObstaclesUI] = useState<SnakeObstacleState[]>(() =>
    createSnakeObstacles(Boolean(level.isBoss))
  );

  // Mutable 60fps engine refs
  const gridRef = useRef<GridCell[][]>([]);
  const tasksRef = useRef<TaskProgress[]>([]);
  const dangerRef = useRef<number>(4);
  const statusRef = useRef<GameStatus>(level.hasIntroCutscene ? 'intro' : 'playing');
  const scoreRef = useRef<number>(0);
  const movesUsedRef = useRef<number>(0);
  const shieldActiveRef = useRef<boolean>(false);
  // Snake HP: 100 = full, 0 = defeated (chipped down 1% → 100% by candy bursts)
  const snakeHpRef = useRef<number>(100);
  const snakeObstaclesRef = useRef<SnakeObstacleState[]>(createSnakeObstacles(Boolean(level.isBoss)));
  const snakeHitTimerRef = useRef<number>(0);
  const mochiCaughtRef = useRef<boolean>(false);

  const busyRef = useRef<boolean>(false);
  const busySinceRef = useRef<number>(0);
  const selectedCellRef = useRef<{ row: number; col: number } | null>(null);
  const dragStartRef = useRef<{
    row: number;
    col: number;
    clientX: number;
    clientY: number;
  } | null>(null);

  const freezeTimerRef = useRef<number>(0);
  const happyTimerRef = useRef<number>(0);
  const surprisedTimerRef = useRef<number>(0);
  const rescueAnimRef = useRef<number>(0);
  const idleSecondsRef = useRef<number>(0);
  const hintMoveRef = useRef<HintMove | null>(null);
  const shakeTimerRef = useRef<number>(0);
  const bossSlimeTimerRef = useRef<number>(0);
  const heartbeatCooldownRef = useRef<number>(0);

  const showFloatingBanner = useCallback(
    (text: string, colorClass: string = 'from-amber-300 to-yellow-500') => {
      const id = Date.now() + Math.random();
      setBanner({ id, text, colorClass });
      setTimeout(() => {
        setBanner((cur) => (cur?.id === id ? null : cur));
      }, 1050);
    },
    []
  );

  const resetMission = useCallback(
    (skipIntro: boolean = false) => {
      const initialStatus: GameStatus =
        level.hasIntroCutscene && !skipIntro ? 'intro' : 'playing';
      gridRef.current = buildInitialBoard(level);
      const freshTasks = level.tasks.map((t) => ({ ...t, current: 0 }));
      tasksRef.current = freshTasks;
      setTasks(freshTasks);

      dangerRef.current = 4;
      setDanger(4);
      snakeHpRef.current = 100;
      setSnakeHp(100);
      snakeObstaclesRef.current = createSnakeObstacles(Boolean(level.isBoss));
      setSnakeObstaclesUI(snakeObstaclesRef.current.map((o) => ({ ...o })));
      snakeHitTimerRef.current = 0;
      mochiCaughtRef.current = false;
      setIsFrozenUI(false);
      shieldActiveRef.current = false;
      setShieldActiveUI(false);
      movesUsedRef.current = 0;
      setMovesUsed(0);
      scoreRef.current = 0;
      setScore(0);

      statusRef.current = initialStatus;
      setStatus(initialStatus);
      setTargetTool(null);

      busyRef.current = false;
      selectedCellRef.current = null;
      dragStartRef.current = null;
      freezeTimerRef.current = 0;
      happyTimerRef.current = 0;
      surprisedTimerRef.current = 0;
      rescueAnimRef.current = 0;
      idleSecondsRef.current = 0;
      hintMoveRef.current = findBestHintMove(gridRef.current, level);
      shakeTimerRef.current = 0;
      bossSlimeTimerRef.current = 0;

      setWorldEpoch((e) => e + 1);
    },
    [level]
  );

  useEffect(() => {
    resetMission(false);
  }, [resetMission]);

  /** Snake cannot pass an uncleared obstacle: progress stalls exactly on the obstacle mark */
  const clampSnakeProgress = (value: number): number => {
    for (const ob of snakeObstaclesRef.current) {
      if (!ob.cleared && value >= ob.progress * 100) return ob.progress * 100;
    }
    return value;
  };

  const checkWinCondition = useCallback(() => {
    if (statusRef.current !== 'playing') return;
    const allComplete = tasksRef.current.every((t) => t.current >= t.target);
    // Win = all objectives done OR Snake HP reduced to 0% (Snake defeated)
    const snakeDefeated = snakeHpRef.current <= 0;
    if (allComplete || snakeDefeated) {
      statusRef.current = 'rescuing';
      setStatus('rescuing');
      rescueAnimRef.current = 0;
      happyTimerRef.current = 4.0;
      soundEngine.playWin();

      const colors: CandyColor[] = ['red', 'yellow', 'green', 'blue', 'purple', 'orange'];
      for (let i = 0; i < 14; i++) {
        worldRef.current?.spawnCandyExplosion(
          Math.floor(Math.random() * level.rows),
          Math.floor(Math.random() * level.cols),
          colors[i % colors.length],
          6
        );
      }

      const stars = dangerRef.current < 58 ? 3 : dangerRef.current < 82 ? 2 : 1;
      setEarnedStars(stars);
      const bonus = Math.round((100 - dangerRef.current) * 25);
      scoreRef.current += bonus;
      setScore(scoreRef.current);
      onLevelWin(level.id, stars, scoreRef.current);
    }
  }, [level.cols, level.id, level.rows, onLevelWin]);

  const applyBlastProgress = useCallback(
    (blast: StepBlastResult, comboIndex: number) => {
      const world = worldRef.current;

      for (const pop of blast.poppedPositions) {
        world?.spawnCandyExplosion(pop.row, pop.col, pop.color, 7);
      }
      for (const bm of blast.beamEffects) {
        world?.spawnBeamEffect(bm.kind, bm.row, bm.col);
        shakeTimerRef.current = 0.25;
        soundEngine.playSpecialBlast(
          bm.kind === 'row' || bm.kind === 'col' ? 'striped' : bm.kind
        );
      }

      if (blast.totalCandiesCleared > 0) {
        happyTimerRef.current = 1.25;
      }

      // ── SNAKE HP DAMAGE (1% → 100%) + OBSTACLE SMASH ─────────────────────
      const snakeHit = calculateSnakeDamage(
        blast,
        comboIndex,
        level.isBoss ? SNAKE_BOSS_DAMAGE_SCALE : 1
      );
      if (snakeHit.percent > 0 && snakeHpRef.current > 0) {
        snakeHpRef.current = Math.max(0, snakeHpRef.current - snakeHit.percent);
        setSnakeHp(snakeHpRef.current);
        snakeHitTimerRef.current = 0.26;
        // Knockback: every HP chunk pushes the Snake back along its path
        dangerRef.current = Math.max(
          2,
          dangerRef.current - snakeHit.percent * SNAKE_PUSHBACK_PER_PERCENT
        );
        setDanger(dangerRef.current);
        world?.spawnSnakeHitBurst(snakeHit.isMegaKill ? 24 : 6 + Math.round(snakeHit.percent / 3));
        soundEngine.playSpecialBlast(snakeHit.percent >= 12 ? 'bomb' : 'striped');
        if (snakeHit.percent >= 12 || snakeHit.isMegaKill) {
          showFloatingBanner(
            snakeHit.isMegaKill
              ? lang === 'bn'
                ? 'মেগা কিল! সাপের HP ১০০% শেষ!'
                : 'MEGA KILL! SNAKE HP -100%!'
              : lang === 'bn'
                ? `-${snakeHit.percent}% সাপের HP!`
                : `-${snakeHit.percent}% SNAKE HP!`,
            'from-rose-300 via-orange-300 to-amber-300'
          );
        }
        if (snakeHpRef.current <= 0) {
          showFloatingBanner(
            lang === 'bn' ? 'সাপ পরাজিত!' : 'SNAKE DEFEATED!',
            'from-lime-200 to-emerald-300'
          );
        }
      }

      const smashed = countSmashedForObstacles(blast);
      const frontObstacle = snakeObstaclesRef.current.find((o) => !o.cleared);
      if (frontObstacle && smashed > 0) {
        frontObstacle.remaining = Math.max(0, frontObstacle.remaining - smashed);
        if (frontObstacle.remaining <= 0) {
          frontObstacle.cleared = true;
          soundEngine.playKeyUnlock();
          showFloatingBanner(
            lang === 'bn'
              ? `${frontObstacle.labelBn} ভাঙা!`
              : `${frontObstacle.labelEn} BROKEN!`,
            'from-lime-200 to-emerald-300'
          );
        }
        setSnakeObstaclesUI(snakeObstaclesRef.current.map((o) => ({ ...o })));
      }

      const gained =
        blast.totalCandiesCleared * 30 * (comboIndex + 1) +
        blast.cratesBroken * 120 +
        blast.iceBroken * 100 +
        blast.chainsBroken * 110 +
        blast.slimesCleared * 110 +
        blast.specialsTriggered * 200;
      scoreRef.current += gained;
      setScore(scoreRef.current);

      if (comboIndex >= 1) {
        showFloatingBanner(
          comboIndex >= 2
            ? lang === 'bn'
              ? `${comboIndex + 1}x সুপার কম্বো!`
              : `${comboIndex + 1}x SUPER COMBO!`
            : `${comboIndex + 1}x COMBO!`,
          'from-amber-200 via-yellow-300 to-orange-400'
        );
      }

      let marbleGoalRemaining = 0;
      for (const tk of tasksRef.current) {
        if (tk.kind === 'marbles') {
          marbleGoalRemaining = Math.max(0, tk.target - tk.current);
        }
      }

      let marblesReleasedNow = 0;
      if (marbleGoalRemaining > 0 && blast.totalCandiesCleared > 0) {
        const desiredRelease = Math.min(
          marbleGoalRemaining,
          Math.max(
            3,
            Math.ceil(blast.totalCandiesCleared * 0.9) +
              blast.drainColumnClears * 2 +
              blast.cratesBroken * 5 +
              blast.specialsTriggered * 4
          )
        );
        marblesReleasedNow = world ? world.releaseMarbles(desiredRelease) : desiredRelease;
        if (marblesReleasedNow > 0) soundEngine.playMarbleDrop();
      }

      if (level.scene === 'frost_dual' && blast.clearedColors.blue > 0) {
        const pushback = blast.clearedColors.blue * 2.4;
        dangerRef.current = Math.max(2, dangerRef.current - pushback);
        setDanger(dangerRef.current);
        if (blast.clearedColors.blue >= 4) {
          freezeTimerRef.current = Math.max(freezeTimerRef.current, 2.6);
          setIsFrozenUI(true);
          soundEngine.playFreeze();
          showFloatingBanner(
            lang === 'bn' ? 'ফ্রিজ শট!' : 'FROST TURRET BLAST!',
            'from-cyan-200 to-sky-400'
          );
        }
        world?.spawnFlyingProjectile(
          'frost',
          new THREE.Vector3(0, -1.2, 0.4),
          new THREE.Vector3(0, 5.5, 0.4)
        );
      }

      if (
        level.scene === 'lava_bridge' &&
        blast.clearedColors.orange + blast.clearedColors.yellow > 0
      ) {
        world?.spawnFlyingProjectile(
          'plank',
          new THREE.Vector3(0, -1.2, 0.4),
          new THREE.Vector3(0, 3.15, 0.4)
        );
      }

      const updated = tasksRef.current.map((t) => {
        let add = 0;
        if (t.kind === 'marbles') add = marblesReleasedNow;
        else if (t.kind === 'crates') add = blast.cratesBroken;
        else if (t.kind === 'ice') add = blast.iceBroken;
        else if (t.kind === 'chains') add = blast.chainsBroken;
        else if (t.kind === 'slime') add = blast.slimesCleared;
        else if (t.kind === 'specials') add = blast.specialsTriggered;
        else if (t.kind === 'cannon_charge') add = blast.totalCandiesCleared;
        else if (t.kind === 'bridge_candies') {
          add = blast.clearedColors.orange + blast.clearedColors.yellow;
        } else if (t.kind === 'color_target' && t.targetColor) {
          add = blast.clearedColors[t.targetColor] ?? 0;
        }
        return {
          ...t,
          current: Math.min(t.target, t.current + add),
        };
      });

      tasksRef.current = updated;
      setTasks(updated);
      checkWinCondition();
    },
    [checkWinCondition, lang, level.isBoss, level.scene, showFloatingBanner]
  );

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const runCascadeLoop = useCallback(
    async (focusCells: Array<{ row: number; col: number }> = [], initialCombo = 0) => {
      let combo = initialCombo;

      const drainKeysStep = async () => {
        const droppedKeys = collectBottomKeys(
          gridRef.current,
          level.colors,
          level.submergedFromRow
        );
        if (droppedKeys.length > 0) {
          soundEngine.playKeyUnlock();
          happyTimerRef.current = 1.6;
          for (const dk of droppedKeys) {
            const startW =
              worldRef.current?.cellToWorld(dk.row, dk.col) ?? new THREE.Vector3(0, -4, 0.4);
            worldRef.current?.spawnFlyingProjectile(
              'key',
              startW,
              new THREE.Vector3(0, 2.8, 0.4)
            );
          }
          showFloatingBanner(
            lang === 'bn' ? 'সোনালি তালা খুলেছে!' : 'GOLDEN GATE UNLOCKED!',
            'from-yellow-200 to-amber-400'
          );

          tasksRef.current = tasksRef.current.map((t) =>
            t.kind === 'keys'
              ? { ...t, current: Math.min(t.target, t.current + droppedKeys.length) }
              : t
          );
          setTasks([...tasksRef.current]);
          checkWinCondition();
          await sleep(165);
        }
      };

      while (statusRef.current === 'playing') {
        await drainKeysStep();

        const groups = findMatches(gridRef.current, combo === initialCombo ? focusCells : []);
        if (groups.length === 0) break;

        soundEngine.playMatch(combo);

        const seedMap = new Map<string, { row: number; col: number }>();
        const spawns: Array<{
          row: number;
          col: number;
          special: SpecialType;
          color: CandyColor;
        }> = [];

        for (const g of groups) {
          for (const c of g.cells) seedMap.set(`${c.row},${c.col}`, c);
          if (g.spawnSpecial) spawns.push(g.spawnSpecial);
        }

        const blast = resolveCellsToClear(
          gridRef.current,
          Array.from(seedMap.values()),
          spawns,
          true
        );
        applyBlastProgress(blast, combo);
        combo++;

        await sleep(160);
        applyGravityAndRefill(gridRef.current, level.colors, level.submergedFromRow);
        await sleep(175);
      }

      // Wind Tunnel Conveyor Row Shift!
      if (statusRef.current === 'playing' && level.windRows && level.windRows.length > 0) {
        if (applyWindConveyor(gridRef.current, level.windRows)) {
          await sleep(140);
          const windMatches = findMatches(gridRef.current, []);
          if (windMatches.length > 0) {
            showFloatingBanner(
              lang === 'bn' ? 'বাতাসের কম্বো!' : 'WIND DRIFT COMBO!',
              'from-teal-200 to-emerald-400'
            );
            const seedMap = new Map<string, { row: number; col: number }>();
            for (const g of windMatches) {
              for (const c of g.cells) seedMap.set(`${c.row},${c.col}`, c);
            }
            const blast = resolveCellsToClear(
              gridRef.current,
              Array.from(seedMap.values()),
              [],
              true
            );
            applyBlastProgress(blast, combo);
            await sleep(150);
            applyGravityAndRefill(gridRef.current, level.colors, level.submergedFromRow);
          }
        }
      }

      await drainKeysStep();

      if (statusRef.current === 'playing' && !hasAnyValidMove(gridRef.current)) {
        shuffleNormalCandies(gridRef.current, level.colors);
        showFloatingBanner(
          lang === 'bn' ? 'অটো শাফল!' : 'AUTO SHUFFLE!',
          'from-fuchsia-300 to-purple-400'
        );
      }

      hintMoveRef.current = findBestHintMove(gridRef.current, level);
    },
    [applyBlastProgress, checkWinCondition, lang, level, showFloatingBanner]
  );

  const advanceMovePressureIfNeeded = useCallback(() => {
    const nextMoves = movesUsedRef.current + 1;
    movesUsedRef.current = nextMoves;
    setMovesUsed(nextMoves);

    if (level.moveLimit && (level.pressureMode === 'move_limited' || level.pressureMode === 'hybrid')) {
      if (level.pressureMode === 'move_limited') {
        // Each move advances the Snake by one slice; pushback and obstacles still apply
        dangerRef.current = clampSnakeProgress(
          Math.min(100, dangerRef.current + 96 / level.moveLimit)
        );
        setDanger(dangerRef.current);
      }
      if (nextMoves >= level.moveLimit && statusRef.current === 'playing') {
        // Check if win happened first; if still playing, check Shield!
        const won = tasksRef.current.every((t) => t.current >= t.target);
        if (!won) {
          if (shieldActiveRef.current) {
            shieldActiveRef.current = false;
            setShieldActiveUI(false);
            movesUsedRef.current = Math.max(0, level.moveLimit - 5);
            setMovesUsed(movesUsedRef.current);
            dangerRef.current = Math.max(15, dangerRef.current - 25);
            setDanger(dangerRef.current);
            soundEngine.playFreeze();
            showFloatingBanner(
              lang === 'bn' ? 'শিল্ড রক্ষা করেছে! +৫ চাল!' : 'SHIELD SAVED MOCHI! +5 MOVES!',
              'from-cyan-200 to-amber-300'
            );
          } else {
            statusRef.current = 'lost';
            setDanger(100);
            setStatus('lost');
            shakeTimerRef.current = 0.5;
            soundEngine.playFail();
          }
        }
      }
    }
  }, [lang, level.moveLimit, level.pressureMode, showFloatingBanner]);

  const attemptSwapCore = useCallback(
    async (r1: number, c1: number, r2: number, c2: number) => {
      if (busyRef.current || statusRef.current !== 'playing') return;
      if (!canSwapCells(gridRef.current, r1, c1, r2, c2)) {
        soundEngine.playInvalidSwap();
        return;
      }

      busyRef.current = true;
      selectedCellRef.current = null;
      idleSecondsRef.current = 0;

      const cellA = gridRef.current[r1][c1];
      const cellB = gridRef.current[r2][c2];
      const pA = cellA.candy!;
      const pB = cellB.candy!;

      const valid = isProductiveSwap(gridRef.current, r1, c1, r2, c2);

      soundEngine.playSwap();
      cellA.candy = pB;
      cellB.candy = pA;
      pB.row = r1;
      pB.col = c1;
      pA.row = r2;
      pA.col = c2;

      await sleep(155);

      if (!valid) {
        soundEngine.playInvalidSwap();
        cellA.candy = pA;
        cellB.candy = pB;
        pA.row = r1;
        pA.col = c1;
        pB.row = r2;
        pB.col = c2;
        await sleep(145);
        busyRef.current = false;
        return;
      }

      // Rainbow + Any Candy OR Rainbow + Rainbow
      if (
        (pA.special === 'rainbow' && pB.special !== 'key') ||
        (pB.special === 'rainbow' && pA.special !== 'key')
      ) {
        const rainbowCell = pA.special === 'rainbow' ? { row: r2, col: c2 } : { row: r1, col: c1 };
        const otherPiece = pA.special === 'rainbow' ? pB : pA;

        const seeds: Array<{ row: number; col: number }> = [];
        if (pA.special === 'rainbow' && pB.special === 'rainbow') {
          for (let r = 0; r < level.rows; r++) {
            for (let c = 0; c < level.cols; c++) seeds.push({ row: r, col: c });
          }
        } else {
          gridRef.current[rainbowCell.row][rainbowCell.col].candy!.color = otherPiece.color;
          seeds.push(rainbowCell, { row: otherPiece.row, col: otherPiece.col });
        }

        const blast = resolveCellsToClear(gridRef.current, seeds, [], true);
        applyBlastProgress(blast, 1);
        await sleep(185);
        applyGravityAndRefill(gridRef.current, level.colors, level.submergedFromRow);
        await sleep(185);
        await runCascadeLoop([], 1);
        advanceMovePressureIfNeeded();
        busyRef.current = false;
        return;
      }

      // Two Special Candies swapped together!
      if (
        pA.special !== 'none' &&
        pA.special !== 'key' &&
        pB.special !== 'none' &&
        pB.special !== 'key'
      ) {
        const blast = resolveCellsToClear(
          gridRef.current,
          [
            { row: r1, col: c1 },
            { row: r2, col: c2 },
          ],
          [],
          true
        );
        applyBlastProgress(blast, 1);
        await sleep(185);
        applyGravityAndRefill(gridRef.current, level.colors, level.submergedFromRow);
        await sleep(185);
        await runCascadeLoop([], 1);
        advanceMovePressureIfNeeded();
        busyRef.current = false;
        return;
      }

      await runCascadeLoop(
        [
          { row: r1, col: c1 },
          { row: r2, col: c2 },
        ],
        0
      );
      advanceMovePressureIfNeeded();
      busyRef.current = false;
    },
    [
      advanceMovePressureIfNeeded,
      applyBlastProgress,
      level.cols,
      level.colors,
      level.rows,
      level.submergedFromRow,
      runCascadeLoop,
    ]
  );

  // Every swap is one transaction: whatever happens inside (even an unexpected error),
  // the board lock is released so the player is never stuck on a frozen board.
  const attemptSwap = useCallback(
    async (r1: number, c1: number, r2: number, c2: number) => {
      try {
        await attemptSwapCore(r1, c1, r2, c2);
      } catch (err) {
        console.error('Swap failed, board unlocked:', err);
      } finally {
        busyRef.current = false;
      }
    },
    [attemptSwapCore]
  );

  const handleTargetedBoardTool = useCallback(
    async (kind: 'hammer' | 'bomb', row: number, col: number) => {
      if (busyRef.current || statusRef.current !== 'playing') return;
      const cell = gridRef.current[row]?.[col];
      if (!cell) return;
      if (
        kind === 'hammer' &&
        cell.blocker === 'none' &&
        (!cell.candy || cell.candy.special === 'key')
      ) {
        return;
      }

      if (!onConsumeBooster(kind)) {
        setTargetTool(null);
        return;
      }

      setTargetTool(null);
      busyRef.current = true;
      idleSecondsRef.current = 0;

      soundEngine.playSpecialBlast('bomb');
      worldRef.current?.spawnBeamEffect('bomb', row, col);

      const seeds: Array<{ row: number; col: number }> = [];
      if (kind === 'hammer') {
        seeds.push({ row, col });
        showFloatingBanner('CANDY SMASH!', 'from-rose-300 to-amber-300');
      } else {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = row + dr;
            const nc = col + dc;
            if (nr >= 0 && nr < level.rows && nc >= 0 && nc < level.cols) {
              seeds.push({ row: nr, col: nc });
            }
          }
        }
        showFloatingBanner(
          lang === 'bn' ? '৩x৩ জিলাপি বোমা!' : '3x3 JILAPI SPARK BOMB!',
          'from-amber-200 to-orange-500'
        );
      }

      const blast = resolveCellsToClear(gridRef.current, seeds, [], false);
      applyBlastProgress(blast, 0);
      await sleep(160);
      applyGravityAndRefill(gridRef.current, level.colors, level.submergedFromRow);
      await sleep(180);
      await runCascadeLoop([], 0);
      busyRef.current = false;
    },
    [
      applyBlastProgress,
      lang,
      level.cols,
      level.colors,
      level.rows,
      level.submergedFromRow,
      onConsumeBooster,
      runCascadeLoop,
      showFloatingBanner,
    ]
  );

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    soundEngine.unlock();
    if (statusRef.current !== 'playing' || busyRef.current) return;
    const canvas = canvasRef.current;
    const world = worldRef.current;
    if (!canvas || !world) return;
    try {
      canvas.setPointerCapture(e.pointerId);
    } catch {
      /* capture is best-effort */
    }

    const hit = world.pointerToGridCell(e.clientX, e.clientY, canvas.getBoundingClientRect());
    if (!hit) {
      selectedCellRef.current = null;
      return;
    }

    idleSecondsRef.current = 0;

    if (targetTool) {
      handleTargetedBoardTool(targetTool, hit.row, hit.col);
      return;
    }

    const prev = selectedCellRef.current;
    if (prev && Math.abs(prev.row - hit.row) + Math.abs(prev.col - hit.col) === 1) {
      attemptSwap(prev.row, prev.col, hit.row, hit.col);
      dragStartRef.current = null;
      return;
    }

    selectedCellRef.current = { row: hit.row, col: hit.col };
    dragStartRef.current = {
      row: hit.row,
      col: hit.col,
      clientX: e.clientX,
      clientY: e.clientY,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!dragStartRef.current || busyRef.current || statusRef.current !== 'playing') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const thresholdPx = Math.max(16, (rect.width / level.cols) * 0.34);

    const dx = e.clientX - dragStartRef.current.clientX;
    const dy = e.clientY - dragStartRef.current.clientY;
    if (Math.hypot(dx, dy) < thresholdPx) return;

    const { row, col } = dragStartRef.current;
    dragStartRef.current = null;

    if (Math.abs(dx) > Math.abs(dy)) {
      attemptSwap(row, col, row, col + (dx > 0 ? 1 : -1));
    } else {
      attemptSwap(row, col, row + (dy > 0 ? 1 : -1), col);
    }
  };

  const handlePointerUp = () => {
    dragStartRef.current = null;
  };

  const triggerShieldBooster = () => {
    soundEngine.unlock();
    if (statusRef.current !== 'playing' || shieldActiveRef.current) return;
    if (!onConsumeBooster('shield')) return;
    shieldActiveRef.current = true;
    setShieldActiveUI(true);
    soundEngine.playFreeze();
    showFloatingBanner(
      lang === 'bn' ? 'সুগার শিল্ড চালু!' : 'SUGAR SHIELD ACTIVE!',
      'from-cyan-200 to-emerald-300'
    );
  };

  const triggerFreezeBooster = () => {
    soundEngine.unlock();
    if (statusRef.current !== 'playing') return;
    if (!onConsumeBooster('freeze')) return;

    freezeTimerRef.current = 6.0;
    setIsFrozenUI(true);
    dangerRef.current = Math.max(2, dangerRef.current - 12);
    setDanger(dangerRef.current);
    soundEngine.playFreeze();
    showFloatingBanner(
      lang === 'bn' ? '৬ সেকেন্ড ফ্রিজ!' : '6s DEEP FREEZE!',
      'from-cyan-200 to-sky-400'
    );
  };

  const triggerMagnetBooster = async () => {
    soundEngine.unlock();
    if (statusRef.current !== 'playing' || busyRef.current) return;
    if (!onConsumeBooster('magnet')) return;

    busyRef.current = true;
    const pulled = pullKeysWithMagnet(gridRef.current, level.submergedFromRow);
    soundEngine.playKeyUnlock();

    if (pulled > 0) {
      showFloatingBanner(
        lang === 'bn' ? 'ম্যাগনেট চাবি টেনেছে!' : 'MAGNET PULLED KEYS!',
        'from-amber-200 to-rose-400'
      );
      await sleep(160);
      await runCascadeLoop([], 0);
    } else {
      // Bonus harvest on non-key stages!
      const released = worldRef.current ? worldRef.current.releaseMarbles(10) : 10;
      tasksRef.current = tasksRef.current.map((t) => {
        if (t.kind === 'marbles') {
          return { ...t, current: Math.min(t.target, t.current + released) };
        }
        if (t.kind === 'color_target' || t.kind === 'bridge_candies' || t.kind === 'cannon_charge') {
          return { ...t, current: Math.min(t.target, t.current + 6) };
        }
        return t;
      });
      setTasks([...tasksRef.current]);
      showFloatingBanner(
        lang === 'bn' ? 'ম্যাগনেট হারভেস্ট!' : 'MAGNET HARVEST BOOST!',
        'from-amber-200 to-yellow-400'
      );
      checkWinCondition();
    }
    busyRef.current = false;
  };

  const triggerShuffleBooster = () => {
    soundEngine.unlock();
    if (statusRef.current !== 'playing' || busyRef.current) return;
    if (!onConsumeBooster('shuffle')) return;

    shuffleNormalCandies(gridRef.current, level.colors);
    const normalCells: GridCell[] = [];
    for (const r of gridRef.current) {
      for (const c of r) {
        if (c.candy && c.candy.special === 'none' && c.blocker === 'none') {
          normalCells.push(c);
        }
      }
    }
    if (normalCells.length > 0) {
      const pick = normalCells[Math.floor(Math.random() * normalCells.length)];
      pick.candy = createPiece(
        pick.row,
        pick.col,
        pick.candy!.color,
        Math.random() > 0.5 ? 'striped_h' : 'wrapped'
      );
      pick.candy.scale = 1.35;
    }

    hintMoveRef.current = findBestHintMove(gridRef.current, level);
    soundEngine.playSpecialBlast('rainbow');
    showFloatingBanner(
      lang === 'bn' ? 'শাফল + স্পেশাল ক্যান্ডি!' : 'SHUFFLED + BONUS SPECIAL!',
      'from-purple-200 to-pink-400'
    );
  };

  // Initialize & Run Three.js RescueWorld3D Loop!
  useEffect(() => {
    if (status === 'intro') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const world = new RescueWorld3D(canvas, level);
    worldRef.current = world;

    let animId = 0;
    let lastTime = performance.now();
    let uiAccum = 0;

    const tick = (now: number) => {
      // Paused: skip physics + GPU work entirely (saves battery/heat on phones)
      if (statusRef.current === 'paused') {
        lastTime = now;
        animId = requestAnimationFrame(tick);
        return;
      }
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;
      const timeSec = now / 1000;

      // Watchdog: a legit cascade takes ~1-3s. If the lock is held far longer, something failed.
      if (busyRef.current) {
        if (busySinceRef.current === 0) busySinceRef.current = now;
        else if (now - busySinceRef.current > 6000) {
          console.warn('Board lock stuck >6s, releasing');
          busyRef.current = false;
          busySinceRef.current = 0;
          selectedCellRef.current = null;
          applyGravityAndRefill(gridRef.current, level.colors, level.submergedFromRow);
        }
      } else {
        busySinceRef.current = 0;
      }

      if (happyTimerRef.current > 0) {
        happyTimerRef.current = Math.max(0, happyTimerRef.current - dt);
      }
      if (surprisedTimerRef.current > 0) {
        surprisedTimerRef.current = Math.max(0, surprisedTimerRef.current - dt);
      }
      if (shakeTimerRef.current > 0) {
        shakeTimerRef.current = Math.max(0, shakeTimerRef.current - dt);
      }
      if (snakeHitTimerRef.current > 0) {
        snakeHitTimerRef.current = Math.max(0, snakeHitTimerRef.current - dt);
      }

      if (statusRef.current === 'playing') {
        idleSecondsRef.current += dt;

        if (freezeTimerRef.current > 0) {
          freezeTimerRef.current = Math.max(0, freezeTimerRef.current - dt);
          if (freezeTimerRef.current <= 0) setIsFrozenUI(false);
        } else if (level.dangerSpeed > 0) {
          dangerRef.current = clampSnakeProgress(
            Math.min(100, dangerRef.current + level.dangerSpeed * dt)
          );
          uiAccum += dt;
          if (uiAccum >= 0.12) {
            uiAccum = 0;
            setDanger(dangerRef.current);
          }

          if (dangerRef.current >= 76) {
            heartbeatCooldownRef.current -= dt;
            if (heartbeatCooldownRef.current <= 0) {
              heartbeatCooldownRef.current = 1.05;
              soundEngine.playHeartbeat();
            }
          }

          if (dangerRef.current >= 100) {
            if (shieldActiveRef.current) {
              shieldActiveRef.current = false;
              setShieldActiveUI(false);
              // Shield saves Mochi once, pushing the Snake back but never past an unbroken barrier
              dangerRef.current = clampSnakeProgress(68);
              setDanger(dangerRef.current);
              freezeTimerRef.current = 3.5;
              setIsFrozenUI(true);
              soundEngine.playFreeze();
            } else {
              // SNAKE TOUCHED MOCHI → instant death
              mochiCaughtRef.current = true;
              statusRef.current = 'lost';
              setDanger(100);
              setStatus('lost');
              shakeTimerRef.current = 0.5;
              soundEngine.playFail();
            }
          }
        }

        // Boss Slime Spit!
        if (level.scene === 'boss_lair' && freezeTimerRef.current <= 0) {
          bossSlimeTimerRef.current += dt;
          if (bossSlimeTimerRef.current >= 10.5) {
            bossSlimeTimerRef.current = 0;
            let currentSlimes = 0;
            const candidates: GridCell[] = [];
            for (const row of gridRef.current) {
              for (const cell of row) {
                if (cell.blocker === 'slime') currentSlimes++;
                if (cell.blocker === 'none' && cell.candy && cell.candy.special === 'none') {
                  candidates.push(cell);
                }
              }
            }
            if (currentSlimes < 4 && candidates.length > 0) {
              const target = candidates[Math.floor(Math.random() * candidates.length)];
              surprisedTimerRef.current = 1.2;
              world.spawnFlyingProjectile(
                'slime',
                new THREE.Vector3(1.5, 4.2, 0.5),
                world.cellToWorld(target.row, target.col)
              );
              setTimeout(() => {
                if (statusRef.current === 'playing' && target.blocker === 'none') {
                  target.blocker = 'slime';
                }
              }, 420);
            }
          }
        }
      } else if (statusRef.current === 'rescuing') {
        rescueAnimRef.current = Math.min(1, rescueAnimRef.current + dt * 0.68);
        if (rescueAnimRef.current >= 1) {
          statusRef.current = 'won';
          setStatus('won');
        }
      }

      for (const row of gridRef.current) {
        for (const cell of row) {
          const p = cell.candy;
          if (!p) continue;
          p.visX += (p.col - p.visX) * Math.min(1, dt * 16);
          p.visY += (p.row - p.visY) * Math.min(1, dt * 14);
          p.scale += (1 - p.scale) * Math.min(1, dt * 12);
          if (p.wobble > 0) p.wobble = Math.max(0, p.wobble - dt * 3);
        }
      }

      world.updateAndRender(dt, timeSec, {
        grid: gridRef.current,
        tasks: tasksRef.current,
        danger: dangerRef.current,
        status: statusRef.current,
        rescueAnimProgress: rescueAnimRef.current,
        freezeTimer: freezeTimerRef.current,
        happyTimer: happyTimerRef.current,
        surprisedTimer: surprisedTimerRef.current,
        shakeTimer: shakeTimerRef.current,
        snakeHpPct: snakeHpRef.current,
        snakeHitTimer: snakeHitTimerRef.current,
        snakeObstacles: snakeObstaclesRef.current,
        mochiCaught: mochiCaughtRef.current,
        selectedCell: selectedCellRef.current,
        hintMove: hintMoveRef.current,
        showHint:
          statusRef.current === 'playing' &&
          !busyRef.current &&
          !targetToolRef.current &&
          idleSecondsRef.current >= 3.5,
      });

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(animId);
      world.dispose();
      worldRef.current = null;
    };
  }, [level, status === 'intro', worldEpoch]);

  if (status === 'intro') {
    return (
      <IntroCutscene
        lang={lang}
        onComplete={() => {
          statusRef.current = 'playing';
          setStatus('playing');
        }}
      />
    );
  }

  const isHighDanger = danger >= 72 && status === 'playing';
  const movesRemaining =
    level.moveLimit !== undefined ? Math.max(0, level.moveLimit - movesUsed) : null;
  const rescuePercent =
    tasks.length > 0
      ? Math.round(
          (tasks.reduce((acc, tk) => acc + Math.min(1, tk.current / tk.target), 0) /
            tasks.length) *
            100
        )
      : 0;

  return (
    <div
      className={`relative w-full h-full flex flex-col items-center justify-between px-2 py-1.5 sm:py-2 ${
        isHighDanger ? 'danger-vignette' : ''
      }`}
    >
      {/* PREMIUM 3D GAMEPLAY HUD */}
      <div className="w-full max-w-[475px] flex flex-col gap-1.5 z-10">
        <div className="royal-hud-bar rounded-2xl px-2.5 py-1.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                soundEngine.unlock();
                if (status === 'playing') {
                  statusRef.current = 'paused';
                  setStatus('paused');
                } else if (status === 'paused') {
                  statusRef.current = 'playing';
                  setStatus('playing');
                }
              }}
              className="candy-booster-slot p-1.5 rounded-xl text-amber-200"
              title="Pause"
            >
              <Pause className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onToggleSound}
              className="candy-booster-slot p-1.5 rounded-xl text-sky-200"
              title="Sound"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={onToggleLang}
              className="candy-booster-slot px-2 py-1 rounded-xl text-[11px] font-extrabold text-amber-200 flex items-center gap-1"
            >
              <Globe className="w-3 h-3 text-sky-300" />
              <span>{lang === 'bn' ? 'EN' : 'বাংলা'}</span>
            </button>
          </div>

          {/* Level Badge & Moves Counter */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="bg-slate-950/75 border border-amber-300/40 px-2.5 py-0.5 rounded-xl text-center">
              <div className="text-[9px] uppercase tracking-wider text-amber-200/80 leading-none">
                {movesRemaining !== null
                  ? lang === 'bn'
                    ? 'বাকি চাল'
                    : 'LEFT'
                  : lang === 'bn'
                    ? 'চাল'
                    : 'MOVES'}
              </div>
              <div
                className={`text-xs font-extrabold leading-tight ${
                  movesRemaining !== null && movesRemaining <= 5 ? 'text-rose-400' : 'text-white'
                }`}
              >
                {movesRemaining !== null ? movesRemaining : movesUsed}
              </div>
            </div>

            <div className="truncate text-center">
              <div className="text-xs sm:text-sm font-extrabold text-amber-300 candy-text-shadow truncate">
                {lang === 'bn' ? level.titleBn : level.titleEn}
              </div>
              <div className="w-full bg-slate-950/80 h-1.5 rounded-full overflow-hidden border border-white/10 mt-0.5">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-lime-300 transition-all duration-200"
                  style={{ width: `${rescuePercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* 3D Danger + Shield Meter */}
          <div className="flex items-center gap-1.5 bg-slate-950/85 border border-rose-400/50 rounded-xl px-2 py-1 min-w-[96px]">
            {shieldActiveUI ? (
              <Shield3DIcon size={20} />
            ) : (
              <SerpentDanger3DIcon frozen={isFrozenUI} size={20} />
            )}
            <div className="flex-1 h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-150 ${
                  shieldActiveUI
                    ? 'bg-gradient-to-r from-cyan-300 to-emerald-400'
                    : isFrozenUI
                      ? 'bg-gradient-to-r from-cyan-300 to-sky-500'
                      : danger >= 72
                        ? 'bg-gradient-to-r from-orange-500 via-rose-500 to-red-600'
                        : 'bg-gradient-to-r from-lime-400 via-amber-400 to-orange-500'
                }`}
                style={{ width: `${Math.min(100, Math.round(danger))}%` }}
              />
            </div>
          </div>
        </div>

        {/* SNAKE HP BAR + OBSTACLE / TOUCH WARNING */}
        <div className="flex items-center gap-2 bg-slate-950/85 border border-lime-400/50 rounded-xl px-2.5 py-1">
          <SerpentDanger3DIcon size={18} />
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-lime-200 whitespace-nowrap">
            {lang === 'bn' ? 'সাপের HP' : 'SNAKE HP'}
          </span>
          <div className="flex-1 h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full rounded-full transition-all duration-200 bg-gradient-to-r from-rose-500 via-orange-400 to-lime-300"
              style={{ width: `${snakeHp}%` }}
            />
          </div>
          <span className="text-[11px] font-extrabold text-white tabular-nums w-10 text-right">
            {snakeHp}%
          </span>
        </div>
        {status === 'playing' && danger >= 88 ? (
          <div className="text-center text-[11px] sm:text-xs font-extrabold text-rose-200 animate-pulse">
            {lang === 'bn'
              ? 'সাপ কাছে! স্পর্শ করলে মোচি সাথে সাথে মরবে!'
              : 'SNAKE CLOSE! TOUCH = MOCHI DIES INSTANTLY!'}
          </div>
        ) : (
          (() => {
            const nextOb = snakeObstaclesUI.find((o) => !o.cleared);
            if (!nextOb) {
              return (
                <div className="text-center text-[11px] font-extrabold text-lime-200">
                  {lang === 'bn' ? 'সব বাধা ভাঙা! সাপের দিকে ক্যান্ডি বার্স্ট করো' : 'All barriers broken! Burst candies on the Snake'}
                </div>
              );
            }
            return (
              <div className="text-center text-[11px] font-extrabold text-amber-200">
                {lang === 'bn'
                  ? `বাধা ${nextOb.index + 1}/${snakeObstaclesUI.length}: ${nextOb.labelBn} — আরও ${nextOb.remaining} টি ভাঙো`
                  : `Barrier ${nextOb.index + 1}/${snakeObstaclesUI.length}: ${nextOb.labelEn} — smash ${nextOb.remaining} more`}
              </div>
            );
          })()
        )}

        {/* Sculpted Objective Pills */}
        <div className="flex items-center justify-center flex-wrap gap-1.5">
          {tasks.map((tk, idx) => {
            const done = tk.current >= tk.target;
            return (
              <div
                key={`${tk.kind}-${idx}`}
                className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-extrabold border-2 shadow-md transition ${
                  done
                    ? 'bg-emerald-950/90 border-emerald-400 text-emerald-200'
                    : 'bg-[#1a2752]/95 border-amber-400/60 text-white'
                }`}
              >
                <Task3DIcon kind={tk.kind} targetColor={tk.targetColor} size={17} />
                <span>{lang === 'bn' ? tk.labelBn : tk.labelEn}:</span>
                <span className={done ? 'text-emerald-300' : 'text-amber-300'}>
                  {tk.current}/{tk.target}
                </span>
                {done && <Check className="w-3.5 h-3.5 text-emerald-300 stroke-[3]" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* UNIFIED THREE.JS 3D STAGE */}
      <div className="relative flex-1 w-full max-w-[475px] min-h-0 flex items-center justify-center my-1">
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onContextMenu={(e) => e.preventDefault()}
          style={{ touchAction: 'none', WebkitTouchCallout: 'none', WebkitUserSelect: 'none' }}
          className={`touch-none select-none max-h-full max-w-full w-auto h-full aspect-[520/770] rounded-3xl border-2 border-amber-300/55 shadow-[0_14px_40px_rgba(0,0,0,0.7)] ${
            targetTool ? 'cursor-crosshair ring-4 ring-amber-300' : 'cursor-pointer'
          }`}
        />

        {banner && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20 animate-pop-in">
            <div
              className={`bg-gradient-to-b ${banner.colorClass} text-slate-950 font-candy font-extrabold text-lg sm:text-xl px-5 py-1.5 rounded-full border-2 border-white shadow-2xl whitespace-nowrap`}
            >
              {banner.text}
            </div>
          </div>
        )}

        {targetTool && (
          <div className="absolute bottom-3 inset-x-6 candy-btn-orange text-white font-extrabold text-xs sm:text-sm text-center py-2 px-4 rounded-full shadow-2xl animate-bounce pointer-events-none">
            {targetTool === 'hammer'
              ? lang === 'bn'
                ? 'যেকোনো বক্স বা ক্যান্ডিতে ট্যাপ করে ভেঙে ফেলো!'
                : 'Tap any crate, lock, or candy on the 3D board to smash it!'
              : lang === 'bn'
                ? '৩x৩ জিলাপি বোমা ফাটাতে যেকোনো ঘরে ট্যাপ করো!'
                : 'Tap any cell on the 3D board to detonate a 3x3 Spark Bomb!'}
          </div>
        )}
      </div>

      {/* EXPANDED 6-TOOL TACTILE SURVIVAL DOCK */}
      <div className="w-full max-w-[475px] royal-hud-bar rounded-2xl px-2 py-1.5 grid grid-cols-6 gap-1.5 z-10">
        <button
          type="button"
          onClick={() => {
            soundEngine.unlock();
            if (boosters.hammer > 0) setTargetTool((cur) => (cur === 'hammer' ? null : 'hammer'));
          }}
          disabled={boosters.hammer <= 0}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl font-extrabold text-[10px] ${
            targetTool === 'hammer'
              ? 'candy-btn-orange text-white scale-105'
              : boosters.hammer > 0
                ? 'candy-booster-slot text-amber-100'
                : 'bg-slate-900/70 text-slate-500 border border-slate-700 opacity-50'
          }`}
        >
          <Hammer3DIcon size={20} />
          <span>{lang === 'bn' ? 'হাতুড়ি' : 'Smash'}</span>
          <span className="text-amber-300 text-[10px] leading-none">{boosters.hammer}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundEngine.unlock();
            if (boosters.bomb > 0) setTargetTool((cur) => (cur === 'bomb' ? null : 'bomb'));
          }}
          disabled={boosters.bomb <= 0}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl font-extrabold text-[10px] ${
            targetTool === 'bomb'
              ? 'candy-btn-orange text-white scale-105'
              : boosters.bomb > 0
                ? 'candy-booster-slot text-orange-100'
                : 'bg-slate-900/70 text-slate-500 border border-slate-700 opacity-50'
          }`}
        >
          <Bomb3DIcon size={20} />
          <span>{lang === 'bn' ? 'বোমা' : 'Bomb'}</span>
          <span className="text-orange-300 text-[10px] leading-none">{boosters.bomb}</span>
        </button>

        <button
          type="button"
          onClick={triggerShieldBooster}
          disabled={boosters.shield <= 0 || shieldActiveUI}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl font-extrabold text-[10px] ${
            shieldActiveUI
              ? 'candy-btn-green text-white'
              : boosters.shield > 0
                ? 'candy-booster-slot text-cyan-100'
                : 'bg-slate-900/70 text-slate-500 border border-slate-700 opacity-50'
          }`}
        >
          <Shield3DIcon size={20} />
          <span>{lang === 'bn' ? 'শিল্ড' : 'Shield'}</span>
          <span className="text-cyan-300 text-[10px] leading-none">{boosters.shield}</span>
        </button>

        <button
          type="button"
          onClick={triggerFreezeBooster}
          disabled={boosters.freeze <= 0}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl font-extrabold text-[10px] ${
            boosters.freeze > 0
              ? 'candy-booster-slot text-sky-100'
              : 'bg-slate-900/70 text-slate-500 border border-slate-700 opacity-50'
          }`}
        >
          <Frost3DIcon size={20} />
          <span>{lang === 'bn' ? 'ফ্রিজ' : 'Freeze'}</span>
          <span className="text-sky-300 text-[10px] leading-none">{boosters.freeze}</span>
        </button>

        <button
          type="button"
          onClick={triggerMagnetBooster}
          disabled={boosters.magnet <= 0}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl font-extrabold text-[10px] ${
            boosters.magnet > 0
              ? 'candy-booster-slot text-rose-100'
              : 'bg-slate-900/70 text-slate-500 border border-slate-700 opacity-50'
          }`}
        >
          <Magnet3DIcon size={20} />
          <span>{lang === 'bn' ? 'ম্যাগনেট' : 'Magnet'}</span>
          <span className="text-rose-300 text-[10px] leading-none">{boosters.magnet}</span>
        </button>

        <button
          type="button"
          onClick={triggerShuffleBooster}
          disabled={boosters.shuffle <= 0}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl font-extrabold text-[10px] ${
            boosters.shuffle > 0
              ? 'candy-booster-slot text-purple-100'
              : 'bg-slate-900/70 text-slate-500 border border-slate-700 opacity-50'
          }`}
        >
          <Shuffle3DIcon size={20} />
          <span>{lang === 'bn' ? 'শাফল' : 'Shuffle'}</span>
          <span className="text-purple-300 text-[10px] leading-none">{boosters.shuffle}</span>
        </button>
      </div>

      {/* PAUSE POPUP */}
      {status === 'paused' && (
        <div className="absolute inset-0 z-30 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm royal-panel-3d rounded-[2.2rem] p-6 text-center animate-pop-in">
            <h2 className="text-2xl font-extrabold text-amber-300 candy-text-shadow mb-2">
              {lang === 'bn' ? 'গেম বিরতি' : 'Mission Paused'}
            </h2>
            <p className="text-xs sm:text-sm text-indigo-100 mb-5">
              {lang === 'bn' ? level.storyTipBn : level.storyTipEn}
            </p>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => {
                  statusRef.current = 'playing';
                  setStatus('playing');
                }}
                className="candy-btn-green py-3 rounded-full font-extrabold text-lg text-white candy-text-shadow flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>{lang === 'bn' ? 'খেলা চালিয়ে যাও' : 'Resume Rescue'}</span>
              </button>
              <button
                type="button"
                onClick={() => resetMission(true)}
                className="candy-btn-orange py-2.5 rounded-full font-extrabold text-base text-white candy-text-shadow flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{lang === 'bn' ? 'নতুন করে শুরু করো' : 'Restart Mission'}</span>
              </button>
              <button
                type="button"
                onClick={onBackToMap}
                className="candy-btn-blue py-2.5 rounded-full font-extrabold text-sm text-white flex items-center justify-center gap-2"
              >
                <MapIcon className="w-4 h-4" />
                <span>{lang === 'bn' ? 'সাগা ম্যাপ' : 'Saga Map'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MISSION FAILED POPUP */}
      {status === 'lost' && (
        <div className="absolute inset-0 z-30 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-5">
          <div className="w-full max-w-sm royal-panel-3d rounded-[2.2rem] p-6 text-center flex flex-col items-center animate-pop-in">
            <div className="candy-fail-orb w-48 h-28 rounded-[999px] flex items-center justify-center mb-4 transform -rotate-2 animate-float">
              <span className="font-candy text-5xl font-extrabold italic tracking-wide text-white candy-text-shadow">
                Fail
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold text-rose-300 candy-text-shadow mb-1.5">
              {lang === 'bn' ? 'হায় না! মোচি আটকে পড়েছে!' : 'Oh no! Mochi Was Caught!'}
            </h3>
            <p className="text-xs sm:text-sm text-indigo-100 mb-6 leading-relaxed">
              {lang === 'bn' ? level.storyTipBn : level.storyTipEn}
            </p>

            <div className="flex flex-col w-full gap-3">
              <button
                type="button"
                onClick={() => resetMission(true)}
                className="candy-btn-green py-3.5 px-8 rounded-full font-candy text-xl font-extrabold text-white candy-text-shadow flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                <span>{lang === 'bn' ? 'আবার চেষ্টা করো' : 'Try Again'}</span>
              </button>
              <button
                type="button"
                onClick={onBackToMap}
                className="candy-btn-orange py-2.5 px-6 rounded-full font-extrabold text-sm text-white candy-text-shadow"
              >
                {lang === 'bn' ? 'সাগা ম্যাপ দেখো' : 'Saga Map'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LEVEL COMPLETE / RESCUE VICTORY POPUP */}
      {status === 'won' && (
        <div className="absolute inset-0 z-30 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-5">
          <div className="w-full max-w-sm royal-panel-3d rounded-[2.2rem] p-6 text-center animate-pop-in">
            <div className="inline-flex items-center gap-1.5 bg-emerald-500/25 border border-emerald-300/60 text-emerald-200 text-xs font-extrabold px-3.5 py-1 rounded-full mb-2">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>{lang === 'bn' ? 'রেসকিউ সফল!' : 'RESCUE COMPLETE!'}</span>
            </div>

            <h2 className="text-3xl font-extrabold text-amber-300 candy-text-shadow mb-2">
              {lang === 'bn' ? 'মোচি বেঁচে গেছে!' : 'Mochi Rescued!'}
            </h2>

            <div className="flex items-center justify-center gap-3 my-4">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={
                    s <= earnedStars
                      ? 'scale-110 drop-shadow-[0_0_16px_rgba(250,204,21,0.85)] animate-float'
                      : 'opacity-45'
                  }
                >
                  <Star3DIcon size={48} active={s <= earnedStars} />
                </div>
              ))}
            </div>

            <div className="bg-slate-950/75 border border-amber-300/35 rounded-2xl py-3 px-4 mb-5 flex items-center justify-around">
              <div>
                <div className="text-[11px] font-bold text-indigo-300">
                  {lang === 'bn' ? 'মোট স্কোর' : 'TOTAL SCORE'}
                </div>
                <div className="text-2xl font-extrabold text-amber-300">{score}</div>
              </div>
              {earnedStars === 3 && (
                <div className="border-l border-white/15 pl-4 flex items-center gap-2">
                  <Hammer3DIcon size={28} />
                  <div className="text-left">
                    <div className="text-[10px] font-bold text-emerald-300">
                      {lang === 'bn' ? '৩-স্টার উপহার' : '3-STAR REWARD'}
                    </div>
                    <div className="text-sm font-extrabold text-white">+1 Smash!</div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3">
              {hasNextLevel ? (
                <button
                  type="button"
                  onClick={onNextLevel}
                  className="candy-btn-green py-3.5 px-6 rounded-full font-candy text-xl font-extrabold text-white candy-text-shadow flex items-center justify-center gap-2"
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>{lang === 'bn' ? 'পরের মিশন' : 'Next Rescue Mission'}</span>
                </button>
              ) : (
                <div className="bg-amber-400/20 border border-amber-300/60 rounded-2xl p-3 text-amber-200 text-sm font-extrabold mb-1">
                  {lang === 'bn'
                    ? 'অভিনন্দন! তুমি সবগুলো ৫৬টি 3D রেসকিউ মিশন জিতেছ!'
                    : 'Congratulations! You conquered all 56 3D Rescue Missions!'}
                </div>
              )}

              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => resetMission(true)}
                  className="flex-1 candy-btn-blue py-2.5 rounded-full font-extrabold text-sm text-white"
                >
                  {lang === 'bn' ? 'আবার খেলো' : 'Replay'}
                </button>
                <button
                  type="button"
                  onClick={onBackToMap}
                  className="flex-1 candy-btn-orange py-2.5 rounded-full font-extrabold text-sm text-white"
                >
                  {lang === 'bn' ? 'সাগা ম্যাপ' : 'Saga Map'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
