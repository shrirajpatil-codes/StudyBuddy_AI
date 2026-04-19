# 📚 StudyBuddy AI

> An AI-powered academic assistant for engineering students — built with React + Vite + Tailwind CSS.

![StudyBuddy AI](https://img.shields.io/badge/React-18-61dafb?logo=react) ![Tailwind](https://img.shields.io/badge/Tailwind-3-06b6d4?logo=tailwindcss) ![Vite](https://img.shields.io/badge/Vite-5-646cff?logo=vite)

---

## ✨ Features

| Feature | Description |
|---|---|
| 💬 **Chat Interface** | ChatGPT-style chat with markdown rendering |
| 🎯 **3 Modes** | Doubt Clearing · Exam Prep · Viva Practice |
| 🌙 **Dark Mode** | Smooth toggle, persisted in localStorage |
| 📱 **Responsive** | Works on mobile, tablet, and desktop |
| 📂 **Chat History** | Sessions saved locally, grouped by date |
| ⌨️ **Smart Input** | Auto-resize textarea, Enter to send, Shift+Enter for newline |
| ✨ **Animations** | Fade-in bubbles, typing indicator, smooth transitions |

---

## 🗂️ Folder Structure

```
studybuddy-ai/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── chat/
│   │   │   ├── AIAvatar.jsx          # AI avatar icon in chat
│   │   │   ├── ChatBubble.jsx        # User + AI message bubbles
│   │   │   ├── ChatInput.jsx         # Auto-resize input box
│   │   │   ├── TypingIndicator.jsx   # Animated loading dots
│   │   │   └── WelcomeScreen.jsx     # Prompt suggestions screen
│   │   ├── layout/
│   │   │   ├── Navbar.jsx            # Top navigation bar
│   │   │   └── Sidebar.jsx           # Chat history + mode selector
│   │   └── ui/
│   │       ├── Badge.jsx             # Coloured badge/pill
│   │       ├── Button.jsx            # Reusable button (variants)
│   │       ├── DarkModeToggle.jsx    # Animated dark/light toggle
│   │       ├── Input.jsx             # Form input with label + icon
│   │       ├── Logo.jsx              # StudyBuddy AI logo mark
│   │       └── ModeSelector.jsx      # Doubt / Exam / Viva selector
│   ├── hooks/
│   │   ├── useChat.js               # Chat state management
│   │   └── useDarkMode.js           # Dark mode with persistence
│   ├── pages/
│   │   ├── ChatPage.jsx             # Main chat dashboard
│   │   ├── LandingPage.jsx          # Hero + features + CTA
│   │   ├── LoginPage.jsx            # Login form
│   │   ├── SignupPage.jsx           # Signup form
│   │   ├── ProfilePage.jsx          # User profile
│   │   ├── SettingsPage.jsx         # App settings
│   │   └── NotFoundPage.jsx         # 404 page
│   ├── utils/
│   │   ├── aiResponses.js           # Mock AI response generator
│   │   ├── formatTime.js            # Timestamp formatting
│   │   └── nanoid.js                # Tiny unique ID generator
│   ├── App.jsx                      # Root: routing + theme
│   ├── main.jsx                     # React entry point
│   └── index.css                    # Global styles + CSS variables
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

---

## 🚀 Getting Started

### 1. Install dependencies
```bash
cd studybuddy-ai
npm install
```

### 2. Start development server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173)

### 3. Build for production
```bash
npm run build
npm run preview   # Preview production build
```

---

## 🔌 Connecting a Real AI API

The mock responses are in `src/utils/aiResponses.js`. To connect a real AI:

### Option A — OpenAI / Gemini
In `src/hooks/useChat.js`, replace the mock timeout block with a real fetch:

```js
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_KEY}`,
  },
  body: JSON.stringify({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: `You are StudyBuddy AI, an expert academic assistant for engineering students. Current mode: ${mode}` },
      ...messages.map(m => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.content })),
      { role: 'user', content: text },
    ],
  }),
})
const data = await response.json()
const aiContent = data.choices[0].message.content
```

### Option B — Backend Proxy (Recommended for production)
Create a backend endpoint that wraps your API key so it stays secret.

---

## 🎨 Design Tokens

All colours use CSS variables in `src/index.css`:

| Variable | Light | Dark |
|---|---|---|
| `--bg-primary` | `#f8f9ff` | `#0d0f1a` |
| `--bg-card` | `#ffffff` | `#161b2e` |
| `--border` | `#e2e5f1` | `#1e2540` |
| `--brand` | `#6366f1` | `#818cf8` |
| `--text-muted` | `#6b7280` | `#94a3b8` |

---

## 🛣️ Routing

| Path | Page |
|---|---|
| `/` | Landing page |
| `/chat` | Chat dashboard |
| `/login` | Login |
| `/signup` | Sign up |
| `/profile` | Profile |
| `/settings` | Settings |

---

## 📦 Tech Stack

- **React 18** — UI framework
- **Vite 5** — Lightning-fast build tool
- **Tailwind CSS 3** — Utility-first styling
- **React Router 6** — Client-side routing
- **Lucide React** — Beautiful icons
- **Outfit + Syne fonts** — Clean, modern typography

---

## 🙏 Credits

Built with ❤️ for engineering students by StudyBuddy AI Team.
