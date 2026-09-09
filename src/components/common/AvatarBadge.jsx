import React from 'react';
import { getAvatarById } from '../../data/animalAvatars';

export default function AvatarBadge({
  avatar,
  avatarId,
  size = 40,
  fontSize,
  className = '',
  style = {}
}) {
  const av = avatar || (avatarId ? getAvatarById(avatarId) : null) || getAvatarById('lion');
  const calculatedFontSize = fontSize || Math.round(size * 0.82);

  return (
    <span
      className={`avatar-badge cheeky-avatar ${className}`}
      role="img"
      aria-label={`${av.name} (${av.title})`}
      title={`${av.name} (${av.title})`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
        fontSize: `${calculatedFontSize}px`,
        lineHeight: 1,
        userSelect: 'none',
        ...style
      }}
    >
      {av.emoji}
    </span>
  );
}
