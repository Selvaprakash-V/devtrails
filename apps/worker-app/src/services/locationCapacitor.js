import { Geolocation } from '@capacitor/geolocation';

// Demo data for when backend is unavailable
const DEMO_DATA = {
  worker: {
    name: 'Demo Worker',
    platform: 'swiggy',
    city: 'Bangalore'
  },
  risk: {
    level: 'low',
    score: 25
  },
  earnings: {
    expectedDaily: 850
  },
  weather: {
    rainfall: 0,
    humidity: 65,
    temperature: 28,
    condition: 'Clear',
    aqi: 85,
    traffic: 35
  },
  spoofCheck: {
    isSpoofed: false
  }
};

export const requestLocationPermission = async () => {
  try {
    const permission = await Geolocation.requestPermissions();
    
    if (permission.location === 'denied') {
      throw new Error('Location permission denied');
    }

    const position = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    });

    return {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };
  } catch (error) {
    console.error('Location error:', error);
    throw error;
  }
};

export const watchLocation = (callback) => {
  let watchId = null;

  const startWatch = async () => {
    try {
      watchId = await Geolocation.watchPosition(
        {
          enableHighAccuracy: true,
          timeout: 30000,
          maximumAge: 0
        },
        (position, err) => {
          if (err) {
            console.error('Watch position error:', err);
            // Use last known location or demo location
            const lastLocation = JSON.parse(localStorage.getItem('lastLocation') || '{"lat": 12.9716, "lng": 77.5946}');
            callback(lastLocation);
            return;
          }

          if (position) {
            const location = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              timestamp: new Date().toISOString()
            };
            localStorage.setItem('lastLocation', JSON.stringify(location));
            callback(location);
          }
        }
      );
    } catch (error) {
      console.error('Failed to start watching location:', error);
      // Fallback to demo location
      const demoLocation = { lat: 12.9716, lng: 77.5946, timestamp: new Date().toISOString() };
      callback(demoLocation);
    }
  };

  startWatch();
  return watchId;
};

export const stopWatchingLocation = async (watchId) => {
  if (watchId) {
    try {
      await Geolocation.clearWatch({ id: watchId });
    } catch (error) {
      console.error('Failed to stop watching location:', error);
    }
  }
};

export const getDemoData = () => {
  return DEMO_DATA;
};
