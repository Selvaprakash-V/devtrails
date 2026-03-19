import express from 'express';
import { createClaim, getMyClaims, getClaimById } from '../controllers/claimController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { fraudCheck } from '../middleware/fraudCheck.js';

const router = express.Router();

router.use(authenticate);

router.post('/', fraudCheck, createClaim);
router.get('/', getMyClaims);
router.get('/:id', getClaimById);

export default router;
