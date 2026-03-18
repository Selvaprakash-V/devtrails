import React, { useState } from 'react'
import { useOnboarding } from '../../contexts/OnboardingContext'
import CardSelector from './ui/CardSelector'
import Button from './ui/Button'

const languages = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'Hindi' },
  { value: 'ta', label: 'Tamil' },
  { value: 'te', label: 'Telugu' },
  { value: 'kn', label: 'Kannada' },
  { value: 'ml', label: 'Malayalam' },
]

export default function LanguageStep({ onNext }) {
  const { setLanguage } = useOnboarding()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(null)

  const handleSelect = async (lang) => {
    try {
      setLoading(true)
      setError('')
      setSelected(lang)
      // persist
      setLanguage(lang)
      // small delay for nicer microinteraction
      setTimeout(() => onNext(), 220)
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

      <CardSelector
        options={languages.map((l) => ({ value: l.value, label: l.label }))}
        selected={selected}
        onSelect={handleSelect}
      />

      {error && <p className="text-red-400 text-xs text-center">{error}</p>}

      <div className="pt-2">
        <Button variant="secondary" className="w-full" onClick={() => handleSelect('en')}>
          Continue in English
        </Button>
      </div>
    </div>
  )
}