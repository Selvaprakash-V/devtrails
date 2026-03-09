const router = require('express').Router();
const { protect, requireRole } = require('../middleware/auth');
const ctrl = require('../controllers/adminController');

router.use(protect, requireRole('admin'));

router.get('/dashboard',             ctrl.getDashboard);
router.get('/claims',                ctrl.getAllClaims);
router.put('/claims/:id/review',     ctrl.reviewClaim);
router.get('/fraud-flags',           ctrl.getFraudFlags);
router.get('/analytics/claims',      ctrl.getClaimsAnalytics);
router.get('/workers',               ctrl.getWorkers);
router.get('/disruptions',           ctrl.getDisruptions);

module.exports = router;
