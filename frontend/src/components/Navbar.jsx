import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 10.5L12 4l9 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 21V11h14v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    to: '/forecast',
    label: 'Earnings',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M17 8c0 3-5 6-5 6s-5-3-5-6a5 5 0 0 1 10 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    to: '/plans',
    label: 'History',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 8h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M8 12h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    )
  },
  {
    to: '/documents',
    label: 'Documents',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 12v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M21 12l-6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    to: '/settings',
    label: 'Settings',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06A2 2 0 1 1 2.3 16.88l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09c.67 0 1.24-.41 1.51-1a1.65 1.65 0 0 0-.33-1.82L4.3 3.3A2 2 0 1 1 7.12.47l.06.06a1.65 1.65 0 0 0 1.82.33h.09A1.65 1.65 0 0 0 11 1V.91a2 2 0 1 1 4 0V1c.44 0 .86.15 1.2.4.36.26.63.62.77 1.05.13.4.4.75.77 1.02l.09.07a2 2 0 1 1 2.83 2.83l-.06.06c-.33.33-.47.81-.33 1.24.2.57.19 1.2-.03 1.76z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }
]

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  const handleClose = () => setIsOpen(false)

  const handleSignOut = () => {
    try {
      localStorage.removeItem('devtrails_user')
      localStorage.removeItem('devtrails_onboarding_complete')
      localStorage.removeItem('devtrails_onboarding_token')
    } catch (e) {}
    navigate('/onboarding/language')
  }

  return (
    <>
      {/* Floating collapsed bar */}
      <div className="fixed right-2 top-4 z-50">
        <div className="flex items-center">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-md border border-[var(--border)] shadow-md flex items-center justify-center text-lg"
            aria-label="Open menu"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 7h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4 12h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4 17h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40"
          >
            {/* Dimming backdrop */}
            <div onClick={handleClose} className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

            {/* Sidebar panel */}
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: '20%' }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="absolute right-0 top-0 bottom-0 w-[80vw] max-w-[520px] bg-white/95 backdrop-blur-lg p-6 shadow-2xl overflow-auto"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-[var(--accent)] to-[var(--accent-strong)] flex items-center justify-center text-white font-semibold">QC</div>
                  <div>
                    <div className="text-lg font-semibold">QuickClaim</div>
                    <div className="text-xs text-[var(--text-muted)]">Secure & verified</div>
                  </div>
                </div>
                <button onClick={handleClose} className="text-[var(--text-muted)]">Close</button>
              </div>

              <nav className="mt-6">
                {navLinks.map((link) => {
                  const active = location.pathname === link.to || location.pathname.startsWith(link.to)
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 p-3 rounded-lg mb-2 transition-colors ${active ? 'bg-[var(--accent-soft)] text-[var(--accent)]' : 'text-[var(--text-muted)] hover:bg-[var(--bg-muted)] hover:text-[var(--accent)]'}`}
                    >
                      <div className="w-9 h-9 rounded-md bg-white/60 flex items-center justify-center">{link.icon}</div>
                      <div className="text-sm font-medium">{link.label}</div>
                    </Link>
                  )
                })}
              </nav>

              <div className="mt-6 pt-4 border-t border-[var(--border)]">
                <button onClick={handleSignOut} className="btn-primary w-full py-3">Sign out</button>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
