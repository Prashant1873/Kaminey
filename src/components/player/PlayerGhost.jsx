import React, { useState } from 'react';
import { Ghost, Sparkles, Eye } from 'lucide-react';

export default function PlayerGhost({ playerName, isExiled }) {
  const [reactionSent, setReactionSent] = useState('');
  const emojis = ['👻', '😱', '😂', '🕵️', '🍿', '💀', '🔥', '👏'];

  const sendReaction = (emoji) => {
    setReactionSent(emoji);
    setTimeout(() => setReactionSent(''), 1500);
  };

  return (
    <div style={{
      maxWidth: '420px',
      margin: '0 auto',
      padding: '36px 16px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      gap: '24px'
    }}>
      <div style={{
        width: '80px',
        height: '80px',
        borderRadius: 'var(--rounded-full)',
        background: 'rgba(67, 70, 84, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '3rem',
        animation: 'float-slow 3s infinite ease-in-out'
      }}>
        👻
      </div>

      <div>
        <span className="badge-loss" style={{ fontSize: '0.75rem', marginBottom: '8px' }}>
          SPECTATOR GHOST MODE
        </span>
        <h1 className="text-headline" style={{ color: 'var(--on-surface)', marginBottom: '6px' }}>
          YOU ARE NOW A GHOST
        </h1>
        <p className="text-body" style={{ color: 'var(--on-surface-variant)', fontSize: '0.875rem' }}>
          {isExiled
            ? 'You were banished by the round-table vote.'
            : 'You were eliminated during the night by the Kaminey.'}
          <br />
          <strong>Silence in the haveli!</strong> Ghosts may observe the living room drama but cannot speak or vote.
        </p>
      </div>

      {/* Fun Ghost Emoji Reactions */}
      <div className="card-interactive" style={{ width: '100%', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--primary)' }}>
          GHOST SPECTATOR REACTIONS:
        </div>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {emojis.map(e => (
            <button
              key={e}
              type="button"
              onClick={() => sendReaction(e)}
              className="spring-btn"
              style={{
                fontSize: '1.75rem',
                background: 'var(--surface-container-low)',
                padding: '8px 12px',
                borderRadius: 'var(--rounded-lg)',
                border: '1px solid var(--outline-variant)'
              }}
            >
              {e}
            </button>
          ))}
        </div>
        {reactionSent && (
          <div style={{ fontSize: '0.8125rem', color: 'var(--gain-text)', fontWeight: 600 }}>
            Ghost reaction {reactionSent} sent!
          </div>
        )}
      </div>
    </div>
  );
}
