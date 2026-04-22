import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

// Auto-attach token to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const signupUser = (data) => API.post('/auth/signup', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const sendMessage = (data) => API.post('/chat/message', data);
export const getChatHistory = () => API.get('/chat/history');