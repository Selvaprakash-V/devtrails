const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
  worker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  policy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InsurancePolicy',
    required: true,
  },
  disruption: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DisruptionEvent',
    required: true,
  },

  claimNumber: { type: String, unique: true },
  type:         { type: String, enum: ['rain', 'heat', 'aqi', 'flood', 'curfew', 'storm'] },
  status:       {
    type: String,
    enum: ['pending', 'approved', 'paid', 'rejected', 'flagged'],
    default: 'pending',
  },

  amount:       { type: Number, required: true },   // ₹ payout
  disruptionValue: { type: Number },                // e.g. 95mm rainfall
  threshold:    { type: Number },                   // trigger threshold

  isAutomatic:  { type: Boolean, default: true },   // parametric auto-claim
  isParametric: { type: Boolean, default: true },

  // Fraud
  fraudScore:   { type: Number, default: 0, min: 0, max: 100 },
  fraudFlags:   [{ type: String }],
  reviewedBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviewedAt:   { type: Date },
  reviewNote:   { type: String },

  // Payout
  payoutTxnId:  { type: String },
  paidAt:       { type: Date },
  paidVia:      { type: String, default: 'UPI' },
  workerUPI:    { type: String },

  // Timeline events
  timeline: [{
    event:     { type: String },
    timestamp: { type: Date, default: Date.now },
    meta:      { type: mongoose.Schema.Types.Mixed },
  }],
}, { timestamps: true });

claimSchema.pre('save', function (next) {
  if (!this.claimNumber) {
    this.claimNumber = 'CLM-' + Date.now().toString(36).toUpperCase() +
      '-' + Math.random().toString(36).substr(2, 4).toUpperCase();
  }
  next();
});

claimSchema.index({ worker: 1, createdAt: -1 });
claimSchema.index({ status: 1 });
claimSchema.index({ fraudScore: -1 });

module.exports = mongoose.model('Claim', claimSchema);
