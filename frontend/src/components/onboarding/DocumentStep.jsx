import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useOnboarding } from '../../contexts/OnboardingContext'

const idTypes = ['Aadhaar', 'PAN', 'Voter ID']

export default function DocumentStep({ onNext, onBack }) {
  const { state, updateField } = useOnboarding()
  const [file, setFile] = useState(null)

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: state.document
  })

  const onSubmit = (data) => {
    updateField('document', 'idType', data.idType)
    updateField('document', 'idNumber', data.idNumber)
    updateField('document', 'file', file)
    // Submit to backend
    console.log('Submitting onboarding data:', state)
    // Simulate API call
    setTimeout(() => {
      alert('Onboarding completed successfully!')
      // Reset or redirect
    }, 1000)
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile && selectedFile.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }
    setFile(selectedFile)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-slate-50 mb-2">Document verification</h2>
        <p className="text-sm text-slate-400">Upload ID for verification</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm text-slate-300 mb-1">ID Type</label>
          <select
            {...register('idType', { required: 'ID type is required' })}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 focus:border-sky-400 focus:outline-none"
          >
            <option value="">Select ID type</option>
            {idTypes.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
          {errors.idType && <p className="text-red-400 text-xs mt-1">{errors.idType.message}</p>}
        </div>

        <div>
          <label className="block text-sm text-slate-300 mb-1">ID Number</label>
          <input
            {...register('idNumber', { required: 'ID number is required' })}
            type="text"
            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 focus:border-sky-400 focus:outline-none"
            placeholder="Enter ID number"
          />
          {errors.idNumber && <p className="text-red-400 text-xs mt-1">{errors.idNumber.message}</p>}
        </div>

        <div>
          <label className="block text-sm text-slate-300 mb-1">Upload Document (Optional)</label>
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileChange}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:bg-sky-600 file:text-white"
          />
          {file && <p className="text-xs text-slate-400 mt-1">Selected: {file.name}</p>}
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
            className="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Complete Onboarding
          </button>
        </div>
      </form>
    </div>
  )
}