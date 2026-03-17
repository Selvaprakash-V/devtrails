import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useOnboarding } from '../../contexts/OnboardingContext'

export default function AuthStep({ onNext, onBack }) {
  const { state, setPhone, setOtp: setOtpContext } = useOnboarding()
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [timer, setTimer] = useState(0)
  const [error, setError] = useState('')

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { phone: state.phone }
  })

  const sendOTP = async (phone) => {
    // Simulate API call
    console.log('Sending OTP to', phone)
    setOtpSent(true)
    setTimer(30)
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const verifyOTP = async () => {
    if (otp.length !== 4) {
      setError('Please enter 4-digit OTP')
      return
    }
    // Simulate verification
    if (otp === '1234') { // Mock success
      setPhone(state.phone)
      setOtpContext(otp)
      onNext()
    } else {
      setError('Invalid OTP')
    }
  }

  const onSubmit = (data) => {
    setPhone(data.phone)
    sendOTP(data.phone)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-slate-50 mb-2">Verify your phone</h2>
        <p className="text-sm text-slate-400">We'll send an OTP to confirm your number</p>
      </div>

      {!otpSent ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-300 mb-1">Phone Number</label>
            <div className="flex">
              <span className="inline-flex items-center px-3 bg-slate-700 border border-r-0 border-slate-600 rounded-l-lg text-slate-300">
                +91
              </span>
              <input
                {...register('phone', {
                  required: 'Phone number is required',
                  pattern: { value: /^[6-9]\d{9}$/, message: 'Invalid phone number' }
                })}
                type="tel"
                className="flex-1 px-3 py-2 bg-slate-800 border border-slate-600 rounded-r-lg text-slate-200 focus:border-sky-400 focus:outline-none"
                placeholder="Enter 10-digit number"
              />
            </div>
            {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
          </div>

          <button type="submit" className="w-full py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors">
            Send OTP
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-300 mb-1">Enter OTP sent to +91{state.phone}</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 text-center text-lg tracking-widest focus:border-sky-400 focus:outline-none"
              placeholder="0000"
            />
            {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
          </div>

          <button
            onClick={verifyOTP}
            className="w-full py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
          >
            Verify OTP
          </button>

          <div className="text-center">
            {timer > 0 ? (
              <p className="text-sm text-slate-400">Resend OTP in {timer}s</p>
            ) : (
              <button
                onClick={() => sendOTP(state.phone)}
                className="text-sm text-sky-400 hover:text-sky-300"
              >
                Resend OTP
              </button>
            )}
          </div>
        </div>
      )}

      {otpSent && (
        <button onClick={onBack} className="w-full py-2 text-slate-400 hover:text-slate-300">
          Change Number
        </button>
      )}
    </div>
  )
}