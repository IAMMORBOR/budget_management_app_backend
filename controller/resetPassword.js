const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/userModel"); // Import the User model
const router = express.Router();
require("dotenv").config(); // Load environment variables

const fs = require("fs");
const path = require("path");

const emailTemplatePath = path.join(
  __dirname,
  "/templates/changedPassword.html"
);

// Function to read and replace placeholders in the email template
const getEmailTemplate = (fullName, loginUrl) => {
  let emailTemplate = fs.readFileSync(emailTemplatePath, "utf8");
  emailTemplate = emailTemplate.replace("{{fullName}}", fullName);
  emailTemplate = emailTemplate.replace("{{loginUrl}}", loginUrl);
  return emailTemplate;
};

const loginUrl = "http://localhost:8080/auth";

// POST: Reset Password (Step 2)
router.post("/", async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res
      .status(400)
      .json({ message: "Token and new password are required" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the token is expired
    if (user.resetToken !== token || Date.now() > user.resetTokenExpiry) {
      return res.status(400).json({ message: "Token is invalid or expired" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Clear the reset token fields
    user.resetToken = null;
    user.resetTokenExpiry = null;

    await user.save();

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
      to: user.email,
      subject: "Password Reset successful",
      html: getEmailTemplate(user?.fullName, loginUrl),
    };
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message:  "Password Reset Successful! Your password has been updated. You can now log in with your new password." });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Invalid or expired token" });
  }
});
module.exports = router;
