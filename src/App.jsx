import React, { useState, useEffect } from 'react';
import HostBaseStation from './components/host/HostBaseStation';
import PlayerController from './components/player/PlayerController';
import { Tv, Smartphone, Shield, Skull, Sparkles, HelpCircle, ArrowRight } from 'lucide-react';
import { ANIMAL_AVATARS } from './data/animalAvatars';

export default function App() {
  const [mode, setMode] = useState('LANDING'); // 'LANDING' | 'HOST' | 'PLAYER'
  const [initialRoomCode, setInitialRoomCode] = useState('');

  // Check URL parameters for direct deep-linking
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const joinCode = params.get('join');
      const isHost = params.get('host');

      if (joinCode) {
        setInitialRoomCode(joinCode.toUpperCase());
        setMode('PLAYER');
      } else if (isHost) {
        setMode('HOST');
      }
    }
  }, []);

  if (mode === 'HOST') {
    return <HostBaseStation onExit={() => setMode('LANDING')} />;
  }

  if (mode === 'PLAYER') {
    return <PlayerController initialRoomCode={initialRoomCode} onExit={() => setMode('LANDING')} />;
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--surface)',
      color: 'var(--on-surface)'
    }}>
      {/* Top Navbar */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 24px',
        backgroundColor: 'var(--surface-container-lowest)',
        borderBottom: '1px solid rgba(9, 30, 66, 0.08)',
        boxShadow: 'var(--shadow-resting)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--rounded-lg)',
            background: 'linear-gradient(135deg, var(--primary-container), var(--primary))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.4rem',
            color: '#fff',
            boxShadow: 'var(--shadow-glow-primary)'
          }}>
            🎭
          </div>
          <div>
            <span style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.02em', color: 'var(--primary)' }}>
              KAMINEY
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)', marginLeft: '8px', fontWeight: 600 }}>
              The Traitors Social Deduction Game
            </span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main style={{
        flex: 1,
        maxWidth: '1080px',
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
        {/* Title & Tagline */}
        <div style={{ width: '100%' }}>
          <div className="badge-loss" style={{ fontSize: '0.75rem', padding: '4px 12px', marginBottom: '12px' }}>
            A Social Deduction House Party Mystery
          </div>
          <h1 className="text-display" style={{ color: 'var(--primary)', maxWidth: '800px', margin: '0 auto 10px auto' }}>
            WHO CAN YOU TRUST IN THE HAVELI?
          </h1>
          <p className="text-headline" style={{ color: 'var(--on-surface-variant)', maxWidth: '640px', margin: '0 auto', fontWeight: 500 }}>
            Keep one screen in your living room as the Base Station. Everyone joins from their phones with secret roles, stealth night murders, and hilarious party dares.
          </p>
        </div>

        {/* Dual Primary Action Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '16px',
          width: '100%',
          maxWidth: '780px',
          boxSizing: 'border-box'
        }}>
          {/* Host Card (Living Room TV) */}
          <div
            className="card-interactive"
            style={{
              padding: '24px 18px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              textAlign: 'center',
              border: '2px solid rgba(0, 82, 204, 0.2)',
              boxSizing: 'border-box'
            }}
          >
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: 'var(--rounded-xl)',
              background: 'linear-gradient(135deg, var(--primary-container), var(--primary))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-glow-primary)'
            }}>
              <Tv size={30} color="#ffffff" />
            </div>

            <div>
              <h2 className="text-title" style={{ fontSize: '1.25rem', marginBottom: '4px' }}>
                Host Living Room Game
              </h2>
              <p className="text-body" style={{ color: 'var(--on-surface-variant)', fontSize: '0.8125rem' }}>
                For the hall TV, tablet, or laptop. Generates the 6-character code, QR code, timed discussions, and morning murder reveals.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setMode('HOST')}
              className="btn-primary spring-btn"
              style={{ width: '100%', padding: '12px', fontSize: '0.9375rem' }}
            >
              <span>Launch Base Station</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Player Card (Mobile Phone) */}
          <div
            className="card-interactive"
            style={{
              padding: '24px 18px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              textAlign: 'center',
              border: '2px solid rgba(40, 90, 185, 0.2)',
              boxSizing: 'border-box'
            }}
          >
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: 'var(--rounded-xl)',
              background: 'linear-gradient(135deg, var(--secondary), var(--secondary-container))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-resting)'
            }}>
              <Smartphone size={30} color="#ffffff" />
            </div>

            <div>
              <h2 className="text-title" style={{ fontSize: '1.25rem', marginBottom: '4px' }}>
                Join from Your Phone
              </h2>
              <p className="text-body" style={{ color: 'var(--on-surface-variant)', fontSize: '0.8125rem' }}>
                Pick your animal persona, secretly peek at your confidential role, execute social distraction tasks, and cast trial ballots.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setMode('PLAYER')}
              className="btn-secondary spring-btn"
              style={{ width: '100%', padding: '12px', fontSize: '0.9375rem', backgroundColor: 'var(--surface-container-low)' }}
            >
              <span>Join with Room Code</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Game Rules & Feature Highlights */}
        <div style={{
          width: '100%',
          maxWidth: '860px',
          marginTop: '8px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '12px',
          textAlign: 'left',
          boxSizing: 'border-box'
        }}>
          <div className="card-interactive" style={{ padding: '16px' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '6px' }}>🎭</div>
            <div style={{ fontWeight: 700, fontSize: '0.9375rem', marginBottom: '4px', color: 'var(--loss-text)' }}>
              Kaminey (Traitors)
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--on-surface-variant)', lineHeight: 1.4 }}>
              A hidden minority who know each other's identities. Conspire each night on phone to secretly eliminate one innocent.
            </p>
          </div>

          <div className="card-interactive" style={{ padding: '16px' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '6px' }}>🕊️</div>
            <div style={{ fontWeight: 700, fontSize: '0.9375rem', marginBottom: '4px', color: 'var(--primary)' }}>
              Bhole (Innocents)
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--on-surface-variant)', lineHeight: 1.4 }}>
              Unaware of roles. Must complete social tasks, spot suspicious behavior during debates, and banish the Kaminey.
            </p>
          </div>

          <div className="card-interactive" style={{ padding: '16px' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '6px' }}>🎯</div>
            <div style={{ fontWeight: 700, fontSize: '0.9375rem', marginBottom: '4px', color: 'var(--warning-text)' }}>
              Secret Party Dares
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--on-surface-variant)', lineHeight: 1.4 }}>
              Hilarious living room tasks (fetching chai, yawn contagion, debates) that distract Bhole and let Kaminey scheme in plain sight.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
