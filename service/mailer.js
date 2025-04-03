require("dotenv").config();
const nodemailer = require("nodemailer");

// Configure Nodemailer for sending OTP emails
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Use an App Password if needed
  },
});

module.exports = { transporter };
