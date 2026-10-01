/* ==========================================================================
   CODEC 2K26 FLAGSHIP JAVASCRIPT ENGINE
   TechKnow Society • IIIT Kota
   Ultra-Smooth 120 FPS Lerp Loop • Pinned Mansion-to-Rotunda Scroll Engine
   Fullscreen Chamber View with Return Button
   ========================================================================== */

// --- 1. CHAMBERS DATA ---
const CHAMBER_DATA = {
  1: {
    tag: 'CHAMBER I • DAY 01 • OCTOBER 30',
    title: 'THE CODING ARENA',
    desc: 'The technical ground trials: distributed backend workshops, speed competitive coding knockouts, and local LAN tournaments.',
    bg: '/assets/room_hacking.jpg',
    events: [
      {
        host: 'TechKnow Web Dev Wing',
        title: 'Microservices Architecture Workshop',
        desc: 'Interactive workshop on distributed backend engineering, cloud microservices, and gRPC communication.'
      },
      {
        host: 'Competitive Programming Wing',
        title: 'Speed DSA Coding Arena',
        desc: 'Rapid knockout algorithmic programming rounds with live leaderboard projections.'
      },
      {
        host: 'Esports Wing',
        title: 'LAN Esports Tournament',
        desc: 'Competitive LAN brackets on custom local servers.'
      }
    ]
  },
  2: {
    tag: 'FLAGSHIP • CHAMBER II • DAY 02 • OCTOBER 31',
    title: 'THE 24-HOUR HACKATHON & ROBOWARS',
    desc: 'The heart of CODEC 2K26: continuous nocturnal hardware hacking, titanium cage combat robotics, and midnight cybersecurity CTF.',
    bg: '/assets/room_robotics.jpg',
    events: [
      {
        host: 'TechKnow Society Core',
        title: 'TechKnow 24hr Flagship Hackathon',
        desc: 'Build scalable software and autonomous hardware solutions solving real-world challenges.'
      },
      {
        host: 'Robotics Wing',
        title: 'RoboWars Combat Arena',
        desc: 'Gladiator matches in the reinforced titanium steel combat arena.'
      },
      {
        host: 'Cybersecurity Wing',
        title: 'Midnight Security CTF Challenge',
        desc: 'Capture The Flag cybersecurity trials spanning binary exploitation, web vulnerabilities, and crypto.'
      }
    ]
  },
  3: {
    tag: 'CHAMBER III • DAY 03 • NOVEMBER 01',
    title: 'THE GRAND FINALE & PLENARY',
    desc: 'The final proving ground: jury defenses for shortlisted prototypes, distinguished guest keynotes, and grand awards gala.',
    bg: '/assets/room_algo.jpg',
    events: [
      {
        host: 'TechKnow Jury Panel',
        title: 'Hackathon Project Pitch & Jury Defense',
        desc: 'Shortlisted teams pitch their working prototypes and technical architecture before industry engineers.'
      },
      {
        host: 'Kernel Society',
        title: 'Guest Keynote Plenary Session',
        desc: 'Distinguished address by tech industry leaders on emerging architectures and engineering careers.'
      },
      {
        host: 'TechKnow Society',
        title: 'Valedictory Ceremony & Grand Awards',
        desc: 'Announcement of the CODEC 2K26 Champions, presentation of perpetual trophies and citations.'
      }
    ]
  }
};

// --- 2. TIMETABLE DATA ---
const SCHEDULE_DATA = {
  day1: [
    { time: '10:00 AM', cat: 'Workshop', title: 'Technical Workshop', desc: 'Hands-on session on modern system design and frameworks.' },
    { time: '02:00 PM', cat: 'Competitive', title: 'Speed DSA Contest', desc: 'Knockout competitive coding round.' },
    { time: '05:30 PM', cat: 'Inaugural', title: 'Opening Ceremony', desc: 'Summit kickoff and guest addresses.' }
  ],
  day2: [
    { time: '08:00 AM', cat: 'Hackathon', title: '24-Hour Hackathon Kickoff', desc: 'Problem statements unlocked and building begins.' },
    { time: '02:00 PM', cat: 'Robotics', title: 'RoboWars Combat Round 1', desc: 'Bot combat tournament in the outdoor arena.' },
    { time: '11:00 PM', cat: 'Security', title: 'Midnight Security CTF', desc: 'Competitive jeopardy-style capture the flag.' }
  ],
  day3: [
    { time: '08:00 AM', cat: 'Defense', title: 'Hackathon Project Presentations', desc: 'Final prototype demonstration before the jury.' },
    { time: '02:30 PM', cat: 'Keynote', title: 'Guest Keynote Session', desc: 'Distinguished talk from industry leaders.' },
    { time: '05:00 PM', cat: 'Awards', title: 'Grand Awards Ceremony', desc: 'Felicitation and winner announcements.' }
  ]
};

// --- 3. ULTRA-SMOOTH LERP SCROLL ENGINE (ZERO LAG / ZERO STUTTER) ---
let currentProgress = 0;
let targetProgress = 0;

function initScrollEngine() {
  const heroStage = document.getElementById('hero-stage');
  const layerExterior = document.getElementById('layer-exterior');
  const layerMist = document.getElementById('layer-mist');
  const layerRotunda = document.getElementById('layer-rotunda');
  const heroTitles = document.getElementById('hero-titles-overlay');
  const scrollPrompt = document.getElementById('scroll-prompt-anchor');
  const rotundaCards = document.getElementById('rotunda-cards-stage');
  const rotundaFooter = document.getElementById('rotunda-nav-footer');

  const navCitadel = document.getElementById('nav-citadel-btn');
  const navChambers = document.getElementById('nav-chambers-btn');
  const dockHome = document.getElementById('dock-home-btn');
  const dockRotunda = document.getElementById('dock-rotunda-btn');

  function calculateTarget() {
    if (!heroStage) return;
    const stageRect = heroStage.getBoundingClientRect();
    const stageHeight = heroStage.offsetHeight;
    const viewportHeight = window.innerHeight;
    const totalScrollable = stageHeight - viewportHeight;

    if (totalScrollable <= 0) {
      targetProgress = 0;
      return;
    }

    const scrolled = -stageRect.top;
    targetProgress = Math.max(0, Math.min(1, scrolled / totalScrollable));
  }

  window.addEventListener('scroll', calculateTarget, { passive: true });
  calculateTarget();

  let lastAppliedProgress = -1;

  function renderLoop() {
    const diff = targetProgress - currentProgress;
    
    // Snappy, organic damping factor
    if (Math.abs(diff) > 0.0005) {
      currentProgress += diff * 0.14;
    } else {
      currentProgress = targetProgress;
    }

    if (Math.abs(currentProgress - lastAppliedProgress) > 0.0002) {
      lastAppliedProgress = currentProgress;
      const p = currentProgress;

      // 1. Exterior Mansion Zoom
      if (layerExterior) {
        const zoom = 1.0 + p * 1.55;
        layerExterior.style.transform = `scale(${zoom.toFixed(3)}) translate3d(0, 0, 0)`;
        
        if (p <= 0.32) {
          layerExterior.style.opacity = '1';
        } else if (p < 0.62) {
          layerExterior.style.opacity = (1 - (p - 0.32) / 0.30).toFixed(3);
        } else {
          layerExterior.style.opacity = '0';
        }
      }

      // 2. Volumetric Mist Fog Layer
      if (layerMist) {
        let mistOpacity = 0;
        if (p > 0.18 && p < 0.78) {
          mistOpacity = Math.sin(((p - 0.18) / 0.60) * Math.PI) * 0.95;
        }
        layerMist.style.opacity = mistOpacity.toFixed(3);
      }

      // 3. Interior Rotunda with Hooded Man Standing in Front of Room
      if (layerRotunda) {
        if (p < 0.36) {
          layerRotunda.style.opacity = '0';
          layerRotunda.style.pointerEvents = 'none';
        } else {
          const rotundaFade = Math.min(1, (p - 0.36) / 0.32);
          const rotundaScale = 1.15 - (p - 0.36) * 0.15;
          layerRotunda.style.opacity = rotundaFade.toFixed(3);
          layerRotunda.style.transform = `scale(${Math.max(1.0, rotundaScale).toFixed(3)}) translate3d(0, 0, 0)`;
          layerRotunda.style.pointerEvents = 'auto';
        }
      }

      // 4. Hero Logo & Scroll Prompt
      if (heroTitles) {
        const titlesOpacity = Math.max(0, 1 - p * 3.4);
        heroTitles.style.opacity = titlesOpacity.toFixed(3);
        heroTitles.style.transform = `translateX(-50%) translateY(${(-50 - p * 40).toFixed(1)}%)`;
      }
      if (scrollPrompt) {
        const promptOpacity = Math.max(0, 1 - p * 4.0);
        scrollPrompt.style.opacity = promptOpacity.toFixed(3);
        scrollPrompt.style.pointerEvents = promptOpacity > 0.1 ? 'auto' : 'none';
      }

      // 5. The 3 Floating Golden HUD Cards
      if (rotundaCards) {
        if (p < 0.50) {
          rotundaCards.style.opacity = '0';
          rotundaCards.style.pointerEvents = 'none';
          rotundaCards.style.transform = 'translate(-50%, -46%) scale(0.92) translate3d(0, 0, 0)';
        } else {
          const cardsProgress = Math.min(1, (p - 0.50) / 0.38);
          rotundaCards.style.opacity = cardsProgress.toFixed(3);
          rotundaCards.style.pointerEvents = 'auto';
          const cardY = -50 + (1 - cardsProgress) * 4;
          const cardScale = 0.92 + cardsProgress * 0.08;
          rotundaCards.style.transform = `translate(-50%, ${cardY.toFixed(1)}%) scale(${cardScale.toFixed(3)}) translate3d(0, 0, 0)`;
        }
      }

      // 6. Rotunda Footer Buttons
      if (rotundaFooter) {
        if (p > 0.72) {
          rotundaFooter.style.opacity = '1';
          rotundaFooter.style.pointerEvents = 'auto';
        } else {
          rotundaFooter.style.opacity = '0';
          rotundaFooter.style.pointerEvents = 'none';
        }
      }
    }

    requestAnimationFrame(renderLoop);
  }

  requestAnimationFrame(renderLoop);
}

  
// Universal Section Navigation Router (Absolute Pixel Offset)
window.scrollToSection = function(sectionId) {
  playWhooshSound();
  const navHeight = 70;

  if (sectionId === 'home') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveNavState('home');
    return;
  }

  if (sectionId === 'events') {
    const heroStage = document.getElementById('hero-stage');
    if (heroStage) {
      const stageHeight = heroStage.offsetHeight;
      const totalScrollable = stageHeight - window.innerHeight;
      window.scrollTo({ top: totalScrollable * 0.88, behavior: 'smooth' });
    }
    setActiveNavState('events');
    return;
  }

  let el = null;
  if (sectionId === 'hackathon') el = document.getElementById('guilds-section');
  else if (sectionId === 'schedule') el = document.getElementById('schedule-section');
  else if (sectionId === 'prizes') el = document.getElementById('prizes-section');
  else el = document.getElementById(sectionId);

  if (el) {
    const targetY = window.scrollY + el.getBoundingClientRect().top - navHeight;
    window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
    setActiveNavState(sectionId);
  }
};

function setActiveNavState(activeSection) {
  const navBtns = {
    home: document.getElementById('nav-btn-home'),
    events: document.getElementById('nav-btn-events'),
    hackathon: document.getElementById('nav-btn-hackathon'),
    schedule: document.getElementById('nav-btn-schedule'),
    prizes: document.getElementById('nav-btn-prizes')
  };

  const dockBtns = {
    home: document.getElementById('dock-btn-home'),
    events: document.getElementById('dock-btn-events'),
    hackathon: document.getElementById('dock-btn-hackathon'),
    schedule: document.getElementById('dock-btn-schedule'),
    prizes: document.getElementById('dock-btn-prizes')
  };

  Object.keys(navBtns).forEach(key => {
    if (key === activeSection) {
      navBtns[key]?.classList.add('active');
      dockBtns[key]?.classList.add('active');
    } else {
      navBtns[key]?.classList.remove('active');
      dockBtns[key]?.classList.remove('active');
    }
  });
}

// Continuous Real-Time ScrollSpy (Updates active nav indicator on every scroll)
function updateScrollSpy() {
  const scrollY = window.scrollY;
  const heroStage = document.getElementById('hero-stage');
  const hackSection = document.getElementById('guilds-section');
  const schedSection = document.getElementById('schedule-section');
  const prizeSection = document.getElementById('prizes-section');

  const heroHeight = heroStage ? heroStage.offsetHeight : 2500;
  const triggerOffset = 220; // Active threshold from top of viewport

  let activeSection = 'home';

  // Check if scrolled near bottom of page
  const isAtBottom = (window.innerHeight + scrollY) >= (document.documentElement.scrollHeight - 70);

  if (isAtBottom) {
    activeSection = 'prizes';
  } else if (prizeSection && prizeSection.getBoundingClientRect().top <= triggerOffset) {
    activeSection = 'prizes';
  } else if (schedSection && schedSection.getBoundingClientRect().top <= triggerOffset) {
    activeSection = 'schedule';
  } else if (hackSection && hackSection.getBoundingClientRect().top <= triggerOffset) {
    activeSection = 'hackathon';
  } else if (scrollY >= heroHeight * 0.38) {
    activeSection = 'events';
  } else {
    activeSection = 'home';
  }

  setActiveNavState(activeSection);
}

function initNavigationLinks() {
  // Top Navbar items
  document.getElementById('nav-btn-home')?.addEventListener('click', () => scrollToSection('home'));
  document.getElementById('nav-btn-events')?.addEventListener('click', () => scrollToSection('events'));
  document.getElementById('nav-btn-hackathon')?.addEventListener('click', () => scrollToSection('hackathon'));
  document.getElementById('nav-btn-schedule')?.addEventListener('click', () => scrollToSection('schedule'));
  document.getElementById('nav-btn-prizes')?.addEventListener('click', () => scrollToSection('prizes'));

  // Left Dock items
  document.getElementById('dock-btn-home')?.addEventListener('click', () => scrollToSection('home'));
  document.getElementById('dock-btn-events')?.addEventListener('click', () => scrollToSection('events'));
  document.getElementById('dock-btn-hackathon')?.addEventListener('click', () => scrollToSection('hackathon'));
  document.getElementById('dock-btn-schedule')?.addEventListener('click', () => scrollToSection('schedule'));
  document.getElementById('dock-btn-prizes')?.addEventListener('click', () => scrollToSection('prizes'));

  // Rotunda bottom buttons
  document.getElementById('btn-back-to-sky')?.addEventListener('click', () => scrollToSection('home'));
  document.querySelectorAll('.scroll-to-schedule').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      scrollToSection('schedule');
    });
  });

  // Hero scroll prompt
  document.getElementById('scroll-prompt-trigger')?.addEventListener('click', () => scrollToSection('events'));

  // Bind real-time scroll spy
  window.addEventListener('scroll', updateScrollSpy, { passive: true });
  updateScrollSpy();
}

// --- 4. CLEAN CARD INTERACTIONS (ZERO MOUSEMOVE OVERHEAD FOR 120 FPS) ---
function initCardInteractions() {
  const cards = document.querySelectorAll('.gothic-portal-card');

  cards.forEach(card => {
    const chamberId = card.getAttribute('data-chamber');

    card.addEventListener('mouseenter', () => {
      playCardHoverChime();
    });

    card.addEventListener('click', (e) => {
      if (e.target.closest('.open-reg-shortcut')) return;
      openChamberView(chamberId);
    });
  });

  document.querySelectorAll('.open-chamber-trigger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const chamberId = btn.getAttribute('data-chamber-id');
      openChamberView(chamberId);
    });
  });

  document.querySelectorAll('.open-reg-shortcut').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const preset = btn.getAttribute('data-chamber-name');
      openRegistrationModal(preset);
    });
  });
}

// --- 5. FULLSCREEN ROOM INTERIOR MODAL (EXACT AS IN USER RECORDING) ---
window.openChamberView = function(roomId) {
  playDoorEntrySound();
  const room = CHAMBER_DATA[roomId];
  if (!room) return;

  const overlay = document.getElementById('room-interior-overlay');
  const bg = document.getElementById('room-interior-bg');
  const body = document.getElementById('room-interior-body');

  if (bg) {
    bg.style.backgroundImage = `url('${room.bg}')`;
    bg.style.transform = 'scale(1.15)';
    setTimeout(() => {
      bg.style.transform = 'scale(1)';
    }, 50);
  }

  if (body) {
    body.innerHTML = `
      <div class="room-nav-header">
        <div>
          <div class="room-tag"><i class="fa-solid fa-dungeon"></i> ${room.tag}</div>
          <h2 class="room-title">${room.title}</h2>
          <p class="room-desc">${room.desc}</p>
        </div>
        <button class="btn-exit-portal" id="exit-chamber-btn">
          <i class="fa-solid fa-door-closed"></i>
          <span>Back to Events</span>
        </button>
      </div>

      <div class="room-cards-matrix">
        ${room.events.map(evt => `
          <div class="room-event-pod">
            <div>
              <div class="pod-cat"><i class="fa-solid fa-bolt"></i> ${evt.host}</div>
              <h3 class="pod-title">${evt.title}</h3>
              <p class="pod-desc">${evt.desc}</p>
            </div>
            <button class="btn-pod-action" onclick="openRegistrationModal('${evt.title}')">
              Register for this Event <i class="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        `).join('')}
      </div>
    `;
  }

  if (overlay) overlay.classList.remove('hidden');

  document.getElementById('exit-chamber-btn')?.addEventListener('click', () => {
    if (overlay) overlay.classList.add('hidden');
    playWhooshSound();
  });
};

window.openRegistrationModal = function(presetChamber = '') {
  const modal = document.getElementById('reg-modal-backdrop');
  if (!modal) return;
  const sel = document.getElementById('reg-chamber-select');
  if (sel && presetChamber) {
    for (let i = 0; i < sel.options.length; i++) {
      if (sel.options[i].value.includes(presetChamber) || presetChamber.includes(sel.options[i].value)) {
        sel.selectedIndex = i;
        break;
      }
    }
  }
  modal.classList.add('active');
  playModalOpenSound();
};

window.openRegWith = function(chamberName) {
  document.getElementById('room-interior-overlay')?.classList.add('hidden');
  openRegistrationModal(chamberName);
};

function initModals() {
  document.getElementById('reg-close-btn')?.addEventListener('click', () => {
    document.getElementById('reg-modal-backdrop')?.classList.remove('active');
  });
  document.getElementById('reg-modal-backdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'reg-modal-backdrop') {
      e.target.classList.remove('active');
    }
  });

  document.getElementById('open-pass-btn')?.addEventListener('click', () => {
    openRegistrationModal();
  });
}

// --- 6. TIMETABLE STREAM INJECTION ---
function renderSchedule(dayKey) {
  const container = document.getElementById('schedule-timeline-grid');
  if (!container) return;

  const items = SCHEDULE_DATA[dayKey] || [];
  container.innerHTML = items.map(item => `
    <div class="schedule-item-card">
      <div class="item-time-col">
        <span class="item-time">${item.time}</span>
        <span class="item-badge">${item.cat}</span>
      </div>
      <div class="item-title-col">
        <h4>${item.title}</h4>
        <p>${item.desc}</p>
      </div>
      <div class="item-action-col">
        <button class="btn-card-primary" onclick="openRegistrationModal('${item.title}')">
          <i class="fa-solid fa-ticket"></i> PASS
        </button>
      </div>
    </div>
  `).join('');
}

function initScheduleTabs() {
  const tabBtns = document.querySelectorAll('.schedule-tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const day = btn.getAttribute('data-day');
      renderSchedule(day);
    });
  });
  renderSchedule('day1');
}

// --- 7. SPATIAL WEB AUDIO SYNTHESIZER ---
let audioCtx = null;
let isAudioActive = false;
let ambientOsc1 = null;
let ambientOsc2 = null;
let ambientGain = null;

function toggleAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  isAudioActive = !isAudioActive;
  const icon = document.getElementById('audio-icon');
  const label = document.getElementById('audio-label');

  if (isAudioActive) {
    if (icon) icon.className = 'fa-solid fa-volume-high';
    if (label) label.textContent = 'AUDIO: ON';
    startHauntedDrone();
  } else {
    if (icon) icon.className = 'fa-solid fa-volume-xmark';
    if (label) label.textContent = 'AUDIO: OFF';
    stopHauntedDrone();
  }
}

function startHauntedDrone() {
  if (!audioCtx) return;
  try {
    ambientGain = audioCtx.createGain();
    ambientGain.gain.setValueAtTime(0.01, audioCtx.currentTime);
    ambientGain.gain.exponentialRampToValueAtTime(0.08, audioCtx.currentTime + 3);

    ambientOsc1 = audioCtx.createOscillator();
    ambientOsc1.type = 'sawtooth';
    ambientOsc1.frequency.setValueAtTime(55, audioCtx.currentTime);

    const filter1 = audioCtx.createBiquadFilter();
    filter1.type = 'lowpass';
    filter1.frequency.setValueAtTime(220, audioCtx.currentTime);

    ambientOsc1.connect(filter1);
    filter1.connect(ambientGain);

    ambientOsc2 = audioCtx.createOscillator();
    ambientOsc2.type = 'sine';
    ambientOsc2.frequency.setValueAtTime(110.5, audioCtx.currentTime);

    const filter2 = audioCtx.createBiquadFilter();
    filter2.type = 'bandpass';
    filter2.frequency.setValueAtTime(330, audioCtx.currentTime);

    ambientOsc2.connect(filter2);
    filter2.connect(ambientGain);

    ambientGain.connect(audioCtx.destination);

    ambientOsc1.start();
    ambientOsc2.start();
  } catch(e) {}
}

function stopHauntedDrone() {
  if (ambientGain && audioCtx) {
    ambientGain.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 0.5);
    setTimeout(() => {
      try {
        ambientOsc1?.stop();
        ambientOsc2?.stop();
      } catch(e) {}
    }, 500);
  }
}

function playCardHoverChime() {
  if (!isAudioActive || !audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(640, audioCtx.currentTime + 0.15);

    g.gain.setValueAtTime(0.04, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);

    osc.connect(g);
    g.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.2);
  } catch(e) {}
}

function playWhooshSound() {
  if (!isAudioActive || !audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.25);

    g.gain.setValueAtTime(0.06, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);

    osc.connect(g);
    g.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.25);
  } catch(e) {}
}

function playDoorEntrySound() {
  if (!isAudioActive || !audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(90, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(45, audioCtx.currentTime + 0.4);

    g.gain.setValueAtTime(0.08, audioCtx.currentTime);
    g.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);

    osc.connect(g);
    g.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.4);
  } catch(e) {}
}

function playModalOpenSound() {
  if (!isAudioActive || !audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(90, audioCtx.currentTime + 0.3);

    g.gain.setValueAtTime(0.08, audioCtx.currentTime);
    g.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);

    osc.connect(g);
    g.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.35);
  } catch(e) {}
}

// Ambient Lightning Flash
function scheduleLightning() {
  const overlay = document.getElementById('lightning-overlay');
  if (!overlay) return;

  const nextFlashDelay = 12000 + Math.random() * 15000;
  setTimeout(() => {
    overlay.style.opacity = '1';
    setTimeout(() => {
      overlay.style.opacity = '0';
      setTimeout(() => {
        overlay.style.opacity = '0.7';
        setTimeout(() => {
          overlay.style.opacity = '0';
          scheduleLightning();
        }, 60);
      }, 90);
    }, 80);
  }, nextFlashDelay);
}

// Spider interaction
function initSpider() {
  const spider = document.getElementById('corner-spider');
  if (spider) {
    spider.addEventListener('click', () => {
      spider.style.animation = 'none';
      spider.style.transform = 'translateY(-140px)';
      spider.style.transition = 'transform 0.4s ease';
      setTimeout(() => {
        spider.style.animation = '';
        spider.style.transition = '';
      }, 2500);
    });
  }
}

// --- 8. INITIALIZATION ENTRY POINT ---
document.addEventListener('DOMContentLoaded', () => {
  initScrollEngine();
  initNavigationLinks();
  initCardInteractions();
  initScheduleTabs();
  initModals();
  initSpider();
  scheduleLightning();

  document.getElementById('audio-toggle-btn')?.addEventListener('click', toggleAudio);
  console.log('CODEC 2K26 Engine Online • TechKnow Society IIIT Kota');
});
