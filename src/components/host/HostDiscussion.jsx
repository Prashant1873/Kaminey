import React, { useState, useEffect } from 'react';
import Countdown from '../common/Countdown';
import { getAvatarById } from '../../data/animalAvatars';
import AvatarBadge from '../common/AvatarBadge';
import { MessageSquare, AlertCircle, Volume2, ArrowRight, UserX, Mic } from 'lucide-react';
import { sounds } from '../../audio/soundEffects';

export default function HostDiscussion({
  players,
  duration = 60,
  onStartVoting
}) {
  const [spotlightId, setSpotlightId] = useState(null);
  const alivePlayers = players.filter(p => p.isAlive && !p.isExiled);

  useEffect(() => {
    sounds.playDramaticStinger();
  }, []);

  const spotlightPlayer = players.find(p => p.id === spotlightId);
  const spotlightAvatar = spotlightPlayer ? getAvatarById(spotlightPlayer.avatarId) : null;

  return (
    <div style={{
      maxWidth: '1100px',
      margin: '0 auto',
      padding: '30px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      textAlign: 'center'
    }}>
      {/* Emergency Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(229, 184, 105, 0.08), rgba(239, 68, 68, 0.08))',
        borderRadius: 'var(--rounded-xl)',
        padding: '18px 20px',
        border: '1px solid rgba(229, 184, 105, 0.2)'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: 'var(--loss)',
          color: '#ffffff',
          padding: '4px 14px',
          borderRadius: 'var(--rounded-full)',
          fontSize: '0.75rem',
          fontWeight: 800,
          marginBottom: '8px'
        }}>
          <AlertCircle size={14} />
          <span>EMERGENCY COUNCIL</span>
        </div>
        <h1 className="text-display" style={{ color: 'var(--primary)', marginBottom: '4px' }}>
          WHO IS THE KAMINA?
        </h1>
        <p style={{
          color: 'var(--on-surface-variant)',
          fontSize: '0.9375rem',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px'
        }}>
          <span>Debate openly. Click any player below to give them the floor</span>
          <Mic size={16} color="var(--primary)" />
        </p>
      </div>

      {/* Timed Countdown Bar */}
      <div className="card-interactive" style={{ padding: '20px 24px' }}>
        <Countdown
          duration={duration}
          onExpire={onStartVoting}
          active={true}
          label="Discussion Time Remaining"
        />
      </div>

      {/* Spotlighted Player Bar (if Host clicked someone) */}
      {spotlightPlayer && spotlightAvatar && (
        <div style={{
          background: 'rgba(22, 26, 38, 0.85)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRadius: 'var(--rounded-xl)',
          padding: '16px 24px',
          border: '2px solid var(--primary)',
          boxShadow: 'var(--shadow-glow-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          animation: 'pulse-subtle 1.5s infinite'
        }}>
          <AvatarBadge avatarId={spotlightPlayer.avatarId} size={54} />
          <div style={{ textAlign: 'left' }}>
            <div className="text-label" style={{ color: 'var(--primary)' }}>HOT SEAT SPOTLIGHT</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{spotlightPlayer.name} has the floor to defend themselves!</div>
          </div>
          <button
            onClick={() => setSpotlightId(null)}
            className="category-pill spring-btn"
            style={{ marginLeft: 'auto' }}
          >
            Clear Spotlight
          </button>
        </div>
      )}

      {/* Round-Table Grid of Living Players */}
      <div>
        <div className="text-label" style={{ color: 'var(--on-surface-variant)', marginBottom: '12px' }}>
          CLICK A SUSPECT TO PUT THEM ON THE DEFENSE FLOOR ({alivePlayers.length} ALIVE)
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: '14px',
          maxWidth: '850px',
          margin: '0 auto'
        }}>
          {alivePlayers.map(p => {
            const isSelected = p.id === spotlightId;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setSpotlightId(isSelected ? null : p.id)}
                className="card-interactive spring-btn"
                style={{
                  padding: '18px 10px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  border: isSelected ? '2px solid var(--primary)' : '1px solid rgba(255, 255, 255, 0.08)',
                  backgroundColor: isSelected ? 'rgba(229, 184, 105, 0.12)' : 'rgba(18, 22, 32, 0.65)'
                }}
              >
                <AvatarBadge avatarId={p.avatarId} size={54} />
                <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--on-surface)' }}>{p.name}</div>
                {isSelected && (
                  <span className="badge-loss" style={{ fontSize: '0.625rem', marginTop: '2px' }}>
                    Accused / Speaking
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Manual Proceed to Voting */}
      <div>
        <button
          type="button"
          onClick={onStartVoting}
          className="btn-primary spring-btn"
          style={{
            padding: '16px 36px',
            fontSize: '1.125rem'
          }}
        >
          <span>End Discussion & Open Voting Now</span>
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
