import React, { useEffect } from 'react';
import { X, QrCode, Moon, MessageSquare, Scale, ShieldCheck, Skull, Ghost, Sparkles, CheckCircle2 } from 'lucide-react';

export default function HowToPlayModal({ isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const steps = [
    {
      step: '01',
      icon: QrCode,
      title: 'Assemble on TV',
      desc: 'Launch the Base Station on your living room TV or laptop screen. Friends point their phone cameras at the QR code to step into the courtyard.'
    },
    {
      step: '02',
      icon: Moon,
      title: 'The Night Conclave',
      desc: 'All guests lower their heads in silence. The secret Kaminey whisper and select an innocent target on their personal phone screens.'
    },
    {
      step: '03',
      icon: MessageSquare,
      title: 'Daybreak & Debates',
      desc: 'The victim is unmasked on the TV screen. Survive secret party dares, observe fidgety behavior, and challenge suspect alibis around the table.'
    },
    {
      step: '04',
      icon: Scale,
      title: 'The Secret Ballot',
      desc: 'Cast your confidential exile vote on your phone. The court majority decides who gets banished from the haveli.'
    }
  ];

  const roles = [
    {
      title: 'Bhole (Innocent Majority)',
      icon: ShieldCheck,
      color: 'var(--primary)',
      desc: 'Unite the courtyard, observe physical tells, and vote out the conspirators before the innocents are outnumbered.'
    },
    {
      title: 'Kaminey (Secret Traitors)',
      icon: Skull,
      color: 'var(--loss-text)',
      desc: 'Assassinate innocents under cover of night, steer accusations toward others, and conquer the palace.'
    },
    {
      title: 'Spectator Ghosts',
      icon: Ghost,
      color: '#94A3B8',
      desc: 'Eliminated players observe the living room drama in silence and can send subtle ghost signals.'
    }
  ];

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        boxSizing: 'border-box'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(180deg, #151824 0%, #0F1118 100%)',
          border: '1.5px solid rgba(229, 184, 105, 0.2)',
          borderRadius: 'var(--rounded-2xl)',
          maxWidth: '680px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: 'var(--shadow-floating)',
          padding: '28px 24px',
          boxSizing: 'border-box',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(229, 184, 105, 0.1)',
              color: 'var(--primary)',
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '4px 12px',
              borderRadius: 'var(--rounded-full)',
              marginBottom: '8px',
              border: '1px solid rgba(229, 184, 105, 0.2)'
            }}>
              <Sparkles size={12} />
              RULES OF ENGAGEMENT
            </div>
            <h2 className="text-display" style={{ fontSize: '1.75rem', color: 'var(--on-surface)', marginBottom: '4px' }}>
              HOW TO PLAY KAMINEY
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)' }}>
              A high-stakes party game of deception, trust, and living room theatrics.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="spring-btn"
            aria-label="Close rules guide"
            style={{
              width: '44px',
              height: '44px',
              minWidth: '44px',
              minHeight: '44px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: 'var(--on-surface)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* 4 Steps Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="text-label" style={{ color: 'var(--primary)', letterSpacing: '0.06em' }}>
            THE GAMEPLAY LOOP
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '12px'
          }}>
            {steps.map((s) => {
              const IconComp = s.icon;
              return (
                <div
                  key={s.step}
                  style={{
                    background: 'var(--surface-container-low)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: 'var(--rounded-xl)',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: 'var(--rounded-lg)',
                      background: 'rgba(229, 184, 105, 0.12)',
                      border: '1px solid rgba(229, 184, 105, 0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--primary)'
                    }}>
                      <IconComp size={18} strokeWidth={2.2} />
                    </div>
                    <span className="tabular-nums" style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--on-surface-variant)' }}>
                      PHASE {s.step}
                    </span>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--on-surface)' }}>
                    {s.title}
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--on-surface-variant)', lineHeight: 1.45 }}>
                    {s.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Roles Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="text-label" style={{ color: 'var(--primary)', letterSpacing: '0.06em' }}>
            ROLES & FACTIONS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {roles.map((r) => {
              const IconComp = r.icon;
              return (
                <div
                  key={r.title}
                  style={{
                    background: 'var(--surface-container-low)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: 'var(--rounded-xl)',
                    padding: '14px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px'
                  }}
                >
                  <div style={{
                    width: '42px',
                    height: '42px',
                    minWidth: '42px',
                    borderRadius: 'var(--rounded-lg)',
                    background: `${r.color}20`,
                    border: `1px solid ${r.color}40`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: r.color
                  }}>
                    <IconComp size={22} strokeWidth={2.2} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.9375rem', color: r.color }}>
                      {r.title}
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--on-surface-variant)', marginTop: '2px', lineHeight: 1.4 }}>
                      {r.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Bottom */}
        <button
          type="button"
          onClick={onClose}
          className="btn-primary spring-btn"
          aria-label="Understood, close guide"
          style={{ width: '100%', minHeight: '48px', fontSize: '0.9375rem' }}
        >
          <CheckCircle2 size={18} />
          <span>I'M READY TO ENTER THE HAVELI</span>
        </button>
      </div>
    </div>
  );
}
