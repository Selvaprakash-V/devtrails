export const RISK_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
};

export const CLAIM_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  PAID: 'paid'
};

export const FRAUD_THRESHOLDS = {
  GPS_IP_DISTANCE_KM: 20,
  MAX_SPEED_KMH: 120,
  MIN_CLAIM_INTERVAL_HOURS: 6,
  MAX_LOCATION_JUMP_KM: 50
};

export const CITIES = {
  BANGALORE: { factor: 1.2, name: 'Bangalore' },
  DELHI: { factor: 1.15, name: 'Delhi' },
  MUMBAI: { factor: 1.3, name: 'Mumbai' },
  HYDERABAD: { factor: 1.1, name: 'Hyderabad' },
  PUNE: { factor: 1.05, name: 'Pune' }
};
