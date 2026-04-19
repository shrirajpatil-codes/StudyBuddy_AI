// components/ui/DarkModeToggle.jsx

import React from 'react'
import { Sun, Moon } from 'lucide-react'

export default function DarkModeToggle({ dark, onToggle }) {
  return (
    <button
      onClick={onToggle}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="
        relative w-14 h-7 rounded-full
        flex items-center
        transition-colors duration-300 cursor-pointer
        focus-ring
      "
      style={{
        background: dark
          ? 'linear-gradient(135deg, #4338ca, #7c3aed)'
          : 'linear-gradient(135deg, #c7d2fe, #a5b4fc)',
      }}
    >
      {/* Thumb */}
      <span
        className="absolute w-6 h-6 rounded-full shadow-md flex items-center justify-center
          transition-all duration-300"
        style={{
          left: dark ? 'calc(100% - 28px)' : '2px',
          background: 'white',
        }}
      >
        {dark
          ? <Moon size={13} className="text-brand-700" />
          : <Sun  size={13} className="text-amber-500" />
        }
      </span>
    </button>
  )
}
