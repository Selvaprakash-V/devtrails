import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useOnboarding } from '../../contexts/OnboardingContext'
import ProgressBar from './ProgressBar'
import LanguageStep from './LanguageStep'
import AuthStep from './AuthStep'
import LocationStep from './LocationStep'
import WorkSettingsStep from './WorkSettingsStep'
import ProfileStep from './ProfileStep'
import BankStep from './BankStep'
import DocumentStep from './DocumentStep'

const stepConfigs = [
  { key: 'language', component: LanguageStep },
  { key: 'phone', component: AuthStep },
  { key: 'location', component: LocationStep },
  { key: 'work', component: WorkSettingsStep },
  { key: 'profile', component: ProfileStep },
  { key: 'bank', component: BankStep },
  { key: 'documents', component: DocumentStep },
]

export default function OnboardingContainer() {
  const { state, setStep } = useOnboarding()
  const location = useLocation()
  const navigate = useNavigate()

  // Sync URL -> step index
  useEffect(() => {
    const segments = location.pathname.split('/')
    const key = segments[2] || 'language'
    const index = stepConfigs.findIndex((s) => s.key === key)

    if (index === -1) {
      navigate('/onboarding/language', { replace: true })
      return
    }

    if (index !== state.currentStep) {
      setStep(index)
    }
  }, [location.pathname, navigate, setStep, state.currentStep])

  const handleNext = () => {
    const isLast = state.currentStep === stepConfigs.length - 1
    if (isLast) {
      try {
        localStorage.setItem('devtrails_onboarding_complete', 'true')
      } catch (e) {
        // ignore storage errors
      }
      navigate('/dashboard')
      return
    }

    const nextIndex = state.currentStep + 1
    setStep(nextIndex)
    navigate(`/onboarding/${stepConfigs[nextIndex].key}`)
  }

  const handleBack = () => {
    if (state.currentStep > 0) {
      const prevIndex = state.currentStep - 1
      setStep(prevIndex)
      navigate(`/onboarding/${stepConfigs[prevIndex].key}`)
    }
  }

  const CurrentStepComponent = stepConfigs[state.currentStep].component

  return (
    <div className="min-h-screen bg-[var(--bg-muted)] text-[var(--text)] p-4 flex items-stretch">
      <div className="w-full max-w-md mx-auto flex flex-col gap-3">
        <ProgressBar currentStep={state.currentStep} />

        <div className="flex-1 flex">
          <div className="card-glass border border-[var(--border)] rounded-2xl p-5 shadow-xl w-full flex flex-col relative overflow-hidden">
            <AnimatePresence mode="wait" custom={state.currentStep}>
              <motion.div
                key={state.currentStep}
                initial={{ opacity: 0, x: 25, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -25, scale: 0.98 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="flex-1 flex flex-col w-full h-full"
              >
                <CurrentStepComponent onNext={handleNext} onBack={handleBack} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}