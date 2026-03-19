import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://172.16.142.132:5000/api';

// OpenWeather API
const OPENWEATHER_KEY = '8df98cefdbb8847398d1d45a9a9ec789';
const TOMTOM_KEY = 'fukiFyMLgExkRAgxwCPB9UiMQ2HxsolJ';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('workerToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Real environmental data fetching
export const getEnvironmentalData = async (lat, lng) => {
  try {
    // Fetch Weather + Rainfall
    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${OPENWEATHER_KEY}&units=metric`
    );

    // Fetch AQI
    const aqiResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lng}&appid=${OPENWEATHER_KEY}`
    );

    // Fetch Traffic
    let traffic = 50; // Default moderate traffic
    try {
      const trafficResponse = await axios.get(
        `https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?point=${lat},${lng}&key=${TOMTOM_KEY}`,
        { timeout: 5000 }
      );
      
      console.log('TomTom Response:', trafficResponse.data);
      
      if (trafficResponse.data && trafficResponse.data.flowSegmentData) {
        const fs = trafficResponse.data.flowSegmentData;
        const currentSpeed = fs.currentSpeed;
        const freeFlowSpeed = fs.freeFlowSpeed;
        const confidence = fs.confidence;
        
        console.log('TomTom Traffic Data:', {
          currentSpeed,
          freeFlowSpeed,
          confidence,
          roadClosure: fs.roadClosure
        });
        
        if (freeFlowSpeed && freeFlowSpeed > 0) {
          // Calculate congestion percentage
          const speedRatio = currentSpeed / freeFlowSpeed;
          // Traffic congestion: lower speed ratio = higher congestion
          traffic = Math.round((1 - speedRatio) * 100);
          traffic = Math.max(0, Math.min(100, traffic)); // Clamp between 0-100
          console.log('Calculated Traffic:', traffic);
        }
      } else {
        console.warn('No flowSegmentData in TomTom response');
        // Use time-based estimation as fallback
        const hour = new Date().getHours();
        if (hour >= 8 && hour <= 10) traffic = 70; // Morning rush
        else if (hour >= 17 && hour <= 20) traffic = 75; // Evening rush
        else if (hour >= 12 && hour <= 14) traffic = 55; // Lunch time
        else if (hour >= 0 && hour <= 6) traffic = 20; // Night
        else traffic = 45; // Normal
        console.log('Using time-based traffic estimate:', traffic);
      }
    } catch (trafficError) {
      console.error('TomTom Traffic API Error:', trafficError.response?.data || trafficError.message);
      // Use time-based estimation as fallback
      const hour = new Date().getHours();
      if (hour >= 8 && hour <= 10) traffic = 70; // Morning rush
      else if (hour >= 17 && hour <= 20) traffic = 75; // Evening rush
      else if (hour >= 12 && hour <= 14) traffic = 55; // Lunch time
      else if (hour >= 0 && hour <= 6) traffic = 20; // Night
      else traffic = 45; // Normal
      console.log('TomTom failed, using time-based traffic estimate:', traffic);
    }

    const temperature = weatherResponse.data.main.temp;
    const rainfall = weatherResponse.data.rain?.['1h'] || weatherResponse.data.rain?.['3h'] || 0;
    const weatherCondition = weatherResponse.data.weather[0].main;
    const humidity = weatherResponse.data.main.humidity;
    
    // Get AQI components for accurate reading
    const aqiData = aqiResponse.data.list[0];
    const aqiIndex = aqiData.main.aqi;
    const components = aqiData.components;
    
    // Calculate realistic AQI based on PM2.5 (most important pollutant)
    let aqi = 50; // Default good
    const pm25 = components.pm2_5;
    
    if (pm25 <= 12) aqi = 50;        // Good
    else if (pm25 <= 55.4) aqi = 100; // Moderate (extended range)
    else if (pm25 <= 150.4) aqi = 200; // Moderate (extended range)
    else if (pm25 <= 250.4) aqi = 300; // Unhealthy
    else aqi = 400;                    // Hazardous

    // Get place name
    const geocodeResponse = await axios.get(
      `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lng}&limit=1&appid=${OPENWEATHER_KEY}`
    );
    const placeName = geocodeResponse.data[0]?.name || 'Unknown';

    console.log('Environmental Data:', {
      temperature,
      rainfall,
      aqi,
      pm25,
      aqiIndex,
      humidity,
      weatherCondition,
      traffic
    });

    return {
      temperature: parseFloat(temperature.toFixed(1)),
      rainfall: parseFloat(rainfall.toFixed(1)),
      aqi: parseInt(aqi),
      traffic: parseInt(traffic),
      weatherCondition,
      placeName,
      humidity,
      pm25: parseFloat(pm25?.toFixed(1) || 0),
      lat,
      lng
    };
  } catch (error) {
    console.error('Environmental data fetch error:', error);
    return {
      temperature: 25.0,
      rainfall: 0.0,
      aqi: 100,
      traffic: 50,
      weatherCondition: 'Clear',
      placeName: 'Unknown',
      humidity: 50,
      pm25: 0,
      lat,
      lng
    };
  }
};

// Calculate risk score
export const calculateRiskScore = (envData) => {
  let riskScore = 0;
  
  if (envData.rainfall > 10) riskScore += 30;
  else if (envData.rainfall > 5) riskScore += 20;
  else if (envData.rainfall > 2) riskScore += 10;
  
  if (envData.temperature > 40) riskScore += 25;
  else if (envData.temperature > 38) riskScore += 15;
  else if (envData.temperature < 10) riskScore += 15;
  
  if (envData.aqi > 300) riskScore += 25;
  else if (envData.aqi > 200) riskScore += 15;
  else if (envData.aqi > 150) riskScore += 10;
  
  if (envData.traffic > 70) riskScore += 20;
  else if (envData.traffic > 50) riskScore += 10;
  
  riskScore = Math.min(100, riskScore);
  
  let riskLevel = 'low';
  if (riskScore >= 70) riskLevel = 'high';
  else if (riskScore >= 40) riskLevel = 'medium';
  
  return { riskScore, riskLevel };
};

// Get IP-based location for fraud detection — now handled server-side
export const getIPLocation = async () => null;

export const checkGPSSpoofing = async () => ({ isSpoofed: false });

export const workerAPI = {
  register: async (data) => {
    // Fetch public IP from mobile's perspective before registering
    let publicIP = null;
    try {
      const ipRes = await axios.get('https://api.ipify.org?format=json', { timeout: 5000 });
      publicIP = ipRes.data?.ip || null;
    } catch { /* ignore */ }
    const response = await api.post('/auth/register', { ...data, publicIP });
    return response.data;
  },

  verifyOTP: async (phone, otp) => {
    const response = await api.post('/auth/login', { phone, otp });
    return response.data;
  },

  updateLocation: async (lat, lng) => {
    const response = await api.post('/worker/location', { lat, lng });
    return response.data;
  },

  getDashboard: async (lat, lng) => {
    await api.post('/worker/location', { lat, lng });
    // Send mobile's public IP for server-side spoof detection
    let publicIP = null;
    try {
      const ipRes = await axios.get('https://api.ipify.org?format=json', { timeout: 5000 });
      publicIP = ipRes.data?.ip || null;
    } catch { /* ignore */ }
    const response = await api.get(`/worker/dashboard?lat=${lat}&lng=${lng}${publicIP ? `&publicIP=${publicIP}` : ''}`);
    return response.data;
  },

  getPayouts: async () => {
    const response = await api.get('/worker/payouts');
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/worker/profile');
    return response.data;
  },

  getClaimStats: async () => {
    const response = await api.get('/worker/stats');
    return response.data;
  },

  getFraudFlags: async () => {
    const response = await api.get('/worker/fraud-flags');
    return response.data;
  }
};

export default api;
