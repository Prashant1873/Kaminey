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
import { getAvatarById } from '../../data/animalAvatars';
import { Wifi, Clock, Users, ArrowLeft } from 'lucide-react';

export default function PlayerController({ initialRoomCode = '', onExit }) {
  const [playerData, setPlayerData] = useState(() => {
    try {
      const saved = sessionStorage.getItem('kaminey_player_session');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return null;
  });

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
    connectWithData(newPlayer);
  };

  // Reconnect automatically on mount if session was saved (e.g. after refresh)
  useEffect(() => {
    if (playerData && !networkRef.current) {
      connectWithData(playerData);
    }
    return () => {
      if (networkRef.current) {
        networkRef.current.destroy();
      }
    };
  }, [playerData, connectWithData]);

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

  const myAvatar = getAvatarById(playerData.avatarId);
  const myPlayerInfo = gameState?.players?.find(p => p.id === playerData.id);
  const isAlive = myPlayerInfo ? myPlayerInfo.isAlive : true;
  const isExiled = myPlayerInfo ? myPlayerInfo.isExiled : false;
  const isDead = !isAlive || isExiled;

  const phase = gameState?.phase || 'LOBBY';
  const mySecret = gameState?.mySecret || {};

  return (
    <div style={{ minHeight: '100dvh', width: '100%', maxWidth: '100vw', overflowX: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <Header
        isHost={false}
        roomCode={playerData.roomCode}
        currentPhase={phase}
        onLeave={() => {
          if (networkRef.current) networkRef.current.destroy();
          setPlayerData(null);
          setGameState(null);
        }}
      />

      {/* Network / Status Bar */}
      {networkStatus && (
        <div style={{
          backgroundColor: 'var(--surface-container-low)',
          padding: '6px 14px',
          fontSize: '0.75rem',
          textAlign: 'center',
          color: 'var(--on-surface-variant)',
          borderBottom: '1px solid var(--outline-variant)'
        }}>
          {networkStatus}
        </div>
      )}

      {/* Main Screen according to Phase */}
      <main style={{ flex: 1, paddingBottom: '24px', width: '100%', boxSizing: 'border-box' }}>
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
                <div style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, var(--surface-container-lowest), var(--surface-container-low))',
                  borderRadius: 'var(--rounded-2xl)',
                  padding: '24px 16px',
                  border: '1px solid var(--outline-variant)',
                  boxShadow: 'var(--shadow-resting)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  boxSizing: 'border-box'
                }}>
                  <div style={{
                    fontSize: '4.5rem',
                    lineHeight: 1,
                    filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.12))',
                    animation: 'float-slow 3s infinite ease-in-out',
                    marginBottom: '8px'
                  }}>
                    {myAvatar.emoji}
                  </div>
                  <h1 className="text-headline" style={{ color: 'var(--primary)', marginBottom: '2px' }}>
                    {playerData.name}
                  </h1>
                  <span className="badge-neutral" style={{ fontSize: '0.75rem', marginBottom: '12px' }}>
                    {myAvatar.title}
                  </span>

                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'rgba(0, 61, 155, 0.08)',
                    padding: '6px 12px',
                    borderRadius: 'var(--rounded-full)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--primary)'
                  }}>
                    <Wifi size={14} /> Room: {playerData.roomCode}
                  </div>
                </div>

                {/* Living Room Guests Roster */}
                <div className="card-interactive" style={{ width: '100%', padding: '14px', boxSizing: 'border-box' }}>
                  <div style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    letterSpacing: '0.05em',
                    color: 'var(--on-surface-variant)',
                    marginBottom: '10px',
                    textAlign: 'left'
                  }}>
                    GUESTS IN COURTYARD ({gameState?.players?.length || 1})
                  </div>

                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '6px',
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
                            gap: '4px',
                            background: isMe ? 'var(--primary-container)' : 'var(--surface-container-low)',
                            color: isMe ? '#ffffff' : 'var(--on-surface)',
                            padding: '4px 10px',
                            borderRadius: 'var(--rounded-full)',
                            fontSize: '0.75rem',
                            fontWeight: isMe ? 700 : 500,
                            border: '1px solid var(--outline-variant)'
                          }}
                        >
                          <span>{av.emoji}</span>
                          <span>{p.name} {isMe && '(You)'}</span>
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
                  <span className="animate-spin" style={{ display: 'inline-block' }}>⏳</span>
                  <span>Waiting for host to start the haveli mystery...</span>
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
                  Change Name or Avatar
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
                  fontSize: '4.5rem',
                  lineHeight: 1,
                  animation: 'float-slow 3s infinite ease-in-out'
                }}>
                  🌅
                </div>

                <h1 className="text-headline" style={{ color: 'var(--on-surface)' }}>
                  DAWN BREAKS
                </h1>

                {gameState?.morningVictim ? (
                  <div style={{
                    background: 'var(--surface-container-lowest)',
                    border: '2px solid var(--loss)',
                    borderRadius: 'var(--rounded-xl)',
                    padding: '16px',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '4px' }}>
                      {getAvatarById(gameState.morningVictim.avatarId).emoji}
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--loss-text)' }}>
                      {gameState.morningVictim.name} was eliminated!
                    </div>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--on-surface-variant)', marginTop: '4px' }}>
                      Check the living room screen for the crime scene report!
                    </p>
                  </div>
                ) : (
                  <div style={{
                    background: 'var(--surface-container-lowest)',
                    border: '2px solid var(--gain)',
                    borderRadius: 'var(--rounded-xl)',
                    padding: '16px',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '4px' }}>🛡️</div>
                    <div style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--gain-text)' }}>
                      Peaceful Dawn!
                    </div>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--on-surface-variant)', marginTop: '4px' }}>
                      No one was harmed during the night!
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
                <div style={{ fontSize: '4.5rem', lineHeight: 1 }}>⚖️</div>
                <h1 className="text-headline" style={{ color: 'var(--primary)' }}>
                  COUNCIL VERDICT
                </h1>

                {gameState?.exiledPlayer ? (
                  <div style={{
                    background: 'var(--surface-container-lowest)',
                    border: '2px solid var(--primary)',
                    borderRadius: 'var(--rounded-xl)',
                    padding: '16px',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '4px' }}>
                      {gameState.exiledPlayer.avatarId ? getAvatarById(gameState.exiledPlayer.avatarId).emoji : '🏛️'}
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--primary)' }}>
                      {gameState.exiledPlayer.name} has been banished!
                    </div>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--on-surface-variant)', marginTop: '4px' }}>
                      Look up at the TV base station to reveal their true secret identity!
                    </p>
                  </div>
                ) : (
                  <p className="text-body" style={{ color: 'var(--on-surface-variant)' }}>
                    Watch the TV base station for the unmasking!
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
                <div style={{ fontSize: '5rem', lineHeight: 1 }}>🏆</div>
                <h1 className="text-headline" style={{ color: 'var(--primary)' }}>
                  {gameState?.winner === 'kaminey' ? '😈 KAMINEY WON' : '🕊️ BHOLE TRIUMPHED'}
                </h1>
                <p className="text-body" style={{ color: 'var(--on-surface-variant)', fontSize: '0.875rem' }}>
                  Look at the living room screen for the full roster unmasking!
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
                  style={{ width: '100%', padding: '14px', marginTop: '10px' }}
                >
                  PLAY ANOTHER MATCH 🔄
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
