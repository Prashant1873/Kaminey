import React, { useState, useEffect } from 'react';
import Countdown from '../common/Countdown';
import { getAvatarById } from '../../data/animalAvatars';
import AvatarBadge from '../common/AvatarBadge';
import { MessageSquare, AlertCircle, Volume2, ArrowRight, UserX, Mic } from 'lucide-react';
import { sounds } from '../../audio/soundEffects';

export default function HostDiscussion({
  players,
  duration = 60,
  onStartVoting
}) {
  const [spotlightId, setSpotlightId] = useState(null);
  const alivePlayers = players.filter(p => p.isAlive && !p.isExiled);

  useEffect(() => {
    sounds.playDramaticStinger();
  }, []);

  const spotlightPlayer = players.find(p => p.id === spotlightId);
  const spotlightAvatar = spotlightPlayer ? getAvatarById(spotlightPlayer.avatarId) : null;

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
      {/* Emergency Header */}
      <div style={{
        background: 'var(--surface-container-low)',
        borderRadius: 'var(--rounded-2xl)',
        padding: '20px 24px',
        border: '1px solid var(--outline-variant)',
        textAlign: 'left'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
          <div className="badge-loss" style={{ fontSize: '0.6875rem', letterSpacing: '0.06em' }}>
            <AlertCircle size={13} />
            EMERGENCY PANCHAYAT
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', color: 'var(--on-surface-variant)' }}>
            <Mic size={15} color="var(--primary)" />
            <span>Khuli Behass</span>
          </div>
        </div>
        <h1 className="text-display" style={{ color: 'var(--on-surface)', margin: '4px 0 2px 0' }}>
          ASLI KAMINA KAUN HAI?
        </h1>
        <p style={{
          color: 'var(--on-surface-variant)',
          fontSize: '0.90625rem',
          margin: 0,
          lineHeight: 1.45
        }}>
          Khul ke arop lagao! Kisko kathghare mein khada karna hai? Neeche tap karke peshi lagao!
        </p>
      </div>

      {/* Timed Countdown Bar */}
      <div className="card-interactive" style={{ padding: '20px 24px' }}>
        <Countdown
          duration={duration}
          onExpire={onStartVoting}
          active={true}
          label="Panchayat Timer"
        />
      </div>

      {/* Spotlighted Player Bar (if Host clicked someone) */}
      {spotlightPlayer && spotlightAvatar && (
        <div style={{
          background: 'var(--surface-container-low)',
          borderRadius: 'var(--rounded-xl)',
          padding: '16px 20px',
          border: '1.5px solid var(--primary)',
          boxShadow: 'var(--shadow-glow-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          animation: 'pulse-subtle 2s infinite'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', textAlign: 'left' }}>
            <AvatarBadge avatarId={spotlightPlayer.avatarId} size={48} />
            <div>
              <div className="text-label" style={{ color: 'var(--primary)', letterSpacing: '0.06em' }}>
                🔥 KATHGHARA SPOTLIGHT
              </div>
              <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--on-surface)' }}>
                {spotlightPlayer.name} ki peshi! Apni sharafat ka saboot do!
              </div>
            </div>
          </div>
          <button
            onClick={() => setSpotlightId(null)}
            className="btn-secondary spring-btn"
            style={{ fontSize: '0.8125rem', minHeight: '38px', padding: '6px 14px' }}
          >
            Kathghara Chhodo
          </button>
        </div>
      )}

      {/* Round-Table Grid of Living Players */}
      <div>
        <div className="text-label" style={{ color: 'var(--on-surface-variant)', marginBottom: '12px' }}>
          TAP KAR KE KATHGHARE MEIN BITHAO ({alivePlayers.length} LOG ZINDA)
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: '14px',
          maxWidth: '850px',
          margin: '0 auto'
        }}>
          {alivePlayers.map(p => {
            const isSelected = p.id === spotlightId;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setSpotlightId(isSelected ? null : p.id)}
                className="card-interactive spring-btn"
                style={{
                  padding: '16px 10px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  border: isSelected ? '2px solid var(--primary)' : '1px solid var(--outline-variant)',
                  backgroundColor: isSelected ? 'var(--primary-subtle)' : 'var(--surface-container-low)'
                }}
              >
                <AvatarBadge avatarId={p.avatarId} size={50} />
                <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--on-surface)', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                {isSelected ? (
                  <span className="badge-loss" style={{ fontSize: '0.625rem', marginTop: '2px' }}>
                    Peshi Chal Rahi Hai
                  </span>
                ) : (
                  <span className="text-label" style={{ fontSize: '0.625rem', color: 'var(--on-surface-variant)' }}>
                    Arop Lagao
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Manual Proceed to Voting */}
      <div>
        <button
          type="button"
          onClick={onStartVoting}
          className="btn-primary spring-btn"
          style={{
            padding: '16px 36px',
            fontSize: '1.125rem'
          }}
        >
          <span>Behass Band! Gupt Vote Se Faisla Karo ⚖️</span>
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
