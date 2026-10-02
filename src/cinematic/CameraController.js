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

    // Believable human cinematic dolly along Z axis
    // 0.00 -> 0.28: 45m down to 18m
    // 0.28 -> 0.48: 18m down to 6m (gate opens & camera passes through)
    // 0.48 -> 0.74: 6m down to -16m (towering main hall)
    // 0.74 -> 1.00: -16m down to -34m (circular rotunda dome)
    let targetZ;
    if (p < 0.28) {
      const t = p / 0.28;
      targetZ = THREE.MathUtils.lerp(this.zStart, 18.0, t);
    } else if (p < 0.48) {
      const t = (p - 0.28) / 0.20;
      targetZ = THREE.MathUtils.lerp(18.0, 6.0, t);
    } else if (p < 0.74) {
      const t = (p - 0.48) / 0.26;
      targetZ = THREE.MathUtils.lerp(6.0, -16.0, t);
    } else {
      const t = (p - 0.74) / 0.26;
      targetZ = THREE.MathUtils.lerp(-16.0, this.zRotunda, t);
    }

    // Gentle camera walking sway when traveling
    const travelBob = Math.sin(p * 28.0) * 0.08 * (p > 0.05 && p < 0.95 ? 1 : 0.2);

    this.camera.position.x = mouseParallax.currentX * 0.4;
    this.camera.position.y = this.humanEyeHeight + travelBob + (mouseParallax.currentY * 0.2);
    this.camera.position.z = targetZ;

    // Chamber hover subtle orientation blend
    const blendedHoverYaw = this.hoverTargetYaw * this.hoverBlend;

    // Apply mouse look-at gaze with damped yaw & pitch
    this.camera.rotation.order = 'YXZ';
    this.camera.rotation.y = mouseParallax.yaw + blendedHoverYaw;
    this.camera.rotation.x = mouseParallax.pitch;
    this.camera.rotation.z = -mouseParallax.currentX * 0.02; // subtle cinematic roll
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
