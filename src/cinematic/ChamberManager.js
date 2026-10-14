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
                <h4>Flagship Hackathons</h4>
                <p>High-stakes engineering sprints tackling deep industrial problem statements.</p>
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
            <span class="stat-val">HONORS</span>
            <span class="stat-lbl">TROPHIES & CITATIONS</span>
          </div>
        </div>
      </div>
    `
  },
  events: {
    key: 'events',
    number: 'CHAMBER II',
    title: 'THE SUMMIT EVENTS & ARENAS',
    subtitle: 'OCTOBER 16 — OCTOBER 18',
    accentColor: '#ff6a00',
    bg: '/assets/arch_events.jpg',
    doorThumb: '/assets/arch_events.jpg',
    tagline: 'WTF ALGO 2.0, HACK-VERSE, BUG 2 BUILD, DUNGEON OF LIES, DIGIVERSE, ROBO RUSH, TECH ARENA & ALUMNI SESSIONS.',
    contentHtml: `
      <div class="chamber-events-grid">
        <!-- 1. ALGORITHMUS: WTF ALGO 2.0 -->
        <div class="event-capsule-card">
          <div class="capsule-header">
            <span class="capsule-wing"><i class="fa-solid fa-bolt"></i> ALGORITHMUS</span>
            <span class="capsule-badge">OCT 17 &bull; 6:00 PM - 8:00 PM</span>
          </div>
          <h4 class="capsule-title">WTF ALGO 2.0</h4>
          <p class="capsule-desc">3-round speed competitive programming challenge.</p>
          <div class="capsule-rules-summary">
            <span class="rule-chip"><i class="fa-solid fa-users"></i> 3 Members / Team</span>
            <span class="rule-chip"><i class="fa-solid fa-circle-dot"></i> R1: Balloon Pop</span>
            <span class="rule-chip"><i class="fa-solid fa-gem"></i> R2: Stone Elimination</span>
            <span class="rule-chip"><i class="fa-solid fa-skull"></i> R3: Survival & Dares</span>
          </div>
          <button class="btn-capsule-action" onclick="openRegistrationModal('WTF ALGO 2.0 (Algorithmus)')">
            REGISTER <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>

        <!-- 2. CYPHER: HACK-VERSE -->
        <div class="event-capsule-card">
          <div class="capsule-header">
            <span class="capsule-wing"><i class="fa-solid fa-shield-virus"></i> CYPHER</span>
            <span class="capsule-badge">OCT 15 & 17 &bull; 6:00 PM - 8:00 PM</span>
          </div>
          <h4 class="capsule-title">HACK-VERSE</h4>
          <p class="capsule-desc">5-round capture the flag (CTF) tournament with cryptography and security exploits.</p>
          <div class="capsule-rules-summary">
            <span class="rule-chip"><i class="fa-solid fa-users"></i> 3 Members / Team</span>
            <span class="rule-chip"><i class="fa-solid fa-globe"></i> R1-3: Online (15 Oct)</span>
            <span class="rule-chip"><i class="fa-solid fa-building"></i> R4-5: Offline (17 Oct)</span>
            <span class="rule-chip"><i class="fa-solid fa-ban"></i> No AI Allowed</span>
          </div>
          <button class="btn-capsule-action" onclick="openRegistrationModal('HACK-VERSE (Cypher)')">
            REGISTER <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>

        <!-- 3. CODEBASE: BUG 2 BUILD -->
        <div class="event-capsule-card">
          <div class="capsule-header">
            <span class="capsule-wing"><i class="fa-solid fa-code"></i> CODEBASE</span>
            <span class="capsule-badge">OCT 17 &bull; 10:00 AM - 12:00 PM</span>
          </div>
          <h4 class="capsule-title">BUG 2 BUILD</h4>
          <p class="capsule-desc">Code debugging sprint followed by a UI/UX prompting showdown.</p>
          <div class="capsule-rules-summary">
            <span class="rule-chip"><i class="fa-solid fa-bug"></i> R1: 7 Codes Debugging</span>
            <span class="rule-chip"><i class="fa-solid fa-ranking-star"></i> Top 10 Qualify</span>
            <span class="rule-chip"><i class="fa-solid fa-wand-magic-sparkles"></i> R2: UI/UX Prompting</span>
          </div>
          <button class="btn-capsule-action" onclick="openRegistrationModal('BUG 2 BUILD (Codebase)')">
            REGISTER <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>

        <!-- 4. GEEKSFORGEEKS: DUNGEON OF LIES -->
        <div class="event-capsule-card">
          <div class="capsule-header">
            <span class="capsule-wing"><i class="fa-solid fa-mask"></i> GEEKSFORGEEKS</span>
            <span class="capsule-badge">OCT 17 &bull; 1:30 PM - 5:00 PM &bull; LT 1-2-3</span>
          </div>
          <h4 class="capsule-title">DUNGEON OF LIES</h4>
          <p class="capsule-desc">Coding mystery and imposter detection challenge across LT 1-2-3.</p>
          <div class="capsule-rules-summary">
            <span class="rule-chip"><i class="fa-solid fa-user-secret"></i> 1 Imposter Per Group</span>
            <span class="rule-chip"><i class="fa-solid fa-code-compare"></i> LT 1: Imposter Games</span>
            <span class="rule-chip"><i class="fa-solid fa-brain"></i> LT 2: Misdirection</span>
            <span class="rule-chip"><i class="fa-solid fa-check-double"></i> LT 3: Final Voting</span>
          </div>
          <button class="btn-capsule-action" onclick="openRegistrationModal('DUNGEON OF LIES (GFG)')">
            REGISTER <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>

        <!-- 5. GDG: DIGIVERSE -->
        <div class="event-capsule-card">
          <div class="capsule-header">
            <span class="capsule-wing"><i class="fa-solid fa-cube"></i> GDG ON CAMPUS</span>
            <span class="capsule-badge">OCT 17 &bull; DEVELOPER SUMMIT</span>
          </div>
          <h4 class="capsule-title">DIGIVERSE</h4>
          <p class="capsule-desc">Developer summit covering Cloud, Web, and Android engineering.</p>
          <div class="capsule-rules-summary">
            <span class="rule-chip"><i class="fa-solid fa-cloud"></i> Cloud Architecture</span>
            <span class="rule-chip"><i class="fa-solid fa-robot"></i> AI Workflows</span>
            <span class="rule-chip"><i class="fa-solid fa-network-wired"></i> Fullstack Apps</span>
          </div>
          <button class="btn-capsule-action" onclick="openRegistrationModal('DIGIVERSE (GDG)')">
            REGISTER <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>

        <!-- 6. ARC ROBOTICS EVENT 1: ROBO RUSH -->
        <div class="event-capsule-card">
          <div class="capsule-header">
            <span class="capsule-wing"><i class="fa-solid fa-car-side"></i> ARC ROBOTICS</span>
            <span class="capsule-badge">OCT 16 &bull; 7:30 PM - 9:00 PM &bull; MINI OAT</span>
          </div>
          <h4 class="capsule-title">ROBO RUSH</h4>
          <p class="capsule-desc">1v1 Bluetooth RC robot battle and package collection race.</p>
          <div class="capsule-rules-summary">
            <span class="rule-chip"><i class="fa-solid fa-gamepad"></i> 1v1 Remote Duel</span>
            <span class="rule-chip"><i class="fa-solid fa-stopwatch"></i> 120s Match Clock</span>
            <span class="rule-chip"><i class="fa-solid fa-box-open"></i> Package Collection</span>
            <span class="rule-chip"><i class="fa-solid fa-trophy"></i> Highest Score Wins</span>
          </div>
          <button class="btn-capsule-action" onclick="openRegistrationModal('ROBO RUSH (ARC Robotics - 16th Oct)')">
            REGISTER <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>

        <!-- 7. ARC ROBOTICS EVENT 2: TECH ARENA -->
        <div class="event-capsule-card">
          <div class="capsule-header">
            <span class="capsule-wing"><i class="fa-solid fa-robot"></i> ARC ROBOTICS</span>
            <span class="capsule-badge">OCT 17 &bull; 2:00 PM - 5:00 PM &bull; MINI OAT</span>
          </div>
          <h4 class="capsule-title">TECH ARENA</h4>
          <p class="capsule-desc">Blindfolded obstacle navigation guided by ultrasonic sensors.</p>
          <div class="capsule-rules-summary">
            <span class="rule-chip"><i class="fa-solid fa-users"></i> Team of 2 Players</span>
            <span class="rule-chip"><i class="fa-solid fa-eye-slash"></i> Both Blindfolded</span>
            <span class="rule-chip"><i class="fa-solid fa-radar"></i> Sensor Guidance</span>
            <span class="rule-chip"><i class="fa-solid fa-clock"></i> Fastest Time Wins</span>
          </div>
          <button class="btn-capsule-action" onclick="openRegistrationModal('TECH ARENA (ARC Robotics - 17th Oct)')">
            REGISTER <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>

        <!-- 8. IIIT KERNEL: ALUMNI SPEAKER SESSION -->
        <div class="event-capsule-card">
          <div class="capsule-header">
            <span class="capsule-wing"><i class="fa-solid fa-graduation-cap"></i> IIIT KERNEL</span>
            <span class="capsule-badge">OCT 18 &bull; 1:30 PM - 3:30 PM &bull; AUDITORIUM</span>
          </div>
          <h4 class="capsule-title">ALUMNI SPEAKER SESSION</h4>
          <p class="capsule-desc">Interactive career keynote and live AMA with distinguished alumni.</p>
          <div class="capsule-rules-summary">
            <span class="rule-chip" style="color: #ffbd77; font-weight: 700;"><i class="fa-brands fa-amazon"></i> YASH GOEL (Amazon SDE 1)</span>
            <span class="rule-chip" style="color: #ffbd77; font-weight: 700;"><i class="fa-brands fa-amazon"></i> ABHISHEK PANT (Amazon SDE 1)</span>
            <span class="rule-chip"><i class="fa-solid fa-microchip"></i> System Design</span>
            <span class="rule-chip"><i class="fa-solid fa-comments"></i> Live Student AMA</span>
          </div>
          <button class="btn-capsule-action" onclick="openRegistrationModal('Alumni Speaker Session (Kernel)')">
            REGISTER <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>

        <!-- 9. CLUTCH: ESPORTS TOURNAMENT -->
        <div class="event-capsule-card">
          <div class="capsule-header">
            <span class="capsule-wing"><i class="fa-solid fa-gamepad"></i> CLUTCH ESPORTS</span>
            <span class="capsule-badge">OCT 17 & 18 &bull; GAMING ARENA</span>
          </div>
          <h4 class="capsule-title">CLUTCH ESPORTS</h4>
          <p class="capsule-desc">Campus LAN gaming championship tournament.</p>
          <div class="capsule-rules-summary">
            <span class="rule-chip"><i class="fa-solid fa-trophy"></i> Tournament Brackets</span>
            <span class="rule-chip"><i class="fa-solid fa-network-wired"></i> Low-Latency Local LAN</span>
            <span class="rule-chip"><i class="fa-solid fa-crown"></i> Championship Trophies</span>
          </div>
          <button class="btn-capsule-action" onclick="openRegistrationModal('Clutch Esports')">
            REGISTER <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    `
  },
  hackathon: {
    key: 'hackathon',
    number: 'CHAMBER III',
    title: 'TECHKNOW PRESENTS HACKODEC: 12-HOUR FLAGSHIP HACKATHON',
    subtitle: 'FLAGSHIP • DAY 02 • OCTOBER 17',
    accentColor: '#ff4422',
    bg: '/assets/arch_hackathon.jpg',
    doorThumb: '/assets/arch_hackathon.jpg',
    tagline: 'The premier 12-hour engineering sprint presented by TechKnow Council, IIIT Kota.',
    contentHtml: `
      <div class="chamber-hackathon-wrap">
        <div class="hackathon-status-banner">
          <div class="status-dot-pulse"></div>
          <span>TECHKNOW COUNCIL PRESENTS HACKODEC &bull; IIIT KOTA CAMPUS</span>
        </div>

        <div class="hackathon-highlight-box">
          <div class="specs-ribbon">
            <div class="ribbon-item"><strong>12 HOURS</strong><span>NON-STOP SPRINT</span></div>
            <div class="ribbon-divider"></div>
            <div class="ribbon-item"><strong>4 MEMBERS</strong><span>SQUAD ROSTER</span></div>
            <div class="ribbon-divider"></div>
            <div class="ribbon-item"><strong>OFFLINE</strong><span>PERMANENT CAMPUS</span></div>
            <div class="ribbon-divider"></div>
            <div class="ribbon-item"><strong>TECHKNOW</strong><span>COUNCIL HOST</span></div>
          </div>

          <div class="hackathon-body-content">
            <h3 class="hackathon-arena-heading">Hardware, Autonomous Systems & Scalable Software</h3>
            <p class="hackathon-arena-para">Problem statements across AI/ML, Systems Engineering, Web3 Infrastructure, and Open Innovation will be unlocked live during the grand opening ceremony on October 17th at 9:00 AM. Prepare your squads for HACKODEC.</p>

            <div class="hackathon-sub-tracks">
              <div class="sub-track-pill"><i class="fa-solid fa-brain"></i> Artificial Intelligence & Systems</div>
              <div class="sub-track-pill"><i class="fa-solid fa-network-wired"></i> Web3 & Distributed Ledgers</div>
              <div class="sub-track-pill"><i class="fa-solid fa-cloud"></i> High-Throughput Cloud & DevOps</div>
              <div class="sub-track-pill"><i class="fa-solid fa-lightbulb"></i> Open Innovation & Social Impact</div>
            </div>

            <div class="hackathon-register-action">
              <button class="btn-hackathon-huge" onclick="window.scrollToHackathonSquad ? window.scrollToHackathonSquad() : openRegistrationModal('HACKODEC')">
                <i class="fa-solid fa-users"></i> REGISTER 4-MEMBER SQUAD FOR HACKODEC
              </button>
            </div>
          </div>
        </div>
      </div>
    `
  },
  schedule: {
    key: 'schedule',
    number: 'CHAMBER IV',
    title: 'THE CHRONO ARCHIVE',
    subtitle: 'EVENT TIMELINE • OCT 16 — OCT 18',
    accentColor: '#eab308',
    bg: '/assets/arch_schedule.jpg',
    doorThumb: '/assets/arch_schedule.jpg',
    tagline: 'The official synchronized schedule across all three summit days.',
    contentHtml: `
      <div class="chamber-chrono-stream">
        <div class="chrono-day-block">
          <div class="chrono-day-tag">DAY 01 &bull; OCT 16</div>
          <div class="chrono-events-list">
            <div class="chrono-item">
              <span class="chrono-time">5:30 PM – 7:30 PM</span>
              <div class="chrono-desc"><h4>Codebase Technical Session</h4><p>Technical engineering workshop and tools briefing by Codebase Club</p></div>
            </div>
            <div class="chrono-item">
              <span class="chrono-time">7:30 PM – 9:00 PM</span>
              <div class="chrono-desc"><h4>ARC Robotics: ROBO RUSH</h4><p>1v1 Bluetooth RC combat duel at Mini OAT arena (Oct 16)</p></div>
            </div>
          </div>
        </div>

        <div class="chrono-day-block active-day">
          <div class="chrono-day-tag">DAY 02 (FLAGSHIP) &bull; OCT 17</div>
          <div class="chrono-events-list">
            <div class="chrono-item">
              <span class="chrono-time">9:00 AM – 9:00 PM</span>
              <div class="chrono-desc"><h4>HACKODEC Flagship Hackathon</h4><p>12-hour continuous sprint presented by TechKnow Council</p></div>
            </div>
            <div class="chrono-item">
              <span class="chrono-time">10:00 AM – 12:00 PM</span>
              <div class="chrono-desc"><h4>Codebase: BUG 2 BUILD</h4><p>Round 1 Debugging & Round 2 UI/UX AI Prompting War</p></div>
            </div>
            <div class="chrono-item">
              <span class="chrono-time">1:00 PM – 5:00 PM</span>
              <div class="chrono-desc"><h4>Clutch Esports Tournament</h4><p>Campus LAN gaming brackets and tournament heats</p></div>
            </div>
            <div class="chrono-item">
              <span class="chrono-time">1:30 PM – 5:00 PM</span>
              <div class="chrono-desc"><h4>GeeksforGeeks: DUNGEON OF LIES</h4><p>Multi-room imposter deduction and code challenge across LT-1, LT-2, LT-3</p></div>
            </div>
            <div class="chrono-item">
              <span class="chrono-time">2:00 PM – 5:00 PM</span>
              <div class="chrono-desc"><h4>ARC Robotics: TECH ARENA</h4><p>Blindfolded ultrasonic obstacle navigation challenge at Mini OAT (Oct 17)</p></div>
            </div>
            <div class="chrono-item">
              <span class="chrono-time">6:00 PM – 8:00 PM</span>
              <div class="chrono-desc"><h4>Algorithmus: WTF ALGO 2.0</h4><p>Balloon Pop, Stone Elimination & Survival Dares speed CP contest</p></div>
            </div>
            <div class="chrono-item">
              <span class="chrono-time">6:00 PM – 8:00 PM</span>
              <div class="chrono-desc"><h4>Cypher: HACK-VERSE</h4><p>Offline final rounds of 5-Round CTF challenge</p></div>
            </div>
          </div>
        </div>

        <div class="chrono-day-block">
          <div class="chrono-day-tag">DAY 03 &bull; OCT 18</div>
          <div class="chrono-events-list">
            <div class="chrono-item">
              <span class="chrono-time">9:00 AM – 12:00 PM</span>
              <div class="chrono-desc"><h4>HACKODEC Final Evaluation Round</h4><p>Live jury evaluation and technical prototype defense</p></div>
            </div>
            <div class="chrono-item">
              <span class="chrono-time">12:00 PM – 1:30 PM</span>
              <div class="chrono-desc"><h4>Lunch & Networking</h4><p>Delegate buffet and peer networking break</p></div>
            </div>
            <div class="chrono-item">
              <span class="chrono-time">1:30 PM – 3:30 PM</span>
              <div class="chrono-desc"><h4>Alumni Speaker Session (IIIT Kernel)</h4><p>YASH GOEL & ABHISHEK PANT (Amazon SDE 1) &bull; Auditorium</p></div>
            </div>
            <div class="chrono-item">
              <span class="chrono-time">3:30 PM – 5:30 PM</span>
              <div class="chrono-desc"><h4>Clutch Esports Grand Finals</h4><p>Campus LAN championship title match and showdown</p></div>
            </div>
            <div class="chrono-item">
              <span class="chrono-time">5:30 PM – 7:30 PM</span>
              <div class="chrono-desc"><h4>TechKnow Grand Valedictory & Awards</h4><p>Closing ceremony, trophies, medals, and summit honors</p></div>
            </div>
          </div>
        </div>
      </div>
    `
  },
  prizes: {
    key: 'prizes',
    number: 'CHAMBER V',
    title: 'THE CEREMONIAL HALL',
    subtitle: 'HONORS & PERPETUAL AWARDS',
    accentColor: '#facc15',
    bg: '/assets/arch_prizes.jpg',
    doorThumb: '/assets/arch_prizes.jpg',
    tagline: 'Perpetual trophies, gold medals, citations, and exclusive honors for summit champions.',
    contentHtml: `
      <div class="chamber-awards-triptych">
        <div class="award-pedestal runner-up-1">
          <div class="award-rank">RUNNER-UP</div>
          <div class="award-badge-icon"><i class="fa-solid fa-medal"></i></div>
          <h4 class="award-name">1st Runner-Up</h4>
          <p class="award-prize">Silver Medals, Trophy &amp; Official Citations</p>
          <div class="award-perk">Official TechKnow Citation</div>
        </div>

        <div class="award-pedestal grand-champion">
          <div class="award-rank gold"><i class="fa-solid fa-crown"></i> GRAND CHAMPION</div>
          <div class="award-badge-icon gold-glow"><i class="fa-solid fa-trophy"></i></div>
          <h4 class="award-name gold">Grand Champion</h4>
          <p class="award-prize">Perpetual CODEC Trophy, Gold Medals &amp; Championship Honors</p>
          <div class="award-perk gold">Highest Institutional Honors</div>
        </div>

        <div class="award-pedestal runner-up-2">
          <div class="award-rank">2ND RUNNER-UP</div>
          <div class="award-badge-icon"><i class="fa-solid fa-award"></i></div>
          <h4 class="award-name">2nd Runner-Up</h4>
          <p class="award-prize">Bronze Medals, Trophy &amp; Official Citations</p>
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

    document.querySelectorAll('.rotunda-door-hotspot').forEach(spot => {
      const key = spot.getAttribute('data-chamber');
      if (isHovered && key === chamberKey) {
        spot.classList.add('active-hover');
      } else {
        spot.classList.remove('active-hover');
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
