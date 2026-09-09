import React, { useState, useEffect } from 'react';
import { ANIMAL_AVATARS, getAvatarById } from '../../data/animalAvatars';
import AvatarBadge from '../common/AvatarBadge';
import { Sparkles, ArrowRight, Dices, User } from 'lucide-react';

const SPY_NAMES = ['Kabir', 'Simran', 'Dev', 'Zoya', 'Rocky', 'Tara', 'Arjun', 'Maya', 'Veer', 'Pooja', 'Rohan', 'Ananya', 'Sameer', 'Kavya'];

export default function PlayerJoin({ initialRoomCode = '', onJoin }) {
  const [roomCode, setRoomCode] = useState(initialRoomCode);
  const [name, setName] = useState('');

  useEffect(() => {
    if (initialRoomCode) {
      setRoomCode(initialRoomCode.toUpperCase().trim());
    }
  }, [initialRoomCode]);

  const [selectedAvatarId, setSelectedAvatarId] = useState(() => {
    const randomIndex = Math.floor(Math.random() * ANIMAL_AVATARS.length);
    return ANIMAL_AVATARS[randomIndex].id;
  });
  const [error, setError] = useState('');

  const activeAvatar = getAvatarById(selectedAvatarId);

  const rollRandomName = () => {
    const randomName = SPY_NAMES[Math.floor(Math.random() * SPY_NAMES.length)];
    setName(randomName);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!roomCode.trim()) {
      setError('Enter 6-character room code');
      return;
    }
    const finalName = name.trim() || SPY_NAMES[Math.floor(Math.random() * SPY_NAMES.length)];
    setError('');
    onJoin({
      roomCode: roomCode.trim().toUpperCase(),
      name: finalName,
      avatarId: selectedAvatarId
    });
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '440px',
      margin: '0 auto',
      padding: '16px 14px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      boxSizing: 'border-box'
    }}>
      {/* Active Persona Banner */}
      <div style={{
        padding: '18px 20px',
        background: 'var(--surface-container-low)',
        borderRadius: 'var(--rounded-2xl)',
        border: '1px solid var(--outline-variant)',
        boxShadow: 'var(--shadow-resting)',
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div style={{
          position: 'relative',
          flexShrink: 0
        }}>
          <AvatarBadge avatar={activeAvatar} size={58} />
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{
            fontSize: '0.6875rem',
            fontWeight: 800,
            letterSpacing: '0.08em',
            color: 'var(--primary)',
            marginBottom: '2px'
          }}>
            🎭 GUPT ENTRY IDENTITY
          </div>
          <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--on-surface)', letterSpacing: '-0.02em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {activeAvatar.name}
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--on-surface-variant)', fontWeight: 600 }}>
            {activeAvatar.title}
          </div>
        </div>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="card-interactive" style={{ display: 'flex', flexDirection: 'column', gap: '16px', boxSizing: 'border-box' }}>
        {error && (
          <div className="badge-loss" style={{ padding: '8px 12px', borderRadius: 'var(--rounded-md)', fontSize: '0.8125rem' }}>
            {error}
          </div>
        )}

        {/* Room Code */}
        <div>
          <label className="text-label" style={{ display: 'block', marginBottom: '6px', color: 'var(--on-surface-variant)' }}>
            TV KA ROOM CODE
          </label>
          <input
            type="text"
            maxLength={6}
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            placeholder="e.g. HAV412"
            className="input-base tabular-nums"
            style={{
              textAlign: 'center',
              fontSize: '1.35rem',
              fontWeight: 800,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              boxSizing: 'border-box',
              minHeight: '48px'
            }}
            required
          />
        </div>

        {/* Player Name with Dice Quick Fill */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <label className="text-label" style={{ color: 'var(--on-surface-variant)' }}>
              APNA NAAM (SPY BAN KE AAO)
            </label>
            <button
              type="button"
              onClick={rollRandomName}
              className="spring-btn"
              aria-label="Roll random secret name"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--primary)',
                fontSize: '0.75rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer',
                padding: '4px 6px',
                minHeight: '36px'
              }}
              title="Roll a random secret name"
            >
              <Dices size={14} />
              <span>🎲 Random Naam</span>
            </button>
          </div>

          <input
            type="text"
            maxLength={18}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Apna naam dalo ya random chuno"
            className="input-base"
            style={{ boxSizing: 'border-box', minHeight: '48px' }}
          />
        </div>

        {/* Avatar Grid */}
        <div>
          <label className="text-label" style={{ display: 'block', marginBottom: '8px', color: 'var(--on-surface-variant)' }}>
            AVATAR CHUNO (KOI SHAK NA KARE)
          </label>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '8px',
            maxHeight: '190px',
            overflowY: 'auto',
            padding: '2px',
            boxSizing: 'border-box'
          }}>
            {ANIMAL_AVATARS.map(avatar => {
              const isSelected = avatar.id === selectedAvatarId;
              return (
                <button
                  key={avatar.id}
                  type="button"
                  onClick={() => setSelectedAvatarId(avatar.id)}
                  className="spring-btn"
                  aria-label={`Select avatar ${avatar.name}`}
                  style={{
                    background: isSelected ? 'var(--primary-subtle)' : 'var(--surface-container-low)',
                    color: isSelected ? 'var(--primary)' : 'var(--on-surface)',
                    border: isSelected ? '2px solid var(--primary)' : '1px solid var(--outline-variant)',
                    borderRadius: 'var(--rounded-xl)',
                    padding: '8px 4px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    minWidth: 0,
                    minHeight: '60px',
                    boxSizing: 'border-box',
                    boxShadow: isSelected ? 'var(--shadow-glow-primary)' : 'var(--shadow-resting)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <AvatarBadge avatar={avatar} size={30} showRing={false} />
                  <span style={{ fontSize: '0.625rem', fontWeight: 700, width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'center' }}>
                    {avatar.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          className="btn-primary spring-btn"
          aria-label="Enter the Haveli"
          style={{ width: '100%', padding: '14px', fontSize: '0.9375rem', boxSizing: 'border-box', minHeight: '48px', marginTop: '6px' }}
        >
          <span>HAVELI MEIN GHUSO 🚪</span>
          <ArrowRight size={18} />
        </button>
      </form>
    </div>
  );
}
