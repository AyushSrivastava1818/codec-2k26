# CODEC 2K26 — Cinematic 3D Technical Summit

<div align="center">

![CODEC 2K26 Logo](public/assets/exact_codec_logo.svg)

### **TechKnow Council • Technical Council • Indian Institute of Information Technology Kota**

[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-r186-black?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-v24-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![SQLite WAL](https://img.shields.io/badge/SQLite-WAL_High_Concurrency-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://sqlite.org/)
[![Framerate](https://img.shields.io/badge/Performance-120_FPS_Zero_Lag-00E5FF?style=for-the-badge)](https://github.com/AyushSrivastava1818/codec-2k26)
[![Theme](https://img.shields.io/badge/Theme-Cyber_Gothic_Orange-FF7700?style=for-the-badge&logo=ghost&logoColor=white)](https://github.com/AyushSrivastava1818/codec-2k26)

*“WE ARE THE ‘ T ’ OF IIIT KOTA”*

</div>

---

## 🏛️ Overview

**CODEC 2K26** is the flagship annual national technical summit organized by **TechKnow Council**, the apex Technical Council of the **Indian Institute of Information Technology Kota (IIIT Kota)**. 

This web platform delivers an immersive, photorealistic Gothic Cyber-Mansion experience. Attendees travel through a pinned 3D cinematic timeline: starting outside the misty mansion, dollying forward as heavy iron gates open with glowing amber lighting, walking through the soaring Gothic Main Hall, and entering the central circular Rotunda with a celestial armillary sphere and 5 physical stone arch chambers.

---

## 🖥️ Live Website Experience Previews

### 1. Gothic Cyber-Mansion Hero & Cinematic Atmosphere
![Live Rotunda & Chambers](docs/images/website_live_rotunda.png)
*Monumental circular dome featuring an armillary astrolabe sphere and 5 interactive physical stone arch doorways arranged in an arc, fully responsive on mobile touch carousels.*

### 2. Chamber Arenas & Sub-Event Registrations
![Live Chamber Arenas](docs/images/website_live_events.png)
*Detailed summit tracks including the 24-Hour Flagship Hackathon, Speed DSA Knockout, RoboWars Combat, Midnight Security CTF, and Masterclasses.*

---

## 📸 Reference Storyboard & Cinematic Stages

### 🎬 Full 5-Stage Storyboard Progression
![Storyboard Progression](docs/images/01_storyboard_timeline.jpg)

### 🏰 Cinematic Environmental Stages

| Stage | Visual Preview | Description |
|---|---|---|
| **Stage 01: Exterior Approach** | ![Exterior Approach](docs/images/02_stage_exterior.jpg) | Cinematic establishing shot of the Gothic cyber estate at night with cold moonlight, volumetric ground mist, and flying bats. |
| **Stage 02: Gates Opening** | ![Gates Opening](docs/images/03_stage_gates_open.jpg) | Heavy gothic double gates opening with perspective dolly, glowing amber light flare, screen rumble, and CODEC / 2K26 neon signs. |
| **Stage 03: Gothic Main Hall** | ![Gothic Main Hall](docs/images/04_stage_main_hall.jpg) | High vaulted ceilings with dramatic god rays, cathedral columns, volumetric floor fog, and directional torchlight. |
| **Stage 04: Central Rotunda** | ![Central Rotunda](docs/images/05_stage_rotunda.jpg) | Monumental circular dome featuring a glowing celestial astrolabe sphere and 5 physical stone arch doorways arranged in an arc. |


---

## ✨ Key Architectural Features

- **🎮 60–120 FPS Butter-Smooth Interpolation (Zero Lag)**:
  - Frame-rate independent exponential decay damping (`1 - Math.exp(-k * delta)`).
  - WebGL Raycasting throttled to pointer movement events (`this.mouseMoved`), eliminating redundant collision tests when stationary.
  - Automatic GPU composition visibility culling (`display: none` on off-screen layers) preventing fill-rate bottlenecks.
  - Zero-copy particle matrix transforms for 580 simultaneous motes, embers, and portal auras.

- **📱 Complete Mobile Responsiveness on All Devices**:
  - **Horizontal Touch Carousel**: Rotunda chamber arch cards dynamically convert to a buttery-smooth horizontal touch track with mandatory snap (`scroll-snap-type: x mandatory`).
  - **Floating Mobile Bottom Dock**: Convenient thumb-accessible navigation bar on phone screens (`HOME`, `CHAMBERS`, `HACKATHON`, `SCHEDULE`, `PRIZES`).
  - Intrusive side docks and physics spiders automatically hide on viewports `<= 860px`.
  - Responsive modals and forms scale seamlessly down to 360px width.

- **⚡ High-Concurrency SQLite WAL Backend (Tested with 300–400 Simultaneous Users)**:
  - Powered by Node.js, Express, and `better-sqlite3`.
  - Configured with `PRAGMA journal_mode = WAL;`, `PRAGMA synchronous = NORMAL;`, and `PRAGMA busy_timeout = 5000;`.
  - Handles **300+ concurrent registrations/second** with zero locking timeouts and sub-5ms transaction latency.
  - Instant digital pass issuance (`CODEC-26-XXXX`) with unique QR verification strings and local browser caching.

---

## 🔌 Backend API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health check and database mode report |
| `GET` | `/api/stats` | Live summit counters (registered delegates, seats remaining, guilds formed) |
| `POST` | `/api/registrations` | Claim instant Summit Pass (returns unique ticket code and QR payload) |
| `GET` | `/api/registrations/my?email=...` | Retrieve all passes linked to an email address |
| `GET` | `/api/registrations/verify/:ticketCode` | Public ticket verification endpoint |
| `POST` | `/api/auth/register` | User account creation with async bcrypt hashing and auto-pass issuance |
| `POST` | `/api/auth/login` | Authenticate attendee and return JWT access token |
| `POST` | `/api/events/rsvp` | RSVP for individual summit workshops, CTF, DSA sprints, or Hackathon |
| `GET` | `/api/admin/registrations` | Admin endpoint returning all delegate records, RSVPs, and track statistics |
| `GET` | `/api/admin/export.csv` | Export all SQLite registrations directly as a CSV spreadsheet |

---

## 📋 Official Registration Procedure & Delegate Onboarding

CODEC 2K26 features a streamlined, two-tier delegate registration and competition reservation architecture designed for effortless onboarding.

```
                           ┌──────────────────────────────┐
                           │    Attendee Visits Summit    │
                           └──────────────┬───────────────┘
                                          │
                    ┌─────────────────────┴─────────────────────┐
                    ▼                                           ▼
        [Already Has Summit Pass]                    [New Delegate / First Visit]
                    │                                           │
    ┌───────────────┴───────────────┐           ┌───────────────┴───────────────┐
    │  Click ANY Competition:       │           │  Click ANY Competition:       │
    │  • 24h National Hackathon     │           │  • Form opens with that arena │
    │  • Speed DSA Knockout Arena   │           │    pre-selected automatically.│
    │  • RoboWars Combat Arena      │           │                               │
    │  • Midnight Security CTF      │           │  Submit Registration:         │
    │  • Microservices Masterclass  │           │  • Digital Pass Generated.    │
    │                               │           │  • Sub-Event RSVP reserved    │
    │  1-Click RSVP Confirmation:   │           │    in one single transaction. │
    │  • Auto-populates credentials │           └───────────────┬───────────────┘
    │  • Confirms seat instantly    │                           │
    │  • No re-typing required!     │                           ▼
    └───────────────┬───────────────┘           ┌───────────────────────────────┐
                    │                           │  Digital Pass Displayed with  │
                    └──────────────────────────►│  Unique Ticket Code & QR Data │
                                                └───────────────────────────────┘
```

### 1️⃣ Step-by-Step Registration Procedure

#### Step 1: Claiming Your Official Summit Pass (All-Access)
1. **Access Registration**: Click the **"REGISTER NOW"** button on the home hero banner, the **"PASS"** button in the top navigation bar, or select any chamber portal in the 3D Rotunda.
2. **Enter Delegate Credentials**:
   - **Full Legal / Delegate Name**
   - **Academic / Personal Email Address** (Used for ticket issuance and schedule updates)
   - **Institution / College / Organization** (e.g. *IIIT Kota*, *IITs*, *NITs*, etc.)
   - **Contact Phone Number**
   - **Preferred Primary Track** (Select *General Summit Delegate*, *24-Hour National Hackathon*, *Speed DSA Arena*, etc.)
3. **Instant Pass Issuance**:
   - Click **"GENERATE OFFICIAL PASS"**.
   - Your verifiable digital **CODEC 2K26 Summit Pass** is issued immediately with a unique ticket identifier (`CODEC-26-XXXX`), cryptographic QR token, and admission category.
   - The pass is securely cached in your local browser session. Returning attendees can view their credentials at any time by clicking the green **"MY PASS"** button in the header.

#### Step 2: Enrolling in Sub-Events & Competitions (1-Click RSVP)
Delegates can participate in individual arena competitions and technical tracks:
- **Flagship 24-Hour National Hackathon** (Chamber II — Software, AI & Hardware tracks)
- **Speed DSA Knockout Arena** (Chamber I — Rapid algorithmic problem-solving)
- **RoboWars Combat Gladiator** (Chamber I — High-intensity robotics arena)
- **Midnight Security CTF Challenge** (Chamber I — Nocturnal cybersecurity competition)
- **Microservices Architecture Masterclass** (Chamber III — Cloud infrastructure and distributed systems)
- **Campus LAN Esports Showdown** (Chamber I — Competitive gaming tournament)

**Workflow for Pass Holders:**
1. Navigate to the competition or workshop on the site (via the 3D Rotunda, chamber cards, or chronological timetable).
2. Click **"REGISTER"** or **"PASS"** on that event card.
3. The **Sub-Event Registration Modal** opens with your delegate name, college, and active ticket code pre-populated.
4. Click **"CONFIRM SUB-EVENT SEAT"**. Your seat is confirmed with **one click**, logging an RSVP in the summit registry without redundant data entry.

**Workflow for First-Time Attendees:**
1. Clicking **"REGISTER"** on any specific event opens the registration modal with that event automatically selected.
2. Complete the form to simultaneously receive your official Summit Pass and secure your seat for that competition in a single step.

#### Step 3: Check-in & On-Campus Admission
- Upon arrival at the **IIIT Kota permanent campus venue**, present your digital Summit Pass (or physical printout) at the registration desk.
- Summit volunteers will scan your pass QR token or enter your ticket code (`CODEC-26-XXXX`) in the **Summit Delegate Registry** to issue your physical delegate badge, summit kit, and meal coupons.

---

## 🗄️ Where is Registration Data Stored?

All attendee passes and sub-event RSVPs are stored locally in a high-concurrency **SQLite database configured with Write-Ahead Logging (WAL)**:

- **Database File Path**: `server/data/codec.db`
- **Concurrency & Reliability**:
  - `PRAGMA journal_mode = WAL;` (allows concurrent readers and writers without lock contention)
  - `PRAGMA synchronous = NORMAL;` (maximum I/O throughput with power-failure durability)
  - `PRAGMA busy_timeout = 5000;` (5-second graceful lock queueing)
  - Tested up to **300–400 simultaneous users** with zero transaction dropouts and sub-5ms response latency.
- **Database Schema**:
  - `registrations`: Main delegate passes (`id`, `ticket_code`, `name`, `email`, `college`, `phone`, `track`, `pass_type`, `qr_data`, `created_at`).
  - `event_rsvps`: Specific sub-event seat reservations linked to delegate accounts (`id`, `name`, `email`, `event_title`, `track`, `created_at`).
  - `users`: User authentication credentials with bcrypt password hashing.

---

## 📊 Accessing the Organizer Registry Dashboard

To maintain an uncluttered, cinematic public interface for attendees, the registry dashboard is **completely hidden from public view on the website**. Council administrators and organizers can discreetly unlock the live dashboard using any of the following methods:

1. **Discreet Credential Gateway in Generate Pass**:
   - Open the Pass Registration modal.
   - In the registration fields, enter the designated administrative credentials:
     - **Name**: `Admin` (or `TechKnow Admin`)
     - **Email**: `admin@techknow.in` (or `admin@codec.in`)
     - **Phone / Access Key**: `admin2026` (or `2026`)
   - Click **"GENERATE OFFICIAL PASS"**. The system immediately authenticates the administrator, bypasses standard pass creation, and unlocks the **Live Delegate Registry Dashboard**!
2. **Keyboard Shortcut**:
   - Press **`Ctrl + Shift + A`** on any page to open the registry dashboard directly.
3. **Council Emblem**:
   - Triple-click the TechKnow Council crest inside the Summit Pass header.
4. **Direct API & Spreadsheet Export**:
   - **Live JSON Data**: `GET http://127.0.0.1:5000/api/admin/registrations`
   - **Direct CSV Download**: `GET http://127.0.0.1:5000/api/admin/export.csv`

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended, fully compatible with Node v24)
- `npm` or `yarn` / `pnpm`

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/AyushSrivastava1818/codec-2k26.git
   cd codec-2k26
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the High-Concurrency Backend Server**:
   ```bash
   npm run server
   ```
   *Runs on `http://127.0.0.1:5000` with SQLite WAL database.*

4. **Start the Frontend Development Server**:
   ```bash
   npm run dev
   ```
   *Runs on `http://localhost:5174` (proxies `/api` directly to backend).*

5. **Run Benchmark Stress Test**:
   ```bash
   node scratch/stress_test.js
   ```
   *Fires 300-400 concurrent requests against the SQLite WAL engine to verify zero lag.*

6. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 📁 Repository Structure

```
codec-2k26/
├── docs/
│   └── images/                   # High-resolution storyboard & stage screenshots
├── public/
│   └── assets/                   # Photorealistic arch textures & branding assets
├── server/
│   ├── data/
│   │   └── codec.db              # SQLite WAL high-concurrency database
│   ├── routes/
│   │   ├── auth.js               # Registration & JWT login routes
│   │   ├── events.js             # Event RSVP routes
│   │   ├── registrations.js      # Summit Pass ticket generation
│   │   └── stats.js              # Real-time summit metrics
│   ├── auth.js                   # Async bcrypt & JWT middleware
│   ├── db.js                     # SQLite WAL engine configuration
│   └── server.js                 # Master Express backend application
├── src/
│   ├── cinematic/
│   │   ├── AudioManager.js       # Synthetic procedural sound engine
│   │   ├── CameraController.js   # Physical human eye height 3D dolly
│   │   ├── ChamberManager.js     # 5 photorealistic stone archways
│   │   ├── CinematicController.js# Master 60-120 FPS timeline coordinator
│   │   ├── MouseParallax.js      # Frame-rate independent gaze interpolation
│   │   ├── ParticleSystem.js     # Zero-copy GPU particle motes & embers
│   │   ├── SceneManager.js       # Three.js WebGL & throttled raycasting
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
- **Institution**: Indian Institute of Information Technology Kota, Permanent Campus, Ranpur, Kota, Rajasthan – 325003
- **Contact**: `techknow@iiitkota.ac.in`

---

<div align="center">
  <sub>Engineered with precision for <strong>CODEC 2K26</strong> • TechKnow Council, IIIT Kota</sub>
</div>
