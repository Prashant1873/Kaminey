# Technology Stack

**Analysis Date:** 2026-10-08

## Languages

**Primary:**
- JavaScript (ES2022+ / JSX) - Used across all application logic, React components, and networking modules in `src/`.
- CSS3 / Vanilla CSS Custom Properties - Used in `src/index.css` for the complete design token system, Apple glassmorphism tokens, and theme definitions.
- HTML5 - Used in `index.html` as the single-page application host container and viewport configuration.

**Secondary:**
- TypeScript Type Definitions - `@types/react` (`^18.3.18`), `@types/react-dom` (`^18.3.5`) for IDE intellisense and React typing.

## Runtime

**Environment:**
- Node.js `20.x` (supported Node.js 18+)
- Browser Runtime: Evergreen modern browsers (Chrome/Edge, Safari iOS 15+, Firefox) with WebRTC and Web Audio API support.

**Package Manager:**
- npm `10.x`
- Lockfile: `package-lock.json` present (`v3` lockfile format)

## Frameworks

**Core:**
- React `18.3.1` (`react`, `react-dom`) - Component hierarchy, local UI states, context providers, and hooks (`src/main.jsx`, `src/App.jsx`).

**Testing & Auditing:**
- Playwright `1.63.0` (`playwright`) - Headless Chromium automation for visual regression, accessibility, and layout audits (`scripts/audit_scan.mjs`).

**Build/Dev:**
- Vite `6.2.0` (`vite`) - ESM development server and Rollup-based production bundler (`vite.config.js`).
- `@vitejs/plugin-react` `4.3.4` - React Fast Refresh and Babel/JSX compilation transform.

## Key Dependencies

**Critical:**
- `peerjs` (`^1.5.4`) - WebRTC wrapper enabling serverless peer-to-peer data channels between Host and Player smartphone controllers (`src/network/peerManager.js`).
- `qrcode` (`^1.5.4`) - Client-side canvas rendering of high-contrast room join QR codes (`src/components/common/QRCodeView.jsx`).
- `lucide-react` (`^1.16.0`) - Minimalist SVG icon set replacing all emojis per the Apple Minimal Haveli design principles (`DESIGN.md`).
- `canvas-confetti` (`^1.9.4`) - Particle confetti celebration on victory and exile reveals (`src/components/host/HostGameOver.jsx`, `src/components/host/HostExile.jsx`).

**Infrastructure:**
- Web Audio API (Native browser API) - Zero-asset procedural synthesizer creating dramatic palace gongs, heartbeats, gavel strikes, and stingers (`src/audio/soundEffects.js`).
- HTML5 Canvas API (Native browser API) - Procedural psychedelic visualizer and interactive party canvas (`src/components/common/TrippyVisualizer.jsx`).

## Configuration

**Environment:**
- Client-side static architecture: zero build-time `.env` secrets required.
- STUN server endpoints: Google public STUN relays (`stun:stun.l.google.com:19302`, `stun1` through `stun4`) hardcoded in `src/network/peerManager.js`.
- PeerJS public cloud signaling: connects to default PeerJS broker (`0.peerjs.com`) with namespace prefix `kaminey-v2-`.

**Build:**
- `vite.config.js` - Configures React plugin, base path `./` for relative asset loading, and dev server port `3000`.
- GitHub Actions CI/CD: `.github/workflows/deploy.yml` triggers automated build on push to `main`/`master` and deploys static bundle (`dist/`) to GitHub Pages.

## Platform Requirements

**Development:**
- Node.js 18.0.0+
- Modern desktop browser for host view (`http://localhost:3000/#/host`).
- Local Wi-Fi network or ngrok/tunnels for testing mobile controller connectivity.

**Production:**
- Static web hosting (GitHub Pages, Vercel, Cloudflare Pages, or Netlify).
- Zero database or server runtime required.
- HTTPS required in production for WebRTC and Vibration API permissions.

---

*Stack analysis: 2026-10-08*
