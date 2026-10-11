---
phase: 1
slug: dedicated-node-js-websocket-signaling-relay-server
status: draft
nyquist_compliant: true
wave_0_complete: false
created: 2026-10-08
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Node.js built-in test runner (`node --test`) |
| **Config file** | `server/package.json` |
| **Quick run command** | `node --test server/test/*.test.js` |
| **Full suite command** | `node --test server/test/*.test.js` |
| **Estimated runtime** | ~1-2 seconds |

---

## Sampling Rate

- **After every task commit:** Run `node --test server/test/*.test.js`
- **After every plan wave:** Run `node --test server/test/*.test.js`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 1-01-01 | 01 | 1 | SERVER-04 | T-1-01 | Rejects malformed JSON and answers `/health` | unit/integration | `node --test server/test/server.test.js` | ✅ | ✅ green |
| 1-01-02 | 01 | 1 | SERVER-01 | T-1-02 | Room creation and joining validates 6-char room code | integration | `node --test server/test/server.test.js` | ✅ | ✅ green |
| 1-01-03 | 01 | 1 | SERVER-02 | T-1-03 | WebRTC signal routing delivered only to intended peer | integration | `node --test server/test/server.test.js` | ✅ | ✅ green |
| 1-02-01 | 02 | 2 | SERVER-03 | T-1-04 | Fallback relay routes application payloads | integration | `node --test server/test/server.test.js` | ✅ | ✅ green |
| 1-02-02 | 02 | 2 | SERVER-04 | T-1-05 | Heartbeat ping cleans inactive rooms | integration | `node --test server/test/server.test.js` | ✅ | ✅ green |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `server/package.json` — defines `test` script using `node --test`
- [ ] `server/test/server.test.js` — test suite exercising WebSocket actions and HTTP `/health`

---

## Validation Sign-Off

- [x] All tasks have automated verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all test files
- [x] No watch-mode flags
- [x] Feedback latency < 5s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved 2026-10-08
