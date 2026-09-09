import React from 'react';
import { Shuffle, Wine, Sun, Moon, Smartphone, CheckCircle2, Eye, Sparkles, Users } from 'lucide-react';
import AvatarBadge from '../common/AvatarBadge';

export default function HostDares({
  mission,
  players = [],
  readyPlayers = {},
  onReshuffle,
  onOpenDrinksBreather,
  onBreakDawn
}) {
  const alivePlayers = players.filter(p => p.isAlive && !p.isExiled);
  const readyCount = alivePlayers.filter(p => readyPlayers[p.id]).length;
  const totalAlive = alivePlayers.length;
  const readyPercentage = totalAlive > 0 ? Math.round((readyCount / totalAlive) * 100) : 0;
  const allReady = totalAlive > 0 && readyCount >= totalAlive;

  const hasDuo = Boolean(mission?.isDuo && mission?.assignedPair?.length >= 2);

  return (
    <div style={{
      maxWidth: '1100px',
      margin: '0 auto',
      padding: '24px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      textAlign: 'center',
      color: '#ffffff'
    }}>
      {/* Top Night Conclave Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.08), rgba(15, 18, 30, 0.95))',
        borderRadius: 'var(--rounded-xl)',
        padding: '18px 22px',
        border: '1.5px solid rgba(239, 68, 68, 0.25)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.6)'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(239, 68, 68, 0.12)',
          color: 'var(--loss-text)',
          border: '1px solid rgba(239, 68, 68, 0.25)',
          borderRadius: 'var(--rounded-sm)',
          padding: '4px 10px',
          fontSize: '0.71875rem',
          fontWeight: 800,
          letterSpacing: '0.07em',
          textTransform: 'uppercase',
          marginBottom: '6px'
        }}>
          <Moon size={13} color="var(--loss-text)" />
          <span>{mission?.badge ? `NIGHT COVER: ${mission.badge}` : 'NIGHT CONCLAVE: COVER MISSION'}</span>
        </div>

        <h1 className="text-display" style={{ color: '#ffffff', marginBottom: '4px' }}>
          {mission?.title || 'NIGHT COVER MISSION IN PROGRESS'}
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem', maxWidth: '720px', margin: '0 auto', lineHeight: 1.5 }}>
          Darkness envelopes the Haveli. Keep your eyes glued to your phones — the confidential task is on your personal screen!
        </p>
      </div>

      {/* Duo Trial Spotlight Announcement (if applicable) */}
      {hasDuo && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.15), rgba(139, 92, 246, 0.12))',
          border: '1.5px solid rgba(217, 119, 6, 0.4)',
          borderRadius: 'var(--rounded-xl)',
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.75rem',
            fontWeight: 800,
            letterSpacing: '0.08em',
            color: '#FBBF24',
            textTransform: 'uppercase'
          }}>
            <Sparkles size={14} />
            <span>2-PERSON TRIAL IN PROGRESS</span>
          </div>

          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF' }}>
            ON TRIAL: <span style={{ color: '#FBBF24' }}>{mission.assignedPair[0].name}</span> & <span style={{ color: '#A78BFA' }}>{mission.assignedPair[1].name}</span>
          </div>

          <div style={{ fontSize: '0.8125rem', color: '#CBD5E1', maxWidth: '640px' }}>
            The 2 suspects must follow instructions on their phones to prove innocence. The rest of the Haveli serves as the jury watching their behavior and micro-expressions!
          </div>
        </div>
      )}

      {/* Phone Reading Directive Card (Task is hidden from TV screen) */}
      <div className="card-interactive" style={{
        padding: '30px 24px',
        maxWidth: '850px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        border: '1.5px solid rgba(255, 255, 255, 0.12)',
        background: 'rgba(18, 22, 34, 0.85)'
      }}>
        <div style={{
          width: '74px',
          height: '74px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(239, 68, 68, 0.25) 0%, rgba(15, 23, 42, 0.8) 75%)',
          border: '2px solid rgba(239, 68, 68, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 24px rgba(239, 68, 68, 0.3)',
          animation: 'float-slow 3s infinite ease-in-out'
        }}>
          <Smartphone size={36} color="var(--primary)" />
        </div>

        <div>
          <div style={{
            fontSize: '1.45rem',
            fontWeight: 800,
            color: '#FFFFFF',
            letterSpacing: '0.02em',
            marginBottom: '6px'
          }}>
            📱 CHECK YOUR PHONE TO READ THE MISSION
          </div>
          <p style={{
            fontSize: '0.9375rem',
            color: '#94A3B8',
            maxWidth: '620px',
            margin: '0 auto',
            lineHeight: 1.55
          }}>
            The task details are confidential and only displayed on personal devices. Keep your eyes on your screens and participate together.
            Kaminey are using this distraction to pick their kill in secret!
          </p>
        </div>

        {/* READY FOR DAWN COUNTER CARD */}
        <div style={{
          width: '100%',
          maxWidth: '720px',
          background: 'rgba(11, 15, 25, 0.95)',
          border: allReady ? '1.5px solid var(--gain)' : '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: 'var(--rounded-xl)',
          padding: '20px 24px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          boxShadow: allReady ? '0 0 20px rgba(34, 197, 94, 0.25)' : 'none',
          transition: 'all 0.3s ease'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: allReady ? 'var(--gain)' : '#F59E0B',
                boxShadow: allReady ? '0 0 12px var(--gain)' : '0 0 12px #F59E0B',
                animation: allReady ? 'none' : 'pulse-subtle 1.8s infinite'
              }} />
              <span style={{ fontSize: '1.05rem', fontWeight: 800, letterSpacing: '0.04em', color: '#FFFFFF' }}>
                READY FOR DAWN
              </span>
            </div>

            <div style={{
              fontSize: '1.35rem',
              fontWeight: 900,
              color: allReady ? 'var(--gain-text)' : 'var(--primary)'
            }}>
              {readyCount} <span style={{ fontSize: '0.95rem', color: '#94A3B8', fontWeight: 600 }}>/ {totalAlive} READY</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div style={{
            width: '100%',
            height: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            borderRadius: 'var(--rounded-full)',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: `${readyPercentage}%`,
              backgroundColor: allReady ? 'var(--gain)' : 'var(--primary)',
              borderRadius: 'var(--rounded-full)',
              transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
            }} />
          </div>

          {/* Player status pills */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            justifyContent: 'center',
            marginTop: '4px'
          }}>
            {alivePlayers.map(p => {
              const isReady = Boolean(readyPlayers[p.id]);
              return (
                <div
                  key={p.id}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '7px',
                    padding: '6px 12px',
                    borderRadius: 'var(--rounded-full)',
                    background: isReady ? 'rgba(34, 197, 94, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                    border: isReady ? '1px solid var(--gain)' : '1px solid rgba(255, 255, 255, 0.1)',
                    color: isReady ? '#4ade80' : '#94A3B8',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    transition: 'all 0.25s ease'
                  }}
                >
                  <AvatarBadge avatarId={p.avatarId} size={20} showRing={false} />
                  <span>{p.name}</span>
                  {isReady ? (
                    <CheckCircle2 size={14} color="#4ade80" />
                  ) : (
                    <span style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: '#f59e0b',
                      display: 'inline-block'
                    }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Controls: Reshuffle, Own Thing (Drinks Breather), Break Dawn */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '12px',
          marginTop: '6px',
          paddingTop: '16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          width: '100%'
        }}>
          {/* Reshuffle Button */}
          <button
            type="button"
            onClick={onReshuffle}
            className="btn-secondary spring-btn"
            style={{
              padding: '14px',
              fontSize: '0.9375rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              background: 'rgba(255, 255, 255, 0.06)',
              color: '#CBD5E1'
            }}
            title="Roll another random party mission"
          >
            <Shuffle size={18} />
            <span>Shuffle Mission</span>
          </button>

          {/* Free Socialize / Drinks Breather Page */}
          <button
            type="button"
            onClick={onOpenDrinksBreather}
            className="btn-secondary spring-btn"
            style={{
              padding: '14px',
              fontSize: '0.9375rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              background: 'rgba(229, 184, 105, 0.12)',
              color: '#e5b869',
              border: '1px solid rgba(229, 184, 105, 0.3)'
            }}
            title="Open dedicated party drinks & chill lounge breather"
          >
            <Wine size={18} />
            <span>Free Party / Drinks Breather</span>
          </button>

          {/* Mission Accomplished -> Break Dawn */}
          <button
            type="button"
            onClick={onBreakDawn}
            className="btn-danger spring-btn"
            style={{
              padding: '16px',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              gridColumn: '1 / -1',
              boxShadow: allReady ? '0 0 24px rgba(239, 68, 68, 0.5)' : undefined
            }}
          >
            <Sun size={19} />
            <span>
              {allReady
                ? 'Everyone Ready! Break Dawn & Reveal Casualty'
                : 'Mission Complete: Break Dawn & Reveal Casualty'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

