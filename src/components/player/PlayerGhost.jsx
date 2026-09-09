import React, { useState } from 'react';
import { Ghost, Skull, Flame, Eye, Zap, Sparkles, Heart, HelpCircle, Check } from 'lucide-react';

const GHOST_REACTIONS = [
  { id: 'ghost', icon: Ghost, label: 'Spook', color: '#94A3B8' },
  { id: 'skull', icon: Skull, label: 'Doom', color: '#EF4444' },
  { id: 'flame', icon: Flame, label: 'Burn', color: '#F97316' },
  { id: 'eye', icon: Eye, label: 'Watching', color: '#60A5FA' },
  { id: 'zap', icon: Zap, label: 'Shock', color: '#FBBF24' },
  { id: 'sparkles', icon: Sparkles, label: 'Glow', color: '#E5B869' },
  { id: 'heart', icon: Heart, label: 'Pity', color: '#F472B6' },
  { id: 'help', icon: HelpCircle, label: 'Clueless', color: '#A8A29E' }
];

export default function PlayerGhost({ playerName, isExiled }) {
  const [reactionSent, setReactionSent] = useState('');

  const sendReaction = (reactionId) => {
    setReactionSent(reactionId);
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try { navigator.vibrate([25]); } catch (e) {}
    }
    setTimeout(() => setReactionSent(''), 1500);
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '420px',
      margin: '0 auto',
      padding: '24px 14px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      gap: '20px',
      boxSizing: 'border-box'
    }}>
      <div style={{
        width: '84px',
        height: '84px',
        borderRadius: '50%',
        background: 'rgba(148, 163, 184, 0.12)',
        border: '1.5px solid rgba(148, 163, 184, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#94A3B8',
        animation: 'float-slow 3.5s infinite ease-in-out'
      }}>
        <Ghost size={44} strokeWidth={2} />
      </div>

      <div>
        <span className="badge-loss" style={{ fontSize: '0.75rem', marginBottom: '8px', letterSpacing: '0.04em' }}>
          👻 BHOOT MANDALI (SPECTATOR MODE)
        </span>
        <h1 className="text-headline" style={{ color: 'var(--on-surface)', marginBottom: '6px' }}>
          AAP AB BHOOT BAN CHUKE HAIN! 👻
        </h1>
        <p className="text-body" style={{ color: 'var(--on-surface-variant)', fontSize: '0.875rem' }}>
          {isExiled
            ? 'Panchayat ne aapko Haveli se nikal phenka! Masoom the ya Kaminey, ab kismat ko koso.'
            : 'Kaali raat ke sannate mein Kaminey ne aapka patta saaf kar diya!'}
          <br />
          <strong>🤫 Bolna bilkul mana hai!</strong> Popcorn khao, zinda logon ka tamasha dekho aur TV screen par bhoot signals feko.
        </p>
      </div>

      {/* Ghost Vector Reactions */}
      <div className="card-interactive" style={{ width: '100%', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '14px', boxSizing: 'border-box' }}>
        <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.04em' }}>
          👻 BHOOTIYA REACTION FEKO (TV PAR DIKHEGA)
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
          {GHOST_REACTIONS.map(item => {
            const IconComp = item.icon;
            const isSent = reactionSent === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => sendReaction(item.id)}
                className="spring-btn"
                aria-label={`Send ghost signal ${item.label}`}
                style={{
                  background: isSent ? `${item.color}26` : 'var(--surface-container-low)',
                  border: isSent ? `1.5px solid ${item.color}` : '1px solid rgba(255, 255, 255, 0.08)',
                  padding: '12px 6px',
                  borderRadius: 'var(--rounded-xl)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  minHeight: '64px',
                  boxSizing: 'border-box'
                }}
              >
                <IconComp size={22} color={item.color} />
                <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--on-surface-variant)' }}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
        {reactionSent && (
          <div className="badge-gain" style={{ alignSelf: 'center', fontSize: '0.75rem', padding: '4px 10px' }}>
            <Check size={12} /> Ghost signal whispered!
          </div>
        )}
      </div>
    </div>
  );
}
