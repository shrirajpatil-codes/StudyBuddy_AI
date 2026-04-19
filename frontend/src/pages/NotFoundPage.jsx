// pages/NotFoundPage.jsx

import React from 'react'
import { Link } from 'react-router-dom'
import { Home, MessageSquare } from 'lucide-react'
import Logo from '../components/ui/Logo'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen mesh-bg flex flex-col items-center justify-center px-5 text-center">
      <Logo size="md" className="mb-8" />
      <p className="text-8xl font-display font-bold mb-4"
        style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        404
      </p>
      <h1 className="text-2xl font-bold text-theme mb-2">Page not found</h1>
      <p className="text-muted mb-8 max-w-xs">
        Looks like this page took an unplanned leave. Let's get you back on track.
      </p>
      <div className="flex gap-3">
        <Link to="/"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-theme text-theme text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
          <Home size={15}/> Home
        </Link>
        <Link to="/chat"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm transition-all hover:shadow-glow-sm"
          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
          <MessageSquare size={15}/> Open Chat
        </Link>
      </div>
    </div>
  )
}
