import { FRAUD_THRESHOLDS } from '../config/constants.js';
import FraudFlag from '../models/FraudFlag.js';
import Claim from '../models/Claim.js';

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

export const detectFraud = async (workerId, location, ipLocation) => {
  const flags = [];
  let fraudScore = 0;

  if (!location.lat || !location.lng || (location.lat === 0 && location.lng === 0)) {
    flags.push('INVALID_COORDINATES');
    fraudScore += 40;
  }

  if (ipLocation && location.lat && location.lng) {
    const distance = calculateDistance(location.lat, location.lng, ipLocation.lat, ipLocation.lng);
    if (distance > FRAUD_THRESHOLDS.GPS_IP_DISTANCE_KM) {
      flags.push('GPS_IP_MISMATCH');
      fraudScore += 30;
    }
  }

  const recentClaims = await Claim.find({
    workerId,
    createdAt: { $gte: new Date(Date.now() - FRAUD_THRESHOLDS.MIN_CLAIM_INTERVAL_HOURS * 60 * 60 * 1000) }
  });

  if (recentClaims.length > 0) {
    flags.push('RAPID_CLAIMS');
    fraudScore += 25;
  }

  if (recentClaims.length > 0) {
    const lastClaim = recentClaims[0];
    const distance = calculateDistance(
      location.lat, location.lng,
      lastClaim.location.lat, lastClaim.location.lng
    );
    const timeDiff = (Date.now() - lastClaim.createdAt.getTime()) / 1000 / 3600;
    const speed = distance / timeDiff;

    if (speed > FRAUD_THRESHOLDS.MAX_SPEED_KMH) {
      flags.push('SPEED_ANOMALY');
      fraudScore += 35;
    }

    if (distance > FRAUD_THRESHOLDS.MAX_LOCATION_JUMP_KM && timeDiff < 1) {
      flags.push('LOCATION_JUMP');
      fraudScore += 30;
    }
  }

  if (flags.length > 0) {
    await FraudFlag.create({
      workerId,
      flagType: flags.join(', '),
      severity: fraudScore > 60 ? 'critical' : fraudScore > 40 ? 'high' : 'medium',
      details: { flags, fraudScore, location, ipLocation }
    });
  }

  return { fraudScore, flags };
};
