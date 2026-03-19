import Worker from '../models/Worker.js';
import { predictRisk, predictIncome } from '../services/mlService.js';
import axios from 'axios';

export const getProfile = async (req, res) => {
  const worker = await Worker.findById(req.userId);
  res.json(worker);
};

export const updateLocation = async (req, res) => {
  const { lat, lng } = req.body;
  
  await Worker.findByIdAndUpdate(req.userId, {
    currentLocation: { lat, lng, timestamp: new Date() }
  });
  
  res.json({ success: true });
};

export const getDashboard = async (req, res) => {
  const worker = await Worker.findById(req.userId);
  
  const weatherResponse = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather?lat=${worker.currentLocation?.lat || 12.9716}&lon=${worker.currentLocation?.lng || 77.5946}&appid=${process.env.OPENWEATHER_API_KEY || 'demo'}`
  ).catch(() => ({ data: { main: { temp: 298 }, weather: [{ main: 'Clear' }], rain: {} } }));

  const rainfall = weatherResponse.data.rain?.['1h'] || 0;
  const temperature = weatherResponse.data.main.temp - 273.15;

  const riskPrediction = await predictRisk({
    rainfall,
    temperature,
    aqi: 100,
    traffic: 50,
    month: new Date().getMonth() + 1
  });

  const incomePrediction = await predictIncome({
    avg_orders_per_day: worker.avgOrdersPerDay,
    payout_per_order: worker.payoutPerOrder,
    working_hours: worker.workingHours,
    city_factor: 1.1,
    day_of_week: new Date().getDay()
  });

  res.json({
    worker,
    risk: riskPrediction,
    income: incomePrediction,
    weather: {
      temperature: temperature.toFixed(1),
      rainfall,
      condition: weatherResponse.data.weather[0].main
    }
  });
};
