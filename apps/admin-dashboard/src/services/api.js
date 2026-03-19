import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  login: (username, password) => api.post('/auth/admin/login', { username, password })
};

export const admin = {
  getDashboard: () => api.get('/admin/dashboard'),
  getClaims: () => api.get('/admin/claims'),
  updateClaimStatus: (id, status) => api.patch(`/admin/claims/${id}`, { status }),
  getFraudAlerts: () => api.get('/admin/fraud-alerts'),
  resolveAlert: (id) => api.patch(`/admin/fraud-alerts/${id}/resolve`),
  getWorkers: () => api.get('/admin/workers')
};

export default api;
