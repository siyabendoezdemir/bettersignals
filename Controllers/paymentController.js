const stripe = require("stripe")(process.env.STRIPE_SECRET);
const User = require("../models/user");

exports.ping = async (req, res) => {
  res.status(200).json({ message: "Server is responsive!" });
};

exports.checkout = async (req, res) => {
  const { traderId } = req.params;

  if (!req.isAuthenticated()) {
    return res.status(500).json({ error: "Unauthorized" });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: "price_1O3ImAHLuadCV9CoWl5roo4D",
      },
    ],
    success_url: `http://localhost:3000/user/dashboard?subscription=success&traderId=${traderId}`,
    cancel_url: "http://localhost:3000/user/dashboard",
  });

  res.json({ checkoutURL: session.url });
};
