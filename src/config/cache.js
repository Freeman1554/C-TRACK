// src/config/cache.js
import IORedis from "ioredis";
import config from "./index.js";

// Create Redis instance properly
const redis = new IORedis(config.REDIS_URL);

// Add helpful connection logs
redis.on("connect", () => {
  console.log(" Redis connected successfully");
});

redis.on("error", (err) => {
  console.error(" Redis connection error:", err.message);
});

const TTL = config.REDIS_TTL;

//  Export the actual instance and value correctly
export default { 
  redis, 
  async get(key) {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  },
  async set(key, value, ttl = TTL) {
    await redis.set(key, JSON.stringify(value), "EX", ttl);
  },
  async del(key){
    await redis.del(key);
  },
};
