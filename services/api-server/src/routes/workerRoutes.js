import express from 'express';
import { getProfile, updateLocation, getDashboard } from '../controllers/workerController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/profile', getProfile);
router.post('/location', updateLocation);
router.get('/dashboard', getDashboard);

export default router;
