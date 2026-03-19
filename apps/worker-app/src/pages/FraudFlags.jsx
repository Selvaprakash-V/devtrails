import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { workerAPI } from '../services/api';
import BottomNav from '../components/BottomNav';

export default function FraudFlags() {
  const navigate = useNavigate();
  const [flags, setFlags] = useState([]);

  useEffect(() => {
    loadFlags();
  }, []);

  const loadFlags = async () => {
    try {
      const data = await workerAPI.getFraudFlags();
      setFlags(data);
    } catch (error) {
      console.error('Failed to load fraud flags:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-xl transition"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-gray-900">Fraud Detection</h1>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <div className="flex gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="text-blue-900 font-semibold text-sm mb-2">How Detection Works</h4>
              <p className="text-blue-700 text-xs leading-relaxed mb-3">
                We compare your GPS location with your IP-based location. If the distance exceeds 50km, a flag is raised.
              </p>
              <div className="bg-white rounded-xl p-3 space-y-2">
                <p className="text-blue-900 text-xs font-medium">What triggers a flag:</p>
                <ul className="space-y-1 text-blue-700 text-xs">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>GPS and IP differ by more than 50km</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Frequent IP address changes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Unrealistic speed between locations</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Flags List */}
        {flags.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-900 font-semibold text-sm">No fraud flags detected</p>
            <p className="text-gray-500 text-xs mt-1">Your account is in good standing</p>
          </div>
        ) : (
          <div className="space-y-3">
            <h3 className="text-gray-900 font-semibold text-sm">Detection History</h3>
            {flags.map((flag, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-4 border border-red-200 shadow-sm"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-gray-900 font-semibold text-sm mb-1">GPS Spoofing Detected</h4>
                    <p className="text-gray-500 text-xs">
                      {new Date(flag.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="bg-red-50 rounded-xl p-3 space-y-3">
                  <div>
                    <p className="text-red-700 text-xs font-medium mb-1">Distance Mismatch</p>
                    <p className="text-red-900 text-2xl font-bold">{flag.distance} km</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-red-200">
                    <div>
                      <p className="text-red-700 text-xs mb-1">GPS Location</p>
                      <p className="text-red-900 text-xs font-mono">
                        {flag.gpsLocation?.lat?.toFixed(4)}, {flag.gpsLocation?.lng?.toFixed(4)}
                      </p>
                    </div>
                    <div>
                      <p className="text-red-700 text-xs mb-1">IP Location</p>
                      <p className="text-red-900 text-xs font-mono">
                        {flag.ipLocation?.lat?.toFixed(4)}, {flag.ipLocation?.lng?.toFixed(4)}
                      </p>
                    </div>
                  </div>

                  {flag.ipLocation?.city && (
                    <div className="pt-3 border-t border-red-200">
                      <p className="text-red-700 text-xs mb-1">IP City</p>
                      <p className="text-red-900 text-sm font-medium">{flag.ipLocation.city}</p>
                    </div>
                  )}
                </div>

                <div className="mt-3 bg-yellow-50 rounded-xl p-3 border border-yellow-200">
                  <p className="text-yellow-800 text-xs">
                    <span className="font-semibold">⚠️ Warning:</span> Multiple flags may result in account suspension.
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Prevention Tips */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h3 className="text-gray-900 font-semibold text-sm mb-4">How to Avoid False Flags</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-gray-700 text-sm">Ensure your device's GPS is enabled and accurate</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-gray-700 text-sm">Don't use VPN or proxy services</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-gray-700 text-sm">Avoid location spoofing apps</span>
            </li>
          </ul>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
