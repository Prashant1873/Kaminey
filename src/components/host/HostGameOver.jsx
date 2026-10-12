import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { getAvatarById } from '../../data/animalAvatars';
import AvatarBadge from '../common/AvatarBadge';
import { Trophy, RotateCcw, Award, ShieldCheck, Skull, Sparkles } from 'lucide-react';
import { sounds } from '../../audio/soundEffects';
import Button from '../common/Button';

export default function HostGameOver({ winner, players, roles, onRestart }) {
  const isBholeWin = winner === 'bhole';

  useEffect(() => {
    sounds.playVictory();
    // Launch celebratory confetti sequence
    confetti({
      particleCount: 140,
      spread: 85,
      origin: { y: 0.6 }
    });
    const t = setTimeout(() => {
      confetti({
        particleCount: 90,
        spread: 110,
        origin: { y: 0.45 }
      });
    }, 500);

    return () => clearTimeout(t);
  }, []);

  return (
    <div className="spring-settle-in" style={{
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
      <div className="spring-stamp-slam" style={{
        width: '110px',
        height: '110px',
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
        <Trophy size={56} color="#ffffff" />
      </div>

      <div>
        <div className={isBholeWin ? 'badge-gain' : 'badge-loss'} style={{
          fontSize: '0.8125rem',
          padding: '6px 18px',
          marginBottom: '10px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          borderRadius: 'var(--rounded-full)',
          letterSpacing: '0.06em'
        }}>
          {isBholeWin ? <ShieldCheck size={16} /> : <Skull size={16} />}
          <span>{isBholeWin ? 'VICTORY: THE BHOLE TRIUMPH' : 'VICTORY: THE KAMINEY CONQUEST'}</span>
        </div>
        <h1 className="text-display" style={{
          color: isBholeWin ? 'var(--gain-text)' : 'var(--loss-text)',
          marginBottom: '8px'
        }}>
          {isBholeWin ? 'ALL KAMINEY UNMASKED!' : 'THE KAMINEY RULE THE HAVELI!'}
        </h1>
        <p style={{ color: 'var(--on-surface-variant)', fontSize: '1.05rem', maxWidth: '600px', lineHeight: 1.5 }}>
          {isBholeWin
            ? 'Truth and solidarity prevail. The innocent citizens saw through the deception and purged the traitors.'
            : 'Cunning and darkness reign. The secret conspirators dismantled the council from within.'}
        </p>
      </div>

      {/* Full Cast Secret Revelation */}
      <div style={{ width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '18px' }}>
          <Sparkles size={18} color="var(--primary)" />
          <h2 className="text-title" style={{ color: 'var(--primary)', margin: 0, letterSpacing: '0.04em' }}>
            FINAL HAVELI DOSSIER: UNMASKED IDENTITIES
          </h2>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(185px, 1fr))',
          gap: '16px',
          maxWidth: '880px',
          margin: '0 auto'
        }}>
          {players.map(p => {
            const playerRole = roles[p.id] || 'bhola';
            const isKamina = playerRole === 'kamina';

            return (
              <div
                key={p.id}
                className="card-interactive spring-settle-in"
                style={{
                  padding: '20px 14px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '10px',
                  borderRadius: 'var(--rounded-2xl)',
                  border: isKamina ? '1.5px solid var(--loss)' : '1.5px solid var(--gain)',
                  backgroundColor: isKamina ? 'rgba(239, 68, 68, 0.12)' : 'rgba(16, 185, 129, 0.12)',
                  boxShadow: isKamina ? 'var(--shadow-glow-loss)' : 'var(--shadow-glow-neon)'
                }}
              >
                <AvatarBadge avatarId={p.avatarId} size={58} />
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--on-surface)' }}>{p.name}</div>
                <div
                  className={isKamina ? 'badge-loss' : 'badge-gain'}
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    marginTop: '2px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 12px',
                    borderRadius: 'var(--rounded-full)'
                  }}
                >
                  {isKamina ? <Skull size={13} /> : <ShieldCheck size={13} />}
                  <span>{isKamina ? 'KAMINA (TRAITOR)' : 'BHOLA (INNOCENT)'}</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--outline)', marginTop: '2px' }}>
                  {p.isAlive && !p.isExiled ? 'Survived to the End' : p.isExiled ? 'Exiled by Council' : 'Eliminated in the Night'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Restart Button */}
      <div style={{ marginTop: '16px' }}>
        <Button
          variant="primary"
          onClick={onRestart}
          aria-label="Restart match"
          style={{ padding: '16px 40px', fontSize: '1.125rem', minHeight: '56px' }}
        >
          <RotateCcw size={20} />
          <span>Play Again (Rematch)</span>
        </Button>
      </div>
    </div>
  );
}

