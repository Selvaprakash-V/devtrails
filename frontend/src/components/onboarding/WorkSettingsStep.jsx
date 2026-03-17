import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useOnboarding } from '../../contexts/OnboardingContext'
import { updateOnboardingWorkSettings } from '../../services/api'

const vehicleTypes = ['EV', 'Petrol', 'Bicycle']
const workTimes = ['Morning', 'Afternoon', 'Night']

export default function WorkSettingsStep({ onNext, onBack }) {
  const { state, updateField } = useOnboarding()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      vehicleType: state.workSettings.vehicleType,
      workArea: state.workSettings.workArea,
      workTime: state.workSettings.workTime
    }
  })

  const selectedTimes = watch('workTime') || []

  const onSubmit = async (data) => {
    updateField('workSettings', 'vehicleType', data.vehicleType)
    updateField('workSettings', 'workArea', data.workArea)
    updateField('workSettings', 'workTime', data.workTime)
    try {
      setSaving(true)
      setError('')
      await updateOnboardingWorkSettings({
        vehicleType: data.vehicleType,
        workArea: data.workArea,
        workTime: data.workTime || [],
      })
      onNext()
    } catch (e) {
      setError(e.message || 'Failed to save work settings')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-[var(--text)] mb-2">Work settings</h2>
        <p className="text-sm text-[var(--text-muted)]">Tell us about your work setup</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm text-[var(--text-muted)] mb-2">Vehicle Type</label>
          <div className="grid grid-cols-3 gap-2">
            {vehicleTypes.map(type => (
              <label key={type} className="flex items-center">
                <input
                  {...register('vehicleType', { required: 'Vehicle type is required' })}
                  type="radio"
                  value={type}
                  className="mr-2 text-[var(--accent)] focus:ring-[var(--accent)]"
                />
                <span className="text-sm text-[var(--text)]">{type}</span>
              </label>
            ))}
          </div>
          {errors.vehicleType && <p className="text-red-400 text-xs mt-1">{errors.vehicleType.message}</p>}
        </div>

        <div>
          <label className="block text-sm text-[var(--text-muted)] mb-1">Work Area</label>
          <input
            {...register('workArea', { required: 'Work area is required' })}
            type="text"
            className="w-full px-3 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
            placeholder="Enter your work area"
          />
          {errors.workArea && <p className="text-red-400 text-xs mt-1">{errors.workArea.message}</p>}
        </div>

        <div>
          <label className="block text-sm text-[var(--text-muted)] mb-2">Work Time</label>
          <div className="space-y-2">
            {workTimes.map(time => (
              <label key={time} className="flex items-center">
                <input
                  {...register('workTime')}
                  type="checkbox"
                  value={time}
                  className="mr-2 text-[var(--accent)] focus:ring-[var(--accent)]"
                />
                <span className="text-sm text-[var(--text)]">{time}</span>
              </label>
            ))}
          </div>
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
            disabled={saving}
            className="flex-1 py-3 btn-primary rounded-lg disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Next'}
          </button>
        </div>
      </form>

      {error && <p className="text-red-400 text-xs text-center">{error}</p>}
    </div>
  )
}