import React, { useRef, useState, useEffect } from 'react';

/**
 * Viscoelastic Segmented Control Component
 * Enforces concentric radii: r_inner = max(0, r_outer - padding)
 * Features sliding viscoelastic highlight pill with Poisson elasticity.
 */
export default function SegmentedControl({
  options = [],
  value,
  onChange,
  size = 'md',
  className = '',
  style = {},
}) {
  const containerRef = useRef(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });

  // Concentric radii measurements
  const padding = 4;
  const outerRadius = size === 'sm' ? 10 : 14;
  const innerRadius = Math.max(0, outerRadius - padding);

  useEffect(() => {
    if (!containerRef.current) return;
    const activeIndex = options.findIndex((opt) => opt.value === value);
    if (activeIndex === -1) return;

    const buttons = containerRef.current.querySelectorAll('button');
    const activeButton = buttons[activeIndex];
    if (activeButton) {
      setIndicatorStyle({
        left: activeButton.offsetLeft,
        width: activeButton.offsetWidth,
        opacity: 1,
      });
    }
  }, [value, options]);

  return (
    <div
      ref={containerRef}
      role="tablist"
      className={`segmented-control ${className}`}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        padding: `${padding}px`,
        backgroundColor: 'var(--surface-container-low)',
        borderRadius: `${outerRadius}px`,
        border: '1px solid var(--outline-variant)',
        userSelect: 'none',
        ...style,
      }}
    >
      {/* Viscoelastic sliding highlight */}
      <span
        style={{
          position: 'absolute',
          top: `${padding}px`,
          bottom: `${padding}px`,
          left: `${indicatorStyle.left}px`,
          width: `${indicatorStyle.width}px`,
          backgroundColor: 'var(--primary)',
          borderRadius: `${innerRadius}px`,
          boxShadow: 'var(--glow-gold)',
          transition: 'left 0.24s var(--spring-timing-apple), width 0.2s var(--spring-timing-apple), opacity 0.15s ease',
          opacity: indicatorStyle.opacity,
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange && onChange(option.value)}
            style={{
              position: 'relative',
              zIndex: 2,
              background: 'transparent',
              border: 'none',
              padding: size === 'sm' ? '6px 12px' : '8px 16px',
              minHeight: size === 'sm' ? '32px' : '38px',
              fontSize: size === 'sm' ? '0.8125rem' : '0.875rem',
              fontWeight: isActive ? 700 : 500,
              color: isActive ? 'var(--primary-contrast)' : 'var(--on-surface-variant)',
              borderRadius: `${innerRadius}px`,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'color 0.18s ease',
              outline: 'none',
            }}
          >
            {option.icon && (
              <span style={{ display: 'inline-flex', transform: 'translateY(-0.5px)' }}>
                {option.icon}
              </span>
            )}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
