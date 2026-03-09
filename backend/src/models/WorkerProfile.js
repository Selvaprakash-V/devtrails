const mongoose = require('mongoose');

const workerProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  deliveryPlatform: {
    type: String,
    enum: ['Swiggy', 'Zomato', 'Dunzo', 'Blinkit', 'Other'],
    required: true,
  },
  city: { type: String, required: true },
  zone: { type: String },
  location: {
    lat:  { type: Number, required: true },
    lon:  { type: Number, required: true },
    address: { type: String },
  },
  vehicleType: {
    type: String,
    enum: ['bike', 'bicycle', 'scooter', 'car'],
    default: 'bike',
  },
  avgWeeklyIncome: { type: Number, default: 3000 }, // ₹
  workingDaysPerWeek: { type: Number, default: 6, min: 1, max: 7 },

  riskScore: { type: Number, default: 0, min: 0, max: 100 },
  riskLevel: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'low',
  },
  riskLastUpdated: { type: Date },

  weeklyPremium: { type: Number, default: 20 },     // ₹
  totalEarningsProtected: { type: Number, default: 0 },
  totalClaimsReceived:    { type: Number, default: 0 },

  kycStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending',
  },
  documents: [{
    type: { type: String },
    url:  { type: String },
    uploadedAt: { type: Date, default: Date.now },
  }],
}, { timestamps: true });

module.exports = mongoose.model('WorkerProfile', workerProfileSchema);
