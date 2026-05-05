import redisConfig from "../config/cache.js";

//initialize redis
const redis = redisConfig.redis || null;
redis.on('connect', ()=> {
    console.log("connect to redis server")
});

redis.on('connect', ()=> {
    console.log("Error connecting to redis server")
});

export default{
    redis,
    async get(key){
        const data =  await redis.get(key)
        return data ? JSON.parse(data) : null
    },
    async set(key, value, ttl = redisConfig.TTL){
        await redis.set(key, JSON.stringify(value), 'EX', ttl )
    },
    async del(key){
        await redis.del(key);
    }
};
//This is all about setup redis: