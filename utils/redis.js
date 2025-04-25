import Redis from 'ioredis';
import * as dotenv from 'dotenv';
dotenv.config();

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
});

redis.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

export default redis;
