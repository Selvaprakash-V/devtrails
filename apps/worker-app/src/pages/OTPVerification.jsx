import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { workerAPI } from '../services/api';

export default function OTPVerification() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];

  const handleChange = (index, value) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    if (value && index < 3) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');
    
    if (otpCode.length !== 4) {
      setError('Please enter complete OTP');
      return;
    }

    setLoading(true);
    setError('');

    const onboardingData = JSON.parse(localStorage.getItem('onboardingData') || '{}');
    
    // Always proceed with demo mode - no backend validation
    setTimeout(() => {
      localStorage.setItem('workerToken', 'demo-token-' + Date.now());
      localStorage.setItem('workerData', JSON.stringify(onboardingData));
      navigate('/permissions');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-4">
        <button
          onClick={() => navigate('/onboarding')}
          className="p-2 hover:bg-gray-100 rounded-xl transition"
        >
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Verify OTP</h1>
            <p className="text-gray-600 text-sm">Enter any 4-digit code</p>
            <p className="text-indigo-600 text-xs mt-2 font-medium">(Demo: Any 4 digits work)</p>
          </div>

          <div className="flex justify-center gap-3 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={inputRefs[index]}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-14 h-14 text-center text-2xl font-bold bg-white border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            ))}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-700 text-sm text-center">{error}</p>
            </div>
          )}

          <button
            onClick={handleVerify}
            disabled={loading}
            className="w-full py-4 bg-indigo-600 text-white font-semibold rounded-xl shadow-sm hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Verifying...' : 'Verify & Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}
