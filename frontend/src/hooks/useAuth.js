// hooks/useAuth.js
// Manages login state and user profile — persisted in localStorage

import { useState } from 'react'

const GUEST = { name: 'Guest', email: '', branch: '', year: '', isGuest: true }

function loadUser() {
  try {
    const u = localStorage.getItem('sb-user')
    return u ? JSON.parse(u) : null
  } catch { return null }
}

export default function useAuth() {
  const [user, setUser] = useState(loadUser)

  const isLoggedIn = !!user

  const login = (email, name = '') => {
    const u = {
      name: name || email.split('@')[0] || 'Student',
      email,
      branch: '',
      year:   '',
      isGuest: false,
      loginAt: Date.now(),
    }
    setUser(u)
    try { localStorage.setItem('sb-user', JSON.stringify(u)) } catch {}
  }

  const continueAsGuest = () => {
    setUser(GUEST)
    try { localStorage.setItem('sb-user', JSON.stringify(GUEST)) } catch {}
  }

  const logout = () => {
    setUser(null)
    try { localStorage.removeItem('sb-user') } catch {}
  }

  const updateProfile = (patch) => {
    setUser(prev => {
      const updated = { ...prev, ...patch }
      try { localStorage.setItem('sb-user', JSON.stringify(updated)) } catch {}
      return updated
    })
  }

  return { user, isLoggedIn, login, continueAsGuest, logout, updateProfile }
}
