// pages/ChatPage.jsx — Main chat dashboard with sidebar

import React, { useEffect, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import Sidebar        from '../components/layout/Sidebar'
import ChatBubble     from '../components/chat/ChatBubble'
import ChatInput      from '../components/chat/ChatInput'
import TypingIndicator from '../components/chat/TypingIndicator'
import WelcomeScreen  from '../components/chat/WelcomeScreen'
import ModeSelector   from '../components/ui/ModeSelector'
import DarkModeToggle from '../components/ui/DarkModeToggle'
import Logo           from '../components/ui/Logo'
import useChat        from '../hooks/useChat'
import { MODES }      from '../components/ui/ModeSelector'

const PLACEHOLDERS = {
  doubt: 'Ask a doubt… e.g. "Explain Kirchhoff\'s laws"',
  exam:  'What topic to revise? e.g. "DBMS important questions"',
  viva:  'Practice viva… e.g. "Ask me about Computer Networks"',
}

export default function ChatPage({ dark, onToggleDark }) {
  const chat = useChat()
  const [mode, setMode]             = useState('doubt')
  const [sidebarCollapsed, setCollapse] = useState(false)
  const [mobileSidebarOpen, setMobileOpen] = useState(false)
  const bottomRef = useRef(null)

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chat.messages, chat.isLoading])

  // Sync mode with active session
  useEffect(() => {
    if (chat.activeSession?.mode) setMode(chat.activeSession.mode)
  }, [chat.activeSession?.id])

  const handleSend = (text) => {
    chat.sendMessage(text, mode)
  }

  const handleModeChange = (m) => {
    setMode(m)
    chat.changeMode(m)
  }

  const handleNewChat = () => {
    chat.newSession(mode)
    setMobileOpen(false)
  }

  const currentModeInfo = MODES.find(m => m.id === mode)

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-primary)' }}>

      {/* ── Mobile overlay ─────────────────────── */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Sidebar ────────────────────────────── */}
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

      {/* ── Main Content ───────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0 h-full">

        {/* ── Chat Topbar ─────────────────────── */}
        <header
          className="flex items-center justify-between px-4 py-3 border-b border-theme flex-shrink-0"
          style={{ background: 'var(--bg-secondary)' }}
        >
          {/* Mobile: hamburger + logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(o => !o)}
              className="lg:hidden p-2 rounded-xl text-muted hover:text-theme hover:bg-gray-100 dark:hover:bg-white/10
                transition-colors cursor-pointer"
            >
              {mobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="lg:hidden">
              <Logo size="sm" />
            </div>
          </div>

          {/* Centre: Mode selector (desktop) */}
          <div className="hidden sm:block">
            <ModeSelector value={mode} onChange={handleModeChange} compact />
          </div>

          {/* Right: dark mode */}
          <div className="flex items-center gap-2">
            <DarkModeToggle dark={dark} onToggle={() => onToggleDark(d => !d)} />
          </div>
        </header>

        {/* ── Mobile mode selector ─────────────── */}
        <div className="sm:hidden px-3 py-2 border-b border-theme" style={{ background: 'var(--bg-secondary)' }}>
          <ModeSelector value={mode} onChange={handleModeChange} compact />
        </div>

        {/* ── Messages Area ───────────────────── */}
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

        {/* ── Input Area ──────────────────────── */}
        <div
          className="flex-shrink-0 border-t border-theme px-4 py-4"
          style={{ background: 'var(--bg-secondary)' }}
        >
          <div className="max-w-3xl mx-auto">
            {/* Mode hint pill */}
            {currentModeInfo && (
              <div className="flex items-center gap-1.5 mb-2">
                <currentModeInfo.icon size={12} className="text-muted" />
                <span className="text-xs text-muted">{currentModeInfo.desc}</span>
              </div>
            )}
            <ChatInput
              onSend={handleSend}
              isLoading={chat.isLoading}
              onStop={chat.stopGeneration}
              placeholder={PLACEHOLDERS[mode]}
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
