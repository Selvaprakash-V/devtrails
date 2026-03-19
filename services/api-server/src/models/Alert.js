import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  workerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker', required: true },
  
  type: { 
    type: String, 
    enum: ['high_risk', 'payout_credited', 'gps_issue', 'trust_warning', 'plan_expiry'],
    required: true 
  },
  
  severity: { 
    type: String, 
    enum: ['info', 'warning', 'critical'], 
    default: 'info' 
  },
  
  title: { type: String, required: true },
  message: { type: String, required: true },
  
  data: mongoose.Schema.Types.Mixed,
  
  isRead: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  
  createdAt: { type: Date, default: Date.now },
  expiresAt: Date
});

alertSchema.index({ workerId: 1, isActive: 1, createdAt: -1 });

export default mongoose.model('Alert', alertSchema);
