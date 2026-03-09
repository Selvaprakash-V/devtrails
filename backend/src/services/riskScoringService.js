const weatherService = require('./weatherService');
const { DISRUPTION_TYPES, PREMIUM_BASE, MAX_COMPENSATION } = require('../config/constants');

/**
 * Calculate AI risk score for a worker based on weather & location.
 * Returns: { score, level, weeklyPremium, premiumBreakdown, factors }
 */
const calculate = async (profile) => {
  const { city, location } = profile;
  let weatherData = null;

  try {
    weatherData = await weatherService.getCurrentWeather(location?.lat || 19.076, location?.lon || 72.8777);
  } catch {
    // Use mock data if API is unavailable
    weatherData = weatherService.getMockWeather(city);
  }

  const factors = computeFactors(weatherData, profile);
  const score   = Math.min(100, Math.round(
    factors.rain * 35 + factors.heat * 25 + factors.aqi * 20 +
    factors.historical * 10 + factors.season * 10
  ));

  const level = score <= 33 ? 'low' : score <= 66 ? 'medium' : 'high';

  const premiumBreakdown = {
    base:        PREMIUM_BASE,
    rainRisk:    Math.round(factors.rain * 15),
    heatRisk:    Math.round(factors.heat * 10),
    aqiRisk:     Math.round(factors.aqi * 8),
    platformFee: 0,
    total:       0,
  };
  premiumBreakdown.platformFee = Math.round(
    (premiumBreakdown.base + premiumBreakdown.rainRisk + premiumBreakdown.heatRisk + premiumBreakdown.aqiRisk) * 0.1
  );
  premiumBreakdown.total =
    premiumBreakdown.base + premiumBreakdown.rainRisk +
    premiumBreakdown.heatRisk + premiumBreakdown.aqiRisk + premiumBreakdown.platformFee;

  return {
    score,
    level,
    weeklyPremium: premiumBreakdown.total,
    premiumBreakdown,
    factors: {
      rainFactor:  factors.rain,
      heatFactor:  factors.heat,
      aqiFactor:   factors.aqi,
      rawWeather:  weatherData,
    },
  };
};

const computeFactors = (weather, profile) => {
  // Normalise to 0..1
  const rainMm    = weather?.rain1h  || weather?.rain3h  || 0;
  const tempC     = weather?.temp    || 28;
  const aqiIndex  = weather?.aqi     || 80;
  const windSpeed = weather?.wind    || 10;

  const rainFactor = Math.min(1, rainMm / DISRUPTION_TYPES.RAIN.threshold);
  const heatFactor = tempC > 35
    ? Math.min(1, (tempC - 35) / (DISRUPTION_TYPES.HEAT.threshold - 35))
    : 0;
  const aqiFactor  = aqiIndex > 150
    ? Math.min(1, (aqiIndex - 150) / (DISRUPTION_TYPES.AQI.threshold - 150))
    : 0;

  // Seasonal risk (monsoon months: June–September)
  const month = new Date().getMonth() + 1;
  const seasonFactor = [6, 7, 8, 9].includes(month) ? 0.7 : 0.2;

  // Historical placeholder (would be real data from DB in prod)
  const historicalFactor = 0.3;

  return { rain: rainFactor, heat: heatFactor, aqi: aqiFactor, season: seasonFactor, historical: historicalFactor };
};

module.exports = { calculate };
