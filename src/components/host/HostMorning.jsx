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
        <div className="text-label" style={{ color: victim ? 'var(--loss-text)' : 'var(--gain-text)', marginBottom: '8px' }}>
          BREAKFAST IN THE HAVELI
        </div>
        <h1 className="text-display" style={{ color: 'var(--on-surface)', marginBottom: '12px' }}>
          {victim ? 'A TRAGEDY HAS OCCURRED' : 'A PEACEFUL NIGHT IN THE HAVELI'}
        </h1>
        <p className="text-body" style={{ color: 'var(--on-surface-variant)', maxWidth: '600px', margin: '0 auto' }}>
          {victim
            ? 'The guests gathered in the courtyard at dawn, but one chair remained empty...'
            : 'Miraculously, the night passed without any bloodshed. All guests survived.'}
        </p>
      </div>

      {/* Victim Card */}
      {victim && victimAvatar ? (
        <div
          className="card-interactive"
          style={{
            padding: '32px',
            maxWidth: '460px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '14px',
            border: '2px solid rgba(255, 86, 48, 0.3)',
            backgroundColor: '#fff9f8'
          }}
        >
          <div style={{
            fontSize: '4.5rem',
            lineHeight: 1,
            filter: 'grayscale(60%) opacity(0.85)'
          }}>
            {victimAvatar.emoji}
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--loss-text)' }}>
              {victim.name}
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)', fontWeight: 600 }}>
              {victimAvatar.name} ({victimAvatar.title})
            </div>
          </div>
          <div className="badge-loss" style={{ fontSize: '0.8125rem', padding: '6px 14px' }}>
            MURDERED BY THE KAMINEY
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--outline)', marginTop: '4px' }}>
            {victim.name} is now a silent Ghost. They may observe but cannot speak during trials.
          </p>
        </div>
      ) : (
        <div
          className="card-interactive"
          style={{
            padding: '32px',
            maxWidth: '460px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            border: '2px solid rgba(54, 179, 126, 0.3)',
            backgroundColor: '#f6fbf8'
          }}
        >
          <ShieldCheck size={54} color="var(--gain-text)" />
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--gain-text)' }}>
            Everyone Survived
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)' }}>
            The Kaminey hesitated or failed to agree on a target. The Bhole breathe a sigh of relief.
          </p>
        </div>
      )}

      {/* Button to proceed to day tasks / discussion */}
      <button
        type="button"
        onClick={onProceed}
        className="btn-primary spring-btn"
        style={{
          padding: '16px 36px',
          fontSize: '1.125rem'
        }}
      >
        <span>Proceed to Tasks & Round-Table</span>
        <ArrowRight size={20} />
      </button>
    </div>
  );
}
