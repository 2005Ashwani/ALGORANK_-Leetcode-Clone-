const express = require('express')
const authRouter = express.Router();
const { register, login, logout, getProfile, forgetPassword, adminRegister, deleteProfile, editProfile } = require("../controllers/userAuthonticate");


const userMiddleware = require("../middleware/UserMiddleware")
const adminMiddleware = require("../middleware/adminMiddleware")

const { saveImageMetadata, generateUploadSignature } = require("../controllers/photoSection")



// Register
authRouter.post("/register", register)
// login
authRouter.post("/login", login)

// logout
authRouter.post("/logout", userMiddleware, logout)

// getInfo
authRouter.get("/getProfile", userMiddleware, getProfile)

// ForgetPassword
authRouter.post("/forgetPassword", forgetPassword)

// admin register
authRouter.post("/admin/register", adminMiddleware, adminRegister)

// Delete Profile
authRouter.delete("/deleteProfile", adminMiddleware, deleteProfile)

// To Get Detail After login
authRouter.get("/check", userMiddleware, (req, res) => {
    const reply = {
        firstName: req.result.firstName,
        email: req.result.email,
        _id: req.result._id,
        role: req.result.role,
    }

    res.status(200).json({
        user: reply,
        message: "User Authenticated"
    })
});

// Edit Profile 
authRouter.post("/edit", userMiddleware, editProfile)

authRouter.get("/uploadImage", userMiddleware, generateUploadSignature);
authRouter.post("/saveImage", userMiddleware, saveImageMetadata);
// Get




module.exports = authRouter
