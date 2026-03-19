import mongoose from 'mongoose';

const workerSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  city: { type: String, required: true },
  platform: { type: String, enum: ['swiggy', 'zomato', 'uber', 'other'], default: 'swiggy' },
  avgOrdersPerDay: { type: Number, default: 15 },
  payoutPerOrder: { type: Number, default: 50 },
  workingHours: { type: Number, default: 8 },
  currentLocation: {
    lat: Number,
    lng: Number,
    timestamp: Date
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Worker', workerSchema);
