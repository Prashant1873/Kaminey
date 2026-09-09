import React from 'react';
import { Sparkles, MessageCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import { getAvatarById } from '../../data/animalAvatars';

export default function HostDares({ players, onCallDiscussion }) {
  const alivePlayers = players.filter(p => p.isAlive && !p.isExiled);

  return (
    <div style={{
      maxWidth: '1100px',
      margin: '0 auto',
      padding: '30px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '28px',
      textAlign: 'center'
    }}>
      {/* Top Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(0, 61, 155, 0.05), rgba(255, 159, 10, 0.08))',
        borderRadius: 'var(--rounded-xl)',
        padding: '20px 16px',
        border: '1px solid rgba(255, 159, 10, 0.2)'
      }}>
        <div className="badge-warning" style={{ fontSize: '0.75rem', padding: '4px 12px', marginBottom: '8px' }}>
          🎯 SECRET PARTY MISCHIEF
        </div>
        <h1 className="text-display" style={{ color: 'var(--primary)', marginBottom: '4px' }}>
          TASKS IN PROGRESS
        </h1>
        <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.9375rem' }}>
          Guests have received secret dares on their phones. Observe who is acting weird!
        </p>
      </div>

      {/* Alive Guests Grid */}
      <div>
        <div className="text-label" style={{ color: 'var(--on-surface-variant)', marginBottom: '14px' }}>
          LIVING SUSPECTS ROAMING THE HAVELI ({alivePlayers.length})
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: '14px',
          maxWidth: '850px',
          margin: '0 auto'
        }}>
          {alivePlayers.map(p => {
            const avatar = getAvatarById(p.avatarId);
            return (
              <div
                key={p.id}
                className="card-interactive"
                style={{
                  padding: '16px 10px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <div style={{ fontSize: '2.5rem', lineHeight: 1 }}>{avatar.emoji}</div>
                <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{p.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>
                  {avatar.name}
                </div>
                <span className="badge-warning" style={{ fontSize: '0.625rem', marginTop: '4px' }}>
                  Task Assigned
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Call Meeting Action */}
      <div style={{ marginTop: '12px' }}>
        <button
          type="button"
          onClick={onCallDiscussion}
          className="btn-primary spring-btn"
          style={{
            padding: '18px 42px',
            fontSize: '1.25rem',
            boxShadow: '0 12px 32px rgba(0, 61, 155, 0.4)'
          }}
        >
          <AlertTriangle size={22} color="#ffffff" />
          <span>CALL EMERGENCY ROUND-TABLE DISCUSSION</span>
        </button>
        <p style={{ fontSize: '0.8125rem', color: 'var(--on-surface-variant)', marginTop: '8px' }}>
          Brings all players back to the couch to accuse and defend before voting.
        </p>
      </div>
    </div>
  );
}
