import React, { useState, useEffect, useRef, useCallback } from 'react';
import Header from '../common/Header';
import PlayerJoin from './PlayerJoin';
import PlayerRoleReveal from './PlayerRoleReveal';
import PlayerNight from './PlayerNight';
import PlayerDares from './PlayerDares';
import PlayerDiscussion from './PlayerDiscussion';
import PlayerVoting from './PlayerVoting';
import PlayerGhost from './PlayerGhost';

import { PlayerNetwork } from '../../network/peerManager';
import { Wifi, Clock, Users, ArrowLeft, ShieldCheck, Scale, Trophy, RotateCcw, Sun } from 'lucide-react';
import AvatarBadge from '../common/AvatarBadge';

export default function PlayerController({ initialRoomCode = '', onExit }) {
  const [playerData, setPlayerData] = useState(() => {
    try {
      const saved = sessionStorage.getItem('kaminey_player_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (initialRoomCode && parsed.roomCode !== initialRoomCode.toUpperCase().trim()) {
          sessionStorage.removeItem('kaminey_player_session');
          return null;
        }
        return parsed;
      }
    } catch (e) {}
    return null;
  });

  // If user scanned another room's QR code while already in a session, reset and join new room
  useEffect(() => {
    if (initialRoomCode && playerData && playerData.roomCode !== initialRoomCode.toUpperCase().trim()) {
      if (networkRef.current) networkRef.current.destroy();
      sessionStorage.removeItem('kaminey_player_session');
      setPlayerData(null);
      setGameState(null);
    }
  }, [initialRoomCode, playerData]);

  const [networkStatus, setNetworkStatus] = useState('');
  const [gameState, setGameState] = useState(null); // Synced state from host
  const networkRef = useRef(null);

  const connectWithData = useCallback((data) => {
    if (networkRef.current) {
      networkRef.current.destroy();
    }
    const net = new PlayerNetwork(
      data.roomCode,
      data,
      (incomingState) => {
        setGameState(incomingState);
      },
      () => {
        setNetworkStatus('Reconnecting to base...');
      },
      (status) => {
        setNetworkStatus(status);
      },
      (reason) => {
        sessionStorage.removeItem('kaminey_player_session');
        setPlayerData(null);
        setGameState(null);
        setNetworkStatus(reason || 'Removed from room by host');
      }
    );
    networkRef.current = net;
    net.init();
  }, []);

  const handleJoin = ({ roomCode, name, avatarId }) => {
    const id = `player-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const newPlayer = { id, name, avatarId, roomCode };
    try {
      sessionStorage.setItem('kaminey_player_session', JSON.stringify(newPlayer));
    } catch (e) {}
    setPlayerData(newPlayer);
  };

  // Connect or reconnect on mount or when playerData.id changes
  useEffect(() => {
    if (playerData) {
      connectWithData(playerData);
    }
    return () => {
      if (networkRef.current) {
        networkRef.current.destroy();
        networkRef.current = null;
      }
    };
  }, [playerData?.id, connectWithData]);

  const handleNightTargetSelect = (targetId) => {
    if (networkRef.current) {
      networkRef.current.send('NIGHT_VOTE', { targetId });
    }
  };

  const handleCastVote = (targetId) => {
    if (networkRef.current) {
      networkRef.current.send('CAST_VOTE', { targetId });
    }
  };

  const handleTaskCompleted = () => {
    if (networkRef.current) {
      networkRef.current.send('TASK_COMPLETED', {});
    }
  };

  // If not joined yet, show Join Form
  if (!playerData) {
    return (
      <div style={{ minHeight: '100dvh', width: '100%', maxWidth: '100vw', overflowX: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <Header isHost={false} onLeave={onExit} />
        <PlayerJoin initialRoomCode={initialRoomCode} onJoin={handleJoin} />
      </div>
    );
  }

  // While connecting to host, show dedicated connecting screen
  if (!gameState) {
    return (
      <div style={{ minHeight: '100dvh', width: '100%', maxWidth: '100vw', display: 'flex', flexDirection: 'column' }}>
        <Header isHost={false} roomCode={playerData.roomCode} onLeave={onExit} />
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '30px 20px',
          textAlign: 'center',
          gap: '16px'
        }}>
          <div style={{ fontSize: '3.5rem' }} className="animate-spin">
            ⏳
          </div>
          <h2 className="text-headline" style={{ color: 'var(--primary)', marginBottom: '4px' }}>
            CONNECTING TO HAVELI BASE...
          </h2>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.875rem' }}>
            Joining living room screen with code <strong>{playerData.roomCode}</strong>
          </p>
          <div className="badge-gain" style={{ fontSize: '0.75rem', padding: '6px 14px' }}>
            {networkStatus || 'Connecting to base station...'}
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              type="button"
              onClick={() => connectWithData(playerData)}
              className="spring-btn"
              style={{
                padding: '8px 16px',
                fontSize: '0.8125rem',
                fontWeight: 700,
                background: 'var(--primary-container)',
                color: '#ffffff',
                borderRadius: 'var(--rounded-lg)',
                border: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <RotateCcw size={14} />
              <span>Retry Connection</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (networkRef.current) networkRef.current.destroy();
                sessionStorage.removeItem('kaminey_player_session');
                setPlayerData(null);
              }}
              className="spring-btn"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--outline)',
                fontSize: '0.8125rem',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Change Room / Name
            </button>
          </div>
        </div>
      </div>
    );
  }

  const myAvatar = getAvatarById(playerData.avatarId);
  const myPlayerInfo = gameState?.players?.find(p => p.id === playerData.id);
  const isAlive = myPlayerInfo ? myPlayerInfo.isAlive : true;
  const isExiled = myPlayerInfo ? myPlayerInfo.isExiled : false;
  const isDead = !isAlive || isExiled;

  const phase = gameState?.phase || 'LOBBY';
  const mySecret = gameState?.mySecret || {};

  const isNight = phase === 'NIGHT';

  return (
    <div className={isNight ? 'theme-simsim-night' : ''} style={{
      minHeight: '100dvh',
      width: '100%',
      maxWidth: '100vw',
      overflowX: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: isNight ? '#000000' : undefined,
      transition: 'background-color 0.3s ease'
    }}>
      <Header
        isHost={false}
        roomCode={playerData.roomCode}
        currentPhase={phase}
        onLeave={() => {
          if (networkRef.current) networkRef.current.destroy();
          sessionStorage.removeItem('kaminey_player_session');
          setPlayerData(null);
          setGameState(null);
          if (onExit) onExit();
        }}
      />

      {/* Network / Status Bar */}
      {networkStatus && (
        <div style={{
          backgroundColor: isNight ? '#000000' : 'var(--surface-container-low)',
          padding: '6px 14px',
          fontSize: '0.75rem',
          textAlign: 'center',
          color: isNight ? '#777777' : 'var(--on-surface-variant)',
          borderBottom: isNight ? '1px solid #141414' : '1px solid var(--outline-variant)'
        }}>
          {networkStatus}
        </div>
      )}

      {/* Main Screen according to Phase */}
      <main style={{
        flex: 1,
        paddingBottom: '24px',
        width: '100%',
        boxSizing: 'border-box',
        backgroundColor: isNight ? '#000000' : undefined
      }}>
        {/* If Player is dead/exiled and match is in progress, show Ghost Spectator mode */}
        {isDead && phase !== 'LOBBY' && phase !== 'ROLE_REVEAL' && phase !== 'GAME_OVER' ? (
          <PlayerGhost playerName={playerData.name} isExiled={isExiled} />
        ) : (
          <>
            {/* LOBBY PHASE */}
            {phase === 'LOBBY' && (
              <div style={{
                width: '100%',
                maxWidth: '440px',
                margin: '0 auto',
                padding: '20px 14px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '16px',
                boxSizing: 'border-box'
              }}>
                {/* My Persona Card */}
                <div className="card-interactive" style={{
                  width: '100%',
                  padding: '24px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  boxSizing: 'border-box'
                }}>
                  <div style={{
                    animation: 'float-slow 3.5s infinite ease-in-out',
                    marginBottom: '12px'
                  }}>
                    <AvatarBadge avatar={myAvatar} size={64} />
                  </div>
                  <h1 className="text-headline" style={{ color: 'var(--on-surface)', marginBottom: '4px' }}>
                    {playerData.name}
                  </h1>
                  <span className="badge-warning" style={{ fontSize: '0.75rem', marginBottom: '14px' }}>
                    {myAvatar.title}
                  </span>

                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'var(--primary-subtle)',
                    padding: '6px 14px',
                    borderRadius: 'var(--rounded-full)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--primary)',
                    border: '1px solid var(--primary-subtle-border)'
                  }}>
                    <Wifi size={14} /> Room: {playerData.roomCode}
                  </div>
                </div>

                {/* Living Room Guests Roster */}
                <div className="card-interactive" style={{ width: '100%', padding: '16px', boxSizing: 'border-box' }}>
                  <div style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    letterSpacing: '0.06em',
                    color: 'var(--on-surface-variant)',
                    marginBottom: '12px',
                    textAlign: 'left'
                  }}>
                    HAVELI KE MEHMAAN / BAKRE ({gameState?.players?.length || 1})
                  </div>

                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px',
                    justifyContent: 'flex-start'
                  }}>
                    {gameState?.players?.map(p => {
                      const av = getAvatarById(p.avatarId);
                      const isMe = p.id === playerData.id;
                      return (
                        <span
                          key={p.id}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: isMe ? 'var(--primary-subtle)' : 'var(--surface-container-low)',
                            color: isMe ? 'var(--primary)' : 'var(--on-surface)',
                            padding: '4px 10px',
                            borderRadius: 'var(--rounded-full)',
                            fontSize: '0.75rem',
                            fontWeight: isMe ? 700 : 500,
                            border: isMe ? '1px solid var(--primary)' : '1px solid var(--outline-variant)'
                          }}
                        >
                          <AvatarBadge avatar={av} size={16} showRing={false} />
                          <span>{p.name} {isMe && '(Aap)'}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Animated Waiting indicator */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.8125rem',
                  color: 'var(--on-surface-variant)',
                  fontWeight: 600
                }}>
                  <Clock size={16} className="animate-spin" color="var(--primary)" />
                  <span>Host ke khel shuru karne ka intezaar... ⏳</span>
                </div>

                {/* Change identity button */}
                <button
                  type="button"
                  onClick={() => {
                    if (networkRef.current) networkRef.current.destroy();
                    sessionStorage.removeItem('kaminey_player_session');
                    setPlayerData(null);
                  }}
                  className="spring-btn"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--outline)',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  Naam ya Avatar Badlo 🔄
                </button>
              </div>
            )}

            {/* ROLE REVEAL PHASE */}
            {phase === 'ROLE_REVEAL' && (
              <PlayerRoleReveal
                role={mySecret.role}
                kamineyPartners={mySecret.kamineyPartners || []}
              />
            )}

            {/* NIGHT PHASE */}
            {phase === 'NIGHT' && (
              <PlayerNight
                role={mySecret.role}
                players={gameState?.players || []}
                myPlayerId={playerData.id}
                kamineyPartners={mySecret.kamineyPartners || []}
                nightVotes={mySecret.nightVotes || {}}
                onSelectTarget={handleNightTargetSelect}
              />
            )}

            {/* MORNING PHASE */}
            {phase === 'MORNING' && (
              <div style={{
                maxWidth: '440px',
                margin: '0 auto',
                padding: '30px 16px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '16px'
              }}>
                <div style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: 'var(--rounded-full)',
                  background: 'linear-gradient(135deg, var(--primary-container), var(--primary))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'var(--shadow-glow-primary)',
                  animation: 'float-slow 3s infinite ease-in-out'
                }}>
                  <Sun size={38} color="#0A0B0E" />
                </div>

                <h1 className="text-headline" style={{ color: 'var(--on-surface)' }}>
                  SUBAH KA JATKA ☀️
                </h1>

                {gameState?.morningVictim ? (
                  <div style={{
                    background: 'var(--surface-container-low)',
                    border: '1.5px solid var(--loss)',
                    borderRadius: 'var(--rounded-xl)',
                    padding: '20px 16px',
                    width: '100%',
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <AvatarBadge avatar={getAvatarById(gameState.morningVictim.avatarId)} size={54} />
                    <div style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--loss-text)' }}>
                      {gameState.morningVictim.name} ka patta saaf! 🩸
                    </div>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--on-surface-variant)' }}>
                      TV screen par dekho kiska kaam tamaam hua!
                    </p>
                  </div>
                ) : (
                  <div style={{
                    background: 'var(--surface-container-low)',
                    border: '1.5px solid var(--gain)',
                    borderRadius: 'var(--rounded-xl)',
                    padding: '20px 16px',
                    width: '100%',
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <ShieldCheck size={48} color="var(--gain-text)" />
                    <div style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--gain-text)' }}>
                      Sab Bakre Salamaat! ✨
                    </div>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--on-surface-variant)' }}>
                      Raat ko sab bach gaye, Haveli mein chamatkar ho gaya!
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* DARES & TEAM MISSIONS PHASE */}
            {phase === 'DARES' && (
              <PlayerDares
                mission={gameState?.currentMission}
                role={mySecret.role}
                players={gameState?.players || []}
                myPlayerId={playerData.id}
                kamineyPartners={mySecret.kamineyPartners || []}
                nightVotes={mySecret.nightVotes || {}}
                onSelectTarget={handleNightTargetSelect}
                onCompleteTask={handleTaskCompleted}
              />
            )}

            {/* DISCUSSION PHASE */}
            {phase === 'DISCUSSION' && (
              <PlayerDiscussion
                players={gameState?.players || []}
                myPlayerId={playerData.id}
              />
            )}

            {/* VOTING PHASE */}
            {phase === 'VOTING' && (
              <PlayerVoting
                players={gameState?.players || []}
                myPlayerId={playerData.id}
                hasVoted={myPlayerInfo?.hasVoted}
                onCastVote={handleCastVote}
              />
            )}

            {/* EXILE PHASE */}
            {phase === 'EXILE' && (
              <div style={{
                maxWidth: '440px',
                margin: '0 auto',
                padding: '30px 16px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '16px'
              }}>
                <Scale size={56} color="var(--primary)" strokeWidth={2} />
                <h1 className="text-headline" style={{ color: 'var(--on-surface)' }}>
                  HAVELI KA FAISLA ⚖️
                </h1>

                {gameState?.exiledPlayer ? (
                  <div style={{
                    background: 'var(--surface-container-low)',
                    border: '1.5px solid var(--primary)',
                    borderRadius: 'var(--rounded-xl)',
                    padding: '20px 16px',
                    width: '100%',
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <AvatarBadge avatar={getAvatarById(gameState.exiledPlayer.avatarId)} size={54} />
                    <div style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--primary)' }}>
                      {gameState.exiledPlayer.name} ko Haveli se bahar phenk diya!
                    </div>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--on-surface-variant)' }}>
                      TV screen par dekho: Wo Asli Kamina tha ya Masoom Bhola... 🎭
                    </p>
                  </div>
                ) : (
                  <p className="text-body" style={{ color: 'var(--on-surface-variant)' }}>
                    TV screen par dekho kiski kismat bachi!
                  </p>
                )}
              </div>
            )}

            {/* GAME OVER PHASE */}
            {phase === 'GAME_OVER' && (
              <div style={{
                maxWidth: '440px',
                margin: '0 auto',
                padding: '30px 16px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '16px'
              }}>
                <Trophy size={60} color="var(--primary)" strokeWidth={2.2} />
                <h1 className="text-headline" style={{ color: 'var(--primary)' }}>
                  {gameState?.winner === 'kaminey' ? '😈 HAVELI PE KAMINEY KA KABZA!' : '😇 MASOOM BHOLE JEET GAYE!'}
                </h1>
                <p className="text-body" style={{ color: 'var(--on-surface-variant)', fontSize: '0.875rem' }}>
                  TV screen par sabke asli mukhote utar chuke hain! 🎭
                </p>

                <button
                  type="button"
                  onClick={() => {
                    if (networkRef.current) networkRef.current.destroy();
                    sessionStorage.removeItem('kaminey_player_session');
                    setPlayerData(null);
                    setGameState(null);
                    onExit();
                  }}
                  className="btn-primary spring-btn"
                  aria-label="Play another match"
                  style={{ width: '100%', padding: '14px', marginTop: '10px', minHeight: '48px', gap: '8px' }}
                >
                  <RotateCcw size={16} />
                  <span>Naya Match Shuru Karo 🔄</span>
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
