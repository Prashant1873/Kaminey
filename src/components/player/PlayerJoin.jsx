import React, { useState } from 'react';
import { ANIMAL_AVATARS } from '../../data/animalAvatars';
import { Sparkles, ArrowRight, User } from 'lucide-react';

export default function PlayerJoin({ initialRoomCode = '', onJoin }) {
  const [roomCode, setRoomCode] = useState(initialRoomCode);
  const [name, setName] = useState('');
  const [selectedAvatarId, setSelectedAvatarId] = useState('lion');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!roomCode.trim()) {
      setError('Please enter the 6-character room code.');
      return;
    }
    if (!name.trim()) {
      setError('Please enter your player name.');
      return;
    }
    setError('');
    onJoin({
      roomCode: roomCode.trim().toUpperCase(),
      name: name.trim(),
      avatarId: selectedAvatarId
    });
  };

  return (
    <div style={{
      maxWidth: '480px',
      margin: '0 auto',
      padding: '24px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    }}>
      {/* Brand Header */}
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: 'var(--rounded-xl)',
          background: 'linear-gradient(135deg, var(--primary-container), var(--primary))',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem',
          boxShadow: 'var(--shadow-glow-primary)',
          marginBottom: '12px'
        }}>
          🎭
        </div>
        <h1 className="text-display" style={{ color: 'var(--primary)', marginBottom: '6px' }}>
          JOIN KAMINEY
        </h1>
        <p className="text-body" style={{ color: 'var(--on-surface-variant)' }}>
          Enter the room code from the living room screen and choose your animal persona.
        </p>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="card-interactive" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {error && (
          <div className="badge-loss" style={{ padding: '8px 12px', borderRadius: 'var(--rounded-md)' }}>
            {error}
          </div>
        )}

        {/* Room Code Input */}
        <div>
          <label className="text-label" style={{ display: 'block', marginBottom: '6px', color: 'var(--on-surface-variant)' }}>
            Room Code:
          </label>
          <input
            type="text"
            maxLength={6}
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            placeholder="e.g. SHER42"
            className="input-base tabular-nums"
            style={{
              textAlign: 'center',
              fontSize: '1.5rem',
              fontWeight: 800,
              letterSpacing: '0.15em',
              textTransform: 'uppercase'
            }}
            required
          />
        </div>

        {/* Player Name Input */}
        <div>
          <label className="text-label" style={{ display: 'block', marginBottom: '6px', color: 'var(--on-surface-variant)' }}>
            Your Name:
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              maxLength={18}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Kabir or Priya"
              className="input-base"
              required
            />
          </div>
        </div>

        {/* Animal Avatar Selector */}
        <div>
          <label className="text-label" style={{ display: 'block', marginBottom: '8px', color: 'var(--on-surface-variant)' }}>
            Choose Your Animal Icon:
          </label>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '8px',
            maxHeight: '220px',
            overflowY: 'auto',
            padding: '4px'
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
                    borderRadius: 'var(--rounded-xl)',
                    padding: '10px 6px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    boxShadow: isSelected ? 'var(--shadow-glow-primary)' : 'none'
                  }}
                >
                  <span style={{ fontSize: '1.75rem', lineHeight: 1 }}>{avatar.emoji}</span>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 700 }}>{avatar.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn-primary spring-btn"
          style={{ width: '100%', padding: '16px', fontSize: '1.125rem' }}
        >
          <span>Enter Living Room Conclave</span>
          <ArrowRight size={18} />
        </button>
      </form>
    </div>
  );
}
