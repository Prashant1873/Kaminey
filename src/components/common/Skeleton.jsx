import React from 'react';

/**
 * Coordinated Skeleton Primitives
 * Exact dimension mirroring to guarantee Zero Cumulative Layout Shift (CLS = 0).
 * Features subtle warm amber-tinted shimmer sweep matching the Royal Haveli palette.
 */

export function SkeletonBox({
  width = '100%',
  height = '20px',
  borderRadius = 'var(--r-md)',
  style = {},
  className = '',
}) {
  return (
    <div
      className={`skeleton-shimmer ${className}`}
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: 'var(--surface-container-high)',
        boxSizing: 'border-box',
        flexShrink: 0,
        ...style,
      }}
    />
  );
}

export function SkeletonText({
  lines = 1,
  width = '100%',
  lineHeight = '14px',
  gap = '8px',
  style = {},
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap, width, ...style }}>
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonBox
          key={i}
          height={lineHeight}
          width={i === lines - 1 && lines > 1 ? '70%' : '100%'}
          borderRadius="var(--r-sm)"
        />
      ))}
    </div>
  );
}

export function SkeletonAvatar({ size = 48, showRing = true }) {
  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <SkeletonBox
        width={`${size}px`}
        height={`${size}px`}
        borderRadius="50%"
        style={{
          border: showRing ? '1.5px solid var(--primary-subtle-border)' : 'none',
        }}
      />
    </div>
  );
}

export function SkeletonCard({ height = '180px', padding = '20px', children, style = {} }) {
  return (
    <div
      className="card-interactive"
      style={{
        height,
        padding,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {children || (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <SkeletonAvatar size={44} />
            <div style={{ flex: 1 }}>
              <SkeletonText lines={2} lineHeight="14px" gap="6px" />
            </div>
          </div>
          <SkeletonBox height="44px" borderRadius="var(--r-lg)" />
        </>
      )}
    </div>
  );
}

/**
 * Pre-composed Lobby Skeleton mirroring Host Base Station
 */
export function HostLobbySkeleton() {
  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', boxSizing: 'border-box' }}>
      <div style={{ padding: '20px 24px', background: 'var(--surface-container-low)', borderRadius: 'var(--r-2xl)', border: '1px solid var(--outline-variant)' }}>
        <SkeletonText lines={2} lineHeight="18px" gap="8px" width="40%" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 400px) 1fr', gap: '24px' }}>
        <SkeletonCard height="420px" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '14px' }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} height="150px" padding="16px" />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Pre-composed Mobile Player Screen Skeleton
 */
export function PlayerScreenSkeleton() {
  return (
    <div style={{ width: '100%', maxWidth: '440px', margin: '0 auto', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '18px', boxSizing: 'border-box' }}>
      <div style={{ padding: '16px', background: 'var(--surface-container-low)', borderRadius: 'var(--r-xl)', border: '1px solid var(--outline-variant)', display: 'flex', alignItems: 'center', gap: '14px' }}>
        <SkeletonAvatar size={50} />
        <div style={{ flex: 1 }}>
          <SkeletonText lines={2} lineHeight="14px" gap="6px" />
        </div>
      </div>
      <SkeletonCard height="260px" />
      <SkeletonBox height="50px" borderRadius="var(--r-lg)" />
    </div>
  );
}
