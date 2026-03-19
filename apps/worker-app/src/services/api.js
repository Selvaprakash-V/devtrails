// Mock API for testing without backend
const MOCK_MODE = true; // Set to false when backend is ready

const mockDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

const mockWorkerAPI = {
  register: async (data) => {
    await mockDelay();
    return {
      token: 'mock_token_' + Date.now(),
      worker: {
        _id: 'mock_id_123',
        name: data.name,
        phone: data.phone,
        city: data.city,
        platform: data.platform,
        avgOrdersPerDay: 15,
        payoutPerOrder: 50,
        workingHours: 8,
        isActive: true
      }
    };
  },

  verifyOTP: async (phone, otp) => {
    await mockDelay();
    return {
      token: 'mock_token_' + Date.now(),
      worker: {
        _id: 'mock_id_123',
        name: 'Test Worker',
        phone: phone,
        city: 'Bangalore',
        platform: 'swiggy',
        avgOrdersPerDay: 15,
        payoutPerOrder: 50,
        workingHours: 8,
        isActive: true
      }
    };
  },

  updateLocation: async (lat, lng) => {
    await mockDelay(200);
    return { success: true };
  },

  getDashboard: async () => {
    await mockDelay();
    return {
      worker: {
        name: 'Test Worker',
        city: 'Bangalore',
        platform: 'swiggy'
      },
      risk: {
        risk_score: 75,
        risk_level: 'high'
      },
      income: {
        expected_daily_income: 850,
        expected_weekly_income: 5950
      },
      weather: {
        temperature: '28.5',
        rainfall: 12,
        condition: 'Heavy Rain'
      }
    };
  },

  getPayouts: async () => {
    await mockDelay();
    return [
      {
        _id: '1',
        disruptionType: 'rain',
        payoutAmount: 450,
        status: 'paid',
        riskLevel: 'high',
        riskScore: 85,
        createdAt: new Date().toISOString()
      },
      {
        _id: '2',
        disruptionType: 'heat',
        payoutAmount: 320,
        status: 'approved',
        riskLevel: 'medium',
        riskScore: 65,
        createdAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        _id: '3',
        disruptionType: 'rain',
        payoutAmount: 280,
        status: 'pending',
        riskLevel: 'medium',
        riskScore: 55,
        createdAt: new Date(Date.now() - 172800000).toISOString()
      }
    ];
  },

  createClaim: async (location, disruptionType) => {
    await mockDelay();
    return {
      _id: 'new_claim_' + Date.now(),
      disruptionType,
      payoutAmount: 400,
      status: 'approved',
      riskLevel: 'high',
      riskScore: 78
    };
  }
};

// Real API implementation
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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

const realWorkerAPI = {
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

  getDashboard: async () => {
    const response = await api.get('/worker/dashboard');
    return response.data;
  },

  getPayouts: async () => {
    const response = await api.get('/claims');
    return response.data;
  },

  createClaim: async (location, disruptionType) => {
    const response = await api.post('/claims', { location, disruptionType });
    return response.data;
  }
};

// Export based on mode
export const workerAPI = MOCK_MODE ? mockWorkerAPI : realWorkerAPI;

export default api;
