import React, { useState, useEffect } from 'react';
import { getAvatarById } from '../../data/animalAvatars';
import { Shield, Skull, ArrowRight, Sparkles } from 'lucide-react';
import { sounds } from '../../audio/soundEffects';

export default function HostExile({ exiledPlayer, role, onProceed }) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    sounds.playGavel();
    // Auto-reveal identity after 3.5 seconds of suspense
    const timer = setTimeout(() => {
      setRevealed(true);
      if (role === 'kamina') {
        sounds.playVictory();
      } else {
        sounds.playDramaticStinger();
      }
    }, 3500);

    return () => clearTimeout(timer);
  }, [role]);

  const avatar = exiledPlayer ? getAvatarById(exiledPlayer.avatarId) : null;
  const isKamina = role === 'kamina';

  return (
    <div style={{
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
          <div style={{
            width: '90px',
            height: '90px',
            borderRadius: 'var(--rounded-full)',
            background: 'linear-gradient(135deg, var(--loss), var(--loss-text))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.5rem',
            boxShadow: 'var(--shadow-glow-loss)'
          }}>
            ⚖️
          </div>

          <div>
            <div className="text-label" style={{ color: 'var(--loss-text)', marginBottom: '8px' }}>
              THE VERDICT OF THE ROUND-TABLE
            </div>
            <h1 className="text-display" style={{ color: 'var(--on-surface)', marginBottom: '8px' }}>
              {exiledPlayer.name} HAS BEEN BANISHED
            </h1>
            <p className="text-body" style={{ color: 'var(--on-surface-variant)', maxWidth: '600px', margin: '0 auto' }}>
              By democratic vote of the haveli, the gates are locked behind them. But did you catch a traitor, or banish an innocent?
            </p>
          </div>

          {/* Suspense Reveal Box */}
          <div
            className="card-interactive"
            style={{
              padding: '36px 30px',
              maxWidth: '520px',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
              backgroundColor: revealed
                ? (isKamina ? 'rgba(0, 240, 144, 0.08)' : 'rgba(255, 86, 48, 0.08)')
                : 'var(--surface-container-lowest)',
              border: revealed
                ? (isKamina ? '2px solid var(--gain)' : '2px solid var(--loss)')
                : '1px solid var(--outline-variant)',
              transition: 'all 0.5s ease'
            }}
          >
            <div style={{ fontSize: '4.5rem', lineHeight: 1 }}>
              {avatar.emoji}
            </div>

            <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>
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
                <span>Checking secret records...</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 900,
                  letterSpacing: '0.05em',
                  color: isKamina ? 'var(--gain-text)' : 'var(--loss-text)'
                }}>
                  {isKamina ? '🎭 WAS A KAMINA!' : '💔 WAS A BHOLA!'}
                </div>
                <p style={{ fontSize: '0.9375rem', color: 'var(--on-surface-variant)', fontWeight: 600 }}>
                  {isKamina
                    ? 'Huge victory for the innocents! One traitor has been rooted out.'
                    : 'A tragic mistake! An innocent Bhola was falsely accused and cast out.'}
                </p>
              </div>
            )}
          </div>
        </>
      ) : (
        /* Tied or Skipped Vote */
        <div style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <div style={{ fontSize: '4rem' }}>⚖️</div>
          <h1 className="text-display" style={{ color: 'var(--primary)' }}>
            NO ONE WAS EXILED
          </h1>
          <p className="text-body" style={{ color: 'var(--on-surface-variant)' }}>
            The vote ended in a tie or the majority chose to Skip. The haveli gates remain open and everyone stays for another night.
          </p>
        </div>
      )}

      {/* Button to proceed */}
      <button
        type="button"
        onClick={onProceed}
        className="btn-primary spring-btn"
        style={{ padding: '16px 36px', fontSize: '1.125rem' }}
      >
        <span>Continue Haveli Mystery</span>
        <ArrowRight size={20} />
      </button>
    </div>
  );
}
