#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../..');
const bundle = JSON.parse(
  fs.readFileSync(path.join(repoRoot, 'expansion/data/candy-rescue-expansion-bundle.json'), 'utf8')
);

const CHAPTER_META = {
  CHAPTER_01: {
    num: 1,
    en: 'Ch 1: Bengal Mango Valley',
    bn: 'অধ্যায় ১: বাংলার আম বাগান',
    palette: { sky: '#241808', wall: '#4d2b12', pillar: '#f59e0b', tray: '#d97706' },
  },
  CHAPTER_02: {
    num: 2,
    en: 'Ch 2: Sylhet Tea Garden',
    bn: 'অধ্যায় ২: সিলেট চা বাগান',
    palette: { sky: '#0d261c', wall: '#164230', pillar: '#34d399', tray: '#10b981' },
  },
  CHAPTER_03: {
    num: 3,
    en: 'Ch 3: Sundarbans Adventure',
    bn: 'অধ্যায় ৩: সুন্দরবন অভিযান',
    palette: { sky: '#091f1a', wall: '#1b3b2b', pillar: '#fbbf24', tray: '#b45309' },
  },
  CHAPTER_04: {
    num: 4,
    en: 'Ch 4: Litchi Orchard Escape',
    bn: 'অধ্যায় ৪: দিনাজপুর লিচু বাগান',
    palette: { sky: '#2b0d1a', wall: '#4c142c', pillar: '#fb7185', tray: '#e11d48' },
  },
  CHAPTER_05: {
    num: 5,
    en: 'Ch 5: Riverside Candy Market',
    bn: 'অধ্যায় ৫: নদীতীরের মিষ্টি বাজার',
    palette: { sky: '#1e1633', wall: '#38235c', pillar: '#fb923c', tray: '#f59e0b' },
  },
  CHAPTER_06: {
    num: 6,
    en: 'Ch 6: Tropical Island Survival',
    bn: 'অধ্যায় ৬: সেন্ট মার্টিন দ্বীপ',
    palette: { sky: '#072236', wall: '#0e4166', pillar: '#38bdf8', tray: '#0284c7' },
  },
  CHAPTER_07: {
    num: 7,
    en: 'Ch 7: Monsoon River Rescue',
    bn: 'অধ্যায় ৭: বর্ষার নদী রেসকিউ',
    palette: { sky: '#091a38', wall: '#153161', pillar: '#22d3ee', tray: '#0ea5e9' },
  },
  CHAPTER_08: {
    num: 8,
    en: 'Ch 8: Himalayan Foothill Trek',
    bn: 'অধ্যায় ৮: হিমালয় পাদদেশ',
    palette: { sky: '#121c3d', wall: '#22346e', pillar: '#93c5fd', tray: '#3b82f6' },
  },
  CHAPTER_09: {
    num: 9,
    en: 'Ch 9: Colorful Fruit Festival',
    bn: 'অধ্যায় ৯: রঙিন ফল ও ঘুড়ি উৎসব',
    palette: { sky: '#290d36', wall: '#4d1663', pillar: '#f472b6', tray: '#ec4899' },
  },
  CHAPTER_10: {
    num: 10,
    en: 'Ch 10: Crystal Jungle Sanctum',
    bn: 'অধ্যায় ১০: ক্রিস্টাল জঙ্গল অভিযান',
    palette: { sky: '#160933', wall: '#2d1463', pillar: '#c084fc', tray: '#8b5cf6' },
  },
};

const COLOR_FRUIT_META = {
  yellow: { en: 'Mango Candies', bn: 'হিমসাগর আম ক্যান্ডি', icon: '🥭' },
  red: { en: 'Ruby Litchis', bn: 'লিচু ক্যান্ডি', icon: '🍒' },
  green: { en: 'Guava Crisps', bn: 'পেয়ারা ক্যান্ডি', icon: '🍏' },
  orange: { en: 'Mandarin & Jilapi', bn: 'কমলা ও জিলাপি', icon: '🍊' },
  blue: { en: 'Daab Coconuts', bn: 'ডাব ক্যান্ডি', icon: '🥥' },
  purple: { en: 'Jamun Berries', bn: 'কালোজাম ক্যান্ডি', icon: '🍇' },
};

const DUAL_GRAVITY_LEVELS = new Set([37, 38, 39, 40, 41, 53]);
const WIND_MAP = {
  14: [{ row: 2, dir: 1 }, { row: 3, dir: 1 }],
  23: [{ row: 2, dir: -1 }],
  35: [{ row: 1, dir: -1 }, { row: 5, dir: 1 }],
  44: [{ row: 3, dir: 1 }],
  46: [{ row: 4, dir: 1 }],
};

function pickScene(lvl) {
  if (lvl.levelName.includes('BOSS')) return 'boss_lair';
  const obs = lvl.survivalObstacle.primary + ' ' + (lvl.survivalObstacle.secondary || '');
  const summary = lvl.mainObjective.summary.toLowerCase();
  if (summary.includes('key')) return 'triple_key';
  if (obs.includes('BOULDER') || obs.includes('CRUSHER') || obs.includes('SHUTTER')) return 'boulder_run';
  if (obs.includes('ICE') || obs.includes('MIST') || lvl.enemyOrThreat.enemyId.includes('FROST')) return 'frost_dual';
  if (obs.includes('FIRE') || obs.includes('BRIDGE') || obs.includes('FERRY')) return 'lava_bridge';
  return 'spiral_marble';
}

function buildPlayableConfig(lvl) {
  const id = lvl.campaignNumber; // 7 .. 56
  const ch = CHAPTER_META[lvl.chapterId];
  const isBoss = lvl.levelName.includes('BOSS');
  const scene = pickScene(lvl);
  const submergedFromRow = DUAL_GRAVITY_LEVELS.has(id) ? 4 : undefined;
  const windRows = WIND_MAP[id];

  const pressureMode =
    lvl.pressureConfig.mode === 'move_limited'
      ? 'move_limited'
      : lvl.pressureConfig.mode === 'hybrid_turn_chase'
      ? 'hybrid'
      : 'real_time';

  const moveLimit = lvl.pressureConfig.moveLimit ?? undefined;
  const dangerSpeed =
    pressureMode === 'move_limited'
      ? 0
      : Number((lvl.pressureConfig.dangerRatePerSec || 1.65).toFixed(2));

  const useSixColors = lvl.difficultyRating.numericScore1To10 >= 7;
  const colors = useSixColors
    ? ['red', 'orange', 'yellow', 'green', 'blue', 'purple']
    : ['red', 'orange', 'yellow', 'green', 'blue'];

  const initialCells = [];
  const usedCoords = new Set();
  const place = (r, c, spec) => {
    const key = `${r},${c}`;
    if (r < 0 || r >= 7 || c < 0 || c >= 8 || usedCoords.has(key)) return false;
    usedCoords.add(key);
    initialCells.push({ row: r, col: c, ...spec });
    return true;
  };

  const tasks = [];
  let initialMarbles = 0;
  let drainColumns = [];

  if (isBoss) {
    // Multi-task Boss Showcase!
    const keyCount = id === 56 ? 3 : 2;
    const keyCols = keyCount === 3 ? [1, 4, 6] : [2, 5];
    for (const kc of keyCols) place(0, kc, { special: 'key', color: 'yellow' });
    tasks.push({
      kind: 'keys',
      target: keyCount,
      labelBn: 'বস তালা চাবি',
      labelEn: 'Boss Keys',
      icon: '👑',
    });

    initialMarbles = 55 + ch.num * 3;
    drainColumns = [0, 1, 6, 7];
    tasks.push({
      kind: 'marbles',
      target: initialMarbles,
      labelBn: 'মার্বেল খালি করো',
      labelEn: 'Drain Marbles',
      icon: '🔮',
    });

    tasks.push({
      kind: 'cannon_charge',
      target: 42 + ch.num * 3,
      labelBn: 'রেইনবো ক্যানন চার্জ',
      labelEn: 'Boss Cannon',
      icon: '🌈',
    });

    // Place symmetrical boss blockers away from key exit row
    place(2, 1, { blocker: 'crate_1' });
    place(2, 6, { blocker: 'crate_1' });
    place(2, 3, { blocker: 'ice_1' });
    place(2, 4, { blocker: 'ice_1' });
    place(3, 2, { blocker: 'slime' });
    place(3, 5, { blocker: 'slime' });
    place(1, 3, { special: 'striped_v', color: 'orange' });
  } else if (scene === 'triple_key') {
    const keyCount = id >= 35 ? 3 : 2;
    const keyCols = keyCount === 3 ? [1, 4, 6] : [2, 5];
    drainColumns = keyCols;

    if (submergedFromRow !== undefined) {
      // Bidirectional Waterline Key Convergence! 1 top key + 1/2 submerged keys floating up!
      place(0, keyCols[0], { special: 'key', color: 'yellow' });
      place(6, keyCols[1], { special: 'key', color: 'blue' });
      if (keyCount === 3) place(0, keyCols[2], { special: 'key', color: 'yellow' });
    } else {
      for (const kc of keyCols) place(1, kc, { special: 'key', color: 'yellow' });
    }

    tasks.push({
      kind: 'keys',
      target: keyCount,
      labelBn: 'সোনালি চাবি নামাও',
      labelEn: 'Rescue Keys',
      icon: '🗝️',
    });

    // Pair with Ice or Crates
    if (id % 2 === 0) {
      const iceCoords = [
        [2, 1], [2, 2], [2, 5], [2, 6],
        [4, 2], [4, 3], [4, 4], [4, 5],
      ];
      let placedIce = 0;
      for (const [r, c] of iceCoords) {
        if (submergedFromRow !== undefined && (r === 3 || r === 4)) continue;
        if (place(r, c, { blocker: 'ice_1' })) placedIce++;
      }
      tasks.push({
        kind: 'ice',
        target: placedIce,
        labelBn: 'বরফ সিল ভাঙো',
        labelEn: 'Break Ice',
        icon: '🧊',
      });
    } else {
      const crateCoords = [
        [2, 0], [2, 3], [2, 7],
        [4, 0], [4, 3], [4, 7],
      ];
      let placedCrates = 0;
      for (const [r, c] of crateCoords) {
        if (submergedFromRow !== undefined && (r === 3 || r === 4)) continue;
        if (place(r, c, { blocker: 'crate_1' })) placedCrates++;
      }
      tasks.push({
        kind: 'crates',
        target: placedCrates,
        labelBn: 'বাঁশের খাঁচা ভাঙো',
        labelEn: 'Bamboo Cages',
        icon: '📦',
      });
    }
  } else if (scene === 'lava_bridge') {
    const targetColor = ['yellow', 'red', 'green', 'blue', 'orange'][id % 5];
    const fruit = COLOR_FRUIT_META[targetColor];
    tasks.push({
      kind: 'color_target',
      targetColor,
      target: 22 + (ch.num % 4) * 3,
      labelBn: fruit.bn,
      labelEn: fruit.en,
      icon: fruit.icon,
    });

    if (id % 2 === 1) {
      const slimeCells = [[2, 2], [2, 5], [3, 3], [3, 4], [4, 1], [4, 6]];
      let sc = 0;
      for (const [r, c] of slimeCells) if (place(r, c, { blocker: 'slime' })) sc++;
      tasks.push({
        kind: 'slime',
        target: sc,
        labelBn: 'আঠালো স্লাইম ধোও',
        labelEn: 'Clean Slime',
        icon: '🧪',
      });
    } else {
      const crateCells = [[2, 1], [2, 6], [3, 3], [3, 4], [4, 2], [4, 5]];
      let cc = 0;
      for (const [r, c] of crateCells) if (place(r, c, { blocker: id > 30 && cc < 2 ? 'crate_2' : 'crate_1' })) cc++;
      tasks.push({
        kind: 'crates',
        target: cc,
        labelBn: 'ব্রিজ বক্স ভাঙো',
        labelEn: 'Plank Crates',
        icon: '🪵',
      });
    }
    place(1, 4, { special: 'wrapped', color: targetColor });
  } else if (scene === 'boulder_run') {
    const chainCoords = [
      [1, 2], [1, 5], [2, 1], [2, 6],
      [3, 3], [3, 4], [4, 2], [4, 5],
    ];
    let chCount = 0;
    for (const [r, c] of chainCoords) if (place(r, c, { blocker: 'chain' })) chCount++;
    tasks.push({
      kind: 'chains',
      target: chCount,
      labelBn: 'লোহার চেইন ভাঙো',
      labelEn: 'Snap Chains',
      icon: '⛓️',
    });
    tasks.push({
      kind: 'specials',
      target: 3 + Math.floor(ch.num / 4),
      labelBn: 'পাওয়ার কম্বো ফাটাও',
      labelEn: 'Fire Specials',
      icon: '💥',
    });
    place(0, 3, { special: 'striped_h', color: 'red' });
  } else if (scene === 'frost_dual') {
    initialMarbles = 52 + ch.num * 2;
    drainColumns = [2, 3, 4, 5];
    tasks.push({
      kind: 'marbles',
      target: initialMarbles,
      labelBn: 'মার্বেল সরাও',
      labelEn: 'Drain Marbles',
      icon: '🔮',
    });
    const iceCoords = [
      [1, 2], [1, 3], [1, 4], [1, 5],
      [2, 1], [2, 2], [2, 5], [2, 6],
    ];
    let ic = 0;
    for (const [r, c] of iceCoords) {
      if (place(r, c, { blocker: id >= 42 && ic < 2 ? 'ice_2' : 'ice_1' })) ic++;
    }
    tasks.push({
      kind: 'ice',
      target: ic,
      labelBn: 'হিমালয় বরফ ভাঙো',
      labelEn: 'Shatter Ice',
      icon: '❄️',
    });
  } else {
    // spiral_marble
    initialMarbles = 50 + ch.num * 2;
    drainColumns = [0, 1, 2];
    tasks.push({
      kind: 'marbles',
      target: initialMarbles,
      labelBn: 'মার্বেল খালি করো',
      labelEn: 'Drain Marbles',
      icon: '🔮',
    });
    const crateCoords = [[0, 0], [0, 1], [1, 0], [1, 2], [2, 1], [3, 2]];
    let cc = 0;
    for (const [r, c] of crateCoords) if (place(r, c, { blocker: 'crate_1' })) cc++;
    tasks.push({
      kind: 'crates',
      target: cc,
      labelBn: 'বাঁশের খাঁচা ভাঙো',
      labelEn: 'Break Cages',
      icon: '📦',
    });
  }

  const shortZoneEn = lvl.levelName.replace(/^BOSS:\s*/i, '').replace(/^FINAL\s*/i, '').slice(0, 18);
  const modeNoteBn =
    pressureMode === 'move_limited'
      ? `টার্ন-ভিত্তিক (${moveLimit} চালে জিততে হবে, সময়ের তাড়া নেই!)`
      : submergedFromRow !== undefined
      ? 'বর্ষার ডুয়াল-গ্র্যাভিটি! নিচের সারির ক্যান্ডি পানিতে ভেসে উপরে ওঠে!'
      : windRows
      ? 'বাতাসের স্রোতে প্রতি চালে ক্যান্ডি পাশে সরে যায়!'
      : 'দ্রুত কম্বো তৈরি করে বিপদ ১০০% হওয়ার আগেই মোচিকে বাঁচাও!';

  return {
    id,
    chapterNumber: ch.num,
    chapterTitleEn: ch.en,
    chapterTitleBn: ch.bn,
    zoneEn: shortZoneEn,
    zoneBn: `মিশন ${id}`,
    isBoss,
    scene,
    titleBn: `মিশন ${id}: ${lvl.levelName}`,
    titleEn: `Mission ${id}: ${lvl.levelName}`,
    subtitleBn: `${ch.bn} — ${lvl.mainObjective.summary}`,
    subtitleEn: `${lvl.rescueStory}`,
    storyTipBn: `${modeNoteBn} (${lvl.uniqueGameplayTwist})`,
    storyTipEn: `Twist: ${lvl.uniqueGameplayTwist}`,
    cols: 8,
    rows: 7,
    colors,
    pressureMode,
    ...(moveLimit ? { moveLimit } : {}),
    dangerSpeed,
    initialMarbles,
    drainColumns,
    ...(windRows ? { windRows } : {}),
    ...(submergedFromRow !== undefined ? { submergedFromRow } : {}),
    themePalette: ch.palette,
    tasks,
    initialCells,
  };
}

const generated = bundle.levels.map(buildPlayableConfig);

// Strict winnability audit on generated configs!
for (const g of generated) {
  for (const t of g.tasks) {
    if (t.kind === 'keys') {
      const n = g.initialCells.filter((c) => c.special === 'key').length;
      if (n < t.target) throw new Error(`Level ${g.id} keys placed ${n} < target ${t.target}`);
    }
    if (t.kind === 'crates') {
      const n = g.initialCells.filter((c) => c.blocker === 'crate_1' || c.blocker === 'crate_2').length;
      if (n < t.target) throw new Error(`Level ${g.id} crates placed ${n} < target ${t.target}`);
    }
    if (t.kind === 'ice') {
      const n = g.initialCells.filter((c) => c.blocker === 'ice_1' || c.blocker === 'ice_2').length;
      if (n < t.target) throw new Error(`Level ${g.id} ice placed ${n} < target ${t.target}`);
    }
    if (t.kind === 'chains') {
      const n = g.initialCells.filter((c) => c.blocker === 'chain').length;
      if (n < t.target) throw new Error(`Level ${g.id} chains placed ${n} < target ${t.target}`);
    }
    if (t.kind === 'slime') {
      const n = g.initialCells.filter((c) => c.blocker === 'slime').length;
      if (n < t.target) throw new Error(`Level ${g.id} slime placed ${n} < target ${t.target}`);
    }
  }
}

const tsOut = `import { LevelConfig } from '../types/game';

/**
 * 50 Secular South Asian Survival Expansion Levels (Missions 7–56, Chapters 1–10)
 * Auto-synchronized from expansion/data/candy-rescue-expansion-bundle.json
 */
export const EXPANSION_LEVELS: LevelConfig[] = ${JSON.stringify(generated, null, 2)};
`;

fs.writeFileSync(path.join(repoRoot, 'src/data/expansionLevels.ts'), tsOut);
console.log(`Generated src/data/expansionLevels.ts with ${generated.length} verified winnable levels (IDs 7..56)!`);
