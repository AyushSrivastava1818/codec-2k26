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
    this.lockSoundPlayed = false;

    // Debug Mode Telemetry ('D' Key Toggle - Requirement #58)
    this.debugActive = false;
    this.debugHud = null;
    this.fpsCounter = 60;
    this.framesThisSecond = 0;
    this.fpsLastCheck = performance.now();

    this.render = this.render.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
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
    document.querySelectorAll('.rotunda-door-pill, .gothic-arch-portal-card, .rotunda-portal-door').forEach(door => {
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

    // Debug Mode Keydown Listener ('D' or 'd')
    window.addEventListener('keydown', this.onKeyDown);

    // Clear any residual hash on load to prevent unwanted auto-opening of chambers
    if (window.location.hash && ['#about', '#events', '#hackathon', '#schedule', '#prizes'].includes(window.location.hash.toLowerCase())) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  }

  onKeyDown(e) {
    // Toggle development debug HUD with 'D' / 'd' (Requirement #58)
    if (e.key === 'd' || e.key === 'D') {
      // Ignore if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
      this.toggleDebugHUD();
    }
  }

  toggleDebugHUD() {
    this.debugActive = !this.debugActive;
    if (this.debugActive) {
      if (!this.debugHud) {
        this.debugHud = document.createElement('div');
        this.debugHud.id = 'cinematic-debug-hud';
        this.debugHud.className = 'cinematic-debug-hud';
        this.debugHud.innerHTML = `
          <div class="dbg-header">CODEC 2K26 TELEMETRY [D TO CLOSE]</div>
          <div class="dbg-row"><span>FPS:</span> <b id="dbg-fps">60</b></div>
          <div class="dbg-row"><span>STAGE:</span> <b id="dbg-stage">EXTERIOR_FAR</b></div>
          <div class="dbg-row"><span>CAM POS:</span> <b id="dbg-pos">X:0.0 Y:1.7 Z:45.0</b></div>
          <div class="dbg-row"><span>CAM ROT:</span> <b id="dbg-rot">Y:0.0° P:0.0°</b></div>
          <div class="dbg-row"><span>SCROLL:</span> <b id="dbg-scroll">0.0%</b></div>
          <div class="dbg-row"><span>GATE:</span> <b id="dbg-gate">0.0%</b></div>
          <div class="dbg-row"><span>HOVER:</span> <b id="dbg-hover">NONE</b></div>
          <div class="dbg-row"><span>CHAMBER:</span> <b id="dbg-active">NONE</b></div>
        `;
        document.body.appendChild(this.debugHud);
      }
      this.debugHud.style.display = 'block';
    } else if (this.debugHud) {
      this.debugHud.style.display = 'none';
    }
  }

  updateDebugTelemetry(p, delta) {
    if (!this.debugActive || !this.debugHud) return;

    // Calculate smoothed FPS
    this.framesThisSecond++;
    const now = performance.now();
    if (now - this.fpsLastCheck >= 500) {
      this.fpsCounter = Math.round((this.framesThisSecond * 1000) / (now - this.fpsLastCheck));
      this.framesThisSecond = 0;
      this.fpsLastCheck = now;
    }

    const cam = this.sceneManager.camera;
    const camPos = cam ? cam.position : { x: 0, y: 1.7, z: 0 };
    const camRot = cam ? cam.rotation : { x: 0, y: 0, z: 0 };

    let gateP = 0;
    if (p >= 0.30 && p < 0.46) {
      gateP = (p - 0.30) / 0.16;
    } else if (p >= 0.46) {
      gateP = 1.0;
    }

    const fpsEl = document.getElementById('dbg-fps');
    const stageEl = document.getElementById('dbg-stage');
    const posEl = document.getElementById('dbg-pos');
    const rotEl = document.getElementById('dbg-rot');
    const scrollEl = document.getElementById('dbg-scroll');
    const gateEl = document.getElementById('dbg-gate');
    const hoverEl = document.getElementById('dbg-hover');
    const activeEl = document.getElementById('dbg-active');

    if (fpsEl) fpsEl.textContent = `${this.fpsCounter}`;
    if (stageEl) stageEl.textContent = this.scroll.currentStageName;
    if (posEl) posEl.textContent = `X:${camPos.x.toFixed(2)} Y:${camPos.y.toFixed(2)} Z:${camPos.z.toFixed(2)}`;
    if (rotEl) rotEl.textContent = `Y:${(camRot.y * 180 / Math.PI).toFixed(1)}° P:${(camRot.x * 180 / Math.PI).toFixed(1)}°`;
    if (scrollEl) scrollEl.textContent = `${(p * 100).toFixed(1)}%`;
    if (gateEl) gateEl.textContent = `${(gateP * 100).toFixed(1)}%`;
    if (hoverEl) hoverEl.textContent = this.sceneManager.hoveredChamberKey ? this.sceneManager.hoveredChamberKey.toUpperCase() : 'NONE';
    if (activeEl) activeEl.textContent = this.chamberManager.activeChamberKey ? this.chamberManager.activeChamberKey.toUpperCase() : 'NONE';
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
    // Stage callbacks
  }

  // Continuous visual transitions across stages with physical Three.js gate animation
  onScrollProgress(p) {
    audioManager.onScrollProgress(p);

    // 1. Calculate and update 3D physical gate opening (Requirement #09, #10, #13)
    let gateP = 0;
    if (p >= 0.30 && p < 0.46) {
      gateP = (p - 0.30) / 0.16;
    } else if (p >= 0.46) {
      gateP = 1.0;
    }

    if (this.sceneManager) {
      this.sceneManager.setGateOpening(gateP);
      this.sceneManager.updateLighting(p);
    }

    // Physical latch lock release sound at 10-20% gate opening
    if (p >= 0.32 && !this.lockSoundPlayed) {
      audioManager.playLockRelease();
      this.lockSoundPlayed = true;
    } else if (p < 0.28) {
      this.lockSoundPlayed = false;
    }

    // 2. Hero Title & Scroll Prompt (Fade out smoothly as camera approaches: 0.00 -> 0.20)
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

    // 3. Seamless backdrop atmospheric blending (Never an abrupt slideshow cut)
    if (this.layerExterior) {
      if (p <= 0.28) {
        this.layerExterior.style.display = 'block';
        this.layerExterior.style.opacity = '1';
        this.layerExterior.style.transform = `scale(${(1.0 + p * 0.4).toFixed(3)}) translate3d(0, 0, 0)`;
      } else if (p < 0.48) {
        this.layerExterior.style.display = 'block';
        const fade = 1 - (p - 0.28) / 0.20;
        this.layerExterior.style.opacity = fade.toFixed(3);
      } else {
        this.layerExterior.style.opacity = '0';
        this.layerExterior.style.display = 'none';
      }
    }

    // 4. Rotunda Museum HUD (Appears only when settling into the circular rotunda: p >= 0.76)
    if (this.rotundaPortalRing) {
      if (p < 0.76) {
        this.rotundaPortalRing.style.display = 'none';
        this.rotundaPortalRing.style.opacity = '0';
        this.rotundaPortalRing.style.pointerEvents = 'none';
        this.rotundaPortalRing.style.transform = 'translate(-50%, 20px)';
      } else {
        this.rotundaPortalRing.style.display = 'block';
        const hudFade = Math.min(1, (p - 0.76) / 0.14);
        this.rotundaPortalRing.style.opacity = hudFade.toFixed(3);
        this.rotundaPortalRing.style.pointerEvents = hudFade > 0.4 ? 'auto' : 'none';
        const hudY = (1 - hudFade) * 20;
        this.rotundaPortalRing.style.transform = `translate(-50%, ${hudY.toFixed(1)}px)`;
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

    // 5. Update Debug Telemetry HUD if active ('D' Key)
    this.updateDebugTelemetry(progress, delta);

    requestAnimationFrame(this.render);
  }
}
