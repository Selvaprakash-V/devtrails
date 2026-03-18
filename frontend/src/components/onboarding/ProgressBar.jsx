import React from 'react'

const steps = ['Language', 'Phone', 'Location', 'Work', 'Profile', 'Bank', 'Documents']

export default function ProgressBar({ currentStep }) {
  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <div className="w-full">
      <div className="w-full bg-[var(--bg-muted)] rounded-full h-2 overflow-hidden mb-3">
        <div
          className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent-strong)] h-2 rounded-full transition-all duration-350"
          style={{ width: `${progress}%` }}
          aria-hidden
        />
      </div>

      <div className="flex items-center justify-center gap-2 mt-1">
        {steps.map((_, i) => (
          // render dash-like indicator
          <span
            key={i}
            className={
              'inline-block h-1 rounded-full transition-all ' +
              (i <= currentStep ? 'w-8 bg-[var(--accent)]' : 'w-6 bg-[var(--bg-muted)] border border-[var(--border)]')
            }
            aria-hidden
          />
        ))}
      </div>
    </div>
  )
}