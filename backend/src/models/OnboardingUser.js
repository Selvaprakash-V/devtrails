const mongoose = require('mongoose');

const onboardingUserSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true,
    match: [/^[6-9]\d{9}$/, 'Invalid Indian phone number'],
  },
  isVerified: { type: Boolean, default: false },
  language: { type: String, default: 'English' },

  location: {
    city: { type: String },
    area: { type: String },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
  },

  workSettings: {
    vehicleType: { type: String, enum: ['EV', 'Petrol', 'Bicycle'], default: null },
    workArea: { type: String },
    workTime: [{ type: String, enum: ['Morning', 'Afternoon', 'Night'] }],
  },

  profile: {
    name: { type: String },
    age: { type: Number, min: 18 },
    gender: { type: String },
  },

  bankDetails: {
    accountNumber: { type: String, select: false },
    ifsc: { type: String },
    bankName: { type: String },
  },

  documents: {
    type: { type: String, enum: ['Aadhaar', 'PAN', 'VoterID'] },
    idNumber: { type: String },
    verified: { type: Boolean, default: false },
  },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('OnboardingUser', onboardingUserSchema);
