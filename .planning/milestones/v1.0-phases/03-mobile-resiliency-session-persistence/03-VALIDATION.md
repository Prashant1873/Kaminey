---
phase: 3
slug: mobile-resiliency-session-persistence
status: passed
nyquist_compliant: true
wave_0_complete: true
created: 2026-10-08
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Node.js built-in test runner (`node --test`) & Vite build |
| **Config file** | `package.json` |
| **Quick run command** | `node --test test/resilience.test.js` |
| **Full suite command** | `npm test && npm run build` |
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
| 3-01-01 | 01 | 1 | RESILIENCE-01 | T-3-01 | Waking mobile screen tests socket liveness and auto-reconnects | unit | `node --test test/resilience.test.js` | ✅ yes | ✅ green |
| 3-01-02 | 01 | 1 | RESILIENCE-03 | T-3-02 | Bridge issues REQUEST_STATE_SYNC and updates game state | unit/integration | `node --test test/resilience.test.js` | ✅ yes | ✅ green |
| 3-02-01 | 02 | 2 | RESILIENCE-02 | T-3-03 | Disconnected player held in grace period before eviction | unit | `node --test test/resilience.test.js` | ✅ yes | ✅ green |
| 3-02-02 | 02 | 2 | RESILIENCE-04 | T-3-04 | Host and player UI render real-time connection badges | integration/build | `npm run build` | ✅ yes | ✅ green |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [x] `test/resilience.test.js` — test suite exercising wakeup hooks, state sync requests, and grace period countdown

---

## Validation Sign-Off

- [x] All tasks have automated verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers test suite
- [x] No watch-mode flags
- [x] Feedback latency < 5s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved 2026-10-08
