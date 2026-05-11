// hooks/useAuth.js
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
  const [user, setUser]       = useState(loadUser)
  const [authError, setAuthError] = useState('')

  const isLoggedIn = !!user

  // ✅ Save user and token helper
  const saveSession = (token, userData) => {
    localStorage.setItem('token', token)
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
    return u
  }

  // ✅ Real login
  const login = async (email, password) => {
    setAuthError('')
    try {
      const res = await loginUser({ email, password })
      const { token, user: userData } = res.data.data
      saveSession(token, userData)
      return { success: true }
    } catch (error) {
      const msg = error.response?.data?.error || 'Login failed. Try again.'
      setAuthError(msg)
      return { success: false, error: msg }
    }
  }

  // ✅ Real signup
  const signup = async (name, email, password) => {
    setAuthError('')
    try {
      const res = await signupUser({ name, email, password })
      const { token, user: userData } = res.data.data
      saveSession(token, userData)
      return { success: true }
    } catch (error) {
      const msg = error.response?.data?.error || 'Signup failed. Try again.'
      setAuthError(msg)
      return { success: false, error: msg }
    }
  }

  // ✅ Guest mode
  const continueAsGuest = () => {
    setUser(GUEST)
    localStorage.setItem('sb-user', JSON.stringify(GUEST))
  }

  // ✅ Logout — clears everything
  const logout = () => {
    setUser(null)
    localStorage.removeItem('sb-user')
    localStorage.removeItem('token')
    localStorage.removeItem('sb-sessions')
  }

  // ✅ Update profile
  const updateProfile = (patch) => {
    setUser(prev => {
      const updated = { ...prev, ...patch }
      localStorage.setItem('sb-user', JSON.stringify(updated))
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