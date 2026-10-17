import React, { useState, useRef } from 'react';
import { Eye, EyeOff, ShieldAlert, ShieldCheck, Skull, Lock } from 'lucide-react';
import { getAvatarById } from '../../data/animalAvatars';
import AvatarBadge from '../common/AvatarBadge';

export default function PlayerRoleReveal({ role, kamineyPartners = [] }) {
  const [isHolding, setIsHolding] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const isRevealed = isHolding || isSticky;
  const pressStartTimeRef = useRef(0);
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

  const handlePointerDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    if (e.cancelable) e.preventDefault();
    pressStartTimeRef.current = Date.now();

    try {
      if (e.currentTarget?.setPointerCapture && e.pointerId !== undefined) {
        e.currentTarget.setPointerCapture(e.pointerId);
      }
    } catch (err) {}

    setIsHolding(true);
    triggerHaptic([40, 50]);
  };

  const handlePointerUp = (e) => {
    if (e.cancelable) e.preventDefault();
    try {
      if (e.currentTarget?.hasPointerCapture?.(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch (err) {}

    const pressDuration = Date.now() - pressStartTimeRef.current;
    if (pressDuration < 250) {
      // Quick tap: toggle sticky reveal
      setIsSticky((prev) => {
        const next = !prev;
        triggerHaptic(next ? [35, 45] : [25]);
        return next;
      });
      setIsHolding(false);
    } else {
      // Hold release: conceal if not pinned open
      setIsHolding(false);
      if (!isSticky) {
        triggerHaptic([25]);
      }
    }
  };

  const handlePointerCancel = (e) => {
    try {
      if (e.currentTarget?.hasPointerCapture?.(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch (err) {}
    setIsHolding(false);
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  const toggleStickyReveal = (e) => {
    e?.stopPropagation?.();
    setIsSticky((prev) => {
      const next = !prev;
      triggerHaptic(next ? [35, 45] : [25]);
      return next;
    });
  };

  const concealIdentity = (e) => {
    e?.stopPropagation?.();
    setIsHolding(false);
    setIsSticky(false);
    triggerHaptic([25]);
  };

  return (
    <div
      onContextMenu={handleContextMenu}
      style={{
        width: '100%',
        maxWidth: '420px',
        margin: '0 auto',
        padding: '20px 14px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '16px',
        boxSizing: 'border-box',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none'
      }}
    >
      {/* Warning Notice */}
      <div className="badge-warning" style={{ padding: '6px 14px', fontSize: '0.75rem', letterSpacing: '0.04em' }}>
        <ShieldAlert size={14} />
        <span>KEEP SCREEN CONCEALED FROM OTHERS</span>
      </div>

      <div>
        <h1 className="text-headline" style={{ color: 'var(--on-surface)', marginBottom: '4px' }}>
          SECRET DOSSIER
        </h1>
        <p className="text-body" style={{ color: 'var(--on-surface-variant)', fontSize: '0.8125rem' }}>
          Press and hold the wax seal, or tap to inspect your secret faction.
        </p>
      </div>

      {/* 3D Touch & Hold Wax Envelope Card */}
      <div style={{ perspective: '1200px', width: '100%' }}>
        <div
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          onPointerLeave={handlePointerCancel}
          onContextMenu={handleContextMenu}
          className="secret-reveal-box spring-settle-in"
          style={{
            width: '100%',
            minHeight: '320px',
            position: 'relative',
            transformStyle: 'preserve-3d',
            transform: isRevealed ? 'rotateY(180deg)' : 'rotateY(0deg)',
            transition: 'transform 0.38s var(--spring-timing-apple)',
            cursor: 'pointer',
            touchAction: 'none',
            WebkitTouchCallout: 'none',
            userSelect: 'none',
            WebkitUserSelect: 'none'
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
            <div className="cheeky-avatar" style={{
              width: '88px',
              height: '88px',
              borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 35%, #E5B869 0%, #9E2A2B 85%)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(158, 42, 43, 0.5), inset 0 2px 6px rgba(255, 255, 255, 0.4)',
              transition: 'transform 0.15s ease'
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
                HOLD OR TAP TO REVEAL
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--on-surface-variant)', marginTop: '4px', maxWidth: '260px' }}>
                Hold down to peek, or tap to keep open while reading.
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
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: isKamina ? 'rgba(239, 68, 68, 0.15)' : 'var(--primary-subtle)',
              border: isKamina ? '1.5px solid rgba(239, 68, 68, 0.4)' : '1.5px solid var(--primary-subtle-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {isKamina ? (
                <Skull size={40} color="var(--loss-text)" strokeWidth={2.2} />
              ) : (
                <ShieldCheck size={40} color="var(--primary)" strokeWidth={2.2} />
              )}
            </div>

            <div>
              <div className="text-label" style={{ color: isKamina ? 'var(--loss-text)' : 'var(--primary)', letterSpacing: '0.12em' }}>
                YOUR SECRET IDENTITY
              </div>
              <div style={{
                fontSize: '1.65rem',
                fontWeight: 900,
                color: isKamina ? 'var(--loss-text)' : '#FFFFFF',
                letterSpacing: '0.04em'
              }}>
                {isKamina ? 'YOU ARE A KAMINA (TRAITOR)' : 'YOU ARE A BHOLA (INNOCENT)'}
              </div>
            </div>

            <p style={{ fontSize: '0.8125rem', lineHeight: 1.45, color: '#CBD5E1', maxWidth: '300px' }}>
              {isKamina
                ? 'Strike in the shadows during the night, and blend in as an innocent during council debates.'
                : 'Survive the night, investigate suspicious statements, and banish the traitors.'}
            </p>

            {/* If Kamina, reveal fellow traitors */}
            {isKamina && kamineyPartners.length > 0 && (
              <div style={{
                marginTop: '4px',
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

            {/* Quick Conceal button on card back */}
            <button
              type="button"
              onClick={concealIdentity}
              className="card-interactive"
              style={{
                marginTop: '4px',
                padding: '6px 14px',
                borderRadius: 'var(--rounded-full)',
                background: 'rgba(255, 255, 255, 0.12)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                color: '#FFFFFF',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                touchAction: 'manipulation'
              }}
            >
              <EyeOff size={14} />
              <span>Conceal Immediately</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tap-to-Toggle Control Button */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '100%' }}>
        <button
          type="button"
          onClick={toggleStickyReveal}
          className="card-interactive"
          style={{
            width: '100%',
            maxWidth: '300px',
            padding: '11px 16px',
            borderRadius: 'var(--rounded-xl)',
            background: isRevealed ? 'var(--surface-container-high)' : 'var(--primary-subtle)',
            border: isRevealed ? '1.5px solid var(--outline-variant)' : '1.5px solid var(--primary-subtle-border)',
            color: isRevealed ? 'var(--on-surface)' : 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontSize: '0.875rem',
            fontWeight: 700,
            cursor: 'pointer',
            touchAction: 'manipulation',
            boxShadow: isRevealed ? 'none' : 'var(--shadow-resting)'
          }}
        >
          {isRevealed ? <EyeOff size={16} /> : <Eye size={16} />}
          <span>{isRevealed ? 'Conceal Dossier (Hide)' : 'Tap to Reveal & Keep Open'}</span>
        </button>

        <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)', maxWidth: '320px', lineHeight: 1.4 }}>
          {isRevealed
            ? 'Dossier open. Tap button above or card to conceal before others glance.'
            : 'Hold wax seal to peek, or tap button above to read comfortably.'}
        </div>
      </div>
    </div>
  );
}
