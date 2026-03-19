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
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">Location Access</h1>
            <p className="text-gray-300 text-lg mb-2">
              Allow location access to protect your income during disruptions
            </p>
            <p className="text-gray-400 text-sm">
              We use your location to detect weather events, traffic conditions, and air quality in your area to automatically process insurance claims.
            </p>
          </div>

          <div className="bg-white/5 rounded-2xl p-6 mb-6 border border-white/10">
            <h3 className="text-white font-semibold mb-3">Why we need this:</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Detect disruptions in your area
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Calculate accurate compensation
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Prevent fraud and ensure fair payouts
              </li>
            </ul>
          </div>

          {error && (
            <div className="mb-4 p-4 rounded-xl bg-red-500/20 border border-red-500/50">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          <button
            onClick={handleAllowLocation}
            disabled={loading}
            className="w-full p-4 rounded-xl bg-indigo-600 text-white font-semibold shadow-lg hover:bg-indigo-700 transition disabled:opacity-50 mb-3"
          >
            {loading ? 'Requesting Access...' : 'Allow Location Access'}
          </button>

          <p className="text-center text-gray-400 text-xs">
            Your location data is encrypted and used only for insurance purposes
          </p>
        </div>
      </div>
    </div>
  );
}
