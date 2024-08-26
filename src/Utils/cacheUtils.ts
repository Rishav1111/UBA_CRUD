import redisClient from '../redis';

const CACHE_EXPIRY = 60*60;

export const getCache = async (key: string) => {
    const cache = await redisClient.get(key);
    return cache ? JSON.parse(cache) : null;
};

export const setCache = async (key: string, data: any) => {
    await redisClient.setex(key, CACHE_EXPIRY, JSON.stringify(data));
};
