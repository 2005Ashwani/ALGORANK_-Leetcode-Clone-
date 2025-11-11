const jwt = require('jsonwebtoken');
const redisClient = require('../config/Redis');
const User=require("../models/user")

const userMiddleware = async (req, res, next) => {
    try {
        const { token } = req.cookies

        if (!token) {
            throw new Error("Token Not Present");

        }
        const payload = jwt.verify(token, process.env.JWT_Token)
        const { _id } = payload
        if (!_id) {
            throw new Error("Invalid Token");

        }
        const result = await User.findById(_id)
        if (!result) {
            throw new Error("User Not Exist");

        }
        // to check weather its present in block token or not

        const IsBlocked = await redisClient.exists(`token:${token}`)
        if (IsBlocked) {
            throw new Error("Invalid token");

        }
        req.result = result
        next();
    } catch (error) {
        res.status(401).send("Error " + error.message)

    }
}



module.exports = userMiddleware