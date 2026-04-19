// components/ui/ModeSelector.jsx
// Pill-style mode switcher: Doubt | Exam Prep | Viva Practice

import React from 'react'
import { HelpCircle, BookOpen, Mic } from 'lucide-react'

export const MODES = [
  { id: 'doubt', label: 'Doubt',     icon: HelpCircle, color: 'brand',  desc: 'Get instant answers to your academic questions' },
  { id: 'exam',  label: 'Exam Prep', icon: BookOpen,   color: 'violet', desc: 'Summarise topics, revision notes, practice Qs' },
  { id: 'viva',  label: 'Viva',      icon: Mic,        color: 'green',  desc: 'Simulate oral exams with model answers' },
]

const colorMap = {
  brand:  { active: 'bg-brand-500 text-white shadow-glow-sm', dot: 'bg-brand-400' },
  violet: { active: 'bg-violet-500 text-white',                dot: 'bg-violet-400' },
  green:  { active: 'bg-green-500 text-white',                 dot: 'bg-green-400' },
}

export default function ModeSelector({ value, onChange, compact = false }) {
  if (compact) {
    return (
      <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'var(--bg-primary)' }}>
        {MODES.map(m => {
          const Icon   = m.icon
          const active = value === m.id
          return (
            <button
              key={m.id}
              onClick={() => onChange(m.id)}
              title={m.desc}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                transition-all duration-200 cursor-pointer
                ${active ? colorMap[m.color].active : 'text-muted hover:text-theme'}
              `}
            >
              <Icon size={13} />
              {m.label}
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      {MODES.map(m => {
        const Icon   = m.icon
        const active = value === m.id
        const c      = colorMap[m.color]
        return (
          <button
            key={m.id}
            onClick={() => onChange(m.id)}
            className={`
              flex flex-col items-center gap-1.5 p-3 rounded-xl border
              transition-all duration-200 cursor-pointer text-center
              ${active
                ? 'border-brand-400 bg-brand-light dark:bg-brand-900/40'
                : 'border-theme bg-card hover:border-brand-300 hover:bg-brand-50 dark:hover:bg-brand-900/20'
              }
            `}
          >
            <div className={`p-2 rounded-lg ${active ? c.active : 'bg-gray-100 dark:bg-white/10 text-muted'}`}>
              <Icon size={16} />
            </div>
            <span className={`text-xs font-semibold ${active ? 'text-brand-600 dark:text-brand-300' : 'text-muted'}`}>
              {m.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
