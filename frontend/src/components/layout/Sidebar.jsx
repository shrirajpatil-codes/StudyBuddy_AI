// components/layout/Sidebar.jsx
// Left sidebar: new chat button, mode selector, chat history list

import React, { useState } from 'react'
import { Plus, Trash2, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react'
import Logo from '../ui/Logo'
import ModeSelector from '../ui/ModeSelector'
import { formatDate } from '../../utils/formatTime'

export default function Sidebar({
  sessions,
  activeSessionId,
  onNewChat,
  onSelectSession,
  onDeleteSession,
  currentMode,
  onModeChange,
  collapsed,
  onToggleCollapse,
}) {
  const [hoveredId, setHoveredId] = useState(null)

  // Group sessions by date
  const grouped = sessions.reduce((acc, s) => {
    const label = formatDate(s.createdAt || Date.now())
    if (!acc[label]) acc[label] = []
    acc[label].push(s)
    return acc
  }, {})

  return (
    <aside
      className="flex flex-col h-full transition-all duration-300 ease-in-out border-r border-theme"
      style={{
        width: collapsed ? 64 : 260,
        background: 'var(--bg-sidebar)',
        flexShrink: 0,
      }}
    >
      {/* ── Header ───────────────────────────────── */}
      <div className="flex items-center justify-between px-3 py-4 border-b border-theme">
        {!collapsed && <Logo size="sm" />}
        <button
          onClick={onToggleCollapse}
          className="ml-auto p-1.5 rounded-lg text-muted hover:text-theme hover:bg-gray-100 dark:hover:bg-white/10
            transition-colors cursor-pointer"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* ── New Chat Button ───────────────────────── */}
      <div className="px-2 py-3">
        <button
          onClick={onNewChat}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl
            bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium
            transition-all duration-200 shadow-glow-sm cursor-pointer"
        >
          <Plus size={16} />
          {!collapsed && <span>New Chat</span>}
        </button>
      </div>

      {/* ── Mode Selector ─────────────────────────── */}
      {!collapsed && (
        <div className="px-3 pb-3 border-b border-theme">
          <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Mode</p>
          <ModeSelector value={currentMode} onChange={onModeChange} compact />
        </div>
      )}

      {/* ── Chat History ──────────────────────────── */}
      <div className="flex-1 overflow-y-auto py-2">
        {sessions.length === 0 ? (
          !collapsed && (
            <div className="px-4 py-8 text-center">
              <MessageSquare size={28} className="text-muted mx-auto mb-2 opacity-40" />
              <p className="text-xs text-muted">No chats yet.<br />Start a new conversation!</p>
            </div>
          )
        ) : (
          Object.entries(grouped).map(([date, group]) => (
            <div key={date}>
              {!collapsed && (
                <p className="px-4 py-1.5 text-xs font-semibold text-muted uppercase tracking-wider">
                  {date}
                </p>
              )}
              {group.map(session => (
                <div
                  key={session.id}
                  onMouseEnter={() => setHoveredId(session.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className={`
                    relative flex items-center gap-2.5 mx-2 px-2.5 py-2 rounded-xl
                    cursor-pointer transition-all duration-150 group
                    ${session.id === activeSessionId
                      ? 'bg-brand-light dark:bg-brand-900/40'
                      : 'hover:bg-gray-100 dark:hover:bg-white/5'
                    }
                  `}
                  onClick={() => onSelectSession(session.id)}
                >
                  <MessageSquare
                    size={15}
                    className={session.id === activeSessionId ? 'text-brand-500' : 'text-muted'}
                  />
                  {!collapsed && (
                    <>
                      <span
                        className={`flex-1 text-sm truncate ${
                          session.id === activeSessionId ? 'text-brand-600 dark:text-brand-300 font-medium' : 'text-theme'
                        }`}
                      >
                        {session.title || 'Untitled Chat'}
                      </span>
                      {/* Delete button */}
                      {hoveredId === session.id && (
                        <button
                          onClick={e => { e.stopPropagation(); onDeleteSession(session.id) }}
                          className="p-1 rounded-lg text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20
                            transition-colors cursor-pointer"
                          title="Delete chat"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          ))
        )}
      </div>

      {/* ── Footer ────────────────────────────────── */}
      {!collapsed && (
        <div className="px-4 py-3 border-t border-theme">
          <p className="text-xs text-muted text-center">
            StudyBuddy AI · v1.0 · Free Beta
          </p>
        </div>
      )}
    </aside>
  )
}
