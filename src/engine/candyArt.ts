import { BlockerType, CandyColor, SpecialType } from '../types/game';

export const CANDY_PALETTE: Record<
  CandyColor,
  { light: string; mid: string; dark: string; rim: string; glow: string }
> = {
  red: {
    light: '#ff7b89',
    mid: '#ee1d36',
    dark: '#8f0618',
    rim: '#ffb3bc',
    glow: 'rgba(238, 29, 54, 0.55)',
  },
  orange: {
    light: '#ffd06b',
    mid: '#f97c10',
    dark: '#9c3e00',
    rim: '#ffe4a3',
    glow: 'rgba(249, 124, 16, 0.55)',
  },
  yellow: {
    light: '#fff996',
    mid: '#f5c700',
    dark: '#9e7400',
    rim: '#ffffc7',
    glow: 'rgba(245, 199, 0, 0.55)',
  },
  green: {
    light: '#8aff7a',
    mid: '#1fc728',
    dark: '#0a6912',
    rim: '#c4ffbc',
    glow: 'rgba(31, 199, 40, 0.55)',
  },
  blue: {
    light: '#85e3ff',
    mid: '#1288f7',
    dark: '#053e8a',
    rim: '#c4f2ff',
    glow: 'rgba(18, 136, 247, 0.55)',
  },
  purple: {
    light: '#e59eff',
    mid: '#9d28f0',
    dark: '#4d0887',
    rim: '#f3ccff',
    glow: 'rgba(157, 40, 240, 0.55)',
  },
};

function traceCandyPath(ctx: CanvasRenderingContext2D, color: CandyColor, r: number) {
  ctx.beginPath();
  switch (color) {
    case 'red': {
      // Glossy tilted jelly-bean / heart-bean
      ctx.save();
      ctx.rotate(-0.35);
      ctx.moveTo(-r * 0.65, -r * 0.25);
      ctx.bezierCurveTo(-r * 0.7, -r * 0.95, r * 0.7, -r * 0.95, r * 0.72, -r * 0.1);
      ctx.bezierCurveTo(r * 0.75, r * 0.78, r * 0.15, r * 0.9, 0, r * 0.58);
      ctx.bezierCurveTo(-r * 0.18, r * 0.9, -r * 0.62, r * 0.72, -r * 0.65, -r * 0.25);
      ctx.restore();
      break;
    }
    case 'orange': {
      // Plump horizontal lozenge
      ctx.ellipse(0, 0, r * 0.9, r * 0.7, -0.2, 0, Math.PI * 2);
      break;
    }
    case 'yellow': {
      // Lemon drop / teardrop
      ctx.moveTo(0, -r * 0.88);
      ctx.bezierCurveTo(r * 0.78, -r * 0.3, r * 0.88, r * 0.45, r * 0.45, r * 0.78);
      ctx.bezierCurveTo(r * 0.18, r * 0.95, -r * 0.18, r * 0.95, -r * 0.45, r * 0.78);
      ctx.bezierCurveTo(-r * 0.88, r * 0.45, -r * 0.78, -r * 0.3, 0, -r * 0.88);
      break;
    }
    case 'green': {
      // Rounded emerald square cushion
      const s = r * 0.76;
      ctx.roundRect(-s, -s, s * 2, s * 2, r * 0.36);
      break;
    }
    case 'blue': {
      // Glossy berry sphere
      ctx.arc(0, 0, r * 0.82, 0, Math.PI * 2);
      break;
    }
    case 'purple': {
      // 5-petal star cluster gummy
      const spikes = 5;
      for (let i = 0; i < spikes * 2; i++) {
        const rad = i % 2 === 0 ? r * 0.88 : r * 0.54;
        const ang = (i * Math.PI) / spikes - Math.PI / 2;
        const px = Math.cos(ang) * rad;
        const py = Math.sin(ang) * rad;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      break;
    }
  }
}

export function drawCandyPiece(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: CandyColor,
  special: SpecialType,
  time: number,
  isSelected: boolean = false
) {
  ctx.save();
  ctx.translate(x, y);

  if (isSelected) {
    const pulse = 1 + Math.sin(time * 9) * 0.08;
    ctx.scale(pulse, pulse);
    ctx.beginPath();
    ctx.arc(0, 0, radius * 1.05, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#fff59d';
    ctx.stroke();
  }

  // Special case: Golden Key
  if (special === 'key') {
    drawGoldenKey(ctx, radius, time);
    ctx.restore();
    return;
  }

  // Special case: Rainbow Color Bomb
  if (special === 'rainbow') {
    drawRainbowBomb(ctx, radius, time);
    ctx.restore();
    return;
  }

  const pal = CANDY_PALETTE[color];

  // Bomb wrapper aura behind candy
  if (special === 'bomb') {
    const wrapScale = 1.05 + Math.sin(time * 7) * 0.05;
    ctx.save();
    ctx.scale(wrapScale, wrapScale);
    ctx.beginPath();
    ctx.roundRect(-radius * 0.94, -radius * 0.94, radius * 1.88, radius * 1.88, radius * 0.35);
    ctx.fillStyle = pal.glow;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(255,255,255,0.75)';
    ctx.stroke();
    ctx.restore();
  }

  // Soft drop shadow
  ctx.save();
  ctx.translate(0, radius * 0.14);
  traceCandyPath(ctx, color, radius);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.38)';
  ctx.fill();
  ctx.restore();

  // Main 3D Candy Body
  traceCandyPath(ctx, color, radius);
  const grad = ctx.createRadialGradient(
    -radius * 0.28,
    -radius * 0.32,
    radius * 0.08,
    0,
    0,
    radius * 0.95
  );
  grad.addColorStop(0, pal.light);
  grad.addColorStop(0.55, pal.mid);
  grad.addColorStop(1, pal.dark);
  ctx.fillStyle = grad;
  ctx.fill();

  // Clip stripes inside candy silhouette if striped
  if (special === 'striped_h' || special === 'striped_v') {
    ctx.save();
    traceCandyPath(ctx, color, radius);
    ctx.clip();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    if (special === 'striped_h') {
      for (let sy = -radius * 0.65; sy <= radius * 0.7; sy += radius * 0.42) {
        ctx.fillRect(-radius, sy, radius * 2, radius * 0.16);
      }
    } else {
      for (let sx = -radius * 0.65; sx <= radius * 0.7; sx += radius * 0.42) {
        ctx.fillRect(sx, -radius, radius * 0.16, radius * 2);
      }
    }
    ctx.restore();
  }

  // Rim stroke
  traceCandyPath(ctx, color, radius);
  ctx.lineWidth = 1.6;
  ctx.strokeStyle = pal.rim;
  ctx.stroke();

  // Specular top-left glossy highlight
  ctx.beginPath();
  ctx.ellipse(-radius * 0.24, -radius * 0.3, radius * 0.3, radius * 0.15, -0.45, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.72)';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(radius * 0.22, radius * 0.28, radius * 0.09, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.fill();

  // Bomb core emblem
  if (special === 'bomb') {
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.3, 0, Math.PI * 2);
    ctx.fillStyle = '#fffde7';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#ff6f00';
    ctx.stroke();
  }

  ctx.restore();
}

function drawRainbowBomb(ctx: CanvasRenderingContext2D, r: number, time: number) {
  const pulse = 1 + Math.sin(time * 6) * 0.05;
  ctx.save();
  ctx.scale(pulse, pulse);

  // Outer rainbow halo
  const halo = ctx.createRadialGradient(0, 0, r * 0.4, 0, 0, r * 1.05);
  halo.addColorStop(0, 'rgba(255,255,255,0.8)');
  halo.addColorStop(0.6, 'rgba(255, 105, 180, 0.45)');
  halo.addColorStop(1, 'rgba(56, 189, 248, 0)');
  ctx.beginPath();
  ctx.arc(0, 0, r * 1.05, 0, Math.PI * 2);
  ctx.fillStyle = halo;
  ctx.fill();

  // Rich chocolate sphere
  const sphere = ctx.createRadialGradient(-r * 0.25, -r * 0.28, r * 0.08, 0, 0, r * 0.85);
  sphere.addColorStop(0, '#6d4c41');
  sphere.addColorStop(0.55, '#3e2723');
  sphere.addColorStop(1, '#1b0f0d');
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.82, 0, Math.PI * 2);
  ctx.fillStyle = sphere;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#ffecb3';
  ctx.stroke();

  // Colorful candy sprinkles
  const sprinkleColors = ['#ff3b5c', '#ffbe0b', '#38b000', '#00b4d8', '#c77dff', '#ff7b00'];
  for (let i = 0; i < 12; i++) {
    const ang = (i / 12) * Math.PI * 2 + time * 0.8;
    const dist = (i % 2 === 0 ? 0.48 : 0.24) * r;
    const sx = Math.cos(ang) * dist;
    const sy = Math.sin(ang) * dist;
    ctx.beginPath();
    ctx.arc(sx, sy, r * 0.13, 0, Math.PI * 2);
    ctx.fillStyle = sprinkleColors[i % sprinkleColors.length];
    ctx.fill();
  }

  // Specular shine
  ctx.beginPath();
  ctx.ellipse(-r * 0.26, -r * 0.32, r * 0.24, r * 0.12, -0.5, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.65)';
  ctx.fill();

  ctx.restore();
}

function drawGoldenKey(ctx: CanvasRenderingContext2D, r: number, time: number) {
  const bob = Math.sin(time * 5) * 2.2;
  ctx.save();
  ctx.translate(0, bob);

  // Golden aura
  const aura = ctx.createRadialGradient(0, 0, r * 0.2, 0, 0, r * 1.05);
  aura.addColorStop(0, 'rgba(255, 238, 88, 0.65)');
  aura.addColorStop(1, 'rgba(255, 193, 7, 0)');
  ctx.beginPath();
  ctx.arc(0, 0, r * 1.05, 0, Math.PI * 2);
  ctx.fillStyle = aura;
  ctx.fill();

  ctx.rotate(-0.45);
  const gold = ctx.createLinearGradient(-r, -r, r, r);
  gold.addColorStop(0, '#fff59d');
  gold.addColorStop(0.45, '#ffc107');
  gold.addColorStop(1, '#b26a00');

  ctx.fillStyle = gold;
  ctx.strokeStyle = '#5d3400';
  ctx.lineWidth = 2;

  // Key shaft & teeth
  ctx.beginPath();
  ctx.roundRect(-r * 0.14, -r * 0.15, r * 0.28, r * 0.98, 4);
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.roundRect(r * 0.08, r * 0.36, r * 0.32, r * 0.16, 2);
  ctx.roundRect(r * 0.08, r * 0.58, r * 0.24, r * 0.16, 2);
  ctx.fill();
  ctx.stroke();

  // Ornate Bow (top ring)
  ctx.beginPath();
  ctx.arc(0, -r * 0.38, r * 0.42, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Ruby gem in bow
  ctx.beginPath();
  ctx.arc(0, -r * 0.38, r * 0.17, 0, Math.PI * 2);
  ctx.fillStyle = '#ff1744';
  ctx.fill();
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  ctx.restore();
}

export function drawCellUnderlayBlocker(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  cellSize: number,
  blocker: BlockerType
) {
  const half = cellSize * 0.46;

  if (blocker === 'crate_1' || blocker === 'crate_2') {
    ctx.save();
    ctx.translate(x, y);
    const wood = ctx.createLinearGradient(-half, -half, half, half);
    if (blocker === 'crate_2') {
      wood.addColorStop(0, '#a16207');
      wood.addColorStop(0.5, '#713f12');
      wood.addColorStop(1, '#422006');
    } else {
      wood.addColorStop(0, '#eab308');
      wood.addColorStop(0.5, '#ca8a04');
      wood.addColorStop(1, '#854d0e');
    }
    ctx.beginPath();
    ctx.roundRect(-half, -half, half * 2, half * 2, 8);
    ctx.fillStyle = wood;
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = blocker === 'crate_2' ? '#cbd5e1' : '#fef08a';
    ctx.stroke();

    // Diagonal brace planks
    ctx.beginPath();
    ctx.moveTo(-half + 6, -half + 6);
    ctx.lineTo(half - 6, half - 6);
    ctx.moveTo(half - 6, -half + 6);
    ctx.lineTo(-half + 6, half - 6);
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'rgba(66, 32, 6, 0.65)';
    ctx.stroke();

    if (blocker === 'crate_2') {
      // Iron corner studs
      ctx.fillStyle = '#e2e8f0';
      for (const sx of [-half + 7, half - 7]) {
        for (const sy of [-half + 7, half - 7]) {
          ctx.beginPath();
          ctx.arc(sx, sy, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    ctx.restore();
  }
}

export function drawCellOverlayBlocker(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  cellSize: number,
  blocker: BlockerType,
  time: number
) {
  const half = cellSize * 0.45;
  if (blocker === 'ice_1' || blocker === 'ice_2') {
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.roundRect(-half, -half, half * 2, half * 2, 9);
    ctx.fillStyle =
      blocker === 'ice_2' ? 'rgba(125, 211, 252, 0.48)' : 'rgba(186, 230, 253, 0.28)';
    ctx.fill();
    ctx.lineWidth = blocker === 'ice_2' ? 3 : 1.8;
    ctx.strokeStyle = 'rgba(224, 242, 254, 0.9)';
    ctx.stroke();

    // Frost shine lines
    ctx.beginPath();
    ctx.moveTo(-half + 8, -half + 14);
    ctx.lineTo(-half + 18, -half + 6);
    ctx.moveTo(half - 18, half - 6);
    ctx.lineTo(half - 7, half - 17);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  } else if (blocker === 'chain') {
    ctx.save();
    ctx.translate(x, y);
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 4.5;
    ctx.beginPath();
    ctx.moveTo(-half + 4, -half + 4);
    ctx.lineTo(half - 4, half - 4);
    ctx.moveTo(half - 4, -half + 4);
    ctx.lineTo(-half + 4, half - 4);
    ctx.stroke();

    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1.6;
    ctx.stroke();

    // Small center padlock
    ctx.beginPath();
    ctx.roundRect(-7, -5, 14, 12, 3);
    ctx.fillStyle = '#fbbf24';
    ctx.fill();
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
  } else if (blocker === 'slime') {
    ctx.save();
    ctx.translate(x, y);
    const pulse = Math.sin(time * 5 + x) * 2;
    ctx.beginPath();
    ctx.arc(0, 0, half * 0.88 + pulse * 0.3, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(74, 222, 128, 0.52)';
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#86efac';
    ctx.stroke();

    // Slime bubbles
    ctx.fillStyle = 'rgba(220, 252, 231, 0.8)';
    ctx.beginPath();
    ctx.arc(-8, -7, 4, 0, Math.PI * 2);
    ctx.arc(9, 6, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

export function drawHintHand(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  time: number
) {
  ctx.save();
  ctx.translate(x + 8, y + 12);
  const tapScale = 1 - Math.abs(Math.sin(time * 4.5)) * 0.09;
  ctx.scale(tapScale, tapScale);
  ctx.rotate(-0.38);

  // Drop shadow
  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  ctx.beginPath();
  ctx.roundRect(-8, -16, 22, 30, 9);
  ctx.fill();

  // Cartoon 3D Cream Hand (like storyboard cursor!)
  const skin = ctx.createLinearGradient(-10, -24, 14, 18);
  skin.addColorStop(0, '#ffe4d1');
  skin.addColorStop(1, '#f4b590');
  ctx.fillStyle = skin;
  ctx.strokeStyle = '#8c4a27';
  ctx.lineWidth = 2.2;

  // Index finger pointing up-left
  ctx.beginPath();
  ctx.roundRect(-6, -28, 11, 24, 5.5);
  ctx.fill();
  ctx.stroke();

  // Palm & folded fingers
  ctx.beginPath();
  ctx.roundRect(-10, -10, 25, 23, 9);
  ctx.fill();
  ctx.stroke();

  // Thumb
  ctx.beginPath();
  ctx.ellipse(-12, 0, 6, 9, -0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}
