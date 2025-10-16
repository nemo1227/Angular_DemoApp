import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();
export const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379
  },
  username: process.env.REDIS_USERNAME || undefined,
  password: process.env.REDIS_PASSWORD || undefined
});

redisClient.on('error', (err) => console.error('❌ Redis Client Error', err));

await redisClient.connect();   
console.log('✅ Connected to Redis');