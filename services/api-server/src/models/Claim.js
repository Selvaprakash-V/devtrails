import mongoose from 'mongoose';

const claimSchema = new mongoose.Schema({
  workerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker', required: true },
  policyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Policy' },
  
  disruptionType: { 
    type: String, 
    enum: ['rain', 'heat', 'aqi', 'traffic', 'combined'],
    required: true 
  },
  
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  
  riskScore: { type: Number, required: true },
  riskLevel: { type: String, required: true },
  
  breakdown: {
    rainfall: Number,
    temperature: Number,
    aqi: Number,
    traffic: Number
  },
  
  estimatedLoss: { type: Number, required: true },
  payoutAmount: { type: Number, required: true },
  
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected', 'credited'], 
    default: 'pending' 
  },
  
  weatherData: mongoose.Schema.Types.Mixed,
  
  fraudScore: { type: Number, default: 0 },
  fraudFlags: [String],
  
  planMultiplier: { type: Number, default: 1.0 },
  
  transactionId: String,
  creditedAt: Date,
  
  createdAt: { type: Date, default: Date.now },
  processedAt: Date,
  
  idempotencyKey: { type: String, unique: true, sparse: true }
});

claimSchema.index({ workerId: 1, createdAt: -1 });
claimSchema.index({ status: 1 });
claimSchema.index({ idempotencyKey: 1 });

export default mongoose.model('Claim', claimSchema);
