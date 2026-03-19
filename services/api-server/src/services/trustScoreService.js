import Worker from '../models/Worker.js';

const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const updateTrustScore = async (workerId, location) => {
  const worker = await Worker.findById(workerId);
  if (!worker) return;

  let trustChange = 0;
  const issues = [];

  if (worker.locationHistory.length > 0) {
    const lastLocation = worker.locationHistory[worker.locationHistory.length - 1];
    const timeDiff = (Date.now() - lastLocation.timestamp.getTime()) / 1000 / 3600;
    
    if (timeDiff > 0) {
      const distance = calculateDistance(
        lastLocation.lat, lastLocation.lng,
        location.lat, location.lng
      );
      const speed = distance / timeDiff;

      if (speed > 120) {
        trustChange -= 10;
        issues.push('unrealistic_speed');
      }

      if (distance > 100 && timeDiff < 1) {
        trustChange -= 15;
        issues.push('location_jump');
      }
    }
  }

  if (location.lat === 0 && location.lng === 0) {
    trustChange -= 20;
    issues.push('invalid_coordinates');
  }

  const recentLocations = worker.locationHistory.slice(-10);
  if (recentLocations.length >= 5) {
    const allSame = recentLocations.every(loc => 
      loc.lat === recentLocations[0].lat && loc.lng === recentLocations[0].lng
    );
    if (allSame) {
      trustChange -= 5;
      issues.push('static_location');
    }
  }

  if (issues.length === 0) {
    trustChange += 1;
  }

  worker.trustScore = Math.max(0, Math.min(100, worker.trustScore + trustChange));

  if (worker.trustScore >= 80) {
    worker.trustStatus = 'trusted';
  } else if (worker.trustScore >= 50) {
    worker.trustStatus = 'under_review';
  } else {
    worker.trustStatus = 'risky';
  }

  await worker.save();

  return {
    trustScore: worker.trustScore,
    trustStatus: worker.trustStatus,
    issues
  };
};

export const checkLocationValidity = (location) => {
  if (!location.lat || !location.lng) {
    return { valid: false, reason: 'missing_coordinates' };
  }

  if (location.lat === 0 && location.lng === 0) {
    return { valid: false, reason: 'invalid_coordinates' };
  }

  if (Math.abs(location.lat) > 90 || Math.abs(location.lng) > 180) {
    return { valid: false, reason: 'out_of_bounds' };
  }

  return { valid: true };
};
