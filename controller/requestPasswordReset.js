const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/userModel"); // Import the User model
const router = express.Router();
require("dotenv").config(); // Load environment variables

const fs = require("fs");
const path = require("path");

const emailTemplatePath = path.join(__dirname, "/templates/emailTemplate.html");

// Function to read and replace placeholders in the email template
const getEmailTemplate = (fullName, resetLink) => {
  let emailTemplate = fs.readFileSync(emailTemplatePath, "utf8");
  emailTemplate = emailTemplate.replace("{{fullName}}", fullName);
  emailTemplate = emailTemplate.replace("{{resetLink}}", resetLink);
  return emailTemplate;
};

// POST: Request Password Reset (Step 1)
router.post("/", async (req, res) => {
  const email = req.body.email.trim().toLowerCase();

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    console.log("===user===", user);

    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    // Generate a reset token (valid for 1 hour)
    const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Store token in user model (optional, depends on how you verify)
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour expiry
    await user.save();

    // Send email with the reset link
    const resetLink = `http://localhost:3000/auth/reset-password/${resetToken}`;

    // Configure nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail", // or use SMTP
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      html: getEmailTemplate(user?.fullName, resetLink),
    };
    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "Password reset link sent to your email",
    });
  } catch (err) {
    console.error("Error occurred:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
