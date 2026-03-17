import React from 'react'

const steps = [
  'Language',
  'Phone',
  'Location',
  'Work',
  'Profile',
  'Bank',
  'Documents'
]

export default function ProgressBar({ currentStep }) {
  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <div className="w-full mb-6">
      <div className="flex justify-between text-xs text-[var(--text-muted)] mb-2">
        {steps.map((step, index) => (
          <span key={step} className={index <= currentStep ? 'text-[var(--accent)]' : ''}>
            {step}
          </span>
        ))}
      </div>
      <div className="w-full bg-[var(--bg-muted)] rounded-full h-2">
        <div
          className="bg-[var(--accent)] h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="text-center text-xs text-[var(--text-muted)] mt-1">
        Step {currentStep + 1} of {steps.length}
      </div>
    </div>
  )
}