const mongoose = require('mongoose');

const fraudFlagSchema = new mongoose.Schema({
  worker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  claim: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Claim',
  },
  flagType: {
    type: String,
    enum: [
      'gps_mismatch',
      'duplicate_claim',
      'impossible_location',
      'outside_coverage_zone',
      'excessive_claims',
      'suspicious_pattern',
    ],
    required: true,
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium',
  },
  description: { type: String },
  evidence:    { type: mongoose.Schema.Types.Mixed },
  status:      {
    type: String,
    enum: ['open', 'investigating', 'resolved', 'dismissed'],
    default: 'open',
  },
  resolvedBy:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  resolvedAt:  { type: Date },
  resolution:  { type: String },
}, { timestamps: true });

fraudFlagSchema.index({ worker: 1 });
fraudFlagSchema.index({ status: 1 });
fraudFlagSchema.index({ severity: 1, status: 1 });

module.exports = mongoose.model('FraudFlag', fraudFlagSchema);
