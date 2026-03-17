import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

const navLinks = [
  { to: '/', label: 'Register' },
  { to: '/plans', label: 'Plans' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/admin', label: 'Admin' },
]

export default function Navbar() {
  const location = useLocation()

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

        <div className="flex items-center gap-1 text-xs md:text-sm">
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
      </div>
    </motion.nav>
  )
}
