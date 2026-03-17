import React from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Register from './pages/Register'
import PlanSelection from './pages/PlanSelection'
import Dashboard from './pages/Dashboard'
import Admin from './pages/Admin'
import Onboarding from './pages/Onboarding'

const pageVariants = {
  initial: { opacity: 0, x: 15, scale: 0.98 },
  animate: { opacity: 1, x: 0, scale: 1 },
  exit: { opacity: 0, x: -15, scale: 0.98 },
}

export default function App(){
  const location = useLocation()
  const isOnboarded = (() => {
    try {
      return localStorage.getItem('devtrails_onboarding_complete') === 'true'
    } catch (e) {
      return false
    }
  })()

  return (
    <div className="min-h-screen text-gray-100 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-slate-900/40 to-cyan-400/10 animate-gradient-x" />
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Hide navbar for full-screen mobile-style onboarding */}
        {!location.pathname.startsWith('/onboarding') && <Navbar />}
        <main className="flex-1 flex">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="page-shell"
            >
              <Routes location={location}>
                <Route
                  path="/"
                  element={<Navigate to={isOnboarded ? "/dashboard" : "/onboarding/language"} replace />}
                />
                <Route path="/register" element={<Register/>} />
                <Route path="/onboarding/*" element={<Onboarding/>} />
                <Route path="/plans" element={<PlanSelection/>} />
                <Route path="/dashboard" element={<Dashboard/>} />
                <Route path="/admin" element={<Admin/>} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
