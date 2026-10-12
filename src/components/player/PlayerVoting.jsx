import React, { useState } from 'react';
import { getAvatarById } from '../../data/animalAvatars';
import AvatarBadge from '../common/AvatarBadge';
import { Vote, CheckCircle2, MinusCircle, ShieldAlert, ArrowRight, Check } from 'lucide-react';
import Button from '../common/Button';

export default function PlayerVoting({
  players = [],
  myPlayerId,
  onCastVote,
  hasVoted,
  votedTargetId
}) {
  const [selectedTargetId, setSelectedTargetId] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [optimisticSubmitted, setOptimisticSubmitted] = useState(false);

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
    triggerHaptic([25]);
  };

  const handleConfirm = () => {
    if (selectedTargetId) {
      setOptimisticSubmitted(true);
      triggerHaptic([35, 45]);
      onCastVote(selectedTargetId);
    }
  };

  const isBallotRecorded = hasVoted || optimisticSubmitted;
  const recordedTargetId = votedTargetId || selectedTargetId;

  if (isBallotRecorded) {
    const votedPlayer = players.find(p => p.id === recordedTargetId);
    const votedAvatar = votedPlayer ? getAvatarById(votedPlayer.avatarId) : null;

    return (
      <div className="spring-settle-in" style={{
        width: '100%',
        maxWidth: '440px',
        margin: '0 auto',
        padding: '36px 16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '24px',
        boxSizing: 'border-box'
      }}>
        <div className="spring-stamp-slam" style={{
          width: '84px',
          height: '84px',
          borderRadius: 'var(--rounded-full)',
          background: 'rgba(16, 185, 129, 0.15)',
          border: '2px solid var(--gain)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--gain-text)',
          boxShadow: 'var(--shadow-glow-neon)'
        }}>
          <CheckCircle2 size={44} strokeWidth={2.4} />
        </div>

        <div>
          <h1 className="text-headline" style={{ color: 'var(--on-surface)', marginBottom: '8px' }}>
            BALLOT SECURED!
          </h1>
          <p className="text-body" style={{ color: 'var(--on-surface-variant)', fontSize: '0.875rem', lineHeight: 1.5 }}>
            Your verdict is sealed in the Haveli archives. No one can alter your choice.
          </p>
        </div>

        <div className="card-interactive spring-settle-in" style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '14px',
          padding: '18px 16px',
          borderRadius: 'var(--rounded-2xl)',
          background: 'var(--surface-container-low)',
          border: '1px solid var(--outline-variant)'
        }}>
          {recordedTargetId === 'skip' ? (
            <>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: 'var(--primary-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)'
              }}>
                <MinusCircle size={26} />
              </div>
              <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--on-surface)' }}>
                Skip Ballot (No Exile)
              </div>
            </>
          ) : (
            <>
              {votedAvatar && <AvatarBadge avatar={votedAvatar} size={42} />}
              <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--on-surface)' }}>
                Voted to Exile: <span style={{ color: 'var(--loss-text)' }}>{votedPlayer?.name || 'Suspect'}</span>
              </div>
            </>
          )}
        </div>

        <div style={{ fontSize: '0.8125rem', color: 'var(--outline)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>Awaiting council deliberation on the host screen...</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      width: '100%',
      maxWidth: '440px',
      margin: '0 auto',
      padding: '16px 14px 100px 14px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      boxSizing: 'border-box',
      position: 'relative'
    }}>
      {/* Header */}
      <div style={{
        background: 'var(--surface-container-low)',
        borderRadius: 'var(--rounded-2xl)',
        padding: '16px 18px',
        border: '1px solid var(--outline-variant)',
        boxShadow: 'var(--shadow-resting)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span className="badge-loss" style={{ fontSize: '0.6875rem' }}>
            COUNCIL BALLOT
          </span>
          <span className="text-label" style={{ color: 'var(--on-surface-variant)' }}>
            1 VOTE PER CITIZEN
          </span>
        </div>
        <h1 className="text-headline" style={{ color: 'var(--on-surface)', fontSize: '1.25rem', margin: '4px 0 2px 0' }}>
          Cast Your Exile Vote
        </h1>
        <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.8125rem', margin: 0, lineHeight: 1.45 }}>
          Tap a suspect below to mark them for exile, or skip if evidence is doubtful.
        </p>
      </div>

      {/* Suspect Ballot Cards (Fitts's Law: Min 64px height touch targets) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }} role="radiogroup" aria-label="Suspect list">
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
              aria-checked={isSelected}
              role="radio"
              aria-label={`Vote against ${p.name}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 16px',
                minHeight: '64px',
                borderRadius: 'var(--rounded-xl)',
                border: isSelected ? '2px solid var(--loss)' : '1px solid var(--outline-variant)',
                backgroundColor: isSelected ? 'rgba(239, 68, 68, 0.1)' : undefined,
                boxShadow: isSelected ? 'var(--shadow-glow-loss)' : 'none',
                opacity: isMe ? 0.45 : 1,
                cursor: isMe ? 'not-allowed' : 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <AvatarBadge avatar={avatar} size={42} />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.975rem', color: 'var(--on-surface)' }}>
                    {p.name} {isMe && '(You)'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>
                    {avatar.name}
                  </div>
                </div>
              </div>

              <div>
                {isMe ? (
                  <span className="text-label" style={{ fontSize: '0.6875rem', color: 'var(--outline)' }}>
                    Self
                  </span>
                ) : isSelected ? (
                  <span className="badge-loss" style={{ fontSize: '0.75rem', fontWeight: 800 }}>
                    Selected
                  </span>
                ) : (
                  <span className="text-label" style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>
                    Vote
                  </span>
                )}
              </div>
            </button>
          );
        })}

        {/* Skip Vote Option */}
        <button
          type="button"
          onClick={() => handleSelect('skip')}
          className="card-interactive spring-btn"
          aria-checked={selectedTargetId === 'skip'}
          role="radio"
          aria-label="Skip exile vote"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 16px',
            minHeight: '64px',
            borderRadius: 'var(--rounded-xl)',
            border: selectedTargetId === 'skip' ? '2px solid var(--primary)' : '1px dashed var(--outline-variant)',
            backgroundColor: selectedTargetId === 'skip' ? 'var(--primary-subtle)' : undefined,
            boxShadow: selectedTargetId === 'skip' ? 'var(--shadow-glow-primary)' : 'none'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--rounded-md)',
              background: 'var(--primary-subtle)',
              border: '1px solid var(--primary-subtle-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary)'
            }}>
              <MinusCircle size={24} strokeWidth={2.2} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 700, fontSize: '0.975rem', color: 'var(--on-surface)' }}>Skip Vote (No Exile)</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>
                Spare everyone this council round
              </div>
            </div>
          </div>
          <span className="badge-neutral" style={{ fontSize: '0.6875rem' }}>
            Skip
          </span>
        </button>
      </div>

      {/* Bottom Sticky Thumb Confirmation Drawer (Fitts's Law Thumb Reachability) */}
      {confirming && (
        <div className="spring-settle-in" style={{
          position: 'fixed',
          bottom: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'calc(100% - 28px)',
          maxWidth: '440px',
          zIndex: 50,
          background: 'var(--surface-container-high)',
          border: '1.5px solid var(--loss)',
          borderRadius: 'var(--rounded-2xl)',
          padding: '16px',
          boxShadow: 'var(--shadow-elevated), var(--shadow-glow-loss)',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          boxSizing: 'border-box'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--outline-variant)',
            paddingBottom: '8px'
          }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--loss-text)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Ready to Submit Ballot
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', fontWeight: 700, color: 'var(--on-surface)' }}>
              {selectedTargetId === 'skip' ? (
                <span>Skip Ballot</span>
              ) : (
                <span>Exile {selectedPlayer?.name}</span>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
            <Button
              variant="secondary"
              onClick={() => setConfirming(false)}
              aria-label="Change vote selection"
              style={{ flex: 1, minHeight: '48px', fontSize: '0.875rem' }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirm}
              aria-label="Confirm exile ballot"
              style={{ flex: 2, minHeight: '48px', fontSize: '0.9375rem', fontWeight: 800 }}
            >
              Confirm Vote
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

