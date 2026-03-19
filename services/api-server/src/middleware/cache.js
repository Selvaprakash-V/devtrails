import { cacheGet, cacheSet } from '../config/redis.js';

// Cache middleware factory
export const cacheMiddleware = (ttl = 300, keyGenerator = null) => {
  return async (req, res, next) => {
    // Skip cache for non-GET requests
    if (req.method !== 'GET') {
      return next();
    }

    try {
      // Generate cache key
      const cacheKey = keyGenerator 
        ? keyGenerator(req) 
        : `cache:${req.originalUrl}:${req.user?.id || 'guest'}`;

      // Try to get from cache
      const cachedData = await cacheGet(cacheKey);
      
      if (cachedData) {
        console.log(`✅ Cache HIT: ${cacheKey}`);
        return res.json(cachedData);
      }

      console.log(`❌ Cache MISS: ${cacheKey}`);

      // Store original json method
      const originalJson = res.json.bind(res);

      // Override json method to cache response
      res.json = (data) => {
        // Cache the response
        cacheSet(cacheKey, data, ttl).catch(err => {
          console.error('Failed to cache response:', err);
        });

        // Send response
        return originalJson(data);
      };

      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      next();
    }
  };
};

// Specific cache key generators
export const workerCacheKey = (req) => {
  return `worker:${req.user.id}:profile`;
};

export const dashboardCacheKey = (req) => {
  const { lat, lng } = req.query;
  return `dashboard:${req.user.id}:${lat}:${lng}`;
};

export const statsCacheKey = (req) => {
  return `stats:${req.user.id}`;
};

export const payoutsCacheKey = (req) => {
  return `payouts:${req.user.id}`;
};

export const fraudFlagsCacheKey = (req) => {
  return `fraud:${req.user.id}`;
};
