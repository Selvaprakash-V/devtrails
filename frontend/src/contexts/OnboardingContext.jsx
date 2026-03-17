import React, { createContext, useContext, useReducer, useEffect } from 'react'

const OnboardingContext = createContext()

const initialState = {
  currentStep: 0,
  language: 'English',
  phone: '',
  otp: '',
  location: { city: '', area: '', lat: null, lng: null },
  workSettings: { vehicleType: '', workArea: '', workTime: [] },
  earnings: { platform: '', dailyEarnings: '', workDays: 5 },
  profile: { fullName: '', age: '', gender: '' },
  bank: { accountNumber: '', confirmAccount: '', ifsc: '', bankName: '' },
  document: { idType: '', idNumber: '', file: null }
}

const STORAGE_KEY = 'devtrails_onboarding'

function onboardingReducer(state, action) {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.payload }
    case 'UPDATE_FIELD':
      // For nested objects like location, profile, bank, etc.
      return {
        ...state,
        [action.section]: {
          ...state[action.section],
          [action.field]: action.value,
        },
      }
    case 'SET_PHONE':
      return { ...state, phone: action.payload }
    case 'SET_OTP':
      return { ...state, otp: action.payload }
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload }
    case 'HYDRATE':
      return { ...state, ...action.payload }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

export function OnboardingProvider({ children }) {
  const [state, dispatch] = useReducer(onboardingReducer, initialState)

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        dispatch({ type: 'HYDRATE', payload: parsed })
      } catch (e) {
        console.error('Failed to load onboarding data', e)
      }
    }
  }, [])

  // Save to localStorage on state change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const setStep = (step) => dispatch({ type: 'SET_STEP', payload: step })
  const updateField = (section, field, value) => dispatch({ type: 'UPDATE_FIELD', section, field, value })
  const setPhone = (phone) => dispatch({ type: 'SET_PHONE', payload: phone })
  const setOtp = (otp) => dispatch({ type: 'SET_OTP', payload: otp })
  const setLanguage = (lang) => dispatch({ type: 'SET_LANGUAGE', payload: lang })
  const reset = () => dispatch({ type: 'RESET' })

  return (
    <OnboardingContext.Provider value={{ state, setStep, updateField, setLanguage, setPhone, setOtp, reset }}>
      {children}
    </OnboardingContext.Provider>
  )
}

export function useOnboarding() {
  const context = useContext(OnboardingContext)
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider')
  }
  return context
}