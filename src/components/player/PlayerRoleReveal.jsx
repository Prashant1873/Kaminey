import React, { useState } from 'react';
import { Eye, EyeOff, ShieldAlert, ShieldCheck, Skull, Key, Lock, Sparkles } from 'lucide-react';
import { getAvatarById } from '../../data/animalAvatars';
import AvatarBadge from '../common/AvatarBadge';

export default function PlayerRoleReveal({ role, kamineyPartners = [] }) {
  const [isRevealed, setIsRevealed] = useState(false);
  const isKamina = role === 'kamina';

  const triggerHaptic = (pattern) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(pattern);
      } catch (e) {
        // Safe failover
      }
    }
  };

  const startPeek = (e) => {
    e.preventDefault();
    if (!isRevealed) {
      setIsRevealed(true);
      triggerHaptic([40, 50]);
    }
  };

  const endPeek = (e) => {
    e.preventDefault();
    if (isRevealed) {
      setIsRevealed(false);
      triggerHaptic([25]);
    }
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '420px',
      margin: '0 auto',
      padding: '20px 14px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      gap: '16px',
      boxSizing: 'border-box'
    }}>
      {/* Warning Notice */}
      <div className="badge-warning" style={{ padding: '6px 14px', fontSize: '0.75rem', letterSpacing: '0.04em' }}>
        <ShieldAlert size={14} />
        <span>TILT PHONE AWAY FROM EYES AROUND YOU</span>
      </div>

      <div>
        <h1 className="text-headline" style={{ color: 'var(--on-surface)', marginBottom: '4px' }}>
          CONFIDENTIAL DOSSIER
        </h1>
        <p className="text-body" style={{ color: 'var(--on-surface-variant)', fontSize: '0.8125rem' }}>
          Hold your finger down on the wax seal below to peek. Release to instantly conceal.
        </p>
      </div>

      {/* 3D Touch & Hold Wax Envelope Card */}
      <div style={{ perspective: '1200px', width: '100%' }}>
        <div
          onMouseDown={startPeek}
          onMouseUp={endPeek}
          onMouseLeave={endPeek}
          onTouchStart={startPeek}
          onTouchEnd={endPeek}
          className="secret-reveal-box"
          style={{
            width: '100%',
            minHeight: '300px',
            position: 'relative',
            transformStyle: 'preserve-3d',
            transform: isRevealed ? 'rotateY(180deg)' : 'rotateY(0deg)',
            transition: 'transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1)',
            cursor: 'pointer',
            touchAction: 'none',
            WebkitTouchCallout: 'none',
            userSelect: 'none'
          }}
        >
          {/* FRONT FACE (Concealed Seal) */}
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            background: 'linear-gradient(180deg, var(--surface-container-high) 0%, var(--surface-container-lowest) 100%)',
            borderRadius: 'var(--rounded-2xl)',
            border: '1.5px solid var(--primary-subtle-border)',
            boxShadow: 'var(--shadow-elevated)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px 16px',
            boxSizing: 'border-box',
            gap: '16px'
          }}>
            {/* Wax Seal Medallion */}
            <div style={{
              width: '88px',
              height: '88px',
              borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 35%, #E5B869 0%, #9E2A2B 85%)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(158, 42, 43, 0.5), inset 0 2px 6px rgba(255, 255, 255, 0.4)'
            }}>
              <Lock size={36} color="#0A0B0E" strokeWidth={2.4} />
            </div>

            <div>
              <div style={{
                fontSize: '1.15rem',
                fontWeight: 800,
                color: 'var(--primary)',
                letterSpacing: '0.06em'
              }}>
                PRESS & HOLD TO UNSEAL
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--on-surface-variant)', marginTop: '4px', maxWidth: '260px' }}>
                Releasing finger conceals the identity instantly
              </p>
            </div>
          </div>

          {/* BACK FACE (Revealed Identity) */}
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: isKamina
              ? 'linear-gradient(180deg, #2D080A 0%, #150506 100%)'
              : 'linear-gradient(180deg, #161D2E 0%, #0D111A 100%)',
            borderRadius: 'var(--rounded-2xl)',
            border: isKamina
              ? '2px solid rgba(239, 68, 68, 0.5)'
              : '2px solid var(--primary-subtle-border)',
            boxShadow: isKamina ? 'var(--shadow-glow-loss)' : 'var(--shadow-glow-primary)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px 16px',
            boxSizing: 'border-box',
            gap: '12px'
          }}>
            <div style={{
              width: '76px',
              height: '76px',
              borderRadius: '50%',
              background: isKamina ? 'rgba(239, 68, 68, 0.15)' : 'var(--primary-subtle)',
              border: isKamina ? '1.5px solid rgba(239, 68, 68, 0.4)' : '1.5px solid var(--primary-subtle-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {isKamina ? (
                <Skull size={44} color="var(--loss-text)" strokeWidth={2.2} />
              ) : (
                <ShieldCheck size={44} color="var(--primary)" strokeWidth={2.2} />
              )}
            </div>

            <div>
              <div className="text-label" style={{ color: isKamina ? 'var(--loss-text)' : 'var(--primary)', letterSpacing: '0.12em' }}>
                CONFIDENTIAL IDENTITY
              </div>
              <div style={{
                fontSize: '1.85rem',
                fontWeight: 900,
                color: isKamina ? 'var(--loss-text)' : '#FFFFFF',
                letterSpacing: '0.04em'
              }}>
                {isKamina ? 'YOU ARE A KAMINA' : 'YOU ARE A BHOLA'}
              </div>
            </div>

            <p style={{ fontSize: '0.8125rem', lineHeight: 1.45, color: 'var(--on-surface-variant)', maxWidth: '300px' }}>
              {isKamina
                ? 'Conspire secretly in the night to murder the Bhole. Deflect suspicion during daylight discussions!'
                : 'Innocent resident of the court. Watch for unusual whispers, complete tasks, and vote out the traitors!'}
            </p>

            {/* If Kamina, reveal fellow traitors */}
            {isKamina && kamineyPartners.length > 0 && (
              <div style={{
                marginTop: '6px',
                width: '100%',
                background: 'rgba(0, 0, 0, 0.4)',
                padding: '8px 12px',
                borderRadius: 'var(--rounded-lg)',
                border: '1px solid rgba(239, 68, 68, 0.25)'
              }}>
                <div className="text-label" style={{ color: 'var(--loss-text)', marginBottom: '6px', fontSize: '0.6875rem' }}>
                  FELLOW TRAITORS ({kamineyPartners.length}):
                </div>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  {kamineyPartners.map(k => {
                    const avatar = getAvatarById(k.avatarId);
                    return (
                      <div
                        key={k.id}
                        style={{
                          background: 'rgba(255, 255, 255, 0.06)',
                          padding: '4px 8px',
                          borderRadius: 'var(--rounded-md)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: '#F8FAFC'
                        }}
                      >
                        <AvatarBadge avatar={avatar} size={18} showRing={false} />
                        <span>{k.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>
        Keep thumb held while reading. Once all guests peek, night will descend on the Haveli.
      </div>
    </div>
  );
}
