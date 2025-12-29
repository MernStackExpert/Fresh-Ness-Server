const stripe = require("../config/stripe");

const createPaymentIntent = async (req, res) => {
  try {
    const { total, currency = "USD", email } = req.body;

    if (!total || !email) {
      return res.status(400).send({ message: "Total amount and email are required" });
    }

    // 1️⃣ Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100), // Stripe expects amount in cents
      currency,
      receipt_email: email,           // email to send Stripe receipt
      metadata: { integration_check: "accept_a_payment" },
    });

    // 2️⃣ Send client secret to frontend
    res.status(200).send({
      clientSecret: paymentIntent.client_secret,
    });

  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Payment initiation failed", error });
  }
};

module.exports = createPaymentIntent;
