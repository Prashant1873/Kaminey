import React, { useState, useEffect } from 'react';
import { getAvatarById } from '../../data/animalAvatars';
import AvatarBadge from '../common/AvatarBadge';
import { Shield, Skull, ArrowRight, Sparkles, Scale, ShieldCheck, Frown } from 'lucide-react';
import confetti from 'canvas-confetti';
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
        try {
          confetti({
            particleCount: 100,
            spread: 70,
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
            boxShadow: 'var(--shadow-glow-loss)'
          }}>
            <Scale size={44} color="#ffffff" />
          </div>

          <div>
            <div className="badge-loss" style={{
              marginBottom: '6px',
              fontSize: '0.75rem',
              padding: '4px 14px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Scale size={14} />
              <span>⚖️ HAVELI KA FAISLA</span>
            </div>
            <h1 className="text-display" style={{ color: 'var(--on-surface)', marginBottom: '4px' }}>
              {exiledPlayer.name} KO HAVELI SE DHAKKA MILA!
            </h1>
            <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.9375rem' }}>
              Kundli khol rahe hain... Bhola nikla ya Kamina?
            </p>
          </div>

          {/* Suspense Reveal Box with Frosted Glass */}
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
                ? (isKamina ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)')
                : 'var(--surface-container)',
              border: revealed
                ? (isKamina ? '2px solid var(--gain)' : '2px solid var(--loss)')
                : '1px solid var(--outline-variant)',
              boxShadow: revealed
                ? (isKamina ? '0 0 32px rgba(16, 185, 129, 0.25)' : '0 0 32px rgba(239, 68, 68, 0.25)')
                : 'var(--shadow-resting)',
              transition: 'all 0.5s ease'
            }}
          >
            <AvatarBadge avatarId={exiledPlayer.avatarId} size={84} />

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
                <span>Jasoosi records check ho rahe hain...</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div className="stamp-slam-effect" style={{
                  fontSize: '2rem',
                  fontWeight: 900,
                  letterSpacing: '0.05em',
                  color: isKamina ? 'var(--gain-text)' : 'var(--loss-text)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px'
                }}>
                  {isKamina ? <Skull size={32} /> : <ShieldCheck size={32} />}
                  <span>{isKamina ? '🔥 ASLI KAMINA THA!' : '🤦‍♂️ MASOOM BHOLA THA!'}</span>
                </div>
                <p style={{ fontSize: '0.9375rem', color: 'var(--on-surface-variant)', fontWeight: 600 }}>
                  {isKamina
                    ? 'Bhole ki jeet! Ek asteen ka saanp Haveli se bahar fek diya gaya!'
                    : 'Bhaari mistake! Kaminey ne sabko ullu banaya aur beqasoor Bhola mara gaya!'}
                </p>
              </div>
            )}
          </div>
        </>
      ) : (
        /* Tied or Skipped Vote */
        <div style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <div style={{
            width: '90px',
            height: '90px',
            borderRadius: 'var(--rounded-full)',
            background: 'var(--primary-subtle)',
            border: '1px solid var(--primary-subtle-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Scale size={50} color="var(--primary)" />
          </div>
          <h1 className="text-display" style={{ color: 'var(--primary)' }}>
            🤝 TIE HO GAYA! KOI NAHI NIKLA
          </h1>
          <p className="text-body" style={{ color: 'var(--on-surface-variant)' }}>
            Vote barabar rahe ya sabne Skip chuna. Haveli ke darwaze khule hain, raat fir aayegi!
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
        <span>Agla Round Chalu Karo ⏭️</span>
        <ArrowRight size={20} />
      </button>
    </div>
  );
}
