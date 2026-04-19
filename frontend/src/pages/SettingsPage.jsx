// pages/SettingsPage.jsx

import React, { useState } from 'react'
import { Moon, Bell, Trash2, Info } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import DarkModeToggle from '../components/ui/DarkModeToggle'
import Button from '../components/ui/Button'
import { MODES } from '../components/ui/ModeSelector'

export default function SettingsPage({ dark, onToggleDark }) {
  const [notifications, setNotifications] = useState(true)
  const [defaultMode, setDefaultMode]     = useState('doubt')
  const [fontSize, setFontSize]           = useState('medium')

  const clearHistory = () => {
    if (confirm('Delete all chat history? This cannot be undone.')) {
      localStorage.removeItem('sb-sessions')
      alert('Chat history cleared.')
    }
  }

  const SettingRow = ({ icon: Icon, title, desc, children }) => (
    <div className="flex items-center justify-between gap-4 py-4 border-b border-theme last:border-0">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl mt-0.5" style={{ background: 'var(--brand-light)' }}>
          <Icon size={15} className="text-brand-500" />
        </div>
        <div>
          <p className="text-sm font-medium text-theme">{title}</p>
          {desc && <p className="text-xs text-muted mt-0.5">{desc}</p>}
        </div>
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  )

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <Navbar dark={dark} onToggleDark={onToggleDark} />

      <div className="max-w-xl mx-auto px-5 py-12 animate-fade-in">
        <h1 className="font-display font-bold text-2xl text-theme mb-8">Settings</h1>

        {/* Appearance */}
        <div className="rounded-3xl border border-theme p-6 mb-5" style={{ background: 'var(--bg-card)' }}>
          <h2 className="font-semibold text-theme mb-1 text-sm uppercase tracking-wider text-muted">Appearance</h2>

          <SettingRow icon={Moon} title="Dark Mode" desc="Easy on the eyes during late-night study sessions">
            <DarkModeToggle dark={dark} onToggle={() => onToggleDark(d => !d)} />
          </SettingRow>

          <SettingRow icon={Info} title="Font Size" desc="Adjust text size for comfort">
            <select
              value={fontSize}
              onChange={e => setFontSize(e.target.value)}
              className="text-sm rounded-xl border px-3 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-400/20"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </SettingRow>
        </div>

        {/* Chat */}
        <div className="rounded-3xl border border-theme p-6 mb-5" style={{ background: 'var(--bg-card)' }}>
          <h2 className="font-semibold text-sm uppercase tracking-wider text-muted mb-1">Chat Preferences</h2>

          <SettingRow icon={Info} title="Default Mode" desc="Mode to start new chats in">
            <select
              value={defaultMode}
              onChange={e => setDefaultMode(e.target.value)}
              className="text-sm rounded-xl border px-3 py-2 cursor-pointer focus:outline-none"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
            >
              {MODES.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
            </select>
          </SettingRow>

          <SettingRow icon={Bell} title="Response Notifications" desc="Notify when AI finishes long responses">
            <button
              onClick={() => setNotifications(n => !n)}
              className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${notifications ? 'bg-brand-500' : 'bg-gray-300 dark:bg-gray-600'}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${notifications ? 'left-[26px]' : 'left-0.5'}`} />
            </button>
          </SettingRow>
        </div>

        {/* Danger zone */}
        <div className="rounded-3xl border border-red-200 dark:border-red-800/40 p-6"
          style={{ background: 'var(--bg-card)' }}>
          <h2 className="font-semibold text-sm uppercase tracking-wider text-red-500 mb-4">Danger Zone</h2>
          <SettingRow icon={Trash2} title="Clear Chat History" desc="Permanently delete all your conversations">
            <Button variant="danger" size="sm" onClick={clearHistory}>
              <Trash2 size={13} /> Clear All
            </Button>
          </SettingRow>
        </div>

        <p className="text-center text-xs text-muted mt-8">
          StudyBuddy AI v1.0.0 · Built for engineering students
        </p>
      </div>
    </div>
  )
}
