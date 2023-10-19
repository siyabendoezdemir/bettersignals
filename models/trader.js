const mongoose = require('mongoose');

const traderSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  pricingOptions: [
    {
      pricePerWin: Number,
      // Other pricing-related fields can be added here
    },
  ],
  subscribers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  // Add other user-related fields here
});

const Trader = mongoose.model('Trader', traderSchema);

module.exports = Trader;
