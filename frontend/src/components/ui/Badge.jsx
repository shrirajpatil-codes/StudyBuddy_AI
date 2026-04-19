// components/ui/Badge.jsx

import React from 'react'

const colors = {
  default: 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300',
  brand:   'bg-brand-light dark:bg-brand-900/60 text-brand-600 dark:text-brand-300',
  violet:  'bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-300',
  green:   'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300',
  amber:   'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300',
}

export default function Badge({ children, color = 'brand', className = '' }) {
  return (
    <span className={`
      inline-flex items-center gap-1 px-2.5 py-0.5
      text-xs font-semibold rounded-full
      ${colors[color]} ${className}
    `}>
      {children}
    </span>
  )
}
