// components/ui/Input.jsx — Reusable form input

import React from 'react'

export default function Input({ label, icon, className = '', ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-theme mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
            {icon}
          </div>
        )}
        <input
          className={`
            w-full rounded-xl border border-theme bg-card text-theme
            placeholder:text-muted text-sm
            px-4 py-3 ${icon ? 'pl-10' : ''}
            transition-all duration-200
            focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20
            ${className}
          `}
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border)',
            color: 'var(--text-primary)',
          }}
          {...props}
        />
      </div>
    </div>
  )
}
