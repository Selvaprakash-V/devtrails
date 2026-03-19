import express from 'express';
import { getMyClaims, getClaimById, getClaimStats } from '../controllers/claimController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { cacheMiddleware, payoutsCacheKey, statsCacheKey } from '../middleware/cache.js';
import { CACHE_TTL } from '../config/redis.js';

const router = express.Router();

router.use(authenticate);

// Cached routes
router.get('/', cacheMiddleware(CACHE_TTL.PAYOUTS, payoutsCacheKey), getMyClaims);
router.get('/stats', cacheMiddleware(CACHE_TTL.STATS, statsCacheKey), getClaimStats);
router.get('/:id', cacheMiddleware(CACHE_TTL.PAYOUTS), getClaimById);

export default router;
