import React, { useState, useEffect } from 'react';
import { getAvatarById } from '../../data/animalAvatars';
import AvatarBadge from '../common/AvatarBadge';
import { Shield, Skull, ArrowRight, Sparkles, Scale, ShieldCheck, Frown } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../../audio/soundEffects';
import Button from '../common/Button';

export default function HostExile({ exiledPlayer, role, onProceed }) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    sounds.playGavel();
    // Auto-reveal identity after 3.5 seconds of suspense
    const timer = setTimeout(() => {
      setRevealed(true);
      if (role === 'kamina') {
        sounds.playVictory();
        try {
          confetti({
            particleCount: 110,
            spread: 75,
            origin: { y: 0.6 }
          });
        } catch (e) {}
      } else {
        sounds.playDramaticStinger();
      }
    }, 3500);

    return () => clearTimeout(timer);
  }, [role]);

  const avatar = exiledPlayer ? getAvatarById(exiledPlayer.avatarId) : null;
  const isKamina = role === 'kamina';

  return (
    <div className="spring-settle-in" style={{
      maxWidth: '900px',
      margin: '0 auto',
      padding: '40px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      gap: '32px'
    }}>
      {exiledPlayer && avatar ? (
        <>
          <div className="spring-settle-in" style={{
            width: '96px',
            height: '96px',
            borderRadius: 'var(--rounded-full)',
            background: 'linear-gradient(135deg, var(--loss), var(--loss-text))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-glow-loss)'
          }}>
            <Scale size={48} color="#ffffff" />
          </div>

          <div>
            <div className="badge-loss" style={{
              marginBottom: '8px',
              fontSize: '0.75rem',
              padding: '6px 16px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              borderRadius: 'var(--rounded-full)',
              letterSpacing: '0.05em'
            }}>
              <Scale size={14} />
              <span>ROYAL COUNCIL VERDICT</span>
            </div>
            <h1 className="text-display" style={{ color: 'var(--on-surface)', marginBottom: '6px' }}>
              {exiledPlayer.name} HAS BEEN EXILED!
            </h1>
            <p style={{ color: 'var(--on-surface-variant)', fontSize: '1rem' }}>
              Unmasking dossier records... Bhola or Kamina?
            </p>
          </div>

          {/* Suspense Reveal Box with Frosted Glass & Peak-End Stamp Slam */}
          <div
            className="card-interactive spring-settle-in"
            style={{
              padding: '40px 32px',
              maxWidth: '540px',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '18px',
              borderRadius: 'var(--rounded-3xl)',
              backgroundColor: revealed
                ? (isKamina ? 'rgba(16, 185, 129, 0.16)' : 'rgba(239, 68, 68, 0.16)')
                : 'var(--surface-container)',
              border: revealed
                ? (isKamina ? '2px solid var(--gain)' : '2px solid var(--loss)')
                : '1px solid var(--outline-variant)',
              boxShadow: revealed
                ? (isKamina ? '0 0 36px rgba(16, 185, 129, 0.35)' : '0 0 36px rgba(239, 68, 68, 0.35)')
                : 'var(--shadow-resting)',
              transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            <AvatarBadge avatarId={exiledPlayer.avatarId} size={88} />

            <div style={{ fontSize: '1.85rem', fontWeight: 800 }}>
              {exiledPlayer.name}
            </div>

            {!revealed ? (
              <div style={{
                fontSize: '1.25rem',
                color: 'var(--primary)',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                animation: 'pulse-subtle 1.2s infinite'
              }}>
                <span>Inspecting royal wax seals...</span>
              </div>
            ) : (
              <div className="spring-settle-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                <div className="spring-stamp-slam" style={{
                  fontSize: '2rem',
                  fontWeight: 900,
                  letterSpacing: '0.05em',
                  color: isKamina ? 'var(--gain-text)' : 'var(--loss-text)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px'
                }}>
                  {isKamina ? <Skull size={36} strokeWidth={2.4} /> : <ShieldCheck size={36} strokeWidth={2.4} />}
                  <span>{isKamina ? 'GUILTY: A TRUE KAMINA!' : 'INNOCENT: A TRUE BHOLA!'}</span>
                </div>
                <p style={{ fontSize: '0.95rem', color: 'var(--on-surface-variant)', fontWeight: 600, maxWidth: '440px', lineHeight: 1.5 }}>
                  {isKamina
                    ? 'A decisive victory for the Bhole! A dangerous conspirator has been banished from the Haveli.'
                    : 'A tragic miscalculation! The Kaminey tricked the council, and an innocent Bhola was cast out.'}
                </p>
              </div>
            )}
          </div>
        </>
      ) : (
        /* Tied or Skipped Vote */
        <div className="spring-settle-in" style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <div style={{
            width: '96px',
            height: '96px',
            borderRadius: 'var(--rounded-full)',
            background: 'var(--primary-subtle)',
            border: '1.5px solid var(--primary-subtle-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Scale size={52} color="var(--primary)" />
          </div>
          <h1 className="text-display" style={{ color: 'var(--primary)' }}>
            COUNCIL TIED: NO EXILE
          </h1>
          <p className="text-body" style={{ color: 'var(--on-surface-variant)', fontSize: '1rem' }}>
            Ballots ended in an exact tie or majority skip. No citizen was banished from the Haveli this round.
          </p>
        </div>
      )}

      {/* Button to proceed */}
      <Button
        variant="primary"
        onClick={onProceed}
        aria-label="Proceed to next round"
        style={{ padding: '16px 36px', fontSize: '1.125rem', minHeight: '56px' }}
      >
        <span>Proceed to Next Round</span>
        <ArrowRight size={20} />
      </Button>
    </div>
  );
}

