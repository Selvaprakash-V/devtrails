import '../styles/globals.css'
import { useEffect, useState } from 'react'

export default function App({ Component, pageProps }) {
  const [dark, setDark] = useState(false)
  useEffect(() => {
    const saved = localStorage.getItem('theme')
    if (saved === 'dark') {
      document.documentElement.classList.add('dark')
      setDark(true)
    }
  }, [])
  const toggle = () => {
    const next = !dark
    setDark(next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
    document.documentElement.classList.toggle('dark', next)
  }
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-xl mx-auto p-4">
        <div className="flex justify-end mb-2">
          <button onClick={toggle} className="text-sm px-3 py-1 rounded bg-gray-100 dark:bg-gray-800">
            {dark ? 'Light' : 'Dark'}
          </button>
        </div>
        <Component {...pageProps} />
      </div>
    </div>
  )
}
