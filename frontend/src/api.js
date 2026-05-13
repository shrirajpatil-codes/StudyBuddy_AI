// frontend/src/api.js
import axios from 'axios'

// ============================================
// BASE AXIOS INSTANCE
// All requests go through here
// ============================================
const API = axios.create({
  baseURL: 'http://localhost:5000/api'
})

// ============================================
// REQUEST INTERCEPTOR
// Automatically attaches JWT token to every request
// ============================================
API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem('token')
    if (token) {
      req.headers.Authorization = `Bearer ${token}`
    }
    return req
  },
  (error) => Promise.reject(error)
)

// ============================================
// RESPONSE INTERCEPTOR
// Handles token expiry automatically
// ============================================
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorCode   = error.response?.data?.code
    const errorStatus = error.response?.status

    if (
      errorStatus === 401 &&
      (errorCode === "TOKEN_EXPIRED"  ||
       errorCode === "INVALID_TOKEN" ||
       errorCode === "NO_TOKEN"      ||
       errorCode === "USER_NOT_FOUND")
    ) {
      console.log("🔐 Token expired — clearing session")
      localStorage.removeItem('token')
      localStorage.removeItem('sb-user')
      localStorage.removeItem('sb-sessions')
      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)

// ============================================
// AUTH ENDPOINTS — unchanged
// ============================================
export const signupUser = (data) => API.post('/auth/register', data)
export const loginUser  = (data) => API.post('/auth/login',    data)
export const getProfile = ()     => API.get('/auth/profile')

// ============================================
// CHAT ENDPOINTS — unchanged
// ============================================
export const sendMessage    = (data)   => API.post('/chat',                   data)
export const getChatHistory = (userId) => API.get(`/chat/history?userId=${userId}`)
export const deleteChat     = (id)     => API.delete(`/chat/${id}`)

// ============================================
// DOCUMENT ENDPOINTS — NEW
// ============================================

// Upload a PDF file
// data must be a FormData object — not plain JSON
// FormData is required because we are sending a file, not text
export const uploadDocument = (formData, onUploadProgress) =>
  API.post('/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress,
  })

// Get all documents for the logged-in user
export const getUserDocuments = () =>
  API.get('/documents')

// Get one document's metadata by ID
export const getDocument = (id) =>
  API.get(`/documents/${id}`)

// Delete a document by ID
export const deleteDocument = (id) =>
  API.delete(`/documents/${id}`)

// Run an AI action on a document
// action: "summarize" | "questions" | "viva" | "quiz" | "explain"
// userQuestion: only required when action === "explain"
export const runDocumentAction = (id, action, userQuestion = "") =>
  API.post(`/documents/${id}/action`, { action, userQuestion })

// Send a chat message with optional document context
// When documentId is provided, AI answers using document content
// When documentId is null, behaves exactly like before
export const sendMessageWithContext = (message, documentId = null) =>
  API.post('/chat', { message, documentId })