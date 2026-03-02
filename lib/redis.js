import { createClient } from 'redis';

let redisClient;

export async function getRedisClient() {
  if (!process.env.REDIS_URL) {
    throw new Error('Missing REDIS_URL environment variable');
  }

  if (!redisClient) {
    redisClient = createClient({ url: process.env.REDIS_URL });
    redisClient.on('error', (error) => {
      console.error('Redis client error:', error);
    });
  }

  if (!redisClient.isOpen) {
    await redisClient.connect();
  }

  return redisClient;
}
