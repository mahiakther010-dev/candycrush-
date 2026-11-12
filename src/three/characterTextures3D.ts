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
 * Vibrant Sparkling Turquoise-Sapphire Pixar/Anime Iris Texture!
 * Contrasts dramatically against Mochi's warm chestnut-honey hair and coral-rose ribbons.
 */
function buildMochiIrisTexture(): THREE.CanvasTexture {
  const S = 512;
  const [c, ctx] = createCanvas(S, S);
  const cx = S / 2;
  const cy = S / 2;

  // Crisp pure white sclera
  const scleraGrad = ctx.createRadialGradient(cx, cy, S * 0.34, cx, cy, S * 0.5);
  scleraGrad.addColorStop(0, '#ffffff');
  scleraGrad.addColorStop(0.85, '#f8fafc');
  scleraGrad.addColorStop(1, '#cbd5e1');
  ctx.fillStyle = scleraGrad;
  ctx.fillRect(0, 0, S, S);

  const irisR = S * 0.35;

  // Deep Cobalt-Sapphire to Electric Cyan-Turquoise Iris
  const limbal = ctx.createRadialGradient(cx, cy, irisR * 0.1, cx, cy, irisR);
  limbal.addColorStop(0, '#082f49');
  limbal.addColorStop(0.42, '#0284c7');
  limbal.addColorStop(0.76, '#00e5ff');
  limbal.addColorStop(0.91, '#1d4ed8');
  limbal.addColorStop(1, '#0f172a');
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, irisR, 0, Math.PI * 2);
  ctx.clip();
  ctx.fillStyle = limbal;
  ctx.fillRect(0, 0, S, S);

  // Lower sunlit aqua-emerald crescent
  const lowerGlow = ctx.createRadialGradient(cx, cy + irisR * 0.42, 4, cx, cy + irisR * 0.35, irisR * 0.72);
  lowerGlow.addColorStop(0, 'rgba(103, 255, 232, 0.95)');
  lowerGlow.addColorStop(0.5, 'rgba(0, 212, 255, 0.55)');
  lowerGlow.addColorStop(1, 'rgba(0, 212, 255, 0)');
  ctx.fillStyle = lowerGlow;
  ctx.fillRect(0, 0, S, S);

  // Upper lash shadow
  const upperShade = ctx.createLinearGradient(0, cy - irisR, 0, cy + irisR * 0.12);
  upperShade.addColorStop(0, 'rgba(15, 23, 42, 0.82)');
  upperShade.addColorStop(0.55, 'rgba(30, 58, 138, 0.28)');
  upperShade.addColorStop(1, 'rgba(30, 58, 138, 0)');
  ctx.fillStyle = upperShade;
  ctx.fillRect(0, 0, S, S);

  // Crisp radial iris fibers
  ctx.strokeStyle = 'rgba(224, 252, 255, 0.34)';
  ctx.lineWidth = 2.2;
  for (let i = 0; i < 84; i++) {
    const ang = (i / 84) * Math.PI * 2;
    const r0 = irisR * (0.34 + (i % 3) * 0.04);
    const r1 = irisR * (0.88 - (i % 4) * 0.03);
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(ang) * r0, cy + Math.sin(ang) * r0);
    ctx.lineTo(cx + Math.cos(ang) * r1, cy + Math.sin(ang) * r1);
    ctx.stroke();
  }

  // Jet-black crisp pupil
  ctx.fillStyle = '#050814';
  ctx.beginPath();
  ctx.arc(cx, cy, irisR * 0.39, 0, Math.PI * 2);
  ctx.fill();

  // Sharp studio catchlights
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
 * Warm Sunlit Peach-Cream Skin Texture with vivid rosy-coral cheeks (zero glow wash).
 */
function buildMochiSkinTexture(): THREE.CanvasTexture {
  const S = 512;
  const [c, ctx] = createCanvas(S, S);
  const baseGrad = ctx.createLinearGradient(0, 0, 0, S);
  baseGrad.addColorStop(0, '#ffefe2');
  baseGrad.addColorStop(0.55, '#ffe4cf');
  baseGrad.addColorStop(1, '#ffd2b3');
  ctx.fillStyle = baseGrad;
  ctx.fillRect(0, 0, S, S);

  for (const bx of [S * 0.36, S * 0.64]) {
    const blush = ctx.createRadialGradient(bx, S * 0.56, 4, bx, S * 0.56, S * 0.115);
    blush.addColorStop(0, 'rgba(255, 77, 109, 0.62)');
    blush.addColorStop(0.6, 'rgba(255, 117, 143, 0.26)');
    blush.addColorStop(1, 'rgba(255, 117, 143, 0)');
    ctx.fillStyle = blush;
    ctx.fillRect(0, 0, S, S);
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Rich Warm Espresso-Chestnut to Golden-Caramel Amber Silk Hair!
 * Separates clearly from Mochi's Royal-Turquoise dress and Crimson-Magenta ribbons!
 */
function buildMochiHairTextures(): { albedo: THREE.CanvasTexture; normal: THREE.CanvasTexture } {
  const S = 512;
  const [c, ctx] = createCanvas(S, S);
  const grad = ctx.createLinearGradient(0, 0, 0, S);
  grad.addColorStop(0, '#2b1108');
  grad.addColorStop(0.32, '#5c2410');
  grad.addColorStop(0.7, '#9c4215');
  grad.addColorStop(1, '#d97706');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, S, S);

  for (let x = 0; x < S; x += 2) {
    const lum = Math.sin(x * 0.37) * 0.5 + Math.cos(x * 0.13) * 0.5;
    ctx.fillStyle = lum > 0 ? `rgba(255, 210, 140, ${0.14 * lum})` : `rgba(25, 8, 2, ${-0.16 * lum})`;
    ctx.fillRect(x, 0, 2, S);
  }

  const [nc, nctx] = createCanvas(S, S);
  const img = nctx.createImageData(S, S);
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const dHdx = Math.cos(x * 0.45) * 0.65 + Math.cos(x * 0.17) * 0.35;
      const nx = -dHdx * 0.55;
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
 * Eye-Catching Royal Cerulean-Turquoise & Golden-Trimmed Princess Dress Texture!
 * Pairs in a bold complementary triad with her Vivid Rose-Crimson Capelet & Golden-Chestnut Hair.
 */
function buildMochiDressTexture(): THREE.CanvasTexture {
  const S = 512;
  const [c, ctx] = createCanvas(S, S);
  const grad = ctx.createLinearGradient(0, 0, 0, S);
  grad.addColorStop(0, '#00b4d8');
  grad.addColorStop(0.55, '#0077b6');
  grad.addColorStop(0.8, '#023e8a');
  grad.addColorStop(0.84, '#ffb703');
  grad.addColorStop(0.91, '#ffd166');
  grad.addColorStop(0.95, '#ff006e');
  grad.addColorStop(1, '#03045e');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, S, S);

  // Crisp golden royal embroidery dots along skirt border
  ctx.fillStyle = '#ffd60a';
  for (let x = 16; x < S; x += 32) {
    ctx.beginPath();
    ctx.arc(x, S * 0.77, 6.5, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  return tex;
}

/**
 * Razor-Sharp High-Contrast Reptile Eye Texture (NO glow blur).
 */
function buildReptileEyeTexture(irisTop: string, irisBot: string, centerHex: string): THREE.CanvasTexture {
  const S = 256;
  const [c, ctx] = createCanvas(S, S);
  const cx = S / 2;
  const cy = S / 2;

  const rad = ctx.createRadialGradient(cx, cy, 8, cx, cy, S * 0.5);
  rad.addColorStop(0, centerHex);
  rad.addColorStop(0.55, irisTop);
  rad.addColorStop(0.88, irisBot);
  rad.addColorStop(1, '#090204');
  ctx.fillStyle = rad;
  ctx.fillRect(0, 0, S, S);

  ctx.strokeStyle = 'rgba(255,255,255,0.28)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 40; i++) {
    const a = (i / 40) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * 18, cy + Math.sin(a) * 18);
    ctx.lineTo(cx + Math.cos(a) * 112, cy + Math.sin(a) * 112);
    ctx.stroke();
  }

  ctx.fillStyle = '#050103';
  ctx.beginPath();
  ctx.ellipse(cx + 12, cy, 15, 92, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(cx - 26, cy - 34, 21, 13, -0.4, 0, Math.PI * 2);
  ctx.fill();

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Ultra-Vibrant High-Contrast Serpent / Dragon Scale + Belly Scute Textures!
 */
function buildSerpentBodyTexture(variant: SerpentSkinVariant): THREE.CanvasTexture {
  const W = 512;
  const H = 512;
  const [c, ctx] = createCanvas(W, H);

  const palettes: Record<
    SerpentSkinVariant,
    { dorsalA: string; dorsalB: string; ridge: string; crevice: string; bellyA: string; bellyB: string }
  > = {
    // Electric Emerald-Lime + Vivid Tangerine-Gold Belly + Crimson Spine Diamonds!
    venom_naga: {
      dorsalA: '#00d946',
      dorsalB: '#047857',
      ridge: '#ffbe0b',
      crevice: '#022c22',
      bellyA: '#ffd60a',
      bellyB: '#fb8500',
    },
    // Electric Turquoise-Cyan + Vivid Coral-Orange Spine + Sunny Gold Belly!
    river_gharial: {
      dorsalA: '#00bbf9',
      dorsalB: '#0077b6',
      ridge: '#ff6d00',
      crevice: '#03045e',
      bellyA: '#ffee32',
      bellyB: '#f77f00',
    },
    // Crisp Cobalt-Sapphire + Vivid Amethyst-Magenta Spine + Ice-White Belly!
    frost_wyrm: {
      dorsalA: '#38bdf8',
      dorsalB: '#1d4ed8',
      ridge: '#f72585',
      crevice: '#0f172a',
      bellyA: '#f8fafc',
      bellyB: '#93c5fd',
    },
    // Striking Scarlet-Crimson & Royal Violet + 24K Gold Spine & Belly!
    boss_dragon: {
      dorsalA: '#ff0a54',
      dorsalB: '#7209b7',
      ridge: '#ffd60a',
      crevice: '#240046',
      bellyA: '#ffd60a',
      bellyB: '#e85d04',
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

      const g = ctx.createRadialGradient(sx, sy - ch * 0.15, 1, sx, sy, cw * 0.65);
      const uNorm = ((sx / W) % 1 + 1) % 1;
      const distFromSpine = Math.min(uNorm, 1 - uNorm);
      const isSpine = distFromSpine < 0.12 && r % 2 === 0;

      g.addColorStop(0, isSpine ? pal.ridge : pal.dorsalA);
      g.addColorStop(0.68, pal.dorsalB);
      g.addColorStop(1, pal.crevice);

      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(sx, sy - ch * 0.56);
      ctx.quadraticCurveTo(sx + cw * 0.56, sy, sx, sy + ch * 0.58);
      ctx.quadraticCurveTo(sx - cw * 0.56, sy, sx, sy - ch * 0.56);
      ctx.fill();
    }
  }

  // Ribbed Golden/Ivory Ventral Belly Scutes
  const bellyLeft = W * 0.37;
  const bellyWidth = W * 0.26;
  const scuteRows = 32;
  const sh = H / scuteRows;
  for (let r = 0; r < scuteRows; r++) {
    const y = r * sh;
    const bg = ctx.createLinearGradient(bellyLeft, y, bellyLeft + bellyWidth, y + sh);
    bg.addColorStop(0, pal.bellyB);
    bg.addColorStop(0.25, pal.bellyA);
    bg.addColorStop(0.75, pal.bellyA);
    bg.addColorStop(1, pal.bellyB);
    ctx.fillStyle = bg;
    ctx.strokeStyle = pal.crevice;
    ctx.lineWidth = 2.4;
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
 * Crisp Royal Indigo-Slate Basalt + Vivid Tiger-Orange & Gold Magma Veins (no blurry glow).
 */
function buildMagmaCracksTexture(): THREE.CanvasTexture {
  const S = 512;
  const [c, ctx] = createCanvas(S, S);
  ctx.fillStyle = '#1e1b4b';
  ctx.fillRect(0, 0, S, S);

  for (let i = 0; i < 65; i++) {
    const x = (i * 97) % S;
    const y = (i * 151) % S;
    const r = 26 + (i % 5) * 11;
    const g = ctx.createRadialGradient(x, y, 4, x, y, r);
    g.addColorStop(0, '#4338ca');
    g.addColorStop(0.76, '#1e1b4b');
    g.addColorStop(1, '#ff5400');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.strokeStyle = '#ffbe0b';
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
    reptileEyeGoldTex: buildReptileEyeTexture('#ff6d00', '#d00000', '#ffd60a'),
    reptileEyeIceTex: buildReptileEyeTexture('#00bbf9', '#3a0ca3', '#ffffff'),
    reptileEyeBossTex: buildReptileEyeTexture('#00f5d4', '#007f5f', '#ffee32'),
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
