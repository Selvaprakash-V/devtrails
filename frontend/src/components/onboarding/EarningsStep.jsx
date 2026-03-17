import React from 'react'
import { useForm } from 'react-hook-form'
import { useOnboarding } from '../../contexts/OnboardingContext'

const platforms = ['Zomato', 'Swiggy', 'Blinkit', 'Dunzo', 'Uber Eats', 'Other']

export default function EarningsStep({ onNext, onBack }) {
  const { state, updateField } = useOnboarding()

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: state.earnings
  })

  const onSubmit = (data) => {
    updateField('earnings', 'platform', data.platform)
    updateField('earnings', 'dailyEarnings', data.dailyEarnings)
    updateField('earnings', 'workDays', data.workDays)
    onNext()
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-[var(--text)] mb-2">Earnings & Platform</h2>
        <p className="text-sm text-[var(--text-muted)]">Help us understand your income</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm text-[var(--text-muted)] mb-1">Platform</label>
          <select
            {...register('platform', { required: 'Platform is required' })}
            className="w-full px-3 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
          >
            <option value="">Select platform</option>
            {platforms.map(platform => <option key={platform} value={platform}>{platform}</option>)}
          </select>
          {errors.platform && <p className="text-red-400 text-xs mt-1">{errors.platform.message}</p>}
        </div>

        <div>
          <label className="block text-sm text-[var(--text-muted)] mb-1">Average Daily Earnings (₹)</label>
          <input
            {...register('dailyEarnings', {
              required: 'Daily earnings is required',
              min: { value: 100, message: 'Must be at least ₹100' },
              max: { value: 10000, message: 'Must be less than ₹10,000' }
            })}
            type="number"
            className="w-full px-3 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
            placeholder="Enter amount"
          />
          {errors.dailyEarnings && <p className="text-red-400 text-xs mt-1">{errors.dailyEarnings.message}</p>}
        </div>

        <div>
          <label className="block text-sm text-[var(--text-muted)] mb-1">Work Days per Week</label>
          <input
            {...register('workDays', {
              required: 'Work days is required',
              min: { value: 1, message: 'At least 1 day' },
              max: { value: 7, message: 'Maximum 7 days' }
            })}
            type="number"
            min="1"
            max="7"
            className="w-full px-3 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
          />
          {errors.workDays && <p className="text-red-400 text-xs mt-1">{errors.workDays.message}</p>}
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 py-3 btn-secondary rounded-lg"
          >
            Back
          </button>
          <button
            type="submit"
            className="flex-1 py-3 btn-primary rounded-lg"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  )
}