/* ==========================================================================
   CODEC 2K26 — THREE.JS 3D SCENE MANAGER
   Photorealistic Continuous Mansion Architecture:
   - Reflective Wet Stone Floor Pathway (+50m to -45m)
   - Real Architectural Double-Leaf Metal Entrance Gate (Z = 12m)
     with proper LeftGatePivot & RightGatePivot hinges & lock mechanism
   - Motivated Interior Amber Gate Burst Light
   - Monumental Grand Hallway Colonnade & Vaulted Ribs (Z = 12m to -18m)
   - Enormous Circular Rotunda (Z = -18m to -45m) with 12 Columns & Dome
   - 5 Physical Chamber Doorways with Motivated Spotlights & Raycasting
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
    this.hallwayLights = [];
    this.chamberLights = {};

    // Gate Architecture & Proper Hinge Pivots
    this.gateGroup = null;
    this.leftGatePivot = null;
    this.rightGatePivot = null;
    this.gateLockMesh = null;
    this.gateProgress = 0;

    // Architectural groups
    this.hallwayGroup = null;
    this.rotundaGroup = null;

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
    // 1. Scene & Atmospheric Depth Fog (Dark gothic night)
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x06050a, 0.024);

    // 2. Camera (Realistic 38mm human eye architectural field of view)
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(46, aspect, 0.1, 160);
    this.camera.position.set(0, 1.7, 45.0); // Start at realistic human eye height (1.7m)

    // 3. WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({
      powerPreference: 'high-performance',
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;

    this.renderer.domElement.id = 'cinematic-webgl-canvas';
    this.renderer.domElement.style.position = 'absolute';
    this.renderer.domElement.style.top = '0';
    this.renderer.domElement.style.left = '0';
    this.renderer.domElement.style.width = '100%';
    this.renderer.domElement.style.height = '100%';
    this.renderer.domElement.style.pointerEvents = 'none';
    this.renderer.domElement.style.zIndex = '10';

    this.container.appendChild(this.renderer.domElement);

    // 4. Master Lighting
    this.initLighting();

    // 5. Materials
    this.initMaterials();

    // 6. Build Continuous Physical Architecture
    this.buildGroundPathway();
    this.buildExteriorGate();
    this.buildGrandHallway();
    this.buildCircularRotunda();

    // 7. Particles (Volumetric mist & subtle atmospheric motes)
    this.particles = new ParticleSystem(this.scene);

    // 8. Event listeners
    window.addEventListener('resize', this.onWindowResize);
    window.addEventListener('mousemove', this.onPointerMove, { passive: true });
    window.addEventListener('click', this.onPointerClick);
  }

  initLighting() {
    // Gothic deep dark ambient fill
    this.ambientLight = new THREE.AmbientLight(0x121018, 0.85);
    this.scene.add(this.ambientLight);

    // High angle moonlight (cool blue-slate)
    this.moonLight = new THREE.DirectionalLight(0x88a8d8, 1.5);
    this.moonLight.position.set(-16, 38, 22);
    this.scene.add(this.moonLight);

    // Motivated interior gate amber burst light (Z = 10.5m behind gate)
    // Initially dark (0.0), blooms as gate opens
    this.gateLight = new THREE.PointLight(0xff7711, 0.0, 26, 1.6);
    this.gateLight.position.set(0, 3.2, 10.5);
    this.scene.add(this.gateLight);

    // Rotunda central core warm ambient glow (Z = -32m)
    this.rotundaCoreLight = new THREE.PointLight(0xffa522, 1.2, 38, 1.4);
    this.rotundaCoreLight.position.set(0, 4.5, -32);
    this.scene.add(this.rotundaCoreLight);
  }

  initMaterials() {
    // Dark aged masonry
    this.matStone = new THREE.MeshStandardMaterial({
      color: 0x18161e,
      roughness: 0.82,
      metalness: 0.12
    });

    // Wet reflective polished stone floor
    this.matFloor = new THREE.MeshStandardMaterial({
      color: 0x0a090e,
      roughness: 0.28,
      metalness: 0.35
    });

    // Dark blackened wrought iron metal for gate panels
    this.matGateMetal = new THREE.MeshStandardMaterial({
      color: 0x141318,
      roughness: 0.45,
      metalness: 0.85
    });

    // Heavy iron lock bar & hinges
    this.matLock = new THREE.MeshStandardMaterial({
      color: 0x221f28,
      roughness: 0.40,
      metalness: 0.90
    });

    // Warm lantern glass / emitter
    this.matLanternGlow = new THREE.MeshBasicMaterial({
      color: 0xffa533
    });

    // Architectural brass / gold trim
    this.matGold = new THREE.MeshStandardMaterial({
      color: 0x997733,
      roughness: 0.42,
      metalness: 0.75
    });
  }

  // 1. Continuous Ground & Pathway from outside (+50m) through rotunda (-45m)
  buildGroundPathway() {
    const floorGeo = new THREE.PlaneGeometry(16, 100);
    floorGeo.rotateX(-Math.PI / 2);
    const floorMesh = new THREE.Mesh(floorGeo, this.matFloor);
    floorMesh.position.set(0, 0, 0); // Spans Z = +50m to -50m
    this.scene.add(floorMesh);

    // Pathway Stone Curbs (Left & Right)
    const curbGeo = new THREE.BoxGeometry(0.5, 0.25, 96);
    const leftCurb = new THREE.Mesh(curbGeo, this.matStone);
    leftCurb.position.set(-4.5, 0.12, 0);
    this.scene.add(leftCurb);

    const rightCurb = new THREE.Mesh(curbGeo, this.matStone);
    rightCurb.position.set(4.5, 0.12, 0);
    this.scene.add(rightCurb);

    // Outer perimeter stone boundary walls outside (Z = 14m to 48m)
    const extWallGeo = new THREE.BoxGeometry(0.8, 3.8, 34);
    const leftExtWall = new THREE.Mesh(extWallGeo, this.matStone);
    leftExtWall.position.set(-7.5, 1.9, 31);
    this.scene.add(leftExtWall);

    const rightExtWall = new THREE.Mesh(extWallGeo, this.matStone);
    rightExtWall.position.set(7.5, 1.9, 31);
    this.scene.add(rightExtWall);

    // Exterior stone pedestal lanterns at Z = 28m and 20m
    [-4.8, 4.8].forEach(x => {
      [28, 20].forEach(z => {
        const ped = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.8, 0.7), this.matStone);
        ped.position.set(x, 0.9, z);
        this.scene.add(ped);

        const lantern = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.5, 0.35), this.matLanternGlow);
        lantern.position.set(x, 2.05, z);
        this.scene.add(lantern);

        const pl = new THREE.PointLight(0xff9922, 0.65, 9, 2.0);
        pl.position.set(x, 2.1, z);
        this.scene.add(pl);
      });
    });
  }

  // 2. Physical Double-Leaf Gate Architecture at Z = 12.0m with proper outer hinge pivots
  buildExteriorGate() {
    this.gateGroup = new THREE.Group();
    this.gateGroup.position.set(0, 0, 12.0);

    // Massive Stone Pillars (Left & Right)
    const pillarGeo = new THREE.BoxGeometry(1.3, 9.2, 1.5);
    const leftPillar = new THREE.Mesh(pillarGeo, this.matStone);
    leftPillar.position.set(-3.85, 4.6, 0);
    this.gateGroup.add(leftPillar);

    const rightPillar = new THREE.Mesh(pillarGeo, this.matStone);
    rightPillar.position.set(3.85, 4.6, 0);
    this.gateGroup.add(rightPillar);

    // Overhead Heavy Stone Lintel / Arch
    const lintelGeo = new THREE.BoxGeometry(9.0, 2.4, 1.5);
    const lintel = new THREE.Mesh(lintelGeo, this.matStone);
    lintel.position.set(0, 8.8, 0);
    this.gateGroup.add(lintel);

    // Architectural CODEC Inscription Plaque on Lintel
    const plaqueGeo = new THREE.BoxGeometry(4.2, 0.8, 0.2);
    const plaque = new THREE.Mesh(plaqueGeo, this.matGold);
    plaque.position.set(0, 8.8, 0.8);
    this.gateGroup.add(plaque);

    // Pillar Lanterns
    [-3.85, 3.85].forEach(x => {
      const lamp = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.65, 0.4), this.matLanternGlow);
      lamp.position.set(x, 3.8, 0.85);
      this.gateGroup.add(lamp);

      const lampLight = new THREE.PointLight(0xff8811, 0.85, 10, 1.8);
      lampLight.position.set(x, 3.8, 1.0);
      this.gateGroup.add(lampLight);
    });

    // --- PROPER GATE HINGE PIVOTS (CRITICAL BRIEF REQUIREMENT #10) ---
    // Gate opening width is ~6.4m total (3.2m per door panel)
    // Left hinge sits at outer post: X = -3.20m, Y = 0, Z = 0
    this.leftGatePivot = new THREE.Object3D();
    this.leftGatePivot.position.set(-3.20, 0, 0);
    this.gateGroup.add(this.leftGatePivot);

    // Right hinge sits at outer post: X = +3.20m, Y = 0, Z = 0
    this.rightGatePivot = new THREE.Object3D();
    this.rightGatePivot.position.set(3.20, 0, 0);
    this.gateGroup.add(this.rightGatePivot);

    // Helper to construct realistic double-leaf metal gate panel geometry
    const createDoorLeafMesh = () => {
      const leafGroup = new THREE.Group();

      // Outer heavy metal frame
      const frameGeo = new THREE.BoxGeometry(3.18, 7.2, 0.16);
      const frame = new THREE.Mesh(frameGeo, this.matGateMetal);
      leafGroup.add(frame);

      // Vertical Gothic iron bars
      const barGeo = new THREE.CylinderGeometry(0.04, 0.04, 6.8, 8);
      for (let i = -1.35; i <= 1.35; i += 0.38) {
        const bar = new THREE.Mesh(barGeo, this.matGateMetal);
        bar.position.set(i, 0, 0.05);
        leafGroup.add(bar);
      }

      // Horizontal reinforcement cross-braces
      [-2.4, -0.6, 1.2, 2.6].forEach(y => {
        const brace = new THREE.Mesh(new THREE.BoxGeometry(3.1, 0.18, 0.20), this.matGateMetal);
        brace.position.set(0, y, 0);
        leafGroup.add(brace);
      });

      return leafGroup;
    };

    // Attach Left Leaf to Left Pivot: Offset center by +width/2 (+1.60m)
    // When rotation.y = 0, panel spans from X = -3.20m to 0.0m (closed)
    const leftMesh = createDoorLeafMesh();
    leftMesh.position.set(1.59, 3.6, 0);
    this.leftGatePivot.add(leftMesh);

    // Attach Right Leaf to Right Pivot: Offset center by -width/2 (-1.60m)
    // When rotation.y = 0, panel spans from X = 0.0m to +3.20m (closed)
    const rightMesh = createDoorLeafMesh();
    rightMesh.position.set(-1.59, 3.6, 0);
    this.rightGatePivot.add(rightMesh);

    // Heavy Central Locking Mechanism Bar at X = 0, Y = 2.0m
    const lockGeo = new THREE.BoxGeometry(0.55, 0.22, 0.28);
    this.gateLockMesh = new THREE.Mesh(lockGeo, this.matLock);
    this.gateLockMesh.position.set(0, 2.0, 0.12);
    this.gateGroup.add(this.gateLockMesh);

    this.scene.add(this.gateGroup);
  }

  // 3. Grand Gothic Hallway Colonnade (Z = 12m to -18m, 30m long)
  buildGrandHallway() {
    this.hallwayGroup = new THREE.Group();

    // Colonnade Column Pairs at Z = 7m, 1m, -5m, -11m, -17m
    const colGeo = new THREE.CylinderGeometry(0.55, 0.65, 10.5, 12);
    const archGeo = new THREE.BoxGeometry(8.8, 0.6, 0.9);

    const zStops = [7, 1, -5, -11, -17];
    zStops.forEach(z => {
      // Left Column (X = -4.1m)
      const leftCol = new THREE.Mesh(colGeo, this.matStone);
      leftCol.position.set(-4.1, 5.25, z);
      this.hallwayGroup.add(leftCol);

      // Right Column (X = +4.1m)
      const rightCol = new THREE.Mesh(colGeo, this.matStone);
      rightCol.position.set(4.1, 5.25, z);
      this.hallwayGroup.add(rightCol);

      // Overhead Vaulted Transverse Rib Arch
      const rib = new THREE.Mesh(archGeo, this.matStone);
      rib.position.set(0, 10.2, z);
      this.hallwayGroup.add(rib);

      // Motivated Wall Sconces on columns
      [-4.1, 4.1].forEach(x => {
        const sconce = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.45, 0.25), this.matLanternGlow);
        sconce.position.set(x > 0 ? x - 0.55 : x + 0.55, 3.2, z);
        this.hallwayGroup.add(sconce);

        const sconceLight = new THREE.PointLight(0xff8811, 0.75, 9, 2.0);
        sconceLight.position.set(x > 0 ? x - 0.65 : x + 0.65, 3.2, z);
        this.hallwayGroup.add(sconceLight);
        this.hallwayLights.push(sconceLight);
      });
    });

    // Hallway Side Walls
    const wallGeo = new THREE.BoxGeometry(0.6, 11, 30);
    const leftWall = new THREE.Mesh(wallGeo, this.matStone);
    leftWall.position.set(-5.5, 5.5, -3);
    this.hallwayGroup.add(leftWall);

    const rightWall = new THREE.Mesh(wallGeo, this.matStone);
    rightWall.position.set(5.5, 5.5, -3);
    this.hallwayGroup.add(rightWall);

    // Ceiling Plane
    const ceilingGeo = new THREE.BoxGeometry(11, 0.6, 30);
    const ceiling = new THREE.Mesh(ceilingGeo, this.matStone);
    ceiling.position.set(0, 10.8, -3);
    this.hallwayGroup.add(ceiling);

    this.scene.add(this.hallwayGroup);
  }

  // 4. Gigantic Circular Rotunda (Z = -18m to -45m, center Z = -32m, diameter 28m)
  buildCircularRotunda() {
    this.rotundaGroup = new THREE.Group();
    const rotundaCenterZ = -32.0;
    const rotundaRadius = 14.2;

    // 12 Monumental Circular Pillars forming the grand rotunda peristyle
    const pillarGeo = new THREE.CylinderGeometry(0.7, 0.8, 14.5, 16);
    const numPillars = 12;
    for (let i = 0; i < numPillars; i++) {
      const angle = (i / numPillars) * Math.PI * 2;
      // Skip entrance from hallway (angle ~ 0 rad toward +Z)
      if (Math.abs(angle - Math.PI / 2) < 0.35) continue;

      const px = Math.cos(angle) * rotundaRadius;
      const pz = rotundaCenterZ + Math.sin(angle) * rotundaRadius;

      const pillar = new THREE.Mesh(pillarGeo, this.matStone);
      pillar.position.set(px, 7.25, pz);
      this.rotundaGroup.add(pillar);
    }

    // High Circular Dome Lintel Ring
    const ringGeo = new THREE.TorusGeometry(rotundaRadius, 0.6, 8, 36);
    ringGeo.rotateX(Math.PI / 2);
    const ringMesh = new THREE.Mesh(ringGeo, this.matStone);
    ringMesh.position.set(0, 14.2, rotundaCenterZ);
    this.rotundaGroup.add(ringMesh);

    // Central Rotunda Floor Medallion (Polished Stone Emblem)
    const medalGeo = new THREE.CylinderGeometry(5.2, 5.2, 0.05, 32);
    const medalMesh = new THREE.Mesh(medalGeo, this.matGold);
    medalMesh.position.set(0, 0.03, rotundaCenterZ);
    this.rotundaGroup.add(medalMesh);

    // 5 Physical Architectural Chamber Doorways
    const chambers = [
      { key: 'about', label: 'CHAMBER 00: ARCHIVES', angle: -0.75, color: 0xffa533 },
      { key: 'events', label: 'CHAMBER I: EVENTS', angle: -0.38, color: 0x33a5ff },
      { key: 'hackathon', label: 'CHAMBER II: HACKATHON', angle: 0.0, color: 0xff4422, flagship: true },
      { key: 'schedule', label: 'CHAMBER III: SCHEDULE', angle: 0.38, color: 0xffcc33 },
      { key: 'prizes', label: 'CHAMBER IV: CEREMONIAL', angle: 0.75, color: 0xffdd44 }
    ];

    chambers.forEach(c => {
      const doorGroup = new THREE.Group();

      // Position in rotunda arc facing center
      const doorDist = rotundaRadius - 0.4;
      const posX = Math.sin(c.angle) * doorDist;
      const posZ = rotundaCenterZ - Math.cos(c.angle) * doorDist;

      doorGroup.position.set(posX, 0, posZ);
      doorGroup.rotation.y = c.angle;

      // Stone Door Frame (Left, Right, Lintel)
      const postGeo = new THREE.BoxGeometry(0.5, c.flagship ? 8.2 : 6.8, 0.7);
      const leftPost = new THREE.Mesh(postGeo, this.matStone);
      leftPost.position.set(-2.0, c.flagship ? 4.1 : 3.4, 0);
      doorGroup.add(leftPost);

      const rightPost = new THREE.Mesh(postGeo, this.matStone);
      rightPost.position.set(2.0, c.flagship ? 4.1 : 3.4, 0);
      doorGroup.add(rightPost);

      const headGeo = new THREE.BoxGeometry(4.8, 1.2, 0.9);
      const head = new THREE.Mesh(headGeo, this.matStone);
      head.position.set(0, c.flagship ? 8.2 : 6.8, 0);
      doorGroup.add(head);

      // Illuminated Architectural Signage Plaque
      const signGeo = new THREE.BoxGeometry(3.2, 0.45, 0.1);
      const signMat = new THREE.MeshStandardMaterial({
        color: c.color,
        emissive: c.color,
        emissiveIntensity: 0.45,
        roughness: 0.3
      });
      const signMesh = new THREE.Mesh(signGeo, signMat);
      signMesh.position.set(0, c.flagship ? 7.2 : 5.8, 0.4);
      doorGroup.add(signMesh);

      // Recessed Interior Threshold Void (Dark aperture)
      const voidGeo = new THREE.PlaneGeometry(3.6, c.flagship ? 7.2 : 5.8);
      const voidMat = new THREE.MeshBasicMaterial({ color: 0x050407 });
      const voidMesh = new THREE.Mesh(voidGeo, voidMat);
      voidMesh.position.set(0, (c.flagship ? 7.2 : 5.8) / 2, -0.2);
      doorGroup.add(voidMesh);

      // Motivated Doorway Spotlight (brightens on hover by +15-20%)
      const spot = new THREE.PointLight(c.color, 0.75, 12, 1.8);
      spot.position.set(0, c.flagship ? 7.5 : 6.2, 1.5);
      doorGroup.add(spot);
      this.chamberLights[c.key] = spot;

      // Raycast Target Plane (Transparent, responsive)
      const rayGeo = new THREE.PlaneGeometry(3.8, c.flagship ? 7.6 : 6.2);
      const rayMat = new THREE.MeshBasicMaterial({
        color: c.color,
        transparent: true,
        opacity: 0.0,
        side: THREE.DoubleSide
      });
      const rayMesh = new THREE.Mesh(rayGeo, rayMat);
      rayMesh.position.set(0, (c.flagship ? 7.6 : 6.2) / 2, 0.1);
      rayMesh.userData = { chamberKey: c.key, label: c.label, light: spot };
      doorGroup.add(rayMesh);

      this.chamberMeshes.push(rayMesh);
      this.rotundaGroup.add(doorGroup);
    });

    this.scene.add(this.rotundaGroup);
  }

  // --- GATE OPENING ANIMATION (CRITICAL BRIEF REQUIREMENT #09, #10, #11) ---
  // Precise physical inertia sequence:
  // 0-10%: completely still
  // 10-20%: small lock movement
  // 20-30%: physical vibration / latch release
  // 30-45%: left panel swings inward
  // 45-80%: right panel swings inward
  // 80-100%: heavy deceleration until completely open
  setGateOpening(progress) {
    this.gateProgress = Math.max(0, Math.min(1, progress));
    const p = this.gateProgress;

    if (!this.leftGatePivot || !this.rightGatePivot) return;

    const maxSwingRad = 1.48; // ~85 degrees inward opening

    if (p <= 0.10) {
      // 0-10%: Completely still
      this.leftGatePivot.rotation.y = 0;
      this.rightGatePivot.rotation.y = 0;
      if (this.gateLockMesh) {
        this.gateLockMesh.position.y = 2.0;
        this.gateLockMesh.rotation.z = 0;
      }
      if (this.gateLight) this.gateLight.intensity = 0.0;
    } else if (p <= 0.20) {
      // 10-20%: Small locking mechanism movement
      const t = (p - 0.10) / 0.10;
      if (this.gateLockMesh) {
        this.gateLockMesh.position.y = 2.0 + t * 0.15;
        this.gateLockMesh.rotation.z = t * 0.12;
      }
      this.leftGatePivot.rotation.y = 0;
      this.rightGatePivot.rotation.y = 0;
      if (this.gateLight) this.gateLight.intensity = 0.0;
    } else if (p <= 0.30) {
      // 20-30%: Tiny physical vibration / latch release
      const t = (p - 0.20) / 0.10;
      const jitter = Math.sin(t * Math.PI * 8) * 0.008;
      this.leftGatePivot.rotation.y = -jitter;
      this.rightGatePivot.rotation.y = jitter;
      if (this.gateLockMesh) {
        this.gateLockMesh.position.y = 2.15 + t * 0.2;
        this.gateLockMesh.rotation.z = 0.12 + t * 0.2;
      }
      // 5% gap light: tiny warm amber glow
      if (this.gateLight) this.gateLight.intensity = t * 0.35;
    } else if (p <= 0.45) {
      // 30-45%: Left panel begins moving
      const t = (p - 0.30) / 0.15;
      const easeLeft = t * t; // Slow acceleration
      this.leftGatePivot.rotation.y = -easeLeft * (maxSwingRad * 0.40);
      this.rightGatePivot.rotation.y = 0.01;
      if (this.gateLockMesh) this.gateLockMesh.visible = false;
      // 20% gap: visible interior glow
      if (this.gateLight) this.gateLight.intensity = 0.35 + t * 0.85;
    } else if (p <= 0.80) {
      // 45-80%: Both panels continue opening with believable inertia
      const t = (p - 0.45) / 0.35;
      const easeLeft = 0.40 + t * 0.45;
      const easeRight = Math.sin(t * Math.PI * 0.5) * 0.85;
      this.leftGatePivot.rotation.y = -easeLeft * maxSwingRad;
      this.rightGatePivot.rotation.y = easeRight * maxSwingRad;
      // 40-60% gap: floor catches light, hallway becomes visible
      if (this.gateLight) this.gateLight.intensity = 1.2 + t * 2.6;
    } else {
      // 80-100%: Heavy deceleration until completely open
      const t = (p - 0.80) / 0.20;
      const easeFinish = 0.85 + (1 - Math.cos(t * Math.PI * 0.5)) * 0.15;
      this.leftGatePivot.rotation.y = -easeFinish * maxSwingRad;
      this.rightGatePivot.rotation.y = easeFinish * maxSwingRad;
      // 100%: full entrance interior wash
      if (this.gateLight) this.gateLight.intensity = 3.8 + t * 1.0;
    }
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

    // 3. Trigger only if user clicked on a hovered 3D doorway mesh in the rotunda
    if (this.hoveredChamberKey && this.onChamberClick) {
      const key = this.hoveredChamberKey;
      this.hoveredChamberKey = null;
      this.onChamberClick(key);
    }
  }

  checkRaycast() {
    // Only raycast when camera is in rotunda (Z < -16m)
    if (!this.camera || this.camera.position.z > -16) {
      if (this.hoveredChamberKey) {
        this.hoveredChamberKey = null;
        if (this.onChamberHover) this.onChamberHover(null);
      }
      return;
    }

    if (!this.mouseMoved && this.hoveredChamberKey !== null) {
      return;
    }
    this.mouseMoved = false;

    this.raycaster.setFromCamera(this.mouseVec, this.camera);
    const intersects = this.raycaster.intersectObjects(this.chamberMeshes);

    if (intersects.length > 0) {
      const hitKey = intersects[0].object.userData.chamberKey;
      if (hitKey !== this.hoveredChamberKey) {
        // Reset previous light
        if (this.hoveredChamberKey && this.chamberLights[this.hoveredChamberKey]) {
          this.chamberLights[this.hoveredChamberKey].intensity = 0.75;
        }
        this.hoveredChamberKey = hitKey;
        // Boost light by +15-20% on hover (Brief requirement #47)
        if (this.chamberLights[hitKey]) {
          this.chamberLights[hitKey].intensity = 1.15;
        }
        if (this.onChamberHover) this.onChamberHover(hitKey);
      }
    } else {
      if (this.hoveredChamberKey) {
        if (this.chamberLights[this.hoveredChamberKey]) {
          this.chamberLights[this.hoveredChamberKey].intensity = 0.75;
        }
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

  // Master update from scroll controller
  updateLighting(p) {
    // Rotunda core light warms up when approaching rotunda (p > 0.65)
    if (this.rotundaCoreLight) {
      if (p > 0.65) {
        this.rotundaCoreLight.intensity = 1.0 + (p - 0.65) * 1.6;
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
