import React from 'react'
import { useOnboarding } from '../../contexts/OnboardingContext'

const languages = ['English', 'Hindi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam']

export default function LanguageStep({ onNext }) {
  const { setLanguage } = useOnboarding()

  const handleSelect = (lang) => {
    setLanguage(lang)
    onNext()
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-slate-50 mb-2">Choose your language</h2>
        <p className="text-sm text-slate-400">Select your preferred language for the app</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {languages.map((lang) => (
          <button
            key={lang}
            onClick={() => handleSelect(lang)}
            className="p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 hover:bg-slate-700 hover:border-sky-400 transition-colors"
          >
            {lang}
          </button>
        ))}
      </div>
    </div>
  )
}