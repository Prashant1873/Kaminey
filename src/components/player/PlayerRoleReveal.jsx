import React, { useState } from 'react';
import { Eye, EyeOff, ShieldAlert, ShieldCheck } from 'lucide-react';
import { getAvatarById } from '../../data/animalAvatars';

export default function PlayerRoleReveal({ role, kamineyPartners = [] }) {
  const [isRevealed, setIsRevealed] = useState(false);
  const isKamina = role === 'kamina';

  const startPeek = () => setIsRevealed(true);
  const endPeek = () => setIsRevealed(false);

  return (
    <div style={{
      maxWidth: '440px',
      margin: '0 auto',
      padding: '24px 16px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      gap: '20px'
    }}>
      {/* Warning Notice */}
      <div className="badge-loss" style={{ padding: '8px 14px', fontSize: '0.8125rem' }}>
        <ShieldAlert size={16} />
        <span>Look away from other players' screens!</span>
      </div>

      <h1 className="text-display" style={{ color: 'var(--primary)', fontSize: '1.75rem' }}>
        YOUR SECRET ROLE
      </h1>
      <p className="text-body" style={{ color: 'var(--on-surface-variant)' }}>
        Press and hold the envelope below to peek at your confidential identity.
        Release your finger to instantly hide it again.
      </p>

      {/* Touch & Hold Wax Envelope Card */}
      <div
        onMouseDown={startPeek}
        onMouseUp={endPeek}
        onMouseLeave={endPeek}
        onTouchStart={startPeek}
        onTouchEnd={endPeek}
        className="card-interactive secret-reveal-box"
        style={{
          width: '100%',
          minHeight: '340px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px 20px',
          background: isRevealed
            ? (isKamina ? 'linear-gradient(135deg, #1c0505, #2f0b0b)' : 'linear-gradient(135deg, #051b34, #082950)')
            : 'var(--surface-container-lowest)',
          color: isRevealed ? '#ffffff' : 'var(--on-surface)',
          border: isRevealed
            ? (isKamina ? '2px solid var(--loss)' : '2px solid var(--primary-container)')
            : '2px dashed var(--outline-variant)',
          cursor: 'pointer',
          boxShadow: isRevealed
            ? (isKamina ? 'var(--shadow-glow-loss)' : 'var(--shadow-glow-primary)')
            : 'var(--shadow-resting)',
          transition: 'all 0.25s ease'
        }}
      >
        {!isRevealed ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
            <div style={{
              fontSize: '4.5rem',
              lineHeight: 1,
              filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.15))'
            }}>
              💌
            </div>
            <div style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              color: 'var(--primary)',
              letterSpacing: '0.04em'
            }}>
              PRESS & HOLD TO PEEK
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--outline)', maxWidth: '240px' }}>
              Only you can see this. Keep your phone tilted away from nearby players.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', width: '100%' }}>
            <div style={{
              fontSize: '4.5rem',
              lineHeight: 1,
              animation: 'pulse-subtle 1.2s infinite'
            }}>
              {isKamina ? '🎭' : '🕊️'}
            </div>

            <div>
              <div className="text-label" style={{ color: isKamina ? 'var(--loss)' : 'var(--secondary-container)', letterSpacing: '0.1em' }}>
                CONFIDENTIAL IDENTITY
              </div>
              <div style={{
                fontSize: '2.25rem',
                fontWeight: 900,
                color: isKamina ? 'var(--loss)' : '#ffffff',
                letterSpacing: '0.05em'
              }}>
                {isKamina ? 'YOU ARE A KAMINA' : 'YOU ARE A BHOLA'}
              </div>
            </div>

            <p style={{ fontSize: '0.875rem', lineHeight: 1.5, color: '#e0e6ed', maxWidth: '320px' }}>
              {isKamina
                ? 'Conspire secretly in the night to murder the Bhole. Blend in and deflect suspicion during daytime discussions!'
                : 'You are an innocent resident of the haveli. Complete your party tasks, watch for weird behavior, and exile the Kaminey!'}
            </p>

            {/* If Kamina, reveal fellow traitors */}
            {isKamina && kamineyPartners.length > 0 && (
              <div style={{
                marginTop: '10px',
                width: '100%',
                background: 'rgba(255, 255, 255, 0.08)',
                padding: '12px',
                borderRadius: 'var(--rounded-lg)',
                border: '1px solid rgba(255, 86, 48, 0.3)'
              }}>
                <div className="text-label" style={{ color: 'var(--loss)', marginBottom: '8px' }}>
                  YOUR FELLOW KAMINEY ({kamineyPartners.length}):
                </div>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  {kamineyPartners.map(k => {
                    const avatar = getAvatarById(k.avatarId);
                    return (
                      <div
                        key={k.id}
                        style={{
                          background: 'rgba(0,0,0,0.3)',
                          padding: '6px 10px',
                          borderRadius: 'var(--rounded-md)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '0.8125rem',
                          fontWeight: 700
                        }}
                      >
                        <span>{avatar.emoji}</span>
                        <span>{k.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ fontSize: '0.8125rem', color: 'var(--outline)' }}>
        When everyone is done peeking, the living room host will start the night.
      </div>
    </div>
  );
}
