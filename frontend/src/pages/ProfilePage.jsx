// pages/ProfilePage.jsx

import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { User, Mail, BookOpen, Edit3, Save, X, GraduationCap } from 'lucide-react'
import Navbar  from '../components/layout/Navbar'
import Button  from '../components/ui/Button'
import Input   from '../components/ui/Input'
import Badge   from '../components/ui/Badge'

const BRANCHES = [
  'Computer Engineering', 'Information Technology', 'Electronics & TC',
  'Mechanical Engineering', 'Civil Engineering', 'Electrical Engineering',
  'AIDS / AIML', 'Other',
]

export default function ProfilePage({ dark, onToggleDark }) {
  const [editing, setEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: 'Engineering Student',
    email: 'student@college.edu',
    branch: 'Computer Engineering',
    year: '3rd Year',
    college: 'Shivaji University, Kolhapur',
  })
  const [draft, setDraft] = useState(profile)

  const handleSave = () => { setProfile(draft); setEditing(false) }
  const handleCancel = () => { setDraft(profile); setEditing(false) }

  const stats = [
    { label: 'Chats',      value: '48', icon: BookOpen },
    { label: 'Doubts cleared', value: '120', icon: User },
    { label: 'Exams prepped', value: '12', icon: GraduationCap },
  ]

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <Navbar dark={dark} onToggleDark={onToggleDark} />

      <div className="max-w-2xl mx-auto px-5 py-12 animate-fade-in">
        {/* Header card */}
        <div className="rounded-3xl border border-theme p-8 mb-5" style={{ background: 'var(--bg-card)' }}>
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                {profile.name[0]}
              </div>
              <div>
                <h1 className="font-display font-bold text-xl text-theme">{profile.name}</h1>
                <p className="text-sm text-muted">{profile.email}</p>
                <div className="flex gap-2 mt-1.5">
                  <Badge color="brand">{profile.branch}</Badge>
                  <Badge color="violet">{profile.year}</Badge>
                </div>
              </div>
            </div>
            <Button
              variant={editing ? 'ghost' : 'secondary'}
              size="sm"
              onClick={() => editing ? handleCancel() : setEditing(true)}
            >
              {editing ? <><X size={14}/> Cancel</> : <><Edit3 size={14}/> Edit</>}
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-theme">
            {stats.map(s => (
              <div key={s.label} className="text-center">
                <p className="font-display font-bold text-2xl text-theme">{s.value}</p>
                <p className="text-xs text-muted">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Edit form */}
        {editing && (
          <div className="rounded-3xl border border-theme p-8 mb-5 animate-slide-up" style={{ background: 'var(--bg-card)' }}>
            <h2 className="font-semibold text-theme mb-5">Edit Profile</h2>
            <div className="space-y-4">
              <Input label="Full Name" value={draft.name}
                onChange={e => setDraft(d => ({ ...d, name: e.target.value }))}
                icon={<User size={16} />} />
              <Input label="Email" type="email" value={draft.email}
                onChange={e => setDraft(d => ({ ...d, email: e.target.value }))}
                icon={<Mail size={16} />} />
              <Input label="College" value={draft.college}
                onChange={e => setDraft(d => ({ ...d, college: e.target.value }))}
                icon={<GraduationCap size={16} />} />
              <div>
                <label className="block text-sm font-medium text-theme mb-1.5">Branch</label>
                <select value={draft.branch} onChange={e => setDraft(d => ({ ...d, branch: e.target.value }))}
                  className="w-full rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400/20"
                  style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                  {BRANCHES.map(b => <option key={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-theme mb-1.5">Year</label>
                <select value={draft.year} onChange={e => setDraft(d => ({ ...d, year: e.target.value }))}
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
              <Button variant="outline" onClick={handleCancel}>Cancel</Button>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="rounded-3xl border border-theme p-6" style={{ background: 'var(--bg-card)' }}>
          <h2 className="font-semibold text-theme mb-4">Account</h2>
          <div className="space-y-2">
            <Link to="/settings"
              className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
              <span className="text-sm text-theme">Settings</span>
              <span className="text-xs text-muted">→</span>
            </Link>
            <button
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors cursor-pointer"
              onClick={() => alert('Logged out!')}>
              <span className="text-sm text-red-500">Log out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
