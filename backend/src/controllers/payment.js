const Razorpay = require('razorpay');
const dotenv = require('dotenv');
const PaymentKundli = require('../models/StorePayment')

const user = require('../models/user')

// Me


dotenv.config();

// Initialize Razorpay instance only if keys are available
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});


// Payment BY Razorpay
const payment = async (req, res) => {
  try {
    if (!razorpay) {
      return res.status(500).json({ error: 'Error in configure Razorpay' });
    }

    // Getting the Amount from the backend
    const { currency = 'INR', subscriptionType } = req.body;

    // To get UserId from the user Middleware
    const userId = req.result._id;


    if (!subscriptionType & subscriptionType !== "year" && subscriptionType !== "month") {
      return res.status(400).json({ error: 'Please select the valid Subscription' });
    }

    if (subscriptionType == "year") {
      amount = 2000
    }

    else if (subscriptionType == "month") {
      amount = 1000
    }


    const options = {
      amount: amount * 100, // Razorpay expects amount in paisa
      currency,
      receipt: `receipt_${Date.now()}`,
    };

    const paymentHistory = await razorpay.orders.create(options);

    if (!userId) {
      res.status(400).json({ error: 'Please Register Yourself First' });
    }

    const userDetails = await user.findById(userId)
    if (!userDetails._id) {
      return res.status(404).json({ error: "Please Register Yourself First" })
    }




    const reply = {
      status: paymentHistory.status,
      amount: paymentHistory.amount,
      subscriptionType: subscriptionType,
      currency: paymentHistory.currency,
      payment_ID: paymentHistory.id,
      order_ID: paymentHistory.receipt,
      paymentCreator: userDetails._id,
    }


    await PaymentKundli.create(reply)





    res.json({
      success: true,
      paymentHistory,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ error: error.message });
  }
};



// To get the API KEY
const getkey = async (req, res) => {
  try {
    res.status(200).json({
      key: process.env.RAZORPAY_API_KEY
    })

  } catch (error) {
    res.status(500).send("Error in backend Payment Rzorpay..... " + error)
  }
}


// To get the Payment History of the user
const getPaymentHistory = async (req, res) => {
  try {


    // To get UserId from the user Middleware
    // const userId = req.validPayment;
    // console.log(userId)
    // res.status(200).json(userId)




  } catch (error) {
    res.status(500).send("History: " + error)
  }
}

module.exports = { payment, getkey, getPaymentHistory };
