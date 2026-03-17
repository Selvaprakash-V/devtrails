import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useOnboarding } from '../../contexts/OnboardingContext'
import { updateOnboardingBank } from '../../services/api'

export default function BankStep({ onNext, onBack }) {
  const { state, updateField } = useOnboarding()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: state.bank
  })

  const accountNumber = watch('accountNumber')
  const confirmAccount = watch('confirmAccount')

  const onSubmit = async (data) => {
    updateField('bank', 'accountNumber', data.accountNumber)
    updateField('bank', 'confirmAccount', data.confirmAccount)
    updateField('bank', 'ifsc', data.ifsc)
    updateField('bank', 'bankName', data.bankName)
    try {
      setSaving(true)
      setError('')
      await updateOnboardingBank({
        accountNumber: data.accountNumber,
        confirmAccount: data.confirmAccount,
        ifsc: data.ifsc,
        bankName: data.bankName,
      })
      onNext()
    } catch (e) {
      setError(e.message || 'Failed to save bank details')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-[var(--text)] mb-2">Bank details</h2>
        <p className="text-sm text-[var(--text-muted)]">For secure payouts</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm text-[var(--text-muted)] mb-1">Account Number</label>
          <input
            {...register('accountNumber', {
              required: 'Account number is required',
              pattern: { value: /^\d{9,18}$/, message: 'Invalid account number' }
            })}
            type="text"
            className="w-full px-3 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
            placeholder="Enter account number"
          />
          {errors.accountNumber && <p className="text-red-400 text-xs mt-1">{errors.accountNumber.message}</p>}
        </div>

        <div>
          <label className="block text-sm text-[var(--text-muted)] mb-1">Confirm Account Number</label>
          <input
            {...register('confirmAccount', {
              required: 'Please confirm account number',
              validate: value => value === accountNumber || 'Account numbers do not match'
            })}
            type="text"
            className="w-full px-3 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
            placeholder="Re-enter account number"
          />
          {errors.confirmAccount && <p className="text-red-400 text-xs mt-1">{errors.confirmAccount.message}</p>}
        </div>

        <div>
          <label className="block text-sm text-[var(--text-muted)] mb-1">IFSC Code</label>
          <input
            {...register('ifsc', {
              required: 'IFSC code is required',
              pattern: { value: /^[A-Z]{4}0[A-Z0-9]{6}$/, message: 'Invalid IFSC code' }
            })}
            type="text"
            className="w-full px-3 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
            placeholder="e.g., SBIN0001234"
          />
          {errors.ifsc && <p className="text-red-400 text-xs mt-1">{errors.ifsc.message}</p>}
        </div>

        <div>
          <label className="block text-sm text-[var(--text-muted)] mb-1">Bank Name</label>
          <input
            {...register('bankName', { required: 'Bank name is required' })}
            type="text"
            className="w-full px-3 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
            placeholder="Enter bank name"
          />
          {errors.bankName && <p className="text-red-400 text-xs mt-1">{errors.bankName.message}</p>}
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