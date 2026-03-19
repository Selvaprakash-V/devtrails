import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({ baseURL: API_URL, timeout: 3000 });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Silently swallow connection errors — mock data is used as fallback
api.interceptors.response.use(
  res => res,
  err => {
    if (err.code === 'ERR_NETWORK' || err.code === 'ECONNREFUSED' || err.message?.includes('Network Error')) {
      return Promise.reject({ silent: true });
    }
    return Promise.reject(err);
  }
);

export const auth = {
  login: (username, password) => api.post('/auth/admin/login', { username, password })
};

export const admin = {
  getDashboard: () => api.get('/admin/dashboard'),
  getClaims: () => api.get('/admin/claims'),
  updateClaimStatus: (id, status) => api.patch(`/admin/claims/${id}`, { status }),
  getFraudAlerts: () => api.get('/admin/fraud-alerts'),
  resolveAlert: (id) => api.patch(`/admin/fraud-alerts/${id}/resolve`),
  getWorkers: () => api.get('/admin/workers'),
  getDisruptions: () => api.get('/admin/disruptions'),
  getAdversarialStats: () => api.get('/admin/adversarial-stats'),
};

export default api;
