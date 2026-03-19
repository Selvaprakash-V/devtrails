import axios from 'axios';

const ML_API = process.env.ML_SERVICE_URL || 'http://localhost:8000';

export const getEnvironmentalData = async (lat, lng) => {
  try {
    const response = await axios.post(`${ML_API}/environment/data`, {
      lat,
      lng
    });
    
    return response.data;
  } catch (error) {
    console.error('ML service error:', error.message);
    
    return {
      temperature: 25.0,
      rainfall: 0.0,
      aqi: 100,
      traffic: 50,
      weatherCondition: 'Clear'
    };
  }
};

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

export const shouldTriggerPayout = (riskScore, riskLevel) => {
  return riskScore >= 70 && riskLevel === 'high';
};
