const express = require("express");
const app = express();
require("dotenv").config();
const main = require("./config/db");
const userRoutes = require("./routes/userAuthontication");
const problemRouter = require("./routes/ProblemCreator");
const submitRouter = require("./routes/Submits");
const cookieParser = require("cookie-parser");
const redisClient = require("./config/Redis");
const videoRouter = require("./routes/videoCreater");
const aiRouter = require("./routes/aiChatting");
const User = require("./models/user");
const paymentIntegration = require("./routes/paymentIntegration");

const cors = require("cors");

// ----------------------------
// FIX CORS FOR RENDER
// ----------------------------

const allowedOrigins = [
  "http://localhost:5173",
  "https://leetcode-backend-2-frontend.onrender.com"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


// ----------------------------

app.use(express.json());
app.use(cookieParser());

app.use("/auth", userRoutes);
app.use("/problem", problemRouter);
app.use("/submission", submitRouter);
app.use("/video", videoRouter);
app.use("/ai", aiRouter);
app.use("/paymentIntegration", paymentIntegration);

// ----------------------------
// Fix accidental Mongo indexes
// ----------------------------

const fixUserIndexes = async () => {
  try {
    if (!User.collection) return;

    const indexes = await User.collection.indexes();

    const hasProfileImageUnique = indexes.some(
      (ix) => ix.name === "profileImage_1"
    );

    if (hasProfileImageUnique) {
      try {
        await User.collection.dropIndex("profileImage_1");
        console.log("Dropped index: profileImage_1");
      } catch (e) {
        console.log("Could not drop profileImage_1:", e.message);
      }
    }

    const hasProblemSolvedUnique = indexes.some(
      (ix) => ix.name === "problemSolved_1"
    );

    if (hasProblemSolvedUnique) {
      try {
        await User.collection.dropIndex("problemSolved_1");
        console.log("Dropped index: problemSolved_1");
      } catch (e) {
        console.log("Could not drop problemSolved_1:", e.message);
      }
    }
  } catch (err) {
    console.log("Index inspection error:", err.message);
  }
};

// ----------------------------
// Start server
// ----------------------------

const initialConnection = async () => {
  try {
    await Promise.all([redisClient.connect(), main()]);
    console.log("Connected to DataBase and Redis");

    await fixUserIndexes();

    app.listen(process.env.PORT, () => {
      console.log("Listening at port " + process.env.PORT);
    });
  } catch (error) {
    console.log("Error " + error);
  }
};

initialConnection();
