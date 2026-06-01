// components/chat/WelcomeScreen.jsx
import React from 'react'
import { BookOpen, HelpCircle, Mic, Zap, Target, Clock, Sparkles } from 'lucide-react'

const SUGGESTIONS = {
  doubt: [
    { text: "Explain Thevenin's theorem with an example" },
    { text: "What is the difference between process and thread?" },
    { text: "How does a transformer work?" },
    { text: "Explain Big O notation simply" },
  ],
  exam: [
    { text: "Give me revision notes for Operating Systems" },
    { text: "What are the most important topics in DBMS?" },
    { text: "Summarise the syllabus for Digital Electronics" },
    { text: "Create a 10-question practice test on Algorithms" },
  ],
  viva: [
    { text: "Ask me viva questions on Microprocessors" },
    { text: "How should I answer 'Explain your project'?" },
    { text: "Common viva questions on Computer Networks" },
    { text: "Practice oral exam on Data Structures" },
  ],
  exam_blast: [
    { text: "Operating Systems — exam is tomorrow!" },
    { text: "DBMS — need everything important fast" },
    { text: "Computer Networks — last minute revision" },
    { text: "Data Structures — quick exam prep" },
  ],
}

const MODE_INFO = {
  doubt: {
    title:    'Clear Your Doubts',
    subtitle: 'Ask any engineering concept and get instant, clear explanations.',
    icon:     HelpCircle,
    gradient: 'from-indigo-500 to-violet-500',
    glow:     'rgba(99,102,241,0.3)',
    chipHover:'hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20',
    chipIcon: 'text-indigo-500',
    tag:      'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300',
  },
  exam: {
    title:    'Ace Your Exams',
    subtitle: 'Get revision notes, important questions, and practice tests.',
    icon:     BookOpen,
    gradient: 'from-violet-500 to-purple-600',
    glow:     'rgba(139,92,246,0.3)',
    chipHover:'hover:border-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20',
    chipIcon: 'text-violet-500',
    tag:      'bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-300',
  },
  viva: {
    title:    'Nail Your Viva',
    subtitle: 'Simulate oral exams with model answers and confidence tips.',
    icon:     Mic,
    gradient: 'from-emerald-500 to-teal-500',
    glow:     'rgba(16,185,129,0.3)',
    chipHover:'hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20',
    chipIcon: 'text-emerald-500',
    tag:      'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-300',
  },
  exam_blast: {
    title:    'Exam is Tomorrow!',
    subtitle: "Tell me your subject — I'll give you only what matters most.",
    icon:     Zap,
    gradient: 'from-orange-500 to-red-500',
    glow:     'rgba(249,115,22,0.3)',
    chipHover:'hover:border-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20',
    chipIcon: 'text-orange-500',
    tag:      'bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-300',
  },
}

export default function WelcomeScreen({ mode = 'doubt', onSuggestion }) {
  const info    = MODE_INFO[mode] || MODE_INFO.doubt
  const prompts = SUGGESTIONS[mode] || SUGGESTIONS.doubt
  const Icon    = info.icon

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 py-10 animate-fade-in">

      {/* ── Glow orb ── */}
      <div className="relative mb-7">
        {/* Outer glow ring */}
        <div
          className="absolute inset-0 rounded-3xl blur-xl opacity-60 scale-110"
          style={{ background: `radial-gradient(circle, ${info.glow}, transparent 70%)` }}
        />
        {/* Icon container */}
        <div className={`relative w-20 h-20 rounded-3xl bg-gradient-to-br ${info.gradient}
          flex items-center justify-center shadow-lg`}>
          <Icon size={36} color="white" strokeWidth={1.75} />
        </div>
      </div>

      {/* ── Title ── */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles size={14} className="text-[var(--text-muted)]" />
          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${info.tag}`}>
            {mode === 'exam_blast' ? '🔥 Exam Mode' : mode === 'viva' ? '🎤 Viva Mode' : mode === 'exam' ? '📚 Exam Prep' : '💡 Doubt Mode'}
          </span>
          <Sparkles size={14} className="text-[var(--text-muted)]" />
        </div>
        <h2 className={`text-2xl font-display font-bold bg-gradient-to-r ${info.gradient}
          bg-clip-text text-transparent mb-2`}>
          {info.title}
        </h2>
        <p className="text-[var(--text-muted)] text-sm max-w-sm leading-relaxed">
          {info.subtitle}
        </p>
      </div>

      {/* ── Suggestion chips ── */}
      <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-8">
        {prompts.map((p, i) => (
          <button
            key={i}
            onClick={() => onSuggestion(p.text)}
            className={`flex items-center gap-3 p-4 rounded-2xl border border-[var(--border)]
              bg-[var(--bg-card)] ${info.chipHover}
              text-left text-sm text-[var(--text-primary)] transition-all duration-200
              cursor-pointer group animate-slide-up shadow-sm hover:shadow-md`}
            style={{ animationDelay: `${i * 70}ms` }}
          >
            <div className={`w-7 h-7 rounded-xl flex items-center justify-center
              flex-shrink-0 bg-[var(--bg-primary)] ${info.chipIcon}
              group-hover:scale-110 transition-transform`}>
              <Icon size={14} />
            </div>
            <span className="leading-snug">{p.text}</span>
          </button>
        ))}
      </div>

      {/* ── Stats row ── */}
      <div className="flex items-center gap-6 text-xs text-[var(--text-muted)]">
        {[
          { icon: Zap,    label: 'Instant answers' },
          { icon: Target, label: 'Exam-focused'    },
          { icon: Clock,  label: 'Available 24/7'  },
        ].map(({ icon: StatIcon, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <StatIcon size={13} className={info.chipIcon} />
            <span>{label}</span>
          </div>
        ))}
      </div>

    </div>
  )
}