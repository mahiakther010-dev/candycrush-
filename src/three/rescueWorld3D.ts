import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import {
  BlockerType,
  CandyColor,
  GameStatus,
  GridCell,
  LevelConfig,
  SnakeObstacleState,
  SpecialType,
  TaskProgress,
} from '../types/game';
import { HintMove } from '../engine/match3';
import { createCandyStudioEnvironment, setupCinematicLights, StudioLights } from './studioEnv';
import { getProceduralPBRMaps } from './proceduralTextures3D';
import { getRenderProfile } from './renderProfile';
import {
  createBlockerMesh3D,
  createCandyMesh3D,
  createHintHand3D,
} from './candyMeshes3D';
import { createMochiRig3D, MochiRig3D, updateMochiRigAnimation } from './mochiCharacter3D';
import {
  createJuggernautBeastRig3D,
  createMagmaGolemRig3D,
  createSerpentRig3D,
  JuggernautBeastRig3D,
  MagmaGolemRig3D,
  SerpentRig3D,
  updateMagmaGolemAnimation,
  updateSerpentAlongCurve,
} from './serpentMonster3D';

export interface Marble3D {
  mesh: THREE.Mesh;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  r: number;
  draining: boolean;
  life: number;
}

interface Fragment3D {
  mesh: THREE.Mesh;
  vx: number;
  vy: number;
  vz: number;
  rx: number;
  ry: number;
  life: number;
  maxLife: number;
}

interface Shockwave3D {
  mesh: THREE.Mesh;
  kind: 'row' | 'col' | 'bomb' | 'rainbow';
  life: number;
  maxLife: number;
}

interface Projectile3D {
  mesh: THREE.Object3D;
  start: THREE.Vector3;
  end: THREE.Vector3;
  progress: number;
}

export interface WorldSyncState {
  grid: GridCell[][];
  tasks: TaskProgress[];
  danger: number;
  status: GameStatus;
  rescueAnimProgress: number;
  freezeTimer: number;
  happyTimer: number;
  surprisedTimer: number;
  shakeTimer: number;
  /** Snake HP percent: 100 = full, 0 = defeated */
  snakeHpPct: number;
  /** Seconds left on the red hit-flash after a Special Candy burst */
  snakeHitTimer: number;
  snakeObstacles: SnakeObstacleState[];
  /** True once the Snake touched Mochi (instant death pose) */
  mochiCaught: boolean;
  selectedCell: { row: number; col: number } | null;
  hintMove: HintMove | null;
  showHint: boolean;
}

const TILE_PITCH = 0.96;
const SNAKE_BASE_COLOR = new THREE.Color(0xffffff);
const SNAKE_FROST_COLOR = new THREE.Color(0x38bdf8);
const SNAKE_HIT_COLOR = new THREE.Color(0xff2a5f);
const snakeTintScratch = new THREE.Color();
const BOARD_CENTER_Y = -2.62;
const ARENA_BASE_Y = 1.32;

function boostVibrantColor(hexStr: string, minSat = 0.75, minLight = 0.36, maxLight = 0.58): THREE.Color {
  const c = new THREE.Color(hexStr);
  const hsl = { h: 0, s: 0, l: 0 };
  c.getHSL(hsl);
  c.setHSL(hsl.h, Math.max(minSat, hsl.s), THREE.MathUtils.clamp(hsl.l, minLight, maxLight));
  return c;
}

export class RescueWorld3D {
  public renderer: THREE.WebGLRenderer;
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  private lights: StudioLights;
  private envTex: THREE.Texture;
  private liquidNormalTex: THREE.Texture;

  private level: LevelConfig;
  private boardOriginX: number;
  private boardOriginY: number;

  private arenaGroup = new THREE.Group();
  private boardGroup = new THREE.Group();
  private fxGroup = new THREE.Group();
  private hitPlane: THREE.Mesh;
  private raycaster = new THREE.Raycaster();

  // Dynamic Board Caches
  private candyEntries = new Map<
    number,
    {
      mesh: THREE.Group;
      color: CandyColor;
      special: SpecialType;
      body: THREE.Object3D | null;
      spinRing: THREE.Object3D | null;
    }
  >();
  private blockerEntries = new Map<string, { mesh: THREE.Group; blocker: BlockerType }>();
  private selectionRing: THREE.Mesh;
  private hintHand: THREE.Group;

  // Dynamic Rescue Arena Actors
  private mochi: MochiRig3D;
  private serpentMain: SerpentRig3D | null = null;
  private serpentTwin: SerpentRig3D | null = null;
  private curveMain: THREE.CatmullRomCurve3 | null = null;
  private curveTwin: THREE.CatmullRomCurve3 | null = null;

  private portalGroup = new THREE.Group();
  private portalRing: THREE.Mesh | null = null;
  private gates: THREE.Mesh[] = [];
  private bridgePlanks: THREE.Mesh[] = [];
  private lavaMesh: THREE.Mesh | null = null;
  private magmaGolem: MagmaGolemRig3D | null = null;
  private juggernautBeast: JuggernautBeastRig3D | null = null;
  private frostTurret: THREE.Group | null = null;
  private rainbowBeam: THREE.Mesh | null = null;

  private siloBounds = { xMin: -3.7, xMax: -2.1, yMin: 1.65, yMax: 4.55 };
  private marbles: Marble3D[] = [];
  private fragments: Fragment3D[] = [];
  private shockwaves: Shockwave3D[] = [];
  private projectiles: Projectile3D[] = [];

  private fragGeo = new THREE.OctahedronGeometry(0.13, 0);
  private marbleGeo = new THREE.SphereGeometry(0.145, 16, 14);
  private marbleMats: Record<CandyColor, THREE.MeshPhysicalMaterial>;

  // Snake combat visuals
  private snakeBarriers: Array<{ group: THREE.Group; index: number; cleared: boolean }> = [];
  private snakeHeadPos = new THREE.Vector3(0, 4, 0.3);
  private lastSnakeHpPct = 100;
  private burstMats = new Map<number, THREE.MeshPhysicalMaterial>();

  constructor(canvas: HTMLCanvasElement, level: LevelConfig) {
    this.level = level;
    this.boardOriginX = -((level.cols - 1) * TILE_PITCH) * 0.5;
    this.boardOriginY = BOARD_CENTER_Y + ((level.rows - 1) * TILE_PITCH) * 0.5;

    const profile = getRenderProfile();
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: profile.antialias,
      alpha: false,
      powerPreference: 'high-performance',
    });
    this.renderer.setPixelRatio(profile.pixelRatio);
    this.renderer.shadowMap.enabled = profile.shadows;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.NeutralToneMapping;
    this.renderer.toneMappingExposure = 1.04;

    this.scene = new THREE.Scene();
    const skyHex = level.themePalette?.sky ?? '#1d4ed8';
    this.scene.background = boostVibrantColor(skyHex, 0.76, 0.34, 0.5);

    this.envTex = createCandyStudioEnvironment(this.renderer);
    this.scene.environment = this.envTex;

    this.camera = new THREE.PerspectiveCamera(34, 520 / 770, 0.5, 65);
    this.camera.position.set(0, 0.35, 21.2);
    this.camera.lookAt(0, 0.05, 0);

    const maps = getProceduralPBRMaps();
    this.liquidNormalTex = maps.liquidWaveNormal.clone();
    this.liquidNormalTex.needsUpdate = true;

    this.lights = setupCinematicLights(this.scene);

    this.marbleMats = {
      red: new THREE.MeshPhysicalMaterial({ color: 0xff003c, roughness: 0.05, clearcoat: 1, envMapIntensity: 1.4 }),
      blue: new THREE.MeshPhysicalMaterial({ color: 0x0095ff, roughness: 0.04, clearcoat: 1, envMapIntensity: 1.4 }),
      yellow: new THREE.MeshPhysicalMaterial({ color: 0xffd000, roughness: 0.05, clearcoat: 1, envMapIntensity: 1.4 }),
      green: new THREE.MeshPhysicalMaterial({ color: 0x00d936, roughness: 0.05, clearcoat: 1, envMapIntensity: 1.4 }),
      purple: new THREE.MeshPhysicalMaterial({ color: 0x9d00ff, roughness: 0.05, clearcoat: 1, envMapIntensity: 1.4 }),
      orange: new THREE.MeshPhysicalMaterial({ color: 0xff6600, roughness: 0.05, clearcoat: 1, envMapIntensity: 1.4 }),
    };

    this.scene.add(this.arenaGroup);
    this.scene.add(this.boardGroup);
    this.scene.add(this.fxGroup);

    // Invisible raycast plane aligned with candy layer
    this.hitPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(16, 16),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    this.hitPlane.position.set(0, BOARD_CENTER_Y, 0.2);
    this.scene.add(this.hitPlane);

    this.selectionRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.45, 0.045, 10, 32),
      new THREE.MeshBasicMaterial({ color: 0xfff08a })
    );
    this.selectionRing.visible = false;
    this.boardGroup.add(this.selectionRing);

    this.hintHand = createHintHand3D();
    this.hintHand.visible = false;
    this.fxGroup.add(this.hintHand);

    this.mochi = createMochiRig3D();
    this.mochi.root.scale.setScalar(0.96);

    this.buildFantasyBackdrop();
    this.buildBoardTray3D();
    this.buildRescueArenaForLevel();
    this.buildSnakeBarriers();
  }

  /** Point on the Snake's path for a given progress 0–1 (matches the Snake's head position) */
  private snakePathPoint(progress: number, out: THREE.Vector3 = new THREE.Vector3()): THREE.Vector3 {
    const p = THREE.MathUtils.clamp(progress, 0, 1);
    if (this.curveMain) {
      return this.curveMain.getPointAt(THREE.MathUtils.clamp(0.06 + p * 0.92, 0.06, 0.99), out);
    }
    if (this.level.scene === 'lava_bridge') {
      return out.set(-3.75 + p * 1.68, 4.25, 0.3);
    }
    if (this.level.scene === 'boulder_run') {
      return out.set(THREE.MathUtils.lerp(-3.5, 3.35, p), THREE.MathUtils.lerp(5.1, 2.75, p), 0.3);
    }
    return out.set(0, 4, 0.3);
  }

  /** Obstacle barriers the Snake must break through, placed on its path */
  private buildSnakeBarriers() {
    const barrierSpecs = [
      { progress: 0.2, colorHex: 0x38bdf8 },
      { progress: 0.42, colorHex: 0xff5400 },
      { progress: 0.64, colorHex: 0xa855f7 },
      { progress: 0.84, colorHex: 0x22c55e },
    ];
    barrierSpecs.forEach((spec, index) => {
      const group = new THREE.Group();
      const mat = new THREE.MeshPhysicalMaterial({
        color: spec.colorHex,
        roughness: 0.2,
        clearcoat: 0.9,
      });
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.09, 12, 28), mat);
      group.add(ring);
      const bar = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.09, 0.12), mat);
      group.add(bar);
      group.position.copy(this.snakePathPoint(spec.progress));
      group.position.z = 0.3;
      this.arenaGroup.add(group);
      this.snakeBarriers.push({ group, index, cleared: false });
    });
  }

  /** Red-hot chunks burst off the Snake head whenever a Special Candy hits it */
  public spawnSnakeHitBurst(count: number = 8) {
    this.spawnBurstAt(this.snakeHeadPos, 0xff2a5f, count);
  }

  private spawnBurstAt(pos: THREE.Vector3, colorHex: number, count: number) {
    let mat = this.burstMats.get(colorHex);
    if (!mat) {
      mat = new THREE.MeshPhysicalMaterial({ color: colorHex, roughness: 0.1, clearcoat: 1 });
      this.burstMats.set(colorHex, mat);
    }
    for (let i = 0; i < count; i++) {
      const mesh = new THREE.Mesh(this.fragGeo, mat);
      mesh.position.copy(pos);
      const ang = Math.random() * Math.PI * 2;
      const spd = 2.4 + Math.random() * 4.0;
      this.fxGroup.add(mesh);
      this.fragments.push({
        mesh,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd + 1.2,
        vz: 1.6 + Math.random() * 2.6,
        rx: (Math.random() - 0.5) * 14,
        ry: (Math.random() - 0.5) * 14,
        life: 0,
        maxLife: 0.5 + Math.random() * 0.25,
      });
    }
  }

  /** Barriers shrink away when broken; Snake tint follows HP; defeat bursts the Snake apart */
  private applySnakeCombatVisuals(state: WorldSyncState, dt: number, time: number) {
    this.snakePathPoint(state.danger / 100, this.snakeHeadPos);

    for (const b of this.snakeBarriers) {
      const ob = state.snakeObstacles[b.index];
      if (ob?.cleared && !b.cleared) {
        b.cleared = true;
        this.spawnBurstAt(b.group.position, ob.colorHex, 14);
      }
      const target = b.cleared ? 0.001 : 1;
      const k = Math.min(1, dt * 9);
      const next = THREE.MathUtils.lerp(b.group.scale.x, target, k);
      b.group.scale.setScalar(next);
      b.group.visible = next > 0.02;
      if (!b.cleared) {
        b.group.rotation.z = Math.sin(time * 2.2 + b.index) * 0.12;
      }
    }

    const hpRatio = THREE.MathUtils.clamp(state.snakeHpPct / 100, 0, 1);
    const hit = state.snakeHitTimer > 0 ? state.snakeHitTimer / 0.26 : 0;
    const frozen = state.freezeTimer > 0;
    // Brightness falls with HP so a wounded Snake looks visibly beaten down
    const tint = snakeTintScratch
      .copy(frozen ? SNAKE_FROST_COLOR : SNAKE_BASE_COLOR)
      .multiplyScalar(0.42 + 0.58 * hpRatio)
      .lerp(SNAKE_HIT_COLOR, hit);

    const rigs = [this.serpentMain, this.serpentTwin];
    if (state.snakeHpPct <= 0 && this.lastSnakeHpPct > 0) {
      this.spawnBurstAt(this.snakeHeadPos, 0xff2a5f, 34);
    }
    this.lastSnakeHpPct = state.snakeHpPct;
    for (const rig of rigs) {
      if (!rig) continue;
      rig.scaleMat.color.copy(tint);
      rig.root.visible = state.snakeHpPct > 0;
    }
  }

  public cellToWorld(row: number, col: number): THREE.Vector3 {
    return new THREE.Vector3(
      this.boardOriginX + col * TILE_PITCH,
      this.boardOriginY - row * TILE_PITCH,
      0.22
    );
  }

  public pointerToGridCell(
    clientX: number,
    clientY: number,
    rect: DOMRect
  ): { row: number; col: number } | null {
    const ndcX = ((clientX - rect.left) / rect.width) * 2 - 1;
    const ndcY = -((clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), this.camera);
    const hits = this.raycaster.intersectObject(this.hitPlane);
    if (hits.length === 0) return null;

    const pt = hits[0].point;
    const col = Math.round((pt.x - this.boardOriginX) / TILE_PITCH);
    const row = Math.round((this.boardOriginY - pt.y) / TILE_PITCH);
    if (row < 0 || row >= this.level.rows || col < 0 || col >= this.level.cols) {
      return null;
    }
    return { row, col };
  }

  private buildFantasyBackdrop() {
    const maps = getProceduralPBRMaps();

    // Rich Vibrant Royal-Cobalt Stone Backdrop Wall (Zero hazy glow)
    const wallMat = new THREE.MeshPhysicalMaterial({
      color: boostVibrantColor(this.level.themePalette?.wall ?? '#1e40af', 0.75, 0.34, 0.52),
      roughness: 0.5,
      metalness: 0.06,
      clearcoat: 0.2,
      normalMap: maps.stoneBrickNormal,
      normalScale: new THREE.Vector2(0.5, 0.5),
    });
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(11.8, 15.8, 0.5), wallMat);
    backWall.position.set(0, 0.2, -1.38);
    backWall.receiveShadow = true;
    this.scene.add(backWall);

    // Vibrant Hot-Coral / Magenta Columns + 24K Gold Rings + Lush Tropical Foliage
    const pillarMat = new THREE.MeshPhysicalMaterial({
      color: boostVibrantColor(this.level.themePalette?.pillar ?? '#ff0a54', 0.85, 0.5, 0.62),
      roughness: 0.2,
      metalness: 0.1,
      clearcoat: 0.85,
      envMapIntensity: 1.35,
    });
    const goldCapMat = new THREE.MeshPhysicalMaterial({
      color: 0xffcc00,
      roughness: 0.14,
      metalness: 0.88,
      clearcoat: 1,
      envMapIntensity: 1.5,
    });
    const foliageMat = new THREE.MeshPhysicalMaterial({
      color: 0x00d936,
      roughness: 0.34,
      sheen: 0.4,
      sheenColor: new THREE.Color(0xb9fbc0),
      clearcoat: 0.25,
    });
    const leafSphereGeo = new THREE.SphereGeometry(0.46, 16, 14);

    for (const side of [-1, 1]) {
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.33, 13.9, 22), pillarMat);
      col.position.set(side * 4.55, 0.2, -0.75);
      col.castShadow = true;
      col.receiveShadow = true;
      this.scene.add(col);

      for (const capY of [-6.3, 0.95, 6.25]) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.082, 12, 24), goldCapMat);
        ring.rotation.x = Math.PI * 0.5;
        ring.position.set(side * 4.55, capY, -0.75);
        this.scene.add(ring);
      }

      for (const [ox, oy, sc] of [
        [side * 4.55, 5.55, 1.0],
        [side * 4.18, 5.95, 0.78],
        [side * 4.78, 4.95, 0.72],
      ]) {
        const bush = new THREE.Mesh(leafSphereGeo, foliageMat);
        bush.scale.setScalar(sc);
        bush.position.set(ox, oy, -0.52);
        this.scene.add(bush);
      }

      // Crisp Jewel Finials (No emissive glow)
      const lolli = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.42, 1),
        new THREE.MeshPhysicalMaterial({
          color: side < 0 ? 0xff0054 : 0x00bbf9,
          roughness: 0.06,
          clearcoat: 1,
          envMapIntensity: 1.5,
        })
      );
      lolli.position.set(side * 4.55, 6.72, -0.62);
      this.scene.add(lolli);
    }
  }

  private buildBoardTray3D() {
    const maps = getProceduralPBRMaps();
    const trayW = this.level.cols * TILE_PITCH + 0.62;
    const trayH = this.level.rows * TILE_PITCH + 0.62;

    // Vibrant Sunny Marigold-Gold Beveled Frame
    const frameMat = new THREE.MeshPhysicalMaterial({
      color: this.level.themePalette?.tray ?? '#ffb703',
      roughness: 0.18,
      metalness: 0.35,
      clearcoat: 0.95,
      clearcoatRoughness: 0.08,
      normalMap: maps.woodNormal,
      normalScale: new THREE.Vector2(0.16, 0.16),
      envMapIntensity: 1.45,
    });
    const outerTray = new THREE.Mesh(
      new RoundedBoxGeometry(trayW, trayH, 0.46, 5, 0.12),
      frameMat
    );
    outerTray.position.set(0, BOARD_CENTER_Y, -0.34);
    outerTray.receiveShadow = true;
    this.boardGroup.add(outerTray);

    // Rich Royal-Berry Velvet Inner Backing Border
    const innerMat = new THREE.MeshPhysicalMaterial({
      color: 0x6b21a8,
      roughness: 0.36,
      clearcoat: 0.25,
    });
    const innerTray = new THREE.Mesh(
      new RoundedBoxGeometry(trayW - 0.28, trayH - 0.28, 0.46, 4, 0.08),
      innerMat
    );
    innerTray.position.set(0, BOARD_CENTER_Y, -0.27);
    innerTray.receiveShadow = true;
    this.boardGroup.add(innerTray);

    // Classic High-Contrast Candy-Crush / Royal-Match Porcelain Wafer Checkerboard Tiles!
    // Warm Vanilla-Cream & Soft Sky-Lavender make ALL 6 candy colors (including Blue & Purple) POP!
    const tileLight = new THREE.MeshPhysicalMaterial({
      color: 0xfff6e8,
      roughness: 0.24,
      clearcoat: 0.5,
      envMapIntensity: 0.9,
    });
    const tileDark = new THREE.MeshPhysicalMaterial({
      color: 0xdbeafe,
      roughness: 0.28,
      clearcoat: 0.45,
      envMapIntensity: 0.9,
    });
    const tileDrain = new THREE.MeshPhysicalMaterial({
      color: 0xffd166,
      roughness: 0.24,
      metalness: 0.15,
      clearcoat: 0.65,
    });
    const tileFlood = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      roughness: 0.12,
      clearcoat: 0.9,
    });
    const tileWind = new THREE.MeshPhysicalMaterial({
      color: 0x6ee7b7,
      roughness: 0.22,
      clearcoat: 0.75,
    });
    const tileGeo = new RoundedBoxGeometry(TILE_PITCH * 0.92, TILE_PITCH * 0.92, 0.09, 3, 0.03);
    const arrowGeo = new THREE.ConeGeometry(0.12, 0.2, 6);
    const arrowMat = new THREE.MeshBasicMaterial({ color: 0xffea00 });

    const hasKeysTask = this.level.tasks.some((t) => t.kind === 'keys');
    const windRowSet = new Set((this.level.windRows ?? []).map((w) => w.row));

    for (let r = 0; r < this.level.rows; r++) {
      for (let c = 0; c < this.level.cols; c++) {
        const pos = this.cellToWorld(r, c);
        const isDrain = this.level.drainColumns.includes(c);
        const isFlooded =
          this.level.submergedFromRow !== undefined && r >= this.level.submergedFromRow;
        const isWind = windRowSet.has(r);
        const mat = isFlooded
          ? tileFlood
          : isWind
            ? tileWind
            : isDrain
              ? tileDrain
              : (r + c) % 2 === 0
                ? tileLight
                : tileDark;
        const well = new THREE.Mesh(tileGeo, mat);
        well.receiveShadow = true;
        well.position.set(pos.x, pos.y, -0.05);
        this.boardGroup.add(well);

        const keyExitRow =
          this.level.submergedFromRow !== undefined
            ? this.level.submergedFromRow - 1
            : this.level.rows - 1;
        if (hasKeysTask && r === keyExitRow) {
          const arrow = new THREE.Mesh(arrowGeo, arrowMat);
          arrow.rotation.z = Math.PI;
          arrow.position.set(pos.x, pos.y - TILE_PITCH * 0.42, 0.12);
          this.boardGroup.add(arrow);
        }
      }
    }

    // Translucent 3D Rippling Monsoon Water Surface over Submerged Rows!
    if (this.level.submergedFromRow !== undefined && this.level.submergedFromRow < this.level.rows) {
      const subRows = this.level.rows - this.level.submergedFromRow;
      const waterH = subRows * TILE_PITCH;
      const topRowY = this.cellToWorld(this.level.submergedFromRow, 0).y + TILE_PITCH * 0.5;
      const waterCenterY = topRowY - waterH * 0.5;
      const waterMat = new THREE.MeshPhysicalMaterial({
        color: 0x00bbf9,
        roughness: 0.05,
        clearcoat: 1.0,
        transmission: 0.55,
        thickness: 0.5,
        ior: 1.333,
        normalMap: this.liquidNormalTex,
        normalScale: new THREE.Vector2(0.35, 0.35),
        transparent: true,
        opacity: 0.38,
        envMapIntensity: 1.4,
      });
      const waterPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(this.level.cols * TILE_PITCH, waterH),
        waterMat
      );
      waterPlane.position.set(0, waterCenterY, 0.54);
      this.boardGroup.add(waterPlane);
    }
  }

  private addWallBeam(x: number, y: number, w: number, h: number, color = 0xff9f1c) {
    const maps = getProceduralPBRMaps();
    const mat = new THREE.MeshPhysicalMaterial({
      color,
      roughness: 0.2,
      metalness: 0.15,
      clearcoat: 0.9,
      normalMap: maps.woodNormal,
      normalScale: new THREE.Vector2(0.24, 0.24),
      envMapIntensity: 1.4,
    });
    const beam = new THREE.Mesh(
      new RoundedBoxGeometry(w, h, 0.68, 3, Math.min(0.06, Math.min(w, h) * 0.25)),
      mat
    );
    beam.position.set(x, y, 0.1);
    beam.castShadow = true;
    beam.receiveShadow = true;
    this.arenaGroup.add(beam);
    return beam;
  }

  private buildPortal3D(x: number, y: number) {
    this.portalGroup = new THREE.Group();
    this.portalGroup.position.set(x, y, 0.15);

    const archMat = new THREE.MeshPhysicalMaterial({
      color: 0xffcc00,
      roughness: 0.15,
      metalness: 0.85,
      clearcoat: 1,
    });
    const arch = new THREE.Mesh(new THREE.TorusGeometry(0.56, 0.11, 14, 32), archMat);
    this.portalGroup.add(arch);

    const vortex = new THREE.Mesh(
      new THREE.CircleGeometry(0.5, 28),
      new THREE.MeshBasicMaterial({ color: 0x00f5d4 })
    );
    vortex.position.z = -0.04;
    this.portalGroup.add(vortex);

    this.portalRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.34, 0.04, 10, 28),
      new THREE.MeshBasicMaterial({ color: 0x00bbf9 })
    );
    this.portalRing.position.z = 0.04;
    this.portalGroup.add(this.portalRing);

    this.arenaGroup.add(this.portalGroup);
  }

  private addGate3D(x: number, y: number, w: number, h: number, hexColor: number) {
    const gate = new THREE.Mesh(
      new RoundedBoxGeometry(w, h, 0.56, 3, Math.min(0.05, Math.min(w, h) * 0.22)),
      new THREE.MeshPhysicalMaterial({
        color: hexColor,
        roughness: 0.16,
        metalness: 0.72,
        clearcoat: 0.95,
        envMapIntensity: 1.5,
      })
    );
    gate.castShadow = true;
    gate.position.set(x, y, 0.15);
    gate.userData = { baseY: y, baseH: h };
    this.arenaGroup.add(gate);
    this.gates.push(gate);
  }

  private populateMarbles3D(count: number) {
    const colors: CandyColor[] = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];
    const { xMin, xMax, yMin, yMax } = this.siloBounds;
    const cols = 5;
    for (let i = 0; i < count; i++) {
      const c = i % cols;
      const r = Math.floor(i / cols);
      const clr = colors[i % colors.length];
      const mesh = new THREE.Mesh(this.marbleGeo, this.marbleMats[clr]);
      const mx = xMin + 0.22 + c * 0.28 + (Math.random() - 0.5) * 0.05;
      const my = Math.min(yMax - 0.18, yMin + 0.2 + r * 0.25);
      mesh.position.set(mx, my, 0.22);
      this.fxGroup.add(mesh);

      this.marbles.push({
        mesh,
        x: mx,
        y: my,
        z: 0.22,
        vx: 0,
        vy: 0,
        r: 0.145,
        draining: false,
        life: 1,
      });
    }
  }

  private buildGlassSilo3D(xMin: number, xMax: number, yMin: number, yMax: number) {
    this.siloBounds = { xMin, xMax, yMin, yMax };
    const w = xMax - xMin;
    const h = yMax - yMin;
    const cx = (xMin + xMax) * 0.5;
    const cy = (yMin + yMax) * 0.5;

    const glass = new THREE.Mesh(
      new RoundedBoxGeometry(w, h, 0.54, 4, 0.07),
      new THREE.MeshPhysicalMaterial({
        color: 0xdff6ff,
        roughness: 0.03,
        clearcoat: 1.0,
        transmission: 0.74,
        thickness: 0.65,
        ior: 1.49,
        iridescence: 0.28,
        envMapIntensity: 2.1,
      })
    );
    glass.position.set(cx, cy, 0.2);
    this.arenaGroup.add(glass);

    this.addWallBeam(xMin - 0.09, cy, 0.16, h + 0.1, 0xfbbf24);
    this.addWallBeam(xMax + 0.09, cy, 0.16, h + 0.1, 0xfbbf24);
  }

  private buildRescueArenaForLevel() {
    // Stage Backing Frame (Crisp Royal Indigo-Blue)
    const stageBack = new THREE.Mesh(
      new THREE.BoxGeometry(8.35, 5.15, 0.35),
      new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.5 })
    );
    stageBack.position.set(0, 3.82, -0.45);
    stageBack.receiveShadow = true;
    this.arenaGroup.add(stageBack);

    // Golden Bridge Divider between Rescue Arena & Match-3 Board
    this.addWallBeam(0, ARENA_BASE_Y - 0.12, 8.45, 0.22, 0xf59e0b);

    const sc = this.level.scene;
    const regionalSkin =
      this.level.isBoss
        ? ('boss_dragon' as const)
        : this.level.submergedFromRow !== undefined
          ? ('river_gharial' as const)
          : ('venom_naga' as const);

    if (sc === 'spiral_marble') {
      this.buildGlassSilo3D(-3.82, -2.15, 1.55, 4.75);
      this.buildPortal3D(-2.98, 5.55);

      // 3D G-Shaped Caramel-Gold Spiral Maze
      this.addWallBeam(1.05, 6.05, 5.8, 0.26); // Top ceiling
      this.addWallBeam(-1.75, 4.55, 0.26, 2.8); // Upper-left wall
      this.addWallBeam(1.05, 1.55, 5.8, 0.26); // Floor
      this.addWallBeam(3.85, 3.35, 0.26, 3.8); // Right outer wall
      this.addWallBeam(1.35, 4.75, 3.9, 0.24); // Inner top bar
      this.addWallBeam(-0.48, 3.85, 0.24, 1.9); // Inner vertical divider
      this.addWallBeam(0.92, 2.95, 2.95, 0.24); // Lip above Mochi

      this.addGate3D(-1.75, 2.28, 0.22, 1.25, 0xe2e8f0);

      this.curveMain = new THREE.CatmullRomCurve3([
        new THREE.Vector3(4.0, 5.42, 0.25),
        new THREE.Vector3(-1.12, 5.42, 0.25),
        new THREE.Vector3(-1.12, 3.45, 0.25),
        new THREE.Vector3(3.18, 3.45, 0.25),
        new THREE.Vector3(3.18, 2.18, 0.25),
        new THREE.Vector3(-0.15, 2.18, 0.25),
      ]);
      this.serpentMain = createSerpentRig3D(24, Boolean(this.level.isBoss), regionalSkin);
      this.arenaGroup.add(this.serpentMain.root);

      this.mochi.root.position.set(-1.05, 2.32, 0.34);
      this.arenaGroup.add(this.mochi.root);
      this.populateMarbles3D(this.level.initialMarbles);
    } else if (sc === 'lava_bridge') {
      // Vibrant Tangerine-Flame Sea (Crisp normal waves, zero bloom haze!)
      const lavaGeo = new RoundedBoxGeometry(8.1, 1.45, 0.58, 4, 0.1);
      const lavaMat = new THREE.MeshPhysicalMaterial({
        color: 0xff5400,
        roughness: 0.12,
        clearcoat: 0.95,
        normalMap: this.liquidNormalTex,
        normalScale: new THREE.Vector2(0.7, 0.7),
        envMapIntensity: 1.4,
      });
      this.lavaMesh = new THREE.Mesh(lavaGeo, lavaMat);
      this.lavaMesh.position.set(0, 1.95, 0.12);
      this.arenaGroup.add(this.lavaMesh);

      // Left & Right 3D Ledges
      this.addWallBeam(-3.1, 3.15, 1.9, 0.32);
      this.addWallBeam(3.1, 3.15, 1.9, 0.32);
      this.buildPortal3D(3.35, 4.05);

      // 4 Candy Wafer Bridge Planks across chasm
      for (let i = 0; i < 4; i++) {
        const plank = new THREE.Mesh(
          new RoundedBoxGeometry(0.96, 0.26, 0.62, 3, 0.05),
          new THREE.MeshPhysicalMaterial({
            color: 0xffbe0b,
            roughness: 0.18,
            clearcoat: 0.9,
          })
        );
        plank.position.set(-1.56 + i * 1.04, 3.15, 0.15);
        plank.visible = false;
        this.arenaGroup.add(plank);
        this.bridgePlanks.push(plank);
      }

      // Living 3D Volcanic Magma Crusher Golem!
      this.magmaGolem = createMagmaGolemRig3D();
      this.magmaGolem.root.scale.setScalar(0.95);
      this.magmaGolem.root.position.set(-3.75, 4.25, 0.28);
      this.arenaGroup.add(this.magmaGolem.root);

      this.mochi.root.position.set(-2.55, 4.02, 0.34);
      this.arenaGroup.add(this.mochi.root);
    } else if (sc === 'triple_key') {
      // Upper serpent corridor & Lower 3-Gate corridor
      this.addWallBeam(0, 6.05, 8.1, 0.26);
      this.addWallBeam(-0.55, 4.45, 6.9, 0.26);
      this.addWallBeam(3.92, 3.8, 0.26, 4.5);
      this.addWallBeam(0, 1.65, 8.1, 0.26);

      // 3 Color-Coded Crystal Gates (Ruby, Emerald, Sapphire)
      this.addGate3D(1.65, 3.02, 0.22, 2.45, 0xff3b5c);
      this.addGate3D(0.15, 3.02, 0.22, 2.45, 0x22c55e);
      this.addGate3D(-1.35, 3.02, 0.22, 2.45, 0x38bdf8);

      this.buildPortal3D(-3.15, 2.55);

      this.curveMain = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-3.7, 5.25, 0.25),
        new THREE.Vector3(3.25, 5.25, 0.25),
        new THREE.Vector3(3.25, 2.45, 0.25),
        new THREE.Vector3(-2.1, 2.45, 0.25),
      ]);
      this.serpentMain = createSerpentRig3D(22, Boolean(this.level.isBoss), regionalSkin);
      this.arenaGroup.add(this.serpentMain.root);

      this.mochi.root.position.set(2.4, 2.48, 0.34);
      this.arenaGroup.add(this.mochi.root);
    } else if (sc === 'frost_dual') {
      // Symmetrical U-Arena with Twin Glacier Frost Wyrms + Ceiling Frost Turret + Central Marble Silo!
      this.addWallBeam(0, 6.05, 8.1, 0.26);
      this.addWallBeam(-2.55, 3.95, 2.9, 0.24);
      this.addWallBeam(2.55, 3.95, 2.9, 0.24);

      this.buildGlassSilo3D(-0.98, 0.98, 1.55, 3.85);
      this.addGate3D(0, 3.95, 1.85, 0.22, 0x7dd3fc);
      this.buildPortal3D(0, 2.15);

      // Ceiling Frost Crystal Turret
      this.frostTurret = new THREE.Group();
      this.frostTurret.position.set(0, 5.55, 0.3);
      const turretCore = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.36, 1),
        new THREE.MeshPhysicalMaterial({
          color: 0x00bbf9,
          roughness: 0.06,
          clearcoat: 1,
        })
      );
      this.frostTurret.add(turretCore);
      this.arenaGroup.add(this.frostTurret);

      this.curveMain = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-3.95, 4.65, 0.25),
        new THREE.Vector3(-0.75, 4.65, 0.25),
      ]);
      this.curveTwin = new THREE.CatmullRomCurve3([
        new THREE.Vector3(3.95, 4.65, 0.25),
        new THREE.Vector3(0.75, 4.65, 0.25),
      ]);
      this.serpentMain = createSerpentRig3D(15, false, 'frost_wyrm');
      this.serpentTwin = createSerpentRig3D(15, false, 'frost_wyrm');
      this.arenaGroup.add(this.serpentMain.root, this.serpentTwin.root);

      this.mochi.root.position.set(0, 4.75, 0.34);
      this.arenaGroup.add(this.mochi.root);
      this.populateMarbles3D(this.level.initialMarbles);
    } else if (sc === 'boulder_run') {
      // Sloped 3D Ramp + Living 3D Armored Horned Juggernaut Beast!
      const ramp = new THREE.Mesh(
        new RoundedBoxGeometry(7.6, 0.3, 0.85, 3, 0.06),
        new THREE.MeshPhysicalMaterial({
          color: 0xf59e0b,
          roughness: 0.22,
          clearcoat: 0.85,
        })
      );
      ramp.position.set(-0.2, 3.25, 0.08);
      ramp.rotation.z = -0.32;
      this.arenaGroup.add(ramp);

      this.addGate3D(-0.35, 3.95, 0.22, 1.55, 0xfbbf24);
      this.addGate3D(1.55, 3.35, 0.22, 1.55, 0xfbbf24);
      this.buildPortal3D(3.35, 2.55);

      this.juggernautBeast = createJuggernautBeastRig3D();
      this.arenaGroup.add(this.juggernautBeast.root);

      this.mochi.root.position.set(0.5, 3.7, 0.34);
      this.arenaGroup.add(this.mochi.root);
    } else {
      // SCENE 6: BOSS LAIR — Sovereign Dragon King's Citadel!
      this.buildGlassSilo3D(-3.82, -2.15, 1.55, 4.75);
      this.buildPortal3D(-2.98, 5.55);

      this.addWallBeam(1.05, 6.05, 5.8, 0.26, 0xa855f7);
      this.addWallBeam(1.05, 1.55, 5.8, 0.26, 0xa855f7);
      this.addWallBeam(3.85, 3.8, 0.26, 4.5, 0xa855f7);
      this.addWallBeam(1.25, 4.65, 4.2, 0.22, 0xc084fc);
      this.addWallBeam(0.65, 3.25, 4.2, 0.22, 0xc084fc);

      this.addGate3D(-1.75, 2.35, 0.22, 1.35, 0xffcf33);

      // Rainbow Mega-Beam (activated during rescue victory!)
      this.rainbowBeam = new THREE.Mesh(
        new THREE.CylinderGeometry(0.22, 0.22, 4.8, 16),
        new THREE.MeshBasicMaterial({ color: 0x00f5d4 })
      );
      this.rainbowBeam.rotation.z = Math.PI * 0.5;
      this.rainbowBeam.position.set(1.2, 2.35, 0.35);
      this.rainbowBeam.visible = false;
      this.arenaGroup.add(this.rainbowBeam);

      this.curveMain = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-1.1, 5.38, 0.25),
        new THREE.Vector3(3.15, 5.38, 0.25),
        new THREE.Vector3(3.15, 3.95, 0.25),
        new THREE.Vector3(-1.05, 3.95, 0.25),
        new THREE.Vector3(-1.05, 2.28, 0.25),
        new THREE.Vector3(3.15, 2.28, 0.25),
        new THREE.Vector3(-0.15, 2.28, 0.25),
      ]);
      this.serpentMain = createSerpentRig3D(26, true, 'boss_dragon');
      this.arenaGroup.add(this.serpentMain.root);

      this.mochi.root.position.set(-1.05, 2.32, 0.34);
      this.arenaGroup.add(this.mochi.root);
      this.populateMarbles3D(this.level.initialMarbles);
    }
  }

  public spawnCandyExplosion(row: number, col: number, color: CandyColor, count: number = 9) {
    const origin = this.cellToWorld(row, col);
    const mat = this.marbleMats[color];
    for (let i = 0; i < count; i++) {
      const mesh = new THREE.Mesh(this.fragGeo, mat);
      mesh.position.copy(origin);
      const ang = Math.random() * Math.PI * 2;
      const spd = 2.2 + Math.random() * 4.2;
      this.fxGroup.add(mesh);
      this.fragments.push({
        mesh,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd + 1.4,
        vz: 1.5 + Math.random() * 2.8,
        rx: (Math.random() - 0.5) * 14,
        ry: (Math.random() - 0.5) * 14,
        life: 0,
        maxLife: 0.48 + Math.random() * 0.22,
      });
    }
  }

  public spawnBeamEffect(kind: 'row' | 'col' | 'bomb' | 'rainbow', row: number, col: number) {
    const pos = this.cellToWorld(row, col);
    let mesh: THREE.Mesh;

    if (kind === 'row') {
      mesh = new THREE.Mesh(
        new THREE.BoxGeometry(8.2, 0.36, 0.25),
        new THREE.MeshBasicMaterial({ color: 0xfff08a, transparent: true, opacity: 0.9 })
      );
      mesh.position.set(0, pos.y, 0.45);
    } else if (kind === 'col') {
      mesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.36, 7.2, 0.25),
        new THREE.MeshBasicMaterial({ color: 0xfff08a, transparent: true, opacity: 0.9 })
      );
      mesh.position.set(pos.x, BOARD_CENTER_Y, 0.45);
    } else {
      mesh = new THREE.Mesh(
        new THREE.TorusGeometry(0.45, 0.12, 12, 32),
        new THREE.MeshBasicMaterial({
          color: kind === 'rainbow' ? 0xf472b6 : 0xff922b,
          transparent: true,
          opacity: 0.92,
        })
      );
      mesh.position.set(pos.x, pos.y, 0.45);
    }

    this.fxGroup.add(mesh);
    this.shockwaves.push({ mesh, kind, life: 0, maxLife: 0.36 });
  }

  public releaseMarbles(count: number): number {
    const avail = this.marbles.filter((m) => !m.draining).sort((a, b) => a.y - b.y);
    const slice = avail.slice(0, count);
    slice.forEach((m, idx) => {
      m.draining = true;
      m.vy = -1.2 - idx * 0.25;
      m.vx = (Math.random() - 0.5) * 1.4;
      m.z = 0.62;
    });
    return slice.length;
  }

  public spawnFlyingProjectile(
    kind: 'key' | 'plank' | 'frost' | 'slime',
    startWorld: THREE.Vector3,
    endWorld: THREE.Vector3
  ) {
    let obj: THREE.Object3D;
    if (kind === 'key') {
      obj = createCandyMesh3D('yellow', 'key');
    } else if (kind === 'frost') {
      obj = createCandyMesh3D('blue', 'none');
    } else if (kind === 'plank') {
      obj = createCandyMesh3D('orange', 'none');
    } else {
      obj = new THREE.Mesh(
        new THREE.SphereGeometry(0.24, 14, 12),
        new THREE.MeshPhysicalMaterial({ color: 0x3ef068, roughness: 0.1, clearcoat: 1 })
      );
    }
    obj.position.copy(startWorld);
    this.fxGroup.add(obj);
    this.projectiles.push({
      mesh: obj,
      start: startWorld.clone(),
      end: endWorld.clone(),
      progress: 0,
    });
  }

  private stepPhysics(dt: number) {
    const step = Math.min(dt, 0.033);
    const { xMin, xMax, yMin, yMax } = this.siloBounds;
    const siloList = this.marbles.filter((m) => !m.draining);

    for (const m of this.marbles) {
      if (!m.draining) {
        m.vy -= 9.5 * step;
        m.x += m.vx * step;
        m.y += m.vy * step;
        m.vx *= 0.9;
        m.vy *= 0.9;
        m.x = THREE.MathUtils.clamp(m.x, xMin + m.r, xMax - m.r);
        m.y = THREE.MathUtils.clamp(m.y, yMin + m.r, yMax - m.r);
      } else {
        m.vy -= 14 * step;
        m.x += m.vx * step;
        m.y += m.vy * step;
        if (m.y < -5.8) m.life -= step * 4;
      }
    }

    // Relaxation for 3D marbles in glass silo
    for (let iter = 0; iter < 2; iter++) {
      for (let i = 0; i < siloList.length; i++) {
        const a = siloList[i];
        for (let j = i + 1; j < siloList.length; j++) {
          const b = siloList[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const minD = a.r + b.r;
          const dSq = dx * dx + dy * dy;
          if (dSq > 0.00001 && dSq < minD * minD) {
            const d = Math.sqrt(dSq);
            const push = (minD - d) * 0.5;
            const nx = dx / d;
            const ny = dy / d;
            a.x -= nx * push;
            a.y -= ny * push;
            b.x += nx * push;
            b.y += ny * push;
          }
        }
        a.x = THREE.MathUtils.clamp(a.x, xMin + a.r, xMax - a.r);
        a.y = Math.max(yMin + a.r, a.y);
      }
    }

    for (const m of this.marbles) {
      m.mesh.position.set(m.x, m.y, m.z);
      if (m.life < 1) {
        m.mesh.scale.setScalar(Math.max(0.01, m.life));
      }
    }
    this.marbles = this.marbles.filter((m) => {
      if (m.life <= 0) {
        this.fxGroup.remove(m.mesh);
        return false;
      }
      return true;
    });

    // Step 3D Candy Shatter Fragments
    for (const f of this.fragments) {
      f.life += step;
      f.vy -= 12 * step;
      f.mesh.position.x += f.vx * step;
      f.mesh.position.y += f.vy * step;
      f.mesh.position.z += f.vz * step;
      f.mesh.rotation.x += f.rx * step;
      f.mesh.rotation.y += f.ry * step;
      const s = Math.max(0.01, 1 - f.life / f.maxLife);
      f.mesh.scale.setScalar(s);
    }
    this.fragments = this.fragments.filter((f) => {
      if (f.life >= f.maxLife) {
        this.fxGroup.remove(f.mesh);
        return false;
      }
      return true;
    });

    // Step 3D Shockwaves & Beams
    for (const sw of this.shockwaves) {
      sw.life += step;
      const p = sw.life / sw.maxLife;
      if (sw.kind === 'bomb' || sw.kind === 'rainbow') {
        sw.mesh.scale.setScalar(1 + p * 4.2);
      } else {
        sw.mesh.scale.y = sw.kind === 'row' ? 1 - p * 0.7 : 1;
        sw.mesh.scale.x = sw.kind === 'col' ? 1 - p * 0.7 : 1;
      }
      (sw.mesh.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 1 - p);
    }
    this.shockwaves = this.shockwaves.filter((sw) => {
      if (sw.life >= sw.maxLife) {
        this.fxGroup.remove(sw.mesh);
        return false;
      }
      return true;
    });

    // Step 3D Flying Projectiles
    for (const pr of this.projectiles) {
      pr.progress += step * 2.3;
      const t = Math.min(1, pr.progress);
      pr.mesh.position.lerpVectors(pr.start, pr.end, t);
      pr.mesh.position.z += Math.sin(t * Math.PI) * 1.4;
      pr.mesh.rotation.z += step * 6;
    }
    this.projectiles = this.projectiles.filter((pr) => {
      if (pr.progress >= 1) {
        this.fxGroup.remove(pr.mesh);
        return false;
      }
      return true;
    });
  }

  public updateAndRender(dt: number, time: number, state: WorldSyncState) {
    const canvas = this.renderer.domElement;
    const width = canvas.clientWidth || 520;
    const height = canvas.clientHeight || 770;
    if (canvas.width !== Math.floor(width * this.renderer.getPixelRatio()) || canvas.height !== Math.floor(height * this.renderer.getPixelRatio())) {
      this.renderer.setSize(width, height, false);
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    }

    // Animate 3D Liquid Normal Waves (Lava & Monsoon Water)
    this.liquidNormalTex.offset.x = (time * 0.14) % 1;
    this.liquidNormalTex.offset.y = Math.sin(time * 0.65) * 0.18;

    this.stepPhysics(dt);

    // 1. Camera micro-sway & explosion shake (Zero neon danger glow!)
    let camX = 0;
    let camY = 0.35;
    if (state.danger > 55 && state.status === 'playing') {
      const intensity = ((state.danger - 55) / 45) * 0.06;
      camX += Math.sin(time * 8) * intensity;
      camY += Math.cos(time * 6.5) * intensity;
    }

    if (state.shakeTimer > 0) {
      const mag = state.shakeTimer * 0.45;
      camX += (Math.random() - 0.5) * mag;
      camY += (Math.random() - 0.5) * mag;
    }
    this.camera.position.set(camX, camY, 21.2);
    this.camera.lookAt(0, 0.05, 0);

    if (this.portalRing) {
      this.portalRing.rotation.z = time * 2.5;
    }

    // 2. Sync Board Candies & Blockers by ID
    const activePieceIds = new Set<number>();
    const activeBlockerKeys = new Set<string>();

    for (let r = 0; r < state.grid.length; r++) {
      for (let c = 0; c < state.grid[r].length; c++) {
        const cell = state.grid[r][c];
        const bKey = `${r},${c}`;

        if (cell.blocker !== 'none') {
          activeBlockerKeys.add(bKey);
          const existingB = this.blockerEntries.get(bKey);
          if (!existingB || existingB.blocker !== cell.blocker) {
            if (existingB) this.boardGroup.remove(existingB.mesh);
            const bm = createBlockerMesh3D(cell.blocker);
            if (bm) {
              const wPos = this.cellToWorld(r, c);
              bm.position.copy(wPos);
              this.boardGroup.add(bm);
              this.blockerEntries.set(bKey, { mesh: bm, blocker: cell.blocker });
            }
          }
        }

        const p = cell.candy;
        if (!p) continue;
        activePieceIds.add(p.id);

        let entry = this.candyEntries.get(p.id);
        if (!entry || entry.color !== p.color || entry.special !== p.special) {
          if (entry) this.boardGroup.remove(entry.mesh);
          const mesh = createCandyMesh3D(p.color, p.special);
          this.boardGroup.add(mesh);
          const body = mesh.getObjectByName('candyBody') ?? null;
          const spinRing = body?.getObjectByName('spinRing') ?? null;
          entry = { mesh, color: p.color, special: p.special, body, spinRing };
          this.candyEntries.set(p.id, entry);
        }

        const wx = this.boardOriginX + p.visX * TILE_PITCH;
        const wy = this.boardOriginY - p.visY * TILE_PITCH;
        const isSelected =
          state.selectedCell?.row === r && state.selectedCell?.col === c;
        const wob = p.wobble > 0 ? Math.sin(time * 34) * p.wobble * 0.08 : 0;

        entry.mesh.position.set(wx + wob, wy, isSelected ? 0.52 : 0.22);
        const sc = p.scale * (isSelected ? 1.14 : 1.0);
        entry.mesh.scale.setScalar(sc);

        const body = entry.body;
        if (body) {
          body.rotation.y = isSelected
            ? time * 3.2
            : Math.sin(time * 2.1 + p.id * 0.7) * 0.16;
          const spinRing = entry.spinRing;
          if (spinRing) {
            spinRing.rotation.z = time * 2.8;
            spinRing.rotation.x = Math.sin(time * 2) * 0.35;
          }
        }

        if (isSelected) {
          this.selectionRing.visible = true;
          this.selectionRing.position.set(wx, wy, 0.15);
          this.selectionRing.scale.setScalar(1 + Math.sin(time * 9) * 0.06);
        }
      }
    }

    if (!state.selectedCell) {
      this.selectionRing.visible = false;
    }

    for (const [id, entry] of this.candyEntries.entries()) {
      if (!activePieceIds.has(id)) {
        this.boardGroup.remove(entry.mesh);
        this.candyEntries.delete(id);
      }
    }
    for (const [key, entry] of this.blockerEntries.entries()) {
      if (!activeBlockerKeys.has(key)) {
        this.boardGroup.remove(entry.mesh);
        this.blockerEntries.delete(key);
      }
    }

    // 3. 3D Hint Hand Cursor
    if (state.showHint && state.hintMove) {
      this.hintHand.visible = true;
      const p1 = this.cellToWorld(state.hintMove.r1, state.hintMove.c1);
      const p2 = this.cellToWorld(state.hintMove.r2, state.hintMove.c2);
      const slide = (Math.sin(time * 4.2) + 1) * 0.5;
      this.hintHand.position.lerpVectors(p1, p2, slide);
      this.hintHand.position.y -= 0.25;
      this.hintHand.position.z = 0.85 + Math.sin(time * 8.4) * 0.08;
    } else {
      this.hintHand.visible = false;
    }

    // 4. Update Rescue Arena Actors & Scene Mechanics!
    const overallRatio =
      state.tasks.length > 0
        ? state.tasks.reduce((a, t) => a + Math.min(1, t.current / t.target), 0) /
          state.tasks.length
        : 0;
    const isFrozen = state.freezeTimer > 0;
    const isRescued = state.status === 'rescuing' || state.status === 'won';
    const rp = state.status === 'won' ? 1 : state.rescueAnimProgress;

    if (this.level.scene === 'spiral_marble') {
      const gate = this.gates[0];
      if (gate) {
        const open = isRescued ? 1 : overallRatio * 0.85;
        gate.position.y = gate.userData.baseY + open * 1.15;
      }
      if (this.serpentMain && this.curveMain) {
        updateSerpentAlongCurve(
          this.serpentMain,
          this.curveMain,
          state.danger / 100,
          time,
          isFrozen,
          Boolean(this.level.isBoss)
        );
      }
      const mx = isRescued ? THREE.MathUtils.lerp(-1.05, -2.98, Math.min(1, rp * 1.3)) : -1.05;
      const my = isRescued ? THREE.MathUtils.lerp(2.32, 5.35, Math.max(0, (rp - 0.25) / 0.75)) : 2.32;
      this.mochi.root.position.set(mx, my, 0.34);
    } else if (this.level.scene === 'lava_bridge') {
      if (this.lavaMesh) {
        this.lavaMesh.position.y = 1.65 + (state.danger / 100) * 0.92 + Math.sin(time * 3.5) * 0.05;
      }
      if (this.magmaGolem) {
        this.magmaGolem.root.position.x = -3.75 + (state.danger / 100) * 1.68;
        updateMagmaGolemAnimation(this.magmaGolem, time, isFrozen);
      }
      const builtCount = isRescued ? 4 : Math.min(4, Math.floor(overallRatio * 4 + 0.001));
      this.bridgePlanks.forEach((pl, idx) => {
        pl.visible = idx < builtCount;
      });
      const baseX = builtCount === 0 ? -2.45 : -1.56 + (builtCount - 1) * 1.04;
      const mx = isRescued ? THREE.MathUtils.lerp(baseX, 3.35, rp) : baseX;
      this.mochi.root.position.set(mx, 3.95, 0.34);
    } else if (this.level.scene === 'triple_key') {
      const keysDone = state.tasks.find((t) => t.kind === 'keys')?.current ?? 0;
      this.gates.forEach((g, idx) => {
        const open = isRescued || keysDone > idx ? 1 : 0;
        g.position.y = g.userData.baseY + open * 2.1;
      });
      if (this.serpentMain && this.curveMain) {
        updateSerpentAlongCurve(
          this.serpentMain,
          this.curveMain,
          state.danger / 100,
          time,
          isFrozen,
          Boolean(this.level.isBoss)
        );
      }
      const stops = [2.4, 0.9, -0.6, -2.05];
      const curX = stops[Math.min(3, keysDone)];
      const mx = isRescued ? THREE.MathUtils.lerp(curX, -3.15, rp) : curX;
      this.mochi.root.position.set(mx, 2.48, 0.34);
    } else if (this.level.scene === 'frost_dual') {
      if (this.frostTurret) {
        this.frostTurret.rotation.y = time * 2.2;
      }
      const gate = this.gates[0];
      if (gate) {
        const open = isRescued ? 1 : overallRatio * 0.65;
        gate.scale.x = Math.max(0.05, 1 - open);
      }
      if (this.serpentMain && this.curveMain && this.serpentTwin && this.curveTwin) {
        updateSerpentAlongCurve(
          this.serpentMain,
          this.curveMain,
          state.danger / 100,
          time,
          isFrozen,
          false,
          0.65
        );
        updateSerpentAlongCurve(
          this.serpentTwin,
          this.curveTwin,
          state.danger / 100,
          time + 1.1,
          isFrozen,
          false,
          0.65
        );
      }
      const my = isRescued ? THREE.MathUtils.lerp(4.75, 2.15, rp) : 4.75;
      this.mochi.root.position.set(0, my, 0.34);
    } else if (this.level.scene === 'boulder_run') {
      this.gates.forEach((g, idx) => {
        const open = isRescued ? 1 : Math.min(1, Math.max(0, overallRatio * 2 - idx));
        g.position.y = g.userData.baseY + open * 1.5;
      });
      const mochiT = isRescued ? 0.6 + 0.4 * rp : 0.35 + overallRatio * 0.45;
      const mx = THREE.MathUtils.lerp(-3.2, 3.35, mochiT);
      const my = THREE.MathUtils.lerp(4.92, 2.62, mochiT);
      this.mochi.root.position.set(mx, my, 0.34);

      if (this.juggernautBeast) {
        const bT = (state.danger / 100) * (mochiT - 0.12);
        this.juggernautBeast.root.position.set(
          THREE.MathUtils.lerp(-3.5, 3.35, bT),
          THREE.MathUtils.lerp(5.1, 2.75, bT),
          0.25
        );
        this.juggernautBeast.armorMat.color.setHex(isFrozen ? 0x38bdf8 : 0xff0a54);
        if (!isFrozen) {
          this.juggernautBeast.wheelBody.rotation.z -= dt * 5.8;
          this.juggernautBeast.headVisor.position.y = 0.12 + Math.sin(time * 8) * 0.05;
        }
      }
    } else {
      // Boss Mission 6
      const gate = this.gates[0];
      if (gate) {
        const open = isRescued ? 1 : overallRatio * 0.9;
        gate.position.y = gate.userData.baseY + open * 1.25;
      }
      const pushback = isRescued ? rp * 0.65 : 0;
      if (this.serpentMain && this.curveMain) {
        updateSerpentAlongCurve(
          this.serpentMain,
          this.curveMain,
          Math.max(0.06, state.danger / 100 - pushback),
          time,
          isFrozen,
          true
        );
      }
      if (this.rainbowBeam) {
        this.rainbowBeam.visible = isRescued;
        this.rainbowBeam.scale.x = 1 + Math.sin(time * 28) * 0.25;
      }
      const mx = isRescued ? THREE.MathUtils.lerp(-1.05, -2.98, Math.min(1, rp * 1.25)) : -1.05;
      const my = isRescued ? THREE.MathUtils.lerp(2.32, 5.35, Math.max(0, (rp - 0.25) / 0.75)) : 2.32;
      this.mochi.root.position.set(mx, my, 0.34);
    }

    updateMochiRigAnimation(this.mochi, {
      time,
      danger: state.danger,
      status: state.status,
      happyTimer: state.happyTimer,
      surprisedTimer: state.surprisedTimer,
      isMoving: state.status === 'rescuing',
    });

    this.applySnakeCombatVisuals(state, dt, time);

    // Mochi caught by the Snake: tipped over and jolted (instant death pose)
    if (state.mochiCaught) {
      this.mochi.root.rotation.z = THREE.MathUtils.lerp(this.mochi.root.rotation.z, -1.1, Math.min(1, dt * 6));
      this.mochi.root.position.y -= 0.3;
      this.mochi.root.position.x += Math.sin(time * 42) * 0.035;
    }

    this.renderer.render(this.scene, this.camera);
  }

  public dispose() {
    // Free GPU buffers/programs for everything this mission created.
    // Shared geometry/material caches are simply re-uploaded if used again.
    this.scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.geometry?.dispose();
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      for (const m of mats) m?.dispose();
    });
    this.candyEntries.clear();
    this.blockerEntries.clear();
    this.liquidNormalTex.dispose();
    this.envTex.dispose();
    this.renderer.dispose();
  }
}
