import {
  BlockerType,
  CandyColor,
  CandyPiece,
  GridCell,
  LevelConfig,
  SpecialType,
} from '../types/game';

let nextPieceId = 1;

export function isSolidBlocker(blocker: BlockerType): boolean {
  return blocker === 'crate_1' || blocker === 'crate_2';
}

export function isLockedCandyBlocker(blocker: BlockerType): boolean {
  return blocker === 'chain' || blocker === 'slime';
}

export function randomColor(colors: CandyColor[]): CandyColor {
  return colors[Math.floor(Math.random() * colors.length)];
}

export function createPiece(
  row: number,
  col: number,
  color: CandyColor,
  special: SpecialType = 'none',
  spawnRowOffset?: number
): CandyPiece {
  return {
    id: nextPieceId++,
    color,
    special,
    row,
    col,
    visX: col,
    visY: spawnRowOffset !== undefined ? spawnRowOffset : row,
    scale: 1,
    wobble: 0,
  };
}

export function buildInitialBoard(level: LevelConfig): GridCell[][] {
  const { rows, cols, colors, drainColumns, initialCells } = level;
  const grid: GridCell[][] = [];

  for (let r = 0; r < rows; r++) {
    const rowArr: GridCell[] = [];
    for (let c = 0; c < cols; c++) {
      rowArr.push({
        row: r,
        col: c,
        blocker: 'none',
        candy: null,
        isDrainColumn: drainColumns.includes(c),
      });
    }
    grid.push(rowArr);
  }

  for (const ov of initialCells) {
    if (ov.row >= 0 && ov.row < rows && ov.col >= 0 && ov.col < cols) {
      if (ov.blocker) {
        grid[ov.row][ov.col].blocker = ov.blocker;
      }
    }
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = grid[r][c];
      if (isSolidBlocker(cell.blocker)) {
        cell.candy = null;
        continue;
      }

      const ov = initialCells.find((o) => o.row === r && o.col === c);
      if (ov?.special === 'key') {
        cell.candy = createPiece(r, c, ov.color ?? 'yellow', 'key');
        continue;
      }

      // Pick a color that avoids immediate 3-in-a-row
      const forbidden = new Set<CandyColor>();
      if (
        c >= 2 &&
        grid[r][c - 1].candy &&
        grid[r][c - 2].candy &&
        grid[r][c - 1].candy!.special !== 'key' &&
        grid[r][c - 2].candy!.special !== 'key' &&
        grid[r][c - 1].candy!.color === grid[r][c - 2].candy!.color
      ) {
        forbidden.add(grid[r][c - 1].candy!.color);
      }
      if (
        r >= 2 &&
        grid[r - 1][c].candy &&
        grid[r - 2][c].candy &&
        grid[r - 1][c].candy!.special !== 'key' &&
        grid[r - 2][c].candy!.special !== 'key' &&
        grid[r - 1][c].candy!.color === grid[r - 2][c].candy!.color
      ) {
        forbidden.add(grid[r - 1][c].candy!.color);
      }

      const allowed = colors.filter((clr) => !forbidden.has(clr));
      const chosen = ov?.color ?? randomColor(allowed.length > 0 ? allowed : colors);
      cell.candy = createPiece(r, c, chosen, ov?.special ?? 'none');
    }
  }

  if (!findBestHintMove(grid, level)) {
    shuffleNormalCandies(grid, colors);
  }

  return grid;
}

export interface MatchGroup {
  cells: Array<{ row: number; col: number }>;
  spawnSpecial?: {
    row: number;
    col: number;
    special: SpecialType;
    color: CandyColor;
  };
}

export function findMatches(
  grid: GridCell[][],
  focusCells: Array<{ row: number; col: number }> = []
): MatchGroup[] {
  const rows = grid.length;
  const cols = grid[0].length;

  interface Run {
    dir: 'h' | 'v';
    color: CandyColor;
    cells: Array<{ row: number; col: number }>;
  }

  const runs: Run[] = [];

  // Horizontal runs
  for (let r = 0; r < rows; r++) {
    let c = 0;
    while (c < cols) {
      const p = grid[r][c].candy;
      if (!p || p.special === 'key' || p.special === 'rainbow') {
        c++;
        continue;
      }
      let end = c + 1;
      while (
        end < cols &&
        grid[r][end].candy &&
        grid[r][end].candy!.special !== 'key' &&
        grid[r][end].candy!.special !== 'rainbow' &&
        grid[r][end].candy!.color === p.color
      ) {
        end++;
      }
      if (end - c >= 3) {
        const cells = [];
        for (let k = c; k < end; k++) cells.push({ row: r, col: k });
        runs.push({ dir: 'h', color: p.color, cells });
      }
      c = end;
    }
  }

  // Vertical runs
  for (let c = 0; c < cols; c++) {
    let r = 0;
    while (r < rows) {
      const p = grid[r][c].candy;
      if (!p || p.special === 'key' || p.special === 'rainbow') {
        r++;
        continue;
      }
      let end = r + 1;
      while (
        end < rows &&
        grid[end][c].candy &&
        grid[end][c].candy!.special !== 'key' &&
        grid[end][c].candy!.special !== 'rainbow' &&
        grid[end][c].candy!.color === p.color
      ) {
        end++;
      }
      if (end - r >= 3) {
        const cells = [];
        for (let k = r; k < end; k++) cells.push({ row: k, col: c });
        runs.push({ dir: 'v', color: p.color, cells });
      }
      r = end;
    }
  }

  // Also detect 2x2 squares for Wrapped Candies!
  for (let r = 0; r < rows - 1; r++) {
    for (let c = 0; c < cols - 1; c++) {
      const p00 = grid[r][c].candy;
      const p01 = grid[r][c + 1].candy;
      const p10 = grid[r + 1][c].candy;
      const p11 = grid[r + 1][c + 1].candy;
      if (
        p00 &&
        p01 &&
        p10 &&
        p11 &&
        p00.special !== 'key' &&
        p00.special !== 'rainbow' &&
        p01.special !== 'key' &&
        p01.special !== 'rainbow' &&
        p10.special !== 'key' &&
        p10.special !== 'rainbow' &&
        p11.special !== 'key' &&
        p11.special !== 'rainbow' &&
        p00.color === p01.color &&
        p00.color === p10.color &&
        p00.color === p11.color
      ) {
        runs.push({
          dir: 'h',
          color: p00.color,
          cells: [
            { row: r, col: c },
            { row: r, col: c + 1 },
            { row: r + 1, col: c },
            { row: r + 1, col: c + 1 },
          ],
        });
      }
    }
  }

  if (runs.length === 0) return [];

  // Merge overlapping runs of the same color to detect L/T/5 shapes
  const used = new Array(runs.length).fill(false);
  const groups: MatchGroup[] = [];

  for (let i = 0; i < runs.length; i++) {
    if (used[i]) continue;
    used[i] = true;
    const cluster = [runs[i]];
    let changed = true;
    while (changed) {
      changed = false;
      for (let j = 0; j < runs.length; j++) {
        if (used[j] || runs[j].color !== runs[i].color) continue;
        const overlaps = cluster.some((cr) =>
          cr.cells.some((a) => runs[j].cells.some((b) => a.row === b.row && a.col === b.col))
        );
        if (overlaps) {
          used[j] = true;
          cluster.push(runs[j]);
          changed = true;
        }
      }
    }

    const map = new Map<string, { row: number; col: number }>();
    for (const cr of cluster) {
      for (const cell of cr.cells) {
        map.set(`${cell.row},${cell.col}`, cell);
      }
    }
    const uniqueCells = Array.from(map.values());
    const maxSingleLine = Math.max(...cluster.map((cr) => cr.cells.length));
    const hasBothDirs =
      cluster.some((cr) => cr.dir === 'h') && cluster.some((cr) => cr.dir === 'v');

    let spawnSpecial: MatchGroup['spawnSpecial'];
    const anchor =
      focusCells.find((fc) => uniqueCells.some((u) => u.row === fc.row && u.col === fc.col)) ??
      uniqueCells[Math.floor(uniqueCells.length / 2)];

    const isSquare2x2 =
      uniqueCells.length === 4 &&
      new Set(uniqueCells.map((u) => u.row)).size === 2 &&
      new Set(uniqueCells.map((u) => u.col)).size === 2;

    if (maxSingleLine >= 5 && !isSquare2x2) {
      spawnSpecial = {
        row: anchor.row,
        col: anchor.col,
        special: 'rainbow',
        color: runs[i].color,
      };
    } else if (hasBothDirs && uniqueCells.length >= 6) {
      spawnSpecial = {
        row: anchor.row,
        col: anchor.col,
        special: 'bomb',
        color: runs[i].color,
      };
    } else if ((hasBothDirs && uniqueCells.length >= 5) || isSquare2x2) {
      spawnSpecial = {
        row: anchor.row,
        col: anchor.col,
        special: 'wrapped',
        color: runs[i].color,
      };
    } else if (maxSingleLine === 4) {
      const dir = cluster[0].dir;
      spawnSpecial = {
        row: anchor.row,
        col: anchor.col,
        special: dir === 'h' ? 'striped_v' : 'striped_h',
        color: runs[i].color,
      };
    }

    groups.push({ cells: uniqueCells, spawnSpecial });
  }

  return groups;
}

export function canSwapCells(grid: GridCell[][], r1: number, c1: number, r2: number, c2: number): boolean {
  const rows = grid.length;
  const cols = grid[0].length;
  if (r1 < 0 || r1 >= rows || c1 < 0 || c1 >= cols) return false;
  if (r2 < 0 || r2 >= rows || c2 < 0 || c2 >= cols) return false;
  if (Math.abs(r1 - r2) + Math.abs(c1 - c2) !== 1) return false;

  const a = grid[r1][c1];
  const b = grid[r2][c2];
  if (!a.candy || !b.candy) return false;
  if (isSolidBlocker(a.blocker) || isSolidBlocker(b.blocker)) return false;
  if (isLockedCandyBlocker(a.blocker) || isLockedCandyBlocker(b.blocker)) return false;

  return true;
}

export function isProductiveSwap(
  grid: GridCell[][],
  r1: number,
  c1: number,
  r2: number,
  c2: number
): boolean {
  if (!canSwapCells(grid, r1, c1, r2, c2)) return false;
  const p1 = grid[r1][c1].candy!;
  const p2 = grid[r2][c2].candy!;

  // Rainbow swapped with any non-key candy is always valid
  if (
    (p1.special === 'rainbow' && p2.special !== 'key') ||
    (p2.special === 'rainbow' && p1.special !== 'key')
  ) {
    return true;
  }

  // Two non-key special candies swapped together trigger a combo blast!
  if (
    p1.special !== 'none' &&
    p1.special !== 'key' &&
    p2.special !== 'none' &&
    p2.special !== 'key'
  ) {
    return true;
  }

  // Temporarily swap and check matches
  grid[r1][c1].candy = p2;
  grid[r2][c2].candy = p1;
  const matches = findMatches(grid);
  grid[r1][c1].candy = p1;
  grid[r2][c2].candy = p2;

  return matches.length > 0;
}

export interface StepBlastResult {
  clearedColors: Record<CandyColor, number>;
  totalCandiesCleared: number;
  cratesBroken: number;
  iceBroken: number;
  chainsBroken: number;
  slimesCleared: number;
  specialsTriggered: number;
  drainColumnClears: number;
  beamEffects: Array<{
    kind: 'row' | 'col' | 'bomb' | 'rainbow';
    row: number;
    col: number;
    targetCells?: Array<{ row: number; col: number }>;
  }>;
  poppedPositions: Array<{ row: number; col: number; color: CandyColor }>;
}

export function createEmptyBlastResult(): StepBlastResult {
  return {
    clearedColors: { red: 0, orange: 0, yellow: 0, green: 0, blue: 0, purple: 0 },
    totalCandiesCleared: 0,
    cratesBroken: 0,
    iceBroken: 0,
    chainsBroken: 0,
    slimesCleared: 0,
    specialsTriggered: 0,
    drainColumnClears: 0,
    beamEffects: [],
    poppedPositions: [],
  };
}

function damageCellBlocker(cell: GridCell, res: StepBlastResult) {
  if (cell.blocker === 'crate_2') {
    cell.blocker = 'crate_1';
  } else if (cell.blocker === 'crate_1') {
    cell.blocker = 'none';
    res.cratesBroken++;
  } else if (cell.blocker === 'ice_2') {
    cell.blocker = 'ice_1';
  } else if (cell.blocker === 'ice_1') {
    cell.blocker = 'none';
    res.iceBroken++;
  }
}

export function resolveCellsToClear(
  grid: GridCell[][],
  seedCells: Array<{ row: number; col: number }>,
  spawnInstructions: Array<{
    row: number;
    col: number;
    special: SpecialType;
    color: CandyColor;
  }> = [],
  damageAdjacentCratesFromSeeds: boolean = true
): StepBlastResult {
  const rows = grid.length;
  const cols = grid[0].length;
  const res = createEmptyBlastResult();

  const visited = new Set<string>();
  const queue: Array<{ row: number; col: number }> = [...seedCells];

  // Adjacent crates get damaged by seed match cells
  const damagedCrates = new Set<string>();
  if (damageAdjacentCratesFromSeeds) {
    for (const s of seedCells) {
      const dirs = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
      ];
      for (const [dr, dc] of dirs) {
        const nr = s.row + dr;
        const nc = s.col + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
          const key = `${nr},${nc}`;
          if (!damagedCrates.has(key) && isSolidBlocker(grid[nr][nc].blocker)) {
            damagedCrates.add(key);
            damageCellBlocker(grid[nr][nc], res);
          }
        }
      }
    }
  }

  while (queue.length > 0) {
    const cur = queue.shift()!;
    const key = `${cur.row},${cur.col}`;
    if (visited.has(key)) continue;
    visited.add(key);

    const cell = grid[cur.row][cur.col];

    if (isSolidBlocker(cell.blocker)) {
      if (!damagedCrates.has(key)) {
        damagedCrates.add(key);
        damageCellBlocker(cell, res);
      }
      continue;
    }

    // If candy has chain or slime, break the lock first without destroying the candy!
    if (cell.blocker === 'chain' || cell.blocker === 'slime') {
      if (cell.blocker === 'chain') res.chainsBroken++;
      if (cell.blocker === 'slime') res.slimesCleared++;
      cell.blocker = 'none';
      if (cell.candy) cell.candy.wobble = 1;
      continue;
    }

    // Crack ice underneath
    if (cell.blocker === 'ice_1' || cell.blocker === 'ice_2') {
      damageCellBlocker(cell, res);
    }

    const piece = cell.candy;
    if (!piece) continue;

    // Keys are never destroyed!
    if (piece.special === 'key') {
      piece.wobble = 0.8;
      continue;
    }

    // Trigger special cascade if this piece was already a special candy!
    const isReplacingWithNewSpecial = spawnInstructions.some(
      (sp) => sp.row === cur.row && sp.col === cur.col
    );

    if (piece.special === 'striped_h') {
      res.specialsTriggered++;
      res.beamEffects.push({ kind: 'row', row: cur.row, col: cur.col });
      for (let c = 0; c < cols; c++) {
        queue.push({ row: cur.row, col: c });
      }
    } else if (piece.special === 'striped_v') {
      res.specialsTriggered++;
      res.beamEffects.push({ kind: 'col', row: cur.row, col: cur.col });
      for (let r = 0; r < rows; r++) {
        queue.push({ row: r, col: cur.col });
      }
    } else if (piece.special === 'wrapped') {
      res.specialsTriggered++;
      res.beamEffects.push({ kind: 'bomb', row: cur.row, col: cur.col });
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = cur.row + dr;
          const nc = cur.col + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
            queue.push({ row: nr, col: nc });
          }
        }
      }
    } else if (piece.special === 'bomb') {
      res.specialsTriggered++;
      res.beamEffects.push({ kind: 'bomb', row: cur.row, col: cur.col });
      for (let dr = -2; dr <= 2; dr++) {
        for (let dc = -2; dc <= 2; dc++) {
          if (Math.abs(dr) + Math.abs(dc) > 3) continue;
          const nr = cur.row + dr;
          const nc = cur.col + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
            queue.push({ row: nr, col: nc });
          }
        }
      }
    } else if (piece.special === 'rainbow') {
      res.specialsTriggered++;
      const targetColor = piece.color;
      const targets: Array<{ row: number; col: number }> = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const p = grid[r][c].candy;
          if (p && p.special !== 'key' && p.color === targetColor) {
            targets.push({ row: r, col: c });
            queue.push({ row: r, col: c });
          }
        }
      }
      res.beamEffects.push({
        kind: 'rainbow',
        row: cur.row,
        col: cur.col,
        targetCells: targets,
      });
    }

    res.clearedColors[piece.color] = (res.clearedColors[piece.color] || 0) + 1;
    res.totalCandiesCleared++;
    if (cell.isDrainColumn) {
      res.drainColumnClears++;
    }
    res.poppedPositions.push({ row: cur.row, col: cur.col, color: piece.color });

    if (isReplacingWithNewSpecial) {
      const sp = spawnInstructions.find((s) => s.row === cur.row && s.col === cur.col)!;
      cell.candy = createPiece(cur.row, cur.col, sp.color, sp.special);
      cell.candy.scale = 1.32;
    } else {
      cell.candy = null;
    }
  }

  return res;
}

export function applyGravityAndRefill(
  grid: GridCell[][],
  colors: CandyColor[],
  submergedFromRow?: number
): boolean {
  const rows = grid.length;
  const cols = grid[0].length;
  let moved = false;

  const upperMaxRow = submergedFromRow !== undefined ? submergedFromRow - 1 : rows - 1;

  // Step 1A: Standard downward gravity for upper air rows (0 .. upperMaxRow)
  for (let c = 0; c < cols; c++) {
    for (let r = upperMaxRow; r >= 0; r--) {
      const cell = grid[r][c];
      if (isSolidBlocker(cell.blocker) || cell.candy !== null) continue;

      for (let up = r - 1; up >= 0; up--) {
        if (isSolidBlocker(grid[up][c].blocker) || isLockedCandyBlocker(grid[up][c].blocker)) {
          break;
        }
        if (grid[up][c].candy !== null) {
          const moving = grid[up][c].candy!;
          grid[up][c].candy = null;
          moving.row = r;
          moving.col = c;
          cell.candy = moving;
          moved = true;
          break;
        }
      }
    }
  }

  // Step 1B: Monsoon Dual-Gravity! Submerged rows (submergedFromRow .. rows-1) float UPWARD!
  if (submergedFromRow !== undefined) {
    for (let c = 0; c < cols; c++) {
      for (let r = submergedFromRow; r < rows; r++) {
        const cell = grid[r][c];
        if (isSolidBlocker(cell.blocker) || cell.candy !== null) continue;

        for (let down = r + 1; down < rows; down++) {
          if (
            isSolidBlocker(grid[down][c].blocker) ||
            isLockedCandyBlocker(grid[down][c].blocker)
          ) {
            break;
          }
          if (grid[down][c].candy !== null) {
            const moving = grid[down][c].candy!;
            grid[down][c].candy = null;
            moving.row = r;
            moving.col = c;
            cell.candy = moving;
            moved = true;
            break;
          }
        }
      }
    }
  }

  // Step 2A: Spawn from top for air columns
  for (let c = 0; c < cols; c++) {
    let spawnOffset = -1;
    for (let r = 0; r <= upperMaxRow; r++) {
      const cell = grid[r][c];
      if (isSolidBlocker(cell.blocker) || isLockedCandyBlocker(cell.blocker)) {
        break;
      }
      if (cell.candy === null) {
        cell.candy = createPiece(r, c, randomColor(colors), 'none', spawnOffset);
        spawnOffset -= 1;
        moved = true;
      }
    }
  }

  // Step 2B: Spawn buoyant river candies from bottom riverbed for submerged rows!
  if (submergedFromRow !== undefined) {
    for (let c = 0; c < cols; c++) {
      let spawnOffset = rows;
      for (let r = rows - 1; r >= submergedFromRow; r--) {
        const cell = grid[r][c];
        if (isSolidBlocker(cell.blocker) || isLockedCandyBlocker(cell.blocker)) {
          break;
        }
        if (cell.candy === null) {
          cell.candy = createPiece(r, c, randomColor(colors), 'none', spawnOffset);
          spawnOffset += 1;
          moved = true;
        }
      }
    }
  }

  // Step 3: Diagonal waterfall slide underneath solid crates/chains so air pockets never starve!
  let diagChanged = true;
  let safety = 0;
  while (diagChanged && safety < 12) {
    diagChanged = false;
    safety++;
    for (let r = upperMaxRow; r >= 1; r--) {
      for (let c = 0; c < cols; c++) {
        const cell = grid[r][c];
        if (isSolidBlocker(cell.blocker) || cell.candy !== null) continue;

        const candidates = [c - 1, c + 1].filter((nc) => nc >= 0 && nc < cols);
        for (const nc of candidates) {
          const donor = grid[r - 1][nc];
          if (
            donor.candy !== null &&
            !isSolidBlocker(donor.blocker) &&
            !isLockedCandyBlocker(donor.blocker)
          ) {
            const p = donor.candy;
            donor.candy = null;
            p.row = r;
            p.col = c;
            cell.candy = p;
            diagChanged = true;
            moved = true;

            for (let tr = 0; tr <= upperMaxRow; tr++) {
              const tc = grid[tr][nc];
              if (isSolidBlocker(tc.blocker) || isLockedCandyBlocker(tc.blocker)) break;
              if (tc.candy === null) {
                tc.candy = createPiece(tr, nc, randomColor(colors), 'none', -1);
              }
            }
            break;
          }
        }
      }
    }
  }

  return moved;
}

export function applyWindConveyor(
  grid: GridCell[][],
  windRows?: Array<{ row: number; dir: 1 | -1 }>
): boolean {
  if (!windRows || windRows.length === 0) return false;
  const rows = grid.length;
  let shifted = false;

  for (const w of windRows) {
    if (w.row < 0 || w.row >= rows) continue;
    const movableCols: number[] = [];
    const pieces: CandyPiece[] = [];
    for (let c = 0; c < grid[w.row].length; c++) {
      const cell = grid[w.row][c];
      if (
        cell.candy &&
        cell.candy.special !== 'key' &&
        !isSolidBlocker(cell.blocker) &&
        !isLockedCandyBlocker(cell.blocker)
      ) {
        movableCols.push(c);
        pieces.push(cell.candy);
      }
    }
    if (movableCols.length >= 2) {
      const len = pieces.length;
      for (let i = 0; i < len; i++) {
        const srcIdx = w.dir === 1 ? (i - 1 + len) % len : (i + 1) % len;
        const targetCol = movableCols[i];
        const p = pieces[srcIdx];
        p.row = w.row;
        p.col = targetCol;
        grid[w.row][targetCol].candy = p;
      }
      shifted = true;
    }
  }
  return shifted;
}

export function pullKeysWithMagnet(grid: GridCell[][], submergedFromRow?: number): number {
  const rows = grid.length;
  const cols = grid[0].length;
  const targetExitRow = submergedFromRow !== undefined ? submergedFromRow - 1 : rows - 1;
  let movedCount = 0;

  for (let c = 0; c < cols; c++) {
    for (let r = rows - 1; r >= 0; r--) {
      const cell = grid[r][c];
      if (!cell.candy || cell.candy.special !== 'key') continue;
      if (isLockedCandyBlocker(cell.blocker)) continue;

      const stepDir = r < targetExitRow ? 1 : r > targetExitRow ? -1 : 0;
      if (stepDir === 0) continue;

      let curR = r;
      for (let step = 0; step < 2; step++) {
        const nextR = curR + stepDir;
        if (nextR < 0 || nextR >= rows) break;
        const nextCell = grid[nextR][c];
        if (
          isSolidBlocker(nextCell.blocker) ||
          isLockedCandyBlocker(nextCell.blocker) ||
          !nextCell.candy ||
          nextCell.candy.special === 'key'
        ) {
          break;
        }
        const keyPiece = grid[curR][c].candy!;
        const swapPiece = nextCell.candy;
        grid[curR][c].candy = swapPiece;
        swapPiece.row = curR;
        nextCell.candy = keyPiece;
        keyPiece.row = nextR;
        curR = nextR;
        movedCount++;
        if (curR === targetExitRow) break;
      }
    }
  }
  return movedCount;
}

export function collectBottomKeys(
  grid: GridCell[][],
  colors: CandyColor[],
  submergedFromRow?: number
): Array<{ row: number; col: number }> {
  const rows = grid.length;
  const cols = grid[0].length;
  const collected: Array<{ row: number; col: number }> = [];
  const checkRows =
    submergedFromRow !== undefined
      ? [submergedFromRow - 1, submergedFromRow]
      : [rows - 1];

  for (const er of checkRows) {
    if (er < 0 || er >= rows) continue;
    for (let c = 0; c < cols; c++) {
      const exitCell = grid[er][c];
      if (
        exitCell.candy &&
        exitCell.candy.special === 'key' &&
        !isLockedCandyBlocker(exitCell.blocker)
      ) {
        collected.push({ row: er, col: c });
        exitCell.candy = null;
      }
    }
  }

  if (collected.length > 0) {
    applyGravityAndRefill(grid, colors, submergedFromRow);
  }

  return collected;
}

export function shuffleNormalCandies(grid: GridCell[][], colors: CandyColor[]) {
  const slots: GridCell[] = [];
  const pool: CandyPiece[] = [];

  for (const row of grid) {
    for (const cell of row) {
      if (
        cell.candy &&
        cell.candy.special !== 'key' &&
        !isSolidBlocker(cell.blocker) &&
        !isLockedCandyBlocker(cell.blocker)
      ) {
        slots.push(cell);
        pool.push(cell.candy);
      }
    }
  }

  for (let attempt = 0; attempt < 16; attempt++) {
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    slots.forEach((cell, idx) => {
      const p = pool[idx];
      p.row = cell.row;
      p.col = cell.col;
      p.wobble = 1;
      cell.candy = p;
    });

    if (findMatches(grid).length === 0 && hasAnyValidMove(grid)) {
      return;
    }
  }

  // Fallback: guarantee at least a matchable triplet
  if (slots.length >= 3) {
    const clr = randomColor(colors);
    slots[0].candy!.color = clr;
    slots[1].candy!.color = clr;
  }
}

export function hasAnyValidMove(grid: GridCell[][]): boolean {
  const rows = grid.length;
  const cols = grid[0].length;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (c + 1 < cols && isProductiveSwap(grid, r, c, r, c + 1)) return true;
      if (r + 1 < rows && isProductiveSwap(grid, r, c, r + 1, c)) return true;
    }
  }
  return false;
}

export interface HintMove {
  r1: number;
  c1: number;
  r2: number;
  c2: number;
  score: number;
}

export function findBestHintMove(grid: GridCell[][], level: LevelConfig): HintMove | null {
  const rows = grid.length;
  const cols = grid[0].length;
  let best: HintMove | null = null;

  const keyColumns = new Map<number, number>();
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c].candy?.special === 'key') {
        keyColumns.set(c, r);
      }
    }
  }

  const evaluate = (r1: number, c1: number, r2: number, c2: number) => {
    if (!isProductiveSwap(grid, r1, c1, r2, c2)) return;
    const p1 = grid[r1][c1].candy!;
    const p2 = grid[r2][c2].candy!;

    let score = 10;
    if (p1.special !== 'none' || p2.special !== 'none') score += 35;

    grid[r1][c1].candy = p2;
    grid[r2][c2].candy = p1;
    const groups = findMatches(grid);
    grid[r1][c1].candy = p1;
    grid[r2][c2].candy = p2;

    for (const g of groups) {
      score += g.cells.length * 8;
      if (g.spawnSpecial) score += 25;
      for (const mc of g.cells) {
        const keyRow = keyColumns.get(mc.col);
        if (keyRow !== undefined && mc.row > keyRow) {
          score += 36;
        }
        if (level.drainColumns.includes(mc.col)) score += 12;
        if (grid[mc.row][mc.col].blocker !== 'none') score += 15;
        if (level.scene === 'frost_dual' && grid[mc.row][mc.col].candy?.color === 'blue') {
          score += 16;
        }
        if (
          level.scene === 'lava_bridge' &&
          (grid[mc.row][mc.col].candy?.color === 'orange' ||
            grid[mc.row][mc.col].candy?.color === 'yellow')
        ) {
          score += 14;
        }
      }
    }

    if (!best || score > best.score) {
      best = { r1, c1, r2, c2, score };
    }
  };

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (c + 1 < cols) evaluate(r, c, r, c + 1);
      if (r + 1 < rows) evaluate(r, c, r + 1, c);
    }
  }

  return best;
}
