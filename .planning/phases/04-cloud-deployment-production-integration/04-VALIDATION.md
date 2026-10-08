---
phase: 4
slug: cloud-deployment-production-integration
status: draft
nyquist_compliant: true
wave_0_complete: false
created: 2026-10-08
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Node.js built-in test runner (`node --test`) & Vite build |
| **Config file** | `package.json` |
| **Quick run command** | `node --test test/e2e-cellular.test.js` |
| **Full suite command** | `npm test && npm run build` |
| **Estimated runtime** | ~4-5 seconds |

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
| 4-01-01 | 01 | 1 | DEPLOY-01 | T-4-01 | Cloud configuration files exist and validate syntax | syntax/lint | `node -c server/server.js` | ❌ W0 | ⬜ pending |
| 4-01-02 | 01 | 1 | DEPLOY-02 | T-4-02 | Config resolves production cloud URL on GitHub Pages domain | unit | `npm run build` | ❌ W0 | ⬜ pending |
| 4-02-01 | 02 | 2 | DEPLOY-03 | T-4-03 | Full game cycle succeeds over simulated cellular relay | integration | `node --test test/e2e-cellular.test.js` | ❌ W0 | ⬜ pending |
| 4-02-02 | 02 | 2 | DEPLOY-03 | T-4-04 | Screen sleep/wake simulation maintains session continuity | integration | `node --test test/e2e-cellular.test.js` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `test/e2e-cellular.test.js` — test suite simulating multi-phone cellular network relay, voting, and sleep/wake resync

---

## Validation Sign-Off

- [x] All tasks have automated verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers test suite
- [x] No watch-mode flags
- [x] Feedback latency < 5s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved 2026-10-08
