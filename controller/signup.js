const express = require("express");
const bcrypt = require("bcrypt");
// const user = require("../models/signup");
const crypto = require("crypto");
const User = require("../models/userModel"); // Import the User model
const router = express.Router();
require("dotenv").config();
const mailer = require("../service/mailer");
// const nodemailer = require("nodemailer");

// // Configure Nodemailer for sending OTP emails
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS, // Use an App Password if needed
//   },
// });

const transporter = mailer.transporter;

// Generate OTP
const generateOTP = () => crypto.randomInt(100000, 999999).toString();

// GET all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new user
router.post("/", async (req, res) => {
  const { fullName, email, password } = req.body;

  // const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const usersEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: usersEmail });

    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 30 * 60 * 1000); // OTP expires in 30 minutes

    if (existingUser) {
      // Update OTP if the user already exists but is not verified
      existingUser.otp = otp;
      existingUser.otpExpires = otpExpires;
      existingUser.password = hashedPassword; // Update password if changed
      await existingUser.save();
    } else {
      // Create a new user entry with OTP
      await User.create({
        fullName,
        email: usersEmail,
        password: hashedPassword,
        isVerified: false,
        otp,
        otpExpires,
      });
    }

    // Send OTP via email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: usersEmail,
      subject: "Verify Your Email - Budget Tracker",
      html: `
        <p>Hello <strong>${fullName}</strong>,</p>
        <p>Your verification code is: <strong>${otp}</strong></p>
        <p>This OTP will expire in <strong>30 minutes</strong>.</p>
        <p>If you did not request this, please ignore this email.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "OTP sent successfully. Please verify your email.",
      status: "Success",
    });
  } catch (err) {
    console.error("Error requesting OTP:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
