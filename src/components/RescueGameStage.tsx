import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  BoosterKind,
  CandyColor,
  GameStatus,
  GridCell,
  Language,
  LevelConfig,
  SpecialType,
  TaskProgress,
} from '../types/game';
import {
  applyGravityAndRefill,
  buildInitialBoard,
  canSwapCells,
  collectBottomKeys,
  createPiece,
  findBestHintMove,
  findMatches,
  hasAnyValidMove,
  HintMove,
  isProductiveSwap,
  resolveCellsToClear,
  shuffleNormalCandies,
  StepBlastResult,
} from '../engine/match3';
import { RescueWorld3D } from '../three/rescueWorld3D';
import { soundEngine } from '../audio/soundEngine';
import { IntroCutscene } from './IntroCutscene';
import {
  Frost3DIcon,
  Hammer3DIcon,
  SerpentDanger3DIcon,
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
  const [movesUsed, setMovesUsed] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [activeHammer, setActiveHammer] = useState<boolean>(false);
  const [earnedStars, setEarnedStars] = useState<number>(3);
  const [banner, setBanner] = useState<FloatingBanner | null>(null);
  const [worldEpoch, setWorldEpoch] = useState<number>(0);

  // Mutable 60fps engine refs
  const gridRef = useRef<GridCell[][]>([]);
  const tasksRef = useRef<TaskProgress[]>([]);
  const dangerRef = useRef<number>(4);
  const statusRef = useRef<GameStatus>(level.hasIntroCutscene ? 'intro' : 'playing');
  const scoreRef = useRef<number>(0);

  const busyRef = useRef<boolean>(false);
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
      setIsFrozenUI(false);
      setMovesUsed(0);
      scoreRef.current = 0;
      setScore(0);

      statusRef.current = initialStatus;
      setStatus(initialStatus);
      setActiveHammer(false);

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

  const checkWinCondition = useCallback(() => {
    if (statusRef.current !== 'playing') return;
    const allComplete = tasksRef.current.every((t) => t.current >= t.target);
    if (allComplete) {
      statusRef.current = 'rescuing';
      setStatus('rescuing');
      rescueAnimRef.current = 0;
      happyTimerRef.current = 4.0;
      soundEngine.playWin();

      // Celebratory 3D candy confetti bursts across board!
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

      // 3D Candy Shatter Fragments & Special 3D Shockwaves
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

      // Mochi reacts happily to matches!
      if (blast.totalCandiesCleared > 0) {
        happyTimerRef.current = 1.25;
      }

      const gained =
        blast.totalCandiesCleared * 30 * (comboIndex + 1) +
        blast.cratesBroken * 120 +
        blast.iceBroken * 100 +
        blast.chainsBroken * 110 +
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

      // Release 3D marbles in silo!
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

      //Frost Turret reaction (Mission 4)
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

      // Caramel Bridge reaction (Mission 2)
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
        else if (t.kind === 'specials') add = blast.specialsTriggered;
        else if (t.kind === 'cannon_charge') add = blast.totalCandiesCleared;
        else if (t.kind === 'bridge_candies') {
          add = blast.clearedColors.orange + blast.clearedColors.yellow;
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
    [checkWinCondition, lang, level.scene, showFloatingBanner]
  );

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const runCascadeLoop = useCallback(
    async (focusCells: Array<{ row: number; col: number }> = [], initialCombo = 0) => {
      let combo = initialCombo;

      while (statusRef.current === 'playing') {
        const droppedKeys = collectBottomKeys(gridRef.current, level.colors);
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
          await sleep(170);
        }

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

        await sleep(165);
        applyGravityAndRefill(gridRef.current, level.colors);
        await sleep(185);
      }

      const finalKeys = collectBottomKeys(gridRef.current, level.colors);
      if (finalKeys.length > 0) {
        soundEngine.playKeyUnlock();
        tasksRef.current = tasksRef.current.map((t) =>
          t.kind === 'keys'
            ? { ...t, current: Math.min(t.target, t.current + finalKeys.length) }
            : t
        );
        setTasks([...tasksRef.current]);
        checkWinCondition();
      }

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

  const attemptSwap = useCallback(
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

      setMovesUsed((m) => m + 1);

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
        await sleep(190);
        applyGravityAndRefill(gridRef.current, level.colors);
        await sleep(190);
        await runCascadeLoop([], 1);
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
        await sleep(190);
        applyGravityAndRefill(gridRef.current, level.colors);
        await sleep(190);
        await runCascadeLoop([], 1);
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
      busyRef.current = false;
    },
    [applyBlastProgress, level.cols, level.colors, level.rows, runCascadeLoop]
  );

  const handleHammerSmash = useCallback(
    async (row: number, col: number) => {
      if (busyRef.current || statusRef.current !== 'playing') return;
      const cell = gridRef.current[row]?.[col];
      if (!cell) return;
      if (cell.blocker === 'none' && (!cell.candy || cell.candy.special === 'key')) return;

      if (!onConsumeBooster('hammer')) {
        setActiveHammer(false);
        return;
      }

      setActiveHammer(false);
      busyRef.current = true;
      idleSecondsRef.current = 0;

      soundEngine.playSpecialBlast('bomb');
      worldRef.current?.spawnBeamEffect('bomb', row, col);
      showFloatingBanner('CANDY SMASH!', 'from-rose-300 to-amber-300');

      const blast = resolveCellsToClear(gridRef.current, [{ row, col }], [], false);
      applyBlastProgress(blast, 0);
      await sleep(160);
      applyGravityAndRefill(gridRef.current, level.colors);
      await sleep(180);
      await runCascadeLoop([], 0);
      busyRef.current = false;
    },
    [applyBlastProgress, level.colors, onConsumeBooster, runCascadeLoop, showFloatingBanner]
  );

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    soundEngine.unlock();
    if (statusRef.current !== 'playing' || busyRef.current) return;
    const canvas = canvasRef.current;
    const world = worldRef.current;
    if (!canvas || !world) return;

    const hit = world.pointerToGridCell(e.clientX, e.clientY, canvas.getBoundingClientRect());
    if (!hit) {
      selectedCellRef.current = null;
      return;
    }

    idleSecondsRef.current = 0;

    if (activeHammer) {
      handleHammerSmash(hit.row, hit.col);
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
    const thresholdPx = (rect.width / level.cols) * 0.34;

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

  const triggerFreezeBooster = () => {
    soundEngine.unlock();
    if (statusRef.current !== 'playing') return;
    if (!onConsumeBooster('freeze')) return;

    freezeTimerRef.current = 6.0;
    setIsFrozenUI(true);
    dangerRef.current = Math.max(2, dangerRef.current - 8);
    setDanger(dangerRef.current);
    soundEngine.playFreeze();
    showFloatingBanner(
      lang === 'bn' ? '৬ সেকেন্ড ফ্রিজ!' : '6s DEEP FREEZE!',
      'from-cyan-200 to-sky-400'
    );
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
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;
      const timeSec = now / 1000;

      if (happyTimerRef.current > 0) {
        happyTimerRef.current = Math.max(0, happyTimerRef.current - dt);
      }
      if (surprisedTimerRef.current > 0) {
        surprisedTimerRef.current = Math.max(0, surprisedTimerRef.current - dt);
      }
      if (shakeTimerRef.current > 0) {
        shakeTimerRef.current = Math.max(0, shakeTimerRef.current - dt);
      }

      if (statusRef.current === 'playing') {
        idleSecondsRef.current += dt;

        if (freezeTimerRef.current > 0) {
          freezeTimerRef.current = Math.max(0, freezeTimerRef.current - dt);
          if (freezeTimerRef.current <= 0) setIsFrozenUI(false);
        } else {
          dangerRef.current = Math.min(100, dangerRef.current + level.dangerSpeed * dt);
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
            statusRef.current = 'lost';
            setDanger(100);
            setStatus('lost');
            shakeTimerRef.current = 0.5;
            soundEngine.playFail();
          }
        }

        // Boss Level 6 Slime Spit!
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

      // Smooth candy spring falling & swapping interpolation
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
        selectedCell: selectedCellRef.current,
        hintMove: hintMoveRef.current,
        showHint:
          statusRef.current === 'playing' &&
          !busyRef.current &&
          !activeHammer &&
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
  }, [activeHammer, level, status === 'intro', worldEpoch]);

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
          {/* Controls */}
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
                {lang === 'bn' ? 'চাল' : 'MOVES'}
              </div>
              <div className="text-xs font-extrabold text-white leading-tight">{movesUsed}</div>
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

          {/* 3D Danger Meter */}
          <div className="flex items-center gap-1.5 bg-slate-950/85 border border-rose-400/50 rounded-xl px-2 py-1 min-w-[96px]">
            <SerpentDanger3DIcon frozen={isFrozenUI} size={20} />
            <div className="flex-1 h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-150 ${
                  isFrozenUI
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

        {/* Sculpted Objective Pills */}
        <div className="flex items-center justify-center flex-wrap gap-1.5">
          {tasks.map((tk) => {
            const done = tk.current >= tk.target;
            return (
              <div
                key={tk.kind}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border-2 shadow-md transition ${
                  done
                    ? 'bg-emerald-950/90 border-emerald-400 text-emerald-200'
                    : 'bg-[#1a2752]/95 border-amber-400/60 text-white'
                }`}
              >
                <Task3DIcon kind={tk.kind} size={18} />
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
          className={`max-h-full max-w-full w-auto h-full aspect-[520/770] rounded-3xl border-2 border-amber-300/55 shadow-[0_14px_40px_rgba(0,0,0,0.7)] ${
            activeHammer ? 'cursor-crosshair ring-4 ring-amber-300' : 'cursor-pointer'
          }`}
        />

        {/* Floating Combo / Action Banner */}
        {banner && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20 animate-pop-in">
            <div
              className={`bg-gradient-to-b ${banner.colorClass} text-slate-950 font-candy font-extrabold text-lg sm:text-xl px-5 py-1.5 rounded-full border-2 border-white shadow-2xl whitespace-nowrap`}
            >
              {banner.text}
            </div>
          </div>
        )}

        {activeHammer && (
          <div className="absolute bottom-3 inset-x-6 candy-btn-orange text-white font-extrabold text-xs sm:text-sm text-center py-2 px-4 rounded-full shadow-2xl animate-bounce pointer-events-none">
            {lang === 'bn'
              ? 'যেকোনো বক্স বা ক্যান্ডিতে ট্যাপ করে ভেঙে ফেলো!'
              : 'Tap any crate, lock, or candy on the 3D board to smash it!'}
          </div>
        )}
      </div>

      {/* TACTILE 3D BOOSTER DOCK */}
      <div className="w-full max-w-[475px] royal-hud-bar rounded-2xl px-3 py-1.5 flex items-center justify-between gap-2.5 z-10">
        <button
          type="button"
          onClick={() => {
            soundEngine.unlock();
            if (boosters.hammer > 0) setActiveHammer((v) => !v);
          }}
          disabled={boosters.hammer <= 0}
          className={`flex-1 flex items-center justify-center gap-2 py-1.5 px-2.5 rounded-xl font-extrabold text-xs ${
            activeHammer
              ? 'candy-btn-orange text-white scale-105'
              : boosters.hammer > 0
                ? 'candy-booster-slot text-amber-100'
                : 'bg-slate-900/70 text-slate-500 border border-slate-700 opacity-50'
          }`}
        >
          <Hammer3DIcon size={22} />
          <span>{lang === 'bn' ? 'হাতুড়ি' : 'Smash'}</span>
          <span className="bg-slate-950/85 text-amber-300 px-2 py-0.5 rounded-full text-[11px] border border-amber-300/30">
            {boosters.hammer}
          </span>
        </button>

        <button
          type="button"
          onClick={triggerFreezeBooster}
          disabled={boosters.freeze <= 0}
          className={`flex-1 flex items-center justify-center gap-2 py-1.5 px-2.5 rounded-xl font-extrabold text-xs ${
            boosters.freeze > 0
              ? 'candy-booster-slot text-sky-100'
              : 'bg-slate-900/70 text-slate-500 border border-slate-700 opacity-50'
          }`}
        >
          <Frost3DIcon size={22} />
          <span>{lang === 'bn' ? 'ফ্রিজ' : 'Freeze'}</span>
          <span className="bg-slate-950/85 text-sky-300 px-2 py-0.5 rounded-full text-[11px] border border-sky-300/30">
            {boosters.freeze}
          </span>
        </button>

        <button
          type="button"
          onClick={triggerShuffleBooster}
          disabled={boosters.shuffle <= 0}
          className={`flex-1 flex items-center justify-center gap-2 py-1.5 px-2.5 rounded-xl font-extrabold text-xs ${
            boosters.shuffle > 0
              ? 'candy-booster-slot text-purple-100'
              : 'bg-slate-900/70 text-slate-500 border border-slate-700 opacity-50'
          }`}
        >
          <Shuffle3DIcon size={22} />
          <span>{lang === 'bn' ? 'শাফল' : 'Shuffle'}</span>
          <span className="bg-slate-950/85 text-purple-300 px-2 py-0.5 rounded-full text-[11px] border border-purple-300/30">
            {boosters.shuffle}
          </span>
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
                <span>{lang === 'bn' ? 'মিশন ম্যাপ' : 'Kingdom Map'}</span>
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
                {lang === 'bn' ? 'মিশন ম্যাপ দেখো' : 'Mission Map'}
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

            {/* 3 Sculpted 3D Gold Stars */}
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

            {/* Score & Floating Booster Reward */}
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
                  <span>{lang === 'bn' ? 'পরের টাস্ক মিশন' : 'Next Rescue Mission'}</span>
                </button>
              ) : (
                <div className="bg-amber-400/20 border border-amber-300/60 rounded-2xl p-3 text-amber-200 text-sm font-extrabold mb-1">
                  {lang === 'bn'
                    ? 'অভিনন্দন! তুমি সবগুলো 3D বস মিশন জিতে মোচিকে চিরতরে বাঁচিয়েছ!'
                    : 'Congratulations! You conquered all 6 3D Rescue Missions!'}
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
                  {lang === 'bn' ? 'মিশন ম্যাপ' : 'Kingdom Map'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
