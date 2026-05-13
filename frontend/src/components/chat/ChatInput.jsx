// components/chat/ChatInput.jsx
import React, { useState, useRef, useEffect } from 'react'
import { Send, Square, Paperclip, X, FileText, Loader2 } from 'lucide-react'

export default function ChatInput({
  onSend,
  isLoading,
  onStop,
  placeholder,
  // ── NEW props for document upload ──
  onFileSelect,      // (file) => void — called when user picks a PDF
  isUploading,       // bool — shows upload spinner on paperclip
  uploadProgress,    // 0-100 — progress bar inside input
  activeDoc,         // { title, originalName } | null
  onClearDoc,        // () => void — clears active document
}) {
  const [value, setValue]   = useState('')
  const textareaRef         = useRef(null)
  const fileInputRef        = useRef(null)

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = Math.min(ta.scrollHeight, 180) + 'px'
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

  // Paperclip clicked → open file browser
  const handlePaperclipClick = () => {
    if (isUploading) return
    fileInputRef.current?.click()
  }

  // File selected from browser
  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) onFileSelect?.(file)
    // Reset so same file can be re-selected
    e.target.value = ''
  }

  return (
    <div
      className="rounded-2xl border transition-all duration-200 overflow-hidden"
      style={{
        background:   'var(--bg-card)',
        borderColor:  value ? 'var(--brand)' : 'var(--border)',
        boxShadow:    value ? '0 0 0 3px rgba(99,102,241,0.12)' : 'none',
      }}
    >
      {/* ── Active document bar — shown inside input when doc is active ── */}
      {activeDoc && (
        <div className="flex items-center gap-2 px-3 pt-2.5 pb-1">
          <FileText size={12} className="text-indigo-500 flex-shrink-0" />
          <span className="text-xs text-indigo-600 dark:text-indigo-400
            flex-1 truncate"
          >
            <span className="font-medium">
              {activeDoc.title || activeDoc.originalName}
            </span>
          </span>
          <button
            onClick={onClearDoc}
            className="text-indigo-400 hover:text-indigo-600 transition-colors
              flex-shrink-0"
          >
            <X size={12} />
          </button>
        </div>
      )}

      {/* ── Upload progress bar — shown while uploading ── */}
      {isUploading && (
        <div className="px-3 pt-2.5 pb-1">
          <div className="flex items-center gap-2 mb-1">
            <Loader2 size={11} className="text-indigo-500 animate-spin
              flex-shrink-0"
            />
            <span className="text-xs text-indigo-600 dark:text-indigo-400">
              Uploading and processing... {uploadProgress}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
            <div
              className="bg-indigo-500 h-1 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress || 0}%` }}
            />
          </div>
        </div>
      )}

      {/* ── Main input row ── */}
      <div className="flex items-end gap-2 p-3">

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Paperclip button */}
        <button
          onClick={handlePaperclipClick}
          disabled={isUploading}
          className={`
            flex-shrink-0 p-1.5 rounded-lg transition-colors cursor-pointer
            mb-0.5 disabled:cursor-not-allowed
            ${activeDoc
              ? 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/30'
              : 'text-muted hover:text-theme hover:bg-gray-100 dark:hover:bg-white/10'
            }
          `}
          title={isUploading ? 'Uploading...' : 'Attach a PDF document'}
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
          rows={1}
          placeholder={
            isUploading
              ? 'Processing document...'
              : placeholder || 'Ask anything… (Enter to send)'
          }
          disabled={isLoading || isUploading}
          className="flex-1 resize-none bg-transparent text-sm text-theme
            placeholder:text-muted focus:outline-none leading-relaxed py-1
            disabled:opacity-60"
          style={{ maxHeight: 180, minHeight: 24 }}
        />

        {/* Send / Stop button */}
        {isLoading ? (
          <button
            onClick={onStop}
            className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center
              justify-center bg-red-500 hover:bg-red-600 text-white
              transition-colors cursor-pointer mb-0.5"
            title="Stop generating"
          >
            <Square size={14} fill="white" />
          </button>
        ) : (
          <button
            onClick={handleSend}
            disabled={!value.trim() || isUploading}
            className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center
              justify-center transition-all duration-200 cursor-pointer mb-0.5
              disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: value.trim() && !isUploading
                ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                : 'var(--border)',
              color:      'white',
              boxShadow:  value.trim() && !isUploading
                ? '0 2px 8px rgba(99,102,241,0.4)'
                : 'none',
            }}
            title="Send message (Enter)"
          >
            <Send size={15} />
          </button>
        )}
      </div>
    </div>
  )
}