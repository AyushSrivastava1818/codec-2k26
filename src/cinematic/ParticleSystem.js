/* ==========================================================================
   CODEC 2K26 — HIGH PERFORMANCE THREE.JS PARTICLE ENGINE
   GPU-Accelerated 3D Particles: Night Stars, Volumetric Fog Motes,
   Floating Embers & Chamber Portal Aura Filaments
   ========================================================================== */

import * as THREE from 'three';

export class ParticleSystem {
  constructor(scene) {
    this.scene = scene;

    this.dustParticles = null;
    this.dustGeometry = null;
    this.dustCount = 650;

    this.emberParticles = null;
    this.emberGeometry = null;
    this.emberCount = 350;

    this.portalParticles = null;
    this.portalGeometry = null;
    this.portalCount = 400;

    this.initDust();
    this.initEmbers();
    this.initPortalAura();
  }

  // Soft circle sprite generator for natural dust & embers
  createCircleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.3, 'rgba(255, 200, 150, 0.8)');
    grad.addColorStop(0.8, 'rgba(255, 120, 50, 0.2)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  // 1. Atmospheric Floating Dust & Fog Motes
  initDust() {
    this.dustGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.dustCount * 3);
    const speeds = new Float32Array(this.dustCount);

    for (let i = 0; i < this.dustCount; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 45; // X: -22m to +22m
      positions[i * 3 + 1] = Math.random() * 14 + 0.2;  // Y: floor to ceiling
      positions[i * 3 + 2] = (Math.random() - 0.5) * 85; // Z: across whole mansion
      speeds[i] = 0.2 + Math.random() * 0.4;
    }

    this.dustGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.dustGeometry.setAttribute('speed', new THREE.BufferAttribute(speeds, 1));

    const dustMaterial = new THREE.PointsMaterial({
      size: 0.22,
      map: this.createCircleTexture(),
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: 0xffdfaa
    });

    this.dustParticles = new THREE.Points(this.dustGeometry, dustMaterial);
    this.scene.add(this.dustParticles);
  }

  // 2. Burning Floating Orange Embers
  initEmbers() {
    this.emberGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.emberCount * 3);
    const velocities = new Float32Array(this.emberCount * 3);

    for (let i = 0; i < this.emberCount; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = Math.random() * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 60;

      velocities[i * 3 + 0] = (Math.random() - 0.5) * 0.3;
      velocities[i * 3 + 1] = 0.3 + Math.random() * 0.8; // float upward
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
    }

    this.emberGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.emberGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

    const emberMaterial = new THREE.PointsMaterial({
      size: 0.35,
      map: this.createCircleTexture(),
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: 0xff6600
    });

    this.emberParticles = new THREE.Points(this.emberGeometry, emberMaterial);
    this.scene.add(this.emberParticles);
  }

  // 3. Portal Chamber Energy Aura (Rotunda Area)
  initPortalAura() {
    this.portalGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.portalCount * 3);

    // Swirling ring near rotunda center (Z = -32)
    for (let i = 0; i < this.portalCount; i++) {
      const angle = (i / this.portalCount) * Math.PI * 2;
      const radius = 9 + Math.random() * 5;
      positions[i * 3 + 0] = Math.sin(angle) * radius;
      positions[i * 3 + 1] = 1.0 + Math.random() * 6.5;
      positions[i * 3 + 2] = -32 + (Math.random() - 0.5) * 8;
    }

    this.portalGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const portalMaterial = new THREE.PointsMaterial({
      size: 0.28,
      map: this.createCircleTexture(),
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: 0xffa500
    });

    this.portalParticles = new THREE.Points(this.portalGeometry, portalMaterial);
    this.scene.add(this.portalParticles);
  }

  update(delta = 0.016, mouseParallax = { currentX: 0, currentY: 0 }) {
    // 1. Update dust motes (gentle drift)
    if (this.dustGeometry) {
      const positions = this.dustGeometry.attributes.position.array;
      const speeds = this.dustGeometry.attributes.speed.array;

      for (let i = 0; i < this.dustCount; i++) {
        positions[i * 3 + 1] -= speeds[i] * delta * 0.5;
        // gentle drift in direction of mouse look
        positions[i * 3 + 0] += (mouseParallax.currentX * 0.2) * delta;

        // Wrap around floor/ceiling
        if (positions[i * 3 + 1] < 0.2) {
          positions[i * 3 + 1] = 14.0;
        }
      }
      this.dustGeometry.attributes.position.needsUpdate = true;
    }

    // 2. Update embers (rise up into air and flicker)
    if (this.emberGeometry) {
      const positions = this.emberGeometry.attributes.position.array;
      const velocities = this.emberGeometry.attributes.velocity.array;

      for (let i = 0; i < this.emberCount; i++) {
        positions[i * 3 + 0] += velocities[i * 3 + 0] * delta;
        positions[i * 3 + 1] += velocities[i * 3 + 1] * delta;
        positions[i * 3 + 2] += velocities[i * 3 + 2] * delta;

        // Wrap ember if it ascends past ceiling
        if (positions[i * 3 + 1] > 12.0) {
          positions[i * 3 + 1] = 0.5;
          positions[i * 3 + 0] = (Math.random() - 0.5) * 30;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 60;
        }
      }
      this.emberGeometry.attributes.position.needsUpdate = true;
    }

    // 3. Update rotunda portal aura (subtle slow orbital rotation)
    if (this.portalParticles) {
      this.portalParticles.rotation.y += delta * 0.08;
    }
  }

  setHoverChamberIntensity(active) {
    if (this.portalParticles) {
      this.portalParticles.material.size = active ? 0.42 : 0.28;
      this.portalParticles.material.opacity = active ? 0.85 : 0.5;
    }
  }

  destroy() {
    if (this.dustParticles) this.scene.remove(this.dustParticles);
    if (this.emberParticles) this.scene.remove(this.emberParticles);
    if (this.portalParticles) this.scene.remove(this.portalParticles);
  }
}
