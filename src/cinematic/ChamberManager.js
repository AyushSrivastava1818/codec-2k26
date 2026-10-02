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
    subtitle: 'TECHKNOW SOCIETY • IIIT KOTA',
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
    title: 'THE 24-HOUR HACKATHON & ROBOWARS',
    subtitle: 'FLAGSHIP • DAY 02 • OCTOBER 31',
    accentColor: '#ff4422',
    bg: '/assets/arch_hackathon.jpg',
    doorThumb: '/assets/arch_hackathon.jpg',
    tagline: 'Continuous nocturnal engineering, titanium combat robotics, and midnight cybersecurity CTF.',
    contentHtml: `
      <div class="chamber-hackathon-wrap">
        <div class="hackathon-status-banner">
          <div class="status-dot-pulse"></div>
          <span>NATIONAL HACKATHON ARENA &bull; OPEN TO ALL INSTITUTES &bull; IIIT KOTA CAMPUS</span>
        </div>

        <div class="hackathon-highlight-box">
          <div class="specs-ribbon">
            <div class="ribbon-item"><strong>24 HOURS</strong><span>NON-STOP SPRINT</span></div>
            <div class="ribbon-divider"></div>
            <div class="ribbon-item"><strong>2 - 4</strong><span>TEAM MEMBERS</span></div>
            <div class="ribbon-divider"></div>
            <div class="ribbon-item"><strong>₹1,00,000+</strong><span>CASH & BOUNTIES</span></div>
            <div class="ribbon-divider"></div>
            <div class="ribbon-item"><strong>OFFLINE</strong><span>PERMANENT CAMPUS</span></div>
          </div>

          <div class="hackathon-body-content">
            <h3 class="hackathon-arena-heading">Hardware, Autonomous Systems & Scalable Software</h3>
            <p class="hackathon-arena-para">Problem statements across AI/ML, Systems Engineering, Web3 Infrastructure, and Autonomous Robotics will be unlocked live during the grand opening ceremony on October 31st. Prepare your squads.</p>

            <div class="hackathon-sub-tracks">
              <div class="sub-track-pill"><i class="fa-solid fa-microchip"></i> Autonomous Robotics & Hardware</div>
              <div class="sub-track-pill"><i class="fa-solid fa-brain"></i> Artificial Intelligence & Systems</div>
              <div class="sub-track-pill"><i class="fa-solid fa-shield-halved"></i> Midnight Cybersecurity CTF</div>
              <div class="sub-track-pill"><i class="fa-solid fa-robot"></i> RoboWars Combat Arena</div>
            </div>

            <div class="hackathon-register-action">
              <button class="btn-hackathon-huge" onclick="openRegistrationModal('24-Hour National Hackathon')">
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
    tagline: 'The complete synchronized timeline for all three days of the summit.',
    contentHtml: `
      <div class="chamber-chrono-stream">
        <div class="chrono-day-block">
          <div class="chrono-day-tag">DAY 01 • OCTOBER 30</div>
          <div class="chrono-events-list">
            <div class="chrono-item">
              <span class="chrono-time">10:00 AM</span>
              <div class="chrono-desc"><h4>Systems Workshop</h4><p>Microservices & distributed architecture session</p></div>
            </div>
            <div class="chrono-item">
              <span class="chrono-time">02:00 PM</span>
              <div class="chrono-desc"><h4>Speed DSA Arena</h4><p>Knockout competitive coding rounds</p></div>
            </div>
            <div class="chrono-item">
              <span class="chrono-time">05:30 PM</span>
              <div class="chrono-desc"><h4>Opening Ceremony</h4><p>Inaugural keynote & summit kickoff</p></div>
            </div>
          </div>
        </div>

        <div class="chrono-day-block active-day">
          <div class="chrono-day-tag">DAY 02 • OCTOBER 31 (FLAGSHIP)</div>
          <div class="chrono-events-list">
            <div class="chrono-item">
              <span class="chrono-time">08:00 AM</span>
              <div class="chrono-desc"><h4>Hackathon Kickoff</h4><p>Problem statements released; building starts</p></div>
            </div>
            <div class="chrono-item">
              <span class="chrono-time">02:00 PM</span>
              <div class="chrono-desc"><h4>RoboWars Tournament</h4><p>Titanium arena gladiator combat rounds</p></div>
            </div>
            <div class="chrono-item">
              <span class="chrono-time">11:00 PM</span>
              <div class="chrono-desc"><h4>Midnight CTF</h4><p>Nocturnal cybersecurity capture-the-flag</p></div>
            </div>
          </div>
        </div>

        <div class="chrono-day-block">
          <div class="chrono-day-tag">DAY 03 • NOVEMBER 01</div>
          <div class="chrono-events-list">
            <div class="chrono-item">
              <span class="chrono-time">08:00 AM</span>
              <div class="chrono-desc"><h4>Jury Defense</h4><p>Shortlisted prototype presentations</p></div>
            </div>
            <div class="chrono-item">
              <span class="chrono-time">02:30 PM</span>
              <div class="chrono-desc"><h4>Distinguished Keynote</h4><p>Tech industry leader plenary</p></div>
            </div>
            <div class="chrono-item">
              <span class="chrono-time">05:00 PM</span>
              <div class="chrono-desc"><h4>Grand Awards Gala</h4><p>Felicitation & trophy presentations</p></div>
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

    // Animate container into full view
    this.container.classList.remove('hidden');
    gsap.fromTo(this.container, 
      { opacity: 0, scale: 1.06 },
      { opacity: 1, scale: 1.0, duration: 0.6, ease: 'power2.out' }
    );

    gsap.fromTo(this.contentElement.children,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.45, stagger: 0.1, ease: 'power2.out', delay: 0.15 }
    );
  }

  // Return to rotunda center
  exitChamber(updateUrl = true) {
    if (!this.activeChamberKey) return;
    audioManager.playChamberExit();

    if (updateUrl && window.location.hash) {
      window.history.pushState({}, '', window.location.pathname);
    }

    // 1. Fade out chamber content
    if (this.container) {
      gsap.to(this.container, {
        opacity: 0,
        scale: 0.95,
        duration: 0.4,
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
