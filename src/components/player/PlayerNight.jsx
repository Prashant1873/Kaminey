import React, { useState } from 'react';
import { Moon, Skull, Shield, CheckCircle, Crosshair } from 'lucide-react';
import { getAvatarById } from '../../data/animalAvatars';

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

  // Potential murder targets: all living players who are NOT fellow Kaminey
  const partnerIds = new Set(kamineyPartners.map(p => p.id));
  partnerIds.add(myPlayerId);

  const potentialVictims = players.filter(p => p.isAlive && !p.isExiled && !partnerIds.has(p.id));

  return (
    <div className="theme-simsim-night" style={{
      minHeight: '85vh',
      padding: '24px 16px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      gap: '24px'
    }}>
      {/* Top Ambience */}
      <div style={{
        width: '68px',
        height: '68px',
        borderRadius: 'var(--rounded-full)',
        background: isKamina ? 'rgba(255, 86, 48, 0.15)' : 'rgba(0, 240, 144, 0.15)',
        border: isKamina ? '1px solid var(--loss)' : '1px solid var(--simsim-neon)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: isKamina ? 'var(--shadow-glow-loss)' : 'var(--shadow-glow-neon)'
      }}>
        {isKamina ? <Skull size={34} color="var(--loss)" /> : <Moon size={34} color="var(--simsim-neon)" />}
      </div>

      <div>
        <div className={isKamina ? 'badge-loss' : 'badge-gain'} style={{ marginBottom: '8px', fontSize: '0.75rem' }}>
          {isKamina ? 'THE KAMINA CONCLAVE' : 'PEACEFUL SLEEP'}
        </div>
        <h1 className="text-headline" style={{ color: '#ffffff', fontSize: '1.5rem', marginBottom: '8px' }}>
          {isKamina ? 'CHOOSE YOUR SACRIFICE' : 'THE HAVELI RESTS'}
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#9aa0a6', maxWidth: '340px' }}>
          {isKamina
            ? 'Whisper quietly or look down. Select an innocent Bhola to eliminate tonight.'
            : 'You are resting in your bed chamber. Keep eyes closed and pray you survive till breakfast...'}
        </p>
      </div>

      {/* Kamina Murder Selection UI */}
      {isKamina ? (
        <div style={{ width: '100%', maxWidth: '380px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="text-label" style={{ color: '#9aa0a6', textAlign: 'left', marginBottom: '4px' }}>
            AVAILABLE TARGETS ({potentialVictims.length}):
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {potentialVictims.map(victim => {
              const avatar = getAvatarById(victim.avatarId);
              const isSelectedByMe = mySelectedTarget === victim.id;

              return (
                <button
                  key={victim.id}
                  type="button"
                  onClick={() => onSelectTarget(victim.id)}
                  className="spring-btn"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 16px',
                    borderRadius: 'var(--rounded-xl)',
                    background: isSelectedByMe ? 'rgba(255, 86, 48, 0.2)' : '#121827',
                    border: isSelectedByMe ? '2px solid var(--loss)' : '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#ffffff',
                    boxShadow: isSelectedByMe ? 'var(--shadow-glow-loss)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '2rem' }}>{avatar.emoji}</span>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: 800, fontSize: '1rem' }}>{victim.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#9aa0a6' }}>{avatar.name}</div>
                    </div>
                  </div>

                  <div>
                    {isSelectedByMe ? (
                      <span className="badge-loss" style={{ fontSize: '0.75rem', fontWeight: 800 }}>
                        <Crosshair size={14} /> MARKED
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: '#9aa0a6' }}>Select</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {mySelectedTarget && (
            <div style={{
              background: 'rgba(255, 86, 48, 0.12)',
              border: '1px solid rgba(255, 86, 48, 0.3)',
              borderRadius: 'var(--rounded-lg)',
              padding: '12px',
              fontSize: '0.8125rem',
              color: '#ffffff',
              marginTop: '8px'
            }}>
              Target marked! Waiting for the living room host to break the dawn.
            </div>
          )}
        </div>
      ) : (
        /* Bhola Sleep Screen */
        <div style={{
          width: '100%',
          maxWidth: '360px',
          background: '#121827',
          borderRadius: 'var(--rounded-2xl)',
          padding: '30px 20px',
          border: '1px solid rgba(0, 240, 144, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div className="animate-heartbeat" style={{ fontSize: '3.5rem' }}>
            🕯️
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--simsim-neon)' }}>
            The Haveli is Silent
          </div>
          <p style={{ fontSize: '0.8125rem', color: '#9aa0a6', lineHeight: 1.5 }}>
            Do not make noise or reveal that you are checking your screen.
            When the gong strikes, morning will be announced on the living room screen.
          </p>
        </div>
      )}
    </div>
  );
}
