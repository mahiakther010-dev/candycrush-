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
 * Clean, crisp Pixar / Nintendo-style Daylight Studio Environment Map.
 * Zero hazy HDR bloom blowouts—creates sharp, clean specular catchlights while
 * preserving 100% vibrant color saturation under NeutralToneMapping.
 */
export function createCandyStudioEnvironment(renderer: THREE.WebGLRenderer): THREE.Texture {
  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();

  const envScene = new THREE.Scene();
  envScene.background = new THREE.Color('#254b8a');

  // 1. Crisp Overhead White Softbox (clean pinpoint highlight, not blown-out glare)
  const mainOctabox = new THREE.Mesh(
    new THREE.CircleGeometry(10, 32),
    new THREE.MeshBasicMaterial({ color: new THREE.Color(1.45, 1.45, 1.42), side: THREE.DoubleSide })
  );
  mainOctabox.position.set(-4, 15, 10);
  mainOctabox.lookAt(0, 0, 0);
  envScene.add(mainOctabox);

  // 2. Left Crisp Window Strip
  const stripLeft = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 18),
    new THREE.MeshBasicMaterial({ color: new THREE.Color(1.3, 1.32, 1.38), side: THREE.DoubleSide })
  );
  stripLeft.position.set(-14, 6, 11);
  stripLeft.lookAt(0, 0, 0);
  envScene.add(stripLeft);

  // 3. Warm Sunny-Gold Right Fill Card
  const warmBounce = new THREE.Mesh(
    new THREE.PlaneGeometry(18, 14),
    new THREE.MeshBasicMaterial({ color: new THREE.Color(1.15, 0.92, 0.58), side: THREE.DoubleSide })
  );
  warmBounce.position.set(14, 4, 8);
  warmBounce.lookAt(0, 0, 0);
  envScene.add(warmBounce);

  // 4. Crisp Sky-Cyan Back Rim Card
  const coolRim = new THREE.Mesh(
    new THREE.PlaneGeometry(28, 9),
    new THREE.MeshBasicMaterial({ color: new THREE.Color(0.55, 1.05, 1.35), side: THREE.DoubleSide })
  );
  coolRim.position.set(0, 11, -14);
  coolRim.lookAt(0, 0, 0);
  envScene.add(coolRim);

  // 5. Cheerful Royal-Sky Floor Bounce (prevents dark muddy undersides)
  const floorCard = new THREE.Mesh(
    new THREE.PlaneGeometry(24, 18),
    new THREE.MeshBasicMaterial({ color: new THREE.Color(0.55, 0.65, 0.95), side: THREE.DoubleSide })
  );
  floorCard.position.set(0, -14, 6);
  floorCard.lookAt(0, 0, 0);
  envScene.add(floorCard);

  const envRT = pmrem.fromScene(envScene, 0.025);
  pmrem.dispose();
  return envRT.texture;
}

export function setupCinematicLights(scene: THREE.Scene): StudioLights {
  // Bright, colorful Pixar-style sky-to-royal-indigo hemisphere fill (zero muddy black shadows)
  const ambient = new THREE.HemisphereLight('#ffffff', '#4338ca', 1.45);
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

  const bounceLight = new THREE.DirectionalLight('#ffd166', 0.65);
  bounceLight.position.set(2.5, -9.0, 8.0);
  scene.add(bounceLight);

  // Kept at 0 intensity so there is zero unwanted neon glow wash
  const dangerLight = new THREE.PointLight('#ff1744', 0, 12, 1.8);
  dangerLight.position.set(0, 3.8, 3.4);
  scene.add(dangerLight);

  const portalLight = new THREE.PointLight('#ffd166', 0, 8, 1.8);
  portalLight.position.set(-2.5, 5.2, 1.6);
  scene.add(portalLight);

  return { ambient, keyLight, rimLight, bounceLight, dangerLight, portalLight };
}
