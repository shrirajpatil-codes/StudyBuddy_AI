// components/chat/TypingIndicator.jsx
// Animated "AI is thinking" bubble shown while waiting for response

import React from 'react'
import AIAvatar from './AIAvatar'

export default function TypingIndicator() {
  return (
    <div className="flex items-end gap-3 animate-fade-in px-4 py-2">
      <AIAvatar />
      <div
        className="flex items-center gap-1.5 px-4 py-3 rounded-2xl rounded-bl-sm"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
      >
        <span className="dot-1 w-2 h-2 rounded-full bg-brand-400 inline-block" />
        <span className="dot-2 w-2 h-2 rounded-full bg-brand-400 inline-block" />
        <span className="dot-3 w-2 h-2 rounded-full bg-brand-400 inline-block" />
      </div>
    </div>
  )
}
