import mongoose from 'mongoose';

const fraudFlagSchema = new mongoose.Schema({
  workerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker', required: true },
  claimId: { type: mongoose.Schema.Types.ObjectId, ref: 'Claim' },
  flagType: { type: String, required: true },
  severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], required: true },
  details: mongoose.Schema.Types.Mixed,
  resolved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('FraudFlag', fraudFlagSchema);
