import React, { useState } from 'react';
import { getAvatarById } from '../../data/animalAvatars';
import AvatarBadge from '../common/AvatarBadge';
import { Vote, CheckCircle2, MinusCircle, ShieldAlert, ArrowRight } from 'lucide-react';

export default function PlayerVoting({
  players = [],
  myPlayerId,
  onCastVote,
  hasVoted,
  votedTargetId
}) {
  const [selectedTargetId, setSelectedTargetId] = useState(null);
  const [confirming, setConfirming] = useState(false);

  const triggerHaptic = (pattern) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(pattern);
      } catch (e) {}
    }
  };

  const alivePlayers = players.filter(p => p.isAlive);
  const selectedPlayer = players.find(p => p.id === selectedTargetId);
  const selectedAvatar = selectedPlayer ? getAvatarById(selectedPlayer.avatarId) : null;

  const handleSelect = (targetId) => {
    setSelectedTargetId(targetId);
    setConfirming(true);
    triggerHaptic([30]);
  };

  const handleConfirm = () => {
    if (selectedTargetId) {
      onCastVote(selectedTargetId);
      setConfirming(false);
      triggerHaptic([40, 60]);
    }
  };

  if (hasVoted) {
    const votedPlayer = players.find(p => p.id === votedTargetId);
    const votedAvatar = votedPlayer ? getAvatarById(votedPlayer.avatarId) : null;

    return (
      <div style={{
        width: '100%',
        maxWidth: '440px',
        margin: '0 auto',
        padding: '32px 16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '20px',
        boxSizing: 'border-box'
      }}>
        <div style={{
          width: '76px',
          height: '76px',
          borderRadius: '50%',
          background: 'rgba(16, 185, 129, 0.12)',
          border: '1.5px solid rgba(16, 185, 129, 0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--gain-text)'
        }}>
          <CheckCircle2 size={40} strokeWidth={2.2} />
        </div>

        <div>
          <h1 className="text-headline" style={{ color: 'var(--on-surface)', marginBottom: '6px' }}>
            BALLOT RECORDED
          </h1>
          <p className="text-body" style={{ color: 'var(--on-surface-variant)', fontSize: '0.875rem' }}>
            Your decision is sealed in the Haveli archives.
          </p>
        </div>

        <div className="card-interactive" style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          padding: '16px'
        }}>
          {votedTargetId === 'skip' ? (
            <>
              <MinusCircle size={28} color="var(--primary)" />
              <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--on-surface)' }}>
                Voted to Skip Exile
              </div>
            </>
          ) : (
            <>
              {votedAvatar && <AvatarBadge avatar={votedAvatar} size={38} />}
              <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--on-surface)' }}>
                Voted to Exile: <span style={{ color: 'var(--loss-text)' }}>{votedPlayer?.name}</span>
              </div>
            </>
          )}
        </div>

        <div style={{ fontSize: '0.8125rem', color: 'var(--on-surface-variant)' }}>
          Awaiting verdict tally on the main living room screen...
        </div>
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
      gap: '16px',
      boxSizing: 'border-box'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div className="badge-loss" style={{ padding: '4px 12px', fontSize: '0.75rem', marginBottom: '8px' }}>
          SECRET TRIAL
        </div>
        <h1 className="text-headline" style={{ color: 'var(--on-surface)', marginBottom: '4px' }}>
          VOTE TO EXILE
        </h1>
        <p className="text-body" style={{ color: 'var(--on-surface-variant)', fontSize: '0.875rem' }}>
          Cast your vote against the suspected traitor or choose to abstain.
        </p>
      </div>

      {/* Confirmation Drawer / Box */}
      {confirming && (
        <div style={{
          background: 'var(--surface-container-low)',
          border: '1.5px solid var(--loss)',
          borderRadius: 'var(--rounded-xl)',
          padding: '18px 16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '14px',
          boxShadow: 'var(--shadow-elevated)',
          animation: 'pulse-subtle 1.5s infinite'
        }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--loss-text)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Confirm Exile Ballot
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.15rem', fontWeight: 700, color: 'var(--on-surface)' }}>
            {selectedTargetId === 'skip' ? (
              <>
                <MinusCircle size={22} color="var(--primary)" />
                <span>Skip Exile This Round</span>
              </>
            ) : (
              <>
                {selectedAvatar && <AvatarBadge avatar={selectedAvatar} size={30} />}
                <span>{selectedPlayer?.name}</span>
              </>
            )}
          </div>
          <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="btn-secondary spring-btn"
              aria-label="Cancel vote"
              style={{ flex: 1, padding: '10px', minHeight: '44px' }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="btn-danger spring-btn"
              aria-label="Confirm vote"
              style={{ flex: 1, padding: '10px', minHeight: '44px' }}
            >
              Confirm Ballot
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
              aria-label={`Vote against ${p.name}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                minHeight: '60px',
                border: isSelected ? '2px solid var(--loss)' : '1px solid rgba(255, 255, 255, 0.08)',
                opacity: isMe ? 0.45 : 1,
                cursor: isMe ? 'not-allowed' : 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <AvatarBadge avatar={avatar} size={40} />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--on-surface)' }}>
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
          aria-label="Skip exile vote"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            minHeight: '60px',
            border: selectedTargetId === 'skip' ? '2px solid var(--primary)' : '1px dashed rgba(255, 255, 255, 0.15)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '24%',
              background: 'rgba(229, 184, 105, 0.1)',
              border: '1px solid rgba(229, 184, 105, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary)'
            }}>
              <MinusCircle size={22} strokeWidth={2.2} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--on-surface)' }}>Skip Vote</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>
                Abstain from exile this round
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
