const router = require('express').Router();
const { protect, requireRole } = require('../middleware/auth');
const { getProfile, updateProfile, getRiskScore, getDashboard, getEarningsChart } = require('../controllers/workerController');

router.use(protect, requireRole('worker'));

router.get('/profile',        getProfile);
router.put('/profile',        updateProfile);
router.get('/risk-score',     getRiskScore);
router.get('/dashboard',      getDashboard);
router.get('/earnings-chart', getEarningsChart);

module.exports = router;
