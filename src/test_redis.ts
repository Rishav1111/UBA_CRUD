// redisTest.ts
import redisClient from './redis'; // Import the Redis client setup

const testRedisConnection = async () => {
    try {
        // Test connection
        const pingResponse = await redisClient.ping();
        console.log('Redis connection test response:', pingResponse);

        // Test setting and getting a value
        await redisClient.set('test:key', 'testValue');
        const value = await redisClient.get('test:key');
        console.log('Value for "test:key":', value);

        // Clean up test data
        await redisClient.del('test:key');

        // Close the connection
        redisClient.disconnect();
    } catch (error) {
        console.error('Error testing Redis connection:', error);
    }
};

testRedisConnection();
