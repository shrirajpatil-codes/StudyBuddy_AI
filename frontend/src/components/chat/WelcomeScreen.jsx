// components/chat/WelcomeScreen.jsx
// Shown inside the chat window when a session has no messages yet

import React from 'react'
import { BookOpen, HelpCircle, Mic, Zap, Target, Clock } from 'lucide-react'

const SUGGESTIONS = {
  doubt: [
    { icon: HelpCircle, text: "Explain Thevenin's theorem with an example" },
    { icon: HelpCircle, text: "What is the difference between process and thread?" },
    { icon: HelpCircle, text: "How does a transformer work?" },
    { icon: HelpCircle, text: "Explain Big O notation simply" },
  ],
  exam: [
    { icon: BookOpen, text: "Give me revision notes for Operating Systems" },
    { icon: BookOpen, text: "What are the most important topics in DBMS?" },
    { icon: BookOpen, text: "Summarise the syllabus for Digital Electronics" },
    { icon: BookOpen, text: "Create a 10-question practice test on Algorithms" },
  ],
  viva: [
    { icon: Mic, text: "Ask me viva questions on Microprocessors" },
    { icon: Mic, text: "How should I answer 'Explain your project'?" },
    { icon: Mic, text: "Common viva questions on Computer Networks" },
    { icon: Mic, text: "Practice oral exam on Data Structures" },
  ],
}

const MODE_INFO = {
  doubt: { title: 'Clear Your Doubts', subtitle: 'Ask any engineering concept and get instant, clear explanations.', color: '#6366f1' },
  exam:  { title: 'Ace Your Exams',   subtitle: 'Get revision notes, important questions, and practice tests.', color: '#8b5cf6' },
  viva:  { title: 'Nail Your Viva',   subtitle: 'Simulate oral exams with model answers and confidence tips.', color: '#10b981' },
}

export default function WelcomeScreen({ mode = 'doubt', onSuggestion }) {
  const info    = MODE_INFO[mode]
  const prompts = SUGGESTIONS[mode]

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 py-12 animate-fade-in">
      {/* Gradient orb */}
      <div
        className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
        style={{
          background: `linear-gradient(135deg, ${info.color}22, ${info.color}44)`,
          border: `1.5px solid ${info.color}44`,
        }}
      >
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ background: `linear-gradient(135deg, ${info.color}, ${info.color}cc)` }}
        >
          {mode === 'doubt' && <HelpCircle size={24} color="white" />}
          {mode === 'exam'  && <BookOpen   size={24} color="white" />}
          {mode === 'viva'  && <Mic        size={24} color="white" />}
        </div>
      </div>

      <h2 className="text-2xl font-display font-bold text-theme mb-2">{info.title}</h2>
      <p className="text-muted text-center text-sm max-w-xs mb-10 leading-relaxed">{info.subtitle}</p>

      {/* Suggestion chips */}
      <div className="w-full max-w-lg grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {prompts.map((p, i) => (
          <button
            key={i}
            onClick={() => onSuggestion(p.text)}
            className="flex items-start gap-3 p-3.5 rounded-xl border border-theme
              bg-card hover:border-brand-400 hover:shadow-glow-sm
              text-left text-sm text-theme transition-all duration-200 cursor-pointer group
              animate-slide-up"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <p.icon size={16} className="text-muted group-hover:text-brand-500 transition-colors flex-shrink-0 mt-0.5" />
            <span className="leading-snug">{p.text}</span>
          </button>
        ))}
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-6 mt-10 text-xs text-muted">
        {[
          { icon: Zap,    label: 'Instant answers' },
          { icon: Target, label: 'Exam-focused'    },
          { icon: Clock,  label: 'Available 24/7'  },
        ].map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <Icon size={13} className="text-brand-400" />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
