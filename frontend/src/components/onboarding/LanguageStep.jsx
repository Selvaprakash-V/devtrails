import React, { useState } from 'react'
import { useOnboarding } from '../../contexts/OnboardingContext'

const languages = ['English', 'Hindi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam']

export default function LanguageStep({ onNext }) {
  const { setLanguage } = useOnboarding()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSelect = async (lang) => {
    try {
      setLoading(true)
      setError('')
      setLanguage(lang)
      onNext()
    } catch (e) {
      setError(e.message || 'Failed to save language')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-[var(--text)] mb-2">Choose your language</h2>
        <p className="text-sm text-[var(--text-muted)]">Select your preferred language for the app</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {languages.map((lang) => (
          <button
            key={lang}
            onClick={() => handleSelect(lang)}
            disabled={loading}
            className="p-4 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] hover:bg-[var(--card)] hover:border-[var(--accent)] transition-colors disabled:opacity-60"
          >
            {lang}
          </button>
        ))}
      </div>

      {error && <p className="text-red-400 text-xs text-center">{error}</p>}
    </div>
  )
}