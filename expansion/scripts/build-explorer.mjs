#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const expRoot = path.resolve(__dirname, '..');
const bundle = JSON.parse(
  fs.readFileSync(path.join(expRoot, 'data', 'candy-rescue-expansion-bundle.json'), 'utf8')
);

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Candy Rescue Saga — 50-Level Expansion Interactive Atlas</title>
  <style>
    :root {
      --bg-deep: #140b29;
      --bg-card: rgba(33, 20, 62, 0.88);
      --bg-glass: rgba(255, 255, 255, 0.07);
      --border: rgba(255, 214, 102, 0.25);
      --gold: #ffd166;
      --coral: #ff5d8f;
      --mint: #06d6a0;
      --cyan: #4cc9f0;
      --text: #f8f5ff;
      --muted: #c2b6dc;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
      background: radial-gradient(circle at 20% 0%, #2d1657 0%, #140b29 55%, #0b0618 100%);
      color: var(--text);
      min-height: 100vh;
      line-height: 1.5;
    }
    header {
      padding: 28px 20px 20px;
      text-align: center;
      background: linear-gradient(180deg, rgba(255,93,143,0.18), transparent);
      border-bottom: 1px solid var(--border);
    }
    .badge-row {
      display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin-bottom: 12px;
    }
    .pill {
      padding: 5px 12px; border-radius: 999px; font-size: 12px; font-weight: 700;
      background: rgba(255, 209, 102, 0.15); border: 1px solid rgba(255, 209, 102, 0.45); color: var(--gold);
    }
    h1 {
      font-size: clamp(1.6rem, 4vw, 2.5rem);
      background: linear-gradient(90deg, #ffd166, #ff758f, #4cc9f0);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      font-weight: 900; margin-bottom: 8px;
    }
    .sub { color: var(--muted); max-width: 760px; margin: 0 auto 16px; font-size: 0.95rem; }
    .top-actions { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; margin-top: 10px; }
    .btn-play {
      display: inline-flex; align-items: center; gap: 8px; text-decoration: none;
      padding: 10px 20px; border-radius: 999px; font-weight: 800; font-size: 0.92rem;
      background: linear-gradient(135deg, #ff4d6d, #ff9f1c); color: #fff;
      box-shadow: 0 6px 20px rgba(255,77,109,0.4);
    }
    .btn-play.secondary {
      background: rgba(76, 201, 240, 0.16); border: 1px solid rgba(76, 201, 240, 0.5); box-shadow: none; color: var(--cyan);
    }
    nav.tabs {
      display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;
      padding: 14px 16px; position: sticky; top: 0; z-index: 20;
      background: rgba(20, 11, 41, 0.92); backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(255,255,255,0.08);
    }
    nav.tabs button {
      background: var(--bg-glass); color: var(--text); border: 1px solid rgba(255,255,255,0.14);
      padding: 9px 16px; border-radius: 12px; cursor: pointer; font-weight: 700; font-size: 0.88rem;
      transition: 0.18s;
    }
    nav.tabs button.active, nav.tabs button:hover {
      background: linear-gradient(135deg, #ffd166, #ff9f1c); color: #1d1033; border-color: transparent;
    }
    main { max-width: 1240px; margin: 0 auto; padding: 22px 16px 60px; }
    .chapter-bar {
      display: flex; gap: 8px; overflow-x: auto; padding-bottom: 12px; margin-bottom: 18px;
    }
    .ch-chip {
      flex: 0 0 auto; padding: 10px 14px; border-radius: 14px; cursor: pointer;
      background: var(--bg-card); border: 1px solid rgba(255,255,255,0.12); color: var(--text);
      text-align: left; min-width: 185px; transition: 0.18s;
    }
    .ch-chip.active { border-color: var(--gold); box-shadow: 0 0 0 2px rgba(255,209,102,0.3); background: rgba(255,209,102,0.12); }
    .ch-chip small { display: block; color: var(--gold); font-weight: 800; font-size: 0.72rem; }
    .ch-chip strong { font-size: 0.92rem; }
    .chapter-banner {
      padding: 18px 20px; border-radius: 18px; margin-bottom: 20px;
      background: var(--bg-card); border: 1px solid var(--border);
      display: grid; grid-template-columns: 1fr auto; gap: 14px; align-items: center;
    }
    .grid-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(330px, 1fr)); gap: 16px; }
    .card {
      background: var(--bg-card); border: 1px solid rgba(255,255,255,0.12);
      border-radius: 18px; padding: 18px; display: flex; flex-direction: column; gap: 10px;
    }
    .card.boss { border: 2px solid var(--coral); box-shadow: 0 0 24px rgba(255,93,143,0.22); }
    .lvl-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; }
    .lvl-num { font-size: 0.75rem; font-weight: 800; color: var(--cyan); text-transform: uppercase; }
    .lvl-title { font-size: 1.12rem; font-weight: 800; color: #fff; }
    .diff-tag {
      padding: 3px 9px; border-radius: 8px; font-size: 0.75rem; font-weight: 800;
      background: rgba(6,214,160,0.18); color: var(--mint); white-space: nowrap;
    }
    .diff-tag.hard { background: rgba(255,93,143,0.2); color: var(--coral); }
    .kv { font-size: 0.85rem; color: var(--muted); }
    .kv b { color: var(--gold); }
    .twist-box {
      margin-top: auto; padding: 10px 12px; border-radius: 12px;
      background: rgba(76, 201, 240, 0.1); border-left: 3px solid var(--cyan);
      font-size: 0.83rem; color: #e2f6ff;
    }
    .mini-board {
      display: inline-grid; gap: 3px; padding: 8px; border-radius: 10px;
      background: rgba(0,0,0,0.35); border: 1px solid rgba(255,255,255,0.1); align-self: flex-start;
    }
    .cell {
      width: 16px; height: 16px; border-radius: 4px; background: rgba(255,255,255,0.14);
    }
    .cell.void { background: transparent; border: 1px dashed rgba(255,255,255,0.08); }
    .cell.special { background: var(--gold); box-shadow: 0 0 6px rgba(255,209,102,0.7); }
    .chart-wrap {
      background: var(--bg-card); border: 1px solid var(--border); border-radius: 18px; padding: 20px; overflow-x: auto;
    }
    .bars { display: flex; align-items: flex-end; gap: 6px; height: 220px; padding-top: 24px; min-width: 900px; }
    .bar-col { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; height: 100%; justify-content: flex-end; }
    .bar {
      width: 100%; border-radius: 6px 6px 2px 2px;
      background: linear-gradient(180deg, #4cc9f0, #7209b7); transition: 0.2s;
    }
    .bar.boss-bar { background: linear-gradient(180deg, #ffd166, #ff006e); }
    .bar-lbl { font-size: 10px; color: var(--muted); }
    @media (max-width: 680px) { .chapter-banner { grid-template-columns: 1fr; } }
  </style>
</head>
<body>
  <header>
    <div class="badge-row">
      <span class="pill">50 NEW SURVIVAL LEVELS (LVL 07–56)</span>
      <span class="pill">10 SECULAR SOUTH ASIAN CHAPTERS</span>
      <span class="pill">18 TOOLS · 24 OBSTACLES · 12 ENEMIES · 6 BOSSES</span>
    </div>
    <h1>Candy Rescue Saga — 50-Level Expansion Atlas</h1>
    <p class="sub">
      Interactive Design &amp; Blueprint Explorer for the 50 new survival rescue missions inspired by the secular natural landscapes, fruits, and sweets of Bangladesh &amp; India.
    </p>
    <div class="top-actions">
      <a class="btn-play" href="../candy-rescue-playable.html">Play 3D Rescue Game (Base 6 Missions)</a>
      <a class="btn-play secondary" href="./data/candy-rescue-expansion-bundle.json" target="_blank">View Raw Engine JSON Bundle</a>
    </div>
  </header>

  <nav class="tabs" id="tabs">
    <button class="active" data-tab="levels">50 Playable Levels (10 Chapters)</button>
    <button data-tab="candies">10 Regional Candies</button>
    <button data-tab="tools">18 Survival Tools</button>
    <button data-tab="obstacles">24 Obstacles</button>
    <button data-tab="enemies">12 Enemies &amp; 6 Bosses</button>
    <button data-tab="curve">Sawtooth Difficulty Chart</button>
  </nav>

  <main id="app"></main>

  <script>
    const DATA = ${JSON.stringify(bundle)};
    let activeTab = 'levels';
    let activeChapter = 'CHAPTER_01';

    document.getElementById('tabs').addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-tab]');
      if (!btn) return;
      activeTab = btn.dataset.tab;
      document.querySelectorAll('#tabs button').forEach(b => b.classList.toggle('active', b === btn));
      render();
    });

    function renderMiniBoard(bp) {
      const voids = new Set((bp.voidCells || []).map(([r,c]) => r + ',' + c));
      const specials = new Set();
      (bp.specialZones || []).forEach(z => {
        if (z.cells) z.cells.forEach(([r,c]) => specials.add(r + ',' + c));
        if (z.rows) z.rows.forEach(r => { for (let c=0;c<bp.cols;c++) specials.add(r+','+c); });
        if (z.row !== undefined && z.cols) z.cols.forEach(c => specials.add(z.row+','+c));
      });
      let cells = '';
      for (let r = 0; r < bp.rows; r++) {
        for (let c = 0; c < bp.cols; c++) {
          const k = r + ',' + c;
          const cls = voids.has(k) ? 'void' : specials.has(k) ? 'special' : '';
          cells += '<div class="cell ' + cls + '"></div>';
        }
      }
      return '<div class="mini-board" style="grid-template-columns:repeat(' + bp.cols + ',16px)" title="7x8 Board Topology & Special Zones">' + cells + '</div>';
    }

    function renderLevels(root) {
      const chBar = DATA.chapters.map(ch =>
        '<button class="ch-chip ' + (ch.chapterId === activeChapter ? 'active' : '') + '" data-ch="' + ch.chapterId + '">' +
        '<small>CH ' + ch.chapterNumber + ' · LVL ' + ch.campaignLevelRange[0] + '–' + ch.campaignLevelRange[1] + '</small>' +
        '<strong>' + ch.title + '</strong></button>'
      ).join('');

      const ch = DATA.chapters.find(c => c.chapterId === activeChapter);
      const lvls = DATA.levels.filter(l => l.chapterId === activeChapter);

      const cards = lvls.map(l => {
        const isBoss = l.levelName.includes('BOSS');
        const hard = l.difficultyRating.numericScore1To10 >= 7;
        const pMode = l.pressureConfig.mode === 'move_limited'
          ? l.pressureConfig.moveLimit + ' Moves (Turn-Based)'
          : l.pressureConfig.mode === 'real_time_survival'
          ? l.pressureConfig.timeLimitSeconds + 's Real-Time (' + l.pressureConfig.dangerRatePerSec + '%/s)'
          : l.pressureConfig.moveLimit + ' Moves / ' + l.pressureConfig.timeLimitSeconds + 's Hybrid';

        return '<article class="card ' + (isBoss ? 'boss' : '') + '">' +
          '<div class="lvl-head"><div><div class="lvl-num">' + l.levelId + ' · Expansion #' + l.expansionNumber + '</div>' +
          '<div class="lvl-title">' + l.levelName + '</div></div>' +
          '<span class="diff-tag ' + (hard ? 'hard' : '') + '">' + l.difficultyRating.tier + ' (' + l.difficultyRating.numericScore1To10 + '/10)</span></div>' +
          renderMiniBoard(l.boardBlueprint) +
          '<p class="kv"><b>Environment:</b> ' + l.environmentDescription + '</p>' +
          '<p class="kv"><b>Rescue Story:</b> ' + l.rescueStory + '</p>' +
          '<p class="kv"><b>Main Objective:</b> ' + l.mainObjective.summary + '</p>' +
          '<p class="kv"><b>Secondary Star Goal:</b> ' + l.secondaryObjective.summary + '</p>' +
          '<p class="kv"><b>Obstacles &amp; Threat:</b> ' + l.survivalObstacle.primary + (l.survivalObstacle.secondary ? ' + ' + l.survivalObstacle.secondary : '') + ' · ' + l.enemyOrThreat.enemyId + '</p>' +
          '<p class="kv"><b>Pacing &amp; Reward:</b> ' + pMode + ' · ' + l.rewards.coins + ' Coins (' + l.rewards.collectibleIngredient + ')</p>' +
          '<div class="twist-box"><b>Unique Twist:</b> ' + l.uniqueGameplayTwist + '</div>' +
        '</article>';
      }).join('');

      root.innerHTML =
        '<div class="chapter-bar">' + chBar + '</div>' +
        '<div class="chapter-banner"><div><h2 style="color:var(--gold);margin-bottom:4px">Chapter ' + ch.chapterNumber + ': ' + ch.title + '</h2>' +
        '<p class="kv">' + ch.regionalInspiration + '</p>' +
        '<p class="kv" style="margin-top:6px"><b>Architecture &amp; Props:</b> ' + ch.visualTheme.architecture + ' — ' + ch.visualTheme.ambientProps + '</p></div>' +
        '<div style="display:flex;gap:8px">' + ch.visualTheme.skyPalette.map(hex => '<div style="width:34px;height:34px;border-radius:50%;background:' + hex + ';border:2px solid #fff" title="' + hex + '"></div>').join('') + '</div></div>' +
        '<div class="grid-cards">' + cards + '</div>';

      root.querySelectorAll('[data-ch]').forEach(btn => {
        btn.onclick = () => { activeChapter = btn.dataset.ch; render(); };
      });
    }

    function render() {
      const root = document.getElementById('app');
      if (activeTab === 'levels') return renderLevels(root);

      if (activeTab === 'candies') {
        root.innerHTML = '<div class="grid-cards">' + DATA.regionalCandies.map(c =>
          '<article class="card"><div class="lvl-num">' + c.candyId + ' · ' + c.colorFamily + '</div>' +
          '<div class="lvl-title">' + c.name + '</div>' +
          '<p class="kv"><b>Origin:</b> ' + c.regionalOrigin + '</p>' +
          '<p class="kv"><b>3D Silhouette:</b> ' + c.silhouette + '</p>' +
          '<div class="twist-box"><b>Board Synergy:</b> ' + c.specialBoardProperty + '</div></article>'
        ).join('') + '</div>';
        return;
      }

      if (activeTab === 'tools') {
        root.innerHTML = '<div class="grid-cards">' + DATA.tools.map(t =>
          '<article class="card"><div class="lvl-head"><div><div class="lvl-num">' + t.toolId + '</div><div class="lvl-title">' + t.name + '</div></div>' +
          '<span class="diff-tag">Unlocks Lvl ' + t.unlockCampaignLevel + '</span></div>' +
          '<p class="kv"><b>Purpose:</b> ' + t.purpose + '</p>' +
          '<p class="kv"><b>How It Works:</b> ' + t.howItWorks + '</p>' +
          '<p class="kv"><b>Candy Interaction:</b> ' + t.candyInteraction + '</p>' +
          '<div class="twist-box"><b>Strategic Limitation:</b> ' + t.limitations + '</div></article>'
        ).join('') + '</div>';
        return;
      }

      if (activeTab === 'obstacles') {
        root.innerHTML = '<div class="grid-cards">' + DATA.obstacles.map(o =>
          '<article class="card"><div class="lvl-head"><div><div class="lvl-num">' + o.obstacleId + ' · ' + o.placementZone + '</div><div class="lvl-title">' + o.name + '</div></div>' +
          '<span class="diff-tag">HP: ' + o.hitPoints + ' · Lvl ' + o.firstAppearsCampaignLevel + '</span></div>' +
          '<p class="kv"><b>Behavior:</b> ' + o.behavior + '</p>' +
          '<p class="kv"><b>Clear Condition:</b> ' + o.clearCondition + '</p>' +
          '<div class="twist-box"><b>Combinatorics:</b> ' + o.combinatorics + '</div></article>'
        ).join('') + '</div>';
        return;
      }

      if (activeTab === 'enemies') {
        const bossHtml = DATA.bosses.map(b =>
          '<article class="card boss"><div class="lvl-head"><div><div class="lvl-num">BOSS · Lvl ' + b.campaignLevel + ' (' + b.chapterId + ')</div><div class="lvl-title">' + b.name + '</div></div>' +
          '<span class="diff-tag hard">' + b.healthPool + ' HP</span></div>' +
          b.phases.map(p => '<p class="kv"><b>Phase ' + p.phase + ' (' + p.hpRange + '):</b> ' + p.mechanic + '</p>').join('') +
          '<div class="twist-box"><b>Weakness:</b> ' + b.weakness + '</div></article>'
        ).join('');
        const enemyHtml = DATA.enemies.map(e =>
          '<article class="card"><div class="lvl-num">' + e.enemyId + ' · ' + e.role + '</div><div class="lvl-title">' + e.name + '</div>' +
          '<p class="kv"><b>Attack Pattern:</b> ' + e.attackPattern + '</p>' +
          '<p class="kv"><b>Counter Strategy:</b> ' + e.counterStrategy + '</p>' +
          '<div class="twist-box"><b>Defeat Animation:</b> ' + e.defeatAnimationConcept + '</div></article>'
        ).join('');
        root.innerHTML = '<h2 style="margin-bottom:14px;color:var(--coral)">6 Multi-Phase Boss Encounters</h2><div class="grid-cards" style="margin-bottom:28px">' + bossHtml + '</div>' +
          '<h2 style="margin-bottom:14px;color:var(--gold)">12 Survival Enemies</h2><div class="grid-cards">' + enemyHtml + '</div>';
        return;
      }

      if (activeTab === 'curve') {
        const bars = DATA.levels.map(l => {
          const pct = l.difficultyRating.numericScore1To10 * 10;
          const isBoss = l.difficultyRating.sawtoothRole === 'boss_climax';
          return '<div class="bar-col" title="' + l.levelId + ': ' + l.levelName + ' (' + l.difficultyRating.numericScore1To10 + '/10)">' +
            '<span class="bar-lbl">' + l.difficultyRating.numericScore1To10 + '</span>' +
            '<div class="bar ' + (isBoss ? 'boss-bar' : '') + '" style="height:' + pct + '%"></div>' +
            '<span class="bar-lbl">' + l.expansionNumber + '</span></div>';
        }).join('');
        root.innerHTML = '<div class="chart-wrap"><h2 style="color:var(--gold);margin-bottom:8px">50-Level Sawtooth Difficulty Curve (Expansion Levels 1–50)</h2>' +
          '<p class="kv" style="margin-bottom:16px">Gold/Pink bars mark Chapter 5-level Climax &amp; Boss stages, followed immediately by approachable Breather stages at the start of each new chapter.</p>' +
          '<div class="bars">' + bars + '</div></div>';
      }
    }

    render();
  </script>
</body>
</html>
`;

fs.writeFileSync(path.join(expRoot, 'expansion-explorer.html'), html);
console.log('Generated expansion/expansion-explorer.html');
