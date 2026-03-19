import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { workerAPI } from '../services/api';
import BottomNav from '../components/BottomNav';

export default function Stats() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await workerAPI.getClaimStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
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
            <h1 className="text-xl font-bold text-gray-900">Earnings Stats</h1>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Total Earnings - Hero Card */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 shadow-lg relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full -ml-12 -mb-12"></div>
          </div>
          
          <div className="relative">
            <p className="text-green-100 text-xs font-medium mb-2">Total Earnings</p>
            <h2 className="text-4xl font-bold text-white mb-6">
              ₹{stats?.overall?.totalPayout?.toFixed(0) || 0}
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-green-100 text-xs mb-1">Claims</p>
                <p className="text-white text-xl font-bold">{stats?.overall?.totalClaims || 0}</p>
              </div>
              <div>
                <p className="text-green-100 text-xs mb-1">Approved</p>
                <p className="text-white text-xl font-bold">{stats?.overall?.approvedClaims || 0}</p>
              </div>
              <div>
                <p className="text-green-100 text-xs mb-1">Pending</p>
                <p className="text-white text-xl font-bold">{stats?.overall?.pendingClaims || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Average Payout */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500 rounded-full -mr-12 -mt-12"></div>
          </div>
          
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs mb-1">Average Payout</p>
              <h3 className="text-3xl font-bold text-gray-900">
                ₹{stats?.overall?.avgPayout?.toFixed(0) || 0}
              </h3>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* By Disruption Type */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h3 className="text-gray-900 font-semibold text-sm mb-4">Earnings by Type</h3>
          <div className="space-y-3">
            {stats?.byType?.map((item) => (
              <div key={item._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    item._id === 'rain' ? 'bg-blue-100' :
                    item._id === 'heat' ? 'bg-orange-100' :
                    item._id === 'aqi' ? 'bg-purple-100' :
                    'bg-gray-100'
                  }`}>
                    {item._id === 'rain' && (
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                      </svg>
                    )}
                    {item._id === 'heat' && (
                      <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    )}
                    {item._id === 'aqi' && (
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                      </svg>
                    )}
                    {item._id === 'combined' && (
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="text-gray-900 font-semibold text-sm capitalize">{item._id}</p>
                    <p className="text-gray-500 text-xs">{item.count} claims</p>
                  </div>
                </div>
                <p className="text-gray-900 font-bold text-lg">₹{item.totalAmount?.toFixed(0)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
