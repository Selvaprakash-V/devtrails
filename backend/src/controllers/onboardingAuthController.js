const bcrypt = require('bcryptjs');
const OtpToken = require('../models/OtpToken');
const OnboardingUser = require('../models/OnboardingUser');
const { generateOnboardingToken } = require('../middleware/onboardingAuth');

const OTP_EXPIRY_MINUTES = parseInt(process.env.OTP_EXPIRY_MINUTES || '5', 10);

// POST /api/auth/send-otp
exports.sendOtp = async (req, res, next) => {
  try {
    const { phone } = req.body;
    const otp = ('' + Math.floor(100000 + Math.random() * 900000)).slice(-6);
    const otpHash = await bcrypt.hash(otp, 10);

    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    await OtpToken.findOneAndUpdate(
      { phone },
      { otpHash, expiresAt },
      { upsert: true, new: true }
    );

    // In production, send via SMS provider (Twilio, etc.).
    // For now, return OTP only in non-production for easier testing.
    const payload = { success: true, message: 'OTP sent successfully' };
    if (process.env.NODE_ENV !== 'production') {
      payload.debugOtp = otp;
    }

    res.json(payload);
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/verify-otp
exports.verifyOtp = async (req, res, next) => {
  try {
    const { phone, otp, language } = req.body;

    const record = await OtpToken.findOne({ phone });
    if (!record) {
      return res.status(400).json({ success: false, message: 'OTP not found or expired' });
    }

    if (record.expiresAt < new Date()) {
      await OtpToken.deleteOne({ _id: record._id });
      return res.status(400).json({ success: false, message: 'OTP expired' });
    }

    const isMatch = await bcrypt.compare(otp, record.otpHash);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    await OtpToken.deleteOne({ _id: record._id });

    let user = await OnboardingUser.findOne({ phone });
    if (!user) {
      user = await OnboardingUser.create({
        phone,
        isVerified: true,
        ...(language ? { language } : {}),
      });
    } else {
      user.isVerified = true;
      if (language) {
        user.language = language;
      }
      await user.save();
    }

    const token = generateOnboardingToken(user._id);

    res.json({
      success: true,
      token,
      user,
    });
  } catch (err) {
    next(err);
  }
};
