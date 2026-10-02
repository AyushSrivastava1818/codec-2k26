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
let currentSubeventTarget = '';

window.openRegistrationModal = function(presetChamber = '') {
  const modal = document.getElementById('reg-modal-backdrop');
  if (!modal) return;

  const formView = document.getElementById('reg-form-view');
  const subeventView = document.getElementById('reg-subevent-view');
  const successView = document.getElementById('reg-success-view');
  const existingPassRaw = localStorage.getItem('codec_summit_pass');

  let existingPass = null;
  if (existingPassRaw) {
    try {
      existingPass = JSON.parse(existingPassRaw);
    } catch (e) {
      localStorage.removeItem('codec_summit_pass');
    }
  }

  // CASE 1: User has an active pass and clicked a specific sub-event -> Show 1-Click RSVP View!
  if (existingPass && presetChamber) {
    currentSubeventTarget = presetChamber;
    if (formView) formView.style.display = 'none';
    if (successView) successView.style.display = 'none';
    if (subeventView) {
      subeventView.style.display = 'block';

      // Populate details
      const titleEl = document.getElementById('subevent-title');
      const nameEl = document.getElementById('subevent-delegate-name');
      const collEl = document.getElementById('subevent-delegate-college');
      const codeEl = document.getElementById('subevent-delegate-code');
      const arenaEl = document.getElementById('subevent-arena-name');
      const confirmBtn = document.getElementById('subevent-confirm-btn');
      const btnText = document.getElementById('subevent-btn-text');
      const btnSpinner = document.getElementById('subevent-btn-spinner');
      const feedback = document.getElementById('subevent-feedback');

      if (titleEl) titleEl.textContent = presetChamber;
      if (nameEl) nameEl.textContent = existingPass.name || 'Summit Delegate';
      if (collEl) collEl.textContent = existingPass.college || 'IIIT Kota';
      if (codeEl) codeEl.textContent = existingPass.ticket_code || existingPass.ticketCode || 'CODEC-26-CONFIRMED';
      if (arenaEl) arenaEl.textContent = presetChamber;

      if (confirmBtn) {
        confirmBtn.disabled = false;
        confirmBtn.style.background = '';
      }
      if (btnText) {
        btnText.innerHTML = 'CONFIRM SUB-EVENT SEAT <i class="fa-solid fa-circle-check"></i>';
        btnText.style.display = 'inline-block';
      }
      if (btnSpinner) btnSpinner.style.display = 'none';
      if (feedback) feedback.style.display = 'none';
    }

    modal.classList.add('active');
    audioManager.playWhoosh();
    return;
  }

  // CASE 2: User has an active pass and clicked "MY PASS" (no preset event) -> Show Digital Pass!
  if (existingPass && !presetChamber) {
    if (subeventView) subeventView.style.display = 'none';
    showDigitalPass(existingPass);
    modal.classList.add('active');
    audioManager.playWhoosh();
    return;
  }

  // CASE 3: User does NOT have an active pass -> Show Registration Form!
  if (subeventView) subeventView.style.display = 'none';
  if (successView) successView.style.display = 'none';
  if (formView) formView.style.display = 'block';

  // Automatically select or add the preset chamber in the select dropdown
  const sel = document.getElementById('reg-chamber-select');
  if (sel && presetChamber) {
    let matched = false;
    for (let i = 0; i < sel.options.length; i++) {
      if (sel.options[i].value.toLowerCase().includes(presetChamber.toLowerCase()) || 
          presetChamber.toLowerCase().includes(sel.options[i].value.toLowerCase())) {
        sel.selectedIndex = i;
        matched = true;
        break;
      }
    }
    // If not found in default list, dynamically append and select it
    if (!matched) {
      const opt = document.createElement('option');
      opt.value = presetChamber;
      opt.textContent = 'Event: ' + presetChamber;
      opt.selected = true;
      sel.appendChild(opt);
    }
  }

  modal.classList.add('active');
  audioManager.playWhoosh();
};

function showDigitalPass(pass) {
  const formView = document.getElementById('reg-form-view');
  const subeventView = document.getElementById('reg-subevent-view');
  const successView = document.getElementById('reg-success-view');

  if (formView) formView.style.display = 'none';
  if (subeventView) subeventView.style.display = 'none';
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
    topPassBtn.innerHTML = '<i class="fa-solid fa-ticket"></i> <span>MY PASS</span>';
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

  // Switch back to form view from digital pass
  const newPassBtn = document.getElementById('btn-new-pass');
  newPassBtn?.addEventListener('click', () => {
    const formView = document.getElementById('reg-form-view');
    const successView = document.getElementById('reg-success-view');
    const subeventView = document.getElementById('reg-subevent-view');
    if (formView) formView.style.display = 'block';
    if (successView) successView.style.display = 'none';
    if (subeventView) subeventView.style.display = 'none';
  });

  // Secret triple-click on crest to open registry
  let crestClickCount = 0;
  let crestClickTimer = null;
  const passLogos = document.querySelectorAll('.pass-logo, .brand-crest');
  passLogos.forEach(el => {
    el.addEventListener('click', () => {
      crestClickCount++;
      clearTimeout(crestClickTimer);
      if (crestClickCount >= 3) {
        crestClickCount = 0;
        modal?.classList.remove('active');
        window.openAdminModal?.();
      } else {
        crestClickTimer = setTimeout(() => { crestClickCount = 0; }, 1500);
      }
    });
  });

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
        copyBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i> COPIED!';
        copyBtn.style.color = '#34d399';
        setTimeout(() => {
          copyBtn.innerHTML = originalHtml;
          copyBtn.style.color = '';
        }, 2000);
      });
    }
  });

  // Handle Sub-Event RSVP Confirmation for existing pass holders
  const subeventConfirmBtn = document.getElementById('subevent-confirm-btn');
  const subeventBtnText = document.getElementById('subevent-btn-text');
  const subeventBtnSpinner = document.getElementById('subevent-btn-spinner');
  const subeventFeedback = document.getElementById('subevent-feedback');

  subeventConfirmBtn?.addEventListener('click', async () => {
    const existingPassRaw = localStorage.getItem('codec_summit_pass');
    if (!existingPassRaw) return;
    let pass;
    try {
      pass = JSON.parse(existingPassRaw);
    } catch (e) {
      return;
    }
    const eventName = currentSubeventTarget || document.getElementById('subevent-title')?.textContent || 'Summit Event';

    if (subeventConfirmBtn) subeventConfirmBtn.disabled = true;
    if (subeventBtnText) subeventBtnText.style.display = 'none';
    if (subeventBtnSpinner) subeventBtnSpinner.style.display = 'inline-block';
    if (subeventFeedback) subeventFeedback.style.display = 'none';

    try {
      const apiHost = window.location.hostname || '127.0.0.1';
      const rsvpPayload = {
        name: pass.name,
        email: pass.email,
        eventTitle: eventName,
        track: eventName
      };

      let res;
      try {
        res = await fetch('http://' + apiHost + ':5000/api/events/rsvp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(rsvpPayload)
        });
      } catch (err) {
        res = await fetch('/api/events/rsvp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(rsvpPayload)
        });
      }

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || 'Failed to record RSVP');

      if (subeventBtnText) {
        subeventBtnText.innerHTML = '<i class="fa-solid fa-circle-check"></i> SEAT CONFIRMED!';
        subeventBtnText.style.display = 'inline-block';
      }
      if (subeventConfirmBtn) {
        subeventConfirmBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
      }
      if (subeventFeedback) {
        subeventFeedback.className = 'subevent-success-alert';
        subeventFeedback.innerHTML = '<i class="fa-solid fa-check"></i> Registration confirmed for <strong>' + eventName + '</strong>!<br>RSVP recorded in summit database under Ticket <code>' + (pass.ticket_code || 'CODEC-26') + '</code>.';
        subeventFeedback.style.display = 'block';
      }
      audioManager.playWhoosh();
    } catch (err) {
      if (subeventBtnText) {
        subeventBtnText.innerHTML = 'TRY AGAIN';
        subeventBtnText.style.display = 'inline-block';
      }
      if (subeventConfirmBtn) subeventConfirmBtn.disabled = false;
      if (subeventFeedback) {
        subeventFeedback.className = 'reg-form-feedback error';
        subeventFeedback.textContent = err.message || 'Error recording RSVP. Please try again.';
        subeventFeedback.style.display = 'block';
      }
    } finally {
      if (subeventBtnSpinner) subeventBtnSpinner.style.display = 'none';
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

    // =========================================================================
    // SECRET ORGANIZER ACCESS GATEWAY:
    // If admin enters specific credentials, seamlessly unlock the Registry!
    // =========================================================================
    const nameLower = (name || '').toLowerCase();
    const emailLower = (email || '').toLowerCase();
    const phoneLower = (phone || '').toLowerCase();

    const isSecretAdmin = (
      emailLower === 'admin@codec.in' ||
      emailLower === 'admin@techknow.in' ||
      emailLower === 'admin@iiitkota.ac.in' ||
      phoneLower === 'admin2026' ||
      phoneLower === 'admin' ||
      phoneLower === '2026' ||
      phoneLower === '9999999999' ||
      nameLower === 'techknow admin' ||
      (nameLower === 'admin' && (emailLower.includes('admin') || phoneLower.includes('2026') || !college))
    );

    if (isSecretAdmin) {
      if (feedback) feedback.style.display = 'none';
      form?.reset();
      modal?.classList.remove('active');
      window.openAdminModal?.();
      return;
    }

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

      // Determine backend port 5000 base URL dynamically
      const apiHost = window.location.hostname || '127.0.0.1';
      const directApiUrl = 'http://' + apiHost + ':5000/api/registrations';

      let response;
      try {
        response = await fetch(directApiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });
      } catch (directErr) {
        // Fallback to relative proxy path
        response = await fetch('/api/registrations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });
      }

      const text = await response.text();
      let data = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch (jsonErr) {
        console.error('Non-JSON server response:', text);
        throw new Error('Registration server returned an invalid response. Please verify server is running on port 5000.');
      }

      if (!response.ok) {
        throw new Error(data.error || ('Server responded with status ' + response.status));
      }

      if (!data.pass) {
        throw new Error('No pass data returned from server.');
      }

      // Also record sub-event RSVP if a specific event track was selected
      if (track && !track.toLowerCase().includes('general')) {
        try {
          fetch('http://' + apiHost + ':5000/api/events/rsvp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name,
              email,
              eventTitle: track,
              track
            })
          }).catch(() => {});
        } catch (e) {}
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
        topPassBtn.innerHTML = '<i class="fa-solid fa-ticket"></i> <span>MY PASS</span>';
        topPassBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        topPassBtn.style.borderColor = '#34d399';
      }
    } catch (e) {}
  }
}

// Admin Live SQLite Database Viewer
let allRegistrations = [];

function initAdminModal() {
  const adminBackdrop = document.getElementById('admin-modal-backdrop');
  const openBtn = document.getElementById('open-admin-btn');
  const closeBtn = document.getElementById('admin-close-btn');
  const bottomCloseBtn = document.getElementById('admin-bottom-close-btn');
  const refreshBtn = document.getElementById('admin-refresh-btn');
  const exportBtn = document.getElementById('admin-export-csv-btn');
  const searchInput = document.getElementById('admin-search-input');

  window.openAdminModal = function() {
    adminBackdrop?.classList.add('active');
    loadAdminRegistrations();
    audioManager.playWhoosh();
  };

  const openAdmin = () => {
    window.openAdminModal();
  };

  // Secret keyboard shortcut: Ctrl+Shift+A opens registry
  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
      e.preventDefault();
      window.openAdminModal();
    }
  });

  const closeAdmin = () => {
    adminBackdrop?.classList.remove('active');
  };

  openBtn?.addEventListener('click', openAdmin);
  closeBtn?.addEventListener('click', closeAdmin);
  bottomCloseBtn?.addEventListener('click', closeAdmin);

  adminBackdrop?.addEventListener('click', (e) => {
    if (e.target.id === 'admin-modal-backdrop') {
      closeAdmin();
    }
  });

  refreshBtn?.addEventListener('click', () => {
    loadAdminRegistrations();
    audioManager.playTick();
  });

  exportBtn?.addEventListener('click', () => {
    const apiHost = window.location.hostname || '127.0.0.1';
    window.open('http://' + apiHost + ':5000/api/admin/export.csv', '_blank');
  });

  searchInput?.addEventListener('input', (e) => {
    const query = (e.target.value || '').toLowerCase().trim();
    if (!query) {
      renderAdminTable(allRegistrations);
      return;
    }

    const filtered = allRegistrations.filter(r => {
      return (
        (r.name && r.name.toLowerCase().includes(query)) ||
        (r.email && r.email.toLowerCase().includes(query)) ||
        (r.college && r.college.toLowerCase().includes(query)) ||
        (r.ticket_code && r.ticket_code.toLowerCase().includes(query)) ||
        (r.track && r.track.toLowerCase().includes(query)) ||
        (r.phone && r.phone.toLowerCase().includes(query))
      );
    });

    renderAdminTable(filtered);
  });
}

async function loadAdminRegistrations() {
  const tbody = document.getElementById('admin-table-body');
  if (tbody) {
    tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 2.5rem; color: var(--gold-warm);"><i class="fa-solid fa-spinner fa-spin"></i> Loading verified delegate credentials...</td></tr>';
  }

  const apiHost = window.location.hostname || '127.0.0.1';
  const url = 'http://' + apiHost + ':5000/api/admin/registrations';

  try {
    let res;
    try {
      res = await fetch(url);
    } catch (e) {
      res = await fetch('/api/admin/registrations');
    }

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to fetch registrations');
    }

    allRegistrations = data.registrations || [];
    const stats = data.stats || {};
    const trackBreakdown = stats.trackBreakdown || {};

    // Update stats counters
    const totalEl = document.getElementById('admin-stat-total');
    const hackEl = document.getElementById('admin-stat-hackathon');
    const dsaEl = document.getElementById('admin-stat-dsa');
    const roboEl = document.getElementById('admin-stat-robowars');
    const rsvpEl = document.getElementById('admin-stat-rsvps');

    if (totalEl) totalEl.textContent = stats.totalDelegates || allRegistrations.length;
    if (hackEl) {
      let hackCount = 0;
      Object.keys(trackBreakdown).forEach(k => {
        if (/hackathon/i.test(k)) hackCount += trackBreakdown[k];
      });
      hackEl.textContent = hackCount;
    }
    if (dsaEl) {
      let dsaCount = 0;
      Object.keys(trackBreakdown).forEach(k => {
        if (/dsa|speed|code/i.test(k)) dsaCount += trackBreakdown[k];
      });
      dsaEl.textContent = dsaCount;
    }
    if (roboEl) {
      let roboCount = 0;
      Object.keys(trackBreakdown).forEach(k => {
        if (/robo/i.test(k)) roboCount += trackBreakdown[k];
      });
      roboEl.textContent = roboCount;
    }
    if (rsvpEl) rsvpEl.textContent = stats.totalRsvps || (data.rsvps ? data.rsvps.length : 0);

    renderAdminTable(allRegistrations);
  } catch (err) {
    console.error('Admin Fetch Failed:', err);
    if (tbody) {
      tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 2rem; color: #ef4444;"><i class="fa-solid fa-triangle-exclamation"></i> Error loading registrations: ' + err.message + '. Please check connection to the summit registry server.</td></tr>';
    }
  }
}

function renderAdminTable(list) {
  const tbody = document.getElementById('admin-table-body');
  const countLabel = document.getElementById('admin-search-count');
  if (!tbody) return;

  if (countLabel) {
    countLabel.textContent = 'Showing ' + list.length + ' of ' + allRegistrations.length + ' registrations';
  }

  if (list.length === 0) {
    tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 2.5rem; color: rgba(255,255,255,0.45);"><i class="fa-solid fa-inbox"></i> No registrations found matching filter.</td></tr>';
    return;
  }

  const escapeHtml = (str) => String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

  tbody.innerHTML = list.map((reg, idx) => {
    const dateStr = reg.created_at ? new Date(reg.created_at).toLocaleString() : 'Recent';
    const statusBadge = reg.status === 'confirmed' || !reg.status
      ? '<span class="admin-badge confirmed"><i class="fa-solid fa-circle-check"></i> CONFIRMED</span>'
      : '<span class="admin-badge pending">' + escapeHtml(reg.status) + '</span>';

    return `
      <tr>
        <td class="td-muted">${reg.id || idx + 1}</td>
        <td><code class="ticket-code-tag">${escapeHtml(reg.ticket_code || 'CODEC-26')}</code></td>
        <td><strong>${escapeHtml(reg.name || 'Anonymous')}</strong></td>
        <td><a href="mailto:${escapeHtml(reg.email)}" style="color: #38bdf8; text-decoration: none;">${escapeHtml(reg.email || '')}</a></td>
        <td>${escapeHtml(reg.college || '—')}</td>
        <td class="td-muted">${escapeHtml(reg.phone || '—')}</td>
        <td><span class="track-tag">${escapeHtml(reg.track || 'General Summit')}</span></td>
        <td>${statusBadge}</td>
        <td class="td-muted" style="font-size: 0.75rem;">${dateStr}</td>
      </tr>
    `;
  }).join('');
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
  initAdminModal();
  initScheduleTabs();
  initSpider();
  scheduleLightning();

  console.log('CODEC 2K26 Cinematic Application Initialized.');
});
