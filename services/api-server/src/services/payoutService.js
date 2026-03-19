import Claim from '../models/Claim.js';
import Worker from '../models/Worker.js';
import { getEnvironmentalData, calculateRiskScore, shouldTriggerPayout } from './environmentService.js';
import { createAlert, deactivateAlertsByType } from './alertService.js';
import { v4 as uuidv4 } from 'uuid';

export const calculatePayoutAmount = (estimatedLoss, riskScore, planMultiplier = 1.0) => {
  let baseAmount = estimatedLoss * (riskScore / 100);
  
  baseAmount = baseAmount * planMultiplier;
  
  return Math.round(baseAmount);
};

export const checkDuplicateClaim = async (workerId, location, timeWindowHours = 6) => {
  const cutoffTime = new Date(Date.now() - timeWindowHours * 60 * 60 * 1000);
  
  const recentClaim = await Claim.findOne({
    workerId,
    createdAt: { $gte: cutoffTime },
    status: { $in: ['pending', 'approved', 'credited'] }
  });

  return !!recentClaim;
};

export const processPayout = async (workerId, location, envData, riskData) => {
  const worker = await Worker.findById(workerId);
  
  const estimatedLoss = worker.payoutPerOrder * worker.avgOrdersPerDay * 0.5;
  
  const payoutAmount = calculatePayoutAmount(
    estimatedLoss,
    riskData.riskScore,
    worker.plan?.multiplier || 1.0
  );

  const disruptionType = determineDisruptionType(envData);

  const idempotencyKey = `${workerId}_${Date.now()}_${uuidv4()}`;

  const claim = await Claim.create({
    workerId,
    disruptionType,
    location,
    riskScore: riskData.riskScore,
    riskLevel: riskData.riskLevel,
    breakdown: {
      rainfall: envData.rainfall,
      temperature: envData.temperature,
      aqi: envData.aqi,
      traffic: envData.traffic
    },
    estimatedLoss,
    payoutAmount,
    status: 'approved',
    weatherData: envData,
    planMultiplier: worker.plan?.multiplier || 1.0,
    idempotencyKey
  });

  await createAlert(
    workerId,
    'payout_credited',
    'Payout Approved',
    `₹${payoutAmount} payout approved for ${disruptionType} disruption`,
    { claimId: claim._id, amount: payoutAmount },
    'info'
  );

  return claim;
};

const determineDisruptionType = (envData) => {
  const factors = [];
  
  if (envData.rainfall > 5) factors.push('rain');
  if (envData.temperature > 38 || envData.temperature < 10) factors.push('heat');
  if (envData.aqi > 200) factors.push('aqi');
  if (envData.traffic > 70) factors.push('traffic');

  if (factors.length > 1) return 'combined';
  if (factors.length === 1) return factors[0];
  
  return 'rain';
};

export const getPayoutHistory = async (workerId, filters = {}) => {
  const query = { workerId };

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.disruptionType) {
    query.disruptionType = filters.disruptionType;
  }

  if (filters.startDate || filters.endDate) {
    query.createdAt = {};
    if (filters.startDate) query.createdAt.$gte = new Date(filters.startDate);
    if (filters.endDate) query.createdAt.$lte = new Date(filters.endDate);
  }

  const claims = await Claim.find(query)
    .sort({ createdAt: -1 })
    .limit(filters.limit || 50);

  return claims;
};
