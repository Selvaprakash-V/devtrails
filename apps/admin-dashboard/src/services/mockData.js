// Shared mock data — used as fallback when API is unavailable

export const MOCK_DASHBOARD = {
  totalWorkers: 4821,
  activePolicies: 3204,
  liveDisruptions: 7,
  totalPayoutsToday: 284500,
  fraudAlerts: 23,
  payoutTrend: [
    { time: '08:00', amount: 12000 }, { time: '09:00', amount: 18500 },
    { time: '10:00', amount: 22000 }, { time: '11:00', amount: 31000 },
    { time: '12:00', amount: 45000 }, { time: '13:00', amount: 38000 },
    { time: '14:00', amount: 52000 }, { time: '15:00', amount: 66000 },
  ],
  claimsPerCity: [
    { city: 'Chennai', claims: 312 }, { city: 'Mumbai', claims: 278 },
    { city: 'Bangalore', claims: 245 }, { city: 'Delhi', claims: 198 },
    { city: 'Hyderabad', claims: 167 }, { city: 'Pune', claims: 134 },
  ],
  riskDistribution: [
    { name: 'Low Risk', value: 58, color: '#10b981' },
    { name: 'Medium Risk', value: 28, color: '#f59e0b' },
    { name: 'High Risk', value: 14, color: '#ef4444' },
  ],
  insights: [
    '⚡ Spike in payouts detected in Chennai (+230%) — possible coordinated event',
    '📍 Unusual clustering of 87 claims in Zone 4-B, same 500m radius',
    '🌧 Rain threshold exceeded in 3 zones — 1,200 workers affected',
  ],
};

export const MOCK_WORKERS = [
  { _id: 'W001', name: 'Ravi Kumar', platform: 'Swiggy', city: 'Chennai', riskScore: 82, location: '13.0827° N, 80.2707° E', status: 'Suspicious' },
  { _id: 'W002', name: 'Priya Sharma', platform: 'Zomato', city: 'Mumbai', riskScore: 21, location: '19.0760° N, 72.8777° E', status: 'Active' },
  { _id: 'W003', name: 'Arjun Nair', platform: 'Swiggy', city: 'Bangalore', riskScore: 45, location: '12.9716° N, 77.5946° E', status: 'Active' },
  { _id: 'W004', name: 'Meena Devi', platform: 'Dunzo', city: 'Chennai', riskScore: 91, location: '13.0827° N, 80.2707° E', status: 'Suspicious' },
  { _id: 'W005', name: 'Suresh Babu', platform: 'Zomato', city: 'Delhi', riskScore: 12, location: '28.6139° N, 77.2090° E', status: 'Active' },
  { _id: 'W006', name: 'Kavitha R', platform: 'Swiggy', city: 'Hyderabad', riskScore: 38, location: '17.3850° N, 78.4867° E', status: 'Idle' },
  { _id: 'W007', name: 'Dinesh P', platform: 'Dunzo', city: 'Chennai', riskScore: 88, location: '13.0827° N, 80.2707° E', status: 'Suspicious' },
  { _id: 'W008', name: 'Lakshmi V', platform: 'Zomato', city: 'Pune', riskScore: 29, location: '18.5204° N, 73.8567° E', status: 'Active' },
];

export const MOCK_DISRUPTIONS = [
  { id: 'D001', type: 'Rain', city: 'Chennai', severity: 'High', affectedWorkers: 1240, timestamp: '2024-01-15 14:30', threshold: '85mm/hr', actual: '112mm/hr' },
  { id: 'D002', type: 'Heat Wave', city: 'Delhi', severity: 'Medium', affectedWorkers: 890, timestamp: '2024-01-15 11:00', threshold: '42°C', actual: '45°C' },
  { id: 'D003', type: 'AQI Spike', city: 'Mumbai', severity: 'High', affectedWorkers: 670, timestamp: '2024-01-15 09:15', threshold: 'AQI 200', actual: 'AQI 287' },
  { id: 'D004', type: 'Rain', city: 'Bangalore', severity: 'Low', affectedWorkers: 320, timestamp: '2024-01-15 16:45', threshold: '85mm/hr', actual: '91mm/hr' },
  { id: 'D005', type: 'Cyclone Warning', city: 'Chennai', severity: 'Critical', affectedWorkers: 2100, timestamp: '2024-01-15 08:00', threshold: 'Cat 1', actual: 'Cat 2' },
];

export const MOCK_CLAIMS = [
  { _id: 'C001', worker: 'Ravi Kumar', city: 'Chennai', triggerType: 'Rain', payoutAmount: 450, status: 'Flagged', riskLevel: 'high' },
  { _id: 'C002', worker: 'Priya Sharma', city: 'Mumbai', triggerType: 'AQI', payoutAmount: 280, status: 'Approved', riskLevel: 'low' },
  { _id: 'C003', worker: 'Arjun Nair', city: 'Bangalore', triggerType: 'Rain', payoutAmount: 320, status: 'Approved', riskLevel: 'low' },
  { _id: 'C004', worker: 'Meena Devi', city: 'Chennai', triggerType: 'Rain', payoutAmount: 450, status: 'Flagged', riskLevel: 'high' },
  { _id: 'C005', worker: 'Suresh Babu', city: 'Delhi', triggerType: 'Heat Wave', payoutAmount: 380, status: 'Pending', riskLevel: 'medium' },
  { _id: 'C006', worker: 'Dinesh P', city: 'Chennai', triggerType: 'Rain', payoutAmount: 450, status: 'Rejected', riskLevel: 'high' },
  { _id: 'C007', worker: 'Kavitha R', city: 'Hyderabad', triggerType: 'AQI', payoutAmount: 210, status: 'Approved', riskLevel: 'low' },
  { _id: 'C008', worker: 'Lakshmi V', city: 'Pune', triggerType: 'Rain', payoutAmount: 290, status: 'Pending', riskLevel: 'medium' },
];

export const MOCK_FRAUD_ALERTS = [
  { _id: 'F001', worker: 'Ravi Kumar', workerId: 'W001', city: 'Chennai', fraudScore: 91, reason: 'GPS/IP mismatch + cluster anomaly', signals: ['GPS vs IP: 48km gap', 'Speed: 0 km/h for 4hrs', 'Cluster: 23 workers same coords'], severity: 'critical', action: 'Block & Review' },
  { _id: 'F002', worker: 'Meena Devi', workerId: 'W004', city: 'Chennai', fraudScore: 87, reason: 'Duplicate claims + inactive period', signals: ['3 claims in 4 minutes', 'No movement 6hrs', 'Same zone as 18 others'], severity: 'critical', action: 'Reduce Payout' },
  { _id: 'F003', worker: 'Dinesh P', workerId: 'W007', city: 'Chennai', fraudScore: 78, reason: 'Temporal burst pattern', signals: ['Claim burst: 2min window', 'Identical coordinates', 'New account < 7 days'], severity: 'high', action: 'Flag for Review' },
  { _id: 'F004', worker: 'Unknown W112', workerId: 'W112', city: 'Mumbai', fraudScore: 62, reason: 'Speed anomaly detected', signals: ['Speed: 180 km/h recorded', 'Location jump: 90km in 3min'], severity: 'medium', action: 'Monitor' },
];

export const MOCK_ADVERSARIAL = {
  attackSummary: { totalSuspected: 87, coordinatedRings: 3, blockedPayouts: 39150, savedAmount: 156000 },
  clusterData: [
    { id: 1, workers: 34, lat: 13.0827, lng: 80.2707, city: 'Chennai', riskScore: 94, type: 'GPS Spoof Ring' },
    { id: 2, workers: 28, lat: 19.0760, lng: 72.8777, city: 'Mumbai', riskScore: 81, type: 'Temporal Burst' },
    { id: 3, workers: 25, lat: 28.6139, lng: 77.2090, city: 'Delhi', riskScore: 76, type: 'Duplicate Claims' },
  ],
  fraudScoreHistogram: [
    { range: '0-20', count: 1820 }, { range: '20-40', count: 1240 },
    { range: '40-60', count: 680 }, { range: '60-80', count: 312 },
    { range: '80-100', count: 87 },
  ],
  claimBursts: [
    { time: '14:00', normal: 12, burst: 0 }, { time: '14:05', normal: 14, burst: 0 },
    { time: '14:10', normal: 11, burst: 0 }, { time: '14:15', normal: 13, burst: 67 },
    { time: '14:20', normal: 15, burst: 71 }, { time: '14:25', normal: 12, burst: 58 },
    { time: '14:30', normal: 14, burst: 4 }, { time: '14:35', normal: 13, burst: 0 },
  ],
  scatterData: {
    normal: Array.from({ length: 60 }, (_, i) => ({ x: Math.random() * 80, y: Math.random() * 60, id: `N${i}` })),
    anomaly: Array.from({ length: 18 }, (_, i) => ({ x: 70 + Math.random() * 25, y: 70 + Math.random() * 25, id: `A${i}` })),
  },
};
