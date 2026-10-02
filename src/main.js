/* ==========================================================================
   CODEC 2K26 — MASTER ENTRY POINT
   TechKnow Council • IIIT Kota
   Integrated Cinematic 3D Engine, Procedural Audio, 5-Chamber Experience,
   and Schedule / Pass Registration Modules
   ========================================================================== */

import { CinematicController } from './cinematic/CinematicController.js';
import { audioManager } from './cinematic/AudioManager.js';

// --- 1. OFFICIAL SUMMIT TIMETABLE DATA ---
const SCHEDULE_DATA = {
  day1: [
    { time: '10:00 AM', cat: 'Workshop', title: 'Microservices Architecture Workshop', desc: 'Distributed backend engineering, cloud microservices, and gRPC.' },
    { time: '02:00 PM', cat: 'Competitive', title: 'Speed DSA Coding Arena', desc: 'Knockout competitive coding round with live leaderboard.' },
    { time: '05:30 PM', cat: 'Inaugural', title: 'Grand Opening Ceremony', desc: 'Technical summit kickoff, keynote, and problem statement teasers.' }
  ],
  day2: [
    { time: '08:00 AM', cat: 'Hackathon', title: '24-Hour National Hackathon Kickoff', desc: 'Problem statements unlocked; continuous sprint commences.' },
    { time: '02:00 PM', cat: 'Robotics', title: 'RoboWars Combat Round 1', desc: 'Gladiator matches in the reinforced titanium steel combat arena.' },
    { time: '11:00 PM', cat: 'Security', title: 'Midnight Security CTF Challenge', desc: 'Nocturnal capture the flag spanning binary exploitation and crypto.' }
  ],
  day3: [
    { time: '08:00 AM', cat: 'Defense', title: 'Hackathon Project Pitch & Jury Defense', desc: 'Shortlisted teams defend working prototypes before industry engineers.' },
    { time: '02:30 PM', cat: 'Keynote', title: 'Distinguished Guest Plenary', desc: 'Address by technology leaders on next-generation architectures.' },
    { time: '05:00 PM', cat: 'Awards', title: 'Valedictory Ceremony & Grand Awards', desc: 'Announcement of CODEC 2K26 champions and trophy presentations.' }
  ]
};

let cinematicController = null;

// Universal Section Navigation Router
window.scrollToSection = function(sectionId) {
  audioManager.playWhoosh();
  const navHeight = 70;

  if (sectionId === 'home') {
    if (cinematicController && cinematicController.scroll) {
      cinematicController.scroll.scrollToProgress(0.00);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setActiveNavState('home');
    return;
  }

  if (sectionId === 'events') {
    if (cinematicController && cinematicController.scroll) {
      cinematicController.scroll.scrollToProgress(0.88);
    } else {
      const heroStage = document.getElementById('hero-stage');
      if (heroStage) {
        window.scrollTo({ top: heroStage.offsetHeight * 0.88, behavior: 'smooth' });
      }
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

  const mobBtns = {
    home: document.getElementById('mob-btn-home'),
    events: document.getElementById('mob-btn-events'),
    hackathon: document.getElementById('mob-btn-hackathon'),
    schedule: document.getElementById('mob-btn-schedule'),
    prizes: document.getElementById('mob-btn-prizes')
  };

  Object.keys(navBtns).forEach(key => {
    if (key === activeSection) {
      navBtns[key]?.classList.add('active');
      dockBtns[key]?.classList.add('active');
      mobBtns[key]?.classList.add('active');
    } else {
      navBtns[key]?.classList.remove('active');
      dockBtns[key]?.classList.remove('active');
      mobBtns[key]?.classList.remove('active');
    }
  });
}

// Continuous Real-Time ScrollSpy
function updateScrollSpy() {
  const scrollY = window.scrollY;
  const heroStage = document.getElementById('hero-stage');
  const hackSection = document.getElementById('guilds-section');
  const schedSection = document.getElementById('schedule-section');
  const prizeSection = document.getElementById('prizes-section');

  const heroHeight = heroStage ? heroStage.offsetHeight : 2500;
  const triggerOffset = 220;

  let activeSection = 'home';
  const isAtBottom = (window.innerHeight + scrollY) >= (document.documentElement.scrollHeight - 70);

  if (isAtBottom) {
    activeSection = 'prizes';
  } else if (prizeSection && prizeSection.getBoundingClientRect().top <= triggerOffset) {
    activeSection = 'prizes';
  } else if (schedSection && schedSection.getBoundingClientRect().top <= triggerOffset) {
    activeSection = 'schedule';
  } else if (hackSection && hackSection.getBoundingClientRect().top <= triggerOffset) {
    activeSection = 'hackathon';
  } else if (scrollY >= heroHeight * 0.40) {
    activeSection = 'events';
  } else {
    activeSection = 'home';
  }

  setActiveNavState(activeSection);
}

// Registration Pass Modal - Connected to High-Concurrency SQLite WAL Backend
window.openRegistrationModal = function(presetChamber = '') {
  const modal = document.getElementById('reg-modal-backdrop');
  if (!modal) return;

  const formView = document.getElementById('reg-form-view');
  const successView = document.getElementById('reg-success-view');
  const existingPass = localStorage.getItem('codec_summit_pass');

  // If user already has an issued pass and didn't explicitly pick an event track to add
  if (existingPass && !presetChamber) {
    try {
      const pass = JSON.parse(existingPass);
      showDigitalPass(pass);
      modal.classList.add('active');
      audioManager.playWhoosh();
      return;
    } catch (e) {
      localStorage.removeItem('codec_summit_pass');
    }
  }

  // Otherwise show the registration form
  if (formView) formView.style.display = 'block';
  if (successView) successView.style.display = 'none';

  const sel = document.getElementById('reg-chamber-select');
  if (sel && presetChamber) {
    for (let i = 0; i < sel.options.length; i++) {
      if (sel.options[i].value.toLowerCase().includes(presetChamber.toLowerCase()) || 
          presetChamber.toLowerCase().includes(sel.options[i].value.toLowerCase())) {
        sel.selectedIndex = i;
        break;
      }
    }
  }

  modal.classList.add('active');
  audioManager.playWhoosh();
};

function showDigitalPass(pass) {
  const formView = document.getElementById('reg-form-view');
  const successView = document.getElementById('reg-success-view');

  if (formView) formView.style.display = 'none';
  if (successView) successView.style.display = 'block';

  const codeEl = document.getElementById('pass-display-code');
  const nameEl = document.getElementById('pass-display-name');
  const collEl = document.getElementById('pass-display-college');
  const trackEl = document.getElementById('pass-display-track');
  const typeEl = document.getElementById('pass-display-type');

  if (codeEl) codeEl.textContent = pass.ticket_code || pass.ticketCode || 'CODEC-26-CONFIRMED';
  if (nameEl) nameEl.textContent = pass.name || 'Summit Delegate';
  if (collEl) collEl.textContent = pass.college || 'IIIT Kota';
  if (trackEl) trackEl.textContent = pass.track || 'All Chambers';
  if (typeEl) typeEl.textContent = (pass.pass_type || 'SUMMIT PASS').replace(/_/g, ' ');

  // Update top register button to show badge
  const topPassBtn = document.getElementById('open-pass-btn');
  if (topPassBtn) {
    topPassBtn.innerHTML = `<i class="fa-solid fa-ticket"></i> <span>MY PASS</span>`;
    topPassBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
    topPassBtn.style.borderColor = '#34d399';
  }
}

function initModals() {
  const modal = document.getElementById('reg-modal-backdrop');
  const closeBtn = document.getElementById('reg-close-btn');
  const doneBtn = document.getElementById('btn-done-pass');
  const copyBtn = document.getElementById('btn-copy-ticket');
  const form = document.getElementById('summit-reg-form');
  const feedback = document.getElementById('reg-feedback');
  const submitBtn = document.getElementById('reg-submit-btn');
  const submitText = document.getElementById('reg-submit-text');
  const submitSpinner = document.getElementById('reg-submit-spinner');

  closeBtn?.addEventListener('click', () => modal?.classList.remove('active'));
  doneBtn?.addEventListener('click', () => modal?.classList.remove('active'));

  modal?.addEventListener('click', (e) => {
    if (e.target.id === 'reg-modal-backdrop') {
      modal.classList.remove('active');
    }
  });

  document.getElementById('open-pass-btn')?.addEventListener('click', () => {
    window.openRegistrationModal();
  });

  // Copy Ticket Code
  copyBtn?.addEventListener('click', () => {
    const code = document.getElementById('pass-display-code')?.textContent;
    if (code) {
      navigator.clipboard.writeText(code).then(() => {
        const originalHtml = copyBtn.innerHTML;
        copyBtn.innerHTML = `<i class="fa-solid fa-circle-check"></i> COPIED!`;
        copyBtn.style.color = '#34d399';
        setTimeout(() => {
          copyBtn.innerHTML = originalHtml;
          copyBtn.style.color = '';
        }, 2000);
      });
    }
  });

  // Handle Form Submission to Backend
  const handlePassSubmission = async (e) => {
    if (e) e.preventDefault();

    const name = document.getElementById('reg-name')?.value.trim();
    const email = document.getElementById('reg-email')?.value.trim();
    const college = document.getElementById('reg-college')?.value.trim();
    const phone = document.getElementById('reg-phone')?.value.trim();
    const track = document.getElementById('reg-chamber-select')?.value;

    if (!name || !email || !college) {
      if (feedback) {
        feedback.className = 'reg-form-feedback error';
        feedback.textContent = 'Please fill out all required fields.';
        feedback.style.display = 'block';
      }
      return;
    }

    // Set UI loading state
    if (submitBtn) submitBtn.disabled = true;
    if (submitText) submitText.style.display = 'none';
    if (submitSpinner) submitSpinner.style.display = 'inline-block';
    if (feedback) feedback.style.display = 'none';

    try {
      const payload = {
        name,
        email,
        college,
        phone,
        track,
        passType: 'ALL_ACCESS_SUMMIT_PASS'
      };

      let response;
      try {
        response = await fetch('/api/registrations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });
      } catch (proxyErr) {
        // Direct backend fallback if proxy is delayed
        response = await fetch('http://127.0.0.1:5000/api/registrations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to issue pass');
      }

      // Save pass locally
      localStorage.setItem('codec_summit_pass', JSON.stringify(data.pass));
      showDigitalPass(data.pass);
      audioManager.playWhoosh();
    } catch (err) {
      console.error('Registration failed:', err);
      if (feedback) {
        feedback.className = 'reg-form-feedback error';
        feedback.textContent = err.message || 'Server connection error. Please try again.';
        feedback.style.display = 'block';
      }
    } finally {
      if (submitBtn) submitBtn.disabled = false;
      if (submitText) submitText.style.display = 'inline-block';
      if (submitSpinner) submitSpinner.style.display = 'none';
    }
  };

  form?.addEventListener('submit', handlePassSubmission);
  submitBtn?.addEventListener('click', (e) => {
    if (form && form.checkValidity && !form.checkValidity()) {
      form.reportValidity();
      return;
    }
    handlePassSubmission(e);
  });

  // Check if existing pass is already stored
  const savedPass = localStorage.getItem('codec_summit_pass');
  if (savedPass) {
    try {
      const pass = JSON.parse(savedPass);
      const topPassBtn = document.getElementById('open-pass-btn');
      if (topPassBtn) {
        topPassBtn.innerHTML = `<i class="fa-solid fa-ticket"></i> <span>MY PASS</span>`;
        topPassBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        topPassBtn.style.borderColor = '#34d399';
      }
    } catch (e) {}
  }
}

// Timetable Stream Injection
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

// Audio Control Button
function initAudioButton() {
  const btn = document.getElementById('audio-toggle-btn');
  const icon = document.getElementById('audio-icon');
  const label = document.getElementById('audio-label');

  if (btn) {
    btn.addEventListener('click', () => {
      const active = audioManager.toggle();
      if (active) {
        if (icon) icon.className = 'fa-solid fa-volume-high';
        if (label) label.textContent = 'Audio: On';
      } else {
        if (icon) icon.className = 'fa-solid fa-volume-xmark';
        if (label) label.textContent = 'Audio: Off';
      }
    });
  }
}

// Ambient Lightning Flash
function scheduleLightning() {
  const overlay = document.getElementById('lightning-overlay');
  if (!overlay) return;

  const nextFlashDelay = 14000 + Math.random() * 16000;
  setTimeout(() => {
    overlay.style.opacity = '1';
    setTimeout(() => {
      overlay.style.opacity = '0';
      setTimeout(() => {
        overlay.style.opacity = '0.65';
        setTimeout(() => {
          overlay.style.opacity = '0';
          scheduleLightning();
        }, 60);
      }, 90);
    }, 80);
  }, nextFlashDelay);
}

// Interactive Corner Spider
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

// Navigation button bindings
function initNavButtons() {
  document.getElementById('scroll-prompt-trigger')?.addEventListener('click', () => {
    window.scrollToSection('events');
  });

  document.getElementById('btn-back-to-sky')?.addEventListener('click', () => {
    window.scrollToSection('home');
  });

  document.querySelectorAll('.scroll-to-hackathon').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollToSection('hackathon');
    });
  });

  window.addEventListener('scroll', updateScrollSpy, { passive: true });
  updateScrollSpy();
}

// DOM Initialization
document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Master Cinematic Controller
  cinematicController = new CinematicController();
  cinematicController.init();

  // 2. Initialize Navigation, Audio, Modals & Tabs
  initNavButtons();
  initAudioButton();
  initModals();
  initScheduleTabs();
  initSpider();
  scheduleLightning();

  console.log('CODEC 2K26 Cinematic Application Initialized.');
});
