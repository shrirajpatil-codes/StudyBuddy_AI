// hooks/useSettings.js
// Central settings store — persists everything to localStorage

import { useState, useEffect } from 'react'

export const COLOR_THEMES = [
  { id: 'indigo',  label: 'Indigo',   primary: '#6366f1', secondary: '#8b5cf6', desc: 'Default' },
  { id: 'blue',    label: 'Ocean',    primary: '#3b82f6', secondary: '#06b6d4', desc: 'Cool blue' },
  { id: 'emerald', label: 'Forest',   primary: '#10b981', secondary: '#14b8a6', desc: 'Fresh green' },
  { id: 'rose',    label: 'Rose',     primary: '#f43f5e', secondary: '#ec4899', desc: 'Vibrant pink' },
  { id: 'amber',   label: 'Sunset',   primary: '#f59e0b', secondary: '#ef4444', desc: 'Warm tones' },
  { id: 'violet',  label: 'Grape',    primary: '#7c3aed', secondary: '#a855f7', desc: 'Deep purple' },
]

export const FONT_SIZES = {
  small:  { base: '13px', chat: '0.8rem' },
  medium: { base: '15px', chat: '0.875rem' },
  large:  { base: '17px', chat: '1rem' },
}

const DEFAULTS = {
  dark:          false,
  colorTheme:    'indigo',
  fontSize:      'medium',
  defaultMode:   'doubt',
  notifications: true,
  soundEffects:  false,
  compactMode:   false,
  enterToSend:   true,
  showTimestamps:true,
}

function load() {
  try {
    const s = localStorage.getItem('sb-settings')
    return s ? { ...DEFAULTS, ...JSON.parse(s) } : DEFAULTS
  } catch { return DEFAULTS }
}

function save(settings) {
  try { localStorage.setItem('sb-settings', JSON.stringify(settings)) } catch {}
}

// Apply theme CSS variables to :root
function applyTheme(themeId, dark) {
  const theme = COLOR_THEMES.find(t => t.id === themeId) || COLOR_THEMES[0]
  const root  = document.documentElement

  // Brand colours
  root.style.setProperty('--brand-primary', theme.primary)
  root.style.setProperty('--brand-secondary', theme.secondary)

  // Tailwind-style brand-500 override via CSS variable injection
  root.style.setProperty('--tw-brand', theme.primary)

  // Dark/light class
  if (dark) root.classList.add('dark')
  else      root.classList.remove('dark')
}

function applyFontSize(size) {
  const fs = FONT_SIZES[size] || FONT_SIZES.medium
  document.documentElement.style.setProperty('--font-base', fs.base)
  document.documentElement.style.setProperty('--font-chat', fs.chat)
  document.documentElement.style.fontSize = fs.base
}

export default function useSettings() {
  const [settings, setSettings] = useState(load)

  // Apply on every change
  useEffect(() => {
    applyTheme(settings.colorTheme, settings.dark)
    applyFontSize(settings.fontSize)
    save(settings)
  }, [settings])

  const update = (patch) => setSettings(prev => ({ ...prev, ...patch }))

  const toggleDark   = () => update({ dark: !settings.dark })
  const setTheme     = (id)   => update({ colorTheme: id })
  const setFontSize  = (size) => update({ fontSize: size })
  const resetSettings = () => { setSettings(DEFAULTS); save(DEFAULTS) }

  return { settings, update, toggleDark, setTheme, setFontSize, resetSettings }
}
