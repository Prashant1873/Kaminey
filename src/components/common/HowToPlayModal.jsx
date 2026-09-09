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
      title: 'QR Scan & Join',
      desc: 'Scan the room QR code on the TV screen with your phone camera, choose your codename, and pick your avatar.'
    },
    {
      step: '02',
      icon: Moon,
      title: 'Night Phase & Cover Missions',
      desc: 'Darkness falls on the estate. The secret Kaminey coordinate to eliminate a target under cover of night missions and tasks.'
    },
    {
      step: '03',
      icon: MessageSquare,
      title: 'Dawn Report & Council Debate',
      desc: 'The big screen reveals who was eliminated. Players question suspicious behavior, challenge body language, and present alibis.'
    },
    {
      step: '04',
      icon: Scale,
      title: 'Secret Ballot & Exile',
      desc: 'Cast an anonymous vote on your phone to exile a suspected Kamina, or vote to skip if evidence is inconclusive.'
    }
  ];

  const roles = [
    {
      title: 'The Innocents (Bhole)',
      badge: 'INNOCENT',
      glowClass: 'bhola-card-glow',
      icon: ShieldCheck,
      color: 'var(--primary)',
      desc: 'Work together to spot deception, challenge inconsistent alibis, and vote out every Kamina at the council.'
    },
    {
      title: 'The Traitors (Kaminey)',
      badge: 'TRAITOR',
      glowClass: 'kamina-card-glow',
      icon: Skull,
      color: 'var(--loss-text)',
      desc: 'Coordinate silent eliminations during the night, blend in during discussions, and avoid council exile.'
    },
    {
      title: 'Spectators (Ghosts)',
      badge: 'SPECTATOR',
      glowClass: '',
      icon: Ghost,
      color: '#94A3B8',
      desc: 'Eliminated players who watch the game unfold. No speaking allowed, but you can send live reactions to the big screen.'
    }
  ];

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 7, 12, 0.72)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px 16px',
        boxSizing: 'border-box'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--surface-container-lowest)',
          border: '1px solid var(--outline-variant)',
          borderRadius: 'var(--rounded-2xl)',
          maxWidth: '720px',
          width: '100%',
          maxHeight: '88vh',
          overflowY: 'auto',
          boxShadow: 'var(--shadow-floating)',
          boxSizing: 'border-box',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Architectural Window Header Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 24px',
          borderBottom: '1px solid var(--outline-variant)',
          background: 'var(--surface-container-low)',
          borderTopLeftRadius: 'var(--rounded-2xl)',
          borderTopRightRadius: 'var(--rounded-2xl)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--rounded-md)',
              background: 'var(--primary-subtle)',
              border: '1px solid var(--primary-subtle-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary)'
            }}>
              <Sparkles size={16} strokeWidth={2.4} />
            </div>
            <div>
              <div className="text-label" style={{ color: 'var(--primary)', letterSpacing: '0.08em' }}>
                ✦ HOW TO PLAY ✦
              </div>
              <h2 className="text-title" style={{ fontSize: '1.25rem', color: 'var(--on-surface)', margin: 0 }}>
                Rules of Engagement
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="spring-btn"
            aria-label="Close rules guide"
            style={{
              width: '38px',
              height: '38px',
              minWidth: '38px',
              minHeight: '38px',
              borderRadius: 'var(--rounded-lg)',
              background: 'var(--surface)',
              border: '1px solid var(--outline-variant)',
              color: 'var(--on-surface-variant)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0
            }}
          >
            <X size={18} strokeWidth={2.2} />
          </button>
        </div>

        {/* Modal Body Content */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '26px' }}>
          {/* Intro statement */}
          <div style={{
            background: 'var(--surface-container)',
            border: '1px solid var(--outline-variant)',
            borderRadius: 'var(--rounded-xl)',
            padding: '16px 18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
          }}>
            <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--on-surface)' }}>
              Two Factions, One Mystery: Spot the Traitors Before They Strike
            </div>
            <p style={{ fontSize: '0.84375rem', color: 'var(--on-surface-variant)', lineHeight: 1.5, margin: 0 }}>
              The TV host screen runs the live game board. Your phone acts as your private controller for secret roles, assignments, and anonymous votes.
            </p>
          </div>

          {/* Gameplay Loop: Timeline Sequence */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '14px'
            }}>
              <span className="text-label" style={{ color: 'var(--on-surface-variant)', letterSpacing: '0.06em' }}>
                ROUND STRUCTURE (4 PHASES)
              </span>
              <span className="text-label" style={{ color: 'var(--primary)' }}>
                REPEATS EACH ROUND
              </span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '12px'
            }}>
              {steps.map((s) => {
                const IconComp = s.icon;
                return (
                  <div
                    key={s.step}
                    style={{
                      background: 'var(--surface-container-low)',
                      border: '1px solid var(--outline-variant)',
                      borderRadius: 'var(--rounded-xl)',
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                      position: 'relative'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: 'var(--rounded-md)',
                          background: 'var(--primary-subtle)',
                          border: '1px solid var(--primary-subtle-border)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--primary)'
                        }}>
                          <IconComp size={16} strokeWidth={2.2} />
                        </div>
                        <span style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--on-surface)' }}>
                          {s.title}
                        </span>
                      </div>
                      <span className="tabular-nums" style={{
                        fontSize: '0.6875rem',
                        fontWeight: 800,
                        color: 'var(--primary)',
                        background: 'var(--primary-subtle)',
                        padding: '2px 8px',
                        borderRadius: 'var(--rounded-sm)',
                        letterSpacing: '0.05em'
                      }}>
                        PHASE {s.step}
                      </span>
                    </div>

                    <p style={{
                      fontSize: '0.8125rem',
                      color: 'var(--on-surface-variant)',
                      lineHeight: 1.5,
                      margin: 0
                    }}>
                      {s.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Faction Dossiers */}
          <div>
            <div style={{ marginBottom: '14px' }}>
              <span className="text-label" style={{ color: 'var(--on-surface-variant)', letterSpacing: '0.06em' }}>
                FACTIONS & ROLES
              </span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '12px'
            }}>
              {roles.map((r) => {
                const IconComp = r.icon;
                return (
                  <div
                    key={r.title}
                    className={r.glowClass}
                    style={{
                      background: 'var(--surface-container-low)',
                      border: '1px solid var(--outline-variant)',
                      borderRadius: 'var(--rounded-xl)',
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: 'var(--rounded-md)',
                          background: `${r.color}15`,
                          border: `1px solid ${r.color}35`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: r.color,
                          flexShrink: 0
                        }}>
                          <IconComp size={18} strokeWidth={2.2} />
                        </div>
                        <div style={{ fontWeight: 800, fontSize: '0.9375rem', color: r.color }}>
                          {r.title}
                        </div>
                      </div>
                      <span style={{ fontSize: '0.6875rem', fontWeight: 700, opacity: 0.85 }}>
                        {r.badge}
                      </span>
                    </div>
                    <p style={{
                      fontSize: '0.8125rem',
                      color: 'var(--on-surface-variant)',
                      lineHeight: 1.45,
                      margin: 0
                    }}>
                      {r.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Footer Bar */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid var(--outline-variant)',
          background: 'var(--surface-container-low)',
          display: 'flex',
          justifyContent: 'flex-end',
          borderBottomLeftRadius: 'var(--rounded-2xl)',
          borderBottomRightRadius: 'var(--rounded-2xl)'
        }}>
          <button
            type="button"
            onClick={onClose}
            className="btn-primary spring-btn"
            aria-label="Understood, return to game"
            style={{ minHeight: '44px', padding: '10px 24px', fontSize: '0.875rem' }}
          >
            <CheckCircle2 size={16} />
            <span>Got It, Let's Play!</span>
          </button>
        </div>
      </div>
    </div>
  );
}
