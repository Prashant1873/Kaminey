import React from 'react';
import { Shuffle, Wine, Sun, Sparkles, Moon } from 'lucide-react';
import { getAvatarById } from '../../data/animalAvatars';
import AvatarBadge from '../common/AvatarBadge';

export default function HostDares({
  mission,
  players = [],
  onReshuffle,
  onOpenDrinksBreather,
  onBreakDawn
}) {
  const alivePlayers = players.filter(p => p.isAlive && !p.isExiled);

  return (
    <div style={{
      maxWidth: '1100px',
      margin: '0 auto',
      padding: '24px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      textAlign: 'center',
      color: '#ffffff'
    }}>
      {/* Top Night Conclave Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.08), rgba(15, 18, 30, 0.95))',
        borderRadius: 'var(--rounded-xl)',
        padding: '18px 22px',
        border: '1.5px solid rgba(239, 68, 68, 0.25)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.6)'
      }}>
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
          marginBottom: '6px'
        }}>
          <Moon size={13} color="var(--loss-text)" />
          <span>{mission?.badge ? `NIGHT COVER: ${mission.badge}` : 'NIGHT CONCLAVE: COVER MISSION'}</span>
        </div>

        <h1 className="text-display" style={{ color: '#ffffff', marginBottom: '4px' }}>
          {mission?.title || 'GROUP DISTRACTION TASK'}
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem', maxWidth: '720px', margin: '0 auto', lineHeight: 1.5 }}>
          Darkness envelopes the Haveli. Complete this mission together to generate chaos and noise, creating the perfect cover for the Kaminey to strike before dawn breaks.
        </p>
      </div>

      {/* Main Mission Showcase Card */}
      <div className="card-interactive" style={{
        padding: '28px 24px',
        maxWidth: '850px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        background: 'rgba(18, 22, 34, 0.85)'
      }}>
        <div style={{
          fontSize: '1.35rem',
          fontWeight: 800,
          color: 'var(--primary)',
          lineHeight: 1.45
        }}>
          "{mission?.mission}"
        </div>

        {mission?.prompt && (
          <div style={{
            background: 'var(--primary-subtle)',
            borderLeft: '4px solid var(--primary)',
            padding: '12px 16px',
            borderRadius: '0 var(--rounded-md) var(--rounded-md) 0',
            fontSize: '0.875rem',
            color: 'var(--on-surface-variant)',
            textAlign: 'left',
            fontStyle: 'italic',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Sparkles size={16} color="var(--primary)" style={{ flexShrink: 0 }} />
            <span><strong>Mission Directive:</strong> {mission.prompt}</span>
          </div>
        )}

        {/* Action Controls: Reshuffle, Own Thing (Drinks Breather), Break Dawn */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '12px',
          marginTop: '8px',
          paddingTop: '16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          {/* Reshuffle Button */}
          <button
            type="button"
            onClick={onReshuffle}
            className="btn-secondary spring-btn"
            style={{
              padding: '14px',
              fontSize: '0.9375rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              background: 'rgba(255, 255, 255, 0.06)',
              color: '#CBD5E1'
            }}
            title="Roll another random party mission"
          >
            <Shuffle size={18} />
            <span>Shuffle Mission</span>
          </button>

          {/* Free Socialize / Drinks Breather Page */}
          <button
            type="button"
            onClick={onOpenDrinksBreather}
            className="btn-secondary spring-btn"
            style={{
              padding: '14px',
              fontSize: '0.9375rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              background: 'rgba(229, 184, 105, 0.12)',
              color: '#e5b869',
              border: '1px solid rgba(229, 184, 105, 0.3)'
            }}
            title="Open dedicated party drinks & chill lounge breather"
          >
            <Wine size={18} />
            <span>Free Party / Drinks Breather</span>
          </button>

          {/* Mission Accomplished -> Break Dawn */}
          <button
            type="button"
            onClick={onBreakDawn}
            className="btn-danger spring-btn"
            style={{
              padding: '16px',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              gridColumn: '1 / -1'
            }}
          >
            <Sun size={19} />
            <span>Mission Complete: Break Dawn & Reveal Casualty</span>
          </button>
        </div>
      </div>

      {/* Living Room Guests Roster */}
      <div style={{ maxWidth: '850px', margin: '0 auto', width: '100%' }}>
        <div className="text-label" style={{ color: '#94a3b8', marginBottom: '10px', textAlign: 'left' }}>
          SUSPECTS PARTICIPATING IN THE HAVELI ({alivePlayers.length})
        </div>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          justifyContent: 'flex-start'
        }}>
          {alivePlayers.map(p => {
            return (
              <div
                key={p.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(18, 22, 34, 0.8)',
                  padding: '6px 12px',
                  borderRadius: 'var(--rounded-lg)',
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}
              >
                <AvatarBadge avatarId={p.avatarId} size={28} />
                <span style={{ fontSize: '0.84rem', fontWeight: 600, color: '#F1F5F9' }}>{p.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
