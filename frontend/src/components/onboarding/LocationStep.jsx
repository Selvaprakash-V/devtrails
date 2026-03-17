import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useOnboarding } from '../../contexts/OnboardingContext'

const cities = ['Chennai', 'Bangalore', 'Delhi', 'Mumbai', 'Hyderabad', 'Pune']

export default function LocationStep({ onNext, onBack }) {
  const { state, updateField } = useOnboarding()
  const [loading, setLoading] = useState(false)

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

  const onSubmit = (data) => {
    updateField('location', 'city', data.city)
    updateField('location', 'area', data.area)
    onNext()
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-slate-50 mb-2">Your location</h2>
        <p className="text-sm text-slate-400">Help us understand where you work</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm text-slate-300 mb-1">City</label>
          <select
            {...register('city', { required: 'City is required' })}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 focus:border-sky-400 focus:outline-none"
          >
            <option value="">Select city</option>
            {cities.map(city => <option key={city} value={city}>{city}</option>)}
          </select>
          {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city.message}</p>}
        </div>

        <div>
          <label className="block text-sm text-slate-300 mb-1">Area/Zone</label>
          <input
            {...register('area', { required: 'Area is required' })}
            type="text"
            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 focus:border-sky-400 focus:outline-none"
            placeholder="Enter your area"
          />
          {errors.area && <p className="text-red-400 text-xs mt-1">{errors.area.message}</p>}
        </div>

        <button
          type="button"
          onClick={getLocation}
          disabled={loading}
          className="w-full py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors disabled:opacity-50"
        >
          {loading ? 'Getting location...' : '📍 Use Live Location'}
        </button>

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
            className="flex-1 py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  )
}