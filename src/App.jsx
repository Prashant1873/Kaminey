import React, { useState, useEffect } from 'react';
import HostBaseStation from './components/host/HostBaseStation';
import PlayerController from './components/player/PlayerController';
import HowToPlayModal from './components/common/HowToPlayModal';
import { Tv, Smartphone, ArrowRight, ShieldCheck, Skull, BookOpen, Sun, Moon } from 'lucide-react';
import { useTheme } from './context/ThemeContext';

export default function App() {
  const [showRules, setShowRules] = useState(false);
  const { dark, toggle: toggleTheme } = useTheme();
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
    window.location.hash = '#/host';
    setRoute('HOST');
  };

  const navigateToPlayer = (code = '') => {
    if (code) {
      window.location.hash = `#/join/${code.toUpperCase().trim()}`;
      setInitialRoomCode(code.toUpperCase().trim());
    } else {
      window.location.hash = '#/play';
    }
    setRoute('PLAYER');
  };

  const navigateToLanding = () => {
    window.location.hash = '#/';
    setRoute('LANDING');
  };

  if (route === 'HOST') {
    return <HostBaseStation onExit={navigateToLanding} />;
  }

  if (route === 'PLAYER') {
    return (
      <PlayerController
        initialRoomCode={initialRoomCode}
        onExit={navigateToLanding}
      />
    );
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
        padding: '8px 20px',
        minHeight: '56px',
        backgroundColor: 'rgba(15, 17, 24, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
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
          aria-label="Kaminey Home"
          style={{
            background: 'transparent',
            border: 'none',
            padding: '4px 6px',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            minHeight: '48px'
          }}
        >
          <span style={{ fontSize: '1.4rem', lineHeight: 1, display: 'inline-flex', alignItems: 'center' }}>
            🎭
          </span>
          <span style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.02em', color: 'var(--primary)' }}>
            KAMINEY
          </span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={() => setShowRules(true)}
            className="spring-btn"
            aria-label="Open how to play guide"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(229, 184, 105, 0.1)',
              color: 'var(--primary)',
              padding: '8px 16px',
              borderRadius: 'var(--rounded-full)',
              border: '1px solid rgba(229, 184, 105, 0.25)',
              fontSize: '0.8125rem',
              fontWeight: 700,
              minHeight: '44px'
            }}
          >
            <BookOpen size={14} />
            <span>How to Play</span>
          </button>
          <div className="badge-gain" style={{ fontSize: '0.6875rem', padding: '4px 10px' }}>
            Live Multiplayer
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className="spring-btn"
            title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            style={{
              background: 'var(--surface-container-low)',
              border: '1px solid var(--outline-variant)',
              color: dark ? '#FBBF24' : '#64748B',
              padding: '8px',
              minWidth: '44px',
              minHeight: '44px',
              borderRadius: 'var(--rounded-lg)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {dark ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </div>
      </header>

      {/* Hero Section — Minimal Apple Design & Haveli Mystery Atmosphere */}
      <main style={{
        flex: 1,
        maxWidth: '960px',
        width: '100%',
        margin: '0 auto',
        padding: '32px 16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '28px',
        boxSizing: 'border-box'
      }}>
        {/* Title */}
        <div>
          <div className="badge-warning" style={{ fontSize: '0.75rem', padding: '4px 14px', marginBottom: '12px', letterSpacing: '0.06em' }}>
            THE HAVELI MURDER MYSTERY
          </div>
          <h1 className="text-display" style={{ color: 'var(--on-surface)', marginBottom: '8px' }}>
            TRUST NO ONE IN THE HAVELI
          </h1>
          <p className="text-headline" style={{ color: 'var(--on-surface-variant)', fontWeight: 500, fontSize: '1.0625rem', maxWidth: '520px', margin: '0 auto' }}>
            One big screen for the living room courtyard. Personal phones for secret roles & betrayal.
          </p>
        </div>

        {/* Dual Mode Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          {/* Host Card */}
          <button
            type="button"
            onClick={navigateToHost}
            className="card-interactive spring-btn"
            aria-label="Launch host base station on TV"
            style={{
              padding: '32px 24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
              textAlign: 'center',
              border: '1.5px solid rgba(229, 184, 105, 0.25)',
              boxSizing: 'border-box'
            }}
          >
            <div style={{
              width: '68px',
              height: '68px',
              borderRadius: 'var(--rounded-xl)',
              background: 'linear-gradient(135deg, #E5B869, #C99738)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(229, 184, 105, 0.3)'
            }}>
              <Tv size={32} color="#0A0B0E" strokeWidth={2.2} />
            </div>

            <div>
              <h2 className="text-headline" style={{ color: 'var(--on-surface)', marginBottom: '4px' }}>
                HOST ON TV
              </h2>
              <div style={{ fontSize: '0.8125rem', color: 'var(--on-surface-variant)', maxWidth: '240px' }}>
                Big living room screen with high-visibility QR code & room countdown
              </div>
            </div>

            <div className="btn-primary" style={{ width: '100%', padding: '12px', minHeight: '48px' }}>
              <span>Launch Base Station</span>
              <ArrowRight size={16} />
            </div>
          </button>

          {/* Phone Card */}
          <button
            type="button"
            onClick={() => navigateToPlayer()}
            className="card-interactive spring-btn"
            aria-label="Join game on phone"
            style={{
              padding: '32px 24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
              textAlign: 'center',
              border: '1.5px solid rgba(255, 255, 255, 0.1)',
              boxSizing: 'border-box'
            }}
          >
            <div style={{
              width: '68px',
              height: '68px',
              borderRadius: 'var(--rounded-xl)',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.04))',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-resting)'
            }}>
              <Smartphone size={32} color="var(--primary)" strokeWidth={2.2} />
            </div>

            <div>
              <h2 className="text-headline" style={{ color: 'var(--on-surface)', marginBottom: '4px' }}>
                JOIN ON PHONE
              </h2>
              <div style={{ fontSize: '0.8125rem', color: 'var(--on-surface-variant)', maxWidth: '240px' }}>
                Personal confidential controller for secret peeking & exile ballots
              </div>
            </div>

            <div className="btn-secondary" style={{ width: '100%', padding: '12px', minHeight: '48px', background: 'var(--surface-container-low)' }}>
              <span>Enter Room Code</span>
              <ArrowRight size={16} />
            </div>
          </button>
        </div>

        {/* 2 Visual Game Pillars - Flat Lucide Vectors */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '14px',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          <div className="card-interactive" style={{ padding: '20px 14px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ marginBottom: '8px' }}>
              <Skull size={30} color="var(--loss)" />
            </div>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--loss-text)' }}>KAMINEY</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)', marginTop: '2px' }}>Secret Conclave of Killers</div>
          </div>

          <div className="card-interactive" style={{ padding: '20px 14px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ marginBottom: '8px' }}>
              <ShieldCheck size={30} color="var(--primary)" />
            </div>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--primary)' }}>BHOLE</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)', marginTop: '2px' }}>Innocent Majority of the Haveli</div>
          </div>
        </div>
      </main>

      {/* Interactive How to Play Guide Modal */}
      <HowToPlayModal isOpen={showRules} onClose={() => setShowRules(false)} />
    </div>
  );
}
