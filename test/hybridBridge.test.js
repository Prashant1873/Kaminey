// Tests for HybridNetworkBridge and DeduplicationCache
import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from '../server/server.js';
import { HybridNetworkBridge, DeduplicationCache } from '../src/network/hybridBridge.js';

const TEST_PORT = 3998;
const TEST_SERVER_URL = `ws://127.0.0.1:${TEST_PORT}`;

test('Hybrid Bridge & Deduplication Test Suite', async (t) => {
  const { httpServer, wss, cleanupInterval } = createServer();
  await new Promise((resolve) => httpServer.listen(TEST_PORT, '127.0.0.1', resolve));

  t.after(async () => {
    clearInterval(cleanupInterval);
    wss.close();
    await new Promise((resolve) => httpServer.close(resolve));
  });

  await t.test('1. DeduplicationCache correctly identifies duplicates and prunes expired items', () => {
    const cache = new DeduplicationCache(50); // 50ms TTL for testing

    assert.equal(cache.isDuplicate('msg-1'), false);
    assert.equal(cache.isDuplicate('msg-1'), true);
    assert.equal(cache.isDuplicate('msg-2'), false);

    // After TTL
    return new Promise((resolve) => {
      setTimeout(() => {
        assert.equal(cache.isDuplicate('msg-1'), false); // Pruned
        resolve();
      }, 70);
    });
  });

  await t.test('2. HybridNetworkBridge establishes relay mode and routes bidirectional game messages', async () => {
    let hostReceivedPayload = null;
    let playerReceivedPayload = null;

    // Initialize Host Bridge
    const hostBridge = new HybridNetworkBridge({
      roomCode: 'REL404',
      role: 'host',
      id: 'host',
      serverUrl: TEST_SERVER_URL,
      onMessage: (envelope, senderId) => {
        hostReceivedPayload = { envelope, senderId };
      }
    });
    hostBridge.init();

    // Wait for room to be created
    await new Promise((resolve) => {
      hostBridge.onRoomCreated = resolve;
    });

    // Initialize Player Bridge
    const playerBridge = new HybridNetworkBridge({
      roomCode: 'REL404',
      role: 'player',
      id: 'player-test-1',
      name: 'Amar',
      avatarId: 'hawk',
      serverUrl: TEST_SERVER_URL,
      onMessage: (envelope) => {
        playerReceivedPayload = envelope;
      }
    });
    playerBridge.init();

    // Wait for player to join
    await new Promise((resolve) => {
      playerBridge.onRoomJoined = resolve;
    });

    // In Node.js environment without WebRTC, transport mode should immediately resolve to WS_RELAY
    assert.equal(playerBridge.transportMode, 'WS_RELAY');

    // Player sends vote to host
    playerBridge.send('SUBMIT_VOTE', { target: 'player-2' });

    // Wait for host to receive
    await new Promise((resolve) => {
      const check = setInterval(() => {
        if (hostReceivedPayload) {
          clearInterval(check);
          resolve();
        }
      }, 20);
    });

    assert.equal(hostReceivedPayload.senderId, 'player-test-1');
    assert.equal(hostReceivedPayload.envelope.type, 'SUBMIT_VOTE');
    assert.equal(hostReceivedPayload.envelope.payload.target, 'player-2');

    // Host sends personalized state sync back to player
    hostBridge.sendToPlayer('player-test-1', 'STATE_SYNC', { phase: 'NIGHT', round: 1 });

    await new Promise((resolve) => {
      const check = setInterval(() => {
        if (playerReceivedPayload) {
          clearInterval(check);
          resolve();
        }
      }, 20);
    });

    assert.equal(playerReceivedPayload.type, 'STATE_SYNC');
    assert.equal(playerReceivedPayload.payload.phase, 'NIGHT');

    hostBridge.destroy();
    playerBridge.destroy();
  });
});
