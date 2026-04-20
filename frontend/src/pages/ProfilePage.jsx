// pages/ProfilePage.jsx — User profile with real auth state

import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, BookOpen, Edit3, Save, X, GraduationCap, LogOut, Settings, MessageSquare } from 'lucide-react'
import Navbar  from '../components/layout/Navbar'
import Button  from '../components/ui/Button'
import Input   from '../components/ui/Input'
import Badge   from '../components/ui/Badge'

const BRANCHES = [
  'Computer Engineering', 'Information Technology', 'Electronics & TC',
  'Mechanical Engineering', 'Civil Engineering', 'Electrical Engineering',
  'AIDS / AIML', 'Other',
]

export default function ProfilePage({
  dark, onToggleDark,
  isLoggedIn, user, onLogout, onUpdateProfile,
}) {
  const navigate  = useNavigate()
  const [editing, setEditing] = useState(false)

  // Seed the form from the real user object (fall back to placeholders)
  const [draft, setDraft] = useState({
    name:    user?.name    || 'Engineering Student',
    email:   user?.email   || 'student@college.edu',
    branch:  user?.branch  || 'Computer Engineering',
    year:    user?.year    || '3rd Year',
    college: user?.college || '',
  })

  const handleSave = () => {
    onUpdateProfile?.(draft)
    setEditing(false)
  }

  // Derive stats from localStorage sessions
  const sessions = (() => {
    try { return JSON.parse(localStorage.getItem('sb-sessions') || '[]') } catch { return [] }
  })()
  const totalMessages = sessions.reduce((acc, s) => acc + s.messages.filter(m => m.role === 'user').length, 0)

  const initials = (user?.name || 'S').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  const handleLogout = () => {
    onLogout?.()
    navigate('/')
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <Navbar dark={dark} onToggleDark={onToggleDark} isLoggedIn={isLoggedIn} user={user} onLogout={onLogout} />

      <div className="max-w-2xl mx-auto px-4 py-10 animate-fade-in">

        {/* ── Profile header card ─────────────── */}
        <div className="rounded-3xl border border-theme p-8 mb-4" style={{ background: 'var(--bg-card)' }}>
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 4px 16px rgba(99,102,241,0.35)' }}
              >
                {initials}
              </div>
              <div>
                <h1 className="font-display font-bold text-xl text-theme">
                  {user?.name || 'Engineering Student'}
                </h1>
                <p className="text-sm text-muted">{user?.email || 'Not signed in'}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {draft.branch && <Badge color="brand">{draft.branch}</Badge>}
                  {draft.year   && <Badge color="violet">{draft.year}</Badge>}
                  {user?.isGuest && <Badge color="default">Guest</Badge>}
                </div>
              </div>
            </div>

            {!user?.isGuest && (
              <Button
                variant={editing ? 'ghost' : 'secondary'}
                size="sm"
                onClick={() => editing ? (setDraft({ name: user?.name||'',...draft }), setEditing(false)) : setEditing(true)}
              >
                {editing ? <><X size={14}/> Cancel</> : <><Edit3 size={14}/> Edit</>}
              </Button>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-theme">
            {[
              { label: 'Chats started',  value: sessions.length },
              { label: 'Questions asked', value: totalMessages },
              { label: 'Days streak',     value: '🔥 1' },
            ].map(s => (
              <div key={s.label} className="text-center p-3 rounded-2xl" style={{ background: 'var(--bg-primary)' }}>
                <p className="font-display font-bold text-2xl text-theme">{s.value}</p>
                <p className="text-xs text-muted mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Edit form ───────────────────────── */}
        {editing && (
          <div className="rounded-3xl border border-theme p-8 mb-4 animate-slide-up" style={{ background: 'var(--bg-card)' }}>
            <h2 className="font-semibold text-theme mb-5 text-lg">Edit Profile</h2>
            <div className="space-y-4">
              <Input label="Full Name" value={draft.name}
                onChange={e => setDraft(d => ({ ...d, name: e.target.value }))}
                icon={<User size={16} />} />
              <Input label="Email" type="email" value={draft.email}
                onChange={e => setDraft(d => ({ ...d, email: e.target.value }))}
                icon={<Mail size={16} />} />
              <Input label="College / University" value={draft.college}
                onChange={e => setDraft(d => ({ ...d, college: e.target.value }))}
                icon={<GraduationCap size={16} />}
                placeholder="e.g. Shivaji University, Kolhapur" />
              <div>
                <label className="block text-sm font-medium text-theme mb-1.5">Branch</label>
                <select value={draft.branch}
                  onChange={e => setDraft(d => ({ ...d, branch: e.target.value }))}
                  className="w-full rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400/20"
                  style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                  {BRANCHES.map(b => <option key={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-theme mb-1.5">Year of Study</label>
                <select value={draft.year}
                  onChange={e => setDraft(d => ({ ...d, year: e.target.value }))}
                  className="w-full rounded-xl border px-4 py-3 text-sm focus:outline-none"
                  style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                  {['1st Year','2nd Year','3rd Year','4th Year'].map(y => <option key={y}>{y}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button variant="primary" onClick={handleSave} className="flex-1">
                <Save size={15}/> Save Changes
              </Button>
              <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
            </div>
          </div>
        )}

        {/* ── Quick actions ───────────────────── */}
        <div className="rounded-3xl border border-theme overflow-hidden" style={{ background: 'var(--bg-card)' }}>
          <QuickLink to="/chat"     icon={MessageSquare} label="Go to Chat"  desc="Continue studying" />
          <QuickLink to="/settings" icon={Settings}      label="Settings"    desc="Themes, fonts, preferences" />

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-6 py-4 border-t border-theme
              hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors cursor-pointer group"
          >
            <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-900/20">
              <LogOut size={16} className="text-red-500" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-red-500">Log out</p>
              <p className="text-xs text-muted">You'll be returned to the home page</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

function QuickLink({ to, icon: Icon, label, desc }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-4 px-6 py-4 border-b border-theme last:border-0
        hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
    >
      <div className="p-2.5 rounded-xl" style={{ background: 'var(--brand-light, #e0e7ff)' }}>
        <Icon size={16} className="text-brand-500" />
      </div>
      <div>
        <p className="text-sm font-semibold text-theme">{label}</p>
        {desc && <p className="text-xs text-muted">{desc}</p>}
      </div>
      <span className="ml-auto text-muted text-sm">→</span>
    </Link>
  )
}
