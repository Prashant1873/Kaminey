import React, { useState } from 'react';
import { Volume2, VolumeX, Shield, Users, Tv, Smartphone } from 'lucide-react';
import { sounds } from '../../audio/soundEffects';

export default function Header({ isHost, roomCode, playerCount, onLeave, currentPhase }) {
  const [muted, setMuted] = useState(false);

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    sounds.setMuted(next);
  };

  const getPhaseLabel = (phase) => {
    switch (phase) {
      case 'LOBBY': return 'Lobby';
      case 'ROLE_REVEAL': return 'Role Reveal';
      case 'NIGHT': return 'Night Conclave';
      case 'MORNING': return 'Morning Reveal';
      case 'DARES': return 'Social Tasks';
      case 'DISCUSSION': return 'Round-Table Discussion';
      case 'VOTING': return 'The Trial';
      case 'EXILE': return 'The Exile';
      case 'GAME_OVER': return 'Match Over';
      default: return phase || 'Kaminey';
    }
  };

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 20px',
      backgroundColor: 'var(--surface-container-lowest)',
      borderBottom: '1px solid rgba(9, 30, 66, 0.08)',
      boxShadow: 'var(--shadow-resting)',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      {/* Brand & Role Mode */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: 'var(--rounded-lg)',
          background: 'linear-gradient(135deg, var(--primary-container), var(--primary))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: '1.25rem',
          boxShadow: 'var(--shadow-glow-primary)'
        }}>
          🎭
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: 800, fontSize: '1.125rem', letterSpacing: '-0.02em', color: 'var(--primary)' }}>
              KAMINEY
            </span>
            <span className={isHost ? 'badge-gain' : 'badge-warning'} style={{ fontSize: '0.6875rem' }}>
              {isHost ? <><Tv size={12} /> Hall Base</> : <><Smartphone size={12} /> Phone</>}
            </span>
          </div>
          {currentPhase && (
            <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)', fontWeight: 600 }}>
              {getPhaseLabel(currentPhase)}
            </div>
          )}
        </div>
      </div>

      {/* Room Code & Stats */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {roomCode && (
          <div style={{
            background: 'var(--surface-container-low)',
            padding: '6px 12px',
            borderRadius: 'var(--rounded-lg)',
            border: '1px solid var(--outline-variant)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span className="text-label" style={{ color: 'var(--on-surface-variant)' }}>Code:</span>
            <span className="tabular-nums" style={{ fontWeight: 800, letterSpacing: '0.05em', color: 'var(--primary)' }}>
              {roomCode}
            </span>
          </div>
        )}

        {playerCount !== undefined && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.875rem',
            fontWeight: 600,
            color: 'var(--on-surface-variant)'
          }}>
            <Users size={16} />
            <span className="tabular-nums">{playerCount}</span>
          </div>
        )}

        {/* Audio Mute Toggle */}
        <button
          onClick={toggleMute}
          className="spring-btn"
          title={muted ? 'Unmute audio' : 'Mute audio'}
          style={{
            background: 'transparent',
            color: muted ? 'var(--loss)' : 'var(--on-surface-variant)',
            padding: '8px',
            borderRadius: 'var(--rounded-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>

        {onLeave && (
          <button
            onClick={onLeave}
            className="spring-btn"
            style={{
              background: 'transparent',
              color: 'var(--outline)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              padding: '6px 10px',
              borderRadius: 'var(--rounded-md)',
              border: '1px solid var(--outline-variant)'
            }}
          >
            Leave
          </button>
        )}
      </div>
    </header>
  );
}
