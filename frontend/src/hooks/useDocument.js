// frontend/src/hooks/useDocument.js
import { useState, useCallback } from 'react'
import {
  uploadDocument,
  getUserDocuments,
  deleteDocument,
  runDocumentAction,
} from '../api'

export default function useDocument() {

  // ── List of all documents belonging to this user ──
  const [documents,     setDocuments]     = useState([])

  // ── The document currently selected/active ──
  const [activeDocument, setActiveDocument] = useState(null)

  // ── Result from the last AI action ──
  const [actionResult,  setActionResult]  = useState(null)

  // ── Which AI action is currently running ──
  const [activeAction,  setActiveAction]  = useState(null)

  // ── Upload progress 0-100 ──
  const [uploadProgress, setUploadProgress] = useState(0)

  // ── Loading states ──
  const [isUploading,   setIsUploading]   = useState(false)
  const [isFetching,    setIsFetching]    = useState(false)
  const [isRunningAction, setIsRunningAction] = useState(false)

  // ── Error state ──
  const [error, setError] = useState(null)

  // ============================================
  // FETCH ALL DOCUMENTS
  // Call this when the Documents page loads
  // ============================================
  const fetchDocuments = useCallback(async () => {
    setIsFetching(true)
    setError(null)

    try {
      const res = await getUserDocuments()
      setDocuments(res.data.data || [])
    } catch (err) {
      const msg = err.response?.data?.error || 'Could not load documents.'
      setError(msg)
      console.error('❌ fetchDocuments error:', msg)
    } finally {
      setIsFetching(false)
    }
  }, [])

  // ============================================
  // UPLOAD A DOCUMENT
  // Accepts a File object and optional title string
  // Returns { success, data, error }
  // ============================================
  const uploadDoc = useCallback(async (file, title = '') => {
    setIsUploading(true)
    setUploadProgress(0)
    setError(null)

    try {
      // Build FormData — required for file uploads
      const formData = new FormData()
      formData.append('document', file)         // must match Multer field name
      if (title.trim()) {
        formData.append('title', title.trim())
      }

      const res = await uploadDocument(formData, (progressEvent) => {
        // Calculate upload percentage
        const percent = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        )
        setUploadProgress(percent)
      })

      const newDoc = res.data.data

      // Add to documents list immediately — no need to refetch
      setDocuments(prev => [newDoc, ...prev])

      // Auto-select the newly uploaded document
      setActiveDocument(newDoc)

      console.log('✅ Document uploaded:', newDoc.documentId)

      return { success: true, data: newDoc }

    } catch (err) {
      const msg = err.response?.data?.error || 'Upload failed. Please try again.'
      setError(msg)
      console.error('❌ uploadDoc error:', msg)
      return { success: false, error: msg }

    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }, [])

  // ============================================
  // DELETE A DOCUMENT
  // Removes from backend + removes from local state
  // ============================================
  const deleteDoc = useCallback(async (documentId) => {
    setError(null)

    try {
      await deleteDocument(documentId)

      // Remove from list
      setDocuments(prev => prev.filter(d =>
        (d._id || d.documentId) !== documentId
      ))

      // If the deleted document was active, clear it
      if (
        activeDocument &&
        (activeDocument._id || activeDocument.documentId) === documentId
      ) {
        setActiveDocument(null)
        setActionResult(null)
      }

      console.log('🗑️ Document deleted:', documentId)
      return { success: true }

    } catch (err) {
      const msg = err.response?.data?.error || 'Could not delete document.'
      setError(msg)
      console.error('❌ deleteDoc error:', msg)
      return { success: false, error: msg }
    }
  }, [activeDocument])

  // ============================================
  // SELECT A DOCUMENT
  // Sets it as active and clears previous action result
  // ============================================
  const selectDocument = useCallback((document) => {
    setActiveDocument(document)
    setActionResult(null)
    setError(null)
  }, [])

  // ============================================
  // CLEAR ACTIVE DOCUMENT
  // Used when user wants to go back to normal chat
  // ============================================
  const clearActiveDocument = useCallback(() => {
    setActiveDocument(null)
    setActionResult(null)
    setError(null)
  }, [])

  // ============================================
  // RUN AI ACTION ON ACTIVE DOCUMENT
  // action: "summarize" | "questions" | "viva" | "quiz" | "explain"
  // userQuestion: only needed for "explain" action
  // ============================================
  const runAction = useCallback(async (action, userQuestion = '') => {
    if (!activeDocument) {
      setError('No document selected.')
      return { success: false, error: 'No document selected.' }
    }

    const documentId = activeDocument._id || activeDocument.documentId

    setIsRunningAction(true)
    setActiveAction(action)
    setActionResult(null)
    setError(null)

    try {
      const res = await runDocumentAction(documentId, action, userQuestion)
      const result = res.data.data

      setActionResult(result)
      console.log('✅ Action complete:', action)

      return { success: true, data: result }

    } catch (err) {
      const msg = err.response?.data?.error || `Action "${action}" failed.`
      setError(msg)
      console.error('❌ runAction error:', msg)
      return { success: false, error: msg }

    } finally {
      setIsRunningAction(false)
      setActiveAction(null)
    }
  }, [activeDocument])

  // ============================================
  // CLEAR ACTION RESULT
  // Used when user wants to run a different action
  // ============================================
  const clearActionResult = useCallback(() => {
    setActionResult(null)
    setError(null)
  }, [])

  // ============================================
  // CLEAR ERROR
  // ============================================
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // ============================================
  // RETURN EVERYTHING THE COMPONENTS NEED
  // ============================================
  return {
    // State
    documents,
    activeDocument,
    actionResult,
    activeAction,
    uploadProgress,
    isUploading,
    isFetching,
    isRunningAction,
    error,

    // Actions
    fetchDocuments,
    uploadDoc,
    deleteDoc,
    selectDocument,
    clearActiveDocument,
    runAction,
    clearActionResult,
    clearError,
  }
}