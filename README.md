# 🎭 Kaminey - Social Deduction Party Game

A mobile-first multiplayer social deduction game inspired by *The Traitors* and *Among Us*, set in a suspenseful royal haveli theme. Built for living rooms with a TV "Base Station" host display and private smartphone controllers.

---

## 🌟 How the Game Works

### 1. Living Room Base Station (TV / Laptop / Tablet)
- **High-Visibility Lobby**: Features a massive 3.5rem+ room code and 220px high-contrast QR code canvas for effortless phone scanning across the room.
- **Instant Auto-Fill Bots**: Host can tap to inject local test bots (Sher, Bhalu, Lomdi, etc.) to immediately test or fill vacant seats.
- **Procedural Haveli Sound Engine**: Synthesizes suspense drones, atmospheric midnight hums, clock ticks, and resonant temple bell gongs using native Web Audio API - zero external audio assets required.
- **Host-Authoritative Game Loop**: Manages discussion phases, secret voting countdowns, vote-card reveals, exile verdicts, and win-condition checks.

### 2. Mobile Controller View (Smartphones)
- **Zero App Installs**: Players join in mobile Safari or Chrome by scanning the QR code or visiting the URL.
- **Indian Wildlife Personas**: Choose from iconic animal avatars (Sher 🦁, Bhalu 🐻, Bhediya 🐺, Lomdi 🦊, Bagh 🐯, Haathi 🐘, Saanp 🐍, Ullu 🦉, etc.) encased in frosted glass squircles.
- **Tactile 3D Role Reveal**: Press-and-hold wax seal to privately unseal and peek at your secret identity without revealing it to adjacent players, complete with haptic vibration feedback.
- **Kaminey (Traitors) Night Conclave**: Secret synchronized channel for traitors to whisper and reach consensus on midnight assassinations.
- **Bhole (Innocents)**: Deduce traitors through daytime debate, behavior tracking, and voting trials.
- **Party Dares & Distractions**: Secret side tasks (e.g. yawning contagion, unprompted tea serving) to sow chaos and grant traitors conversational cover.
- **Secret Mobile Ballot**: Encrypted voting drawer with confirmation safeguards.
- **Ghost Spectator Mode**: Eliminated players watch the drama unfold and send floating emoji reactions to the main screen.

---

## 💎 Design & Architecture

- **Apple Dark Haveli Glassmorphism**: Tailored obsidian surfaces (`#070709`), frosted glass cards (`backdrop-blur-md`), hairline borders (`border-white/10`), and radiant accent glows.
- **WCAG AAA Touch Accessibility**: Every interactive element satisfies >=44px touch target guidelines with natural hover and active press scaling.
- **100% Free Peer-to-Peer Realtime Backend**: Powered by WebRTC via PeerJS and Google STUN relays. No paid servers, zero databases, and zero account logins.
- **Role Isolation & Anti-Cheat**: Roles and private assassination targets are routed strictly through direct, point-to-point WebRTC data channels. Public room broadcasts contain zero confidential role state.
- **Connection Heartbeat Watchdog**: Automatic keep-alive pings sent every 5 seconds to preserve socket connections during mobile browser sleep cycles.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or pnpm

### Local Development
```bash
# Clone repository
git clone https://github.com/Prashant1873/Kaminey.git
cd Kaminey

# Install dependencies
npm install

# Start Vite dev server with network host access
npm run dev -- --host
```

Open `http://localhost:5173` on your desktop/TV to host, and connect your phone using the local network IP or QR code.

### Production Build
```bash
npm run build
```
Generates optimized static assets in `dist/`.

---

## 🌐 Free GitHub Pages Deployment

The repository includes an automated GitHub Actions CI/CD workflow (`.github/workflows/deploy.yml`).

1. Push your commits to `main`:
   ```bash
   git push origin main
   ```
2. In your GitHub repository:
   - Navigate to **Settings** -> **Pages**.
   - Under **Build and deployment** -> **Source**, select **GitHub Actions**.
3. Every push to `main` automatically triggers the build, bundles static assets, and publishes to GitHub Pages at `https://<YOUR_USERNAME>.github.io/<REPO_NAME>/`.

---

## 🛠️ Tech Stack

- **Framework**: React 18, Vite
- **Styling**: Tailwind CSS, CSS Glassmorphism Tokens
- **Icons**: Lucide React
- **Audio**: Web Audio API (Procedural Synthesizer)
- **Networking**: WebRTC (PeerJS Cloud Relay)
- **Testing**: Playwright End-to-End & Audit Suite
