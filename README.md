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
| 🎯 **4 Study Modes** | Doubt Clearing · Exam Prep · Viva Practice · 🔥 1-Day Exam Mode |
| 🔥 **1-Day Exam Mode** | Last-minute exam prep — important topics, 80/20 concepts, expected questions, viva Qs, study roadmap |
| 📄 **Document Intelligence** | Upload PDF notes or question sets — AI reads and answers based on your document |
| 💾 **Chat History** | Every conversation saved to MongoDB |
| 🌙 **Dark Mode** | Smooth toggle, persisted in localStorage |
| 📱 **Responsive** | Works on mobile, tablet, and desktop |
| ⌨️ **Smart Input** | Auto-resize textarea, Enter to send |

---

## 🗂️ Project Structure

```
StudyBuddy_AI/
│
├── backend/
│   ├── config/
│   │   ├── db.js                  — MongoDB connection setup
│   │   └── gemini.js              — Google Gemini AI initialization
│   ├── controllers/
│   │   ├── authController.js      — Register, login, profile logic
│   │   ├── chatController.js      — AI chat + exam blast + document-aware chat
│   │   └── documentController.js  — PDF upload, text extraction, document management
│   ├── middleware/
│   │   ├── authMiddleware.js      — JWT token verification
│   │   └── uploadMiddleware.js    — Multer file upload handler
│   ├── models/
│   │   ├── Chat.js                — Chat message schema
│   │   ├── Document.js            — Uploaded document schema
│   │   └── User.js                — User account schema
│   ├── routes/
│   │   ├── auth.js                — Auth routes
│   │   ├── chat.js                — Chat routes
│   │   └── documents.js           — Document routes
│   ├── tests/
│   │   └── testOpenAI.js
│   ├── uploads/                   — Temporary PDF upload storage
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   └── server.js                  — Express app entry point
│
├── frontend/
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── chat/
│   │   │   │   ├── AIAvatar.jsx         — AI profile icon in chat
│   │   │   │   ├── ChatBubble.jsx       — Individual message bubble
│   │   │   │   ├── ChatInput.jsx        — Message input with PDF upload support
│   │   │   │   ├── TypingIndicator.jsx  — Animated loading dots
│   │   │   │   └── WelcomeScreen.jsx    — Mode-specific welcome UI
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx           — Top navigation bar
│   │   │   │   └── Sidebar.jsx          — Chat history + mode selector sidebar
│   │   │   └── ui/
│   │   │       ├── Badge.jsx            — Reusable badge component
│   │   │       ├── Button.jsx           — Reusable button component
│   │   │       ├── DarkModeToggle.jsx   — Dark/light mode switch
│   │   │       ├── Input.jsx            — Reusable input component
│   │   │       ├── Logo.jsx             — StudyBuddy logo
│   │   │       └── ModeSelector.jsx     — 4-mode study mode switcher
│   │   ├── hooks/
│   │   │   ├── useAuth.js          — Login, signup, guest, logout logic
│   │   │   ├── useChat.js          — Chat sessions, send message, history
│   │   │   ├── useDocument.js      — PDF upload, document state management
│   │   │   └── useSettings.js      — Dark mode, theme, font size settings
│   │   ├── pages/
│   │   │   ├── ChatPage.jsx        — Main chat dashboard with all 4 modes
│   │   │   ├── DocumentsPage.jsx   — Document management page
│   │   │   ├── LandingPage.jsx     — Home/marketing page
│   │   │   ├── LoginPage.jsx       — Login form
│   │   │   ├── NotFoundPage.jsx    — 404 page
│   │   │   ├── ProfilePage.jsx     — User profile page
│   │   │   ├── SettingsPage.jsx    — App settings page
│   │   │   └── SignupPage.jsx      — Signup form
│   │   ├── utils/
│   │   │   ├── formatTime.js       — Date/time formatting helpers
│   │   │   └── nanoid.js           — Unique ID generator
│   │   ├── api.js                  — All Axios API call functions
│   │   ├── App.jsx                 — Root component with all routes
│   │   ├── index.css               — Global styles + Tailwind base
│   │   └── main.jsx                — React app entry point
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── README.md
```

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
FRONTEND_URL=http://localhost:5173
```

Start backend:
```bash
node server.js
```

Expected output:
```
✅ MongoDB Connected
🚀 Server running on port 5000
✅ Gemini Connected: Gemini connected successfully!
```

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

## 🎯 Study Modes

| Mode | Description |
|------|-------------|
| 💬 **Doubt** | Ask any engineering concept — get instant clear explanations |
| 📖 **Exam Prep** | Revision notes, important questions, practice tests |
| 🎤 **Viva** | Simulate oral exams with model answers |
| 🔥 **1-Day Exam** | Exam tomorrow? Get only what matters — top topics, 80/20 concepts, expected questions, viva Qs, and a study roadmap |

---

## 📄 Document Intelligence

Upload any PDF — notes, question sets, previous papers — and chat with it directly.

- Supports PDFs up to 100MB
- AI reads and understands your document
- Ask questions based on your own study material
- Works alongside all 4 study modes

---

## 🔌 API Endpoints

### Auth Routes
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login and get token |
| GET | `/api/auth/profile` | ✅ | Get user profile |
| PUT | `/api/auth/profile` | ✅ | Update user profile |

### Chat Routes
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/chat` | ✅ | Send message to Gemini (supports all 4 modes) |
| GET | `/api/chat/history` | ✅ | Get chat history |
| DELETE | `/api/chat/:id` | ✅ | Delete a chat |
| GET | `/api/chat/verify` | ✅ | Verify DB connection |

### Document Routes
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/documents/upload` | ✅ | Upload a PDF document |
| GET | `/api/documents` | ✅ | Get all uploaded documents |
| GET | `/api/documents/:id` | ✅ | Get a single document |
| DELETE | `/api/documents/:id` | ✅ | Delete a document |

---

## 🛣️ Frontend Routes

| Path | Page |
|------|------|
| `/` | Landing page |
| `/login` | Login |
| `/signup` | Sign up |
| `/chat` | Chat dashboard (all 4 modes) |
| `/documents` | Document Intelligence page |
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
- **Multer** — PDF file upload handling

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

---

## 🙏 Credits

Built with ❤️ by **Shriraj Patil**
Powered by **Google Gemini AI** — Free tier