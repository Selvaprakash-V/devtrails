import express from 'express';
import { 
  getProfile, 
  updateProfile,
  updateLocation, 
  getDashboard,
  getRiskHistory,
  markAlertRead
} from '../controllers/workerController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { cacheMiddleware, workerCacheKey, dashboardCacheKey } from '../middleware/cache.js';
import { CACHE_TTL } from '../config/redis.js';

const router = express.Router();

router.use(authenticate);

// Cached routes
router.get('/profile', cacheMiddleware(CACHE_TTL.WORKER_PROFILE, workerCacheKey), getProfile);
router.get('/dashboard', cacheMiddleware(CACHE_TTL.DASHBOARD, dashboardCacheKey), getDashboard);
router.get('/risk-history', cacheMiddleware(CACHE_TTL.STATS), getRiskHistory);

// Non-cached routes (mutations)
router.put('/profile', updateProfile);
router.post('/location', updateLocation);
router.patch('/alerts/:alertId/read', markAlertRead);

export default router;
