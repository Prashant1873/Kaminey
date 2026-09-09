import React from 'react';
import { Shuffle, Wine, AlertTriangle, CheckCircle2, Users, Sparkles } from 'lucide-react';
import { getAvatarById } from '../../data/animalAvatars';
import AvatarBadge from '../common/AvatarBadge';

export default function HostDares({
  mission,
  players,
  onReshuffle,
  onDoOurOwnThing,
  onCallDiscussion
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
      textAlign: 'center'
    }}>
      {/* Top Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(0, 61, 155, 0.05), rgba(255, 159, 10, 0.08))',
        borderRadius: 'var(--rounded-xl)',
        padding: '16px 20px',
        border: '1px solid rgba(255, 159, 10, 0.2)'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: mission?.categoryColor ? `${mission.categoryColor}18` : 'rgba(255, 159, 10, 0.15)',
          color: mission?.categoryColor || 'var(--warning-text)',
          border: `1px solid ${mission?.categoryColor || 'var(--warning)'}40`,
          borderRadius: 'var(--rounded-full)',
          padding: '4px 14px',
          fontSize: '0.8125rem',
          fontWeight: 800,
          letterSpacing: '0.04em',
          marginBottom: '6px'
        }}>
          {mission?.badge || 'HAVELI TEAM MISSION'}
        </div>

        <h1 className="text-display" style={{ color: 'var(--on-surface)', marginBottom: '4px' }}>
          {mission?.title || 'FULL ROOM ACTIVITY'}
        </h1>
        <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.875rem' }}>
          Everyone participates together in real life! Watch how people react, speak, and deflect.
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
        border: '1px solid rgba(255, 255, 255, 0.1)'
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
            background: 'rgba(229, 184, 105, 0.08)',
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
            <span><strong>Director's Note:</strong> {mission.prompt}</span>
          </div>
        )}

        {/* Action Controls: Reshuffle, Own Thing, Proceed to Council */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '12px',
          marginTop: '8px',
          paddingTop: '16px',
          borderTop: '1px solid var(--outline-variant)'
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
              gap: '8px'
            }}
            title="Roll another random party mission"
          >
            <Shuffle size={18} />
            <span>Reshuffle Task</span>
          </button>

          {/* Do Our Own Thing Button */}
          <button
            type="button"
            onClick={onDoOurOwnThing}
            className="btn-secondary spring-btn"
            style={{
              padding: '14px',
              fontSize: '0.9375rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              background: 'var(--surface-container-high)'
            }}
            title="Skip app task and chill with drinks/discussion on your own"
          >
            <Wine size={18} />
            <span>We'll Do Our Own Thing</span>
          </button>

          {/* Mission Accomplished -> Emergency Council */}
          <button
            type="button"
            onClick={onCallDiscussion}
            className="btn-primary spring-btn"
            style={{
              padding: '14px',
              fontSize: '0.9375rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              gridColumn: '1 / -1'
            }}
          >
            <AlertTriangle size={18} />
            <span>Mission Done! Call Emergency Council</span>
          </button>
        </div>
      </div>

      {/* Living Room Guests Roster */}
      <div style={{ maxWidth: '850px', margin: '0 auto', width: '100%' }}>
        <div className="text-label" style={{ color: 'var(--on-surface-variant)', marginBottom: '10px', textAlign: 'left' }}>
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
                  background: 'var(--surface-container-high)',
                  border: '1px solid var(--outline-variant)',
                  borderRadius: 'var(--rounded-full)',
                  padding: '6px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.8125rem',
                  fontWeight: 600
                }}
              >
                <AvatarBadge avatarId={p.avatarId} size={22} />
                <span>{p.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
