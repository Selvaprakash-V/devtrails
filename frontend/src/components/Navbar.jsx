import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/forecast', label: 'Forecast' },
  { to: '/plans', label: 'Insurance' },
  { to: '/dashboard?tab=wallet', label: 'Wallet' },
  { to: '/dashboard?tab=profile', label: 'Profile' },
]

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  const handleQuickNav = (to) => {
    navigate(to)
    setIsOpen(false)
  }

  const handleSignOut = () => {
    try {
      localStorage.removeItem('devtrails_user')
      localStorage.removeItem('devtrails_onboarding_complete')
      localStorage.removeItem('devtrails_onboarding_token')
    } catch (e) {
      // ignore storage errors
    }
    navigate('/onboarding/language')
    setIsOpen(false)
  }

  return (
    <motion.nav
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="sticky top-0 z-40 border-b border-[var(--border)] bg-white/90 backdrop-blur-xl"
    >
      <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.div
            className="h-8 w-8 rounded-2xl bg-gradient-to-tr from-orange-400 via-amber-400 to-orange-500 shadow-glow flex items-center justify-center text-xs font-semibold text-white"
            animate={{ rotate: [0, 2, -2, 0], scale: [1, 1.04, 1.04, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          >
            DT
          </motion.div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight text-[var(--text)]">DevTrails</span>
            <span className="text-[11px] text-[var(--text-muted)]">Parametric rain insurance for riders</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="hidden md:flex items-center gap-1 text-xs md:text-sm">
          {navLinks.map((link) => {
            const active = location.pathname === link.to || (link.to.startsWith('/dashboard') && location.pathname === '/dashboard')
            return (
              <motion.div key={link.to} whileHover={{ y: -1 }} className="relative px-2 md:px-3 py-1">
                <Link
                  to={link.to}
                  className={`relative z-10 transition-colors duration-200 ${
                    active ? 'text-[var(--accent)]' : 'text-[var(--text-muted)] hover:text-[var(--accent)]'
                  }`}
                >
                  {link.label}
                </Link>
                {active && (
                  <motion.div
                    layoutId="nav-active-pill"
                    className="absolute inset-0 rounded-full bg-[var(--accent-soft)] border border-[var(--accent)]/40"
                    transition={{ type: 'spring', stiffness: 420, damping: 35 }}
                  />
                )}
              </motion.div>
            )
          })}
        </div>

        <div className="hidden md:flex items-center gap-2 text-xs md:text-sm">
          <button onClick={handleSignOut} className="btn-primary px-3 py-2">Sign out</button>
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors touch-manipulation"
        >
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-[var(--border)] bg-white/95 backdrop-blur-xl"
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link, index) => {
                const active = location.pathname === link.to || (link.to.startsWith('/dashboard') && location.pathname === '/dashboard')
                return (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={link.to}
                      onClick={() => setIsOpen(false)}
                      className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                        active
                          ? 'text-[var(--accent)] bg-[var(--accent-soft)]'
                          : 'text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--accent-soft)]'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                )
              })}

              <div className="pt-2 border-t border-[var(--border)] grid grid-cols-2 gap-2 text-sm">
                <button onClick={handleSignOut} className="btn-primary px-3 py-2 text-left col-span-2">Sign out</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
