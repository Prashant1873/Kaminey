# Neural Map - Kaminey (Kabo)

Subsystem architecture, state machines, and logic flows.

## 1. System Topology

```text
                       ┌───────────────────────────────┐
                       │ Dedicated Node/WS Server      │
                       │ (Signaling + Fallback Relay)  │
                       └───────────────┬───────────────┘
                                       │ (WSS)
            ┌──────────────────────────┴──────────────────────────┐
            ▼                                                     ▼
[ Living Room Base Station (Host) ]                  [ Mobile Player Controller ]
            │                                                     │
            └──────◄► Direct WebRTC DataChannel (P2P Mesh) ───────┘
                      (Falls back to Server Relay if NAT blocked)
```

## 2. Host Game State Machine

```text
       ┌──────────┐
       │  LOBBY   │  (Host waits for >= 4 players; bots optional)
       └────┬─────┘
            │ onStartGame
            ▼
     ┌──────────────┐
     │ ROLE_REVEAL  │  (Hold wax seal to privately inspect identity)
     └──────┬───────┘
            │ onProceed
            ▼
        ┌───────┐
        │ NIGHT │      (Kaminey agree on target; sneaky eyes animation)
        └───┬───┘
            │ onProceed
            ▼
        ┌───────┐
        │ DARES │      (Night cover missions & party dares)
        └───┬───┘
            │ onProceed / onBreakDawn
            ▼
     ┌──────────────┐
     │   MORNING    │  (Reveal dawn casualty or peaceful night)
     └──────┬───────┘
            │ onProceed
            ▼
    ┌──────────────┐
    │  DISCUSSION  │   (Council debate timer, suspect spotlight)
    └───────┬──────┘
            │ onStartVoting
            ▼
        ┌────────┐
        │ VOTING │     (Secret mobile ballot cast; tallies hidden)
        └───┬────┘
            │ onResolveVotes
            ▼
        ┌───────┐
        │ EXILE │      (Council verdict announced; gavel strike; reveal)
        └───┬───┘
            │
    ┌───────┴───────┐
    ▼               ▼
Win Condition?  No Win Yet?
    │               │
    ▼               ▼
[ GAME_OVER ]    [ NIGHT ] (Next Round)
```

## 3. Realtime Messaging Protocol

| Message Type | Direction | Payload | Purpose |
|--------------|-----------|---------|---------|
| `PLAYER_JOIN` | Player -> Host | `{ id, name, avatarId }` | Registration in room |
| `STATE_SYNC` | Host -> Player | `{ phase, players, mySecret, ... }` | Filtered state projection |
| `NIGHT_VOTE` | Player -> Host | `{ targetId }` | Traitor assassination target |
| `TASK_COMPLETED` | Player -> Host | `{}` | Cover mission completion mark |
| `CAST_VOTE` | Player -> Host | `{ targetId }` | Council exile ballot |
| `HEARTBEAT_PING` | Host -> Player | `{ timestamp }` | Keep-alive check every 2.5s |
| `HEARTBEAT_PONG` | Player -> Host | `{ timestamp }` | Client alive confirmation |
| `PLAYER_KICKED` | Host -> Player | `{ reason }` | Host manual removal |
