import React, { useState, useEffect } from 'react';
import Countdown from '../common/Countdown';
import { getAvatarById } from '../../data/animalAvatars';
import { MessageSquare, AlertCircle, Volume2, ArrowRight, UserX } from 'lucide-react';
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
        background: 'linear-gradient(135deg, rgba(0, 61, 155, 0.08), rgba(255, 86, 48, 0.08))',
        borderRadius: 'var(--rounded-2xl)',
        padding: '24px 20px',
        border: '1px solid rgba(0, 61, 155, 0.15)'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'var(--loss)',
          color: '#ffffff',
          padding: '6px 16px',
          borderRadius: 'var(--rounded-full)',
          fontSize: '0.8125rem',
          fontWeight: 800,
          letterSpacing: '0.04em',
          marginBottom: '12px'
        }}>
          <AlertCircle size={16} />
          EMERGENCY ROUND-TABLE
        </div>
        <h1 className="text-display" style={{ color: 'var(--primary)', marginBottom: '8px' }}>
          WHO AMONG US IS A KAMINA?
        </h1>
        <p className="text-body" style={{ color: 'var(--on-surface-variant)', maxWidth: '650px', margin: '0 auto' }}>
          Review the night's murder and everyone's bizarre behavior during the tasks.
          Debate openly. When the clock runs out, everyone must cast their secret ballot!
        </p>
      </div>

      {/* Among Us Timed Countdown Bar */}
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
          background: 'var(--surface-container-lowest)',
          borderRadius: 'var(--rounded-xl)',
          padding: '16px 24px',
          border: '2px solid var(--primary-container)',
          boxShadow: 'var(--shadow-elevated)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          animation: 'pulse-subtle 1.5s infinite'
        }}>
          <span style={{ fontSize: '2.5rem' }}>{spotlightAvatar.emoji}</span>
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
            const avatar = getAvatarById(p.avatarId);
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
                  gap: '6px',
                  border: isSelected ? '2px solid var(--primary)' : '1px solid rgba(9, 30, 66, 0.1)',
                  backgroundColor: isSelected ? 'rgba(0, 82, 204, 0.05)' : 'var(--surface-container-lowest)'
                }}
              >
                <div style={{ fontSize: '2.75rem', lineHeight: 1 }}>{avatar.emoji}</div>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--on-surface)' }}>{p.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)', fontWeight: 600 }}>
                  {avatar.name}
                </div>
                {isSelected && (
                  <span className="badge-loss" style={{ fontSize: '0.625rem', marginTop: '4px' }}>
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
