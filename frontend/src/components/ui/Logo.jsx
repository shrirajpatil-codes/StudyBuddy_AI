// components/ui/Logo.jsx

import React from 'react'

export default function Logo({ size = 'md', withText = true }) {
  const s = size === 'lg' ? 40 : size === 'sm' ? 24 : 32

  return (
    <div className="flex items-center gap-2.5">
      {/* Icon mark */}
      <div
        className="relative flex-shrink-0 rounded-xl flex items-center justify-center"
        style={{
          width: s, height: s,
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          boxShadow: '0 4px 12px rgba(99,102,241,0.4)',
        }}
      >
        {/* Book + spark icon using pure SVG */}
        <svg width={s * 0.6} height={s * 0.6} viewBox="0 0 20 20" fill="none">
          <path d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5z"
            fill="white" fillOpacity="0.25"/>
          <path d="M7 8h6M7 11h4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="14.5" cy="5.5" r="3" fill="#f0abfc"/>
          <path d="M14.5 4v1.5l1 1" stroke="white" strokeWidth="1" strokeLinecap="round"/>
        </svg>
      </div>

      {withText && (
        <div>
          <span
            className="font-display font-bold leading-none"
            style={{
              fontSize: size === 'lg' ? '1.4rem' : size === 'sm' ? '1rem' : '1.2rem',
              background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            StudyBuddy
          </span>
          <span
            className="font-display font-bold leading-none ml-1.5"
            style={{
              fontSize: size === 'lg' ? '1.4rem' : size === 'sm' ? '1rem' : '1.2rem',
              color: 'var(--text-muted)',
            }}
          >
            AI
          </span>
        </div>
      )}
    </div>
  )
}
