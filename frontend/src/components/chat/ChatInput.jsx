// components/chat/ChatInput.jsx
import React, { useState, useRef, useEffect } from 'react'
import { Send, Square, Paperclip, X, FileText, Loader2 } from 'lucide-react'

// Per-mode accent colors for the focus ring + send button
const MODE_COLORS = {
  doubt:      { brand: '#6366f1', shadow: 'rgba(99,102,241,0.18)',  gradient: 'linear-gradient(135deg,#6366f1,#8b5cf6)', glow: 'rgba(99,102,241,0.4)'  },
  exam:       { brand: '#8b5cf6', shadow: 'rgba(139,92,246,0.18)', gradient: 'linear-gradient(135deg,#8b5cf6,#7c3aed)', glow: 'rgba(139,92,246,0.4)' },
  viva:       { brand: '#10b981', shadow: 'rgba(16,185,129,0.18)', gradient: 'linear-gradient(135deg,#10b981,#059669)', glow: 'rgba(16,185,129,0.4)' },
  exam_blast: { brand: '#f97316', shadow: 'rgba(249,115,22,0.18)',  gradient: 'linear-gradient(135deg,#f97316,#ef4444)', glow: 'rgba(249,115,22,0.4)'  },
}

export default function ChatInput({
  onSend,
  isLoading,
  onStop,
  placeholder,
  mode = 'doubt',
  onFileSelect,
  isUploading,
  uploadProgress,
  activeDoc,
  onClearDoc,
}) {
  const [value, setValue]     = useState('')
  const [focused, setFocused] = useState(false)
  const textareaRef           = useRef(null)
  const fileInputRef          = useRef(null)

  const mc = MODE_COLORS[mode] || MODE_COLORS.doubt

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = Math.min(ta.scrollHeight, 200) + 'px'
  }, [value])

  const handleSend = () => {
    const trimmed = value.trim()
    if (!trimmed || isLoading || isUploading) return
    onSend(trimmed)
    setValue('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.focus()
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handlePaperclipClick = () => {
    if (isUploading) return
    fileInputRef.current?.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) onFileSelect?.(file)
    e.target.value = ''
  }

  const canSend    = value.trim() && !isUploading && !isLoading
  const showActive = focused || value.length > 0

  return (
    <div
      className="rounded-2xl border transition-all duration-200 overflow-hidden"
      style={{
        background:  'var(--bg-card)',
        borderColor: showActive ? mc.brand : 'var(--border)',
        boxShadow:   showActive ? `0 0 0 3px ${mc.shadow}` : 'none',
      }}
    >
      {/* ── Active document pill ─────────────────────────────────────────── */}
      {activeDoc && (
        <div
          className="flex items-center gap-2 px-4 pt-3 pb-1.5 border-b"
          style={{ borderColor: 'var(--border)' }}
        >
          <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
            style={{ background: `${mc.brand}22` }}>
            <FileText size={11} style={{ color: mc.brand }} />
          </div>
          <span className="text-xs flex-1 truncate font-medium"
            style={{ color: mc.brand }}>
            {activeDoc.title || activeDoc.originalName}
          </span>
          <button
            onClick={onClearDoc}
            className="flex-shrink-0 p-0.5 rounded transition-colors
              text-[var(--text-muted)] hover:text-red-500"
          >
            <X size={12} />
          </button>
        </div>
      )}

      {/* ── Upload progress bar ──────────────────────────────────────────── */}
      {isUploading && (
        <div className="px-4 pt-3 pb-1.5">
          <div className="flex items-center gap-2 mb-1.5">
            <Loader2 size={11} className="animate-spin flex-shrink-0"
              style={{ color: mc.brand }} />
            <span className="text-xs font-medium" style={{ color: mc.brand }}>
              Uploading and processing… {uploadProgress || 0}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width:      `${uploadProgress || 0}%`,
                background: mc.gradient,
              }}
            />
          </div>
        </div>
      )}

      {/* ── Main input row ───────────────────────────────────────────────── */}
      <div className="flex items-end gap-2 px-3 py-3">

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Paperclip */}
        <button
          onClick={handlePaperclipClick}
          disabled={isUploading}
          className="flex-shrink-0 p-2 rounded-xl transition-all duration-200
            cursor-pointer disabled:cursor-not-allowed mb-0.5"
          style={{
            color:      activeDoc ? mc.brand : 'var(--text-muted)',
            background: activeDoc ? `${mc.brand}15` : 'transparent',
          }}
          title={isUploading ? 'Uploading…' : 'Attach a PDF document'}
          onMouseEnter={e => {
            if (!activeDoc) e.currentTarget.style.background = 'var(--bg-primary)'
          }}
          onMouseLeave={e => {
            if (!activeDoc) e.currentTarget.style.background = 'transparent'
          }}
        >
          {isUploading
            ? <Loader2 size={18} className="animate-spin" />
            : <Paperclip size={18} />
          }
        </button>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKey}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          rows={1}
          placeholder={
            isUploading
              ? 'Processing document…'
              : placeholder || 'Ask anything… (Enter to send)'
          }
          disabled={isLoading || isUploading}
          className="flex-1 resize-none bg-transparent text-sm
            text-[var(--text-primary)] placeholder:text-[var(--text-muted)]
            focus:outline-none leading-relaxed py-1.5 disabled:opacity-50"
          style={{ maxHeight: 200, minHeight: 28 }}
        />

        {/* Send / Stop */}
        {isLoading ? (
          <button
            onClick={onStop}
            className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center
              justify-center bg-red-500 hover:bg-red-600 text-white
              transition-all duration-200 cursor-pointer mb-0.5
              hover:scale-105 active:scale-95"
            title="Stop generating"
          >
            <Square size={13} fill="white" />
          </button>
        ) : (
          <button
            onClick={handleSend}
            disabled={!canSend}
            className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center
              justify-center transition-all duration-200 cursor-pointer mb-0.5
              disabled:opacity-35 disabled:cursor-not-allowed
              hover:scale-105 active:scale-95 disabled:hover:scale-100"
            style={{
              background: canSend ? mc.gradient : 'var(--border)',
              color:      'white',
              boxShadow:  canSend ? `0 2px 10px ${mc.glow}` : 'none',
            }}
            title="Send message (Enter)"
          >
            <Send size={14} />
          </button>
        )}
      </div>
    </div>
  )
}