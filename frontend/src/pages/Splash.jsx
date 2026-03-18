import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Splash() {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      // Always show onboarding after splash; onboarding will redirect to dashboard when complete
      navigate('/onboarding/language')
    }, 2800)
    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md text-center"
      >
        <div className="flex flex-col items-center gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-24 h-24 flex items-center justify-center rounded-2xl shadow-glow bg-white"
          >
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="1" y="1" width="22" height="22" rx="6" fill="#FF6B1A" />
              <path d="M7 12l3 3 7-7" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="text-2xl font-semibold tracking-wide"
          >
            QuickClaim Protect
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="text-sm text-[var(--text-muted)] max-w-xs"
          >
            Work safe. Get insured instantly.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.6, 1] }}
            transition={{ repeat: Infinity, duration: 1.6, delay: 0.6 }}
            className="w-28 h-1 rounded-full bg-[var(--accent-soft)] mt-4 overflow-hidden"
          >
            <div className="h-1 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-strong)] animate-[pulse_1.6s_infinite]" style={{ width: '40%' }} />
          </motion.div>

          <div className="text-xs text-[var(--text-muted)] mt-6">Trusted by 10,000+ gig workers</div>
        </div>
      </motion.div>
    </div>
  )
}
