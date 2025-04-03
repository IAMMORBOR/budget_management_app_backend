const express = require("express");
const User = require("../models/userModel"); // Import the User model
const router = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();
const createWallet = require("./wallet/createWallet");

// GET all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  const { email, otp } = req.body;

  console.log("===OTP====", otp);

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  try {
    const user = await User.findOne({ email });
    console.log("===USER===", user);
    console.log("===USER OTP===", user.otp);

    if (!user) {
      console.log("===USER NOT FOUND===", user);
      return res.status(400).json({ message: "Invalid email or OTP" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    if (user.otp !== otp || user.otpExpires.getTime() < Date.now()) {
      console.log("===USER OTPSSSS===", user.otp, otp);
      console.log("GET TYPE", typeof user.otp, typeof otp);
      console.log(
        "===USER OTP EXPIRES===",
        user.otpExpires.getTime() < Date.now()
      );
      return res.status(400).json({ message: "Invalid or expired OTPddddd" });
    }

    // Mark user as verified
    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    // Create a wallet for the user
    await createWallet(user._id, user.fullName);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Email verified successfully!",
      token,
      user: {
        fullName: user.fullName,
        email: user.email,
        id: user._id,
      },
    });
  } catch (err) {
    console.error("OTP verification error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
