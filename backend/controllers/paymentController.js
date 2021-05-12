const catchAsyncErrors = require("../middlewares/catch-async-errors");

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Process stripe payments   =>   /api/v1/payment/process
exports.processPayment = catchAsyncErrors(async (req, res, next) => {
    console.log(req.body.amount)
    const paymentIntent = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: 'usd',
        payment_method_types: ['card'],
        metadata: { integration_check: 'accept_a_payment' }
    },{
        apiKey: process.env.STRIPE_API_KEY,
    });

    res.status(200).json({
        success: true,
        client_secret: paymentIntent.client_secret
    })

})

// Send stripe API Key   =>   /api/v1/stripeapi
exports.sendStripApi = catchAsyncErrors(async (req, res, next) => {

    res.status(200).json({
        stripeApiKey: process.env.STRIPE_Publishable_API_KEY
    })

})