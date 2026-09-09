import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { getAvatarById } from '../../data/animalAvatars';
import AvatarBadge from '../common/AvatarBadge';
import { Trophy, RotateCcw, Award, ShieldCheck, Skull } from 'lucide-react';
import { sounds } from '../../audio/soundEffects';

export default function HostGameOver({ winner, players, roles, onRestart }) {
  const isBholeWin = winner === 'bhole';

  useEffect(() => {
    sounds.playVictory();
    // Launch celebratory confetti
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });
    const t = setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.5 }
      });
    }, 600);

    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '40px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      gap: '32px'
    }}>
      {/* Trophy Header */}
      <div style={{
        width: '100px',
        height: '100px',
        borderRadius: 'var(--rounded-full)',
        background: isBholeWin
          ? 'linear-gradient(135deg, var(--gain), var(--gain-text))'
          : 'linear-gradient(135deg, var(--loss), var(--loss-text))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: isBholeWin ? 'var(--shadow-glow-neon)' : 'var(--shadow-glow-loss)',
        animation: 'float-slow 3s infinite ease-in-out'
      }}>
        <Trophy size={50} color="#ffffff" />
      </div>

      <div>
        <div className={isBholeWin ? 'badge-gain' : 'badge-loss'} style={{
          fontSize: '0.8125rem',
          padding: '4px 16px',
          marginBottom: '8px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          {isBholeWin ? <ShieldCheck size={14} /> : <Skull size={14} />}
          <span>{isBholeWin ? 'INNOCENTS TRIUMPH' : 'TRAITORS CONQUER'}</span>
        </div>
        <h1 className="text-display" style={{
          color: isBholeWin ? 'var(--gain-text)' : 'var(--loss-text)',
          marginBottom: '6px'
        }}>
          {isBholeWin ? 'BHOLE WIN THE GAME!' : 'KAMINEY WIN THE GAME!'}
        </h1>
        <p style={{ color: 'var(--on-surface-variant)', fontSize: '1rem' }}>
          {isBholeWin ? 'All traitors were identified and banished!' : 'The traitors eliminated enough innocents to take control!'}
        </p>
      </div>

      {/* Full Cast Secret Revelation */}
      <div style={{ width: '100%' }}>
        <h2 className="text-title" style={{ color: 'var(--primary)', marginBottom: '16px' }}>
          FULL CAST IDENTITY REVEAL
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '16px',
          maxWidth: '850px',
          margin: '0 auto'
        }}>
          {players.map(p => {
            const playerRole = roles[p.id] || 'bhola';
            const isKamina = playerRole === 'kamina';

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
                  border: isKamina ? '1.5px solid var(--loss)' : '1.5px solid var(--gain)',
                  backgroundColor: isKamina ? 'rgba(239, 68, 68, 0.12)' : 'rgba(16, 185, 129, 0.12)'
                }}
              >
                <AvatarBadge avatarId={p.avatarId} size={54} />
                <div style={{ fontWeight: 800, fontSize: '1.0625rem' }}>{p.name}</div>
                <div
                  className={isKamina ? 'badge-loss' : 'badge-gain'}
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    marginTop: '4px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '3px 10px'
                  }}
                >
                  {isKamina ? <Skull size={12} /> : <ShieldCheck size={12} />}
                  <span>{isKamina ? 'KAMINA' : 'BHOLA'}</span>
                </div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--outline)', marginTop: '2px' }}>
                  {p.isAlive && !p.isExiled ? 'Survived' : p.isExiled ? 'Banished' : 'Murdered'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Restart Button */}
      <div style={{ marginTop: '16px' }}>
        <button
          type="button"
          onClick={onRestart}
          className="btn-primary spring-btn"
          style={{ padding: '16px 40px', fontSize: '1.125rem' }}
        >
          <RotateCcw size={20} />
          <span>Host New Match</span>
        </button>
      </div>
    </div>
  );
}
