import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const titleMap = {
  '/': 'QuickClaim',
  '/dashboard': 'Dashboard',
  '/forecast': 'Forecast',
  '/plans': 'Insurance',
  '/register': 'Register',
  '/admin': 'Admin',
  '/onboarding/language': 'Onboarding',
}

export default function PageTitle({ className = '' }) {
  const location = useLocation()

  useEffect(() => {
    const path = location.pathname.split('?')[0]
    const title = titleMap[path] || (path.startsWith('/onboarding') ? 'Onboarding' : 'QuickClaim')
    document.title = `${title} — QuickClaim`
  }, [location.pathname])

  const path = location.pathname.split('?')[0]
  const title = titleMap[path] || (path.startsWith('/onboarding') ? 'Onboarding' : 'QuickClaim')

  return (
    <div className={`max-w-5xl mx-auto mb-4 ${className}`}>
      <h2 className="text-lg md:text-xl font-semibold text-[var(--text)]">{title}</h2>
    </div>
  )
}
