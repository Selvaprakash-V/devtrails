import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      const token = localStorage.getItem('workerToken');
      const hasLocation = localStorage.getItem('locationPermission');
      
      if (token && hasLocation) {
        navigate('/dashboard');
      } else {
        navigate('/onboarding');
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-end pb-8 overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/quickclaimbg.png)' }}
      />
      
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

      {/* Content - Lower Middle */}
      <div className="relative z-10 text-center px-8 animate-fade-in">
        <h1 className="text-4xl font-extrabold text-white mb-4 drop-shadow-lg tracking-wide" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          QuickClaim
        </h1>
        <p className="text-white text-xl font-light drop-shadow-md">
          Your safety net, when the weather isn't
        </p>
        
        {/* Loading Indicator */}
        <div className="flex gap-2 justify-center mt-8">
          <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce shadow-lg" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce shadow-lg" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
}
