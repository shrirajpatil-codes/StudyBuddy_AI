// components/ui/Button.jsx — Reusable button with variants

import React from 'react'

const variants = {
  primary:  'bg-brand-500 hover:bg-brand-600 text-white shadow-glow-sm hover:shadow-glow active:scale-95',
  secondary:'bg-brand-light dark:bg-brand-900/50 text-brand-600 dark:text-brand-300 hover:bg-brand-200 dark:hover:bg-brand-800',
  ghost:    'bg-transparent hover:bg-gray-100 dark:hover:bg-white/5 text-theme',
  danger:   'bg-red-500 hover:bg-red-600 text-white',
  outline:  'border border-theme bg-transparent hover:bg-gray-50 dark:hover:bg-white/5 text-theme',
}

const sizes = {
  sm:  'px-3 py-1.5 text-sm',
  md:  'px-4 py-2 text-sm',
  lg:  'px-6 py-3 text-base',
  xl:  'px-8 py-4 text-lg',
  icon:'p-2',
}

/**
 * @param {Object} props
 * @param {'primary'|'secondary'|'ghost'|'danger'|'outline'} props.variant
 * @param {'sm'|'md'|'lg'|'xl'|'icon'} props.size
 */
export default function Button({
  variant = 'primary',
  size    = 'md',
  className = '',
  children,
  ...props
}) {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2
        rounded-xl font-medium
        transition-all duration-200 ease-in-out
        focus-ring cursor-pointer select-none
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}
