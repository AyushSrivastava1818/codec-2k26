<div align="center">

  <img src="public/assets/techknow_logo.png" alt="TechKnow Council IIIT Kota" width="100" height="100" />

  # CODEC 2K26
  ### Flagship Cyber-Gothic Technical Summit &bull; IIIT Kota
  **Curated & Engineered by TechKnow Council**

  <p align="center">
    <a href="https://github.com/AyushSrivastava1818/codec-2k26"><img src="https://img.shields.io/badge/Summit-CODEC%202K26-ff6a00?style=for-the-badge&logo=shield" alt="Summit" /></a>
    <a href="https://iiitkota.ac.in/"><img src="https://img.shields.io/badge/Institute-IIIT%20Kota-f59e0b?style=for-the-badge&logo=mortarboard" alt="IIIT Kota" /></a>
    <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Backend-Node.js%20Express-339933?style=for-the-badge&logo=node.js" alt="Node.js" /></a>
    <a href="https://www.sqlite.org/wal.html"><img src="https://img.shields.io/badge/Database-SQLite%20WAL-003B57?style=for-the-badge&logo=sqlite" alt="SQLite WAL" /></a>
    <a href="https://threejs.org/"><img src="https://img.shields.io/badge/Engine-Three.js%20WebGL-000000?style=for-the-badge&logo=three.js" alt="Three.js" /></a>
    <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Bundler-Vite%208-646CFF?style=for-the-badge&logo=vite" alt="Vite" /></a>
  </p>

  <p>
    An interactive 3D WebGL dark-fantasy summit experience featuring procedural Web Audio, interactive chamber navigation, and a high-throughput SQLite attendee registration & verifiable digital pass portal.
  </p>

</div>

---

## 🌟 Overview

**CODEC 2K26** is the flagship annual technical summit of the **Indian Institute of Information Technology Kota (IIIT Kota)**, organized by the **TechKnow Council**.

The platform is designed to provide delegates with an unforgettable gothic cyber-mansion narrative:
- **Centered HUD Navigation**: A 3-column CSS Grid navbar that stays centered at the top of the viewport.
- **Scroll-Driven 3D Journey**: Navigate from the haunted mansion exterior through the gates and into the Central Rotunda to explore summit chambers.
- **Unified `MY PASS` Portal**: A single entry point for delegates to view verified digital passes, look up existing tickets by code/email, or create new registrations.
- **Procedural Web Audio Engine**: Synthesizes an authentic celesta rendition of *Hedwig's Theme* in 3/4 waltz time alongside atmospheric soundscapes without external audio files.
- **High-Throughput Backend**: Powered by Node.js Express and SQLite in WAL mode with sub-5ms response times.

---

## 🏰 Summit Chambers & Competition Arenas

| Chamber | Track / Competition | Format | Key Competencies |
|:---:|:---|:---:|:---|
| **Chamber 00** | **About & Archival Vault** | Interactive Exhibit | Fest Vision, Council Charter & Historical Milestones |
| **Chamber 01** | **Events & Arena** | Competitive Rounds | Speed DSA Knockout, RoboWars Combat Gladiator & Security CTF |
| **Chamber 02** | **TechKnow Presents HACKODEC** | 12-Hour National Sprint | AI/ML, Scalable Software, Web3 & Open Innovation (Solo or 4-Member Squad) |
| **Chamber 03** | **Schedule & Chrono Timeline** | 3-Day Technical Roster | Keynote Addresses, Coding Rounds & Technical Workshops |
| **Chamber 04** | **Prizes & Honors** | Ceremonial Podium | Cash Rewards, Medals, Crests & Sponsored Swag |

---

## 📋 Delegate Registration & Pass Lifecycle

The platform features a multi-tiered attendee management pipeline:

```
                            +-------------------------------+
                            |    Delegate Visits Summit     |
                            +---------------+---------------+
                                            |
                                            v
                                  [ Click "MY PASS" ]
                                            |
                    +-----------------------+-----------------------+
                    |                                               |
         [ Has Existing Pass ]                           [ New Registration ]
                    |                                               |
                    v                                               v
        +-----------------------+                       +-----------------------+
        | Digital Pass Display  |                       | Multi-Mode Modal:     |
        | • Ticket ID (CODEC-*) |                       | • Solo Delegate Pass  |
        | • QR Authenticity     |                       | • 4-Member Squad Form |
        | • Squad Roster (4p)   |                       +-----------+-----------+
        | • 1-Click Ticket Copy |                                   |
        +-----------+-----------+                                   v
                    |                                   +-----------------------+
                    +---[ Register New Pass ]---------->| Instant Verification  |
                                                        | & Pass Issued via WAL |
                                                        +-----------------------+
```

### Key Pass Features:
1. **Solo Delegate Pass**: Register for general admission, keynotes, workshops, and competitive tracks.
2. **4-Member Squad (HACKODEC)**: Dedicated team registration collecting Team Leader credentials, squad name, and full 4-member details with verified student IDs.
3. **Reopen Actual Pass**: Look up any previously issued pass by ticket code (e.g. `CODEC-26-XXXX`) or registered email.
4. **Offline Venue Verification**: Each ticket contains unique cryptographic ticket codes and status indicators for desk check-ins.

---

## 🏛️ System Architecture

```
                                  +---------------------------------------+
                                  |            DELEGATE CLIENT            |
                                  |  (Three.js WebGL • Procedural Audio)  |
                                  +-------------------+-------------------+
                                                      |
                                          HTTP / REST JSON (Port 5174)
                                                      |
                                                      v
                                  +---------------------------------------+
                                  |           VITE REVERSE PROXY          |
                                  |       Target: http://127.0.0.1:5000   |
                                  +-------------------+-------------------+
                                                      |
                                                      v
                                  +---------------------------------------+
                                  |          EXPRESS 4 REST API           |
                                  |  • Rate Limiting & Validation         |
                                  |  • JWT Authentication & Crypto Hashing|
                                  +-------------------+-------------------+
                                                      |
                                                      v
                                  +---------------------------------------+
                                  |     HIGH-CONCURRENCY SQLITE ENGINE    |
                                  |  • PRAGMA journal_mode = WAL          |
                                  |  • PRAGMA synchronous = NORMAL        |
                                  |  • PRAGMA busy_timeout = 5000         |
                                  |  • Prepared Statements (better-sqlite3)|
                                  +---------------------------------------+
```

---

## 🎧 Procedural Web Audio Engine

CODEC 2K26 features a custom, zero-dependency Web Audio API synthesis engine built in [src/cinematic/AudioManager.js](src/cinematic/AudioManager.js):
- **Hedwig's Theme Celesta Simulation**: Programmed in authentic 3/4 waltz meter using stacked oscillators to recreate wooden resonance and bell partials.
- **Ambient Mansion Resonance**: Subterranean sub-bass drone modulated by a 7-second respiratory low-frequency oscillator (LFO).
- **Physical Foley Sound FX**: Procedural lightning thunder, heavy iron gate creaking, spatial portal whooshes, and tactile UI click feedback.

---

## 📡 Backend API Reference

All backend routes are served from `http://127.0.0.1:5000/api` and proxied through Vite on port `5174`:

| Method | Endpoint | Description |
|:---|:---|:---|
| `GET` | `/api/health` | Health check endpoint and database operational status |
| `GET` | `/api/stats` | Real-time aggregate attendee, squad, and RSVP counts |
| `POST` | `/api/registrations` | Create solo delegate registration and issue digital pass |
| `POST` | `/api/registrations/hackathon-team` | Register 4-member squad for HACKODEC with leader + member roster |
| `GET` | `/api/registrations/lookup` | Query and retrieve pass by ticket code or registered email |
| `GET` | `/api/registrations/verify/:ticketCode` | Verify ticket authenticity for entry desk validation |
| `POST` | `/api/events/batch-rsvp` | Multi-track RSVP enrollment for confirmed attendees |
| `GET` | `/api/events/my?email=...` | Retrieve all active event reservations for a delegate |
| `GET` | `/api/admin/registrations` | Retrieve full attendee database & track breakdown |
| `GET` | `/api/admin/export.csv` | Export complete database into CSV for event operations |

---

## 🛠️ Local Development & Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended, fully tested on Node v20/v22/v24)
- `npm` or `yarn` / `pnpm`
- Modern WebGL-capable browser (Chrome, Edge, Firefox, Safari)

### Quick Start

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/AyushSrivastava1818/codec-2k26.git
   cd codec-2k26
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start the Backend API Server**:
   ```bash
   npm run server
   # Runs Express server on http://127.0.0.1:5000
   ```

4. **Launch the Frontend Client** (in a separate terminal):
   ```bash
   npm run dev
   # Runs Vite client on http://localhost:5174
   ```

5. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 🧪 Verification & Audit Report

- **Zero Console Errors**: Confirmed via headless browser with clean runtime execution.
- **10/10 Endpoints Passing**: 100% pass rate in automated health, registration, lookup, RSVP, and admin export test suites.
- **Centered HUD Navigation**: 3-column CSS Grid guarantees horizontal centering across desktop viewports.
- **SQLite Concurrency**: WAL mode enabled with zero dropped locks under simulated stress testing.

---

## 📄 License

Distributed under the **MIT License**. Engineered for the students and developers of **IIIT Kota**.

&copy; 2026 **TechKnow Council &bull; IIIT Kota**. All rights reserved.
