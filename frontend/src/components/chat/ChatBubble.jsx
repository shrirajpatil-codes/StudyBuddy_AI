// components/chat/ChatBubble.jsx
// Renders a single chat message — handles 'user' and 'ai' roles differently

import React, { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import AIAvatar from './AIAvatar'
import { formatTime } from '../../utils/formatTime'

// Minimal markdown renderer (bold, inline code, code blocks, lists)
function renderMarkdown(text) {
  const lines = text.split('\n')
  const elements = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // Code block
    if (line.startsWith('```')) {
      const codeLines = []
      i++
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i])
        i++
      }
      elements.push(
        <pre key={i} className="bg-primary border border-theme rounded-lg p-3 overflow-x-auto my-2">
          <code className="font-mono text-xs text-theme">{codeLines.join('\n')}</code>
        </pre>
      )
      i++
      continue
    }

    // Heading
    if (line.startsWith('**') && line.endsWith('**') && line.length > 4) {
      elements.push(
        <p key={i} className="font-semibold text-theme mt-2 mb-1">
          {inlineFormat(line.slice(2, -2))}
        </p>
      )
      i++; continue
    }

    // List item
    if (line.startsWith('- ') || line.startsWith('* ')) {
      elements.push(
        <li key={i} className="ml-4 list-disc text-sm leading-relaxed">
          {inlineFormat(line.slice(2))}
        </li>
      )
      i++; continue
    }

    // Numbered list
    if (/^\d+\.\s/.test(line)) {
      elements.push(
        <li key={i} className="ml-4 list-decimal text-sm leading-relaxed">
          {inlineFormat(line.replace(/^\d+\.\s/, ''))}
        </li>
      )
      i++; continue
    }

    // Blockquote
    if (line.startsWith('> ')) {
      elements.push(
        <blockquote key={i} className="border-l-2 border-brand-400 pl-3 italic text-muted text-sm my-1">
          {inlineFormat(line.slice(2))}
        </blockquote>
      )
      i++; continue
    }

    // Empty line
    if (line.trim() === '') {
      elements.push(<br key={i} />)
      i++; continue
    }

    // Normal paragraph
    elements.push(
      <p key={i} className="text-sm leading-relaxed">
        {inlineFormat(line)}
      </p>
    )
    i++
  }

  return elements
}

// Inline: **bold**, `code`, *italic*
function inlineFormat(text) {
  const parts = []
  const regex = /(\*\*.*?\*\*|`.*?`|\*.*?\*)/g
  let last = 0, match

  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index))
    const m = match[0]
    if (m.startsWith('**'))      parts.push(<strong key={match.index}>{m.slice(2, -2)}</strong>)
    else if (m.startsWith('`'))  parts.push(<code key={match.index} className="font-mono text-xs px-1.5 py-0.5 rounded bg-brand-100 dark:bg-brand-900/50 text-brand-600 dark:text-brand-300">{m.slice(1, -1)}</code>)
    else if (m.startsWith('*'))  parts.push(<em key={match.index}>{m.slice(1, -1)}</em>)
    last = match.index + m.length
  }
  if (last < text.length) parts.push(text.slice(last))
  return parts.length ? parts : text
}

export default function ChatBubble({ message }) {
  const { role, content, ts } = message
  const isUser = role === 'user'
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  /* ── USER BUBBLE ─────────────────────────────── */
  if (isUser) {
    return (
      <div className="flex justify-end items-end gap-2 px-4 py-1 animate-slide-up group">
        <div className="flex flex-col items-end gap-1 max-w-[75%]">
          <div
            className="relative px-4 py-3 rounded-2xl rounded-br-sm text-sm leading-relaxed text-white"
            style={{ background: 'linear-gradient(135deg, #6366f1, #7c3aed)' }}
          >
            {content}
          </div>
          <span className="text-xs text-muted opacity-0 group-hover:opacity-100 transition-opacity">
            {ts ? formatTime(ts) : ''}
          </span>
        </div>
        {/* User avatar */}
        <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white"
          style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }}>
          U
        </div>
      </div>
    )
  }

  /* ── AI BUBBLE ───────────────────────────────── */
  return (
    <div className="flex items-start gap-3 px-4 py-1 animate-slide-up group">
      <AIAvatar />
      <div className="flex flex-col gap-1 max-w-[80%]">
        <div
          className="relative px-4 py-3 rounded-2xl rounded-tl-sm text-sm"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
        >
          <div className="prose-chat space-y-0.5">
            {renderMarkdown(content)}
          </div>

          {/* Copy button — appears on hover */}
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 p-1 rounded-lg opacity-0 group-hover:opacity-100
              transition-opacity hover:bg-gray-100 dark:hover:bg-white/10 text-muted cursor-pointer"
            title="Copy response"
          >
            {copied ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
          </button>
        </div>
        <span className="text-xs text-muted opacity-0 group-hover:opacity-100 transition-opacity">
          StudyBuddy AI · {ts ? formatTime(ts) : ''}
        </span>
      </div>
    </div>
  )
}
