import React from 'react';
import QRCodeView from '../common/QRCodeView';
import { getAvatarById } from '../../data/animalAvatars';
import { Play, UserPlus, Users, Settings2, Sparkles, AlertCircle } from 'lucide-react';

export default function HostLobby({
  roomCode,
  players,
  settings,
  onUpdateSettings,
  onStartGame,
  onAddBot,
  networkStatus
}) {
  const minPlayers = 4;
  const canStart = players.length >= minPlayers;

  const discussionOptions = [30, 60, 90, 120, 180];
  const votingOptions = [30, 45, 60];
  const kamineyOptions = ['auto', '1', '2', '3'];

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '24px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    }}>
      {/* Top Banner */}
      <div style={{
        textAlign: 'center',
        padding: '20px',
        background: 'linear-gradient(135deg, rgba(0, 61, 155, 0.06), rgba(40, 90, 185, 0.04))',
        borderRadius: 'var(--rounded-2xl)',
        border: '1px solid rgba(0, 61, 155, 0.12)'
      }}>
        <h1 className="text-display" style={{ color: 'var(--primary)', marginBottom: '8px' }}>
          THE HAVELI CONCLAVE
        </h1>
        <p className="text-body" style={{ color: 'var(--on-surface-variant)', maxWidth: '600px', margin: '0 auto' }}>
          Keep this screen in the living room. Every guest connects from their phone.
          Secret roles will be assigned privately. Who among you is a <strong style={{ color: 'var(--loss)' }}>Kamina</strong>?
        </p>
        {networkStatus && (
          <div style={{ marginTop: '10px', fontSize: '0.8125rem', color: 'var(--secondary)', fontWeight: 600 }}>
            ● {networkStatus}
          </div>
        )}
      </div>

      {/* Main Grid: QR & Settings (Left) vs Joined Players (Right) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '16px',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        {/* Left Column: QR Code & Game Rules */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* QR Code Container */}
          <QRCodeView roomCode={roomCode} size={200} />

          {/* Settings Box */}
          <div className="card-interactive" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--outline-variant)', paddingBottom: '10px' }}>
              <Settings2 size={20} color="var(--primary)" />
              <h2 className="text-title" style={{ color: 'var(--primary)' }}>Game Settings</h2>
            </div>

            {/* Discussion Timer */}
            <div>
              <label className="text-label" style={{ display: 'block', marginBottom: '8px', color: 'var(--on-surface-variant)' }}>
                Round-Table Discussion Timer:
              </label>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {discussionOptions.map(sec => (
                  <button
                    key={sec}
                    type="button"
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
                Voting Ballot Timer:
              </label>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {votingOptions.map(sec => (
                  <button
                    key={sec}
                    type="button"
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
                Kaminey (Traitors) Count:
              </label>
              <div style={{ display: 'flex', gap: '6px' }}>
                {kamineyOptions.map(opt => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => onUpdateSettings({ ...settings, kamineyCount: opt })}
                    className={settings.kamineyCount === opt ? 'category-pill-active' : 'category-pill'}
                  >
                    {opt === 'auto' ? 'Auto Balanced' : `${opt} Kamina`}
                  </button>
                ))}
              </div>
            </div>

            {/* Dares & Distractions Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '4px' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>House Party Dares</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>
                  Gives secret social tasks to distract Bhole
                </div>
              </div>
              <button
                type="button"
                onClick={() => onUpdateSettings({ ...settings, enableDares: !settings.enableDares })}
                className={settings.enableDares ? 'category-pill-active' : 'category-pill'}
              >
                {settings.enableDares ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Player Roster & Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card-interactive" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid var(--outline-variant)',
              paddingBottom: '12px',
              marginBottom: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={20} color="var(--primary)" />
                <h2 className="text-title">Living Room Guests ({players.length})</h2>
              </div>
              <span className={canStart ? 'badge-gain' : 'badge-warning'}>
                {canStart ? 'Ready to Begin' : `Need ${minPlayers - players.length} more`}
              </span>
            </div>

            {/* Player Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
              gap: '12px',
              flex: 1,
              alignContent: 'start',
              minHeight: '220px'
            }}>
              {players.map((p, idx) => {
                const avatar = getAvatarById(p.avatarId);
                return (
                  <div
                    key={p.id}
                    style={{
                      background: 'var(--surface-container-low)',
                      borderRadius: 'var(--rounded-xl)',
                      padding: '14px 10px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      border: '1px solid rgba(9, 30, 66, 0.08)',
                      boxShadow: 'var(--shadow-resting)'
                    }}
                  >
                    <div style={{
                      fontSize: '2.25rem',
                      lineHeight: 1,
                      marginBottom: '6px',
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                    }}>
                      {avatar.emoji}
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--on-surface)', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%', whiteSpace: 'nowrap' }}>
                      {p.name}
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--on-surface-variant)', fontWeight: 600 }}>
                      {avatar.title}
                    </div>
                    {p.isBot && (
                      <span style={{ fontSize: '0.625rem', background: 'var(--outline-variant)', padding: '2px 6px', borderRadius: 'var(--rounded-sm)', marginTop: '4px' }}>
                        BOT
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
                  padding: '40px 20px',
                  color: 'var(--on-surface-variant)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>📱</div>
                  <div style={{ fontWeight: 600 }}>No guests joined yet</div>
                  <div style={{ fontSize: '0.8125rem', marginTop: '4px' }}>
                    Ask players to scan the QR code or enter code <strong>{roomCode}</strong>
                  </div>
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              borderTop: '1px solid var(--outline-variant)',
              paddingTop: '16px',
              marginTop: '16px'
            }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={onAddBot}
                  className="btn-secondary spring-btn"
                  style={{ flex: 1 }}
                  title="Add simulated player for solo testing"
                >
                  <UserPlus size={16} />
                  Add Test Guest (Bot)
                </button>
              </div>

              <button
                type="button"
                onClick={onStartGame}
                disabled={!canStart}
                className="btn-primary spring-btn"
                style={{
                  width: '100%',
                  padding: '16px',
                  fontSize: '1.125rem',
                  opacity: canStart ? 1 : 0.45,
                  cursor: canStart ? 'pointer' : 'not-allowed'
                }}
              >
                <Play size={20} fill="#ffffff" />
                {canStart ? 'BEGIN THE HAVELI MYSTERY' : `Waiting for ${minPlayers - players.length} more guests (Min ${minPlayers})`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
