import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { sounds } from '../../audio/soundEffects';

export default function Countdown({ duration, onExpire, active = true, label = 'Time Remaining' }) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (!active) return;
    if (timeLeft <= 0) {
      onExpire?.();
      return;
    }

    // Audible tick in final 10 seconds
    if (timeLeft <= 10 && timeLeft > 0) {
      sounds.playTick();
    }

    const timer = setTimeout(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, active, onExpire]);

  const percentage = Math.max(0, Math.min(100, (timeLeft / duration) * 100));
  const isUrgent = timeLeft <= 10;

  return (
    <div style={{ width: '100%', maxWidth: '500px', margin: '0 auto' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '6px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', fontWeight: 600, color: 'var(--on-surface-variant)' }}>
          <Clock size={16} color={isUrgent ? 'var(--loss)' : 'var(--primary)'} />
          <span>{label}</span>
        </div>
        <div className="tabular-nums" style={{
          fontSize: '1.25rem',
          fontWeight: 800,
          color: isUrgent ? 'var(--loss-text)' : 'var(--primary)',
          letterSpacing: '0.02em'
        }}>
          {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
        </div>
      </div>

      {/* Visual Progress Bar */}
      <div style={{
        width: '100%',
        height: '10px',
        backgroundColor: 'var(--surface-container-high)',
        borderRadius: 'var(--rounded-full)',
        overflow: 'hidden',
        border: '1px solid var(--outline-variant)'
      }}>
        <div style={{
          width: `${percentage}%`,
          height: '100%',
          backgroundColor: isUrgent ? 'var(--loss)' : 'var(--primary-container)',
          borderRadius: 'var(--rounded-full)',
          transition: 'width 1s linear, background-color 0.3s ease'
        }} />
      </div>
    </div>
  );
}
