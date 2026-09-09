import React, { useState } from 'react';
import { ANIMAL_AVATARS, getAvatarById } from '../../data/animalAvatars';
import { Sparkles, ArrowRight, Dices, User } from 'lucide-react';

const SPY_NAMES = ['Kabir', 'Simran', 'Dev', 'Zoya', 'Rocky', 'Tara', 'Arjun', 'Maya', 'Veer', 'Pooja', 'Rohan', 'Ananya', 'Sameer', 'Kavya'];

export default function PlayerJoin({ initialRoomCode = '', onJoin }) {
  const [roomCode, setRoomCode] = useState(initialRoomCode);
  const [name, setName] = useState('');
  // Randomize initial avatar so multiple players never collide by default
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
        textAlign: 'center',
        padding: '16px',
        background: 'linear-gradient(135deg, var(--surface-container-low), var(--surface-container-lowest))',
        borderRadius: 'var(--rounded-2xl)',
        border: '1px solid var(--outline-variant)',
        boxShadow: 'var(--shadow-resting)'
      }}>
        <div style={{
          fontSize: '3.5rem',
          lineHeight: 1,
          marginBottom: '6px',
          filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.12))',
          animation: 'float-slow 3s infinite ease-in-out'
        }}>
          {activeAvatar.emoji}
        </div>
        <div style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--primary)' }}>
          {activeAvatar.name}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)', fontWeight: 600 }}>
          {activeAvatar.title}
        </div>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="card-interactive" style={{ display: 'flex', flexDirection: 'column', gap: '14px', boxSizing: 'border-box' }}>
        {error && (
          <div className="badge-loss" style={{ padding: '8px 12px', borderRadius: 'var(--rounded-md)', fontSize: '0.8125rem' }}>
            {error}
          </div>
        )}

        {/* Room Code */}
        <div>
          <label className="text-label" style={{ display: 'block', marginBottom: '4px', color: 'var(--on-surface-variant)' }}>
            ROOM CODE
          </label>
          <input
            type="text"
            maxLength={6}
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            placeholder="e.g. HAVELI42"
            className="input-base tabular-nums"
            style={{
              textAlign: 'center',
              fontSize: '1.35rem',
              fontWeight: 800,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              boxSizing: 'border-box'
            }}
            required
          />
        </div>

        {/* Player Name with Dice Quick Fill */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <label className="text-label" style={{ color: 'var(--on-surface-variant)' }}>
              YOUR NAME
            </label>
            <button
              type="button"
              onClick={rollRandomName}
              className="spring-btn"
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
                padding: '2px 4px'
              }}
              title="Roll a random secret name"
            >
              <Dices size={14} />
              <span>Roll Name</span>
            </button>
          </div>

          <input
            type="text"
            maxLength={18}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name or tap Roll Name"
            className="input-base"
            style={{ boxSizing: 'border-box' }}
          />
        </div>

        {/* Avatar Grid */}
        <div>
          <label className="text-label" style={{ display: 'block', marginBottom: '6px', color: 'var(--on-surface-variant)' }}>
            CHOOSE AVATAR ({ANIMAL_AVATARS.length})
          </label>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '6px',
            maxHeight: '180px',
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
                  style={{
                    background: isSelected ? 'var(--primary-container)' : 'var(--surface-container-low)',
                    color: isSelected ? '#ffffff' : 'var(--on-surface)',
                    border: isSelected ? '2px solid var(--primary)' : '1px solid var(--outline-variant)',
                    borderRadius: 'var(--rounded-lg)',
                    padding: '8px 4px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2px',
                    minWidth: 0,
                    boxSizing: 'border-box',
                    boxShadow: isSelected ? 'var(--shadow-glow-primary)' : 'none'
                  }}
                >
                  <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>{avatar.emoji}</span>
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
          style={{ width: '100%', padding: '14px', fontSize: '1rem', boxSizing: 'border-box', marginTop: '6px' }}
        >
          <span>ENTER THE HAVELI</span>
          <ArrowRight size={18} />
        </button>
      </form>
    </div>
  );
}
