// hooks/useChat.js
import { useState, useCallback, useRef } from 'react'
import { sendMessage as sendMessageAPI, sendMessageWithContext } from '../api'
import { nanoid } from '../utils/nanoid'

export default function useChat() {
  // All chat sessions: [{ id, title, mode, messages: [] }]
  const [sessions, setSessions] = useState(() => {
    try {
      const stored = localStorage.getItem('sb-sessions')
      return stored ? JSON.parse(stored) : []
    } catch { return [] }
  })

  const [activeSessionId, setActiveSessionId] = useState(null)
  const [isLoading, setIsLoading]             = useState(false)
  const [chatError, setChatError]             = useState('')
  const abortRef = useRef(false)

  // ── Derived ───────────────────────────────────────
  const activeSession = sessions.find(s => s.id === activeSessionId) || null
  const messages      = activeSession?.messages || []

  // ── Persist to localStorage ───────────────────────
  const persist = (updated) => {
    setSessions(updated)
    try {
      localStorage.setItem('sb-sessions', JSON.stringify(updated))
    } catch {}
  }

  // ── Create new session ────────────────────────────
  const newSession = useCallback((mode = 'doubt') => {
    const id = nanoid()
    const session = {
      id,
      title:     'New Chat',
      mode,
      messages:  [],
      createdAt: Date.now(),
    }
    const updated = [session, ...sessions]
    persist(updated)
    setActiveSessionId(id)
    return id
  }, [sessions])

  // ── Select existing session ───────────────────────
  const selectSession = useCallback((id) => {
    setActiveSessionId(id)
  }, [])

  // ── Delete session ────────────────────────────────
  const deleteSession = useCallback((id) => {
    const updated = sessions.filter(s => s.id !== id)
    persist(updated)
    if (activeSessionId === id) {
      setActiveSessionId(updated[0]?.id || null)
    }
  }, [sessions, activeSessionId])

  // ── Core message sender ───────────────────────────
  // Shared logic between sendMessage and sendMessageWithDoc
  // Handles: session creation, optimistic UI update, API call, error bubble
  const _send = useCallback(async (text, mode = 'doubt', apiCall) => {
    if (!text.trim()) return
    setChatError('')

    // Ensure a session exists
    let sid = activeSessionId
    if (!sid) sid = newSession(mode)

    // Build user message object
    const userMsg = {
      id:      nanoid(),
      role:    'user',
      content: text,
      ts:      Date.now(),
    }

    // Add user message to UI immediately (optimistic update)
    setSessions(prev => {
      const updated = prev.map(s =>
        s.id === sid
          ? {
              ...s,
              messages: [...s.messages, userMsg],
              title: s.title === 'New Chat' ? text.slice(0, 40) : s.title,
            }
          : s
      )
      try { localStorage.setItem('sb-sessions', JSON.stringify(updated)) } catch {}
      return updated
    })

    setIsLoading(true)
    abortRef.current = false

    try {
      // apiCall is passed in by the caller — normal or document-aware
      const response = await apiCall()

      if (abortRef.current) return

      const aiContent = response.data.data.aiResponse

      // Check if response came from a document
      const docTitle = response.data.data.documentTitle || null

      const aiMsg = {
        id:          nanoid(),
        role:        'ai',
        content:     aiContent,
        ts:          Date.now(),
        // Store document title on the message for display in ChatBubble
        documentTitle: docTitle,
      }

      setSessions(prev => {
        const updated = prev.map(s =>
          s.id === sid
            ? { ...s, messages: [...s.messages, aiMsg] }
            : s
        )
        try { localStorage.setItem('sb-sessions', JSON.stringify(updated)) } catch {}
        return updated
      })

    } catch (error) {
      console.error('❌ Chat API Error:', error)

      const errMsg = error.response?.data?.error || 'Something went wrong. Try again.'
      setChatError(errMsg)

      const errorMsg = {
        id:      nanoid(),
        role:    'ai',
        content: `⚠️ Error: ${errMsg}`,
        ts:      Date.now(),
        isError: true,
      }

      setSessions(prev => {
        const updated = prev.map(s =>
          s.id === sid
            ? { ...s, messages: [...s.messages, errorMsg] }
            : s
        )
        try { localStorage.setItem('sb-sessions', JSON.stringify(updated)) } catch {}
        return updated
      })

    } finally {
      setIsLoading(false)
    }
  }, [activeSessionId, newSession])

  // ── NORMAL SEND — no document context ─────────────
  // Behaviour identical to before — nothing changed for existing chat
  const sendMessage = useCallback((text, mode = 'doubt') => {
    const storedUser = localStorage.getItem('sb-user')
    const userData   = storedUser ? JSON.parse(storedUser) : null
    const userId     = userData?.id || 'guest'

    return _send(text, mode, () =>
      sendMessageAPI({ message: text, userId, mode })
    )
  }, [_send])

  // ── DOCUMENT-AWARE SEND — with document context ───
  // Called when a document is active in ChatPage
  // documentId is passed to backend which injects document text into prompt
  const sendMessageWithDoc = useCallback((text, mode = 'doubt', documentId) => {
    return _send(text, mode, () =>
      sendMessageWithContext(text, documentId)
    )
  }, [_send])

  // ── Change mode of current session ────────────────
  const changeMode = useCallback((mode) => {
    if (!activeSessionId) return
    setSessions(prev => {
      const updated = prev.map(s =>
        s.id === activeSessionId ? { ...s, mode } : s
      )
      try { localStorage.setItem('sb-sessions', JSON.stringify(updated)) } catch {}
      return updated
    })
  }, [activeSessionId])

  // ── Stop generation ───────────────────────────────
  const stopGeneration = () => {
    abortRef.current = true
    setIsLoading(false)
  }

  return {
    sessions,
    activeSession,
    messages,
    isLoading,
    chatError,
    activeSessionId,
    newSession,
    selectSession,
    deleteSession,
    sendMessage,
    sendMessageWithDoc,   // ← NEW
    changeMode,
    stopGeneration,
  }
}