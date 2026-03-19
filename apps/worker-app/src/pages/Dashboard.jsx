import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { workerAPI } from '../services/api';
import { watchLocation, stopWatchingLocation } from '../services/location';
import BottomNav from '../components/BottomNav';

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    const watchId = watchLocation((location) => {
      setCurrentLocation(location);
      loadDashboard(location.lat, location.lng, true);
    });

    return () => {
      stopWatchingLocation(watchId);
    };
  }, []);

  const loadDashboard = async (lat, lng, silent = false) => {
    if (!lat || !lng) return;
    
    if (!silent) setLoading(true);
    else setRefreshing(true);

    try {
      const dashboardData = await workerAPI.getDashboard(lat, lng);
      setData(dashboardData);
      
      if (dashboardData.spoofCheck?.isSpoofed) {
        const history = JSON.parse(localStorage.getItem('spoofHistory') || '[]');
        history.unshift({
          timestamp: new Date().toISOString(),
          distance: dashboardData.spoofCheck.distance,
          gpsLocation: dashboardData.spoofCheck.gpsLocation,
          ipLocation: dashboardData.spoofCheck.ipLocation
        });
        localStorage.setItem('spoofHistory', JSON.stringify(history.slice(0, 10)));
      }
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getRiskColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'high': return 'bg-gradient-to-br from-red-500 to-red-600';
      case 'medium': return 'bg-gradient-to-br from-orange-500 to-orange-600';
      case 'low': return 'bg-gradient-to-br from-green-500 to-green-600';
      default: return 'bg-gradient-to-br from-gray-500 to-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex flex-col items-center justify-center p-8">
        <div className="text-center">
          {/* Enhanced Loading Animation */}
          <div className="relative w-40 h-40 mx-auto mb-8">
            {/* Outer rotating ring */}
            <div className="absolute inset-0 border-4 border-indigo-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
            
            {/* Middle rotating ring */}
            <div className="absolute inset-3 border-4 border-purple-200 rounded-full"></div>
            <div className="absolute inset-3 border-4 border-purple-600 rounded-full border-r-transparent animate-spin" style={{ animationDuration: '1.5s' }}></div>
            
            {/* Inner rotating ring */}
            <div className="absolute inset-6 border-4 border-pink-200 rounded-full"></div>
            <div className="absolute inset-6 border-4 border-pink-600 rounded-full border-b-transparent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '2s' }}></div>
            
            {/* Center icon with pulse */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-400 rounded-full animate-ping opacity-20"></div>
                <svg className="w-14 h-14 text-indigo-600 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-3 animate-pulse">Getting your location...</h3>
          <p className="text-gray-600 text-base mb-4">Please wait as we get your information</p>
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 max-w-md mx-auto border border-indigo-100 shadow-lg">
            <p className="text-indigo-700 text-sm italic leading-relaxed">
              "Protecting your income, one location at a time"
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-900 text-lg mb-4">Unable to load dashboard</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">{data.worker?.name || 'Worker'}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-xs font-medium">
                  {data.worker?.platform?.toUpperCase()}
                </span>
                <span className="text-gray-500 text-xs flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  {data.worker?.city}
                </span>
              </div>
            </div>
            <button
              onClick={() => currentLocation && loadDashboard(currentLocation.lat, currentLocation.lng)}
              disabled={refreshing}
              className="p-2.5 bg-gray-100 rounded-xl hover:bg-gray-200 transition"
            >
              <svg className={`w-5 h-5 text-gray-700 ${refreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* GPS Spoofing Alert */}
        {data.spoofCheck?.isSpoofed && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-red-900 font-semibold text-sm mb-1">GPS Spoofing Detected</h4>
                <p className="text-red-700 text-xs leading-relaxed mb-2">
                  Location mismatch: {data.spoofCheck.distance}km difference detected
                </p>
                <button
                  onClick={() => navigate('/fraud-flags')}
                  className="text-red-600 text-xs font-medium"
                >
                  View Details →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Risk Card - Primary */}
        <div className={`${getRiskColor(data.risk?.level)} rounded-2xl p-5 shadow-lg relative overflow-hidden`}>
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full -ml-12 -mb-12"></div>
          </div>
          
          <div className="relative">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-white/80 text-xs font-medium mb-1">Risk Level</p>
                <h2 className="text-3xl font-bold text-white">
                  {data.risk?.level?.toUpperCase() || 'UNKNOWN'}
                </h2>
              </div>
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-white/20">
              <span className="text-white/80 text-xs">Risk Score</span>
              <span className="text-white text-xl font-bold">{data.risk?.score || 0}/100</span>
            </div>
          </div>
        </div>

        {/* Earnings Card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-500 rounded-full -mr-12 -mt-12"></div>
          </div>
          
          <div className="relative">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-gray-500 text-xs mb-1">Expected Daily Earnings</p>
                <h3 className="text-3xl font-bold text-gray-900">
                  ₹{data.earnings?.expectedDaily?.toFixed(0) || '0'}
                </h3>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Environmental Conditions */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="text-gray-900 font-semibold text-sm mb-4">Environmental Conditions</h3>
          <div className="grid grid-cols-2 gap-3">
            {/* Rainfall */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-blue-200/30 rounded-full -mr-8 -mt-8"></div>
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                    </svg>
                  </div>
                  <p className="text-blue-900 text-xs font-medium">Rainfall</p>
                </div>
                <p className="text-blue-900 text-2xl font-bold mb-1">{data.weather?.rainfall || 0}mm</p>
                <p className="text-blue-700 text-xs">Humidity: {data.weather?.humidity || 0}%</p>
              </div>
            </div>

            {/* Temperature */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl p-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-orange-200/30 rounded-full -mr-8 -mt-8"></div>
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <p className="text-orange-900 text-xs font-medium">Temperature</p>
                </div>
                <p className="text-orange-900 text-2xl font-bold mb-1">{data.weather?.temperature || 0}°C</p>
                <p className="text-orange-700 text-xs">{data.weather?.condition || 'Clear'}</p>
              </div>
            </div>

            {/* AQI */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-purple-200/30 rounded-full -mr-8 -mt-8"></div>
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                    </svg>
                  </div>
                  <p className="text-purple-900 text-xs font-medium">Air Quality</p>
                </div>
                <p className="text-purple-900 text-2xl font-bold mb-1">{data.weather?.aqi || 0}</p>
                <p className="text-purple-700 text-xs">
                  {data.weather?.aqi <= 50 ? 'Good' :
                   data.weather?.aqi <= 200 ? 'Moderate' :
                   data.weather?.aqi <= 300 ? 'Unhealthy' : 'Hazardous'}
                </p>
              </div>
            </div>

            {/* Traffic */}
            <div className="bg-gradient-to-br from-red-50 to-red-100/50 rounded-xl p-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-red-200/30 rounded-full -mr-8 -mt-8"></div>
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <p className="text-red-900 text-xs font-medium">Traffic</p>
                </div>
                <p className="text-red-900 text-2xl font-bold mb-1">
                  {data.weather?.traffic === 0 ? 'Clear' :
                   data.weather?.traffic <= 30 ? 'Light' :
                   data.weather?.traffic <= 60 ? 'Moderate' : 'Heavy'}
                </p>
                <div className="flex gap-1">
                  <div className={`h-1.5 flex-1 rounded-full ${data.weather?.traffic >= 20 ? 'bg-red-500' : 'bg-red-200'}`}></div>
                  <div className={`h-1.5 flex-1 rounded-full ${data.weather?.traffic >= 40 ? 'bg-red-500' : 'bg-red-200'}`}></div>
                  <div className={`h-1.5 flex-1 rounded-full ${data.weather?.traffic >= 60 ? 'bg-red-500' : 'bg-red-200'}`}></div>
                  <div className={`h-1.5 flex-1 rounded-full ${data.weather?.traffic >= 80 ? 'bg-red-500' : 'bg-red-200'}`}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* High Risk Alert */}
        {data.risk?.level === 'high' && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-red-900 font-semibold text-sm mb-1">High Risk Alert</h4>
                <p className="text-red-700 text-xs leading-relaxed">
                  Severe conditions detected. Your insurance is active and will process claims automatically.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
