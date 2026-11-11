import * as THREE from 'three';
import {
  BlockerType,
  CandyColor,
  GameStatus,
  GridCell,
  LevelConfig,
  SpecialType,
  TaskProgress,
} from '../types/game';
import { HintMove, isSolidBlocker } from '../engine/match3';
import { createCandyStudioEnvironment, setupCinematicLights, StudioLights } from './studioEnv';
import {
  CANDY_HEX,
  createBlockerMesh3D,
  createCandyMesh3D,
  createHintHand3D,
} from './candyMeshes3D';
import { createMochiRig3D, MochiRig3D, updateMochiRigAnimation } from './mochiCharacter3D';
import { createSerpentRig3D, SerpentRig3D, updateSerpentAlongCurve } from './serpentMonster3D';

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
  selectedCell: { row: number; col: number } | null;
  hintMove: HintMove | null;
  showHint: boolean;
}

const TILE_PITCH = 0.96;
const BOARD_CENTER_Y = -2.62;
const ARENA_BASE_Y = 1.32;

export class RescueWorld3D {
  public renderer: THREE.WebGLRenderer;
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  private lights: StudioLights;
  private envTex: THREE.Texture;

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
    { mesh: THREE.Group; color: CandyColor; special: SpecialType }
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
  private spikeWallGroup: THREE.Group | null = null;
  private boulderGroup: THREE.Group | null = null;
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

  constructor(canvas: HTMLCanvasElement, level: LevelConfig) {
    this.level = level;
    this.boardOriginX = -((level.cols - 1) * TILE_PITCH) * 0.5;
    this.boardOriginY = BOARD_CENTER_Y + ((level.rows - 1) * TILE_PITCH) * 0.5;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.12;

    this.scene = new THREE.Scene();
    const skyHex = level.themePalette?.sky ?? '#141d38';
    this.scene.background = new THREE.Color(skyHex);
    this.scene.fog = new THREE.FogExp2(skyHex, 0.018);

    this.envTex = createCandyStudioEnvironment(this.renderer);
    this.scene.environment = this.envTex;

    this.camera = new THREE.PerspectiveCamera(34, 520 / 770, 0.5, 65);
    this.camera.position.set(0, 0.35, 21.2);
    this.camera.lookAt(0, 0.05, 0);

    this.lights = setupCinematicLights(this.scene);

    this.marbleMats = {
      red: new THREE.MeshPhysicalMaterial({ color: 0xff1e4d, roughness: 0.08, clearcoat: 1 }),
      blue: new THREE.MeshPhysicalMaterial({ color: 0x0ea5e9, roughness: 0.08, clearcoat: 1 }),
      yellow: new THREE.MeshPhysicalMaterial({ color: 0xfacc15, roughness: 0.08, clearcoat: 1 }),
      green: new THREE.MeshPhysicalMaterial({ color: 0x22c55e, roughness: 0.08, clearcoat: 1 }),
      purple: new THREE.MeshPhysicalMaterial({ color: 0xa855f7, roughness: 0.08, clearcoat: 1 }),
      orange: new THREE.MeshPhysicalMaterial({ color: 0xf97316, roughness: 0.08, clearcoat: 1 }),
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
    this.mochi.root.scale.setScalar(0.88);

    this.buildFantasyBackdrop();
    this.buildBoardTray3D();
    this.buildRescueArenaForLevel();
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
    // Enchanted Regional Backdrop Wall & Pillars
    const wallMat = new THREE.MeshStandardMaterial({
      color: this.level.themePalette?.wall ?? '#1e2d52',
      roughness: 0.65,
      metalness: 0.1,
    });
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(11.5, 15.5, 0.5), wallMat);
    backWall.position.set(0, 0.2, -1.35);
    backWall.receiveShadow = true;
    this.scene.add(backWall);

    // Decorative Side Columns
    const pillarMat = new THREE.MeshPhysicalMaterial({
      color: this.level.themePalette?.pillar ?? '#ff5c8a',
      roughness: 0.25,
      clearcoat: 0.7,
    });
    const goldCapMat = new THREE.MeshPhysicalMaterial({
      color: 0xffcf40,
      roughness: 0.2,
      metalness: 0.8,
      clearcoat: 1,
    });

    for (const side of [-1, 1]) {
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.32, 13.8, 16), pillarMat);
      col.position.set(side * 4.55, 0.2, -0.75);
      this.scene.add(col);

      for (const capY of [-6.3, 0.95, 6.25]) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.08, 10, 20), goldCapMat);
        ring.rotation.x = Math.PI * 0.5;
        ring.position.set(side * 4.55, capY, -0.75);
        this.scene.add(ring);
      }

      // Decorative Candy Finials at top corners!
      const lolli = new THREE.Mesh(
        new THREE.CylinderGeometry(0.42, 0.42, 0.18, 20),
        new THREE.MeshPhysicalMaterial({
          color: side < 0 ? 0xff477e : 0x38bdf8,
          roughness: 0.12,
          clearcoat: 1,
        })
      );
      lolli.rotation.x = Math.PI * 0.5;
      lolli.position.set(side * 4.55, 6.65, -0.65);
      this.scene.add(lolli);
    }
  }

  private buildBoardTray3D() {
    const trayW = this.level.cols * TILE_PITCH + 0.58;
    const trayH = this.level.rows * TILE_PITCH + 0.58;

    // Outer Beveled Frame
    const frameMat = new THREE.MeshPhysicalMaterial({
      color: this.level.themePalette?.tray ?? '#f59e0b',
      emissive: 0x2b1103,
      roughness: 0.22,
      metalness: 0.35,
      clearcoat: 0.9,
    });
    const outerTray = new THREE.Mesh(new THREE.BoxGeometry(trayW, trayH, 0.42), frameMat);
    outerTray.position.set(0, BOARD_CENTER_Y, -0.32);
    outerTray.receiveShadow = true;
    this.boardGroup.add(outerTray);

    // Inner Royal-Sapphire Velvet Board Backing
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x13203d,
      roughness: 0.55,
    });
    const innerTray = new THREE.Mesh(
      new THREE.BoxGeometry(trayW - 0.28, trayH - 0.28, 0.44),
      innerMat
    );
    innerTray.position.set(0, BOARD_CENTER_Y, -0.26);
    this.boardGroup.add(innerTray);

    // Individual Recessed 3D Tile Wells
    const tileLight = new THREE.MeshStandardMaterial({ color: 0x223660, roughness: 0.45 });
    const tileDark = new THREE.MeshStandardMaterial({ color: 0x19294d, roughness: 0.5 });
    const tileDrain = new THREE.MeshStandardMaterial({
      color: 0x4a3418,
      emissive: 0x291802,
      roughness: 0.38,
    });
    const tileFlood = new THREE.MeshPhysicalMaterial({
      color: 0x0e7490,
      emissive: 0x083344,
      roughness: 0.16,
      clearcoat: 0.9,
    });
    const tileWind = new THREE.MeshStandardMaterial({
      color: 0x115e59,
      emissive: 0x042f2e,
      roughness: 0.35,
    });
    const tileGeo = new THREE.BoxGeometry(TILE_PITCH * 0.92, TILE_PITCH * 0.92, 0.08);
    const arrowGeo = new THREE.ConeGeometry(0.12, 0.2, 4);
    const arrowMat = new THREE.MeshBasicMaterial({ color: 0xffde59 });

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
        well.position.set(pos.x, pos.y, -0.04);
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
  }

  private addWallBeam(x: number, y: number, w: number, h: number, color = 0xf9841a) {
    const mat = new THREE.MeshPhysicalMaterial({
      color,
      emissive: 0x3b1702,
      roughness: 0.22,
      metalness: 0.12,
      clearcoat: 0.85,
    });
    const beam = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.68), mat);
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
      color: 0xffcf33,
      emissive: 0x693f00,
      roughness: 0.15,
      metalness: 0.85,
      clearcoat: 1,
    });
    const arch = new THREE.Mesh(new THREE.TorusGeometry(0.56, 0.11, 14, 32), archMat);
    this.portalGroup.add(arch);

    const vortex = new THREE.Mesh(
      new THREE.CircleGeometry(0.5, 28),
      new THREE.MeshBasicMaterial({ color: 0xfff3b0 })
    );
    vortex.position.z = -0.04;
    this.portalGroup.add(vortex);

    this.portalRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.34, 0.035, 8, 24),
      new THREE.MeshBasicMaterial({ color: 0xff8800 })
    );
    this.portalRing.position.z = 0.04;
    this.portalGroup.add(this.portalRing);

    this.lights.portalLight.position.set(x, y, 1.4);
    this.arenaGroup.add(this.portalGroup);
  }

  private addGate3D(x: number, y: number, w: number, h: number, hexColor: number) {
    const gate = new THREE.Mesh(
      new THREE.BoxGeometry(w, h, 0.56),
      new THREE.MeshPhysicalMaterial({
        color: hexColor,
        roughness: 0.2,
        metalness: 0.72,
        clearcoat: 0.9,
      })
    );
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
      new THREE.BoxGeometry(w, h, 0.52),
      new THREE.MeshPhysicalMaterial({
        color: 0xbbeeff,
        transparent: true,
        opacity: 0.24,
        roughness: 0.05,
        clearcoat: 1,
      })
    );
    glass.position.set(cx, cy, 0.2);
    this.arenaGroup.add(glass);

    this.addWallBeam(xMin - 0.09, cy, 0.16, h + 0.1, 0xfbbf24);
    this.addWallBeam(xMax + 0.09, cy, 0.16, h + 0.1, 0xfbbf24);
  }

  private buildRescueArenaForLevel() {
    // Stage Backing Frame
    const stageBack = new THREE.Mesh(
      new THREE.BoxGeometry(8.35, 5.15, 0.35),
      new THREE.MeshStandardMaterial({ color: 0x182747, roughness: 0.55 })
    );
    stageBack.position.set(0, 3.82, -0.45);
    stageBack.receiveShadow = true;
    this.arenaGroup.add(stageBack);

    // Golden Bridge Divider between Rescue Arena & Match-3 Board
    this.addWallBeam(0, ARENA_BASE_Y - 0.12, 8.45, 0.22, 0xf59e0b);

    const sc = this.level.scene;

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
      this.serpentMain = createSerpentRig3D(24, false);
      this.arenaGroup.add(this.serpentMain.root);

      this.mochi.root.position.set(-1.05, 2.22, 0.28);
      this.arenaGroup.add(this.mochi.root);
      this.populateMarbles3D(this.level.initialMarbles);
    } else if (sc === 'lava_bridge') {
      // Molten Caramel Sea at bottom of arena
      const lavaGeo = new THREE.BoxGeometry(8.1, 1.45, 0.55, 24, 4, 2);
      const lavaMat = new THREE.MeshPhysicalMaterial({
        color: 0xff6d00,
        emissive: 0xd93800,
        emissiveIntensity: 0.75,
        roughness: 0.14,
        clearcoat: 1.0,
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
          new THREE.BoxGeometry(0.96, 0.26, 0.62),
          new THREE.MeshPhysicalMaterial({
            color: 0xffcf33,
            emissive: 0x6b3c00,
            roughness: 0.18,
            clearcoat: 0.9,
          })
        );
        plank.position.set(-1.56 + i * 1.04, 3.15, 0.15);
        plank.visible = false;
        this.arenaGroup.add(plank);
        this.bridgePlanks.push(plank);
      }

      // Advancing Spiked Crusher Wall
      this.spikeWallGroup = new THREE.Group();
      const wallBody = new THREE.Mesh(
        new THREE.BoxGeometry(0.55, 2.6, 0.68),
        new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.75, roughness: 0.3 })
      );
      this.spikeWallGroup.add(wallBody);
      const spikeGeo = new THREE.ConeGeometry(0.14, 0.36, 8);
      const spikeMat = new THREE.MeshStandardMaterial({
        color: 0xf1f5f9,
        metalness: 0.85,
        roughness: 0.2,
      });
      for (const sy of [-0.9, -0.3, 0.3, 0.9]) {
        const sp = new THREE.Mesh(spikeGeo, spikeMat);
        sp.rotation.z = -Math.PI * 0.5;
        sp.position.set(0.42, sy, 0);
        this.spikeWallGroup.add(sp);
      }
      this.spikeWallGroup.position.set(-3.85, 4.55, 0.2);
      this.arenaGroup.add(this.spikeWallGroup);

      this.mochi.root.position.set(-2.55, 3.92, 0.28);
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
      this.serpentMain = createSerpentRig3D(22, false);
      this.arenaGroup.add(this.serpentMain.root);

      this.mochi.root.position.set(2.4, 2.38, 0.28);
      this.arenaGroup.add(this.mochi.root);
    } else if (sc === 'frost_dual') {
      // Symmetrical U-Arena with Twin Serpents + Ceiling Frost Turret + Central Marble Silo!
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
          color: 0x38bdf8,
          emissive: 0x0284c7,
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
      this.serpentMain = createSerpentRig3D(15, false);
      this.serpentTwin = createSerpentRig3D(15, false);
      this.arenaGroup.add(this.serpentMain.root, this.serpentTwin.root);

      this.mochi.root.position.set(0, 4.65, 0.28);
      this.arenaGroup.add(this.mochi.root);
      this.populateMarbles3D(this.level.initialMarbles);
    } else if (sc === 'boulder_run') {
      // Sloped 3D Ramp + Giant Spiked Jawbreaker Boulder!
      const ramp = new THREE.Mesh(
        new THREE.BoxGeometry(7.6, 0.3, 0.85),
        new THREE.MeshPhysicalMaterial({
          color: 0xf59e0b,
          roughness: 0.25,
          clearcoat: 0.8,
        })
      );
      ramp.position.set(-0.2, 3.25, 0.08);
      ramp.rotation.z = -0.32;
      this.arenaGroup.add(ramp);

      this.addGate3D(-0.35, 3.95, 0.22, 1.55, 0xfbbf24);
      this.addGate3D(1.55, 3.35, 0.22, 1.55, 0xfbbf24);
      this.buildPortal3D(3.35, 2.55);

      this.boulderGroup = new THREE.Group();
      const jawSphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.78, 26, 22),
        new THREE.MeshPhysicalMaterial({
          color: 0xe11d48,
          emissive: 0x4c0519,
          roughness: 0.14,
          clearcoat: 1,
        })
      );
      this.boulderGroup.add(jawSphere);
      const spikeGeo = new THREE.ConeGeometry(0.13, 0.34, 8);
      const spikeMat = new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        metalness: 0.85,
        roughness: 0.2,
      });
      for (let i = 0; i < 12; i++) {
        const ang = (i / 12) * Math.PI * 2;
        const sp = new THREE.Mesh(spikeGeo, spikeMat);
        sp.position.set(Math.cos(ang) * 0.85, Math.sin(ang) * 0.85, 0);
        sp.rotation.z = ang - Math.PI * 0.5;
        this.boulderGroup.add(sp);
      }
      this.arenaGroup.add(this.boulderGroup);

      this.mochi.root.position.set(0.5, 3.6, 0.28);
      this.arenaGroup.add(this.mochi.root);
    } else {
      // SCENE 6: BOSS LAIR — Serpent King's Citadel!
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
        new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
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
      this.serpentMain = createSerpentRig3D(26, true);
      this.arenaGroup.add(this.serpentMain.root);

      this.mochi.root.position.set(-1.05, 2.22, 0.28);
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

    this.stepPhysics(dt);

    // 1. Camera micro-sway & explosion shake + Dynamic Danger Rim Lighting!
    let camX = 0;
    let camY = 0.35;
    if (state.danger > 55 && state.status === 'playing') {
      const intensity = ((state.danger - 55) / 45) * 0.06;
      camX += Math.sin(time * 8) * intensity;
      camY += Math.cos(time * 6.5) * intensity;
      this.lights.dangerLight.intensity = ((state.danger - 50) / 50) * 3.8 * (0.65 + 0.35 * Math.sin(time * 9));
    } else {
      this.lights.dangerLight.intensity = 0;
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
          entry = { mesh, color: p.color, special: p.special };
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

        const body = entry.mesh.getObjectByName('candyBody');
        if (body) {
          body.rotation.y = isSelected
            ? time * 3.2
            : Math.sin(time * 2.1 + p.id * 0.7) * 0.16;
          const spinRing = body.getObjectByName('spinRing');
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
          false
        );
      }
      const mx = isRescued ? THREE.MathUtils.lerp(-1.05, -2.98, Math.min(1, rp * 1.3)) : -1.05;
      const my = isRescued ? THREE.MathUtils.lerp(2.22, 5.35, Math.max(0, (rp - 0.25) / 0.75)) : 2.22;
      this.mochi.root.position.set(mx, my, 0.28);
    } else if (this.level.scene === 'lava_bridge') {
      if (this.lavaMesh) {
        this.lavaMesh.position.y = 1.65 + (state.danger / 100) * 0.92 + Math.sin(time * 3.5) * 0.05;
      }
      if (this.spikeWallGroup) {
        this.spikeWallGroup.position.x = -3.85 + (state.danger / 100) * 1.65;
      }
      const builtCount = isRescued ? 4 : Math.min(4, Math.floor(overallRatio * 4 + 0.001));
      this.bridgePlanks.forEach((pl, idx) => {
        pl.visible = idx < builtCount;
      });
      const baseX = builtCount === 0 ? -2.45 : -1.56 + (builtCount - 1) * 1.04;
      const mx = isRescued ? THREE.MathUtils.lerp(baseX, 3.35, rp) : baseX;
      this.mochi.root.position.set(mx, 3.85, 0.28);
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
          false
        );
      }
      const stops = [2.4, 0.9, -0.6, -2.05];
      const curX = stops[Math.min(3, keysDone)];
      const mx = isRescued ? THREE.MathUtils.lerp(curX, -3.15, rp) : curX;
      this.mochi.root.position.set(mx, 2.38, 0.28);
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
      const my = isRescued ? THREE.MathUtils.lerp(4.65, 2.15, rp) : 4.65;
      this.mochi.root.position.set(0, my, 0.28);
    } else if (this.level.scene === 'boulder_run') {
      this.gates.forEach((g, idx) => {
        const open = isRescued ? 1 : Math.min(1, Math.max(0, overallRatio * 2 - idx));
        g.position.y = g.userData.baseY + open * 1.5;
      });
      const mochiT = isRescued ? 0.6 + 0.4 * rp : 0.35 + overallRatio * 0.45;
      const mx = THREE.MathUtils.lerp(-3.2, 3.35, mochiT);
      const my = THREE.MathUtils.lerp(4.85, 2.55, mochiT);
      this.mochi.root.position.set(mx, my, 0.28);

      if (this.boulderGroup) {
        const bT = (state.danger / 100) * (mochiT - 0.12);
        this.boulderGroup.position.set(
          THREE.MathUtils.lerp(-3.5, 3.35, bT),
          THREE.MathUtils.lerp(5.1, 2.75, bT),
          0.25
        );
        if (!isFrozen) this.boulderGroup.rotation.z -= dt * 5.2;
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
      const my = isRescued ? THREE.MathUtils.lerp(2.22, 5.35, Math.max(0, (rp - 0.25) / 0.75)) : 2.22;
      this.mochi.root.position.set(mx, my, 0.28);
    }

    updateMochiRigAnimation(this.mochi, {
      time,
      danger: state.danger,
      status: state.status,
      happyTimer: state.happyTimer,
      surprisedTimer: state.surprisedTimer,
    });

    this.renderer.render(this.scene, this.camera);
  }

  public dispose() {
    this.envTex.dispose();
    this.renderer.dispose();
  }
}
