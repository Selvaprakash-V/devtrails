import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3
});

redis.on('connect', () => {
  console.log('✅ Redis connected successfully');
});

redis.on('error', (err) => {
  console.error('❌ Redis connection error:', err);
});

// Cache TTL configurations (in seconds)
export const CACHE_TTL = {
  WEATHER: 300,        // 5 minutes - weather data
  WORKER_PROFILE: 600, // 10 minutes - worker profile
  DASHBOARD: 60,       // 1 minute - dashboard data
  STATS: 300,          // 5 minutes - statistics
  FRAUD_FLAGS: 180,    // 3 minutes - fraud detection
  PAYOUTS: 120         // 2 minutes - payout history
};

// Helper functions
export const cacheGet = async (key) => {
  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Cache get error:', error);
    return null;
  }
};

export const cacheSet = async (key, value, ttl = 300) => {
  try {
    await redis.setex(key, ttl, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('Cache set error:', error);
    return false;
  }
};

export const cacheDel = async (key) => {
  try {
    await redis.del(key);
    return true;
  } catch (error) {
    console.error('Cache delete error:', error);
    return false;
  }
};

export const cacheDelPattern = async (pattern) => {
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
    return true;
  } catch (error) {
    console.error('Cache delete pattern error:', error);
    return false;
  }
};

export default redis;
