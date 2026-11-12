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
 * 512x512 Multi-layered Pixar/Anime Iris Texture with limbal ring, radial fibers,
 * subsurface lower crescent glow, deep velvet pupil, and dual softbox catchlights.
 */
function buildMochiIrisTexture(): THREE.CanvasTexture {
  const S = 512;
  const [c, ctx] = createCanvas(S, S);
  const cx = S / 2;
  const cy = S / 2;

  // Sclera soft porcelain-white outer margin
  const scleraGrad = ctx.createRadialGradient(cx, cy, S * 0.34, cx, cy, S * 0.5);
  scleraGrad.addColorStop(0, '#ffffff');
  scleraGrad.addColorStop(0.82, '#f8f0f5');
  scleraGrad.addColorStop(1, '#e6cfd9');
  ctx.fillStyle = scleraGrad;
  ctx.fillRect(0, 0, S, S);

  const irisR = S * 0.35;

  // Outer dark limbal ring
  const limbal = ctx.createRadialGradient(cx, cy, irisR * 0.1, cx, cy, irisR);
  limbal.addColorStop(0, '#2a0826');
  limbal.addColorStop(0.45, '#7b1fa2');
  limbal.addColorStop(0.78, '#c2185b');
  limbal.addColorStop(0.92, '#4a0e35');
  limbal.addColorStop(1, '#1d0517');
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, irisR, 0, Math.PI * 2);
  ctx.clip();
  ctx.fillStyle = limbal;
  ctx.fillRect(0, 0, S, S);

  // Lower warm rose-gold subsurface bounce crescent
  const lowerGlow = ctx.createRadialGradient(cx, cy + irisR * 0.42, 4, cx, cy + irisR * 0.35, irisR * 0.72);
  lowerGlow.addColorStop(0, 'rgba(255, 179, 217, 0.92)');
  lowerGlow.addColorStop(0.45, 'rgba(255, 92, 168, 0.55)');
  lowerGlow.addColorStop(1, 'rgba(255, 92, 168, 0)');
  ctx.fillStyle = lowerGlow;
  ctx.fillRect(0, 0, S, S);

  // Upper eyelid shadow gradient inside iris
  const upperShade = ctx.createLinearGradient(0, cy - irisR, 0, cy + irisR * 0.15);
  upperShade.addColorStop(0, 'rgba(20, 4, 28, 0.78)');
  upperShade.addColorStop(0.55, 'rgba(42, 8, 45, 0.25)');
  upperShade.addColorStop(1, 'rgba(42, 8, 45, 0)');
  ctx.fillStyle = upperShade;
  ctx.fillRect(0, 0, S, S);

  // Radial crystalline iris fibers
  ctx.strokeStyle = 'rgba(255, 214, 238, 0.26)';
  ctx.lineWidth = 2.2;
  for (let i = 0; i < 84; i++) {
    const ang = (i / 84) * Math.PI * 2;
    const r0 = irisR * (0.34 + (i % 3) * 0.04);
    const r1 = irisR * (0.86 - (i % 4) * 0.03);
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(ang) * r0, cy + Math.sin(ang) * r0);
    ctx.lineTo(cx + Math.cos(ang) * r1, cy + Math.sin(ang) * r1);
    ctx.stroke();
  }

  // Deep velvet pupil
  const pupilGrad = ctx.createRadialGradient(cx, cy - 4, 2, cx, cy, irisR * 0.4);
  pupilGrad.addColorStop(0, '#09020d');
  pupilGrad.addColorStop(0.78, '#1a0522');
  pupilGrad.addColorStop(1, 'rgba(26, 5, 34, 0)');
  ctx.fillStyle = pupilGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, irisR * 0.4, 0, Math.PI * 2);
  ctx.fill();

  // Primary softbox specular highlight (upper-left)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.97)';
  ctx.beginPath();
  ctx.ellipse(cx - irisR * 0.34, cy - irisR * 0.34, irisR * 0.22, irisR * 0.17, -0.45, 0, Math.PI * 2);
  ctx.fill();

  // Secondary rim highlight (lower-right)
  ctx.fillStyle = 'rgba(255, 240, 250, 0.88)';
  ctx.beginPath();
  ctx.arc(cx + irisR * 0.36, cy + irisR * 0.34, irisR * 0.1, 0, Math.PI * 2);
  ctx.fill();

  // Tiny starlight sparkle
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.beginPath();
  ctx.arc(cx - irisR * 0.12, cy - irisR * 0.52, irisR * 0.055, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Soft Porcelain-Peach Subsurface Skin Texture with airbrushed rosy cheek blush.
 */
function buildMochiSkinTexture(): THREE.CanvasTexture {
  const S = 512;
  const [c, ctx] = createCanvas(S, S);
  const baseGrad = ctx.createLinearGradient(0, 0, 0, S);
  baseGrad.addColorStop(0, '#fff5ec');
  baseGrad.addColorStop(0.55, '#ffede0');
  baseGrad.addColorStop(1, '#ffdcc8');
  ctx.fillStyle = baseGrad;
  ctx.fillRect(0, 0, S, S);

  // Rosy airbrushed blush zones mapped to front-left and front-right cheek UVs
  for (const bx of [S * 0.36, S * 0.64]) {
    const blush = ctx.createRadialGradient(bx, S * 0.56, 4, bx, S * 0.56, S * 0.11);
    blush.addColorStop(0, 'rgba(255, 105, 145, 0.52)');
    blush.addColorStop(0.6, 'rgba(255, 130, 165, 0.22)');
    blush.addColorStop(1, 'rgba(255, 130, 165, 0)');
    ctx.fillStyle = blush;
    ctx.fillRect(0, 0, S, S);
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Silky Anisotropic Strawberry-Chestnut to Peach-Rose Hair Strand Albedo & Normal Maps.
 */
function buildMochiHairTextures(): { albedo: THREE.CanvasTexture; normal: THREE.CanvasTexture } {
  const S = 512;
  const [c, ctx] = createCanvas(S, S);
  const grad = ctx.createLinearGradient(0, 0, 0, S);
  grad.addColorStop(0, '#591c33');
  grad.addColorStop(0.28, '#9e2b52');
  grad.addColorStop(0.68, '#e0537c');
  grad.addColorStop(1, '#ffb3c6');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, S, S);

  // Fine vertical silk strands
  for (let x = 0; x < S; x += 2) {
    const lum = Math.sin(x * 0.37) * 0.5 + Math.cos(x * 0.13) * 0.5;
    ctx.fillStyle = lum > 0 ? `rgba(255,235,242,${0.08 * lum})` : `rgba(35,6,18,${-0.1 * lum})`;
    ctx.fillRect(x, 0, 2, S);
  }

  // Normal map for anisotropic hair strand grooves
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
 * Royal Velvet & Satin Dress Texture with Golden Filigree Hem Trim (100% secular floral/royal trim).
 */
function buildMochiDressTexture(): THREE.CanvasTexture {
  const S = 512;
  const [c, ctx] = createCanvas(S, S);
  const grad = ctx.createLinearGradient(0, 0, 0, S);
  grad.addColorStop(0, '#ff477e');
  grad.addColorStop(0.65, '#e11d58');
  grad.addColorStop(0.84, '#b80d44');
  grad.addColorStop(0.88, '#ffd166');
  grad.addColorStop(0.93, '#fff1cc');
  grad.addColorStop(1, '#d90448');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, S, S);

  // Golden scalloped embroidery dots along hem
  ctx.fillStyle = '#ffe07d';
  for (let x = 16; x < S; x += 32) {
    ctx.beginPath();
    ctx.arc(x, S * 0.81, 6, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  return tex;
}

/**
 * Blazing Vertical-Slit Reptile Eye Texture.
 */
function buildReptileEyeTexture(irisTop: string, irisBot: string, glowHex: string): THREE.CanvasTexture {
  const S = 256;
  const [c, ctx] = createCanvas(S, S);
  const cx = S / 2;
  const cy = S / 2;

  const rad = ctx.createRadialGradient(cx, cy, 8, cx, cy, S * 0.5);
  rad.addColorStop(0, glowHex);
  rad.addColorStop(0.55, irisTop);
  rad.addColorStop(0.88, irisBot);
  rad.addColorStop(1, '#120505');
  ctx.fillStyle = rad;
  ctx.fillRect(0, 0, S, S);

  // Fiery iris veins
  ctx.strokeStyle = 'rgba(255,255,210,0.34)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 48; i++) {
    const a = (i / 48) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * 18, cy + Math.sin(a) * 18);
    ctx.lineTo(cx + Math.cos(a) * 112, cy + Math.sin(a) * 112);
    ctx.stroke();
  }

  // Razor vertical viper slit pupil
  ctx.fillStyle = '#070104';
  ctx.beginPath();
  ctx.ellipse(cx + 12, cy, 15, 92, 0, 0, Math.PI * 2);
  ctx.fill();

  // Wet corneal highlight
  ctx.fillStyle = 'rgba(255,255,255,0.94)';
  ctx.beginPath();
  ctx.ellipse(cx - 26, cy - 34, 22, 14, -0.4, 0, Math.PI * 2);
  ctx.fill();

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Full Circumferential Serpent / Dragon Scale + Ventral Belly Scute Texture!
 * U in [0..1] wraps around body circumference (0.36..0.64 = ventral belly scutes, rest = diamond dorsal scales).
 * V in [0..1] runs along spine length.
 */
function buildSerpentBodyTexture(variant: SerpentSkinVariant): THREE.CanvasTexture {
  const W = 512;
  const H = 512;
  const [c, ctx] = createCanvas(W, H);

  const palettes: Record<
    SerpentSkinVariant,
    { dorsalA: string; dorsalB: string; ridge: string; crevice: string; bellyA: string; bellyB: string }
  > = {
    venom_naga: {
      dorsalA: '#1fb83b',
      dorsalB: '#0c6e24',
      ridge: '#a3e635',
      crevice: '#05290e',
      bellyA: '#fef08a',
      bellyB: '#ca8a04',
    },
    river_gharial: {
      dorsalA: '#0d9488',
      dorsalB: '#115e59',
      ridge: '#5eead4',
      crevice: '#042f2e',
      bellyA: '#fde68a',
      bellyB: '#b45309',
    },
    frost_wyrm: {
      dorsalA: '#38bdf8',
      dorsalB: '#0369a1',
      ridge: '#e0f2fe',
      crevice: '#082f49',
      bellyA: '#f0f9ff',
      bellyB: '#7dd3fc',
    },
    boss_dragon: {
      dorsalA: '#7e22ce',
      dorsalB: '#3b0764',
      ridge: '#f43f5e',
      crevice: '#17032b',
      bellyA: '#fcd34d',
      bellyB: '#b45309',
    },
  };

  const pal = palettes[variant];
  ctx.fillStyle = pal.crevice;
  ctx.fillRect(0, 0, W, H);

  // Draw overlapping diamond dorsal scales across full canvas
  const cols = 18;
  const rows = 28;
  const cw = W / cols;
  const ch = H / rows;

  for (let r = -1; r <= rows; r++) {
    for (let col = -1; col <= cols; col++) {
      const sx = (col + (r % 2) * 0.5) * cw;
      const sy = r * ch;

      const g = ctx.createRadialGradient(sx, sy - ch * 0.15, 1, sx, sy, cw * 0.65);
      // Dorsal spine stripe near u = 0 or u = 1
      const uNorm = ((sx / W) % 1 + 1) % 1;
      const distFromSpine = Math.min(uNorm, 1 - uNorm);
      const isSpine = distFromSpine < 0.11 && r % 2 === 0;

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

  // Paint ribbed ventral belly scutes down center band (u in [0.37, 0.63])
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
 * Charred Volcanic Basalt + Glowing Molten Magma Cracks Texture for Magma Crusher & Juggernaut.
 */
function buildMagmaCracksTexture(): THREE.CanvasTexture {
  const S = 512;
  const [c, ctx] = createCanvas(S, S);
  ctx.fillStyle = '#1c1917';
  ctx.fillRect(0, 0, S, S);

  // Basalt stone chunks
  for (let i = 0; i < 65; i++) {
    const x = ((i * 97) % S);
    const y = ((i * 151) % S);
    const r = 26 + (i % 5) * 11;
    const g = ctx.createRadialGradient(x, y, 4, x, y, r);
    g.addColorStop(0, '#3f3a36');
    g.addColorStop(0.78, '#262220');
    g.addColorStop(1, '#ff4d00');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Incandescent magma veins
  ctx.strokeStyle = '#ff9500';
  ctx.lineWidth = 4;
  for (let k = 0; k < 18; k++) {
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
    reptileEyeGoldTex: buildReptileEyeTexture('#f59e0b', '#9a3412', '#fef08a'),
    reptileEyeIceTex: buildReptileEyeTexture('#38bdf8', '#075985', '#e0f2fe'),
    reptileEyeBossTex: buildReptileEyeTexture('#f43f5e', '#881337', '#fde047'),
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
