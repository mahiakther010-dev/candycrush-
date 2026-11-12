import * as THREE from 'three';

export type SerpentSkinVariant = 'venom_naga' | 'river_gharial' | 'frost_wyrm' | 'boss_dragon';

export interface CharacterTextureSet {
  mochiIrisTex: THREE.CanvasTexture;
  mochiSkinTex: THREE.CanvasTexture;
  mochiHairTex: THREE.CanvasTexture;
  mochiHairNormal: THREE.CanvasTexture;
  mochiDressTex: THREE.CanvasTexture;
  reptileEyeGoldTex: THREE.CanvasTexture;
  reptileEyeIceTex: THREE.CanvasTexture;
  reptileEyeBossTex: THREE.CanvasTexture;
  magmaCracksTex: THREE.CanvasTexture;
  serpentSkins: Record<SerpentSkinVariant, THREE.CanvasTexture>;
}

let cachedCharTex: CharacterTextureSet | null = null;

function createCanvas(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d')!;
  return [c, ctx];
}

/**
 * 512x512 Vivid Electric Sapphire-Turquoise Pixar Iris Texture!
 * Creates striking complementary contrast against Mochi's warm peach skin & coral-berry hair.
 */
function buildMochiIrisTexture(): THREE.CanvasTexture {
  const S = 512;
  const [c, ctx] = createCanvas(S, S);
  const cx = S / 2;
  const cy = S / 2;

  // Pure crisp white sclera
  const scleraGrad = ctx.createRadialGradient(cx, cy, S * 0.34, cx, cy, S * 0.5);
  scleraGrad.addColorStop(0, '#ffffff');
  scleraGrad.addColorStop(0.86, '#f8fbff');
  scleraGrad.addColorStop(1, '#dbeafe');
  ctx.fillStyle = scleraGrad;
  ctx.fillRect(0, 0, S, S);

  const irisR = S * 0.35;

  // Vivid Cobalt-Sapphire to Electric Cyan Iris!
  const limbal = ctx.createRadialGradient(cx, cy, irisR * 0.1, cx, cy, irisR);
  limbal.addColorStop(0, '#0a1128');
  limbal.addColorStop(0.42, '#0077b6');
  limbal.addColorStop(0.76, '#00b4d8');
  limbal.addColorStop(0.91, '#023e8a');
  limbal.addColorStop(1, '#03045e');
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, irisR, 0, Math.PI * 2);
  ctx.clip();
  ctx.fillStyle = limbal;
  ctx.fillRect(0, 0, S, S);

  // Bright Aqua-Mint lower crescent pop
  const lowerGlow = ctx.createRadialGradient(cx, cy + irisR * 0.4, 4, cx, cy + irisR * 0.35, irisR * 0.72);
  lowerGlow.addColorStop(0, 'rgba(114, 239, 221, 0.95)');
  lowerGlow.addColorStop(0.5, 'rgba(0, 245, 212, 0.55)');
  lowerGlow.addColorStop(1, 'rgba(0, 187, 249, 0)');
  ctx.fillStyle = lowerGlow;
  ctx.fillRect(0, 0, S, S);

  // Upper eyelid crisp shade
  const upperShade = ctx.createLinearGradient(0, cy - irisR, 0, cy + irisR * 0.1);
  upperShade.addColorStop(0, 'rgba(3, 4, 94, 0.82)');
  upperShade.addColorStop(0.55, 'rgba(2, 62, 138, 0.28)');
  upperShade.addColorStop(1, 'rgba(2, 62, 138, 0)');
  ctx.fillStyle = upperShade;
  ctx.fillRect(0, 0, S, S);

  // Crisp turquoise-gold radial iris fibers
  ctx.strokeStyle = 'rgba(144, 224, 239, 0.42)';
  ctx.lineWidth = 2.4;
  for (let i = 0; i < 84; i++) {
    const ang = (i / 84) * Math.PI * 2;
    const r0 = irisR * (0.35 + (i % 3) * 0.04);
    const r1 = irisR * (0.87 - (i % 4) * 0.03);
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(ang) * r0, cy + Math.sin(ang) * r0);
    ctx.lineTo(cx + Math.cos(ang) * r1, cy + Math.sin(ang) * r1);
    ctx.stroke();
  }

  // Deep ink pupil
  ctx.fillStyle = '#050816';
  ctx.beginPath();
  ctx.arc(cx, cy, irisR * 0.39, 0, Math.PI * 2);
  ctx.fill();

  // Razor-sharp studio catchlights
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(cx - irisR * 0.34, cy - irisR * 0.34, irisR * 0.22, irisR * 0.17, -0.45, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cx + irisR * 0.36, cy + irisR * 0.34, irisR * 0.1, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Clean, Bright Creamy-Peach Skin Texture with Vivid Coral-Pink Cheek Blush.
 */
function buildMochiSkinTexture(): THREE.CanvasTexture {
  const S = 512;
  const [c, ctx] = createCanvas(S, S);
  const baseGrad = ctx.createLinearGradient(0, 0, 0, S);
  baseGrad.addColorStop(0, '#fff0e5');
  baseGrad.addColorStop(0.55, '#ffe3d1');
  baseGrad.addColorStop(1, '#ffd2b8');
  ctx.fillStyle = baseGrad;
  ctx.fillRect(0, 0, S, S);

  for (const bx of [S * 0.36, S * 0.64]) {
    const blush = ctx.createRadialGradient(bx, S * 0.56, 4, bx, S * 0.56, S * 0.115);
    blush.addColorStop(0, 'rgba(255, 77, 121, 0.62)');
    blush.addColorStop(0.6, 'rgba(255, 107, 149, 0.26)');
    blush.addColorStop(1, 'rgba(255, 107, 149, 0)');
    ctx.fillStyle = blush;
    ctx.fillRect(0, 0, S, S);
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Vibrant Sunset-Ruby to Warm Tangerine-Coral Silk Hair Texture & Strand Normal Map!
 */
function buildMochiHairTextures(): { albedo: THREE.CanvasTexture; normal: THREE.CanvasTexture } {
  const S = 512;
  const [c, ctx] = createCanvas(S, S);
  const grad = ctx.createLinearGradient(0, 0, 0, S);
  grad.addColorStop(0, '#a4133c');
  grad.addColorStop(0.32, '#e01e5a');
  grad.addColorStop(0.7, '#ff4d6d');
  grad.addColorStop(1, '#ff9e00'); // Vibrant warm golden-tangerine tips!
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, S, S);

  for (let x = 0; x < S; x += 2) {
    const lum = Math.sin(x * 0.37) * 0.5 + Math.cos(x * 0.13) * 0.5;
    ctx.fillStyle = lum > 0 ? `rgba(255,245,235,${0.12 * lum})` : `rgba(89,13,34,${-0.12 * lum})`;
    ctx.fillRect(x, 0, 2, S);
  }

  const [nc, nctx] = createCanvas(S, S);
  const img = nctx.createImageData(S, S);
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const dHdx = Math.cos(x * 0.45) * 0.65 + Math.cos(x * 0.17) * 0.35;
      const nx = -dHdx * 0.5;
      const ny = 0.04 * Math.sin(y * 0.1);
      const nz = Math.sqrt(Math.max(0.1, 1 - nx * nx - ny * ny));
      const idx = (y * S + x) * 4;
      img.data[idx] = Math.round((nx * 0.5 + 0.5) * 255);
      img.data[idx + 1] = Math.round((ny * 0.5 + 0.5) * 255);
      img.data[idx + 2] = Math.round((nz * 0.5 + 0.5) * 255);
      img.data[idx + 3] = 255;
    }
  }
  nctx.putImageData(img, 0, 0);

  const albedo = new THREE.CanvasTexture(c);
  albedo.colorSpace = THREE.SRGBColorSpace;
  albedo.wrapS = albedo.wrapT = THREE.RepeatWrapping;

  const normal = new THREE.CanvasTexture(nc);
  normal.wrapS = normal.wrapT = THREE.RepeatWrapping;
  return { albedo, normal };
}

/**
 * Eye-Catching Royal Cobalt-Turquoise & Magenta-Gold Embroidered Dress Texture!
 * Pairing Royal Cyan-Blue skirt with Mochi's Sunset-Coral hair & Sunny Gold trim creates instant color pop!
 */
function buildMochiDressTexture(): THREE.CanvasTexture {
  const S = 512;
  const [c, ctx] = createCanvas(S, S);
  const grad = ctx.createLinearGradient(0, 0, 0, S);
  grad.addColorStop(0, '#00bbf9');
  grad.addColorStop(0.58, '#0077b6');
  grad.addColorStop(0.8, '#023e8a');
  grad.addColorStop(0.85, '#ffcc00');
  grad.addColorStop(0.92, '#ffee88');
  grad.addColorStop(1, '#ff0a54');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, S, S);

  ctx.fillStyle = '#ffd60a';
  for (let x = 16; x < S; x += 32) {
    ctx.beginPath();
    ctx.arc(x, S * 0.78, 6.5, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  return tex;
}

/**
 * High-Contrast Vivid Reptile Eye Texture (Crisp painted colors, zero blurry bloom).
 */
function buildReptileEyeTexture(irisTop: string, irisBot: string, centerHex: string): THREE.CanvasTexture {
  const S = 256;
  const [c, ctx] = createCanvas(S, S);
  const cx = S / 2;
  const cy = S / 2;

  const rad = ctx.createRadialGradient(cx, cy, 8, cx, cy, S * 0.5);
  rad.addColorStop(0, centerHex);
  rad.addColorStop(0.58, irisTop);
  rad.addColorStop(0.9, irisBot);
  rad.addColorStop(1, '#0f172a');
  ctx.fillStyle = rad;
  ctx.fillRect(0, 0, S, S);

  ctx.strokeStyle = 'rgba(255,255,255,0.38)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 40; i++) {
    const a = (i / 40) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * 18, cy + Math.sin(a) * 18);
    ctx.lineTo(cx + Math.cos(a) * 112, cy + Math.sin(a) * 112);
    ctx.stroke();
  }

  ctx.fillStyle = '#05050a';
  ctx.beginPath();
  ctx.ellipse(cx + 10, cy, 15, 92, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(cx - 26, cy - 34, 22, 14, -0.4, 0, Math.PI * 2);
  ctx.fill();

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Ultra-Vibrant, Eye-Catching Tropical & Fantasy Monster Scale Combinations!
 */
function buildSerpentBodyTexture(variant: SerpentSkinVariant): THREE.CanvasTexture {
  const W = 512;
  const H = 512;
  const [c, ctx] = createCanvas(W, H);

  const palettes: Record<
    SerpentSkinVariant,
    { dorsalA: string; dorsalB: string; ridge: string; crevice: string; bellyA: string; bellyB: string }
  > = {
    // Electric Emerald-Lime + Hot Crimson Dorsal Diamonds + Sunny Canary-Gold Belly!
    venom_naga: {
      dorsalA: '#00e640',
      dorsalB: '#00a832',
      ridge: '#ff1744',
      crevice: '#064e20',
      bellyA: '#ffe600',
      bellyB: '#ff9500',
    },
    // Tropical Electric Cyan-Teal + Bright Tangerine-Orange Diamonds & Gold Belly!
    river_gharial: {
      dorsalA: '#00e5ff',
      dorsalB: '#0097a7',
      ridge: '#ff6d00',
      crevice: '#004d5a',
      bellyA: '#ffea00',
      bellyB: '#ff9100',
    },
    // Vivid Cobalt-Sapphire + Mint-Aqua + Golden-Coral Crest!
    frost_wyrm: {
      dorsalA: '#00b4ff',
      dorsalB: '#0062ff',
      ridge: '#00f5d4',
      crevice: '#0a2463',
      bellyA: '#ffffff',
      bellyB: '#72efdd',
    },
    // Royal Violet-Purple + Blazing Hot-Magenta & Flame-Gold Belly!
    boss_dragon: {
      dorsalA: '#9d4edd',
      dorsalB: '#5a189a',
      ridge: '#ff006e',
      crevice: '#240046',
      bellyA: '#ffd60a',
      bellyB: '#ff7b00',
    },
  };

  const pal = palettes[variant];
  ctx.fillStyle = pal.crevice;
  ctx.fillRect(0, 0, W, H);

  const cols = 18;
  const rows = 28;
  const cw = W / cols;
  const ch = H / rows;

  for (let r = -1; r <= rows; r++) {
    for (let col = -1; col <= cols; col++) {
      const sx = (col + (r % 2) * 0.5) * cw;
      const sy = r * ch;

      const uNorm = ((sx / W) % 1 + 1) % 1;
      const distFromSpine = Math.min(uNorm, 1 - uNorm);
      const isDiamond = distFromSpine < 0.13 && r % 2 === 0;

      const g = ctx.createRadialGradient(sx, sy - ch * 0.15, 1, sx, sy, cw * 0.64);
      g.addColorStop(0, isDiamond ? pal.ridge : pal.dorsalA);
      g.addColorStop(0.72, isDiamond ? '#c9184a' : pal.dorsalB);
      g.addColorStop(1, pal.crevice);

      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(sx, sy - ch * 0.55);
      ctx.quadraticCurveTo(sx + cw * 0.55, sy, sx, sy + ch * 0.57);
      ctx.quadraticCurveTo(sx - cw * 0.55, sy, sx, sy - ch * 0.55);
      ctx.fill();
    }
  }

  // Ribbed Sunny-Gold Ventral Belly Scutes
  const bellyLeft = W * 0.37;
  const bellyWidth = W * 0.26;
  const scuteRows = 32;
  const sh = H / scuteRows;
  for (let r = 0; r < scuteRows; r++) {
    const y = r * sh;
    const bg = ctx.createLinearGradient(bellyLeft, y, bellyLeft + bellyWidth, y + sh);
    bg.addColorStop(0, pal.bellyB);
    bg.addColorStop(0.22, pal.bellyA);
    bg.addColorStop(0.78, pal.bellyA);
    bg.addColorStop(1, pal.bellyB);
    ctx.fillStyle = bg;
    ctx.strokeStyle = pal.crevice;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.roundRect(bellyLeft, y + 1, bellyWidth, sh - 2, 6);
    ctx.fill();
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

/**
 * Crisp Royal Cobalt-Slate Stone + Vivid Tangerine-Gold Veins (Painted contrast, zero bloom blur).
 */
function buildMagmaCracksTexture(): THREE.CanvasTexture {
  const S = 512;
  const [c, ctx] = createCanvas(S, S);
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 0, S, S);

  for (let i = 0; i < 65; i++) {
    const x = (i * 97) % S;
    const y = (i * 151) % S;
    const r = 26 + (i % 5) * 11;
    const g = ctx.createRadialGradient(x, y, 4, x, y, r);
    g.addColorStop(0, '#475569');
    g.addColorStop(0.76, '#334155');
    g.addColorStop(1, '#ff6d00');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.strokeStyle = '#ffd60a';
  ctx.lineWidth = 4.5;
  for (let k = 0; k < 16; k++) {
    ctx.beginPath();
    let vx = (k * 53) % S;
    let vy = 0;
    ctx.moveTo(vx, vy);
    for (let step = 0; step < 8; step++) {
      vx += Math.sin(k * 2.1 + step) * 34;
      vy += S / 8;
      ctx.lineTo(vx, vy);
    }
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

export function getCharacterTextures(): CharacterTextureSet {
  if (cachedCharTex) return cachedCharTex;
  const hair = buildMochiHairTextures();
  cachedCharTex = {
    mochiIrisTex: buildMochiIrisTexture(),
    mochiSkinTex: buildMochiSkinTexture(),
    mochiHairTex: hair.albedo,
    mochiHairNormal: hair.normal,
    mochiDressTex: buildMochiDressTexture(),
    reptileEyeGoldTex: buildReptileEyeTexture('#ff9e00', '#e63946', '#ffee32'),
    reptileEyeIceTex: buildReptileEyeTexture('#ffbe0b', '#fb5607', '#fff3b0'),
    reptileEyeBossTex: buildReptileEyeTexture('#ff006e', '#8338ec', '#ffbe0b'),
    magmaCracksTex: buildMagmaCracksTexture(),
    serpentSkins: {
      venom_naga: buildSerpentBodyTexture('venom_naga'),
      river_gharial: buildSerpentBodyTexture('river_gharial'),
      frost_wyrm: buildSerpentBodyTexture('frost_wyrm'),
      boss_dragon: buildSerpentBodyTexture('boss_dragon'),
    },
  };
  return cachedCharTex;
}
