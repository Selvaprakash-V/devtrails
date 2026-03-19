import mongoose from 'mongoose';

const riskSnapshotSchema = new mongoose.Schema({
  workerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker', required: true },
  
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  
  riskScore: { type: Number, required: true, min: 0, max: 100 },
  riskLevel: { type: String, enum: ['low', 'medium', 'high'], required: true },
  
  breakdown: {
    rainfall: Number,
    temperature: Number,
    aqi: Number,
    traffic: Number
  },
  
  environmentalData: {
    rainfall: Number,
    temperature: Number,
    aqi: Number,
    traffic: Number,
    weatherCondition: String
  },
  
  timestamp: { type: Date, default: Date.now }
});

riskSnapshotSchema.index({ workerId: 1, timestamp: -1 });

export default mongoose.model('RiskSnapshot', riskSnapshotSchema);
