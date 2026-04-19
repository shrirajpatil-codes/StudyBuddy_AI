// pages/LoginPage.jsx

import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react'
import Logo   from '../components/ui/Logo'
import Button from '../components/ui/Button'
import Input  from '../components/ui/Input'
import DarkModeToggle from '../components/ui/DarkModeToggle'

export default function LoginPage({ dark, onToggleDark, onLogin }) {
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Please fill in all fields.'); return }
    setLoading(true)
    // Simulate API call
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
    onLogin?.()
    navigate('/chat')
  }

  return (
    <div className="min-h-screen mesh-bg flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4">
        <Link to="/"><Logo size="sm" /></Link>
        <DarkModeToggle dark={dark} onToggle={() => onToggleDark(d => !d)} />
      </nav>

      {/* Form container */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md animate-slide-up">
          {/* Card */}
          <div
            className="rounded-3xl border border-theme p-8 shadow-xl"
            style={{ background: 'var(--bg-card)' }}
          >
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 4px 20px rgba(99,102,241,0.35)' }}>
                <Sparkles size={24} color="white" />
              </div>
              <h1 className="font-display font-bold text-2xl text-theme">Welcome back</h1>
              <p className="text-muted text-sm mt-1">Log in to continue studying</p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email address"
                type="email"
                placeholder="you@college.edu"
                value={email}
                onChange={e => setEmail(e.target.value)}
                icon={<Mail size={16} />}
                autoComplete="email"
              />
              <div className="relative">
                <Input
                  label="Password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  icon={<Lock size={16} />}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  className="absolute right-3 top-[38px] text-muted hover:text-theme transition-colors cursor-pointer"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <div className="flex justify-end">
                <Link to="/forgot-password" className="text-xs text-brand-500 hover:underline">
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full mt-2"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Logging in…
                  </span>
                ) : (
                  <>Log In <ArrowRight size={16} /></>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px border-t border-theme" />
              <span className="text-xs text-muted">or</span>
              <div className="flex-1 h-px border-t border-theme" />
            </div>

            {/* Social / Guest login */}
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => { onLogin?.(); navigate('/chat') }}
            >
              <Sparkles size={16} className="text-brand-500" />
              Continue without account
            </Button>
          </div>

          {/* Sign up link */}
          <p className="text-center text-sm text-muted mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-brand-500 font-medium hover:underline">
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
