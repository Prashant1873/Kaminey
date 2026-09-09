import React, { useEffect } from 'react';
import { Moon, Skull, EyeOff, ShieldAlert, ArrowRight } from 'lucide-react';
import { sounds } from '../../audio/soundEffects';

export default function HostNight({ onProceed, nightMurderSelected }) {
  useEffect(() => {
    // Play dramatic heartbeat and stinger at nightfall
    sounds.playDramaticStinger();
    const interval = setInterval(() => {
      sounds.playHeartbeat();
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="theme-simsim-night" style={{
      minHeight: '80vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      textAlign: 'center',
      gap: '32px'
    }}>
      {/* Glowing Moon / Blood Icon */}
      <div style={{
        width: '110px',
        height: '110px',
        borderRadius: 'var(--rounded-full)',
        background: 'radial-gradient(circle, #2a0808 0%, #070A12 70%)',
        border: '2px solid var(--loss)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: 'var(--shadow-glow-loss)',
        animation: 'float-slow 4s infinite ease-in-out'
      }}>
        <Moon size={54} color="var(--loss)" />
      </div>

      <div style={{ maxWidth: '700px' }}>
        <div className="badge-loss" style={{ marginBottom: '12px', fontSize: '0.875rem', padding: '6px 16px' }}>
          THE NIGHT CONCLAVE
        </div>
        <h1 className="text-display" style={{ color: '#ffffff', marginBottom: '16px', letterSpacing: '-0.02em' }}>
          NIGHT HAS FALLEN OVER THE HAVELI
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#9aa0a6', lineHeight: 1.5 }}>
          The innocents sleep in their quarters.
          <br />
          Meanwhile, the <strong style={{ color: 'var(--loss)' }}>Kaminey</strong> are whispering in the shadows, choosing their next sacrifice...
        </p>
      </div>

      {/* Atmospheric Night Indicator */}
      <div style={{
        background: '#121827',
        border: '1px solid rgba(255, 86, 48, 0.25)',
        borderRadius: 'var(--rounded-2xl)',
        padding: '24px 36px',
        maxWidth: '520px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '14px',
        boxShadow: '0 12px 36px rgba(0,0,0,0.5)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: 'var(--rounded-full)',
            backgroundColor: nightMurderSelected ? 'var(--simsim-neon)' : 'var(--loss)',
            boxShadow: nightMurderSelected ? 'var(--shadow-glow-neon)' : 'var(--shadow-glow-loss)',
            animation: 'pulse-subtle 1.2s infinite'
          }} />
          <span style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>
            {nightMurderSelected ? 'Target Marked in the Shadows' : 'Kaminey are deliberating on mobile...'}
          </span>
        </div>
        <p style={{ fontSize: '0.875rem', color: '#80868b' }}>
          Silence in the living room. Look down at your personal phone.
        </p>
      </div>

      {/* Host Control to Wake Haveli */}
      <button
        type="button"
        onClick={onProceed}
        className="btn-danger spring-btn"
        style={{
          padding: '16px 36px',
          fontSize: '1.125rem'
        }}
      >
        <Skull size={20} />
        <span>Sunrise Approaches — Announce Morning</span>
      </button>
    </div>
  );
}
