const Problem = require("../models/Problem");
const cloudinary = require("cloudinary").v2;
const SolutionVideo = require("../models/solutionVideo");
require("dotenv").config();

// Me 
const user = require('../models/user')


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

const generateUploadSignature = async (req, res) => {
    try {
        const { problemId } = req.params;
        const userId = req.result && req.result._id;

        // Verify the problem exists
        const problem = await Problem.findById(problemId);
        if (!problem) return res.status(404).json({ error: "Problem not found" });

        // Cloudinary expects 'timestamp' and 'public_id' keys when signing
        const timestamp = Math.round(Date.now() / 1000); // seconds
        const public_id = `leetcode-solution/${problemId}/${userId}_${timestamp}`;

        const signature = cloudinary.utils.api_sign_request(
            { public_id, timestamp },
            process.env.CLOUDINARY_API_SECRET
        );

        const upload_url = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/video/upload`;

        res.json({
            signature,
            timestamp,
            public_id,
            api_key: process.env.CLOUDINARY_API_KEY,
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            upload_url,
        });




    } catch (error) {
        console.error("Error generating upload signature:", error);
        res.status(500).json({ error: "Failed to generate upload credentials" });
    }
};

const saveVideoMetadata = async (req, res) => {
    try {
        const { cloudinaryPublicId, publicId, secureUrl, duration, problemId } = req.body;
        const userId = req.result && req.result._id;

        // determine which id we received
        const resourceId = cloudinaryPublicId || publicId;
        if (!resourceId || !problemId) return res.status(400).json({ error: "Missing required fields" });

        // verify the upload exists on Cloudinary
        const cloudResource = await cloudinary.api.resource(resourceId, { resource_type: "video" });
        if (!cloudResource) return res.status(400).json({ error: "Video not found in Cloudinary" });

        // check if video already exists for this problem & user
        const existingVideo = await SolutionVideo.findOne({ problemId, userId, cloudinaryPublicId: resourceId });
        if (existingVideo) return res.status(409).json({ error: "Video already exists" });

        // create thumbnail URL from the uploaded video
        const thumbnailUrl = cloudinary.url(resourceId, {
            resource_type: "video",
            transformation: [
                { width: 400, height: 223, crop: "fill" },
                { quality: "auto" },
                { start_offset: "auto" },
            ],
            format: "jpg",
        });

        const videoSolution = await SolutionVideo.create({
            problemId,
            userId,
            cloudinaryPublicId: resourceId,
            secureUrl: secureUrl || cloudResource.secure_url,
            duration: cloudResource.duration || duration || 0,
            thumbnailUrl,
        });

        res.status(201).json({
            message: "Video solution saved successfully",
            videoSolution: {
                id: videoSolution._id,
                thumbnailUrl: videoSolution.thumbnailUrl,
                duration: videoSolution.duration,
                uploadedAt: videoSolution.createdAt,
            },
        });
    } catch (error) {
        console.error("error in saving video metadata:", error);
        // Cloudinary API.resource throws when not found; forward a useful message
        const message = error && error.http_code ? "Cloudinary error" : "Internal server error";
        res.status(500).json({ error: message });
    }
};

const deleteVideo = async (req, res) => {
    try {
        const { problemId } = req.params;
        const userId = req.result && req.result._id;

        const video = await SolutionVideo.findOneAndDelete({ problemId });
        if (!video) return res.status(404).json({ error: "Video not found" });

        await cloudinary.uploader.destroy(video.cloudinaryPublicId, { resource_type: "video", invalidate: true });
        res.json({ message: "Video deleted successfully" });
    } catch (error) {
        console.error("error deleting video", error);
        res.status(500).json({ error: "failed to delete video" });
    }
};


const getVideo = async (req, res) => {
    try {
        // To get the Problem ID from the params
        const { problemId } = req.params;

        // To get UserId from the user payment Middleware
        const paymentHis = req.validPayment;
        const userId = paymentHis.paymentCreator; // Use paymentCreator as userId

        const userMatch = await user.findById(userId);
        if (!userMatch) {
            return res.status(404).json({ error: "Please Subscribe by Register/Login" });
        }

        // Check payment status before allowing access
        if (paymentHis.status !== "created") {
            return res.status(403).json({ error: "Payment not completed" });
        }

        // To check if the problem/solution is present or not
        const solution = await SolutionVideo.findOne({ problemId });

        // If the solution is not present
        if (!solution) {
            return res.status(404).send("Video not found");
        }

        // Sending the response only if payment status is "created"
        res.status(200).json({
            _id: solution._id,
            problemId: solution.problemId,
            secureUrl: solution.secureUrl,
            thumbnailUrl: solution.thumbnailUrl,
            duration: solution.duration, // fixed small typo
            solutionUpdatedAt: solution.solutionUpdatedAt, // better naming convention
            status: paymentHis.status, // To store the payment status
        });
    } catch (error) {
        console.error("The error is:", error);
        res.status(500).send("Server Error");
    }
};


const getLikes = async (req, res) => {
    try {
        const { videoId } = req.params;

        // Check if the video exists
        const video = await SolutionVideo.findById(videoId);
        if (!video) {
            return res.status(404).json({ error: "Video not found" });
        }

        // Return the current likes, dislikes, and comments
        res.status(200).json({
            likes: video.likes || 0,
            disLike: video.dislikes || 0,
            comments: video.comments || []
        });

    } catch (error) {
        console.error("Error fetching likes:", error);
        res.status(500).json({ error: "Server Error" });
    }
};

const likeVideo = async (req, res) => {
    try {
        const { videoId } = req.params;
        const { comment, like, dislikes } = req.body;

        // Check the videoId is present or not
        const video = await SolutionVideo.findById(videoId);
        if (!video) {
            return res.status(404).json({ error: "Video not found" });
        }

        // Update likes and dislikes
        if (like !== undefined) {
            video.likes = like;

        }
        if (dislikes !== undefined) {
            video.dislikes = dislikes;

        }

        // If a new comment is provided, push it to the comments array
        if (comment && comment.trim()) {
            video.comments.push(comment.trim());
        }

        // Saving to the database
        await video.save();

        res.status(200).json({ likes: video.likes, comments: video.comments, dislikes: video.dislikes });
    }
    catch (error) {
        console.error("Error in likeVideo:", error);
        res.status(500).json({ error: "Server Error" });
    }
}




module.exports = { generateUploadSignature, saveVideoMetadata, deleteVideo, getVideo, likeVideo, getLikes };
