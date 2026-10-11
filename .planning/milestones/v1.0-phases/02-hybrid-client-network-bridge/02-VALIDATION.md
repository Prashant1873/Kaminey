---
phase: 2
slug: hybrid-client-network-bridge
status: draft
nyquist_compliant: true
wave_0_complete: false
created: 2026-10-08
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Node.js built-in test runner (`node --test`) & Vite build |
| **Config file** | `server/package.json` / `package.json` |
| **Quick run command** | `node --test test/*.test.js server/test/*.test.js` |
| **Full suite command** | `npm run test:server && npm run build` |
| **Estimated runtime** | ~3-4 seconds |

---

## Sampling Rate

- **After every task commit:** Run quick test suite
- **After every plan wave:** Run full suite command
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 2-01-01 | 01 | 1 | BRIDGE-01 | T-2-01 | WebRTC negotiation initiates with 4s race timer | unit | `node --test test/hybridBridge.test.js` | ✅ | ✅ green |
| 2-01-02 | 01 | 1 | BRIDGE-02 | T-2-02 | Automatic fallback to WebSocket relay upon timeout | unit/integration | `node --test test/hybridBridge.test.js` | ✅ | ✅ green |
| 2-02-01 | 02 | 2 | BRIDGE-03 | T-2-03 | Unified send API routes through active transport | integration | `node --test test/hybridBridge.test.js` | ✅ | ✅ green |
| 2-02-02 | 02 | 2 | BRIDGE-04 | T-2-04 | Monotonic sequence & dedup window prevents double action execution | unit | `node --test test/hybridBridge.test.js` | ✅ | ✅ green |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `test/hybridBridge.test.js` — test suite exercising bridge fallback, transport modes, and deduplication logic

---

## Validation Sign-Off

- [x] All tasks have automated verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers test suite
- [x] No watch-mode flags
- [x] Feedback latency < 5s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved 2026-10-08
