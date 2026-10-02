# CODEC 2K26 — Flagship Technical Summit
### Presented by TechKnow Council — Indian Institute of Information Technology Kota

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/Node.js-v18%2B%20%7C%20v24-brightgreen.svg)](https://nodejs.org/)
[![Database](https://img.shields.io/badge/Database-SQLite%20WAL%20Engine-orange.svg)](https://www.sqlite.org/wal.html)
[![WebGL](https://img.shields.io/badge/3D%20Engine-Three.js%20WebGL-black.svg)](https://threejs.org/)
[![Build Status](https://img.shields.io/badge/Build-Passing-success.svg)](https://github.com/AyushSrivastava1818/codec-2k26)

**CODEC 2K26** is the flagship annual technical summit of **IIIT Kota**, curated and engineered by the **TechKnow Council**. The platform combines an interactive, 3D WebGL portal journey across five summit chambers with a robust, zero-latency registration and event reservation engine.

---

## 📋 Delegate Registration & Onboarding Architecture

The CODEC 2K26 portal implements a seamless two-tier registration workflow: general all-access summit credentials coupled with one-click enrollment across specialized technical arenas.

```
                           +--------------------------------+
                           |     Attendee Visits Summit     |
                           +---------------+----------------+
                                           |
                    +----------------------+----------------------+
                    |                                             |
        [Already Has Summit Pass]                    [New Delegate / First Visit]
                    |                                             |
    +---------------+---------------+             +---------------+---------------+
    |  Click ANY Competition:       |             |  Click ANY Competition / Pass:|
    |  • 24h National Hackathon     |             |  • Interactive multi-event    |
    |  • Speed DSA Knockout Arena   |             |    checklist opens with that  |
    |  • RoboWars Combat Arena      |             |    arena pre-selected.        |
    |  • Midnight Security CTF      |             |                               |
    |  • Microservices Masterclass  |             |  Submit Registration:         |
    |  • Campus LAN Esports         |             |  • Digital Pass Generated.    |
    |                               |             |  • All selected event RSVPs   |
    |  1-Click RSVP Confirmation:   |             |    recorded simultaneously.   |
    |  • Auto-populates credentials |             +---------------+---------------+
    |  • Confirms seat instantly    |                             |
    |  • No redundant form entry    |                             v
    +---------------+---------------+             +---------------+---------------+
                    |                             |  Digital Pass Displayed with  |
                    +---------------------------->|  Unique Ticket Code & QR Data |
                                                  +-------------------------------+
```

### Delegate Onboarding Guide

#### 1. Claiming Your Official Summit Pass (All-Access)
1. **Access Registration**: Click **"REGISTER NOW"** on the main hero banner, the **"PASS"** button in the header dock, or select any portal in the 3D Chamber Rotunda.
2. **Enter Delegate Information**:
   - **Full Legal / Delegate Name**
   - **Email Address** (Used for ticket delivery and schedule notifications)
   - **Institution / College / University** (e.g., *IIIT Kota*, *IITs*, *NITs*, etc.)
   - **Contact Phone Number**
3. **Select Desired Competitions & Tracks**:
   - Attendees can check any combination of events during initial pass generation:
     - 🎟️ **General Summit Delegate** *(Keynotes, Exhibits & Grand Pass)*
     - ⚡ **24-Hour National Hackathon** *(Flagship 24h Hackathon)*
     - 💻 **Speed DSA Knockout Arena** *(Algorithmic Arena)*
     - 🤖 **RoboWars Combat Gladiator** *(Robotics Combat Arena)*
     - 🛡️ **Midnight Security CTF** *(Cybersecurity Challenge)*
     - ☁️ **Microservices Architecture** *(Engineering Workshop)*
     - 🎮 **Campus LAN Esports** *(Tournament Bracket)*
4. **Instant Pass Generation**:
   - Upon clicking **"GENERATE OFFICIAL PASS"**, a verifiable digital pass is issued with a unique ticket identifier (`CODEC-26-XXXX`) and encrypted QR verification payload.
   - Credentials are saved in local session storage, allowing returning attendees to access their ticket via the green **"MY PASS"** header button at any time.

#### 2. Individual Arena & Sub-Event Enrollment (1-Click RSVP)
For attendees who already possess a Summit Pass:
1. Browse to any event card in the 3D Rotunda, Chamber directory, or schedule.
2. Click **"REGISTER"** or **"PASS"** on the specific competition.
3. The registration modal opens with your name, college, and ticket code automatically filled.
4. Confirm your selection with **one click** without re-typing credentials.

#### 3. On-Campus Venue Admission
- Present your digital pass or QR token at the **IIIT Kota campus registration desk** on summit morning.
- Coordinators verify ticket validity to issue physical badges, access passes, and delegate kits.

---

## 🏆 Summit Chambers & Competitions

| Chamber | Track / Event | Format | Focus Area |
|---|---|---|---|
| **Chamber 00** | **Archival Vault** | Interactive Exhibit | Summit history, council charter & technical showcase |
| **Chamber I** | **Coding Arena & Gladiator** | Competitive Rounds | Speed DSA Knockout, RoboWars Arena & Midnight CTF |
| **Chamber II** | **24-Hour National Hackathon** | 24-Hour Sprint | AI/ML, Distributed Systems, Web3 & Open Innovation |
| **Chamber III** | **Chrono Archive & Workshops** | Masterclass Sessions | Microservices, Cloud Architecture & gRPC Engineering |
| **Chamber IV** | **Ceremonial Hall** | Keynotes & Awards | Keynote addresses, panel discussions & grand prize distributions |

---

## ⚡ Architecture & Concurrency Engineering

The CODEC 2K26 system is architected for maximum throughput, low memory footprint, and consistent sub-5ms latency under peak registration traffic:

- **High-Concurrency SQLite Engine (WAL Mode)**:
  - Powered by Node.js, Express, and `better-sqlite3`.
  - Configured with `PRAGMA journal_mode = WAL;`, `PRAGMA synchronous = NORMAL;`, and `PRAGMA busy_timeout = 5000;`.
  - Concurrency benchmarks verify stable execution across **300–400 simultaneous users** with zero locking timeouts or dropped transactions.
  - Reads operate concurrently without blocking database write transactions.

- **60–120 FPS Hardware-Accelerated 3D Engine**:
  - Three.js WebGL render pipeline featuring physical human-eye height dolly controls.
  - Frame-rate independent exponential decay damping (`1 - Math.exp(-k * delta)`).
  - Raycasting throttled to active pointer movements to eliminate redundant GPU/CPU cycle consumption.
  - GPU particle matrix buffers rendering 580 simultaneous ambient particles and portal embers.

- **Adaptive Mobile & Touch Responsiveness**:
  - Horizontal CSS snap-carousel (`scroll-snap-type: x mandatory`) for touch screens.
  - Ergonomic bottom navigation dock for mobile devices (`HOME`, `CHAMBERS`, `HACKATHON`, `SCHEDULE`, `PRIZES`).
  - Desktop-only side panels automatically culled on viewports `<= 860px`.
  - Forms and pass layouts adapt down to 360px screen widths.

---

## 📡 Backend API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check endpoint and database operational status |
| `GET` | `/api/stats` | Real-time counters (delegates registered, seats remaining, guilds formed) |
| `POST` | `/api/registrations` | Generate new Summit Pass with ticket code and QR payload |
| `GET` | `/api/registrations/my?email=...` | Retrieve existing summit passes by email address |
| `GET` | `/api/registrations/verify/:ticketCode` | Public ticket authenticity verification endpoint |
| `POST` | `/api/events/rsvp` | Enroll in individual competition or workshop |
| `POST` | `/api/events/batch-rsvp` | Batch register for multiple competitions simultaneously |
| `GET` | `/api/events/my?email=...` | Fetch all active competition reservations for an email |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended, fully tested on Node v24)
- `npm` or `yarn` / `pnpm`

### Installation & Local Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/AyushSrivastava1818/codec-2k26.git
   cd codec-2k26
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the Backend Server**:
   ```bash
   npm run server
   ```
   *Runs on `http://127.0.0.1:5000` backed by SQLite WAL storage.*

4. **Start the Frontend Development Server**:
   ```bash
   npm run dev
   ```
   *Runs on `http://localhost:5174` (automatically proxies `/api` to the backend).*

5. **Run Concurrency Load Test**:
   ```bash
   node scratch/stress_test.js
   ```
   *Verifies sub-5ms database transaction response under concurrent multi-user bursts.*

6. **Production Build**:
   ```bash
   npm run build
   ```

---

## 📁 Repository Structure

```
codec-2k26/
├── docs/                         # Summit documentation & design specifications
├── public/
│   └── assets/                   # Archway textures and brand assets
├── server/
│   ├── data/
│   │   └── codec.db              # High-concurrency SQLite database (WAL mode)
│   ├── routes/
│   │   ├── admin.js              # Administrative registry services
│   │   ├── auth.js               # User authentication services
│   │   ├── events.js             # Event RSVP & batch-registration routes
│   │   ├── registrations.js      # Summit Pass ticket generation
│   │   └── stats.js              # Real-time summit counters
│   ├── auth.js                   # Security & token verification middleware
│   ├── db.js                     # SQLite WAL engine configuration
│   └── server.js                 # Express master application
├── src/
│   ├── cinematic/
│   │   ├── AudioManager.js       # Synthetic procedural sound engine
│   │   ├── CameraController.js   # Physical human eye height 3D dolly
│   │   ├── ChamberManager.js     # 5 photorealistic stone archways
│   │   ├── CinematicController.js# Master 60-120 FPS timeline coordinator
│   │   ├── MouseParallax.js      # Frame-rate independent gaze interpolation
│   │   ├── ParticleSystem.js     # Zero-copy GPU particle motes & embers
│   │   ├── SceneManager.js       # Three.js WebGL & guarded raycasting
│   │   ├── ScrollController.js   # Exponential decay scroll engine
│   │   └── cinematic.css         # Responsive touch carousel & portal styles
│   ├── main.js                   # Application entry point & modal logic
│   └── style.css                 # Global design system & mobile breakpoints
├── index.html                    # Single-page application markup
├── vite.config.js                # Vite dev server & backend API proxy
├── package.json
└── README.md
```

---

## 🏛️ Council & Organization

- **Organization**: [TechKnow Council](https://iiitkota.ac.in) — The Official Technical Council of IIIT Kota
- **Institution**: Indian Institute of Information Technology Kota, Permanent Campus, Ranpur, Kota, Rajasthan — 325003
- **Official Inquiries**: `techknow@iiitkota.ac.in`

---

<div align="center">
  <sub>Engineered with precision for <strong>CODEC 2K26</strong> • TechKnow Council, IIIT Kota</sub>
</div>
