import { CANDY_PALETTE } from './candyArt';
import { CandyColor, GameStatus, Language, LevelConfig, TaskProgress } from '../types/game';

export interface MarbleBall {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  color: CandyColor;
  draining: boolean;
  alpha: number;
}

export interface FlyingItem {
  id: number;
  kind: 'key' | 'plank' | 'frost' | 'slime' | 'cannon_orb';
  x: number;
  y: number;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  progress: number; // 0..1
  color?: string;
}

export interface ArenaBounds {
  x: number;
  y: number;
  w: number;
  h: number;
}

const MARBLE_COLORS: CandyColor[] = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];

export function createInitialMarbles(count: number, siloX: number, siloY: number, siloW: number, siloH: number): MarbleBall[] {
  const balls: MarbleBall[] = [];
  const r = 7.2;
  const cols = Math.max(3, Math.floor((siloW - 8) / (r * 2)));
  for (let i = 0; i < count; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    balls.push({
      id: i + 1,
      x: siloX + 8 + r + col * (r * 1.95) + (Math.random() - 0.5) * 3,
      y: siloY + siloH - 10 - r - row * (r * 1.78),
      vx: (Math.random() - 0.5) * 8,
      vy: 0,
      r,
      color: MARBLE_COLORS[i % MARBLE_COLORS.length],
      draining: false,
      alpha: 1,
    });
  }
  return balls;
}

export function stepMarblesPhysics(
  balls: MarbleBall[],
  dt: number,
  silo: { x: number; y: number; w: number; h: number },
  drainTargetXRange: [number, number]
) {
  const stepDt = Math.min(dt, 0.033);
  const siloBalls = balls.filter((b) => !b.draining);

  for (const b of balls) {
    if (!b.draining) {
      b.vy += 420 * stepDt;
      b.x += b.vx * stepDt;
      b.y += b.vy * stepDt;
      b.vx *= 0.92;
      b.vy *= 0.92;

      if (b.x - b.r < silo.x + 5) {
        b.x = silo.x + 5 + b.r;
        b.vx = Math.abs(b.vx) * 0.4;
      }
      if (b.x + b.r > silo.x + silo.w - 5) {
        b.x = silo.x + silo.w - 5 - b.r;
        b.vx = -Math.abs(b.vx) * 0.4;
      }
      if (b.y + b.r > silo.y + silo.h - 5) {
        b.y = silo.y + silo.h - 5 - b.r;
        b.vy = 0;
      }
      if (b.y - b.r < silo.y + 4) {
        b.y = silo.y + 4 + b.r;
        b.vy = 0;
      }
    } else {
      // Draining down through the Match-3 board!
      b.vy += 680 * stepDt;
      const midTarget = (drainTargetXRange[0] + drainTargetXRange[1]) * 0.5;
      b.vx += (midTarget - b.x) * 0.8 * stepDt;
      b.x += b.vx * stepDt;
      b.y += b.vy * stepDt;
      if (b.y > 760) {
        b.alpha -= stepDt * 3.5;
      }
    }
  }

  // Pairwise relaxation for silo marbles so they stack like real marbles!
  for (let iter = 0; iter < 2; iter++) {
    for (let i = 0; i < siloBalls.length; i++) {
      const a = siloBalls[i];
      for (let j = i + 1; j < siloBalls.length; j++) {
        const b = siloBalls[j];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const minDist = a.r + b.r - 0.5;
        const distSq = dx * dx + dy * dy;
        if (distSq > 0.001 && distSq < minDist * minDist) {
          const dist = Math.sqrt(distSq);
          const overlap = (minDist - dist) * 0.5;
          const nx = dx / dist;
          const ny = dy / dist;
          a.x -= nx * overlap;
          a.y -= ny * overlap;
          b.x += nx * overlap;
          b.y += ny * overlap;
        }
      }
      // Re-clamp inside silo walls
      a.x = Math.max(silo.x + 5 + a.r, Math.min(silo.x + silo.w - 5 - a.r, a.x));
      a.y = Math.min(silo.y + silo.h - 5 - a.r, a.y);
    }
  }
}

export function drawBlueBrickWall(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
) {
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 18);
  ctx.clip();

  const bg = ctx.createLinearGradient(x, y, x, y + h);
  bg.addColorStop(0, '#274060');
  bg.addColorStop(0.55, '#1b2e47');
  bg.addColorStop(1, '#111d2e');
  ctx.fillStyle = bg;
  ctx.fillRect(x, y, w, h);

  // Subtle brick pattern
  const brickH = 18;
  const brickW = 42;
  ctx.strokeStyle = 'rgba(10, 18, 30, 0.5)';
  ctx.lineWidth = 1.5;
  for (let row = 0; row * brickH < h + brickH; row++) {
    const by = y + row * brickH;
    ctx.beginPath();
    ctx.moveTo(x, by);
    ctx.lineTo(x + w, by);
    ctx.stroke();

    const offset = row % 2 === 0 ? 0 : brickW * 0.5;
    for (let bx = x - offset; bx < x + w; bx += brickW) {
      ctx.beginPath();
      ctx.moveTo(bx, by);
      ctx.lineTo(bx, by + brickH);
      ctx.stroke();
    }

    // Top highlight on bricks
    ctx.strokeStyle = 'rgba(148, 187, 233, 0.08)';
    ctx.beginPath();
    ctx.moveTo(x, by + 1.5);
    ctx.lineTo(x + w, by + 1.5);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(10, 18, 30, 0.5)';
  }

  // Border frame
  ctx.strokeStyle = 'rgba(255, 174, 66, 0.45)';
  ctx.lineWidth = 3;
  ctx.strokeRect(x + 1.5, y + 1.5, w - 3, h - 3);

  ctx.restore();
}

function drawOrangeWallBar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
) {
  ctx.save();
  // Drop shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.48)';
  ctx.beginPath();
  ctx.roundRect(x + 3, y + 5, w, h, 6);
  ctx.fill();

  // Extruded dark base
  ctx.fillStyle = '#9c4806';
  ctx.beginPath();
  ctx.roundRect(x, y + 2, w, h, 6);
  ctx.fill();

  // Beveled golden-orange front face
  const grad = ctx.createLinearGradient(x, y, x, y + h);
  grad.addColorStop(0, '#ffb84d');
  grad.addColorStop(0.45, '#f28518');
  grad.addColorStop(1, '#bd5904');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.roundRect(x, y, w, Math.max(4, h - 2), 6);
  ctx.fill();

  ctx.strokeStyle = '#ffd685';
  ctx.lineWidth = 1.2;
  ctx.stroke();
  ctx.restore();
}

function drawEscapePortal(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  w: number,
  h: number,
  time: number,
  label: string
) {
  ctx.save();
  ctx.translate(cx, cy);

  // Warm radial glow
  const glow = ctx.createRadialGradient(0, 0, 6, 0, 0, Math.max(w, h) * 1.15);
  glow.addColorStop(0, 'rgba(255, 248, 185, 0.95)');
  glow.addColorStop(0.45, 'rgba(255, 175, 45, 0.55)');
  glow.addColorStop(1, 'rgba(255, 140, 0, 0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(0, 0, Math.max(w, h) * 1.15, 0, Math.PI * 2);
  ctx.fill();

  // Portal arch
  ctx.beginPath();
  ctx.roundRect(-w / 2, -h / 2, w, h, [w / 2, w / 2, 6, 6]);
  const inner = ctx.createLinearGradient(0, -h / 2, 0, h / 2);
  inner.addColorStop(0, '#ffffff');
  inner.addColorStop(0.5, '#ffe066');
  inner.addColorStop(1, '#ff922b');
  ctx.fillStyle = inner;
  ctx.fill();
  ctx.lineWidth = 3.5;
  ctx.strokeStyle = '#d97706';
  ctx.stroke();

  // Swirling portal ring
  ctx.save();
  ctx.rotate(time * 2.4);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 6]);
  ctx.beginPath();
  ctx.arc(0, 2, w * 0.28, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // EXIT badge
  ctx.font = 'bold 10px Fredoka, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#fffbeb';
  ctx.strokeStyle = '#78350f';
  ctx.lineWidth = 3;
  ctx.strokeText(label, 0, -h / 2 - 6);
  ctx.fillText(label, 0, -h / 2 - 6);

  ctx.restore();
}

export function drawMochiCharacter(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number,
  danger: number,
  status: GameStatus,
  time: number,
  speechText?: string
) {
  ctx.save();
  ctx.translate(x, y);

  // Motion bounce based on state
  let bounceY = Math.sin(time * 4.5) * 2.2;
  let squashX = 1 + Math.sin(time * 4.5) * 0.03;
  let squashY = 1 - Math.sin(time * 4.5) * 0.03;
  let shakeX = 0;

  if (status === 'won' || status === 'rescuing') {
    bounceY = -Math.abs(Math.sin(time * 10)) * 14;
    squashX = 1.06;
    squashY = 0.96;
  } else if (danger >= 70 && status === 'playing') {
    bounceY = -Math.abs(Math.sin(time * 13)) * 6;
    shakeX = Math.sin(time * 38) * 2.2;
  } else if (danger >= 45 && status === 'playing') {
    shakeX = Math.sin(time * 24) * 1.0;
  }

  ctx.translate(shakeX, bounceY);
  ctx.scale(scale * squashX, scale * squashY);

  // Ground shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.beginPath();
  ctx.ellipse(0, 22 - bounceY * 0.4, 20, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  const bodyGrad = ctx.createRadialGradient(-7, -10, 4, 0, 2, 28);
  bodyGrad.addColorStop(0, '#fffdf9');
  bodyGrad.addColorStop(0.65, '#f6e3cb');
  bodyGrad.addColorStop(1, '#cfa982');

  // Cute round ears / puffs (like the storyboard creature!)
  for (const dir of [-1, 1]) {
    ctx.beginPath();
    ctx.arc(dir * 15, -17, 7.5, 0, Math.PI * 2);
    ctx.fillStyle = bodyGrad;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#8c6239';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(dir * 15, -17, 3.6, 0, Math.PI * 2);
    ctx.fillStyle = '#f9a8d4';
    ctx.fill();
  }

  // Little feet
  for (const dir of [-1, 1]) {
    ctx.beginPath();
    ctx.ellipse(dir * 10, 19, 7, 5, dir * 0.2, 0, Math.PI * 2);
    ctx.fillStyle = '#e5c199';
    ctx.fill();
    ctx.lineWidth = 1.8;
    ctx.strokeStyle = '#8c6239';
    ctx.stroke();
  }

  // Plump Chubby Body
  ctx.beginPath();
  ctx.roundRect(-20, -18, 40, 36, [19, 19, 15, 15]);
  ctx.fillStyle = bodyGrad;
  ctx.fill();
  ctx.lineWidth = 2.2;
  ctx.strokeStyle = '#8c6239';
  ctx.stroke();

  // Waving stubby arms
  const armWave =
    status === 'won' || status === 'rescuing'
      ? -0.9 + Math.sin(time * 14) * 0.35
      : danger > 55
        ? -0.7 + Math.sin(time * 16) * 0.4
        : 0.25 + Math.sin(time * 4) * 0.18;

  for (const dir of [-1, 1]) {
    ctx.save();
    ctx.translate(dir * 19, -1);
    ctx.rotate(dir * armWave);
    ctx.beginPath();
    ctx.ellipse(dir * 5, 0, 7, 4.8, 0, 0, Math.PI * 2);
    ctx.fillStyle = bodyGrad;
    ctx.fill();
    ctx.lineWidth = 1.8;
    ctx.strokeStyle = '#8c6239';
    ctx.stroke();
    ctx.restore();
  }

  // Rosy cheeks
  ctx.fillStyle = 'rgba(251, 113, 133, 0.48)';
  ctx.beginPath();
  ctx.ellipse(-11, 2, 4.5, 2.8, 0, 0, Math.PI * 2);
  ctx.ellipse(11, 2, 4.5, 2.8, 0, 0, Math.PI * 2);
  ctx.fill();

  // Eyes & Expression
  if (status === 'won' || status === 'rescuing') {
    // Happy ^ ^ eyes
    ctx.strokeStyle = '#3b2314';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    for (const dir of [-1, 1]) {
      ctx.beginPath();
      ctx.arc(dir * 7.5, -4, 4.2, Math.PI * 1.1, Math.PI * 1.9);
      ctx.stroke();
    }
    // Big cheerful smile
    ctx.beginPath();
    ctx.arc(0, 1, 5.5, 0, Math.PI);
    ctx.fillStyle = '#ef4444';
    ctx.fill();
    ctx.stroke();
  } else if (status === 'lost') {
    // Dizzy X X eyes
    ctx.strokeStyle = '#3b2314';
    ctx.lineWidth = 2.2;
    for (const dir of [-1, 1]) {
      const ex = dir * 7.5;
      ctx.beginPath();
      ctx.moveTo(ex - 3.5, -7.5);
      ctx.lineTo(ex + 3.5, -0.5);
      ctx.moveTo(ex + 3.5, -7.5);
      ctx.lineTo(ex - 3.5, -0.5);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(0, 7, 4.5, Math.PI, 0);
    ctx.stroke();
  } else {
    // Glossy eyes
    for (const dir of [-1, 1]) {
      ctx.beginPath();
      ctx.arc(dir * 7.5, -4, danger > 65 ? 5.0 : 4.3, 0, Math.PI * 2);
      ctx.fillStyle = '#29170b';
      ctx.fill();

      // Sparkle pupil
      ctx.beginPath();
      ctx.arc(dir * 7.5 - 1.4, -5.6, 1.7, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    }

    if (danger > 60) {
      // Worried eyebrows + gasping mouth + sweat drop!
      ctx.strokeStyle = '#432818';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-12, -10);
      ctx.lineTo(-4, -12);
      ctx.moveTo(12, -10);
      ctx.lineTo(4, -12);
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(0, 5, 3.8, 4.8, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#be123c';
      ctx.fill();

      // Animated sweat droplet
      const dropY = ((time * 28) % 14) - 14;
      ctx.beginPath();
      ctx.arc(17, dropY, 3.2, 0, Math.PI * 2);
      ctx.fillStyle = '#38bdf8';
      ctx.fill();
    } else {
      // Cute small smile / 'w' mouth
      ctx.strokeStyle = '#432818';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 1.5, 3.8, 0.15 * Math.PI, 0.85 * Math.PI);
      ctx.stroke();
    }
  }

  // Optional speech callout bubble
  if (speechText && status === 'playing') {
    ctx.save();
    ctx.scale(1 / (scale * squashX), 1 / (scale * squashY));
    ctx.translate(0, -34);
    ctx.font = 'bold 11px "Baloo Da 2", Fredoka, sans-serif';
    const tw = ctx.measureText(speechText).width + 14;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(-tw / 2, -18, tw, 20, 10);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#b91c1c';
    ctx.textAlign = 'center';
    ctx.fillText(speechText, 0, -4);
    ctx.restore();
  }

  ctx.restore();
}

function samplePolyline(
  pts: Array<{ x: number; y: number }>,
  distFromStart: number
): { x: number; y: number; angle: number } {
  if (pts.length === 0) return { x: 0, y: 0, angle: 0 };
  if (pts.length === 1 || distFromStart <= 0) {
    const dx = pts.length > 1 ? pts[1].x - pts[0].x : 1;
    const dy = pts.length > 1 ? pts[1].y - pts[0].y : 0;
    return { x: pts[0].x, y: pts[0].y, angle: Math.atan2(dy, dx) };
  }

  let acc = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    const dx = pts[i + 1].x - pts[i].x;
    const dy = pts[i + 1].y - pts[i].y;
    const segLen = Math.hypot(dx, dy);
    if (acc + segLen >= distFromStart) {
      const t = segLen > 0 ? (distFromStart - acc) / segLen : 0;
      return {
        x: pts[i].x + dx * t,
        y: pts[i].y + dy * t,
        angle: Math.atan2(dy, dx),
      };
    }
    acc += segLen;
  }

  const last = pts[pts.length - 1];
  const prev = pts[pts.length - 2];
  return {
    x: last.x,
    y: last.y,
    angle: Math.atan2(last.y - prev.y, last.x - prev.x),
  };
}

function totalPolylineLength(pts: Array<{ x: number; y: number }>): number {
  let len = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    len += Math.hypot(pts[i + 1].x - pts[i].x, pts[i + 1].y - pts[i].y);
  }
  return len;
}

export function drawSerpentMonster(
  ctx: CanvasRenderingContext2D,
  path: Array<{ x: number; y: number }>,
  progress01: number,
  time: number,
  options: { isFrozen?: boolean; isBoss?: boolean; bodyLength?: number } = {}
) {
  const totalLen = totalPolylineLength(path);
  const headDist = Math.max(18, Math.min(totalLen, progress01 * totalLen));
  const bodyLen = options.bodyLength ?? 220;
  const numSegments = 24;

  // Draw body segments from tail to neck
  for (let i = numSegments; i >= 1; i--) {
    const segDist = headDist - (i / numSegments) * bodyLen;
    if (segDist < 0) continue;

    const sample = samplePolyline(path, segDist);
    const slither = options.isFrozen
      ? 0
      : Math.sin(time * 7 - i * 0.55) * 3.2 * (1 - i / (numSegments + 4));
    const nx = -Math.sin(sample.angle) * slither;
    const ny = Math.cos(sample.angle) * slither;

    const segRadius = 15.5 * (1 - (i / (numSegments + 6)) * 0.55);
    const sx = sample.x + nx;
    const sy = sample.y + ny;

    ctx.save();
    ctx.translate(sx, sy);

    const grad = ctx.createRadialGradient(-segRadius * 0.3, -segRadius * 0.3, 2, 0, 0, segRadius);
    if (options.isFrozen) {
      grad.addColorStop(0, '#e0f2fe');
      grad.addColorStop(0.55, '#38bdf8');
      grad.addColorStop(1, '#0369a1');
    } else if (options.isBoss) {
      grad.addColorStop(0, '#a3e635');
      grad.addColorStop(0.5, '#16a34a');
      grad.addColorStop(1, '#064e3b');
    } else {
      grad.addColorStop(0, '#bef264');
      grad.addColorStop(0.55, '#4d9c11');
      grad.addColorStop(1, '#1e4606');
    }

    ctx.beginPath();
    ctx.arc(0, 0, segRadius, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.lineWidth = 1.4;
    ctx.strokeStyle = options.isFrozen ? '#bae6fd' : '#143302';
    ctx.stroke();

    // Scale ridge dot
    if (i % 2 === 0) {
      ctx.beginPath();
      ctx.arc(0, 0, segRadius * 0.35, 0, Math.PI * 2);
      ctx.fillStyle = options.isFrozen
        ? 'rgba(255,255,255,0.55)'
        : 'rgba(217, 249, 157, 0.35)';
      ctx.fill();
    }

    ctx.restore();
  }

  // Draw fierce Croc / Serpent Head!
  const head = samplePolyline(path, headDist);
  ctx.save();
  ctx.translate(head.x, head.y);
  ctx.rotate(head.angle);

  const jawOpen = options.isFrozen ? 0.08 : 0.16 + Math.abs(Math.sin(time * 8)) * 0.24;

  // Lower jaw + teeth
  ctx.save();
  ctx.rotate(jawOpen);
  ctx.fillStyle = options.isFrozen ? '#0284c7' : '#3f820d';
  ctx.strokeStyle = '#143302';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(-6, 0, 28, 12, [2, 8, 8, 4]);
  ctx.fill();
  ctx.stroke();

  // Sharp white teeth on lower jaw
  ctx.fillStyle = '#ffffff';
  for (const tx of [6, 13, 20]) {
    ctx.beginPath();
    ctx.moveTo(tx, 0);
    ctx.lineTo(tx + 3, -5);
    ctx.lineTo(tx + 6, 0);
    ctx.fill();
  }
  ctx.restore();

  // Upper snout / skull + teeth
  ctx.save();
  ctx.rotate(-jawOpen * 0.7);
  const headGrad = ctx.createLinearGradient(0, -16, 0, 6);
  if (options.isFrozen) {
    headGrad.addColorStop(0, '#bae6fd');
    headGrad.addColorStop(1, '#0284c7');
  } else {
    headGrad.addColorStop(0, '#bef264');
    headGrad.addColorStop(0.55, '#55a614');
    headGrad.addColorStop(1, '#255205');
  }
  ctx.fillStyle = headGrad;
  ctx.strokeStyle = '#143302';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(-12, -15, 38, 18, [12, 10, 5, 5]);
  ctx.fill();
  ctx.stroke();

  // Upper fangs
  ctx.fillStyle = '#ffffff';
  for (const tx of [8, 16, 23]) {
    ctx.beginPath();
    ctx.moveTo(tx, 3);
    ctx.lineTo(tx + 2.5, 8.5);
    ctx.lineTo(tx + 5, 3);
    ctx.fill();
  }

  // Nostril
  ctx.fillStyle = '#143302';
  ctx.beginPath();
  ctx.arc(21, -7, 2, 0, Math.PI * 2);
  ctx.fill();

  // Glowing Reptile Eye
  ctx.beginPath();
  ctx.arc(2, -10, 5.5, 0, Math.PI * 2);
  ctx.fillStyle = options.isFrozen ? '#e0f2fe' : '#fde047';
  ctx.fill();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = '#143302';
  ctx.stroke();

  // Slit pupil
  ctx.beginPath();
  ctx.ellipse(3, -10, 1.6, 4.2, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#7f1d1d';
  ctx.fill();

  // Angry brow
  ctx.strokeStyle = '#1a3b04';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(-4, -15);
  ctx.lineTo(8, -12);
  ctx.stroke();

  // Royal Golden Crown for Boss Level 6!
  if (options.isBoss) {
    ctx.save();
    ctx.translate(-4, -16);
    ctx.rotate(-0.15);
    ctx.fillStyle = '#facc15';
    ctx.strokeStyle = '#854d0e';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(-9, 0);
    ctx.lineTo(-11, -11);
    ctx.lineTo(-3, -5);
    ctx.lineTo(0, -14);
    ctx.lineTo(4, -5);
    ctx.lineTo(11, -11);
    ctx.lineTo(9, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, -4, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = '#ef4444';
    ctx.fill();
    ctx.restore();
  }

  ctx.restore();
  ctx.restore();
}

export function drawSilverGate(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  openRatio: number,
  tintColor: string = '#cbd5e1'
) {
  const slideOffset = openRatio * (h - 8);
  const curH = Math.max(8, h - slideOffset);

  ctx.save();
  const metal = ctx.createLinearGradient(x, y, x + w, y);
  metal.addColorStop(0, '#f8fafc');
  metal.addColorStop(0.5, tintColor);
  metal.addColorStop(1, '#475569');

  ctx.fillStyle = metal;
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(x, y, w, curH, 4);
  ctx.fill();
  ctx.stroke();

  // Hazard chevrons on gate
  ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
  for (let gy = y + 6; gy < y + curH - 6; gy += 12) {
    ctx.fillRect(x + 2, gy, w - 4, 4);
  }
  ctx.restore();
}

export function drawMarbleBall(ctx: CanvasRenderingContext2D, b: MarbleBall) {
  if (b.alpha <= 0.02) return;
  const pal = CANDY_PALETTE[b.color];
  ctx.save();
  ctx.globalAlpha = Math.max(0, Math.min(1, b.alpha));
  ctx.translate(b.x, b.y);

  const g = ctx.createRadialGradient(-b.r * 0.3, -b.r * 0.35, 1, 0, 0, b.r);
  g.addColorStop(0, pal.light);
  g.addColorStop(0.6, pal.mid);
  g.addColorStop(1, pal.dark);

  ctx.beginPath();
  ctx.arc(0, 0, b.r, 0, Math.PI * 2);
  ctx.fillStyle = g;
  ctx.fill();
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'rgba(255,255,255,0.45)';
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(-b.r * 0.3, -b.r * 0.32, b.r * 0.28, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  ctx.fill();

  ctx.restore();
}

export interface RenderArenaParams {
  ctx: CanvasRenderingContext2D;
  bounds: ArenaBounds;
  level: LevelConfig;
  tasks: TaskProgress[];
  danger: number; // 0..100
  status: GameStatus;
  rescueAnimProgress: number; // 0..1 during 'rescuing' / 'won'
  freezeTimer: number;
  marbles: MarbleBall[];
  time: number;
  lang: Language;
}

export function getSiloRect(bounds: ArenaBounds, level: LevelConfig) {
  if (level.scene === 'frost_dual') {
    return {
      x: bounds.x + bounds.w * 0.5 - 48,
      y: bounds.y + bounds.h - 102,
      w: 96,
      h: 92,
    };
  }
  return {
    x: bounds.x + 18,
    y: bounds.y + 56,
    w: 96,
    h: bounds.h - 68,
  };
}

export function renderRescueArena(params: RenderArenaParams) {
  const {
    ctx,
    bounds,
    level,
    tasks,
    danger,
    status,
    rescueAnimProgress,
    freezeTimer,
    marbles,
    time,
    lang,
  } = params;

  const { x, y, w, h } = bounds;
  drawBlueBrickWall(ctx, x, y, w, h);

  const getTaskRatio = (kind: TaskProgress['kind']) => {
    const t = tasks.find((tk) => tk.kind === kind);
    if (!t || t.target <= 0) return 1;
    return Math.min(1, t.current / t.target);
  };

  const overallRatio =
    tasks.length > 0
      ? tasks.reduce((acc, tk) => acc + Math.min(1, tk.current / tk.target), 0) / tasks.length
      : 0;

  const isFrozen = freezeTimer > 0;
  const exitLabel = lang === 'bn' ? 'সেফ গেট' : 'EXIT';
  const helpText =
    danger > 68
      ? lang === 'bn'
        ? 'তাড়াতাড়ি!! 😱'
        : 'HURRY!! 😱'
      : Math.sin(time * 1.6) > 0.55
        ? lang === 'bn'
          ? 'বাঁচাও!'
          : 'Help!'
        : undefined;

  // SCENE 1: Classic G-Shaped Spiral Tunnel + Left Marble Silo! (Matches storyboard!)
  if (level.scene === 'spiral_marble') {
    const silo = getSiloRect(bounds, level);

    // Glass marble silo container on left
    ctx.save();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.72)';
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(silo.x, silo.y, silo.w, silo.h, 10);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Escape Portal on top-left above silo!
    drawEscapePortal(ctx, silo.x + 48, y + 32, 46, 40, time, exitLabel);

    // Giant Orange G-Shaped Spiral Tunnel on the right
    const gx = x + 128;
    const gy = y + 20;
    const gw = w - 146;
    const gh = h - 34;

    // Dark recessed tunnel interior
    ctx.fillStyle = 'rgba(9, 15, 26, 0.58)';
    ctx.beginPath();
    ctx.roundRect(gx, gy, gw, gh, 14);
    ctx.fill();

    // Outer G walls
    drawOrangeWallBar(ctx, gx, gy, gw, 16); // Top bar
    drawOrangeWallBar(ctx, gx, gy, 16, gh - 72); // Left upper vertical wall
    drawOrangeWallBar(ctx, gx, gy + gh - 16, gw, 16); // Bottom floor
    drawOrangeWallBar(ctx, gx + gw - 16, gy + 74, 16, gh - 74); // Right outer wall
    // Inner G spiral walls
    drawOrangeWallBar(ctx, gx + 76, gy + 74, gw - 76, 16); // Upper inner horizontal
    drawOrangeWallBar(ctx, gx + 76, gy + 74, 16, gh - 154); // Inner vertical divider
    drawOrangeWallBar(ctx, gx + 76, gy + gh - 92, gw - 148, 16); // Inner lip above Mochi

    // Counterweight Silver Gate between Mochi's pocket & Marble Silo!
    const gateOpen = status === 'rescuing' || status === 'won' ? 1 : overallRatio * 0.85;
    drawSilverGate(ctx, gx, gy + gh - 76, 14, 60, gateOpen);

    // Serpent path winding through the G-tunnel from top-right to Mochi!
    const serpentPath = [
      { x: gx + gw + 10, y: gy + 45 },
      { x: gx + 45, y: gy + 45 },
      { x: gx + 45, y: gy + gh - 125 },
      { x: gx + gw - 46, y: gy + gh - 125 },
      { x: gx + gw - 46, y: gy + gh - 46 },
      { x: gx + 95, y: gy + gh - 46 },
    ];
    drawSerpentMonster(ctx, serpentPath, danger / 100, time, { isFrozen, bodyLength: 250 });

    // Mochi position (escapes left & up into portal when won!)
    const startMX = gx + 54;
    const startMY = gy + gh - 44;
    const mochiX =
      status === 'rescuing' || status === 'won'
        ? startMX + (silo.x + 48 - startMX) * Math.min(1, rescueAnimProgress * 1.3)
        : startMX;
    const mochiY =
      status === 'rescuing' || status === 'won'
        ? startMY + (y + 36 - startMY) * Math.max(0, (rescueAnimProgress - 0.25) / 0.75)
        : startMY;

    drawMochiCharacter(ctx, mochiX, mochiY, 0.92, danger, status, time, helpText);

    // Draw silo marbles ( non-draining here; draining marbles drawn over full stage )
    for (const b of marbles) {
      if (!b.draining) drawMarbleBall(ctx, b);
    }
  }

  // SCENE 2: Molten Caramel Bridge!
  else if (level.scene === 'lava_bridge') {
    const lavaHeight = 36 + (danger / 100) * 68;
    const lavaY = y + h - lavaHeight;

    // Bubbling molten caramel/lava at bottom of arena
    const lavaGrad = ctx.createLinearGradient(x, lavaY, x, y + h);
    lavaGrad.addColorStop(0, '#fde047');
    lavaGrad.addColorStop(0.3, '#f97316');
    lavaGrad.addColorStop(1, '#991b1b');

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(x + 4, y + 4, w - 8, h - 8, 15);
    ctx.clip();

    ctx.fillStyle = lavaGrad;
    ctx.beginPath();
    ctx.moveTo(x, y + h);
    for (let lx = x; lx <= x + w + 20; lx += 20) {
      const wave = Math.sin(time * 4 + lx * 0.05) * 5;
      ctx.lineTo(lx, lavaY + wave);
    }
    ctx.lineTo(x + w, y + h);
    ctx.closePath();
    ctx.fill();

    // Glowing lava bubbles
    ctx.fillStyle = 'rgba(254, 240, 138, 0.75)';
    for (let i = 0; i < 7; i++) {
      const bx = x + 45 + i * 72 + Math.sin(time * 2 + i) * 10;
      const by = lavaY + 14 + ((time * 22 + i * 19) % 28);
      ctx.beginPath();
      ctx.arc(bx, by, 4 + (i % 3), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // Left starting ledge & Right exit ledge
    const ledgeY = y + h - 122;
    drawOrangeWallBar(ctx, x + 16, ledgeY, 102, 22);
    drawOrangeWallBar(ctx, x + w - 118, ledgeY, 102, 22);

    // Advancing Spiked Wall from the left!
    const wallX = x + 12 + (danger / 100) * 86;
    ctx.fillStyle = '#475569';
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(x + 8, y + 48, wallX - x, ledgeY - (y + 48), 6);
    ctx.fill();
    ctx.stroke();
    // Spikes
    ctx.fillStyle = '#e2e8f0';
    for (let sy = y + 60; sy < ledgeY - 12; sy += 22) {
      ctx.beginPath();
      ctx.moveTo(wallX + 8, sy);
      ctx.lineTo(wallX + 22, sy + 8);
      ctx.lineTo(wallX + 8, sy + 16);
      ctx.fill();
    }

    // 4 Candy Bridge Planks across chasm
    const chasmStart = x + 122;
    const chasmWidth = w - 244;
    const plankW = chasmWidth / 4 - 6;
    const builtPlanks = Math.min(4, Math.floor(overallRatio * 4 + 0.001));

    for (let i = 0; i < 4; i++) {
      const px = chasmStart + i * (plankW + 8);
      if (i < builtPlanks || status === 'rescuing' || status === 'won') {
        const pGrad = ctx.createLinearGradient(px, ledgeY, px, ledgeY + 16);
        pGrad.addColorStop(0, '#fde047');
        pGrad.addColorStop(1, '#ea580c');
        ctx.fillStyle = pGrad;
        ctx.strokeStyle = '#fffbeb';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(px, ledgeY + 2, plankW, 16, 6);
        ctx.fill();
        ctx.stroke();
      } else {
        // Dashed ghost blueprint of missing plank
        ctx.save();
        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = 'rgba(253, 224, 71, 0.45)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(px, ledgeY + 3, plankW, 14, 5);
        ctx.stroke();
        ctx.restore();
      }
    }

    drawEscapePortal(ctx, x + w - 62, ledgeY - 28, 48, 52, time, exitLabel);

    // Mochi hops forward onto each built plank!
    const baseMochiX =
      builtPlanks === 0
        ? x + 84
        : chasmStart + (builtPlanks - 0.5) * (plankW + 8);
    const targetPortalX = x + w - 62;
    const mochiX =
      status === 'rescuing' || status === 'won'
        ? baseMochiX + (targetPortalX - baseMochiX) * rescueAnimProgress
        : Math.max(wallX + 36, baseMochiX);

    drawMochiCharacter(ctx, mochiX, ledgeY - 22, 0.95, danger, status, time, helpText);
  }

  // SCENE 3: Triple Key Stepped Dungeon!
  else if (level.scene === 'triple_key') {
    const tunnelY = y + h - 108;
    // Upper chase corridor & Lower 3-Gate corridor
    drawOrangeWallBar(ctx, x + 20, y + 24, w - 40, 16);
    drawOrangeWallBar(ctx, x + 20, y + 104, w - 95, 16);
    drawOrangeWallBar(ctx, x + w - 36, y + 24, 16, h - 48);
    drawOrangeWallBar(ctx, x + 20, tunnelY - 56, w - 110, 16);
    drawOrangeWallBar(ctx, x + 20, tunnelY + 24, w - 40, 16);

    const keysCollected = tasks.find((t) => t.kind === 'keys')?.current ?? 0;
    const iceDone = getTaskRatio('ice');

    const gateColors = ['#f87171', '#4ade80', '#60a5fa'];
    const gateXs = [x + 175, x + 265, x + 355];
    gateXs.forEach((gx, idx) => {
      const unlocked =
        status === 'rescuing' ||
        status === 'won' ||
        (keysCollected > idx && (idx < 2 || iceDone >= 1));
      drawSilverGate(ctx, gx, tunnelY - 40, 14, 64, unlocked ? 1 : 0, gateColors[idx]);
    });

    drawEscapePortal(ctx, x + 64, tunnelY - 12, 48, 52, time, exitLabel);

    // Serpent enters top-left, runs right, drops down right shaft, and chases left toward Mochi!
    const serpentPath = [
      { x: x + 30, y: y + 64 },
      { x: x + w - 65, y: y + 64 },
      { x: x + w - 65, y: tunnelY - 8 },
      { x: x + 135, y: tunnelY - 8 },
    ];
    drawSerpentMonster(ctx, serpentPath, danger / 100, time, { isFrozen, bodyLength: 230 });

    // Mochi advances leftward through unlocked chambers toward portal at x+64!
    const chamberXs = [x + 405, x + 310, x + 220, x + 125];
    const unlockedCount = Math.min(3, keysCollected);
    const curX = chamberXs[unlockedCount];
    const mochiX =
      status === 'rescuing' || status === 'won'
        ? curX + (x + 64 - curX) * rescueAnimProgress
        : curX;

    drawMochiCharacter(ctx, mochiX, tunnelY - 8, 0.9, danger, status, time, helpText);
  }

  // SCENE 4: Frost Turret & Dual Chompers!
  else if (level.scene === 'frost_dual') {
    const silo = getSiloRect(bounds, level);

    // U-shaped upper corridor where TWO serpents slither from Left & Right!
    const corrY = y + 128;
    drawOrangeWallBar(ctx, x + 18, corrY - 54, w - 36, 15);
    drawOrangeWallBar(ctx, x + 18, corrY + 20, silo.x - (x + 18), 15);
    drawOrangeWallBar(ctx, silo.x + silo.w, corrY + 20, x + w - 18 - (silo.x + silo.w), 15);

    // Marble chamber beneath Mochi
    ctx.fillStyle = 'rgba(15, 23, 42, 0.72)';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(silo.x, silo.y, silo.w, silo.h, 10);
    ctx.fill();
    ctx.stroke();

    // Escape Portal at bottom of central shaft
    drawEscapePortal(ctx, x + w * 0.5, silo.y + silo.h - 28, 46, 42, time, exitLabel);

    // Frost Turret mounted on ceiling above Mochi!
    ctx.save();
    ctx.translate(x + w * 0.5, y + 42);
    ctx.fillStyle = '#0ea5e9';
    ctx.strokeStyle = '#bae6fd';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, 0, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.font = '18px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('❄️', 0, 6);
    ctx.restore();

    // Left & Right Serpent paths converging on Mochi in the center!
    const leftPath = [
      { x: x + 22, y: corrY - 16 },
      { x: x + w * 0.5 - 42, y: corrY - 16 },
    ];
    const rightPath = [
      { x: x + w - 22, y: corrY - 16 },
      { x: x + w * 0.5 + 42, y: corrY - 16 },
    ];
    drawSerpentMonster(ctx, leftPath, danger / 100, time, { isFrozen, bodyLength: 150 });
    drawSerpentMonster(ctx, rightPath, danger / 100, time + 1.2, { isFrozen, bodyLength: 150 });

    // Trapdoor under Mochi
    const hatchOpen = status === 'rescuing' || status === 'won' ? 1 : overallRatio * 0.7;
    drawSilverGate(ctx, silo.x + 6, corrY + 20, silo.w - 12, 12, hatchOpen, '#7dd3fc');

    for (const b of marbles) {
      if (!b.draining) drawMarbleBall(ctx, b);
    }

    const mochiY =
      status === 'rescuing' || status === 'won'
        ? corrY - 8 + (silo.y + silo.h - 32 - (corrY - 8)) * rescueAnimProgress
        : corrY - 8;
    drawMochiCharacter(ctx, x + w * 0.5, mochiY, 0.9, danger, status, time, helpText);
  }

  // SCENE 5: Giant Rolling Jawbreaker Boulder!
  else if (level.scene === 'boulder_run') {
    // Sloped ramp from left-top down to right-bottom escape portal!
    const rStart = { x: x + 28, y: y + 88 };
    const rEnd = { x: x + w - 95, y: y + h - 42 };

    ctx.save();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 16;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(rStart.x, rStart.y + 24);
    ctx.lineTo(rEnd.x, rEnd.y + 24);
    ctx.stroke();
    ctx.strokeStyle = '#fde68a';
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.restore();

    drawEscapePortal(ctx, x + w - 52, rEnd.y - 4, 48, 52, time, exitLabel);

    // 2 Chain-Locked Gates along the ramp
    const gatesOpen =
      status === 'rescuing' || status === 'won' ? 1 : overallRatio;
    drawSilverGate(ctx, x + 245, y + 105, 14, 58, Math.min(1, gatesOpen * 1.6), '#fbbf24');
    drawSilverGate(ctx, x + 375, y + 145, 14, 62, Math.max(0, (gatesOpen - 0.5) * 2), '#fbbf24');

    // Mochi position ahead on the ramp
    const mochiT =
      status === 'rescuing' || status === 'won'
        ? 0.55 + 0.45 * rescueAnimProgress
        : 0.36 + overallRatio * 0.44;
    const mx = rStart.x + (rEnd.x + 38 - rStart.x) * mochiT;
    const my = rStart.y + (rEnd.y - rStart.y) * mochiT;

    // Giant Rolling Spiked Jawbreaker Boulder!
    const boulderT = (danger / 100) * (mochiT - 0.06);
    const bx = rStart.x + (rEnd.x + 38 - rStart.x) * boulderT;
    const by = rStart.y + (rEnd.y - rStart.y) * boulderT - 12;

    ctx.save();
    ctx.translate(bx, by);
    ctx.rotate(isFrozen ? 0 : time * 4.5);
    const bR = 38;
    // Outer spikes
    ctx.fillStyle = '#cbd5e1';
    for (let i = 0; i < 10; i++) {
      const ang = (i / 10) * Math.PI * 2;
      ctx.save();
      ctx.rotate(ang);
      ctx.beginPath();
      ctx.moveTo(bR - 3, -6);
      ctx.lineTo(bR + 10, 0);
      ctx.lineTo(bR - 3, 6);
      ctx.fill();
      ctx.restore();
    }
    const bGrad = ctx.createRadialGradient(-10, -10, 4, 0, 0, bR);
    bGrad.addColorStop(0, isFrozen ? '#bae6fd' : '#fda4af');
    bGrad.addColorStop(0.5, isFrozen ? '#0284c7' : '#be123c');
    bGrad.addColorStop(1, '#4c0519');
    ctx.beginPath();
    ctx.arc(0, 0, bR, 0, Math.PI * 2);
    ctx.fillStyle = bGrad;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#ffe4e6';
    ctx.stroke();

    // Swirl pattern on Jawbreaker
    ctx.strokeStyle = 'rgba(255,255,255,0.6)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, bR * 0.55, 0, Math.PI * 1.4);
    ctx.stroke();
    ctx.restore();

    drawMochiCharacter(ctx, mx, my, 0.92, danger, status, time, helpText);
  }

  // SCENE 6: BOSS LAIR — Serpent King's Fortress!
  else {
    const silo = getSiloRect(bounds, level);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
    ctx.strokeStyle = '#c084fc';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(silo.x, silo.y, silo.w, silo.h, 10);
    ctx.fill();
    ctx.stroke();

    drawEscapePortal(ctx, silo.x + 48, y + 32, 46, 40, time, exitLabel);

    const gx = x + 128;
    const gy = y + 20;
    const gw = w - 146;
    const gh = h - 34;

    drawOrangeWallBar(ctx, gx, gy, gw, 16);
    drawOrangeWallBar(ctx, gx, gy + gh - 16, gw, 16);
    drawOrangeWallBar(ctx, gx + gw - 16, gy, 16, gh);
    drawOrangeWallBar(ctx, gx + 70, gy + 72, gw - 86, 16);
    drawOrangeWallBar(ctx, gx, gy + 144, gw - 86, 16);

    // Royal Gate + Rainbow Cannon on left of Mochi
    const gateOpen = status === 'rescuing' || status === 'won' ? 1 : overallRatio * 0.9;
    drawSilverGate(ctx, gx, gy + gh - 78, 14, 62, gateOpen, '#fde047');

    // Rainbow Cannon Meter above Mochi
    const cannonRatio = getTaskRatio('cannon_charge');
    ctx.save();
    ctx.translate(gx + 45, gy + gh - 92);
    ctx.fillStyle = '#312e81';
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(-24, -12, 48, 20, 8);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(-20, -8, 40 * cannonRatio, 12);
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🌈⚡', 0, 2);
    ctx.restore();

    const bossPushback = status === 'rescuing' || status === 'won' ? rescueAnimProgress * 0.65 : 0;
    const bossPath = [
      { x: gx + 24, y: gy + 44 },
      { x: gx + gw - 46, y: gy + 44 },
      { x: gx + gw - 46, y: gy + 112 },
      { x: gx + 42, y: gy + 112 },
      { x: gx + 42, y: gy + 185 },
      { x: gx + gw - 48, y: gy + 185 },
      { x: gx + gw - 48, y: gy + gh - 46 },
      { x: gx + 102, y: gy + gh - 46 },
    ];
    drawSerpentMonster(ctx, bossPath, Math.max(0.05, danger / 100 - bossPushback), time, {
      isFrozen,
      isBoss: true,
      bodyLength: 275,
    });

    // Rainbow Laser Beam blasting Boss during rescue celebration!
    if (status === 'rescuing' || status === 'won') {
      const grad = ctx.createLinearGradient(gx + 50, gy + gh - 48, gx + gw - 40, gy + gh - 48);
      grad.addColorStop(0, '#f43f5e');
      grad.addColorStop(0.35, '#facc15');
      grad.addColorStop(0.7, '#22c55e');
      grad.addColorStop(1, '#38bdf8');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 10 + Math.sin(time * 30) * 3;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(gx + 56, gy + gh - 48);
      ctx.lineTo(gx + gw - 55, gy + gh - 48);
      ctx.stroke();
    }

    const startMX = gx + 54;
    const startMY = gy + gh - 44;
    const mochiX =
      status === 'rescuing' || status === 'won'
        ? startMX + (silo.x + 48 - startMX) * Math.min(1, rescueAnimProgress * 1.25)
        : startMX;
    const mochiY =
      status === 'rescuing' || status === 'won'
        ? startMY + (y + 36 - startMY) * Math.max(0, (rescueAnimProgress - 0.25) / 0.75)
        : startMY;

    drawMochiCharacter(ctx, mochiX, mochiY, 0.92, danger, status, time, helpText);

    for (const b of marbles) {
      if (!b.draining) drawMarbleBall(ctx, b);
    }
  }
}
