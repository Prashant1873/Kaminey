import React from 'react';
import { Mail, ShieldAlert, ArrowRight, Lock } from 'lucide-react';
import AvatarBadge from '../common/AvatarBadge';

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
        boxShadow: 'var(--shadow-glow-primary)',
        animation: 'pulse-subtle 2s infinite'
      }}>
        <Mail size={36} color="#0A0B0E" />
      </div>

      <div>
        <div className="badge-warning" style={{
          marginBottom: '10px',
          fontSize: '0.75rem',
          padding: '4px 14px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span>🤫 GUPT LIFFAFA DELIVERED</span>
        </div>
        <h1 className="text-display" style={{ color: 'var(--primary)', marginBottom: '10px' }}>
          PARDAFAASH KA WAQT!
        </h1>
        <p className="text-headline" style={{ color: 'var(--on-surface)', maxWidth: '650px', margin: '0 auto', fontWeight: 600 }}>
          Apna apna phone dekho chupke se...
        </p>
        <p className="text-body" style={{
          color: 'var(--loss-text)',
          marginTop: '8px',
          fontWeight: 700,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <ShieldAlert size={18} color="var(--loss-text)" />
          <span>Aas-paas mat jhaanko! Kuch log Bhole hain aur kuch asteen ke Kaminey!</span>
        </p>
      </div>

      {/* Grid of Players checking their phones */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        gap: '14px',
        width: '100%',
        maxWidth: '750px'
      }}>
        {players.map(p => {
          return (
            <div
              key={p.id}
              className="card-interactive"
              style={{
                padding: '18px 12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <AvatarBadge avatarId={p.avatarId} size={48} />
              <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{p.name}</div>
              <div style={{
                fontSize: '0.75rem',
                color: 'var(--gain-text)',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <Lock size={12} />
                <span>Liffafa Delivered</span>
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
        <span>Sabne dekh liya? Haveli mein raat hone do! 🌙</span>
        <ArrowRight size={20} />
      </button>
    </div>
  );
}
