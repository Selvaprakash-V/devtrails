import User from '../models/User.js';
import Claim from '../models/Claim.js';
import Payout from '../models/Payout.js';
import FraudFlag from '../models/FraudFlag.js';
import { LocationHistory, RiskHistory } from '../models/History.js';
import { getEnvironmentalData, calculateRiskScore } from '../services/environmentService.js';
import axios from 'axios';
import db from '../../database/db.js';

const haversineKm = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
};

const resolveIP = async (ip) => {
  try {
    const clean = ip?.replace('::ffff:', '').trim();
    if (!clean || clean === '127.0.0.1' || /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(clean)) return null;
    const r = await axios.get(`http://ip-api.com/json/${clean}`, { timeout: 5000 });
    return r.data?.status === 'success' ? { lat: r.data.lat, lng: r.data.lon, city: r.data.city, ip: clean } : null;
  } catch { return null; }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, city, avgOrdersPerDay, payoutPerOrder, workingHours } = req.body;
    
    const user = await User.update(req.userId, {
      name,
      city,
      avgOrdersPerDay,
      payoutPerOrder,
      workingHours
    });
    
    res.json(user);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

export const updateLocation = async (req, res) => {
  try {
    const { lat, lng, accuracy } = req.body;

    await LocationHistory.create({ userId: req.userId, latitude: lat, longitude: lng, accuracy });

    res.json({ success: true });
  } catch (error) {
    console.error('Update location error:', error);
    res.status(500).json({ error: 'Failed to update location' });
  }
};

export const getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const lat = parseFloat(req.query.lat);
    const lng = parseFloat(req.query.lng);

    if (!lat || !lng) {
      return res.status(400).json({ error: 'Location not available' });
    }

    // --- Baseline IP: store on first login if not set ---
    if (!user.baseline_ip_location) {
      const publicIP = req.query.publicIP || null;
      if (publicIP) {
        const ipLoc = await resolveIP(publicIP);
        if (ipLoc) {
          await db.query('UPDATE users SET baseline_ip_location = $1 WHERE id = $2', [JSON.stringify(ipLoc), req.userId]);
          user.baseline_ip_location = ipLoc;
          console.log(`[BASELINE] Stored for ${req.userId}: ${JSON.stringify(ipLoc)}`);
        }
      }
    }

    // --- Spoof detection: GPS coords vs current request IP location ---
    const publicIP = req.query.publicIP || null;
    const currentIPLocation = publicIP ? await resolveIP(publicIP) : null;
    const baselineIpLocation = user.baseline_ip_location || null;

    let spoofCheck = { isSpoofed: false, distanceGpsVsIP: 0, currentIPLocation, baselineIpLocation, gpsLocation: { lat, lng } };

    if (!currentIPLocation) {
      console.log(`[SPOOF] No public IP provided or unresolvable — skipping spoof check`);
    }

    if (currentIPLocation) {
      const distGpsVsIP = haversineKm(lat, lng, currentIPLocation.lat, currentIPLocation.lng);
      console.log(`[SPOOF] GPS:(${lat},${lng}) IP:${currentIPLocation.city}(${currentIPLocation.lat},${currentIPLocation.lng}) dist:${distGpsVsIP.toFixed(1)}km`);

      const isSpoofed = distGpsVsIP > 50;

      spoofCheck = {
        isSpoofed,
        distanceGpsVsIP: parseFloat(distGpsVsIP.toFixed(2)),
        currentIPLocation,
        baselineIpLocation,
        gpsLocation: { lat, lng }
      };

      if (isSpoofed) {
        await FraudFlag.create({
          userId: req.userId,
          flagType: 'gps_spoofing',
          severity: distGpsVsIP > 500 ? 'high' : 'medium',
          description: `GPS (${lat.toFixed(4)},${lng.toFixed(4)}) vs IP location (${currentIPLocation.city}) differ by ${distGpsVsIP.toFixed(0)}km`,
          evidence: spoofCheck
        });
      }
    }

    const envData = await getEnvironmentalData(lat, lng);
    const riskData = calculateRiskScore(envData);

    await RiskHistory.create({
      userId: req.userId,
      riskScore: riskData.riskScore,
      riskLevel: riskData.riskLevel,
      weatherCondition: envData.weatherCondition,
      temperature: envData.temperature,
      rainfall: envData.rainfall,
      aqi: envData.aqi,
      trafficDelay: envData.traffic,
      locationLat: lat,
      locationLng: lng
    });

    const avgOrders = user.avg_orders_per_day || 15;
    const payoutPerOrder = user.payout_per_order || 50;
    const expectedDailyIncome = avgOrders * payoutPerOrder;
    const protectedIncome = expectedDailyIncome;
    const atRiskIncome = riskData.riskLevel === 'high' ? expectedDailyIncome * 0.5 : 0;

    const activeFraudFlags = await FraudFlag.getActiveCount(req.userId);

    res.json({
      worker: {
        name: user.name,
        city: user.city,
        platform: user.platform,
        trustScore: user.trust_score,
        trustStatus: user.trust_status,
        plan: 'basic'
      },
      risk: {
        score: riskData.riskScore,
        level: riskData.riskLevel,
        breakdown: {
          rainfall: envData.rainfall,
          temperature: envData.temperature,
          aqi: envData.aqi,
          traffic: envData.traffic
        }
      },
      earnings: {
        expectedDaily: expectedDailyIncome,
        protected: protectedIncome,
        atRisk: atRiskIncome
      },
      weather: {
        temperature: envData.temperature,
        rainfall: envData.rainfall,
        condition: envData.weatherCondition || 'Clear',
        aqi: envData.aqi,
        traffic: envData.traffic
      },
      spoofCheck,
      gpsStatus: 'active',
      alerts: activeFraudFlags > 0 ? [{
        id: '1',
        type: 'fraud_warning',
        title: 'Fraud Flags Detected',
        message: `You have ${activeFraudFlags} active fraud flags`,
        severity: 'warning',
        isRead: false
      }] : [],
      lastUpdated: new Date()
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard' });
  }
};

export const getPayouts = async (req, res) => {
  try {
    const payouts = await Payout.findByUserId(req.userId);
    res.json(payouts);
  } catch (error) {
    console.error('Get payouts error:', error);
    res.status(500).json({ error: 'Failed to fetch payouts' });
  }
};

export const getClaimStats = async (req, res) => {
  try {
    const claims = await Claim.findByUserId(req.userId);
    const payoutRow = await Payout.getTotalByUser(req.userId);
    const totalPayout = parseFloat(payoutRow?.completed_amount || 0);

    const approved = claims.filter(c => c.status === 'approved').length;
    const pending = claims.filter(c => c.status === 'pending').length;

    const byType = claims.reduce((acc, claim) => {
      const type = claim.disruption_type || claim.weather_condition || 'other';
      if (!acc[type]) acc[type] = { count: 0, totalAmount: 0 };
      acc[type].count++;
      acc[type].totalAmount += parseFloat(claim.amount || 0);
      return acc;
    }, {});

    res.json({
      overall: {
        totalClaims: claims.length,
        totalPayout,
        approvedClaims: approved,
        pendingClaims: pending,
        avgPayout: claims.length > 0 ? Math.round(totalPayout / claims.length) : 0
      },
      byType: Object.entries(byType).map(([type, data]) => ({
        _id: type,
        count: data.count,
        totalAmount: data.totalAmount
      }))
    });
  } catch (error) {
    console.error('Get claim stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};

export const getFraudFlags = async (req, res) => {
  try {
    const flags = await FraudFlag.findByUserId(req.userId);
    res.json(flags);
  } catch (error) {
    console.error('Get fraud flags error:', error);
    res.status(500).json({ error: 'Failed to fetch fraud flags' });
  }
};
