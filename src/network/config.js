// Network Endpoint & STUN Configuration for Kaminey Hybrid Transport
// Automatically handles development (localhost/LAN) and production cloud signaling endpoints.

export const ICE_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  { urls: 'stun:stun2.l.google.com:19302' },
  { urls: 'stun:stun3.l.google.com:19302' },
  { urls: 'stun:stun4.l.google.com:19302' }
];

export const FALLBACK_P2P_TIMEOUT_MS = 4000;

export function getWebSocketServerUrl() {
  // 1. Explicit Vite environment variable override
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_WS_SERVER_URL) {
    return import.meta.env.VITE_WS_SERVER_URL;
  }

  // 2. Browser context detection
  if (typeof window !== 'undefined' && window.location) {
    const { hostname, protocol } = window.location;
    // Local development (localhost, 127.0.0.1, or local LAN IP like 192.168.x.x)
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname.startsWith('192.168.') ||
      hostname.startsWith('10.') ||
      hostname.endsWith('.local')
    ) {
      return `ws://${hostname}:3001`;
    }

    // Production / Deployed environment (GitHub Pages, etc.)
    // Uses secure WSS protocol
    const wsProto = protocol === 'https:' ? 'wss:' : 'ws:';
    // If a deployed backend hostname is configured:
    return `${wsProto}//${hostname}:3001`;
  }

  // 3. Node.js runtime fallback
  return 'ws://localhost:3001';
}
