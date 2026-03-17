import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useOnboarding } from '../../contexts/OnboardingContext'
import { updateOnboardingProfile } from '../../services/api'

const genders = ['Male', 'Female', 'Other', 'Prefer not to say']

export default function ProfileStep({ onNext, onBack }) {
  const { state, updateField } = useOnboarding()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: state.profile
  })

  const onSubmit = async (data) => {
    updateField('profile', 'fullName', data.fullName)
    updateField('profile', 'age', data.age)
    updateField('profile', 'gender', data.gender)
    try {
      setSaving(true)
      setError('')
      await updateOnboardingProfile({
        fullName: data.fullName,
        age: data.age,
        gender: data.gender,
      })
      onNext()
    } catch (e) {
      setError(e.message || 'Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-[var(--text)] mb-2">Your profile</h2>
        <p className="text-sm text-[var(--text-muted)]">Basic information about you</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm text-[var(--text-muted)] mb-1">Full Name</label>
          <input
            {...register('fullName', { required: 'Full name is required' })}
            type="text"
            className="w-full px-3 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
            placeholder="Enter your full name"
          />
          {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName.message}</p>}
        </div>

        <div>
          <label className="block text-sm text-[var(--text-muted)] mb-1">Age</label>
          <input
            {...register('age', {
              required: 'Age is required',
              min: { value: 18, message: 'Must be 18 or older' },
              max: { value: 80, message: 'Must be 80 or younger' }
            })}
            type="number"
            className="w-full px-3 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
            placeholder="Enter your age"
          />
          {errors.age && <p className="text-red-400 text-xs mt-1">{errors.age.message}</p>}
        </div>

        <div>
          <label className="block text-sm text-[var(--text-muted)] mb-1">Gender (Optional)</label>
          <select
            {...register('gender')}
            className="w-full px-3 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
          >
            <option value="">Select gender</option>
            {genders.map(gender => <option key={gender} value={gender}>{gender}</option>)}
          </select>
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