# 📚 StudyBuddy AI

> A full-stack AI-powered academic assistant for engineering students  
> Built with React + Node.js + Express + MongoDB + Google Gemini AI

![React](https://img.shields.io/badge/React-18-61dafb?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb)
![Gemini](https://img.shields.io/badge/Google-Gemini%20AI-4285F4?logo=google)
![Tailwind](https://img.shields.io/badge/Tailwind-3-06b6d4?logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-5-646cff?logo=vite)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 **Real Gemini AI** | Powered by Google Gemini 2.5 Flash — real AI responses |
| 🔐 **Authentication** | Secure JWT-based login and signup system |
| 💬 **Chat Interface** | ChatGPT-style chat with clean response formatting |
| 🎯 **3 Study Modes** | Doubt Clearing · Exam Prep · Viva Practice |
| 💾 **Chat History** | Every conversation saved to MongoDB |
| 🌙 **Dark Mode** | Smooth toggle, persisted in localStorage |
| 📱 **Responsive** | Works on mobile, tablet, and desktop |
| ⌨️ **Smart Input** | Auto-resize textarea, Enter to send |

---

## 🗂️ Project Structure
StudyBuddy_AI/
├── backend/
│   ├── config/
│   │   ├── db.js                  # MongoDB connection
│   │   └── gemini.js              # Google Gemini AI setup
│   ├── controllers/
│   │   ├── authController.js      # Register, Login, Profile
│   │   └── chatController.js      # Gemini API + Chat history
│   ├── middleware/
│   │   └── authMiddleware.js      # JWT token verification
│   ├── models/
│   │   ├── User.js                # User schema
│   │   └── Chat.js                # Chat history schema
│   ├── routes/
│   │   ├── auth.js                # /api/auth/* routes
│   │   └── chat.js                # /api/chat/* routes
│   ├── .env.example               # Environment variables template
│   ├── server.js                  # Express server entry point
│   └── package.json
│
└── frontend/
└── src/
├── components/
│   ├── chat/
│   │   ├── AIAvatar.jsx
│   │   ├── ChatBubble.jsx
│   │   ├── ChatInput.jsx
│   │   ├── TypingIndicator.jsx
│   │   └── WelcomeScreen.jsx
│   ├── layout/
│   │   ├── Navbar.jsx
│   │   └── Sidebar.jsx
│   └── ui/
│       ├── Badge.jsx
│       ├── Button.jsx
│       ├── DarkModeToggle.jsx
│       ├── Input.jsx
│       ├── Logo.jsx
│       └── ModeSelector.jsx
├── hooks/
│   ├── useAuth.js         # Auth state + real API calls
│   ├── useChat.js         # Chat state + Gemini API calls
│   ├── useDarkMode.js
│   └── useSettings.js
├── pages/
│   ├── ChatPage.jsx
│   ├── LandingPage.jsx
│   ├── LoginPage.jsx
│   ├── SignupPage.jsx
│   ├── ProfilePage.jsx
│   ├── SettingsPage.jsx
│   └── NotFoundPage.jsx
├── utils/
│   ├── formatTime.js
│   └── nanoid.js
├── api.js                 # Axios instance + API calls
├── App.jsx
├── main.jsx
└── index.css
---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free)
- Google Gemini API key (free)

---

### 1. Clone the Repository
```bash
git clone https://github.com/shrirajpatil-codes/StudyBuddy_AI.git
cd StudyBuddy_AI
```

---

### 2. Setup Backend

```bash
cd backend
npm install
```

Create your `.env` file:
```bash
cp .env.example .env
```

Fill in your `.env`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:3000
```

Start backend:
```bash
node server.js
```

Expected output:

---

### 3. Setup Frontend

Open a new terminal:
```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 🔌 API Endpoints

### Auth Routes
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login and get token |
| GET | `/api/auth/profile` | ✅ | Get user profile |

### Chat Routes
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/chat` | ✅ | Send message to Gemini |
| GET | `/api/chat/history` | ✅ | Get chat history |
| DELETE | `/api/chat/:id` | ✅ | Delete a chat |

---

## 🛣️ Frontend Routes

| Path | Page |
|------|------|
| `/` | Landing page |
| `/login` | Login |
| `/signup` | Sign up |
| `/chat` | Chat dashboard |
| `/profile` | User profile |
| `/settings` | App settings |

---

## 📦 Tech Stack

### Frontend
- **React 18** — UI framework
- **Vite 5** — Build tool
- **Tailwind CSS 3** — Styling
- **React Router 6** — Routing
- **Axios** — HTTP requests
- **Lucide React** — Icons

### Backend
- **Node.js + Express** — Server
- **MongoDB + Mongoose** — Database
- **Google Gemini 2.5 Flash** — AI Engine
- **JWT + bcryptjs** — Authentication

---

## 🔑 Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Backend server port (5000) |
| `NODE_ENV` | Environment (development/production) |
| `MONGO_URI` | MongoDB connection string |
| `GEMINI_API_KEY` | Google Gemini API key |
| `JWT_SECRET` | Secret key for JWT tokens |
| `FRONTEND_URL` | Frontend URL for CORS |

> ⚠️ Never commit your `.env` file to GitHub

---

## 🙏 Credits

Built with ❤️ by **Shriraj Patil**  
Powered by **Google Gemini AI** — Free tier  
8-9 days of hardcore full-stack development 🚀