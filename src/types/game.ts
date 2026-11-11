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
  | 'cannon_charge';

export interface LevelTaskConfig {
  kind: TaskKind;
  target: number;
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

export interface LevelConfig {
  id: number;
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
  /** Danger advance per second (0 -> 100 means caught!) */
  dangerSpeed: number;
  /** Number of marbles in silo if applicable */
  initialMarbles: number;
  /** Drain columns highlighted on board */
  drainColumns: number[];
  hasIntroCutscene?: boolean;
  tasks: LevelTaskConfig[];
  initialCells: CellOverride[];
}

export interface TaskProgress {
  kind: TaskKind;
  current: number;
  target: number;
  labelBn: string;
  labelEn: string;
  icon: string;
}

export type BoosterKind = 'hammer' | 'freeze' | 'shuffle';

export interface PlayerSaveData {
  unlockedLevel: number;
  starsByLevel: Record<number, number>;
  bestScoreByLevel: Record<number, number>;
  boosters: Record<BoosterKind, number>;
  language: Language;
  soundEnabled: boolean;
}

export type GameStatus = 'intro' | 'playing' | 'paused' | 'rescuing' | 'won' | 'lost';
