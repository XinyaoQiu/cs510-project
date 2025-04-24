import Redis from 'ioredis';

const redis = new Redis({
  host: 'redis-18774.c232.us-east-1-2.ec2.redns.redis-cloud.com',
  port: 18774,
  username: 'default',
  password: 'tfvMCfutuMhzPJrf15yGba8wrUmVBUSS',
  tls: {}
});

redis.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

export default redis;
