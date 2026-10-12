import React, { useState, useEffect } from 'react';

/**
 * Atomic Loading Barrier Component
 * Enforces atomic screen revelation so all component elements resolve together
 * in a single synchronized visual frame — eliminating staggered pop-in, partial
 * rendering, and cumulative layout shift.
 */
export default function AtomicLoadingBarrier({
  isLoading = false,
  fallback,
  children,
  minDuration = 200, // Enforces debounce to eliminate micro-jitter
}) {
  const [ready, setReady] = useState(!isLoading);

  useEffect(() => {
    let timer;
    if (isLoading) {
      setReady(false);
    } else {
      // Hold barrier until minDuration expires so layout stabilizes atomically
      timer = setTimeout(() => {
        setReady(true);
      }, minDuration);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isLoading, minDuration]);

  if (!ready) {
    return (
      <div
        className="atomic-loading-container"
        style={{
          width: '100%',
          opacity: 1,
          transition: 'opacity 0.2s ease',
        }}
      >
        {fallback}
      </div>
    );
  }

  return (
    <div
      className="spring-settle-in"
      style={{
        width: '100%',
      }}
    >
      {children}
    </div>
  );
}
