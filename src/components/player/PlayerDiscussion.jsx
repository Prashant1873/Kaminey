import React, { useState } from 'react';
import { MessageSquare, AlertCircle, Edit3 } from 'lucide-react';
import { getAvatarById } from '../../data/animalAvatars';
import AvatarBadge from '../common/AvatarBadge';

export default function PlayerDiscussion({ players = [], myPlayerId }) {
  const [scratchNotes, setScratchNotes] = useState('');
  const alivePlayers = players.filter(p => p.isAlive && !p.isExiled);

  return (
    <div style={{
      width: '100%',
      maxWidth: '440px',
      margin: '0 auto',
      padding: '16px 14px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      boxSizing: 'border-box'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div className="badge-warning" style={{ marginBottom: '8px', fontSize: '0.75rem', letterSpacing: '0.04em' }}>
          COUNCIL DEBATE IN SESSION
        </div>
        <h1 className="text-headline" style={{ color: 'var(--on-surface)', marginBottom: '4px' }}>
          WHO IS THE TRAITOR?
        </h1>
        <p className="text-body" style={{ color: 'var(--on-surface-variant)', fontSize: '0.875rem' }}>
          Observe who is hesitating, deflecting questions, or changing stories. Debate openly.
        </p>
      </div>

      {/* Secret Scratchpad for Suspects */}
      <div className="card-interactive" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', fontWeight: 700, color: 'var(--primary)' }}>
          <Edit3 size={16} />
          <span>Private Investigation Notes:</span>
        </div>
        <textarea
          value={scratchNotes}
          onChange={(e) => setScratchNotes(e.target.value)}
          placeholder="Note suspicious alibis or unusual voting patterns here..."
          className="input-base"
          style={{
            minHeight: '100px',
            fontSize: '0.875rem',
            resize: 'vertical',
            fontFamily: 'inherit'
          }}
        />
      </div>

      {/* Alive Suspects List */}
      <div>
        <div className="text-label" style={{ color: 'var(--on-surface-variant)', marginBottom: '8px', fontSize: '0.75rem' }}>
          ALIVE PLAYERS ({alivePlayers.length}):
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '8px'
        }}>
          {alivePlayers.map(p => {
            const avatar = getAvatarById(p.avatarId);
            const isMe = p.id === myPlayerId;
            return (
              <div
                key={p.id}
                style={{
                  background: isMe ? 'var(--primary-subtle)' : 'var(--surface-container-low)',
                  border: isMe ? '1px solid var(--primary)' : '1px solid var(--outline-variant)',
                  borderRadius: 'var(--rounded-lg)',
                  padding: '8px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <AvatarBadge avatar={avatar} size={28} showRing={false} />
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', color: isMe ? 'var(--primary)' : 'var(--on-surface)' }}>
                    {p.name} {isMe && '(You)'}
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--on-surface-variant)' }}>
                    {avatar.name}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
