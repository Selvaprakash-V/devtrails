import React from 'react'
import { motion } from 'framer-motion'

export default function Loading({ text = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-slate-300">
      <motion.div
        className="relative mb-4"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35 }}
      >
        <div className="h-12 w-12 rounded-full border-2 border-slate-700 border-t-transparent border-l-sky-400 animate-spin" />
        <div className="absolute inset-1 rounded-full bg-sky-500/10 blur-xl" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-xs font-medium tracking-wide uppercase text-slate-400"
      >
        {text}
      </motion.div>
    </div>
  )
}
