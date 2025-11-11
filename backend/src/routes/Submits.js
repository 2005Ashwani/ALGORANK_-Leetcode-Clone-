const userMiddleware = require("../middleware/UserMiddleware")
const { SubmitCode, runCode ,getSubmittedCode} = require("../controllers/SubmitCode")

const express = require('express')

const submitRouter = express.Router();

submitRouter.post("/submit/:id", userMiddleware, SubmitCode)

submitRouter.post("/run/:id", userMiddleware, runCode)

submitRouter.get("/getSubmittedProblem", userMiddleware, getSubmittedCode)

module.exports = submitRouter;


