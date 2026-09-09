import React from 'react';
import { Shield, EyeOff, ArrowRight } from 'lucide-react';
import { getAvatarById } from '../../data/animalAvatars';

export default function HostRoleReveal({ players, onProceed }) {
  return (
    <div style={{
      maxWidth: '900px',
      margin: '0 auto',
      padding: '40px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      gap: '28px'
    }}>
      <div style={{
        width: '80px',
        height: '80px',
        borderRadius: 'var(--rounded-full)',
        background: 'linear-gradient(135deg, var(--primary-container), var(--primary))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '2.5rem',
        boxShadow: 'var(--shadow-glow-primary)',
        animation: 'pulse-subtle 2s infinite'
      }}>
        ✉️
      </div>

      <div>
        <h1 className="text-display" style={{ color: 'var(--primary)', marginBottom: '12px' }}>
          SECRET ROLES DELIVERED
        </h1>
        <p className="text-headline" style={{ color: 'var(--on-surface)', maxWidth: '650px', margin: '0 auto', fontWeight: 600 }}>
          Check your mobile screens now!
        </p>
        <p className="text-body" style={{ color: 'var(--loss-text)', marginTop: '8px', fontWeight: 700 }}>
          ⚠️ Keep your phone hidden. Some of you are Bhole... and some are Kaminey!
        </p>
      </div>

      {/* Grid of Players checking their phones */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
        gap: '14px',
        width: '100%',
        maxWidth: '700px'
      }}>
        {players.map(p => {
          const avatar = getAvatarById(p.avatarId);
          return (
            <div
              key={p.id}
              className="card-interactive"
              style={{
                padding: '16px 12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <div style={{ fontSize: '2rem' }}>{avatar.emoji}</div>
              <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{p.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--gain-text)', fontWeight: 600 }}>
                Envelope Delivered
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onProceed}
        className="btn-primary spring-btn"
        style={{
          padding: '16px 36px',
          fontSize: '1.125rem',
          marginTop: '10px'
        }}
      >
        <span>All Roles Viewed — Let Night Fall</span>
        <ArrowRight size={20} />
      </button>
    </div>
  );
}
