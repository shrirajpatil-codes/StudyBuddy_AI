// components/chat/AIAvatar.jsx
import React from 'react'
import { Sparkles } from 'lucide-react'

// Per-mode gradient colors — matches ModeSelector theming
const MODE_GRADIENTS = {
  doubt:      'linear-gradient(135deg, #6366f1, #8b5cf6)',
  exam:       'linear-gradient(135deg, #8b5cf6, #7c3aed)',
  viva:       'linear-gradient(135deg, #10b981, #059669)',
  exam_blast: 'linear-gradient(135deg, #f97316, #ef4444)',
}

const MODE_SHADOWS = {
  doubt:      'rgba(99,102,241,0.45)',
  exam:       'rgba(139,92,246,0.45)',
  viva:       'rgba(16,185,129,0.45)',
  exam_blast: 'rgba(249,115,22,0.45)',
}

export default function AIAvatar({ size = 30, mode = 'doubt' }) {
  const gradient = MODE_GRADIENTS[mode] || MODE_GRADIENTS.doubt
  const shadow   = MODE_SHADOWS[mode]   || MODE_SHADOWS.doubt

  return (
    <div
      className="flex-shrink-0 rounded-xl flex items-center justify-center"
      style={{
        width:     size,
        height:    size,
        background: gradient,
        boxShadow: `0 2px 10px ${shadow}`,
      }}
    >
      <Sparkles size={size * 0.45} color="white" strokeWidth={1.75} />
    </div>
  )
}