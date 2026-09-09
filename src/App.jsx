import React, { useState, useEffect } from 'react';
import HostBaseStation from './components/host/HostBaseStation';
import PlayerController from './components/player/PlayerController';
import { Tv, Smartphone, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export default function App() {
  const [route, setRoute] = useState(() => {
    // Parse current URL hash or query params
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      const params = new URLSearchParams(window.location.search);
      const joinParam = params.get('join');
      const hostParam = params.get('host');

      if (hash === '#/host' || hostParam) return 'HOST';
      if (hash.startsWith('#/join/')) return 'PLAYER';
      if (hash === '#/play' || joinParam) return 'PLAYER';

      // Check persisted sessions on refresh
      if (sessionStorage.getItem('kaminey_host_active') === 'true') return 'HOST';
      if (sessionStorage.getItem('kaminey_player_session')) return 'PLAYER';
    }
    return 'LANDING';
  });

  const [initialRoomCode, setInitialRoomCode] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash.startsWith('#/join/')) {
        return hash.replace('#/join/', '').toUpperCase().trim();
      }
      const params = new URLSearchParams(window.location.search);
      return (params.get('join') || '').toUpperCase().trim();
    }
    return '';
  });

  // Keep state in sync with URL hash on back/forward or hash change
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#/host') {
        setRoute('HOST');
      } else if (hash.startsWith('#/join/')) {
        const code = hash.replace('#/join/', '').toUpperCase().trim();
        setInitialRoomCode(code);
        setRoute('PLAYER');
      } else if (hash === '#/play') {
        setRoute('PLAYER');
      } else if (!hash || hash === '#/') {
        setRoute('LANDING');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateToHost = () => {
    sessionStorage.setItem('kaminey_host_active', 'true');
    window.location.hash = '#/host';
    setRoute('HOST');
  };

  const navigateToPlayer = (code = '') => {
    if (code) {
      setInitialRoomCode(code);
      window.location.hash = `#/join/${code}`;
    } else {
      window.location.hash = '#/play';
    }
    setRoute('PLAYER');
  };

  const navigateToLanding = () => {
    sessionStorage.removeItem('kaminey_host_active');
    sessionStorage.removeItem('kaminey_player_session');
    sessionStorage.removeItem('kaminey_host_room');
    window.location.hash = '#/';
    setRoute('LANDING');
  };

  if (route === 'HOST') {
    return <HostBaseStation onExit={navigateToLanding} />;
  }

  if (route === 'PLAYER') {
    return <PlayerController initialRoomCode={initialRoomCode} onExit={navigateToLanding} />;
  }

  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--surface)',
      color: 'var(--on-surface)',
      overflowX: 'hidden'
    }}>
      {/* Top Navbar */}
      <header className="app-header" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 20px',
        backgroundColor: 'var(--surface-container-lowest)',
        borderBottom: '1px solid rgba(9, 30, 66, 0.08)',
        boxShadow: 'var(--shadow-resting)',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <button
          type="button"
          onClick={navigateToLanding}
          className="spring-btn"
          title="Go to Home"
          style={{
            background: 'transparent',
            border: 'none',
            padding: 0,
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer'
          }}
        >
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: 'var(--rounded-lg)',
            background: 'linear-gradient(135deg, var(--primary-container), var(--primary))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem',
            color: '#fff',
            boxShadow: 'var(--shadow-glow-primary)'
          }}>
            🎭
          </div>
          <span style={{ fontWeight: 800, fontSize: '1.15rem', letterSpacing: '-0.02em', color: 'var(--primary)' }}>
            KAMINEY
          </span>
        </button>
        <div className="badge-gain" style={{ fontSize: '0.6875rem' }}>
          Live Multiplayer
        </div>
      </header>

      {/* Hero Section — Clean, Visual, Action-Driven */}
      <main style={{
        flex: 1,
        maxWidth: '900px',
        width: '100%',
        margin: '0 auto',
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '24px',
        boxSizing: 'border-box'
      }}>
        {/* Title */}
        <div>
          <div className="badge-loss" style={{ fontSize: '0.75rem', padding: '4px 12px', marginBottom: '8px' }}>
            Social Deduction House Mystery
          </div>
          <h1 className="text-display" style={{ color: 'var(--primary)', marginBottom: '8px' }}>
            TRUST NO ONE IN THE HAVELI
          </h1>
          <p className="text-headline" style={{ color: 'var(--on-surface-variant)', fontWeight: 500, fontSize: '1.0625rem' }}>
            One screen for the living room. Phones for secret roles.
          </p>
        </div>

        {/* Dual Mode Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '16px',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          {/* Host Card */}
          <button
            type="button"
            onClick={navigateToHost}
            className="card-interactive spring-btn"
            style={{
              padding: '28px 20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '14px',
              textAlign: 'center',
              border: '2px solid rgba(0, 82, 204, 0.2)',
              boxSizing: 'border-box'
            }}
          >
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: 'var(--rounded-xl)',
              background: 'linear-gradient(135deg, var(--primary-container), var(--primary))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-glow-primary)'
            }}>
              <Tv size={32} color="#ffffff" />
            </div>

            <div>
              <h2 className="text-headline" style={{ color: 'var(--primary)', marginBottom: '4px' }}>
                HOST ON TV
              </h2>
              <div style={{ fontSize: '0.8125rem', color: 'var(--on-surface-variant)' }}>
                Big living room screen with QR code & timers
              </div>
            </div>

            <div className="btn-primary" style={{ width: '100%', padding: '12px' }}>
              <span>Launch Base Station</span>
              <ArrowRight size={16} />
            </div>
          </button>

          {/* Phone Card */}
          <button
            type="button"
            onClick={() => navigateToPlayer()}
            className="card-interactive spring-btn"
            style={{
              padding: '28px 20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '14px',
              textAlign: 'center',
              border: '2px solid rgba(40, 90, 185, 0.2)',
              boxSizing: 'border-box'
            }}
          >
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: 'var(--rounded-xl)',
              background: 'linear-gradient(135deg, var(--secondary), var(--secondary-container))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-resting)'
            }}>
              <Smartphone size={32} color="#ffffff" />
            </div>

            <div>
              <h2 className="text-headline" style={{ color: 'var(--secondary)', marginBottom: '4px' }}>
                JOIN ON PHONE
              </h2>
              <div style={{ fontSize: '0.8125rem', color: 'var(--on-surface-variant)' }}>
                Your personal secret controller & confidential ballot
              </div>
            </div>

            <div className="btn-secondary" style={{ width: '100%', padding: '12px', background: 'var(--surface-container-low)' }}>
              <span>Enter Room Code</span>
              <ArrowRight size={16} />
            </div>
          </button>
        </div>

        {/* 2 Visual Game Pillars */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          <div className="card-interactive" style={{ padding: '16px 12px', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '4px' }}>🎭</div>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--loss-text)' }}>KAMINEY</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)', marginTop: '2px' }}>Secret Conclave of Killers</div>
          </div>

          <div className="card-interactive" style={{ padding: '16px 12px', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '4px' }}>🕊️</div>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--primary)' }}>BHOLE</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)', marginTop: '2px' }}>Innocent Majority of the Haveli</div>
          </div>
        </div>
      </main>
    </div>
  );
}
