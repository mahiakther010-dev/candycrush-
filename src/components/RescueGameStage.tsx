import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  BoosterKind,
  CandyColor,
  GameStatus,
  GridCell,
  Language,
  LevelConfig,
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
  isSolidBlocker,
  resolveCellsToClear,
  shuffleNormalCandies,
  StepBlastResult,
} from '../engine/match3';
import {
  CANDY_PALETTE,
  drawCandyPiece,
  drawCellOverlayBlocker,
  drawCellUnderlayBlocker,
  drawHintHand,
} from '../engine/candyArt';
import {
  ArenaBounds,
  createInitialMarbles,
  drawMarbleBall,
  FlyingItem,
  getSiloRect,
  MarbleBall,
  renderRescueArena,
  stepMarblesPhysics,
} from '../engine/rescueRenderer';
import { soundEngine } from '../audio/soundEngine';
import { IntroCutscene } from './IntroCutscene';
import { Pause, RotateCcw, Map as MapIcon, Volume2, VolumeX, Sparkles } from 'lucide-react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  color: string;
  life: number;
  maxLife: number;
}

interface BeamVisual {
  kind: 'row' | 'col' | 'bomb' | 'rainbow';
  x: number;
  y: number;
  targets?: Array<{ x: number; y: number }>;
  life: number;
  maxLife: number;
}

interface FloatingPopup {
  x: number;
  y: number;
  text: string;
  color: string;
  life: number;
  maxLife: number;
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

const STAGE_W = 520;
const STAGE_H = 770;
const ARENA_BOUNDS: ArenaBounds = { x: 10, y: 8, w: 500, h: 330 };
const BOARD_RECT = { x: 14, y: 348, w: 492, h: 412 };

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

  const [status, setStatus] = useState<GameStatus>(
    level.hasIntroCutscene ? 'intro' : 'playing'
  );
  const [tasks, setTasks] = useState<TaskProgress[]>(() =>
    level.tasks.map((t) => ({ ...t, current: 0 }))
  );
  const [danger, setDanger] = useState<number>(4);
  const [score, setScore] = useState<number>(0);
  const [activeHammer, setActiveHammer] = useState<boolean>(false);
  const [earnedStars, setEarnedStars] = useState<number>(3);

  // Mutable engine refs for 60fps canvas loop without React re-render stalls
  const gridRef = useRef<GridCell[][]>([]);
  const tasksRef = useRef<TaskProgress[]>([]);
  const dangerRef = useRef<number>(4);
  const statusRef = useRef<GameStatus>(level.hasIntroCutscene ? 'intro' : 'playing');
  const scoreRef = useRef<number>(0);

  const busyRef = useRef<boolean>(false);
  const selectedCellRef = useRef<{ row: number; col: number } | null>(null);
  const dragStartRef = useRef<{ row: number; col: number; clientX: number; clientY: number } | null>(
    null
  );

  const marblesRef = useRef<MarbleBall[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const beamsRef = useRef<BeamVisual[]>([]);
  const popupsRef = useRef<FloatingPopup[]>([]);
  const flyingItemsRef = useRef<FlyingItem[]>([]);

  const freezeTimerRef = useRef<number>(0);
  const rescueAnimRef = useRef<number>(0);
  const idleSecondsRef = useRef<number>(0);
  const hintMoveRef = useRef<HintMove | null>(null);
  const shakeTimerRef = useRef<number>(0);
  const bossSlimeTimerRef = useRef<number>(0);
  const heartbeatCooldownRef = useRef<number>(0);

  const cellGeom = useCallback(() => {
    const cellW = (BOARD_RECT.w - 16) / level.cols;
    const cellH = (BOARD_RECT.h - 16) / level.rows;
    const cellSize = Math.min(cellW, cellH);
    const totalW = cellSize * level.cols;
    const totalH = cellSize * level.rows;
    const originX = BOARD_RECT.x + (BOARD_RECT.w - totalW) / 2;
    const originY = BOARD_RECT.y + (BOARD_RECT.h - totalH) / 2;
    return { cellSize, originX, originY, totalW, totalH };
  }, [level.cols, level.rows]);

  const cellCenter = useCallback(
    (row: number, col: number) => {
      const { cellSize, originX, originY } = cellGeom();
      return {
        x: originX + (col + 0.5) * cellSize,
        y: originY + (row + 0.5) * cellSize,
      };
    },
    [cellGeom]
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
      scoreRef.current = 0;
      setScore(0);

      statusRef.current = initialStatus;
      setStatus(initialStatus);
      setActiveHammer(false);

      busyRef.current = false;
      selectedCellRef.current = null;
      dragStartRef.current = null;
      freezeTimerRef.current = 0;
      rescueAnimRef.current = 0;
      idleSecondsRef.current = 0;
      hintMoveRef.current = findBestHintMove(gridRef.current, level);
      shakeTimerRef.current = 0;
      bossSlimeTimerRef.current = 0;

      particlesRef.current = [];
      beamsRef.current = [];
      popupsRef.current = [];
      flyingItemsRef.current = [];

      if (level.initialMarbles > 0) {
        const silo = getSiloRect(ARENA_BOUNDS, level);
        marblesRef.current = createInitialMarbles(
          level.initialMarbles,
          silo.x,
          silo.y,
          silo.w,
          silo.h
        );
      } else {
        marblesRef.current = [];
      }
    },
    [level]
  );

  useEffect(() => {
    resetMission(false);
  }, [resetMission]);

  const spawnBurstParticles = useCallback((x: number, y: number, color: string, count = 10) => {
    for (let i = 0; i < count; i++) {
      const ang = Math.random() * Math.PI * 2;
      const spd = 55 + Math.random() * 170;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd - 35,
        r: 3 + Math.random() * 4.5,
        color,
        life: 0,
        maxLife: 0.45 + Math.random() * 0.25,
      });
    }
  }, []);

  const addPopup = useCallback((x: number, y: number, text: string, color = '#fde047') => {
    popupsRef.current.push({ x, y, text, color, life: 0, maxLife: 0.95 });
  }, []);

  const releaseSiloMarbles = useCallback(
    (count: number) => {
      if (count <= 0) return 0;
      const available = marblesRef.current
        .filter((m) => !m.draining)
        .sort((a, b) => b.y - a.y);
      const toRelease = available.slice(0, count);
      toRelease.forEach((m, idx) => {
        m.draining = true;
        m.vy = 60 + idx * 18;
        m.vx = (Math.random() - 0.5) * 90;
      });
      if (toRelease.length > 0) {
        soundEngine.playMarbleDrop();
      }
      return toRelease.length;
    },
    []
  );

  const checkWinCondition = useCallback(() => {
    if (statusRef.current !== 'playing') return;
    const allComplete = tasksRef.current.every((t) => t.current >= t.target);
    if (allComplete) {
      statusRef.current = 'rescuing';
      setStatus('rescuing');
      rescueAnimRef.current = 0;
      soundEngine.playWin();

      // Celebratory confetti burst!
      const confettiColors = ['#f43f5e', '#facc15', '#4ade80', '#38bdf8', '#c084fc'];
      for (let i = 0; i < 48; i++) {
        spawnBurstParticles(
          100 + Math.random() * 320,
          90 + Math.random() * 180,
          confettiColors[i % confettiColors.length],
          2
        );
      }

      const stars = dangerRef.current < 58 ? 3 : dangerRef.current < 82 ? 2 : 1;
      setEarnedStars(stars);
      const bonus = Math.round((100 - dangerRef.current) * 25);
      scoreRef.current += bonus;
      setScore(scoreRef.current);
      onLevelWin(level.id, stars, scoreRef.current);
    }
  }, [level.id, onLevelWin, spawnBurstParticles]);

  const applyBlastProgress = useCallback(
    (blast: StepBlastResult, comboIndex: number) => {
      // Visual particles & beams
      for (const pop of blast.poppedPositions) {
        const c = cellCenter(pop.row, pop.col);
        spawnBurstParticles(c.x, c.y, CANDY_PALETTE[pop.color].light, 7);
      }
      for (const bm of blast.beamEffects) {
        const origin = cellCenter(bm.row, bm.col);
        beamsRef.current.push({
          kind: bm.kind,
          x: origin.x,
          y: origin.y,
          targets: bm.targetCells?.map((tc) => cellCenter(tc.row, tc.col)),
          life: 0,
          maxLife: 0.34,
        });
        shakeTimerRef.current = 0.22;
        soundEngine.playSpecialBlast(
          bm.kind === 'row' || bm.kind === 'col' ? 'striped' : bm.kind
        );
      }

      // Score update
      const gained =
        blast.totalCandiesCleared * 30 * (comboIndex + 1) +
        blast.cratesBroken * 120 +
        blast.iceBroken * 100 +
        blast.chainsBroken * 110 +
        blast.specialsTriggered * 200;
      scoreRef.current += gained;
      setScore(scoreRef.current);

      if (comboIndex >= 1 && blast.poppedPositions.length > 0) {
        const mid = blast.poppedPositions[0];
        const pt = cellCenter(mid.row, mid.col);
        addPopup(
          pt.x,
          pt.y - 10,
          comboIndex >= 2
            ? lang === 'bn'
              ? `${comboIndex + 1}x সুপার কম্বো!`
              : `${comboIndex + 1}x SUPER!`
            : `${comboIndex + 1}x COMBO!`,
          '#fde047'
        );
      }

      // Update Mission Tasks!
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
        marblesReleasedNow = releaseSiloMarbles(desiredRelease);
      }

      // Scene-specific reactive rescue interactions!
      if (level.scene === 'frost_dual' && blast.clearedColors.blue > 0) {
        const pushback = blast.clearedColors.blue * 2.4;
        dangerRef.current = Math.max(2, dangerRef.current - pushback);
        setDanger(dangerRef.current);
        if (blast.clearedColors.blue >= 4) {
          freezeTimerRef.current = Math.max(freezeTimerRef.current, 2.6);
          soundEngine.playFreeze();
          addPopup(STAGE_W * 0.5, 95, lang === 'bn' ? '❄️ ফ্রিজ শট!' : '❄️ FROST BLAST!', '#7dd3fc');
        }
        flyingItemsRef.current.push({
          id: Math.random(),
          kind: 'frost',
          x: STAGE_W * 0.5,
          y: BOARD_RECT.y + 40,
          startX: STAGE_W * 0.5,
          startY: BOARD_RECT.y + 40,
          targetX: STAGE_W * 0.5,
          targetY: 54,
          progress: 0,
        });
      }

      if (
        level.scene === 'lava_bridge' &&
        blast.clearedColors.orange + blast.clearedColors.yellow > 0
      ) {
        flyingItemsRef.current.push({
          id: Math.random(),
          kind: 'plank',
          x: STAGE_W * 0.5,
          y: BOARD_RECT.y + 60,
          startX: STAGE_W * 0.5,
          startY: BOARD_RECT.y + 60,
          targetX: STAGE_W * 0.5,
          targetY: ARENA_BOUNDS.y + ARENA_BOUNDS.h - 118,
          progress: 0,
        });
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
    [addPopup, cellCenter, checkWinCondition, lang, level.scene, releaseSiloMarbles, spawnBurstParticles]
  );

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const runCascadeLoop = useCallback(
    async (focusCells: Array<{ row: number; col: number }> = [], initialCombo = 0) => {
      let combo = initialCombo;

      while (statusRef.current === 'playing') {
        // Check if any Golden Keys reached the bottom row!
        const droppedKeys = collectBottomKeys(gridRef.current, level.colors);
        if (droppedKeys.length > 0) {
          soundEngine.playKeyUnlock();
          for (const dk of droppedKeys) {
            const start = cellCenter(dk.row, dk.col);
            flyingItemsRef.current.push({
              id: Math.random(),
              kind: 'key',
              x: start.x,
              y: start.y,
              startX: start.x,
              startY: start.y,
              targetX: STAGE_W * 0.5,
              targetY: ARENA_BOUNDS.y + ARENA_BOUNDS.h - 90,
              progress: 0,
            });
            addPopup(
              start.x,
              start.y - 16,
              lang === 'bn' ? '🗝️ তালা খুলেছে!' : '🗝️ KEY UNLOCKED!',
              '#fde047'
            );
          }

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
          special: GridCell['candy'] extends infer P
            ? P extends { special: infer S }
              ? S
              : never
            : never;
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

      // Final bottom-key check after settle
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
        addPopup(
          STAGE_W * 0.5,
          BOARD_RECT.y + 160,
          lang === 'bn' ? '🔀 অটো শাফল!' : '🔀 Auto Shuffle!',
          '#c084fc'
        );
      }

      hintMoveRef.current = findBestHintMove(gridRef.current, level);
    },
    [addPopup, applyBlastProgress, cellCenter, checkWinCondition, lang, level]
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

      // Perform visual swap
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

      // Check Special + Rainbow OR Special + Special direct combo!
      if (
        (pA.special === 'rainbow' && pB.special !== 'key') ||
        (pB.special === 'rainbow' && pA.special !== 'key')
      ) {
        const rainbowCell = pA.special === 'rainbow' ? { row: r2, col: c2 } : { row: r1, col: c1 };
        const otherPiece = pA.special === 'rainbow' ? pB : pA;

        // If Rainbow + Rainbow -> FULL BOARD MEGA BLAST!
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

      // Two Special Candies swapped together (Striped/Bomb combos!)
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
      const pt = cellCenter(row, col);
      spawnBurstParticles(pt.x, pt.y, '#fde047', 16);
      addPopup(pt.x, pt.y - 12, '🔨 SMASH!', '#fde047');

      const blast = resolveCellsToClear(gridRef.current, [{ row, col }], [], false);
      applyBlastProgress(blast, 0);
      await sleep(160);
      applyGravityAndRefill(gridRef.current, level.colors);
      await sleep(180);
      await runCascadeLoop([], 0);
      busyRef.current = false;
    },
    [
      addPopup,
      applyBlastProgress,
      cellCenter,
      level.colors,
      onConsumeBooster,
      runCascadeLoop,
      spawnBurstParticles,
    ]
  );

  // Pointer coordinate helper
  const pointerToCell = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const sx = ((clientX - rect.left) / rect.width) * STAGE_W;
    const sy = ((clientY - rect.top) / rect.height) * STAGE_H;

    const { cellSize, originX, originY } = cellGeom();
    const col = Math.floor((sx - originX) / cellSize);
    const row = Math.floor((sy - originY) / cellSize);
    if (row < 0 || row >= level.rows || col < 0 || col >= level.cols) {
      return null;
    }
    return { row, col, sx, sy };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    soundEngine.unlock();
    if (statusRef.current !== 'playing' || busyRef.current) return;

    const hit = pointerToCell(e.clientX, e.clientY);
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
    const { cellSize } = cellGeom();
    const thresholdPx = (cellSize / STAGE_W) * rect.width * 0.36;

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
    dangerRef.current = Math.max(2, dangerRef.current - 8);
    setDanger(dangerRef.current);
    soundEngine.playFreeze();
    addPopup(
      STAGE_W * 0.5,
      145,
      lang === 'bn' ? '❄️ ৬ সেকেন্ড ফ্রিজ!' : '❄️ 6s FROZEN!',
      '#7dd3fc'
    );
  };

  const triggerShuffleBooster = () => {
    soundEngine.unlock();
    if (statusRef.current !== 'playing' || busyRef.current) return;
    if (!onConsumeBooster('shuffle')) return;

    shuffleNormalCandies(gridRef.current, level.colors);
    // Bonus: convert one random normal candy into a Striped Candy!
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
        Math.random() > 0.5 ? 'striped_h' : 'striped_v'
      );
      pick.candy.scale = 1.35;
    }

    hintMoveRef.current = findBestHintMove(gridRef.current, level);
    soundEngine.playSpecialBlast('rainbow');
    addPopup(
      STAGE_W * 0.5,
      BOARD_RECT.y + 180,
      lang === 'bn' ? '✨ বোর্ড শাফল + বোনাস!' : '✨ Shuffled + Bonus!',
      '#facc15'
    );
  };

  // Main 60 FPS Simulation & Render Loop
  useEffect(() => {
    if (status === 'intro') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let lastTime = performance.now();
    let uiSyncAccum = 0;

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;
      const timeSec = now / 1000;

      // Update game timers when playing
      if (statusRef.current === 'playing') {
        idleSecondsRef.current += dt;

        if (freezeTimerRef.current > 0) {
          freezeTimerRef.current = Math.max(0, freezeTimerRef.current - dt);
        } else {
          dangerRef.current = Math.min(100, dangerRef.current + level.dangerSpeed * dt);
          uiSyncAccum += dt;
          if (uiSyncAccum >= 0.12) {
            uiSyncAccum = 0;
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
            shakeTimerRef.current = 0.45;
            soundEngine.playFail();
          }
        }

        // Boss Level 6: Crowned Serpent King periodically spits Slime onto a random candy!
        if (level.scene === 'boss_lair' && freezeTimerRef.current <= 0) {
          bossSlimeTimerRef.current += dt;
          if (bossSlimeTimerRef.current >= 10.5) {
            bossSlimeTimerRef.current = 0;
            let currentSlimes = 0;
            const candidates: GridCell[] = [];
            for (const row of gridRef.current) {
              for (const cell of row) {
                if (cell.blocker === 'slime') currentSlimes++;
                if (
                  cell.blocker === 'none' &&
                  cell.candy &&
                  cell.candy.special === 'none'
                ) {
                  candidates.push(cell);
                }
              }
            }
            if (currentSlimes < 4 && candidates.length > 0) {
              const target = candidates[Math.floor(Math.random() * candidates.length)];
              const dest = cellCenter(target.row, target.col);
              flyingItemsRef.current.push({
                id: Math.random(),
                kind: 'slime',
                x: STAGE_W * 0.65,
                y: 120,
                startX: STAGE_W * 0.65,
                startY: 120,
                targetX: dest.x,
                targetY: dest.y,
                progress: 0,
              });
              setTimeout(() => {
                if (statusRef.current === 'playing' && target.blocker === 'none') {
                  target.blocker = 'slime';
                }
              }, 380);
            }
          }
        }
      } else if (statusRef.current === 'rescuing') {
        rescueAnimRef.current = Math.min(1, rescueAnimRef.current + dt * 0.72);
        if (rescueAnimRef.current >= 1) {
          statusRef.current = 'won';
          setStatus('won');
        }
      }

      if (shakeTimerRef.current > 0) {
        shakeTimerRef.current = Math.max(0, shakeTimerRef.current - dt);
      }

      // Step Candy visual interpolation
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

      // Step Marble physics
      if (marblesRef.current.length > 0) {
        const silo = getSiloRect(ARENA_BOUNDS, level);
        const { cellSize, originX } = cellGeom();
        const minCol = level.drainColumns.length > 0 ? Math.min(...level.drainColumns) : 0;
        const maxCol = level.drainColumns.length > 0 ? Math.max(...level.drainColumns) : 2;
        stepMarblesPhysics(marblesRef.current, dt, silo, [
          originX + minCol * cellSize,
          originX + (maxCol + 1) * cellSize,
        ]);
        marblesRef.current = marblesRef.current.filter((m) => m.alpha > 0.03);
      }

      // Step Particles, Beams, Popups, Flying Items
      particlesRef.current.forEach((pt) => {
        pt.life += dt;
        pt.vy += 320 * dt;
        pt.x += pt.vx * dt;
        pt.y += pt.vy * dt;
      });
      particlesRef.current = particlesRef.current.filter((pt) => pt.life < pt.maxLife);

      beamsRef.current.forEach((bm) => (bm.life += dt));
      beamsRef.current = beamsRef.current.filter((bm) => bm.life < bm.maxLife);

      popupsRef.current.forEach((pp) => {
        pp.life += dt;
        pp.y -= 28 * dt;
      });
      popupsRef.current = popupsRef.current.filter((pp) => pp.life < pp.maxLife);

      flyingItemsRef.current.forEach((fi) => {
        fi.progress += dt * 2.4;
        const t = Math.min(1, fi.progress);
        const arc = Math.sin(t * Math.PI) * -45;
        fi.x = fi.startX + (fi.targetX - fi.startX) * t;
        fi.y = fi.startY + (fi.targetY - fi.startY) * t + arc;
      });
      flyingItemsRef.current = flyingItemsRef.current.filter((fi) => fi.progress < 1);

      // ================= RENDER UNIFIED STAGE =================
      const dpr = window.devicePixelRatio || 1;
      if (canvas.width !== STAGE_W * dpr || canvas.height !== STAGE_H * dpr) {
        canvas.width = STAGE_W * dpr;
        canvas.height = STAGE_H * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, STAGE_W, STAGE_H);

      if (shakeTimerRef.current > 0) {
        const mag = shakeTimerRef.current * 14;
        ctx.translate((Math.random() - 0.5) * mag, (Math.random() - 0.5) * mag);
      }

      // 1. Render Top Rescue Arena!
      renderRescueArena({
        ctx,
        bounds: ARENA_BOUNDS,
        level,
        tasks: tasksRef.current,
        danger: dangerRef.current,
        status: statusRef.current,
        rescueAnimProgress:
          statusRef.current === 'won' ? 1 : rescueAnimRef.current,
        freezeTimer: freezeTimerRef.current,
        marbles: marblesRef.current,
        time: timeSec,
        lang,
      });

      // 2. Render Lower Match-3 Board Frame!
      const { cellSize, originX, originY, totalW, totalH } = cellGeom();
      ctx.save();
      const boardGrad = ctx.createLinearGradient(0, BOARD_RECT.y, 0, BOARD_RECT.y + BOARD_RECT.h);
      boardGrad.addColorStop(0, '#1e3250');
      boardGrad.addColorStop(1, '#0f1a2c');
      ctx.fillStyle = boardGrad;
      ctx.strokeStyle = activeHammer ? '#facc15' : '#f59e0b';
      ctx.lineWidth = activeHammer ? 4 : 3;
      ctx.beginPath();
      ctx.roundRect(BOARD_RECT.x, BOARD_RECT.y, BOARD_RECT.w, BOARD_RECT.h, 18);
      ctx.fill();
      ctx.stroke();

      // Checkerboard cells + Drain column highlights + Key exit arrows
      for (let r = 0; r < level.rows; r++) {
        for (let c = 0; c < level.cols; c++) {
          const cx = originX + c * cellSize;
          const cy = originY + r * cellSize;
          const isDrain = level.drainColumns.includes(c);

          ctx.fillStyle = isDrain
            ? (r + c) % 2 === 0
              ? 'rgba(245, 158, 11, 0.17)'
              : 'rgba(245, 158, 11, 0.10)'
            : (r + c) % 2 === 0
              ? 'rgba(255, 255, 255, 0.07)'
              : 'rgba(15, 23, 42, 0.38)';
          ctx.beginPath();
          ctx.roundRect(cx + 2, cy + 2, cellSize - 4, cellSize - 4, 9);
          ctx.fill();

          // Key exit indicator on bottom row when level has a keys task
          if (
            r === level.rows - 1 &&
            level.tasks.some((tk) => tk.kind === 'keys')
          ) {
            ctx.fillStyle = 'rgba(250, 204, 21, 0.45)';
            ctx.beginPath();
            ctx.moveTo(cx + cellSize * 0.5 - 6, cy + cellSize - 7);
            ctx.lineTo(cx + cellSize * 0.5 + 6, cy + cellSize - 7);
            ctx.lineTo(cx + cellSize * 0.5, cy + cellSize - 1);
            ctx.closePath();
            ctx.fill();
          }
        }
      }

      // Underlay solid crates
      for (let r = 0; r < level.rows; r++) {
        for (let c = 0; c < level.cols; c++) {
          const cell = gridRef.current[r]?.[c];
          if (cell && isSolidBlocker(cell.blocker)) {
            drawCellUnderlayBlocker(
              ctx,
              originX + (c + 0.5) * cellSize,
              originY + (r + 0.5) * cellSize,
              cellSize,
              cell.blocker
            );
          }
        }
      }

      // Clip candies inside board area so top-spawning candies enter smoothly
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(originX - 4, originY - 4, totalW + 8, totalH + 8, 10);
      ctx.clip();

      for (let r = 0; r < level.rows; r++) {
        for (let c = 0; c < level.cols; c++) {
          const cell = gridRef.current[r]?.[c];
          const p = cell?.candy;
          if (!p) continue;

          const px = originX + (p.visX + 0.5) * cellSize;
          const py = originY + (p.visY + 0.5) * cellSize;
          const wobOffset = p.wobble > 0 ? Math.sin(timeSec * 36) * p.wobble * 4 : 0;
          const isSel =
            selectedCellRef.current?.row === r && selectedCellRef.current?.col === c;

          drawCandyPiece(
            ctx,
            px + wobOffset,
            py,
            cellSize * 0.43 * p.scale,
            p.color,
            p.special,
            timeSec,
            isSel
          );
        }
      }
      ctx.restore();

      // Overlay blockers (Ice, Chains, Boss Slime)
      for (let r = 0; r < level.rows; r++) {
        for (let c = 0; c < level.cols; c++) {
          const cell = gridRef.current[r]?.[c];
          if (cell && cell.blocker !== 'none' && !isSolidBlocker(cell.blocker)) {
            drawCellOverlayBlocker(
              ctx,
              originX + (c + 0.5) * cellSize,
              originY + (r + 0.5) * cellSize,
              cellSize,
              cell.blocker,
              timeSec
            );
          }
        }
      }
      ctx.restore();

      // 3. Render Draining Marbles cascading down across the Match-3 board!
      for (const m of marblesRef.current) {
        if (m.draining) {
          drawMarbleBall(ctx, m);
        }
      }

      // 4. Render Special Laser Beams & Bomb Shockwaves
      for (const bm of beamsRef.current) {
        const alpha = 1 - bm.life / bm.maxLife;
        ctx.save();
        ctx.globalAlpha = alpha;
        if (bm.kind === 'row') {
          ctx.fillStyle = '#fef08a';
          ctx.fillRect(BOARD_RECT.x, bm.y - 10, BOARD_RECT.w, 20);
        } else if (bm.kind === 'col') {
          ctx.fillStyle = '#fef08a';
          ctx.fillRect(bm.x - 10, BOARD_RECT.y, 20, BOARD_RECT.h);
        } else if (bm.kind === 'bomb') {
          const rad = (bm.life / bm.maxLife) * cellSize * 2.1;
          ctx.strokeStyle = '#fb923c';
          ctx.lineWidth = 8;
          ctx.beginPath();
          ctx.arc(bm.x, bm.y, rad, 0, Math.PI * 2);
          ctx.stroke();
        } else if (bm.kind === 'rainbow' && bm.targets) {
          ctx.strokeStyle = '#f472b6';
          ctx.lineWidth = 4;
          for (const tg of bm.targets) {
            ctx.beginPath();
            ctx.moveTo(bm.x, bm.y);
            ctx.lineTo(tg.x, tg.y);
            ctx.stroke();
          }
        }
        ctx.restore();
      }

      // 5. Render Flying Keys / Planks / Frost / Slime projectiles between Board & Arena!
      for (const fi of flyingItemsRef.current) {
        ctx.save();
        ctx.translate(fi.x, fi.y);
        ctx.font = '22px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const emoji =
          fi.kind === 'key'
            ? '🗝️'
            : fi.kind === 'plank'
              ? '🌉'
              : fi.kind === 'frost'
                ? '❄️'
                : '🧪';
        ctx.fillText(emoji, 0, 0);
        ctx.restore();
      }

      // 6. Render Sparkle Particles & Floating Score/Combo Popups
      for (const pt of particlesRef.current) {
        const a = Math.max(0, 1 - pt.life / pt.maxLife);
        ctx.save();
        ctx.globalAlpha = a;
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      for (const pp of popupsRef.current) {
        const a = Math.max(0, 1 - pp.life / pp.maxLife);
        ctx.save();
        ctx.globalAlpha = a;
        ctx.font = 'bold 17px "Baloo Da 2", Fredoka, sans-serif';
        ctx.textAlign = 'center';
        ctx.strokeStyle = '#090d16';
        ctx.lineWidth = 4;
        ctx.strokeText(pp.text, pp.x, pp.y);
        ctx.fillStyle = pp.color;
        ctx.fillText(pp.text, pp.x, pp.y);
        ctx.restore();
      }

      // 7. Render Pointing Hint Hand Cursor when idle >= 3.5s! (Just like storyboard!)
      if (
        statusRef.current === 'playing' &&
        !busyRef.current &&
        !activeHammer &&
        idleSecondsRef.current >= 3.5 &&
        hintMoveRef.current
      ) {
        const hm = hintMoveRef.current;
        const p1 = cellCenter(hm.r1, hm.c1);
        const p2 = cellCenter(hm.r2, hm.c2);
        const slide = (Math.sin(timeSec * 4) + 1) * 0.5;
        const hx = p1.x + (p2.x - p1.x) * slide;
        const hy = p1.y + (p2.y - p1.y) * slide;

        ctx.save();
        ctx.strokeStyle = 'rgba(254, 240, 138, 0.85)';
        ctx.lineWidth = 3;
        ctx.setLineDash([5, 4]);
        ctx.beginPath();
        ctx.roundRect(
          Math.min(p1.x, p2.x) - cellSize * 0.45,
          Math.min(p1.y, p2.y) - cellSize * 0.45,
          Math.abs(p2.x - p1.x) + cellSize * 0.9,
          Math.abs(p2.y - p1.y) + cellSize * 0.9,
          12
        );
        ctx.stroke();
        ctx.restore();

        drawHintHand(ctx, hx, hy, timeSec);
      }

      ctx.restore();
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [activeHammer, cellCenter, cellGeom, lang, level, status]);

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

  return (
    <div
      className={`relative w-full h-full flex flex-col items-center justify-between px-2 py-1.5 sm:py-2 ${
        isHighDanger ? 'danger-vignette' : ''
      }`}
    >
      {/* TOP MISSION & TASK HUD */}
      <div className="w-full max-w-[470px] flex flex-col gap-1.5 z-10">
        <div className="flex items-center justify-between gap-2 bg-slate-900/90 border border-amber-400/30 rounded-2xl px-3 py-1.5 shadow-lg">
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
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/15 text-amber-300"
              title="Pause"
            >
              <Pause className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onToggleSound}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/15 text-sky-300"
              title="Sound"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={onToggleLang}
              className="px-2 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/15 text-[11px] font-bold text-amber-200"
            >
              {lang === 'bn' ? 'EN' : 'বাংলা'}
            </button>
          </div>

          <div className="text-center truncate px-1">
            <div className="text-xs sm:text-sm font-extrabold text-amber-300 truncate">
              {lang === 'bn' ? level.titleBn : level.titleEn}
            </div>
          </div>

          {/* Danger Meter Pill */}
          <div className="flex items-center gap-1.5 bg-slate-950/90 border border-red-500/40 rounded-xl px-2.5 py-1 min-w-[92px]">
            <span className="text-sm">{freezeTimerRef.current > 0 ? '❄️' : '🐊'}</span>
            <div className="flex-1 h-2.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-150 ${
                  danger >= 72
                    ? 'bg-gradient-to-r from-orange-500 to-red-600'
                    : 'bg-gradient-to-r from-lime-400 via-amber-400 to-orange-500'
                }`}
                style={{ width: `${Math.min(100, Math.round(danger))}%` }}
              />
            </div>
          </div>
        </div>

        {/* Real-Time Rescue Task Pills */}
        <div className="flex items-center justify-center flex-wrap gap-1.5">
          {tasks.map((tk) => {
            const done = tk.current >= tk.target;
            return (
              <div
                key={tk.kind}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border shadow ${
                  done
                    ? 'bg-emerald-950/90 border-emerald-400 text-emerald-300'
                    : 'bg-slate-900/90 border-amber-400/35 text-white'
                }`}
              >
                <span>{tk.icon}</span>
                <span>{lang === 'bn' ? tk.labelBn : tk.labelEn}:</span>
                <span className={done ? 'text-emerald-300' : 'text-amber-300'}>
                  {tk.current}/{tk.target} {done ? '✓' : ''}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* UNIFIED 9:16 RESCUE + MATCH-3 CANVAS */}
      <div className="relative flex-1 w-full max-w-[470px] min-h-0 flex items-center justify-center my-1">
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className={`max-h-full max-w-full w-auto h-full aspect-[520/770] rounded-2xl shadow-2xl ${
            activeHammer ? 'cursor-crosshair ring-4 ring-amber-300' : 'cursor-pointer'
          }`}
        />

        {activeHammer && (
          <div className="absolute bottom-3 inset-x-6 bg-amber-400 text-slate-950 font-extrabold text-xs sm:text-sm text-center py-1.5 px-3 rounded-full shadow-xl animate-bounce pointer-events-none">
            {lang === 'bn'
              ? '🔨 যেকোনো বক্স বা ক্যান্ডিতে ট্যাপ করে ভেঙে ফেলো!'
              : '🔨 Tap any crate, lock, or candy on the board to smash it!'}
          </div>
        )}
      </div>

      {/* BOTTOM RESCUE BOOSTERS BAR */}
      <div className="w-full max-w-[470px] flex items-center justify-between gap-2 bg-slate-900/90 border border-white/15 rounded-2xl px-3 py-1.5 z-10 shadow-lg">
        <button
          type="button"
          onClick={() => {
            soundEngine.unlock();
            if (boosters.hammer > 0) setActiveHammer((v) => !v);
          }}
          disabled={boosters.hammer <= 0}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl font-bold text-xs border transition ${
            activeHammer
              ? 'bg-amber-400 text-slate-950 border-white scale-105'
              : boosters.hammer > 0
                ? 'bg-slate-800 hover:bg-slate-700 text-amber-200 border-amber-400/40'
                : 'bg-slate-900 text-slate-500 border-slate-800 opacity-50'
          }`}
        >
          <span className="text-base">🔨</span>
          <span>{lang === 'bn' ? 'হাতুড়ি' : 'Smash'}</span>
          <span className="bg-slate-950/70 text-amber-300 px-1.5 py-0.5 rounded-full text-[11px]">
            {boosters.hammer}
          </span>
        </button>

        <button
          type="button"
          onClick={triggerFreezeBooster}
          disabled={boosters.freeze <= 0}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl font-bold text-xs border transition ${
            boosters.freeze > 0
              ? 'bg-slate-800 hover:bg-slate-700 text-sky-200 border-sky-400/40'
              : 'bg-slate-900 text-slate-500 border-slate-800 opacity-50'
          }`}
        >
          <span className="text-base">❄️</span>
          <span>{lang === 'bn' ? 'ফ্রিজ' : 'Freeze'}</span>
          <span className="bg-slate-950/70 text-sky-300 px-1.5 py-0.5 rounded-full text-[11px]">
            {boosters.freeze}
          </span>
        </button>

        <button
          type="button"
          onClick={triggerShuffleBooster}
          disabled={boosters.shuffle <= 0}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl font-bold text-xs border transition ${
            boosters.shuffle > 0
              ? 'bg-slate-800 hover:bg-slate-700 text-purple-200 border-purple-400/40'
              : 'bg-slate-900 text-slate-500 border-slate-800 opacity-50'
          }`}
        >
          <span className="text-base">🔀</span>
          <span>{lang === 'bn' ? 'শাফল' : 'Shuffle'}</span>
          <span className="bg-slate-950/70 text-purple-300 px-1.5 py-0.5 rounded-full text-[11px]">
            {boosters.shuffle}
          </span>
        </button>
      </div>

      {/* PAUSE MODAL */}
      {status === 'paused' && (
        <div className="absolute inset-0 z-30 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-gradient-to-b from-slate-800 to-slate-950 border-2 border-amber-400/60 rounded-3xl p-6 text-center shadow-2xl">
            <h2 className="text-2xl font-extrabold text-amber-300 candy-text-shadow mb-2">
              {lang === 'bn' ? 'গেম বিরতি (Paused)' : 'Mission Paused'}
            </h2>
            <p className="text-sm text-slate-300 mb-5">
              {lang === 'bn' ? level.storyTipBn : level.storyTipEn}
            </p>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => {
                  statusRef.current = 'playing';
                  setStatus('playing');
                }}
                className="candy-btn-green py-3 rounded-full font-extrabold text-lg text-white candy-text-shadow"
              >
                {lang === 'bn' ? '▶ খেলা চালিয়ে যাও' : '▶ Resume Rescue'}
              </button>
              <button
                type="button"
                onClick={() => resetMission(true)}
                className="candy-btn-orange py-2.5 rounded-full font-bold text-base text-white flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                {lang === 'bn' ? 'নতুন করে শুরু করো' : 'Restart Mission'}
              </button>
              <button
                type="button"
                onClick={onBackToMap}
                className="py-2.5 rounded-full font-bold text-sm bg-slate-800 hover:bg-slate-700 border border-white/15 text-slate-200 flex items-center justify-center gap-2"
              >
                <MapIcon className="w-4 h-4" />
                {lang === 'bn' ? 'মিশন ম্যাপে ফিরে যাও' : 'Back to Mission Map'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ICONIC FAIL OVERLAY (Inspired directly by Frame 25's Glossy Red "Fail" Candy Orb!) */}
      {status === 'lost' && (
        <div className="absolute inset-0 z-30 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-5 animate-fadeIn">
          <div className="candy-fail-orb w-56 h-36 rounded-[999px] flex items-center justify-center mb-5 transform -rotate-2 animate-float">
            <span className="font-candy text-5xl font-extrabold italic tracking-wide text-white candy-text-shadow">
              Fail
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-extrabold text-red-300 mb-1.5 text-center">
            {lang === 'bn'
              ? 'হায় না! মোচিকে বাঁচানো গেল না! 😱'
              : 'Oh no! Mochi got caught! 😱'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xs text-center mb-6">
            {lang === 'bn' ? level.storyTipBn : level.storyTipEn}
          </p>

          <div className="flex flex-col w-full max-w-xs gap-3">
            <button
              type="button"
              onClick={() => resetMission(true)}
              className="candy-btn-green py-3.5 px-8 rounded-full font-extrabold text-xl text-white candy-text-shadow"
            >
              {lang === 'bn' ? 'আবার চেষ্টা করো ↻' : 'Play Again ↻'}
            </button>
            <button
              type="button"
              onClick={onBackToMap}
              className="py-2.5 px-6 rounded-full font-bold text-sm bg-slate-800/90 hover:bg-slate-700 border border-white/20 text-slate-200"
            >
              {lang === 'bn' ? 'মিশন ম্যাপ দেখো' : 'Mission Select'}
            </button>
          </div>
        </div>
      )}

      {/* CELEBRATORY RESCUED / WIN OVERLAY! */}
      {status === 'won' && (
        <div className="absolute inset-0 z-30 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-5">
          <div className="w-full max-w-sm bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-950 border-2 border-amber-400 rounded-3xl p-6 text-center shadow-2xl">
            <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-xs font-extrabold px-3 py-1 rounded-full mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              {lang === 'bn' ? 'মিশন সফল!' : 'MISSION ACCOMPLISHED!'}
            </div>

            <h2 className="text-3xl font-extrabold text-amber-300 candy-text-shadow mb-2">
              {lang === 'bn' ? 'মোচি বেঁচে গেছে! 🎉' : 'Mochi Rescued! 🎉'}
            </h2>

            {/* 3 Gold Stars */}
            <div className="flex items-center justify-center gap-3 my-4">
              {[1, 2, 3].map((s) => (
                <span
                  key={s}
                  className={`text-4xl transition-transform ${
                    s <= earnedStars ? 'scale-110 drop-shadow-[0_0_12px_rgba(250,204,21,0.85)]' : 'opacity-25 grayscale'
                  }`}
                >
                  ⭐
                </span>
              ))}
            </div>

            <div className="bg-slate-950/70 border border-white/10 rounded-2xl py-2.5 px-4 mb-5 flex items-center justify-around">
              <div>
                <div className="text-[11px] text-slate-400">
                  {lang === 'bn' ? 'স্কোর' : 'SCORE'}
                </div>
                <div className="text-xl font-extrabold text-amber-300">{score}</div>
              </div>
              {earnedStars === 3 && (
                <div className="border-l border-white/10 pl-4">
                  <div className="text-[11px] text-emerald-300">
                    {lang === 'bn' ? '৩-স্টার বোনাস' : '3-STAR BONUS'}
                  </div>
                  <div className="text-base font-extrabold text-white">+1 🔨 হাতুড়ি!</div>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3">
              {hasNextLevel ? (
                <button
                  type="button"
                  onClick={onNextLevel}
                  className="candy-btn-green py-3.5 px-6 rounded-full font-extrabold text-xl text-white candy-text-shadow"
                >
                  {lang === 'bn' ? 'পরের টাস্ক মিশন ▶' : 'Next Rescue Mission ▶'}
                </button>
              ) : (
                <div className="bg-amber-400/15 border border-amber-400/40 rounded-2xl p-3 text-amber-200 text-sm font-bold mb-1">
                  {lang === 'bn'
                    ? '👑 অভিনন্দন! তুমি সবগুলো মিশন জিতে মোচিকে চিরতরে বাঁচিয়েছ!'
                    : '👑 Congratulations! You beat all Boss Rescue Missions!'}
                </div>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => resetMission(true)}
                  className="flex-1 py-2.5 rounded-full font-bold text-sm bg-slate-800 hover:bg-slate-700 border border-white/15 text-slate-200"
                >
                  {lang === 'bn' ? 'আবার খেলো' : 'Replay'}
                </button>
                <button
                  type="button"
                  onClick={onBackToMap}
                  className="flex-1 candy-btn-orange py-2.5 rounded-full font-bold text-sm text-white"
                >
                  {lang === 'bn' ? 'লেভেল ম্যাপ' : 'Mission Map'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
