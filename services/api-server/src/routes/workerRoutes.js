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

const router = express.Router();

router.use(authenticate);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/location', updateLocation);
router.get('/dashboard', getDashboard);
router.get('/risk-history', getRiskHistory);
router.patch('/alerts/:alertId/read', markAlertRead);

export default router;
