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

    if (otpCode !== '1234') {
      setError('Invalid OTP. Use 1234');
      return;
    }

    setLoading(true);

    try {
      const onboardingData = JSON.parse(localStorage.getItem('onboardingData') || '{}');
      
      if (!onboardingData.phone) {
        setError('Registration data missing. Please start over.');
        setLoading(false);
        setTimeout(() => navigate('/onboarding'), 2000);
        return;
      }

      try {
        const response = await workerAPI.register({
          name: onboardingData.name,
          phone: onboardingData.phone,
          city: onboardingData.city,
          platform: onboardingData.platform
        });

        localStorage.setItem('workerToken', response.token);
        localStorage.setItem('workerData', JSON.stringify(response.worker));
        navigate('/permissions');
      } catch (registerErr) {
        if (registerErr.response?.status === 400) {
          const loginResponse = await workerAPI.verifyOTP(onboardingData.phone, otpCode);
          
          localStorage.setItem('workerToken', loginResponse.token);
          localStorage.setItem('workerData', JSON.stringify(loginResponse.worker));
          navigate('/permissions');
        } else {
          throw registerErr;
        }
      }
    } catch (err) {
      console.error('Verification error:', err);
      setError(err.response?.data?.error || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Verify OTP</h1>
            <p className="text-gray-300">Enter the 4-digit code sent to your phone</p>
            <p className="text-sm text-gray-400 mt-2">(Use: 1234)</p>
          </div>

          <div className="flex justify-center gap-4 mb-6">
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
                className="w-16 h-16 text-center text-2xl font-bold rounded-xl bg-white/20 border-2 border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            ))}
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/50">
              <p className="text-red-200 text-sm text-center">{error}</p>
            </div>
          )}

          <button
            onClick={handleVerify}
            disabled={loading}
            className="w-full p-4 rounded-xl bg-indigo-600 text-white font-semibold shadow-lg hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify & Continue'}
          </button>

          <button
            onClick={() => navigate('/onboarding')}
            className="w-full mt-4 p-4 rounded-xl bg-white/10 text-white font-semibold border border-white/30"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
