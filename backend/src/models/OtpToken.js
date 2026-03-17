const mongoose = require('mongoose');

const otpTokenSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    index: true,
  },
  otpHash: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 }, // TTL index based on expiresAt
  },
}, { timestamps: true });

module.exports = mongoose.model('OtpToken', otpTokenSchema);
