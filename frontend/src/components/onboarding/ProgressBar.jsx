import React from 'react'

const steps = [
  'Language',
  'Phone',
  'Location',
  'Work',
  'Earnings',
  'Profile',
  'Bank',
  'Documents'
]

export default function ProgressBar({ currentStep }) {
  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <div className="w-full mb-6">
      <div className="flex justify-between text-xs text-slate-400 mb-2">
        {steps.map((step, index) => (
          <span key={step} className={index <= currentStep ? 'text-sky-300' : ''}>
            {step}
          </span>
        ))}
      </div>
      <div className="w-full bg-slate-700 rounded-full h-2">
        <div
          className="bg-sky-400 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="text-center text-xs text-slate-400 mt-1">
        Step {currentStep + 1} of {steps.length}
      </div>
    </div>
  )
}