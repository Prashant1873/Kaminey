import React, { useState } from 'react';
import { Wine, Sun, RotateCcw, Sparkles, Flame, Users, Music } from 'lucide-react';
import TrippyVisualizer from '../common/TrippyVisualizer';
import AvatarBadge from '../common/AvatarBadge';
import { getAvatarById } from '../../data/animalAvatars';

const LOUNGE_TOASTS = [
  "Raise a glass to the innocent player who looks the guiltiest right now.",
  "Take a sip if you caught someone nervously checking their phone.",
  "Check who is whispering by the bar: traitors plot in dark corners.",
  "Cheers to surviving the night! (Unless you are already marked...)",
  "Observe everyone's eye contact while pouring drinks. The Kaminey are among us."
];

export default function HostDrinksBreather({
  players = [],
  onBreakDawn,
  onBackToMissions
}) {
  const [toastIndex, setToastIndex] = useState(0);
  const alivePlayers = players.filter(p => p.isAlive && !p.isExiled);

  const nextToast = () => {
    setToastIndex((prev) => (prev + 1) % LOUNGE_TOASTS.length);
  };

  return (
    <div style={{
      maxWidth: '1100px',
      margin: '0 auto',
      padding: '24px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '22px',
      textAlign: 'center',
      color: '#ffffff'
    }}>
      {/* Top Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(229, 184, 105, 0.08), rgba(15, 18, 30, 0.95))',
        borderRadius: 'var(--rounded-2xl)',
        padding: '20px 24px',
        border: '1.5px solid rgba(229, 184, 105, 0.25)',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.7)'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(229, 184, 105, 0.12)',
          color: '#e5b869',
          border: '1px solid rgba(229, 184, 105, 0.3)',
          borderRadius: 'var(--rounded-sm)',
          padding: '4px 12px',
          fontSize: '0.71875rem',
          fontWeight: 800,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: '8px'
        }}>
          <Wine size={14} color="#e5b869" />
          <span>HAVELI LOUNGE: PARTY BREATHER</span>
        </div>

        <h1 className="text-display" style={{ color: '#ffffff', marginBottom: '6px' }}>
          DRINKS & SOCIALIZE
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.9375rem', maxWidth: '700px', margin: '0 auto', lineHeight: 1.5 }}>
          The Haveli is in the deep dark of night. Refill glasses, play music, gossip, or regroup before dawn breaks and the morning casualty is discovered.
        </p>
      </div>

      {/* Centerpiece: Hypnotic Trippy Visualizer */}
      <div style={{ width: '100%' }}>
        <TrippyVisualizer height="460px" allowFullscreen={true} />
      </div>

      {/* Lounge Toast & Icebreaker Bar */}
      <div style={{
        background: 'rgba(18, 22, 34, 0.85)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 'var(--rounded-xl)',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        flexWrap: 'wrap',
        textAlign: 'left'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '260px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--rounded-lg)',
            background: 'rgba(229, 184, 105, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Wine size={20} color="var(--primary)" />
          </div>
          <div>
            <div style={{ fontSize: '0.71875rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Lounge Toast of the Moment
            </div>
            <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#F1F5F9', marginTop: '2px' }}>
              "{LOUNGE_TOASTS[toastIndex]}"
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={nextToast}
          className="btn-secondary spring-btn"
          style={{
            padding: '8px 14px',
            fontSize: '0.8125rem',
            background: 'rgba(255, 255, 255, 0.06)',
            color: '#CBD5E1',
            border: '1px solid rgba(255, 255, 255, 0.12)'
          }}
        >
          <span>Next Toast</span>
        </button>
      </div>

      {/* Navigation Controls: Back to Dares OR Break Dawn to Continue */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '14px',
        marginTop: '6px'
      }}>
        <button
          type="button"
          onClick={onBackToMissions}
          className="btn-secondary spring-btn"
          style={{
            padding: '16px',
            fontSize: '0.95rem',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            color: '#CBD5E1'
          }}
        >
          <RotateCcw size={17} />
          <span>Back to Night Missions</span>
        </button>

        <button
          type="button"
          onClick={onBreakDawn}
          className="btn-danger spring-btn"
          style={{
            padding: '16px',
            fontSize: '1.05rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px'
          }}
        >
          <Sun size={20} />
          <span>Conclude Night: Break Dawn & Reveal Casualty</span>
        </button>
      </div>

      {/* Guests Chilling in the Lounge */}
      <div style={{ marginTop: '8px', textAlign: 'left' }}>
        <div className="text-label" style={{ color: '#94a3b8', marginBottom: '10px' }}>
          GUESTS RELAXING IN THE HAVELI ({alivePlayers.length})
        </div>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          {alivePlayers.map(p => (
            <div
              key={p.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(18, 22, 34, 0.8)',
                padding: '6px 12px',
                borderRadius: 'var(--rounded-lg)',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              <AvatarBadge avatarId={p.avatarId} size={28} />
              <span style={{ fontSize: '0.84rem', fontWeight: 600, color: '#F1F5F9' }}>{p.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
