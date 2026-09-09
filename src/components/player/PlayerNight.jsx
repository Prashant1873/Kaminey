import React from 'react';
import { Moon, Skull, Shield, CheckCircle, Crosshair } from 'lucide-react';
import { getAvatarById } from '../../data/animalAvatars';
import AvatarBadge from '../common/AvatarBadge';

export default function PlayerNight({
  role,
  players = [],
  myPlayerId,
  kamineyPartners = [],
  nightVotes = {},
  onSelectTarget
}) {
  const isKamina = role === 'kamina';
  const mySelectedTarget = nightVotes[myPlayerId] || null;

  const triggerHaptic = (pattern) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(pattern);
      } catch (e) {}
    }
  };

  const handleTargetClick = (victimId) => {
    onSelectTarget(victimId);
    triggerHaptic([40, 40]);
  };

  // Potential murder targets: all living players who are NOT fellow Kaminey
  const partnerIds = new Set(kamineyPartners.map(p => p.id));
  partnerIds.add(myPlayerId);

  const potentialVictims = players.filter(p => p.isAlive && !p.isExiled && !partnerIds.has(p.id));

  return (
    <div className="theme-simsim-night" style={{
      width: '100%',
      minHeight: 'auto',
      flex: 1,
      backgroundColor: '#07090E',
      padding: '24px 14px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      gap: '18px',
      boxSizing: 'border-box'
    }}>
      {/* Top Ambience */}
      <div style={{
        width: '72px',
        height: '72px',
        borderRadius: '50%',
        background: isKamina ? 'rgba(239, 68, 68, 0.15)' : 'var(--primary-subtle)',
        border: isKamina ? '1.5px solid var(--loss)' : '1.5px solid var(--primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: isKamina ? 'var(--shadow-glow-loss)' : 'var(--shadow-glow-primary)'
      }}>
        {isKamina ? <Skull size={36} color="var(--loss)" /> : <Moon size={36} color="var(--primary)" />}
      </div>

      <div>
        <div className="badge-loss" style={{ marginBottom: '8px', fontSize: '0.75rem', letterSpacing: '0.06em' }}>
          NIGHT FALLS
        </div>
        <h1 className="text-headline" style={{ color: '#F8FAFC', fontSize: '1.45rem', marginBottom: '6px' }}>
          {isKamina ? 'THE SHADOWS AWAIT YOU' : 'REST IN THE SHADOWS'}
        </h1>
        <p style={{ fontSize: '0.8125rem', color: '#94A3B8', maxWidth: '340px', lineHeight: 1.45 }}>
          {isKamina
            ? 'Night has fallen. Your strike will take place during the cover mission when everyone looks at their phones.'
            : 'Night is active. Observe the room quietly and wait for the Host to launch the cover mission.'}
        </p>
      </div>

      {/* Atmospheric Night Waiting Screen for all players */}
      <div style={{
        width: '100%',
        maxWidth: '360px',
        background: '#0F131D',
        borderRadius: 'var(--rounded-2xl)',
        padding: '36px 20px',
        border: '1px solid #1E2536',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div className="animate-heartbeat" style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: isKamina ? 'rgba(239, 68, 68, 0.15)' : 'var(--primary-subtle)',
          border: isKamina ? '1.5px solid var(--loss)' : '1px solid var(--primary-subtle-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: isKamina ? 'var(--loss)' : 'var(--primary)'
        }}>
          {isKamina ? <Skull size={40} strokeWidth={2.2} /> : <Moon size={40} strokeWidth={2.2} />}
        </div>
        <div style={{ fontSize: '1.05rem', fontWeight: 700, color: isKamina ? 'var(--loss-text)' : 'var(--primary)' }}>
          {isKamina ? 'Prowl In The Shadows' : 'The Haveli is in Silence'}
        </div>
        <p style={{ fontSize: '0.8125rem', color: '#94A3B8', lineHeight: 1.5 }}>
          {isKamina
            ? 'Stay low. You will choose your victim discreetly during the task phase so nobody suspects you.'
            : 'Keep your phone flat and maintain a neutral expression. Watch the room carefully.'}
        </p>
      </div>
    </div>
  );
}
