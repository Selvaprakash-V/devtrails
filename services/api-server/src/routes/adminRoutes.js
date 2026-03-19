import express from 'express';
import { getDashboard, getAllClaims, updateClaimStatus, getFraudAlerts, resolveAlert, getWorkers } from '../controllers/adminController.js';
import { authenticate, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate, isAdmin);

router.get('/dashboard', getDashboard);
router.get('/claims', getAllClaims);
router.patch('/claims/:id', updateClaimStatus);
router.get('/fraud-alerts', getFraudAlerts);
router.patch('/fraud-alerts/:id/resolve', resolveAlert);
router.get('/workers', getWorkers);

export default router;
