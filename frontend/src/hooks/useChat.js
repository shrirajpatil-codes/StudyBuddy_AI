// hooks/useChat.js
// Manages messages, history sessions, and simulates AI responses

import { useState, useCallback, useRef } from 'react'
import { generateAIResponse } from '../utils/aiResponses'
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
  const abortRef = useRef(false)

  // ── Derived ───────────────────────────────────────
  const activeSession = sessions.find(s => s.id === activeSessionId) || null
  const messages      = activeSession?.messages || []

  // ── Persist ───────────────────────────────────────
  const persist = (updated) => {
    setSessions(updated)
    try { localStorage.setItem('sb-sessions', JSON.stringify(updated)) } catch {}
  }

  // ── Create new session ────────────────────────────
  const newSession = useCallback((mode = 'doubt') => {
    const id = nanoid()
    const session = { id, title: 'New Chat', mode, messages: [], createdAt: Date.now() }
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

  // ── Send message ──────────────────────────────────
  const sendMessage = useCallback(async (text, mode = 'doubt') => {
    if (!text.trim()) return

    // Ensure a session exists
    let sid = activeSessionId
    if (!sid) sid = newSession(mode)

    const userMsg = { id: nanoid(), role: 'user', content: text, ts: Date.now() }

    // Add user message
    setSessions(prev => {
      const updated = prev.map(s =>
        s.id === sid
          ? { ...s, messages: [...s.messages, userMsg], title: s.title === 'New Chat' ? text.slice(0, 40) : s.title }
          : s
      )
      try { localStorage.setItem('sb-sessions', JSON.stringify(updated)) } catch {}
      return updated
    })

    // Simulate AI response
    setIsLoading(true)
    abortRef.current = false

    try {
      await new Promise(r => setTimeout(r, 900 + Math.random() * 800))
      if (abortRef.current) return

      const aiContent = generateAIResponse(text, mode)
      const aiMsg = { id: nanoid(), role: 'ai', content: aiContent, ts: Date.now() }

      setSessions(prev => {
        const updated = prev.map(s =>
          s.id === sid ? { ...s, messages: [...s.messages, aiMsg] } : s
        )
        try { localStorage.setItem('sb-sessions', JSON.stringify(updated)) } catch {}
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
      const updated = prev.map(s => s.id === activeSessionId ? { ...s, mode } : s)
      try { localStorage.setItem('sb-sessions', JSON.stringify(updated)) } catch {}
      return updated
    })
  }, [activeSessionId])

  const stopGeneration = () => { abortRef.current = true; setIsLoading(false) }

  return {
    sessions, activeSession, messages, isLoading,
    newSession, selectSession, deleteSession,
    sendMessage, changeMode, stopGeneration,
    activeSessionId,
  }
}
