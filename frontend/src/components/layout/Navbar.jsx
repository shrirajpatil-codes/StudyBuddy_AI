// components/layout/Navbar.jsx — Top navigation bar

import React from 'react'
import { Link } from 'react-router-dom'
import { User, Settings, LogOut } from 'lucide-react'
import Logo from '../ui/Logo'
import DarkModeToggle from '../ui/DarkModeToggle'
import Badge from '../ui/Badge'

export default function Navbar({ dark, onToggleDark, isLoggedIn = true, onLogout }) {
  return (
    <nav
      className="flex items-center justify-between px-5 py-3 border-b border-theme"
      style={{ background: 'var(--bg-secondary)' }}
    >
      {/* Left: Logo */}
      <Link to="/" className="hover:opacity-80 transition-opacity">
        <Logo size="sm" />
      </Link>

      {/* Right: actions */}
      <div className="flex items-center gap-3">
        <Badge color="violet">Beta</Badge>

        <DarkModeToggle dark={dark} onToggle={() => onToggleDark(d => !d)} />

        {isLoggedIn ? (
          <div className="flex items-center gap-1">
            <Link
              to="/settings"
              className="p-2 rounded-xl text-muted hover:text-theme hover:bg-gray-100 dark:hover:bg-white/10
                transition-colors"
              title="Settings"
            >
              <Settings size={17} />
            </Link>
            <Link
              to="/profile"
              className="p-2 rounded-xl text-muted hover:text-theme hover:bg-gray-100 dark:hover:bg-white/10
                transition-colors"
              title="Profile"
            >
              <User size={17} />
            </Link>
            {onLogout && (
              <button
                onClick={onLogout}
                className="p-2 rounded-xl text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20
                  transition-colors cursor-pointer"
                title="Logout"
              >
                <LogOut size={17} />
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login"
              className="text-sm font-medium text-muted hover:text-theme transition-colors px-3 py-1.5 rounded-lg">
              Log in
            </Link>
            <Link to="/signup"
              className="text-sm font-medium text-white px-4 py-1.5 rounded-xl transition-all
                hover:shadow-glow-sm"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              Sign up
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
