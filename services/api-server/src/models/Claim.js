import mongoose from 'mongoose';

const claimSchema = new mongoose.Schema({
  workerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker', required: true },
  policyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Policy' },
  disruptionType: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  riskScore: { type: Number, required: true },
  riskLevel: { type: String, required: true },
  estimatedLoss: { type: Number, required: true },
  payoutAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'paid'], default: 'pending' },
  weatherData: mongoose.Schema.Types.Mixed,
  fraudScore: { type: Number, default: 0 },
  fraudFlags: [String],
  createdAt: { type: Date, default: Date.now },
  processedAt: Date
});

export default mongoose.model('Claim', claimSchema);
