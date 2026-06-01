// components/chat/TypingIndicator.jsx
import React from 'react'
import AIAvatar from './AIAvatar'

export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 px-4 py-2 animate-fade-in">
      <div className="flex-shrink-0 mt-0.5">
        <AIAvatar />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-[11px] font-semibold text-[var(--brand)] tracking-wide uppercase">
          StudyBuddy AI
        </span>
        <div
          className="flex items-center gap-3 px-5 py-3.5 rounded-2xl rounded-tl-sm"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
          }}
        >
          {/* Animated dots */}
          <div className="flex items-center gap-1.5">
            <span className="dot-1 w-2 h-2 rounded-full bg-[var(--brand)] inline-block" />
            <span className="dot-2 w-2 h-2 rounded-full bg-[var(--brand)] inline-block" />
            <span className="dot-3 w-2 h-2 rounded-full bg-[var(--brand)] inline-block" />
          </div>
          <span className="text-xs text-[var(--text-muted)] font-medium">
            Thinking…
          </span>
        </div>
      </div>
    </div>
  )
}