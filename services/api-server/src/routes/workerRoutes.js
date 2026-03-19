import express from 'express';
import { 
  getProfile, 
  updateProfile,
  updateLocation, 
  getDashboard,
  getPayouts,
  getClaimStats,
  getFraudFlags
} from '../controllers/workerController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/location', updateLocation);
router.get('/dashboard', getDashboard);
router.get('/payouts', getPayouts);
router.get('/stats', getClaimStats);
router.get('/fraud-flags', getFraudFlags);

export default router;
