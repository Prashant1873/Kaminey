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
      backgroundColor: '#07090E',
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
        background: isKamina ? 'rgba(239, 68, 68, 0.15)' : 'var(--primary-subtle)',
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
          {isKamina ? 'KAMINEY STRIKE' : 'NIGHT FALLS'}
        </div>
        <h1 className="text-headline" style={{ color: '#F8FAFC', fontSize: '1.45rem', marginBottom: '6px' }}>
          {isKamina ? 'CHOOSE A VICTIM TO ELIMINATE' : 'KEEP HEAD DOWN & EYES CLOSED'}
        </h1>
        <p style={{ fontSize: '0.8125rem', color: '#94A3B8', maxWidth: '340px', lineHeight: 1.45 }}>
          {isKamina
            ? 'Coordinate silently with fellow Kaminey. You can vote now, or wait for the cover task when everyone naturally looks at their phones.'
            : 'Night is active. Stay quiet and wait for dawn to break on the big screen.'}
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
                    background: isSelectedByMe ? 'rgba(239, 68, 68, 0.22)' : '#0F131D',
                    border: isSelectedByMe ? '2px solid var(--loss)' : '1px solid #1E2536',
                    color: '#F8FAFC',
                    boxShadow: isSelectedByMe ? 'var(--shadow-glow-loss)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <AvatarBadge avatar={avatar} size={38} />
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.9375rem', color: '#F8FAFC' }}>{victim.name}</div>
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
              background: '#0F131D',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 'var(--rounded-lg)',
              padding: '12px',
              fontSize: '0.8125rem',
              color: '#F8FAFC',
              marginTop: '8px'
            }}>
              Target marked! Waiting for dawn to break on the big screen.
            </div>
          )}
        </div>
      ) : (
        /* Bhola Sleep Screen */
        <div style={{
          width: '100%',
          maxWidth: '360px',
          background: '#0F131D',
          borderRadius: 'var(--rounded-2xl)',
          padding: '36px 20px',
          border: '1px solid #1E2536',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div className="animate-heartbeat" style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'var(--primary-subtle)',
            border: '1px solid var(--primary-subtle-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary)'
          }}>
            <Moon size={40} strokeWidth={2.2} />
          </div>
          <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary)' }}>
            The Haveli is in Silence
          </div>
          <p style={{ fontSize: '0.8125rem', color: '#94A3B8', lineHeight: 1.5 }}>
            Keep your phone flat and maintain a neutral expression.
            The dawn report will appear on the big screen.
          </p>
        </div>
      )}
    </div>
  );
}
