const express = require("express");
const vidoRouter = express.Router();

const adminMiddleware = require("../middleware/adminMiddleware")
const UserMiddleware=require("../middleware/UserMiddleware")

const {
    generateUploadSignature, saveVideoMetadata, deleteVideo,getVideo,likeVideo,getLikes
} = require("../controllers/videoSection");
const paymentMiddleware = require("../middleware/PaymentMiddleware");



vidoRouter.get("/create/:problemId", adminMiddleware, generateUploadSignature)
vidoRouter.post("/save", adminMiddleware, saveVideoMetadata)
vidoRouter.delete("/delete/:problemId", adminMiddleware, deleteVideo)


// To get the video 
vidoRouter.get("/:problemId",UserMiddleware,paymentMiddleware,getVideo)

// Me comment , like
vidoRouter.get("/like/:videoId",UserMiddleware,paymentMiddleware,getLikes)
vidoRouter.post("/like/:videoId",UserMiddleware,paymentMiddleware,likeVideo)




module.exports = vidoRouter