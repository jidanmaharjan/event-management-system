const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  expireAt: {
    type: Date,
    default: Date.now(),
    index: { expireAfterSeconds: 120 },
  },
});

module.exports = mongoose.model("Otp", otpSchema);
