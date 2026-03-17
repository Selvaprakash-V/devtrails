import React from 'react'
import { motion } from 'framer-motion'

export default function PlanCard({ plan, onSelect, loading }) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 260, damping: 18 }}
      className="card-glass p-5 flex flex-col justify-between border border-slate-700/70 shadow-glow/40"
    >
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/80 px-3 py-1 text-[11px] text-slate-300 border border-slate-700/80">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Recommended for {plan.segment || 'riders'}</span>
        </div>
        <h3 className="text-lg font-semibold tracking-tight text-slate-50">{plan.name}</h3>
        <p className="text-xs text-slate-400">Smart coverage that auto-pays when it rains heavily in your city.</p>
        <div className="flex items-baseline justify-between pt-2">
          <div>
            <div className="text-[11px] uppercase tracking-wide text-slate-400">Weekly premium</div>
            <div className="text-2xl font-bold text-sky-300">₹{plan.price}</div>
            <div className="text-[11px] text-slate-500">billed every Monday</div>
          </div>
          <div className="text-right">
            <div className="text-[11px] uppercase tracking-wide text-slate-400">Max payout</div>
            <div className="text-xl font-semibold text-emerald-300">₹{plan.payout}</div>
            <div className="text-[11px] text-slate-500">per heavy-rain event</div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <motion.button
          whileTap={!loading ? { scale: 0.96 } : {}}
          onClick={() => onSelect(plan)}
          disabled={loading}
          className="btn-primary w-full disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <span>{loading ? 'Selecting…' : 'Select this plan'}</span>
        </motion.button>
      </div>
    </motion.div>
  )
}
