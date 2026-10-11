# Phase 4: Cloud Deployment & Production Integration - Research

**Researched:** 2026-10-08
**Domain:** Cloud PaaS (Render, Railway, Fly.io, Docker), Vite Production Configuration & Cellular Simulation
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

1. Free-tier cloud hosting preferred for relay server (Render free tier / Railway / Fly.io).
2. GitHub Pages static frontend hosting must cleanly interface with production backend.
3. Zero breaking changes to existing local development workflow (`npm run dev` and `npm run server`).
</user_constraints>

<architectural_responsibility_map>
## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Cloud Web Service | Render / Railway (`server/render.yaml`, `Dockerfile`) | Local node runner | Host-authoritative lightweight Node.js/ws server with automatic restart and health probes. |
| Production Endpoint Resolution | Client Config (`src/network/config.js`) | Vite env (`.env.production`) | Resolves `VITE_WS_SERVER_URL` in production, with fallback to default cloud relay for GitHub Pages (`github.io`). |
| Container Packaging | Docker (`server/Dockerfile`) | Procfile (`server/Procfile`) | Enables multi-cloud portability across Docker-native and Buildpack platforms. |
| E2E Cellular Simulation | Automated Test (`test/e2e-cellular.test.js`) | Test Runner (`npm test`) | Validates full game cycle under symmetric NAT / cellular relay conditions with sleep/wake cycles. |
</architectural_responsibility_map>

<research_summary>
## Summary

Phase 4 packages the Kaminey signaling and fallback relay server for production deployment and links it with the GitHub Pages static client build.

### 1. Cloud Hosting Platforms
- **Render.com:** Native support for WebSockets on free-tier web services, exposes `PORT` environment variable (typically `10000`), supports Infrastructure-as-Code via `render.yaml`.
- **Railway.app / Fly.io:** Support Dockerfile deployment out of the box. A lean multi-stage `alpine` Dockerfile enables 1-click deployment.
- **Heroku / PaaS:** Supports `Procfile` (`web: npm start`).

### 2. Vite Environment Variables & GitHub Pages
In Vite, environment variables prefixed with `VITE_` are embedded into the client bundle at build time:
- In local development: `import.meta.env.VITE_WS_SERVER_URL` can be omitted, defaulting to `ws://${hostname}:3001` (handling localhost or local Wi-Fi IP).
- In production build: `VITE_WS_SERVER_URL` points to `wss://<cloud-app-name>.onrender.com`.
- On GitHub Pages (`*.github.io`): If `VITE_WS_SERVER_URL` was not supplied during build, `src/network/config.js` should automatically fall back to the designated production cloud URL rather than trying to connect to port 3001 on the static GitHub CDN domain.

### 3. End-to-End Cellular Simulation
Testing mobile connections on cellular networks requires verifying:
1. P2P DataChannel ICE candidates fail or time out (simulating Carrier-Grade NAT).
2. Dual-transport bridge cleanly establishes `WS_RELAY` mode.
3. Multi-player gameplay progression (join -> role reveal -> night vote -> discussion -> exile ballot) completes smoothly.
4. Mobile sleep/wake cycle (`REQUEST_STATE_SYNC`) refreshes state without room desynchronization.
</research_summary>

<standard_stack>
## Standard Stack

| Tool / Config | Version / Spec | Purpose |
|---------------|----------------|---------|
| `render.yaml` | Render Blueprint Spec v1 | Automated 1-click deploy to Render web service |
| `Dockerfile` | Node 20 Alpine | Lightweight container packaging (<120MB) |
| `Procfile` | Foreman / Heroku Spec | Buildpack process declaration (`web: npm start`) |
| `dotenv` | 16.4.5 | Local environment variable loading |
| Node Test Runner | Node 20+ built-in | End-to-end cellular simulation suite |
</standard_stack>
