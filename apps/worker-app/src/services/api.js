import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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

// Get IP-based location for fraud detection
export const getIPLocation = async () => {
  try {
    const response = await axios.get('https://ipapi.co/json/');
    return {
      lat: response.data.latitude,
      lng: response.data.longitude,
      city: response.data.city,
      ip: response.data.ip
    };
  } catch (error) {
    return null;
  }
};

// Calculate distance between two points
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

// Check for GPS spoofing
export const checkGPSSpoofing = async (gpsLocation) => {
  const ipLocation = await getIPLocation();
  
  if (!ipLocation) {
    return { isSpoofed: false, distance: 0, ipLocation: null };
  }

  const distance = calculateDistance(
    gpsLocation.lat,
    gpsLocation.lng,
    ipLocation.lat,
    ipLocation.lng
  );

  const isSpoofed = distance > 50; // More than 50km difference

  return {
    isSpoofed,
    distance: parseFloat(distance.toFixed(2)),
    ipLocation,
    gpsLocation
  };
};

export const workerAPI = {
  register: async (data) => {
    const response = await api.post('/auth/register', data);
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
    // Get real environmental data
    const envData = await getEnvironmentalData(lat, lng);
    const riskData = calculateRiskScore(envData);
    
    // Check for GPS spoofing
    const spoofCheck = await checkGPSSpoofing({ lat, lng });

    // Get worker data from localStorage
    const onboardingData = JSON.parse(localStorage.getItem('onboardingData') || '{}');
    const workerData = JSON.parse(localStorage.getItem('workerData') || '{}');

    const avgOrdersPerDay = 15;
    const payoutPerOrder = 50;
    const expectedDaily = avgOrdersPerDay * payoutPerOrder;

    return {
      worker: {
        name: onboardingData.name || workerData.name || 'Worker',
        city: envData.placeName,
        platform: onboardingData.platform || 'swiggy',
        trustScore: spoofCheck.isSpoofed ? 60 : 95,
        trustStatus: spoofCheck.isSpoofed ? 'under_review' : 'trusted',
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
        expectedDaily,
        protected: expectedDaily,
        atRisk: riskData.riskLevel === 'high' ? expectedDaily * 0.5 : 0
      },
      weather: {
        temperature: envData.temperature,
        rainfall: envData.rainfall,
        condition: envData.weatherCondition,
        aqi: envData.aqi,
        traffic: envData.traffic,
        humidity: envData.humidity
      },
      gpsStatus: 'active',
      location: {
        lat,
        lng,
        placeName: envData.placeName
      },
      spoofCheck,
      alerts: spoofCheck.isSpoofed ? [
        {
          id: '1',
          type: 'gps_spoof',
          title: 'GPS Spoofing Detected',
          message: `Location mismatch: ${spoofCheck.distance}km difference between GPS and IP`,
          severity: 'critical',
          isRead: false
        }
      ] : [],
      lastUpdated: new Date()
    };
  },

  getPayouts: async () => {
    // Mock payouts for now
    return [
      {
        _id: '1',
        disruptionType: 'rain',
        payoutAmount: 450,
        status: 'credited',
        riskLevel: 'high',
        riskScore: 85,
        breakdown: { rainfall: 15, temperature: 28, aqi: 150, traffic: 60 },
        createdAt: new Date().toISOString()
      },
      {
        _id: '2',
        disruptionType: 'heat',
        payoutAmount: 320,
        status: 'approved',
        riskLevel: 'medium',
        riskScore: 65,
        breakdown: { rainfall: 0, temperature: 42, aqi: 120, traffic: 50 },
        createdAt: new Date(Date.now() - 86400000).toISOString()
      }
    ];
  },

  getProfile: async () => {
    const onboardingData = JSON.parse(localStorage.getItem('onboardingData') || '{}');
    return {
      _id: 'mock_id_123',
      name: onboardingData.name || 'Test Worker',
      phone: onboardingData.phone || '9876543210',
      city: onboardingData.city || 'Bangalore',
      platform: onboardingData.platform || 'swiggy',
      vehicleType: onboardingData.vehicleType || 'bike',
      licenseNumber: onboardingData.licenseNumber || 'KA01AB1234',
      avgOrdersPerDay: 15,
      payoutPerOrder: 50,
      workingHours: 8,
      trustScore: 95,
      trustStatus: 'trusted',
      gpsStatus: 'active',
      isActive: true,
      plan: { type: 'basic', multiplier: 1.0 }
    };
  },

  getClaimStats: async () => {
    return {
      overall: {
        totalClaims: 12,
        totalPayout: 4850,
        approvedClaims: 10,
        pendingClaims: 2,
        avgPayout: 404
      },
      byType: [
        { _id: 'rain', count: 6, totalAmount: 2700 },
        { _id: 'heat', count: 3, totalAmount: 1200 },
        { _id: 'aqi', count: 2, totalAmount: 650 },
        { _id: 'combined', count: 1, totalAmount: 300 }
      ]
    };
  },

  getFraudFlags: async () => {
    const spoofHistory = JSON.parse(localStorage.getItem('spoofHistory') || '[]');
    return spoofHistory;
  }
};

export default api;
