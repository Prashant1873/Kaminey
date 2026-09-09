import React, { useEffect, useRef, useState } from 'react';
import { Maximize2, Minimize2, Sparkles, Zap, Eye, RotateCw } from 'lucide-react';

export default function TrippyVisualizer({
  height = '420px',
  allowFullscreen = true,
  autoPlay = true,
  className = ''
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [mode, setMode] = useState('tunnel'); // 'tunnel' | 'kaleidoscope' | 'plasma'
  const [speed, setSpeed] = useState(1); // 0.5, 1, 1.8
  const [isFullscreen, setIsFullscreen] = useState(false);
  const animationFrameId = useRef(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 });

  // Handle pointer interaction to warp the visualizer
  const handlePointerMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseRef.current.targetX = Math.max(0, Math.min(1, x));
    mouseRef.current.targetY = Math.max(0, Math.min(1, y));
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;

    const resize = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    const ro = new ResizeObserver(resize);
    if (containerRef.current) ro.observe(containerRef.current);

    // Render loop
    const render = () => {
      const rect = containerRef.current ? containerRef.current.getBoundingClientRect() : { width: 600, height: 400 };
      const w = rect.width;
      const h = rect.height;
      const cx = w / 2;
      const cy = h / 2;

      // Smooth mouse interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;
      const mx = (mouseRef.current.x - 0.5) * 2;
      const my = (mouseRef.current.y - 0.5) * 2;

      time += 0.018 * speed;

      // Trail fade effect for motion blur
      ctx.fillStyle = mode === 'plasma' ? 'rgba(5, 7, 14, 0.18)' : 'rgba(4, 5, 10, 0.22)';
      ctx.fillRect(0, 0, w, h);

      if (mode === 'tunnel') {
        // MODE 1: Hypnotic Infinite Neon Warp Tunnel
        const ringCount = 28;
        const baseRadius = Math.min(w, h) * 0.85;

        for (let i = ringCount; i >= 1; i--) {
          const depthOffset = (i / ringCount + (time * 0.4) % (1 / ringCount));
          const z = depthOffset * depthOffset;
          const r = baseRadius * z;
          if (r < 2) continue;

          const ringCenterX = cx + mx * (1 - z) * 120 + Math.sin(time * 1.5 + i * 0.15) * 15 * z;
          const ringCenterY = cy + my * (1 - z) * 120 + Math.cos(time * 1.2 + i * 0.15) * 15 * z;

          const hue = (time * 60 + i * 14 + z * 180) % 360;
          ctx.strokeStyle = `hsla(${hue}, 95%, 62%, ${Math.min(1, 0.2 + z * 0.8)})`;
          ctx.lineWidth = Math.max(1.2, 3.5 * z);

          const sides = 8;
          const rot = time * 0.6 + i * 0.08;
          ctx.beginPath();
          for (let s = 0; s <= sides; s++) {
            const angle = rot + (s * Math.PI * 2) / sides;
            const px = ringCenterX + Math.cos(angle) * r;
            const py = ringCenterY + Math.sin(angle) * r;
            if (s === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.stroke();

          // Connective radial warp spokes every 4 rings
          if (i % 4 === 0) {
            ctx.strokeStyle = `hsla(${(hue + 40) % 360}, 100%, 70%, ${z * 0.35})`;
            ctx.lineWidth = 1;
            for (let s = 0; s < sides; s += 2) {
              const angle = rot + (s * Math.PI * 2) / sides;
              ctx.beginPath();
              ctx.moveTo(ringCenterX, ringCenterY);
              ctx.lineTo(ringCenterX + Math.cos(angle) * r * 1.2, ringCenterY + Math.sin(angle) * r * 1.2);
              ctx.stroke();
            }
          }
        }

        // Central glowing vortex core
        const coreGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, 60);
        coreGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
        coreGradient.addColorStop(0.3, `hsla(${(time * 80) % 360}, 100%, 65%, 0.7)`);
        coreGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = coreGradient;
        ctx.beginPath();
        ctx.arc(cx, cy, 60, 0, Math.PI * 2);
        ctx.fill();

      } else if (mode === 'kaleidoscope') {
        // MODE 2: Psychedelic Rotational Mandala
        const segments = 12;
        const maxRadius = Math.min(cx, cy) * 1.1;

        ctx.save();
        ctx.translate(cx, cy);

        for (let s = 0; s < segments; s++) {
          ctx.save();
          ctx.rotate((s * Math.PI * 2) / segments + time * 0.25);
          if (s % 2 === 1) ctx.scale(1, -1);

          // Draw trippy layered petal curves
          for (let layer = 1; layer <= 6; layer++) {
            const lr = (maxRadius / 6) * layer;
            const hue = (time * 70 + layer * 45 + s * 15) % 360;
            const wave = Math.sin(time * 2 + layer * 0.8) * 28;

            ctx.strokeStyle = `hsla(${hue}, 100%, 65%, 0.75)`;
            ctx.lineWidth = 2.2;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(
              lr * 0.4 + wave,
              lr * 0.3,
              lr * 0.8,
              lr * 0.7 + wave,
              lr,
              0
            );
            ctx.stroke();

            // Symmetrical glowing bead
            ctx.fillStyle = `hsla(${(hue + 120) % 360}, 90%, 65%, 0.9)`;
            ctx.beginPath();
            ctx.arc(lr * 0.7, wave * 0.5, 3.5, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.restore();
        }

        ctx.restore();

      } else {
        // MODE 3: Liquid Acid Plasma Waves
        const particles = 40;
        const maxR = Math.min(cx, cy) * 1.2;

        for (let p = 0; p < particles; p++) {
          const angle = (p / particles) * Math.PI * 2 + time * 0.3;
          const radiusDistort = Math.sin(time * 3 + p * 0.5) * 45 + Math.cos(time * 2 + p * 0.8) * 30;
          const r = Math.min(maxR, (p / particles) * maxR + radiusDistort);
          const px = cx + Math.cos(angle) * r + mx * 50;
          const py = cy + Math.sin(angle) * r + my * 50;

          const hue = (time * 85 + p * 12) % 360;
          const size = Math.abs(Math.sin(time * 2 + p)) * 32 + 10;

          const grad = ctx.createRadialGradient(px, py, 0, px, py, size);
          grad.addColorStop(0, `hsla(${hue}, 100%, 75%, 0.85)`);
          grad.addColorStop(0.5, `hsla(${(hue + 60) % 360}, 95%, 55%, 0.4)`);
          grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(px, py, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      ro.disconnect();
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [mode, speed]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handlePointerMove}
      onTouchMove={(e) => {
        if (e.touches[0]) {
          handlePointerMove({ clientX: e.touches[0].clientX, clientY: e.touches[0].clientY });
        }
      }}
      className={`trippy-visualizer-container ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        height: isFullscreen ? '100vh' : height,
        borderRadius: isFullscreen ? '0px' : 'var(--rounded-2xl)',
        overflow: 'hidden',
        backgroundColor: '#04050a',
        boxShadow: '0 20px 50px rgba(0,0,0,0.9), inset 0 0 40px rgba(0,0,0,0.8), 0 0 30px rgba(229, 184, 105, 0.15)',
        border: isFullscreen ? 'none' : '1.5px solid rgba(229, 184, 105, 0.3)'
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block'
        }}
      />

      {/* Floating Header Tag */}
      <div style={{
        position: 'absolute',
        top: '16px',
        left: '18px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: 'rgba(8, 10, 18, 0.75)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        padding: '6px 12px',
        borderRadius: 'var(--rounded-md)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        color: '#ffffff',
        fontSize: '0.75rem',
        fontWeight: 700,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        pointerEvents: 'none'
      }}>
        <Sparkles size={14} color="var(--primary)" />
        <span>HAVELI PSYCHEDELIC LOUNGE</span>
      </div>

      {/* Control Overlay Bar */}
      <div style={{
        position: 'absolute',
        bottom: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: 'rgba(10, 12, 22, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        padding: '6px 12px',
        borderRadius: 'var(--rounded-xl)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6)',
        maxWidth: '90%',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        {/* Visual Mode Selectors */}
        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            type="button"
            onClick={() => setMode('tunnel')}
            className="spring-btn"
            style={{
              background: mode === 'tunnel' ? 'var(--primary)' : 'rgba(255, 255, 255, 0.08)',
              color: mode === 'tunnel' ? '#0A0B0E' : '#CBD5E1',
              border: 'none',
              padding: '6px 12px',
              borderRadius: 'var(--rounded-sm)',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Neon Tunnel
          </button>

          <button
            type="button"
            onClick={() => setMode('kaleidoscope')}
            className="spring-btn"
            style={{
              background: mode === 'kaleidoscope' ? 'var(--primary)' : 'rgba(255, 255, 255, 0.08)',
              color: mode === 'kaleidoscope' ? '#0A0B0E' : '#CBD5E1',
              border: 'none',
              padding: '6px 12px',
              borderRadius: 'var(--rounded-sm)',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Kaleidoscope
          </button>

          <button
            type="button"
            onClick={() => setMode('plasma')}
            className="spring-btn"
            style={{
              background: mode === 'plasma' ? 'var(--primary)' : 'rgba(255, 255, 255, 0.08)',
              color: mode === 'plasma' ? '#0A0B0E' : '#CBD5E1',
              border: 'none',
              padding: '6px 12px',
              borderRadius: 'var(--rounded-sm)',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Acid Aurora
          </button>
        </div>

        <div style={{ width: '1px', height: '18px', background: 'rgba(255, 255, 255, 0.15)' }} />

        {/* Speed Toggle */}
        <button
          type="button"
          onClick={() => {
            if (speed === 0.5) setSpeed(1);
            else if (speed === 1) setSpeed(1.8);
            else setSpeed(0.5);
          }}
          className="spring-btn"
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            color: '#CBD5E1',
            border: 'none',
            padding: '6px 10px',
            borderRadius: 'var(--rounded-sm)',
            fontSize: '0.75rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer'
          }}
          title="Adjust visual speed"
        >
          <Zap size={13} color="var(--primary)" />
          <span>{speed === 0.5 ? '0.5x' : speed === 1 ? '1.0x' : '1.8x'}</span>
        </button>

        {/* Fullscreen Button */}
        {allowFullscreen && (
          <button
            type="button"
            onClick={toggleFullscreen}
            className="spring-btn"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#CBD5E1',
              border: 'none',
              padding: '6px 10px',
              borderRadius: 'var(--rounded-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Lounge Mode'}
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        )}
      </div>
    </div>
  );
}
