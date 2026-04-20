// App.jsx — Root component: unified auth + settings + routing

import React from 'react'
import { Routes, Route } from 'react-router-dom'
import useAuth     from './hooks/useAuth'
import useSettings from './hooks/useSettings'

import LandingPage  from './pages/LandingPage'
import ChatPage     from './pages/ChatPage'
import LoginPage    from './pages/LoginPage'
import SignupPage   from './pages/SignupPage'
import ProfilePage  from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  // ── Auth ────────────────────────────────────────
  const auth = useAuth()

  // ── Settings (dark mode, theme, font size, etc.) ─
  const { settings, update, toggleDark, setTheme, setFontSize, resetSettings } = useSettings()

  // Props shared with every page
  const sharedProps = {
    // auth
    user:             auth.user,
    isLoggedIn:       auth.isLoggedIn,
    onLogin:          auth.login,
    onContinueGuest:  auth.continueAsGuest,
    onLogout:         auth.logout,
    onUpdateProfile:  auth.updateProfile,
    // settings
    settings,
    onUpdateSettings: update,
    onToggleDark:     toggleDark,
    onSetTheme:       setTheme,
    onSetFontSize:    setFontSize,
    onResetSettings:  resetSettings,
    // convenience aliases still used in some pages
    dark: settings.dark,
  }

  return (
    <Routes>
      <Route path="/"        element={<LandingPage  {...sharedProps} />} />
      <Route path="/login"   element={<LoginPage    {...sharedProps} />} />
      <Route path="/signup"  element={<SignupPage   {...sharedProps} />} />
      <Route path="/chat"    element={<ChatPage     {...sharedProps} />} />
      <Route path="/profile" element={<ProfilePage  {...sharedProps} />} />
      <Route path="/settings"element={<SettingsPage {...sharedProps} />} />
      <Route path="*"        element={<NotFoundPage />} />
    </Routes>
  )
}
