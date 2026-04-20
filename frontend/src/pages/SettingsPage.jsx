// pages/SettingsPage.jsx — Full settings with color themes, font size, and more

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Moon, Bell, Trash2, Palette, Type, MessageSquare,
  Volume2, Layout, Clock, RotateCcw, LogOut, ChevronRight,
} from 'lucide-react'
import Navbar    from '../components/layout/Navbar'
import Button    from '../components/ui/Button'
import Badge     from '../components/ui/Badge'
import { COLOR_THEMES } from '../hooks/useSettings'
import { MODES } from '../components/ui/ModeSelector'

/* ── Toggle switch component ─────────────────────── */
function Toggle({ on, onChange }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className={`relative w-12 h-6 rounded-full transition-colors duration-300 cursor-pointer flex-shrink-0
        ${on ? 'bg-brand-500' : 'bg-gray-300 dark:bg-gray-600'}`}
    >
      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-300
        ${on ? 'left-[26px]' : 'left-0.5'}`} />
    </button>
  )
}

/* ── Section card wrapper ────────────────────────── */
function Section({ title, icon: Icon, iconColor = 'text-brand-500', children }) {
  return (
    <div className="rounded-3xl border border-theme overflow-hidden mb-4"
      style={{ background: 'var(--bg-card)' }}>
      <div className="flex items-center gap-2.5 px-6 py-4 border-b border-theme"
        style={{ background: 'var(--bg-primary)' }}>
        <Icon size={16} className={iconColor} />
        <h2 className="text-sm font-semibold text-theme uppercase tracking-wider">{title}</h2>
      </div>
      <div className="divide-y divide-theme">{children}</div>
    </div>
  )
}

/* ── Single setting row ──────────────────────────── */
function Row({ title, desc, children }) {
  return (
    <div className="flex items-center justify-between gap-4 px-6 py-4">
      <div className="min-w-0">
        <p className="text-sm font-medium text-theme">{title}</p>
        {desc && <p className="text-xs text-muted mt-0.5 leading-relaxed">{desc}</p>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  )
}

export default function SettingsPage({
  dark, onToggleDark,
  settings, onUpdateSettings, onSetTheme, onSetFontSize, onResetSettings,
  isLoggedIn, user, onLogout,
}) {
  const navigate = useNavigate()
  const [saved, setSaved] = useState(false)

  const handleReset = () => {
    if (confirm('Reset all settings to defaults?')) {
      onResetSettings?.()
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  const handleClearHistory = () => {
    if (confirm('Delete ALL chat history? This cannot be undone.')) {
      localStorage.removeItem('sb-sessions')
      alert('Chat history cleared.')
    }
  }

  const handleLogout = () => {
    if (confirm('Are you sure you want to log out?')) {
      onLogout?.()
      navigate('/')
    }
  }

  const s = settings || {}

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <Navbar dark={dark} onToggleDark={onToggleDark} isLoggedIn={isLoggedIn} user={user} onLogout={onLogout} />

      <div className="max-w-xl mx-auto px-4 py-10 animate-fade-in">
        {/* Page header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display font-bold text-2xl text-theme">Settings</h1>
            <p className="text-sm text-muted mt-1">Customise your StudyBuddy AI experience</p>
          </div>
          {saved && <Badge color="green">✓ Saved</Badge>}
        </div>

        {/* ── 1. Appearance ──────────────────────── */}
        <Section title="Appearance" icon={Palette}>

          {/* Dark Mode */}
          <Row title="Dark Mode" desc="Easy on the eyes during late-night study sessions">
            <Toggle on={!!dark} onChange={onToggleDark} />
          </Row>

          {/* Color Theme */}
          <div className="px-6 py-4">
            <p className="text-sm font-medium text-theme mb-1">Color Theme</p>
            <p className="text-xs text-muted mb-3">Choose the accent colour used across the interface</p>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {COLOR_THEMES.map(theme => {
                const active = (s.colorTheme || 'indigo') === theme.id
                return (
                  <button
                    key={theme.id}
                    onClick={() => onSetTheme?.(theme.id)}
                    title={theme.label}
                    className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border-2 transition-all cursor-pointer
                      ${active ? 'border-brand-400 scale-105' : 'border-transparent hover:border-gray-200 dark:hover:border-white/20'}`}
                    style={{ background: active ? `${theme.primary}12` : 'transparent' }}
                  >
                    {/* Colour dot */}
                    <div
                      className="w-7 h-7 rounded-full shadow-sm"
                      style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}
                    />
                    <span className="text-xs text-muted font-medium leading-none">{theme.label}</span>
                    {active && (
                      <span className="text-[10px] font-bold" style={{ color: theme.primary }}>✓</span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Font Size */}
          <Row title="Font Size" desc="Adjust text size for comfortable reading">
            <div className="flex gap-1.5 p-1 rounded-xl" style={{ background: 'var(--bg-primary)' }}>
              {['small', 'medium', 'large'].map(size => (
                <button
                  key={size}
                  onClick={() => onSetFontSize?.(size)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer
                    ${(s.fontSize || 'medium') === size
                      ? 'bg-brand-500 text-white shadow-sm'
                      : 'text-muted hover:text-theme'
                    }`}
                >
                  {size === 'small' ? 'A' : size === 'medium' ? 'A' : 'A'}
                  <span className="ml-1 hidden sm:inline">{size.charAt(0).toUpperCase() + size.slice(1)}</span>
                </button>
              ))}
            </div>
          </Row>

          {/* Compact Mode */}
          <Row title="Compact Mode" desc="Reduces padding for more content on screen">
            <Toggle
              on={!!s.compactMode}
              onChange={(v) => onUpdateSettings?.({ compactMode: v })}
            />
          </Row>
        </Section>

        {/* ── 2. Chat Preferences ────────────────── */}
        <Section title="Chat Preferences" icon={MessageSquare}>

          <Row title="Default Chat Mode" desc="Which mode to start new chats in">
            <select
              value={s.defaultMode || 'doubt'}
              onChange={e => onUpdateSettings?.({ defaultMode: e.target.value })}
              className="text-sm rounded-xl border px-3 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-400/20"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
            >
              {MODES.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
            </select>
          </Row>

          <Row title="Enter to Send" desc="Press Enter to send. Use Shift+Enter for new line.">
            <Toggle
              on={s.enterToSend !== false}
              onChange={(v) => onUpdateSettings?.({ enterToSend: v })}
            />
          </Row>

          <Row title="Show Message Timestamps" desc="Display time below each chat bubble">
            <Toggle
              on={s.showTimestamps !== false}
              onChange={(v) => onUpdateSettings?.({ showTimestamps: v })}
            />
          </Row>
        </Section>

        {/* ── 3. Notifications ───────────────────── */}
        <Section title="Notifications & Sound" icon={Bell}>
          <Row title="Response Notifications" desc="Get a notification when AI finishes a long response">
            <Toggle
              on={!!s.notifications}
              onChange={(v) => onUpdateSettings?.({ notifications: v })}
            />
          </Row>

          <Row title="Sound Effects" desc="Play a subtle sound when AI responds">
            <Toggle
              on={!!s.soundEffects}
              onChange={(v) => onUpdateSettings?.({ soundEffects: v })}
            />
          </Row>
        </Section>

        {/* ── 4. Account ─────────────────────────── */}
        {isLoggedIn && (
          <Section title="Account" icon={Layout} iconColor="text-brand-500">
            <Row title="Signed in as" desc={user?.isGuest ? 'Guest — no account' : (user?.email || 'unknown')}>
              <Badge color={user?.isGuest ? 'default' : 'brand'}>
                {user?.isGuest ? 'Guest' : 'Member'}
              </Badge>
            </Row>

            <div className="px-6 py-4">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl
                  bg-red-50 dark:bg-red-900/15 border border-red-200 dark:border-red-800/40
                  hover:bg-red-100 dark:hover:bg-red-900/25 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <LogOut size={16} className="text-red-500" />
                  <div className="text-left">
                    <p className="text-sm font-semibold text-red-500">Log out</p>
                    <p className="text-xs text-muted">You'll be returned to the home page</p>
                  </div>
                </div>
                <ChevronRight size={14} className="text-red-400 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </Section>
        )}

        {/* ── 5. Danger Zone ─────────────────────── */}
        <div className="rounded-3xl border border-red-200 dark:border-red-800/40 overflow-hidden mb-6"
          style={{ background: 'var(--bg-card)' }}>
          <div className="flex items-center gap-2.5 px-6 py-4 border-b border-red-200 dark:border-red-800/40"
            style={{ background: 'rgba(239,68,68,0.05)' }}>
            <Trash2 size={16} className="text-red-500" />
            <h2 className="text-sm font-semibold text-red-500 uppercase tracking-wider">Danger Zone</h2>
          </div>

          <div className="divide-y divide-theme">
            <Row title="Clear Chat History" desc="Permanently deletes all your saved conversations">
              <Button variant="danger" size="sm" onClick={handleClearHistory}>
                <Trash2 size={13} /> Clear All
              </Button>
            </Row>

            <Row title="Reset All Settings" desc="Restore all settings to their factory defaults">
              <Button variant="outline" size="sm" onClick={handleReset}>
                <RotateCcw size={13} /> Reset
              </Button>
            </Row>
          </div>
        </div>

        <p className="text-center text-xs text-muted pb-8">
          StudyBuddy AI v1.0 · Built for engineering students 🎓
        </p>
      </div>
    </div>
  )
}
