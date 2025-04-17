const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const revokedTokens = new Set();

// Middleware to check for revoked tokens
const checkRevokedToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log(token);
  if (revokedTokens.has(token)) {
    return res.status(401).json({ message: "Token has been revoked" });
  }
  next();
};

router.post("/", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    revokedTokens.add(token);
    res.status(200).json({ message: "Successfully logged out" });
  } else {
    res.status(400).json({ message: "No token provided" });
  }
});
module.exports = router;
