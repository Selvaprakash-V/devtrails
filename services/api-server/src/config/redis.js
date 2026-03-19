// Redis disabled - using PostgreSQL only
const redis = null;

// Cache TTL configurations (in seconds)
export const CACHE_TTL = {
  WEATHER: 300,
  WORKER_PROFILE: 600,
  DASHBOARD: 60,
  STATS: 300,
  FRAUD_FLAGS: 180,
  PAYOUTS: 120
};

export const cacheGet = async (key) => null;
export const cacheSet = async (key, value, ttl = 300) => false;
export const cacheDel = async (key) => false;
export const cacheDelPattern = async (pattern) => false;

export default redis;
