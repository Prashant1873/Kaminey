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
      background: 'var(--surface-container-lowest)',
      borderRadius: 'var(--rounded-2xl)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      boxShadow: 'var(--shadow-elevated)',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <div style={{
        padding: '12px',
        borderRadius: 'var(--rounded-xl)',
        background: '#FFFFFF',
        display: 'inline-block',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)'
      }}>
        <canvas ref={canvasRef} style={{ display: 'block', borderRadius: 'var(--rounded-md)' }} />
      </div>

      <div style={{ textAlign: 'center', width: '100%' }}>
        <div style={{ fontSize: '0.8125rem', color: 'var(--on-surface-variant)', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          Room Access Code
        </div>
        <div className="tabular-nums" style={{
          fontSize: 'clamp(2.5rem, 6vw, 3.75rem)',
          fontWeight: 800,
          letterSpacing: '0.12em',
          color: 'var(--primary)',
          lineHeight: 1.1,
          marginTop: '6px',
          textShadow: '0 2px 20px rgba(229, 184, 105, 0.25)'
        }}>
          {roomCode}
        </div>
        <div style={{ fontSize: '0.8125rem', color: 'var(--on-surface-variant)', marginTop: '4px' }}>
          Point phone camera at QR or enter code at home
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', width: '100%', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          onClick={copyLink}
          className="spring-btn"
          aria-label="Copy invitation link"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            minHeight: '44px',
            background: copied ? 'var(--gain)' : 'var(--surface-container-low)',
            color: copied ? '#0A0B0E' : 'var(--on-surface)',
            borderRadius: 'var(--rounded-lg)',
            fontSize: '0.875rem',
            fontWeight: 700,
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? 'Link Copied!' : 'Copy Link'}
        </button>

        {onRegenerateCode && (
          <button
            type="button"
            onClick={onRegenerateCode}
            className="spring-btn"
            title="Generate a fresh new room code"
            aria-label="Generate new room code"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              minHeight: '44px',
              background: 'var(--surface-container-low)',
              color: 'var(--on-surface-variant)',
              borderRadius: 'var(--rounded-lg)',
              fontSize: '0.875rem',
              fontWeight: 600,
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            <RefreshCw size={15} />
            <span>New Code</span>
          </button>
        )}
      </div>
    </div>
  );
}
