import mongoose from 'mongoose';

const locationHistorySchema = new mongoose.Schema({
  lat: Number,
  lng: Number,
  timestamp: { type: Date, default: Date.now },
  speed: Number,
  accuracy: Number
}, { _id: false });

const workerSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  city: { type: String, required: true },
  platform: { type: String, enum: ['swiggy', 'zomato'], required: true },
  vehicleType: { type: String, enum: ['bike', 'scooter', 'cycle'] },
  licenseNumber: String,
  
  avgOrdersPerDay: { type: Number, default: 15 },
  payoutPerOrder: { type: Number, default: 50 },
  workingHours: { type: Number, default: 8 },
  
  currentLocation: {
    lat: Number,
    lng: Number,
    timestamp: Date,
    accuracy: Number
  },
  
  locationHistory: [locationHistorySchema],
  
  trustScore: { type: Number, default: 100, min: 0, max: 100 },
  trustStatus: { 
    type: String, 
    enum: ['trusted', 'under_review', 'risky'], 
    default: 'trusted' 
  },
  
  plan: {
    type: { type: String, enum: ['basic', 'pro', 'elite'], default: 'basic' },
    multiplier: { type: Number, default: 1.0 },
    coveredConditions: [String],
    startDate: Date,
    endDate: Date
  },
  
  gpsStatus: { 
    type: String, 
    enum: ['active', 'weak', 'offline'], 
    default: 'offline' 
  },
  
  lastActive: Date,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

workerSchema.index({ phone: 1 });
workerSchema.index({ 'currentLocation.lat': 1, 'currentLocation.lng': 1 });

export default mongoose.model('Worker', workerSchema);
