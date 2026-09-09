import React from 'react';
import {
  Crown,
  Moon,
  Zap,
  Flame,
  Eye,
  ShieldAlert,
  Shield,
  Feather,
  Sparkles,
  Footprints,
  Award,
  Ghost,
  Smile,
  Compass,
  Target,
  Gem,
  User
} from 'lucide-react';
import { getAvatarById } from '../../data/animalAvatars';

export const AVATAR_ICON_MAP = {
  lion: Crown,
  wolf: Moon,
  fox: Zap,
  tiger: Flame,
  owl: Eye,
  snake: ShieldAlert,
  bear: Shield,
  crow: Feather,
  monkey: Sparkles,
  rabbit: Footprints,
  dog: Award,
  cat: Ghost,
  panda: Smile,
  deer: Compass,
  elephant: Target,
  peacock: Gem
};

export default function AvatarBadge({
  avatar,
  avatarId,
  size = 40,
  iconSize,
  shape = 'squircle', // 'squircle' | 'circle'
  showRing = true,
  className = '',
  style = {}
}) {
  const av = avatar || (avatarId ? getAvatarById(avatarId) : null) || getAvatarById('lion');
  const IconComponent = AVATAR_ICON_MAP[av.id] || User;
  const calculatedIconSize = iconSize || Math.round(size * 0.52);

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
        color: av.color || 'var(--primary)',
        transition: 'transform 0.18s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.18s ease',
        boxSizing: 'border-box',
        position: 'relative',
        ...style
      }}
      title={`${av.name} (${av.title})`}
    >
      <IconComponent size={calculatedIconSize} strokeWidth={2.2} />
    </div>
  );
}
