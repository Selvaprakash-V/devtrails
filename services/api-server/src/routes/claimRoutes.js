import express from 'express';
import { getMyClaims, getClaimById, getClaimStats } from '../controllers/claimController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getMyClaims);
router.get('/stats', getClaimStats);
router.get('/:id', getClaimById);

export default router;
