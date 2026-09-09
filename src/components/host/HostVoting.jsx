import React, { useState, useEffect } from 'react';
import Countdown from '../common/Countdown';
import { getAvatarById } from '../../data/animalAvatars';
import { Vote, CheckCircle2, Clock, ShieldAlert, ArrowRight } from 'lucide-react';
import { sounds } from '../../audio/soundEffects';

export default function HostVoting({
  players,
  votes, // { [voterId]: targetId | 'skip' }
  duration = 45,
  onResolveVotes
}) {
  const [revealed, setRevealed] = useState(false);
  const alivePlayers = players.filter(p => p.isAlive && !p.isExiled);
  const totalAlive = alivePlayers.length;
  const votedCount = alivePlayers.filter(p => votes[p.id]).length;
  const allVoted = votedCount >= totalAlive;

  // Calculate Vote Tallies
  const tallies = {}; // targetId -> count
  Object.entries(votes).forEach(([voterId, targetId]) => {
    // Only count votes from alive players
    const voter = players.find(p => p.id === voterId);
    if (voter && voter.isAlive && !voter.isExiled) {
      tallies[targetId] = (tallies[targetId] || 0) + 1;
    }
  });

  const handleReveal = () => {
    sounds.playGavel();
    setRevealed(true);
  };

  return (
    <div style={{
      maxWidth: '1100px',
      margin: '0 auto',
      padding: '30px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      textAlign: 'center'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(0, 61, 155, 0.08), rgba(0, 82, 204, 0.05))',
        borderRadius: 'var(--rounded-xl)',
        padding: '18px 20px',
        border: '1px solid rgba(0, 61, 155, 0.15)'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: 'var(--primary)',
          color: '#ffffff',
          padding: '4px 14px',
          borderRadius: 'var(--rounded-full)',
          fontSize: '0.75rem',
          fontWeight: 800,
          marginBottom: '8px'
        }}>
          <Vote size={14} />
          THE SECRET BALLOT ⚖️
        </div>
        <h1 className="text-display" style={{ color: 'var(--primary)', marginBottom: '4px' }}>
          CAST YOUR VOTES
        </h1>
        <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.9375rem' }}>
          Submit your secret ballot on your phone.
        </p>
      </div>

      {/* Timer Bar */}
      {!revealed && (
        <div className="card-interactive" style={{ padding: '20px 24px' }}>
          <Countdown
            duration={duration}
            onExpire={handleReveal}
            active={!allVoted}
            label="Ballot Closes In"
          />
        </div>
      )}

      {/* Voting Progress Counter */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px'
      }}>
        <span className="tabular-nums" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>
          {votedCount} / {totalAlive}
        </span>
        <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--on-surface-variant)' }}>
          votes securely submitted
        </span>
      </div>

      {/* Roster with Vote Status or Revealed Tallies */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: '16px',
        maxWidth: '900px',
        margin: '0 auto',
        width: '100%'
      }}>
        {alivePlayers.map(p => {
          const avatar = getAvatarById(p.avatarId);
          const hasVoted = Boolean(votes[p.id]);
          const receivedVotes = tallies[p.id] || 0;

          return (
            <div
              key={p.id}
              className="card-interactive"
              style={{
                padding: '18px 12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                border: revealed && receivedVotes > 0 ? '2px solid var(--loss)' : '1px solid rgba(9, 30, 66, 0.1)',
                backgroundColor: revealed && receivedVotes > 0 ? 'rgba(255, 86, 48, 0.05)' : 'var(--surface-container-lowest)'
              }}
            >
              <div style={{ fontSize: '2.5rem', lineHeight: 1 }}>{avatar.emoji}</div>
              <div style={{ fontWeight: 700, fontSize: '1rem' }}>{p.name}</div>

              {!revealed ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: hasVoted ? 'var(--gain-text)' : 'var(--outline)'
                }}>
                  {hasVoted ? (
                    <>
                      <CheckCircle2 size={16} color="var(--gain-text)" />
                      <span>Ballot In</span>
                    </>
                  ) : (
                    <>
                      <Clock size={16} color="var(--outline)" />
                      <span>Deciding...</span>
                    </>
                  )}
                </div>
              ) : (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  marginTop: '4px'
                }}>
                  <div className="tabular-nums" style={{
                    fontSize: '1.75rem',
                    fontWeight: 800,
                    color: receivedVotes > 0 ? 'var(--loss)' : 'var(--outline)'
                  }}>
                    {receivedVotes} {receivedVotes === 1 ? 'Vote' : 'Votes'}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Skip Vote Box in Revealed State */}
        {revealed && (
          <div
            className="card-interactive"
            style={{
              padding: '18px 12px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              border: '1px dashed var(--outline-variant)'
            }}
          >
            <div style={{ fontSize: '2rem' }}>🤷‍♂️</div>
            <div style={{ fontWeight: 700, fontSize: '1rem' }}>Skip Vote</div>
            <div className="tabular-nums" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--on-surface-variant)' }}>
              {tallies['skip'] || 0} Votes
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div style={{ marginTop: '16px' }}>
        {!revealed ? (
          <button
            type="button"
            onClick={handleReveal}
            className="btn-danger spring-btn"
            style={{ padding: '16px 36px', fontSize: '1.125rem' }}
          >
            <span>Lock Ballots & Reveal Votes</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onResolveVotes(tallies)}
            className="btn-primary spring-btn"
            style={{ padding: '16px 40px', fontSize: '1.125rem' }}
          >
            <span>Proceed to The Haveli Exile</span>
            <ArrowRight size={20} />
          </button>
        )}
      </div>
    </div>
  );
}
