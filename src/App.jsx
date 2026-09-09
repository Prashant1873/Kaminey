import React, { useState, useEffect } from 'react';
import HostBaseStation from './components/host/HostBaseStation';
import PlayerController from './components/player/PlayerController';
import HowToPlayModal from './components/common/HowToPlayModal';
import { Tv, Smartphone, ArrowRight, ShieldCheck, Skull, BookOpen, Sun, Moon, Crown, Sparkles, Flame, Laugh } from 'lucide-react';
import { useTheme } from './context/ThemeContext';
import { sounds } from './audio/soundEffects';

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
        backgroundColor: 'var(--surface-container-low)',
        borderBottom: '1px solid var(--outline-variant)',
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
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: 'var(--rounded-md)',
            background: 'var(--primary-subtle)',
            border: '1px solid var(--primary-subtle-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-resting)',
            flexShrink: 0
          }}>
            <Crown size={18} color="var(--primary)" strokeWidth={2.4} />
          </div>
          <span style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.02em', color: 'var(--primary)' }}>
            KAMINEY
          </span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={() => setShowRules(true)}
            className="btn-secondary spring-btn"
            aria-label="Open how to play guide"
            style={{
              padding: '7px 14px',
              minHeight: '38px',
              fontSize: '0.8125rem',
              gap: '6px'
            }}
          >
            <BookOpen size={15} />
            <span>How to Play</span>
          </button>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: 'var(--rounded-md)',
            background: 'var(--surface-container-low)',
            border: '1px solid var(--outline-variant)',
            fontSize: '0.6875rem',
            fontWeight: 700,
            letterSpacing: '0.04em',
            color: 'var(--on-surface-variant)'
          }}>
            <span style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: 'var(--gain)',
              boxShadow: '0 0 8px var(--gain)'
            }} />
            <span>COURTYARD LIVE</span>
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
              color: dark ? '#FBBF24' : 'var(--primary)',
              padding: '8px',
              minWidth: '40px',
              minHeight: '40px',
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

      {/* Hero Section - Crafted Mystery Atmosphere */}
      <main style={{
        flex: 1,
        maxWidth: '960px',
        width: '100%',
        margin: '0 auto',
        padding: '36px 18px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '32px',
        boxSizing: 'border-box'
      }}>
        {/* Title */}
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: 'var(--rounded-full)',
            background: 'var(--primary-subtle)',
            border: '1px solid var(--primary-subtle-border)',
            color: 'var(--primary)',
            fontSize: '0.75rem',
            fontWeight: 800,
            letterSpacing: '0.06em',
            marginBottom: '16px'
          }}>
            <Sparkles size={14} />
            <span>SHARAFAT KA MUKHOTA YA ASLI KAMINA?</span>
            <span style={{ opacity: 0.4 }}>•</span>
            <span>4 SE 12 LOG</span>
          </div>
          <h1 className="text-display" style={{ color: 'var(--on-surface)', marginBottom: '10px' }}>
            Kaminey Chhupenge, Bhole Phasenge!
          </h1>
          <p className="text-headline" style={{ color: 'var(--on-surface-variant)', fontWeight: 500, fontSize: '1.08rem', maxWidth: '560px', margin: '0 auto' }}>
            Living room TV pe Base Station. Apne phone pe secret control. Kaun doodh ka dhula hai aur kaun asteen ka saanp?
          </p>
        </div>

        {/* Dual Mode Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
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
              padding: '32px 26px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '18px',
              textAlign: 'center',
              border: '1.5px solid var(--primary-subtle-border)',
              boxShadow: 'var(--shadow-elevated)',
              boxSizing: 'border-box'
            }}
          >
            <span className="badge-warning">📺 TV BASE STATION</span>

            <div style={{
              width: '76px',
              height: '76px',
              borderRadius: 'var(--rounded-xl)',
              background: 'linear-gradient(135deg, var(--primary-container) 0%, var(--primary) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-glow-primary), inset 0 1px 0 rgba(255, 255, 255, 0.35)'
            }}>
              <Tv size={36} color="var(--primary-contrast)" strokeWidth={2.2} />
            </div>

            <div>
              <h2 className="text-headline" style={{ color: 'var(--on-surface)', marginBottom: '6px' }}>
                TV Pe Haveli Kholo
              </h2>
              <div style={{ fontSize: '0.84rem', color: 'var(--on-surface-variant)', maxWidth: '270px', lineHeight: 1.5 }}>
                Badi screen pe sabke samne QR scan hoga, timer chalega aur jhooth pakda jayega!
              </div>
            </div>

            <div className="btn-primary" style={{ width: '100%', padding: '14px', minHeight: '48px', marginTop: 'auto' }}>
              <span>Base Station Chalu Karo</span>
              <ArrowRight size={17} />
            </div>
          </button>

          {/* Phone Card */}
          <button
            type="button"
            onClick={() => navigateToPlayer()}
            className="card-interactive spring-btn"
            aria-label="Join game on phone"
            style={{
              padding: '32px 26px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '18px',
              textAlign: 'center',
              border: '1.5px solid var(--outline-variant)',
              boxSizing: 'border-box'
            }}
          >
            <span className="badge-gain">📱 GUPT CONTROLLER</span>

            <div style={{
              width: '76px',
              height: '76px',
              borderRadius: 'var(--rounded-xl)',
              background: 'var(--surface-container-high)',
              border: '1px solid var(--outline-variant)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-resting), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            }}>
              <Smartphone size={36} color="var(--primary)" strokeWidth={2.2} />
            </div>

            <div>
              <h2 className="text-headline" style={{ color: 'var(--on-surface)', marginBottom: '6px' }}>
                Phone Se Haveli Mein Ghuso
              </h2>
              <div style={{ fontSize: '0.84rem', color: 'var(--on-surface-variant)', maxWidth: '270px', lineHeight: 1.5 }}>
                Apna parda faash hone se bacho. Raat ka katal aur gupt voting mobile se chupke karo!
              </div>
            </div>

            <div className="btn-secondary" style={{ width: '100%', padding: '14px', minHeight: '48px', marginTop: 'auto' }}>
              <span>Room Code Daalo Aur Ghuso</span>
              <ArrowRight size={17} />
            </div>
          </button>
        </div>

        {/* 2 Faction Dossiers - Real Game Atmosphere */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          {/* Kaminey Dossier */}
          <div className="card-interactive kamina-card-glow" style={{
            padding: '20px',
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            border: '1.5px solid rgba(255, 86, 48, 0.35)',
            background: 'linear-gradient(180deg, rgba(255, 86, 48, 0.07) 0%, var(--surface-container-lowest) 100%)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--rounded-lg)',
                background: 'rgba(255, 86, 48, 0.15)',
                border: '1px solid rgba(255, 86, 48, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Skull size={24} color="var(--loss-text)" />
              </div>
              <span className="badge-loss">😈 ASLI KAMINEY</span>
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--loss-text)', letterSpacing: '-0.01em' }}>
                Asteen Ke Saanp (Kaminey)
              </div>
              <p style={{ fontSize: '0.84rem', color: 'var(--on-surface-variant)', marginTop: '6px', lineHeight: 1.45 }}>
                Raat ke sannate mein aapas mein whispering. Din ke ujaale mein sabse masoom banne ki acting!
              </p>
            </div>
            <div style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              color: 'var(--loss-text)',
              letterSpacing: '0.04em',
              marginTop: 'auto',
              borderTop: '1px solid rgba(255, 86, 48, 0.2)',
              paddingTop: '10px'
            }}>
              TARGET: Bhole logon ko chun-chun ke bahar karo!
            </div>
          </div>

          {/* Bhole Dossier */}
          <div className="card-interactive bhola-card-glow" style={{
            padding: '20px',
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            border: '1.5px solid var(--primary-subtle-border)',
            background: 'linear-gradient(180deg, var(--primary-subtle) 0%, var(--surface-container-lowest) 100%)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--rounded-lg)',
                background: 'var(--primary-subtle)',
                border: '1px solid var(--primary-subtle-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ShieldCheck size={24} color="var(--primary)" />
              </div>
              <span className="badge-gain">😇 DUDH KE DHULE</span>
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary)', letterSpacing: '-0.01em' }}>
                Masoom Log (Bhole)
              </div>
              <p style={{ fontSize: '0.84rem', color: 'var(--on-surface-variant)', marginTop: '6px', lineHeight: 1.45 }}>
                Aankhon ki chori pakdo, ajeeb harkatein note karo, aur Kaminey ko Haveli se dhakke maar ke nikalo!
              </p>
            </div>
            <div style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              color: 'var(--primary)',
              letterSpacing: '0.04em',
              marginTop: 'auto',
              borderTop: '1px solid var(--outline-variant)',
              paddingTop: '10px'
            }}>
              TARGET: Har ek Kamina pakad ke Haveli se exile karo!
            </div>
          </div>
        </div>
      </main>

      {/* Interactive How to Play Guide Modal */}
      <HowToPlayModal isOpen={showRules} onClose={() => setShowRules(false)} />
    </div>
  );
}
