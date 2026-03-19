# QuickClaim Chatbot - MERN Stack

Mobile-first MERN chatbot with worker-app theme for gig worker insurance assistance.

## 🎨 Design Theme

**Matching Worker-App UI:**
- ✅ Indigo gradient theme (#4f46e5 → #6366f1 → #818cf8)
- ✅ Tailwind CSS utility-first styling
- ✅ Mobile-first responsive design
- ✅ Clean white cards with subtle shadows
- ✅ Rounded corners (2xl = 16px)
- ✅ Consistent spacing and typography

## 🌟 Features

### UI Components
- 📱 **Mobile-First Layout** - Optimized for mobile, scales to desktop
- 🎨 **Indigo Gradient Header** - Matching worker-app theme
- 💬 **Chat Bubbles** - User (indigo) vs Bot (white)
- ⚡ **Quick Replies** - One-tap common questions
- 🔄 **Loading States** - Bouncing dots animation
- 📝 **Timestamps** - On every message
- 🚀 **Splash Screen** - 3-second branded loading

### AI Capabilities
- Groq-powered responses
- FAQ pattern matching
- Hardcoded flows (claims, payments, bank)
- Support escalation
- Multi-language support

## 📁 Project Structure

```
chatbot/
├── chatbot-backend/       # Express API server
│   ├── server.js         # Main server file
│   ├── package.json
│   └── .env             # API keys
└── chatbot-frontend/     # React web app
    ├── src/
    │   ├── components/
    │   │   ├── ChatScreen.jsx
    │   │   └── ChatScreen.css
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## 🚀 Setup Instructions

### 1. Backend Setup

```bash
cd chatbot/chatbot-backend
npm install
```

Create `.env` file:
```env
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama3-8b-8192
```

Start server:
```bash
npm start
```

✅ Backend runs on: **http://localhost:3000**

### 2. Frontend Setup

```bash
cd chatbot/chatbot-frontend
npm install
npm run dev
```

✅ Frontend runs on: **http://localhost:3002**

## 🎯 Features

### Backend
- ✅ RESTful API endpoint `/chat`
- ✅ AI-powered responses via Groq
- ✅ FAQ pattern matching
- ✅ Hardcoded flows (claims, payments, bank)
- ✅ Support escalation
- ✅ Multi-language support
- ✅ CORS enabled

### Frontend
- ✅ Modern chat UI
- ✅ Real-time messaging
- ✅ Typing indicators
- ✅ Message timestamps
- ✅ Responsive design (mobile + desktop)
- ✅ Smooth animations
- ✅ Auto-scroll to latest message

## 📡 API Endpoint

**POST** `/chat`

**Request:**
```json
{
  "message": "How do I file a claim?",
  "language": "English"
}
```

**Response:**
```json
{
  "reply": "To file a claim:\n1. Go to Home\n2. Tap 'Claims'\n3. Click 'New Claim'\n4. Upload documents"
}
```

## 🤖 Bot Capabilities

### Hardcoded Flows
- **Claims**: Step-by-step claim filing guide
- **Payments**: Payment troubleshooting
- **Bank Details**: Profile update instructions
- **Support Escalation**: Connect to human agent

### FAQ Matching
- Premium/cost queries
- Coverage information

### AI Fallback
- Groq LLaMA model for complex queries
- Context-aware responses
- Insurance domain expertise

## 🎨 UI Features

- Gradient purple theme
- Smooth message animations
- Typing indicator with dots
- Timestamp on each message
- Send button with icon
- Disabled state handling
- Custom scrollbar
- Mobile-responsive

## 🔧 Development

### Backend
```bash
cd chatbot-backend
npm start  # Runs on port 3000
```

### Frontend
```bash
cd chatbot-frontend
npm run dev      # Dev server on port 3002
npm run build    # Production build
npm run preview  # Preview production build
```

## 📦 Dependencies

### Backend
- `express` - Web framework
- `cors` - CORS middleware
- `dotenv` - Environment variables
- `groq-sdk` - Groq AI SDK

### Frontend
- `react` - UI library
- `react-dom` - React DOM renderer
- `axios` - HTTP client
- `vite` - Build tool

## 🌐 Usage

1. Start backend server (port 3000)
2. Start frontend dev server (port 3002)
3. Open http://localhost:3002 in browser
4. Start chatting with the insurance assistant

## 💡 Example Queries

- "How do I file a claim?"
- "What is covered in my insurance?"
- "How much is the premium?"
- "I need to update my bank details"
- "Payment failed, what should I do?"
- "Connect me to support"

## 🔒 Environment Variables

**Backend (.env)**
```env
GROQ_API_KEY=gsk_xxxxxxxxxxxxx
GROQ_MODEL=llama3-8b-8192
```

Get your Groq API key from: https://console.groq.com

## 📝 Notes

- Backend must be running for frontend to work
- Update backend URL in `ChatScreen.jsx` if deploying
- Groq API key required for AI responses
- FAQ and hardcoded flows work without API key
