const redis = require("redis");
require('dotenv').config()


const redisClient = redis.createClient({
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: 18669
    }
});


module.exports = redisClient;