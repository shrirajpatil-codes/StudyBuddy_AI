// components/ui/ModeSelector.jsx
import React from 'react'
import { HelpCircle, BookOpen, Mic, Zap } from 'lucide-react'

export const MODES = [
  {
    id:    'doubt',
    label: 'Doubt',
    icon:  HelpCircle,
    color: 'indigo',
    desc:  'Get instant answers to your academic questions',
    active: 'bg-indigo-500 text-white shadow-sm',
    dot:    'bg-indigo-400',
    ring:   'border-indigo-400',
    card:   'border-indigo-400 bg-indigo-50 dark:bg-indigo-900/30',
    cardIcon:'bg-indigo-500 text-white',
    cardText:'text-indigo-600 dark:text-indigo-300',
  },
  {
    id:    'exam',
    label: 'Exam Prep',
    icon:  BookOpen,
    color: 'violet',
    desc:  'Summarise topics, revision notes, practice Qs',
    active: 'bg-violet-500 text-white shadow-sm',
    dot:    'bg-violet-400',
    ring:   'border-violet-400',
    card:   'border-violet-400 bg-violet-50 dark:bg-violet-900/30',
    cardIcon:'bg-violet-500 text-white',
    cardText:'text-violet-600 dark:text-violet-300',
  },
  {
    id:    'viva',
    label: 'Viva',
    icon:  Mic,
    color: 'emerald',
    desc:  'Simulate oral exams with model answers',
    active: 'bg-emerald-500 text-white shadow-sm',
    dot:    'bg-emerald-400',
    ring:   'border-emerald-400',
    card:   'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/30',
    cardIcon:'bg-emerald-500 text-white',
    cardText:'text-emerald-600 dark:text-emerald-300',
  },
  {
    id:    'exam_blast',
    label: '1-Day Exam',
    icon:  Zap,
    color: 'orange',
    desc:  'Exam is tomorrow — get only what matters most',
    active: 'bg-orange-500 text-white shadow-sm',
    dot:    'bg-orange-400',
    ring:   'border-orange-400',
    card:   'border-orange-400 bg-orange-50 dark:bg-orange-900/30',
    cardIcon:'bg-orange-500 text-white',
    cardText:'text-orange-600 dark:text-orange-300',
  },
]

export default function ModeSelector({ value, onChange, compact = false }) {

  /* ── Compact pill row (used in top navbar) ── */
  if (compact) {
    return (
      <div
        className="flex gap-1 p-1 rounded-xl overflow-x-auto scrollbar-hide"
        style={{ background: 'var(--bg-primary)' }}
      >
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
                transition-all duration-200 cursor-pointer whitespace-nowrap flex-shrink-0
                ${active ? m.active : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]'}
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

  /* ── Full grid (used in sidebar) ── */
  return (
    <div className="grid grid-cols-2 gap-2">
      {MODES.map(m => {
        const Icon   = m.icon
        const active = value === m.id
        return (
          <button
            key={m.id}
            onClick={() => onChange(m.id)}
            className={`
              flex flex-col items-center gap-1.5 p-3 rounded-xl border
              transition-all duration-200 cursor-pointer text-center
              ${active
                ? m.card
                : 'border-[var(--border)] bg-[var(--bg-card)] hover:border-[var(--brand)] hover:bg-[var(--bg-primary)]'
              }
            `}
          >
            <div className={`p-2 rounded-lg transition-all
              ${active ? m.cardIcon : 'bg-gray-100 dark:bg-white/10 text-[var(--text-muted)]'}`}>
              <Icon size={16} />
            </div>
            <span className={`text-xs font-semibold transition-colors
              ${active ? m.cardText : 'text-[var(--text-muted)]'}`}>
              {m.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}