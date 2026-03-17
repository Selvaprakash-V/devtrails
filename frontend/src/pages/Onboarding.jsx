import React from 'react'
import { OnboardingProvider } from '../contexts/OnboardingContext'
import OnboardingContainer from '../components/onboarding/OnboardingContainer'

export default function Onboarding() {
  return (
    <OnboardingProvider>
      <OnboardingContainer />
    </OnboardingProvider>
  )
}