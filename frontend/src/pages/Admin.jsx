import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getSummary } from '../services/api'
import Loading from '../components/Loading'

export default function Admin(){
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    async function load(){
      const res = await getSummary()
      setSummary(res.data)
      setLoading(false)
    }
    load()
  },[])

  if(loading) return <Loading />

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="max-w-3xl mx-auto space-y-5"
    >
      <div>
        <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold tracking-tight text-slate-50">Admin insights</h2>
        <p className="text-sm text-slate-400 mt-1">
          High-level metrics across all riders and policies on DevTrails.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.div
          className="card-glass p-4 border border-slate-700/70"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-xs text-slate-400">Total users</div>
          <div className="text-2xl font-semibold text-slate-50">{summary.totalUsers}</div>
        </motion.div>
        <motion.div
          className="card-glass p-4 border border-slate-700/70"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <div className="text-xs text-slate-400">Active policies</div>
          <div className="text-2xl font-semibold text-emerald-300">{summary.activePolicies}</div>
        </motion.div>
        <motion.div
          className="card-glass p-4 border border-slate-700/70"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="text-xs text-slate-400">Total payout amount</div>
          <div className="text-2xl font-semibold text-emerald-300">₹{summary.totalPayout}</div>
        </motion.div>
        <motion.div
          className="card-glass p-4 border border-slate-700/70"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="text-xs text-slate-400">Most affected city</div>
          <div className="text-2xl font-semibold text-slate-50">{summary.mostAffected || '—'}</div>
        </motion.div>
      </div>
    </motion.div>
  )
}
