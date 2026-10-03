/* ==========================================================================
   CODEC 2K26 — PHYSICAL 3D CAMERA CONTROLLER
   True Spatial Architectural Scale (1 Three.js unit = 1 meter)
   Human Eye Height = 1.7m | Mansion Travel Distance: +45m -> -36m
   Scroll Travel + Damped Mouse Look Gaze + Chamber Zoom Transition
   ========================================================================== */

import * as THREE from 'three';
import gsap from 'gsap';

export class CameraController {
  constructor(camera) {
    this.camera = camera;

    // Base architectural coordinates
    this.humanEyeHeight = 1.7; // 1.7 meters eye level
    
    // Timeline travel bounds (meters)
    this.zStart = 45.0; // Far outside establishing shot
    this.zGate = 14.0;  // Outside mansion gate
    this.zHall = -4.0;  // Inside Gothic Main Hall
    this.zRotunda = -32.0; // In center of circular rotunda

    // Camera current and target state
    this.pos = new THREE.Vector3(0, this.humanEyeHeight, this.zStart);
    this.rot = new THREE.Euler(0, 0, 0, 'YXZ');

    // Chamber doorway target positions relative to rotunda center (Z = -32.0)
    // Arc of 5 chambers around user:
    // [ABOUT] [EVENTS] [HACKATHON] [SCHEDULE] [PRIZES]
    this.chamberAngles = {
      about: -0.75,     // ~ -43 deg left
      events: -0.38,    // ~ -22 deg left
      hackathon: 0.0,   // Center forward flagship
      schedule: 0.38,   // ~ +22 deg right
      prizes: 0.75      // ~ +43 deg right
    };

    // Transition state (when entering/exiting a chamber)
    this.isEnteringChamber = false;
    this.activeChamberTarget = null;
    this.chamberLookOffset = { yaw: 0, pitch: 0 };
    this.hoverTargetYaw = 0;
    this.hoverBlend = 0;
  }

  // Update camera based on scroll progress and mouse look
  update(scrollProgress, mouseParallax) {
    if (this.isEnteringChamber) {
      // During active GSAP zoom-in/out, let GSAP control camera position
      return;
    }

    const p = Math.max(0, Math.min(1, scrollProgress));

    // True physical human cinematic dolly along Z axis
    // 0.00 -> 0.30: Approach Mansion & Gate (45m down to 14.2m)
    // 0.30 -> 0.46: GATE OPENING HOLD (Camera holds at ~14m until gate opens > 85%)
    // 0.46 -> 0.54: PASS THROUGH GATE (14m through 12m gate line down to 7m in hallway)
    // 0.54 -> 0.74: GRAND HALLWAY TRAVELLING SHOT (7m down to -16m)
    // 0.74 -> 0.88: ROTUNDA REVEAL (hallway emerges into circular rotunda, -16m to -32m)
    // 0.88 -> 1.00: ROTUNDA CENTER NAVIGATION (stops at Z = -32m)
    let targetZ;
    if (p < 0.30) {
      // Approach phase
      const t = p / 0.30;
      // Smooth deceleration toward the gate
      const easeT = Math.sin(t * Math.PI * 0.5);
      targetZ = THREE.MathUtils.lerp(this.zStart, 14.2, easeT);
    } else if (p < 0.46) {
      // Gate Opening Phase: Camera HOLDS outside the gate in anticipation
      const t = (p - 0.30) / 0.16;
      targetZ = THREE.MathUtils.lerp(14.2, 13.8, t * 0.5); // Micro-anticipation creep
    } else if (p < 0.54) {
      // Entering Gate: Gate is now open (>85%), camera physically passes through threshold
      const t = (p - 0.46) / 0.08;
      const easeEnter = t * t * (3 - 2 * t); // Smooth acceleration through threshold
      targetZ = THREE.MathUtils.lerp(13.8, 7.0, easeEnter);
    } else if (p < 0.74) {
      // Grand Hallway Travelling Dolly
      const t = (p - 0.54) / 0.20;
      targetZ = THREE.MathUtils.lerp(7.0, -16.0, t);
    } else if (p < 0.88) {
      // Rotunda Reveal
      const t = (p - 0.74) / 0.14;
      const easeRotunda = Math.sin(t * Math.PI * 0.5);
      targetZ = THREE.MathUtils.lerp(-16.0, this.zRotunda, easeRotunda);
    } else {
      // Rotunda Center Stop
      targetZ = this.zRotunda;
    }

    // Subtle human walking step inertia when travelling (never floating drone)
    const isMoving = p > 0.02 && p < 0.88 && !(p >= 0.30 && p < 0.46);
    const travelBob = isMoving ? Math.sin(p * 32.0) * 0.04 : 0;

    // Camera height is locked to human eye level (1.7m)
    this.camera.position.x = mouseParallax.currentX * 0.25;
    this.camera.position.y = this.humanEyeHeight + travelBob + (mouseParallax.currentY * 0.15);
    this.camera.position.z = targetZ;

    // Chamber hover subtle orientation blend (rotates camera slightly toward hovered arch)
    const blendedHoverYaw = this.hoverTargetYaw * this.hoverBlend;

    // Apply human eye gaze (±2-3 degrees max, damped, natural head turn)
    this.camera.rotation.order = 'YXZ';
    this.camera.rotation.y = (mouseParallax.yaw * 0.65) + blendedHoverYaw;
    this.camera.rotation.x = mouseParallax.pitch * 0.55;
    this.camera.rotation.z = -mouseParallax.currentX * 0.008; // subtle cinematic roll
  }

  // Set hovered chamber for subtle portal gaze orientation
  setHoveredChamber(chamberKey) {
    if (!chamberKey || !this.chamberAngles[chamberKey]) {
      gsap.to(this, { hoverBlend: 0, duration: 0.6, ease: 'power2.out' });
      return;
    }

    this.hoverTargetYaw = this.chamberAngles[chamberKey] * 0.4;
    gsap.to(this, { hoverBlend: 1.0, duration: 0.7, ease: 'power2.out' });
  }

  // Cinematic Chamber Push-Through
  enterChamber(chamberKey, onComplete) {
    this.isEnteringChamber = true;
    const targetAngle = this.chamberAngles[chamberKey] || 0;

    const timeline = gsap.timeline({
      onComplete: () => {
        if (onComplete) onComplete();
      }
    });

    // 1. Orient camera directly toward chamber door
    timeline.to(this.camera.rotation, {
      y: targetAngle,
      x: 0.02,
      duration: 0.6,
      ease: 'power2.inOut'
    });

    // 2. Camera physically dollies forward right through the doorway
    timeline.to(this.camera.position, {
      x: Math.sin(targetAngle) * 8.0,
      z: this.camera.position.z - 8.0,
      duration: 0.85,
      ease: 'power3.in'
    }, '-=0.2');

    return timeline;
  }

  // Cinematic Chamber Exit Back to Rotunda Center
  exitChamber(onComplete) {
    const timeline = gsap.timeline({
      onComplete: () => {
        this.isEnteringChamber = false;
        if (onComplete) onComplete();
      }
    });

    // Camera dollies backwards through doorway to rotunda center
    timeline.to(this.camera.position, {
      x: 0,
      y: this.humanEyeHeight,
      z: this.zRotunda,
      duration: 0.8,
      ease: 'power3.out'
    });

    timeline.to(this.camera.rotation, {
      y: 0,
      x: 0,
      duration: 0.7,
      ease: 'power2.out'
    }, '-=0.5');

    return timeline;
  }
}
