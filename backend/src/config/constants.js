module.exports = {
  DISRUPTION_TYPES: {
    RAIN:       { key: 'rain',       label: 'Heavy Rain',        threshold: 80,  unit: 'mm/hr',     icon: 'CloudRain' },
    HEAT:       { key: 'heat',       label: 'Extreme Heat',      threshold: 42,  unit: '°C',        icon: 'Thermometer' },
    AQI:        { key: 'aqi',        label: 'Poor Air Quality',  threshold: 300, unit: 'AQI',       icon: 'Wind' },
    FLOOD:      { key: 'flood',      label: 'Flood Alert',       threshold: 1,   unit: 'alert lvl', icon: 'Waves' },
    CURFEW:     { key: 'curfew',     label: 'Curfew/Lockdown',   threshold: 1,   unit: 'active',    icon: 'Lock' },
    STORM:      { key: 'storm',      label: 'Severe Storm',      threshold: 1,   unit: 'active',    icon: 'CloudLightning' },
  },

  RISK_LEVELS: {
    LOW:    { label: 'Low',    min: 0,  max: 33,  color: '#10b981' },
    MEDIUM: { label: 'Medium', min: 34, max: 66,  color: '#f59e0b' },
    HIGH:   { label: 'High',   min: 67, max: 100, color: '#ef4444' },
  },

  PREMIUM_BASE: 20,           // ₹ per week
  MAX_COMPENSATION: 500,      // ₹ per week
  PLATFORM_FEE_PCT: 0.10,    // 10%

  CLAIM_STATUS: ['pending', 'approved', 'paid', 'rejected', 'flagged'],
  POLICY_STATUS: ['active', 'inactive', 'expired', 'cancelled'],
  USER_ROLES:   ['worker', 'admin'],

  DELIVERY_PLATFORMS: ['Swiggy', 'Zomato', 'Dunzo', 'Blinkit', 'Other'],

  CITIES: [
    { name: 'Mumbai',    lat: 19.0760, lon: 72.8777 },
    { name: 'Delhi',     lat: 28.6139, lon: 77.2090 },
    { name: 'Bengaluru', lat: 12.9716, lon: 77.5946 },
    { name: 'Chennai',   lat: 13.0827, lon: 80.2707 },
    { name: 'Hyderabad', lat: 17.3850, lon: 78.4867 },
    { name: 'Kolkata',   lat: 22.5726, lon: 88.3639 },
    { name: 'Pune',      lat: 18.5204, lon: 73.8567 },
  ],
};
