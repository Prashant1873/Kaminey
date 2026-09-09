import React, { useState } from 'react';
import { Volume2, VolumeX, Shield, Users, Tv, Smartphone, Crown, Moon } from 'lucide-react';
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

  const isNight = currentPhase === 'NIGHT';

  const handleHomeClick = () => {
    if (onLeave) {
      if (currentPhase && currentPhase !== 'LOBBY' && currentPhase !== 'GAME_OVER') {
        const confirmExit = window.confirm('Exit current game and return to Home?');
        if (!confirmExit) return;
      }
      onLeave();
    } else {
      window.location.hash = '#/';
      window.location.reload();
    }
  };

  return (
    <header className={`app-header ${isNight ? 'theme-simsim-night' : ''}`} style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '8px 16px',
      minHeight: '56px',
      backgroundColor: isNight ? '#000000' : 'rgba(15, 17, 24, 0.85)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: isNight ? '1px solid #141414' : '1px solid rgba(255, 255, 255, 0.08)',
      boxShadow: isNight ? 'none' : 'var(--shadow-resting)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      width: '100%',
      maxWidth: '100vw',
      boxSizing: 'border-box',
      transition: 'background-color 0.3s ease, border-color 0.3s ease'
    }}>
      {/* Brand & Role Mode */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flexShrink: 1 }}>
        <button
          type="button"
          onClick={handleHomeClick}
          className="spring-btn"
          title="Go to Home"
          aria-label="Kaminey Home"
          style={{
            background: 'transparent',
            border: 'none',
            padding: '4px 6px',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            textAlign: 'left',
            minHeight: '48px'
          }}
        >
          <div style={{
            width: '36px',
            height: '36px',
            minWidth: '36px',
            borderRadius: 'var(--rounded-lg)',
            background: isNight ? '#111218' : 'linear-gradient(135deg, #E5B869, #C99738)',
            border: isNight ? '1px solid #222222' : '1px solid rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isNight ? '#E5B869' : '#0A0B0E',
            boxShadow: isNight ? 'none' : '0 4px 14px rgba(229, 184, 105, 0.3)'
          }}>
            {isNight ? <Moon size={18} strokeWidth={2.4} /> : <Crown size={19} strokeWidth={2.4} />}
          </div>
          <span style={{ fontWeight: 800, fontSize: '1.05rem', letterSpacing: '-0.02em', color: isNight ? '#ffffff' : 'var(--primary)', whiteSpace: 'nowrap' }}>
            KAMINEY
          </span>
        </button>

        <div style={{ minWidth: 0, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className={isNight ? 'badge-loss' : (isHost ? 'badge-gain' : 'badge-warning')} style={{ fontSize: '0.625rem', padding: '2px 8px', whiteSpace: 'nowrap' }}>
              {isHost ? <><Tv size={11} /> Base</> : <><Smartphone size={11} /> Phone</>}
            </span>
          </div>
          {currentPhase && (
            <div style={{ fontSize: '0.6875rem', color: isNight ? '#888888' : 'var(--on-surface-variant)', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {getPhaseLabel(currentPhase)}
            </div>
          )}
        </div>
      </div>

      {/* Room Code & Stats */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
        {roomCode && (
          <div style={{
            background: isNight ? '#0a0a0a' : 'var(--surface-container-low)',
            padding: '6px 12px',
            borderRadius: 'var(--rounded-md)',
            border: isNight ? '1px solid #222222' : '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <span className="tabular-nums" style={{ fontWeight: 800, fontSize: '0.875rem', letterSpacing: '0.08em', color: isNight ? '#ffffff' : 'var(--primary)' }}>
              {roomCode}
            </span>
          </div>
        )}

        {playerCount !== undefined && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.8125rem',
            fontWeight: 600,
            color: isNight ? '#aaaaaa' : 'var(--on-surface-variant)'
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
          aria-label={muted ? 'Unmute audio' : 'Mute audio'}
          style={{
            background: isNight ? '#0a0a0a' : 'rgba(255, 255, 255, 0.05)',
            color: muted ? 'var(--loss)' : (isNight ? '#cccccc' : 'var(--on-surface-variant)'),
            padding: '8px',
            minWidth: '44px',
            minHeight: '44px',
            borderRadius: 'var(--rounded-lg)',
            border: isNight ? '1px solid #222222' : '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {muted ? <VolumeX size={17} /> : <Volume2 size={17} />}
        </button>

        {onLeave && (
          <button
            onClick={onLeave}
            className="spring-btn"
            aria-label="Exit game"
            style={{
              background: isNight ? '#0a0a0a' : 'rgba(255, 255, 255, 0.05)',
              color: isNight ? '#888888' : 'var(--on-surface-variant)',
              fontSize: '0.75rem',
              fontWeight: 600,
              padding: '6px 12px',
              minHeight: '44px',
              borderRadius: 'var(--rounded-lg)',
              border: isNight ? '1px solid #222222' : '1px solid rgba(255, 255, 255, 0.08)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            Exit
          </button>
        )}
      </div>
    </header>
  );
}
