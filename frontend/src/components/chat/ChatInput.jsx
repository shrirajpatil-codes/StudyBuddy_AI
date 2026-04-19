// components/chat/ChatInput.jsx
// Auto-growing textarea with Send button and keyboard shortcut support

import React, { useState, useRef, useEffect } from 'react'
import { Send, Square, Paperclip } from 'lucide-react'

export default function ChatInput({ onSend, isLoading, onStop, placeholder }) {
  const [value, setValue] = useState('')
  const textareaRef = useRef(null)

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = Math.min(ta.scrollHeight, 180) + 'px'
  }, [value])

  const handleSend = () => {
    const trimmed = value.trim()
    if (!trimmed || isLoading) return
    onSend(trimmed)
    setValue('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.focus()
    }
  }

  const handleKey = (e) => {
    // Send on Enter (not Shift+Enter)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div
      className="relative flex items-end gap-2 p-3 rounded-2xl border transition-all duration-200"
      style={{
        background: 'var(--bg-card)',
        borderColor: value ? 'var(--brand)' : 'var(--border)',
        boxShadow: value ? '0 0 0 3px rgba(99,102,241,0.12)' : 'none',
      }}
    >
      {/* Attachment button (decorative for now) */}
      <button
        className="flex-shrink-0 p-1.5 rounded-lg text-muted hover:text-theme hover:bg-gray-100 dark:hover:bg-white/10
          transition-colors cursor-pointer mb-0.5"
        title="Attach file (coming soon)"
        onClick={() => alert('File attachments coming soon!')}
      >
        <Paperclip size={18} />
      </button>

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={handleKey}
        rows={1}
        placeholder={placeholder || 'Ask anything… (Enter to send, Shift+Enter for new line)'}
        disabled={isLoading}
        className="flex-1 resize-none bg-transparent text-sm text-theme placeholder:text-muted
          focus:outline-none leading-relaxed py-1 disabled:opacity-60"
        style={{ maxHeight: 180, minHeight: 24 }}
      />

      {/* Send / Stop button */}
      {isLoading ? (
        <button
          onClick={onStop}
          className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center
            bg-red-500 hover:bg-red-600 text-white transition-colors cursor-pointer mb-0.5"
          title="Stop generating"
        >
          <Square size={14} fill="white" />
        </button>
      ) : (
        <button
          onClick={handleSend}
          disabled={!value.trim()}
          className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center
            transition-all duration-200 cursor-pointer mb-0.5
            disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: value.trim()
              ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
              : 'var(--border)',
            color: 'white',
            boxShadow: value.trim() ? '0 2px 8px rgba(99,102,241,0.4)' : 'none',
          }}
          title="Send message (Enter)"
        >
          <Send size={15} />
        </button>
      )}
    </div>
  )
}
