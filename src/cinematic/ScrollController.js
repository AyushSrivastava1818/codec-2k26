/* ==========================================================================
   CODEC 2K26 — MASTER CINEMATIC SCROLL CONTROLLER
   Normalized Continuous Timeline (0.00 to 1.00)
   60-120 FPS Damped Interpolation with Stage Threshold Callbacks
   ========================================================================== */

export class ScrollController {
  constructor(stageElement, options = {}) {
    this.stage = stageElement;
    this.targetProgress = 0;
    this.currentProgress = 0;
    this.lastAppliedProgress = -1;

    // Smooth damping factor
    this.damping = options.damping || 0.12;

    // Timeline stage definitions
    this.STAGES = {
      EXTERIOR_FAR: 0.00,
      APPROACH_GATE: 0.18,
      GATE_OPENING: 0.30,
      GATE_OPEN: 0.45,
      ENTER_GATE: 0.46,
      MAIN_HALL: 0.54,
      ROTUNDA_REVEAL: 0.74,
      ROTUNDA_CHAMBERS: 0.88,
      COMPLETE: 1.00
    };

    this.currentStageName = 'EXTERIOR_FAR';
    this.gateTriggerFired = false;

    this.onProgressUpdate = options.onProgressUpdate || null;
    this.onStageChange = options.onStageChange || null;
    this.onGateOpenTrigger = options.onGateOpenTrigger || null;

    this.onScroll = this.onScroll.bind(this);
    this.init();
  }

  init() {
    window.addEventListener('scroll', this.onScroll, { passive: true });
    window.addEventListener('resize', this.onScroll, { passive: true });
    this.calculateTarget();
  }

  onScroll() {
    this.calculateTarget();
  }

  calculateTarget() {
    if (!this.stage) return;
    const rect = this.stage.getBoundingClientRect();
    const stageHeight = this.stage.offsetHeight;
    const viewportHeight = window.innerHeight;
    const totalScrollable = stageHeight - viewportHeight;

    if (totalScrollable <= 0) {
      this.targetProgress = 0;
      return;
    }

    const scrolled = -rect.top;
    this.targetProgress = Math.max(0, Math.min(1, scrolled / totalScrollable));
  }

  update(delta = 0.016) {
    const diff = this.targetProgress - this.currentProgress;

    // Frame-rate independent exponential decay smoothing (silky smooth at 60-144Hz)
    if (Math.abs(diff) > 0.0001) {
      const clampedDelta = Math.min(delta, 0.05);
      const factor = 1 - Math.exp(-9.5 * clampedDelta);
      this.currentProgress += diff * factor;
    } else {
      this.currentProgress = this.targetProgress;
    }

    const p = this.currentProgress;

    // Stage detection
    let stageName = 'EXTERIOR_FAR';
    if (p >= this.STAGES.ROTUNDA_CHAMBERS) stageName = 'ROTUNDA_CHAMBERS';
    else if (p >= this.STAGES.ROTUNDA_REVEAL) stageName = 'ROTUNDA_REVEAL';
    else if (p >= this.STAGES.MAIN_HALL) stageName = 'MAIN_HALL';
    else if (p >= this.STAGES.ENTER_GATE) stageName = 'ENTER_GATE';
    else if (p >= this.STAGES.GATE_OPENING) stageName = 'GATE_OPENING';
    else if (p >= this.STAGES.APPROACH_GATE) stageName = 'APPROACH_GATE';

    if (stageName !== this.currentStageName) {
      this.currentStageName = stageName;
      if (this.onStageChange) this.onStageChange(stageName, p);
    }

    // Gate opening audio & shake trigger at threshold
    if (p >= this.STAGES.GATE_OPENING && !this.gateTriggerFired) {
      this.gateTriggerFired = true;
      if (this.onGateOpenTrigger) this.onGateOpenTrigger();
    } else if (p < this.STAGES.GATE_OPENING - 0.04) {
      this.gateTriggerFired = false;
    }

    if (Math.abs(p - this.lastAppliedProgress) > 0.0001) {
      this.lastAppliedProgress = p;
      if (this.onProgressUpdate) {
        this.onProgressUpdate(p);
      }
    }

    return p;
  }

  scrollToProgress(targetP) {
    if (!this.stage) return;
    const stageHeight = this.stage.offsetHeight;
    const viewportHeight = window.innerHeight;
    const totalScrollable = stageHeight - viewportHeight;
    const targetY = this.stage.offsetTop + (totalScrollable * targetP);

    window.scrollTo({
      top: Math.max(0, targetY),
      behavior: 'smooth'
    });
  }

  scrollToStage(stageKey) {
    const p = this.STAGES[stageKey] !== undefined ? this.STAGES[stageKey] : 0;
    this.scrollToProgress(p);
  }

  destroy() {
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.onScroll);
  }
}
