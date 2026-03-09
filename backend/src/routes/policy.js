const router = require('express').Router();
const { protect, requireRole } = require('../middleware/auth');
const { getPolicy, activatePolicy, calculatePremium, cancelPolicy } = require('../controllers/policyController');

router.use(protect);

router.get('/',                         requireRole('worker'), getPolicy);
router.post('/activate',                requireRole('worker'), activatePolicy);
router.post('/calculate-premium',       calculatePremium);
router.put('/:id/cancel',               requireRole('worker'), cancelPolicy);

module.exports = router;
