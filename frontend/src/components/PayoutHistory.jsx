import React from 'react'
import { motion } from 'framer-motion'

export default function PayoutHistory({ history }) {
  if (!history || history.length === 0) {
    return <div className="text-sm text-slate-400">No payouts yet</div>
  }

  return (
    <motion.ul
      className="space-y-3"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.06 } },
      }}
    >
      {history.map((h, idx) => (
        <motion.li
          key={idx}
          variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
          className="flex justify-between items-center rounded-xl border border-slate-700/70 bg-slate-900/60 px-3 py-2.5 text-sm"
        >
          <div>
            <div className="font-semibold text-slate-100">
              {h.type === 'Rain' ? 'Rain 🌧️ payout' : h.type}
            </div>
            <div className="text-[11px] text-slate-500">
              {new Date(h.date).toLocaleString()}
            </div>
          </div>
          <div className="text-emerald-300 font-semibold">₹{h.amount}</div>
        </motion.li>
      ))}
    </motion.ul>
  )
}
