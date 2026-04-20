// pages/SignupPage.jsx

import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react'
import Logo           from '../components/ui/Logo'
import Button         from '../components/ui/Button'
import Input          from '../components/ui/Input'
import DarkModeToggle from '../components/ui/DarkModeToggle'

const BRANCHES = [
  'Computer Engineering', 'Information Technology', 'Electronics & TC',
  'Mechanical Engineering', 'Civil Engineering', 'Electrical Engineering',
  'AIDS / AIML', 'Other',
]

export default function SignupPage({ dark, onToggleDark, onLogin, onContinueGuest }) {
  const [form, setForm]     = useState({ name: '', email: '', password: '', branch: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const navigate = useNavigate()

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.name || !form.email || !form.password) { setError('Please fill in all required fields.'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setLoading(false)
    onLogin?.(form.email, form.name)
    navigate('/chat')
  }

  return (
    <div className="min-h-screen mesh-bg flex flex-col">
      <nav className="flex items-center justify-between px-6 py-4">
        <Link to="/"><Logo size="sm" /></Link>
        <DarkModeToggle dark={dark} onToggle={onToggleDark} />
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md animate-slide-up">
          <div className="rounded-3xl border border-theme p-8 shadow-xl" style={{ background: 'var(--bg-card)' }}>
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 4px 20px rgba(99,102,241,0.35)' }}>
                <Sparkles size={24} color="white" />
              </div>
              <h1 className="font-display font-bold text-2xl text-theme">Create account</h1>
              <p className="text-muted text-sm mt-1">Join thousands of engineering students</p>
            </div>

            {error && (
              <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Full Name *" type="text" placeholder="Arjun Patil"
                value={form.name} onChange={set('name')} icon={<User size={16} />} />
              <Input label="Email address *" type="email" placeholder="you@college.edu"
                value={form.email} onChange={set('email')} icon={<Mail size={16} />} autoComplete="email" />
              <div className="relative">
                <Input label="Password *" type={showPass ? 'text' : 'password'} placeholder="Min. 6 characters"
                  value={form.password} onChange={set('password')} icon={<Lock size={16} />} autoComplete="new-password" />
                <button type="button" onClick={() => setShowPass(s => !s)}
                  className="absolute right-3 top-[38px] text-muted hover:text-theme cursor-pointer">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-theme mb-1.5">Branch (optional)</label>
                <select value={form.branch} onChange={set('branch')}
                  className="w-full rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400/20"
                  style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                  <option value="">Select your branch</option>
                  {BRANCHES.map(b => <option key={b}>{b}</option>)}
                </select>
              </div>

              <Button type="submit" variant="primary" size="lg" className="w-full mt-2" disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating account…
                  </span>
                ) : (
                  <>Create Account <ArrowRight size={16} /></>
                )}
              </Button>
            </form>

            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px border-t border-theme" />
              <span className="text-xs text-muted">or</span>
              <div className="flex-1 h-px border-t border-theme" />
            </div>

            <Button variant="outline" size="lg" className="w-full"
              onClick={() => { onContinueGuest?.(); navigate('/chat') }}>
              <Sparkles size={16} className="text-brand-500" />
              Continue without account
            </Button>
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
