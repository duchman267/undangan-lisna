import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

interface ThreeBackgroundProps {
  pointerX: number; // -1 to 1
  pointerY: number; // -1 to 1
}

// Pre-allocated math helpers at module scope to prevent GC in animation loop
const _dummy = new THREE.Object3D();
const _color = new THREE.Color();

export const ThreeBackground: React.FC<ThreeBackgroundProps> = ({ pointerX, pointerY }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    pointerRef.current = { x: pointerX, y: pointerY };
  }, [pointerX, pointerY]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Software-WebGL Guard
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const width = window.innerWidth;
    const height = window.innerHeight;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 0, 14);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);

    container.appendChild(renderer.domElement);

    // 2. Studio Environment Reflection (RoomEnvironment)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;
    pmremGenerator.dispose();

    // 3. Balanced 3-Point Warm/Cool Studio Lighting
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x18181b, 0.9);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff4d6, 2.2);
    keyLight.position.set(6, 10, 8);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xd4af37, 1.6);
    rimLight.position.set(-6, -4, -5);
    scene.add(rimLight);

    // 4. Delicate Floating Champagne Gold Particles & Fine Silk Petals
    const petalShape = new THREE.Shape();
    petalShape.moveTo(0, 0);
    petalShape.bezierCurveTo(0.14, 0.1, 0.19, 0.34, 0, 0.5);
    petalShape.bezierCurveTo(-0.19, 0.34, -0.14, 0.1, 0, 0);

    const petalGeo = new THREE.ExtrudeGeometry(petalShape, {
      depth: 0.008,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.006,
      bevelThickness: 0.006,
    });
    petalGeo.center();

    const petalMat = new THREE.MeshPhysicalMaterial({
      color: 0xe6c687,
      roughness: 0.25,
      metalness: 0.65,
      clearcoat: 0.5,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.48,
    });

    const PETAL_COUNT = 26;
    const petalInstanced = new THREE.InstancedMesh(petalGeo, petalMat, PETAL_COUNT);
    petalInstanced.frustumCulled = false;

    interface ParticleData {
      x: number;
      y: number;
      z: number;
      rx: number;
      ry: number;
      rz: number;
      speedY: number;
      speedRotX: number;
      speedRotY: number;
      swayAmp: number;
      swayFreq: number;
      phase: number;
      scale: number;
    }

    const petalsData: ParticleData[] = [];
    const palette = [0xd4af37, 0xe6c687, 0xf5ebd6, 0xc5a059];

    for (let i = 0; i < PETAL_COUNT; i++) {
      const p: ParticleData = {
        x: (Math.random() - 0.5) * 22,
        y: (Math.random() - 0.5) * 18,
        z: (Math.random() - 0.5) * 10 - 1,
        rx: Math.random() * Math.PI * 2,
        ry: Math.random() * Math.PI * 2,
        rz: Math.random() * Math.PI * 2,
        speedY: 0.18 + Math.random() * 0.25,
        speedRotX: (Math.random() - 0.5) * 0.65,
        speedRotY: (Math.random() - 0.5) * 0.65,
        swayAmp: 0.25 + Math.random() * 0.45,
        swayFreq: 0.35 + Math.random() * 0.45,
        phase: Math.random() * Math.PI * 2,
        scale: 0.35 + Math.random() * 0.45,
      };
      petalsData.push(p);

      _dummy.position.set(p.x, p.y, p.z);
      _dummy.rotation.set(p.rx, p.ry, p.rz);
      _dummy.scale.setScalar(p.scale);
      _dummy.updateMatrix();
      petalInstanced.setMatrixAt(i, _dummy.matrix);

      _color.setHex(palette[i % palette.length]);
      petalInstanced.setColorAt(i, _color);
    }
    petalInstanced.instanceMatrix.needsUpdate = true;
    if (petalInstanced.instanceColor) petalInstanced.instanceColor.needsUpdate = true;
    scene.add(petalInstanced);

    // Fine Champagne Gold Dust Motes
    const goldGeo = new THREE.OctahedronGeometry(0.048, 0);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xe6c687,
      metalness: 0.95,
      roughness: 0.12,
    });

    const GOLD_COUNT = 68;
    const goldInstanced = new THREE.InstancedMesh(goldGeo, goldMat, GOLD_COUNT);
    goldInstanced.frustumCulled = false;

    const goldData: ParticleData[] = [];
    for (let i = 0; i < GOLD_COUNT; i++) {
      const g: ParticleData = {
        x: (Math.random() - 0.5) * 24,
        y: (Math.random() - 0.5) * 18,
        z: (Math.random() - 0.5) * 12 - 2,
        rx: Math.random() * Math.PI * 2,
        ry: Math.random() * Math.PI * 2,
        rz: Math.random() * Math.PI * 2,
        speedY: 0.1 + Math.random() * 0.2,
        speedRotX: 0.5 + Math.random() * 1.1,
        speedRotY: 0.5 + Math.random() * 1.1,
        swayAmp: 0.18 + Math.random() * 0.32,
        swayFreq: 0.4 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
        scale: 0.45 + Math.random() * 0.85,
      };
      goldData.push(g);
      _dummy.position.set(g.x, g.y, g.z);
      _dummy.rotation.set(g.rx, g.ry, g.rz);
      _dummy.scale.setScalar(g.scale);
      _dummy.updateMatrix();
      goldInstanced.setMatrixAt(i, _dummy.matrix);
    }
    goldInstanced.instanceMatrix.needsUpdate = true;
    scene.add(goldInstanced);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // 5. Animation Loop with Software-WebGL Pacing
    const clock = new THREE.Clock();
    let frameId = 0;
    let isDisposed = false;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (!gl || typeof gl.fenceSync !== 'function') {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (isDisposed) return;
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      if (isDisposed) return;
      const dt = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();

      const targetCamX = pointerRef.current.x * 1.15;
      const targetCamY = -pointerRef.current.y * 0.85;
      camera.position.x = THREE.MathUtils.damp(camera.position.x, targetCamX, 3.5, dt);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, targetCamY, 3.5, dt);
      camera.lookAt(0, 0, 0);

      for (let i = 0; i < PETAL_COUNT; i++) {
        const p = petalsData[i];
        p.y -= p.speedY * dt;
        if (p.y < -9) p.y = 9;
        p.rx += p.speedRotX * dt;
        p.ry += p.speedRotY * dt;

        const currentX = p.x + Math.sin(elapsed * p.swayFreq + p.phase) * p.swayAmp;
        _dummy.position.set(currentX, p.y, p.z);
        _dummy.rotation.set(p.rx, p.ry, p.rz);
        _dummy.scale.setScalar(p.scale);
        _dummy.updateMatrix();
        petalInstanced.setMatrixAt(i, _dummy.matrix);
      }
      petalInstanced.instanceMatrix.needsUpdate = true;

      for (let i = 0; i < GOLD_COUNT; i++) {
        const g = goldData[i];
        g.y += g.speedY * dt;
        if (g.y > 9) g.y = -9;
        g.rx += g.speedRotX * dt;
        g.ry += g.speedRotY * dt;

        const currentX = g.x + Math.cos(elapsed * g.swayFreq + g.phase) * g.swayAmp;
        const pulseScale = g.scale * (0.8 + 0.3 * Math.sin(elapsed * 2.4 + g.phase));
        _dummy.position.set(currentX, g.y, g.z);
        _dummy.rotation.set(g.rx, g.ry, g.rz);
        _dummy.scale.setScalar(pulseScale);
        _dummy.updateMatrix();
        goldInstanced.setMatrixAt(i, _dummy.matrix);
      }
      goldInstanced.instanceMatrix.needsUpdate = true;

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    const handleResize = () => {
      if (!container || isDisposed) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      isDisposed = true;
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      petalGeo.dispose();
      petalMat.dispose();
      goldGeo.dispose();
      goldMat.dispose();
      envTexture.dispose();
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none z-10 overflow-hidden"
      aria-hidden="true"
    />
  );
};
