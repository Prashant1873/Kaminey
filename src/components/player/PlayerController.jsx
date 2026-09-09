import React, { useState, useEffect, useRef } from 'react';
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
  const [playerData, setPlayerData] = useState(null); // { id, name, avatarId }
  const [networkStatus, setNetworkStatus] = useState('');
  const [gameState, setGameState] = useState(null); // Synced state from host
  const networkRef = useRef(null);

  const handleJoin = ({ roomCode, name, avatarId }) => {
    const id = `player-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const newPlayer = { id, name, avatarId, roomCode };
    setPlayerData(newPlayer);

    const net = new PlayerNetwork(
      roomCode,
      newPlayer,
      (incomingState) => {
        setGameState(incomingState);
      },
      () => {
        setNetworkStatus('Lost connection to host. Reconnecting...');
      },
      (status) => {
        setNetworkStatus(status);
      }
    );

    networkRef.current = net;
    net.init();
  };

  useEffect(() => {
    return () => {
      if (networkRef.current) {
        networkRef.current.destroy();
      }
    };
  }, []);

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
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
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
          padding: '6px 16px',
          fontSize: '0.75rem',
          textAlign: 'center',
          color: 'var(--on-surface-variant)',
          borderBottom: '1px solid var(--outline-variant)'
        }}>
          {networkStatus}
        </div>
      )}

      {/* Main Screen according to Phase */}
      <main style={{ flex: 1, paddingBottom: '30px' }}>
        {/* If Player is dead/exiled and match is in progress, show Ghost Spectator mode */}
        {isDead && phase !== 'LOBBY' && phase !== 'ROLE_REVEAL' && phase !== 'GAME_OVER' ? (
          <PlayerGhost playerName={playerData.name} isExiled={isExiled} />
        ) : (
          <>
            {/* LOBBY PHASE */}
            {phase === 'LOBBY' && (
              <div style={{
                maxWidth: '440px',
                margin: '0 auto',
                padding: '40px 20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '24px'
              }}>
                <div style={{
                  fontSize: '4.5rem',
                  lineHeight: 1,
                  filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.1))'
                }}>
                  {myAvatar.emoji}
                </div>
                <div>
                  <h1 className="text-display" style={{ fontSize: '1.75rem', color: 'var(--primary)', marginBottom: '4px' }}>
                    YOU ARE IN THE HAVELI
                  </h1>
                  <p style={{ fontSize: '1.125rem', fontWeight: 700 }}>
                    {playerData.name} ({myAvatar.name})
                  </p>
                  <p className="text-body" style={{ color: 'var(--on-surface-variant)', marginTop: '8px' }}>
                    Connected to living room base <strong>{playerData.roomCode}</strong>.
                    <br />
                    Relax while other guests enter. The host will start the mystery shortly!
                  </p>
                </div>

                <div className="card-interactive" style={{ width: '100%', padding: '16px' }}>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--outline)', fontWeight: 600 }}>
                    PLAYERS IN ROOM: {gameState?.players?.length || 1}
                  </div>
                </div>
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
                padding: '36px 16px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '20px'
              }}>
                <div style={{ fontSize: '4rem' }}>🌅</div>
                <h1 className="text-headline" style={{ color: 'var(--on-surface)' }}>
                  DAWN HAS BROKEN
                </h1>
                <p className="text-body" style={{ color: 'var(--on-surface-variant)' }}>
                  Look up at the living room screen to find out who survived the night!
                </p>
              </div>
            )}

            {/* DARES & SOCIAL TASKS PHASE */}
            {phase === 'DARES' && (
              <PlayerDares
                currentDare={mySecret.currentDare}
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
                padding: '36px 16px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '20px'
              }}>
                <div style={{ fontSize: '4rem' }}>⚖️</div>
                <h1 className="text-headline" style={{ color: 'var(--primary)' }}>
                  THE VERDICT
                </h1>
                <p className="text-body" style={{ color: 'var(--on-surface-variant)' }}>
                  Check the living room base station to see who was banished and whether they were a Kamina or a Bhola!
                </p>
              </div>
            )}

            {/* GAME OVER PHASE */}
            {phase === 'GAME_OVER' && (
              <div style={{
                maxWidth: '440px',
                margin: '0 auto',
                padding: '36px 16px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '20px'
              }}>
                <div style={{ fontSize: '4rem' }}>🏆</div>
                <h1 className="text-headline" style={{ color: 'var(--primary)' }}>
                  MATCH COMPLETED!
                </h1>
                <p className="text-body" style={{ color: 'var(--on-surface-variant)' }}>
                  Look at the living room screen for the complete role reveal of every player in the haveli!
                </p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
