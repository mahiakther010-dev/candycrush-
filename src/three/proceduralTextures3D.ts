import * as THREE from 'three';

export interface ProceduralPBRMaps {
  citrusNormal: THREE.CanvasTexture;
  reptileScaleNormal: THREE.CanvasTexture;
  woodNormal: THREE.CanvasTexture;
  iceCrackNormal: THREE.CanvasTexture;
  liquidWaveNormal: THREE.CanvasTexture;
  stoneBrickNormal: THREE.CanvasTexture;
}

let cachedMaps: ProceduralPBRMaps | null = null;

/**
 * Converts a grayscale height canvas into a tangent-space RGB normal map CanvasTexture
 * so 3D candies, reptile scales, wood crates, ice, and lava catch photorealistic micro-specular highlights.
 */
function heightCanvasToNormalTexture(
  heightCanvas: HTMLCanvasElement,
  strength: number = 2.4,
  repeatX: number = 1,
  repeatY: number = 1
): THREE.CanvasTexture {
  const w = heightCanvas.width;
  const h = heightCanvas.height;
  const srcCtx = heightCanvas.getContext('2d')!;
  const src = srcCtx.getImageData(0, 0, w, h).data;

  const outCanvas = document.createElement('canvas');
  outCanvas.width = w;
  outCanvas.height = h;
  const outCtx = outCanvas.getContext('2d')!;
  const outImg = outCtx.createImageData(w, h);
  const dst = outImg.data;

  const sample = (x: number, y: number) => {
    const wx = ((x % w) + w) % w;
    const wy = ((y % h) + h) % h;
    return src[(wy * w + wx) * 4] / 255;
  };

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const hL = sample(x - 1, y);
      const hR = sample(x + 1, y);
      const hU = sample(x, y - 1);
      const hD = sample(x, y + 1);

      const dx = (hL - hR) * strength;
      const dy = (hU - hD) * strength;
      const dz = 1.0;
      const invLen = 1 / Math.sqrt(dx * dx + dy * dy + dz * dz);

      const idx = (y * w + x) * 4;
      dst[idx] = Math.round((dx * invLen * 0.5 + 0.5) * 255);
      dst[idx + 1] = Math.round((dy * invLen * 0.5 + 0.5) * 255);
      dst[idx + 2] = Math.round((dz * invLen * 0.5 + 0.5) * 255);
      dst[idx + 3] = 255;
    }
  }

  outCtx.putImageData(outImg, 0, 0);
  const tex = new THREE.CanvasTexture(outCanvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeatX, repeatY);
  tex.needsUpdate = true;
  return tex;
}

function makeCanvas(size = 192): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  return [c, c.getContext('2d')!];
}

export function getProceduralPBRMaps(): ProceduralPBRMaps {
  if (cachedMaps) return cachedMaps;

  // 1. Citrus / Sugar Glaze Micro-Pore Dimples
  const [citC, citCtx] = makeCanvas(192);
  citCtx.fillStyle = '#c8c8c8';
  citCtx.fillRect(0, 0, 192, 192);
  for (let i = 0; i < 420; i++) {
    const x = (Math.sin(i * 127.1) * 0.5 + 0.5) * 192;
    const y = (Math.cos(i * 311.7) * 0.5 + 0.5) * 192;
    const r = 2 + (i % 4);
    const g = citCtx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, '#555555');
    g.addColorStop(1, '#c8c8c8');
    citCtx.fillStyle = g;
    citCtx.beginPath();
    citCtx.arc(x, y, r, 0, Math.PI * 2);
    citCtx.fill();
  }

  // 2. Reptile Diamond Scales (for realistic 3D Serpent / Boss Dragon)
  const [repC, repCtx] = makeCanvas(192);
  repCtx.fillStyle = '#303030';
  repCtx.fillRect(0, 0, 192, 192);
  const rows = 12;
  const cols = 12;
  const cw = 192 / cols;
  const ch = 192 / rows;
  for (let r = -1; r <= rows; r++) {
    for (let c = -1; c <= cols; c++) {
      const cx = c * cw + (r % 2 === 0 ? 0 : cw * 0.5);
      const cy = r * ch;
      const g = repCtx.createRadialGradient(cx, cy - ch * 0.12, 1, cx, cy, cw * 0.65);
      g.addColorStop(0, '#ffffff');
      g.addColorStop(0.7, '#9a9a9a');
      g.addColorStop(1, '#242424');
      repCtx.fillStyle = g;
      repCtx.beginPath();
      repCtx.ellipse(cx, cy, cw * 0.52, ch * 0.58, 0, 0, Math.PI * 2);
      repCtx.fill();
    }
  }

  // 3. Split-Bamboo & Timber Wood Grain
  const [wdC, wdCtx] = makeCanvas(192);
  wdCtx.fillStyle = '#888888';
  wdCtx.fillRect(0, 0, 192, 192);
  for (let y = 0; y < 192; y++) {
    const v = 125 + Math.sin(y * 0.42) * 38 + Math.sin(y * 1.7) * 14;
    wdCtx.fillStyle = `rgb(${v},${v},${v})`;
    wdCtx.fillRect(0, y, 192, 1);
  }
  wdCtx.strokeStyle = '#333333';
  wdCtx.lineWidth = 4;
  for (const py of [48, 96, 144]) {
    wdCtx.beginPath();
    wdCtx.moveTo(0, py);
    wdCtx.lineTo(192, py);
    wdCtx.stroke();
  }

  // 4. Glacier Cracked Ice Facets
  const [iceC, iceCtx] = makeCanvas(192);
  iceCtx.fillStyle = '#d8d8d8';
  iceCtx.fillRect(0, 0, 192, 192);
  iceCtx.strokeStyle = '#404040';
  iceCtx.lineWidth = 2.5;
  for (let i = 0; i < 26; i++) {
    let x = ((i * 53) % 192);
    let y = ((i * 97) % 192);
    iceCtx.beginPath();
    iceCtx.moveTo(x, y);
    for (let seg = 0; seg < 4; seg++) {
      x += Math.cos(i * 1.7 + seg) * 28;
      y += Math.sin(i * 2.3 + seg) * 28;
      iceCtx.lineTo(x, y);
    }
    iceCtx.stroke();
  }

  // 5. Liquid Caramel Lava / Monsoon Water Ripples
  const [liqC, liqCtx] = makeCanvas(192);
  const img = liqCtx.createImageData(192, 192);
  for (let y = 0; y < 192; y++) {
    for (let x = 0; x < 192; x++) {
      const u = (x / 192) * Math.PI * 2;
      const v = (y / 192) * Math.PI * 2;
      const wave =
        Math.sin(u * 3 + Math.cos(v * 2)) * 0.35 +
        Math.cos(v * 4 - Math.sin(u * 3)) * 0.35 +
        Math.sin((u + v) * 5) * 0.18;
      const val = Math.round((wave * 0.5 + 0.5) * 255);
      const idx = (y * 192 + x) * 4;
      img.data[idx] = val;
      img.data[idx + 1] = val;
      img.data[idx + 2] = val;
      img.data[idx + 3] = 255;
    }
  }
  liqCtx.putImageData(img, 0, 0);

  // 6. Carved Stone / Terracotta Architectural Brick Relief
  const [stC, stCtx] = makeCanvas(192);
  stCtx.fillStyle = '#b8b8b8';
  stCtx.fillRect(0, 0, 192, 192);
  stCtx.strokeStyle = '#3a3a3a';
  stCtx.lineWidth = 4;
  const bh = 32;
  const bw = 64;
  for (let r = 0; r < 6; r++) {
    const y = r * bh;
    stCtx.beginPath();
    stCtx.moveTo(0, y);
    stCtx.lineTo(192, y);
    stCtx.stroke();
    const offset = (r % 2) * (bw * 0.5);
    for (let c = 0; c < 4; c++) {
      const x = (c * bw + offset) % 192;
      stCtx.beginPath();
      stCtx.moveTo(x, y);
      stCtx.lineTo(x, y + bh);
      stCtx.stroke();
    }
  }

  cachedMaps = {
    citrusNormal: heightCanvasToNormalTexture(citC, 1.35, 2, 2),
    reptileScaleNormal: heightCanvasToNormalTexture(repC, 2.6, 2, 2),
    woodNormal: heightCanvasToNormalTexture(wdC, 2.1, 1, 1),
    iceCrackNormal: heightCanvasToNormalTexture(iceC, 2.4, 1, 1),
    liquidWaveNormal: heightCanvasToNormalTexture(liqC, 2.8, 3, 1),
    stoneBrickNormal: heightCanvasToNormalTexture(stC, 2.5, 4, 5),
  };

  return cachedMaps;
}
