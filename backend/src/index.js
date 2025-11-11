const express = require("express");
const app = express();
require('dotenv').config();
const main = require('./config/db');
const userRoutes = require('./routes/userAuthontication');
const problemRouter = require('./routes/ProblemCreator');
const submitRouter = require("./routes/Submits");
const cookieParser = require('cookie-parser');
const redisClient = require("./config/Redis");
const videoRouter = require("./routes/videoCreater");
const aiRouter = require("./routes/aiChatting");
const User = require("./models/user");
const cors = require("cors");
const paymentIntegration = require("./routes/paymentIntegration");

// --- START: UPDATED CORS CONFIGURATION ---
// Add your deployed frontend's URL here
const allowedOrigins = [
  'https://leetcodes-5.onrender.com',               // Your local dev frontend
  'https://your-live-frontend-url.com'   // <--- REPLACE THIS with your deployed frontend URL
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman, mobile apps, or server-to-server)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true, // Allow cookies
}));
// --- END: UPDATED CORS CONFIGURATION ---


app.use(express.json());
app.use(cookieParser());


// --- START: NEW ROOT ROUTE ---
// Handles GET requests to the base URL (/)
app.get("/", (req, res) => {
    res.json({ message: "Welcome to the Leetcodes API! Server is running." });
});
// --- END: NEW ROOT ROUTE ---


app.use("/auth", userRoutes);
app.use("/problem", problemRouter);
app.use("/submission", submitRouter);
app.use("/video", videoRouter);
app.use("/ai", aiRouter);
app.use("/paymentIntegration", paymentIntegration);


// One-time index fix to drop unintended unique indexes that block registrations
const fixUserIndexes = async () => {
    try {
        // Ensure collection exists
        if (!User.collection) return;
        const indexes = await User.collection.indexes();
        const hasProfileImageUnique = indexes.some((ix) => ix.name === 'profileImage_1');
        if (hasProfileImageUnique) {
            try {
                await User.collection.dropIndex('profileImage_1');
                console.log('Dropped index: profileImage_1');
            } catch (e) {
                console.log('Could not drop profileImage_1:', e.message);
            }
        }
        // Also drop accidental unique index on problemSolved if it exists
        const hasProblemSolvedUnique = indexes.some((ix) => ix.name === 'problemSolved_1');
        if (hasProblemSolvedUnique) {
            try {
                await User.collection.dropIndex('problemSolved_1');
                console.log('Dropped index: problemSolved_1');
            } catch (e) {
                console.log('Could not drop problemSolved_1:', e.message);
            }
        }
    } catch (err) {
        console.log('Index inspection error:', err.message);
    }
}


const initialConnection = async () => {
    try {

        await Promise.all([redisClient.connect(), main()])
        console.log("Connected to DataBase and Redis")

        // Drop unintended unique indexes if present
        await fixUserIndexes();

        // Connecting to Port Number
        app.listen(process.env.PORT, () => {
            // Use PORT from environment variables, default to 3000 if not set
            const port = process.env.PORT || 3000;
            console.log(`Listening at port ${port}`);
        })

    } catch (error) {
        console.log("Error " + error)
    }
}

initialConnection();
