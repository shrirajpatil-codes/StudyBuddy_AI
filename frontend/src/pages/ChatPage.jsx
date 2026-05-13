// pages/ChatPage.jsx
import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, X, LogOut, ChevronDown, Settings, FileText } from 'lucide-react'
import Sidebar         from '../components/layout/Sidebar'
import ChatBubble      from '../components/chat/ChatBubble'
import ChatInput       from '../components/chat/ChatInput'
import TypingIndicator from '../components/chat/TypingIndicator'
import WelcomeScreen   from '../components/chat/WelcomeScreen'
import ModeSelector, { MODES } from '../components/ui/ModeSelector'
import DarkModeToggle  from '../components/ui/DarkModeToggle'
import Logo            from '../components/ui/Logo'
import useChat         from '../hooks/useChat'
import useDocument     from '../hooks/useDocument'

// ============================================
// USER MENU
// ============================================
function UserMenu({ user, onLogout }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : 'G'

  const handleLogout = () => {
    setOpen(false)
    onLogout?.()
    navigate('/')
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl
          hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
      >
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center
            text-xs font-bold text-white flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
        >
          {initials}
        </div>
        <span className="hidden sm:block text-xs font-medium text-theme
          max-w-[80px] truncate">
          {user?.isGuest ? 'Guest' : (user?.name || 'Student')}
        </span>
        <ChevronDown size={13} className={`text-muted transition-transform
          duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-48 rounded-2xl border
            border-theme shadow-xl z-50 overflow-hidden animate-slide-up"
          style={{ background: 'var(--bg-card)' }}
        >
          {/* User info */}
          <div className="px-4 py-3 border-b border-theme">
            <p className="text-sm font-semibold text-theme truncate">
              {user?.isGuest ? 'Guest User' : (user?.name || 'Student')}
            </p>
            <p className="text-xs text-muted truncate">
              {user?.isGuest ? 'Not signed in' : (user?.email || '')}
            </p>
          </div>

          {/* Nav items */}
          <div className="py-1.5">
            <button
              onClick={() => { setOpen(false); navigate('/documents') }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm
                text-theme hover:bg-gray-50 dark:hover:bg-white/5
                transition-colors cursor-pointer"
            >
              <FileText size={14} className="text-muted" />
              Document Intelligence
            </button>
            <button
              onClick={() => { setOpen(false); navigate('/settings') }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm
                text-theme hover:bg-gray-50 dark:hover:bg-white/5
                transition-colors cursor-pointer"
            >
              <Settings size={14} className="text-muted" />
              Settings
            </button>
          </div>

          {/* Logout */}
          <div className="border-t border-theme py-1.5">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm
                text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20
                transition-colors cursor-pointer"
            >
              <LogOut size={14} />
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================
// PLACEHOLDER TEXT PER MODE
// ============================================
const PLACEHOLDERS = {
  doubt: 'Ask a doubt… e.g. "Explain Kirchhoff\'s laws"',
  exam:  'What topic to revise? e.g. "DBMS important questions"',
  viva:  'Practice viva… e.g. "Ask me about Computer Networks"',
}

// ============================================
// MAIN CHAT PAGE
// ============================================
export default function ChatPage({ dark, onToggleDark, isLoggedIn, user, onLogout }) {
  const chat = useChat()
  const doc  = useDocument()

  const [mode, setMode]                    = useState('doubt')
  const [sidebarCollapsed, setCollapse]    = useState(false)
  const [mobileSidebarOpen, setMobileOpen] = useState(false)

  // Active document — null = normal chat, object = document-aware chat
  const [activeDoc, setActiveDoc]          = useState(null)

  const bottomRef = useRef(null)

  // Auto-scroll on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chat.messages, chat.isLoading])

  // Sync mode with active session
  useEffect(() => {
    if (chat.activeSession?.mode) setMode(chat.activeSession.mode)
  }, [chat.activeSession?.id])

  // ── User picks a PDF from the file browser ──────
  // Called by ChatInput when paperclip is clicked and file is selected
  const handleFileSelect = useCallback(async (file) => {
    // Frontend validation before sending to backend
    if (file.type !== 'application/pdf') {
      alert('Only PDF files are supported.')
      return
    }
    if (file.size > 100 * 1024 * 1024) {
      alert('File too large. Maximum size is 100MB.')
      return
    }

    // Use filename as title (strip .pdf extension)
    const title = file.name.replace(/\.pdf$/i, '')

    // Upload the document — useDocument handles progress tracking
    const result = await doc.uploadDoc(file, title)

    if (result.success) {
      // Auto-set as active document after upload completes
      setActiveDoc(result.data)
    } else {
      alert(result.error || 'Upload failed. Please try again.')
    }
  }, [doc])

  // ── Send message ─────────────────────────────────
  const handleSend = useCallback((text) => {
    if (activeDoc) {
      const docId = activeDoc._id || activeDoc.documentId
      chat.sendMessageWithDoc(text, mode, docId)
    } else {
      chat.sendMessage(text, mode)
    }
  }, [activeDoc, mode, chat])

  const handleModeChange = (m) => {
    setMode(m)
    chat.changeMode(m)
  }

  const handleNewChat = () => {
    chat.newSession(mode)
    setMobileOpen(false)
  }

  // Clear document context — return to normal chat
  const handleDocClear = useCallback(() => {
    setActiveDoc(null)
    doc.clearActiveDocument()
  }, [doc])

  const currentModeInfo = MODES.find(m => m.id === mode)

  // Placeholder updates when document is active
  const placeholder = activeDoc
    ? `Ask anything about "${activeDoc.title || activeDoc.originalName}"…`
    : PLACEHOLDERS[mode]

  return (
    <div className="flex h-screen overflow-hidden"
      style={{ background: 'var(--bg-primary)' }}
    >
      {/* Mobile sidebar backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Sidebar ──────────────────────────────── */}
      <div className={`
        fixed lg:relative z-40 h-full transition-transform duration-300
        ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <Sidebar
          sessions={chat.sessions}
          activeSessionId={chat.activeSessionId}
          onNewChat={handleNewChat}
          onSelectSession={(id) => { chat.selectSession(id); setMobileOpen(false) }}
          onDeleteSession={chat.deleteSession}
          currentMode={mode}
          onModeChange={handleModeChange}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setCollapse(c => !c)}
        />
      </div>

      {/* ── Main content ─────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0 h-full">

        {/* Top bar */}
        <header
          className="flex items-center justify-between px-4 py-3
            border-b border-theme flex-shrink-0"
          style={{ background: 'var(--bg-secondary)' }}
        >
          {/* Left */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(o => !o)}
              className="lg:hidden p-2 rounded-xl text-muted hover:text-theme
                hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            >
              {mobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="lg:hidden"><Logo size="sm" /></div>
          </div>

          {/* Centre: mode selector */}
          <div className="hidden sm:block">
            <ModeSelector value={mode} onChange={handleModeChange} compact />
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            <DarkModeToggle dark={dark} onToggle={onToggleDark} />
            {isLoggedIn && <UserMenu user={user} onLogout={onLogout} />}
          </div>
        </header>

        {/* Mode selector — mobile only */}
        <div
          className="sm:hidden px-3 py-2 border-b border-theme"
          style={{ background: 'var(--bg-secondary)' }}
        >
          <ModeSelector value={mode} onChange={handleModeChange} compact />
        </div>

        {/* ── Messages area ────────────────────── */}
        <div className="flex-1 overflow-y-auto py-4">
          {chat.messages.length === 0 ? (
            <WelcomeScreen mode={mode} onSuggestion={handleSend} />
          ) : (
            <div className="max-w-3xl mx-auto space-y-1 pb-4">
              {chat.messages.map(msg => (
                <ChatBubble key={msg.id} message={msg} />
              ))}
              {chat.isLoading && <TypingIndicator />}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* ── Input area ───────────────────────── */}
        <div
          className="flex-shrink-0 border-t border-theme px-4 py-4"
          style={{ background: 'var(--bg-secondary)' }}
        >
          <div className="max-w-3xl mx-auto">

            {/* Mode hint — only shown when no document is active */}
            {!activeDoc && currentModeInfo && (
              <div className="flex items-center gap-1.5 mb-2">
                <currentModeInfo.icon size={12} className="text-muted" />
                <span className="text-xs text-muted">
                  {currentModeInfo.desc}
                </span>
              </div>
            )}

            {/* Chat input — paperclip now handles file upload */}
            <ChatInput
              onSend={handleSend}
              isLoading={chat.isLoading}
              onStop={chat.stopGeneration}
              placeholder={placeholder}
              onFileSelect={handleFileSelect}
              isUploading={doc.isUploading}
              uploadProgress={doc.uploadProgress}
              activeDoc={activeDoc}
              onClearDoc={handleDocClear}
            />

            <p className="text-center text-xs text-muted mt-2">
              StudyBuddy AI can make mistakes. Always verify important information.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}