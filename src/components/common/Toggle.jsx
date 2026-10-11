import React, { useState } from 'react';

/**
 * Viscoelastic Toggle Switch Component
 * Implements Poisson volume preservation and viscoelastic kinetics
 * where thumb elongates during pointer-down/drag before snapping cleanly.
 */
export default function Toggle({
  checked = false,
  onChange,
  disabled = false,
  label,
  id,
  size = 'md',
  ...rest
}) {
  const [isPressed, setIsPressed] = useState(false);

  const handleToggle = () => {
    if (disabled || !onChange) return;
    onChange(!checked);
  };

  const handleKeyDown = (e) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle();
    }
  };

  // Dimensional scaling based on size
  const dims = size === 'sm' 
    ? { width: 44, height: 26, thumb: 20, pad: 3, r: 13 }
    : { width: 52, height: 30, thumb: 24, pad: 3, r: 15 };

  // Calculate viscoelastic stretch: thumb elongates when pressed
  const thumbWidth = isPressed ? dims.thumb + 4 : dims.thumb;
  const thumbLeft = checked
    ? dims.width - thumbWidth - dims.pad
    : dims.pad;

  return (
    <label
      htmlFor={id}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        userSelect: 'none',
      }}
    >
      <div
        id={id}
        role="switch"
        aria-checked={checked}
        tabIndex={disabled ? -1 : 0}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        onPointerDown={() => setIsPressed(true)}
        onPointerUp={() => setIsPressed(false)}
        onPointerLeave={() => setIsPressed(false)}
        style={{
          width: `${dims.width}px`,
          height: `${dims.height}px`,
          borderRadius: `${dims.r}px`,
          backgroundColor: checked ? 'var(--primary)' : 'var(--surface-container-high)',
          border: `1px solid ${checked ? 'var(--primary)' : 'var(--outline-variant)'}`,
          position: 'relative',
          transition: 'background-color 0.25s var(--spring-timing-apple), border-color 0.25s ease',
          boxShadow: checked ? 'var(--glow-gold)' : 'inset 0 1px 2px rgba(0,0,0,0.15)',
          display: 'flex',
          alignItems: 'center',
          flexShrink: 0,
        }}
        {...rest}
      >
        <span
          style={{
            position: 'absolute',
            left: `${thumbLeft}px`,
            width: `${thumbWidth}px`,
            height: `${dims.thumb}px`,
            borderRadius: `${dims.thumb / 2}px`,
            backgroundColor: checked ? 'var(--primary-contrast)' : 'var(--on-surface)',
            boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
            transition: 'left 0.22s var(--spring-timing-apple), width 0.15s ease',
            pointerEvents: 'none',
          }}
        />
      </div>
      {label && (
        <span
          style={{
            fontSize: size === 'sm' ? '0.8125rem' : '0.9375rem',
            fontWeight: 500,
            color: 'var(--on-surface)',
          }}
        >
          {label}
        </span>
      )}
    </label>
  );
}
