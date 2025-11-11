// utils/cloudinary.js
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import User from "../models/user.js";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//  Generate Upload Signature (for frontend direct upload)

const generateUploadSignature = async (req, res) => {
  try {
    const userId = req.result?._id;

    if (!userId) {
      return res.status(400).json({ error: "User ID missing or unauthorized" });
    }

    // Verify user exists
    const userProfile = await User.findById(userId);
    if (!userProfile) {
      return res.status(404).json({ error: "User not found" });
    }

    // Create timestamp & upload params
    const timestamp = Math.round(Date.now() / 1000);
    const folder = "profileImages";
    const public_id = `${folder}/${userId}_${timestamp}`;

    const paramsToSign = {
      timestamp,
      folder,
      public_id,
    };

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET
    );

    const upload_url = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`;

    return res.status(200).json({
      signature,
      timestamp,
      folder,
      public_id,
      api_key: process.env.CLOUDINARY_API_KEY,
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      upload_url,
    });
  } catch (error) {
    console.error("Error generating upload signature:", error);
    return res.status(500).json({
      error: "Failed to generate upload credentials",
      details: error.message,
    });
  }
};


// Save Image Metadata (after successful Cloudinary upload)

const saveImageMetadata = async (req, res) => {
  try {
    const userId = req.result?._id;
    const { public_id, secure_url } = req.body; // match frontend payload


    if (!userId) return res.status(400).json({ error: "User ID missing" });
    if (!public_id || !secure_url)
      return res.status(400).json({ error: "Missing image data" });

    // Verify upload exists on Cloudinary
    const cloudResource = await cloudinary.api.resource(public_id, { resource_type: "image" });
    if (!cloudResource)
      return res.status(400).json({ error: "Image not found in Cloudinary" });

    // Fetch user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Delete old image if it exists
    if (user.profileImage && user.profileImage !== secure_url) {
      try {
        await cloudinary.uploader.destroy(user.profileImage);
      } catch (deleteError) {
        console.error("Error deleting old image:", deleteError);
      }
    }

    //  Save new Cloudinary URL
    user.profileImage = secure_url;
    await user.save();

    return res.status(200).json({
      message: "Profile image updated successfully",
      profileImage: user.profileImage,
    });
  } catch (error) {
    console.error("Error saving image metadata:", error);
    return res.status(500).json({
      error: "Failed to save image metadata",
      details: error.message,
    });
  }
};

export { generateUploadSignature, saveImageMetadata };
