import axios from 'axios';

const ML_API = process.env.ML_SERVICE_URL || 'http://localhost:8000';

export const predictRisk = async (data) => {
  const response = await axios.post(`${ML_API}/predict/risk`, data);
  return response.data;
};

export const predictIncome = async (data) => {
  const response = await axios.post(`${ML_API}/predict/income`, data);
  return response.data;
};

export const calculatePayout = async (data) => {
  const response = await axios.post(`${ML_API}/payout/calculate`, data);
  return response.data;
};
