import { predictRisk, predictIncome, calculatePayout } from './mlService.js';
import Claim from '../models/Claim.js';
import Worker from '../models/Worker.js';

export const processClaim = async (workerId, location, weatherData) => {
  const worker = await Worker.findById(workerId);
  
  const riskData = {
    rainfall: weatherData.rainfall || 0,
    temperature: weatherData.temperature || 25,
    aqi: weatherData.aqi || 100,
    traffic: weatherData.traffic || 50,
    month: new Date().getMonth() + 1
  };

  const incomeData = {
    avg_orders_per_day: worker.avgOrdersPerDay,
    payout_per_order: worker.payoutPerOrder,
    working_hours: worker.workingHours,
    city_factor: 1.1,
    day_of_week: new Date().getDay()
  };

  const [riskPrediction, incomePrediction] = await Promise.all([
    predictRisk(riskData),
    predictIncome(incomeData)
  ]);

  const payoutData = {
    risk_score: riskPrediction.risk_score,
    expected_income: incomePrediction.expected_daily_income,
    disruption_hours: weatherData.disruptionHours || 4
  };

  const payoutResult = await calculatePayout(payoutData);

  return {
    riskScore: riskPrediction.risk_score,
    riskLevel: riskPrediction.risk_level,
    estimatedLoss: incomePrediction.expected_daily_income * (weatherData.disruptionHours || 4) / 8,
    payoutAmount: payoutResult.payout_amount,
    weatherData
  };
};
