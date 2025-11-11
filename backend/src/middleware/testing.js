const redisClient = require('../config/Redis')

const submitCodeRateLimiter = async (req, res, next) => {

    const userId = req.result._id;
    const redisKey = `submit_coolDown:${userId}`;


    try {
        // check if user has a recent submission
        const exists = await redisClient.exists(redisKey)
        if (exists) {
            return res.status(429).json({
                error: 'pleace wait for 10 second before submission again'
            });
        }


        // Set coolDown period
        await redisClient.set(redisKey, "coolDown_active", { EX: 10, NX: true })

        next();

    } catch (error) {
        res.status(500).json({ error: "Internal server error" + error })
    }

}


module.exports = submitCodeRateLimiter;