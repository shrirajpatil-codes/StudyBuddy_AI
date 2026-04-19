// pages/SignupPage.jsx

import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, Eye, EyeOff, Sparkles, ArrowRight, GraduationCap } from 'lucide-react'
import Logo   from '../components/ui/Logo'
import Button from '../components/ui/Button'
import Input  from '../components/ui/Input'
import DarkModeToggle from '../components/ui/DarkModeToggle'

const BRANCHES = [
  'Computer Engineering', 'Information Technology', 'Electronics & TC',
  'Mechanical Engineering', 'Civil Engineering', 'Electrical Engineering',
  'AIDS / AIML', 'Other',
]

export default function SignupPage({ dark, onToggleDark, onLogin }) {
  const [form, setForm]     = useState({ name: '', email: '', password: '', branch: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const navigate = useNavigate()

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.name || !form.email || !form.password)
      return setError('Please fill in all required fields.')
    if (form.password.length < 6)
      return setError('Password must be at least 6 characters.')
    setLoading(true)
    await new Promise(r => setTimeout(r, 1400))
    setLoading(false)
    onLogin?.()
    navigate('/chat')
  }

  return (
    <div className="min-h-screen mesh-bg flex flex-col">
      <nav className="flex items-center justify-between px-6 py-4">
        <Link to="/"><Logo size="sm" /></Link>
        <DarkModeToggle dark={dark} onToggle={() => onToggleDark(d => !d)} />
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md animate-slide-up">
          <div className="rounded-3xl border border-theme p-8 shadow-xl" style={{ background: 'var(--bg-card)' }}>

            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 4px 20px rgba(99,102,241,0.35)' }}>
                <GraduationCap size={24} color="white" />
              </div>
              <h1 className="font-display font-bold text-2xl text-theme">Create your account</h1>
              <p className="text-muted text-sm mt-1">Free forever · No credit card required</p>
            </div>

            {error && (
              <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Full Name"
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={e => update('name', e.target.value)}
                icon={<User size={16} />}
              />
              <Input
                label="College Email"
                type="email"
                placeholder="you@college.edu"
                value={form.email}
                onChange={e => update('email', e.target.value)}
                icon={<Mail size={16} />}
              />
              <div className="relative">
                <Input
                  label="Password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Min 6 characters"
                  value={form.password}
                  onChange={e => update('password', e.target.value)}
                  icon={<Lock size={16} />}
                />
                <button type="button" onClick={() => setShowPass(s => !s)}
                  className="absolute right-3 top-[38px] text-muted hover:text-theme transition-colors cursor-pointer">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Branch selector */}
              <div>
                <label className="block text-sm font-medium text-theme mb-1.5">
                  Engineering Branch <span className="text-muted text-xs">(optional)</span>
                </label>
                <select
                  value={form.branch}
                  onChange={e => update('branch', e.target.value)}
                  className="w-full rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400/20
                    transition-all cursor-pointer"
                  style={{
                    background: 'var(--bg-card)',
                    borderColor: 'var(--border)',
                    color: form.branch ? 'var(--text-primary)' : 'var(--text-muted)',
                  }}
                >
                  <option value="">Select your branch</option>
                  {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              <Button type="submit" variant="primary" size="lg" className="w-full mt-2" disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating account…
                  </span>
                ) : (
                  <><Sparkles size={16} /> Create Account <ArrowRight size={16} /></>
                )}
              </Button>
            </form>

            <p className="text-center text-xs text-muted mt-4">
              By signing up you agree to our{' '}
              <Link to="/terms" className="text-brand-500 hover:underline">Terms</Link> and{' '}
              <Link to="/privacy" className="text-brand-500 hover:underline">Privacy Policy</Link>.
            </p>
          </div>

          <p className="text-center text-sm text-muted mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-500 font-medium hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
