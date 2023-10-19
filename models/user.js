const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  subscribedTraders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Trader' }],
  // Add other user-related fields here
});

// Method to compare hashed passwords
userSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
