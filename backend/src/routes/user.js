const router = require('express').Router();
const { body } = require('express-validator');
const validateRequest = require('../middleware/validateRequest');
const { protectOnboarding } = require('../middleware/onboardingAuth');
const {
  updateLanguage,
  updateLocation,
  updateWorkSettings,
  updateProfile,
  updateBankDetails,
  updateDocuments,
} = require('../controllers/onboardingUserController');

// All user onboarding routes require a valid onboarding JWT

router.post(
  '/language',
  protectOnboarding,
  [body('language').isString().trim().notEmpty().withMessage('Language is required')],
  validateRequest,
  updateLanguage,
);

router.post(
  '/location',
  protectOnboarding,
  [
    body('city').isString().trim().notEmpty().withMessage('City is required'),
    body('area').isString().trim().notEmpty().withMessage('Area is required'),
    body('lat').optional().isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),
    body('lng').optional().isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude'),
  ],
  validateRequest,
  updateLocation,
);

router.post(
  '/work-settings',
  protectOnboarding,
  [
    body('vehicleType')
      .isIn(['EV', 'Petrol', 'Bicycle'])
      .withMessage('vehicleType must be EV, Petrol, or Bicycle'),
    body('workArea').isString().trim().notEmpty().withMessage('workArea is required'),
    body('workTime').isArray().withMessage('workTime must be an array'),
    body('workTime.*')
      .isIn(['Morning', 'Afternoon', 'Night'])
      .withMessage('workTime values must be Morning, Afternoon, or Night'),
  ],
  validateRequest,
  updateWorkSettings,
);

router.post(
  '/profile',
  protectOnboarding,
  [
    body('name').isString().trim().notEmpty().withMessage('name is required'),
    body('age').isInt({ min: 18 }).withMessage('age must be at least 18'),
    body('gender').optional().isString().trim(),
  ],
  validateRequest,
  updateProfile,
);

router.post(
  '/bank',
  protectOnboarding,
  [
    body('accountNumber').isString().trim().notEmpty().withMessage('accountNumber is required'),
    body('confirmAccountNumber')
      .custom((value, { req }) => value === req.body.accountNumber)
      .withMessage('Account numbers must match'),
    body('ifsc')
      .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/)
      .withMessage('Invalid IFSC code'),
    body('bankName').isString().trim().notEmpty().withMessage('bankName is required'),
  ],
  validateRequest,
  updateBankDetails,
);

router.post(
  '/documents',
  protectOnboarding,
  [
    body('type').isIn(['Aadhaar', 'PAN', 'VoterID']).withMessage('Invalid document type'),
    body('idNumber').isString().trim().notEmpty().withMessage('idNumber is required'),
  ],
  validateRequest,
  updateDocuments,
);

module.exports = router;
