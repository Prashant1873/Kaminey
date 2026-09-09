import React, { useState } from 'react';
import { Wine, Skull, Eye, EyeOff, Crosshair, Sparkles } from 'lucide-react';
import TrippyVisualizer from '../common/TrippyVisualizer';
import AvatarBadge from '../common/AvatarBadge';
import { getAvatarById } from '../../data/animalAvatars';

export default function PlayerDrinksBreather({
  role,
  players = [],
  myPlayerId,
  kamineyPartners = [],
  nightVotes = {},
  onSelectTarget
}) {
  const [showHitList, setShowHitList] = useState(true);
  const isKamina = role === 'kamina';
  const mySelectedTarget = nightVotes?.[myPlayerId] || null;

  const partnerIds = new Set((kamineyPartners || []).map(p => p.id));
  partnerIds.add(myPlayerId);
  const potentialVictims = (players || []).filter(p => p.isAlive && !p.isExiled && !partnerIds.has(p.id));

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
      boxSizing: 'border-box',
      color: '#ffffff'
    }}>
      {/* Category Header */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        background: 'rgba(229, 184, 105, 0.12)',
        color: '#e5b869',
        border: '1px solid rgba(229, 184, 105, 0.3)',
        borderRadius: 'var(--rounded-sm)',
        padding: '4px 10px',
        fontSize: '0.71875rem',
        fontWeight: 800,
        letterSpacing: '0.07em',
        textTransform: 'uppercase',
        margin: '0 auto'
      }}>
        <Wine size={13} color="#e5b869" />
        <span>HAVELI LOUNGE BREATHER</span>
      </div>

      <div>
        <h1 className="text-headline" style={{ color: '#ffffff', marginBottom: '4px' }}>
          DRINKS & CHILL
        </h1>
        <p className="text-body" style={{ color: '#94a3b8', fontSize: '0.8125rem' }}>
          Game paused for refreshments. Mingle, grab drinks, and relax before dawn breaks.
        </p>
      </div>

      {/* Mini Trippy Loop on Mobile */}
      <div style={{ width: '100%' }}>
        <TrippyVisualizer height="200px" allowFullscreen={false} />
      </div>

      {/* Lounge Card */}
      <div className="card-interactive" style={{
        padding: '18px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        textAlign: 'left',
        background: 'rgba(18, 22, 34, 0.85)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 700, fontSize: '0.875rem' }}>
          <Sparkles size={16} />
          <span>Living Room Vibe</span>
        </div>
        <p style={{ fontSize: '0.8125rem', color: '#CBD5E1', lineHeight: 1.5, margin: 0 }}>
          {isKamina
            ? 'Blend in naturally! Grab a drink and joke around with the group so nobody suspects your faction before dawn breaks.'
            : 'Observe other players while they pour drinks. Watch who seems overly casual or avoids eye contact!'}
        </p>
      </div>

      {/* COVERT ASSASSINATION DRAWER (KAMINA ONLY) */}
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
            >
              {showHitList ? <EyeOff size={12} /> : <Eye size={12} />}
              <span>{showHitList ? 'Hide List' : 'Show Targets'}</span>
            </button>
          </div>

          <div style={{ fontSize: '0.75rem', color: '#e0e0e0', lineHeight: 1.4 }}>
            Take advantage of the drinks break to covertly mark your victim before dawn.
          </div>

          {showHitList && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                gap: '8px'
              }}>
                {potentialVictims.map((suspect) => {
                  const avatar = getAvatarById(suspect.avatarId);
                  const isSelected = mySelectedTarget === suspect.id;

                  return (
                    <button
                      key={suspect.id}
                      type="button"
                      onClick={() => onSelectTarget?.(suspect.id)}
                      className="spring-btn"
                      style={{
                        padding: '10px 8px',
                        borderRadius: 'var(--rounded-lg)',
                        background: isSelected ? 'rgba(239, 68, 68, 0.35)' : 'rgba(0, 0, 0, 0.4)',
                        border: isSelected ? '2px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.1)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      <AvatarBadge avatar={avatar} size={36} />
                      <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '110px' }}>
                        {suspect.name}
                      </span>
                      {isSelected ? (
                        <span className="badge-loss" style={{ fontSize: '0.6875rem', fontWeight: 800 }}>
                          <Crosshair size={12} />
                          Targeted
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.6875rem', color: '#888888' }}>
                          Select
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

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
                  Target marked. Verdict executes when the host breaks dawn.
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
