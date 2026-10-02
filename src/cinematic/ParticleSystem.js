/* ==========================================================================
   CODEC 2K26 — HIGH PERFORMANCE THREE.JS PARTICLE ENGINE
   Zero-Copy GPU Composited Particles:
   Ambient Dust Motes, Rising Embers & Rotunda Portal Aura
   ========================================================================== */

import * as THREE from 'three';

export class ParticleSystem {
  constructor(scene) {
    this.scene = scene;

    this.dustParticles = null;
    this.emberParticles = null;
    this.portalParticles = null;

    this.dustCount = 280;
    this.emberCount = 140;
    this.portalCount = 160;

    this.initDust();
    this.initEmbers();
    this.initPortalAura();
  }

  // Circular sprite generator for soft motes & embers
  createCircleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.35, 'rgba(255, 180, 120, 0.85)');
    grad.addColorStop(0.8, 'rgba(255, 90, 30, 0.25)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);

    const texture = new THREE.CanvasTexture(canvas);
    texture.generateMipmaps = false;
    texture.minFilter = THREE.LinearFilter;
    texture.needsUpdate = true;
    return texture;
  }

  // 1. Atmospheric Floating Dust & Mist Motes
  initDust() {
    const geom = new THREE.BufferGeometry();
    const positions = new Float32Array(this.dustCount * 3);

    for (let i = 0; i < this.dustCount; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 1] = Math.random() * 12 + 0.3;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 75;
    }

    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.22,
      map: this.createCircleTexture(),
      transparent: true,
      opacity: 0.42,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: 0xffdfaa
    });

    this.dustParticles = new THREE.Points(geom, mat);
    this.scene.add(this.dustParticles);
  }

  // 2. Rising Warm Embers
  initEmbers() {
    const geom = new THREE.BufferGeometry();
    const positions = new Float32Array(this.emberCount * 3);

    for (let i = 0; i < this.emberCount; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 26;
      positions[i * 3 + 1] = Math.random() * 9 + 0.2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 55;
    }

    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.32,
      map: this.createCircleTexture(),
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: 0xff6600
    });

    this.emberParticles = new THREE.Points(geom, mat);
    this.scene.add(this.emberParticles);
  }

  // 3. Rotunda Portal Aura Ring (Z = -32m)
  initPortalAura() {
    const geom = new THREE.BufferGeometry();
    const positions = new Float32Array(this.portalCount * 3);

    for (let i = 0; i < this.portalCount; i++) {
      const angle = (i / this.portalCount) * Math.PI * 2;
      const radius = 9.5 + Math.random() * 4.5;
      positions[i * 3 + 0] = Math.sin(angle) * radius;
      positions[i * 3 + 1] = 1.2 + Math.random() * 5.8;
      positions[i * 3 + 2] = -32 + (Math.random() - 0.5) * 6;
    }

    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.28,
      map: this.createCircleTexture(),
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: 0xffa500
    });

    this.portalParticles = new THREE.Points(geom, mat);
    this.scene.add(this.portalParticles);
  }

  // High performance transform-based animation (0 buffer re-allocations on GPU)
  update(delta = 0.016, mouseParallax = { currentX: 0, currentY: 0 }) {
    if (this.dustParticles) {
      this.dustParticles.rotation.y += delta * 0.025;
      this.dustParticles.position.x = mouseParallax.currentX * 0.25;
    }

    if (this.emberParticles) {
      this.emberParticles.rotation.y += delta * 0.045;
      this.emberParticles.position.y = (this.emberParticles.position.y + delta * 0.35) % 2.5;
    }

    if (this.portalParticles) {
      this.portalParticles.rotation.y += delta * 0.065;
    }
  }

  setHoverChamberIntensity(active) {
    if (this.portalParticles) {
      this.portalParticles.material.size = active ? 0.38 : 0.28;
      this.portalParticles.material.opacity = active ? 0.8 : 0.45;
    }
  }

  destroy() {
    if (this.dustParticles) this.scene.remove(this.dustParticles);
    if (this.emberParticles) this.scene.remove(this.emberParticles);
    if (this.portalParticles) this.scene.remove(this.portalParticles);
  }
}
