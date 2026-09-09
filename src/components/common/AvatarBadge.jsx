import React from 'react';
import { getAvatarById } from '../../data/animalAvatars';

export default function AvatarBadge({
  avatar,
  avatarId,
  size = 40,
  fontSize,
  shape = 'squircle', // 'squircle' | 'circle'
  showRing = true,
  className = '',
  style = {}
}) {
  const av = avatar || (avatarId ? getAvatarById(avatarId) : null) || getAvatarById('lion');
  const calculatedFontSize = fontSize || Math.round(size * 0.56);
  const borderRadius = shape === 'circle' ? '50%' : '24%';

  return (
    <div
      className={`avatar-badge ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
        minHeight: `${size}px`,
        borderRadius,
        background: `radial-gradient(circle at 30% 30%, ${av.color}26, ${av.color}10)`,
        border: showRing ? `1.5px solid ${av.color}4D` : '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: showRing ? `0 4px 14px -2px ${av.color}2B` : 'none',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: `${calculatedFontSize}px`,
        lineHeight: 1,
        transition: 'transform 0.18s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.18s ease',
        boxSizing: 'border-box',
        position: 'relative',
        userSelect: 'none',
        ...style
      }}
      title={`${av.name} (${av.title})`}
    >
      <span role="img" aria-label={av.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {av.emoji}
      </span>
    </div>
  );
}
