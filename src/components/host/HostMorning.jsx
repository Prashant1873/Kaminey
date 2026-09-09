import React, { useEffect } from 'react';
import { Sun, Skull, ShieldCheck, ArrowRight } from 'lucide-react';
import { getAvatarById } from '../../data/animalAvatars';
import AvatarBadge from '../common/AvatarBadge';
import { sounds } from '../../audio/soundEffects';

export default function HostMorning({ victim, onProceed }) {
  useEffect(() => {
    sounds.playGong();
  }, []);

  const victimAvatar = victim ? getAvatarById(victim.avatarId) : null;

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
      {/* Sun Header */}
      <div style={{
        width: '90px',
        height: '90px',
        borderRadius: 'var(--rounded-full)',
        background: victim ? 'linear-gradient(135deg, #FF5630, #DE350B)' : 'linear-gradient(135deg, #FF9F0A, #FFB300)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: victim ? 'var(--shadow-glow-loss)' : 'var(--shadow-resting)'
      }}>
        {victim ? <Skull size={44} color="#ffffff" /> : <Sun size={44} color="#ffffff" />}
      </div>

      <div>
        <div className={victim ? 'badge-loss' : 'badge-gain'} style={{
          marginBottom: '6px',
          fontSize: '0.75rem',
          padding: '4px 14px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          {victim ? (
            <>
              <Skull size={14} />
              <span>DAWN CASUALTY</span>
            </>
          ) : (
            <>
              <ShieldCheck size={14} />
              <span>PEACEFUL NIGHT</span>
            </>
          )}
        </div>
        <h1 className="text-display" style={{ color: 'var(--on-surface)', marginBottom: '6px' }}>
          {victim ? `${victim.name.toUpperCase()} ELIMINATED!` : 'NO CASUALTIES THIS NIGHT!'}
        </h1>
        <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.9375rem' }}>
          {victim
            ? 'One empty chair at the breakfast table... The Kaminey struck in the dark!'
            : 'The night concluded without incident. All innocents survived!'}
        </p>
      </div>

      {/* Victim Card with Dark Haveli Glass */}
      {victim && victimAvatar ? (
        <div
          className="card-interactive"
          style={{
            padding: '28px 24px',
            maxWidth: '440px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '14px',
            background: 'rgba(239, 68, 68, 0.08)',
            border: '1.5px solid rgba(239, 68, 68, 0.35)',
            boxShadow: 'var(--shadow-elevated), 0 0 32px rgba(239, 68, 68, 0.15)',
            boxSizing: 'border-box'
          }}
        >
          <AvatarBadge avatarId={victim.avatarId} size={76} />
          <div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--loss-text)' }}>
              {victim.name}
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--on-surface-variant)', fontWeight: 600 }}>
              {victimAvatar.name} ({victimAvatar.title})
            </div>
          </div>
          <div className="badge-loss" style={{ fontSize: '0.75rem', padding: '4px 14px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Skull size={14} />
            <span>ELIMINATED BY KAMINEY</span>
          </div>
        </div>
      ) : (
        <div
          className="card-interactive"
          style={{
            padding: '28px 24px',
            maxWidth: '440px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1.5px solid rgba(16, 185, 129, 0.35)',
            boxShadow: 'var(--shadow-elevated), 0 0 32px rgba(16, 185, 129, 0.15)',
            boxSizing: 'border-box'
          }}
        >
          <ShieldCheck size={48} color="var(--gain-text)" />
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--gain-text)' }}>
            Everyone Survived the Night!
          </div>
        </div>
      )}

      {/* Button to proceed to day tasks / discussion */}
      <button
        type="button"
        onClick={onProceed}
        className="btn-primary spring-btn"
        style={{
          padding: '16px 36px',
          fontSize: '1.0625rem'
        }}
      >
        <span>Convene Council: Question the Suspects</span>
        <ArrowRight size={18} />
      </button>
    </div>
  );
}
