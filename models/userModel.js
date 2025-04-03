const mongoose = require("mongoose");

// Define the user schema
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    resetToken: {
      type: String, // Stores the password reset token
      default: null,
    },
    resetTokenExpiry: {
      type: Date, // Expiration time for the reset token
      default: null,
    },
    otp: {
      type: Number,
      required: false,
    },
    otpExpires: {
      type: Date,
      required: false, // Expiry time only exists when an OTP is generated
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Create a model using the schema
const User = mongoose.model("User", userSchema);

module.exports = User;
