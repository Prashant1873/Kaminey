import React, { useEffect } from 'react';
import { Moon, Skull, EyeOff, ShieldAlert, ArrowRight, Sun, Crosshair, Target } from 'lucide-react';
import { sounds } from '../../audio/soundEffects';

export default function HostNight({
  onProceed,
  nightMurderSelected,
  hasDares = false
}) {
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
      backgroundColor: 'transparent',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      textAlign: 'center',
      gap: '32px'
    }}>
      {/* Sneaky Eyes Delight Animation in Background */}
      <div style={{
        display: 'flex',
        gap: '40px',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}>
        {/* Glowing Moon / Blood Icon */}
        <div style={{
          width: '110px',
          height: '110px',
          borderRadius: 'var(--rounded-full)',
          background: 'radial-gradient(circle, #2a0404 0%, #050608 75%)',
          border: '2px solid var(--loss)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-glow-loss)',
          animation: 'float-slow 4s infinite ease-in-out',
          position: 'relative'
        }}>
          <Moon size={54} color="var(--loss)" />
        </div>

        {/* Sneaky Blinking Eyes lurking in the dark */}
        <div style={{
          position: 'absolute',
          right: '-70px',
          top: '20px',
          display: 'flex',
          gap: '8px',
          animation: 'sneaky-blink 3.2s infinite ease-in-out'
        }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#EF4444', boxShadow: '0 0 10px #EF4444' }} />
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#EF4444', boxShadow: '0 0 10px #EF4444' }} />
        </div>
      </div>

      <div style={{ maxWidth: '600px' }}>
        <div className="badge-loss" style={{
          marginBottom: '8px',
          fontSize: '0.8125rem',
          padding: '4px 14px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <Moon size={14} />
          <span>NIGHT CONCLAVE</span>
        </div>
        <h1 className="text-display" style={{ color: '#ffffff', marginBottom: '8px' }}>
          NIGHT FALLS ON THE HAVELI
        </h1>
        <p style={{ fontSize: '1.05rem', color: '#9aa0a6' }}>
          Silence descends across the Haveli. All players keep eyes closed and heads down.
        </p>
      </div>

      {/* Atmospheric Night Indicator */}
      <div style={{
        background: 'rgba(18, 21, 31, 0.95)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 'var(--rounded-xl)',
        padding: '18px 24px',
        maxWidth: '480px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        boxShadow: '0 16px 40px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.06)',
        boxSizing: 'border-box'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: 'var(--rounded-full)',
            backgroundColor: 'var(--loss)',
            boxShadow: '0 0 10px rgba(239, 68, 68, 0.6)',
            animation: 'pulse-subtle 2s infinite'
          }} />
          <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#ffffff' }}>
            Haveli Shrouded in Darkness
          </span>
        </div>
        <div style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>
          Keep phones down and remain silent until the Host advances.
        </div>
      </div>

      {/* Host Control to Advance */}
      <button
        type="button"
        onClick={onProceed}
        className="btn-danger spring-btn"
        style={{
          padding: '16px 32px',
          fontSize: '1.0625rem',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        {hasDares ? (
          <>
            <Moon size={18} />
            <span>Launch Night Cover Mission & Dares</span>
          </>
        ) : (
          <>
            <Sun size={18} />
            <span>Wake Up Haveli: Reveal Dawn Report</span>
          </>
        )}
      </button>
    </div>
  );
}
