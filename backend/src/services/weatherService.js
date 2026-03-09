const axios = require('axios');

const getCurrentWeather = async (lat, lon) => {
  const url = `${process.env.OPENWEATHER_BASE_URL}/weather`;
  const res = await axios.get(url, {
    params: { lat, lon, appid: process.env.OPENWEATHER_API_KEY, units: 'metric' },
    timeout: 5000,
  });
  const d = res.data;
  return {
    city:    d.name,
    temp:    d.main.temp,
    humidity: d.main.humidity,
    wind:    d.wind.speed,
    rain1h:  d.rain?.['1h'] || 0,
    rain3h:  d.rain?.['3h'] || 0,
    weatherId: d.weather[0]?.id,
    description: d.weather[0]?.description,
    aqi:     null, // fetched separately
  };
};

const getAQI = async (city) => {
  try {
    const url = `${process.env.AQI_BASE_URL}/feed/${encodeURIComponent(city)}/?token=${process.env.AQI_API_KEY}`;
    const res = await axios.get(url, { timeout: 5000 });
    return res.data?.data?.aqi || null;
  } catch {
    return null;
  }
};

// Mock weather for development / API unavailable
const getMockWeather = (city = 'Mumbai') => {
  const mocks = {
    Mumbai:    { temp: 32, rain1h: 12, aqi: 95,  wind: 14, humidity: 80 },
    Delhi:     { temp: 38, rain1h: 0,  aqi: 280, wind: 8,  humidity: 45 },
    Bengaluru: { temp: 28, rain1h: 5,  aqi: 60,  wind: 12, humidity: 65 },
    Chennai:   { temp: 36, rain1h: 3,  aqi: 85,  wind: 18, humidity: 72 },
    Hyderabad: { temp: 34, rain1h: 8,  aqi: 120, wind: 10, humidity: 55 },
    Kolkata:   { temp: 33, rain1h: 20, aqi: 170, wind: 16, humidity: 85 },
    Pune:      { temp: 30, rain1h: 6,  aqi: 75,  wind: 11, humidity: 60 },
  };
  return { city, ...( mocks[city] || mocks['Mumbai'] ) };
};

const checkDisruptionThreshold = (weather) => {
  const triggers = [];
  if ((weather.rain1h || 0) >= (process.env.RAIN_THRESHOLD_MM || 80)) {
    triggers.push({ type: 'rain', value: weather.rain1h, threshold: 80 });
  }
  if ((weather.temp || 0) >= (process.env.HEAT_THRESHOLD_CELSIUS || 42)) {
    triggers.push({ type: 'heat', value: weather.temp, threshold: 42 });
  }
  if ((weather.aqi || 0) >= (process.env.AQI_THRESHOLD || 300)) {
    triggers.push({ type: 'aqi', value: weather.aqi, threshold: 300 });
  }
  return triggers;
};

module.exports = { getCurrentWeather, getAQI, getMockWeather, checkDisruptionThreshold };
