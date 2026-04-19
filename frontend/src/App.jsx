// App.jsx — Root component: theme provider + routing

import React, { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import useDarkMode from './hooks/useDarkMode'

import LandingPage  from './pages/LandingPage'
import ChatPage     from './pages/ChatPage'
import LoginPage    from './pages/LoginPage'
import SignupPage   from './pages/SignupPage'
import ProfilePage  from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  const [dark, setDark] = useDarkMode()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const sharedProps = { dark, onToggleDark: setDark }

  return (
    <Routes>
      {/* Public */}
      <Route path="/"       element={<LandingPage  {...sharedProps} />} />
      <Route path="/login"  element={<LoginPage    {...sharedProps} onLogin={() => setIsLoggedIn(true)} />} />
      <Route path="/signup" element={<SignupPage   {...sharedProps} onLogin={() => setIsLoggedIn(true)} />} />

      {/* App (accessible without login — guest mode) */}
      <Route path="/chat"     element={<ChatPage     {...sharedProps} />} />
      <Route path="/profile"  element={<ProfilePage  {...sharedProps} />} />
      <Route path="/settings" element={<SettingsPage {...sharedProps} />} />

      {/* Fallback */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
