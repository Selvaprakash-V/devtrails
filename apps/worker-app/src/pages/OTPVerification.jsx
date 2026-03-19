import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { workerAPI } from '../services/api';

export default function OTPVerification() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [generatedOTP, setGeneratedOTP] = useState('');
  const [showOTPPopup, setShowOTPPopup] = useState(false);
  const inputRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  useEffect(() => {
    const onboardingData = JSON.parse(localStorage.getItem('onboardingData') || '{}');
    const phone = onboardingData.phone;
    
    if (!phone) {
      setError('Phone number missing');
      return;
    }

    const formattedPhone = phone.startsWith('+91') ? phone : `+91${phone}`;
    setPhoneNumber(formattedPhone);

    // Generate random 6-digit OTP
    const randomOTP = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOTP(randomOTP);
    
    // Show popup with OTP
    setShowOTPPopup(true);
  }, []);

  const handleChange = (index, value) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    if (value && index < 5) {
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
    
    if (otpCode.length !== 6) {
      setError('Please enter complete 6-digit OTP');
      return;
    }

    if (otpCode !== generatedOTP) {
      setError('Invalid OTP. Please check and try again.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const onboardingData = JSON.parse(localStorage.getItem('onboardingData') || '{}');
      
      // Register user with backend
      const response = await workerAPI.register(onboardingData);
      
      // Store token and user data, clear onboarding temp data
      localStorage.setItem('workerToken', response.token);
      localStorage.setItem('workerData', JSON.stringify(response.user));
      localStorage.removeItem('onboardingData');
      localStorage.removeItem('spoofHistory');
      
      navigate('/permissions');
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.response?.data?.error || 'Registration failed. Please try again.');
      setLoading(false);
    }
  };

  const closePopup = () => {
    setShowOTPPopup(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* OTP Popup */}
      {showOTPPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Your OTP Code</h2>
              <p className="text-gray-600 text-sm mb-4">Use this code to verify your phone number</p>
              
              <div className="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-4 mb-4">
                <p className="text-4xl font-bold text-indigo-600 tracking-widest">{generatedOTP}</p>
              </div>
              
              <p className="text-gray-500 text-xs">This code is valid for this session only</p>
            </div>
            
            <button
              onClick={closePopup}
              className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition"
            >
              Got it
            </button>
          </div>
        </div>
      )}

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
            <p className="text-gray-600 text-sm">Enter the code sent to {phoneNumber}</p>
          </div>

          <div className="flex justify-center gap-2 mb-6">
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
                className="w-12 h-14 text-center text-xl font-bold bg-white border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
            className="w-full py-4 bg-indigo-600 text-white font-semibold rounded-xl shadow-sm hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed mb-3"
          >
            {loading ? 'Verifying...' : 'Verify & Continue'}
          </button>

          <button
            onClick={() => setShowOTPPopup(true)}
            className="w-full py-3 text-indigo-600 font-medium hover:text-indigo-700 transition"
          >
            Show OTP Again
          </button>
        </div>
      </div>
    </div>
  );
}
