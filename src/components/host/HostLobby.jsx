import React from 'react';
import QRCodeView from '../common/QRCodeView';
import AvatarBadge from '../common/AvatarBadge';
import { getAvatarById } from '../../data/animalAvatars';
import { Play, UserPlus, Users, Settings2, Sparkles, X, Smartphone, Bot } from 'lucide-react';

export default function HostLobby({
  roomCode,
  players,
  settings,
  onUpdateSettings,
  onStartGame,
  onAddBot,
  onRemovePlayer,
  onRegenerateCode,
  onQuickStartWithBots,
  networkStatus
}) {
  const minPlayers = 4;
  const canStart = players.length >= minPlayers;

  const discussionOptions = [30, 60, 90, 120, 180];
  const votingOptions = [30, 45, 60];
  const kamineyOptions = ['auto', '1', '2', '3'];

  return (
    <div style={{
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '24px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      {/* Top Banner - Apple Dark Minimal Atmosphere */}
      <div style={{
        textAlign: 'center',
        padding: '20px 24px',
        background: 'linear-gradient(180deg, rgba(229, 184, 105, 0.08) 0%, var(--surface-container) 100%)',
        borderRadius: 'var(--rounded-2xl)',
        border: '1px solid rgba(229, 184, 105, 0.15)',
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(229, 184, 105, 0.12)',
          color: 'var(--primary)',
          fontSize: '0.75rem',
          fontWeight: 700,
          letterSpacing: '0.08em',
          padding: '4px 14px',
          borderRadius: 'var(--rounded-full)',
          marginBottom: '8px',
          border: '1px solid rgba(229, 184, 105, 0.25)'
        }}>
          THE HAVELI COURTYARD
        </div>
        <h1 className="text-display" style={{ color: 'var(--on-surface)', marginBottom: '6px' }}>
          GATHER YOUR SUSPECTS
        </h1>
        <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.9375rem', maxWidth: '540px', margin: '0 auto' }}>
          Scan the QR code below or enter the room code on your phone to enter the conclave.
        </p>
        {networkStatus && (
          <div style={{ marginTop: '8px', fontSize: '0.75rem', color: 'var(--gain-text)', fontWeight: 700, letterSpacing: '0.02em' }}>
            ● {networkStatus}
          </div>
        )}
      </div>

      {/* Main Responsive Grid: QR & Settings (Left) vs Living Room Roster (Right) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px',
        width: '100%',
        boxSizing: 'border-box',
        alignItems: 'start'
      }}>
        {/* Left Column: QR Code & Game Rules */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* QR Code Container */}
          <QRCodeView roomCode={roomCode} size={220} onRegenerateCode={onRegenerateCode} />

          {/* Settings Box */}
          <div className="card-interactive" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '12px' }}>
              <Settings2 size={20} color="var(--primary)" />
              <h2 className="text-title" style={{ color: 'var(--on-surface)' }}>Game Rules</h2>
            </div>

            {/* Discussion Timer */}
            <div>
              <label className="text-label" style={{ display: 'block', marginBottom: '8px', color: 'var(--on-surface-variant)' }}>
                Round-Table Discussion Timer
              </label>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {discussionOptions.map(sec => (
                  <button
                    key={sec}
                    type="button"
                    aria-label={`Discussion timer ${sec} seconds`}
                    onClick={() => onUpdateSettings({ ...settings, discussionTime: sec })}
                    className={settings.discussionTime === sec ? 'category-pill-active' : 'category-pill'}
                  >
                    {sec}s
                  </button>
                ))}
              </div>
            </div>

            {/* Voting Timer */}
            <div>
              <label className="text-label" style={{ display: 'block', marginBottom: '8px', color: 'var(--on-surface-variant)' }}>
                Secret Ballot Timer
              </label>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {votingOptions.map(sec => (
                  <button
                    key={sec}
                    type="button"
                    aria-label={`Voting timer ${sec} seconds`}
                    onClick={() => onUpdateSettings({ ...settings, votingTime: sec })}
                    className={settings.votingTime === sec ? 'category-pill-active' : 'category-pill'}
                  >
                    {sec}s
                  </button>
                ))}
              </div>
            </div>

            {/* Kaminey Ratio */}
            <div>
              <label className="text-label" style={{ display: 'block', marginBottom: '8px', color: 'var(--on-surface-variant)' }}>
                Kaminey (Traitors)
              </label>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {kamineyOptions.map(opt => (
                  <button
                    key={opt}
                    type="button"
                    aria-label={`Kaminey count ${opt}`}
                    onClick={() => onUpdateSettings({ ...settings, kamineyCount: opt })}
                    className={settings.kamineyCount === opt ? 'category-pill-active' : 'category-pill'}
                  >
                    {opt === 'auto' ? 'Auto Balanced' : `${opt} Traitor`}
                  </button>
                ))}
              </div>
            </div>

            {/* Dares Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '6px' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--on-surface)' }}>House Party Dares</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>
                  Secret side-quests to confuse the court
                </div>
              </div>
              <button
                type="button"
                aria-label="Toggle party dares"
                onClick={() => onUpdateSettings({ ...settings, enableDares: !settings.enableDares })}
                className={settings.enableDares ? 'category-pill-active' : 'category-pill'}
              >
                {settings.enableDares ? 'Active' : 'Off'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Player Roster & Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card-interactive" style={{ display: 'flex', flexDirection: 'column', minHeight: '520px' }}>
            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              paddingBottom: '14px',
              marginBottom: '18px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Users size={22} color="var(--primary)" />
                <h2 className="text-title" style={{ color: 'var(--on-surface)' }}>Living Room Guests ({players.length})</h2>
              </div>
              <span className={canStart ? 'badge-gain' : 'badge-warning'}>
                {canStart ? 'Ready to Begin' : `Need ${minPlayers - players.length} more`}
              </span>
            </div>

            {/* Player Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(135px, 1fr))',
              gap: '14px',
              flex: 1,
              alignContent: 'start',
              minHeight: '260px'
            }}>
              {players.map((p) => {
                const avatar = getAvatarById(p.avatarId);
                return (
                  <div
                    key={p.id}
                    style={{
                      position: 'relative',
                      background: 'var(--surface-container-low)',
                      borderRadius: 'var(--rounded-xl)',
                      padding: '16px 12px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      boxShadow: 'var(--shadow-resting)'
                    }}
                  >
                    {/* Remove Player Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemovePlayer?.(p.id);
                      }}
                      className="spring-btn"
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        width: '26px',
                        height: '26px',
                        minWidth: '26px',
                        minHeight: '26px',
                        borderRadius: 'var(--rounded-full)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        background: 'rgba(239, 68, 68, 0.1)',
                        color: 'var(--loss-text)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        padding: 0
                      }}
                      aria-label={`Remove guest ${p.name}`}
                      title={`Remove ${p.name}`}
                    >
                      <X size={14} strokeWidth={2.5} />
                    </button>

                    <div style={{ marginBottom: '10px' }}>
                      <AvatarBadge avatar={avatar} size={56} />
                    </div>

                    <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--on-surface)', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%', whiteSpace: 'nowrap' }}>
                      {p.name}
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--on-surface-variant)', fontWeight: 600, marginTop: '2px' }}>
                      {avatar.title}
                    </div>
                    {p.isBot && (
                      <span style={{
                        fontSize: '0.625rem',
                        background: 'rgba(255, 255, 255, 0.06)',
                        color: 'var(--on-surface-variant)',
                        padding: '2px 8px',
                        borderRadius: 'var(--rounded-sm)',
                        marginTop: '6px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        border: '1px solid rgba(255, 255, 255, 0.08)'
                      }}>
                        <Bot size={10} /> BOT
                      </span>
                    )}
                  </div>
                );
              })}

              {players.length === 0 && (
                <div style={{
                  gridColumn: '1 / -1',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '50px 20px',
                  color: 'var(--on-surface-variant)',
                  textAlign: 'center'
                }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'rgba(229, 184, 105, 0.08)',
                    border: '1px solid rgba(229, 184, 105, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--primary)',
                    marginBottom: '12px'
                  }}>
                    <Smartphone size={28} strokeWidth={2.2} />
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--on-surface)' }}>No guests entered the haveli</div>
                  <div style={{ fontSize: '0.875rem', marginTop: '6px', maxWidth: '340px' }}>
                    Point phone cameras at the QR code on the left or enter room code <strong style={{ color: 'var(--primary)' }}>{roomCode}</strong>
                  </div>
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              paddingTop: '18px',
              marginTop: '18px'
            }}>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={onAddBot}
                  className="btn-secondary spring-btn"
                  style={{ flex: 1, minWidth: '130px' }}
                  aria-label="Add simulated player"
                  title="Add single simulated player"
                >
                  <UserPlus size={16} />
                  Add Guest (+1)
                </button>

                {!canStart && onQuickStartWithBots && (
                  <button
                    type="button"
                    onClick={onQuickStartWithBots}
                    className="spring-btn"
                    aria-label="Auto-fill bots and launch game"
                    style={{
                      flex: 1.2,
                      minWidth: '180px',
                      minHeight: '48px',
                      padding: '10px 16px',
                      borderRadius: 'var(--rounded-xl)',
                      background: 'rgba(229, 184, 105, 0.12)',
                      color: 'var(--primary)',
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      border: '1px solid rgba(229, 184, 105, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      cursor: 'pointer'
                    }}
                    title="Fill remaining slots with bots and launch immediately for testing"
                  >
                    <Sparkles size={16} />
                    Auto-Fill Guests & Launch
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={onStartGame}
                disabled={!canStart}
                className="btn-primary spring-btn"
                aria-label="Begin game"
                style={{
                  width: '100%',
                  padding: '16px',
                  fontSize: '1.05rem',
                  opacity: canStart ? 1 : 0.45,
                  cursor: canStart ? 'pointer' : 'not-allowed'
                }}
              >
                <Play size={18} fill="#0A0B0E" color="#0A0B0E" />
                {canStart ? 'BEGIN THE HAVELI CONCLAVE' : `Waiting for ${minPlayers - players.length} more guests (Min ${minPlayers})`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
