// End-to-End Cellular Network Simulation & Production Integration Test Suite
// Simulates multi-phone Carrier-Grade / Symmetric NAT conditions (direct P2P disabled),
// transparent WebSocket fallback relaying, anti-cheat state isolation, full game cycle progression,
// and mobile sleep/wake reconnection.

import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from '../server/server.js';
import { HostNetwork, PlayerNetwork } from '../src/network/peerManager.js';

const TEST_PORT = 3995;
const TEST_SERVER_URL = `ws://127.0.0.1:${TEST_PORT}`;

test('End-to-End Cellular Network Simulation Suite', async (t) => {
  const { httpServer, wss, cleanupInterval } = createServer();
  await new Promise((resolve) => httpServer.listen(TEST_PORT, '127.0.0.1', resolve));

  t.after(async () => {
    clearInterval(cleanupInterval);
    wss.close();
    await new Promise((resolve) => httpServer.close(resolve));
  });

  await t.test('1. Multi-phone connection over cellular NAT (WS_RELAY) with anti-cheat role isolation', async () => {
    let hostRegisteredPlayers = [];
    const roles = {
      'phone-1': 'kamina',
      'phone-2': 'bhola',
      'phone-3': 'bhola'
    };

    // 1. Host creates room
    const host = new HostNetwork(
      'NAT404',
      () => ({
        onPlayerJoin: (player) => {
          hostRegisteredPlayers.push(player);
        },
        onPlayerMessage: () => {},
        onPlayerLeave: () => {},
        onStatusChange: () => {},
        getCustomStateForPlayer: (playerId) => ({
          phase: 'LOBBY',
          mySecret: { role: roles[playerId] }
        })
      })
    );
    host.bridge.serverUrl = TEST_SERVER_URL;
    host.init();

    await new Promise((resolve) => {
      host.bridge.onRoomCreated = resolve;
    });

    // 2. Three phones join simultaneously on cellular connection
    const phones = [
      { id: 'phone-1', name: 'Kabir (Cellular 5G)', avatarId: 'wolf' },
      { id: 'phone-2', name: 'Pooja (Cellular LTE)', avatarId: 'cat' },
      { id: 'phone-3', name: 'Vikram (External Hotspot)', avatarId: 'hawk' }
    ];

    const phoneClients = [];
    const receivedSecrets = new Map();

    for (const phone of phones) {
      const client = new PlayerNetwork(
        'NAT404',
        phone,
        (state) => {
          if (state.mySecret) {
            receivedSecrets.set(phone.id, state.mySecret.role);
          }
        },
        () => {},
        () => {}
      );
      client.bridge.serverUrl = TEST_SERVER_URL;
      client.init();
      phoneClients.push(client);
    }

    // Wait for all 3 phones to join and receive state
    await new Promise((resolve) => {
      const check = setInterval(() => {
        if (hostRegisteredPlayers.length === 3 && receivedSecrets.size === 3) {
          clearInterval(check);
          resolve();
        }
      }, 20);
    });

    assert.equal(hostRegisteredPlayers.length, 3);
    // In Node runtime without WebRTC, transport mode cleanly resolves to WS_RELAY
    phoneClients.forEach((p) => {
      assert.equal(p.bridge.transportMode, 'WS_RELAY');
    });

    // Anti-cheat verification: Phone 1 knows it is Kamina; Phones 2 and 3 know they are Bhola
    assert.equal(receivedSecrets.get('phone-1'), 'kamina');
    assert.equal(receivedSecrets.get('phone-2'), 'bhola');
    assert.equal(receivedSecrets.get('phone-3'), 'bhola');

    phoneClients.forEach(p => p.destroy());
    host.destroy();
  });

  await t.test('2. Full gameplay cycle (Night Vote -> Discussion -> Exile Ballot) over server relay', async () => {
    let hostVotes = {};
    let hostNightVotes = {};
    let currentPhase = 'NIGHT';

    const host = new HostNetwork(
      'PLAY99',
      () => ({
        onPlayerJoin: () => {},
        onPlayerMessage: (envelope, senderId) => {
          const type = envelope.type;
          const data = envelope.payload !== undefined ? envelope.payload : envelope;
          if (type === 'NIGHT_VOTE') {
            hostNightVotes[senderId] = data.targetId;
          } else if (type === 'CAST_VOTE') {
            hostVotes[senderId] = data.targetId;
          }
        },
        onPlayerLeave: () => {},
        onStatusChange: () => {},
        getCustomStateForPlayer: () => ({ phase: currentPhase })
      })
    );
    host.bridge.serverUrl = TEST_SERVER_URL;
    host.init();

    await new Promise((resolve) => {
      host.bridge.onRoomCreated = resolve;
    });

    const p1 = new PlayerNetwork('PLAY99', { id: 'p1', name: 'Player 1' }, () => {}, () => {}, () => {});
    const p2 = new PlayerNetwork('PLAY99', { id: 'p2', name: 'Player 2' }, () => {}, () => {}, () => {});
    p1.bridge.serverUrl = TEST_SERVER_URL;
    p2.bridge.serverUrl = TEST_SERVER_URL;
    p1.init();
    p2.init();

    // Wait for connection
    await new Promise((resolve) => setTimeout(resolve, 80));

    // Night phase: Kamina casts night vote
    p1.send('NIGHT_VOTE', { targetId: 'p2' });

    await new Promise((resolve) => {
      const check = setInterval(() => {
        if (hostNightVotes['p1']) {
          clearInterval(check);
          resolve();
        }
      }, 20);
    });

    assert.equal(hostNightVotes['p1'], 'p2');

    // Host advances phase to VOTING
    currentPhase = 'VOTING';
    host.broadcastState();

    // Both players cast council votes
    p1.send('CAST_VOTE', { targetId: 'p2' });
    p2.send('CAST_VOTE', { targetId: 'p1' });

    await new Promise((resolve) => {
      const check = setInterval(() => {
        if (hostVotes['p1'] && hostVotes['p2']) {
          clearInterval(check);
          resolve();
        }
      }, 20);
    });

    assert.equal(hostVotes['p1'], 'p2');
    assert.equal(hostVotes['p2'], 'p1');

    p1.destroy();
    p2.destroy();
    host.destroy();
  });

  await t.test('3. Mobile phone sleep/wake cycle during active voting restores state via REQUEST_STATE_SYNC', async () => {
    let currentPhase = 'VOTING';
    let resyncedStates = [];

    const host = new HostNetwork(
      'WAKE77',
      () => ({
        onPlayerJoin: () => {},
        onPlayerMessage: () => {},
        onPlayerLeave: () => {},
        onStatusChange: () => {},
        getCustomStateForPlayer: (playerId) => ({
          phase: currentPhase,
          activeBallot: true,
          forPlayer: playerId
        })
      })
    );
    host.bridge.serverUrl = TEST_SERVER_URL;
    host.init();

    await new Promise((resolve) => {
      host.bridge.onRoomCreated = resolve;
    });

    let player = new PlayerNetwork(
      'WAKE77',
      { id: 'mobile-sleeper', name: 'Sleeper Phone' },
      (state) => {
        resyncedStates.push(state);
      },
      () => {},
      () => {}
    );
    player.bridge.serverUrl = TEST_SERVER_URL;
    player.init();

    await new Promise((resolve) => {
      const check = setInterval(() => {
        if (resyncedStates.length >= 1) {
          clearInterval(check);
          resolve();
        }
      }, 20);
    });

    assert.equal(resyncedStates[0].phase, 'VOTING');

    // Simulate mobile screen sleep: socket disconnects
    player.bridge.ws.close();
    await new Promise((resolve) => setTimeout(resolve, 60));

    // Mobile user unlocks phone: bridge reconnects and triggers automatic REQUEST_STATE_SYNC
    player.bridge.init();

    await new Promise((resolve) => {
      const check = setInterval(() => {
        if (resyncedStates.length >= 2) {
          clearInterval(check);
          resolve();
        }
      }, 20);
    });

    const latestState = resyncedStates[resyncedStates.length - 1];
    assert.equal(latestState.phase, 'VOTING');
    assert.equal(latestState.activeBallot, true);
    assert.equal(latestState.forPlayer, 'mobile-sleeper');

    player.destroy();
    host.destroy();
  });

  await t.test('4. Live phase progression broadcast pushes updates in real time to phones without page refresh', async () => {
    let currentPhase = 'LOBBY';
    let roles = { 'live-p1': 'kamina', 'live-p2': 'bhola' };
    let currentMission = null;

    const host = new HostNetwork(
      'LIVE88',
      () => ({
        onPlayerJoin: () => {},
        onPlayerMessage: () => {},
        onPlayerLeave: () => {},
        onStatusChange: () => {},
        getCustomStateForPlayer: (playerId) => ({
          phase: currentPhase,
          mission: currentMission,
          mySecret: {
            role: roles[playerId] || null
          }
        })
      })
    );
    host.bridge.serverUrl = TEST_SERVER_URL;
    host.init();

    await new Promise((resolve) => {
      host.bridge.onRoomCreated = resolve;
    });

    assert.equal(host.isReady, true, 'Host isReady should be true once room is created');

    const p1States = [];
    const p2States = [];

    const p1 = new PlayerNetwork(
      'LIVE88',
      { id: 'live-p1', name: 'Live Player 1' },
      (state) => p1States.push(state),
      () => {},
      () => {}
    );
    const p2 = new PlayerNetwork(
      'LIVE88',
      { id: 'live-p2', name: 'Live Player 2' },
      (state) => p2States.push(state),
      () => {},
      () => {}
    );

    p1.bridge.serverUrl = TEST_SERVER_URL;
    p2.bridge.serverUrl = TEST_SERVER_URL;
    p1.init();
    p2.init();

    // 1. Wait for initial lobby connection
    await new Promise((resolve) => {
      const check = setInterval(() => {
        if (p1States.length >= 1 && p2States.length >= 1) {
          clearInterval(check);
          resolve();
        }
      }, 20);
    });

    assert.equal(p1States[0].phase, 'LOBBY');
    assert.equal(p2States[0].phase, 'LOBBY');

    // 2. Host starts game -> ROLE_REVEAL phase
    currentPhase = 'ROLE_REVEAL';
    host.broadcastState(null, ['live-p1', 'live-p2']);

    await new Promise((resolve) => {
      const check = setInterval(() => {
        const lastP1 = p1States[p1States.length - 1];
        const lastP2 = p2States[p2States.length - 1];
        if (lastP1?.phase === 'ROLE_REVEAL' && lastP2?.phase === 'ROLE_REVEAL') {
          clearInterval(check);
          resolve();
        }
      }, 20);
    });

    assert.equal(p1States[p1States.length - 1].phase, 'ROLE_REVEAL');
    assert.equal(p1States[p1States.length - 1].mySecret.role, 'kamina');
    assert.equal(p2States[p2States.length - 1].phase, 'ROLE_REVEAL');
    assert.equal(p2States[p2States.length - 1].mySecret.role, 'bhola');

    // 3. Host advances to DARES / Cover Mission phase
    currentPhase = 'DARES';
    currentMission = { title: 'Cover Task: Mimic Amitabh Bachchan' };
    host.broadcastState();

    await new Promise((resolve) => {
      const check = setInterval(() => {
        const lastP1 = p1States[p1States.length - 1];
        const lastP2 = p2States[p2States.length - 1];
        if (lastP1?.phase === 'DARES' && lastP2?.phase === 'DARES') {
          clearInterval(check);
          resolve();
        }
      }, 20);
    });

    assert.equal(p1States[p1States.length - 1].mission.title, 'Cover Task: Mimic Amitabh Bachchan');
    assert.equal(p2States[p2States.length - 1].mission.title, 'Cover Task: Mimic Amitabh Bachchan');

    // 4. Host advances to NIGHT phase
    currentPhase = 'NIGHT';
    host.broadcastState();

    await new Promise((resolve) => {
      const check = setInterval(() => {
        const lastP1 = p1States[p1States.length - 1];
        const lastP2 = p2States[p2States.length - 1];
        if (lastP1?.phase === 'NIGHT' && lastP2?.phase === 'NIGHT') {
          clearInterval(check);
          resolve();
        }
      }, 20);
    });

    assert.equal(p1States[p1States.length - 1].phase, 'NIGHT');
    assert.equal(p2States[p2States.length - 1].phase, 'NIGHT');

    p1.destroy();
    p2.destroy();
    host.destroy();
  });
});
