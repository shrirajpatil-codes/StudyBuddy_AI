// components/chat/ChatBubble.jsx
import React, { useState } from 'react'
import { Copy, Check, Info, AlertTriangle, Lightbulb, BookOpen } from 'lucide-react'
import AIAvatar from './AIAvatar'
import { formatTime } from '../../utils/formatTime'

function inlineFormat(text) {
  if (!text) return null
  const parts = []
  const regex = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*|~~[^~]+~~)/g
  let last = 0, match
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index))
    const m = match[0]
    if (m.startsWith('**'))
      parts.push(<strong key={match.index} className="font-semibold text-[var(--text-primary)]">{m.slice(2,-2)}</strong>)
    else if (m.startsWith('`'))
      parts.push(<code key={match.index} className="font-mono text-[0.8em] px-1.5 py-0.5 rounded-md bg-[var(--brand-light)] text-[var(--brand)]">{m.slice(1,-1)}</code>)
    else if (m.startsWith('~~'))
      parts.push(<del key={match.index} className="opacity-60">{m.slice(2,-2)}</del>)
    else if (m.startsWith('*'))
      parts.push(<em key={match.index}>{m.slice(1,-1)}</em>)
    last = match.index + m.length
  }
  if (last < text.length) parts.push(text.slice(last))
  return parts.length ? parts : text
}

function parseCallout(line) {
  const map = {
    '> [!NOTE]':    { icon: Info,          color: 'blue',   label: 'Note' },
    '> [!TIP]':     { icon: Lightbulb,     color: 'green',  label: 'Tip' },
    '> [!WARNING]': { icon: AlertTriangle, color: 'yellow', label: 'Warning' },
    '> [!EXAM]':    { icon: BookOpen,      color: 'purple', label: 'Exam Focus' },
  }
  return map[line.trim()] || null
}

const CALLOUT_STYLES = {
  blue:   'bg-blue-50 dark:bg-blue-900/20 border-blue-400 text-blue-700 dark:text-blue-300',
  green:  'bg-green-50 dark:bg-green-900/20 border-green-400 text-green-700 dark:text-green-300',
  yellow: 'bg-amber-50 dark:bg-amber-900/20 border-amber-400 text-amber-700 dark:text-amber-300',
  purple: 'bg-purple-50 dark:bg-purple-900/20 border-purple-400 text-purple-700 dark:text-purple-300',
}

function renderMarkdown(text) {
  if (!text) return null
  const lines = text.split('\n')
  const elements = []
  let i = 0
  let listBuffer = []
  let listType   = null

  const flushList = () => {
    if (!listBuffer.length) return
    const Tag = listType === 'ol' ? 'ol' : 'ul'
    const cls = listType === 'ol' ? 'list-decimal pl-5 space-y-1 my-2' : 'list-disc pl-5 space-y-1 my-2'
    elements.push(
      <Tag key={`list-${i}`} className={cls}>
        {listBuffer.map((item, idx) => (
          <li key={idx} className="text-sm leading-relaxed text-[var(--text-primary)]">{inlineFormat(item)}</li>
        ))}
      </Tag>
    )
    listBuffer = []
    listType   = null
  }

  while (i < lines.length) {
    const line    = lines[i]
    const trimmed = line.trim()

    if (trimmed.startsWith('```')) {
      flushList()
      const lang = trimmed.slice(3).trim() || 'code'
      const codeLines = []
      i++
      while (i < lines.length && !lines[i].trim().startsWith('```')) { codeLines.push(lines[i]); i++ }
      elements.push(
        <div key={i} className="my-3 rounded-xl overflow-hidden border border-[var(--border)]">
          <div className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-[var(--border)]">
            <span className="text-xs font-mono font-medium text-[var(--text-muted)] uppercase tracking-wide">{lang}</span>
          </div>
          <pre className="p-4 overflow-x-auto bg-[var(--bg-primary)]">
            <code className="font-mono text-xs leading-relaxed text-[var(--text-primary)]">{codeLines.join('\n')}</code>
          </pre>
        </div>
      )
      i++; continue
    }

    const callout = parseCallout(trimmed)
    if (callout) {
      flushList()
      const calloutLines = []
      i++
      while (i < lines.length && lines[i].startsWith('> ')) { calloutLines.push(lines[i].slice(2)); i++ }
      const { icon: Icon, color, label } = callout
      elements.push(
        <div key={i} className={`my-3 rounded-xl border-l-4 px-4 py-3 ${CALLOUT_STYLES[color]}`}>
          <div className="flex items-center gap-2 font-semibold text-sm mb-1"><Icon size={14} />{label}</div>
          <div className="text-sm leading-relaxed">{calloutLines.map((l, idx) => <p key={idx}>{inlineFormat(l)}</p>)}</div>
        </div>
      )
      continue
    }

    if (trimmed.startsWith('> ')) {
      flushList()
      elements.push(<blockquote key={i} className="border-l-4 border-[var(--brand)] pl-4 py-0.5 my-2 italic text-sm text-[var(--text-muted)]">{inlineFormat(trimmed.slice(2))}</blockquote>)
      i++; continue
    }
    if (trimmed.startsWith('### ')) { flushList(); elements.push(<h3 key={i} className="text-sm font-bold text-[var(--text-primary)] mt-4 mb-1.5 tracking-tight">{inlineFormat(trimmed.slice(4))}</h3>); i++; continue }
    if (trimmed.startsWith('## '))  { flushList(); elements.push(<h2 key={i} className="text-base font-bold text-[var(--text-primary)] mt-5 mb-2 pb-1 border-b border-[var(--border)]">{inlineFormat(trimmed.slice(3))}</h2>); i++; continue }
    if (trimmed.startsWith('# '))   { flushList(); elements.push(<h1 key={i} className="text-lg font-extrabold text-[var(--text-primary)] mt-5 mb-2">{inlineFormat(trimmed.slice(2))}</h1>); i++; continue }

    if (trimmed.startsWith('**') && trimmed.endsWith('**') && trimmed.length > 4) {
      flushList()
      elements.push(<p key={i} className="font-semibold text-sm text-[var(--text-primary)] mt-3 mb-1">{inlineFormat(trimmed.slice(2,-2))}</p>)
      i++; continue
    }
    if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
      flushList(); elements.push(<hr key={i} className="my-3 border-[var(--border)]" />); i++; continue
    }
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      if (listType && listType !== 'ul') flushList()
      listType = 'ul'; listBuffer.push(trimmed.slice(2)); i++; continue
    }
    if (/^\d+\.\s/.test(trimmed)) {
      if (listType && listType !== 'ol') flushList()
      listType = 'ol'; listBuffer.push(trimmed.replace(/^\d+\.\s/, '')); i++; continue
    }
    if (trimmed === '') {
      flushList(); elements.push(<div key={i} className="h-2" />); i++; continue
    }
    flushList()
    elements.push(<p key={i} className="text-sm leading-[1.75] text-[var(--text-primary)]">{inlineFormat(trimmed)}</p>)
    i++
  }
  flushList()
  return elements
}

function StreamCursor() {
  return (
    <span
      className="inline-block w-[2px] h-[1em] ml-0.5 align-middle rounded-full"
      style={{
        background: 'var(--brand)',
        animation:  'blink 0.9s step-end infinite',
      }}
    />
  )
}

// ── ChatBubble ────────────────────────────────────────────────────────────────
export default function ChatBubble({ message, mode = 'doubt' }) {
  const { role, content, ts, isStreaming } = message
  const isUser = role === 'user'
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  /* ── USER BUBBLE ─────────────────────────────────────────────────────────── */
  if (isUser) {
    return (
      <div className="flex justify-end items-end gap-2.5 px-4 py-1.5 animate-slide-up group">
        <div className="flex flex-col items-end gap-1 max-w-[70%] md:max-w-[60%]">
          <div
            className="px-4 py-3 rounded-2xl rounded-br-sm text-sm leading-relaxed text-white shadow-sm"
            style={{ background: 'linear-gradient(135deg, #6366f1, #7c3aed)' }}
          >
            {content}
          </div>
          <span className="text-[11px] text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity">
            {ts ? formatTime(ts) : ''}
          </span>
        </div>
        <div
          className="w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center text-xs font-bold text-white shadow-sm"
          style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }}
        >
          U
        </div>
      </div>
    )
  }

  /* ── AI BUBBLE ───────────────────────────────────────────────────────────── */
  return (
    <div className="flex items-start gap-3 px-4 py-2 animate-slide-up group">
      <div className="flex-shrink-0 mt-0.5">
        <AIAvatar size={30} mode={mode} />
      </div>

      <div className="flex flex-col gap-1 min-w-0 flex-1">
        <span className="text-[11px] font-semibold tracking-wide uppercase"
          style={{ color: 'var(--brand)' }}>
          StudyBuddy AI
        </span>

        <div
          className="relative rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
        >
          <div className="prose-chat space-y-0.5">
            {content
              ? renderMarkdown(content)
              : <span className="text-[var(--text-muted)] text-sm">Thinking…</span>
            }
            {isStreaming && <StreamCursor />}
          </div>

          {!isStreaming && (
            <button
              onClick={handleCopy}
              className="absolute top-3 right-3 p-1.5 rounded-lg opacity-0
                group-hover:opacity-100 transition-all
                hover:bg-gray-100 dark:hover:bg-white/10
                text-[var(--text-muted)] cursor-pointer"
              title="Copy response"
            >
              {copied ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
            </button>
          )}
        </div>

        <span className="text-[11px] text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity">
          {!isStreaming && ts ? formatTime(ts) : ''}
        </span>
      </div>
    </div>
  )
}