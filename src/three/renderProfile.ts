/**
 * Render profile: keeps full studio quality on desktop, but protects phone GPUs/CPUs.
 *
 * Phones (touch screens, small displays, or the Capacitor Android/iOS wrapper) get:
 *  - pixel ratio capped at 1.5 (a 3x phone screen otherwise renders ~4x the pixels)
 *  - no shadow-map pass (it re-draws every candy and serpent segment each frame)
 *  - no MSAA (antialias), the multisample buffer is expensive on mobile GPUs
 *
 * Geometry (LoopSubdivision Mochi/Serpent/Golem), materials and textures are NOT reduced,
 * so the character look stays the same.
 */
export interface RenderProfile {
  lowPower: boolean;
  pixelRatio: number;
  shadows: boolean;
  antialias: boolean;
}

interface CapacitorGlobal {
  isNativePlatform?: () => boolean;
}

function detectLowPower(): boolean {
  if (typeof window === 'undefined') return false;
  const cap = (window as unknown as { Capacitor?: CapacitorGlobal }).Capacitor;
  if (cap?.isNativePlatform?.()) return true;
  const coarsePointer =
    typeof window.matchMedia === 'function' && window.matchMedia('(pointer: coarse)').matches;
  const smallScreen =
    Math.min(window.screen?.width ?? 1920, window.screen?.height ?? 1080) <= 820;
  return coarsePointer || smallScreen;
}

let cachedProfile: RenderProfile | null = null;

export function getRenderProfile(): RenderProfile {
  if (cachedProfile) return cachedProfile;
  const lowPower = detectLowPower();
  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
  cachedProfile = {
    lowPower,
    pixelRatio: Math.min(dpr, lowPower ? 1.5 : 2),
    shadows: !lowPower,
    antialias: !lowPower,
  };
  return cachedProfile;
}
