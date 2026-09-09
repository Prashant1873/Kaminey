# 🎭 Kaminey — The Traitors Social Deduction Game

A mobile-first multiplayer social deduction game inspired by *The Traitors* and *Among Us*, built with a living room "Base Station" host screen and private phone controllers.

---

## 🌟 How the Game Works

1. **Living Room Base Station (TV / Laptop / Tablet)**:
   - Placed in the hall or living room.
   - Generates a 6-character room code and dynamic QR code for easy phone scanning.
   - Host configures discussion timers (Among Us style), voting countdowns, Kaminey ratios, and party dares.
   - Displays atmospheric transitions (nightfall, haveli bell gong, morning announcements, vote reveal cards, and exile verdicts).
   - Includes procedural Web Audio sound synthesizer (no external audio assets needed).

2. **Mobile Player View (Phone)**:
   - Players join by scanning the QR code or entering the room code.
   - Pick an animal persona (Lion, Wolf, Fox, Tiger, Owl, Snake, Bear, Crow, etc.).
   - **Tactile Role Reveal**: Press & hold wax envelope to privately peek at role without neighbors seeing.
   - **Kaminey (Traitors)**: Secret night conclave on phone with target consensus.
   - **Bhole (Innocents)**: Oblivious to roles, trying to deduce who the traitors are.
   - **Party Dares & Distractions**: Random secret social tasks (e.g., getting someone to say 'Chai', fetching water without asking, yawning contagion) to distract players and create cover for the Kaminey.
   - **Secret Mobile Ballot**: Secure voting with confirmation drawer.
   - **Ghost Spectator Mode**: Eliminated players watch silently and send floating emoji reactions.

---

## 🔒 Anti-Cheat & Free Realtime Backend

- **100% Free**: Powered by WebRTC via PeerJS open cloud broker. Zero account setup, zero server costs.
- **Host-Authoritative**: The living room Host device acts as the true server in memory.
- **Role Isolation**: Public network broadcasts contain **zero** role data. Roles and assassination targets are routed strictly to individual devices via isolated private data channels.

---

## 🚀 Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev -- --host
```

---

## 🌐 Deploy to GitHub Pages (100% Free)

1. Create a new GitHub repository (e.g. `kaminey`).
2. Push this repository to GitHub:
   ```bash
   git remote add origin https://github.com/<YOUR_USERNAME>/<REPO_NAME>.git
   git branch -M main
   git push -u origin main
   ```
3. Go to your GitHub repository **Settings** -> **Pages**:
   - Under **Build and deployment** -> **Source**, select **GitHub Actions**.
4. The workflow in `.github/workflows/deploy.yml` will automatically build and deploy the game to `https://<YOUR_USERNAME>.github.io/<REPO_NAME>/`.
