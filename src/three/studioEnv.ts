import * as THREE from 'three';

export interface StudioLights {
  ambient: THREE.HemisphereLight;
  keyLight: THREE.DirectionalLight;
  rimLight: THREE.DirectionalLight;
  dangerLight: THREE.PointLight;
  portalLight: THREE.PointLight;
}

/**
 * Generates a bright, candy-studio HDR-like environment texture using PMREMGenerator
 * so glossy clearcoat candies, crystals, wrappers, gold keys, and Mochi's eyes
 * display crisp studio specular highlights and subtle ambient bounce.
 */
export function createCandyStudioEnvironment(renderer: THREE.WebGLRenderer): THREE.Texture {
  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();

  const envScene = new THREE.Scene();
  envScene.background = new THREE.Color('#1c2848');

  // Overhead bright softbox panel (gives crisp white glossy candy highlights!)
  const topSoftbox = new THREE.Mesh(
    new THREE.PlaneGeometry(28, 18),
    new THREE.MeshBasicMaterial({ color: new THREE.Color(2.6, 2.55, 2.5), side: THREE.DoubleSide })
  );
  topSoftbox.position.set(-3, 14, 8);
  topSoftbox.lookAt(0, 0, 0);
  envScene.add(topSoftbox);

  // Secondary key softbox (front-left)
  const keyCard = new THREE.Mesh(
    new THREE.PlaneGeometry(16, 12),
    new THREE.MeshBasicMaterial({ color: new THREE.Color(2.2, 2.0, 2.1), side: THREE.DoubleSide })
  );
  keyCard.position.set(-12, 7, 12);
  keyCard.lookAt(0, 0, 0);
  envScene.add(keyCard);

  // Warm candy-pink & gold bounce reflector (right)
  const warmCard = new THREE.Mesh(
    new THREE.PlaneGeometry(18, 12),
    new THREE.MeshBasicMaterial({ color: new THREE.Color(1.7, 1.05, 1.35), side: THREE.DoubleSide })
  );
  warmCard.position.set(13, 4, 9);
  warmCard.lookAt(0, 0, 0);
  envScene.add(warmCard);

  // Cool sky-cyan rim card (top-back)
  const rimCard = new THREE.Mesh(
    new THREE.PlaneGeometry(26, 10),
    new THREE.MeshBasicMaterial({ color: new THREE.Color(0.85, 1.55, 2.2), side: THREE.DoubleSide })
  );
  rimCard.position.set(0, 10, -13);
  rimCard.lookAt(0, 0, 0);
  envScene.add(rimCard);

  const envRT = pmrem.fromScene(envScene, 0.035);
  pmrem.dispose();
  return envRT.texture;
}

export function setupCinematicLights(scene: THREE.Scene): StudioLights {
  const ambient = new THREE.HemisphereLight('#d8eeff', '#2a1842', 0.95);
  scene.add(ambient);

  const keyLight = new THREE.DirectionalLight('#fff8eb', 2.05);
  keyLight.position.set(-5.5, 11.5, 13.5);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(1024, 1024);
  keyLight.shadow.camera.near = 2;
  keyLight.shadow.camera.far = 32;
  keyLight.shadow.camera.left = -8.5;
  keyLight.shadow.camera.right = 8.5;
  keyLight.shadow.camera.top = 11;
  keyLight.shadow.camera.bottom = -11;
  keyLight.shadow.bias = -0.0008;
  keyLight.shadow.radius = 3.5;
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight('#7dd3fc', 1.05);
  rimLight.position.set(7.5, 6.5, -6);
  scene.add(rimLight);

  const dangerLight = new THREE.PointLight('#ff2a4b', 0, 14, 1.6);
  dangerLight.position.set(0, 3.8, 3.2);
  scene.add(dangerLight);

  const portalLight = new THREE.PointLight('#ffd166', 1.8, 9, 1.8);
  portalLight.position.set(-2.5, 5.2, 1.5);
  scene.add(portalLight);

  return { ambient, keyLight, rimLight, dangerLight, portalLight };
}
