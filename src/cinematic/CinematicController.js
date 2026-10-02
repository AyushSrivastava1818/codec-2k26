/* ==========================================================================
   CODEC 2K26 — MASTER CINEMATIC CONTROLLER
   Unified Coordinator for Camera, Scroll, Mouse Look, 3D Scene,
   Chambers, Visual Stages, Procedural Audio & Debug Overlay
   ========================================================================== */

import gsap from 'gsap';
import { audioManager } from './AudioManager.js';
import { MouseParallax } from './MouseParallax.js';
import { ScrollController } from './ScrollController.js';
import { SceneManager } from './SceneManager.js';
import { CameraController } from './CameraController.js';
import { ChamberManager } from './ChamberManager.js';

export class CinematicController {
  constructor() {
    this.mouse = null;
    this.scroll = null;
    this.sceneManager = null;
    this.cameraController = null;
    this.chamberManager = null;

    // DOM Visual Layers
    this.layerExterior = null;
    this.layerGateDoors = null;
    this.gateLeftDoor = null;
    this.gateRightDoor = null;
    this.gateLightGlow = null;
    this.layerMainHall = null;
    this.layerRotunda = null;
    this.rotundaPortalRing = null;
    this.heroTitles = null;
    this.scrollPrompt = null;

    // State & Timers
    this.lastTime = performance.now();
    this.isInitialized = false;

    this.render = this.render.bind(this);
  }

  async init() {
    if (this.isInitialized) return;

    // Cache DOM Elements
    this.cacheElements();

    // 1. Initialize Mouse Parallax (Damped Gaze)
    this.mouse = new MouseParallax();

    // 2. Initialize Three.js Scene (Camera, Particles, Lighting, WebGL Renderer)
    const viewport = document.getElementById('stage-viewport');
    this.sceneManager = new SceneManager(viewport);

    // 3. Initialize Physical Camera Controller
    this.cameraController = new CameraController(this.sceneManager.camera);

    // 4. Initialize Chamber Manager (5 interactive portals)
    this.chamberManager = new ChamberManager(this.cameraController);

    // Wire Three.js 3D Raycasting to Chamber Manager
    this.sceneManager.onChamberHover = (chamberKey) => {
      this.chamberManager.onHover(chamberKey);
    };
    this.sceneManager.onChamberClick = (chamberKey) => {
      this.chamberManager.enterChamber(chamberKey);
    };

    // 5. Initialize Master Scroll Controller
    const heroStage = document.getElementById('hero-stage');
    this.scroll = new ScrollController(heroStage, {
      onProgressUpdate: (p) => this.onScrollProgress(p),
      onStageChange: (stage) => this.onStageChange(stage),
      onGateOpenTrigger: () => this.onGateOpenTrigger()
    });

    // 6. Bind Rotunda DOM Portal Clicks & Hovers
    this.bindPortalEvents();

    // 7. Start Cinematic Loader
    await this.runLoaderSequence();

    // 8. Start 60-120 FPS Master Render Loop
    this.isInitialized = true;
    requestAnimationFrame(this.render);

    console.log('CINEMATIC 3D ENGINE ONLINE [CODEC 2K26]');
  }

  cacheElements() {
    this.layerExterior = document.getElementById('layer-exterior');
    this.layerGateDoors = document.getElementById('layer-gate-doors');
    this.gateLeftDoor = document.getElementById('gate-panel-left');
    this.gateRightDoor = document.getElementById('gate-panel-right');
    this.gateLightGlow = document.getElementById('gate-amber-glow');
    this.layerMainHall = document.getElementById('layer-main-hall');
    this.layerRotunda = document.getElementById('layer-rotunda');
    this.rotundaPortalRing = document.getElementById('rotunda-portal-ring');
    this.heroTitles = document.getElementById('hero-titles-overlay');
    this.scrollPrompt = document.getElementById('scroll-prompt-anchor');
  }

  // Preloader sequence (Black screen -> orange line -> technical percentage -> fade to exterior)
  runLoaderSequence() {
    return new Promise((resolve) => {
      const loader = document.getElementById('cinematic-preloader');
      const progressNum = document.getElementById('loader-percentage-num');
      const progressFill = document.getElementById('loader-line-fill');

      if (!loader) {
        resolve();
        return;
      }

      let count = 0;
      const interval = setInterval(() => {
        count += Math.floor(Math.random() * 14) + 8;
        if (count >= 100) {
          count = 100;
          clearInterval(interval);
          if (progressNum) progressNum.textContent = '100%';
          if (progressFill) progressFill.style.width = '100%';

          setTimeout(() => {
            gsap.to(loader, {
              opacity: 0,
              duration: 0.85,
              ease: 'power2.inOut',
              onComplete: () => {
                loader.style.display = 'none';
                resolve();
              }
            });
          }, 300);
        } else {
          if (progressNum) progressNum.textContent = `${count}%`;
          if (progressFill) progressFill.style.width = `${count}%`;
        }
      }, 50);
    });
  }

  bindPortalEvents() {
    document.querySelectorAll('.gothic-arch-portal-card, .rotunda-portal-door').forEach(door => {
      const key = door.getAttribute('data-chamber');

      door.addEventListener('mouseenter', () => {
        this.chamberManager.onHover(key);
      });

      door.addEventListener('mouseleave', () => {
        this.chamberManager.onHover(null);
      });

      door.addEventListener('click', (e) => {
        e.stopPropagation();
        this.chamberManager.enterChamber(key);
      });
    });

    // Check if URL arrived with a hash like #events or #hackathon
    const initialHash = window.location.hash.replace('#', '').toLowerCase();
    if (initialHash && ['about', 'events', 'hackathon', 'schedule', 'prizes'].includes(initialHash)) {
      setTimeout(() => {
        this.scroll.scrollToStage('ROTUNDA_CHAMBERS');
        setTimeout(() => {
          this.chamberManager.enterChamber(initialHash, false);
        }, 600);
      }, 700);
    }
  }

  // Gate open metallic sound and screen vibration
  onGateOpenTrigger() {
    audioManager.playGateOpenSound();
    const stage = document.getElementById('stage-viewport');
    if (stage) {
      stage.classList.add('screen-gate-rumble');
      setTimeout(() => {
        stage.classList.remove('screen-gate-rumble');
      }, 600);
    }
  }

  onStageChange(stageName) {
    // Stage callbacks if needed for sound/FX
  }

  // Continuous visual transitions across stages with GPU layer visibility culling
  onScrollProgress(p) {
    audioManager.onScrollProgress(p);
    this.sceneManager.updateLighting(p);

    // 1. Hero Title & Scroll Prompt (Fade out quickly as camera approaches gate: 0.00 -> 0.20)
    if (this.heroTitles) {
      const alpha = Math.max(0, 1 - p * 4.5);
      if (alpha > 0.005) {
        this.heroTitles.style.display = 'flex';
        this.heroTitles.style.opacity = alpha.toFixed(3);
        this.heroTitles.style.transform = `translateX(-50%) translateY(${(-50 - p * 35).toFixed(1)}%)`;
        this.heroTitles.style.pointerEvents = alpha > 0.05 ? 'auto' : 'none';
      } else {
        this.heroTitles.style.display = 'none';
        this.heroTitles.style.pointerEvents = 'none';
      }
    }
    if (this.scrollPrompt) {
      const alpha = Math.max(0, 1 - p * 5.0);
      if (alpha > 0.005) {
        this.scrollPrompt.style.display = 'block';
        this.scrollPrompt.style.opacity = alpha.toFixed(3);
        this.scrollPrompt.style.pointerEvents = alpha > 0.05 ? 'auto' : 'none';
      } else {
        this.scrollPrompt.style.display = 'none';
        this.scrollPrompt.style.pointerEvents = 'none';
      }
    }

    // 2. Exterior Mansion Shot (0.00 -> 0.38)
    if (this.layerExterior) {
      if (p <= 0.20) {
        this.layerExterior.style.display = 'block';
        this.layerExterior.style.opacity = '1';
        this.layerExterior.style.transform = `scale(${(1.0 + p * 0.8).toFixed(3)}) translate3d(0, 0, 0)`;
      } else if (p < 0.38) {
        this.layerExterior.style.display = 'block';
        const fade = 1 - (p - 0.20) / 0.18;
        this.layerExterior.style.opacity = fade.toFixed(3);
        this.layerExterior.style.transform = `scale(${(1.0 + p * 0.8).toFixed(3)}) translate3d(0, 0, 0)`;
      } else {
        this.layerExterior.style.opacity = '0';
        this.layerExterior.style.display = 'none';
      }
    }

    // 3. Gate Approach & Open (0.15 -> 0.56)
    if (this.layerGateDoors) {
      if (p < 0.14) {
        this.layerGateDoors.style.display = 'none';
        this.layerGateDoors.style.opacity = '0';
        this.layerGateDoors.style.pointerEvents = 'none';
      } else if (p <= 0.46) {
        this.layerGateDoors.style.display = 'block';
        const fadeIn = Math.min(1, (p - 0.14) / 0.10);
        this.layerGateDoors.style.opacity = fadeIn.toFixed(3);
        this.layerGateDoors.style.pointerEvents = 'auto';

        // Camera dollies forward into the open gates
        const zoom = 1.0 + (p - 0.14) * 1.1;
        this.layerGateDoors.style.transform = `scale(${zoom.toFixed(3)}) translate3d(0, 0, 0)`;

        if (this.gateLightGlow) {
          const glow = Math.sin(((p - 0.14) / 0.32) * Math.PI);
          this.gateLightGlow.style.opacity = (glow * 0.85).toFixed(3);
        }
      } else if (p < 0.58) {
        // Camera has passed the gate into the hall
        this.layerGateDoors.style.display = 'block';
        const fadeOut = Math.max(0, 1 - (p - 0.46) / 0.10);
        this.layerGateDoors.style.opacity = fadeOut.toFixed(3);
        if (fadeOut <= 0.01) {
          this.layerGateDoors.style.pointerEvents = 'none';
        }
      } else {
        this.layerGateDoors.style.display = 'none';
        this.layerGateDoors.style.opacity = '0';
        this.layerGateDoors.style.pointerEvents = 'none';
      }
    }

    // 4. Gothic Main Hall (0.38 -> 0.82)
    if (this.layerMainHall) {
      if (p < 0.36) {
        this.layerMainHall.style.display = 'none';
        this.layerMainHall.style.opacity = '0';
      } else if (p <= 0.68) {
        this.layerMainHall.style.display = 'block';
        const fadeIn = Math.min(1, (p - 0.36) / 0.18);
        this.layerMainHall.style.opacity = fadeIn.toFixed(3);
      } else if (p < 0.82) {
        this.layerMainHall.style.display = 'block';
        const fadeOut = 1 - (p - 0.68) / 0.14;
        this.layerMainHall.style.opacity = fadeOut.toFixed(3);
      } else {
        this.layerMainHall.style.opacity = '0';
        this.layerMainHall.style.display = 'none';
      }
    }

    // 5. Circular Rotunda & 5 Chamber Doors Ring (0.64 -> 1.00)
    if (this.layerRotunda) {
      if (p < 0.62) {
        this.layerRotunda.style.display = 'none';
        this.layerRotunda.style.opacity = '0';
        this.layerRotunda.style.pointerEvents = 'none';
      } else {
        this.layerRotunda.style.display = 'block';
        const rotundaFade = Math.min(1, (p - 0.62) / 0.18);
        this.layerRotunda.style.opacity = rotundaFade.toFixed(3);
        this.layerRotunda.style.pointerEvents = 'auto';
      }
    }

    if (this.rotundaPortalRing) {
      if (p < 0.74) {
        this.rotundaPortalRing.style.display = 'none';
        this.rotundaPortalRing.style.opacity = '0';
        this.rotundaPortalRing.style.pointerEvents = 'none';
        this.rotundaPortalRing.style.transform = 'translate(-50%, -46%) scale(0.92)';
      } else {
        this.rotundaPortalRing.style.display = 'block';
        const portalFade = Math.min(1, (p - 0.74) / 0.16);
        this.rotundaPortalRing.style.opacity = portalFade.toFixed(3);
        this.rotundaPortalRing.style.pointerEvents = 'auto';
        const portalY = -50 + (1 - portalFade) * 4;
        const portalScale = 0.92 + portalFade * 0.08;
        this.rotundaPortalRing.style.transform = `translate(-50%, ${portalY.toFixed(1)}%) scale(${portalScale.toFixed(3)})`;
      }
    }
  }

  // Master Animation Loop (Synchronized 60/120 FPS Butter-Smooth)
  render(now) {
    const delta = Math.min((now - this.lastTime) * 0.001, 0.05);
    this.lastTime = now;

    // 1. Update Mouse Parallax & Gaze
    this.mouse.update(delta);

    // 2. Update Master Scroll Interpolation with Delta Damping
    const progress = this.scroll.update(delta);

    // 3. Update Camera Dolly & Head Rotation
    this.cameraController.update(progress, this.mouse);

    // 4. Render Three.js Scene & GPU Particles
    this.sceneManager.render(delta, this.mouse);

    requestAnimationFrame(this.render);
  }
}
