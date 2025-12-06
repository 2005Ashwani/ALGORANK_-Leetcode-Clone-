const User = require("../models/user")
const validate = require("../utils/Validator")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const redisClient = require("../config/Redis");
const submission = require("../models/Submission")

const Recovery = require("../models/Recovery")

const register = async (req, res) => {
    try {
        validate(req.body)
        const { firstName, email, password } = req.body;

        req.body.password = await bcrypt.hash(password, 10)

        // Koi vi as a user hi add hoga
        req.body.role = "user"

        const createdUser = await User.create(req.body)

        const token = jwt.sign({ _id: createdUser._id, email: email, role: createdUser.role }, process.env.JWT_Token, { expiresIn: 60 * 60 }); // 1 hours  // Second

        // Setting the cookies
        res.cookie('token', token, { maxAge: 60 * 60 * 1000, httpOnly: true })  // valid for 1 Hours  // millisecond

        // Sending data to the user
        const reply = {
            firstName: createdUser.firstName,
            email: createdUser.email,
            role: createdUser.role,
            _id: createdUser._id,
        }

        // Sending Info
        res.status(201).json({
            user: reply,
            message: "SignUp  Successfully"
        })
    } catch (error) {
        res.status(400).send("Error " + error);

    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email) {
            throw new Error("Invalid Credentials");

        }
        if (!password) {
            throw new Error("Invalid Credentials");

        }
        const user = await User.findOne({ email })
        if (!user) {
            throw new Error("Invalid Credentials");
        }
        const match = await bcrypt.compare(password, user.password)
        if (!match) {
            throw new Error("Invalid Credentials");

        }

        // Sending data to the user
        const reply = {
            firstName: user.firstName,
            email: user.email,
            role: user.role,
            _id: user._id,
            role: user.role,
            profileImage:user.profileImage,
        }


        const token = jwt.sign({ _id: user._id, email: email, role: user.role }, process.env.JWT_Token, { expiresIn: 60 * 60 }); // 1 hours  // Second

        // Setting the cookies
        res.cookie('token', token, { maxAge: 60 * 60 * 1000, httpOnly: true })  // valid for 1 Hours  // millisecond

        // Sending Info
        res.status(200).json({
            user: reply,
            message: "Login In Successfully"
        })
    } catch (error) {
        res.status(401).send("Error " + error)
    }
}

const logout = async (req, res) => {
    try {

        // Validate the token ( Validate kar chuka hai )
        const { token } = req.cookies;


        const payload = jwt.decode(token)   // payload ko  nikalana hai



        // Token add kar dung Redis ke blocklist
        await redisClient.set(`token:${token}`, "Blocked")   // ("Name_Jo_Rakhana_Ho":"Jis_name_sai_save","Value_set",expiry_Date)

        await redisClient.expireAt(`token:${token}`, payload.exp) // itna time tak hi rakhana 


        // Cookies ko clear kar dena
        res.cookie("token", null, { expires: new Date(Date.now()) });
        res.status(200).send("Logout In Successfully")

    } catch (error) {
        res.status(503).send("Error " + error)

    }

}

const forgetPassword = async (req, res) => {

    const body = req.body
    console.log(body)

}

const getProfile = async (req, res) => {
    try {
        if (!req.result) {
            return res.status(404).json({ message: "Profile not found." });
        }

        // Destructure and select only the fields you want to expose
        const { firstName, lastName, email, role, age ,problemSolved,profileImage,_id} = req.result;

        // Create a new object with the selected fields
        const profileData = {
            firstName,
            lastName,
            email,
            role,
            age,
            problemSolved,
            profileImage,
            _id
        };

        // Send the new, sanitized object as a JSON response
        res.status(200).json(profileData);
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};
const adminRegister = async (req, res) => {
    try {
        validate(req.body)
        const { firstName, email, password } = req.body;

        req.body.password = await bcrypt.hash(password, 10)
        // Force role to admin for this endpoint
        req.body.role = 'admin';

        const createdUser = await User.create(req.body)

        // Do not switch the current admin's session. Return the created admin data instead.
        const reply = {
            firstName: createdUser.firstName,
            email: createdUser.email,
            role: createdUser.role,
            _id: createdUser._id,
        };

        res.status(201).json({
            user: reply,
            message: "Admin registered successfully"
        })
    } catch (error) {
        res.status(400).send("Error " + error);

    }

}

const deleteProfile = async (req, res) => {
    try {

        const userId = req.result.userId;

        // Deleted From user Schema
        await User.findByIdAndDelete(userId);

        // // Delete from Submission
        // await submission.deleteMany({ userId: userId })

        res.status(200).send("Profile Deleted Successfully");


    } catch (error) {
        res.status(500).send("Internal server Error " + error)
    }
}



// editProfile
const editProfile = async (req, res) => {
  try {
    let { firstName, lastName, age, email, role, profileImage } = req.body;
    const userId = req.result._id;

    if (!userId) {
      return res.status(400).json({ message: "Missing user ID" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (age) user.age = age;
    if (email) user.email = email;
    if (role) user.role = role;
    if (profileImage) user.profileImage = profileImage; 

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      age: user.age,
      profileImage: user.profileImage, 
    });
  } catch (error) {
    console.error("Edit profile error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};







// module.exports = editProfile;


module.exports = { register, login, logout, getProfile, forgetPassword, adminRegister, deleteProfile, editProfile }