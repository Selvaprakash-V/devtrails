import axios from 'axios';

const OPENWEATHER_KEY = '8df98cefdbb8847398d1d45a9a9ec789';
const TOMTOM_KEY = 'fukiFyMLgExkRAgxwCPB9UiMQ2HxsolJ';

export const getEnvironmentalData = async (lat, lng) => {
  try {
    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${OPENWEATHER_KEY}&units=metric`
    );

    const aqiResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lng}&appid=${OPENWEATHER_KEY}`
    );

    let traffic = 50;
    try {
      const trafficResponse = await axios.get(
        `https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?point=${lat},${lng}&key=${TOMTOM_KEY}`,
        { timeout: 5000 }
      );
      
      if (trafficResponse.data?.flowSegmentData) {
        const fs = trafficResponse.data.flowSegmentData;
        const speedRatio = fs.currentSpeed / fs.freeFlowSpeed;
        traffic = Math.round((1 - speedRatio) * 100);
        traffic = Math.max(0, Math.min(100, traffic));
      }
    } catch (err) {
      const hour = new Date().getHours();
      if (hour >= 8 && hour <= 10) traffic = 70;
      else if (hour >= 17 && hour <= 20) traffic = 75;
      else if (hour >= 12 && hour <= 14) traffic = 55;
      else if (hour >= 0 && hour <= 6) traffic = 20;
      else traffic = 45;
    }

    const temperature = weatherResponse.data.main.temp;
    const rainfall = weatherResponse.data.rain?.['1h'] || weatherResponse.data.rain?.['3h'] || 0;
    const weatherCondition = weatherResponse.data.weather[0].main;
    
    const aqiData = aqiResponse.data.list[0];
    const pm25 = aqiData.components.pm2_5;
    
    let aqi = 50;
    if (pm25 <= 12) aqi = 50;
    else if (pm25 <= 55.4) aqi = 100;
    else if (pm25 <= 150.4) aqi = 200;
    else if (pm25 <= 250.4) aqi = 300;
    else aqi = 400;

    return {
      temperature: parseFloat(temperature.toFixed(1)),
      rainfall: parseFloat(rainfall.toFixed(1)),
      aqi: parseInt(aqi),
      traffic: parseInt(traffic),
      weatherCondition
    };
  } catch (error) {
    console.error('Environmental data error:', error.message);
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
