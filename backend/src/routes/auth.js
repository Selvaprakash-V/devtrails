const router = require('express').Router();
const { register, login, getMe } = require('../controllers/authController');
const { sendOtp, verifyOtp } = require('../controllers/onboardingAuthController');
const { protect } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');
const { body } = require('express-validator');
const validateRequest = require('../middleware/validateRequest');

router.post('/register', authLimiter, register);
router.post('/login',    authLimiter, login);
router.get('/me',        protect,     getMe);

// OTP-based mobile onboarding auth
router.post(
	'/send-otp',
	authLimiter,
	[body('phone').matches(/^[6-9]\d{9}$/).withMessage('Valid Indian phone number is required')],
	validateRequest,
	sendOtp,
);

router.post(
	'/verify-otp',
	authLimiter,
	[
		body('phone').matches(/^[6-9]\d{9}$/).withMessage('Valid Indian phone number is required'),
		body('otp').isLength({ min: 4, max: 6 }).withMessage('OTP must be 4-6 digits'),
	],
	validateRequest,
	verifyOtp,
);

module.exports = router;
