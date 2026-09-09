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
        <div className="stamp-slam-effect" style={{
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
            VOTE THOK DIYA! 💥
          </h1>
          <p className="text-body" style={{ color: 'var(--on-surface-variant)', fontSize: '0.875rem' }}>
            Aapka faisla Haveli ke Gupt Sandook mein lock ho chuka hai.
          </p>
        </div>

        <div className="card-interactive stamp-slam-effect" style={{
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
                🕊️ Maaf Kiya (Skip Vote)
              </div>
            </>
          ) : (
            <>
              {votedAvatar && <AvatarBadge avatar={votedAvatar} size={38} />}
              <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--on-surface)' }}>
                Dhakka Diya: <span style={{ color: 'var(--loss-text)' }}>{votedPlayer?.name}</span>
              </div>
            </>
          )}
        </div>

        <div style={{ fontSize: '0.8125rem', color: 'var(--on-surface-variant)' }}>
          Haveli TV screen par parda uthne ka intezaar karo... 📺
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
      {/* Header */}
      <div style={{
        background: 'var(--surface-container-low)',
        borderRadius: 'var(--rounded-xl)',
        padding: '16px 18px',
        border: '1px solid var(--outline-variant)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span className="badge-loss" style={{ fontSize: '0.6875rem' }}>
            ⚖️ GUPT TRIAL
          </span>
          <span className="text-label" style={{ color: 'var(--on-surface-variant)' }}>
            1 VOTE / BAKRA
          </span>
        </div>
        <h1 className="text-headline" style={{ color: 'var(--on-surface)', fontSize: '1.25rem', margin: '4px 0 2px 0' }}>
          Kisko Haveli Se Dhakka Dena Hai? 🗳️
        </h1>
        <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.8125rem', margin: 0, lineHeight: 1.4 }}>
          Apna shak pakka karo aur vote thoko! Kaminey ko pakdo, ya kisi bhole ko bachao.
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
            Pakka Yahi Hai Wo Kamina? 🤨
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.15rem', fontWeight: 700, color: 'var(--on-surface)' }}>
            {selectedTargetId === 'skip' ? (
              <>
                <MinusCircle size={22} color="var(--primary)" />
                <span>🕊️ Skip Vote (Kisi ko mat nikalo)</span>
              </>
            ) : (
              <>
                {selectedAvatar && <AvatarBadge avatar={selectedAvatar} size={30} />}
                <span>{selectedPlayer?.name} ko bahar phenko!</span>
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
              Ruko, Sochne Do 🤔
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="btn-danger spring-btn"
              aria-label="Confirm vote"
              style={{ flex: 1, padding: '10px', minHeight: '44px' }}
            >
              Thok Do Vote! 🔨
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
                border: isSelected ? '2px solid var(--loss)' : '1px solid var(--outline-variant)',
                backgroundColor: isSelected ? 'rgba(239, 68, 68, 0.08)' : undefined,
                opacity: isMe ? 0.45 : 1,
                cursor: isMe ? 'not-allowed' : 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <AvatarBadge avatar={avatar} size={40} />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--on-surface)' }}>
                    {p.name} {isMe && '(Aap Khud)'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>
                    {avatar.name}
                  </div>
                </div>
              </div>

              <div>
                {isMe ? (
                  <span className="text-label" style={{ fontSize: '0.6875rem', color: 'var(--on-surface-variant)' }}>
                    Masoom Bhola?
                  </span>
                ) : isSelected ? (
                  <span className="badge-loss" style={{ fontSize: '0.75rem', fontWeight: 800 }}>
                    🎯 Nishana
                  </span>
                ) : (
                  <span className="text-label" style={{ fontSize: '0.6875rem', color: 'var(--on-surface-variant)' }}>
                    Dhakka Do 🚪
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
          aria-label="Skip exile vote"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            minHeight: '60px',
            border: selectedTargetId === 'skip' ? '2px solid var(--primary)' : '1px dashed var(--outline-variant)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '24%',
              background: 'var(--primary-subtle)',
              border: '1px solid var(--primary-subtle-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary)'
            }}>
              <MinusCircle size={22} strokeWidth={2.2} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--on-surface)' }}>🕊️ Kisi Ko Mat Nikalo (Skip)</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>
                Abhi shak clear nahi hai, sab bhole lag rahe hain
              </div>
            </div>
          </div>
          <span className="category-pill" style={{ fontSize: '0.75rem' }}>
            Maafi
          </span>
        </button>
      </div>
    </div>
  );
}
