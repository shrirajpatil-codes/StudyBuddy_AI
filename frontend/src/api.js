import axios from 'axios'

// ✅ Base API instance
const API = axios.create({ 
  baseURL: 'http://localhost:5000/api' 
})

// ✅ Auto-attach JWT token to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token')
  if (token) req.headers.Authorization = `Bearer ${token}`
  return req
})

// ✅ AUTH endpoints — fixed to match backend routes
export const signupUser = (data) => API.post('/auth/register', data)
export const loginUser  = (data) => API.post('/auth/login', data)
export const getProfile = ()     => API.get('/auth/profile')

// ✅ CHAT endpoints — fixed to match backend routes
export const sendMessage    = (data) => API.post('/chat', data)
export const getChatHistory = (userId) => API.get(`/chat/history?userId=${userId}`)
export const deleteChat     = (id)    => API.delete(`/chat/${id}`)