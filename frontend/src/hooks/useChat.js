// hooks/useChat.js
// Now uses real Gemini API through backend

import { useState, useCallback, useRef } from 'react'
import { sendMessage as sendMessageAPI } from '../api'
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

  // ── Persist ───────────────────────────────────────
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
      title: 'New Chat', 
      mode, 
      messages: [], 
      createdAt: Date.now() 
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

  // ── Send message — NOW CALLS REAL GEMINI API ──────
  const sendMessage = useCallback(async (text, mode = 'doubt') => {
    if (!text.trim()) return
    setChatError('')

    // Ensure a session exists
    let sid = activeSessionId
    if (!sid) sid = newSession(mode)

    const userMsg = { 
      id:      nanoid(), 
      role:    'user', 
      content: text, 
      ts:      Date.now() 
    }

    // Add user message immediately to UI
    setSessions(prev => {
      const updated = prev.map(s =>
        s.id === sid
          ? { 
              ...s, 
              messages: [...s.messages, userMsg], 
              title: s.title === 'New Chat' 
                ? text.slice(0, 40) 
                : s.title 
            }
          : s
      )
      try { 
        localStorage.setItem('sb-sessions', JSON.stringify(updated)) 
      } catch {}
      return updated
    })

    // Call real Gemini API through backend
    setIsLoading(true)
    abortRef.current = false

    try {
      // Get user from localStorage for userId
      const storedUser = localStorage.getItem('sb-user')
      const userData   = storedUser ? JSON.parse(storedUser) : null
      const userId     = userData?.id || 'guest'

      // ✅ Real API call to backend → Gemini
      const response = await sendMessageAPI({ 
        message: text,
        userId:  userId,
      })

      if (abortRef.current) return

      // Extract AI response from backend response
      const aiContent = response.data.data.aiResponse

      const aiMsg = { 
        id:      nanoid(), 
        role:    'ai', 
        content: aiContent, 
        ts:      Date.now() 
      }

      // Add AI response to UI
      setSessions(prev => {
        const updated = prev.map(s =>
          s.id === sid 
            ? { ...s, messages: [...s.messages, aiMsg] } 
            : s
        )
        try { 
          localStorage.setItem('sb-sessions', JSON.stringify(updated)) 
        } catch {}
        return updated
      })

    } catch (error) {
      console.error('❌ Chat API Error:', error)

      // Show error message in chat
      const errMsg = error.response?.data?.error || 'Something went wrong. Try again.'
      setChatError(errMsg)

      // Add error bubble to chat
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
        try { 
          localStorage.setItem('sb-sessions', JSON.stringify(updated)) 
        } catch {}
        return updated
      })

    } finally {
      setIsLoading(false)
    }
  }, [activeSessionId, newSession])

  // ── Change mode of current session ────────────────
  const changeMode = useCallback((mode) => {
    if (!activeSessionId) return
    setSessions(prev => {
      const updated = prev.map(s => 
        s.id === activeSessionId ? { ...s, mode } : s
      )
      try { 
        localStorage.setItem('sb-sessions', JSON.stringify(updated)) 
      } catch {}
      return updated
    })
  }, [activeSessionId])

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
    newSession, 
    selectSession, 
    deleteSession,
    sendMessage, 
    changeMode, 
    stopGeneration,
    activeSessionId,
  }
}