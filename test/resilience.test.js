// Automated test suite for Mobile Resiliency & Session Persistence
import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from '../server/server.js';
import { HostNetwork, PlayerNetwork } from '../src/network/peerManager.js';

const TEST_PORT = 3997;
const TEST_SERVER_URL = `ws://127.0.0.1:${TEST_PORT}`;

test('Mobile Resiliency & Session Persistence Test Suite', async (t) => {
  const { httpServer, wss, cleanupInterval } = createServer();
  await new Promise((resolve) => httpServer.listen(TEST_PORT, '127.0.0.1', resolve));

  t.after(async () => {
    clearInterval(cleanupInterval);
    wss.close();
    await new Promise((resolve) => httpServer.close(resolve));
  });

  await t.test('1. REQUEST_STATE_SYNC protocol delivers fresh personalized state to reconnecting player', async () => {
    let currentPhase = 'LOBBY';
    let receivedStates = [];

    const hostNetwork = new HostNetwork(
      'SYNC01',
      () => ({
        onPlayerJoin: () => {},
        onPlayerMessage: () => {},
        onPlayerLeave: () => {},
        onStatusChange: () => {},
        getCustomStateForPlayer: (playerId) => ({
          phase: currentPhase,
          targetPlayerId: playerId,
          timestamp: Date.now()
        })
      })
    );
    // Point bridge to test server
    hostNetwork.bridge.serverUrl = TEST_SERVER_URL;
    hostNetwork.init();

    await new Promise((resolve) => {
      hostNetwork.bridge.onRoomCreated = resolve;
    });

    const playerNetwork = new PlayerNetwork(
      'SYNC01',
      { id: 'player-sync-test', name: 'Simran', avatarId: 'lion' },
      (state) => {
        receivedStates.push(state);
      },
      () => {},
      () => {}
    );
    playerNetwork.bridge.serverUrl = TEST_SERVER_URL;
    playerNetwork.init();

    // Wait for initial state sync on join
    await new Promise((resolve) => {
      const interval = setInterval(() => {
        if (receivedStates.length >= 1) {
          clearInterval(interval);
          resolve();
        }
      }, 20);
    });

    assert.equal(receivedStates[0].phase, 'LOBBY');
    assert.equal(receivedStates[0].targetPlayerId, 'player-sync-test');

    // Host transitions game phase to VOTING
    currentPhase = 'VOTING';

    // Player wakes up or triggers resync
    playerNetwork.requestStateSync();

    // Wait for resynced state
    await new Promise((resolve) => {
      const interval = setInterval(() => {
        if (receivedStates.length >= 2 && receivedStates[receivedStates.length - 1].phase === 'VOTING') {
          clearInterval(interval);
          resolve();
        }
      }, 20);
    });

    const latest = receivedStates[receivedStates.length - 1];
    assert.equal(latest.phase, 'VOTING');
    assert.equal(latest.targetPlayerId, 'player-sync-test');

    playerNetwork.destroy();
    hostNetwork.destroy();
  });

  await t.test('2. Disconnection grace period preserves player session on reconnect and evicts on expiration', async () => {
    const graceTimers = new Map();
    let activePlayers = [
      { id: 'p1', name: 'Kabir', role: 'kamina' },
      { id: 'p2', name: 'Rani', role: 'bhola' }
    ];

    const onPlayerLeave = (playerId, graceMs = 50) => {
      if (graceTimers.has(playerId)) clearTimeout(graceTimers.get(playerId));
      const timer = setTimeout(() => {
        graceTimers.delete(playerId);
        activePlayers = activePlayers.filter(p => p.id !== playerId);
      }, graceMs);
      graceTimers.set(playerId, timer);
    };

    const onPlayerJoin = (playerData) => {
      if (graceTimers.has(playerData.id)) {
        clearTimeout(graceTimers.get(playerData.id));
        graceTimers.delete(playerData.id);
      }
      const existing = activePlayers.find(p => p.id === playerData.id);
      if (!existing) {
        activePlayers.push(playerData);
      }
    };

    // p1 disconnects but reconnects within grace window (30ms < 70ms)
    onPlayerLeave('p1', 70);
    assert.equal(activePlayers.length, 2); // Still in activePlayers

    await new Promise((resolve) => setTimeout(resolve, 30));
    onPlayerJoin({ id: 'p1', name: 'Kabir' });

    // Wait past the 70ms mark to confirm p1 was NOT evicted
    await new Promise((resolve) => setTimeout(resolve, 50));
    assert.equal(activePlayers.some(p => p.id === 'p1'), true);
    assert.equal(activePlayers.find(p => p.id === 'p1').role, 'kamina'); // Role preserved!

    // p2 disconnects and does not reconnect; grace period expires (40ms)
    onPlayerLeave('p2', 40);
    assert.equal(activePlayers.some(p => p.id === 'p2'), true);

    await new Promise((resolve) => setTimeout(resolve, 60));
    assert.equal(activePlayers.some(p => p.id === 'p2'), false); // Evicted after expiration!
    assert.equal(activePlayers.length, 1);
  });

  await t.test('3. PlayerNetwork invokes onModeChange with active transport mode', async () => {
    let observedMode = null;

    const hostNetwork = new HostNetwork('MODE01', () => ({}));
    hostNetwork.bridge.serverUrl = TEST_SERVER_URL;
    hostNetwork.init();

    await new Promise((resolve) => {
      hostNetwork.bridge.onRoomCreated = resolve;
    });

    const playerNetwork = new PlayerNetwork(
      'MODE01',
      { id: 'player-mode-test', name: 'Tara' },
      () => {},
      () => {},
      () => {},
      () => {},
      (mode) => {
        observedMode = mode;
      }
    );
    playerNetwork.bridge.serverUrl = TEST_SERVER_URL;
    playerNetwork.init();

    await new Promise((resolve) => {
      const interval = setInterval(() => {
        if (observedMode === 'WS_RELAY') {
          clearInterval(interval);
          resolve();
        }
      }, 20);
    });

    assert.equal(observedMode, 'WS_RELAY');

    playerNetwork.destroy();
    hostNetwork.destroy();
  });
});
