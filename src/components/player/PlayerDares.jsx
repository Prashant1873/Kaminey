import React, { useState } from 'react';
import { Sparkles, CheckCircle2, Skull, Eye, EyeOff, Crosshair, ShieldAlert } from 'lucide-react';
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
          {mission?.title || 'GROUP DISTRACTION TASK'}
        </h1>
        <p className="text-body" style={{ color: '#94a3b8', fontSize: '0.8125rem' }}>
          Watch the main TV screen. Everyone participates together to generate cover noise in the dark before dawn breaks.
        </p>
      </div>

      {/* Shared Mission Card (Identical for everyone in the room) */}
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
          <span>{markedReady ? "Task Completed" : "Ready for Dawn"}</span>
        </button>
      </div>

      {/* COVERT ASSASSINATION DRAWER (KAMINA ONLY - Covertly pick murder target while everyone reads task) */}
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
              title="Quickly hide hit list if someone is looking"
            >
              {showHitList ? <EyeOff size={12} /> : <Eye size={12} />}
              <span>{showHitList ? 'Hide' : 'Show'}</span>
            </button>
          </div>

          <p style={{ fontSize: '0.75rem', color: '#c4cbd4', margin: 0 }}>
            While everyone is occupied with the mission, coordinate silently with fellow Kaminey to mark a target.
          </p>

          {showHitList && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
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
                      background: isSelectedByMe ? 'rgba(255, 86, 48, 0.25)' : 'rgba(0, 0, 0, 0.4)',
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
                          Mark Victim
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}

              {mySelectedTarget && (
                <div style={{
                  background: 'rgba(255, 86, 48, 0.15)',
                  border: '1px solid rgba(255, 86, 48, 0.3)',
                  borderRadius: 'var(--rounded-md)',
                  padding: '8px 10px',
                  fontSize: '0.75rem',
                  color: '#ffffff',
                  textAlign: 'center',
                  marginTop: '4px'
                }}>
                  Target marked. Verdict executes when night concludes.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div style={{ fontSize: '0.75rem', color: 'var(--outline)' }}>
        The host will open council debate once everyone is ready.
      </div>
    </div>
  );
}
