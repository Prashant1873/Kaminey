import React, { useState } from 'react';
import { Sparkles, CheckCircle2, Skull, Eye, EyeOff, Crosshair, ShieldAlert, AlertTriangle } from 'lucide-react';
import { getAvatarById } from '../../data/animalAvatars';
import AvatarBadge from '../common/AvatarBadge';

export default function PlayerDares({
  mission,
  role,
  players = [],
  myPlayerId,
  kamineyPartners = [],
  nightVotes = {},
  onSelectTarget,
  onCompleteTask
}) {
  const [markedReady, setMarkedReady] = useState(false);
  const [showHitList, setShowHitList] = useState(true);

  const isKamina = role === 'kamina';
  const mySelectedTarget = nightVotes?.[myPlayerId] || null;

  // Potential murder targets: all living players who are NOT fellow Kaminey
  const partnerIds = new Set((kamineyPartners || []).map(p => p.id));
  partnerIds.add(myPlayerId);
  const potentialVictims = (players || []).filter(p => p.isAlive && !p.isExiled && !partnerIds.has(p.id));

  const handleReady = () => {
    setMarkedReady(true);
    onCompleteTask?.();
  };

  const selectedVictimObj = potentialVictims.find(v => v.id === mySelectedTarget);

  return (
    <div style={{
      width: '100%',
      maxWidth: '440px',
      margin: '0 auto',
      padding: '16px 14px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      textAlign: 'center',
      boxSizing: 'border-box'
    }}>
      {/* Category Header */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        background: 'rgba(239, 68, 68, 0.12)',
        color: 'var(--loss-text)',
        border: '1px solid rgba(239, 68, 68, 0.25)',
        borderRadius: 'var(--rounded-sm)',
        padding: '4px 10px',
        fontSize: '0.71875rem',
        fontWeight: 800,
        letterSpacing: '0.07em',
        textTransform: 'uppercase',
        margin: '0 auto'
      }}>
        {mission?.badge ? `NIGHT COVER: ${mission.badge}` : 'NIGHT CONCLAVE: COVER MISSION'}
      </div>

      <div>
        <h1 className="text-headline" style={{ color: '#ffffff', marginBottom: '4px' }}>
          {mission?.title || 'NIGHT COVER MISSION'}
        </h1>
        <p className="text-body" style={{ color: '#94a3b8', fontSize: '0.8125rem', lineHeight: 1.45 }}>
          Eyes on your phone! Read your task below and participate with the room. Tap <strong>Ready for Dawn</strong> once you are set.
        </p>
      </div>

      {/* Duo Trial Role-Specific Spotlight (Suspect vs Jury) */}
      {mission?.isDuo && mission?.assignedPair?.length >= 2 && (() => {
        const isSuspect = mission.assignedPair.some(p => p.id === myPlayerId);
        const partner = mission.assignedPair.find(p => p.id !== myPlayerId);

        return isSuspect ? (
          <div style={{
            background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.25), rgba(180, 83, 9, 0.15))',
            border: '2px solid #F59E0B',
            borderRadius: 'var(--rounded-xl)',
            padding: '14px 16px',
            textAlign: 'left',
            color: '#FFFFFF',
            boxShadow: '0 0 20px rgba(245, 158, 11, 0.25)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge-warning" style={{ fontSize: '0.75rem', fontWeight: 800 }}>
                🔥 YOU ARE ON TRIAL
              </span>
              {partner && (
                <span style={{ fontSize: '0.75rem', color: '#FDE68A' }}>
                  Facing off with: <strong>{partner.name}</strong>
                </span>
              )}
            </div>
            <div style={{ fontSize: '0.84rem', color: '#F1F5F9', lineHeight: 1.45 }}>
              The living room is watching your every breath. Stay composed, keep a straight face, and convince the Haveli you are innocent!
            </div>
          </div>
        ) : (
          <div style={{
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(109, 40, 217, 0.12))',
            border: '1.5px solid #8B5CF6',
            borderRadius: 'var(--rounded-xl)',
            padding: '14px 16px',
            textAlign: 'left',
            color: '#FFFFFF'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{
                background: 'rgba(139, 92, 246, 0.25)',
                color: '#C4B5FD',
                borderRadius: 'var(--rounded-sm)',
                padding: '3px 8px',
                fontSize: '0.71875rem',
                fontWeight: 800
              }}>
                ⚖️ YOU ARE THE JURY
              </span>
              <span style={{ fontSize: '0.75rem', color: '#DDD6FE' }}>
                Suspects: <strong>{mission.assignedPair[0].name}</strong> & <strong>{mission.assignedPair[1].name}</strong>
              </span>
            </div>
            <div style={{ fontSize: '0.84rem', color: '#E2E8F0', lineHeight: 1.45 }}>
              <strong>What to watch for:</strong> {mission.observerTip || 'Look for nervous eye darts, fidgeting, delayed answers, or involuntary smirks.'}
            </div>
          </div>
        );
      })()}

      {/* COVERT ASSASSINATION PANEL (KAMINA ONLY) - PROMINENT AT TOP */}
      {isKamina && (
        <div style={{
          background: 'linear-gradient(135deg, #1c0707, #2c0d0d)',
          borderRadius: 'var(--rounded-2xl)',
          padding: '16px',
          border: '2px solid var(--loss)',
          color: '#ffffff',
          boxShadow: 'var(--shadow-glow-loss)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          textAlign: 'left',
          boxSizing: 'border-box'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Skull size={18} color="var(--loss)" />
              <span style={{ fontWeight: 800, fontSize: '0.875rem', color: 'var(--loss)', letterSpacing: '0.04em' }}>
                COVERT HITLIST (KAMINEY ONLY)
              </span>
            </div>

            {/* Quick Peeker Hide Button */}
            <button
              type="button"
              onClick={() => setShowHitList(!showHitList)}
              className="spring-btn"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                color: '#ffffff',
                borderRadius: 'var(--rounded-md)',
                padding: '4px 8px',
                fontSize: '0.6875rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer'
              }}
              title="Quickly hide hitlist if someone looks at your phone"
            >
              {showHitList ? <EyeOff size={12} /> : <Eye size={12} />}
              <span>{showHitList ? 'Hide Hitlist' : 'Show Hitlist'}</span>
            </button>
          </div>

          {/* Tactical Warning Banner */}
          <div style={{
            background: 'rgba(239, 68, 68, 0.18)',
            border: '1.5px solid var(--loss)',
            borderRadius: 'var(--rounded-lg)',
            padding: '10px 12px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px'
          }}>
            <ShieldAlert size={20} color="var(--loss)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '0.8rem', color: '#ffffff', lineHeight: 1.45 }}>
              <strong style={{ color: '#fca5a5', display: 'block', marginBottom: '2px', letterSpacing: '0.04em' }}>
                VOTE WHILE READING THIS TASK
              </strong>
              Eliminate your victim right now while everyone is naturally looking at their phones. Once dawn breaks, your mark will be eliminated!
            </div>
          </div>

          {showHitList && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
              <div style={{ fontSize: '0.75rem', color: '#cbd5e1', fontWeight: 600 }}>
                Select a suspect to eliminate before dawn:
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {potentialVictims.map(victim => {
                  const avatar = getAvatarById(victim.avatarId);
                  const isSelectedByMe = mySelectedTarget === victim.id;

                  // Check if a partner voted for this victim
                  const partnerVoters = Object.entries(nightVotes || {})
                    .filter(([voterId, targetId]) => voterId !== myPlayerId && targetId === victim.id)
                    .map(([voterId]) => kamineyPartners.find(p => p.id === voterId)?.name || 'Partner');

                  return (
                    <button
                      key={victim.id}
                      type="button"
                      onClick={() => onSelectTarget?.(victim.id)}
                      className="spring-btn"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 12px',
                        borderRadius: 'var(--rounded-xl)',
                        background: isSelectedByMe ? 'rgba(255, 86, 48, 0.28)' : 'rgba(0, 0, 0, 0.45)',
                        border: isSelectedByMe ? '2px solid var(--loss)' : '1px solid rgba(255, 86, 48, 0.25)',
                        color: '#ffffff',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <AvatarBadge avatar={avatar} size={34} />
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.9375rem' }}>{victim.name}</div>
                          <div style={{ fontSize: '0.6875rem', color: '#9aa0a6' }}>
                            {avatar.name}
                            {partnerVoters.length > 0 && (
                              <span style={{ color: 'var(--loss)', marginLeft: '6px', fontWeight: 700 }}>
                                ● Marked by {partnerVoters.join(', ')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div>
                        {isSelectedByMe ? (
                          <span className="badge-loss" style={{ fontSize: '0.6875rem', fontWeight: 800 }}>
                            <Crosshair size={12} /> MARKED
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: 'var(--loss)', fontWeight: 700 }}>
                            Eliminate
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {selectedVictimObj ? (
                <div style={{
                  background: 'rgba(255, 86, 48, 0.18)',
                  border: '1px solid rgba(255, 86, 48, 0.35)',
                  borderRadius: 'var(--rounded-md)',
                  padding: '8px 10px',
                  fontSize: '0.75rem',
                  color: '#ffffff',
                  textAlign: 'center',
                  marginTop: '4px'
                }}>
                  Target locked: <strong>{selectedVictimObj.name}</strong>. Casualty executes at dawn.
                </div>
              ) : (
                <div style={{
                  background: 'rgba(239, 68, 68, 0.12)',
                  border: '1px dashed rgba(239, 68, 68, 0.4)',
                  borderRadius: 'var(--rounded-md)',
                  padding: '8px 10px',
                  fontSize: '0.75rem',
                  color: '#fca5a5',
                  textAlign: 'center',
                  marginTop: '4px'
                }}>
                  No victim marked yet. Tap a player above before the task ends!
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Shared Mission Card (Instructions on phone) */}
      <div className="card-interactive" style={{
        padding: '22px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        textAlign: 'left',
        background: 'rgba(18, 22, 34, 0.85)'
      }}>
        <div style={{
          fontSize: '1.15rem',
          fontWeight: 800,
          color: '#ffffff',
          lineHeight: 1.45,
          textAlign: 'center'
        }}>
          "{mission?.mission}"
        </div>

        {mission?.prompt && (
          <div style={{
            background: 'var(--primary-subtle)',
            borderLeft: '3px solid var(--primary)',
            padding: '10px 12px',
            borderRadius: '0 var(--rounded-md) var(--rounded-md) 0',
            fontSize: '0.8125rem',
            color: 'var(--on-surface-variant)',
            fontStyle: 'italic',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Sparkles size={14} color="var(--primary)" style={{ flexShrink: 0 }} />
            <span>{mission.prompt}</span>
          </div>
        )}

        <button
          type="button"
          onClick={handleReady}
          className={markedReady ? 'btn-secondary spring-btn' : 'btn-primary spring-btn'}
          style={{
            width: '100%',
            padding: '14px',
            marginTop: '4px',
            backgroundColor: markedReady ? 'var(--gain)' : undefined,
            color: markedReady ? '#ffffff' : undefined
          }}
        >
          <CheckCircle2 size={18} />
          <span>{markedReady ? "Ready for Dawn (Sent to TV ✓)" : "Ready for Dawn"}</span>
        </button>
      </div>

      <div style={{ fontSize: '0.75rem', color: 'var(--outline)' }}>
        Your status updates on the TV screen. Host will break dawn once everyone is ready!
      </div>
    </div>
  );
}
