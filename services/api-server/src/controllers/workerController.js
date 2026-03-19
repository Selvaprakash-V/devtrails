import Worker from '../models/Worker.js';
import RiskSnapshot from '../models/RiskSnapshot.js';
import { getEnvironmentalData, calculateRiskScore, shouldTriggerPayout } from '../services/environmentService.js';
import { updateTrustScore, checkLocationValidity } from '../services/trustScoreService.js';
import { getActiveAlerts, createAlert, deactivateAlertsByType } from '../services/alertService.js';
import { processPayout, checkDuplicateClaim } from '../services/payoutService.js';

export const getProfile = async (req, res) => {
  const worker = await Worker.findById(req.userId).select('-locationHistory');
  res.json(worker);
};

export const updateProfile = async (req, res) => {
  const { name, city, avgOrdersPerDay, payoutPerOrder, workingHours } = req.body;
  
  const worker = await Worker.findByIdAndUpdate(
    req.userId,
    { name, city, avgOrdersPerDay, payoutPerOrder, workingHours },
    { new: true }
  );
  
  res.json(worker);
};

export const updateLocation = async (req, res) => {
  const { lat, lng, accuracy } = req.body;

  const locationCheck = checkLocationValidity({ lat, lng });
  if (!locationCheck.valid) {
    return res.status(400).json({ error: 'Invalid location', reason: locationCheck.reason });
  }

  const worker = await Worker.findById(req.userId);

  const locationEntry = {
    lat,
    lng,
    timestamp: new Date(),
    accuracy: accuracy || null
  };

  worker.currentLocation = locationEntry;
  worker.locationHistory.push(locationEntry);

  if (worker.locationHistory.length > 100) {
    worker.locationHistory = worker.locationHistory.slice(-100);
  }

  worker.gpsStatus = 'active';
  worker.lastActive = new Date();

  await worker.save();

  const trustResult = await updateTrustScore(req.userId, { lat, lng });

  if (trustResult.issues.length > 0) {
    await createAlert(
      req.userId,
      'trust_warning',
      'Location Issue Detected',
      `Suspicious activity: ${trustResult.issues.join(', ')}`,
      { issues: trustResult.issues },
      'warning'
    );
  }

  res.json({ 
    success: true, 
    gpsStatus: worker.gpsStatus,
    trustScore: trustResult.trustScore
  });
};

export const getDashboard = async (req, res) => {
  const worker = await Worker.findById(req.userId);

  if (!worker.currentLocation || !worker.currentLocation.lat) {
    return res.status(400).json({ error: 'Location not available' });
  }

  const envData = await getEnvironmentalData(
    worker.currentLocation.lat,
    worker.currentLocation.lng
  );

  const riskData = calculateRiskScore(envData);

  await RiskSnapshot.create({
    workerId: req.userId,
    location: worker.currentLocation,
    riskScore: riskData.riskScore,
    riskLevel: riskData.riskLevel,
    breakdown: {
      rainfall: envData.rainfall,
      temperature: envData.temperature,
      aqi: envData.aqi,
      traffic: envData.traffic
    },
    environmentalData: envData
  });

  const expectedDailyIncome = worker.avgOrdersPerDay * worker.payoutPerOrder;
  const protectedIncome = expectedDailyIncome * (worker.plan?.multiplier || 1.0);
  const atRiskIncome = riskData.riskLevel === 'high' ? expectedDailyIncome * 0.5 : 0;

  const alerts = await getActiveAlerts(req.userId);

  if (riskData.riskLevel === 'high') {
    const existingHighRiskAlert = alerts.find(a => a.type === 'high_risk');
    if (!existingHighRiskAlert) {
      await createAlert(
        req.userId,
        'high_risk',
        'High Risk Detected',
        `Severe conditions detected in your area. Risk score: ${riskData.riskScore}`,
        { riskScore: riskData.riskScore, envData },
        'critical'
      );
    }

    const hasDuplicate = await checkDuplicateClaim(req.userId, worker.currentLocation);
    if (!hasDuplicate && shouldTriggerPayout(riskData.riskScore, riskData.riskLevel)) {
      await processPayout(req.userId, worker.currentLocation, envData, riskData);
    }
  } else {
    await deactivateAlertsByType(req.userId, 'high_risk');
  }

  res.json({
    worker: {
      name: worker.name,
      city: worker.city,
      platform: worker.platform,
      trustScore: worker.trustScore,
      trustStatus: worker.trustStatus,
      plan: worker.plan?.type || 'basic'
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
      condition: envData.weatherCondition || 'Clear'
    },
    gpsStatus: worker.gpsStatus,
    alerts: alerts.map(a => ({
      id: a._id,
      type: a.type,
      title: a.title,
      message: a.message,
      severity: a.severity,
      isRead: a.isRead
    })),
    lastUpdated: new Date()
  });
};

export const getRiskHistory = async (req, res) => {
  const { days = 7 } = req.query;
  
  const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  
  const history = await RiskSnapshot.find({
    workerId: req.userId,
    timestamp: { $gte: cutoffDate }
  }).sort({ timestamp: -1 });

  res.json(history);
};

export const markAlertRead = async (req, res) => {
  const { alertId } = req.params;
  
  await markAlertAsRead(alertId);
  
  res.json({ success: true });
};
