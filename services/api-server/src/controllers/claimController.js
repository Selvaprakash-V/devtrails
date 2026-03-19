import Claim from '../models/Claim.js';
import Worker from '../models/Worker.js';
import { processClaim } from '../services/payoutService.js';
import axios from 'axios';

export const createClaim = async (req, res) => {
  const { location, disruptionType } = req.body;
  
  const weatherResponse = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lng}&appid=${process.env.OPENWEATHER_API_KEY || 'demo'}`
  ).catch(() => ({ data: { main: { temp: 298 }, rain: {}, weather: [{ main: 'Rain' }] } }));

  const weatherData = {
    rainfall: weatherResponse.data.rain?.['1h'] || 5,
    temperature: weatherResponse.data.main.temp - 273.15,
    aqi: 150,
    traffic: 70,
    disruptionHours: 4
  };

  const claimData = await processClaim(req.userId, location, weatherData);

  const claim = await Claim.create({
    workerId: req.userId,
    disruptionType,
    location,
    ...claimData,
    fraudScore: req.fraudScore || 0,
    fraudFlags: req.fraudFlags || [],
    status: req.fraudScore > 50 ? 'pending' : 'approved'
  });

  res.status(201).json(claim);
};

export const getMyClaims = async (req, res) => {
  const claims = await Claim.find({ workerId: req.userId }).sort({ createdAt: -1 });
  res.json(claims);
};

export const getClaimById = async (req, res) => {
  const claim = await Claim.findOne({ _id: req.params.id, workerId: req.userId });
  if (!claim) {
    return res.status(404).json({ error: 'Claim not found' });
  }
  res.json(claim);
};
