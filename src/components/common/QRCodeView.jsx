import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Copy, Check, QrCode, RefreshCw } from 'lucide-react';

export default function QRCodeView({ roomCode, size = 220, onRegenerateCode }) {
  const canvasRef = useRef(null);
  const [copied, setCopied] = useState(false);

  const cleanPath = typeof window !== 'undefined'
    ? window.location.pathname.replace(/index\.html$/, '')
    : '/';

  const joinUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${cleanPath}#/join/${roomCode}`
    : `https://kaminey.game/#/join/${roomCode}`;

  useEffect(() => {
    if (canvasRef.current && roomCode) {
      QRCode.toCanvas(canvasRef.current, joinUrl, {
        width: size,
        margin: 1,
        color: {
          dark: '#0A0B0E',
          light: '#FFFFFF'
        }
      }, (error) => {
        if (error) console.error('QR code generation error:', error);
      });
    }
  }, [joinUrl, roomCode, size]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(joinUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.warn('Clipboard write failed:', e);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '16px',
      padding: '24px 20px',
      background: 'var(--surface-container-low)',
      borderRadius: 'var(--rounded-2xl)',
      border: '1px solid var(--outline-variant)',
      boxShadow: 'var(--shadow-resting)',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <div style={{
        padding: '12px',
        borderRadius: 'var(--rounded-xl)',
        background: '#FFFFFF',
        display: 'inline-block',
        boxShadow: '0 4px 14px rgba(0,0,0,0.08)'
      }}>
        <canvas ref={canvasRef} style={{ display: 'block', borderRadius: 'var(--rounded-md)' }} />
      </div>

      <div style={{ textAlign: 'center', width: '100%' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Haveli Room Code
        </div>
        <div className="tabular-nums" style={{
          fontSize: 'clamp(2.5rem, 6vw, 3.5rem)',
          fontWeight: 800,
          letterSpacing: '0.12em',
          color: 'var(--primary)',
          lineHeight: 1.1,
          marginTop: '4px'
        }}>
          {roomCode}
        </div>
        <div style={{ fontSize: '0.8125rem', color: 'var(--on-surface-variant)', marginTop: '4px' }}>
          Point camera to join handset controller
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', width: '100%', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={copyLink}
          className="btn-secondary spring-btn"
          aria-label="Copy invitation link"
          style={{
            minHeight: '42px',
            padding: '8px 16px',
            fontSize: '0.84375rem',
            background: copied ? 'var(--gain-subtle)' : undefined,
            color: copied ? 'var(--gain-text)' : undefined,
            borderColor: copied ? 'var(--gain)' : undefined
          }}
        >
          {copied ? <Check size={15} /> : <Copy size={15} />}
          <span>{copied ? 'Link Copied' : 'Copy Link'}</span>
        </button>

        {onRegenerateCode && (
          <button
            type="button"
            onClick={onRegenerateCode}
            className="btn-secondary spring-btn"
            title="Generate a fresh new room code"
            aria-label="Generate new room code"
            style={{
              minHeight: '42px',
              padding: '8px 16px',
              fontSize: '0.84375rem'
            }}
          >
            <RefreshCw size={14} />
            <span>New Code</span>
          </button>
        )}
      </div>
    </div>
  );
}
