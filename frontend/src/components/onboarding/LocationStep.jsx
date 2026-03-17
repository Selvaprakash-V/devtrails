import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useOnboarding } from '../../contexts/OnboardingContext'
import { updateOnboardingLocation } from '../../services/api'

const cities = ['Chennai', 'Bangalore', 'Delhi', 'Mumbai', 'Hyderabad', 'Pune']

export default function LocationStep({ onNext, onBack }) {
  const { state, updateField } = useOnboarding()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: state.location
  })

  const getLocation = () => {
    setLoading(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          updateField('location', 'lat', position.coords.latitude)
          updateField('location', 'lng', position.coords.longitude)
          setLoading(false)
        },
        (error) => {
          console.error('Geolocation error:', error)
          setLoading(false)
        }
      )
    } else {
      setLoading(false)
    }
  }

  const onSubmit = async (data) => {
    updateField('location', 'city', data.city)
    updateField('location', 'area', data.area)
    try {
      setSaving(true)
      setError('')
      await updateOnboardingLocation({
        city: data.city,
        area: data.area,
        lat: state.location.lat,
        lng: state.location.lng,
      })
      onNext()
    } catch (e) {
      setError(e.message || 'Failed to save location')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-[var(--text)] mb-2">Your location</h2>
        <p className="text-sm text-[var(--text-muted)]">Help us understand where you work</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm text-[var(--text-muted)] mb-1">City</label>
          <select
            {...register('city', { required: 'City is required' })}
            className="w-full px-3 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
          >
            <option value="">Select city</option>
            {cities.map(city => <option key={city} value={city}>{city}</option>)}
          </select>
          {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city.message}</p>}
        </div>

        <div>
          <label className="block text-sm text-[var(--text-muted)] mb-1">Area/Zone</label>
          <input
            {...register('area', { required: 'Area is required' })}
            type="text"
            className="w-full px-3 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
            placeholder="Enter your area"
          />
          {errors.area && <p className="text-red-400 text-xs mt-1">{errors.area.message}</p>}
        </div>

          <button
            type="button"
            onClick={getLocation}
            disabled={loading || saving}
            className="w-full py-2 btn-secondary rounded-lg disabled:opacity-50"
          >
            {loading ? 'Getting location...' : '📍 Use Live Location'}
          </button>

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