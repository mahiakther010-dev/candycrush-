import * as THREE from 'three';

export interface StudioLights {
  ambient: THREE.HemisphereLight;
  keyLight: THREE.DirectionalLight;
  rimLight: THREE.DirectionalLight;
  bounceLight: THREE.DirectionalLight;
  dangerLight: THREE.PointLight;
  portalLight: THREE.PointLight;
}

/**
 * Crisp, clean daylight-studio reflection environment (NO hazy HDR bloom wash).
 * Produces sharp, glossy specular catchlights while preserving 100% color saturation.
 */
export function createCandyStudioEnvironment(renderer: THREE.WebGLRenderer): THREE.Texture {
  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();

  const envScene = new THREE.Scene();
  envScene.background = new THREE.Color('#2563eb');

  // Crisp White Overhead Key Softbox (clean specular highlight without milky wash)
  const mainOctabox = new THREE.Mesh(
    new THREE.CircleGeometry(10, 32),
    new THREE.MeshBasicMaterial({ color: new THREE.Color(1.65, 1.63, 1.58), side: THREE.DoubleSide })
  );
  mainOctabox.position.set(-4, 15, 10);
  mainOctabox.lookAt(0, 0, 0);
  envScene.add(mainOctabox);

  // Crisp Front-Left Window Reflector
  const stripLeft = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 18),
    new THREE.MeshBasicMaterial({ color: new THREE.Color(1.45, 1.45, 1.5), side: THREE.DoubleSide })
  );
  stripLeft.position.set(-14, 6, 11);
  stripLeft.lookAt(0, 0, 0);
  envScene.add(stripLeft);

  // Warm Sunlit Gold Right Reflector
  const warmBounce = new THREE.Mesh(
    new THREE.PlaneGeometry(16, 13),
    new THREE.MeshBasicMaterial({ color: new THREE.Color(1.25, 0.95, 0.65), side: THREE.DoubleSide })
  );
  warmBounce.position.set(14, 4, 8);
  warmBounce.lookAt(0, 0, 0);
  envScene.add(warmBounce);

  // Clean Sky-Turquoise Back Rim Panel
  const coolRim = new THREE.Mesh(
    new THREE.PlaneGeometry(26, 9),
    new THREE.MeshBasicMaterial({ color: new THREE.Color(0.55, 1.15, 1.45), side: THREE.DoubleSide })
  );
  coolRim.position.set(0, 11, -14);
  coolRim.lookAt(0, 0, 0);
  envScene.add(coolRim);

  // Warm Coral-Cream Floor Bounce Card
  const floorCard = new THREE.Mesh(
    new THREE.PlaneGeometry(24, 18),
    new THREE.MeshBasicMaterial({ color: new THREE.Color(0.85, 0.72, 0.65), side: THREE.DoubleSide })
  );
  floorCard.position.set(0, -14, 6);
  floorCard.lookAt(0, 0, 0);
  envScene.add(floorCard);

  const envRT = pmrem.fromScene(envScene, 0.025);
  pmrem.dispose();
  return envRT.texture;
}

export function setupCinematicLights(scene: THREE.Scene): StudioLights {
  // Bright, vibrant daylight sky-to-warm-ground hemisphere fill (eliminates dark muddy shadows!)
  const ambient = new THREE.HemisphereLight('#ffffff', '#fb923c', 1.28);
  scene.add(ambient);

  const keyLight = new THREE.DirectionalLight('#fffdf7', 2.05);
  keyLight.position.set(-6.0, 12.5, 14.5);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(2048, 2048);
  keyLight.shadow.camera.near = 2;
  keyLight.shadow.camera.far = 34;
  keyLight.shadow.camera.left = -9.0;
  keyLight.shadow.camera.right = 9.0;
  keyLight.shadow.camera.top = 11.5;
  keyLight.shadow.camera.bottom = -11.5;
  keyLight.shadow.bias = -0.0005;
  keyLight.shadow.normalBias = 0.02;
  keyLight.shadow.radius = 2.8;
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight('#38bdf8', 0.95);
  rimLight.position.set(8.0, 7.5, -6.5);
  scene.add(rimLight);

  const bounceLight = new THREE.DirectionalLight('#fde047', 0.52);
  bounceLight.position.set(2.5, -9.0, 8.0);
  scene.add(bounceLight);

  const dangerLight = new THREE.PointLight('#ff1e4d', 0, 12, 1.8);
  dangerLight.position.set(0, 3.8, 3.4);
  scene.add(dangerLight);

  const portalLight = new THREE.PointLight('#ffb703', 0.85, 8, 1.8);
  portalLight.position.set(-2.5, 5.2, 1.6);
  scene.add(portalLight);

  return { ambient, keyLight, rimLight, bounceLight, dangerLight, portalLight };
}
