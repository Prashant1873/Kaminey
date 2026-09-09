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
    <header className="app-header" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 16px',
      backgroundColor: 'var(--surface-container-lowest)',
      borderBottom: '1px solid rgba(9, 30, 66, 0.08)',
      boxShadow: 'var(--shadow-resting)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      width: '100%',
      maxWidth: '100vw',
      boxSizing: 'border-box'
    }}>
      {/* Brand & Role Mode */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flexShrink: 1 }}>
        <div style={{
          width: '34px',
          height: '34px',
          minWidth: '34px',
          borderRadius: 'var(--rounded-lg)',
          background: 'linear-gradient(135deg, var(--primary-container), var(--primary))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: '1.15rem',
          boxShadow: 'var(--shadow-glow-primary)'
        }}>
          🎭
        </div>
        <div style={{ minWidth: 0, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.02em', color: 'var(--primary)', whiteSpace: 'nowrap' }}>
              KAMINEY
            </span>
            <span className={isHost ? 'badge-gain' : 'badge-warning'} style={{ fontSize: '0.625rem', padding: '2px 6px', whiteSpace: 'nowrap' }}>
              {isHost ? <><Tv size={11} /> Base</> : <><Smartphone size={11} /> Phone</>}
            </span>
          </div>
          {currentPhase && (
            <div style={{ fontSize: '0.6875rem', color: 'var(--on-surface-variant)', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {getPhaseLabel(currentPhase)}
            </div>
          )}
        </div>
      </div>

      {/* Room Code & Stats */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        {roomCode && (
          <div style={{
            background: 'var(--surface-container-low)',
            padding: '4px 8px',
            borderRadius: 'var(--rounded-md)',
            border: '1px solid var(--outline-variant)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <span className="tabular-nums" style={{ fontWeight: 800, fontSize: '0.8125rem', letterSpacing: '0.05em', color: 'var(--primary)' }}>
              {roomCode}
            </span>
          </div>
        )}

        {playerCount !== undefined && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            fontSize: '0.8125rem',
            fontWeight: 600,
            color: 'var(--on-surface-variant)'
          }}>
            <Users size={14} />
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
            padding: '6px',
            borderRadius: 'var(--rounded-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>

        {onLeave && (
          <button
            onClick={onLeave}
            className="spring-btn"
            style={{
              background: 'transparent',
              color: 'var(--outline)',
              fontSize: '0.75rem',
              fontWeight: 600,
              padding: '4px 8px',
              borderRadius: 'var(--rounded-md)',
              border: '1px solid var(--outline-variant)'
            }}
          >
            Exit
          </button>
        )}
      </div>
    </header>
  );
}
