
const express = require('express');
const userMiddleware = require('../middleware/UserMiddleware');

const {payment,getkey,getPaymentHistory}=require("../controllers/payment");
const paymentMiddleware = require('../middleware/PaymentMiddleware');

const paymentIntegration = express.Router();

paymentIntegration.post("/money",userMiddleware,payment)     // This is used to Integrate the payment


paymentIntegration.get("/getAPI",userMiddleware,getkey) 

paymentIntegration.get("/paymentHistory",userMiddleware,paymentMiddleware,getPaymentHistory)

module.exports=paymentIntegration