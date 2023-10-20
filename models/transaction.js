const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  transactionId: Number,
  payer: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  payee: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Trader' }],
  paymentAmount: Number,
  paymentDate: Date,
  isSuccessful: Boolean,
});

const PaymentTransaction = mongoose.model('Transaction', transactionSchema);

module.exports = PaymentTransaction;
