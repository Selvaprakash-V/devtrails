const mongoose = require('mongoose');

const insurancePolicySchema = new mongoose.Schema({
  worker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  policyNumber: {
    type: String,
    unique: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'expired', 'cancelled'],
    default: 'inactive',
  },
  weeklyPremium: { type: Number, required: true }, // ₹
  maxCompensation: { type: Number, required: true }, // ₹ per week

  // Coverage breakdown
  coverageConfig: {
    rain:      { enabled: Boolean, maxPayout: Number, multiplier: Number },
    heat:      { enabled: Boolean, maxPayout: Number, multiplier: Number },
    aqi:       { enabled: Boolean, maxPayout: Number, multiplier: Number },
    flood:     { enabled: Boolean, maxPayout: Number, multiplier: Number },
    curfew:    { enabled: Boolean, maxPayout: Number, multiplier: Number },
  },

  premiumBreakdown: {
    base:       { type: Number },
    rainRisk:   { type: Number },
    heatRisk:   { type: Number },
    aqiRisk:    { type: Number },
    platformFee:{ type: Number },
    total:      { type: Number },
  },

  startDate:    { type: Date },
  endDate:      { type: Date },
  renewalDate:  { type: Date },
  autoRenew:    { type: Boolean, default: true },

  totalPremiumPaid:   { type: Number, default: 0 },
  totalClaimsPaid:    { type: Number, default: 0 },
  claimsCount:        { type: Number, default: 0 },

  paymentMethod: { type: String, enum: ['upi', 'card', 'wallet'], default: 'upi' },
  paymentHistory: [{
    amount:    Number,
    paidAt:    Date,
    txnId:     String,
    status:    { type: String, enum: ['success', 'failed', 'pending'] },
  }],
}, { timestamps: true });

// Auto-generate policy number
insurancePolicySchema.pre('save', function (next) {
  if (!this.policyNumber) {
    this.policyNumber = 'DT-' + Date.now().toString(36).toUpperCase() +
      '-' + Math.random().toString(36).substr(2, 4).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('InsurancePolicy', insurancePolicySchema);
