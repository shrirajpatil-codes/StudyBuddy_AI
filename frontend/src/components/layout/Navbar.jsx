// components/layout/Navbar.jsx
// Top nav bar — user avatar dropdown with Profile, Settings, Logout

import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Settings, LogOut, ChevronDown, LayoutDashboard } from 'lucide-react'
import Logo           from '../ui/Logo'
import DarkModeToggle from '../ui/DarkModeToggle'
import Badge          from '../ui/Badge'

export default function Navbar({ dark, onToggleDark, isLoggedIn, user, onLogout }) {
  const [dropOpen, setDropOpen] = useState(false)
  const dropRef  = useRef(null)
  const navigate = useNavigate()

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => {
    setDropOpen(false)
    onLogout?.()
    navigate('/')
  }

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : 'G'

  return (
    <nav
      className="flex items-center justify-between px-5 py-3 border-b border-theme"
      style={{ background: 'var(--bg-secondary)' }}
    >
      <Link to="/" className="hover:opacity-80 transition-opacity">
        <Logo size="sm" />
      </Link>

      <div className="flex items-center gap-2">
        <Badge color="violet">Beta</Badge>
        <DarkModeToggle dark={dark} onToggle={onToggleDark} />

        {isLoggedIn ? (
          <div className="relative" ref={dropRef}>
            <button
              onClick={() => setDropOpen(o => !o)}
              className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl
                hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
              >
                {initials}
              </div>
              <span className="hidden sm:block text-sm font-medium text-theme max-w-[120px] truncate">
                {user?.isGuest ? 'Guest' : (user?.name || 'Student')}
              </span>
              <ChevronDown size={14} className={`text-muted transition-transform duration-200 ${dropOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-52 rounded-2xl border border-theme shadow-xl z-50
                  overflow-hidden animate-slide-up"
                style={{ background: 'var(--bg-card)' }}
              >
                <div className="px-4 py-3 border-b border-theme">
                  <p className="text-sm font-semibold text-theme truncate">
                    {user?.isGuest ? 'Guest User' : (user?.name || 'Student')}
                  </p>
                  <p className="text-xs text-muted truncate">
                    {user?.isGuest ? 'Not signed in' : (user?.email || '')}
                  </p>
                </div>

                <div className="py-1.5">
                  <DropItem to="/chat"     icon={LayoutDashboard} label="Chat Dashboard" onClick={() => setDropOpen(false)} />
                  <DropItem to="/profile"  icon={User}            label="My Profile"     onClick={() => setDropOpen(false)} />
                  <DropItem to="/settings" icon={Settings}        label="Settings"       onClick={() => setDropOpen(false)} />
                </div>

                <div className="border-t border-theme py-1.5">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500
                      hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
                  >
                    <LogOut size={15} />
                    <span>Log out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login"
              className="text-sm font-medium text-muted hover:text-theme transition-colors px-3 py-1.5 rounded-lg">
              Log in
            </Link>
            <Link to="/signup"
              className="text-sm font-medium text-white px-4 py-1.5 rounded-xl transition-all hover:shadow-glow-sm"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              Sign up
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}

function DropItem({ to, icon: Icon, label, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-2.5 text-sm text-theme
        hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
    >
      <Icon size={15} className="text-muted" />
      {label}
    </Link>
  )
}
