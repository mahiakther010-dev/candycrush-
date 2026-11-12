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
 * Generates an Octane / Cinema-4D style multi-softbox HDR environment map using PMREMGenerator.
 * High-contrast studio light panels + horizon gradient create razor-sharp wet sugar reflections
 * and realistic glass/jelly refraction on every 3D candy, ice block, gold key, and character eye.
 */
export function createCandyStudioEnvironment(renderer: THREE.WebGLRenderer): THREE.Texture {
  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();

  const envScene = new THREE.Scene();
  envScene.background = new THREE.Color('#12192e');

  // 1. Primary Overhead Octabox (creates signature glossy white top highlight on candies)
  const mainOctabox = new THREE.Mesh(
    new THREE.CircleGeometry(11, 32),
    new THREE.MeshBasicMaterial({ color: new THREE.Color(3.6, 3.5, 3.35), side: THREE.DoubleSide })
  );
  mainOctabox.position.set(-4, 15, 9);
  mainOctabox.lookAt(0, 0, 0);
  envScene.add(mainOctabox);

  // 2. Crisp Strip-Box Window Light (front-left specular strip)
  const stripLeft = new THREE.Mesh(
    new THREE.PlaneGeometry(5.5, 20),
    new THREE.MeshBasicMaterial({ color: new THREE.Color(3.1, 2.95, 3.0), side: THREE.DoubleSide })
  );
  stripLeft.position.set(-14, 6, 11);
  stripLeft.lookAt(0, 0, 0);
  envScene.add(stripLeft);

  // 3. Warm Golden-Sunset Rim Reflector (right)
  const warmBounce = new THREE.Mesh(
    new THREE.PlaneGeometry(18, 14),
    new THREE.MeshBasicMaterial({ color: new THREE.Color(2.3, 1.45, 0.95), side: THREE.DoubleSide })
  );
  warmBounce.position.set(14, 4, 8);
  warmBounce.lookAt(0, 0, 0);
  envScene.add(warmBounce);

  // 4. Cool Sapphire-Cyan Back Rim Strip (separates 3D silhouettes from backdrop)
  const coolRim = new THREE.Mesh(
    new THREE.PlaneGeometry(28, 9),
    new THREE.MeshBasicMaterial({ color: new THREE.Color(0.95, 2.0, 2.9), side: THREE.DoubleSide })
  );
  coolRim.position.set(0, 11, -14);
  coolRim.lookAt(0, 0, 0);
  envScene.add(coolRim);

  // 5. Subtle Lower Table Bounce Card (illuminates bottom bevels of candies)
  const floorCard = new THREE.Mesh(
    new THREE.PlaneGeometry(24, 18),
    new THREE.MeshBasicMaterial({ color: new THREE.Color(0.8, 0.55, 0.95), side: THREE.DoubleSide })
  );
  floorCard.position.set(0, -14, 6);
  floorCard.lookAt(0, 0, 0);
  envScene.add(floorCard);

  const envRT = pmrem.fromScene(envScene, 0.022);
  pmrem.dispose();
  return envRT.texture;
}

export function setupCinematicLights(scene: THREE.Scene): StudioLights {
  const ambient = new THREE.HemisphereLight('#e6f4ff', '#28163d', 0.92);
  scene.add(ambient);

  const keyLight = new THREE.DirectionalLight('#fff6e5', 2.35);
  keyLight.position.set(-6.2, 12.5, 14.2);
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
  keyLight.shadow.radius = 3.2;
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight('#7dd3fc', 1.25);
  rimLight.position.set(8.0, 7.5, -6.5);
  scene.add(rimLight);

  const bounceLight = new THREE.DirectionalLight('#ffbe76', 0.55);
  bounceLight.position.set(2.5, -9.0, 8.0);
  scene.add(bounceLight);

  const dangerLight = new THREE.PointLight('#ff244c', 0, 15, 1.5);
  dangerLight.position.set(0, 3.8, 3.4);
  scene.add(dangerLight);

  const portalLight = new THREE.PointLight('#ffd166', 2.2, 10, 1.7);
  portalLight.position.set(-2.5, 5.2, 1.6);
  scene.add(portalLight);

  return { ambient, keyLight, rimLight, bounceLight, dangerLight, portalLight };
}
