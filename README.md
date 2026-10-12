# 🎭 Kaminey (कमीने) — Royal Haveli Social Deduction Party Game

[![Version](https://img.shields.io/badge/version-2.0.0-gold.svg)](https://github.com/Prashant1873/Kaminey)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Tests](https://img.shields.io/badge/tests-13%2F13%20passing-emerald.svg)](test)
[![Design](https://img.shields.io/badge/craft-Anti--Slop%20Design%20System-orange.svg)](src/styles/tokens.css)
[![Zero-Install](https://img.shields.io/badge/platform-Mobile%20Web%20(iOS%2FAndroid)-purple.svg)](#)

> **"In the royal chambers of the Haveli, trust is a luxury no one can afford."**

**Kaminey** is a mobile-first multiplayer social deduction game inspired by *The Traitors*, *Mafia*, and *Among Us*, set against a backdrop of royal Indian palace intrigue. Designed specifically for living rooms, the game runs across two interfaces:
1. **The Base Station (TV / Laptop / Tablet)**: Displays the grand public hall, live council debates, dramatic unmaskings, and ambient procedural music.
2. **Private Smartphone Controllers (Mobile Web)**: Each player connects instantly via QR code without installing any apps to receive private roles, vote secretly, and plot night assassinations.

---

## 🏛️ Living Room Architecture & Game Loop

```
               ┌──────────────────────────────────────────────────┐
               │         LIVING ROOM TV / BASE STATION            │
               │  • Giant 3.5rem Room Code & 220px QR Code        │
               │  • Web Audio Procedural Haveli Soundscape        │
               │  • Council Debates, Gavel Verdicts & Exile Dossier│
               └──────────────────────▲───────────────────────────┘
                                      │
                 ┌────────────────────┴────────────────────┐
                 │    HYBRID P2P + CELLULAR RELAY BRIDGE    │
                 │  • WebRTC DataChannel (Ultra-low latency)│
                 │  • WebSocket Server Relay (Cellular NAT)│
                 │  • Cryptographic Anti-Cheat Isolation   │
                 └────────────────────▲────────────────────┘
                                      │
          ┌───────────────────────────┼───────────────────────────┐
          │                           │                           │
┌─────────┴─────────┐       ┌─────────┴─────────┐       ┌─────────┴─────────┐
│  PHONE CONTROLLER │       │  PHONE CONTROLLER │       │  PHONE CONTROLLER │
│  Player 1 (Sher)  │       │ Player 2 (Bhalu)  │       │  Player 3 (Lomdi) │
│  • Wax-Seal Reveal│       │ • Cover Missions  │       │ • Hitlist Ballot  │
│  • Thumb Controls │       │ • Doherty Feedback│       │ • Ghost Reactions │
└───────────────────┘       └───────────────────┘       └───────────────────┘
```

---

## ✨ Key Features & Craft Innovations

### 1. 📱 Living Room Base Station (Public Screen)
- **High-Visibility Lobby**: 3.5rem high-contrast room code and 220px crisp QR code canvas engineered for effortless scanning from couches up to 15 feet away.
- **One-Click Auto-Fill Test Bots**: Host can instantly spawn realistic test bots (Sher 🦁, Bhalu 🐻, Lomdi 🦊, etc.) to test gameplay loops without needing a full room.
- **Procedural Haveli Sound Engine**: Synthesizes suspense drones, atmospheric midnight gongs, clock ticks, and temple bell strikes using native Web Audio API — **zero external audio file downloads**.
- **Host-Authoritative Game Loop**: Manages discussion phases, secret voting countdowns, vote-card reveals, exile verdicts, and win-condition checks.

### 2. 📲 Smartphone Private Controller
- **Zero App Installs**: Players join in mobile Safari or Chrome by scanning the QR code or visiting the URL.
- **Indian Wildlife Personas**: Choose from iconic animal avatars (Sher 🦁, Bhalu 🐻, Bhediya 🐺, Lomdi 🦊, Bagh 🐯, Haathi 🐘, Saanp 🐍, Ullu 🦉, etc.) encased in frosted glass squircles.
- **Tactile 3D Role Reveal**: Press-and-hold wax seal to privately unseal and peek at your secret identity without revealing it to adjacent players, complete with haptic vibration feedback.
- **Cover Missions & Distractions**: Secret side tasks (e.g., yawning contagion, unprompted tea serving) to sow chaos and grant traitors conversational cover.
- **Secret Mobile Ballot**: Bottom-anchored thumb drawer with Fitts's Law 48px+ touch targets and Doherty <400ms optimistic feedback.
- **Ghost Spectator Mode**: Eliminated players watch the drama unfold and send floating emoji reactions to the main screen.

### 3. 🛡️ Robust Hybrid Networking
- **Automatic Multi-Transport Bridge**: First attempts point-to-point WebRTC via PeerJS and Google STUN relays. If cellular carrier CGNAT or firewall blocks P2P, silently switches to lightweight WebSocket server relay without interrupting gameplay.
- **Strict Role Isolation & Anti-Cheat**: Secret roles and assassination targets are routed strictly through direct, private channels. Public room broadcasts contain zero confidential role state.
- **Deduplication & Session Persistence**: Sliding window cache prevents duplicate message handling, while reconnection grace periods preserve player states across mobile screen sleep/wake cycles.

### 4. 🎨 Anti-Slop Design System (Milestone v2.0)
- **Royal Indian Haveli Palette**: Built on curated luxury tokens (`--primary`: Imperial Marigold Gold, `--loss`: Palace Terracotta Crimson, `--gain`: Peacock Emerald, `--surface`: Midnight Onyx with amber undertones).
- **Sub-Pixel Optical Centering**: Interactive icons offset by `translateY(-0.5px)` relative to font cap-height to eliminate visual top-heaviness.
- **Concentric Corner Radii**: Formula $r_{inner} = \max(0, r_{outer} - \text{padding})$ guarantees concentric harmony and prevents corner pinching across nested cards.
- **Apple Fluid Spring Motion Physics**: Critically damped settling (`damping: 1.0`, zero bounce) on dialogs and drawers; underdamped momentum springs on card gestures; 100% interruptible transitions via WAAPI.
- **Coordinated Atomic Skeleton Loading**: Full synchronized skeleton states guarantee layout shift score is strictly 0 (**CLS = 0**) during room connection and phase changes.

---

## 📜 How to Play

### The Factions
- **Bhole (The Innocents 🛡️)**: The faithful courtiers of the Haveli. They do not know who anyone is. Their goal is to identify and banish all Kaminey through daytime debate and council voting.
- **Kaminey (The Traitors 🗡️)**: Secret conspirators planted within the Haveli. They know each other's identities. Each night during the cover mission, they coordinate to mark a Bhola for assassination while pretending to read tasks on their phones.

### Game Sequence
1. **Dawn (Night Casualty)**: The room wakes to discover who was eliminated by the Kaminey during the night.
2. **Daytime Conclave (Debate)**: Living room debate where players question alibis, discuss suspicious mannerisms, and build coalitions.
3. **Council Ballot (Voting)**: Players cast secret votes on their phones to exile a suspect or skip.
4. **Council Verdict (Unmasking)**: The main TV dramatically reveals whether the exiled suspect was a Bhola or a Kamina.
5. **Night Conclave (Cover Mission)**: All players receive a distraction task on their phones. While everyone looks at their screens, the Kaminey mark their midnight victim.
6. **Victory Condition**:
   - **Bhole Win**: All Kaminey have been successfully exiled.
   - **Kaminey Win**: Traitors equal or outnumber the surviving Bhole.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or pnpm

### Local Development
```bash
# 1. Clone repository
git clone https://github.com/Prashant1873/Kaminey.git
cd Kaminey

# 2. Install dependencies
npm install

# 3. Start dev server and relay bridge
npm run dev -- --host
```

Open `http://localhost:5173` on your desktop/TV to host, and connect your phone using the local network IP or QR code.

### Running Relay Server
To host games across different cellular networks or outside local Wi-Fi:
```bash
# Start standalone WebSocket relay server (Port 8080)
npm run server
```

### Automated Testing
```bash
# Run server integration and hybrid bridge tests
npm test
```

### Production Build
```bash
# Compile optimized static bundle
npm run build
```
Generates production assets into `dist/`.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | React 18, Vite |
| **Styling & Design System** | Royal Haveli CSS Tokens, Glassmorphism, Concentric Radii |
| **Motion Physics** | Web Animations API (WAAPI), Apple Fluid Springs |
| **Networking & Realtime** | WebRTC (PeerJS), WebSocket (`ws`), Cellular NAT Relay |
| **Audio Synthesis** | Web Audio API (Native Procedural Sound Engine) |
| **Icons & Visuals** | Lucide React, Canvas Confetti, SVG Animal Avatars |
| **Testing** | Node.js Test Runner, End-to-End Hybrid Bridge Simulation |

---

## 📄 License

MIT License. Designed with craft and passion for social gaming.

