// Integration tests for Kaminey Dedicated WebSocket Signaling & Relay Server
import test from 'node:test';
import assert from 'node:assert/strict';
import { WebSocket } from 'ws';
import { createServer } from '../server.js';

const TEST_PORT = 3999;
const TEST_URL = `http://127.0.0.1:${TEST_PORT}`;
const TEST_WS_URL = `ws://127.0.0.1:${TEST_PORT}`;

function waitForSocket(ws) {
  return new Promise((resolve, reject) => {
    if (ws.readyState === WebSocket.OPEN) return resolve();
    ws.once('open', resolve);
    ws.once('error', reject);
  });
}

function waitForMessage(ws, predicate) {
  return new Promise((resolve) => {
    const handler = (raw) => {
      const msg = JSON.parse(raw.toString());
      if (!predicate || predicate(msg)) {
        ws.off('message', handler);
        resolve(msg);
      }
    };
    ws.on('message', handler);
  });
}

test('Server Integration Test Suite', async (t) => {
  const { httpServer, wss, cleanupInterval } = createServer();
  await new Promise((resolve) => httpServer.listen(TEST_PORT, '127.0.0.1', resolve));

  t.after(async () => {
    clearInterval(cleanupInterval);
    wss.close();
    await new Promise((resolve) => httpServer.close(resolve));
  });

  await t.test('1. HTTP GET /health returns 200 and healthy JSON payload', async () => {
    const res = await fetch(`${TEST_URL}/health`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.status, 'ok');
    assert.equal(typeof body.uptime, 'number');
    assert.equal(typeof body.activeRooms, 'number');
  });

  await t.test('2. Host connects and creates a room with ROOM_CREATE', async () => {
    const hostWs = new WebSocket(TEST_WS_URL);
    await waitForSocket(hostWs);

    const createdPromise = waitForMessage(hostWs, (m) => m.type === 'ROOM_CREATED');
    hostWs.send(JSON.stringify({
      action: 'ROOM_CREATE',
      roomCode: 'HAV412',
      hostId: 'host-1'
    }));

    const response = await createdPromise;
    assert.equal(response.type, 'ROOM_CREATED');
    assert.equal(response.roomCode, 'HAV412');

    hostWs.close();
  });

  await t.test('3. Player joins room and both host & player receive join events', async () => {
    const hostWs = new WebSocket(TEST_WS_URL);
    await waitForSocket(hostWs);
    hostWs.send(JSON.stringify({ action: 'ROOM_CREATE', roomCode: 'SHI829' }));
    await waitForMessage(hostWs, (m) => m.type === 'ROOM_CREATED');

    const playerWs = new WebSocket(TEST_WS_URL);
    await waitForSocket(playerWs);

    const playerJoinNoticeToHost = waitForMessage(hostWs, (m) => m.type === 'PLAYER_JOINED');
    const playerConfirmation = waitForMessage(playerWs, (m) => m.type === 'ROOM_JOINED');

    playerWs.send(JSON.stringify({
      action: 'ROOM_JOIN',
      roomCode: 'SHI829',
      player: { id: 'p1', name: 'Vikram', avatarId: 'tiger' }
    }));

    const hostNotice = await playerJoinNoticeToHost;
    const playerReply = await playerConfirmation;

    assert.equal(hostNotice.player.id, 'p1');
    assert.equal(hostNotice.player.name, 'Vikram');
    assert.equal(playerReply.roomCode, 'SHI829');
    assert.equal(playerReply.hostConnected, true);

    hostWs.close();
    playerWs.close();
  });

  await t.test('4. WebRTC SIGNAL packets route accurately between peers', async () => {
    const hostWs = new WebSocket(TEST_WS_URL);
    await waitForSocket(hostWs);
    hostWs.send(JSON.stringify({ action: 'ROOM_CREATE', roomCode: 'DAR101' }));
    await waitForMessage(hostWs, (m) => m.type === 'ROOM_CREATED');

    const playerWs = new WebSocket(TEST_WS_URL);
    await waitForSocket(playerWs);
    playerWs.send(JSON.stringify({
      action: 'ROOM_JOIN',
      roomCode: 'DAR101',
      player: { id: 'p2', name: 'Rani', avatarId: 'peacock' }
    }));
    await waitForMessage(playerWs, (m) => m.type === 'ROOM_JOINED');

    // Player sends SDP Offer to host
    const hostSignalPromise = waitForMessage(hostWs, (m) => m.type === 'SIGNAL');
    playerWs.send(JSON.stringify({
      action: 'SIGNAL',
      roomCode: 'DAR101',
      senderId: 'p2',
      targetId: 'host',
      signalData: { type: 'offer', sdp: 'fake-sdp-offer' }
    }));

    const hostReceived = await hostSignalPromise;
    assert.equal(hostReceived.senderId, 'p2');
    assert.equal(hostReceived.signalData.sdp, 'fake-sdp-offer');

    // Host sends SDP Answer back to player
    const playerSignalPromise = waitForMessage(playerWs, (m) => m.type === 'SIGNAL');
    hostWs.send(JSON.stringify({
      action: 'SIGNAL',
      roomCode: 'DAR101',
      senderId: 'host',
      targetId: 'p2',
      signalData: { type: 'answer', sdp: 'fake-sdp-answer' }
    }));

    const playerReceived = await playerSignalPromise;
    assert.equal(playerReceived.senderId, 'host');
    assert.equal(playerReceived.signalData.sdp, 'fake-sdp-answer');

    hostWs.close();
    playerWs.close();
  });

  await t.test('5. Fallback RELAY messages forward application state when P2P is inactive', async () => {
    const hostWs = new WebSocket(TEST_WS_URL);
    await waitForSocket(hostWs);
    hostWs.send(JSON.stringify({ action: 'ROOM_CREATE', roomCode: 'MAH777' }));
    await waitForMessage(hostWs, (m) => m.type === 'ROOM_CREATED');

    const playerWs = new WebSocket(TEST_WS_URL);
    await waitForSocket(playerWs);
    playerWs.send(JSON.stringify({
      action: 'ROOM_JOIN',
      roomCode: 'MAH777',
      player: { id: 'p3', name: 'Kabir', avatarId: 'elephant' }
    }));
    await waitForMessage(playerWs, (m) => m.type === 'ROOM_JOINED');

    // Player sends game vote via fallback relay
    const hostRelayPromise = waitForMessage(hostWs, (m) => m.type === 'RELAY_MESSAGE');
    playerWs.send(JSON.stringify({
      action: 'RELAY',
      roomCode: 'MAH777',
      senderId: 'p3',
      targetId: 'host',
      payload: { type: 'SUBMIT_VOTE', targetId: 'p1' }
    }));

    const hostRelayed = await hostRelayPromise;
    assert.equal(hostRelayed.senderId, 'p3');
    assert.equal(hostRelayed.payload.type, 'SUBMIT_VOTE');
    assert.equal(hostRelayed.payload.targetId, 'p1');

    // Host broadcasts state sync via fallback relay
    const playerRelayPromise = waitForMessage(playerWs, (m) => m.type === 'RELAY_MESSAGE');
    hostWs.send(JSON.stringify({
      action: 'RELAY',
      roomCode: 'MAH777',
      senderId: 'host',
      targetId: 'all',
      payload: { type: 'STATE_SYNC', phase: 'DISCUSSION' }
    }));

    const playerRelayed = await playerRelayPromise;
    assert.equal(playerRelayed.payload.phase, 'DISCUSSION');

    hostWs.close();
    playerWs.close();
  });

  await t.test('6. Disconnect notifications notify surviving peers', async () => {
    const hostWs = new WebSocket(TEST_WS_URL);
    await waitForSocket(hostWs);
    hostWs.send(JSON.stringify({ action: 'ROOM_CREATE', roomCode: 'DIS999' }));
    await waitForMessage(hostWs, (m) => m.type === 'ROOM_CREATED');

    const playerWs = new WebSocket(TEST_WS_URL);
    await waitForSocket(playerWs);
    playerWs.send(JSON.stringify({
      action: 'ROOM_JOIN',
      roomCode: 'DIS999',
      player: { id: 'p4', name: 'Simran', avatarId: 'cheetah' }
    }));
    await waitForMessage(playerWs, (m) => m.type === 'ROOM_JOINED');

    // Player disconnects -> host gets notified
    const hostNoticePromise = waitForMessage(hostWs, (m) => m.type === 'PLAYER_DISCONNECTED');
    playerWs.close();
    const hostNotice = await hostNoticePromise;
    assert.equal(hostNotice.playerId, 'p4');

    hostWs.close();
  });
});
