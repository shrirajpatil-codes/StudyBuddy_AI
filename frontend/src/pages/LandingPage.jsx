// pages/LandingPage.jsx — Hero, features, CTA

import React from 'react'
import { Link } from 'react-router-dom'
import {
  Sparkles, BookOpen, Mic, HelpCircle,
  ArrowRight, Zap, Shield, Clock, Star,
  CheckCircle2, ChevronRight,
} from 'lucide-react'
import Logo from '../components/ui/Logo'
import DarkModeToggle from '../components/ui/DarkModeToggle'
import Badge from '../components/ui/Badge'

/* ── Features data ─────────────────────────────── */
const FEATURES = [
  {
    icon: HelpCircle,
    color: '#6366f1',
    title: 'Instant Doubt Clearing',
    desc: 'Ask any engineering concept — from Thevenin\'s theorem to Big O notation — and get clear, step-by-step explanations instantly.',
  },
  {
    icon: BookOpen,
    color: '#8b5cf6',
    title: 'Smart Exam Prep',
    desc: 'Get AI-generated revision notes, important questions, and practice tests tailored to your engineering syllabus.',
  },
  {
    icon: Mic,
    color: '#10b981',
    title: 'Viva Practice',
    desc: 'Simulate oral exams with realistic questions and model answers. Build confidence before your university viva.',
  },
  {
    icon: Zap,
    color: '#f59e0b',
    title: 'Lightning Fast',
    desc: 'No waiting, no loading screens. Get instant responses so you can stay in flow and study more efficiently.',
  },
  {
    icon: Shield,
    color: '#ef4444',
    title: 'Distraction Free',
    desc: 'A clean, focused interface designed specifically for studying — no ads, no feeds, no notifications.',
  },
  {
    icon: Clock,
    color: '#06b6d4',
    title: 'Available 24/7',
    desc: 'Your study buddy is always awake. Use it at midnight before exams, or during early morning revision sessions.',
  },
]

const TESTIMONIALS = [
  { name: 'Arjun P.', branch: 'Computer Engineering', quote: 'Got my first distinction after using StudyBuddy AI for revision. The exam prep mode is incredible!' },
  { name: 'Priya M.', branch: 'Electronics & TC', quote: 'The viva practice feature saved me. I was so much more confident in my oral exam.' },
  { name: 'Rohit S.', branch: 'Mechanical Engineering', quote: 'Finally an AI that actually explains engineering concepts clearly, not just Wikipedia definitions.' },
]

export default function LandingPage({ dark, onToggleDark, isLoggedIn, user, onLogout }) {
  return (
    <div className="min-h-screen mesh-bg">

      {/* ── Navbar ──────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-theme backdrop-blur-md"
        style={{ background: 'rgba(var(--bg-secondary-rgb, 255,255,255), 0.85)' }}>
        <div className="max-w-6xl mx-auto px-5 py-3.5 flex items-center justify-between">
          <Logo size="sm" />
          <div className="flex items-center gap-4">
            <DarkModeToggle dark={dark} onToggle={onToggleDark} />
            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <Link to="/chat"
                  className="text-sm font-semibold text-white px-4 py-2 rounded-xl transition-all hover:shadow-glow-sm"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                  Go to Chat →
                </Link>
              </div>
            ) : (
              <>
                <Link to="/login"
                  className="hidden sm:block text-sm font-medium text-muted hover:text-theme transition-colors">
                  Log in
                </Link>
                <Link to="/signup"
                  className="text-sm font-semibold text-white px-4 py-2 rounded-xl transition-all hover:shadow-glow-sm"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-5 pt-20 pb-24 text-center">
        <Badge color="violet" className="mb-6 animate-fade-in">
          <Sparkles size={12} /> AI-Powered for Engineering Students
        </Badge>

        <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-theme leading-tight mb-6 animate-slide-up">
          Your Personal
          <span className="block"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Academic Co‑Pilot
          </span>
        </h1>

        <p className="text-lg text-muted max-w-xl mx-auto leading-relaxed mb-10 animate-slide-up"
          style={{ animationDelay: '100ms' }}>
          Clear doubts, prep for exams, and practice viva questions — all in one clean, distraction-free AI chat interface built for engineering students.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-slide-up"
          style={{ animationDelay: '200ms' }}>
          <Link
            to="/chat"
            className="flex items-center gap-2 px-7 py-3.5 rounded-2xl text-white font-semibold text-base
              transition-all duration-200 hover:shadow-glow-lg hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            <Sparkles size={18} />
            Start Chatting — It's Free
            <ArrowRight size={18} />
          </Link>
          <Link
            to="/login"
            className="flex items-center gap-2 px-7 py-3.5 rounded-2xl font-semibold text-sm border border-theme
              text-theme hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
          >
            I already have an account
          </Link>
        </div>

        {/* Social proof */}
        <div className="flex items-center justify-center gap-6 mt-12 text-sm text-muted animate-fade-in"
          style={{ animationDelay: '300ms' }}>
          {[
            { label: '10,000+ students', icon: Star },
            { label: 'Free forever plan', icon: CheckCircle2 },
            { label: 'No credit card', icon: Shield },
          ].map(({ label, icon: Icon }) => (
            <div key={label} className="flex items-center gap-1.5">
              <Icon size={14} className="text-brand-400" />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Chat Preview Mockup ───────────────────── */}
      <section className="max-w-3xl mx-auto px-5 pb-24">
        <div
          className="rounded-3xl border border-theme overflow-hidden shadow-2xl animate-fade-in"
          style={{ background: 'var(--bg-secondary)' }}
        >
          {/* Mock chat window header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-theme"
            style={{ background: 'var(--bg-card)' }}>
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="flex-1 text-center">
              <span className="text-xs font-medium text-muted">StudyBuddy AI — Exam Prep Mode</span>
            </div>
          </div>

          {/* Mock messages */}
          <div className="p-6 space-y-5">
            {/* User msg */}
            <div className="flex justify-end">
              <div className="max-w-xs px-4 py-2.5 rounded-2xl rounded-br-sm text-sm text-white"
                style={{ background: 'linear-gradient(135deg, #6366f1, #7c3aed)' }}>
                Explain Thevenin's theorem with an example
              </div>
            </div>
            {/* AI msg */}
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                <Sparkles size={13} color="white" />
              </div>
              <div className="max-w-sm px-4 py-3 rounded-2xl rounded-tl-sm text-sm"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                <p className="font-semibold mb-1">Thevenin's Theorem 📐</p>
                <p className="text-muted text-xs leading-relaxed">Any linear circuit with voltage/current sources can be replaced by a single voltage source <strong>V_th</strong> in series with resistance <strong>R_th</strong>...</p>
                <div className="mt-2 p-2 rounded-lg text-xs font-mono"
                  style={{ background: 'var(--bg-primary)', color: 'var(--brand)' }}>
                  V_th = V_oc | R_th = V_oc / I_sc
                </div>
              </div>
            </div>
          </div>

          {/* Mock input */}
          <div className="px-5 pb-5">
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-theme"
              style={{ background: 'var(--bg-card)' }}>
              <span className="flex-1 text-sm text-muted">Ask your next question…</span>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                <ArrowRight size={14} color="white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Grid ────────────────────────── */}
      <section className="max-w-6xl mx-auto px-5 pb-24">
        <div className="text-center mb-14">
          <Badge color="brand" className="mb-4">Features</Badge>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-theme mb-4">
            Everything you need to excel
          </h2>
          <p className="text-muted max-w-lg mx-auto">
            Designed specifically for engineering students in India — covering your exact needs, exam patterns, and viva formats.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl border border-theme hover:border-brand-300 dark:hover:border-brand-700
                transition-all duration-300 hover:shadow-glow-sm hover:-translate-y-0.5 group"
              style={{ background: 'var(--bg-card)' }}
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                style={{ background: `${f.color}18`, border: `1.5px solid ${f.color}33` }}>
                <f.icon size={20} style={{ color: f.color }} />
              </div>
              <h3 className="font-semibold text-theme mb-2">{f.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────── */}
      <section className="max-w-5xl mx-auto px-5 pb-24">
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-3xl text-theme mb-3">
            Loved by Engineering Students
          </h2>
          <p className="text-muted">Real students, real results.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="p-6 rounded-2xl border border-theme"
              style={{ background: 'var(--bg-card)' }}>
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={13} className="text-amber-400" fill="currentColor" />
                ))}
              </div>
              <p className="text-sm text-muted leading-relaxed mb-4">"{t.quote}"</p>
              <div>
                <p className="text-sm font-semibold text-theme">{t.name}</p>
                <p className="text-xs text-muted">{t.branch}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-5 pb-24 text-center">
        <div
          className="p-12 rounded-3xl border border-brand-200 dark:border-brand-800"
          style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.08))' }}
        >
          <h2 className="font-display font-bold text-3xl text-theme mb-4">
            Ready to study smarter?
          </h2>
          <p className="text-muted mb-8 max-w-md mx-auto">
            Join thousands of engineering students using StudyBuddy AI to clear doubts, ace exams, and nail viva sessions.
          </p>
          <Link
            to="/chat"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-white font-semibold text-base
              transition-all hover:shadow-glow-lg hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            <Sparkles size={18} /> Start for Free — No sign-up needed
            <ChevronRight size={18} />
          </Link>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────── */}
      <footer className="border-t border-theme py-8 text-center text-sm text-muted">
        <Logo size="sm" className="mx-auto mb-3 justify-center" />
        <p className="mt-2">© 2025 StudyBuddy AI · Built with ❤️ for engineering students</p>
        <div className="flex justify-center gap-6 mt-3">
          <Link to="/privacy" className="hover:text-theme transition-colors">Privacy</Link>
          <Link to="/terms" className="hover:text-theme transition-colors">Terms</Link>
          <Link to="/contact" className="hover:text-theme transition-colors">Contact</Link>
        </div>
      </footer>
    </div>
  )
}
