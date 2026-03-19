import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestLocationPermission } from '../services/location';
import { workerAPI } from '../services/api';

export default function Permissions() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAllowLocation = async () => {
    setLoading(true);
    setError('');

    try {
      const location = await requestLocationPermission();
      
      await workerAPI.updateLocation(location.lat, location.lng);
      
      localStorage.setItem('locationPermission', 'granted');
      navigate('/dashboard');
    } catch (err) {
      if (err.code === 1) {
        setError('Location permission denied. Please enable it in your browser settings.');
      } else if (err.code === 2) {
        setError('Location unavailable. Please check your device settings.');
      } else if (err.code === 3) {
        setError('Location request timeout. Please try again.');
      } else {
        setError('Unable to access location. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Location Access</h1>
            <p className="text-gray-600 text-sm leading-relaxed">
              Allow location access to protect your income during disruptions
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 mb-6">
            <h3 className="text-gray-900 font-semibold text-sm mb-4">Why we need this:</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-700 text-sm">Detect disruptions in your area</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-700 text-sm">Calculate accurate compensation</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-700 text-sm">Prevent fraud and ensure fair payouts</span>
              </li>
            </ul>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <button
            onClick={handleAllowLocation}
            disabled={loading}
            className="w-full py-4 bg-indigo-600 text-white font-semibold rounded-xl shadow-sm hover:bg-indigo-700 transition disabled:opacity-50 mb-3"
          >
            {loading ? 'Requesting Access...' : 'Allow Location Access'}
          </button>

          <p className="text-center text-gray-500 text-xs">
            Your location data is encrypted and used only for insurance purposes
          </p>
        </div>
      </div>
    </div>
  );
}
