import React, { useEffect } from 'react';
import { Sun, Skull, ShieldCheck, ArrowRight } from 'lucide-react';
import { getAvatarById } from '../../data/animalAvatars';
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
        <div className="badge-loss" style={{ color: victim ? 'var(--loss-text)' : 'var(--gain-text)', marginBottom: '6px', fontSize: '0.75rem', padding: '4px 12px' }}>
          {victim ? '🩸 BLOOD AT DAWN' : '🛡️ MORNING LIGHT'}
        </div>
        <h1 className="text-display" style={{ color: 'var(--on-surface)', marginBottom: '6px' }}>
          {victim ? `${victim.name.toUpperCase()} WAS KILLED!` : 'NO ONE WAS MURDERED!'}
        </h1>
        <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.9375rem' }}>
          {victim ? 'One chair was found empty at breakfast...' : 'Everyone survived the night unharmed.'}
        </p>
      </div>

      {/* Victim Card */}
      {victim && victimAvatar ? (
        <div
          className="card-interactive"
          style={{
            padding: '24px 20px',
            maxWidth: '420px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            border: '2px solid rgba(255, 86, 48, 0.3)',
            backgroundColor: '#fff9f8',
            boxSizing: 'border-box'
          }}
        >
          <div style={{
            fontSize: '4rem',
            lineHeight: 1,
            filter: 'grayscale(50%)'
          }}>
            {victimAvatar.emoji}
          </div>
          <div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--loss-text)' }}>
              {victim.name}
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--on-surface-variant)', fontWeight: 600 }}>
              {victimAvatar.name} ({victimAvatar.title})
            </div>
          </div>
          <div className="badge-loss" style={{ fontSize: '0.75rem', padding: '4px 12px' }}>
            MURDERED BY KAMINEY
          </div>
        </div>
      ) : (
        <div
          className="card-interactive"
          style={{
            padding: '24px 20px',
            maxWidth: '420px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
            border: '2px solid rgba(54, 179, 126, 0.3)',
            backgroundColor: '#f6fbf8',
            boxSizing: 'border-box'
          }}
        >
          <ShieldCheck size={48} color="var(--gain-text)" />
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--gain-text)' }}>
            All Guests Survived
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
        <span>CONTINUE TO COUNCIL 📢</span>
        <ArrowRight size={18} />
      </button>
    </div>
  );
}
