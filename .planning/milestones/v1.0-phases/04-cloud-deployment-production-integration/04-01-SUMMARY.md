---
phase: 04-cloud-deployment-production-integration
plan: 01
subsystem: deployment
tags: [render, docker, procfile, env, config]
provides:
  - Render blueprint specification in server/render.yaml
  - Lightweight Alpine Node 20 container in server/Dockerfile
  - Procfile in server/Procfile for Railway/Heroku
  - Environment variable templates in server/.env.example and .env.example
  - Smart static hosting fallback in src/network/config.js
affects:
  - server/render.yaml
  - server/Dockerfile
  - server/Procfile
  - server/.env.example
  - .env.example
  - src/network/config.js
tech-stack:
  added: [Docker, Render Blueprint, Procfile]
  patterns: [multi-cloud packaging, environment-aware endpoint resolution]
key-files:
  created:
    - server/render.yaml
    - server/Dockerfile
    - server/Procfile
    - server/.env.example
    - .env.example
  modified:
    - src/network/config.js
completed: 2026-10-08
status: complete
---

# Plan 04-01 Summary: Cloud Deployment Profiles & Client Endpoint Resolution

Created cloud PaaS deployment specifications for the dedicated Node.js signaling/relay server and configured client environment resolution with automatic fallback on GitHub Pages.

## Accomplishments
- Created `server/render.yaml` defining a free-tier web service blueprint with health check (`/health`), automatic restart, and environment variables.
- Created `server/Dockerfile` using `node:20-alpine` with production dependency pruning (`npm ci --omit=dev`) for Railway, Fly.io, or any container host.
- Added `server/Procfile` (`web: npm start`) and environment variable documentation in `server/.env.example` and root `.env.example`.
- Updated `src/network/config.js` to automatically route static hosting domains (`*.github.io`, `*.vercel.app`, `*.netlify.app`) to the production cloud relay (`DEFAULT_PRODUCTION_WS_URL`) rather than failing on non-existent CDN ports.

## Next Plan Readiness
Ready for Plan 04-02 (End-to-End Cellular Simulation & Production Verification).
