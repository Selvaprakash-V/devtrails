import React from 'react'
import { motion } from 'framer-motion'

export default function PayoutHistory({ history }) {
  if (!history || history.length === 0) {
    return <div className="text-sm text-[var(--text-muted)]">No payouts yet</div>
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
          className="flex justify-between items-center rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2.5 text-sm"
        >
          <div>
              <div className="font-semibold text-[var(--text)]">
              {h.type === 'Rain' ? 'Rain 🌧️ payout' : h.type}
            </div>
              <div className="text-[11px] text-[var(--text-muted)]">
              {new Date(h.date).toLocaleString()}
            </div>
          </div>
            <div className="text-[var(--accent)] font-semibold">₹{h.amount}</div>
        </motion.li>
      ))}
    </motion.ul>
  )
}
