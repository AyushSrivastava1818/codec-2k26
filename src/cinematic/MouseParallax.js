/* ==========================================================================
   CODEC 2K26 — CINEMATIC MOUSE PARALLAX & CAMERA GAZE
   Damped Gaze Tracking (-1.0 to +1.0) with Multi-Depth Multipliers
   Organic Idle Breathing Sway & Touch Drag Fallback
   ========================================================================== */

export class MouseParallax {
  constructor() {
    this.targetX = 0;
    this.targetY = 0;
    this.currentX = 0;
    this.currentY = 0;

    // Head rotation targets (radians)
    this.pitch = 0; // vertical look
    this.yaw = 0;   // horizontal look

    // Damping factor (cinematic smooth inertia)
    this.damping = 0.04;

    // Organic idle sway
    this.idleTime = 0;
    this.lastMoveTime = Date.now();

    // Multi-depth layer multipliers
    this.depths = {
      background: 0.15,
      midground: 0.40,
      architecture: 0.70,
      foreground: 1.00
    };

    this.onMove = this.onMove.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.initListeners();
  }

  initListeners() {
    window.addEventListener('mousemove', this.onMove, { passive: true });
    window.addEventListener('touchmove', this.onTouchMove, { passive: true });

    // Reset softly on mouse leave
    document.addEventListener('mouseleave', () => {
      this.targetX = 0;
      this.targetY = 0;
    });
  }

  onMove(e) {
    const halfW = window.innerWidth / 2;
    const halfH = window.innerHeight / 2;
    // Normalize coordinates -1.0 (left/top) to +1.0 (right/bottom)
    this.targetX = (e.clientX - halfW) / halfW;
    this.targetY = (e.clientY - halfH) / halfH;
    this.lastMoveTime = Date.now();
  }

  onTouchMove(e) {
    if (!e.touches || e.touches.length === 0) return;
    const touch = e.touches[0];
    const halfW = window.innerWidth / 2;
    const halfH = window.innerHeight / 2;
    this.targetX = ((touch.clientX - halfW) / halfW) * 0.75;
    this.targetY = ((touch.clientY - halfH) / halfH) * 0.75;
    this.lastMoveTime = Date.now();
  }

  update(delta = 0.016) {
    this.idleTime += delta;

    // Organic subtle breathing when idle
    const isStationary = Date.now() - this.lastMoveTime > 1200;
    let swayX = 0;
    let swayY = 0;
    if (isStationary) {
      swayX = Math.sin(this.idleTime * 0.8) * 0.04;
      swayY = Math.cos(this.idleTime * 0.6) * 0.025;
    }

    const effectiveTargetX = Math.max(-1, Math.min(1, this.targetX + swayX));
    const effectiveTargetY = Math.max(-1, Math.min(1, this.targetY + swayY));

    // Frame-rate independent exponential decay interpolation (fluid gaze without lag)
    const decay = 1 - Math.exp(-7.5 * Math.min(delta, 0.05));
    this.currentX += (effectiveTargetX - this.currentX) * decay;
    this.currentY += (effectiveTargetY - this.currentY) * decay;

    // Subtle look angles (radians)
    // Looking right (positive currentX) -> yaw slightly negative for camera or positive
    this.yaw = -this.currentX * 0.12;   // ~6.8 degrees max yaw
    this.pitch = -this.currentY * 0.08; // ~4.5 degrees max pitch
  }

  // Get pixel offsets for specific layer depth
  getLayerOffset(layerType = 'architecture', maxPixelsX = 35, maxPixelsY = 20) {
    const mult = this.depths[layerType] || 0.5;
    return {
      x: this.currentX * maxPixelsX * mult,
      y: this.currentY * maxPixelsY * mult
    };
  }

  destroy() {
    window.removeEventListener('mousemove', this.onMove);
    window.removeEventListener('touchmove', this.onTouchMove);
  }
}
