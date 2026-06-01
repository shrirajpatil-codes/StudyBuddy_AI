// hooks/useChat.js
import { useState, useCallback, useRef } from 'react'
import { sendMessage as sendMessageAPI, sendMessageWithContext } from '../api'
import { nanoid } from '../utils/nanoid'

// ── Streaming config ──────────────────────────────
// Characters revealed per tick — increase for faster, decrease for slower
const STREAM_CHARS_PER_TICK = 3
const STREAM_INTERVAL_MS    = 16  // ~60fps

export default function useChat() {
  const [sessions, setSessions] = useState(() => {
    try {
      const stored = localStorage.getItem('sb-sessions')
      return stored ? JSON.parse(stored) : []
    } catch { return [] }
  })

  const [activeSessionId, setActiveSessionId] = useState(null)
  const [isLoading, setIsLoading]             = useState(false)
  const [isStreaming, setIsStreaming]          = useState(false)
  const [chatError, setChatError]             = useState('')

  const abortRef    = useRef(false)
  const intervalRef = useRef(null)   // holds the streaming interval

  // ── Derived ───────────────────────────────────────
  const activeSession = sessions.find(s => s.id === activeSessionId) || null
  const messages      = activeSession?.messages || []

  // ── Persist to localStorage ───────────────────────
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
    if (activeSessionId === id) setActiveSessionId(updated[0]?.id || null)
  }, [sessions, activeSessionId])

  // ── Stream text into an existing message ─────────
  // Takes the full AI response text and reveals it char-by-char
  const streamTextIntoMessage = useCallback((sid, msgId, fullText, onDone) => {
    let index = 0
    setIsStreaming(true)

    // Clear any previous stream
    if (intervalRef.current) clearInterval(intervalRef.current)

    intervalRef.current = setInterval(() => {
      // User hit stop — freeze immediately
      if (abortRef.current) {
        clearInterval(intervalRef.current)
        setIsStreaming(false)
        setIsLoading(false)
        onDone?.()
        return
      }

      index += STREAM_CHARS_PER_TICK
      const chunk = fullText.slice(0, index)
      const done  = index >= fullText.length

      // Update just the content of this specific message
      setSessions(prev => {
        const updated = prev.map(s =>
          s.id === sid
            ? {
                ...s,
                messages: s.messages.map(m =>
                  m.id === msgId
                    ? { ...m, content: done ? fullText : chunk, isStreaming: !done }
                    : m
                )
              }
            : s
        )
        // Only persist to localStorage when streaming is complete
        // Avoids thrashing localStorage 60 times per second
        if (done) {
          try { localStorage.setItem('sb-sessions', JSON.stringify(updated)) } catch {}
        }
        return updated
      })

      if (done) {
        clearInterval(intervalRef.current)
        setIsStreaming(false)
        setIsLoading(false)
        onDone?.()
      }
    }, STREAM_INTERVAL_MS)
  }, [])

  // ── Core message sender ───────────────────────────
  const _send = useCallback(async (text, mode = 'doubt', apiCall) => {
    if (!text.trim()) return
    setChatError('')

    let sid = activeSessionId
    if (!sid) sid = newSession(mode)

    // Add user message immediately
    const userMsg = { id: nanoid(), role: 'user', content: text, ts: Date.now() }

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
      const response = await apiCall()
      if (abortRef.current) return

      const aiContent  = response.data.data.aiResponse
      const docTitle   = response.data.data.documentTitle || null
      const aiMsgId    = nanoid()

      // Insert empty AI message shell immediately — streaming fills it in
      const aiMsg = {
        id:            aiMsgId,
        role:          'ai',
        content:       '',       // starts empty
        ts:            Date.now(),
        isStreaming:   true,     // tells ChatBubble to show cursor
        documentTitle: docTitle,
      }

      setSessions(prev => {
        const updated = prev.map(s =>
          s.id === sid ? { ...s, messages: [...s.messages, aiMsg] } : s
        )
        return updated
        // NOT persisting here — stream will persist on completion
      })

      // Start streaming the full text into the message
      streamTextIntoMessage(sid, aiMsgId, aiContent)

    } catch (error) {
      console.error('❌ Chat API Error:', error)
      const errMsg = error.response?.data?.error || 'Something went wrong. Try again.'
      setChatError(errMsg)

      const errorMsg = {
        id: nanoid(), role: 'ai',
        content: `⚠️ Error: ${errMsg}`,
        ts: Date.now(), isError: true,
      }

      setSessions(prev => {
        const updated = prev.map(s =>
          s.id === sid ? { ...s, messages: [...s.messages, errorMsg] } : s
        )
        try { localStorage.setItem('sb-sessions', JSON.stringify(updated)) } catch {}
        return updated
      })

      setIsLoading(false)
    }
    // NOTE: setIsLoading(false) is now called inside streamTextIntoMessage
    // so we don't call it in finally anymore
  }, [activeSessionId, newSession, streamTextIntoMessage])

  // ── Normal send ───────────────────────────────────
  const sendMessage = useCallback((text, mode = 'doubt') => {
    const storedUser = localStorage.getItem('sb-user')
    const userData   = storedUser ? JSON.parse(storedUser) : null
    const userId     = userData?.id || 'guest'
    return _send(text, mode, () => sendMessageAPI({ message: text, userId, mode }))
  }, [_send])

  // ── Document-aware send ───────────────────────────
  const sendMessageWithDoc = useCallback((text, mode = 'doubt', documentId) => {
    return _send(text, mode, () => sendMessageWithContext(text, documentId))
  }, [_send])

  // ── Change mode ───────────────────────────────────
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
  // Stops both the API wait AND any active stream
  const stopGeneration = useCallback(() => {
    abortRef.current = true
    if (intervalRef.current) clearInterval(intervalRef.current)
    setIsStreaming(false)
    setIsLoading(false)
  }, [])

  return {
    sessions,
    activeSession,
    messages,
    isLoading,
    isStreaming,
    chatError,
    activeSessionId,
    newSession,
    selectSession,
    deleteSession,
    sendMessage,
    sendMessageWithDoc,
    changeMode,
    stopGeneration,
  }
}