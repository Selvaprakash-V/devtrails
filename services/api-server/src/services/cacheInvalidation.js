import { cacheDelPattern } from '../config/redis.js';

export const invalidateWorkerCache = async (workerId) => {
  try {
    await cacheDelPattern(`worker:${workerId}:*`);
    await cacheDelPattern(`dashboard:${workerId}:*`);
    await cacheDelPattern(`stats:${workerId}*`);
    await cacheDelPattern(`payouts:${workerId}*`);
    await cacheDelPattern(`fraud:${workerId}*`);
    console.log(`✅ Cache invalidated for worker: ${workerId}`);
  } catch (error) {
    console.error('Cache invalidation error:', error);
  }
};

export const invalidateDashboardCache = async (workerId) => {
  try {
    await cacheDelPattern(`dashboard:${workerId}:*`);
    console.log(`✅ Dashboard cache invalidated for worker: ${workerId}`);
  } catch (error) {
    console.error('Dashboard cache invalidation error:', error);
  }
};

export const invalidateStatsCache = async (workerId) => {
  try {
    await cacheDelPattern(`stats:${workerId}*`);
    console.log(`✅ Stats cache invalidated for worker: ${workerId}`);
  } catch (error) {
    console.error('Stats cache invalidation error:', error);
  }
};

export const invalidatePayoutsCache = async (workerId) => {
  try {
    await cacheDelPattern(`payouts:${workerId}*`);
    console.log(`✅ Payouts cache invalidated for worker: ${workerId}`);
  } catch (error) {
    console.error('Payouts cache invalidation error:', error);
  }
};
