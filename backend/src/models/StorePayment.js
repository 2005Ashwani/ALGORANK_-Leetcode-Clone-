const mongoose = require("mongoose");
const { Schema } = mongoose;

const paymentSchema = new Schema(
    {

        paymentCreator: {
            type: Schema.Types.ObjectId,  // to give the user ID
            ref: "user",
            required: true,

        },


        status: {
            type: String,
            enum: ["Pending", "created", "Failed"],
            default: "Pending",
        },
        amount: {
            type: Number,
            required: true,
        },
        subscriptionType: {
            type: String,
            enum: ["year", "month"],
            required: true,
        },
        currency: {
            type: String,
            default: "INR",
            required: true,
        },
        payment_ID: {
            type: String, // Payment IDs from gateways (Razorpay, Stripe, etc.) are alphanumeric
        },
        order_ID: {
            type: String,
            required: true,
        },
    
    },
    { timestamps: true }
);

const PaymentKundli = mongoose.model("Payment", paymentSchema);
module.exports = PaymentKundli;
