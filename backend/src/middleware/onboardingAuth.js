const jwt = require('jsonwebtoken');
const OnboardingUser = require('../models/OnboardingUser');

const protectOnboarding = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await OnboardingUser.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

const generateOnboardingToken = (userId) =>
  jwt.sign({ id: userId, scope: 'onboarding' }, process.env.JWT_SECRET, {
    expiresIn: process.env.ONBOARDING_JWT_EXPIRE || '30d',
  });

module.exports = { protectOnboarding, generateOnboardingToken };
