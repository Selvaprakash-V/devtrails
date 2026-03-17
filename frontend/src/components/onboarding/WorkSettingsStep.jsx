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
        <h2 className="text-xl font-semibold text-slate-50 mb-2">Work settings</h2>
        <p className="text-sm text-slate-400">Tell us about your work setup</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm text-slate-300 mb-2">Vehicle Type</label>
          <div className="grid grid-cols-3 gap-2">
            {vehicleTypes.map(type => (
              <label key={type} className="flex items-center">
                <input
                  {...register('vehicleType', { required: 'Vehicle type is required' })}
                  type="radio"
                  value={type}
                  className="mr-2 text-sky-400 focus:ring-sky-400"
                />
                <span className="text-sm text-slate-200">{type}</span>
              </label>
            ))}
          </div>
          {errors.vehicleType && <p className="text-red-400 text-xs mt-1">{errors.vehicleType.message}</p>}
        </div>

        <div>
          <label className="block text-sm text-slate-300 mb-1">Work Area</label>
          <input
            {...register('workArea', { required: 'Work area is required' })}
            type="text"
            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 focus:border-sky-400 focus:outline-none"
            placeholder="Enter your work area"
          />
          {errors.workArea && <p className="text-red-400 text-xs mt-1">{errors.workArea.message}</p>}
        </div>

        <div>
          <label className="block text-sm text-slate-300 mb-2">Work Time</label>
          <div className="space-y-2">
            {workTimes.map(time => (
              <label key={time} className="flex items-center">
                <input
                  {...register('workTime')}
                  type="checkbox"
                  value={time}
                  className="mr-2 text-sky-400 focus:ring-sky-400"
                />
                <span className="text-sm text-slate-200">{time}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 py-3 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Next'}
          </button>
        </div>
      </form>

      {error && <p className="text-red-400 text-xs text-center">{error}</p>}
    </div>
  )
}