# Quick Setup Guide

## ⚡ Fast Start (Windows)

Double-click `start.bat` to launch both servers automatically!

## 📦 Manual Setup

### One-Command Install
```bash
npm run install:all
```

### Start Backend
```bash
cd chatbot-backend
npm start
```
Runs on: http://localhost:3000

### Start Frontend
```bash
cd chatbot-frontend
npm run dev
```
Runs on: http://localhost:3002

## 🔑 Required: Add API Key

Edit `chatbot-backend/.env`:
```env
GROQ_API_KEY=your_key_here
GROQ_MODEL=llama3-8b-8192
```

Get free API key: https://console.groq.com

## ✅ Verify Setup

1. Backend running → http://localhost:3000
2. Frontend running → http://localhost:3002
3. Open frontend URL in browser
4. Type "hello" to test chatbot

## 🎯 What's Included

✅ Clean MERN stack (no React Native)
✅ Modern React 18 + Vite
✅ Express backend with Groq AI
✅ Beautiful chat UI
✅ Fully responsive
✅ Production-ready

## 📁 Structure

```
chatbot/
├── chatbot-backend/    → Express API
├── chatbot-frontend/   → React Web App
├── start.bat          → Quick launcher
└── README.md          → Full docs
```

All React Native files removed! 🎉
