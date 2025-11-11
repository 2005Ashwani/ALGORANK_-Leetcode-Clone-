const express = require('express')
const problemRouter = express.Router();
const { CreateProblem, UpdateProblem, DeleteProblem, ProblemById ,getAllProblem,solvedAllProblemByUser,submittedProblem} = require("../controllers/problemCreator")
const adminMiddleware = require("../middleware/adminMiddleware")
const userMiddleware = require("../middleware/UserMiddleware")


// Register

// Need Admin Access
// create problem 
problemRouter.post("/create", adminMiddleware, CreateProblem)


// create update
problemRouter.put("/update/:id", adminMiddleware, UpdateProblem)

// create delete
problemRouter.delete("/delete/:id", adminMiddleware, DeleteProblem)// ok

// create fetch
problemRouter.get("/problemById/:id", userMiddleware, ProblemById)   // ok

// create fetch All the problem
problemRouter.get("/getAllProblem", userMiddleware, getAllProblem) // ok

// Abhi tak kon kon si problem solve kiya hai
problemRouter.get("/problemSolvedByUser", userMiddleware, solvedAllProblemByUser)


problemRouter.get("/submittedProblem/:pid", userMiddleware, submittedProblem)





module.exports = problemRouter

