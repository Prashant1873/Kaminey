import React, { useState, useEffect, useRef, useCallback } from 'react';
import Header from '../common/Header';
import HostLobby from './HostLobby';
import HostRoleReveal from './HostRoleReveal';
import HostNight from './HostNight';
import HostMorning from './HostMorning';
import HostDares from './HostDares';
import HostDiscussion from './HostDiscussion';
import HostVoting from './HostVoting';
import HostExile from './HostExile';
import HostGameOver from './HostGameOver';

import { HostNetwork, generateRoomCode } from '../../network/peerManager';
import { ANIMAL_AVATARS } from '../../data/animalAvatars';
import { getRandomTeamMission } from '../../data/partyDares';
import { sounds } from '../../audio/soundEffects';

const BOT_NAMES = ['Aarav', 'Meera', 'Rohan', 'Ananya', 'Kabir', 'Tara', 'Arjun', 'Diya', 'Vikram', 'Pooja'];

export default function HostBaseStation({ onExit }) {
  const [roomCode] = useState(() => {
    const saved = sessionStorage.getItem('kaminey_host_room');
    if (saved) return saved;
    const newCode = generateRoomCode();
    sessionStorage.setItem('kaminey_host_room', newCode);
    return newCode;
  });

  const [networkStatus, setNetworkStatus] = useState('Initializing base station...');
  const [phase, setPhase] = useState('LOBBY');
  const [players, setPlayers] = useState([]);
  const [roles, setRoles] = useState({}); // Master secret: playerId -> 'kamina' | 'bhola'
  const [currentMission, setCurrentMission] = useState(() => getRandomTeamMission());
  const [nightVotes, setNightVotes] = useState({}); // kaminaId -> targetId
  const [votes, setVotes] = useState({}); // voterId -> targetId | 'skip'
  const [morningVictim, setMorningVictim] = useState(null);
  const [exiledPlayer, setExiledPlayer] = useState(null);
  const [winner, setWinner] = useState(null);

  const [settings, setSettings] = useState({
    discussionTime: 60,
    votingTime: 45,
    kamineyCount: 'auto',
    enableDares: true
  });

  const networkRef = useRef(null);

  // Helper to construct personalized payload for player to preserve anti-cheat
  const getPlayerPersonalizedState = useCallback((targetPlayerId) => {
    const isKamina = roles[targetPlayerId] === 'kamina';
    const kamineyPartners = isKamina
      ? players.filter(p => roles[p.id] === 'kamina').map(k => ({
          id: k.id,
          name: k.name,
          avatarId: k.avatarId
        }))
      : [];

    return {
      roomCode,
      phase,
      roundSettings: settings,
      currentMission,
      players: players.map(p => ({
        id: p.id,
        name: p.name,
        avatarId: p.avatarId,
        isAlive: p.isAlive,
        isExiled: p.isExiled,
        hasVoted: Boolean(votes[p.id])
      })),
      morningVictim: morningVictim ? {
        id: morningVictim.id,
        name: morningVictim.name,
        avatarId: morningVictim.avatarId
      } : null,
      exiledPlayer: exiledPlayer ? {
        id: exiledPlayer.id,
        name: exiledPlayer.name,
        avatarId: exiledPlayer.avatarId
      } : null,
      winner,
      // Private strictly isolated secret for this specific device:
      mySecret: {
        role: roles[targetPlayerId] || null,
        kamineyPartners,
        nightVotes: isKamina ? nightVotes : null
      }
    };
  }, [roomCode, phase, settings, players, roles, currentMission, nightVotes, votes, morningVictim, exiledPlayer, winner]);

  // Sync state across network whenever relevant state changes
  useEffect(() => {
    if (networkRef.current && networkRef.current.isReady) {
      networkRef.current.broadcastState(getPlayerPersonalizedState);
    }
  }, [getPlayerPersonalizedState]);

  // Handle incoming message from players' mobile devices
  const handlePlayerMessage = useCallback((msg, senderId) => {
    if (!msg || !msg.type) return;

    switch (msg.type) {
      case 'NIGHT_VOTE': {
        const { targetId } = msg.payload;
        setNightVotes(prev => ({
          ...prev,
          [senderId]: targetId
        }));
        break;
      }

      case 'CAST_VOTE': {
        const { targetId } = msg.payload;
        setVotes(prev => ({
          ...prev,
          [senderId]: targetId
        }));
        break;
      }

      case 'TASK_COMPLETED': {
        break;
      }

      default:
        break;
    }
  }, []);

  // Initialize Host PeerJS Network
  useEffect(() => {
    const net = new HostNetwork(
      roomCode,
      (playerData) => {
        setPlayers(prev => {
          // If player with this exact ID already exists, update info (reconnect)
          const index = prev.findIndex(p => p.id === playerData.id);
          if (index >= 0) {
            const updated = [...prev];
            updated[index] = {
              ...updated[index],
              name: playerData.name || updated[index].name,
              avatarId: playerData.avatarId || updated[index].avatarId
            };
            return updated;
          }
          // Disambiguate duplicate names so every player is clearly identifiable
          let finalName = (playerData.name || '').trim();
          if (!finalName) {
            finalName = `Guest ${prev.length + 1}`;
          }
          const duplicateCount = prev.filter(p => p.name.toLowerCase() === finalName.toLowerCase()).length;
          if (duplicateCount > 0) {
            finalName = `${finalName} (${duplicateCount + 1})`;
          }

          return [...prev, {
            id: playerData.id,
            name: finalName,
            avatarId: playerData.avatarId || 'lion',
            isAlive: true,
            isExiled: false,
            isBot: false
          }];
        });

        // Instant direct state sync back to newly connected player
        setTimeout(() => {
          try {
            if (conn && conn.open) {
              const directState = getPlayerPersonalizedState(playerData.id);
              conn.send({
                type: 'STATE_SYNC',
                payload: directState
              });
            }
          } catch (e) {
            console.warn('Initial state sync direct send error:', e);
          }
        }, 50);
      },
      handlePlayerMessage,
      (playerId) => {
        // Player disconnected
      },
      (status) => {
        setNetworkStatus(status);
      }
    );

    networkRef.current = net;
    net.init();

    return () => {
      net.destroy();
    };
  }, [roomCode, handlePlayerMessage]);

  // Remove / kick player from lobby setup screen
  const handleRemovePlayer = useCallback((playerId) => {
    setPlayers(prev => prev.filter(p => p.id !== playerId));
    if (networkRef.current) {
      networkRef.current.kickPlayer(playerId);
    }
  }, []);

  // Add Bot Player for instant solo testing
  const addBotPlayer = () => {
    const availableNames = BOT_NAMES.filter(name => !players.some(p => p.name === name));
    const name = availableNames.length > 0 ? availableNames[0] : `Guest ${players.length + 1}`;
    const unusedAvatars = ANIMAL_AVATARS.filter(a => !players.some(p => p.avatarId === a.id));
    const avatar = unusedAvatars.length > 0
      ? unusedAvatars[Math.floor(Math.random() * unusedAvatars.length)]
      : ANIMAL_AVATARS[Math.floor(Math.random() * ANIMAL_AVATARS.length)];

    const botId = `bot-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setPlayers(prev => [
      ...prev,
      {
        id: botId,
        name,
        avatarId: avatar.id,
        isAlive: true,
        isExiled: false,
        isBot: true
      }
    ]);
  };

  // Check victory condition
  const checkVictory = (currentPlayers, currentRoles) => {
    const alive = currentPlayers.filter(p => p.isAlive && !p.isExiled);
    const aliveKaminey = alive.filter(p => currentRoles[p.id] === 'kamina');
    const aliveBhole = alive.filter(p => currentRoles[p.id] === 'bhola');

    if (aliveKaminey.length === 0) {
      return 'bhole'; // All traitors eliminated!
    }
    if (aliveKaminey.length >= aliveBhole.length) {
      return 'kaminey'; // Traitors equal or outnumber innocents!
    }
    return null;
  };

  // Start the Game
  const handleStartGame = () => {
    if (players.length < 4) return;

    // Determine number of Kaminey
    let numKaminey = 1;
    if (settings.kamineyCount === 'auto') {
      numKaminey = players.length >= 8 ? 2 : 1;
    } else {
      numKaminey = Math.min(parseInt(settings.kamineyCount, 10), Math.floor(players.length / 2));
    }

    // Shuffle & Assign Roles
    const shuffled = [...players].sort(() => 0.5 - Math.random());
    const newRoles = {};
    const newDares = {};

    shuffled.forEach((p, idx) => {
      newRoles[p.id] = idx < numKaminey ? 'kamina' : 'bhola';
      newDares[p.id] = getRandomDare();
    });

    setRoles(newRoles);
    setDares(newDares);
    setNightVotes({});
    setVotes({});
    setMorningVictim(null);
    setExiledPlayer(null);
    setWinner(null);

    sounds.playGong();
    setPhase('ROLE_REVEAL');
  };

  // Advance from Role Reveal / Exile to Night
  const handleProceedToNight = () => {
    // Retain any pre-cast murder votes submitted during the task phase
    setPhase('NIGHT');

    // If bots are Kaminey, make them vote a random alive Bhola if not already voted
    setTimeout(() => {
      const aliveBhole = players.filter(p => p.isAlive && !p.isExiled && roles[p.id] === 'bhola');
      if (aliveBhole.length > 0) {
        const target = aliveBhole[Math.floor(Math.random() * aliveBhole.length)];
        const botKaminey = players.filter(p => p.isAlive && !p.isExiled && p.isBot && roles[p.id] === 'kamina');
        if (botKaminey.length > 0) {
          setNightVotes(prev => {
            const next = { ...prev };
            botKaminey.forEach(b => {
              if (!next[b.id]) next[b.id] = target.id;
            });
            return next;
          });
        }
      }
    }, 1500);
  };

  // Advance from Night to Morning
  const handleProceedToMorning = () => {
    // Resolve Night Murder
    const targetTallies = {};
    Object.values(nightVotes).forEach(targetId => {
      if (targetId) {
        targetTallies[targetId] = (targetTallies[targetId] || 0) + 1;
      }
    });

    let victim = null;
    let maxVotes = 0;
    Object.entries(targetTallies).forEach(([targetId, count]) => {
      if (count > maxVotes) {
        maxVotes = count;
        victim = players.find(p => p.id === targetId);
      }
    });

    // Fallback if no target agreed: pick random alive bhola or peaceful night
    if (!victim) {
      const aliveBhole = players.filter(p => p.isAlive && !p.isExiled && roles[p.id] === 'bhola');
      if (aliveBhole.length > 0 && Math.random() > 0.4) {
        victim = aliveBhole[Math.floor(Math.random() * aliveBhole.length)];
      }
    }

    if (victim) {
      setPlayers(prev => prev.map(p => p.id === victim.id ? { ...p, isAlive: false } : p));
      setMorningVictim(victim);
    } else {
      setMorningVictim(null);
    }

    // Check Victory right after morning murder
    const updatedPlayers = players.map(p => victim && p.id === victim.id ? { ...p, isAlive: false } : p);
    const winResult = checkVictory(updatedPlayers, roles);
    if (winResult) {
      setWinner(winResult);
      setPhase('GAME_OVER');
      return;
    }

    setNightVotes({});
    setPhase('MORNING');
  };

  // Advance from Morning to Team Missions or Discussion
  const handleProceedFromMorning = () => {
    if (settings.enableDares) {
      setCurrentMission(getRandomTeamMission());
      setPhase('DARES');
    } else {
      setPhase('DISCUSSION');
    }
  };

  // Reshuffle current team mission
  const handleReshuffleMission = () => {
    setCurrentMission(prev => getRandomTeamMission(prev?.id));
  };

  // Call Round-Table Discussion
  const handleCallDiscussion = () => {
    setPhase('DISCUSSION');
  };

  // Start Voting
  const handleStartVoting = () => {
    setVotes({});
    setPhase('VOTING');

    // Trigger Bot votes automatically
    setTimeout(() => {
      const alive = players.filter(p => p.isAlive && !p.isExiled);
      const aliveBots = alive.filter(p => p.isBot);
      setVotes(prev => {
        const next = { ...prev };
        aliveBots.forEach(bot => {
          // 85% chance bot votes someone alive, 15% skip
          if (Math.random() > 0.15) {
            const targets = alive.filter(t => t.id !== bot.id);
            const chosen = targets[Math.floor(Math.random() * targets.length)];
            if (chosen) next[bot.id] = chosen.id;
          } else {
            next[bot.id] = 'skip';
          }
        });
        return next;
      });
    }, 2000);
  };

  // Resolve Ballots and Exile
  const handleResolveVotes = (tallies) => {
    let exiled = null;
    let highestVotes = 0;
    let isTie = false;

    Object.entries(tallies).forEach(([targetId, count]) => {
      if (targetId === 'skip') return;
      if (count > highestVotes) {
        highestVotes = count;
        exiled = players.find(p => p.id === targetId);
        isTie = false;
      } else if (count === highestVotes && highestVotes > 0) {
        isTie = true;
      }
    });

    const skipVotes = tallies['skip'] || 0;
    if (isTie || skipVotes >= highestVotes || !exiled) {
      setExiledPlayer(null);
    } else {
      setExiledPlayer(exiled);
      setPlayers(prev => prev.map(p => p.id === exiled.id ? { ...p, isExiled: true } : p));
    }

    setPhase('EXILE');
  };

  // Proceed from Exile to Next Round or Game Over
  const handleProceedFromExile = () => {
    const winResult = checkVictory(players, roles);
    if (winResult) {
      setWinner(winResult);
      setPhase('GAME_OVER');
    } else {
      // Loop back to Night
      handleProceedToNight();
    }
  };

  // Restart match back to Lobby
  const handleRestart = () => {
    setPlayers(prev => prev.map(p => ({ ...p, isAlive: true, isExiled: false })));
    setRoles({});
    setDares({});
    setNightVotes({});
    setVotes({});
    setMorningVictim(null);
    setExiledPlayer(null);
    setWinner(null);
    setPhase('LOBBY');
  };

  const nightMurderSelected = Object.keys(nightVotes).length > 0;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header
        isHost={true}
        roomCode={roomCode}
        playerCount={players.length}
        currentPhase={phase}
        onLeave={onExit}
      />

      <main style={{ flex: 1 }}>
        {phase === 'LOBBY' && (
          <HostLobby
            roomCode={roomCode}
            players={players}
            settings={settings}
            onUpdateSettings={setSettings}
            onStartGame={handleStartGame}
            onAddBot={addBotPlayer}
            onRemovePlayer={handleRemovePlayer}
            networkStatus={networkStatus}
          />
        )}

        {phase === 'ROLE_REVEAL' && (
          <HostRoleReveal
            players={players}
            onProceed={handleProceedToNight}
          />
        )}

        {phase === 'NIGHT' && (
          <HostNight
            nightMurderSelected={nightMurderSelected}
            onProceed={handleProceedToMorning}
          />
        )}

        {phase === 'MORNING' && (
          <HostMorning
            victim={morningVictim}
            onProceed={handleProceedFromMorning}
          />
        )}

        {phase === 'DARES' && (
          <HostDares
            mission={currentMission}
            players={players}
            onReshuffle={handleReshuffleMission}
            onDoOurOwnThing={handleCallDiscussion}
            onCallDiscussion={handleCallDiscussion}
          />
        )}

        {phase === 'DISCUSSION' && (
          <HostDiscussion
            players={players}
            duration={settings.discussionTime}
            onStartVoting={handleStartVoting}
          />
        )}

        {phase === 'VOTING' && (
          <HostVoting
            players={players}
            votes={votes}
            duration={settings.votingTime}
            onResolveVotes={handleResolveVotes}
          />
        )}

        {phase === 'EXILE' && (
          <HostExile
            exiledPlayer={exiledPlayer}
            role={exiledPlayer ? roles[exiledPlayer.id] : null}
            onProceed={handleProceedFromExile}
          />
        )}

        {phase === 'GAME_OVER' && (
          <HostGameOver
            winner={winner}
            players={players}
            roles={roles}
            onRestart={handleRestart}
          />
        )}
      </main>
    </div>
  );
}
