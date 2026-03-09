const mongoose = require('mongoose');

const disruptionEventSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['rain', 'heat', 'aqi', 'flood', 'curfew', 'storm'],
    required: true,
  },
  city:   { type: String, required: true },
  zone:   { type: String },
  location: {
    lat: Number,
    lon: Number,
  },

  // Measured values
  measuredValue:   { type: Number },
  threshold:       { type: Number },
  unit:            { type: String },
  severity:        { type: String, enum: ['low', 'medium', 'high', 'extreme'], default: 'medium' },

  // Raw API data
  weatherData:     { type: mongoose.Schema.Types.Mixed },

  detectedAt:      { type: Date, default: Date.now },
  resolvedAt:      { type: Date },
  isActive:        { type: Boolean, default: true },
  isTriggered:     { type: Boolean, default: false },

  affectedWorkers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  claimsGenerated: { type: Number, default: 0 },

  source:          { type: String, default: 'OpenWeatherMap' },
}, { timestamps: true });

disruptionEventSchema.index({ city: 1, type: 1, detectedAt: -1 });
disruptionEventSchema.index({ isActive: 1 });

module.exports = mongoose.model('DisruptionEvent', disruptionEventSchema);
