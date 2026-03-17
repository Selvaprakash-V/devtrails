import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useOnboarding } from '../../contexts/OnboardingContext'
import { updateOnboardingDocuments } from '../../services/api'

const primaryIdTypes = ['Aadhaar', 'Voter ID']

export default function DocumentStep({ onNext, onBack }) {
  const { state, updateField } = useOnboarding()
  const [primaryFile, setPrimaryFile] = useState(state.document.primaryIdFile)
  const [panFile, setPanFile] = useState(state.document.panFile)
  const [licenseFile, setLicenseFile] = useState(state.document.licenseFile)
  const [fileErrors, setFileErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: state.document
  })

  const handleFileChange = (e, setter) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return
    if (selectedFile.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }
    setter(selectedFile)
  }

  const onSubmit = async (data) => {
    const errors = {}
    if (!primaryFile) errors.primaryFile = 'Primary ID document is required'
    if (!panFile) errors.panFile = 'PAN document is required'
    if (!licenseFile) errors.licenseFile = 'License document is required'
    if (Object.keys(errors).length) {
      setFileErrors(errors)
      return
    }

    setFileErrors({})
    updateField('document', 'primaryIdType', data.primaryIdType)
    updateField('document', 'primaryIdNumber', data.primaryIdNumber)
    updateField('document', 'primaryIdFile', primaryFile)
    updateField('document', 'panNumber', data.panNumber)
    updateField('document', 'panFile', panFile)
    updateField('document', 'licenseNumber', data.licenseNumber)
    updateField('document', 'licenseFile', licenseFile)

    try {
      setSaving(true)
      setError('')
      await updateOnboardingDocuments({
        primaryIdType: data.primaryIdType,
        primaryIdNumber: data.primaryIdNumber,
      })
      alert('Onboarding completed successfully!')
      // Optionally: redirect to dashboard or reset flow here
    } catch (e) {
      setError(e.message || 'Failed to submit documents')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-slate-50 mb-2">Document verification</h2>
        <p className="text-sm text-slate-400">Upload required ID documents</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm text-slate-300 mb-1">Primary ID (Aadhaar or Voter)</label>
          <select
            {...register('primaryIdType', { required: 'Primary ID type is required' })}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 focus:border-sky-400 focus:outline-none"
          >
            <option value="">Select ID type</option>
            {primaryIdTypes.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
          {errors.primaryIdType && <p className="text-red-400 text-xs mt-1">{errors.primaryIdType.message}</p>}
        </div>

        <div>
          <label className="block text-sm text-slate-300 mb-1">Primary ID Number</label>
          <input
            {...register('primaryIdNumber', { required: 'Primary ID number is required' })}
            type="text"
            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 focus:border-sky-400 focus:outline-none"
            placeholder="Enter primary ID number"
          />
          {errors.primaryIdNumber && <p className="text-red-400 text-xs mt-1">{errors.primaryIdNumber.message}</p>}
        </div>

        <div>
          <label className="block text-sm text-slate-300 mb-1">Upload Primary ID document</label>
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => handleFileChange(e, setPrimaryFile)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:bg-sky-600 file:text-white"
          />
          {!primaryFile && fileErrors.primaryFile && <p className="text-red-400 text-xs mt-1">{fileErrors.primaryFile}</p>}
          {primaryFile && <p className="text-xs text-slate-400 mt-1">Selected: {primaryFile.name}</p>}
        </div>

        <div>
          <label className="block text-sm text-slate-300 mb-1">PAN Number</label>
          <input
            {...register('panNumber', { required: 'PAN number is required' })}
            type="text"
            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 focus:border-sky-400 focus:outline-none"
            placeholder="Enter PAN number"
          />
          {errors.panNumber && <p className="text-red-400 text-xs mt-1">{errors.panNumber.message}</p>}
        </div>

        <div>
          <label className="block text-sm text-slate-300 mb-1">Upload PAN document</label>
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => handleFileChange(e, setPanFile)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:bg-sky-600 file:text-white"
          />
          {!panFile && fileErrors.panFile && <p className="text-red-400 text-xs mt-1">{fileErrors.panFile}</p>}
          {panFile && <p className="text-xs text-slate-400 mt-1">Selected: {panFile.name}</p>}
        </div>

        <div>
          <label className="block text-sm text-slate-300 mb-1">Driving License Number</label>
          <input
            {...register('licenseNumber', { required: 'License number is required' })}
            type="text"
            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 focus:border-sky-400 focus:outline-none"
            placeholder="Enter license number"
          />
          {errors.licenseNumber && <p className="text-red-400 text-xs mt-1">{errors.licenseNumber.message}</p>}
        </div>

        <div>
          <label className="block text-sm text-slate-300 mb-1">Upload License document</label>
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => handleFileChange(e, setLicenseFile)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:bg-sky-600 file:text-white"
          />
          {!licenseFile && fileErrors.licenseFile && <p className="text-red-400 text-xs mt-1">{fileErrors.licenseFile}</p>}
          {licenseFile && <p className="text-xs text-slate-400 mt-1">Selected: {licenseFile.name}</p>}
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
            className="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-60"
          >
            {saving ? 'Submitting...' : 'Complete Onboarding'}
          </button>
        </div>
      </form>

      {error && <p className="text-red-400 text-xs text-center mt-2">{error}</p>}
    </div>
  )
}