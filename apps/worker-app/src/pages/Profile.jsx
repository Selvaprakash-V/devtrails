import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { workerAPI } from '../services/api';
import BottomNav from '../components/BottomNav';

export default function Profile() {
  const navigate = useNavigate();
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await workerAPI.getProfile();
      setWorker(data);
      
      const onboardingData = localStorage.getItem('onboardingData');
      if (onboardingData) {
        const parsed = JSON.parse(onboardingData);
        setWorker(prev => ({ ...prev, ...parsed }));
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

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
            <h1 className="text-xl font-bold text-gray-900">Profile</h1>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Profile Header Card */}
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-6 shadow-lg relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full -ml-12 -mb-12"></div>
          </div>
          
          <div className="relative flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center flex-shrink-0">
              <span className="text-3xl font-bold text-indigo-600">
                {worker?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white">{worker?.name}</h2>
              <p className="text-indigo-100 text-sm">{worker?.phone}</p>
            </div>
          </div>
        </div>

        {/* Personal Details */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h3 className="text-gray-900 font-semibold text-sm mb-4">Personal Details</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-500 text-sm">Phone</span>
              <span className="text-gray-900 font-medium text-sm">{worker?.phone}</span>
            </div>
            <div className="h-px bg-gray-100"></div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-500 text-sm">Platform</span>
              <span className="text-gray-900 font-medium text-sm capitalize">{worker?.platform}</span>
            </div>
            <div className="h-px bg-gray-100"></div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-500 text-sm">City</span>
              <span className="text-gray-900 font-medium text-sm">{worker?.city}</span>
            </div>
            <div className="h-px bg-gray-100"></div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-500 text-sm">Vehicle</span>
              <span className="text-gray-900 font-medium text-sm capitalize">{worker?.vehicleType || 'N/A'}</span>
            </div>
            <div className="h-px bg-gray-100"></div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-500 text-sm">License Number</span>
              <span className="text-gray-900 font-medium text-sm">{worker?.licenseNumber || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Account Status */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h3 className="text-gray-900 font-semibold text-sm mb-4">Account Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-500 text-sm">Trust Score</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      worker?.trustScore >= 80 ? 'bg-green-500' :
                      worker?.trustScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${worker?.trustScore || 100}%` }}
                  ></div>
                </div>
                <span className={`font-semibold text-sm ${
                  worker?.trustScore >= 80 ? 'text-green-600' :
                  worker?.trustScore >= 50 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {worker?.trustScore || 100}/100
                </span>
              </div>
            </div>
            <div className="h-px bg-gray-100"></div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-500 text-sm">Plan</span>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-medium capitalize">
                {worker?.plan?.type || 'Basic'}
              </span>
            </div>
            <div className="h-px bg-gray-100"></div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-500 text-sm">Status</span>
              <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
                worker?.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
              }`}>
                {worker?.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>

        {/* Work Details */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h3 className="text-gray-900 font-semibold text-sm mb-4">Work Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-gray-500 text-xs mb-1">Avg Orders/Day</p>
              <p className="text-gray-900 text-xl font-bold">{worker?.avgOrdersPerDay || 0}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-gray-500 text-xs mb-1">Payout/Order</p>
              <p className="text-gray-900 text-xl font-bold">₹{worker?.payoutPerOrder || 0}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-gray-500 text-xs mb-1">Working Hours</p>
              <p className="text-gray-900 text-xl font-bold">{worker?.workingHours || 0}h</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-gray-500 text-xs mb-1">GPS Status</p>
              <p className={`text-sm font-bold capitalize ${
                worker?.gpsStatus === 'active' ? 'text-green-600' :
                worker?.gpsStatus === 'weak' ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {worker?.gpsStatus || 'Offline'}
              </p>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full py-4 bg-red-50 text-red-600 font-semibold rounded-xl border border-red-200 hover:bg-red-100 transition"
        >
          Logout
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
