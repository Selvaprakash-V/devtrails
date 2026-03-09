const router = require('express').Router();
const { protect, requireRole } = require('../middleware/auth');
const { getMyClaims, getClaimById, getClaimStats } = require('../controllers/claimController');

router.use(protect, requireRole('worker'));

router.get('/',              getMyClaims);
router.get('/stats/summary', getClaimStats);
router.get('/:id',           getClaimById);

module.exports = router;
