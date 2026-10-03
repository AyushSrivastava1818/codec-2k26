/* ==========================================================================
   CODEC 2K26 — CHAMBER MANAGER
   Photorealistic Gothic Stone Archway Chambers:
   ABOUT, EVENTS, HACKATHON, SCHEDULE, PRIZES
   Hover Orientation, Cinematic Push-Through Zoom, In-Environment Experience,
   and Reversible "RETURN TO ROTUNDA" Dolly
   ========================================================================== */

import gsap from 'gsap';
import { audioManager } from './AudioManager.js';

export const CHAMBERS = {
  about: {
    key: 'about',
    number: 'CHAMBER 00',
    title: 'THE ARCHIVAL VAULT',
    subtitle: 'TECHKNOW COUNCIL • IIIT KOTA',
    accentColor: '#f59e0b',
    bg: '/assets/arch_about.jpg',
    doorThumb: '/assets/arch_about.jpg',
    tagline: 'Preserving the engineering heritage and technical foundations of IIIT Kota.',
    contentHtml: `
      <div class="chamber-inner-grid">
        <div class="vault-manifesto">
          <div class="vault-kicker"><i class="fa-solid fa-scroll"></i> OFFICIAL CITATION</div>
          <h3 class="vault-heading">We Are The "T" of IIIT Kota</h3>
          <p class="vault-para">TechKnow is the Apex Technical Council of the Indian Institute of Information Technology Kota. Established to forge competitive engineers, TechKnow unifies student developers, hardware architects, robotics builders, and cybersecurity researchers under one unified standard.</p>
          <div class="vault-pillars">
            <div class="pillar-item">
              <span class="pillar-num">01</span>
              <div>
                <h4>Competitive Coding</h4>
                <p>Weekly algorithmic arenas, speed DSA sprints, and ICPC prep cohorts.</p>
              </div>
            </div>
            <div class="pillar-item">
              <span class="pillar-num">02</span>
              <div>
                <h4>Combat Robotics</h4>
                <p>Reinforced titanium arenas, autonomous navigation, and bot duels.</p>
              </div>
            </div>
            <div class="pillar-item">
              <span class="pillar-num">03</span>
              <div>
                <h4>National Hackathons</h4>
                <p>High-stakes 24-hour sprints tackling deep industrial problem statements.</p>
              </div>
            </div>
          </div>
        </div>
        <div class="vault-stats-card">
          <div class="stat-row">
            <span class="stat-val">2026</span>
            <span class="stat-lbl">EDITION PINNACLE</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-row">
            <span class="stat-val">3</span>
            <span class="stat-lbl">INTENSE DAYS</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-row">
            <span class="stat-val">₹1,00,000+</span>
            <span class="stat-lbl">REWARDS & CITATIONS</span>
          </div>
        </div>
      </div>
    `
  },
  events: {
    key: 'events',
    number: 'CHAMBER I',
    title: 'THE CODING ARENA & WORKSHOPS',
    subtitle: 'DAY 01 • OCTOBER 30',
    accentColor: '#38bdf8',
    bg: '/assets/arch_events.jpg',
    doorThumb: '/assets/arch_events.jpg',
    tagline: 'Distributed backend workshops, knockout algorithmic speed trials, and campus LAN tournaments.',
    contentHtml: `
      <div class="chamber-events-grid">
        <div class="event-capsule-card">
          <div class="capsule-header">
            <span class="capsule-wing"><i class="fa-solid fa-server"></i> WEB DEV WING</span>
            <span class="capsule-badge">WORKSHOP</span>
          </div>
          <h4 class="capsule-title">Microservices Architecture Masterclass</h4>
          <p class="capsule-desc">Interactive session on high-throughput backend design, gRPC, and cloud microservices.</p>
          <button class="btn-capsule-action" onclick="openRegistrationModal('Microservices Architecture Masterclass')">
            CLAIM SEAT <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>

        <div class="event-capsule-card highlighted">
          <div class="capsule-header">
            <span class="capsule-wing"><i class="fa-solid fa-code"></i> CP WING</span>
            <span class="capsule-badge highlight">FLAGSHIP TOURNAMENT</span>
          </div>
          <h4 class="capsule-title">Speed DSA Knockout Arena</h4>
          <p class="capsule-desc">Rapid 1-on-1 knockout algorithmic programming rounds with live projected leaderboard.</p>
          <button class="btn-capsule-action highlight-btn" onclick="openRegistrationModal('Speed DSA Knockout Arena')">
            REGISTER FOR ARENA <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>

        <div class="event-capsule-card">
          <div class="capsule-header">
            <span class="capsule-wing"><i class="fa-solid fa-network-wired"></i> ESPORTS WING</span>
            <span class="capsule-badge">LAN CONTEST</span>
          </div>
          <h4 class="capsule-title">Campus LAN Esports Showdown</h4>
          <p class="capsule-desc">Zero-latency competitive LAN brackets hosted directly on campus local servers.</p>
          <button class="btn-capsule-action" onclick="openRegistrationModal('Campus LAN Esports Showdown')">
            JOIN BRACKET <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    `
  },
  hackathon: {
    key: 'hackathon',
    number: 'CHAMBER II',
    title: 'THE 12-HOUR FLAGSHIP HACKATHON',
    subtitle: 'FLAGSHIP • DAY 02 • OCTOBER 31',
    accentColor: '#ff4422',
    bg: '/assets/arch_hackathon.jpg',
    doorThumb: '/assets/arch_hackathon.jpg',
    tagline: 'Continuous engineering sprint in official league partnership with Major League Hacking (MLH).',
    contentHtml: `
      <div class="chamber-hackathon-wrap">
        <div class="hackathon-status-banner">
          <div class="status-dot-pulse"></div>
          <span>TECHKNOW X MLH FLAGSHIP HACKATHON &bull; IIIT KOTA CAMPUS</span>
        </div>

        <div class="hackathon-highlight-box">
          <div class="specs-ribbon">
            <div class="ribbon-item"><strong>12 HOURS</strong><span>NON-STOP SPRINT</span></div>
            <div class="ribbon-divider"></div>
            <div class="ribbon-item"><strong>2 - 4</strong><span>TEAM MEMBERS</span></div>
            <div class="ribbon-divider"></div>
            <div class="ribbon-item"><strong>OFFLINE</strong><span>PERMANENT CAMPUS</span></div>
            <div class="ribbon-divider"></div>
            <div class="ribbon-item"><strong>MLH</strong><span>OFFICIAL LEAGUE</span></div>
          </div>

          <div class="hackathon-body-content">
            <h3 class="hackathon-arena-heading">Hardware, Autonomous Systems & Scalable Software</h3>
            <p class="hackathon-arena-para">Problem statements across AI/ML, Systems Engineering, Web3 Infrastructure, and Open Innovation will be unlocked live during the grand opening ceremony on October 31st at 9:00 AM. Prepare your squads.</p>

            <div class="hackathon-sub-tracks">
              <div class="sub-track-pill"><i class="fa-solid fa-brain"></i> Artificial Intelligence & Systems</div>
              <div class="sub-track-pill"><i class="fa-solid fa-network-wired"></i> Web3 & Distributed Ledgers</div>
              <div class="sub-track-pill"><i class="fa-solid fa-cloud"></i> High-Throughput Cloud & DevOps</div>
              <div class="sub-track-pill"><i class="fa-solid fa-lightbulb"></i> Open Innovation & Social Impact</div>
            </div>

            <div class="hackathon-register-action">
              <button class="btn-hackathon-huge" onclick="openRegistrationModal('12-Hour Flagship Hackathon')">
                <i class="fa-solid fa-bolt"></i> REGISTER YOUR TEAM SQUAD
              </button>
            </div>
          </div>
        </div>
      </div>
    `
  },
  schedule: {
    key: 'schedule',
    number: 'CHAMBER III',
    title: 'THE CHRONO ARCHIVE',
    subtitle: 'EVENT TIMELINE • OCT 30 — NOV 01',
    accentColor: '#eab308',
    bg: '/assets/arch_schedule.jpg',
    doorThumb: '/assets/arch_schedule.jpg',
    tagline: 'The official synchronized schedule across all three summit days.',
    contentHtml: `
      <div class="chamber-chrono-stream">
        <div class="chrono-day-block">
          <div class="chrono-day-tag">DAY 01</div>
          <div class="chrono-events-list">
            <div class="chrono-item">
              <span class="chrono-time">5:30 PM – 7:30 PM</span>
              <div class="chrono-desc"><h4>Codebase Workshop</h4><p>Technical workshop by Codebase Club</p></div>
            </div>
            <div class="chrono-item">
              <span class="chrono-time">7:30 PM – 9:30 PM</span>
              <div class="chrono-desc"><h4>Arc Robotics Event</h4><p>Robotics systems and hardware showcase</p></div>
            </div>
          </div>
        </div>

        <div class="chrono-day-block active-day">
          <div class="chrono-day-tag">DAY 02 (FLAGSHIP)</div>
          <div class="chrono-events-list">
            <div class="chrono-item">
              <span class="chrono-time">9:00 AM – 9:00 PM</span>
              <div class="chrono-desc"><h4>TechKnow Hackathon</h4><p>Flagship 24-hour national hackathon sprint</p></div>
            </div>
            <div class="chrono-item">
              <span class="chrono-time">10:00 AM – 12:00 PM</span>
              <div class="chrono-desc"><h4>Codebase Event</h4><p>Competitive software engineering challenge</p></div>
            </div>
            <div class="chrono-item">
              <span class="chrono-time">1:00 PM – 5:00 PM</span>
              <div class="chrono-desc"><h4>Clutch Event</h4><p>Competitive gaming and esports contest</p></div>
            </div>
            <div class="chrono-item">
              <span class="chrono-time">2:00 PM – 5:00 PM</span>
              <div class="chrono-desc"><h4>Arc Robotics Event</h4><p>Autonomous robotics challenge and combat</p></div>
            </div>
            <div class="chrono-item">
              <span class="chrono-time">1:30 PM – 5:00 PM</span>
              <div class="chrono-desc"><h4>GFG Event</h4><p>Coding competition by GFG Student Chapter</p></div>
            </div>
            <div class="chrono-item">
              <span class="chrono-time">5:30 PM – 9:30 PM</span>
              <div class="chrono-desc"><h4>Algorithmus</h4><p>Speed algorithmic problem-solving challenge</p></div>
            </div>
            <div class="chrono-item">
              <span class="chrono-time">6:00 PM – 8:00 PM</span>
              <div class="chrono-desc"><h4>Cypher event</h4><p>Cybersecurity challenge and crypto puzzles</p></div>
            </div>
          </div>
        </div>

        <div class="chrono-day-block">
          <div class="chrono-day-tag">DAY 03</div>
          <div class="chrono-events-list">
            <div class="chrono-item">
              <span class="chrono-time">9:00 AM – 12:00 PM</span>
              <div class="chrono-desc"><h4>Hackathon Final Evaluation Round</h4><p>Project defense and prototype review</p></div>
            </div>
            <div class="chrono-item">
              <span class="chrono-time">12:00 PM – 2:00 PM</span>
              <div class="chrono-desc"><h4>Lunch</h4><p>Delegate lunch and networking break</p></div>
            </div>
            <div class="chrono-item">
              <span class="chrono-time">1:30 PM – 3:30 PM</span>
              <div class="chrono-desc"><h4>Speaker Session By KERNEL</h4><p>Distinguished tech talk and industry plenary</p></div>
            </div>
            <div class="chrono-item">
              <span class="chrono-time">3:30 PM – 5:30 PM</span>
              <div class="chrono-desc"><h4>Clutch Event</h4><p>Esports championship finals and showdown</p></div>
            </div>
            <div class="chrono-item">
              <span class="chrono-time">5:30 PM – 7:30 PM</span>
              <div class="chrono-desc"><h4>Techknow Event</h4><p>Summit awards and grand valedictory ceremony</p></div>
            </div>
          </div>
        </div>
      </div>
    `
  },
  prizes: {
    key: 'prizes',
    number: 'CHAMBER IV',
    title: 'THE CEREMONIAL HALL',
    subtitle: 'HONORS & PERPETUAL AWARDS',
    accentColor: '#facc15',
    bg: '/assets/arch_prizes.jpg',
    doorThumb: '/assets/arch_prizes.jpg',
    tagline: 'Perpetual trophies, gold medals, citations, and cash honors for summit champions.',
    contentHtml: `
      <div class="chamber-awards-triptych">
        <div class="award-pedestal runner-up-1">
          <div class="award-rank">RUNNER-UP</div>
          <div class="award-badge-icon"><i class="fa-solid fa-medal"></i></div>
          <h4 class="award-name">1st Runner-Up</h4>
          <p class="award-prize">Silver Medals, Trophy & Cash Honors</p>
          <div class="award-perk">Official TechKnow Citation</div>
        </div>

        <div class="award-pedestal grand-champion">
          <div class="award-rank gold"><i class="fa-solid fa-crown"></i> GRAND CHAMPION</div>
          <div class="award-badge-icon gold-glow"><i class="fa-solid fa-trophy"></i></div>
          <h4 class="award-name gold">Grand Champion</h4>
          <p class="award-prize">Perpetual CODEC Trophy, Gold Medals & Cash Pool</p>
          <div class="award-perk gold">Highest Institutional Honors</div>
        </div>

        <div class="award-pedestal runner-up-2">
          <div class="award-rank">2ND RUNNER-UP</div>
          <div class="award-badge-icon"><i class="fa-solid fa-award"></i></div>
          <h4 class="award-name">2nd Runner-Up</h4>
          <p class="award-prize">Bronze Medals, Trophy & Cash Honors</p>
          <div class="award-perk">Official TechKnow Citation</div>
        </div>
      </div>
    `
  }
};

export class ChamberManager {
  constructor(cameraController) {
    this.cameraController = cameraController;
    this.activeChamberKey = null;
    this.hoveredChamberKey = null;

    this.container = document.getElementById('chamber-experience-viewport');
    this.bgElement = document.getElementById('chamber-experience-bg');
    this.contentElement = document.getElementById('chamber-experience-content');
    this.returnBtn = document.getElementById('chamber-return-rotunda-btn');

    this.initListeners();
  }

  initListeners() {
    if (this.returnBtn) {
      this.returnBtn.addEventListener('click', () => {
        this.exitChamber();
      });
    }

    // Browser back button navigation (popstate)
    window.addEventListener('popstate', () => {
      if (this.activeChamberKey) {
        this.exitChamber(false);
      }
    });

    // Keyboard ESC exits chamber
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.activeChamberKey) {
        this.exitChamber();
      }
    });
  }

  // Hover effect over chamber portal
  onHover(chamberKey) {
    if (this.activeChamberKey) return;
    this.hoveredChamberKey = chamberKey;

    if (chamberKey) {
      audioManager.playChamberHover();
      this.cameraController.setHoveredChamber(chamberKey);
      this.highlightPortalElement(chamberKey, true);
    } else {
      this.cameraController.setHoveredChamber(null);
      this.highlightPortalElement(null, false);
    }
  }

  highlightPortalElement(chamberKey, isHovered) {
    document.querySelectorAll('.gothic-arch-portal-card').forEach(door => {
      const key = door.getAttribute('data-chamber');
      if (isHovered && key === chamberKey) {
        door.classList.add('arch-portal-active');
      } else {
        door.classList.remove('arch-portal-active');
      }
    });
  }

  // Cinematic Chamber Push-Through
  enterChamber(chamberKey, updateUrl = true) {
    const chamber = CHAMBERS[chamberKey];
    if (!chamber || this.activeChamberKey === chamberKey) return;

    this.activeChamberKey = chamberKey;
    audioManager.playChamberEnter();

    if (updateUrl) {
      window.history.pushState({ chamber: chamberKey }, '', `#${chamberKey}`);
    }

    // 1. Trigger 3D Camera Forward Dolly through doorway
    this.cameraController.enterChamber(chamberKey, () => {
      // 2. Reveal Chamber In-Environment Experience
      this.renderChamberView(chamber);
    });
  }

  renderChamberView(chamber) {
    if (!this.container || !this.bgElement || !this.contentElement) return;

    // Set high-res photorealistic stone archway view
    this.bgElement.style.backgroundImage = `url('${chamber.bg}')`;

    // Populate in-environment content
    this.contentElement.innerHTML = `
      <div class="chamber-cinematic-header">
        <div class="chamber-meta-row">
          <span class="chamber-num-badge" style="color: ${chamber.accentColor};"><i class="fa-solid fa-archway"></i> ${chamber.number}</span>
          <span class="chamber-sub-badge">${chamber.subtitle}</span>
        </div>
        <h2 class="chamber-main-title">${chamber.title}</h2>
        <p class="chamber-tagline-text">${chamber.tagline}</p>
      </div>

      <div class="chamber-dynamic-body">
        ${chamber.contentHtml}
      </div>
    `;

    // Animate container into full view instantly
    this.container.classList.remove('hidden');
    gsap.fromTo(this.container, 
      { opacity: 0, scale: 1.03 },
      { opacity: 1, scale: 1.0, duration: 0.28, ease: 'power2.out' }
    );

    gsap.fromTo(this.contentElement.children,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.25, stagger: 0.06, ease: 'power2.out', delay: 0.05 }
    );
  }

  // Return to rotunda center
  exitChamber(updateUrl = true) {
    if (!this.activeChamberKey) return;
    audioManager.playChamberExit();

    if (updateUrl && window.location.hash) {
      window.history.pushState({}, '', window.location.pathname);
    }

    // 1. Fade out chamber content immediately
    if (this.container) {
      gsap.to(this.container, {
        opacity: 0,
        scale: 0.98,
        duration: 0.22,
        ease: 'power2.in',
        onComplete: () => {
          this.container.classList.add('hidden');
          this.contentElement.innerHTML = '';
        }
      });
    }

    // 2. Reverse 3D camera back into Rotunda Center
    this.cameraController.exitChamber(() => {
      this.activeChamberKey = null;
      this.hoveredChamberKey = null;
    });
  }
}
