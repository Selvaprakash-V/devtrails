const User = require('../models/User');
const WorkerProfile = require('../models/WorkerProfile');
const { generateToken } = require('../middleware/auth');

// POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { name, email, phone, password, role = 'worker', city, deliveryPlatform, location } = req.body;

    const user = await User.create({ name, email, phone, password, role });

    if (role === 'worker') {
      await WorkerProfile.create({
        user: user._id,
        city: city || 'Mumbai',
        deliveryPlatform: deliveryPlatform || 'Swiggy',
        location: location || { lat: 19.076, lon: 72.8777 },
      });
    }

    const token = generateToken(user._id);
    res.status(201).json({ success: true, token, user });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id);
    res.json({ success: true, token, user });
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

module.exports = { register, login, getMe };
