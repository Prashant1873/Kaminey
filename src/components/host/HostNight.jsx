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

      <div style={{ maxWidth: '600px' }}>
        <div className="badge-loss" style={{ marginBottom: '8px', fontSize: '0.8125rem', padding: '4px 14px' }}>
          🌙 THE MIDNIGHT CONCLAVE
        </div>
        <h1 className="text-display" style={{ color: '#ffffff', marginBottom: '8px' }}>
          NIGHT IN THE HAVELI
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#9aa0a6' }}>
          Innocents sleep. <strong style={{ color: 'var(--loss)' }}>Kaminey</strong> are whispering in secret...
        </p>
      </div>

      {/* Atmospheric Night Indicator */}
      <div style={{
        background: '#121827',
        border: '1px solid rgba(255, 86, 48, 0.25)',
        borderRadius: 'var(--rounded-xl)',
        padding: '18px 24px',
        maxWidth: '480px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
        boxShadow: '0 12px 36px rgba(0,0,0,0.5)',
        boxSizing: 'border-box'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '10px',
            height: '10px',
            borderRadius: 'var(--rounded-full)',
            backgroundColor: nightMurderSelected ? 'var(--simsim-neon)' : 'var(--loss)',
            boxShadow: nightMurderSelected ? 'var(--shadow-glow-neon)' : 'var(--shadow-glow-loss)',
            animation: 'pulse-subtle 1.2s infinite'
          }} />
          <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#ffffff' }}>
            {nightMurderSelected ? 'Target Marked in the Shadows 🎯' : 'Kaminey are voting on their phones...'}
          </span>
        </div>
        <div style={{ fontSize: '0.8125rem', color: '#80868b' }}>
          Eyes on your own screen!
        </div>
      </div>

      {/* Host Control to Wake Haveli */}
      <button
        type="button"
        onClick={onProceed}
        className="btn-danger spring-btn"
        style={{
          padding: '16px 32px',
          fontSize: '1.0625rem'
        }}
      >
        <Skull size={18} />
        <span>BREAK THE DAWN 🌅</span>
      </button>
    </div>
  );
}
