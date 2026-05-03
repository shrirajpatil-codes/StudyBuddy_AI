// hooks/useAuth.js
// Manages login state — now connected to real backend API

import { useState } from 'react'
import { loginUser, signupUser } from '../api'

const GUEST = { 
  name: 'Guest', 
  email: '', 
  branch: '', 
  year: '', 
  isGuest: true 
}

function loadUser() {
  try {
    const u = localStorage.getItem('sb-user')
    return u ? JSON.parse(u) : null
  } catch { return null }
}

export default function useAuth() {
  const [user, setUser]   = useState(loadUser)
  const [authError, setAuthError] = useState('')

  const isLoggedIn = !!user

  // ✅ REAL login — calls backend /api/auth/login
  const login = async (email, password) => {
    setAuthError('')
    try {
      const res = await loginUser({ email, password })
      const { token, user: userData } = res.data.data

      // Save token for API calls
      localStorage.setItem('token', token)

      // Save user info
      const u = {
        id:      userData.id,
        name:    userData.name,
        email:   userData.email,
        branch:  '',
        year:    '',
        isGuest: false,
        loginAt: Date.now(),
      }
      setUser(u)
      localStorage.setItem('sb-user', JSON.stringify(u))
      return { success: true }

    } catch (error) {
      const msg = error.response?.data?.error || 'Login failed. Try again.'
      setAuthError(msg)
      return { success: false, error: msg }
    }
  }

  // ✅ REAL signup — calls backend /api/auth/register
  const signup = async (name, email, password) => {
    setAuthError('')
    try {
      const res = await signupUser({ name, email, password })
      const { token, user: userData } = res.data.data

      // Save token for API calls
      localStorage.setItem('token', token)

      // Save user info
      const u = {
        id:      userData.id,
        name:    userData.name,
        email:   userData.email,
        branch:  '',
        year:    '',
        isGuest: false,
        loginAt: Date.now(),
      }
      setUser(u)
      localStorage.setItem('sb-user', JSON.stringify(u))
      return { success: true }

    } catch (error) {
      const msg = error.response?.data?.error || 'Signup failed. Try again.'
      setAuthError(msg)
      return { success: false, error: msg }
    }
  }

  // ✅ Guest mode — no API call needed
  const continueAsGuest = () => {
    setUser(GUEST)
    try { localStorage.setItem('sb-user', JSON.stringify(GUEST)) } catch {}
  }

  // ✅ Logout — clear everything
  const logout = () => {
    setUser(null)
    localStorage.removeItem('sb-user')
    localStorage.removeItem('token')
  }

  // ✅ Update profile locally
  const updateProfile = (patch) => {
    setUser(prev => {
      const updated = { ...prev, ...patch }
      try { localStorage.setItem('sb-user', JSON.stringify(updated)) } catch {}
      return updated
    })
  }

  return { 
    user, 
    isLoggedIn, 
    authError,
    login, 
    signup,
    continueAsGuest, 
    logout, 
    updateProfile 
  }
}