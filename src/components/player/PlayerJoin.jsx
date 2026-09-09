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
      width: '100%',
      maxWidth: '440px',
      margin: '0 auto',
      padding: '16px 14px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      boxSizing: 'border-box'
    }}>
      {/* Brand Header */}
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '54px',
          height: '54px',
          borderRadius: 'var(--rounded-xl)',
          background: 'linear-gradient(135deg, var(--primary-container), var(--primary))',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.75rem',
          boxShadow: 'var(--shadow-glow-primary)',
          marginBottom: '8px'
        }}>
          🎭
        </div>
        <h1 className="text-headline" style={{ color: 'var(--primary)', marginBottom: '4px' }}>
          JOIN KAMINEY
        </h1>
        <p className="text-body" style={{ color: 'var(--on-surface-variant)', fontSize: '0.8125rem' }}>
          Enter the room code from the living room screen and choose your animal persona.
        </p>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="card-interactive" style={{ display: 'flex', flexDirection: 'column', gap: '16px', boxSizing: 'border-box' }}>
        {error && (
          <div className="badge-loss" style={{ padding: '8px 12px', borderRadius: 'var(--rounded-md)', fontSize: '0.8125rem' }}>
            {error}
          </div>
        )}

        {/* Room Code Input */}
        <div>
          <label className="text-label" style={{ display: 'block', marginBottom: '4px', color: 'var(--on-surface-variant)' }}>
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
              fontSize: '1.35rem',
              fontWeight: 800,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              boxSizing: 'border-box'
            }}
            required
          />
        </div>

        {/* Player Name Input */}
        <div>
          <label className="text-label" style={{ display: 'block', marginBottom: '4px', color: 'var(--on-surface-variant)' }}>
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
              style={{ boxSizing: 'border-box' }}
              required
            />
          </div>
        </div>

        {/* Animal Avatar Selector */}
        <div>
          <label className="text-label" style={{ display: 'block', marginBottom: '6px', color: 'var(--on-surface-variant)' }}>
            Choose Your Animal Icon:
          </label>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '6px',
            maxHeight: '200px',
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

        {/* Submit Button */}
        <button
          type="submit"
          className="btn-primary spring-btn"
          style={{ width: '100%', padding: '14px', fontSize: '1rem', boxSizing: 'border-box' }}
        >
          <span>Enter Living Room Conclave</span>
          <ArrowRight size={16} />
        </button>
      </form>
    </div>
  );
}
