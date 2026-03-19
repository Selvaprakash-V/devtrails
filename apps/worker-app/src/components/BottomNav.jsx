import { useNavigate, useLocation } from 'react-router-dom';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 safe-area-bottom z-50">
      <div className="flex justify-around px-1 py-3">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex flex-col items-center gap-1 min-w-[60px]"
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            isActive('/dashboard') ? 'bg-indigo-100' : 'bg-gray-100'
          }`}>
            <svg className={`w-5 h-5 ${
              isActive('/dashboard') ? 'text-indigo-600' : 'text-gray-600'
            }`} fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
          </div>
          <span className={`text-xs font-medium ${
            isActive('/dashboard') ? 'text-indigo-600' : 'text-gray-600'
          }`}>Home</span>
        </button>

        <button
          onClick={() => navigate('/payouts')}
          className="flex flex-col items-center gap-1 min-w-[60px]"
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            isActive('/payouts') ? 'bg-indigo-100' : 'bg-gray-100'
          }`}>
            <svg className={`w-5 h-5 ${
              isActive('/payouts') ? 'text-indigo-600' : 'text-gray-600'
            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className={`text-xs font-medium ${
            isActive('/payouts') ? 'text-indigo-600' : 'text-gray-600'
          }`}>Payouts</span>
        </button>

        <button
          onClick={() => navigate('/fraud-flags')}
          className="flex flex-col items-center gap-1 min-w-[60px]"
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            isActive('/fraud-flags') ? 'bg-indigo-100' : 'bg-gray-100'
          }`}>
            <svg className={`w-5 h-5 ${
              isActive('/fraud-flags') ? 'text-indigo-600' : 'text-gray-600'
            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <span className={`text-xs font-medium ${
            isActive('/fraud-flags') ? 'text-indigo-600' : 'text-gray-600'
          }`}>Fraud</span>
        </button>

        <button
          onClick={() => navigate('/stats')}
          className="flex flex-col items-center gap-1 min-w-[60px]"
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            isActive('/stats') ? 'bg-indigo-100' : 'bg-gray-100'
          }`}>
            <svg className={`w-5 h-5 ${
              isActive('/stats') ? 'text-indigo-600' : 'text-gray-600'
            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <span className={`text-xs font-medium ${
            isActive('/stats') ? 'text-indigo-600' : 'text-gray-600'
          }`}>Stats</span>
        </button>

        <button
          onClick={() => navigate('/profile')}
          className="flex flex-col items-center gap-1 min-w-[60px]"
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            isActive('/profile') ? 'bg-indigo-100' : 'bg-gray-100'
          }`}>
            <svg className={`w-5 h-5 ${
              isActive('/profile') ? 'text-indigo-600' : 'text-gray-600'
            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <span className={`text-xs font-medium ${
            isActive('/profile') ? 'text-indigo-600' : 'text-gray-600'
          }`}>Profile</span>
        </button>
      </div>
    </div>
  );
}
