import React, { useState } from 'react';
import { Vote, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { getAvatarById } from '../../data/animalAvatars';

export default function PlayerVoting({
  players = [],
  myPlayerId,
  hasVoted,
  onCastVote
}) {
  const [selectedTargetId, setSelectedTargetId] = useState(null);
  const [confirming, setConfirming] = useState(false);

  const alivePlayers = players.filter(p => p.isAlive && !p.isExiled);
  const selectedPlayer = players.find(p => p.id === selectedTargetId);
  const selectedAvatar = selectedPlayer ? getAvatarById(selectedPlayer.avatarId) : null;

  const handleSelect = (targetId) => {
    if (hasVoted) return;
    setSelectedTargetId(targetId);
    setConfirming(true);
  };

  const handleConfirm = () => {
    if (!selectedTargetId) return;
    onCastVote(selectedTargetId);
    setConfirming(false);
  };

  if (hasVoted) {
    return (
      <div style={{
        maxWidth: '420px',
        margin: '0 auto',
        padding: '40px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '20px'
      }}>
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: 'var(--rounded-full)',
          background: 'rgba(54, 179, 126, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-resting)'
        }}>
          <CheckCircle2 size={40} color="var(--gain-text)" />
        </div>

        <h1 className="text-headline" style={{ color: 'var(--gain-text)' }}>
          SECRET BALLOT SUBMITTED
        </h1>
        <p className="text-body" style={{ color: 'var(--on-surface-variant)' }}>
          Your vote has been securely recorded on the base station. Keep eyes on the living room screen for the dramatic reveal!
        </p>
      </div>
    );
  }

  return (
    <div style={{
      width: '100%',
      maxWidth: '440px',
      margin: '0 auto',
      padding: '16px 14px',
      display: 'flex',
      flexDirection: 'column',
      gap: '14px',
      boxSizing: 'border-box'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div className="badge-loss" style={{ marginBottom: '8px', fontSize: '0.75rem' }}>
          CONFIDENTIAL BALLOT
        </div>
        <h1 className="text-headline" style={{ color: 'var(--primary)', marginBottom: '4px' }}>
          VOTE TO EXILE
        </h1>
        <p className="text-body" style={{ color: 'var(--on-surface-variant)', fontSize: '0.875rem' }}>
          Select who you believe is a Kamina. You may also choose to Skip.
        </p>
      </div>

      {/* Confirmation Drawer / Box */}
      {confirming && (
        <div style={{
          background: 'var(--surface-container-lowest)',
          border: '2px solid var(--loss)',
          borderRadius: 'var(--rounded-xl)',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          boxShadow: 'var(--shadow-elevated)',
          animation: 'pulse-subtle 1.5s infinite'
        }}>
          <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--loss-text)' }}>
            Confirm Exile Vote:
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>
            {selectedTargetId === 'skip' ? '🤷‍♂️ Skip Vote' : `${selectedAvatar?.emoji} ${selectedPlayer?.name}`}
          </div>
          <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="btn-secondary spring-btn"
              style={{ flex: 1, padding: '10px' }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="btn-danger spring-btn"
              style={{ flex: 1, padding: '10px' }}
            >
              Confirm Vote
            </button>
          </div>
        </div>
      )}

      {/* Suspect Ballot Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {alivePlayers.map(p => {
          const avatar = getAvatarById(p.avatarId);
          const isMe = p.id === myPlayerId;
          const isSelected = selectedTargetId === p.id;

          return (
            <button
              key={p.id}
              type="button"
              disabled={isMe}
              onClick={() => handleSelect(p.id)}
              className="card-interactive spring-btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 16px',
                border: isSelected ? '2px solid var(--loss)' : '1px solid rgba(9, 30, 66, 0.1)',
                opacity: isMe ? 0.45 : 1,
                cursor: isMe ? 'not-allowed' : 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '2rem' }}>{avatar.emoji}</span>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 700, fontSize: '1rem' }}>
                    {p.name} {isMe && '(You)'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>
                    {avatar.name}
                  </div>
                </div>
              </div>

              <div>
                <span className="badge-loss" style={{ fontSize: '0.75rem' }}>
                  Vote Exile
                </span>
              </div>
            </button>
          );
        })}

        {/* Skip Vote Option */}
        <button
          type="button"
          onClick={() => handleSelect('skip')}
          className="card-interactive spring-btn"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 16px',
            border: selectedTargetId === 'skip' ? '2px solid var(--primary)' : '1px dashed var(--outline-variant)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '1.75rem' }}>🤷‍♂️</span>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 700, fontSize: '1rem' }}>Skip Vote</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>
                Do not exile anyone this round
              </div>
            </div>
          </div>
          <span className="category-pill" style={{ fontSize: '0.75rem' }}>
            Skip
          </span>
        </button>
      </div>
    </div>
  );
}
