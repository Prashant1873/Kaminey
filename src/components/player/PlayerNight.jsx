import React from 'react';
import { Moon, Skull, Shield, CheckCircle, Crosshair } from 'lucide-react';
import { getAvatarById } from '../../data/animalAvatars';
import AvatarBadge from '../common/AvatarBadge';

export default function PlayerNight({
  role,
  players = [],
  myPlayerId,
  kamineyPartners = [],
  nightVotes = {},
  onSelectTarget
}) {
  const isKamina = role === 'kamina';
  const mySelectedTarget = nightVotes[myPlayerId] || null;

  const triggerHaptic = (pattern) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(pattern);
      } catch (e) {}
    }
  };

  const handleTargetClick = (victimId) => {
    onSelectTarget(victimId);
    triggerHaptic([40, 40]);
  };

  // Potential murder targets: all living players who are NOT fellow Kaminey
  const partnerIds = new Set(kamineyPartners.map(p => p.id));
  partnerIds.add(myPlayerId);

  const potentialVictims = players.filter(p => p.isAlive && !p.isExiled && !partnerIds.has(p.id));

  return (
    <div className="theme-simsim-night" style={{
      width: '100%',
      minHeight: 'auto',
      flex: 1,
      backgroundColor: '#000000',
      padding: '24px 14px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      gap: '18px',
      boxSizing: 'border-box'
    }}>
      {/* Top Ambience */}
      <div style={{
        width: '72px',
        height: '72px',
        borderRadius: '50%',
        background: isKamina ? 'rgba(239, 68, 68, 0.15)' : 'rgba(229, 184, 105, 0.12)',
        border: isKamina ? '1.5px solid var(--loss)' : '1.5px solid var(--primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: isKamina ? 'var(--shadow-glow-loss)' : 'var(--shadow-glow-primary)'
      }}>
        {isKamina ? <Skull size={36} color="var(--loss)" /> : <Moon size={36} color="var(--primary)" />}
      </div>

      <div>
        <div className={isKamina ? 'badge-loss' : 'badge-warning'} style={{ marginBottom: '8px', fontSize: '0.75rem', letterSpacing: '0.06em' }}>
          {isKamina ? 'THE KAMINA CONCLAVE' : 'PEACEFUL SLEEP'}
        </div>
        <h1 className="text-headline" style={{ color: '#ffffff', fontSize: '1.45rem', marginBottom: '6px' }}>
          {isKamina ? 'CHOOSE YOUR TARGET' : 'THE HAVELI RESTS'}
        </h1>
        <p style={{ fontSize: '0.8125rem', color: '#94A3B8', maxWidth: '340px', lineHeight: 1.45 }}>
          {isKamina
            ? 'Whisper quietly. Select an innocent guest to assassinate tonight.'
            : 'You are resting in your chambers. Keep your eyes lowered and pray for the morning sun...'}
        </p>
      </div>

      {/* Kamina Murder Selection UI */}
      {isKamina ? (
        <div style={{ width: '100%', maxWidth: '380px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="text-label" style={{ color: '#94A3B8', textAlign: 'left', marginBottom: '4px', fontSize: '0.75rem' }}>
            AVAILABLE TARGETS ({potentialVictims.length}):
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {potentialVictims.map(victim => {
              const avatar = getAvatarById(victim.avatarId);
              const isSelectedByMe = mySelectedTarget === victim.id;

              return (
                <button
                  key={victim.id}
                  type="button"
                  onClick={() => handleTargetClick(victim.id)}
                  className="spring-btn"
                  aria-label={`Target ${victim.name}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    minHeight: '60px',
                    borderRadius: 'var(--rounded-xl)',
                    background: isSelectedByMe ? 'rgba(239, 68, 68, 0.22)' : '#080808',
                    border: isSelectedByMe ? '2px solid var(--loss)' : '1px solid #1a1a1a',
                    color: '#ffffff',
                    boxShadow: isSelectedByMe ? 'var(--shadow-glow-loss)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <AvatarBadge avatar={avatar} size={38} />
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.9375rem', color: '#ffffff' }}>{victim.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{avatar.name}</div>
                    </div>
                  </div>

                  <div>
                    {isSelectedByMe ? (
                      <span className="badge-loss" style={{ fontSize: '0.75rem', fontWeight: 800 }}>
                        <Crosshair size={14} /> MARKED
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Select</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {mySelectedTarget && (
            <div style={{
              background: '#0d0d0d',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 'var(--rounded-lg)',
              padding: '12px',
              fontSize: '0.8125rem',
              color: '#ffffff',
              marginTop: '8px'
            }}>
              Target marked! Waiting for the living room host to break the dawn.
            </div>
          )}
        </div>
      ) : (
        /* Bhola Sleep Screen */
        <div style={{
          width: '100%',
          maxWidth: '360px',
          background: '#080808',
          borderRadius: 'var(--rounded-2xl)',
          padding: '36px 20px',
          border: '1px solid rgba(229, 184, 105, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div className="animate-heartbeat" style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'rgba(229, 184, 105, 0.1)',
            border: '1px solid rgba(229, 184, 105, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary)'
          }}>
            <Moon size={40} strokeWidth={2.2} />
          </div>
          <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary)' }}>
            The Haveli is Silent
          </div>
          <p style={{ fontSize: '0.8125rem', color: '#94A3B8', lineHeight: 1.5 }}>
            Do not make noise or reveal that you are checking your screen.
            When the gong strikes, morning will be announced on the living room screen.
          </p>
        </div>
      )}
    </div>
  );
}
