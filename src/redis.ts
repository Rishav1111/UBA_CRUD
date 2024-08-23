import Redis from 'ioredis';

const redisClient = new Redis({
    host: '192.168.1.2',
    port: 6379,
});

redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});

// Test connection
redisClient.ping().then((result) => console.log('Redis connection:', result));

export default redisClient;
