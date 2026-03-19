import React, { useState } from 'react'
import ChatScreen from './components/ChatScreen'
import SplashScreen from './components/SplashScreen'

export default function App() {
  const [showSplash, setShowSplash] = useState(false)

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />
  }

  return <ChatScreen />
}
