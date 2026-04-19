// components/chat/AIAvatar.jsx — Small AI icon used in chat bubbles

import React from 'react'
import { Sparkles } from 'lucide-react'

export default function AIAvatar({ size = 28 }) {
  return (
    <div
      className="flex-shrink-0 rounded-full flex items-center justify-center"
      style={{
        width: size, height: size,
        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        boxShadow: '0 2px 8px rgba(99,102,241,0.4)',
      }}
    >
      <Sparkles size={size * 0.45} color="white" />
    </div>
  )
}
