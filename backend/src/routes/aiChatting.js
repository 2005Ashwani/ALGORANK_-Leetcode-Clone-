const express = require('express');
const userMiddleware = require('../middleware/UserMiddleware');
const {solveDout,AlgoSnapAI} = require("../controllers/solveDout")

const aiRouter = express.Router();

aiRouter.post("/chat",userMiddleware,solveDout)     // This is for algoRank
aiRouter.post("/AlgoSnap",userMiddleware,AlgoSnapAI)     // This is for algoRank

module.exports=aiRouter