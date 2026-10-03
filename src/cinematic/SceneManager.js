/* ==========================================================================
   CODEC 2K26 — THREE.JS 3D SCENE MANAGER
   WebGL Canvas, Perspective Camera, Atmospheric Fog, Volumetric Lights,
   3D Portal Portals, Raycasting for 5 Chambers
   ========================================================================== */

import * as THREE from 'three';
import { ParticleSystem } from './ParticleSystem.js';

export class SceneManager {
  constructor(canvasContainer) {
    this.container = canvasContainer;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.particles = null;

    // Lights
    this.ambientLight = null;
    this.moonLight = null;
    this.gateLight = null;
    this.rotundaCoreLight = null;

    // Raycasting for 3D Chamber Portals
    this.raycaster = new THREE.Raycaster();
    this.mouseVec = new THREE.Vector2();
    this.chamberMeshes = [];
    this.hoveredChamberKey = null;
    this.mouseMoved = false;

    // Callbacks
    this.onChamberHover = null;
    this.onChamberClick = null;

    this.onWindowResize = this.onWindowResize.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerClick = this.onPointerClick.bind(this);

    this.init();
  }

  init() {
    // 1. Scene & Atmospheric Fog
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x050406, 0.022);

    // 2. Camera (Realistic 50mm human architectural field of view)
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(52, aspect, 0.1, 120);
    this.camera.position.set(0, 1.7, 45); // Start at human eye height (1.7m)

    // 3. WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({
      powerPreference: 'high-performance',
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;

    this.renderer.domElement.id = 'cinematic-webgl-canvas';
    this.renderer.domElement.style.position = 'absolute';
    this.renderer.domElement.style.top = '0';
    this.renderer.domElement.style.left = '0';
    this.renderer.domElement.style.width = '100%';
    this.renderer.domElement.style.height = '100%';
    this.renderer.domElement.style.pointerEvents = 'none'; // DOM handles click/hover pass-through or raycaster
    this.renderer.domElement.style.zIndex = '10';

    this.container.appendChild(this.renderer.domElement);

    // 4. Lights
    this.initLighting();

    // 5. Particles
    this.particles = new ParticleSystem(this.scene);

    // 6. Interactive 3D Chamber Hitbox Meshes in Rotunda (Z = -32m)
    this.initChamberPortals();

    // 7. Event listeners
    window.addEventListener('resize', this.onWindowResize);
    window.addEventListener('mousemove', this.onPointerMove, { passive: true });
    window.addEventListener('click', this.onPointerClick);
  }

  initLighting() {
    // Dark gothic ambient fill
    this.ambientLight = new THREE.AmbientLight(0x18121f, 0.9);
    this.scene.add(this.ambientLight);

    // Cold moonlight from above night sky
    this.moonLight = new THREE.DirectionalLight(0x7ea0d0, 1.4);
    this.moonLight.position.set(-15, 35, 20);
    this.scene.add(this.moonLight);

    // Warm golden/amber light that bursts when the gate opens (Z = 12m)
    this.gateLight = new THREE.PointLight(0xff7700, 0.0, 24, 1.8);
    this.gateLight.position.set(0, 3.5, 11);
    this.scene.add(this.gateLight);

    // Rotunda central core warm ambient glow (Z = -32m)
    this.rotundaCoreLight = new THREE.PointLight(0xffa500, 1.2, 38, 1.4);
    this.rotundaCoreLight.position.set(0, 4.0, -32);
    this.scene.add(this.rotundaCoreLight);
  }

  // 3D Chamber Doorway hitboxes arranged in an architectural arc around the rotunda
  initChamberPortals() {
    const chambers = [
      { key: 'about', label: 'ABOUT', angle: -0.75, color: 0xffa533 },
      { key: 'events', label: 'EVENTS', angle: -0.38, color: 0x33a5ff },
      { key: 'hackathon', label: 'HACKATHON', angle: 0.0, color: 0xff4422 },
      { key: 'schedule', label: 'SCHEDULE', angle: 0.38, color: 0xffcc33 },
      { key: 'prizes', label: 'PRIZES', angle: 0.75, color: 0xffdd44 }
    ];

    const rotundaCenterZ = -32;
    const arcRadius = 14;

    chambers.forEach(c => {
      // Create invisible raycast plane & decorative subtle glowing portal frame
      const geom = new THREE.PlaneGeometry(3.6, 6.2);
      const mat = new THREE.MeshBasicMaterial({
        color: c.color,
        transparent: true,
        opacity: 0.0, // Invisible to eye, visible to raycaster
        side: THREE.DoubleSide
      });

      const mesh = new THREE.Mesh(geom, mat);
      const posX = Math.sin(c.angle) * arcRadius;
      const posZ = rotundaCenterZ - Math.cos(c.angle) * arcRadius + (arcRadius - 1.5);
      mesh.position.set(posX, 3.2, posZ);
      mesh.rotation.y = c.angle;
      mesh.userData = { chamberKey: c.key, label: c.label };

      this.scene.add(mesh);
      this.chamberMeshes.push(mesh);
    });
  }

  onPointerMove(e) {
    this.mouseVec.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.mouseVec.y = -(e.clientY / window.innerHeight) * 2 + 1;
    this.mouseMoved = true;
  }

  onPointerClick(e) {
    // 1. Never trigger 3D chamber navigation if clicking on interactive UI elements or modals
    if (!e || !e.target) return;
    if (e.target.closest('button, input, select, textarea, a, .mansion-modal-backdrop, .modal, .hud-right-actions, .mobile-bottom-dock, .hud-nav-bar, .chamber-experience-viewport, .rotunda-nav-footer, .schedule-item-card, .subevent-delegate-card, .pass-card-digital, .admin-box, .reg-box')) {
      return;
    }

    // 2. Never trigger if any modal is currently visible on screen
    if (document.querySelector('.mansion-modal-backdrop.active')) {
      return;
    }

    // 3. Only trigger if the click target is the WebGL renderer canvas or direct viewport background
    if (e.target !== this.renderer?.domElement && e.target.id !== 'stage-viewport') {
      return;
    }

    // 4. Trigger only if user clicked on a hovered 3D doorway mesh in the rotunda
    if (this.hoveredChamberKey && this.onChamberClick) {
      const key = this.hoveredChamberKey;
      this.hoveredChamberKey = null; // Clear immediately to prevent repeat triggers
      this.onChamberClick(key);
    }
  }

  checkRaycast() {
    // Only raycast when camera is deep in the rotunda (Z < -16m)
    if (!this.camera || this.camera.position.z > -16) {
      if (this.hoveredChamberKey) {
        this.hoveredChamberKey = null;
        if (this.onChamberHover) this.onChamberHover(null);
      }
      return;
    }

    // Skip raycast computation if pointer hasn't moved
    if (!this.mouseMoved && this.hoveredChamberKey !== null) {
      return;
    }
    this.mouseMoved = false;

    this.raycaster.setFromCamera(this.mouseVec, this.camera);
    const intersects = this.raycaster.intersectObjects(this.chamberMeshes);

    if (intersects.length > 0) {
      const hitKey = intersects[0].object.userData.chamberKey;
      if (hitKey !== this.hoveredChamberKey) {
        this.hoveredChamberKey = hitKey;
        if (this.onChamberHover) this.onChamberHover(hitKey);
      }
    } else {
      if (this.hoveredChamberKey) {
        this.hoveredChamberKey = null;
        if (this.onChamberHover) this.onChamberHover(null);
      }
    }
  }

  onWindowResize() {
    if (!this.camera || !this.renderer) return;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // Update lighting effects based on scroll progress
  updateLighting(p) {
    // Gate light flares open around p = 0.28 to 0.45
    if (this.gateLight) {
      if (p >= 0.25 && p <= 0.55) {
        const peak = Math.sin(((p - 0.25) / 0.30) * Math.PI);
        this.gateLight.intensity = peak * 3.8;
      } else {
        this.gateLight.intensity = 0.0;
      }
    }

    // Rotunda core light warms up when inside rotunda (p > 0.65)
    if (this.rotundaCoreLight) {
      if (p > 0.65) {
        this.rotundaCoreLight.intensity = 1.0 + (p - 0.65) * 1.5;
      }
    }
  }

  render(delta = 0.016, mouseParallax = { currentX: 0, currentY: 0 }) {
    if (this.particles) {
      this.particles.update(delta, mouseParallax);
    }

    this.checkRaycast();

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  destroy() {
    window.removeEventListener('resize', this.onWindowResize);
    window.removeEventListener('mousemove', this.onPointerMove);
    window.removeEventListener('click', this.onPointerClick);
    if (this.renderer && this.renderer.domElement && this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
  }
}
