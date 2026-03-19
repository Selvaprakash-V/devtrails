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
  // Fire immediately with last known location so dashboard doesn't hang
  const last = localStorage.getItem('lastLocation');
  if (last) {
    try { callback(JSON.parse(last)); } catch {}
  }

  let watchId = null;

  Geolocation.watchPosition(
    { enableHighAccuracy: true, timeout: 30000, maximumAge: 10000 },
    (position, err) => {
      if (err || !position) {
        console.error('Watch position error:', err);
        return;
      }
      const location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('lastLocation', JSON.stringify(location));
      callback(location);
    }
  ).then(id => { watchId = id; }).catch(err => {
    console.error('Failed to start watching location:', err);
    // fallback: use stored location or Bangalore default
    const fallback = last
      ? JSON.parse(last)
      : { lat: 12.9716, lng: 77.5946, timestamp: new Date().toISOString() };
    callback(fallback);
  });

  return { getId: () => watchId };
};

export const stopWatchingLocation = async (watchRef) => {
  if (!watchRef) return;
  try {
    const id = typeof watchRef === 'object' ? watchRef.getId?.() : watchRef;
    if (id) await Geolocation.clearWatch({ id });
  } catch (err) {
    console.error('Failed to stop watching location:', err);
  }
};

export const getDemoData = () => {
  return DEMO_DATA;
};
