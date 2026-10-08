import React from 'react';

/**
 * NetworkBadge component
 * Displays connection health and active dual-transport mode:
 * - P2P_DIRECT: Direct WebRTC DataChannel (Green dot)
 * - WS_RELAY: WebSocket Relay fallback (Amber dot)
 * - CONNECTING: Initial socket / ICE negotiation (Blue pulsing dot)
 * - DISCONNECTED: Socket/DataChannel loss, reconnecting (Red pulsing dot)
 */
export default function NetworkBadge({ mode = 'CONNECTING', compact = false, style = {} }) {
  let label = 'Connecting...';
  let dotColor = '#3B82F6';
  let pulse = true;

  switch (mode) {
    case 'P2P_DIRECT':
      label = 'P2P Direct';
      dotColor = '#10B981'; // Green
      pulse = false;
      break;
    case 'WS_RELAY':
      label = 'Online (Server)';
      dotColor = '#10B981'; // Green (Stable)
      pulse = false;
      break;
    case 'DISCONNECTED':
      label = 'Reconnecting...';
      dotColor = '#EF4444'; // Red
      pulse = true;
      break;
    case 'CONNECTING':
    default:
      label = 'Connecting...';
      dotColor = '#3B82F6'; // Blue
      pulse = true;
      break;
  }

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: compact ? '2px 6px' : '3px 8px',
        borderRadius: '9999px',
        backgroundColor: 'rgba(28, 32, 46, 0.85)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        fontSize: '0.6875rem',
        fontWeight: 600,
        color: '#E2E8F0',
        whiteSpace: 'nowrap',
        userSelect: 'none',
        lineHeight: 1,
        ...style
      }}
      title={`Network Mode: ${label}`}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: dotColor,
          boxShadow: `0 0 6px ${dotColor}`,
          display: 'inline-block',
          animation: pulse ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none'
        }}
      />
      <span>{label}</span>
    </div>
  );
}
