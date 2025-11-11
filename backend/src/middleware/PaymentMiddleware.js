const paymentstore = require('../models/StorePayment');



const paymentMiddleware = async (req, res, next) => {
    try {

        const userId = req.result._id;

        // If the user is not present
        if (!userId) {
            res.status(400).json({ error: 'Please Register Yourself First' });
        }


        //  to get the payment history of the user
        const validPayment = await paymentstore.find({ paymentCreator: userId })


        //  If the payment history is not present
        if (!validPayment || validPayment.length === 0) {
            return res.status(404).json({ error: "No Payment History Found" })
        }


        req.validPayment = validPayment[0]; // Pass the first payment object

        next();


    } catch (error) {
        res.status(401).send("Error " + error.message)

    }


}



module.exports = paymentMiddleware