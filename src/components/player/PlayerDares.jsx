import React, { useState } from 'react';
import { CheckCircle2, Sparkles, HelpCircle, AlertCircle } from 'lucide-react';

export default function PlayerDares({ currentDare, onCompleteTask }) {
  const [completed, setCompleted] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const handleDone = () => {
    setCompleted(true);
    onCompleteTask?.();
  };

  if (!currentDare) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--on-surface-variant)' }}>
        <p>No party task assigned right now. Stand by for the round-table!</p>
      </div>
    );
  }

  return (
    <div style={{
      width: '100%',
      maxWidth: '440px',
      margin: '0 auto',
      padding: '16px 14px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      textAlign: 'center',
      boxSizing: 'border-box'
    }}>
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: 'var(--rounded-full)',
        background: 'linear-gradient(135deg, var(--warning), var(--warning-text))',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto',
        fontSize: '1.75rem',
        boxShadow: 'var(--shadow-resting)'
      }}>
        🎯
      </div>

      <div>
        <span className="badge-warning" style={{ fontSize: '0.75rem', marginBottom: '8px' }}>
          CONFIDENTIAL PARTY TASK
        </span>
        <h1 className="text-headline" style={{ color: 'var(--primary)', marginBottom: '6px' }}>
          {currentDare.title}
        </h1>
        <p className="text-body" style={{ color: 'var(--on-surface-variant)', fontSize: '0.875rem' }}>
          Execute this task in the room without letting anyone realize it is your game mission!
        </p>
      </div>

      {/* Task Card */}
      <div className="card-interactive" style={{
        padding: '24px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        border: completed ? '2px solid var(--gain)' : '1px solid var(--outline-variant)',
        backgroundColor: completed ? 'rgba(54, 179, 126, 0.05)' : 'var(--surface-container-lowest)'
      }}>
        <div style={{
          fontSize: '1.125rem',
          fontWeight: 700,
          color: 'var(--on-surface)',
          lineHeight: 1.45
        }}>
          "{currentDare.task}"
        </div>

        {/* Hint toggle */}
        {currentDare.hint && (
          <div>
            <button
              type="button"
              onClick={() => setShowHint(!showHint)}
              className="spring-btn"
              style={{
                background: 'transparent',
                color: 'var(--secondary)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <HelpCircle size={14} />
              <span>{showHint ? 'Hide Tactical Hint' : 'Show Tactical Hint'}</span>
            </button>

            {showHint && (
              <div style={{
                marginTop: '8px',
                padding: '10px 14px',
                borderRadius: 'var(--rounded-md)',
                backgroundColor: 'var(--surface-container-low)',
                fontSize: '0.8125rem',
                color: 'var(--on-surface-variant)',
                fontStyle: 'italic'
              }}>
                💡 {currentDare.hint}
              </div>
            )}
          </div>
        )}

        {/* Completion Button */}
        <button
          type="button"
          onClick={handleDone}
          disabled={completed}
          className={completed ? 'btn-secondary spring-btn' : 'btn-primary spring-btn'}
          style={{
            width: '100%',
            padding: '14px',
            backgroundColor: completed ? 'var(--gain)' : undefined,
            color: completed ? '#ffffff' : undefined
          }}
        >
          <CheckCircle2 size={18} />
          <span>{completed ? 'Task Accomplished! 🎉' : 'Mark as Done'}</span>
        </button>
      </div>

      <p style={{ fontSize: '0.8125rem', color: 'var(--outline)' }}>
        The living room base station will sound the emergency alarm when discussion begins.
      </p>
    </div>
  );
}
