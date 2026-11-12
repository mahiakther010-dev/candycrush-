export type Language = 'bn' | 'en';

export type CandyColor = 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple';

export type SpecialType =
  | 'none'
  | 'striped_h'
  | 'striped_v'
  | 'wrapped'
  | 'bomb'
  | 'rainbow'
  | 'key';

export type BlockerType =
  | 'none'
  | 'crate_1'
  | 'crate_2'
  | 'ice_1'
  | 'ice_2'
  | 'chain'
  | 'slime';

export type RescueSceneType =
  | 'spiral_marble'
  | 'lava_bridge'
  | 'triple_key'
  | 'frost_dual'
  | 'boulder_run'
  | 'boss_lair';

export interface CandyPiece {
  id: number;
  color: CandyColor;
  special: SpecialType;
  row: number;
  col: number;
  visX: number;
  visY: number;
  scale: number;
  wobble: number;
}

export interface GridCell {
  row: number;
  col: number;
  blocker: BlockerType;
  candy: CandyPiece | null;
  isDrainColumn?: boolean;
}

export type TaskKind =
  | 'marbles'
  | 'crates'
  | 'keys'
  | 'bridge_candies'
  | 'ice'
  | 'chains'
  | 'specials'
  | 'cannon_charge'
  | 'slime'
  | 'color_target';

export interface LevelTaskConfig {
  kind: TaskKind;
  target: number;
  targetColor?: CandyColor;
  labelBn: string;
  labelEn: string;
  icon: string;
}

export interface CellOverride {
  row: number;
  col: number;
  blocker?: BlockerType;
  special?: SpecialType;
  color?: CandyColor;
}

export type PressureMode = 'real_time' | 'move_limited' | 'hybrid';

export interface ThemePalette3D {
  sky: string;
  wall: string;
  pillar: string;
  tray: string;
}

export interface LevelConfig {
  id: number;
  chapterNumber?: number;
  chapterTitleEn?: string;
  chapterTitleBn?: string;
  zoneEn?: string;
  zoneBn?: string;
  isBoss?: boolean;
  scene: RescueSceneType;
  titleBn: string;
  titleEn: string;
  subtitleBn: string;
  subtitleEn: string;
  storyTipBn: string;
  storyTipEn: string;
  cols: number;
  rows: number;
  colors: CandyColor[];
  /** Pressure mode: real-time chase, pure turn-based clockwork, or hybrid */
  pressureMode?: PressureMode;
  /** Fair move cap for move_limited or hybrid levels (25–30 moves) */
  moveLimit?: number;
  /** Danger advance per second (0 -> 100 means caught!) */
  dangerSpeed: number;
  /** Number of marbles in silo if applicable */
  initialMarbles: number;
  /** Drain columns highlighted on board */
  drainColumns: number[];
  /** Optional Wind Tunnel conveyor rows that drift sideways each turn */
  windRows?: Array<{ row: number; dir: 1 | -1 }>;
  /** Optional Monsoon Floodwater waterline: rows >= submergedFromRow float UPWARD! */
  submergedFromRow?: number;
  /** Optional Regional 3D palette override */
  themePalette?: ThemePalette3D;
  hasIntroCutscene?: boolean;
  tasks: LevelTaskConfig[];
  initialCells: CellOverride[];
}

export interface TaskProgress {
  kind: TaskKind;
  current: number;
  target: number;
  targetColor?: CandyColor;
  labelBn: string;
  labelEn: string;
  icon: string;
}

export type BoosterKind = 'hammer' | 'bomb' | 'shield' | 'freeze' | 'magnet' | 'shuffle';

export interface PlayerSaveData {
  unlockedLevel: number;
  starsByLevel: Record<number, number>;
  bestScoreByLevel: Record<number, number>;
  boosters: Record<BoosterKind, number>;
  language: Language;
  soundEnabled: boolean;
}

export type GameStatus = 'intro' | 'playing' | 'paused' | 'rescuing' | 'won' | 'lost';

/*
 * SNAKE COMBAT — HP & touch-death rules
 * - Snake HP starts at 100% and is chipped down 1% → 100% by candy bursts (see calculateSnakeDamage).
 * - Snake head touching Mochi (danger meter reaches 100) = Mochi dies instantly.
 * - Snake HP reaching 0% = Snake defeated = level won.
 * - Snake must break through obstacles on its path; each obstacle stalls the Snake until
 *   enough candies are smashed to clear it.
 */
export const SNAKE_TOUCH_DANGER = 100;
/** Danger points the Snake is pushed back per 1% of HP lost */
export const SNAKE_PUSHBACK_PER_PERCENT = 0.7;
/** Boss Dragon takes 75% of normal damage (its HP pool is bigger) */
export const SNAKE_BOSS_DAMAGE_SCALE = 0.75;

export interface SnakeObstacleSpec {
  /** Position on the Snake path, 0–1 (matches Snake progress) */
  progress: number;
  /** Candies/blockers that must be smashed to break this obstacle */
  cost: number;
  colorHex: number;
  labelEn: string;
  labelBn: string;
}

export const SNAKE_OBSTACLE_SPECS: SnakeObstacleSpec[] = [
  { progress: 0.2, cost: 6, colorHex: 0x38bdf8, labelEn: 'Frost Wall', labelBn: 'বরফের দেয়াল' },
  { progress: 0.42, cost: 8, colorHex: 0xff5400, labelEn: 'Lava Wave', labelBn: 'লাভার ঢেউ' },
  { progress: 0.64, cost: 10, colorHex: 0xa855f7, labelEn: 'Crystal Barrier', labelBn: 'ক্রিস্টাল বাধা' },
  { progress: 0.84, cost: 12, colorHex: 0x22c55e, labelEn: 'Thorn Gate', labelBn: 'কাঁটার গেট' },
];

export interface SnakeObstacleState {
  index: number;
  progress: number;
  colorHex: number;
  labelEn: string;
  labelBn: string;
  remaining: number;
  cleared: boolean;
}

export function createSnakeObstacles(isBoss: boolean): SnakeObstacleState[] {
  return SNAKE_OBSTACLE_SPECS.map((spec, index) => ({
    index,
    progress: spec.progress,
    colorHex: spec.colorHex,
    labelEn: spec.labelEn,
    labelBn: spec.labelBn,
    remaining: isBoss ? Math.round(spec.cost * 1.25) : spec.cost,
    cleared: false,
  }));
}
