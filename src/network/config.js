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

// Pure Server Relay Mode: routes all traffic through WebSocket server for 100% rock-solid stability
// Completely eliminates flaky WebRTC DataChannel drops, NAT timeouts, and mode flapping
export const USE_PURE_SERVER_RELAY = true;

// Default production cloud relay on Render (can be overridden via VITE_WS_SERVER_URL)
export const DEFAULT_PRODUCTION_WS_URL = 'wss://kaminey-server.onrender.com';

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

    // Static hosting platforms (e.g. GitHub Pages, Vercel, Netlify)
    // Automatically routes to production cloud relay rather than hitting closed port 3001 on CDN
    if (
      hostname.includes('github.io') ||
      hostname.includes('vercel.app') ||
      hostname.includes('netlify.app')
    ) {
      return DEFAULT_PRODUCTION_WS_URL;
    }

    // Custom domain / self-hosted server
    const wsProto = protocol === 'https:' ? 'wss:' : 'ws:';
    return `${wsProto}//${hostname}:3001`;
  }

  // 3. Node.js runtime fallback
  return 'ws://localhost:3001';
}
