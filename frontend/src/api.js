import axios from 'axios'

// Base API instance
const API = axios.create({
  baseURL: 'http://localhost:5000/api'
})

// ✅ Request interceptor — attach token to every request
API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem('token')
    if (token) {
      req.headers.Authorization = `Bearer ${token}`
    }
    return req
  },
  (error) => {
    return Promise.reject(error)
  }
)

// ✅ Response interceptor — handle token expiry automatically
API.interceptors.response.use(
  // Success — just return response
  (response) => response,

  // Error — check if token expired
  (error) => {
    const errorCode = error.response?.data?.code
    const errorStatus = error.response?.status

    // Token expired or invalid — auto logout
    if (
      errorStatus === 401 &&
      (errorCode === "TOKEN_EXPIRED" ||
       errorCode === "INVALID_TOKEN" ||
       errorCode === "NO_TOKEN" ||
       errorCode === "USER_NOT_FOUND")
    ) {
      console.log("🔐 Token expired — clearing session")

      // Clear everything from localStorage
      localStorage.removeItem('token')
      localStorage.removeItem('sb-user')
      localStorage.removeItem('sb-sessions')

      // Redirect to login page
      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)

// Auth endpoints
export const signupUser = (data) => API.post('/auth/register', data)
export const loginUser  = (data) => API.post('/auth/login', data)
export const getProfile = ()     => API.get('/auth/profile')

// Chat endpoints
export const sendMessage    = (data)   => API.post('/chat', data)
export const getChatHistory = (userId) => API.get(`/chat/history?userId=${userId}`)
export const deleteChat     = (id)     => API.delete(`/chat/${id}`)