// frontend/src/pages/DocumentsPage.jsx
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Upload, FileText, Trash2, Loader2,
  ChevronLeft, BookOpen, HelpCircle,
  MessageSquare, CheckSquare, Lightbulb,
  AlertCircle, File, X
} from 'lucide-react'
import useDocument from '../hooks/useDocument'

// ============================================
// AI ACTION DEFINITIONS
// Each action maps to a backend action string
// ============================================
const ACTIONS = [
  {
    id:    'summarize',
    label: 'Summarize Notes',
    icon:  BookOpen,
    desc:  'Get a clear structured summary of the document',
    color: 'indigo',
  },
  {
    id:    'questions',
    label: 'Important Questions',
    icon:  HelpCircle,
    desc:  'Top exam questions with model answers',
    color: 'violet',
  },
  {
    id:    'viva',
    label: 'Viva Questions',
    icon:  MessageSquare,
    desc:  'Face-to-face viva prep with ideal answers',
    color: 'purple',
  },
  {
    id:    'quiz',
    label: 'Generate Quiz',
    icon:  CheckSquare,
    desc:  '10 MCQs with answers and explanations',
    color: 'fuchsia',
  },
  {
    id:    'explain',
    label: 'Ask a Question',
    icon:  Lightbulb,
    desc:  'Ask anything about this document',
    color: 'pink',
  },
]

// ============================================
// COLOR MAP — tailwind classes per action
// ============================================
const COLOR = {
  indigo:  { btn: 'bg-indigo-500 hover:bg-indigo-600',  badge: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300' },
  violet:  { btn: 'bg-violet-500 hover:bg-violet-600',  badge: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300' },
  purple:  { btn: 'bg-purple-500 hover:bg-purple-600',  badge: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' },
  fuchsia: { btn: 'bg-fuchsia-500 hover:bg-fuchsia-600', badge: 'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/40 dark:text-fuchsia-300' },
  pink:    { btn: 'bg-pink-500 hover:bg-pink-600',      badge: 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300' },
}

// ============================================
// HELPER — format bytes to readable size
// ============================================
const formatSize = (bytes) => {
  if (bytes < 1024)        return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// ============================================
// UPLOAD ZONE COMPONENT
// Handles both click-to-browse and drag-and-drop
// ============================================
function UploadZone({ onFileSelect, isUploading, uploadProgress }) {
  const inputRef  = useRef(null)
  const [dragging, setDragging] = useState(false)

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) onFileSelect(file)
  }

  const handleChange = (e) => {
    const file = e.target.files?.[0]
    if (file) onFileSelect(file)
    // Reset input so same file can be re-selected
    e.target.value = ''
  }

  if (isUploading) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-indigo-300 dark:border-indigo-700
        p-6 flex flex-col items-center gap-3"
        style={{ background: 'var(--bg-secondary)' }}
      >
        <Loader2 size={28} className="text-indigo-500 animate-spin" />
        <p className="text-sm font-medium text-theme">Uploading and processing...</p>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
        <p className="text-xs text-muted">{uploadProgress}% complete</p>
      </div>
    )
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={`
        rounded-2xl border-2 border-dashed p-6 flex flex-col items-center gap-3
        cursor-pointer transition-all duration-200
        ${dragging
          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30'
          : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-600'
        }
      `}
      style={{ background: dragging ? undefined : 'var(--bg-secondary)' }}
    >
      <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/40
        flex items-center justify-center"
      >
        <Upload size={22} className="text-indigo-600 dark:text-indigo-400" />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-theme">
          Drop your PDF here
        </p>
        <p className="text-xs text-muted mt-0.5">
          or click to browse — max 10MB
        </p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,application/pdf"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  )
}

// ============================================
// DOCUMENT LIST ITEM
// ============================================
function DocumentItem({ doc, isActive, onSelect, onDelete }) {
  const id = doc._id || doc.documentId

  return (
    <div
      onClick={() => onSelect(doc)}
      className={`
        group flex items-start gap-3 p-3 rounded-xl cursor-pointer
        transition-all duration-150 border
        ${isActive
          ? 'border-indigo-300 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-950/30'
          : 'border-transparent hover:border-gray-200 dark:hover:border-gray-700'
        }
      `}
      style={isActive ? undefined : { background: 'transparent' }}
    >
      {/* Icon */}
      <div className={`
        w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5
        ${isActive
          ? 'bg-indigo-200 dark:bg-indigo-800'
          : 'bg-gray-100 dark:bg-gray-800'
        }
      `}>
        <FileText size={16} className={isActive
          ? 'text-indigo-600 dark:text-indigo-400'
          : 'text-gray-500'
        } />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-theme truncate">
          {doc.title || doc.originalName}
        </p>
        <p className="text-xs text-muted mt-0.5">
          {doc.pageCount ? `${doc.pageCount} pages · ` : ''}
          {formatSize(doc.fileSize)}
        </p>
        {/* Status badge */}
        {doc.status && doc.status !== 'ready' && (
          <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full
            bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
            {doc.status}
          </span>
        )}
      </div>

      {/* Delete button — only visible on hover */}
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(id) }}
        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg
          text-gray-400 hover:text-red-500 hover:bg-red-50
          dark:hover:bg-red-900/20 transition-all flex-shrink-0"
      >
        <Trash2 size={14} />
      </button>
    </div>
  )
}

// ============================================
// EXPLAIN INPUT — shown when "Ask a Question"
// action is selected
// ============================================
function ExplainInput({ onSubmit, isLoading }) {
  const [question, setQuestion] = useState('')

  const handleSubmit = () => {
    if (question.trim()) {
      onSubmit(question.trim())
      setQuestion('')
    }
  }

  return (
    <div className="mt-3 flex flex-col gap-2">
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Type your question about this document..."
        rows={3}
        className="w-full px-3 py-2.5 rounded-xl text-sm border border-theme
          bg-transparent text-theme placeholder:text-muted
          focus:outline-none focus:ring-2 focus:ring-indigo-400
          resize-none transition"
      />
      <button
        onClick={handleSubmit}
        disabled={!question.trim() || isLoading}
        className="self-end px-4 py-2 rounded-xl text-sm font-medium text-white
          bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50
          disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Thinking...' : 'Ask'}
      </button>
    </div>
  )
}

// ============================================
// ACTION RESULT DISPLAY
// ============================================
function ActionResult({ result, onClear }) {
  if (!result) return null

  return (
    <div className="mt-4 rounded-2xl border border-theme overflow-hidden"
      style={{ background: 'var(--bg-secondary)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3
        border-b border-theme"
      >
        <p className="text-sm font-medium text-theme capitalize">
          {result.action} — {result.documentTitle}
        </p>
        <button
          onClick={onClear}
          className="p-1 rounded-lg text-muted hover:text-theme
            hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
        >
          <X size={15} />
        </button>
      </div>

      {/* Content */}
      <div className="px-4 py-4 max-h-96 overflow-y-auto">
        <pre className="text-sm text-theme whitespace-pre-wrap
          font-sans leading-relaxed">
          {result.response}
        </pre>
      </div>
    </div>
  )
}

// ============================================
// MAIN PAGE
// ============================================
export default function DocumentsPage({ dark, onToggleDark, isLoggedIn, user }) {
  const navigate  = useNavigate()
  const doc       = useDocument()

  // Which action panel is open (for "explain" input)
  const [explainOpen, setExplainOpen] = useState(false)

  // Redirect guests — documents require login
  useEffect(() => {
    if (!isLoggedIn || user?.isGuest) {
      navigate('/login')
    }
  }, [isLoggedIn, user, navigate])

  // Load documents when page mounts
  useEffect(() => {
    if (isLoggedIn && !user?.isGuest) {
      doc.fetchDocuments()
    }
  }, [isLoggedIn])

  // ── Handle file selected from upload zone ──
  const handleFileSelect = async (file) => {
    // Validate on frontend before sending
    if (file.type !== 'application/pdf') {
      alert('Only PDF files are supported.')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('File is too large. Maximum size is 10MB.')
      return
    }

    // Use filename as default title
    const title = file.name.replace('.pdf', '')
    await doc.uploadDoc(file, title)
  }

  // ── Handle AI action button click ──
  const handleAction = async (actionId, userQuestion = '') => {
    if (actionId === 'explain') {
      setExplainOpen(true)
      if (!userQuestion) return  // wait for user to type question
    } else {
      setExplainOpen(false)
    }
    await doc.runAction(actionId, userQuestion)
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>

      {/* ── Header ── */}
      <header
        className="sticky top-0 z-10 flex items-center justify-between
          px-4 sm:px-6 py-3 border-b border-theme"
        style={{ background: 'var(--bg-secondary)' }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/chat')}
            className="p-2 rounded-xl text-muted hover:text-theme
              hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-base font-semibold text-theme leading-tight">
              Document Intelligence
            </h1>
            <p className="text-xs text-muted">
              Upload study material — let AI do the heavy lifting
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:block text-xs text-muted">
            {user?.name || 'Student'}
          </span>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6
        grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6"
      >

        {/* ══ LEFT PANEL ══════════════════════════ */}
        <div className="flex flex-col gap-4">

          {/* Upload zone */}
          <UploadZone
            onFileSelect={handleFileSelect}
            isUploading={doc.isUploading}
            uploadProgress={doc.uploadProgress}
          />

          {/* Error banner */}
          {doc.error && (
            <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl
              bg-red-50 dark:bg-red-900/20 border border-red-200
              dark:border-red-800"
            >
              <AlertCircle size={15} className="text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-600 dark:text-red-400 flex-1">
                {doc.error}
              </p>
              <button onClick={doc.clearError} className="text-red-400 hover:text-red-600">
                <X size={13} />
              </button>
            </div>
          )}

          {/* Documents list */}
          <div
            className="rounded-2xl border border-theme overflow-hidden"
            style={{ background: 'var(--bg-secondary)' }}
          >
            <div className="px-4 py-3 border-b border-theme flex items-center
              justify-between"
            >
              <p className="text-sm font-medium text-theme">My Documents</p>
              <span className="text-xs text-muted">
                {doc.documents.length} file{doc.documents.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="p-2">
              {doc.isFetching ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 size={20} className="animate-spin text-muted" />
                </div>
              ) : doc.documents.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-8">
                  <File size={28} className="text-muted" />
                  <p className="text-xs text-muted text-center">
                    No documents yet.<br />Upload a PDF to get started.
                  </p>
                </div>
              ) : (
                doc.documents.map((d) => (
                  <DocumentItem
                    key={d._id || d.documentId}
                    doc={d}
                    isActive={
                      (doc.activeDocument?._id || doc.activeDocument?.documentId) ===
                      (d._id || d.documentId)
                    }
                    onSelect={doc.selectDocument}
                    onDelete={doc.deleteDoc}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        {/* ══ RIGHT PANEL ═════════════════════════ */}
        <div className="flex flex-col gap-4">

          {!doc.activeDocument ? (
            /* Empty state */
            <div
              className="flex-1 rounded-2xl border border-theme flex flex-col
                items-center justify-center py-20 px-6 text-center"
              style={{ background: 'var(--bg-secondary)' }}
            >
              <div className="w-16 h-16 rounded-2xl bg-indigo-100
                dark:bg-indigo-900/40 flex items-center justify-center mb-4"
              >
                <FileText size={28} className="text-indigo-500" />
              </div>
              <h2 className="text-base font-semibold text-theme mb-1">
                Select a document
              </h2>
              <p className="text-sm text-muted max-w-xs">
                Upload a PDF or select one from your list to start
                using AI-powered study tools
              </p>
            </div>

          ) : (
            <>
              {/* Document info card */}
              <div
                className="rounded-2xl border border-theme p-4 flex
                  items-start gap-3"
                style={{ background: 'var(--bg-secondary)' }}
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-100
                  dark:bg-indigo-900/40 flex items-center justify-center
                  flex-shrink-0"
                >
                  <FileText size={18} className="text-indigo-600
                    dark:text-indigo-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-theme truncate">
                    {doc.activeDocument.title || doc.activeDocument.originalName}
                  </p>
                  <p className="text-xs text-muted mt-0.5">
                    {doc.activeDocument.pageCount
                      ? `${doc.activeDocument.pageCount} pages · `
                      : ''}
                    {formatSize(doc.activeDocument.fileSize)}
                    {doc.activeDocument.charCount
                      ? ` · ${doc.activeDocument.charCount.toLocaleString()} characters extracted`
                      : ''}
                  </p>
                </div>
                <button
                  onClick={doc.clearActiveDocument}
                  className="p-1.5 rounded-lg text-muted hover:text-theme
                    hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                >
                  <X size={15} />
                </button>
              </div>

              {/* AI action buttons */}
              <div
                className="rounded-2xl border border-theme p-4"
                style={{ background: 'var(--bg-secondary)' }}
              >
                <p className="text-sm font-medium text-theme mb-3">
                  What would you like to do?
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {ACTIONS.map((action) => {
                    const Icon    = action.icon
                    const colors  = COLOR[action.color]
                    const isThis  = doc.activeAction === action.id
                    const running = doc.isRunningAction && isThis

                    return (
                      <button
                        key={action.id}
                        onClick={() => handleAction(action.id)}
                        disabled={doc.isRunningAction}
                        className={`
                          flex items-start gap-3 p-3 rounded-xl text-left
                          border transition-all duration-150
                          disabled:opacity-50 disabled:cursor-not-allowed
                          ${isThis && doc.isRunningAction
                            ? 'border-indigo-300 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-950/20'
                            : 'border-transparent hover:border-gray-200 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/5'
                          }
                        `}
                      >
                        <div className={`
                          w-8 h-8 rounded-lg flex items-center justify-center
                          flex-shrink-0 ${colors.badge}
                        `}>
                          {running
                            ? <Loader2 size={14} className="animate-spin" />
                            : <Icon size={14} />
                          }
                        </div>
                        <div>
                          <p className="text-sm font-medium text-theme">
                            {action.label}
                          </p>
                          <p className="text-xs text-muted mt-0.5">
                            {action.desc}
                          </p>
                        </div>
                      </button>
                    )
                  })}
                </div>

                {/* Explain input — shown when Ask a Question is clicked */}
                {explainOpen && (
                  <ExplainInput
                    onSubmit={(q) => handleAction('explain', q)}
                    isLoading={doc.isRunningAction && doc.activeAction === 'explain'}
                  />
                )}
              </div>

              {/* Action result */}
              {doc.actionResult && (
                <ActionResult
                  result={doc.actionResult}
                  onClear={doc.clearActionResult}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}