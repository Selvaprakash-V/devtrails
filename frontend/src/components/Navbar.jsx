import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { to: '/onboarding/language', label: 'Onboarding' },
  { to: '/register', label: 'Register' },
  { to: '/plans', label: 'Plans' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/admin', label: 'Admin' },
]

export default function Navbar() {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.nav
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="sticky top-0 z-40 border-b border-slate-800/60 bg-slate-950/70 backdrop-blur-xl"
    >
      <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.div
            className="h-8 w-8 rounded-2xl bg-gradient-to-tr from-indigo-500 via-sky-400 to-emerald-400 shadow-glow flex items-center justify-center text-xs font-semibold text-slate-950"
            animate={{ rotate: [0, 3, -3, 0], scale: [1, 1.05, 1.05, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          >
            DT
          </motion.div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight">DevTrails</span>
            <span className="text-[11px] text-slate-400">Parametric rain insurance for riders</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1 text-xs md:text-sm">
          {navLinks.map((link) => {
            const active = location.pathname === link.to
            return (
              <motion.div key={link.to} whileHover={{ y: -1 }} className="relative px-2 md:px-3 py-1">
                <Link
                  to={link.to}
                  className={`relative z-10 transition-colors duration-200 ${
                    active ? 'text-sky-300' : 'text-slate-300 hover:text-sky-200'
                  }`}
                >
                  {link.label}
                </Link>
                {active && (
                  <motion.div
                    layoutId="nav-active-pill"
                    className="absolute inset-0 rounded-full bg-sky-500/15 border border-sky-400/40"
                    transition={{ type: 'spring', stiffness: 420, damping: 35 }}
                  />
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-lg text-slate-300 hover:text-sky-200 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-slate-800/60 bg-slate-950/90 backdrop-blur-xl"
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link, index) => {
                const active = location.pathname === link.to
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
                        active ? 'text-sky-300 bg-sky-500/15' : 'text-slate-300 hover:text-sky-200 hover:bg-slate-800/50'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
