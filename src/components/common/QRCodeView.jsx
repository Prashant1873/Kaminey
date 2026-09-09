import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Copy, Check, QrCode } from 'lucide-react';

export default function QRCodeView({ roomCode, size = 180 }) {
  const canvasRef = useRef(null);
  const [copied, setCopied] = useState(false);

  // Generate full join URL based on current browser window location
  const joinUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}?join=${roomCode}`
    : `https://kaminey.game/?join=${roomCode}`;

  useEffect(() => {
    if (canvasRef.current && roomCode) {
      QRCode.toCanvas(canvasRef.current, joinUrl, {
        width: size,
        margin: 1,
        color: {
          dark: '#003d9b',
          light: '#ffffff'
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
      gap: '12px',
      padding: '16px',
      background: '#ffffff',
      borderRadius: 'var(--rounded-2xl)',
      border: '1px solid rgba(9, 30, 66, 0.1)',
      boxShadow: 'var(--shadow-resting)'
    }}>
      <div style={{
        padding: '10px',
        borderRadius: 'var(--rounded-xl)',
        background: 'var(--surface-container-low)',
        display: 'inline-block'
      }}>
        <canvas ref={canvasRef} style={{ display: 'block', borderRadius: 'var(--rounded-md)' }} />
      </div>

      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '0.8125rem', color: 'var(--on-surface-variant)', fontWeight: 600 }}>
          Scan to join from your phone
        </div>
        <div className="tabular-nums" style={{
          fontSize: '1.75rem',
          fontWeight: 800,
          letterSpacing: '0.1em',
          color: 'var(--primary)',
          marginTop: '4px'
        }}>
          {roomCode}
        </div>
      </div>

      <button
        onClick={copyLink}
        className="spring-btn"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 14px',
          background: copied ? 'var(--gain)' : 'var(--surface-container-low)',
          color: copied ? '#ffffff' : 'var(--primary)',
          borderRadius: 'var(--rounded-lg)',
          fontSize: '0.8125rem',
          fontWeight: 700,
          border: '1px solid var(--outline-variant)'
        }}
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
        {copied ? 'Link Copied!' : 'Copy Join Link'}
      </button>
    </div>
  );
}
